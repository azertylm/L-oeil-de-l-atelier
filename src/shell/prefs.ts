/**
 * Préférences de l'utilisateur partagées par tous les sites alphabette.fr.
 *
 * Chaque application vit sur son propre sous-domaine : le stockage du navigateur
 * (localStorage) n'est donc pas partagé d'une application à l'autre. Pour qu'une
 * personne qui voit mal règle « BIG » une seule fois, les préférences d'interface
 * sont aussi écrites dans un petit cookie rattaché à tout le domaine
 * (`.alphabette.fr`). Il ne contient que des réglages choisis par l'utilisateur
 * (taille, jour/nuit, langue, favoris) : pas d'identifiant, pas de suivi.
 */
export interface Prefs {
  theme?: 'jour' | 'nuit';
  /** Taille de l'affichage (bouton BIG). */
  density?: 'normal' | 'large' | 'xlarge';
  lang?: 'fr' | 'en';
  simple?: boolean;
  /** Applications épinglées dans la barre (3 au maximum). */
  favoris?: string[];
  /** Nouveautés déjà vues. */
  vus?: string[];
}

const COOKIE = 'ab_prefs';
const CLE_LOCALE = 'alphabette.prefs';

function domaineCommun(): string | null {
  if (typeof location === 'undefined') return null;
  const m = location.hostname.match(/(?:^|\.)(alphabette\.(?:fr|eu))$/);
  return m ? `.${m[1]}` : null;
}

function lireCookie(): Prefs | null {
  try {
    const m = document.cookie.match(new RegExp(`(?:^|; )${COOKIE}=([^;]*)`));
    return m ? (JSON.parse(decodeURIComponent(m[1])) as Prefs) : null;
  } catch {
    return null;
  }
}

export function lirePrefs(): Prefs {
  if (typeof document === 'undefined') return {};
  const cookie = lireCookie();
  if (cookie) return cookie;
  try {
    return JSON.parse(localStorage.getItem(CLE_LOCALE) || '{}') as Prefs;
  } catch {
    return {};
  }
}

export function ecrirePrefs(changement: Partial<Prefs>): Prefs {
  const prefs = { ...lirePrefs(), ...changement };
  if (typeof document === 'undefined') return prefs;
  const json = JSON.stringify(prefs);
  try {
    localStorage.setItem(CLE_LOCALE, json);
  } catch {
    /* stockage indisponible (navigation privée) : le cookie suffit. */
  }
  try {
    const domaine = domaineCommun();
    const secure = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie =
      `${COOKIE}=${encodeURIComponent(json)}; Path=/; Max-Age=31536000; SameSite=Lax${secure}` +
      (domaine ? `; Domain=${domaine}` : '');
  } catch {
    /* cookies refusés : on garde le réglage de cette page seulement. */
  }
  return prefs;
}
