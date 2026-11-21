/**
 * @file ia/routeurByok.ts
 * Routeur « Bring Your Own Key » résilient, commun aux applis Alphabette (navigateur) et aux scripts
 * des agents (Node 18+). Un seul appel pour 6 fournisseurs : Gemini, Mistral, Claude, OpenAI,
 * DeepSeek, Grok. Les clés sont celles de l'utilisateur ; elles ne partent que vers leur fournisseur.
 *
 *   const r = await appelerIA(
 *     { systeme: 'Tu es…', messages: [{ role: 'user', contenu: 'Bonjour' }] },
 *     { chaine: [{ fournisseur: 'mistral', cle }, { fournisseur: 'gemini', cle: cle2 }],
 *       onBascule: (b) => afficher(b.message) },
 *   );
 *   r.texte, r.fournisseur, r.modele, r.bascules
 *
 * Bascule (failover) vers le maillon suivant de la chaîne, configurée par l'utilisateur, si :
 *   429 (quota / trop de requêtes) · 401 / 403 (clé refusée) · 5xx et 529 (panne du fournisseur) ·
 *   404 (modèle inconnu) · délai dépassé ou réseau injoignable.
 * Une erreur 400 (requête mal formée) ne bascule PAS : c'est un vrai bug de l'appli, à signaler.
 *
 * Chaque bascule est un « Incident API Tiers » : message pédagogique pour l'utilisateur, événement
 * `alphabette:incident-api`, trace dans sessionStorage. Le capteur d'erreurs et le module d'avis du
 * Laboratoire les reconnaissent : ils ne deviennent jamais des tickets de bug de l'application.
 */

export type Fournisseur = 'gemini' | 'mistral' | 'claude' | 'openai' | 'deepseek' | 'grok';
export type TypeIncident = 'quota' | 'cle_invalide' | 'panne' | 'modele_inconnu' | 'reseau';

export interface MaillonIA {
  fournisseur: Fournisseur;
  /** Clé de l'utilisateur (jamais stockée ni journalisée ici). */
  cle: string;
  /** Modèle ; à défaut, MODELES_PAR_DEFAUT. */
  modele?: string;
  /** Adresse compatible (ex. Mistral auto-hébergé, Ollama) ; à défaut celle du fournisseur. */
  baseUrl?: string;
}

export interface MessageIA { role: 'user' | 'assistant'; contenu: string }
export interface RequeteIA {
  systeme?: string;
  messages: MessageIA[];
  temperature?: number;
  maxTokens?: number;
  /** Demande une réponse JSON (quand le fournisseur sait le garantir). */
  json?: boolean;
}

export interface Bascule {
  de: Fournisseur;
  vers: Fournisseur | null;
  type: TypeIncident;
  statut: number | null;
  /** Message clair, en français, à montrer à l'utilisateur. */
  message: string;
}

export interface ReponseIA { texte: string; fournisseur: Fournisseur; modele: string; bascules: Bascule[] }

export interface OptionsRouteur {
  chaine: MaillonIA[];
  onBascule?: (b: Bascule) => void;
  /** Délai par fournisseur (ms), 60 000 par défaut. */
  delaiMs?: number;
  signal?: AbortSignal;
}

/** Modèles proposés par défaut (modifiables par l'utilisateur ; listes vérifiées en novembre 2026). */
export const MODELES_PAR_DEFAUT: Record<Fournisseur, string> = {
  gemini: 'gemini-flash-latest',
  mistral: 'mistral-small-latest',
  claude: 'claude-haiku-5-5',
  openai: 'gpt-6-luna',
  deepseek: 'deepseek-chat',
  grok: 'grok-4.3',
};

export const NOMS_FOURNISSEURS: Record<Fournisseur, string> = {
  gemini: 'Gemini (Google)', mistral: 'Mistral AI', claude: 'Claude (Anthropic)',
  openai: 'OpenAI', deepseek: 'DeepSeek', grok: 'Grok (xAI)',
};

/** Seuls domaines contactés par le routeur (repris par l'audit réseau zéro connaissance). */
export const DOMAINES_FOURNISSEURS: Record<Fournisseur, string> = {
  gemini: 'generativelanguage.googleapis.com',
  mistral: 'api.mistral.ai',
  claude: 'api.anthropic.com',
  openai: 'api.openai.com',
  deepseek: 'api.deepseek.com',
  grok: 'api.x.ai',
};

const BASES: Record<Fournisseur, string> = {
  gemini: 'https://generativelanguage.googleapis.com/v1beta',
  mistral: 'https://api.mistral.ai/v1',
  claude: 'https://api.anthropic.com/v1',
  openai: 'https://api.openai.com/v1',
  deepseek: 'https://api.deepseek.com/v1',
  grok: 'https://api.x.ai/v1',
};

export const MARQUEUR_INCIDENT = '[Incident API Tiers]';

/** Erreur levée quand toute la chaîne a échoué sur des incidents de fournisseurs. */
export class IncidentApiTiers extends Error {
  readonly code = 'INCIDENT_API_TIERS';
  constructor(readonly bascules: Bascule[]) {
    super(`${MARQUEUR_INCIDENT} ${bascules.map((b) => `${b.de}:${b.type}`).join(', ')} — ${bascules[bascules.length - 1]?.message ?? ''}`);
    this.name = 'IncidentApiTiers';
  }
}

/** Erreur propre à la requête (400…) : c'est un bug de l'appli, pas du fournisseur. */
export class ErreurRequeteIA extends Error {
  constructor(readonly fournisseur: Fournisseur, readonly statut: number, detail: string) {
    super(`Requête refusée par ${NOMS_FOURNISSEURS[fournisseur]} (${statut}) : ${detail}`);
    this.name = 'ErreurRequeteIA';
  }
}

/* ------------------------------------------------------------------ */

export function classerStatut(statut: number | null): TypeIncident | null {
  if (statut === null) return 'reseau';
  if (statut === 429) return 'quota';
  if (statut === 401 || statut === 403) return 'cle_invalide';
  if (statut === 404) return 'modele_inconnu';
  if (statut >= 500) return 'panne'; // 500, 502, 503, 504, 529 (surcharge Anthropic)
  return null;
}

export function messagePedagogique(type: TypeIncident, de: Fournisseur, vers: Fournisseur | null): string {
  const f = NOMS_FOURNISSEURS[de];
  const cause = {
    quota: `${f} indique que le quota de votre clé est atteint (trop de demandes ou crédit épuisé). Ce n'est pas une panne de l'application : le compteur se remet en général à zéro après quelques minutes, ou à la recharge de votre compte ${f}.`,
    cle_invalide: `${f} refuse votre clé (clé erronée, expirée ou sans droits). Vérifiez-la dans les réglages de l'application ; elle reste dans votre navigateur.`,
    panne: `${f} rencontre une panne ou une surcharge de son côté. Ce n'est pas l'application : réessayez un peu plus tard.`,
    modele_inconnu: `${f} ne connaît pas le modèle demandé (renommé ou retiré). Choisissez-en un autre dans les réglages.`,
    reseau: `${f} ne répond pas (connexion coupée ou délai dépassé).`,
  }[type];
  return vers ? `${cause} La réponse est demandée à ${NOMS_FOURNISSEURS[vers]}, votre IA de secours.` : `${cause} Aucune IA de secours n'est configurée ou disponible.`;
}

/** Trace locale (session) et événement pour l'interface et le capteur d'erreurs. */
function signalerIncident(b: Bascule) {
  const g = globalThis as unknown as { sessionStorage?: Storage; dispatchEvent?: (e: Event) => boolean; CustomEvent?: typeof CustomEvent };
  try {
    if (g.sessionStorage) {
      const l = JSON.parse(g.sessionStorage.getItem('alphabette_incidents_api') || '[]') as unknown[];
      g.sessionStorage.setItem('alphabette_incidents_api', JSON.stringify([...l, { t: Date.now(), de: b.de, type: b.type, statut: b.statut }].slice(-10)));
    }
    if (g.dispatchEvent && g.CustomEvent) g.dispatchEvent(new g.CustomEvent('alphabette:incident-api', { detail: b }));
  } catch { /* jamais bloquer l'appel */ }
}

/** Dernier incident fournisseur de la session, s'il date de moins de `minutes`. */
export function incidentRecent(minutes = 15): { t: number; de: Fournisseur; type: TypeIncident; statut: number | null } | null {
  try {
    const l = JSON.parse(sessionStorage.getItem('alphabette_incidents_api') || '[]');
    const d = l[l.length - 1];
    return d && Date.now() - d.t < minutes * 60e3 ? d : null;
  } catch { return null; }
}

export function ecouterIncidents(cb: (b: Bascule) => void): () => void {
  const f = (e: Event) => cb((e as CustomEvent<Bascule>).detail);
  globalThis.addEventListener?.('alphabette:incident-api', f);
  return () => globalThis.removeEventListener?.('alphabette:incident-api', f);
}

/* ------------------------------------------------------------------ */

interface Preparee { url: string; init: RequestInit; lire: (d: any) => string }

function preparer(m: MaillonIA, r: RequeteIA): Preparee {
  const modele = m.modele || MODELES_PAR_DEFAUT[m.fournisseur];
  const base = (m.baseUrl || BASES[m.fournisseur]).replace(/\/$/, '');
  const max = r.maxTokens ?? 1024;
  if (m.fournisseur === 'gemini') {
    return {
      url: `${base}/models/${encodeURIComponent(modele)}:generateContent`,
      init: {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': m.cle },
        body: JSON.stringify({
          ...(r.systeme ? { systemInstruction: { parts: [{ text: r.systeme }] } } : {}),
          contents: r.messages.map((x) => ({ role: x.role === 'assistant' ? 'model' : 'user', parts: [{ text: x.contenu }] })),
          generationConfig: { maxOutputTokens: max, ...(r.temperature != null ? { temperature: r.temperature } : {}), ...(r.json ? { responseMimeType: 'application/json' } : {}) },
        }),
      },
      lire: (d) => (d.candidates?.[0]?.content?.parts ?? []).map((p: { text?: string }) => p.text ?? '').join(''),
    };
  }
  if (m.fournisseur === 'claude') {
    return {
      url: `${base}/messages`,
      init: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 'x-api-key': m.cle, 'anthropic-version': '2023-06-01',
          // Appel direct depuis le navigateur avec la clé de l'utilisateur (BYOK).
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: modele, max_tokens: max, ...(r.systeme ? { system: r.systeme } : {}),
          ...(r.temperature != null ? { temperature: r.temperature } : {}),
          messages: r.messages.map((x) => ({ role: x.role, content: x.contenu })),
        }),
      },
      lire: (d) => (d.content ?? []).filter((c: { type: string }) => c.type === 'text').map((c: { text: string }) => c.text).join(''),
    };
  }
  // Format « chat/completions » : Mistral, OpenAI, DeepSeek, Grok.
  const messages = [...(r.systeme ? [{ role: 'system', content: r.systeme }] : []), ...r.messages.map((x) => ({ role: x.role, content: x.contenu }))];
  const openai = m.fournisseur === 'openai';
  return {
    url: `${base}/chat/completions`,
    init: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${m.cle}` },
      body: JSON.stringify({
        model: modele, messages,
        ...(openai ? { max_completion_tokens: max } : { max_tokens: max }),
        ...(r.temperature != null && !openai ? { temperature: r.temperature } : {}),
        ...(r.json ? { response_format: { type: 'json_object' } } : {}),
      }),
    },
    lire: (d) => d.choices?.[0]?.message?.content ?? '',
  };
}

/** Appel avec bascule automatique sur la chaîne de secours configurée par l'utilisateur. */
export async function appelerIA(requete: RequeteIA, options: OptionsRouteur): Promise<ReponseIA> {
  const chaine = options.chaine.filter((m) => m && m.cle && m.cle.trim());
  if (!chaine.length) throw new ErreurRequeteIA('mistral', 0, "aucune clé d'IA n'est configurée");
  const bascules: Bascule[] = [];
  for (let i = 0; i < chaine.length; i++) {
    const m = chaine[i];
    const p = preparer(m, requete);
    let statut: number | null = null;
    let corps: any = null;
    try {
      const signaux = [AbortSignal.timeout(options.delaiMs ?? 60000), options.signal].filter(Boolean) as AbortSignal[];
      const signal = signaux.length > 1 && 'any' in AbortSignal ? (AbortSignal as any).any(signaux) : signaux[0];
      const rep = await fetch(p.url, { ...p.init, signal });
      statut = rep.status;
      corps = await rep.json().catch(() => null);
      if (rep.ok) {
        const texte = p.lire(corps);
        return { texte, fournisseur: m.fournisseur, modele: m.modele || MODELES_PAR_DEFAUT[m.fournisseur], bascules };
      }
    } catch (e) {
      if (options.signal?.aborted) throw e; // annulé par l'appli : on s'arrête
      statut = null; // réseau ou délai dépassé
    }
    const type = classerStatut(statut);
    if (!type) {
      // 400 & co : la requête elle-même est en cause (bug de l'appli), aucune bascule.
      const detail = String(corps?.error?.message ?? corps?.message ?? corps?.detail ?? 'requête invalide').slice(0, 200);
      throw new ErreurRequeteIA(m.fournisseur, statut ?? 0, detail);
    }
    const suivant = chaine[i + 1]?.fournisseur ?? null;
    const b: Bascule = { de: m.fournisseur, vers: suivant, type, statut, message: messagePedagogique(type, m.fournisseur, suivant) };
    bascules.push(b);
    signalerIncident(b);
    options.onBascule?.(b);
  }
  throw new IncidentApiTiers(bascules);
}

/* ------------- Réglages de l'utilisateur (navigateur uniquement) ------------- */

const CLE_REGLAGES = 'alphabette.ia.chaine';

/** Chaîne principale + secours enregistrée dans ce navigateur (jamais envoyée ailleurs). */
export function lireChaineIA(): MaillonIA[] {
  try { return JSON.parse(localStorage.getItem(CLE_REGLAGES) || '[]'); } catch { return []; }
}
export function enregistrerChaineIA(chaine: MaillonIA[]) {
  try { localStorage.setItem(CLE_REGLAGES, JSON.stringify(chaine.slice(0, 4))); } catch { /* rien */ }
}
