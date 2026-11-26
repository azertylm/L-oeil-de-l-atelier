import type { CSSProperties } from 'react';

/**
 * Isolation stricte des applications de créateurs (alphabette.eu).
 *
 * Deux verrous, toujours ensemble :
 *  1. côté serveur, l'appli est servie avec « Content-Security-Policy: sandbox … » (origine opaque) — voir fichier.php ;
 *  2. côté page, elle s'affiche dans une <iframe sandbox> qui n'accorde JAMAIS « allow-same-origin » : l'appli ne peut lire
 *     ni les cookies, ni le stockage, ni les clés d'IA, ni l'API d'Alphabette.
 * Le jeu de permissions est figé ici : `AppIsolee` n'accepte aucune surcharge.
 */
export const SANDBOX_CREATEUR = 'allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-downloads';
export const CSP_SANDBOX_CREATEUR = `sandbox ${SANDBOX_CREATEUR}`;

export interface AppIsoleeProps {
  /** Adresse de l'appli, servie avec l'en-tête CSP sandbox (…/fichier.php/<id>/public/index.html). */
  src: string;
  titre: string;
  style?: CSSProperties;
}

export function AppIsolee({ src, titre, style }: AppIsoleeProps) {
  return (
    <iframe
      title={titre}
      src={src}
      sandbox={SANDBOX_CREATEUR}
      referrerPolicy="no-referrer"
      allow="fullscreen"
      style={{ width: '100%', height: '100%', border: 0, background: '#fff', ...style }}
    />
  );
}
