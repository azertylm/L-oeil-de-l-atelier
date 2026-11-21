/**
 * @file audio/alphabetteAudio.ts
 * Lecteur audio UNIQUE de l'écosystème Alphabette (même voix « Kore » partout).
 *
 *   import { alphabetteAudio } from '@alphabette/shell';
 *   alphabetteAudio.basculer(texte, 'fiche-12');   // dans un gestionnaire de clic
 *   alphabetteAudio.stop();
 *
 * Source de la voix, dans l'ordre :
 *   1. route serveur POST /api/alphabette/tts (clé Gemini côté serveur, jamais dans le navigateur) ;
 *   2. site statique : clé Gemini du visiteur (réglages IA de la base), appel direct à Google ;
 *   3. voix du téléphone (speechSynthesis fr-FR, vitesse 0,94, voix Google en priorité).
 * Lecture : AudioContext sans blanc entre les morceaux → sinon <audio> (Blob WAV) → sinon voix du téléphone.
 */
import { lireChaineIA } from '../ia/routeurByok';
import { morceauxAPrononcer } from './preparerTexte';
import { base64VersOctets, garantirWav, ttsGeminiDirect } from './voixGemini';

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
    const cle = this.cleGemini();
    if (cle) {
      const octets = await ttsGeminiDirect(texte, cle, signal);
      if (octets) {
        this.memoriser(texte, octets);
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
      const voix = synth.getVoices().filter((v) => v.lang?.toLowerCase().startsWith(code.slice(0, 2)));
      const choisie =
        voix.find((v) => /google/i.test(v.name) && v.lang === code) ??
        voix.find((v) => /google/i.test(v.name)) ??
        voix.find((v) => v.lang === code) ??
        voix[0];
      const parler = this.speakOrigine ?? ((u: SpeechSynthesisUtterance) => synth.speak(u));
      const suivant = (i: number) => {
        if (session !== this.sessionId || i >= morceaux.length) return fin();
        const u = new SpeechSynthesisUtterance(morceaux[i]) as SpeechSynthesisUtterance & { __ab?: boolean };
        u.__ab = true;
        u.lang = code;
        u.rate = 0.94;
        if (choisie) u.voice = choisie;
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
