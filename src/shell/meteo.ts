/**
 * @file meteo.ts
 * Météo du Labo pour la double barre d'alphabette.eu : logique pure, alimentée UNIQUEMENT par
 * data/labo/status-labo.json (publié dans api/labo/status-labo.json). Aucun statut inventé :
 * sans donnée, l'état est « inconnu » (icône neutre, aucune affirmation).
 */
export interface StatutLabo {
  dernier_passage?: { date: string | null; avis_lus: number | null; corrections: number | null; rejets: number | null } | null;
  sentinelle?: {
    retours_arriere_total?: number | null;
    interventions?: { date: string; app_id?: string | null; retour_arriere?: boolean }[];
  } | null;
}

export type CielLabo = 'ok' | 'evolutions' | 'verif' | 'inconnu';
export interface Meteo { ciel: CielLabo; icone: string; libelle: string; description: string }

const JOUR = 86_400_000;

/** Orage (🌧️ Vérif) : un retour arrière de la Sentinelle ces 24 h. Nuages (⛅ Évolutions) : améliorations au dernier passage (< 48 h). Sinon ☀️. */
export function meteoDepuisStatut(st: StatutLabo | null | undefined, maintenant = Date.now()): Meteo {
  if (!st || (!st.dernier_passage && !st.sentinelle)) {
    return { ciel: 'inconnu', icone: '☁️', libelle: '—', description: 'état du Labo indisponible pour le moment' };
  }
  const retours = (st.sentinelle?.interventions ?? []).filter((i) => i.retour_arriere && maintenant - Date.parse(i.date) < JOUR).length;
  if (retours > 0) return { ciel: 'verif', icone: '🌧️', libelle: 'Vérif', description: `vérification en cours : ${retours} retour${retours > 1 ? 's' : ''} arrière ces dernières 24 heures` };
  const p = st.dernier_passage;
  const recent = p?.date ? maintenant - Date.parse(p.date) < 2 * JOUR : false;
  if (recent && (p?.corrections ?? 0) > 0) return { ciel: 'evolutions', icone: '⛅', libelle: 'Évolutions', description: `${p?.corrections} amélioration${(p?.corrections ?? 0) > 1 ? 's' : ''} apportée${(p?.corrections ?? 0) > 1 ? 's' : ''} au dernier passage` };
  return { ciel: 'ok', icone: '☀️', libelle: 'Labo OK', description: 'tout est calme au Labo' };
}

export function ilYaTexte(iso: string | null | undefined, maintenant = Date.now()): string {
  const t = iso ? Date.parse(iso) : NaN;
  if (Number.isNaN(t)) return 'jamais';
  const m = Math.max(0, Math.floor((maintenant - t) / 60_000));
  if (m < 2) return "à l'instant";
  if (m < 60) return `il y a ${m} minutes`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h} heure${h > 1 ? 's' : ''}`;
  const j = Math.floor(h / 24);
  return `il y a ${j} jour${j > 1 ? 's' : ''}`;
}

let cache: Promise<StatutLabo | null> | null = null;
export function chargerStatutMeteo(): Promise<StatutLabo | null> {
  cache ??= fetch('/api/labo/status-labo.json', { cache: 'no-cache' })
    .then((r) => (r.ok ? (r.json() as Promise<StatutLabo>) : null))
    .catch(() => null);
  return cache;
}
