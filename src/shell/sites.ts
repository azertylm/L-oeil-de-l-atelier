import type { AlphaSite } from './config';

/**
 * Les 5 sites mis en avant dans la barre écosystème.
 *
 * Liste modifiable à un seul endroit : passer `sites` à <AppShell> pour la
 * remplacer, ou éditer cette constante pour changer le défaut de tout
 * l'écosystème.
 */
export const DEFAULT_SITES: AlphaSite[] = [
  { key: 'lidarsol', label: 'LIDARSOL', url: 'https://lidarsol.fr', icon: '☀️' },
  { key: 'proxilien', label: 'Proxilien', url: 'https://proxilien.alphabette.fr', icon: '📍' },
  { key: 'iadebat', label: 'IA Débat', url: 'https://iadebat.alphabette.fr', icon: '⚖️' },
  { key: 'infos-perso', label: 'Info Perso', url: 'https://infosperso.alphabette.fr', icon: '📰' },
  { key: 'oeil-atelier', label: "L'Œil de l'Atelier", url: 'https://atelier.alphabette.fr', icon: '🔨' },
];

/** Nombre de sites affichés par défaut dans la barre écosystème. */
export const DEFAULT_SITES_VISIBLE = 5;
