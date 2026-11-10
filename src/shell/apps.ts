import { DEFAULT_SITES } from './sites';
import type { AlphaSite } from './config';
import { APPS_PATH } from './pricing';

/**
 * Une application publiée par le hub (registre central des 16 applications).
 * La base commune s'en sert pour le panneau « Les applications de
 * l'écosystème » et pour le compteur de la barre nº 1.
 */
export interface EcosystemApp {
  /** Identifiant technique (slug). */
  key: string;
  /** Nom affiché. */
  name: string;
  /** Adresse publique, si l'application est en ligne. */
  url?: string;
  /** Emoji éventuel (les 5 sites mis en avant en ont un). */
  icon?: string;
  /** Badge commercial (« Nouveau », « Populaire »). */
  badge?: string | null;
  /** Statut du registre : actif, brouillon, maintenance. */
  status?: string;
  /** Application gratuite, publiée ainsi par le hub. */
  gratuit?: boolean;
}

/**
 * Liste de repli : les 5 sites mis en avant. Elle sert quand le hub n'est pas
 * joignable (hors-ligne, développement local, CORS), pour que le panneau ne
 * soit jamais vide.
 */
export function appsDeSecours(): EcosystemApp[] {
  return DEFAULT_SITES.map((site) => ({
    key: site.key,
    name: site.label,
    url: site.url,
    icon: site.icon,
    status: 'actif',
  }));
}

/** Table inverse de Windows-1252 (les 32 caractères de 0x80 à 0x9F). */
const CP1252_INVERSE: Record<number, number> = {
  0x20ac: 0x80, 0x201a: 0x82, 0x0192: 0x83, 0x201e: 0x84, 0x2026: 0x85,
  0x2020: 0x86, 0x2021: 0x87, 0x02c6: 0x88, 0x2030: 0x89, 0x0160: 0x8a,
  0x2039: 0x8b, 0x0152: 0x8c, 0x017d: 0x8e, 0x2018: 0x91, 0x2019: 0x92,
  0x201c: 0x93, 0x201d: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97,
  0x02dc: 0x98, 0x2122: 0x99, 0x0161: 0x9a, 0x203a: 0x9b, 0x0153: 0x9c,
  0x017e: 0x9e, 0x0178: 0x9f,
};

/**
 * Répare un texte « doublement encodé » : « Ã‰CO-DIAG » → « ÉCO-DIAG ».
 *
 * Certaines entrées du registre ont été écrites en UTF-8 puis relues en
 * Windows-1252 (ou l'inverse). Plutôt que de corriger les données du hub, on
 * défait la transformation à la lecture — et seulement quand elle est
 * identifiable : un texte déjà propre n'est jamais touché, et un résultat
 * douteux (caractère de remplacement) est écarté.
 */
export function reparerTexte(texte: string): string {
  // Optimisation : un texte purement ASCII ne peut pas être mal encodé.
  if (!/[\u00a0-\u00ff\u2018-\u2122]/.test(texte)) return texte;
  const octets: number[] = [];
  for (const caractere of texte) {
    const point = caractere.codePointAt(0) ?? 0;
    octets.push(CP1252_INVERSE[point] ?? (point <= 0xff ? point : 0x3f));
  }
  try {
    // `fatal: true` est le garde-fou : un texte DÉJÀ propre (« ÉCO ») produit
    // une suite d'octets qui n'est pas de l'UTF-8 valide et lève une erreur,
    // donc il reste intact. Seul un vrai double encodage passe.
    const candidat = new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(octets));
    return candidat.includes('\uFFFD') ? texte : candidat;
  } catch {
    return texte;
  }
}

interface ReponseHub {
  apps?: Array<{
    id?: string;
    slug?: string;
    name?: string;
    url?: string;
    badge?: string | null;
    status?: string;
    gratuit?: boolean;
  }>;
}

/**
 * D'où vient la liste : du hub, ou de la liste de secours locale.
 */
export type RegistreSource = 'hub' | 'repli';

export interface RegistreApps {
  apps: EcosystemApp[];
  source: RegistreSource;
}

/** Lit la liste de secours seule (5 sites mis en avant). */
export function registreDeSecours(): RegistreApps {
  return { apps: appsDeSecours(), source: 'repli' };
}

/**
 * Lit le registre public du hub (`GET /api/apps`).
 * En cas d'échec, retourne la liste de secours : la base reste utilisable, et
 * `source` permet de dire honnêtement à l'utilisateur ce qui s'est passé.
 */
export async function loadEcosystemRegistry(hubUrl: string): Promise<RegistreApps> {
  try {
    // hubUrl vide = même origine (développement, relayé par Vite).
    const base = hubUrl.replace(/\/$/, '');
    const res = await fetch(`${base}${APPS_PATH}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    if (!(res.headers.get('content-type') ?? '').includes('json')) throw new Error('réponse non JSON');
    const data = (await res.json()) as ReponseHub;
    const apps = (data.apps ?? [])
      .filter((app) => typeof app?.name === 'string' && app.name.trim())
      .map<EcosystemApp>((app) => ({
        key: String(app.slug ?? app.id ?? app.name),
        name: reparerTexte(String(app.name).trim()),
        url: app.url,
        badge: app.badge ? reparerTexte(app.badge) : null,
        status: app.status,
        gratuit: app.gratuit === true,
      }));
    if (!apps.length) throw new Error('registre vide');
    return { apps, source: 'hub' };
  } catch {
    return registreDeSecours();
  }
}

/**
 * Synchronise la liste mise en avant (les 5 sites) avec le registre central
 * du hub : ici et nulle part ailleurs vit l'adresse publique de chaque
 * application.
 *
 * Règles :
 *  - si le registre connaît le site (même `key`), son URL et son statut
 *    remplacent la copie locale : le registre fait foi ;
 *  - si le registre ne le connaît pas (hub injoignable, liste de secours),
 *    la copie locale reste intacte : la barre ne doit jamais être vide.
 */
export function synchroniserSites(sites: AlphaSite[], apps: EcosystemApp[]): AlphaSite[] {
  const registre = new Map(apps.map((app) => [app.key, app]));
  return sites.map((site) => {
    const app = registre.get(site.key);
    if (!app || !app.url) return site;
    return { ...site, url: app.url, status: app.status ?? site.status };
  });
}

/** Version simple : la liste seule. */
export async function loadEcosystemApps(hubUrl: string): Promise<EcosystemApp[]> {
  return (await loadEcosystemRegistry(hubUrl)).apps;
}
