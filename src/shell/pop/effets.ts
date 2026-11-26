/**
 * Design Pop / Néon — moteur d'effets commun (Lot 4).
 *
 * Aucun framework, aucune dépendance : utilisé par la base React (AppShell) et,
 * compilé en IIFE, par les pages HTML simples (public/assets/alphabette-effets.js).
 *
 * Règles tenues partout :
 *  · uniquement `transform` et `opacity` animés (GPU, 60 i/s, CLS = 0) ;
 *  · rien ne se lance au démarrage (pas de pop-up, pas de visite guidée) ;
 *  · Mode Calme (`body.calm-mode` + `html[data-calme]`, localStorage), Mode simple
 *    et `prefers-reduced-motion: reduce` coupent instantanément tout l'animé ;
 *  · le zoom BIG (`--ab-zoom`) et `data-masquer="defilement"` ne sont jamais touchés.
 */

export type Univers = 'labo' | 'vitrine';

const CLE_CALME = 'alphabette.calme';
const CLE_FETES = 'alphabette.fetes';
const CLE_ETATS = 'alphabette.etats-fetes';

const navigateurPresent = () => typeof window !== 'undefined' && typeof document !== 'undefined';

// ------------------------------------------------------------------ Univers (.eu / .fr)

/** alphabette.eu (ou `?labo` en local) = « Labo Pop Électrique » ; sinon « Vitrine Solaire Premium ». */
export function univers(): Univers {
  if (!navigateurPresent()) return 'vitrine';
  const { hostname, search } = window.location;
  return /(^|\.)alphabette\.eu$/i.test(hostname) || new URLSearchParams(search).has('labo') ? 'labo' : 'vitrine';
}

export function poserUnivers(u: Univers = univers()) {
  if (!navigateurPresent()) return u;
  document.documentElement.dataset.univers = u;
  return u;
}

// ------------------------------------------------------------------ Couleurs signatures

/** Les 7 couleurs signatures, une par catégorie d'applications. */
export const SIGNATURES: Record<string, string> = {
  'vie-pratique': '#ff6b4a',
  education: '#4f46e5',
  jeux: '#ff2bd6',
  creation: '#8b5cf6',
  productivite: '#00c2e0',
  communaute: '#f5b50a',
  labo: '#22d3a5',
};

/** « Vie pratique » → `vie-pratique` ; une catégorie inconnue → null. */
export function cleCategorie(nom?: string | null): string | null {
  if (!nom) return null;
  const cle = nom
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return cle in SIGNATURES ? cle : null;
}

/** Colore le liseré lumineux de la double barre avec la catégorie ouverte (null : couleur de l'univers). */
export function poserCategorie(nom?: string | null) {
  if (!navigateurPresent()) return;
  const cle = cleCategorie(nom);
  if (cle) document.documentElement.dataset.abCategorie = cle;
  else delete document.documentElement.dataset.abCategorie;
}

// ------------------------------------------------------------------ Mode Calme

function lireLocal(cle: string): string | null {
  try {
    return localStorage.getItem(cle);
  } catch {
    return null;
  }
}
function ecrireLocal(cle: string, valeur: string | null) {
  try {
    if (valeur === null) localStorage.removeItem(cle);
    else localStorage.setItem(cle, valeur);
  } catch {
    /* stockage indisponible : réglage de la session seulement */
  }
}

export function modeCalmeActif(): boolean {
  return lireLocal(CLE_CALME) === 'oui';
}

function poserClasseCalme(actif: boolean) {
  const r = document.documentElement;
  if (actif) r.dataset.calme = 'oui';
  else delete r.dataset.calme;
  if (document.body) document.body.classList.toggle('calm-mode', actif);
}

/** Lit ou change le Mode Calme ; renvoie l'état final. Événement `alphabette:calme`. */
export function modeCalme(actif?: boolean): boolean {
  if (!navigateurPresent()) return false;
  const final = actif === undefined ? modeCalmeActif() : actif;
  if (actif !== undefined) ecrireLocal(CLE_CALME, final ? 'oui' : null);
  poserClasseCalme(final);
  if (!document.body) document.addEventListener('DOMContentLoaded', () => poserClasseCalme(modeCalmeActif()), { once: true });
  if (actif !== undefined) window.dispatchEvent(new CustomEvent('alphabette:calme', { detail: final }));
  return final;
}

/** Vrai quand rien ne doit bouger : Mode Calme, Mode simple ou réglage « réduire les animations ». */
export function mouvementReduit(): boolean {
  if (!navigateurPresent()) return true;
  const r = document.documentElement;
  if (r.dataset.calme === 'oui' || 'abSimple' in r.dataset) return true;
  return Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
}

// ------------------------------------------------------------------ Onde Jour / Nuit

type DocumentAvecTransition = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void>; finished: Promise<void> };
};

/**
 * Change de thème en onde circulaire depuis le bouton (View Transitions + clip-path),
 * repli en fondu de 300 ms, instantané en Mode Calme. `appliquer` doit modifier le DOM
 * de façon synchrone (poser `data-ab-theme`).
 */
export function vagueTheme(origine: Element | null | undefined, appliquer: () => void) {
  if (!navigateurPresent()) return appliquer();
  const doc = document as DocumentAvecTransition;
  const r = document.documentElement;
  if (mouvementReduit()) return appliquer();
  if (typeof doc.startViewTransition !== 'function') {
    r.classList.add('ab-fondu-theme');
    appliquer();
    window.setTimeout(() => r.classList.remove('ab-fondu-theme'), 340);
    return;
  }
  const boite = origine?.getBoundingClientRect();
  const x = boite ? boite.left + boite.width / 2 : window.innerWidth - 40;
  const y = boite ? boite.top + boite.height / 2 : 40;
  const rayon = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  r.classList.add('ab-vague');
  const transition = doc.startViewTransition(appliquer);
  transition.ready
    .then(() => {
      r.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${rayon}px at ${x}px ${y}px)`] },
        { duration: 420, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' } as KeyframeAnimationOptions,
      );
    })
    .catch(() => {});
  transition.finished.finally(() => r.classList.remove('ab-vague'));
}

// ------------------------------------------------------------------ Confettis

export interface OptionsConfettis {
  nombre?: number;
  duree?: number;
  couleurs?: string[];
}

/** Pluie de confettis légère sur un <canvas> plein écran, retiré tout seul (≈ 2,2 s). */
export function confettis(options: OptionsConfettis = {}) {
  if (!navigateurPresent() || mouvementReduit() || !document.body) return;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const L = window.innerWidth;
  const H = window.innerHeight;
  canvas.width = L * ratio;
  canvas.height = H * ratio;
  canvas.className = 'pop-confettis';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  ctx.scale(ratio, ratio);
  const u = document.documentElement.dataset.univers;
  const couleurs =
    options.couleurs ?? (u === 'labo' ? ['#00e5ff', '#8b5cf6', '#ff2bd6', '#22d3a5', '#ffffff'] : ['#ff6b4a', '#f5b50a', '#4f46e5', '#ffd27a', '#ffffff']);
  const nombre = Math.min(options.nombre ?? (L < 480 ? 70 : 120), 160);
  const duree = options.duree ?? 2200;
  const pieces = Array.from({ length: nombre }, () => ({
    x: L / 2 + (Math.random() - 0.5) * L * 0.3,
    y: H * 0.35,
    vx: (Math.random() - 0.5) * 11,
    vy: -Math.random() * 11 - 4,
    t: 5 + Math.random() * 6,
    a: Math.random() * Math.PI,
    va: (Math.random() - 0.5) * 0.35,
    c: couleurs[Math.floor(Math.random() * couleurs.length)],
  }));
  const debut = performance.now();
  let image = 0;
  const fin = () => {
    cancelAnimationFrame(image);
    canvas.remove();
  };
  const pas = (maintenant: number) => {
    const ecoule = maintenant - debut;
    if (ecoule > duree || mouvementReduit()) return fin();
    ctx.clearRect(0, 0, L, H);
    ctx.globalAlpha = ecoule > duree - 500 ? Math.max(0, (duree - ecoule) / 500) : 1;
    for (const p of pieces) {
      p.vy += 0.32;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.a += p.va;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.a);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.t / 2, -p.t / 4, p.t, p.t / 2);
      ctx.restore();
    }
    image = requestAnimationFrame(pas);
  };
  image = requestAnimationFrame(pas);
  window.setTimeout(fin, duree + 400); // filet de sécurité (onglet en arrière-plan)
}

/** Types de fêtes reconnus (chaque clé ne fête qu'une fois par appareil). */
export type Fete = 'eligible_fr' | 'transfert_fr' | 'premier_abonne' | 'trophee' | 'souscription' | 'pack_licences';

function fetesVues(): string[] {
  try {
    const v = JSON.parse(lireLocal(CLE_FETES) || '[]');
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

/** Lance les confettis pour un vrai événement, une seule fois par `cle` sur cet appareil. */
export function celebrer(type: Fete, cle: string = type): boolean {
  if (!navigateurPresent()) return false;
  const id = `${type}:${cle}`;
  const vues = fetesVues();
  if (vues.includes(id)) return false;
  ecrireLocal(CLE_FETES, JSON.stringify(vues.concat(id).slice(-200)));
  confettis();
  return true;
}

/**
 * Fête un passage « faux → vrai » d'un état réel (ex. appli devenue éligible au .fr).
 * La première fois qu'on voit l'état, on le note sans fêter : pas de confettis au premier
 * passage d'un visiteur sur une appli déjà validée.
 */
export function celebrerSiNouveau(type: Fete, cle: string, vrai: boolean): boolean {
  if (!navigateurPresent()) return false;
  let etats: Record<string, boolean> = {};
  try {
    etats = JSON.parse(lireLocal(CLE_ETATS) || '{}') || {};
  } catch {
    etats = {};
  }
  const id = `${type}:${cle}`;
  const avant = etats[id];
  if (avant === vrai) return false;
  etats[id] = vrai;
  ecrireLocal(CLE_ETATS, JSON.stringify(etats));
  return avant === false && vrai ? celebrer(type, cle) : false;
}

// ------------------------------------------------------------------ Odomètre

export interface OptionsOdometre {
  duree?: number;
  format?: (valeur: number) => string;
  depuis?: number;
}

const valeursOdometre = new WeakMap<Element, number>();

/** Fait défiler un nombre jusqu'à `cible` (600-900 ms). Chiffres à chasse fixe : aucun saut de mise en page. */
export function odometre(el: Element | null, cible: number, options: OptionsOdometre = {}) {
  if (!el) return;
  const format = options.format ?? ((v: number) => String(Math.round(v)));
  const depart = options.depuis ?? valeursOdometre.get(el) ?? 0;
  valeursOdometre.set(el, cible);
  (el as HTMLElement).classList?.add('pop-odometre');
  if (mouvementReduit() || depart === cible) {
    el.textContent = format(cible);
    return;
  }
  const duree = Math.min(900, Math.max(600, options.duree ?? 750));
  const debut = performance.now();
  const pas = (t: number) => {
    const k = Math.min(1, (t - debut) / duree);
    const lisse = 1 - Math.pow(1 - k, 3);
    el.textContent = format(k >= 1 ? cible : Math.round(depart + (cible - depart) * lisse));
    if (k < 1) requestAnimationFrame(pas);
  };
  requestAnimationFrame(pas);
}

/** Centimes entiers → « 12,50 € » (aucun flottant dans les calculs). */
export function eurosDepuisCentimes(c: number): string {
  const n = Math.trunc(c);
  const s = n < 0 ? '-' : '';
  const a = Math.abs(n);
  return `${s}${Math.floor(a / 100)},${String(a % 100).padStart(2, '0')} €`;
}

// ------------------------------------------------------------------ Fiole de Labo

/** Palier de couleur de la fiole : cyan 0-4, violet 5-7, or/corail pulsant 8-10. */
export function palierFiole(valeur: number): 'bas' | 'moyen' | 'haut' {
  return valeur >= 8 ? 'haut' : valeur >= 5 ? 'moyen' : 'bas';
}

/** Code HTML d'une fiole (pages simples). Le composant React `FioleLabo` rend la même chose. */
export function htmlFiole(valeur: number, max = 10, libelle = 'avis positifs'): string {
  const v = Math.max(0, Math.min(max, Math.round(valeur)));
  return (
    `<span class="pop-fiole" role="meter" aria-valuemin="0" aria-valuemax="${max}" aria-valuenow="${v}" ` +
    `aria-label="${v} sur ${max} ${libelle}" data-palier="${palierFiole(v)}" style="--niveau:${v / max}">` +
    `<span class="pop-fiole__verre" aria-hidden="true"><span class="pop-fiole__liquide"></span><span class="pop-fiole__bulles"></span></span>` +
    `<span class="pop-fiole__texte">${v}/${max}</span></span>`
  );
}

// ------------------------------------------------------------------ Égaliseur vocal

/** 4 barres, animées seulement quand `alphabetteAudio` est en lecture (`data-ab-audio-etat`). */
export const HTML_EGALISEUR =
  '<span class="ab-egaliseur" aria-hidden="true"><i></i><i></i><i></i><i></i></span>';

// ------------------------------------------------------------------ Délégations (3D, ripple, préchargement, transitions)

const finePointe = () => Boolean(window.matchMedia?.('(hover: hover) and (pointer: fine)').matches);

function installerCartes3D() {
  let carte: HTMLElement | null = null;
  let image = 0;
  let px = 0;
  let py = 0;
  const appliquer = () => {
    image = 0;
    if (!carte) return;
    const b = carte.getBoundingClientRect();
    const kx = (px - b.left) / b.width;
    const ky = (py - b.top) / b.height;
    carte.style.setProperty('--ry', `${((kx - 0.5) * 12).toFixed(2)}deg`); // ±6°
    carte.style.setProperty('--rx', `${((0.5 - ky) * 12).toFixed(2)}deg`);
    carte.style.setProperty('--mx', `${(kx * 100).toFixed(1)}%`);
    carte.style.setProperty('--my', `${(ky * 100).toFixed(1)}%`);
  };
  const relacher = (el: HTMLElement | null) => {
    if (!el) return;
    el.style.removeProperty('--rx');
    el.style.removeProperty('--ry');
    el.classList.remove('pop-carte--survol');
  };
  document.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse' || !finePointe() || mouvementReduit()) return;
      const cible = e.target instanceof Element ? (e.target.closest('[data-ab-3d]') as HTMLElement | null) : null;
      if (cible !== carte) {
        relacher(carte);
        carte = cible;
        carte?.classList.add('pop-carte--survol');
      }
      if (!carte) return;
      px = e.clientX;
      py = e.clientY;
      if (!image) image = requestAnimationFrame(appliquer);
    },
    { passive: true },
  );
  document.addEventListener('pointerleave', () => {
    relacher(carte);
    carte = null;
  });
  window.addEventListener('blur', () => {
    relacher(carte);
    carte = null;
  });
}

const SELECTEUR_RIPPLE = '.ab-elastique, .ab-btn, .labo__bouton, [data-ab-ripple]';

function installerRipple() {
  document.addEventListener(
    'pointerdown',
    (e) => {
      if (mouvementReduit() || !(e.target instanceof Element)) return;
      const hote = e.target.closest(SELECTEUR_RIPPLE) as HTMLElement | null;
      if (!hote || (hote as HTMLButtonElement).disabled) return;
      if (!hote.classList.contains('ab-ripple-hote')) {
        if (getComputedStyle(hote).position === 'static') hote.classList.add('ab-ripple-hote');
        else hote.classList.add('ab-ripple-hote', 'ab-ripple-hote--place');
      }
      const b = hote.getBoundingClientRect();
      const taille = Math.max(b.width, b.height) * 2;
      const onde = document.createElement('span');
      onde.className = 'ab-ripple';
      onde.setAttribute('aria-hidden', 'true');
      onde.style.width = onde.style.height = `${taille}px`;
      onde.style.left = `${e.clientX - b.left - taille / 2}px`;
      onde.style.top = `${e.clientY - b.top - taille / 2}px`;
      hote.appendChild(onde);
      onde.addEventListener('animationend', () => onde.remove(), { once: true });
      window.setTimeout(() => onde.remove(), 900);
    },
    { passive: true },
  );
}

function installerPrechargement() {
  const faits = new Set<string>();
  const economie = () => Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
  const prefetch = (e: Event) => {
    const lien = e.target instanceof Element ? (e.target.closest('a[data-ab-prefetch]') as HTMLAnchorElement | null) : null;
    if (!lien || economie()) return;
    let url: URL;
    try {
      url = new URL(lien.href, location.href);
    } catch {
      return;
    }
    if (url.origin !== location.origin || faits.has(url.href) || url.pathname === location.pathname) return;
    faits.add(url.href);
    const l = document.createElement('link');
    l.rel = 'prefetch';
    l.href = url.href;
    document.head.appendChild(l);
  };
  document.addEventListener('pointerover', prefetch, { passive: true });
  document.addEventListener('focusin', prefetch);
}

/** Survol / focus d'un élément `[data-ab-categorie]` → liseré de la barre à sa couleur. */
function installerCategories() {
  const survol = (e: Event) => {
    const el = e.target instanceof Element ? e.target.closest('[data-ab-categorie]') : null;
    if (el && el !== document.documentElement) poserCategorie(el.getAttribute('data-ab-categorie'));
  };
  document.addEventListener('pointerover', survol, { passive: true });
  document.addEventListener('focusin', survol);
}

/**
 * View Transitions : au clic sur une carte `[data-ab-vt="slug"]`, sa vignette prend le nom
 * `vt-<slug>` (la page d'arrivée donne le même nom au titre de sa barre). Sans l'API : fondu 180 ms.
 */
function installerTransitions() {
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const lien = e.target instanceof Element ? (e.target.closest('a[data-ab-vt]') as HTMLAnchorElement | null) : null;
    if (!lien || lien.target === '_blank') return;
    const slug = (lien.dataset.abVt || '').replace(/[^a-z0-9-]/gi, '');
    if (!slug) return;
    let url: URL;
    try {
      url = new URL(lien.href, location.href);
    } catch {
      return;
    }
    const memeOrigine = url.origin === location.origin;
    const vignette = (lien.querySelector('[data-ab-vt-cible]') as HTMLElement | null) ?? lien;
    if (memeOrigine && 'onpagereveal' in window) {
      vignette.style.setProperty('view-transition-name', `vt-${slug}`);
      return; // la navigation inter-documents fait le reste (@view-transition)
    }
    if (mouvementReduit()) return;
    e.preventDefault();
    document.documentElement.classList.add('ab-depart');
    window.setTimeout(() => location.assign(url.href), 180);
  });
  // Retour arrière (cache de page) : on enlève le fondu de départ.
  window.addEventListener('pageshow', () => document.documentElement.classList.remove('ab-depart'));
}

/** Les pages qui veulent fêter un événement : `dispatchEvent(new CustomEvent('alphabette:celebrer', { detail: { type, cle } }))`. */
function installerEcouteFetes() {
  window.addEventListener('alphabette:celebrer', (e) => {
    const d = (e as CustomEvent<{ type?: Fete; cle?: string }>).detail || {};
    if (d.type) celebrer(d.type, d.cle || d.type);
  });
}

let installe = false;

/** À appeler une fois par page : univers, Mode Calme, délégations. Idempotent, sans effet visible au démarrage. */
export function installerEffets() {
  if (!navigateurPresent() || installe) return;
  installe = true;
  poserUnivers();
  modeCalme();
  installerCartes3D();
  installerRipple();
  installerPrechargement();
  installerCategories();
  installerTransitions();
  installerEcouteFetes();
  window.addEventListener('storage', (e) => {
    if (e.key === CLE_CALME) poserClasseCalme(modeCalmeActif());
  });
}
