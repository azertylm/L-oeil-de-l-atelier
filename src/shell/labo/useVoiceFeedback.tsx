/**
 * @file labo/useVoiceFeedback.tsx
 * Retour vocal mains-libres pour le module d'avis du Laboratoire.
 *
 *   const voix = useVoiceFeedback({ onResultat: ({ avis }) => remplirLeFormulaire(avis) });
 *   <BoutonMicro voix={voix} />
 *
 * Le visiteur parle 15 secondes au plus. La transcription est structurée dans le navigateur
 * (structurerAvisVocal) en { type, resume, urgence } ; rien n'est envoyé sans qu'il relise et valide.
 *
 * Moteurs, dans l'ordre :
 *  1. Web Speech API (Chrome, Edge, Safari). Attention : Chrome et Edge font la transcription sur
 *     les serveurs de Google / Microsoft — le bouton l'indique.
 *  2. Repli : Whisper exécuté localement en WebGPU (whisper.worker.ts), l'audio ne quitte pas
 *     l'appareil. Le modèle (~40 Mo) n'est téléchargé qu'avec l'accord explicite du visiteur.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { structurerAvisVocal, type AvisVocal } from './structurerAvisVocal';

export type MoteurVocal = 'web-speech' | 'whisper' | 'aucun';
export type EtatVocal = 'repos' | 'accord' | 'ecoute' | 'transcription' | 'pret' | 'erreur';

export interface OptionsVoix {
  dureeMaxS?: number;
  onResultat?: (r: { transcription: string; avis: AvisVocal; moteur: MoteurVocal }) => void;
}

interface Reconnaissance {
  lang: string; continuous: boolean; interimResults: boolean;
  onresult: ((e: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void; stop(): void; abort(): void;
}

const CLE_ACCORD = 'labo_whisper_accord';

function webSpeech(): (new () => Reconnaissance) | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { SpeechRecognition?: new () => Reconnaissance; webkitSpeechRecognition?: new () => Reconnaissance };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}
const whisperPossible = () =>
  typeof navigator !== 'undefined' && 'gpu' in navigator && typeof MediaRecorder !== 'undefined' && !!navigator.mediaDevices?.getUserMedia;

export function moteurDisponible(): MoteurVocal {
  return webSpeech() ? 'web-speech' : whisperPossible() ? 'whisper' : 'aucun';
}

/** Audio enregistré → Float32Array mono 16 kHz, format attendu par Whisper. */
async function vers16kHz(blob: Blob): Promise<Float32Array> {
  const brut = await blob.arrayBuffer();
  const ctx = new AudioContext({ sampleRate: 16000 });
  try {
    const audio = await ctx.decodeAudioData(brut);
    if (audio.numberOfChannels === 1) return audio.getChannelData(0);
    const a = audio.getChannelData(0), b = audio.getChannelData(1), m = new Float32Array(a.length);
    for (let i = 0; i < a.length; i++) m[i] = (a[i] + b[i]) / 2;
    return m;
  } finally {
    void ctx.close();
  }
}

export function useVoiceFeedback({ dureeMaxS = 15, onResultat }: OptionsVoix = {}) {
  const [moteur, setMoteur] = useState<MoteurVocal>(() => moteurDisponible());
  const [etat, setEtat] = useState<EtatVocal>('repos');
  const [reste, setReste] = useState(dureeMaxS);
  const [texte, setTexte] = useState('');
  const [progression, setProgression] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const arret = useRef<() => void>(() => undefined);
  const minuteur = useRef<number | undefined>(undefined);
  const rappel = useRef(onResultat);
  rappel.current = onResultat;

  const finir = useCallback((transcription: string, m: MoteurVocal) => {
    window.clearInterval(minuteur.current);
    const t = transcription.trim();
    if (!t) { setEtat('erreur'); setMessage("Je n'ai rien entendu. Réessayez en parlant près du micro."); return; }
    setTexte(t);
    setEtat('pret');
    rappel.current?.({ transcription: t, avis: structurerAvisVocal(t), moteur: m });
  }, []);

  const compteARebours = useCallback(() => {
    setReste(dureeMaxS);
    window.clearInterval(minuteur.current);
    const debut = Date.now();
    minuteur.current = window.setInterval(() => {
      const r = Math.max(0, dureeMaxS - Math.floor((Date.now() - debut) / 1000));
      setReste(r);
      if (r === 0) arret.current();
    }, 250);
  }, [dureeMaxS]);

  const ecouterWhisper = useCallback(async () => {
    let flux: MediaStream;
    try {
      flux = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true } });
    } catch {
      setEtat('erreur'); setMessage("Le micro n'est pas autorisé. Vous pouvez écrire votre avis à la place."); return;
    }
    const morceaux: Blob[] = [];
    const rec = new MediaRecorder(flux);
    rec.ondataavailable = (e) => e.data.size && morceaux.push(e.data);
    rec.onstop = async () => {
      flux.getTracks().forEach((p) => p.stop());
      window.clearInterval(minuteur.current);
      setEtat('transcription');
      try {
        const audio = await vers16kHz(new Blob(morceaux, { type: rec.mimeType }));
        const w = new Worker(new URL('./whisper.worker.ts', import.meta.url), { type: 'module' });
        w.onmessage = (e: MessageEvent<{ type: string; texte?: string; valeur?: number; message?: string }>) => {
          if (e.data.type === 'progression') setProgression(e.data.valeur ?? null);
          if (e.data.type === 'texte') { w.terminate(); setProgression(null); finir(e.data.texte ?? '', 'whisper'); }
          if (e.data.type === 'erreur') { w.terminate(); setProgression(null); setEtat('erreur'); setMessage('La transcription locale a échoué sur cet appareil. Écrivez votre avis à la place.'); }
        };
        w.postMessage({ type: 'transcrire', audio }, [audio.buffer]);
      } catch {
        setEtat('erreur'); setMessage("L'enregistrement n'a pas pu être lu. Écrivez votre avis à la place.");
      }
    };
    arret.current = () => rec.state !== 'inactive' && rec.stop();
    rec.start();
    setEtat('ecoute');
    compteARebours();
  }, [compteARebours, finir]);

  const ecouterWebSpeech = useCallback(() => {
    const R = webSpeech();
    if (!R) return false;
    const rec = new R();
    rec.lang = 'fr-FR';
    rec.continuous = true;
    rec.interimResults = true;
    let final = '';
    let provisoire = '';
    let echec = false;
    rec.onresult = (e) => {
      provisoire = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) final += ' ' + r[0].transcript; else provisoire += ' ' + r[0].transcript;
      }
      setTexte((final + provisoire).trim());
    };
    rec.onerror = (e) => {
      echec = true;
      window.clearInterval(minuteur.current);
      if ((e.error === 'network' || e.error === 'service-not-allowed' || e.error === 'language-not-supported') && whisperPossible()) {
        setMoteur('whisper');
        setEtat('accord');
        setMessage('La dictée du navigateur ne répond pas. Vous pouvez utiliser la transcription sur votre appareil.');
      } else if (e.error === 'not-allowed') {
        setEtat('erreur'); setMessage("Le micro n'est pas autorisé. Vous pouvez écrire votre avis à la place.");
      } else if (e.error !== 'aborted') {
        setEtat('erreur'); setMessage("Je n'ai rien entendu. Réessayez en parlant près du micro.");
      }
    };
    rec.onend = () => { if (!echec) finir((final + ' ' + provisoire).trim(), 'web-speech'); };
    arret.current = () => rec.stop();
    try { rec.start(); } catch { return false; }
    setEtat('ecoute');
    compteARebours();
    return true;
  }, [compteARebours, finir]);

  const demarrer = useCallback(() => {
    setMessage(''); setTexte('');
    if (moteur === 'web-speech' && ecouterWebSpeech()) return;
    if (whisperPossible()) {
      let accord = false;
      try { accord = localStorage.getItem(CLE_ACCORD) === '1'; } catch { /* rien */ }
      if (!accord) { setMoteur('whisper'); setEtat('accord'); return; }
      void ecouterWhisper();
      return;
    }
    setEtat('erreur');
    setMessage("La dictée n'est pas disponible sur ce navigateur. Écrivez votre avis à la place.");
  }, [moteur, ecouterWebSpeech, ecouterWhisper]);

  const accepterWhisper = useCallback(() => {
    try { localStorage.setItem(CLE_ACCORD, '1'); } catch { /* rien */ }
    void ecouterWhisper();
  }, [ecouterWhisper]);

  const arreter = useCallback(() => arret.current(), []);
  const annuler = useCallback(() => { arret.current = () => undefined; window.clearInterval(minuteur.current); setEtat('repos'); setMessage(''); }, []);
  useEffect(() => () => { window.clearInterval(minuteur.current); arret.current(); }, []);

  return { moteur, etat, reste, texte, progression, message, demarrer, arreter, annuler, accepterWhisper, dureeMaxS };
}

export type Voix = ReturnType<typeof useVoiceFeedback>;

/** Bouton micro prêt à poser dans un formulaire d'avis. */
export const BoutonMicro: React.FC<{ voix: Voix }> = ({ voix }) => {
  if (voix.moteur === 'aucun') return null;
  const { etat } = voix;
  return (
    <div className="voix">
      {etat === 'ecoute' ? (
        <button type="button" className="voix__bouton voix__bouton--ecoute" onClick={voix.arreter} aria-label={`Arrêter la dictée, ${voix.reste} secondes restantes`}>
          ⏹ J'ai fini · {voix.reste} s
        </button>
      ) : etat === 'transcription' ? (
        <p className="voix__info" role="status">
          Transcription sur votre appareil…{voix.progression != null ? ` (téléchargement ${voix.progression} %)` : ''}
        </p>
      ) : etat === 'accord' ? (
        <div className="voix__accord" role="dialog" aria-label="Transcription sur votre appareil">
          <p className="voix__info">
            {voix.message || 'Pour dicter ici, la reconnaissance vocale doit être téléchargée une fois (environ 40 Mo).'} Votre voix ne quitte
            pas votre appareil.
          </p>
          <button type="button" className="voix__bouton" onClick={voix.accepterWhisper}>Télécharger et dicter</button>
          <button type="button" className="voix__lien" onClick={voix.annuler}>Non merci</button>
        </div>
      ) : (
        <button type="button" className="voix__bouton" onClick={voix.demarrer}>
          🎙️ Dicter mon avis ({voix.dureeMaxS} s)
        </button>
      )}
      {etat === 'ecoute' && voix.texte && <p className="voix__info" aria-live="polite">« {voix.texte} »</p>}
      {etat === 'erreur' && <p className="voix__info voix__info--erreur" role="status">{voix.message}</p>}
      {etat === 'repos' && voix.moteur === 'web-speech' && (
        <p className="voix__info voix__info--petit">La dictée utilise le service de votre navigateur (Google pour Chrome, Microsoft pour Edge, Apple pour Safari).</p>
      )}
    </div>
  );
};
