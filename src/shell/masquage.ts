/**
 * @file masquage.ts
 * Règle d'or 2 (React) : libérer l'écran au défilement. En descendant, la double barre se masque
 * (`<html data-ab-barres="cachees">`, même contrat que alphabette-barre.js avec data-masquer="defilement") ;
 * elle revient dès qu'on remonte ou qu'on est en haut de page. Un événement `alphabette:barres`
 * ({ detail: { cachees } }) prévient les panneaux ouverts (ex. Météo du Labo) qui se referment.
 * Jamais de masquage pendant qu'un panneau modal est ouvert ni quand le clavier a le focus dans la barre.
 */
export const SEUIL_DEFILEMENT_PX = 6;
export const HAUTEUR_MIN_PX = 96;

export function poserBarres(cachees: boolean): void {
  const racine = document.documentElement;
  const avant = racine.dataset.abBarres === 'cachees';
  if (avant === cachees) return;
  if (cachees) racine.dataset.abBarres = 'cachees';
  else delete racine.dataset.abBarres;
  window.dispatchEvent(new CustomEvent('alphabette:barres', { detail: { cachees } }));
}

/** Décision pure (testable) : faut-il cacher ou montrer, d'après le sens et la position du défilement. */
export function decisionBarres(cachees: boolean, y: number, delta: number): boolean {
  if (!cachees && delta > SEUIL_DEFILEMENT_PX && y > HAUTEUR_MIN_PX) return true;
  if (cachees && (delta < -SEUIL_DEFILEMENT_PX || y < 24)) return false;
  return cachees;
}

export function installerMasquageDefilement(): () => void {
  if (typeof window === 'undefined') return () => undefined;
  let dernier = window.scrollY;
  let attente = false;
  const maj = () => {
    attente = false;
    const y = Math.max(0, window.scrollY);
    const delta = y - dernier;
    const barre = document.querySelector('.ab-barres');
    const bloque = Boolean(document.querySelector('.ab-overlay')) || Boolean(barre?.contains(document.activeElement) && (document.activeElement as HTMLElement).matches?.('input,textarea,select'));
    if (!bloque) poserBarres(decisionBarres(document.documentElement.dataset.abBarres === 'cachees', y, delta));
    if (Math.abs(delta) >= 2) dernier = y;
  };
  const surDefilement = () => { if (!attente) { attente = true; window.requestAnimationFrame(maj); } };
  window.addEventListener('scroll', surDefilement, { passive: true });
  return () => {
    window.removeEventListener('scroll', surDefilement);
    poserBarres(false);
  };
}
