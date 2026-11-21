/**
 * @file audio/BoutonEcouter.tsx
 * Bouton « Écouter » commun, branché sur le lecteur unique. Trois états très lisibles :
 *   Repos « Écouter » · Chargement « Préparation... » (cliquable pour annuler) · Lecture « Arrêter ».
 *
 *   <BoutonEcouter texte={fiche.resume} id={`fiche-${fiche.id}`} />
 *   <BoutonEcouter cible="#resultat" />          // lit le texte visible d'un bloc
 *
 * Sans React : <button data-ab-ecouter="Texte à lire">…</button>
 *              <button data-ab-ecouter-cible="#resultat">…</button>
 */
import { useCallback, useState, useSyncExternalStore, type CSSProperties } from 'react';
import { alphabetteAudio, type EtatAudio } from './alphabetteAudio';

let compteur = 0;

/** État du lecteur, vu depuis un élément donné. */
export function useAlphabetteAudio(id?: string) {
  const etat = useSyncExternalStore(alphabetteAudio.abonner, alphabetteAudio.lireEtat, alphabetteAudio.lireEtat);
  const local: EtatAudio = !id ? etat.etat : etat.proprietaire === id ? etat.etat : 'repos';
  return {
    etat: local,
    global: etat,
    basculer: useCallback((texte: string) => alphabetteAudio.basculer(texte, id), [id]),
    stop: alphabetteAudio.stop.bind(alphabetteAudio),
  };
}

/** Texte lisible d'un bloc de la page (sans boutons ni éléments masqués). */
export function texteDeLElement(el: Element | null): string {
  if (!el) return '';
  const copie = el.cloneNode(true) as HTMLElement;
  copie.querySelectorAll('button, script, style, noscript, [aria-hidden="true"], [data-ab-muet]').forEach((n) => n.remove());
  return ((el as HTMLElement).innerText ? texteVisible(el as HTMLElement) : copie.textContent || '').trim();
}
function texteVisible(el: HTMLElement): string {
  const masques = Array.from(el.querySelectorAll<HTMLElement>('button, [aria-hidden="true"], [data-ab-muet]'));
  const avant = masques.map((m) => m.style.display);
  masques.forEach((m) => (m.style.display = 'none'));
  const t = el.innerText || '';
  masques.forEach((m, i) => (m.style.display = avant[i]));
  return t;
}

export interface BoutonEcouterProps {
  /** Texte à lire (ou fonction qui le fournit au moment du clic). */
  texte?: string | (() => string);
  /** Sélecteur CSS d'un bloc dont lire le texte visible. */
  cible?: string;
  /** Identifiant stable de l'élément lu (sinon un identifiant est créé). */
  id?: string;
  /** Petit format, pour les listes. */
  compact?: boolean;
  className?: string;
  style?: CSSProperties;
  libelles?: { repos?: string; preparation?: string; lecture?: string };
}

export function BoutonEcouter({ texte, cible, id, compact, className, style, libelles }: BoutonEcouterProps) {
  const [auto] = useState(() => `ab-ecouter-${++compteur}`);
  const ident = id ?? auto;
  const { etat } = useAlphabetteAudio(ident);
  const mots = {
    repos: libelles?.repos ?? 'Écouter',
    preparation: libelles?.preparation ?? 'Préparation...',
    lecture: libelles?.lecture ?? 'Arrêter',
  };
  const clic = () => {
    const t = typeof texte === 'function' ? texte() : texte ?? texteDeLElement(cible ? document.querySelector(cible) : null);
    alphabetteAudio.basculer(t || '', ident);
  };
  return (
    <button
      type="button"
      className={`ab-ecouter ab-ecouter--${etat}${compact ? ' ab-ecouter--compact' : ''}${className ? ` ${className}` : ''}`}
      style={style}
      onClick={clic}
      aria-pressed={etat !== 'repos'}
      aria-busy={etat === 'preparation'}
      aria-label={etat === 'preparation' ? `${mots.preparation} (toucher pour annuler)` : mots[etat]}
    >
      <IconeAudio etat={etat} />
      {!compact && <span>{mots[etat]}</span>}
    </button>
  );
}

export function IconeAudio({ etat, taille = 18 }: { etat: EtatAudio; taille?: number }) {
  if (etat === 'preparation') {
    return (
      <svg className="ab-ecouter__tourne" width={taille} height={taille} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.25" />
        <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width={taille} height={taille} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5 6 9H2v6h4l5 4V5z" fill="currentColor" />
      {etat === 'lecture' ? (
        <>
          <line x1="22" y1="9" x2="16" y2="15" />
          <line x1="16" y1="9" x2="22" y2="15" />
        </>
      ) : (
        <>
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M19 5a10 10 0 0 1 0 14" />
        </>
      )}
    </svg>
  );
}
