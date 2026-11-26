/**
 * Écrans vides — 4 illustrations SVG inline, légères (< 1 Ko chacune), sans image externe.
 * Les couleurs suivent l'univers (variables --pop-1/2/3) ; `aria-hidden` : le texte de
 * l'écran vide porte le sens.
 */

export type EcranVideType = 'aucun-resultat' | 'zero-euro' | '404' | 'erreur-reseau';

const ouvrir = '<svg class="pop-vide__svg" viewBox="0 0 160 120" aria-hidden="true" focusable="false">';
const sol = '<ellipse cx="80" cy="108" rx="54" ry="6" fill="currentColor" opacity=".08"/>';

export const SVG_VIDES: Record<EcranVideType, string> = {
  'aucun-resultat':
    ouvrir + sol +
    '<circle cx="70" cy="54" r="30" fill="none" stroke="var(--pop-2)" stroke-width="7"/>' +
    '<path d="M92 76l24 24" stroke="var(--pop-1)" stroke-width="10" stroke-linecap="round"/>' +
    '<path d="M60 48h20M60 60h12" stroke="var(--pop-3)" stroke-width="5" stroke-linecap="round" opacity=".7"/>' +
    '<circle class="pop-vide__etincelle" cx="118" cy="26" r="4" fill="var(--pop-3)"/></svg>',
  'zero-euro':
    ouvrir + sol +
    '<rect x="34" y="40" width="92" height="60" rx="12" fill="none" stroke="var(--pop-2)" stroke-width="6"/>' +
    '<path d="M34 56h92" stroke="var(--pop-2)" stroke-width="6"/>' +
    '<circle cx="80" cy="30" r="16" fill="var(--pop-1)" opacity=".9"/>' +
    '<text x="80" y="36" text-anchor="middle" font-size="18" font-weight="800" fill="#0b1020" font-family="system-ui,sans-serif">0</text>' +
    '<path class="pop-vide__etincelle" d="M112 22l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="var(--pop-3)"/></svg>',
  '404':
    ouvrir + sol +
    '<text x="80" y="76" text-anchor="middle" font-size="46" font-weight="900" fill="none" stroke="var(--pop-2)" stroke-width="3" font-family="system-ui,sans-serif">404</text>' +
    '<path d="M30 92c20-10 80-10 100 0" stroke="var(--pop-1)" stroke-width="5" fill="none" stroke-linecap="round"/>' +
    '<circle class="pop-vide__etincelle" cx="124" cy="30" r="5" fill="var(--pop-3)"/></svg>',
  'erreur-reseau':
    ouvrir + sol +
    '<path d="M36 58a62 62 0 0 1 88 0" stroke="var(--pop-2)" stroke-width="7" fill="none" stroke-linecap="round" opacity=".45"/>' +
    '<path d="M52 74a38 38 0 0 1 56 0" stroke="var(--pop-2)" stroke-width="7" fill="none" stroke-linecap="round"/>' +
    '<circle cx="80" cy="92" r="7" fill="var(--pop-1)"/>' +
    '<path d="M108 24l18 18M126 24l-18 18" stroke="var(--pop-3)" stroke-width="6" stroke-linecap="round"/></svg>',
};

export const TEXTES_VIDES: Record<EcranVideType, { titre: string; texte: string }> = {
  'aucun-resultat': { titre: 'Aucun résultat', texte: 'Essayez un autre mot, ou affichez tout.' },
  'zero-euro': { titre: 'Pas encore d’abonnés', texte: 'Vos revenus s’afficheront ici dès le premier abonnement (10 € pour vous sur 15 €/an).' },
  '404': { titre: 'Page introuvable', texte: 'Cette adresse n’existe pas ou plus.' },
  'erreur-reseau': { titre: 'Pas de connexion', texte: 'Le serveur ne répond pas. Vérifiez votre connexion puis réessayez.' },
};

/** Écran vide prêt à insérer (pages HTML simples). `reessayer` ajoute le bouton « Réessayer ». */
export function ecranVide(
  type: EcranVideType,
  options: { titre?: string; texte?: string; reessayer?: () => void; action?: { libelle: string; href: string } } = {},
): HTMLElement {
  const boite = document.createElement('div');
  boite.className = 'pop-vide';
  boite.dataset.type = type;
  boite.setAttribute('role', type === 'erreur-reseau' ? 'alert' : 'status');
  boite.innerHTML = SVG_VIDES[type]; // contenu constant, aucun texte de l'utilisateur
  const t = document.createElement('p');
  t.className = 'pop-vide__titre';
  t.textContent = options.titre ?? TEXTES_VIDES[type].titre;
  const p = document.createElement('p');
  p.className = 'pop-vide__texte';
  p.textContent = options.texte ?? TEXTES_VIDES[type].texte;
  boite.append(t, p);
  if (options.reessayer) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pop-vide__bouton ab-elastique';
    b.textContent = 'Réessayer';
    b.addEventListener('click', options.reessayer);
    boite.appendChild(b);
  } else if (options.action) {
    const a = document.createElement('a');
    a.className = 'pop-vide__bouton ab-elastique';
    a.href = options.action.href;
    a.textContent = options.action.libelle;
    boite.appendChild(a);
  }
  return boite;
}
