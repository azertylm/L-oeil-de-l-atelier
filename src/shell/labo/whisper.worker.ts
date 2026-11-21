/**
 * @file labo/whisper.worker.ts
 * Repli « Whisper local » du retour vocal : transcription dans le navigateur (WebGPU), sans
 * envoyer l'audio à quiconque. La bibliothèque et le modèle (~40 Mo, mis en cache par le
 * navigateur) ne sont téléchargés que si le visiteur l'accepte, et uniquement à ce moment-là.
 *
 * Messages : { type: 'transcrire', audio: Float32Array (16 kHz mono) }
 *        →   { type: 'progression', valeur } | { type: 'texte', texte } | { type: 'erreur', message }
 */
/// <reference lib="webworker" />
const BIBLIOTHEQUE = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3';
const MODELE = 'onnx-community/whisper-tiny';

type Transcripteur = (audio: Float32Array, o: Record<string, unknown>) => Promise<{ text: string } | { text: string }[]>;
let transcripteur: Promise<Transcripteur> | null = null;

function charger(): Promise<Transcripteur> {
  if (!transcripteur) {
    transcripteur = (async () => {
      const t = await import(/* @vite-ignore */ BIBLIOTHEQUE);
      return t.pipeline('automatic-speech-recognition', MODELE, {
        device: 'webgpu',
        dtype: { encoder_model: 'fp32', decoder_model_merged: 'q4' },
        progress_callback: (p: { status?: string; progress?: number }) => {
          if (p.status === 'progress' && typeof p.progress === 'number') self.postMessage({ type: 'progression', valeur: Math.round(p.progress) });
        },
      }) as Promise<Transcripteur>;
    })();
    transcripteur.catch(() => { transcripteur = null; });
  }
  return transcripteur;
}

self.onmessage = async (e: MessageEvent<{ type: string; audio: Float32Array }>) => {
  if (e.data?.type !== 'transcrire') return;
  try {
    const asr = await charger();
    const r = await asr(e.data.audio, { language: 'french', task: 'transcribe', chunk_length_s: 30 });
    const texte = Array.isArray(r) ? r.map((x) => x.text).join(' ') : r.text;
    self.postMessage({ type: 'texte', texte: (texte || '').trim() });
  } catch (err) {
    self.postMessage({ type: 'erreur', message: err instanceof Error ? err.message : String(err) });
  }
};
