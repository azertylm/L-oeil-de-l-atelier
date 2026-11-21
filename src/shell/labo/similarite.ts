/**
 * @file labo/similarite.ts
 * Dédoublonnage des tickets, entièrement dans le navigateur (aucun texte envoyé à une IA).
 * Proximité « sémantique » approchée : mots normalisés (accents, pluriels, mots vides retirés),
 * quelques synonymes du quotidien regroupés, puis le meilleur de deux mesures :
 *  - cosinus sur les mots (ce qui est dit),
 *  - Dice sur les trigrammes de lettres (fautes de frappe, conjugaisons).
 * Score entre 0 et 1 ; au-delà de 0,75, on propose le ticket existant plutôt qu'un doublon.
 */

const MOTS_VIDES = new Set(
  ('le la les l un une des du de d et ou mais donc or ni car a à au aux en dans sur sous pour par avec sans ce cet cette ces ' +
    'je j tu il elle on nous vous ils elles me m te t se s lui leur y mon ma mes ton ta tes son sa ses notre votre ' +
    'qui que qu quoi dont où est sont suis es être ai as avons avez ont avoir fait faire ça cela c pas ne n plus très ' +
    'trop bien aussi quand comme si alors tout tous toute toutes quand même encore déjà the a an is it of to and')
    .split(' '),
);

/** Mots qui disent la même chose dans un signalement. */
const SYNONYMES: Record<string, string> = {
  bug: 'panne', bogue: 'panne', erreur: 'panne', plante: 'panne', crash: 'panne', marche: 'fonctionne', fonctionn: 'fonctionne',
  bloque: 'bloque', fige: 'bloque', gele: 'bloque', lent: 'lent', lente: 'lent', rame: 'lent',
  telephone: 'mobile', portable: 'mobile', smartphone: 'mobile', iphone: 'mobile', android: 'mobile',
  ecran: 'ecran', affichage: 'ecran', affiche: 'ecran', page: 'ecran',
  bouton: 'bouton', touche: 'bouton', lisible: 'lire', illisible: 'lire', voit: 'lire', vois: 'lire',
  depasse: 'deborde', deborde: 'deborde', coupe: 'deborde', cache: 'deborde',
  menu: 'menu', barre: 'barre', bandeau: 'barre', entete: 'barre',
  sombre: 'nuit', noir: 'nuit', clair: 'jour', blanc: 'jour',
  ajouter: 'ajout', ajout: 'ajout', rajouter: 'ajout', pouvoir: 'ajout', possibilite: 'ajout', option: 'ajout',
};

export function normaliser(texte: string): string {
  return texte
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Racine grossière : pluriels et terminations verbales courantes. */
function racine(mot: string): string {
  let m = mot;
  for (const fin of ['ements', 'ement', 'ations', 'ation', 'ions', 'ent', 'ez', 'er', 'es', 'e', 's', 'x']) {
    if (m.length > fin.length + 3 && m.endsWith(fin)) { m = m.slice(0, -fin.length); break; }
  }
  return SYNONYMES[mot] ?? SYNONYMES[m] ?? m;
}

export function mots(texte: string): string[] {
  return normaliser(texte).split(' ').filter((m) => m.length > 1 && !MOTS_VIDES.has(m)).map(racine);
}

function cosinus(a: string[], b: string[]): number {
  if (!a.length || !b.length) return 0;
  const fa = new Map<string, number>(), fb = new Map<string, number>();
  a.forEach((m) => fa.set(m, (fa.get(m) ?? 0) + 1));
  b.forEach((m) => fb.set(m, (fb.get(m) ?? 0) + 1));
  let produit = 0;
  fa.forEach((n, m) => { produit += n * (fb.get(m) ?? 0); });
  const norme = (f: Map<string, number>) => Math.sqrt([...f.values()].reduce((s, n) => s + n * n, 0));
  return produit / (norme(fa) * norme(fb));
}

function trigrammes(mots: string[]): Set<string> {
  const t = new Set<string>();
  for (const m of mots) {
    const x = `  ${m} `;
    for (let i = 0; i < x.length - 2; i++) t.add(x.slice(i, i + 3));
  }
  return t;
}

function dice(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0;
  let commun = 0;
  a.forEach((g) => { if (b.has(g)) commun++; });
  return (2 * commun) / (a.size + b.size);
}

/** Proximité entre deux textes, de 0 (rien à voir) à 1 (même demande). */
export function similarite(a: string, b: string): number {
  const ma = mots(a), mb = mots(b);
  if (ma.length < 2 || mb.length < 2) return 0; // trop court pour juger
  return Math.max(cosinus(ma, mb), dice(trigrammes(ma), trigrammes(mb)));
}

export interface TicketComparable {
  id: string;
  comment: string;
  category?: string;
}

/** Tickets existants au moins aussi proches que `seuil`, du plus proche au moins proche. */
export function doublonsProbables<T extends TicketComparable>(texte: string, tickets: T[], seuil = 0.75, max = 2): (T & { score: number })[] {
  if (mots(texte).length < 3) return [];
  return tickets
    .map((t) => ({ ...t, score: similarite(texte, t.comment) }))
    .filter((t) => t.score >= seuil)
    .sort((x, y) => y.score - x.score)
    .slice(0, max);
}
