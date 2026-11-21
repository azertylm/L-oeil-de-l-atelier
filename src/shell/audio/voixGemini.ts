/**
 * @file audio/voixGemini.ts
 * Réglages communs de la voix Alphabette (Google Gemini TTS) + outils WAV.
 * Même voix partout : « Kore ». Utilisé par le lecteur (navigateur) et par la route serveur.
 */

export const VOIX_ALPHABETTE = 'Kore';
export const MODELE_TTS = 'gemini-3.8-flash-lite-tts';
/** Modèles essayés ensuite si le premier est inconnu (404) ou refusé. */
export const MODELES_TTS_SECOURS = ['gemini-2.5-flash-preview-tts'];
export const STYLE_VOIX =
  'Voix française chaleureuse, posée, fluide, expressive et très naturelle, articulation claire et confortable pour un lecteur senior.';
export const MODELE_TRANSCRIPTION = 'gemini-3.5-transcribe';
export const MODELES_TRANSCRIPTION_SECOURS = ['gemini-2.5-flash'];

/** Corps de requête generateContent pour la voix Alphabette. */
export function corpsRequeteTts(texte: string, avecStyle: boolean) {
  const part: Record<string, unknown> = { text: texte };
  if (avecStyle) part.speechMetadata = { style: STYLE_VOIX };
  return {
    contents: [{ role: 'user', parts: [part] }],
    generationConfig: {
      responseModalities: ['AUDIO'],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: VOIX_ALPHABETTE } } },
    },
  };
}

export function base64VersOctets(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function octetsVersBase64(octets: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < octets.length; i += 0x8000) bin += String.fromCharCode(...octets.subarray(i, i + 0x8000));
  return btoa(bin);
}

/**
 * Garantit un WAV complet. La réponse est normalement déjà un WAV (en-tête RIFF) : on la garde
 * telle quelle. Si l'API renvoie du PCM brut (audio/L16;rate=24000), on ajoute l'en-tête.
 */
export function garantirWav(octets: Uint8Array, mimeType = ''): Uint8Array {
  const riff = octets.length > 12 && octets[0] === 0x52 && octets[1] === 0x49 && octets[2] === 0x46 && octets[3] === 0x46;
  if (riff) return octets;
  const taux = Number(/rate=(\d+)/i.exec(mimeType)?.[1] ?? 24000);
  const canaux = Number(/channels=(\d+)/i.exec(mimeType)?.[1] ?? 1);
  const entete = new ArrayBuffer(44);
  const v = new DataView(entete);
  const ecrire = (o: number, s: string) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  ecrire(0, 'RIFF');
  v.setUint32(4, 36 + octets.length, true);
  ecrire(8, 'WAVE');
  ecrire(12, 'fmt ');
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, canaux, true);
  v.setUint32(24, taux, true);
  v.setUint32(28, taux * canaux * 2, true);
  v.setUint16(32, canaux * 2, true);
  v.setUint16(34, 16, true);
  ecrire(36, 'data');
  v.setUint32(40, octets.length, true);
  const out = new Uint8Array(44 + octets.length);
  out.set(new Uint8Array(entete), 0);
  out.set(octets, 44);
  return out;
}

/**
 * Appel direct à l'API Gemini avec la clé du visiteur (sites statiques, sans serveur).
 * La clé ne part que vers Google. Renvoie null en cas d'échec.
 */
export async function ttsGeminiDirect(texte: string, cle: string, signal?: AbortSignal): Promise<Uint8Array | null> {
  for (const modele of [MODELE_TTS, ...MODELES_TTS_SECOURS]) {
    for (const avecStyle of [true, false]) {
      try {
        const r = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modele}:generateContent`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-goog-api-key': cle },
            body: JSON.stringify(corpsRequeteTts(texte, avecStyle)),
            signal,
          },
        );
        if (r.status === 404) break; // modèle inconnu → suivant
        if (r.status === 401 || r.status === 403 || r.status === 429) return null;
        if (!r.ok) continue; // échec avec le style → on réessaie sans
        const json = await r.json();
        const data = json?.candidates?.[0]?.content?.parts?.find((p: { inlineData?: unknown }) => p.inlineData)?.inlineData;
        if (!data?.data) continue;
        return garantirWav(base64VersOctets(data.data), data.mimeType);
      } catch (e) {
        if ((e as Error)?.name === 'AbortError') throw e;
        return null;
      }
    }
  }
  return null;
}
