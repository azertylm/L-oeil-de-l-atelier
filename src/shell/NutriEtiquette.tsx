import { useEffect, useState } from 'react';
import { calculerNutriScore, svgNutriScore, type ConstatsNutri, type ResultatNutri } from './nutriscore';

/** Constats relevés par scripts/nutri-meta.mjs (api/labo/nutri.json) pour une application. */
export interface MetaNutri {
  originesTierces: number; traceurs: number; baseCommune: boolean; voix: boolean; horsLigne: boolean;
  hebergeeFrance: boolean; ia: 'aucune' | 'mistral' | 'autre'; poidsKo: number;
}
export type RegistreNutri = Record<string, MetaNutri>;

export function constatsDe(m: Partial<MetaNutri> | null | undefined): ConstatsNutri {
  const v = <T,>(x: T | undefined): T | null => (x === undefined ? null : x);
  return {
    originesTierces: v(m?.originesTierces), traceurs: v(m?.traceurs), baseCommune: v(m?.baseCommune), voix: v(m?.voix),
    horsLigne: v(m?.horsLigne), hebergeeFrance: v(m?.hebergeeFrance), ia: v(m?.ia), poidsKo: v(m?.poidsKo),
  };
}

let cache: Promise<RegistreNutri> | null = null;
/** Lit api/labo/nutri.json une seule fois ; absent ou illisible = aucune appli évaluée (jamais de score inventé). */
export function chargerNutri(): Promise<RegistreNutri> {
  cache ??= fetch('/api/labo/nutri.json', { cache: 'no-cache' })
    .then((r) => (r.ok ? r.json() : { apps: {} }))
    .then((j) => (j && typeof j.apps === 'object' ? (j.apps as RegistreNutri) : {}))
    .catch(() => ({}));
  return cache;
}

export function useNutri(): RegistreNutri | null {
  const [reg, setReg] = useState<RegistreNutri | null>(null);
  useEffect(() => { let vivant = true; chargerNutri().then((r) => vivant && setReg(r)); return () => { vivant = false; }; }, []);
  return reg;
}

export function resultatPour(reg: RegistreNutri | null, cle: string | undefined): ResultatNutri | null {
  if (!reg || !cle || !reg[cle]) return null;
  return calculerNutriScore(constatsDe(reg[cle]));
}

/** Petit badge discret pour les cartes : rien tant qu'il n'y a pas de lettre honnête. */
export function NutriBadge({ resultat }: { resultat: ResultatNutri | null }) {
  if (!resultat?.lettre) return null;
  return (
    <span className="ab-nutri-badge" title={`Nutri-Score numérique ${resultat.lettre} : ${resultat.resume}`}
      dangerouslySetInnerHTML={{ __html: svgNutriScore(resultat.lettre, 'badge') }} />
  );
}

/** Étiquette complète d'une fiche, avec le détail dépliable en un clic (sans jargon). */
export function NutriFiche({ resultat }: { resultat: ResultatNutri | null }) {
  if (!resultat) return null;
  return (
    <details className="ab-nutri">
      <summary className="ab-nutri__resume">
        <span dangerouslySetInnerHTML={{ __html: svgNutriScore(resultat.lettre) }} />
        <span className="ab-nutri__phrase"><strong>Nutri-Score numérique</strong>{resultat.lettre ? <> {resultat.lettre} · {resultat.resume}</> : <> · {resultat.resume}</>}
          <span className="ab-nutri__plus"> Voir le détail</span></span>
      </summary>
      <div className="ab-nutri__detail">
        {resultat.piliers.map((p) => (
          <section key={p.id}>
            <h4>{p.titre} <span className="ab-nutri__note">{p.note === null ? 'non évalué' : `${p.note}/100`}</span></h4>
            {p.criteres.length > 0 && (
              <ul>{p.criteres.map((c) => (
                <li key={c.libelle}><span aria-hidden="true">{c.ok ? '✓' : '✗'}</span> <strong>{c.libelle}</strong> — {c.explication} <span className="ab-nutri__pts">({c.points}/{c.max})</span></li>
              ))}</ul>
            )}
          </section>
        ))}
        <p className="ab-nutri__pied">Lettre calculée automatiquement à partir des fichiers réellement publiés : jamais écrite à la main.</p>
      </div>
    </details>
  );
}
