/**
 * Tarification officielle ALPHABETTE.
 *
 * Règle du jeu (décidée avec le créateur du projet) :
 *  - 15 € par application et par an ;
 *  - 40 € pour tout l'écosystème et par an ;
 *  - 7 jours d'essai offerts, clé Mistral Alphabette incluse.
 *
 * Ces valeurs remplacent les anciennes formules (39/59/99/199 €). Le hub les
 * publie sur /api/config.json : la base les récupère pour rester synchronisée
 * sans redéploiement.
 */
export const PRICING = {
  currency: 'EUR',
  /** 15 € / application / an. */
  perAppPerYear: 15,
  /** 40 € / écosystème complet / an. */
  ecosystemPerYear: 40,
  /** 7 jours d'essai offerts. */
  trialDays: 7,
} as const;

/** Liens de paiement par défaut (remplacés par ceux du hub si disponibles). */
export const DEFAULT_PAYMENT_LINKS = {
  perApp: 'https://buy.stripe.com/alphabette_app_15',
  ecosystem: 'https://buy.stripe.com/alphabette_ecosystem_40',
} as const;

/** Hub central : source de vérité des tarifs et des liens de paiement. */
export const HUB_URL = 'https://alphabette.fr';

/**
 * Adresse du hub retenue par l'application : `VITE_HUB_URL` si l'application
 * la définit, sinon la valeur fournie (défaut : alphabette.fr).
 */
export function resolveHubUrl(fallback: string = HUB_URL): string {
  const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
  return env?.VITE_HUB_URL || fallback;
}

/** Vrai lorsque l'application tourne en développement local. */
export function isLocalDev(): boolean {
  if (typeof location === 'undefined') return false;
  return /^(localhost|127\.0\.0\.1|\[::1\])$/i.test(location.hostname);
}

/** Vrai si l'application a explicitement défini VITE_HUB_URL. */
export function hasEnvHubUrl(): boolean {
  const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
  return Boolean(env?.VITE_HUB_URL);
}

/** Endpoint public de configuration commerciale. */
export const CONFIG_PATH = '/api/config.json';

/** Endpoint public du registre des applications. */
export const APPS_PATH = '/api/apps';

/**
 * Adresse à interroger pour le REGISTRE des applications.
 *
 *  · en production : le hub (`https://alphabette.fr`) ;
 *  · en développement sans `VITE_HUB_URL` : on reste sur l'origine du serveur
 *    de développement (`/api/apps`), que `vite.config.ts` relaie vers le hub
 *    local (port 3000) — pas de CORS, et le vrai registre s'affiche.
 *
 * Si le hub n'est pas lancé, la liste de secours prend le relais sans bruit.
 */
export function resolveAppsHubUrl(hubUrl: string = HUB_URL): string {
  const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
  if (env?.VITE_HUB_URL) return env.VITE_HUB_URL;
  if (isLocalDev()) return '';
  return hubUrl;
}

export interface ShellPromotion {
  isActive: boolean;
  badgeLabel?: string;
  discountPercent?: number;
  couponCode?: string;
  description?: string;
  expiresAt?: string;
}

/**
 * Espace dons publié par le hub (`data/donation.json`, relayé dans
 * `/api/config.json`) : coordonnées bancaires pour un virement direct (0 % de
 * frais) et offre « Membre fondateur » à places limitées.
 */
export interface ShellDonation {
  /** Banque affichée (ex. « Société Générale »). */
  banque?: string;
  /** Titulaire du compte. */
  titulaire?: string;
  /** Agence / domiciliation du compte. */
  domiciliation?: string;
  codeBanque?: string;
  codeGuichet?: string;
  numeroCompte?: string;
  cleRib?: string;
  /** IBAN complet (copiable). */
  iban?: string;
  /** BIC / SWIFT (copiable). */
  bic?: string;
  /** Adresse e-mail à prévenir après le virement. */
  contact?: string;
  /** Libellé à mettre en objet du virement. */
  objetVirement?: string;
  /** Nombre de places de membre fondateur, au total et déjà attribuées. */
  placeMax?: number;
  placesAttribuees?: number;
  montantMinimum?: number;
  montants?: number[];
  /** Ce que le don ouvre, à vie. */
  contreparties?: string[];
  /**
   * Vrai tant que les coordonnées bancaires sont des exemples : la base
   * l'affiche alors en clair plutôt que de laisser croire à un vrai RIB.
   */
  exemple?: boolean;
}

export interface ShellConfig {
  currency: string;
  perAppPerYear: number;
  ecosystemPerYear: number;
  /** Jours d'essai offerts (7 par défaut). */
  trialDays: number;
  paymentLinks: { perApp: string; ecosystem: string };
  /** Promotion en cours publiée par le hub (facultative). */
  promotion?: ShellPromotion;
  /** Espace dons (RIB + membre fondateur) publié par le hub (facultatif). */
  donation?: ShellDonation;
}

/** Configuration de secours, utilisée si le hub est injoignable. */
export const FALLBACK_CONFIG: ShellConfig = {
  currency: PRICING.currency,
  perAppPerYear: PRICING.perAppPerYear,
  ecosystemPerYear: PRICING.ecosystemPerYear,
  trialDays: PRICING.trialDays,
  paymentLinks: { ...DEFAULT_PAYMENT_LINKS },
};

interface HubCommercialConfig {
  currency?: string;
  pricing?: {
    perApp?: number;
    ecosystem?: number;
    trialDays?: number;
    singleApp?: { byok?: number; managed?: number };
    bouquet?: { byok?: number; managed?: number };
  };
  activePromotion?: ShellPromotion;
  stripePaymentLinks?: Record<string, string>;
  donation?: ShellDonation;
}

/** Nettoie une chaîne venue du registre (BOM, espaces parasites). */
function texte(v: unknown): string | undefined {
  if (typeof v !== 'string') return undefined;
  const t = v.replace(/^\uFEFF/, '').trim();
  return t.length ? t : undefined;
}

/** Nettoie une liste de textes. */
function textes(v: unknown): string[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const liste = v.map((x) => texte(x)).filter((x): x is string => Boolean(x));
  return liste.length ? liste : undefined;
}

/**
 * Normalise le bloc « donation » du hub. Seules les valeurs réellement
 * renseignées sont conservées : sans RIB ni IBAN publié, la base retombe sur
 * l'espace dons simple.
 */
function lireDonation(brut: unknown): ShellDonation | undefined {
  if (!brut || typeof brut !== 'object') return undefined;
  const d = brut as Record<string, unknown>;
  const nombre = (v: unknown): number | undefined =>
    typeof v === 'number' && Number.isFinite(v) ? v : undefined;
  const donation: ShellDonation = {
    banque: texte(d.banque),
    titulaire: texte(d.titulaire),
    domiciliation: texte(d.domiciliation),
    codeBanque: texte(d.codeBanque),
    codeGuichet: texte(d.codeGuichet),
    numeroCompte: texte(d.numeroCompte),
    cleRib: texte(d.cleRib),
    iban: texte(d.iban),
    bic: texte(d.bic),
    contact: texte(d.contact),
    objetVirement: texte(d.objetVirement),
    placeMax: nombre(d.placeMax),
    placesAttribuees: nombre(d.placesAttribuees),
    montantMinimum: nombre(d.montantMinimum),
    montants: Array.isArray(d.montants)
      ? d.montants.filter((m): m is number => typeof m === 'number' && m > 0)
      : undefined,
    contreparties: textes(d.contreparties),
    exemple: d.exemple === true,
  };
  if (!donation.iban && !donation.titulaire) return undefined;
  return donation;
}

/**
 * Lit la configuration commerciale du hub. En cas d'échec (hors-ligne, CORS,
 * hub indisponible), retourne la configuration de secours : la base reste
 * toujours fonctionnelle.
 *
 * Les liens de paiement sont cherchés du plus précis au plus ancien, afin de
 * rester compatible avec toutes les versions du hub — et surtout pour que le
 * prix annoncé corresponde TOUJOURS au lien ouvert.
 */
export async function loadShellConfig(hubUrl: string = HUB_URL): Promise<ShellConfig> {
  try {
    const res = await fetch(`${hubUrl.replace(/\/$/, '')}${CONFIG_PATH}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as HubCommercialConfig;
    const links = data.stripePaymentLinks ?? {};
    const promotion = data.activePromotion;
    return {
      currency: data.currency ?? FALLBACK_CONFIG.currency,
      perAppPerYear:
        data.pricing?.perApp ?? data.pricing?.singleApp?.byok ?? FALLBACK_CONFIG.perAppPerYear,
      ecosystemPerYear:
        data.pricing?.ecosystem ?? data.pricing?.bouquet?.byok ?? FALLBACK_CONFIG.ecosystemPerYear,
      trialDays: data.pricing?.trialDays ?? FALLBACK_CONFIG.trialDays,
      paymentLinks: {
        perApp: links.perApp ?? links.single_app ?? links.single_byok ?? FALLBACK_CONFIG.paymentLinks.perApp,
        ecosystem:
          links.ecosystem ?? links.bouquet_integral ?? links.bouquet ?? FALLBACK_CONFIG.paymentLinks.ecosystem,
      },
      promotion:
        promotion && promotion.isActive
          ? {
              isActive: true,
              badgeLabel: promotion.badgeLabel,
              discountPercent: promotion.discountPercent,
              couponCode: promotion.couponCode,
              description: promotion.description,
              expiresAt: promotion.expiresAt,
            }
          : undefined,
      donation: lireDonation(data.donation),
    };
  } catch {
    return FALLBACK_CONFIG;
  }
}
