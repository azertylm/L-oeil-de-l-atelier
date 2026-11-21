/**
 * @file labo/InteractiveSpotlight.tsx
 * Micro-tuto d'accueil léger : met en lumière 3 éléments de la page, l'un après l'autre.
 *
 *   <InteractiveSpotlight tutoId="iadebat-lancer" steps={[
 *     { cible: '#sujet', titre: 'Votre sujet', texte: 'Écrivez ici la question à débattre.' },
 *     { cible: '[data-tuto="lancer"]', titre: 'Lancer', texte: 'Puis appuyez ici.' },
 *   ]} />
 *
 * Ou, branché sur les tutos écrits par les agents quand ils repèrent une difficulté d'usage
 * récurrente (sans bug de code) : `<MicroTuto appId="iadebat" />` (lit /api/labo/tutos.json).
 *
 * Pensé pour alphabette.fr (seniors) : grands textes, boutons de 48 px, clavier (← → Échap),
 * lecteur d'écran (dialogue annoncé), sans animation si l'appareil le demande, montré une seule
 * fois par tuto et toujours fermable. Les éléments introuvables sont sautés ; rien à montrer → rien.
 */
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

export interface EtapeSpotlight {
  /** Sélecteur CSS de l'élément à montrer. */
  cible: string;
  titre: string;
  texte: string;
}

export interface InteractiveSpotlightProps {
  steps: EtapeSpotlight[];
  /** Identifiant du tuto : il n'est montré qu'une fois par appareil (sauf `toujours`). */
  tutoId: string;
  /** Délai avant l'apparition (ms), pour laisser la page se dessiner. 800 par défaut. */
  delaiMs?: number;
  toujours?: boolean;
  onTermine?: (raison: 'fini' | 'ferme') => void;
}

const CLE = 'alphabette_tutos_vus_v1';
const MARGE = 8;

function dejaVu(id: string): boolean {
  try { return (JSON.parse(localStorage.getItem(CLE) || '[]') as string[]).includes(id); } catch { return true; }
}
function marquerVu(id: string) {
  try {
    const l = JSON.parse(localStorage.getItem(CLE) || '[]') as string[];
    if (!l.includes(id)) localStorage.setItem(CLE, JSON.stringify([...l, id].slice(-100)));
  } catch { /* rien */ }
}
function trouver(sel: string): HTMLElement | null {
  try {
    const el = document.querySelector<HTMLElement>(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 ? el : null;
  } catch { return null; }
}

export const InteractiveSpotlight: React.FC<InteractiveSpotlightProps> = ({ steps, tutoId, delaiMs = 800, toujours = false, onTermine }) => {
  const cleEtapes = JSON.stringify(steps.slice(0, 3));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const etapes = useMemo(() => steps.slice(0, 3), [cleEtapes]);
  const [index, setIndex] = useState<number | null>(null);
  const [rect, setRect] = useState<{ top: number; left: number; width: number; height: number; bottom: number } | null>(null);
  const bulle = useRef<HTMLDivElement>(null);
  const titreId = `spot-${tutoId}-titre`;

  // Démarrage différé, à la première étape dont l'élément existe.
  useEffect(() => {
    if (!etapes.length || (!toujours && dejaVu(tutoId))) return;
    const t = window.setTimeout(() => {
      const i = etapes.findIndex((e) => trouver(e.cible));
      if (i >= 0) setIndex(i);
    }, delaiMs);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tutoId]);

  const mesurer = useCallback(() => {
    if (index === null) return;
    const el = trouver(etapes[index].cible);
    const r = el?.getBoundingClientRect();
    setRect((avant) => {
      if (!r) return null;
      if (avant && avant.top === r.top && avant.left === r.left && avant.width === r.width && avant.height === r.height) return avant;
      return { top: r.top, left: r.left, width: r.width, height: r.height, bottom: r.bottom };
    });
  }, [index, etapes]);

  useLayoutEffect(() => {
    if (index === null) return;
    const el = trouver(etapes[index].cible);
    const doux = !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    el?.scrollIntoView({ block: 'center', behavior: doux ? 'smooth' : 'auto' });
    const t = window.setTimeout(mesurer, doux ? 350 : 0);
    mesurer();
    window.addEventListener('resize', mesurer);
    window.addEventListener('scroll', mesurer, true);
    return () => { window.clearTimeout(t); window.removeEventListener('resize', mesurer); window.removeEventListener('scroll', mesurer, true); };
  }, [index, mesurer, etapes]);

  useEffect(() => { if (index !== null) bulle.current?.focus(); }, [index]);

  const terminer = useCallback((raison: 'fini' | 'ferme') => {
    marquerVu(tutoId);
    setIndex(null);
    onTermine?.(raison);
  }, [tutoId, onTermine]);

  const aller = useCallback((sens: 1 | -1) => {
    if (index === null) return;
    for (let i = index + sens; i >= 0 && i < etapes.length; i += sens) {
      if (trouver(etapes[i].cible)) { setIndex(i); return; }
    }
    if (sens === 1) terminer('fini');
  }, [index, etapes, terminer]);

  useEffect(() => {
    if (index === null) return;
    const touche = (e: KeyboardEvent) => {
      if (e.key === 'Escape') terminer('ferme');
      else if (e.key === 'ArrowRight') aller(1);
      else if (e.key === 'ArrowLeft') aller(-1);
    };
    window.addEventListener('keydown', touche);
    return () => window.removeEventListener('keydown', touche);
  }, [index, aller, terminer]);

  if (index === null || !rect) return null;
  const e = etapes[index];
  const vh = window.innerHeight, vw = window.innerWidth;
  const enBas = rect.bottom + 220 < vh || rect.top < vh / 2;
  const largeur = Math.min(360, vw - 24);
  const gauche = Math.max(12, Math.min(rect.left + rect.width / 2 - largeur / 2, vw - largeur - 12));
  const styleBulle: React.CSSProperties = enBas
    ? { top: Math.min(rect.bottom + MARGE + 6, vh - 200), left: gauche, width: largeur }
    : { bottom: Math.max(12, vh - rect.top + MARGE + 6), left: gauche, width: largeur };
  const derniere = !etapes.slice(index + 1).some((x) => trouver(x.cible));
  const presentes = etapes.map((x, i) => (trouver(x.cible) ? i : -1)).filter((i) => i >= 0);

  return (
    <div className="spot" aria-live="polite">
      <div className="spot__voile" onClick={() => terminer('ferme')} aria-hidden="true" />
      <div className="spot__trou" aria-hidden="true"
        style={{ top: rect.top - MARGE, left: rect.left - MARGE, width: rect.width + MARGE * 2, height: rect.height + MARGE * 2 }} />
      <div ref={bulle} className="spot__bulle" role="dialog" aria-modal="false" aria-labelledby={titreId} tabIndex={-1} style={styleBulle}>
        <p className="spot__etape">Étape {presentes.indexOf(index) + 1} sur {presentes.length}</p>
        <h2 id={titreId} className="spot__titre">{e.titre}</h2>
        <p className="spot__texte">{e.texte}</p>
        <div className="spot__actions">
          {index > 0 && <button type="button" className="spot__bouton spot__bouton--second" onClick={() => aller(-1)}>Précédent</button>}
          <button type="button" className="spot__bouton" onClick={() => (derniere ? terminer('fini') : aller(1))}>
            {derniere ? "J'ai compris" : 'Suivant'}
          </button>
        </div>
        <button type="button" className="spot__fermer" onClick={() => terminer('ferme')} aria-label="Fermer le tutoriel">✕</button>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */

export interface TutoAgent {
  id: string;
  steps: EtapeSpotlight[];
  /** Pourquoi l'agent l'a créé (pour l'équipe, jamais affiché). */
  raison?: string;
}

/** Tuto de l'appli publié par les agents (api/labo/tutos.json). Absent → null. */
export function useMicroTuto(appId: string, url = '/api/labo/tutos.json'): TutoAgent | null {
  const [tuto, setTuto] = useState<TutoAgent | null>(null);
  useEffect(() => {
    let vivant = true;
    fetch(url, { headers: { Accept: 'application/json' }, cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const t = d?.apps?.[appId];
        if (vivant && t?.id && Array.isArray(t.steps) && t.steps.length) setTuto({ id: t.id, steps: t.steps, raison: t.raison });
      })
      .catch(() => undefined);
    return () => { vivant = false; };
  }, [appId, url]);
  return tuto;
}

/** Micro-tuto des agents, prêt à poser à la racine d'une appli. */
export const MicroTuto: React.FC<{ appId: string; url?: string }> = ({ appId, url }) => {
  const tuto = useMicroTuto(appId, url);
  return tuto ? <InteractiveSpotlight tutoId={tuto.id} steps={tuto.steps} delaiMs={1500} /> : null;
};
