import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { EcosystemApp } from './apps';
import { traduire, type Langue } from './libelles';
import { ecrirePrefs, lirePrefs } from './prefs';

const MAX_FAVORIS = 3;

/* --------------------------------------------------------------- Favoris */

/** Applications épinglées dans la barre (3 au maximum, les plus récentes d'abord retirées). */
export function useFavoris() {
  const [favoris, setFavoris] = useState<string[]>(() => (lirePrefs().favoris ?? []).slice(0, MAX_FAVORIS));
  const basculer = useCallback((cle: string) => {
    setFavoris((prev) => {
      const suivant = prev.includes(cle) ? prev.filter((k) => k !== cle) : [...prev, cle].slice(-MAX_FAVORIS);
      ecrirePrefs({ favoris: suivant });
      return suivant;
    });
  }, []);
  return { favoris, basculer, estFavori: (cle: string) => favoris.includes(cle) };
}

/* ------------------------------------------------------------ Nouveautés */

/** Applications marquées « Nouveau » dans le registre, et celles que la personne n'a pas encore vues. */
export function useNouveautes(apps: EcosystemApp[], courante: string) {
  const [vus, setVus] = useState<string[]>(() => lirePrefs().vus ?? []);
  const nouvelles = useMemo(
    () => apps.filter((a) => a.badge === 'Nouveau' && a.key !== courante && a.url && (!a.status || a.status === 'actif')).slice(0, 6),
    [apps, courante],
  );
  const nonVues = nouvelles.filter((a) => !vus.includes(a.key)).length;
  const marquerVues = useCallback(() => {
    const tous = Array.from(new Set([...vus, ...nouvelles.map((a) => a.key)]));
    setVus(tous);
    ecrirePrefs({ vus: tous });
  }, [vus, nouvelles]);
  return { nouvelles, nonVues, marquerVues };
}

/* ------------------------------------------------------------------ Langue */

export function useLangue() {
  const [langue, setLangueEtat] = useState<Langue>(() => (lirePrefs().lang === 'en' ? 'en' : 'fr'));
  const setLangue = useCallback((l: Langue) => {
    setLangueEtat(l);
    ecrirePrefs({ lang: l });
  }, []);
  const t = useCallback((texte: string) => traduire(texte, langue), [langue]);
  return { langue, setLangue, t };
}

/* ------------------------------------------------------------ Mode simple */

/** Moins de décor, animations coupées, colonne de texte plus étroite et plus lisible. */
export function useModeSimple() {
  const [simple, setSimple] = useState<boolean>(() => lirePrefs().simple === true);
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (simple) document.documentElement.dataset.abSimple = 'oui';
    else delete document.documentElement.dataset.abSimple;
  }, [simple]);
  const basculer = useCallback(() => {
    setSimple((prev) => {
      ecrirePrefs({ simple: !prev });
      return !prev;
    });
  }, []);
  return { simple, basculer };
}

/* -------------------------------------------------- Lecture à voix haute */

/** Découpe un texte en phrases courtes : certains navigateurs coupent la voix après ~15 secondes. */
function decouper(texte: string): string[] {
  const phrases = texte.replace(/\s+/g, ' ').match(/[^.!?…:;]+[.!?…:;]?\s*/g) ?? [texte];
  const morceaux: string[] = [];
  for (const phrase of phrases) {
    let reste = phrase.trim();
    while (reste.length > 200) {
      const coupe = reste.lastIndexOf(' ', 200);
      morceaux.push(reste.slice(0, coupe > 40 ? coupe : 200));
      reste = reste.slice(coupe > 40 ? coupe : 200).trim();
    }
    if (reste) morceaux.push(reste);
  }
  return morceaux;
}

/** Lit à voix haute le texte visible de la page (hors barres), avec la voix du téléphone. */
export function useLectureVocale(langue: Langue) {
  const possible = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const [enCours, setEnCours] = useState(false);
  const jeton = useRef(0);

  const arreter = useCallback(() => {
    jeton.current++;
    if (possible) window.speechSynthesis.cancel();
    setEnCours(false);
  }, [possible]);

  const lire = useCallback(() => {
    if (!possible) return;
    const zone = (document.querySelector('.ab-content') ?? document.querySelector('main') ?? document.body) as HTMLElement;
    const texte = (zone.innerText || '').slice(0, 30000);
    const phrases = decouper(texte);
    if (!phrases.length) return;
    window.speechSynthesis.cancel();
    const moi = ++jeton.current;
    setEnCours(true);
    const suivante = (i: number) => {
      if (jeton.current !== moi) return;
      if (i >= phrases.length) return setEnCours(false);
      const u = new SpeechSynthesisUtterance(phrases[i]);
      u.lang = langue === 'en' ? 'en-GB' : 'fr-FR';
      u.rate = 0.95;
      u.onend = () => suivante(i + 1);
      u.onerror = () => {
        if (jeton.current === moi) setEnCours(false);
      };
      window.speechSynthesis.speak(u);
    };
    suivante(0);
  }, [possible, langue]);

  useEffect(() => () => {
    if (possible) window.speechSynthesis.cancel();
  }, [possible]);

  return { possible, enCours, basculer: enCours ? arreter : lire };
}

/* -------------------------------------------------------------- Installer */

interface EvenementInstallation extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let installation: EvenementInstallation | null = null;
const abonnes = new Set<() => void>();
if (typeof window !== 'undefined') {
  // L'événement part très tôt : on l'attrape dès le chargement du module.
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    installation = e as EvenementInstallation;
    abonnes.forEach((f) => f());
  });
  window.addEventListener('appinstalled', () => {
    installation = null;
    abonnes.forEach((f) => f());
  });
}

export function dejaInstallee(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia?.('(display-mode: standalone)').matches === true ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export type Plateforme = 'ios' | 'android' | 'ordinateur';
export function plateforme(): Plateforme {
  const ua = typeof navigator === 'undefined' ? '' : navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  return 'ordinateur';
}

export function useInstallation() {
  const [, maj] = useState(0);
  useEffect(() => {
    const f = () => maj((n) => n + 1);
    abonnes.add(f);
    return () => {
      abonnes.delete(f);
    };
  }, []);
  /** Lance l'installation si le navigateur le permet ; sinon renvoie false (il faut alors montrer le mode d'emploi). */
  const installer = useCallback(async (): Promise<boolean> => {
    if (!installation) return false;
    await installation.prompt();
    await installation.userChoice.catch(() => null);
    installation = null;
    maj((n) => n + 1);
    return true;
  }, []);
  return { installee: dejaInstallee(), directe: installation !== null, installer };
}
