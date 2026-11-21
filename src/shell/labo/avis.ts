/**
 * @file labo/avis.ts
 * Client du service d'avis du Laboratoire (alphabette.eu/api/feedback.php), commun au hub et aux
 * applications. Tout texte passe par `nettoyerTexte` ; le contexte technique par `contexteTechnique`.
 * Hors du Laboratoire, aucune requête n'est faite.
 */
import { contexteTechnique, nettoyerTexte, surLeLaboratoire } from './confidentialite';
import { incidentRecent } from '../ia/routeurByok';

export const API_AVIS = '/api/feedback.php';
export type CategorieAvis = 'Bug' | 'Idée' | 'Design' | 'Autre';

export interface TicketOuvert {
  id: string;
  category: CategorieAvis;
  comment: string;
  upvotes: number;
  status: string;
}

export interface NouvelAvis {
  /** id du registre ; à défaut, `chemin` (« /apps/bonplan/ ») permet au serveur de retrouver l'appli. */
  app_id?: string;
  chemin?: string;
  rating: number | null;
  category: CategorieAvis;
  comment: string;
  version_tested?: 'main' | 'beta';
  /** « formulaire » (carte du Laboratoire) ou « sondage » (micro-sondage après une action réussie). */
  source?: 'formulaire' | 'sondage' | 'voix';
  /** Urgence estimée de 1 à 5 (retour vocal structuré, modifiable par le visiteur). */
  urgence?: number;
  /** Nom de l'action réussie qui a déclenché le micro-sondage. */
  declencheur?: string;
  /** Champ piège invisible : un humain le laisse vide. */
  site_web?: string;
}

async function appeler<T>(corps: Record<string, unknown>): Promise<T> {
  const r = await fetch(API_AVIS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(corps),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error((data as { erreur?: string }).erreur || `Erreur ${r.status}`);
  return data as T;
}

export async function envoyerAvisLabo(avis: NouvelAvis): Promise<{ ok: true; id: string }> {
  if (!surLeLaboratoire()) throw new Error('Les avis se donnent sur alphabette.eu.');
  return appeler({
    action: 'avis',
    ...avis,
    comment: nettoyerTexte(avis.comment, 1000),
    declencheur: avis.declencheur ? nettoyerTexte(avis.declencheur, 60) : undefined,
    telemetry: contexteTechnique(avis.chemin),
    // Panne, quota ou clé refusée chez un fournisseur d'IA juste avant : « Incident API Tiers », pas un bug.
    incident_api: avis.category === 'Bug' ? incidentRecent() ?? undefined : undefined,
  });
}

export async function soutenirTicket(id: string): Promise<{ ok: true; upvotes: number }> {
  return appeler({ action: 'plus1', id });
}

/** Tickets ouverts d'une application (pour le dédoublonnage), 100 au plus. */
export async function ticketsOuverts(appId: string): Promise<TicketOuvert[]> {
  if (!surLeLaboratoire()) return [];
  const r = await fetch(`${API_AVIS}?ouverts=${encodeURIComponent(appId)}`, { headers: { Accept: 'application/json' }, cache: 'no-store' });
  if (!r.ok) return [];
  const data = (await r.json().catch(() => ({}))) as { tickets?: TicketOuvert[] };
  return data.tickets ?? [];
}
