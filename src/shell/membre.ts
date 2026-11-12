/**
 * Inscription gratuite sur invitation, partagée par tous les sites alphabette.fr.
 *
 * On s'inscrit une fois sur https://alphabette.fr/inscription/ avec un prénom et
 * un code d'invitation. L'inscription est gardée dans ce navigateur : un petit
 * cookie rattaché à tout le domaine (`.alphabette.fr`), pour que chaque
 * application la reconnaisse, et une copie locale. Rien n'est envoyé à un
 * serveur. Sur un autre appareil, on entre à nouveau son code.
 *
 * Seule la page d'inscription vérifie les codes ; les applications ne font que
 * lire l'inscription pour afficher le prénom à la place de « S'abonner ».
 */
export type RoleMembre = 'fondateur' | 'ami' | 'invite';

export interface Membre {
  /** Prénom ou pseudo choisi à l'inscription. */
  prenom: string;
  role: RoleMembre;
  /** Date d'inscription (ISO). */
  depuis: string;
  /** Identifiant du code utilisé (jamais le code lui-même). */
  code: string;
}

const COOKIE = 'ab_membre';
const CLE_LOCALE = 'alphabette.membre';
/** 400 jours : la durée maximale qu'acceptent les navigateurs pour un cookie. */
const DUREE = 400 * 24 * 3600;

export const ADRESSE_INSCRIPTION = 'https://alphabette.fr/inscription/';

export const LIBELLE_ROLE: Record<RoleMembre, string> = {
  fondateur: 'Fondateur',
  ami: 'Ami(e) d’alphabette',
  invite: 'Invité(e)',
};

function domaineCommun(): string | null {
  if (typeof location === 'undefined') return null;
  const m = location.hostname.match(/(?:^|\.)(alphabette\.(?:fr|eu))$/);
  return m ? `.${m[1]}` : null;
}

function valide(m: unknown): m is Membre {
  const x = m as Membre;
  return Boolean(x && typeof x.prenom === 'string' && x.prenom.trim() && typeof x.role === 'string');
}

/** L'inscription de ce navigateur, ou null. */
export function lireMembre(): Membre | null {
  if (typeof document === 'undefined') return null;
  try {
    const c = document.cookie.match(new RegExp(`(?:^|; )${COOKIE}=([^;]*)`));
    if (c) {
      const m = JSON.parse(decodeURIComponent(c[1]));
      if (valide(m)) return m;
    }
  } catch {
    /* cookie illisible : on regarde la copie locale. */
  }
  try {
    const m = JSON.parse(localStorage.getItem(CLE_LOCALE) || 'null');
    return valide(m) ? m : null;
  } catch {
    return null;
  }
}

/** Écrit l'inscription (cookie de tout le domaine + copie locale). */
export function ecrireMembre(m: Membre): void {
  const json = JSON.stringify(m);
  try {
    localStorage.setItem(CLE_LOCALE, json);
  } catch {
    /* navigation privée : le cookie suffit. */
  }
  try {
    const domaine = domaineCommun();
    const secure = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie =
      `${COOKIE}=${encodeURIComponent(json)}; Path=/; Max-Age=${DUREE}; SameSite=Lax${secure}` +
      (domaine ? `; Domain=${domaine}` : '');
  } catch {
    /* cookies refusés : l'inscription ne vaut que pour ce site. */
  }
}

/** Retire l'inscription de ce navigateur. */
export function oublierMembre(): void {
  try {
    localStorage.removeItem(CLE_LOCALE);
  } catch {
    /* rien à faire */
  }
  try {
    const domaine = domaineCommun();
    document.cookie = `${COOKIE}=; Path=/; Max-Age=0; SameSite=Lax` + (domaine ? `; Domain=${domaine}` : '');
  } catch {
    /* rien à faire */
  }
}

/** Lien vers la page d'inscription, qui ramène ensuite à la page actuelle. */
export function lienInscription(): string {
  if (typeof location === 'undefined') return ADRESSE_INSCRIPTION;
  return `${ADRESSE_INSCRIPTION}?retour=${encodeURIComponent(location.href)}`;
}

/** « 12 novembre 2026 » */
export function dateLisible(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return '';
  }
}
