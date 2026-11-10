import type { ReactNode } from 'react';

/** Critère d'état d'un élément de la barre (pastille verte / orange / rouge). */
export type ShellStatus = 'ok' | 'loading' | 'off';

/** Les cinq panneaux que la base sait ouvrir par-dessus le contenu. */
export type ShellPanelId = 'compte' | 'cles' | 'pass' | 'sites' | 'dons';

export interface AlphaSite {
  /** Identifiant technique. */
  key: string;
  /** Libellé affiché dans la barre écosystème. */
  label: string;
  /** Adresse complète (https://…). */
  url: string;
  /** Emoji ou pictogramme affiché avant le libellé. */
  icon?: string;
  /**
   * Statut déduit du registre central (« actif », « brouillon », …).
   * Une application non « actif » s'affiche dans la barre mais son lien est
   * désactivé (« bientôt en ligne ») plutôt que de mener à une page d'erreur.
   */
  status?: string;
}

/**
 * Configuration d'une application de l'écosystème.
 * C'est LE fichier que l'on remplit au démarrage d'un nouveau projet.
 */
export interface AlphaAppConfig {
  /** Identifiant technique (ex. « infos-perso »). */
  key: string;
  /** Nom affiché (ex. « Info Perso »). */
  name: string;
  /** Sous-titre en majuscules (ex. « Votre curation intelligente hautement personnalisée »). */
  tagline: string;
  /**
   * Couleur d'identité du site. Toute la base s'y adapte automatiquement
   * (barre écosystème, boutons actifs, titre). Ex. « #2563eb ».
   */
  accent?: string;
  /** Sous-domaine dédié (ex. « infosperso » → infosperso.alphabette.fr). */
  subdomain?: string;
  /** Chemin sur le domaine principal (ex. « /infos-perso »). */
  homePath?: string;
  /** Adresse de collecte de dons. */
  donUrl?: string;
  /** Espace compte de l'utilisateur (SSO alphabette). */
  accountUrl?: string;
  /** Gestion des clés d'API (Mistral BYOK / clé managée). */
  apiKeysUrl?: string;
  /**
   * Application **définitivement gratuite**.
   *
   * La base n'affiche alors, pour cette application, ni prix, ni essai, ni
   * bouton de paiement : à la place, un lien vers le hub. Les autres
   * applications de l'écosystème gardent leur Pass, et la base continue d'y
   * renvoyer — c'est ce qui finance les applications gratuites.
   */
  gratuit?: boolean;
  /** Compteur affiché dans la barre écosystème (applications débloquées / total). */
  counter?: {
    unlocked: number;
    total: number;
    /** Jours d'essai restants (0 ou absent = pas d'essai). */
    trialDaysLeft?: number;
    /**
     * Nombre d'applications **gratuites** de l'écosystème, calculé par la base
     * depuis le registre du hub. Sert à ne jamais laisser croire que tout est
     * gratuit : « gratuit (7 sur 15) ».
     */
    gratuites?: number;
  };
  /** État de la clé d'API affiché dans l'en-tête. */
  apiKeyState?: ShellStatus;
  /** État du compte affiché dans l'en-tête. */
  accountState?: ShellStatus;
  /**
   * Contenu sur mesure d'un panneau : la base ouvre alors TON contenu au lieu
   * du panneau par défaut (compte, clés d'API, Pass, sites, dons).
   */
  panels?: Partial<Record<ShellPanelId, ReactNode>>;
  /** Pictogramme de l'application (emoji ou composant). */
  icon?: ReactNode;
}

/** Valeurs par défaut d'une application (utilisées par le générateur). */
export const DEFAULT_ACCENT = '#2563eb';
