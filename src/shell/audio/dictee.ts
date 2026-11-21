/**
 * @file audio/dictee.ts
 * Dictée vocale universelle Alphabette (pour les applis qui ont un micro).
 *   1. SpeechRecognition fr-FR si le navigateur le permet ;
 *   2. sinon MediaRecorder → POST /api/alphabette/transcribe (Gemini côté serveur) ;
 *   3. site statique : transcription directe avec la clé Gemini du visiteur.
 *
 *   const d = demarrerDictee({ onTexte: (t, final) => setChamp(t), onFin: () => … });
 *   d.arreter();
 */
import { lireChaineIA } from '../ia/routeurByok';
import { MODELE_TRANSCRIPTION, MODELES_TRANSCRIPTION_SECOURS, octetsVersBase64 } from './voixGemini';
import { alphabetteAudio } from './alphabetteAudio';

declare global {
  interface Window {
    ALPHABETTE_TRANSCRIBE_URL?: string;
    SpeechRecognition?: new () => ReconnaissanceVocale;
    webkitSpeechRecognition?: new () => ReconnaissanceVocale;
  }
}

interface ReconnaissanceVocale {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

export interface OptionsDictee {
  onTexte: (texte: string, final: boolean) => void;
  onFin?: () => void;
  onErreur?: (message: string) => void;
  /** 'transcription' pendant l'envoi de l'enregistrement. */
  onEtat?: (etat: 'ecoute' | 'transcription' | 'repos') => void;
  langue?: string;
}

export interface Dictee {
  moteur: 'navigateur' | 'enregistrement' | 'aucun';
  arreter: () => void;
}

export function dicteePossible(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition || (navigator.mediaDevices && 'MediaRecorder' in window));
}

export function demarrerDictee(o: OptionsDictee): Dictee {
  alphabetteAudio.stop(); // on ne dicte pas pendant que la voix parle
  const Reco = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (Reco) {
    const r = new Reco();
    r.lang = o.langue ?? 'fr-FR';
    r.continuous = true;
    r.interimResults = true;
    let acquis = '';
    r.onresult = (e) => {
      let provisoire = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) acquis += res[0].transcript;
        else provisoire += res[0].transcript;
      }
      o.onTexte((acquis + provisoire).trim(), !provisoire);
    };
    r.onerror = (e) => {
      if (e.error !== 'no-speech' && e.error !== 'aborted') o.onErreur?.('Le micro n’a pas pu être utilisé.');
    };
    r.onend = () => {
      o.onEtat?.('repos');
      o.onFin?.();
    };
    try {
      r.start();
      o.onEtat?.('ecoute');
      return { moteur: 'navigateur', arreter: () => r.stop() };
    } catch { /* on passe à l'enregistrement */ }
  }
  if (navigator.mediaDevices && 'MediaRecorder' in window) return dicteeEnregistree(o);
  o.onErreur?.('La dictée n’est pas disponible sur cet appareil.');
  return { moteur: 'aucun', arreter: () => undefined };
}

function dicteeEnregistree(o: OptionsDictee): Dictee {
  let enregistreur: MediaRecorder | null = null;
  let flux: MediaStream | null = null;
  let annule = false;
  const morceaux: Blob[] = [];
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((f) => {
      if (annule) return f.getTracks().forEach((t) => t.stop());
      flux = f;
      enregistreur = new MediaRecorder(f);
      enregistreur.ondataavailable = (e) => e.data.size && morceaux.push(e.data);
      enregistreur.onstop = async () => {
        flux?.getTracks().forEach((t) => t.stop());
        o.onEtat?.('transcription');
        const blob = new Blob(morceaux, { type: enregistreur?.mimeType || 'audio/webm' });
        const texte = await transcrire(blob);
        if (texte) o.onTexte(texte, true);
        else o.onErreur?.('Transcription impossible pour le moment.');
        o.onEtat?.('repos');
        o.onFin?.();
      };
      enregistreur.start();
      o.onEtat?.('ecoute');
    })
    .catch(() => {
      o.onErreur?.('Autorisez le micro pour dicter.');
      o.onEtat?.('repos');
      o.onFin?.();
    });
  return {
    moteur: 'enregistrement',
    arreter: () => {
      annule = true;
      if (enregistreur?.state === 'recording') enregistreur.stop();
    },
  };
}

/** Transcrit un enregistrement en français (serveur, sinon clé Gemini du visiteur). */
export async function transcrire(blob: Blob): Promise<string> {
  const audioBase64 = octetsVersBase64(new Uint8Array(await blob.arrayBuffer()));
  const mimeType = (blob.type || 'audio/webm').split(';')[0];
  try {
    const r = await fetch(window.ALPHABETTE_TRANSCRIBE_URL || '/api/alphabette/transcribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audioBase64, mimeType }),
    });
    if (r.ok && (r.headers.get('content-type') || '').includes('json')) {
      const j = (await r.json()) as { texte?: string; text?: string };
      if (j.texte || j.text) return String(j.texte || j.text).trim();
    }
  } catch { /* site statique */ }
  const cle = lireChaineIA().find((m) => m.fournisseur === 'gemini' && m.cle)?.cle;
  if (!cle) return '';
  for (const modele of [MODELE_TRANSCRIPTION, ...MODELES_TRANSCRIPTION_SECOURS]) {
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modele}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': cle },
        body: JSON.stringify(corpsTranscription(audioBase64, mimeType)),
      });
      if (!r.ok) continue;
      const j = await r.json();
      const t = j?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? '').join('').trim();
      if (t) return t;
    } catch { /* suivant */ }
  }
  return '';
}

export function corpsTranscription(audioBase64: string, mimeType: string) {
  return {
    contents: [
      {
        role: 'user',
        parts: [
          { inlineData: { mimeType, data: audioBase64 } },
          { text: 'Transcris fidèlement cet enregistrement en français. Renvoie uniquement le texte prononcé, avec la ponctuation, sans commentaire.' },
        ],
      },
    ],
  };
}
