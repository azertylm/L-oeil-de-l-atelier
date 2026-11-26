import { useEffect, useRef, useState, type ReactNode } from 'react';
import { alphabetteAudio, type EtatAudio } from '../audio/alphabetteAudio';
import { modeCalme, modeCalmeActif, odometre, palierFiole, eurosDepuisCentimes } from './effets';
import { SVG_VIDES, TEXTES_VIDES, type EcranVideType } from './illustrations';

/** Jauge « Fiole de Labo » X/10 en CSS pur (liquide + micro-bulles, cyan → violet → or/corail). */
export function FioleLabo({ valeur, max = 10, libelle = 'avis positifs' }: { valeur: number; max?: number; libelle?: string }) {
  const v = Math.max(0, Math.min(max, Math.round(valeur)));
  return (
    <span
      className="pop-fiole"
      role="meter"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={v}
      aria-label={`${v} sur ${max} ${libelle}`}
      data-palier={palierFiole(v)}
      style={{ ['--niveau' as string]: v / max }}
    >
      <span className="pop-fiole__verre" aria-hidden="true">
        <span className="pop-fiole__liquide" />
        <span className="pop-fiole__bulles" />
      </span>
      <span className="pop-fiole__texte">
        {v}/{max}
      </span>
    </span>
  );
}

export type TypeBadge = 'pionnier' | 'eclair' | 'projecteur';
const BADGES: Record<TypeBadge, { texte: string; icone: string; aide: string }> = {
  pionnier: { texte: 'Pionnier', icone: '★', aide: 'Parmi les premières applications du Collectif' },
  eclair: { texte: 'Lancement Éclair', icone: '⚡', aide: 'Publiée et validée rapidement' },
  projecteur: { texte: 'Coup de projecteur', icone: '✦', aide: 'Mise en avant par Alphabette' },
};

/** Badges métallisés en CSS : Pionnier (shimmer or), Lancement Éclair (éclair), Coup de projecteur (halo). */
export function BadgeMetal({ type }: { type: TypeBadge }) {
  const b = BADGES[type];
  return (
    <span className={`pop-badge pop-badge--${type}`} title={b.aide}>
      <span className="pop-badge__icone" aria-hidden="true">
        {b.icone}
      </span>
      {b.texte}
    </span>
  );
}

/** Nombre qui défile (600-900 ms) ; `centimes` → affichage en euros. */
export function Odometre({ valeur, centimes = false }: { valeur: number; centimes?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    odometre(ref.current, valeur, { format: centimes ? eurosDepuisCentimes : undefined });
  }, [valeur, centimes]);
  return <span ref={ref} className="pop-odometre" />;
}

/** État de lecture de la voix Alphabette (seule source de l'égaliseur). */
export function useEtatAudio(): EtatAudio {
  const [etat, setEtat] = useState<EtatAudio>(() => alphabetteAudio.lireEtat().etat);
  useEffect(() => {
    const maj = () => setEtat(alphabetteAudio.lireEtat().etat);
    window.addEventListener('alphabette:audio', maj);
    maj();
    return () => window.removeEventListener('alphabette:audio', maj);
  }, []);
  return etat;
}

/** Égaliseur 4 barres, animé seulement pendant la lecture d'`alphabetteAudio`. */
export function Egaliseur({ etat }: { etat?: EtatAudio }) {
  const courant = useEtatAudio();
  const e = etat ?? courant;
  return (
    <span className="ab-egaliseur" data-ab-audio-etat={e} aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

/** Écran vide illustré : Aucun résultat, 0 €, 404, Erreur réseau (bouton Réessayer). */
export function EcranVide({
  type,
  titre,
  texte,
  onReessayer,
  children,
}: {
  type: EcranVideType;
  titre?: string;
  texte?: ReactNode;
  onReessayer?: () => void;
  children?: ReactNode;
}) {
  return (
    <div className="pop-vide" data-type={type} role={type === 'erreur-reseau' ? 'alert' : 'status'}>
      {/* SVG constant, aucun contenu de l'utilisateur */}
      <span dangerouslySetInnerHTML={{ __html: SVG_VIDES[type] }} />
      <p className="pop-vide__titre">{titre ?? TEXTES_VIDES[type].titre}</p>
      <p className="pop-vide__texte">{texte ?? TEXTES_VIDES[type].texte}</p>
      {onReessayer && (
        <button type="button" className="pop-vide__bouton ab-elastique" onClick={onReessayer}>
          Réessayer
        </button>
      )}
      {children}
    </div>
  );
}

/** Carte squelette aux dimensions exactes d'une carte d'application (aucun saut au chargement). */
export function CarteSquelette() {
  return (
    <div className="accueil__tuile pop-carte pop-squelette" aria-hidden="true">
      <span className="pop-carte__vignette" />
      <span className="pop-squelette__ligne pop-squelette__ligne--titre" />
      <span className="pop-squelette__ligne pop-squelette__ligne--court" />
      <span className="pop-squelette__ligne" />
      <span className="pop-squelette__ligne" />
      <span className="pop-carte__pied">
        <span className="pop-squelette__ligne pop-squelette__ligne--bouton" />
      </span>
    </div>
  );
}

/** Interrupteur du Mode Calme (coupe les animations, garde couleurs, contrastes et BIG). */
export function BoutonModeCalme({ className = '' }: { className?: string }) {
  const [actif, setActif] = useState(() => (typeof window === 'undefined' ? false : modeCalmeActif()));
  useEffect(() => {
    const maj = (e: Event) => setActif(Boolean((e as CustomEvent<boolean>).detail));
    window.addEventListener('alphabette:calme', maj);
    return () => window.removeEventListener('alphabette:calme', maj);
  }, []);
  return (
    <button
      type="button"
      className={`pop-calme ${className}`.trim()}
      aria-pressed={actif}
      onClick={() => setActif(modeCalme(!actif))}
    >
      <span aria-hidden="true">{actif ? '🌿' : '✨'}</span>
      {actif ? 'Mode calme activé' : 'Mode calme'}
      <span className="pop-calme__aide">{actif ? 'animations coupées' : 'moins d’animations'}</span>
    </button>
  );
}
