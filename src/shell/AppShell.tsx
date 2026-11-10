import { useCallback, useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { AppHeader } from './AppHeader';
import { EcosystemBar } from './EcosystemBar';
import { loadEcosystemRegistry, synchroniserSites, type EcosystemApp, type RegistreApps } from './apps';
import type { AlphaAppConfig, AlphaSite, ShellPanelId } from './config';
import { useDensity, useFullscreen, useTheme, type ShellDensity, type ShellTheme } from './hooks';
import { PanneauShell, infosPanneau } from './panels';
import { ShellOverlay } from './ShellOverlay';
import {
  FALLBACK_CONFIG,
  HUB_URL,
  loadShellConfig,
  resolveAppsHubUrl,
  resolveHubUrl,
  type ShellConfig,
} from './pricing';
import { ShellContext, type ShellContextValue } from './ShellContext';
import { DEFAULT_SITES, DEFAULT_SITES_VISIBLE } from './sites';

export interface AppShellProps {
  /** Configuration de l'application (nom, sous-titre, couleur, liens…). */
  app: AlphaAppConfig;
  /** Les 5 sites de la barre écosystème (défaut : DEFAULT_SITES). */
  sites?: AlphaSite[];
  /** Nombre de sites affichés. */
  maxSites?: number;
  /** Adresse du hub central (défaut : https://alphabette.fr). */
  hubUrl?: string;
  /** Configuration commerciale forcée (sinon lue depuis le hub). */
  config?: ShellConfig;
  /** Ne pas interroger le hub pour les tarifs ni pour la liste des applications. */
  disableRemoteConfig?: boolean;
  /** Thème initial (« nuit » pour une charte sombre). */
  initialTheme?: ShellTheme;
  /** Densité initiale. */
  initialDensity?: ShellDensity;
  /** Ouverture du menu latéral (affiche le bouton hamburger si fourni). */
  onToggleNav?: () => void;
  /** Remplace l'ouverture par défaut de l'espace compte. */
  onOpenAccount?: () => void;
  /** Remplace l'ouverture par défaut de la gestion des clés d'API. */
  onOpenApiKeys?: () => void;
  /** Remplace l'ouverture par défaut du paiement. */
  onOpenPayment?: (target: 'app' | 'ecosystem') => void;
  /** Contenu de l'application. */
  children?: ReactNode;
}

const openInNewTab = (url: string) => {
  if (typeof window !== 'undefined') window.open(url, '_blank', 'noopener,noreferrer');
};

/**
 * Base commune de toutes les applications alphabette.fr.
 *
 * Enveloppe n'importe quelle application et fournit :
 *  - la barre écosystème (logo, dons, 5 sites, compteur, Pass → paiement) ;
 *  - l'en-tête d'application (nom, dons, compte, densité, clés, plein écran, jour/nuit) ;
 *  - le thème et la densité, mémorisés et appliqués à TOUTE la page
 *    (`<html data-ab-theme>`, `<html data-ab-density>`), donc aussi au contenu de
 *    l'application, qui n'a qu'à écrire ses couleurs en CSS ;
 *  - le plein écran, avec un repli « mode immersion » si le navigateur refuse ;
 *  - cinq panneaux concrets (compte, clés d'API, Pass, sites, dons) : chaque
 *    bouton des barres mène quelque part, jamais dans le vide.
 *
 * La palette s'adapte automatiquement à `app.accent`, la couleur d'identité du site.
 */
export function AppShell({
  app,
  sites = DEFAULT_SITES,
  maxSites = DEFAULT_SITES_VISIBLE,
  hubUrl = HUB_URL,
  config,
  disableRemoteConfig = false,
  initialTheme = 'jour',
  initialDensity = 'normal',
  onToggleNav,
  onOpenAccount,
  onOpenApiKeys,
  onOpenPayment,
  children,
}: AppShellProps) {
  const { theme, setTheme, toggleTheme } = useTheme(initialTheme);
  const { density, setDensity, cycleDensity } = useDensity(initialDensity);
  const { isFullscreen, isImmersion, toggleFullscreen } = useFullscreen();
  const [remoteConfig, setRemoteConfig] = useState<ShellConfig>(config ?? FALLBACK_CONFIG);
  const [panel, setPanel] = useState<ShellPanelId | null>(null);
  const [appsHub, setAppsHub] = useState<EcosystemApp[]>([]);
  const [registreSource, setRegistreSource] = useState<RegistreApps['source']>('hub');

  const resolvedHubUrl = resolveHubUrl(hubUrl);
  /** Origine interrogée pour le registre (vide = même origine en développement). */
  const registreHubUrl = resolveAppsHubUrl(hubUrl);

  // Synchronise les tarifs et liens de paiement avec le hub (sans le bloquer).
  //
  // En développement, la requête part sur l'origine du serveur de dev
  // (`/api/config.json`, relayée vers le hub local par vite.config.ts) : la base
  // affiche donc les VRAIS tarifs publiés par le hub, jamais une copie figée.
  // Si le hub dort, la configuration de secours prend le relais sans bruit.
  useEffect(() => {
    if (config || disableRemoteConfig) return;
    let cancelled = false;
    loadShellConfig(registreHubUrl).then((next) => {
      if (!cancelled) setRemoteConfig(next);
    });
    return () => {
      cancelled = true;
    };
  }, [config, disableRemoteConfig, registreHubUrl]);

  // Récupère le registre des applications. En développement, la requête reste
  // sur l'origine du serveur de développement (`/api/apps`), relayée vers le
  // hub local par vite.config.ts : pas de CORS, pas de bruit si le hub dort.
  useEffect(() => {
    if (disableRemoteConfig) return;
    let cancelled = false;
    loadEcosystemRegistry(registreHubUrl).then((registre) => {
      if (cancelled) return;
      setAppsHub(registre.apps);
      setRegistreSource(registre.source);
    });
    return () => {
      cancelled = true;
    };
  }, [disableRemoteConfig, registreHubUrl]);

  const shellConfig = config ?? remoteConfig;

  /** Le registre, avec l'application courante ajoutée en tête si absente. */
  const apps = useMemo<EcosystemApp[]>(() => {
    if (appsHub.some((entree) => entree.key === app.key)) return appsHub;
    const courante: EcosystemApp = {
      key: app.key,
      name: app.name,
      url: app.subdomain ? `https://${app.subdomain}.alphabette.fr` : undefined,
      icon: typeof app.icon === 'string' ? app.icon : undefined,
      status: 'actif',
      gratuit: app.gratuit === true,
    };
    return [courante, ...appsHub];
  }, [appsHub, app.key, app.name, app.subdomain, app.icon]);

  const openPanel = useCallback((id: ShellPanelId) => setPanel(id), []);
  const closePanel = useCallback(() => setPanel(null), []);

  /**
   * Les sites de la barre, resynchronisés avec le registre central : le hub
   * fait foi pour les adresses et les statuts (une application « brouillon »
   * s'affiche mais son lien est désactivé). Si le hub ne répond pas, la liste
   * d'origine reste intacte — la barre n'est jamais vide.
   */
  const sitesFinaux = useMemo(() => {
    if (disableRemoteConfig || registreSource !== 'hub') return sites;
    return synchroniserSites(sites, appsHub);
  }, [sites, appsHub, registreSource, disableRemoteConfig]);

  /**
   * Compteur calculé tout seul depuis le registre (X applications en ligne /
   * Y au total) : les applications n'ont plus de chiffre périmé à maintenir à
   * la main. Une valeur passée par app.counter reste prioritaire.
   *
   * Une application **gratuite** affiche ce compteur même si le hub ne répond
   * pas : elle doit pouvoir dire « gratuit » en toutes circonstances.
   */
  const compteurAuto = useMemo(() => {
    const enLigne = apps.filter((entree) => entree.url && (!entree.status || entree.status === 'actif'));
    return {
      unlocked: enLigne.length,
      total: apps.length,
      // Le compte des applications gratuites n'a de sens que si c'est bien le
      // registre du hub qui a répondu : sinon la base n'affiche que « gratuit »,
      // sans avancer un chiffre faux.
      gratuites: registreSource === 'hub' ? apps.filter((entree) => entree.gratuit).length : undefined,
    };
  }, [apps, registreSource]);
  const counterFinal = app.counter ?? (registreSource === 'hub' || app.gratuit ? compteurAuto : undefined);

  /** Contenu sur mesure déclaré par l'application, sinon panneau par défaut. */
  const contenuPanneau = useMemo(() => {
    if (!panel) return null;
    const surMesure = app.panels?.[panel];
    if (surMesure) return surMesure;
    return (
      <PanneauShell
        id={panel}
        app={app}
        config={shellConfig}
        hubUrl={resolvedHubUrl}
        apps={apps}
        registreOk={registreSource === 'hub'}
        ouvrir={openInNewTab}
        basculer={openPanel}
      />
    );
  }, [panel, app, shellConfig, resolvedHubUrl, apps, registreSource, openPanel]);

  const value = useMemo<ShellContextValue>(() => {
    return {
      theme,
      setTheme,
      toggleTheme,
      density,
      setDensity,
      cycleDensity,
      isFullscreen,
      isImmersion,
      toggleFullscreen,

      panel,
      openPanel,
      closePanel,

      hubUrl: resolvedHubUrl,
      config: shellConfig,
      apps,
      apiKeyState: app.apiKeyState ?? 'ok',
      accountState: app.accountState ?? 'ok',

      openExternal: openInNewTab,
      openAccount: onOpenAccount ?? (() => openPanel('compte')),
      openApiKeys: onOpenApiKeys ?? (() => openPanel('cles')),
      openPayment: onOpenPayment === undefined ? () => openPanel('pass') : () => onOpenPayment('ecosystem'),
    };
  }, [
    theme,
    setTheme,
    toggleTheme,
    density,
    setDensity,
    cycleDensity,
    isFullscreen,
    isImmersion,
    toggleFullscreen,
    panel,
    openPanel,
    closePanel,
    resolvedHubUrl,
    shellConfig,
    apps,
    app.apiKeyState,
    app.accountState,
    app.accountUrl,
    onOpenAccount,
    onOpenApiKeys,
    onOpenPayment,
  ]);

  return (
    <ShellContext.Provider value={value}>
      <div
        className={`ab-shell${isFullscreen ? ' ab-shell--fullscreen' : ''}${isImmersion ? ' ab-shell--focus' : ''}`}
        data-ab-theme={theme}
        data-ab-density={density}
        style={app.accent ? ({ '--ab-accent': app.accent } as CSSProperties) : undefined}
      >
        <EcosystemBar
          app={app}
          sites={sitesFinaux}
          maxSites={maxSites}
          hubUrl={resolvedHubUrl}
          config={shellConfig}
          counter={counterFinal}
          onOpenPayment={value.openPayment}
          onOpenDon={() => openPanel('dons')}
          onOpenSites={() => openPanel('sites')}
        />
        <AppHeader
          app={app}
          density={density}
          theme={theme}
          isFullscreen={isFullscreen}
          isImmersion={isImmersion}
          onToggleDensity={cycleDensity}
          onToggleTheme={toggleTheme}
          onToggleFullscreen={toggleFullscreen}
          onOpenAccount={value.openAccount}
          onOpenApiKeys={value.openApiKeys}
          onOpenDon={() => openPanel('dons')}
          onToggleNav={onToggleNav}
        />
        <div className="ab-content" role="region" aria-label={app.name}>
          {children}
        </div>

        {isImmersion && (
          <button type="button" className="ab-sortie-immersion" onClick={toggleFullscreen}>
            ✕ Quitter l’écran plein
          </button>
        )}

        {panel && (
          <ShellOverlay
            titre={infosPanneau(panel, app).titre}
            sousTitre={infosPanneau(panel, app).sousTitre}
            icone={infosPanneau(panel, app).icone}
            classe={panel === 'dons' ? 'ab-sheet--large' : undefined}
            onClose={closePanel}
          >
            {contenuPanneau}
          </ShellOverlay>
        )}
      </div>
    </ShellContext.Provider>
  );
}
