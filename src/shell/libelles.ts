/**
 * Mots de la double barre, en français et en anglais.
 * Seule la barre est traduite : le contenu des applications reste en français
 * (voir le panneau « Langue », qui propose une traduction automatique de la page).
 */
export type Langue = 'fr' | 'en';

const EN: Record<string, string> = {
  'Aller sur alphabette.fr': 'Go to alphabette.fr',
  'Toutes les applis': 'All apps',
  'Nouveautés': 'What’s new',
  'S’abonner': 'Subscribe',
  'Mon inscription': 'My membership',
  'Faire un don': 'Donate',
  'Passer en mode nuit': 'Switch to night mode',
  'Passer en mode jour': 'Switch to day mode',
  'Lire à voix haute': 'Read aloud',
  'Arrêter la lecture': 'Stop reading',
  'Plus d’options': 'More options',
  'Taille du texte': 'Text size',
  'Normale': 'Normal',
  'Grande': 'Large',
  'Très grande': 'Extra large',
  'Épingler cette appli': 'Pin this app',
  'Retirer de mes favoris': 'Remove from favorites',
  'Mode simple': 'Simple mode',
  'Quitter le mode simple': 'Leave simple mode',
  'Installer sur mon téléphone': 'Install on my phone',
  'Donner mon avis': 'Send feedback',
  'Imprimer': 'Print',
  'Langue': 'Language',
  'Mon compte': 'My account',
  'Clé d’IA': 'AI key',
  'Plein écran': 'Full screen',
  'Quitter le plein écran': 'Leave full screen',
  'Mes favoris': 'My favorites',
  'Fermer': 'Close',
};

export function traduire(texte: string, langue: Langue): string {
  return langue === 'en' ? (EN[texte] ?? texte) : texte;
}
