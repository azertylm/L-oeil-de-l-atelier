import { useEffect, useState } from 'react';

/**
 * @file guideIA.tsx
 * Guide 1 clic « IA non configurée » (Lot 6) : quand une fonction d'IA est lancée sans clé BYOK, on n'affiche
 * jamais un message technique mais un encart bienveillant en trois étapes, avec un bouton direct vers les réglages.
 */
const CLE_IA = 'alphabette.ia.chaine';
export const ADRESSE_CLES_MISTRAL = 'https://console.mistral.ai/api-keys';

/** Vrai si au moins une clé d'IA est enregistrée sur cet appareil (la clé elle-même n'est jamais lue ni affichée). */
export function iaConfiguree(): boolean {
  try {
    const chaine = JSON.parse(localStorage.getItem(CLE_IA) || '[]');
    return Array.isArray(chaine) && chaine.some((m) => m && typeof m.cle === 'string' && m.cle.trim().length > 0);
  } catch {
    return false;
  }
}

/** Reconnaît l'absence de clé dans une erreur, quelle que soit sa forme (ErreurCleManquante ou ancien message). */
export function estCleManquante(e: unknown): boolean {
  const x = e as { cleManquante?: boolean; message?: string } | null;
  return Boolean(x?.cleManquante) || /aucune cl[ée] d'IA/i.test(String(x?.message ?? ''));
}

/** Contenu du guide (en texte) pour les pages qui n'utilisent pas React. */
export function guideIaNonConfiguree() {
  return {
    titre: "L'IA a besoin de votre clé personnelle",
    intro: "Rien n'est cassé : cette fonction utilise l'IA française Mistral, avec une clé qui vous appartient. Vous la créez une seule fois, en 3 étapes.",
    etapes: [
      'Créez un compte sur le site de Mistral AI (France) : il propose une offre gratuite pour essayer.',
      'Dans la page « Clés API », créez une clé puis copiez-la.',
      "Revenez ici et collez-la dans les réglages : elle reste dans votre navigateur, Alphabette ne la voit jamais.",
    ],
    lienMistral: ADRESSE_CLES_MISTRAL,
    bouton: 'Ouvrir les réglages de ma clé',
  };
}

interface Props { onOuvrirReglages?: () => void; className?: string }

export function EncartIaNonConfiguree({ onOuvrirReglages, className }: Props) {
  const g = guideIaNonConfiguree();
  return (
    <section className={`ab-guide-ia ${className ?? ''}`.trim()} role="note" aria-label={g.titre}>
      <h3>🔑 {g.titre}</h3>
      <p>{g.intro}</p>
      <ol>
        <li>{g.etapes[0]} <a href={g.lienMistral} target="_blank" rel="noopener noreferrer">Ouvrir le site de Mistral</a></li>
        <li>{g.etapes[1]}</li>
        <li>{g.etapes[2]}</li>
      </ol>
      {onOuvrirReglages && <button type="button" className="ab-btn ab-btn--accent ab-btn--lg" onClick={onOuvrirReglages}>{g.bouton}</button>}
    </section>
  );
}

/** Petit crochet : l'encart ne s'affiche que s'il n'y a vraiment aucune clé (et se met à jour si on en ajoute une). */
export function useIaConfiguree(): boolean {
  const [ok, setOk] = useState(() => iaConfiguree());
  useEffect(() => {
    const maj = () => setOk(iaConfiguree());
    window.addEventListener('storage', maj);
    window.addEventListener('focus', maj);
    return () => { window.removeEventListener('storage', maj); window.removeEventListener('focus', maj); };
  }, []);
  return ok;
}
