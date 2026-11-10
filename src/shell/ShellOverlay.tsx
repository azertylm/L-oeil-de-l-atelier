import { useEffect, useRef, type ReactNode } from 'react';
import { IconClose } from './icons';

interface ShellOverlayProps {
  titre: string;
  sousTitre?: string;
  /** Pictogramme affiché à gauche du titre. */
  icone?: ReactNode;
  /** Classe supplémentaire sur la feuille (ex. « ab-sheet--large »). */
  classe?: string;
  onClose: () => void;
  children: ReactNode;
}

/**
 * La feuille qui accueille les panneaux de la base (compte, clés, Pass, sites,
 * dons). Sur téléphone elle monte du bas, ailleurs elle se centre ; on la ferme
 * au clic sur le fond, avec Échap ou avec la croix.
 */
export function ShellOverlay({ titre, sousTitre, icone, classe, onClose, children }: ShellOverlayProps) {
  const feuille = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', onKey);

    const precedent = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    feuille.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = precedent;
    };
  }, [onClose]);

  return (
    <div
      className="ab-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={`ab-sheet${classe ? ` ${classe}` : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={titre}
        tabIndex={-1}
        ref={feuille}
      >
        <div className="ab-sheet__head">
          {icone && (
            <span aria-hidden="true" style={{ fontSize: '1.4rem', lineHeight: 1 }}>
              {icone}
            </span>
          )}
          <span className="ab-sheet__titre">
            <strong>{titre}</strong>
            {sousTitre && <span>{sousTitre}</span>}
          </span>
          <button type="button" className="ab-close" onClick={onClose} aria-label="Fermer">
            <IconClose width={16} height={16} />
          </button>
        </div>
        <div className="ab-sheet__corps">{children}</div>
      </div>
    </div>
  );
}
