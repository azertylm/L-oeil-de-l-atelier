/**
 * Point d'entrée du bundle navigateur (public/assets/alphabette-votes.js) : cadre PHP des applis de créateurs.
 * Lit `window.ALPHABETTE_VOTE = { appId, api }`, démarre le bandeau (30 s d'usage actif) et expose deux raccourcis :
 *   window.alphabetteNoter()          → ouvre le bandeau tout de suite (bouton « ★ Noter » de la barre)
 *   window.alphabetteSignaler(appId)  → fenêtre « Signaler un problème / abus »
 */
import { demarrerVotes, ouvrirSignalement } from './votes';

declare global {
  interface Window {
    ALPHABETTE_VOTE?: { appId: string; api?: string };
    alphabetteNoter?: () => void;
    alphabetteSignaler?: (appId: string) => void;
  }
}

const cfg = window.ALPHABETTE_VOTE;
if (cfg && /^c-[a-f0-9]{8}$/.test(cfg.appId)) {
  const cadre = document.querySelector('iframe');
  const controle = demarrerVotes({ appId: cfg.appId, api: cfg.api, cadre });
  window.alphabetteNoter = () => controle.ouvrir();
  window.alphabetteSignaler = (id: string) => ouvrirSignalement(id, cfg.api);
}
