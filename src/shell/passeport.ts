/**
 * @file passeport.ts
 * « Passeport QR chiffré » (Lot 6) : transfert Zero-Knowledge des réglages d'un appareil à un autre.
 *
 *  1. Le navigateur rassemble les préférences (thème, zoom BIG, Mode Calme, favoris, mode Codex ; les clés BYOK
 *     seulement si l'utilisateur coche explicitement l'option, décochée par défaut).
 *  2. Il les chiffre avec Web Crypto (AES-GCM 256 bits, IV aléatoire) : la clé est éphémère, générée sur l'appareil.
 *  3. Il dépose le seul bloc chiffré sur api/relay.php (120 s, détruit à la première lecture). La clé n'est mise QUE dans
 *     le #hash du lien / du QR : un fragment d'adresse n'est jamais envoyé au serveur par le navigateur.
 *  4. L'autre appareil ouvre le lien, lit le bloc, le déchiffre localement et applique les réglages.
 *
 * Aucun serveur extérieur, aucun traceur ; le QR est dessiné dans le navigateur (assets/qr-alphabette.js).
 */
import { ecrirePrefs, lirePrefs, type Prefs } from './prefs';

export const VERSION_PASSEPORT = 1;
export const DUREE_RELAIS_SECONDES = 120;
const CLE_IA = 'alphabette.ia.chaine';
const CLE_CODEX = 'alphabette.codex';
const CLE_CALME = 'alphabette.calme';
const DENSITES = ['normal', 'large', 'xlarge'];

export interface EtapeIA { fournisseur: string; cle: string; modele?: string; url?: string }

export interface Passeport {
  v: number;
  prefs: Pick<Prefs, 'theme' | 'density' | 'lang' | 'simple' | 'calme' | 'favoris'>;
  codex?: boolean;
  /** Clés BYOK : présentes seulement si l'utilisateur l'a demandé. */
  ia?: EtapeIA[];
}

/* ───────────────────────────── base64url ───────────────────────────── */

export function versBase64Url(octets: Uint8Array): string {
  let s = '';
  for (let i = 0; i < octets.length; i += 0x8000) s += String.fromCharCode(...octets.subarray(i, i + 0x8000));
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function depuisBase64Url(texte: string): Uint8Array<ArrayBuffer> {
  if (!/^[A-Za-z0-9_-]*$/.test(texte)) throw new Error('Contenu illisible.');
  const b = atob(texte.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((texte.length + 3) % 4));
  const o = new Uint8Array(b.length);
  for (let i = 0; i < b.length; i++) o[i] = b.charCodeAt(i);
  return o;
}

/* ───────────────────────────── chiffrement ───────────────────────────── */

/** Chiffre le passeport : { bloc (IV + texte chiffré, base64url), cle (256 bits, base64url) }. */
export async function chiffrerPasseport(passeport: Passeport): Promise<{ bloc: string; cle: string }> {
  const sub = globalThis.crypto.subtle;
  const cleBrute = globalThis.crypto.getRandomValues(new Uint8Array(32));
  const cle = await sub.importKey('raw', cleBrute, 'AES-GCM', false, ['encrypt']);
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));
  const clair = new TextEncoder().encode(JSON.stringify(passeport));
  const chiffre = new Uint8Array(await sub.encrypt({ name: 'AES-GCM', iv }, cle, clair));
  const bloc = new Uint8Array(iv.length + chiffre.length);
  bloc.set(iv, 0);
  bloc.set(chiffre, iv.length);
  return { bloc: versBase64Url(bloc), cle: versBase64Url(cleBrute) };
}

/** Déchiffre un bloc ; lève une erreur claire si la clé est fausse ou le bloc altéré (AES-GCM authentifie). */
export async function dechiffrerPasseport(bloc: string, cleTexte: string): Promise<Passeport> {
  const sub = globalThis.crypto.subtle;
  let brut: Uint8Array<ArrayBuffer>;
  let cleBrute: Uint8Array<ArrayBuffer>;
  try {
    brut = depuisBase64Url(bloc);
    cleBrute = depuisBase64Url(cleTexte);
  } catch {
    throw new Error("Le lien de transfert est incomplet : demandez-en un nouveau.");
  }
  if (cleBrute.length !== 32 || brut.length < 13) throw new Error("Le lien de transfert est incomplet : demandez-en un nouveau.");
  try {
    const cle = await sub.importKey('raw', cleBrute, 'AES-GCM', false, ['decrypt']);
    const clair = await sub.decrypt({ name: 'AES-GCM', iv: brut.slice(0, 12) }, cle, brut.slice(12));
    return nettoyerPasseport(JSON.parse(new TextDecoder().decode(clair)));
  } catch {
    throw new Error("Impossible de déchiffrer : le lien est faux ou a été modifié.");
  }
}

/* ───────────────────────────── contenu du passeport ───────────────────────────── */

/** Ne garde que des valeurs attendues : un passeport reçu est une donnée, jamais du code. */
export function nettoyerPasseport(brut: unknown): Passeport {
  const b = (brut && typeof brut === 'object' ? brut : {}) as Record<string, unknown>;
  if (b.v !== VERSION_PASSEPORT) throw new Error('Ce passeport vient d’une version incompatible.');
  const p = (b.prefs && typeof b.prefs === 'object' ? b.prefs : {}) as Record<string, unknown>;
  const prefs: Passeport['prefs'] = {};
  if (p.theme === 'jour' || p.theme === 'nuit') prefs.theme = p.theme;
  if (typeof p.density === 'string' && DENSITES.includes(p.density)) prefs.density = p.density as Prefs['density'];
  if (p.lang === 'fr' || p.lang === 'en') prefs.lang = p.lang;
  if (typeof p.simple === 'boolean') prefs.simple = p.simple;
  if (typeof p.calme === 'boolean') prefs.calme = p.calme;
  if (Array.isArray(p.favoris)) prefs.favoris = p.favoris.filter((x): x is string => typeof x === 'string' && /^[a-z0-9-]{1,60}$/.test(x)).slice(0, 5);
  const sortie: Passeport = { v: VERSION_PASSEPORT, prefs };
  if (typeof b.codex === 'boolean') sortie.codex = b.codex;
  if (Array.isArray(b.ia)) {
    const etapes = b.ia
      .filter((e): e is Record<string, unknown> => Boolean(e) && typeof e === 'object')
      .filter((e) => typeof e.fournisseur === 'string' && /^[a-z]{2,20}$/.test(e.fournisseur as string) && typeof e.cle === 'string' && (e.cle as string).length >= 8 && (e.cle as string).length <= 400)
      .slice(0, 4)
      .map((e) => ({ fournisseur: e.fournisseur as string, cle: e.cle as string }));
    if (etapes.length) sortie.ia = etapes;
  }
  return sortie;
}

function lireLocal(cle: string): string | null {
  try { return localStorage.getItem(cle); } catch { return null; }
}

/** Rassemble les réglages de cet appareil. Les clés BYOK ne partent que si `avecCles` est vrai. */
export function collecterPasseport(opts: { avecCles?: boolean } = {}): Passeport {
  const p = lirePrefs();
  const passeport: Passeport = {
    v: VERSION_PASSEPORT,
    prefs: { theme: p.theme, density: p.density, lang: p.lang, simple: p.simple, calme: p.calme, favoris: p.favoris?.slice(0, 5) },
  };
  const codex = lireLocal(CLE_CODEX);
  if (codex === 'oui' || codex === 'non') passeport.codex = codex === 'oui';
  if (opts.avecCles) {
    try {
      const chaine = JSON.parse(lireLocal(CLE_IA) || '[]');
      const net = nettoyerPasseport({ v: VERSION_PASSEPORT, prefs: {}, ia: chaine }).ia;
      if (net) passeport.ia = net;
    } catch { /* aucune clé lisible : rien à transférer */ }
  }
  return JSON.parse(JSON.stringify(passeport)) as Passeport; // retire les champs « undefined »
}

/** Applique un passeport sur cet appareil et renvoie l'état précédent (pour « Annuler »). */
export function appliquerPasseport(passeport: Passeport): Passeport {
  const avant = collecterPasseport({ avecCles: true });
  const p = nettoyerPasseport(passeport);
  ecrirePrefs(p.prefs);
  try {
    if (p.prefs.calme !== undefined) localStorage.setItem(CLE_CALME, p.prefs.calme ? 'oui' : 'non');
    if (p.codex !== undefined) localStorage.setItem(CLE_CODEX, p.codex ? 'oui' : 'non');
    if (p.ia) localStorage.setItem(CLE_IA, JSON.stringify(p.ia));
  } catch { /* navigation privée : les préférences du cookie suffisent */ }
  return avant;
}

/** Réglages d'un proche préparés par un aidant : zoom BIG, Mode Calme, 1 à 5 applis épinglées. Aucune clé, aucun compte. */
export function passeportAidant(o: { density?: 'normal' | 'large' | 'xlarge'; calme?: boolean; epingles?: string[] }): Passeport {
  const epingles = (o.epingles ?? []).filter((s) => /^[a-z0-9-]{1,60}$/.test(s)).slice(0, 5);
  return nettoyerPasseport({
    v: VERSION_PASSEPORT,
    prefs: { density: o.density ?? 'xlarge', calme: o.calme ?? true, favoris: epingles, simple: true },
  });
}

/* ───────────────────────────── relais (api/relay.php) ───────────────────────────── */

export interface Depot { code: string; lien: string; expireDans: number }

/** Lien à scanner : le code est une adresse, la clé reste dans le #hash (jamais envoyée au serveur). */
export function lienReception(origine: string, code: string, cle: string): string {
  return `${origine.replace(/\/$/, '')}/transfert/#c=${encodeURIComponent(code)}&k=${encodeURIComponent(cle)}`;
}

export function lireLien(hash: string): { code: string; cle: string } | null {
  const p = new URLSearchParams(hash.replace(/^#/, ''));
  const code = (p.get('c') ?? '').toUpperCase();
  const cle = p.get('k') ?? '';
  return /^[A-HJ-NP-Z2-9]{6}$/.test(code) && /^[A-Za-z0-9_-]{40,50}$/.test(cle) ? { code, cle } : null;
}

async function appelRelais(origine: string, corps: Record<string, unknown>): Promise<Record<string, unknown>> {
  let r: Response;
  try {
    r = await fetch(`${origine.replace(/\/$/, '')}/api/relay.php`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corps), cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer',
    });
  } catch {
    throw new Error('Le service de transfert ne répond pas : vérifiez votre connexion.');
  }
  const d = (await r.json().catch(() => ({}))) as Record<string, unknown>;
  if (!r.ok) throw new Error(typeof d.erreur === 'string' ? d.erreur : 'Le transfert a échoué.');
  return d;
}

/** Chiffre puis dépose. L'origine du relais est celle du Laboratoire (alphabette.eu), même depuis un autre site. */
export async function deposerPasseport(passeport: Passeport, origine: string): Promise<Depot> {
  const { bloc, cle } = await chiffrerPasseport(passeport);
  const d = await appelRelais(origine, { action: 'deposer', bloc });
  const code = String(d.code ?? '');
  return { code, lien: lienReception(origine, code, cle), expireDans: Number(d.expire_dans ?? DUREE_RELAIS_SECONDES) };
}

/** Lit (et détruit) le bloc, le déchiffre localement, l'applique. Renvoie le passeport et l'état précédent. */
export async function recevoirPasseport(code: string, cle: string, origine: string): Promise<{ passeport: Passeport; avant: Passeport }> {
  const d = await appelRelais(origine, { action: 'lire', code });
  const passeport = await dechiffrerPasseport(String(d.bloc ?? ''), cle);
  return { passeport, avant: appliquerPasseport(passeport) };
}
