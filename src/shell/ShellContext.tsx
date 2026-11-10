import { createContext, useContext } from 'react';
import type { EcosystemApp } from './apps';
import type { ShellPanelId, ShellStatus } from './config';
import type { ShellDensity, ShellTheme } from './hooks';
import type { ShellConfig } from './pricing';

/** État partagé par les deux barres, les panneaux et le contenu de l'application. */
export interface ShellContextValue {
  /* --- Apparence ------------------------------------------------------- */
  theme: ShellTheme;
  setTheme: (theme: ShellTheme) => void;
  toggleTheme: () => void;
  density: ShellDensity;
  setDensity: (density: ShellDensity) => void;
  cycleDensity: () => void;
  isFullscreen: boolean;
  /** Vrai quand on est en repli « mode immersion » (sans l'API Fullscreen). */
  isImmersion: boolean;
  toggleFullscreen: () => void;

  /* --- Panneaux --------------------------------------------------------- */
  /** Panneau ouvert, ou null. */
  panel: ShellPanelId | null;
  /** Ouvre un panneau de la base (compte, cles, pass, sites, dons). */
  openPanel: (id: ShellPanelId) => void;
  closePanel: () => void;

  /* --- Actions ---------------------------------------------------------- */
  /** Ouvre l'espace compte (SSO alphabette). */
  openAccount: () => void;
  /** Ouvre la gestion des clés d'API. */
  openApiKeys: () => void;
  /** Ouvre le paiement (offre écosystème). */
  openPayment: () => void;
  /** Ouvre une adresse externe dans un nouvel onglet. */
  openExternal: (url: string) => void;

  /* --- Données ---------------------------------------------------------- */
  /** Adresse du hub central. */
  hubUrl: string;
  /** Configuration commerciale en vigueur (tarifs, liens, promotion). */
  config: ShellConfig;
  /** Applications publiées par le hub (liste de secours si hors-ligne). */
  apps: EcosystemApp[];
  /** État affiché de la clé d'API et du compte. */
  apiKeyState: ShellStatus;
  accountState: ShellStatus;
}

export const ShellContext = createContext<ShellContextValue | null>(null);

/** Accède à l'état de la base depuis n'importe quel composant de l'application. */
export function useShell(): ShellContextValue {
  const value = useContext(ShellContext);
  if (!value) {
    throw new Error(
      "useShell() doit être utilisé dans une application enveloppée par <AppShell> (@alphabette/shell).",
    );
  }
  return value;
}
