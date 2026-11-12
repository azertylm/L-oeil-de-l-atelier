import { useEffect, useRef, useState } from 'react';

/**
 * Bulle d'aide unique pour tous les boutons qui portent `data-ab-tip="Mot"`.
 *
 * Elle s'affiche au survol de la souris, au passage du clavier et — c'est le but —
 * au doigt : dès qu'on touche un bouton, son nom apparaît un instant. Elle est
 * positionnée en `fixed` : une barre qui défile ne peut donc jamais la couper.
 */
export function InfoBulle() {
  const [bulle, setBulle] = useState<{ texte: string; x: number; y: number } | null>(null);
  const minuterie = useRef<number | undefined>(undefined);

  useEffect(() => {
    const cible = (e: Event) => (e.target instanceof Element ? e.target.closest<HTMLElement>('[data-ab-tip]') : null);
    const montrer = (el: HTMLElement, duree?: number) => {
      const r = el.getBoundingClientRect();
      const texte = el.dataset.abTip ?? '';
      if (!texte) return;
      window.clearTimeout(minuterie.current);
      const x = Math.min(Math.max(r.left + r.width / 2, 90), window.innerWidth - 90);
      // Sous le bouton ; au-dessus s'il est tout en bas de l'écran.
      const y = r.bottom + 8 > window.innerHeight - 40 ? r.top - 40 : r.bottom + 8;
      setBulle({ texte, x, y });
      if (duree) minuterie.current = window.setTimeout(() => setBulle(null), duree);
    };
    const cacher = () => {
      window.clearTimeout(minuterie.current);
      setBulle(null);
    };
    const survol = (e: Event) => {
      const el = cible(e);
      if (el) montrer(el);
    };
    const sortie = (e: Event) => {
      if (cible(e)) cacher();
    };
    const doigt = (e: Event) => {
      const el = cible(e);
      if (el) montrer(el, 1600);
    };
    document.addEventListener('mouseover', survol);
    document.addEventListener('mouseout', sortie);
    document.addEventListener('focusin', survol);
    document.addEventListener('focusout', sortie);
    document.addEventListener('touchstart', doigt, { passive: true });
    document.addEventListener('scroll', cacher, true);
    return () => {
      document.removeEventListener('mouseover', survol);
      document.removeEventListener('mouseout', sortie);
      document.removeEventListener('focusin', survol);
      document.removeEventListener('focusout', sortie);
      document.removeEventListener('touchstart', doigt);
      document.removeEventListener('scroll', cacher, true);
      window.clearTimeout(minuterie.current);
    };
  }, []);

  if (!bulle) return null;
  return (
    <div className="ab-tip" role="tooltip" style={{ left: bulle.x, top: bulle.y }}>
      {bulle.texte}
    </div>
  );
}
