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
export { lirePrefs, ecrirePrefs, type Prefs } from './prefs';
export { type Langue } from './libelles';
export {
  lireMembre,
  ecrireMembre,
  oublierMembre,
  lienInscription,
  ADRESSE_INSCRIPTION,
  LIBELLE_ROLE,
  type Membre,
  type RoleMembre,
} from './membre';

// Laboratoire alphabette.eu : avis, micro-sondages, confidentialité, dédoublonnage.
export { useContextualFeedback, MicroSondage, type OptionsSondage } from './labo/useContextualFeedback';
export { envoyerAvisLabo, soutenirTicket, ticketsOuverts, API_AVIS, type NouvelAvis, type TicketOuvert, type CategorieAvis } from './labo/avis';
export { nettoyerTexte, clesStockageSures, contexteTechnique, plateformeSimple, cheminCourant, surLeLaboratoire, type ContexteTechnique } from './labo/confidentialite';
export { similarite, doublonsProbables, normaliser } from './labo/similarite';
export { ABTestToggle, useABTest, appDepuisAdresse, type ABTestToggleProps, type VarianteAB } from './labo/ABTestToggle';
export { useVoiceFeedback, BoutonMicro, moteurDisponible, type Voix, type MoteurVocal, type EtatVocal } from './labo/useVoiceFeedback';
export { structurerAvisVocal, categorieDuType, type AvisVocal, type TypeAvisVocal } from './labo/structurerAvisVocal';
export { InteractiveSpotlight, MicroTuto, useMicroTuto, type EtapeSpotlight, type InteractiveSpotlightProps, type TutoAgent } from './labo/InteractiveSpotlight';
export {
  appelerIA, classerStatut, messagePedagogique, incidentRecent, ecouterIncidents, lireChaineIA, enregistrerChaineIA,
  IncidentApiTiers, ErreurRequeteIA, MODELES_PAR_DEFAUT, NOMS_FOURNISSEURS, DOMAINES_FOURNISSEURS, MARQUEUR_INCIDENT,
  type Fournisseur, type MaillonIA, type RequeteIA, type ReponseIA, type Bascule, type TypeIncident, type OptionsRouteur,
} from './ia/routeurByok';

// Voix Alphabette unique (Google Gemini TTS « Kore ») : lecteur, bouton Écouter, dictée.
export { alphabetteAudio, ID_BARRE, meilleureVoix, type EtatAudio, type InstantaneAudio } from './audio/alphabetteAudio';
export { empreinteVoix, planBibliotheque, partiesEnregistrees, enregistrementsDisponibles, chargerIndexBibliotheque, urlBibliotheque, VERSION_BIBLIOTHEQUE } from './audio/bibliotheque';
export { BoutonEcouter, IconeAudio, useAlphabetteAudio, texteDeLElement, texteDeLaPage, type BoutonEcouterProps } from './audio/BoutonEcouter';
export { preparerTexte, decouperTexte, morceauxAPrononcer } from './audio/preparerTexte';
export { installerAudioAlphabette, textesAPrononcer } from './audio/passerelle';
export { demarrerDictee, dicteePossible, transcrire, type Dictee, type OptionsDictee } from './audio/dictee';
export {
  VOIX_ALPHABETTE, MODELE_TTS, MODELES_TTS_SECOURS, STYLE_VOIX, MODELE_TRANSCRIPTION, MODELES_TRANSCRIPTION_SECOURS,
  corpsRequeteTts, garantirWav, ttsGeminiDirect,
} from './audio/voixGemini';
export { corpsTranscription } from './audio/dictee';
