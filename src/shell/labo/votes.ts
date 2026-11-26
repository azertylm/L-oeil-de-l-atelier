/**
 * @file labo/votes.ts
 * Avis « Positif / Négatif » sur une appli de créateur (alphabette.eu), sans framework : la même brique sert le shell React
 * et le cadre PHP des applis de créateurs (bundle public/assets/alphabette-votes.js, voir `bun run build:votes`).
 *
 * Règles (décidées avec Valentin) :
 *  - AUCUNE pop-up à l'ouverture : un bandeau discret apparaît en bas d'écran après 30 s d'usage ACTIF (onglet visible +
 *    geste récent, ou pointeur / focus dans l'application), refermable en 1 clic, jamais en « Mode Calme ».
 *  - Raccourci dans la barre : `ouvrirBandeauAvis()` (entrée « Noter cette appli » du menu ⋯).
 *  - 1 clic suffit pour voter (compte confirmé exigé par le serveur) ; mise à jour optimiste avec retour arrière si le serveur refuse.
 *  - Le serveur reste juge (session ≥ 30 s mesurée par SON horloge, 1 avis par (compte, appli), anti-fraude) : rien ici n'est de confiance.
 */

export const TAGS_AVIS = ['utile', 'clair', 'beau', 'rapide', 'original', 'accessible', 'confus', 'lent', 'bug', 'inutile'] as const;
export const MOTIFS_SIGNALEMENT: Record<string, string> = {
  bug: 'Ne marche pas',
  illicite: 'Contenu illicite ou dangereux',
  arnaque: 'Arnaque ou hameçonnage',
  donnees: 'Collecte abusive de données',
  droits: 'Atteinte à des droits (auteur, image, marque)',
  autre: 'Autre',
};
export const COMMENTAIRE_MAX = 280;
export const DELAI_USAGE_ACTIF_MS = 30_000;
const INACTIF_APRES_MS = 15_000;
const API_DEFAUT = '/api/createurs/';

export interface OptionsVotes {
  appId: string;
  /** Racine du service (« /api/createurs/ »). */
  api?: string;
  /** Surcharge du délai d'usage actif (essais). */
  delaiMs?: number;
  /** Élément <iframe> de l'appli, pour compter comme « actif » un pointeur ou un focus qui s'y trouve. */
  cadre?: HTMLElement | null;
}

export interface EtatAvis {
  positifs: number;
  negatifs: number;
  ratio: number;
  statut: string;
  seuil: number;
  mon_avis?: { positif: boolean; tags: string[]; commentaire: string };
}

interface ReponseApi { status: number; data: Record<string, unknown> }

async function appeler(api: string, fichier: string, init?: { corps?: unknown; requete?: string }): Promise<ReponseApi> {
  const post = init?.corps !== undefined;
  const r = await fetch(`${api}${fichier}${init?.requete ?? ''}`, {
    method: post ? 'POST' : 'GET',
    credentials: 'same-origin',
    headers: post ? { 'Content-Type': 'application/json', 'X-Alphabette': '1' } : undefined,
    body: post ? JSON.stringify(init!.corps) : undefined,
  });
  let data: Record<string, unknown> = {};
  try { data = (await r.json()) as Record<string, unknown>; } catch { /* réponse vide */ }
  return { status: r.status, data };
}

/** Texte lisible pour une erreur du serveur (jamais de code brut montré à la personne). */
export function messageErreurAvis(status: number, data: Record<string, unknown>): string {
  if (status === 401) return 'Connectez-vous pour donner votre avis (un lien vous est envoyé par e-mail, sans mot de passe).';
  if (status === 403 && data.code === 'auto_vote') return 'Vous ne pouvez pas noter votre propre application.';
  if (status === 403) return 'Confirmez d’abord votre adresse e-mail.';
  if (status === 429 && data.code === 'session_trop_courte') return `Utilisez l’application encore ${Math.max(1, Number(data.attendre) || 30)} secondes avant de la noter.`;
  if (status === 429) return 'Beaucoup d’avis aujourd’hui : revenez demain.';
  if (status === 409) return 'Les avis sont suspendus pour cette application.';
  return typeof data.erreur === 'string' ? data.erreur : 'Votre avis n’a pas pu être envoyé. Réessayez dans un instant.';
}

/** Signalement d'un problème ou d'un abus (e-mail immédiat à l'administrateur côté serveur). */
export async function envoyerSignalement(
  appId: string,
  motif: string,
  details: string,
  contact = '',
  api = API_DEFAUT,
): Promise<{ ok: boolean; message: string }> {
  try {
    const { status, data } = await appeler(api, 'signaler.php', { corps: { app_id: appId, motif, details, contact } });
    if (status === 200) return { ok: true, message: 'Merci, votre signalement est transmis. Nous le lisons sans délai.' };
    return { ok: false, message: typeof data.erreur === 'string' ? data.erreur : 'Signalement impossible pour le moment.' };
  } catch {
    return { ok: false, message: 'Réseau indisponible : réessayez dans un instant.' };
  }
}

/* ───────────────────────── mesure de l'usage actif ───────────────────────── */

export class MesureUsage {
  private cumul = 0;
  private dernierGeste = Date.now();
  private survol = false;
  private minuteur: ReturnType<typeof setInterval> | null = null;
  private lecteurs: Array<() => void> = [];

  constructor(private readonly cadre: HTMLElement | null, private readonly onSeuil: () => void, private readonly seuilMs: number) {}

  demarrer(): void {
    if (typeof window === 'undefined' || this.minuteur) return;
    const geste = () => { this.dernierGeste = Date.now(); };
    for (const n of ['pointerdown', 'keydown', 'scroll', 'touchstart', 'wheel']) {
      window.addEventListener(n, geste, { passive: true, capture: true });
      this.lecteurs.push(() => window.removeEventListener(n, geste, { capture: true } as EventListenerOptions));
    }
    if (this.cadre) {
      const entre = () => { this.survol = true; };
      const sort = () => { this.survol = false; };
      this.cadre.addEventListener('mouseenter', entre);
      this.cadre.addEventListener('mouseleave', sort);
      this.cadre.addEventListener('touchstart', geste, { passive: true });
      this.lecteurs.push(() => { this.cadre!.removeEventListener('mouseenter', entre); this.cadre!.removeEventListener('mouseleave', sort); this.cadre!.removeEventListener('touchstart', geste); });
    }
    this.minuteur = setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      const iframeFocus = !!this.cadre && document.activeElement === this.cadre;
      const actif = Date.now() - this.dernierGeste < INACTIF_APRES_MS || this.survol || iframeFocus;
      if (!actif) return;
      this.cumul += 1000;
      if (this.cumul >= this.seuilMs) { this.arreter(); this.onSeuil(); }
    }, 1000);
  }

  arreter(): void {
    if (this.minuteur) clearInterval(this.minuteur);
    this.minuteur = null;
    this.lecteurs.forEach((f) => f());
    this.lecteurs = [];
  }

  get secondesActives(): number { return Math.floor(this.cumul / 1000); }
}

/* ───────────────────────────── bandeau d'avis ───────────────────────────── */

const STYLE = `
.abv{position:fixed;left:50%;transform:translateX(-50%);bottom:max(8px,env(safe-area-inset-bottom));z-index:2147483000;width:min(560px,calc(100vw - 16px));
 box-sizing:border-box;padding:10px 12px;border:1px solid #8886;border-radius:14px;background:#fff;color:#1b1b1f;font:15px/1.4 system-ui,sans-serif;box-shadow:0 8px 30px rgba(0,0,0,.28)}
@media (prefers-color-scheme:dark){.abv{background:#1d1d24;color:#f1f1f4}}
html[data-ab-theme="nuit"] .abv,[data-ab-theme="nuit"] .abv{background:#1d1d24;color:#f1f1f4}
.abv *{box-sizing:border-box}
.abv__ligne{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.abv__q{flex:1 1 150px;min-width:0;font-weight:700}
.abv button{min-height:44px;min-width:44px;padding:0 14px;border-radius:10px;border:1px solid #8888;background:transparent;color:inherit;font:inherit;cursor:pointer}
.abv button:focus-visible,.abv textarea:focus-visible{outline:3px solid #5b3df5;outline-offset:2px}
.abv button[aria-pressed="true"]{background:#5b3df5;border-color:#5b3df5;color:#fff}
.abv__ok{background:#5b3df5!important;border-color:#5b3df5!important;color:#fff!important}
.abv__tags{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}
.abv textarea{width:100%;min-height:64px;padding:8px;border-radius:10px;border:1px solid #8888;background:transparent;color:inherit;font:inherit}
.abv__msg{margin:6px 0 0;font-size:14px}
.abv__msg a{color:inherit;text-decoration:underline}
.abv__cpt{font-size:13px;opacity:.75}
html[data-ab-calme] .abv{transition:none}
@media print{.abv{display:none}}
`;

function el<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Record<string, string> = {}, texte = ''): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (texte) e.textContent = texte;
  return e;
}

export interface ControleVotes {
  ouvrir: () => void;
  fermer: () => void;
  detruire: () => void;
}

/**
 * Démarre la mesure d'usage et prépare le bandeau. Retourne un contrôle (raccourci « Noter », nettoyage).
 * Aucune requête avant l'ouverture de la session : le ticket signé date le début d'usage pour le serveur.
 */
export function demarrerVotes(opts: OptionsVotes): ControleVotes {
  const api = opts.api ?? API_DEFAUT;
  const cleFerme = `alphabette.avis.ferme.${opts.appId}`;
  let racine: HTMLElement | null = null;
  let ticket: string | null = null;
  let etat: EtatAvis | null = null;
  let mon: { positif: boolean | null; tags: string[]; commentaire: string } = { positif: null, tags: [], commentaire: '' };
  let ferme = false;
  try { ferme = sessionStorage.getItem(cleFerme) === '1'; } catch { /* stockage indisponible */ }

  const ouvrirSession = async () => {
    if (ticket) return;
    try {
      const { status, data } = await appeler(api, 'votes.php', { requete: `?ouvrir=${encodeURIComponent(opts.appId)}` });
      if (status === 200 && typeof data.ticket === 'string') ticket = data.ticket;
    } catch { /* hors ligne : on réessaiera au moment d'ouvrir */ }
  };
  const chargerEtat = async () => {
    try {
      const { status, data } = await appeler(api, 'votes.php', { requete: `?etat=${encodeURIComponent(opts.appId)}` });
      if (status === 200) {
        etat = data as unknown as EtatAvis;
        if (etat.mon_avis) mon = { positif: etat.mon_avis.positif, tags: etat.mon_avis.tags, commentaire: etat.mon_avis.commentaire };
      }
    } catch { /* ignoré */ }
  };

  const message = (texte: string, lien?: { href: string; texte: string }) => {
    const m = racine?.querySelector('.abv__msg');
    if (!m) return;
    m.textContent = texte;
    if (lien) { m.append(' '); const a = el('a', { href: lien.href }, lien.texte); m.append(a); }
  };

  /** Envoie l'avis. Mise à jour optimiste : l'état local change tout de suite, et revient en arrière si le serveur refuse. */
  const voter = async (positif: boolean, details = false) => {
    const avant = { ...mon, tags: [...mon.tags] };
    const compteursAvant = etat ? { p: etat.positifs, n: etat.negatifs } : null;
    mon = { ...mon, positif };
    dessiner();
    message(details ? 'Détails enregistrés…' : 'Merci ! Votre avis est enregistré…');
    if (!ticket) await ouvrirSession();
    try {
      const { status, data } = await appeler(api, 'votes.php', {
        corps: { action: 'voter', app_id: opts.appId, ticket, positif, tags: mon.tags, commentaire: mon.commentaire.slice(0, COMMENTAIRE_MAX) },
      });
      if (status === 200) {
        if (etat) { etat.positifs = Number(data.positifs); etat.negatifs = Number(data.negatifs); }
        dessiner();
        message(details ? 'Merci, vos précisions sont ajoutées.' : 'Merci ! Vous pouvez ajouter des précisions (facultatif).');
        return;
      }
      throw Object.assign(new Error('refus'), { status, data });
    } catch (e) {
      const x = e as { status?: number; data?: Record<string, unknown> };
      mon = avant;                                      // retour arrière
      if (etat && compteursAvant) { etat.positifs = compteursAvant.p; etat.negatifs = compteursAvant.n; }
      dessiner();
      const st = x.status ?? 0;
      const texte = st ? messageErreurAvis(st, x.data ?? {}) : 'Réseau indisponible : votre avis n’a pas été envoyé.';
      if (st === 401) message(texte, { href: `/soumettre/?retour=${encodeURIComponent(location.pathname)}`, texte: 'Me connecter' });
      else message(texte);
    }
  };

  function dessiner(): void {
    if (!racine) return;
    racine.replaceChildren();
    const ligne = el('div', { class: 'abv__ligne' });
    ligne.append(el('span', { class: 'abv__q' }, 'Cette application vous est utile ?'));
    const pos = el('button', { type: 'button', 'aria-label': 'Avis positif', 'aria-pressed': String(mon.positif === true) }, '👍 Positif');
    const neg = el('button', { type: 'button', 'aria-label': 'Avis négatif', 'aria-pressed': String(mon.positif === false) }, '👎 Négatif');
    pos.onclick = () => void voter(true);
    neg.onclick = () => void voter(false);
    const x = el('button', { type: 'button', 'aria-label': 'Fermer, plus tard' }, '✕');
    x.onclick = () => fermer(true);
    ligne.append(pos, neg, x);
    racine.append(ligne);
    if (mon.positif !== null) {
      const tags = el('div', { class: 'abv__tags', role: 'group', 'aria-label': 'Précisions' });
      for (const t of TAGS_AVIS) {
        const b = el('button', { type: 'button', 'aria-pressed': String(mon.tags.includes(t)) }, t);
        b.onclick = () => { mon.tags = mon.tags.includes(t) ? mon.tags.filter((y) => y !== t) : [...mon.tags, t].slice(-4); dessiner(); };
        tags.append(b);
      }
      const zone = el('textarea', { maxlength: String(COMMENTAIRE_MAX), 'aria-label': 'Commentaire (facultatif, 280 caractères)', placeholder: 'Un mot pour le créateur (facultatif)' });
      zone.value = mon.commentaire;
      const cpt = el('div', { class: 'abv__cpt' }, `${zone.value.length}/${COMMENTAIRE_MAX}`);
      zone.oninput = () => { mon.commentaire = zone.value.slice(0, COMMENTAIRE_MAX); cpt.textContent = `${mon.commentaire.length}/${COMMENTAIRE_MAX}`; };
      const envoi = el('button', { type: 'button', class: 'abv__ok' }, 'Envoyer mes précisions');
      envoi.onclick = () => void voter(mon.positif === true, true);
      racine.append(tags, zone, cpt, envoi);
    }
    racine.append(el('p', { class: 'abv__msg', role: 'status' }));
  }

  function ouvrir(): void {
    if (racine) return;
    ferme = false;
    racine = el('section', { class: 'abv', role: 'region', 'aria-label': 'Votre avis sur cette application' });
    if (!document.getElementById('abv-style')) { const s = el('style', { id: 'abv-style' }); s.textContent = STYLE; document.head.append(s); }
    document.body.append(racine);
    dessiner();
    void ouvrirSession();
    void chargerEtat().then(dessiner);
  }
  function fermer(memoriser = false): void {
    racine?.remove();
    racine = null;
    if (memoriser) { ferme = true; try { sessionStorage.setItem(cleFerme, '1'); } catch { /* ignoré */ } }
  }

  void ouvrirSession();
  const calme = () => typeof document !== 'undefined' && document.documentElement.hasAttribute('data-ab-calme');
  const mesure = new MesureUsage(opts.cadre ?? null, () => { if (!ferme && !calme() && !racine) ouvrir(); }, opts.delaiMs ?? DELAI_USAGE_ACTIF_MS);
  mesure.demarrer();

  return { ouvrir, fermer: () => fermer(false), detruire: () => { mesure.arreter(); fermer(false); } };
}

/* ───────────────────────────── fenêtre de signalement ───────────────────────────── */

/** Petite fenêtre « Signaler un problème / abus » pour le cadre PHP (le shell React a son propre panneau). */
export function ouvrirSignalement(appId: string, api = API_DEFAUT): void {
  if (document.getElementById('abv-signal')) return;
  if (!document.getElementById('abv-style')) { const s = el('style', { id: 'abv-style' }); s.textContent = STYLE; document.head.append(s); }
  const boite = el('section', { class: 'abv', id: 'abv-signal', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Signaler un problème ou un abus' });
  const titre = el('p', { class: 'abv__q' }, 'Signaler un problème ou un abus');
  const choix = el('select', { 'aria-label': 'Motif' });
  for (const [k, v] of Object.entries(MOTIFS_SIGNALEMENT)) choix.append(el('option', { value: k }, v));
  choix.style.cssText = 'width:100%;min-height:44px;margin:6px 0;font:inherit;border-radius:10px';
  const zone = el('textarea', { maxlength: '1000', 'aria-label': 'Décrivez le problème', placeholder: 'Que se passe-t-il ?' });
  const contact = el('input', { type: 'text', maxlength: '120', 'aria-label': 'Contact (facultatif)', placeholder: 'Votre e-mail (facultatif)' });
  contact.style.cssText = 'width:100%;min-height:44px;margin:6px 0;font:inherit;border-radius:10px;padding:0 8px';
  const ligne = el('div', { class: 'abv__ligne' });
  const ok = el('button', { type: 'button', class: 'abv__ok' }, 'Envoyer');
  const non = el('button', { type: 'button' }, 'Fermer');
  const msg = el('p', { class: 'abv__msg', role: 'status' });
  non.onclick = () => boite.remove();
  ok.onclick = async () => {
    ok.disabled = true;
    const r = await envoyerSignalement(appId, choix.value, zone.value, contact.value, api);
    msg.textContent = r.message;
    ok.disabled = r.ok;
  };
  ligne.append(ok, non);
  boite.append(titre, choix, zone, contact, ligne, msg);
  document.body.append(boite);
  choix.focus();
}
