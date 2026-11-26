/**
 * Effets Pop / Néon pour les pages HTML simples (sans construction).
 *
 * Construit dans public/assets/alphabette-effets.js (bun run build:pop) et chargé par
 * alphabette-barre.js à côté de la feuille public/assets/alphabette-pop.css.
 * Expose `window.alphabetteEffets`.
 */
import {
  celebrer,
  celebrerSiNouveau,
  confettis,
  eurosDepuisCentimes,
  HTML_EGALISEUR,
  htmlFiole,
  installerEffets,
  modeCalme,
  modeCalmeActif,
  mouvementReduit,
  odometre,
  palierFiole,
  poserCategorie,
  poserUnivers,
  univers,
  vagueTheme,
} from './effets';
import { ecranVide, SVG_VIDES } from './illustrations';

const api = {
  celebrer,
  celebrerSiNouveau,
  confettis,
  eurosDepuisCentimes,
  HTML_EGALISEUR,
  htmlFiole,
  modeCalme,
  modeCalmeActif,
  mouvementReduit,
  odometre,
  palierFiole,
  poserCategorie,
  poserUnivers,
  univers,
  vagueTheme,
  ecranVide,
  SVG_VIDES,
};

declare global {
  interface Window {
    alphabetteEffets?: typeof api;
  }
}

if (typeof window !== 'undefined' && !window.alphabetteEffets) {
  window.alphabetteEffets = api;
  installerEffets();
  window.dispatchEvent(new CustomEvent('alphabette:effets'));
}
