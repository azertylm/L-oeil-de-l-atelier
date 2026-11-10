/**
 * @alphabette/shell — base commune des applications alphabette.fr.
 *
 * Usage minimal :
 *
 *   import { AppShell } from '@alphabette/shell';
 *   import '@alphabette/shell/style.css';
 *
 *   <AppShell app={{ key: 'mon-app', name: 'Mon App', tagline: 'Sa raison d’être' }}>
 *     …contenu…
 *   </AppShell>
 */
export { AppShell, type AppShellProps } from './AppShell';
export { EcosystemBar } from './EcosystemBar';
export { AppHeader } from './AppHeader';
export { ShellOverlay } from './ShellOverlay';
export { PanneauShell, SHELL_PANELS, infosPanneau } from './panels';
export {
  loadEcosystemApps,
  loadEcosystemRegistry,
  registreDeSecours,
  appsDeSecours,
  synchroniserSites,
  reparerTexte,
  type EcosystemApp,
  type RegistreApps,
  type RegistreSource,
} from './apps';
export { ShellContext, useShell, type ShellContextValue } from './ShellContext';
export {
  useTheme,
  useDensity,
  useFullscreen,
  applyAccent,
  appliquerThemeAuDocument,
  appliquerDensiteAuDocument,
  themeDuSysteme,
  DENSITY_ORDER,
  DENSITY_LABELS,
  type ShellTheme,
  type ShellDensity,
} from './hooks';
export {
  PRICING,
  DEFAULT_PAYMENT_LINKS,
  FALLBACK_CONFIG,
  HUB_URL,
  CONFIG_PATH,
  APPS_PATH,
  loadShellConfig,
  resolveHubUrl,
  resolveAppsHubUrl,
  isLocalDev,
  hasEnvHubUrl,
  type ShellConfig,
  type ShellPromotion,
  type ShellDonation,
} from './pricing';
export { DEFAULT_SITES, DEFAULT_SITES_VISIBLE } from './sites';
export {
  DEFAULT_ACCENT,
  type AlphaAppConfig,
  type AlphaSite,
  type ShellStatus,
  type ShellPanelId,
} from './config';
