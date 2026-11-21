/**
 * @file audio/alphabetteAudio.ts
 * Lecteur audio UNIQUE de l'écosystème Alphabette (même voix « Kore » partout).
 *
 *   import { alphabetteAudio } from '@alphabette/shell';
 *   alphabetteAudio.basculer(texte, 'fiche-12');   // dans un gestionnaire de clic
 *   alphabetteAudio.stop();
 *
 * Source de la voix, dans l'ordre (tout est gratuit, aucun serveur n'est nécessaire) :
 *   1. bibliothèque Alphabette : texte déjà enregistré en voix « Kore » (MP3 sur alphabette.fr/voix/) ;
 *   2. route serveur POST /api/alphabette/tts, si un jour un serveur existe ;
 *   3. clé Gemini du visiteur (réglages IA de la base), appel direct à Google, gardé en cache ;
 *   4. meilleure voix de l'appareil (voix naturelles / Google / Microsoft / Apple en priorité, fr-FR, 0,94).
 * Lecture : AudioContext sans blanc entre les morceaux → sinon <audio> (Blob WAV) → sinon voix du téléphone.
 */
import { lireChaineIA } from '../ia/routeurByok';
import { morceauxAPrononcer } from './preparerTexte';
import { base64VersOctets, garantirWav, ttsGeminiDirect } from './voixGemini';
import { chargerIndexBibliotheque, empreinteVoix, enregistrementsDisponibles } from './bibliotheque';
import { preparerTexte } from './preparerTexte';

export type EtatAudio = 'repos' | 'preparation' | 'lecture';
export interface InstantaneAudio {
  etat: EtatAudio;
  /** Identifiant de l'élément qui lit (bouton, fiche…), ou null. */
  proprietaire: string | null;
}

/** Identifiant réservé au bouton haut-parleur de la barre. */
export const ID_BARRE = 'ab-barre';

const DELAI_SERVEUR_MS = 15000;
const TAILLE_CACHE = 50;
const AVANCE = 2;

declare global {
  interface Window {
    /** Adresse de la route TTS (par défaut /api/alphabette/tts). */
    ALPHABETTE_TTS_URL?: string;
    webkitAudioContext?: typeof AudioContext;
  }
}

interface OptionsLecture {
  /** Appelé quand la lecture se termine normalement (pas lors d'un arrêt). */
  onFin?: () => void;
  onDebut?: () => void;
  langue?: 'fr' | 'en';
}

type Source = 'serveur' | 'cle' | 'aucune';

class LecteurAlphabette {
  private sessionId = 0;
  private ctx: AudioContext | null = null;
  private sources = new Set<AudioBufferSourceNode>();
  private elementAudio: HTMLAudioElement | null = null;
  private controleur: AbortController | null = null;
  private cache = new Map<string, Uint8Array>();
  private abonnes = new Set<() => void>();
  private instantane: InstantaneAudio = { etat: 'repos', proprietaire: null };
  private serveurAbsent = false;
  constructor() {
    if (typeof window !== 'undefined') {
      void chargerIndexBibliotheque();
      // Site statique (OVH) : pas de route serveur. On ne la tente que si une page la déclare.
      this.serveurAbsent = !window.ALPHABETTE_TTS_URL && !/^(localhost|127\.0\.0\.1)$/.test(location.hostname);
    }
  }
  /** Fonctions d'origine de speechSynthesis (la passerelle peut les remplacer). */
  speakOrigine: ((u: SpeechSynthesisUtterance) => void) | null = null;
  cancelOrigine: (() => void) | null = null;

  /* ------------------------------------------------------------ État */
  abonner = (f: () => void) => {
    this.abonnes.add(f);
    return () => void this.abonnes.delete(f);
  };
  lireEtat = (): InstantaneAudio => this.instantane;
  private poser(etat: EtatAudio, proprietaire: string | null) {
    if (this.instantane.etat === etat && this.instantane.proprietaire === proprietaire) return;
    this.instantane = { etat, proprietaire };
    this.abonnes.forEach((f) => f());
    try {
      window.dispatchEvent(new CustomEvent('alphabette:audio', { detail: this.instantane }));
    } catch { /* rien */ }
  }
  get actif() {
    return this.instantane.etat !== 'repos';
  }

  /* ------------------------------------------------------- Commandes */
  /**
   * Bascule : arrête si cet élément lit déjà (ou si c'est le bouton de la barre et qu'une lecture
   * est en cours n'importe où), sinon lance la lecture. À appeler dans un clic.
   */
  basculer(texte: string, id: string = ID_BARRE, options?: OptionsLecture) {
    if (this.actif && (id === ID_BARRE || this.instantane.proprietaire === id)) {
      this.stop();
      return false;
    }
    this.play(texte, id, options);
    return true;
  }

  /** Lance la lecture (arrête toute lecture précédente). À appeler de préférence dans un clic. */
  play(texte: string, id: string = ID_BARRE, options: OptionsLecture = {}) {
    this.arreterTout();
    const session = ++this.sessionId;
    // Déverrouillage mobile / iframe : AudioContext créé et repris DANS le clic, avant tout await.
    this.deverrouiller();
    const morceaux = morceauxAPrononcer(texte);
    if (!morceaux.length) {
      this.poser('repos', null);
      return;
    }
    this.controleur = new AbortController();
    this.poser('preparation', id);

    // 1. Déjà enregistré dans la bibliothèque : lecture immédiate du MP3 (élément créé dans le clic).
    const enregistrements = enregistrementsDisponibles(texte);
    if (enregistrements) {
      void this.jouerBibliotheque(session, id, enregistrements, morceaux, options);
      return;
    }
    // 2-3. Ni serveur ni clé : inutile d'attendre, la voix de l'appareil démarre tout de suite.
    if (this.serveurAbsent && !this.cleGemini()) {
      this.poser('lecture', id);
      options.onDebut?.();
      void this.parlerTelephone(morceaux, session, options.langue).then(() => {
        if (session !== this.sessionId) return;
        this.poser('repos', null);
        options.onFin?.();
      });
      return;
    }
    void this.derouler(session, id, morceaux, this.controleur.signal, options);
  }

  /** Arrêt immédiat de tout (requêtes, sons, voix du téléphone). */
  stop() {
    this.sessionId++;
    this.arreterTout();
    this.poser('repos', null);
  }

  /* ---------------------------------------------------------- Interne */
  private deverrouiller() {
    if (typeof window === 'undefined') return;
    try {
      const Ctor = window.AudioContext ?? window.webkitAudioContext;
      if (!Ctor) return;
      if (!this.ctx || this.ctx.state === 'closed') this.ctx = new Ctor();
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      // Un tampon muet joué dans le geste achève le déverrouillage sur Safari iOS.
      const muet = this.ctx.createBuffer(1, 1, 22050);
      const s = this.ctx.createBufferSource();
      s.buffer = muet;
      s.connect(this.ctx.destination);
      s.start(0);
    } catch {
      this.ctx = null;
    }
  }

  private arreterTout() {
    this.controleur?.abort();
    this.controleur = null;
    this.sources.forEach((s) => {
      try {
        s.onended = null;
        s.stop();
      } catch { /* déjà fini */ }
    });
    this.sources.clear();
    if (this.elementAudio) {
      try {
        this.elementAudio.pause();
        this.elementAudio.src = '';
      } catch { /* rien */ }
      this.elementAudio = null;
    }
    try {
      (this.cancelOrigine ?? (() => window.speechSynthesis?.cancel()))();
    } catch { /* rien */ }
  }

  private memoriser(cle: string, octets: Uint8Array) {
    this.cache.delete(cle);
    this.cache.set(cle, octets);
    while (this.cache.size > TAILLE_CACHE) this.cache.delete(this.cache.keys().next().value as string);
  }

  private cleGemini(): string | null {
    try {
      return lireChaineIA().find((m) => m.fournisseur === 'gemini' && m.cle)?.cle ?? null;
    } catch {
      return null;
    }
  }

  /** Obtient le WAV d'un morceau (cache → serveur → clé du visiteur). null = pas de voix Gemini. */
  private async obtenir(texte: string, signal: AbortSignal): Promise<{ octets: Uint8Array | null; source: Source }> {
    const enCache = this.cache.get(texte);
    if (enCache) {
      this.memoriser(texte, enCache);
      return { octets: enCache, source: 'serveur' };
    }
    if (!this.serveurAbsent) {
      const minuteur = new AbortController();
      const delai = setTimeout(() => minuteur.abort(), DELAI_SERVEUR_MS);
      const relais = () => minuteur.abort();
      signal.addEventListener('abort', relais);
      try {
        const r = await fetch(window.ALPHABETTE_TTS_URL || '/api/alphabette/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: texte }),
          signal: minuteur.signal,
        });
        const type = r.headers.get('content-type') || '';
        if (!r.ok || !type.includes('json')) {
          if (r.status === 404 || r.status === 405 || !type.includes('json')) this.serveurAbsent = true;
        } else {
          const json = (await r.json()) as { fallback?: boolean; audioBase64?: string | null; mimeType?: string };
          if (!json.fallback && json.audioBase64) {
            const octets = garantirWav(base64VersOctets(json.audioBase64), json.mimeType);
            this.memoriser(texte, octets);
            return { octets, source: 'serveur' };
          }
        }
      } catch {
        if (signal.aborted) throw new DOMException('Arrêt', 'AbortError');
      } finally {
        clearTimeout(delai);
        signal.removeEventListener('abort', relais);
      }
    }
    const garde = await this.cacheDurable(texte);
    if (garde) {
      this.memoriser(texte, garde);
      return { octets: garde, source: 'cle' };
    }
    const cle = this.cleGemini();
    if (cle) {
      const octets = await ttsGeminiDirect(texte, cle, signal);
      if (octets) {
        this.memoriser(texte, octets);
        void this.cacheDurable(texte, octets);
        return { octets, source: 'cle' };
      }
    }
    return { octets: null, source: 'aucune' };
  }

  private async derouler(session: number, id: string, morceaux: string[], signal: AbortSignal, o: OptionsLecture) {
    const enAttente = new Map<number, Promise<{ octets: Uint8Array | null; source: Source }>>();
    const demander = (i: number) => {
      if (i >= morceaux.length || enAttente.has(i)) return;
      const p = this.obtenir(morceaux[i], signal);
      p.catch(() => undefined);
      enAttente.set(i, p);
    };
    const vivant = () => session === this.sessionId;
    let prochainDepart = 0;
    let debutSignale = false;
    const signalerDebut = () => {
      if (debutSignale || !vivant()) return;
      debutSignale = true;
      this.poser('lecture', id);
      o.onDebut?.();
    };

    try {
      for (let i = 0; i < morceaux.length; i++) {
        demander(i);
        for (let k = 1; k <= AVANCE; k++) demander(i + k);
        const { octets } = await enAttente.get(i)!;
        if (!vivant()) return;

        if (!octets) {
          // Plus de voix Gemini : on attend la fin de ce qui est planifié puis la voix du téléphone.
          await this.attendreFinPlanifiee(prochainDepart, session);
          if (!vivant()) return;
          signalerDebut();
          await this.parlerTelephone(morceaux.slice(i), session, o.langue);
          break;
        }

        if (this.ctx) {
          try {
            const tampon = await this.ctx.decodeAudioData(octets.slice().buffer);
            if (!vivant()) return;
            const src = this.ctx.createBufferSource();
            src.buffer = tampon;
            src.connect(this.ctx.destination);
            const depart = Math.max(prochainDepart, this.ctx.currentTime + 0.04);
            src.start(depart);
            prochainDepart = depart + tampon.duration;
            this.sources.add(src);
            src.onended = () => this.sources.delete(src);
            signalerDebut();
            // Ne demande les morceaux suivants qu'au rythme de la lecture.
            await this.attendre(Math.max(0, (depart - this.ctx.currentTime) * 1000 - 50), session);
            continue;
          } catch {
            if (!vivant()) return;
            this.ctx = null; // décodage impossible → repli <audio>
          }
        }
        signalerDebut();
        const ok = await this.jouerElement(octets, session);
        if (!vivant()) return;
        if (!ok) {
          await this.parlerTelephone(morceaux.slice(i), session, o.langue);
          break;
        }
      }
      await this.attendreFinPlanifiee(prochainDepart, session);
      if (!vivant()) return;
      this.poser('repos', null);
      o.onFin?.();
    } catch {
      if (vivant()) this.poser('repos', null);
    }
  }

  /** Lecture des enregistrements de la bibliothèque, l'un après l'autre (repli : voix générée). */
  private jouerBibliotheque(session: number, id: string, urls: string[], morceaux: string[], o: OptionsLecture) {
    const a = new Audio();
    a.preload = 'auto';
    this.elementAudio = a;
    let i = 0;
    const vivant = () => session === this.sessionId;
    const repli = () => {
      if (!vivant()) return;
      this.elementAudio = null;
      void this.derouler(session, id, morceaux, this.controleur?.signal ?? new AbortController().signal, o);
    };
    const suivant = () => {
      if (!vivant()) return;
      if (i >= urls.length) {
        this.elementAudio = null;
        this.poser('repos', null);
        o.onFin?.();
        return;
      }
      a.src = urls[i++];
      a.play().then(() => {
        if (!vivant()) return;
        if (this.instantane.etat !== 'lecture') {
          this.poser('lecture', id);
          o.onDebut?.();
        }
      }).catch(() => (i === 1 ? repli() : suivant()));
    };
    a.onended = suivant;
    a.onerror = () => (i === 1 ? repli() : suivant());
    suivant(); // appelé dans le clic : autorisé sur iOS
  }

  /** Cache durable (Cache Storage) des voix générées avec la clé du visiteur : son quota est préservé. */
  private async cacheDurable(texte: string, octets?: Uint8Array): Promise<Uint8Array | null> {
    try {
      if (typeof caches === 'undefined') return null;
      const c = await caches.open('ab-voix-v1');
      const cle = `https://ab-voix.local/${empreinteVoix(preparerTexte(texte))}`;
      if (octets) {
        await c.put(cle, new Response(octets.slice().buffer, { headers: { 'Content-Type': 'audio/wav' } }));
        return octets;
      }
      const r = await c.match(cle);
      return r ? new Uint8Array(await r.arrayBuffer()) : null;
    } catch {
      return null;
    }
  }

  private attendre(ms: number, session: number) {
    return new Promise<void>((ok) => {
      if (ms <= 0) return ok();
      const t = setTimeout(ok, ms);
      const verif = setInterval(() => {
        if (session !== this.sessionId) {
          clearTimeout(t);
          clearInterval(verif);
          ok();
        }
      }, 100);
      setTimeout(() => clearInterval(verif), ms + 10);
    });
  }

  private attendreFinPlanifiee(fin: number, session: number) {
    if (!this.ctx || fin <= 0) return Promise.resolve();
    return this.attendre((fin - this.ctx.currentTime) * 1000, session);
  }

  private jouerElement(octets: Uint8Array, session: number): Promise<boolean> {
    return new Promise((ok) => {
      try {
        const url = URL.createObjectURL(new Blob([octets.slice().buffer], { type: 'audio/wav' }));
        const a = new Audio(url);
        this.elementAudio = a;
        const fin = (v: boolean) => {
          URL.revokeObjectURL(url);
          ok(v);
        };
        a.onended = () => fin(true);
        a.onerror = () => fin(false);
        a.play().catch(() => fin(false));
        const verif = setInterval(() => {
          if (session !== this.sessionId) {
            clearInterval(verif);
            fin(true);
          }
        }, 150);
        a.addEventListener('ended', () => clearInterval(verif));
        a.addEventListener('error', () => clearInterval(verif));
      } catch {
        ok(false);
      }
    });
  }

  /** Dernier repli : voix du téléphone, fr-FR, vitesse 0,94, voix Google en priorité. */
  private parlerTelephone(morceaux: string[], session: number, langue: 'fr' | 'en' = 'fr'): Promise<void> {
    return new Promise((fin) => {
      const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined;
      if (!synth) return fin();
      const code = langue === 'en' ? 'en-GB' : 'fr-FR';
      let choisie = meilleureVoix(synth.getVoices(), code);
      if (!choisie) {
        // Chrome charge la liste des voix après coup : on la redemande au premier mot.
        synth.addEventListener?.('voiceschanged', () => (choisie = meilleureVoix(synth.getVoices(), code)), { once: true });
      }
      const parler = this.speakOrigine ?? ((u: SpeechSynthesisUtterance) => synth.speak(u));
      const suivant = (i: number) => {
        if (session !== this.sessionId || i >= morceaux.length) return fin();
        const u = new SpeechSynthesisUtterance(morceaux[i]) as SpeechSynthesisUtterance & { __ab?: boolean };
        u.__ab = true;
        u.lang = code;
        u.rate = 0.94;
        const v = choisie ?? meilleureVoix(synth.getVoices(), code);
        if (v) u.voice = v;
        u.onend = () => suivant(i + 1);
        u.onerror = () => fin();
        parler(u);
      };
      suivant(0);
    });
  }
}

/** Le lecteur unique, partagé par toute l'application (et la barre). */
export const alphabetteAudio = new LecteurAlphabette();

/**
 * Choisit la plus belle voix de l'appareil, toujours la même sur un appareil donné :
 * voix « naturelles » (Microsoft Online Natural, Apple Premium/Enhanced, Google réseau) d'abord,
 * voix féminine de préférence (plus proche de « Kore »), voix robotiques (eSpeak) en dernier.
 */
export function meilleureVoix(voix: SpeechSynthesisVoice[], code = 'fr-FR'): SpeechSynthesisVoice | undefined {
  const langue = code.slice(0, 2).toLowerCase();
  const note = (v: SpeechSynthesisVoice) => {
    const n = `${v.name} ${v.voiceURI}`.toLowerCase();
    let s = 0;
    if (v.lang?.replace('_', '-').toLowerCase() === code.toLowerCase()) s += 20;
    if (/natural|neural|online/.test(n)) s += 60; // Microsoft Edge / Windows 11
    if (/premium|enhanced|améliorée|amelioree/.test(n)) s += 55; // Apple
    if (/google/.test(n)) s += 45; // Chrome / Android (voix réseau)
    if (/denise|vivienne|eloise|brigitte|amélie|amelie|audrey|aurélie|aurelie|marie|julie|léa|lea|virginie|celine|céline|female|femme/.test(n)) s += 8;
    if (/espeak|mbrola|pico|robot/.test(n)) s -= 50;
    if (!v.localService) s += 3; // voix en ligne, souvent meilleures
    return s;
  };
  return voix
    .filter((v) => v.lang?.toLowerCase().startsWith(langue))
    .sort((a, b) => note(b) - note(a) || a.name.localeCompare(b.name))[0];
}
