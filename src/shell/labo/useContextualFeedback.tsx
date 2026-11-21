/**
 * @file labo/useContextualFeedback.tsx
 * Micro-sondage contextuel du Laboratoire alphabette.eu : une petite carte non bloquante
 * (1 à 5 étoiles + un mot facultatif) qui apparaît UNIQUEMENT juste après une action clé réussie.
 *
 *   const { declencher, sondage } = useContextualFeedback('debat_termine');
 *   …quand l'action a réussi :  declencher();
 *   …dans le rendu :             {sondage}
 *
 * Garde-fous : rien hors d'alphabette.eu ; une fois par action tous les 30 jours ; un seul sondage
 * par visite ; jamais pendant la saisie ; fermeture en un geste (✕, Échap) ; la carte disparaît
 * seule après 25 s sans réponse. Le texte passe par le filtre de confidentialité avant l'envoi.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { envoyerAvisLabo } from './avis';
import { cheminCourant, surLeLaboratoire } from './confidentialite';

export interface OptionsSondage {
  /** id du registre de l'appli ; sinon le serveur la retrouve d'après l'adresse. */
  appId?: string;
  /** Question affichée (par défaut : « Ça s'est bien passé ? »). */
  question?: string;
  /** Délai entre la réussite et l'apparition (ms), 1 200 par défaut. */
  delaiMs?: number;
  /** Jours avant de reposer la question pour la même action, 30 par défaut. */
  intervalleJours?: number;
}

const CLE_HISTORIQUE = 'labo_sondages_v1';
const CLE_SESSION = 'labo_sondage_vu';

function dejaDemande(cle: string, jours: number): boolean {
  try {
    if (sessionStorage.getItem(CLE_SESSION)) return true;
    const h = JSON.parse(localStorage.getItem(CLE_HISTORIQUE) || '{}') as Record<string, number>;
    return Date.now() - (h[cle] ?? 0) < jours * 86400 * 1000;
  } catch {
    return true; // stockage indisponible : on ne dérange pas
  }
}

function noterDemande(cle: string) {
  try {
    sessionStorage.setItem(CLE_SESSION, '1');
    const h = JSON.parse(localStorage.getItem(CLE_HISTORIQUE) || '{}') as Record<string, number>;
    h[cle] = Date.now();
    localStorage.setItem(CLE_HISTORIQUE, JSON.stringify(h));
  } catch {
    /* rien */
  }
}

/** L'utilisateur est en train d'écrire : on attend. */
function saisieEnCours(): boolean {
  const a = document.activeElement as HTMLElement | null;
  return !!a && (a.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName));
}

export function useContextualFeedback(actionName: string, options: OptionsSondage = {}) {
  const { appId, question = "Ça s'est bien passé ?", delaiMs = 1200, intervalleJours = 30 } = options;
  const [visible, setVisible] = useState(false);
  const minuterie = useRef<number | undefined>(undefined);
  const cle = `${cheminCourant()}|${actionName}`;

  const declencher = useCallback(() => {
    if (!surLeLaboratoire() || dejaDemande(cle, intervalleJours)) return;
    window.clearTimeout(minuterie.current);
    const essayer = (restant: number) => {
      minuterie.current = window.setTimeout(() => {
        if (saisieEnCours() && restant > 0) return essayer(restant - 1);
        noterDemande(cle);
        setVisible(true);
      }, delaiMs);
    };
    essayer(5);
  }, [cle, delaiMs, intervalleJours]);

  useEffect(() => () => window.clearTimeout(minuterie.current), []);

  const sondage = visible ? (
    <MicroSondage
      question={question}
      onFermer={() => setVisible(false)}
      onEnvoyer={(rating, comment) =>
        envoyerAvisLabo({ app_id: appId, chemin: cheminCourant(), rating, comment, category: 'Autre', source: 'sondage', declencheur: actionName, version_tested: /\/beta\//.test(location.pathname) ? 'beta' : 'main' })
      }
    />
  ) : null;

  return { declencher, sondage, visible };
}

interface PropsSondage {
  question: string;
  onFermer: () => void;
  onEnvoyer: (rating: number, comment: string) => Promise<unknown>;
}

/** Carte discrète en bas d'écran : ni fond grisé, ni focus volé, rien de bloqué derrière. */
export function MicroSondage({ question, onFermer, onEnvoyer }: PropsSondage) {
  const [note, setNote] = useState<number | null>(null);
  const [texte, setTexte] = useState('');
  const [etat, setEtat] = useState<'repos' | 'envoi' | 'merci' | 'erreur'>('repos');
  const touche = useRef(false);

  useEffect(() => {
    const echap = (e: KeyboardEvent) => e.key === 'Escape' && onFermer();
    window.addEventListener('keydown', echap);
    const auto = window.setTimeout(() => { if (!touche.current) onFermer(); }, 25000);
    return () => { window.removeEventListener('keydown', echap); window.clearTimeout(auto); };
  }, [onFermer]);

  useEffect(() => {
    if (etat !== 'merci') return;
    const t = window.setTimeout(onFermer, 1800);
    return () => window.clearTimeout(t);
  }, [etat, onFermer]);

  const envoyer = async () => {
    if (note === null) return;
    setEtat('envoi');
    try {
      await onEnvoyer(note, texte);
      setEtat('merci');
    } catch {
      setEtat('erreur');
    }
  };

  const s = STYLES;
  return (
    <div role="dialog" aria-modal="false" aria-label="Votre avis en un geste" style={s.carte} onPointerDown={() => (touche.current = true)}>
      <button type="button" onClick={onFermer} aria-label="Fermer" style={s.fermer}>✕</button>
      {etat === 'merci' ? (
        <p style={s.question}>Merci, c'est noté !</p>
      ) : (
        <>
          <p style={s.question}>{question}</p>
          <div role="radiogroup" aria-label="Votre note sur 5" style={s.etoiles}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={note === n}
                aria-label={`${n} sur 5`}
                onClick={() => { touche.current = true; setNote(n); }}
                style={{ ...s.etoile, color: note !== null && n <= note ? '#f59e0b' : 'rgba(127,127,127,.45)' }}
              >
                ★
              </button>
            ))}
          </div>
          {note !== null && (
            <>
              <input
                type="text"
                value={texte}
                maxLength={300}
                onChange={(e) => setTexte(e.target.value)}
                placeholder={note <= 3 ? "Qu'est-ce qui vous a gêné ? (facultatif)" : 'Un mot ? (facultatif)'}
                aria-label="Commentaire facultatif"
                style={s.champ}
              />
              <button type="button" onClick={envoyer} disabled={etat === 'envoi'} style={s.envoyer}>
                {etat === 'envoi' ? 'Envoi…' : 'Envoyer'}
              </button>
              {etat === 'erreur' && <p style={s.petit}>L'envoi n'a pas abouti. Réessayez ou fermez.</p>}
            </>
          )}
          <p style={s.petit}>Anonyme. Aucune clé ni donnée personnelle n'est envoyée.</p>
        </>
      )}
    </div>
  );
}

const STYLES: Record<string, React.CSSProperties> = {
  carte: {
    position: 'fixed', left: '50%', bottom: 'max(12px, env(safe-area-inset-bottom))', transform: 'translateX(-50%)',
    zIndex: 2147483000, width: 'min(22rem, calc(100vw - 24px))', boxSizing: 'border-box', padding: '14px 16px 12px',
    borderRadius: 16, background: 'var(--ab-surface, #ffffff)', color: 'var(--ab-text, #1c1917)',
    border: '1px solid var(--ab-border, rgba(0,0,0,.12))', boxShadow: '0 10px 30px rgba(0,0,0,.18)',
    font: '16px/1.4 system-ui, -apple-system, Segoe UI, sans-serif',
  },
  fermer: { position: 'absolute', top: 6, right: 8, width: 36, height: 36, border: 0, background: 'transparent', color: 'inherit', fontSize: 18, cursor: 'pointer' },
  question: { margin: '0 32px 6px 0', fontWeight: 800 },
  etoiles: { display: 'flex', gap: 2 },
  etoile: { width: 44, height: 44, border: 0, background: 'transparent', fontSize: 30, lineHeight: 1, cursor: 'pointer' },
  champ: {
    width: '100%', boxSizing: 'border-box', marginTop: 8, padding: '10px 12px', borderRadius: 10, font: 'inherit',
    border: '1px solid var(--ab-border, rgba(0,0,0,.2))', background: 'transparent', color: 'inherit',
  },
  envoyer: {
    marginTop: 8, width: '100%', minHeight: 44, borderRadius: 10, border: 0, fontWeight: 800, cursor: 'pointer',
    background: 'var(--ab-accent, #0f766e)', color: '#fff', font: 'inherit',
  },
  petit: { margin: '8px 0 0', fontSize: 13, opacity: 0.75 },
};
