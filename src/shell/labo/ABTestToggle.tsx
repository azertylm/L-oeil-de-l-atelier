/**
 * @file labo/ABTestToggle.tsx
 * « Bac à sable A/B en direct » du Laboratoire alphabette.eu.
 *
 *   <ABTestToggle testId="iadebat-accueil-v2" ticketId="fb_1763287200_x9a2"
 *     variantA={<AccueilActuel />} variantB={<AccueilPropose />} />
 *
 * Une barre flottante permet aux testeurs de passer en direct de l'interface actuelle (A) à la
 * proposition de l'agent IA (B), puis de voter en un clic. Le vote est enregistré par le service
 * d'avis (action « ab » + test_id) et inscrit sur le ticket `ticketId`, que lisent les agents.
 *
 * Garde-fous : hors d'alphabette.eu (donc sur alphabette.fr), seule la variante A est rendue,
 * sans barre ni requête. Le choix d'affichage est mémorisé par test ; un seul vote par test.
 * `?ab=B` dans l'adresse ouvre directement la proposition (lien partageable aux testeurs).
 */
import React, { useCallback, useEffect, useState } from 'react';
import { API_AVIS } from './avis';
import { surLeLaboratoire } from './confidentialite';

export type VarianteAB = 'A' | 'B';

export interface ABTestToggleProps {
  /** Identifiant stable du test : lettres minuscules, chiffres, - et _ (60 caractères au plus). */
  testId: string;
  /** Ticket d'avis (fb_…) à l'origine de la proposition : le vote y est rattaché. */
  ticketId?: string;
  /** id du registre de l'appli ; à défaut, déduit de l'adresse (/apps/<id>/ ou <id>.alphabette.eu). */
  appId?: string;
  variantA: React.ReactNode;
  variantB: React.ReactNode;
  libelleA?: string;
  libelleB?: string;
  /** Appelé à chaque bascule (pour une mesure locale, par exemple). */
  onChange?: (v: VarianteAB) => void;
}

const CLE = 'labo_ab_tests_v1';
interface Memoire { vue: Record<string, VarianteAB>; vote: Record<string, VarianteAB> }

function lire(): Memoire {
  try {
    const m = JSON.parse(localStorage.getItem(CLE) || '{}');
    return { vue: m.vue ?? {}, vote: m.vote ?? {} };
  } catch {
    return { vue: {}, vote: {} };
  }
}
function ecrire(m: Memoire) {
  try { localStorage.setItem(CLE, JSON.stringify(m)); } catch { /* stockage indisponible */ }
}

/** id de l'appli d'après l'adresse courante. */
export function appDepuisAdresse(): string {
  if (typeof window === 'undefined') return '';
  const p = window.location.pathname.match(/^\/apps\/([a-z0-9-]+)/i);
  if (p) return p[1];
  const h = window.location.hostname.match(/^([a-z0-9-]+)\.alphabette\.eu$/i);
  return h && h[1] !== 'www' ? h[1] : '';
}

/** Logique du test, utilisable sans la barre (rendu personnalisé). */
export function useABTest(testId: string, opts: { ticketId?: string; appId?: string } = {}) {
  const actif = surLeLaboratoire() && /^[a-z0-9_-]{1,60}$/.test(testId);
  const [variante, setVariante] = useState<VarianteAB>(() => {
    if (!actif) return 'A';
    const q = new URLSearchParams(window.location.search).get('ab');
    if (q === 'A' || q === 'B') return q;
    return lire().vue[testId] ?? 'A';
  });
  const [vote, setVote] = useState<VarianteAB | null>(() => (actif ? lire().vote[testId] ?? null : null));
  const [compte, setCompte] = useState<{ A: number; B: number } | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!actif) return;
    fetch(`${API_AVIS}?test=${encodeURIComponent(testId)}`, { headers: { Accept: 'application/json' }, cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d?.test && setCompte(d.test))
      .catch(() => undefined);
  }, [actif, testId]);

  const basculer = useCallback((v: VarianteAB) => {
    setVariante(v);
    const m = lire();
    m.vue[testId] = v;
    ecrire(m);
  }, [testId]);

  const voter = useCallback(async (v: VarianteAB) => {
    if (!actif || vote) return;
    setMessage('');
    try {
      const r = await fetch(API_AVIS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ action: 'ab', app_id: opts.appId || appDepuisAdresse(), test_id: testId, ticket_id: opts.ticketId, choix: v }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok && r.status !== 409) throw new Error(d.erreur || `Erreur ${r.status}`);
      if (d.test) setCompte({ A: d.test.A, B: d.test.B });
      const m = lire();
      m.vote[testId] = v;
      ecrire(m);
      setVote(v);
      setMessage('Merci, votre vote est enregistré.');
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Vote impossible pour le moment.');
    }
  }, [actif, vote, testId, opts.appId, opts.ticketId]);

  return { actif, variante, basculer, vote, voter, compte, message };
}

export const ABTestToggle: React.FC<ABTestToggleProps> = ({
  testId, ticketId, appId, variantA, variantB,
  libelleA = 'Version actuelle', libelleB = "Proposition de l'IA", onChange,
}) => {
  const t = useABTest(testId, { ticketId, appId });
  const [replie, setReplie] = useState(false);
  useEffect(() => { onChange?.(t.variante); }, [t.variante, onChange]);

  if (!t.actif) return <>{variantA}</>;

  return (
    <>
      {t.variante === 'B' ? variantB : variantA}
      <div className={replie ? 'ab-test ab-test--replie' : 'ab-test'} role="region" aria-label="Comparer deux versions">
        {replie ? (
          <button type="button" className="ab-test__ouvrir" onClick={() => setReplie(false)} aria-label="Ouvrir la comparaison des versions">
            A/B
          </button>
        ) : (
          <>
            <div className="ab-test__bascule" role="radiogroup" aria-label="Version affichée">
              {(['A', 'B'] as const).map((v) => (
                <button key={v} type="button" role="radio" aria-checked={t.variante === v}
                  className={t.variante === v ? 'ab-test__choix ab-test__choix--actif' : 'ab-test__choix'}
                  onClick={() => t.basculer(v)}>
                  {v === 'A' ? libelleA : libelleB}
                </button>
              ))}
            </div>
            {t.vote ? (
              <p className="ab-test__info" role="status">
                Vous préférez : {t.vote === 'A' ? libelleA : libelleB}
                {t.compte ? ` · ${t.compte.A} contre ${t.compte.B}` : ''}
              </p>
            ) : (
              <button type="button" className="ab-test__voter" onClick={() => t.voter(t.variante)}>
                👍 Je préfère celle-ci
              </button>
            )}
            {t.message && !t.vote && <p className="ab-test__info" role="status">{t.message}</p>}
            <button type="button" className="ab-test__fermer" onClick={() => setReplie(true)} aria-label="Réduire la barre de comparaison">✕</button>
          </>
        )}
      </div>
    </>
  );
};
