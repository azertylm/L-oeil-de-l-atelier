/**
 * @file labo/structurerAvisVocal.ts
 * Transforme une transcription vocale libre en avis structuré, sans IA ni serveur :
 *   { type: "bug" | "ux" | "avis", resume: "...", urgence: 1-5 }
 * Règles simples et lisibles (mots-clés français) ; le visiteur relit et corrige avant l'envoi.
 */
import { nettoyerTexte } from './confidentialite';

export type TypeAvisVocal = 'bug' | 'ux' | 'avis';
export interface AvisVocal { type: TypeAvisVocal; resume: string; urgence: 1 | 2 | 3 | 4 | 5 }

const MOTS_BUG = /\b(bug|bugue?|plante|planté|crash|erreur|marche (pas|plus)|fonctionne (pas|plus)|bloqu|fig[ée]|écran (blanc|noir)|rien ne (se passe|s'affiche)|cass[ée]|ne charge|ne s'ouvre|impossible de|perdu)/i;
const MOTS_UX = /\b(trouve pas|je ne trouve|où est|ou est|comment (on|faire|je)|pas clair|compliqu|confus|illisible|trop petit|du mal à lire|cach[ée]|on ne voit|difficile|perdu dans|ergonom|contraste|pas pratique)/i;
const URGENCE_5 = /\b(perdu (mes|toutes|mon)|données (perdues|effacées)|paiement|payé|argent|sécurité|piraté|impossible d'utiliser|rien ne marche|bloqué complètement)/i;
const URGENCE_4 = /\b(plante|crash|écran (blanc|noir)|bloqu|impossible|ne s'ouvre|ne charge)/i;
const URGENCE_2 = /\b(petit détail|pas grave|juste|serait bien|ce serait|idée|suggestion|j'aimerais|pourriez)/i;
const ATTENUER = /^(euh+|alors|bon|ben|donc|voilà|en fait|bonjour|salut)[,\s]+/gi;

/** Remet des majuscules et une ponctuation minimale sur une dictée. */
function remettreEnForme(t: string): string {
  let s = t.replace(/\s+/g, ' ').trim();
  for (let i = 0; i < 3; i++) s = s.replace(ATTENUER, '');
  s = s.replace(/\b(point|virgule)\b/gi, (m) => (m.toLowerCase() === 'point' ? '.' : ','));
  s = s.charAt(0).toUpperCase() + s.slice(1);
  if (s && !/[.!?]$/.test(s)) s += '.';
  return s;
}

export function structurerAvisVocal(transcription: string): AvisVocal {
  const brut = nettoyerTexte(transcription || '', 1000);
  const type: TypeAvisVocal = MOTS_BUG.test(brut) ? 'bug' : MOTS_UX.test(brut) ? 'ux' : 'avis';
  let urgence: AvisVocal['urgence'] = type === 'bug' ? 3 : 2;
  if (URGENCE_5.test(brut)) urgence = 5;
  else if (type === 'bug' && URGENCE_4.test(brut)) urgence = 4;
  else if (type !== 'bug' && URGENCE_2.test(brut)) urgence = 1;
  else if (type === 'ux' && /\b(personne|tout le monde|jamais|toujours)\b/i.test(brut)) urgence = 3;
  return { type, resume: remettreEnForme(brut).slice(0, 600), urgence };
}

/** Catégorie du formulaire d'avis correspondant au type vocal. */
export const categorieDuType = (t: TypeAvisVocal) => (t === 'bug' ? 'Bug' : t === 'ux' ? 'Design' : 'Autre') as 'Bug' | 'Design' | 'Autre';
