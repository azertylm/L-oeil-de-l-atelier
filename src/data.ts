/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Tool } from "./types.js";

export const TOOLS: Tool[] = [
  // PHASE 1 : DIAGNOSTIC, STYLE & TECHNIQUE
  {
    id: "style",
    icon: "🔍",
    label: "Style & Courants",
    cat: "Phase 1 : Diagnostic & Style",
    description: "Analyse le style artistique, l'époque historique, les influences et simule des déclinaisons stylistique alternatives."
  },
  {
    id: "palette",
    icon: "🎨",
    label: "Harmonie Chromatique",
    cat: "Phase 1 : Diagnostic & Style",
    description: "Extrait la palette de couleurs majeure, étudie l'harmonie des teintes et l'atmosphère émotionnelle."
  },
  {
    id: "technique",
    icon: "🔬",
    label: "Déconstruction Technique",
    cat: "Phase 1 : Diagnostic & Style",
    description: "Reconstitue les étapes de réalisation d'atelier et propose des mélanges ou médiums complémentaires."
  },
  {
    id: "critique",
    icon: "✍️",
    label: "Critique Littéraire",
    cat: "Phase 1 : Diagnostic & Style",
    description: "Rédige une critique d'art soignée, poétique et engagée digne d'une revue spécialisée."
  },
  {
    id: "conseils",
    icon: "💡",
    label: "Conseils d'Atelier",
    cat: "Phase 1 : Diagnostic & Style",
    description: "Analyse les forces plastiques et propose des pistes de perfectionnement académique."
  },

  // PHASE 2 : SCÉNOGRAPHIE & VERNISSAGE DE SÉRIE
  {
    id: "vernissage",
    icon: "🥂",
    label: "Vernissage de Série",
    cat: "Phase 2 : Scénographie & Vernissage",
    description: "Simule le concept global d'une exposition, le fil conducteur de série et le texte d'invitation au vernissage."
  },
  {
    id: "titres",
    icon: "✦",
    label: "Générateur de Titres",
    cat: "Phase 2 : Scénographie & Vernissage",
    description: "Propose 5 propositions de titres classés par registres : poétique, conceptuel, descriptif ou mystérieux."
  },
  {
    id: "expo",
    icon: "📄",
    label: "Cartel & Texte Expo",
    cat: "Phase 2 : Scénographie & Vernissage",
    description: "Rédige le cartel d'exposition (format gallery/musée) et le communiqué de presse d'exposition."
  },
  {
    id: "artistes",
    icon: "🏛️",
    label: "Filiations Historiques",
    cat: "Phase 2 : Scénographie & Vernissage",
    description: "Déniche les correspondances en histoire de l'art avec de grands maîtres et identifie les galeries/musées cibles."
  },

  // PHASE 3 : ESTIMATION DU MARCHÉ & CERTIFICAT LÉGAL
  {
    id: "prix",
    icon: "💰",
    label: "Estimation Marché",
    cat: "Phase 3 : Marché & Certificat",
    description: "Simule une estimation financière réaliste de la cote de l'œuvre et détaille les facteurs de plus-value."
  },
  {
    id: "certificat",
    icon: "📜",
    label: "Certificat d'Authenticité",
    cat: "Phase 3 : Marché & Certificat",
    description: "Rédige la formule légale d'authenticité et génère le Certificat d'Authenticité (COA) complet."
  },
  {
    id: "decor",
    icon: "🛋️",
    label: "Accrochage & Décoration",
    cat: "Phase 3 : Marché & Certificat",
    description: "Mets en scène l'œuvre dans un intérieur contemporain et définit le profil de l'acheteur idéal."
  },

  // PHASE 4 : COMMUNICATION, RÉSEAUX & DÉMARCHE
  {
    id: "statement",
    icon: "🖋️",
    label: "Démarche d'Artiste",
    cat: "Phase 4 : Com & Démarche",
    description: "Rédige une note d'intention d'artiste (Artist Statement) percutante et authentique à la 1ère personne."
  },
  {
    id: "reseaux",
    icon: "📱",
    label: "Réseaux & Médias",
    cat: "Phase 4 : Com & Démarche",
    description: "Conçoit des légendes engageantes pour Instagram et TikTok avec hashtags ciblés et concepts vidéo."
  },
  {
    id: "inspiration",
    icon: "🔮",
    label: "Pistes & Variations",
    cat: "Phase 4 : Com & Démarche",
    description: "Propose des pistes de déclinaison en diptyque/triptyque et un défi créatif audacieux."
  },
  {
    id: "poesie",
    icon: "🪶",
    label: "Inspiration Poétique",
    cat: "Phase 4 : Com & Démarche",
    description: "Saisit l'essence émotionnelle de la création à travers un haïku japonais et un poème libre."
  }
];

export const CATEGORIES = [
  "Phase 1 : Diagnostic & Style",
  "Phase 2 : Scénographie & Vernissage",
  "Phase 3 : Marché & Certificat",
  "Phase 4 : Com & Démarche"
];
