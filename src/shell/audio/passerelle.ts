/**
 * @file audio/passerelle.ts
 * Branche TOUTE l'application sur le lecteur unique, sans réécrire chaque bouton :
 *   1. clics sur [data-ab-ecouter] / [data-ab-ecouter-cible] (avec états visuels automatiques) ;
 *   2. passerelle speechSynthesis : les anciens boutons « Écouter » qui appelaient
 *      window.speechSynthesis.speak() passent désormais par la voix Alphabette (Kore),
 *      et speechSynthesis.cancel() l'arrête.
 * Installée une seule fois par <AppShell>. Désactivable : window.ALPHABETTE_AUDIO_PASSERELLE = false.
 */
import { alphabetteAudio } from './alphabetteAudio';
import { texteDeLElement } from './BoutonEcouter';

declare global {
  interface Window {
    ALPHABETTE_AUDIO_PASSERELLE?: boolean;
    __abAudioInstalle?: boolean;
  }
}

const ID_PAGE = 'ab-page';
let idAuto = 0;

export function installerAudioAlphabette() {
  if (typeof window === 'undefined' || window.__abAudioInstalle) return;
  window.__abAudioInstalle = true;
  installerDelegation();
  if (window.ALPHABETTE_AUDIO_PASSERELLE !== false) installerPasserelleSpeech();
}

/* -------------------------------------------------- 1. Attributs data-* */
function installerDelegation() {
  document.addEventListener(
    'click',
    (e) => {
      const el = (e.target as Element | null)?.closest?.('[data-ab-ecouter], [data-ab-ecouter-cible]') as HTMLElement | null;
      if (!el) return;
      e.preventDefault();
      if (!el.dataset.abEcouterId) el.dataset.abEcouterId = `ab-data-${++idAuto}`;
      const cible = el.dataset.abEcouterCible;
      const texte = cible ? texteDeLElement(document.querySelector(cible)) : el.dataset.abEcouter || '';
      alphabetteAudio.basculer(texte, el.dataset.abEcouterId);
    },
    true,
  );
  // États visuels : data-ab-etat="repos|preparation|lecture" + libellé si l'élément n'a pas d'enfant.
  alphabetteAudio.abonner(() => {
    const { etat, proprietaire } = alphabetteAudio.lireEtat();
    document.querySelectorAll<HTMLElement>('[data-ab-ecouter-id]').forEach((el) => {
      const sien = el.dataset.abEcouterId === proprietaire ? etat : 'repos';
      el.dataset.abEtat = sien;
      el.setAttribute('aria-pressed', String(sien !== 'repos'));
      if (el.dataset.abLibelles !== 'non' && el.children.length === 0) {
        el.textContent = sien === 'preparation' ? 'Préparation...' : sien === 'lecture' ? 'Arrêter' : el.dataset.abLibelle || 'Écouter';
      }
    });
  });
}

/* ------------------------------------------- 2. Passerelle speechSynthesis */
type Enonce = SpeechSynthesisUtterance & { __ab?: boolean };

function installerPasserelleSpeech() {
  const synth = window.speechSynthesis;
  if (!synth) return;
  const speak = synth.speak.bind(synth);
  const cancel = synth.cancel.bind(synth);
  alphabetteAudio.speakOrigine = speak;
  alphabetteAudio.cancelOrigine = cancel;

  const file: Enonce[] = [];
  let courant: Enonce | null = null;
  let jeton = 0;

  const evt = (u: Enonce, type: 'start' | 'end') => {
    const ev = new Event(type) as SpeechSynthesisEvent;
    try {
      u.dispatchEvent(ev); // déclenche aussi u.onstart / u.onend
    } catch {
      try { (type === 'start' ? u.onstart : u.onend)?.call(u, ev); } catch { /* rien */ }
    }
  };

  const suivant = () => {
    courant = file.shift() ?? null;
    if (!courant) return;
    const u = courant;
    const moi = ++jeton;
    alphabetteAudio.play(u.text, ID_PAGE, {
      langue: u.lang?.toLowerCase().startsWith('en') ? 'en' : 'fr',
      onDebut: () => evt(u, 'start'),
      onFin: () => {
        if (moi !== jeton) return;
        evt(u, 'end');
        suivant();
      },
    });
  };

  try {
    synth.speak = (u: SpeechSynthesisUtterance) => {
      const e = u as Enonce;
      if (e.__ab) return speak(e); // repli interne du lecteur
      file.push(e);
      if (!courant) suivant();
    };
    synth.cancel = () => {
      file.length = 0;
      jeton++;
      courant = null;
      if (alphabetteAudio.lireEtat().proprietaire === ID_PAGE) alphabetteAudio.stop();
      else cancel();
    };
    Object.defineProperty(synth, 'speaking', {
      configurable: true,
      get: () => alphabetteAudio.actif || courant !== null,
    });
    Object.defineProperty(synth, 'pending', {
      configurable: true,
      get: () => file.length > 0 || alphabetteAudio.lireEtat().etat === 'preparation',
    });
  } catch { /* navigateur qui refuse : on garde la voix du téléphone */ }

  // Si une autre lecture prend la main (barre, bouton commun), la file de la page est vidée.
  alphabetteAudio.abonner(() => {
    const { proprietaire } = alphabetteAudio.lireEtat();
    if (courant && proprietaire !== ID_PAGE && proprietaire !== null) {
      file.length = 0;
      jeton++;
      courant = null;
    }
    if (proprietaire === null && courant && !alphabetteAudio.actif) {
      // arrêt manuel (bouton de la barre) : on vide aussi.
      setTimeout(() => {
        if (!alphabetteAudio.actif && courant) {
          file.length = 0;
          courant = null;
        }
      }, 0);
    }
  });
}
