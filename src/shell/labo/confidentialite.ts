/**
 * @file labo/confidentialite.ts
 * Filtre « zéro connaissance » du Laboratoire alphabette.eu : tout ce qui part avec un avis
 * (commentaire compris) passe ici. On retire ce qui pourrait identifier une personne ou ouvrir
 * un compte : clés d'API (BYOK), jetons, e-mails, téléphones, IBAN, cartes, adresses IP,
 * paramètres d'adresse. Le visiteur garde ses secrets ; Alphabette n'en voit jamais la couleur.
 */

/** Motifs retirés, du plus précis au plus large. L'ordre compte. */
const MOTIFS: [RegExp, string][] = [
  // Adresses d'abord : on garde le chemin, jamais les paramètres (?key=…, #access_token=…)
  [/\b((?:https?|wss?):\/\/[^\s?#"'<>)]+)[?#][^\s"'<>)]*/gi, '$1?…'],
  // Clés et jetons connus (OpenAI, Anthropic, Mistral, Google, GitHub, Slack, Stripe, AWS, JWT, Bearer)
  [/\bsk-(?:ant-|proj-)?[A-Za-z0-9_-]{16,}/g, '[clé masquée]'],
  [/\bAIza[0-9A-Za-z_-]{20,}/g, '[clé masquée]'],
  [/\b(?:ghp|gho|ghu|ghs|github_pat)_[A-Za-z0-9_]{20,}/g, '[clé masquée]'],
  [/\bxox[abposr]-[A-Za-z0-9-]{10,}/g, '[clé masquée]'],
  [/\b(?:pk|sk|rk)_(?:live|test)_[A-Za-z0-9]{10,}/g, '[clé masquée]'],
  [/\bAKIA[0-9A-Z]{16}\b/g, '[clé masquée]'],
  [/\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}/g, '[jeton masqué]'],
  [/\b(?:Bearer|Basic|Token)\s+[A-Za-z0-9._~+/=-]{8,}/gi, '[jeton masqué]'],
  [/\b(?:api[_-]?key|apikey|token|secret|password|passwd|mot[_ -]?de[_ -]?passe|cl[ée])\s*[:=]\s*\S+/gi, '[secret masqué]'],
  // Données personnelles
  [/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '[e-mail masqué]'],
  [/\bFR\d{2}(?:\s?[A-Z0-9]{4}){5}\s?[A-Z0-9]{3}\b/gi, '[IBAN masqué]'],
  [/\b[A-Z]{2}\d{2}(?:\s?[A-Z0-9]{4}){3,7}\b/g, '[IBAN masqué]'],
  [/\b(?:\d[ -]?){13,19}\b/g, '[numéro masqué]'],
  [/(?:\+33\s?|0)[1-9](?:[\s.-]?\d{2}){4}\b/g, '[téléphone masqué]'],
  [/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, '[IP masquée]'],
  // Toute longue suite qui ressemble à un secret
  [/\b[A-Za-z0-9_\-+/=]{32,}\b/g, '[masqué]'],
];

/** Nettoie un texte avant tout envoi ; `max` caractères au plus. */
export function nettoyerTexte(texte: unknown, max = 500): string {
  let t = String(texte ?? '');
  for (const [motif, remplacement] of MOTIFS) t = t.replace(motif, remplacement);
  return t.replace(/\s+/g, ' ').trim().slice(0, max);
}

/**
 * Clés du stockage local qu'on peut citer sans risque : préférences d'affichage et réglages.
 * Seuls les NOMS partent, jamais les valeurs ; tout nom qui évoque un secret est exclu.
 */
const NOMS_SURS = /^(alphabette\.prefs|ab[-_.]|labo_|theme|density|densite|lang|langue|font|zoom|debate_show_|iadebat_config_solo|infoperso_(?:view|layout|guided_tour_seen))/i;
const NOMS_SENSIBLES = /(key|cle|clé|token|secret|pass|auth|session|cookie|mail|user|membre|account|compte|iban|card|carte|phone|tel)/i;

export function clesStockageSures(stockage: Storage | undefined = globalThis.localStorage): string[] {
  try {
    if (!stockage) return [];
    const noms: string[] = [];
    for (let i = 0; i < stockage.length; i++) {
      const nom = stockage.key(i);
      if (nom && NOMS_SURS.test(nom) && !NOMS_SENSIBLES.test(nom)) noms.push(nom.slice(0, 60));
    }
    return noms.sort().slice(0, 30);
  } catch {
    return [];
  }
}

/** « Android / Chrome » : jamais l'identifiant complet du navigateur (empreinte). */
export function plateformeSimple(ua = globalThis.navigator?.userAgent ?? ''): string {
  const os = /Android/i.test(ua) ? 'Android' : /iPhone|iPad|iPod/i.test(ua) ? 'iOS' : /Windows/i.test(ua) ? 'Windows'
    : /Mac OS X|Macintosh/i.test(ua) ? 'macOS' : /CrOS/i.test(ua) ? 'ChromeOS' : /Linux/i.test(ua) ? 'Linux' : 'Autre';
  const nav = /SamsungBrowser/i.test(ua) ? 'Samsung Internet' : /Edg\//i.test(ua) ? 'Edge' : /OPR\/|Opera/i.test(ua) ? 'Opera'
    : /Firefox|FxiOS/i.test(ua) ? 'Firefox' : /Chrome|CriOS/i.test(ua) ? 'Chrome' : /Safari/i.test(ua) ? 'Safari' : 'Autre';
  return `${os} / ${nav}`;
}

export interface ContexteTechnique {
  viewport: string;
  platform: string;
  console_errors: string[];
  stockage_cles: string[];
}

/** Erreurs gardées par /labo/capteur.js (10 dernières, 24 h), pour le chemin de l'appli. */
export function erreursCapturees(chemin = cheminCourant()): string[] {
  try {
    const toutes = JSON.parse(localStorage.getItem('labo_erreurs_v1') || '{}') as Record<string, { t: number; m: string }[]>;
    const limite = Date.now() - 24 * 3600 * 1000;
    // Les incidents de fournisseurs d'IA (quota, clé, panne) ne sont pas des bugs de l'appli : exclus.
    return (toutes[chemin] ?? []).filter((e) => e.t > limite && !e.m.includes('[Incident API Tiers]') && !/IncidentApiTiers/.test(e.m)).slice(-10).map((e) => nettoyerTexte(e.m, 300));
  } catch {
    return [];
  }
}

/** Chemin d'une appli sur alphabette.eu : « /apps/bonplan/ », « /wikicom/ ». */
export function cheminCourant(pathname = globalThis.location?.pathname ?? '/'): string {
  const m = pathname.match(/^\/apps\/[^/]+\/|^\/[^/]+\/?/);
  return m ? (/\/$|\.html$/.test(m[0]) ? m[0] : `${m[0]}/`) : pathname;
}

export function contexteTechnique(chemin?: string): ContexteTechnique {
  const w = globalThis.window;
  return {
    viewport: w ? `${w.innerWidth}x${w.innerHeight} (dpr: ${Math.round((w.devicePixelRatio || 1) * 100) / 100})` : '',
    platform: plateformeSimple(),
    console_errors: erreursCapturees(chemin),
    stockage_cles: clesStockageSures(),
  };
}

/** Vrai seulement sur le Laboratoire (ou en essai local avec ?labo) : ailleurs, rien n'est envoyé. */
export function surLeLaboratoire(): boolean {
  const l = globalThis.location;
  return !!l && (/(^|\.)alphabette\.eu$/i.test(l.hostname) || new URLSearchParams(l.search).has('labo'));
}
