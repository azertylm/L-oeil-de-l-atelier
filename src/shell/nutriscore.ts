/**
 * @file nutriscore.ts
 * « Nutri-Score Numérique » d'Alphabette (Lot 6) : une lettre de A à E, calculée — jamais écrite à la main — à partir de
 * constats réels sur l'application publiée (scripts/nutri-meta.mjs lit les fichiers réellement servis).
 *
 * Trois piliers, chacun noté de 0 à 100 ; la lettre vient de leur moyenne :
 *  1. Confiance & zéro pistage   : aucun traceur tiers, aucune connexion vers des sites extérieurs, données gardées sur l'appareil.
 *  2. Accessibilité & confort    : base commune (zoom BIG, jour/nuit), voix alphabetteAudio, utilisable hors ligne (PWA).
 *  3. Sobriété & souveraineté    : hébergement en France / UE, IA Mistral avec votre clé (ou aucune IA), poids léger.
 *
 * Honnêteté : si un constat manque (appli hébergée ailleurs, pas encore analysée), le pilier est « non évalué » et la
 * lettre n'est PAS donnée. Un faux score serait pire qu'aucun score.
 * Module pur (aucun accès au navigateur) : utilisable dans React, dans les pages HTML et dans les tests.
 */

export type Lettre = 'A' | 'B' | 'C' | 'D' | 'E';
export const LETTRES: Lettre[] = ['A', 'B', 'C', 'D', 'E'];

/** Constats réels sur une application (null = inconnu ; jamais deviné). */
export interface ConstatsNutri {
  /** Origines extérieures à Alphabette appelées par les pages (scripts, styles, images, requêtes). */
  originesTierces: number | null;
  /** Dont traceurs / publicités connus (analytics, pixels, régies). */
  traceurs: number | null;
  /** Utilise la base commune : barre, zoom BIG, jour/nuit. */
  baseCommune: boolean | null;
  /** Voix alphabetteAudio, sans appel direct à speechSynthesis. */
  voix: boolean | null;
  /** Manifeste + service worker : s'installe et fonctionne sans réseau. */
  horsLigne: boolean | null;
  /** Hébergée par Alphabette (OVH, France). */
  hebergeeFrance: boolean | null;
  /** IA : aucune, Mistral avec clé de l'utilisateur, ou un autre fournisseur. */
  ia: 'aucune' | 'mistral' | 'autre' | null;
  /** Poids total des fichiers servis, en Ko. */
  poidsKo: number | null;
}

export interface Critere { libelle: string; points: number; max: number; ok: boolean | null; explication: string }
export interface Pilier { id: 'confiance' | 'accessibilite' | 'sobriete'; titre: string; note: number | null; criteres: Critere[] }
export interface ResultatNutri {
  lettre: Lettre | null;
  /** Moyenne des trois piliers (0-100), ou null si l'un d'eux n'est pas évaluable. */
  note: number | null;
  piliers: Pilier[];
  /** Phrase claire, sans jargon. */
  resume: string;
}

/** Seuils (note minimale) de chaque lettre. */
export const SEUILS: Record<Lettre, number> = { A: 85, B: 70, C: 55, D: 40, E: 0 };

export function lettreDepuisNote(note: number): Lettre {
  return LETTRES.find((l) => note >= SEUILS[l]) ?? 'E';
}

const borne = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

function pilierConfiance(c: ConstatsNutri): Pilier {
  const connu = c.originesTierces !== null && c.traceurs !== null;
  const criteres: Critere[] = [];
  if (connu) {
    const traceurs = c.traceurs as number;
    const tierces = c.originesTierces as number;
    criteres.push({
      libelle: 'Aucun traceur ni publicité', max: 60, points: traceurs === 0 ? 60 : 0, ok: traceurs === 0,
      explication: traceurs === 0 ? 'Aucun outil de suivi ou de publicité repéré.' : `${traceurs} outil${traceurs > 1 ? 's' : ''} de suivi ou de publicité repéré${traceurs > 1 ? 's' : ''}.`,
    });
    const pts = Math.max(0, 40 - 10 * tierces);
    criteres.push({
      libelle: 'Aucune connexion à des sites extérieurs', max: 40, points: pts, ok: tierces === 0,
      explication: tierces === 0 ? 'Tout vient d’Alphabette : vos données restent sur votre appareil.' : `${tierces} site${tierces > 1 ? 's' : ''} extérieur${tierces > 1 ? 's' : ''} contacté${tierces > 1 ? 's' : ''} par l’appli.`,
    });
  }
  return { id: 'confiance', titre: 'Confiance & zéro pistage', criteres, note: connu ? borne(criteres.reduce((s, k) => s + k.points, 0)) : null };
}

function pilierAccessibilite(c: ConstatsNutri): Pilier {
  const defs: [string, boolean | null, number, string, string][] = [
    ['Zoom BIG, jour/nuit et barre commune', c.baseCommune, 40, 'Vous réglez la taille et le contraste, comme partout chez Alphabette.', 'Pas de réglage de taille ni de contraste commun.'],
    ['Voix Alphabette', c.voix, 25, 'Elle peut vous lire les textes à voix haute.', 'Pas de lecture à voix haute.'],
    ['Fonctionne hors ligne', c.horsLigne, 35, 'Vous pouvez l’installer et l’ouvrir sans connexion.', 'Besoin d’une connexion pour l’ouvrir.'],
  ];
  const connu = defs.every(([, v]) => v !== null);
  const criteres: Critere[] = connu ? defs.map(([libelle, v, max, oui, non]) => ({ libelle, max, points: v ? max : 0, ok: Boolean(v), explication: v ? oui : non })) : [];
  return { id: 'accessibilite', titre: 'Accessibilité & confort', criteres, note: connu ? borne(criteres.reduce((s, k) => s + k.points, 0)) : null };
}

function pilierSobriete(c: ConstatsNutri): Pilier {
  const connu = c.hebergeeFrance !== null && c.ia !== null && c.poidsKo !== null;
  const criteres: Critere[] = [];
  if (connu) {
    criteres.push({
      libelle: 'Hébergée en France', max: 40, points: c.hebergeeFrance ? 40 : 0, ok: Boolean(c.hebergeeFrance),
      explication: c.hebergeeFrance ? 'Hébergement en France (OVH), droit européen.' : 'Hébergée hors du contrôle d’Alphabette.',
    });
    const ia = c.ia as 'aucune' | 'mistral' | 'autre';
    criteres.push({
      libelle: ia === 'aucune' ? 'Aucune IA : rien ne part à l’extérieur' : 'IA française avec votre propre clé', max: 30, points: ia === 'autre' ? 0 : 30, ok: ia !== 'autre',
      explication: ia === 'aucune' ? 'Cette appli n’utilise aucune intelligence artificielle.' : ia === 'mistral' ? 'Mistral AI (France), avec votre clé : vous gardez la main.' : 'IA d’un autre fournisseur que Mistral.',
    });
    const ko = c.poidsKo as number;
    const pts = ko <= 500 ? 30 : ko <= 2000 ? 15 : 0;
    criteres.push({
      libelle: 'Légère à charger', max: 30, points: pts, ok: pts === 30,
      explication: ko <= 500 ? `Légère : ${Math.round(ko)} Ko.` : `${ko >= 1000 ? (ko / 1000).toFixed(1).replace('.', ',') + ' Mo' : Math.round(ko) + ' Ko'} à charger.`,
    });
  }
  return { id: 'sobriete', titre: 'Sobriété & souveraineté', criteres, note: connu ? borne(criteres.reduce((s, k) => s + k.points, 0)) : null };
}

const RESUME: Record<Lettre, string> = {
  A: 'Excellente : respectueuse, accessible et sobre.',
  B: 'Très bonne : quelques points peuvent encore progresser.',
  C: 'Correcte : plusieurs points à améliorer.',
  D: 'Moyenne : des efforts importants restent à faire.',
  E: 'À améliorer : elle ne respecte pas encore nos critères.',
};

/** Calcule le Nutri-Score à partir de constats. Sans les trois piliers, pas de lettre. */
export function calculerNutriScore(c: ConstatsNutri): ResultatNutri {
  const piliers = [pilierConfiance(c), pilierAccessibilite(c), pilierSobriete(c)];
  if (piliers.some((p) => p.note === null)) {
    return { lettre: null, note: null, piliers, resume: 'Pas encore évaluée : nous n’avons pas tous les constats. Aucune lettre n’est donnée tant que nous ne sommes pas sûrs.' };
  }
  const note = borne(piliers.reduce((s, p) => s + (p.note as number), 0) / piliers.length);
  const lettre = lettreDepuisNote(note);
  return { lettre, note, piliers, resume: RESUME[lettre] };
}

/** Couleurs (fond) de chaque lettre : texte blanc, contraste ≥ 7:1 (WCAG AAA) — vérifié par tests/lot6. */
export const COULEURS_LETTRE: Record<Lettre, string> = { A: '#14532d', B: '#365314', C: '#713f12', D: '#7c2d12', E: '#7f1d1d' };

/** Étiquette en SVG pur (A B C D E, la lettre obtenue agrandie). Texte alternatif lisible par les lecteurs d'écran. */
export function svgNutriScore(lettre: Lettre | null, taille: 'badge' | 'etiquette' = 'etiquette'): string {
  const w = taille === 'badge' ? 64 : 170;
  const h = taille === 'badge' ? 22 : 44;
  const titre = lettre ? `Nutri-Score numérique : ${lettre}` : 'Nutri-Score numérique : pas encore évalué';
  const cases = LETTRES.map((l, i) => {
    const actif = l === lettre;
    const lw = w / 5;
    const x = i * lw;
    const cy = h / 2;
    const bh = actif ? h : h * 0.72;
    return `<g><rect x="${(x + 1).toFixed(1)}" y="${(cy - bh / 2).toFixed(1)}" width="${(lw - 2).toFixed(1)}" height="${bh.toFixed(1)}" rx="${taille === 'badge' ? 3 : 6}" fill="${COULEURS_LETTRE[l]}"${actif ? ' stroke="#ffffff" stroke-width="2"' : ' opacity="0.55"'}/>` +
      `<text x="${(x + lw / 2).toFixed(1)}" y="${(cy + (actif ? h * 0.2 : h * 0.14)).toFixed(1)}" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="800" font-size="${(actif ? h * 0.58 : h * 0.4).toFixed(1)}" fill="#ffffff">${l}</text></g>`;
  }).join('');
  const lecture = lettre ? '' : `<text x="${w / 2}" y="${h / 2 + 4}" text-anchor="middle" font-family="system-ui,sans-serif" font-size="${taille === 'badge' ? 9 : 13}" fill="#334155">non évalué</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${titre}"><title>${titre}</title>${lettre ? cases : lecture}</svg>`;
}
