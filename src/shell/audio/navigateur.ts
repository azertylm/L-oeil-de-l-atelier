/**
 * @file audio/navigateur.ts
 * Version « script » de la voix Alphabette, pour les pages HTML sans React.
 * Construite dans public/assets/alphabette-audio.js (bun run build:audio) et chargée
 * automatiquement par alphabette-barre.js. Utilisable seule :
 *
 *   <script src="https://alphabette.fr/assets/alphabette-audio.js"></script>
 *   <button data-ab-ecouter="Texte à lire">Écouter</button>
 *   <button data-ab-ecouter-cible="#resultat">Écouter</button>
 *   window.alphabetteAudio.basculer('Bonjour', 'mon-id');
 */
import { installerAudioAlphabette } from './passerelle';

const CSS = `
.ab-ecouter,[data-ab-ecouter-id]{display:inline-flex;align-items:center;justify-content:center;gap:.45em;min-height:44px;padding:.55em 1.05em;border-radius:999px;border:2px solid var(--ab-accent,#2563eb);background:var(--ab-surface,#fff);color:var(--ab-ink,#0f172a);font:inherit;font-weight:700;cursor:pointer}
[data-ab-etat="preparation"]{border-style:dashed;opacity:.85}
[data-ab-etat="lecture"]{background:var(--ab-ok,#15803d)!important;border-color:var(--ab-ok,#15803d)!important;color:#fff!important}
#ab-lire[aria-busy="true"]{animation:ab-pulse 1s ease-in-out infinite}
#ab-lire.ab-pico--audio-lecture{background:var(--ab-ok,#15803d)!important;color:#fff!important}
@keyframes ab-pulse{50%{opacity:.45}}`;

if (typeof window !== 'undefined' && !document.getElementById('ab-audio-css')) {
  const style = document.createElement('style');
  style.id = 'ab-audio-css';
  style.textContent = CSS;
  (document.head || document.documentElement).appendChild(style);
  installerAudioAlphabette();
  window.dispatchEvent(new CustomEvent('alphabette:audio-pret'));
}
