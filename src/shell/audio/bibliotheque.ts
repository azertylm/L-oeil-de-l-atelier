/**
 * @file audio/bibliotheque.ts
 * Bibliothèque de voix Alphabette, GRATUITE et SANS SERVEUR.
 *
 * Les textes fixes des applis (page lue par le haut-parleur, boutons « Écouter », fichiers
 * voix-textes.json) sont enregistrés à l'avance par une tâche GitHub gratuite
 * (scripts/voix/generer-bibliotheque.ts) : voix Gemini « Kore » quand une clé Gemini gratuite et
 * son quota le permettent, sinon voix neuronale libre Piper « Siwis » (CC BY 4.0) ; publiés en MP3
 * sur https://alphabette.fr/voix/. Le navigateur n'a plus qu'à lire un fichier : aucun serveur, aucune
 * clé, démarrage immédiat, la même voix pour tout le monde.
 *
 * L'index est un petit script (voix/index.js) : il se charge depuis n'importe quel sous-domaine
 * sans réglage CORS. Les MP3 se lisent avec un simple <audio>, lui aussi sans CORS.
 */
import { preparerTexte } from './preparerTexte';

declare global {
  interface Window {
    /** Adresse de la bibliothèque (par défaut https://alphabette.fr/voix/). */
    ALPHABETTE_VOIX_URL?: string;
    /** Index publié par voix/index.js : empreinte → durée en secondes. */
    __abVoix?: { v: number; h: Record<string, number> };
  }
}

/** Version de la bibliothèque : changer la voix ou le style impose de tout réenregistrer. */
export const VERSION_BIBLIOTHEQUE = 1;
/** Taille maximale d'un enregistrement (un appel Gemini par partie : le quota gratuit est petit). */
export const PARTIE_MAX = 3500;

export function urlBibliotheque(): string {
  const base = (typeof window !== 'undefined' && window.ALPHABETTE_VOIX_URL) || 'https://alphabette.fr/voix/';
  return base.endsWith('/') ? base : `${base}/`;
}

/** Empreinte courte et stable d'un texte préparé (identique dans le navigateur et dans Node). */
export function empreinteVoix(textePrepare: string): string {
  // La voix n'entre pas dans l'empreinte : un enregistrement peut passer de la voix libre à « Kore »
  // sans changer d'adresse.
  const s = `${VERSION_BIBLIOTHEQUE}|${textePrepare}`;
  let h1 = 0xdeadbeef ^ s.length;
  let h2 = 0x41c6ce57 ^ s.length;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 2654435761);
    h2 = Math.imul(h2 ^ c, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

/** Coupe un texte préparé en grandes parties (fins de phrases), une par enregistrement. */
export function partiesEnregistrees(textePrepare: string): string[] {
  if (textePrepare.length <= PARTIE_MAX) return textePrepare ? [textePrepare] : [];
  const phrases = textePrepare.match(/[^.!?…]+(?:[.!?…]+["»”’)\]]*|$)/g)?.map((p) => p.trim()).filter(Boolean) ?? [];
  const parties: string[] = [];
  let courant = '';
  for (const p of phrases) {
    if ((courant + ' ' + p).trim().length > PARTIE_MAX && courant) {
      parties.push(courant);
      courant = p.slice(0, PARTIE_MAX);
    } else courant = (courant + ' ' + p).trim();
  }
  if (courant) parties.push(courant);
  return parties;
}

/** Ce qu'il faut enregistrer pour un texte brut : parties + empreintes. */
export function planBibliotheque(brut: string): { texte: string; empreinte: string }[] {
  return partiesEnregistrees(preparerTexte(brut)).map((texte) => ({ texte, empreinte: empreinteVoix(texte) }));
}

let chargement: Promise<void> | null = null;

/** Charge l'index de la bibliothèque une fois (sans bloquer : 2,5 s au plus). */
export function chargerIndexBibliotheque(): Promise<void> {
  if (typeof document === 'undefined') return Promise.resolve();
  if (window.__abVoix) return Promise.resolve();
  if (!chargement) {
    chargement = new Promise<void>((fin) => {
      const s = document.createElement('script');
      s.src = `${urlBibliotheque()}index.js?v=${Math.floor(Date.now() / 3.6e6)}`; // rafraîchi chaque heure
      s.async = true;
      s.onload = () => fin();
      s.onerror = () => fin();
      (document.head || document.documentElement).appendChild(s);
      setTimeout(fin, 2500);
    });
  }
  return chargement;
}

/** Adresses MP3 si TOUT le texte est déjà enregistré, sinon null. */
export function enregistrementsDisponibles(brut: string): string[] | null {
  const index = typeof window !== 'undefined' ? window.__abVoix?.h : undefined;
  if (!index) return null;
  const plan = planBibliotheque(brut);
  if (!plan.length || plan.some((p) => !(p.empreinte in index))) return null;
  return plan.map((p) => `${urlBibliotheque()}${p.empreinte}.mp3`);
}
