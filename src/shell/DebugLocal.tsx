import { useEffect, useState } from 'react';
import { alphabetteAudio, type InstantaneAudio } from './audio/alphabetteAudio';

/**
 * Panneau Debug Local (Lot 6) : visible UNIQUEMENT sur localhost / 127.0.0.1 (jamais en production), replié par défaut.
 * Montre : clés du localStorage (valeurs sensibles masquées), état d'alphabetteAudio, largeur de fenêtre, zoom BIG actif
 * et résultat de /api/health.php.
 */
const SENSIBLE = /(key|cle|clé|token|jeton|secret|pass|auth|ia\.chaine|membre|session)/i;

export function estLocal(hote: string | undefined = typeof location === 'undefined' ? undefined : location.hostname): boolean {
  return hote === 'localhost' || hote === '127.0.0.1' || hote === '[::1]';
}

/** Valeur affichable : les secrets sont remplacés par des points (et leur longueur), jamais lus. */
export function valeurMasquee(cle: string, valeur: string | null): string {
  if (valeur === null) return '—';
  if (SENSIBLE.test(cle)) return `••••••• (${valeur.length} caractères)`;
  return valeur.length > 120 ? `${valeur.slice(0, 120)}… (${valeur.length} caractères)` : valeur;
}

export function PanneauDebugLocal() {
  const [ouvert, setOuvert] = useState(false);
  const [, rafraichir] = useState(0);
  const [sante, setSante] = useState<string>('pas encore interrogé');
  const [audio, setAudio] = useState<InstantaneAudio>(() => alphabetteAudio.lireEtat());

  useEffect(() => {
    if (!estLocal() || !ouvert) return undefined;
    const maj = () => { setAudio(alphabetteAudio.lireEtat()); rafraichir((n) => n + 1); };
    const off = alphabetteAudio.abonner(maj);
    window.addEventListener('resize', maj);
    fetch('/api/health.php', { cache: 'no-store' })
      .then((r) => r.text().then((t) => setSante(`HTTP ${r.status} · ${t.slice(0, 600)}`)))
      .catch(() => setSante('injoignable (PHP non lancé en local : normal avec « bun run dev »)'));
    return () => { window.removeEventListener('resize', maj); if (typeof off === 'function') off(); };
  }, [ouvert]);

  if (!estLocal()) return null;
  const cles: string[] = [];
  try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k) cles.push(k); } } catch { /* stockage refusé */ }
  const zoom = getComputedStyle(document.documentElement).getPropertyValue('--ab-zoom').trim() || '1';
  const densite = document.documentElement.getAttribute('data-ab-density') ?? 'normal';

  return (
    <details className="ab-debug" open={ouvert} onToggle={(e) => setOuvert((e.currentTarget as HTMLDetailsElement).open)}>
      <summary>🛠 Debug local</summary>
      <div className="ab-debug__corps">
        <p><strong>Fenêtre</strong> : {window.innerWidth} px · zoom BIG : {zoom} (taille « {densite} »)</p>
        <p><strong>alphabetteAudio</strong> : {audio.etat}{audio.proprietaire ? ` (${audio.proprietaire})` : ''}</p>
        <p><strong>/api/health.php</strong> : {sante}</p>
        <p><strong>localStorage</strong> ({cles.length}) :</p>
        <ul>{cles.sort().map((k) => <li key={k}><code>{k}</code> = {valeurMasquee(k, (() => { try { return localStorage.getItem(k); } catch { return null; } })())}</li>)}</ul>
      </div>
    </details>
  );
}
