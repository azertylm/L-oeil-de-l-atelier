/**
 * @file audio/preparerTexte.ts
 * Prépare un texte pour la voix Alphabette : retire ce qui ne se prononce pas, remplace les
 * abréviations courantes, puis découpe aux fins de phrases (premier morceau court pour que la
 * parole démarre tout de suite, puis morceaux de 300 caractères au plus).
 */

const PREMIER_MORCEAU = 210;
const MORCEAU = 300;

/** Nettoie un texte avant de l'envoyer à la synthèse vocale. */
export function preparerTexte(brut: string): string {
  let t = String(brut ?? '').replace(/\r\n?/g, '\n');

  // Double saut de ligne → vraie pause respiratoire.
  t = t.replace(/([^\n])\s*\n[ \t]*\n+\s*/g, (_m, avant: string) => (/[.!?…:;,]/.test(avant) ? `${avant} ` : `${avant}. `));

  // Abréviations et symboles courants.
  t = t
    .replace(/\b[Nn][°ºo]\s?(?=\d)/g, 'numéro ')
    .replace(/[Nn][°º]/g, 'numéro')
    .replace(/\s*&\s*/g, ' et ')
    .replace(/(\d)\s*%/g, '$1 pour cent')
    .replace(/\s*%/g, ' pour cent')
    .replace(/(\d)\s*€/g, '$1 euros')
    .replace(/\s*€/g, ' euros')
    .replace(/\s*\+\s*(?=\D)/g, ' plus ');

  // Puces et flèches → virgule (petite pause).
  t = t.replace(/\s*[·•➔➜➝➞→⟶▸▶►▪◦‣⁃]+\s*/g, ', ');
  t = t.replace(/(^|\n)\s*[-–—*]\s+/g, '$1, ');

  // Emojis et symboles visuels non prononcés.
  t = t
    .replace(/\p{Extended_Pictographic}/gu, ' ')
    .replace(/[\u{1F1E6}-\u{1F1FF}\u{1F3FB}-\u{1F3FF}︎️‍⃣]/gu, '')
    .replace(/[←-⇿⌀-⏿①-⓿─-➿⤀-⥿⬀-⯿-]/g, ' ')
    .replace(/[#*_~`|<>^]+/g, ' ');

  // Saut de ligne simple → petite pause si rien ne ponctue déjà.
  t = t.replace(/([^\s.!?…:;,])[ \t]*\n+\s*/g, '$1, ').replace(/\n+/g, ' ');

  // Ponctuation propre.
  return t
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:!?…])/g, '$1')
    .replace(/,\s*([,.;:!?…])/g, '$1')
    .replace(/([.!?…])\s*,/g, '$1')
    .replace(/^[\s,.;:]+/, '')
    .trim();
}

/** Coupe une phrase trop longue sur une virgule, à défaut sur un espace. */
function couperLongue(phrase: string, max: number): string[] {
  const out: string[] = [];
  let reste = phrase;
  while (reste.length > max) {
    let coupe = Math.max(reste.lastIndexOf(', ', max), reste.lastIndexOf('; ', max));
    if (coupe < max * 0.4) coupe = reste.lastIndexOf(' ', max);
    if (coupe < max * 0.3) coupe = max;
    out.push(reste.slice(0, coupe + 1).trim());
    reste = reste.slice(coupe + 1).trim();
  }
  if (reste) out.push(reste);
  return out;
}

/** Découpe un texte préparé en morceaux, uniquement aux fins de phrases (. ! ? …). */
export function decouperTexte(texte: string): string[] {
  const phrases = texte.match(/[^.!?…]+(?:[.!?…]+["»”’)\]]*|$)/g)?.map((p) => p.trim()).filter(Boolean) ?? [];
  const morceaux: string[] = [];
  let courant = '';
  for (const phrase of phrases) {
    const max = morceaux.length === 0 ? PREMIER_MORCEAU : MORCEAU;
    if (!courant && phrase.length > max) {
      const parts = couperLongue(phrase, max);
      morceaux.push(...parts.slice(0, -1));
      courant = parts[parts.length - 1] ?? '';
      continue;
    }
    if ((courant + ' ' + phrase).trim().length <= max) {
      courant = (courant + ' ' + phrase).trim();
    } else {
      if (courant) morceaux.push(courant);
      const maxSuivant = MORCEAU;
      if (phrase.length > maxSuivant) {
        const parts = couperLongue(phrase, maxSuivant);
        morceaux.push(...parts.slice(0, -1));
        courant = parts[parts.length - 1] ?? '';
      } else courant = phrase;
    }
  }
  if (courant) morceaux.push(courant);
  return morceaux.filter((m) => /[\p{L}\p{N}]/u.test(m));
}

/** Préparation + découpage en un appel. */
export function morceauxAPrononcer(brut: string): string[] {
  return decouperTexte(preparerTexte(brut));
}
