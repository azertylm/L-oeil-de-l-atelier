import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { chargerStatutMeteo, ilYaTexte, meteoDepuisStatut, type StatutLabo } from './meteo';

/**
 * Pastille « Météo du Labo » de la barre écosystème (alphabette.eu uniquement : jamais sur alphabette.fr).
 * Icône + mot ultra-court ; en petit conteneur (≤ 400 px, zoom BIG compris) il ne reste que l'icône,
 * le libellé complet passe dans aria-label. Au clic : petit panneau (Échap ou clic ailleurs pour fermer),
 * refermé aussi quand les barres se masquent au défilement.
 */
export function MeteoPastille() {
  const [statut, setStatut] = useState<StatutLabo | null | 'chargement'>('chargement');
  const [ouvert, setOuvert] = useState(false);
  const bouton = useRef<HTMLButtonElement>(null);
  const panneau = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => { let vivant = true; chargerStatutMeteo().then((s) => vivant && setStatut(s)); return () => { vivant = false; }; }, []);

  const fermer = useCallback((rendreFocus: boolean) => {
    setOuvert(false);
    if (rendreFocus) bouton.current?.focus();
  }, []);

  useEffect(() => {
    if (!ouvert) return undefined;
    const sur = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.stopPropagation(); fermer(true); } };
    const dehors = (e: Event) => {
      const cible = e.target as Node;
      if (!panneau.current?.contains(cible) && !bouton.current?.contains(cible)) fermer(false);
    };
    const barres = (e: Event) => { if ((e as CustomEvent).detail?.cachees) fermer(false); };
    document.addEventListener('keydown', sur);
    document.addEventListener('pointerdown', dehors);
    window.addEventListener('alphabette:barres', barres);
    // Place le panneau sous la pastille, sans jamais sortir de l'écran (280 px compris).
    const b = bouton.current?.getBoundingClientRect();
    if (b && panneau.current) {
      const largeur = Math.min(320, window.innerWidth - 16);
      panneau.current.style.top = `${Math.round(b.bottom + 6)}px`;
      panneau.current.style.width = `${largeur}px`;
      panneau.current.style.left = `${Math.max(8, Math.min(b.right - largeur, window.innerWidth - largeur - 8))}px`;
    }
    panneau.current?.focus();
    return () => {
      document.removeEventListener('keydown', sur);
      document.removeEventListener('pointerdown', dehors);
      window.removeEventListener('alphabette:barres', barres);
    };
  }, [ouvert, fermer]);

  const st = statut === 'chargement' ? null : statut;
  const m = meteoDepuisStatut(st);
  const nom = `Météo du Labo : ${m.libelle === '—' ? 'indisponible' : m.libelle}`;
  const p = st?.dernier_passage;
  const interventions = st?.sentinelle?.interventions ?? [];
  const derniere = interventions[0];

  return (
    <span className="ab-meteo">
      <button ref={bouton} type="button" className="ab-meteo__pastille" aria-expanded={ouvert} aria-controls={id} aria-label={nom}
        data-ab-tip={nom} onClick={() => setOuvert((o) => !o)}>
        <span aria-hidden="true">{m.icone}</span>
        <span className="ab-meteo__mot" aria-hidden="true">{m.libelle}</span>
      </button>
      {ouvert && (
        <div ref={panneau} id={id} className="ab-meteo__panneau" role="region" aria-label="Détails de la Météo du Labo" tabIndex={-1}>
          <h4><span aria-hidden="true">{m.icone}</span> Météo du Labo · {m.libelle === '—' ? 'indisponible' : m.libelle}</h4>
          <p>{m.description.charAt(0).toUpperCase() + m.description.slice(1)}.</p>
          <dl>
            <dt>Dernier passage des agents</dt>
            <dd>{p?.date ? <>{ilYaTexte(p.date)}{p.corrections !== null && p.corrections !== undefined ? `, ${p.corrections} amélioration${p.corrections > 1 ? 's' : ''}` : ''}</> : 'pas encore de passage enregistré'}</dd>
            <dt>Sentinelle</dt>
            <dd>{st?.sentinelle
              ? derniere ? `dernière intervention ${ilYaTexte(derniere.date)}${derniere.app_id ? ` (${derniere.app_id})` : ''}` : "n'a encore jamais eu besoin d'intervenir"
              : 'état indisponible'}</dd>
          </dl>
          <a className="ab-meteo__lien" href="/en-direct/">Ouvrir le journal du Labo →</a>
        </div>
      )}
    </span>
  );
}
