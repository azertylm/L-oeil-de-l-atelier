import { useCallback, useEffect, useState } from 'react';

/** Thème de l'interface : « jour » (clair) ou « nuit » (sombre). */
export type ShellTheme = 'jour' | 'nuit';

/** Trois crans de densité, pilotés par le bouton « BIG ». */
export type ShellDensity = 'compact' | 'normal' | 'large';

export const DENSITY_ORDER: ShellDensity[] = ['compact', 'normal', 'large'];
export const DENSITY_LABELS: Record<ShellDensity, string> = {
  compact: 'Compact',
  normal: 'Normal',
  large: 'Grand',
};

const THEME_KEY = 'alphabette.shell.theme';
const DENSITY_KEY = 'alphabette.shell.density';

function readStored<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  try {
    const value = localStorage.getItem(key) as T | null;
    return value && allowed.includes(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function writeStored(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* mode privé / stockage indisponible : on ignore. */
  }
}

/**
 * Le thème est écrit sur `<html data-ab-theme="jour|nuit">` (et non seulement
 * sur `.ab-shell`) : ainsi l'application hôte peut adapter SA propre charte avec
 * un simple sélecteur CSS `[data-ab-theme='jour']`, sans rien recevoir en props.
 * On renseigne aussi `color-scheme`, ce qui met les champs de saisie, les
 * ascenseurs et les contrastes automatiques du navigateur dans le bon mode.
 */
export function appliquerThemeAuDocument(theme: ShellTheme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.dataset.abTheme = theme;
  root.style.colorScheme = theme === 'nuit' ? 'dark' : 'light';
}

/** La densité est écrite sur `<html data-ab-density>` : elle pilote la taille de base. */
export function appliquerDensiteAuDocument(density: ShellDensity) {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.abDensity = density;
}

/** Préférence système de l'utilisateur (utilisée si rien n'est mémorisé). */
export function themeDuSysteme(): ShellTheme {
  if (typeof window === 'undefined' || !window.matchMedia) return 'jour';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'nuit' : 'jour';
}

/** Thème jour / nuit, mémorisé et appliqué à la page entière. */
export function useTheme(initial?: ShellTheme) {
  const [theme, setThemeState] = useState<ShellTheme>(() =>
    readStored<ShellTheme>(THEME_KEY, ['jour', 'nuit'], initial ?? themeDuSysteme()),
  );

  // À chaque rendu, on s'assure que le document porte bien le thème courant.
  useEffect(() => {
    appliquerThemeAuDocument(theme);
  }, [theme]);

  const setTheme = useCallback((next: ShellTheme) => {
    setThemeState(next);
    writeStored(THEME_KEY, next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: ShellTheme = prev === 'jour' ? 'nuit' : 'jour';
      writeStored(THEME_KEY, next);
      return next;
    });
  }, []);

  return { theme, setTheme, toggleTheme };
}

/** Densité d'affichage à 3 crans, mémorisée et appliquée à la page entière. */
export function useDensity(initial: ShellDensity = 'normal') {
  const [density, setDensityState] = useState<ShellDensity>(() =>
    readStored<ShellDensity>(DENSITY_KEY, DENSITY_ORDER, initial),
  );

  useEffect(() => {
    appliquerDensiteAuDocument(density);
  }, [density]);

  const setDensity = useCallback((next: ShellDensity) => {
    setDensityState(next);
    writeStored(DENSITY_KEY, next);
  }, []);

  /** Passe au cran suivant : compact → normal → large → compact. */
  const cycleDensity = useCallback(() => {
    setDensityState((prev) => {
      const next = DENSITY_ORDER[(DENSITY_ORDER.indexOf(prev) + 1) % DENSITY_ORDER.length];
      writeStored(DENSITY_KEY, next);
      return next;
    });
  }, []);

  return { density, setDensity, cycleDensity };
}

/* ---------------------------------------------------------------------------
   Plein écran
   ---------------------------------------------------------------------------
   Deux régimes, dans cet ordre :
   1. le vrai plein écran du navigateur (API Fullscreen) ;
   2. le « mode immersion » de la base : les deux barres disparaissent et le
      contenu occupe tout l'écran. Il sert de repli quand l'API est refusée
      (page affichée dans un cadre, navigateur mobile sans support…), pour que
      le bouton ne reste JAMAIS sans effet.
--------------------------------------------------------------------------- */

type ElementPleinEcran = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
  msRequestFullscreen?: () => Promise<void> | void;
};

type DocumentPleinEcran = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
  msExitFullscreen?: () => Promise<void> | void;
};

function pleinEcranActif(): boolean {
  if (typeof document === 'undefined') return false;
  const doc = document as DocumentPleinEcran;
  return Boolean(doc.fullscreenElement ?? doc.webkitFullscreenElement);
}

export function useFullscreen() {
  const [natif, setNatif] = useState<boolean>(() => pleinEcranActif());
  const [immersion, setImmersion] = useState<boolean>(false);

  useEffect(() => {
    const lire = () => setNatif(pleinEcranActif());
    lire();
    document.addEventListener('fullscreenchange', lire);
    document.addEventListener('webkitfullscreenchange', lire);
    return () => {
      document.removeEventListener('fullscreenchange', lire);
      document.removeEventListener('webkitfullscreenchange', lire);
    };
  }, []);

  // En mode immersion, Échap rend la main (comme le vrai plein écran).
  useEffect(() => {
    if (!immersion) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setImmersion(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [immersion]);

  const toggleFullscreen = useCallback(async () => {
    if (typeof document === 'undefined') return;
    const doc = document as DocumentPleinEcran;
    const cible = document.documentElement as ElementPleinEcran;
    const demander =
      cible.requestFullscreen?.bind(cible) ??
      cible.webkitRequestFullscreen?.bind(cible) ??
      cible.msRequestFullscreen?.bind(cible);
    const quitter =
      doc.exitFullscreen?.bind(doc) ?? doc.webkitExitFullscreen?.bind(doc) ?? doc.msExitFullscreen?.bind(doc);

    try {
      if (pleinEcranActif()) {
        await quitter?.();
        setImmersion(false);
        return;
      }
      if (!demander) {
        // Navigateur sans API (iOS Safari…) : on bascule en mode immersion.
        setImmersion((valeur) => !valeur);
        return;
      }

      /*
       * On n'attend pas la promesse indéfiniment : certains navigateurs la
       * laissent EN SUSPENS quand le geste utilisateur manque (ou dans un
       * cadre), au lieu de la rejeter. Sans ce garde-temps, le bouton
       * paraîtrait mort. Au bout de 500 ms sans plein écran effectif, on
       * bascule en mode immersion — le bouton a donc toujours un effet.
       */
      const resultat = demander({ navigationUI: 'hide' });
      const issue =
        resultat && typeof (resultat as Promise<void>).then === 'function'
          ? await Promise.race([
              (resultat as Promise<void>).then(() => 'ok').catch(() => 'refus'),
              new Promise<'delai'>((resoudre) => setTimeout(() => resoudre('delai'), 500)),
            ])
          : 'ok';

      if (issue === 'ok' || pleinEcranActif()) {
        setImmersion(false);
        return;
      }
      setImmersion((valeur) => !valeur);
    } catch {
      // Refusé (cadre sans autorisation, geste manquant…) : mode immersion.
      setImmersion((valeur) => !valeur);
    }
  }, []);

  return {
    /** Vrai dès qu'on est agrandi, quel que soit le régime. */
    isFullscreen: natif || immersion,
    /** Vrai si c'est le vrai plein écran du navigateur. */
    isNativeFullscreen: natif,
    /** Vrai si l'on est en mode immersion (repli sans API). */
    isImmersion: immersion,
    toggleFullscreen,
  };
}

/** Applique la couleur d'identité du site sur un élément racine. */
export function applyAccent(accent: string | undefined, root?: HTMLElement | null) {
  const target = root ?? (typeof document !== 'undefined' ? document.documentElement : null);
  if (!target) return;
  if (accent) target.style.setProperty('--ab-accent', accent);
}
