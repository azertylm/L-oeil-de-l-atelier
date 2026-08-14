/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PresetArtwork {
  id: string;
  title: string;
  artist: string;
  medium: string;
  year: string;
  url: string;
  styleDesc?: string;
}

export const PRESET_ARTWORKS: PresetArtwork[] = [
  {
    id: "hokusai-wave",
    title: "La Grande Vague de Kanagawa",
    artist: "Katsushika Hokusai",
    medium: "Estampe Japonaise (Ukiyo-e)",
    year: "1831",
    url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=600",
    styleDesc: "Ukiyo-e, vagues dynamiques, perspective de l'art traditionnel japonais, contraste bleu prussien."
  },
  {
    id: "monet-sun",
    title: "Impression, Soleil Levant",
    artist: "Claude Monet",
    medium: "Huile sur toile (Impressionnisme)",
    year: "1872",
    url: "https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&q=80&w=600",
    styleDesc: "Touches rapides, étude de la lumière matinale, brume orange et bleu, naissance de l'impressionnisme."
  },
  {
    id: "van-gogh-starry",
    title: "La Nuit Étoilée",
    artist: "Vincent van Gogh",
    medium: "Huile sur toile (Post-Impressionnisme)",
    year: "1889",
    url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=600",
    styleDesc: "Tourbillons d'étoiles, ciels tourmentés, cyprès sombres, empâtement épais de couleur jaune et outremer."
  },
  {
    id: "abstract-kandinsky",
    title: "Composition Rythmique",
    artist: "Vassily Kandinsky (Inspiration)",
    medium: "Acrylique & Encre (Abstraction Lyrique)",
    year: "1923",
    url: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=600",
    styleDesc: "Géométrie lyrique, lignes dynamiques, cercles concentriques colorés, harmonie musicale des formes."
  },
  {
    id: "classic-sculpture",
    title: "Le Silence du Marbre",
    artist: "Inconnu (Inspiration Antique)",
    medium: "Sculpture en Marbre de Carrare",
    year: "IIe siècle",
    url: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=600",
    styleDesc: "Plis drapés classiques, sérénité du marbre antique, clair-obscur dramatique sur les ombres de la pierre."
  },
  {
    id: "autumn-light",
    title: "Symphonie d'Automne",
    artist: "Claire Valois",
    medium: "Photographie d'Art (Chiaroscuro)",
    year: "2025",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=600",
    styleDesc: "Paysage d'art, brume dorée d'automne, reflets d'eau miroitants, lumière rasante et atmosphère mélancolique."
  },
  {
    id: "neoclassic-portrait",
    title: "La Dame d'Émeraude",
    artist: "Jean-Baptiste Regnault",
    medium: "Huile sur toile (Néoclassicisme)",
    year: "1804",
    url: "https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?auto=format&fit=crop&q=80&w=600",
    styleDesc: "Portrait académique, drapé vert émeraude lourd, teint de porcelaine, coiffe classique, profondeur sombre."
  },
  {
    id: "street-mural",
    title: "La Voix de la Rue",
    artist: "Artiste Anonyme (Art Urbain)",
    medium: "Aérosol, Collage & Pochoir",
    year: "2024",
    url: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&q=80&w=600",
    styleDesc: "Graphisme urbain, pochoirs superposés, éclaboussures de peinture fluo, messages engagés de rue."
  },
  {
    id: "surrealist-dream",
    title: "L'Ombre du Temps",
    artist: "Salvador Dali (Inspiration)",
    medium: "Peinture Digitale (Surréalisme)",
    year: "2025",
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600",
    styleDesc: "Perspective onirique infinie, sablier de sable fin flottant, ombres étirées de fin de journée, symbolisme."
  },
  {
    id: "minimalist-arch",
    title: "Structure Géométrique",
    artist: "Bauhaus Studio (Curation)",
    medium: "Photographie d'Architecture",
    year: "2022",
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600",
    styleDesc: "Lignes pures et minimalistes, jeu d'ombres obliques, béton blanc brut, angles droits et clarté nordique."
  },
  {
    id: "still-life",
    title: "Nature Morte aux Coings",
    artist: "Willem Kalf (Inspiration)",
    medium: "Huile sur toile (Âge d'Or Hollandais)",
    year: "1653",
    url: "https://images.unsplash.com/photo-1580136579312-94651dfd596d?auto=format&fit=crop&q=80&w=600",
    styleDesc: "Fruits luisants, coupe en argent ciselée, fond de velours sombre, clair-obscur intense d'atelier classique."
  },
  {
    id: "abstract-expressionism",
    title: "Chaos Lumineux",
    artist: "Jackson Pollock (Inspiration)",
    medium: "Projection d'Émail (Dripping)",
    year: "1952",
    url: "https://images.unsplash.com/photo-1547891654-e66ed7edd96c?auto=format&fit=crop&q=80&w=600",
    styleDesc: "Action painting, entrelacs complexes de noir, blanc et or, énergie physique brute projetée sur toile."
  },
  {
    id: "geometric-bauhaus",
    title: "Forme et Contre-Forme",
    artist: "László Moholy-Nagy (Style)",
    medium: "Lithographie Géométrique Bauhaus",
    year: "1923",
    url: "https://images.unsplash.com/photo-1501472312651-726afd116ff1?auto=format&fit=crop&q=80&w=600",
    styleDesc: "Asymétrie équilibrée, aplats rouges et noirs, typographie fine et pureté formelle fonctionnaliste."
  },
  {
    id: "gothic-arch",
    title: "L'Élévation Gothique",
    artist: "Maître d'Œuvre Médiéval",
    medium: "Rosace & Pierre Sculptée",
    year: "1240",
    url: "https://images.unsplash.com/photo-1548625361-155deee223d0?auto=format&fit=crop&q=80&w=600",
    styleDesc: "Architecture sacrée, dentelle de pierre calcaire, rosace flamboyante filtrant une lumière colorée mystique."
  },
  {
    id: "cyberpunk-digital",
    title: "Néon Métropole",
    artist: "Satoshi Tanaka",
    medium: "Art Génératif & Synthèse 3D",
    year: "2026",
    url: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&q=80&w=600",
    styleDesc: "Fils de cuivre lumineux, pluie de néons roses et cyan, perspectives fuyantes cyberpunk, reflets numériques."
  }
];

/**
 * Generates a unique, high-quality, abstract digital painting on a canvas
 * as a robust fallback if image loading or CORS fails.
 */
export function generateGenerativeArt(title: string, artist: string, id: string): string {
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 600;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // Set seed based on ID hash
  let seed = 0;
  for (let i = 0; i < id.length; i++) {
    seed += id.charCodeAt(i);
  }

  const random = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  // Generate color palette based on seed
  const hue1 = Math.floor(random() * 360);
  const hue2 = (hue1 + 120 + Math.floor(random() * 60)) % 360;
  const bgHue = (hue1 + 180) % 360;

  // Background
  const gradient = ctx.createRadialGradient(300, 300, 50, 300, 300, 400);
  gradient.addColorStop(0, `hsl(${bgHue}, 30%, 15%)`);
  gradient.addColorStop(1, `hsl(${bgHue}, 50%, 4%)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 600, 600);

  // Decorative artistic patterns
  ctx.globalAlpha = 0.35;
  for (let i = 0; i < 8; i++) {
    ctx.strokeStyle = `hsl(${(hue1 + i * 20) % 360}, 80%, 65%)`;
    ctx.lineWidth = random() * 4 + 1;
    ctx.beginPath();
    ctx.arc(300, 300, random() * 200 + 50, random() * Math.PI, random() * Math.PI * 2);
    ctx.stroke();
  }

  // Large geometric/fluid shapes
  ctx.globalAlpha = 0.6;
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = `hsl(${(hue2 + i * 15) % 360}, 75%, 55%)`;
    ctx.beginPath();
    const x = random() * 400 + 100;
    const y = random() * 400 + 100;
    const r = random() * 120 + 30;
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Splatters / lines
  ctx.globalAlpha = 0.8;
  ctx.strokeStyle = `hsl(${hue1}, 95%, 70%)`;
  ctx.lineWidth = 2;
  for (let i = 0; i < 15; i++) {
    ctx.beginPath();
    ctx.moveTo(random() * 600, random() * 600);
    ctx.lineTo(random() * 600, random() * 600);
    ctx.stroke();
  }

  // Golden ratio spiraling / overlay
  ctx.strokeStyle = "rgba(201, 168, 76, 0.4)";
  ctx.lineWidth = 1;
  ctx.strokeRect(40, 40, 520, 520);
  ctx.strokeRect(60, 60, 480, 480);

  // Frame details / signature
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = "white";
  ctx.font = "italic 11px Georgia, serif";
  ctx.fillText("Composé par l'Œil de l'Atelier · Numérique Génératif", 60, 530);

  // Signature
  ctx.globalAlpha = 0.8;
  ctx.fillStyle = "#c9a84c";
  ctx.font = "bold 13px 'Fira Code', monospace";
  ctx.fillText("ŒIL_ATELIER ©", 450, 530);

  // Title Card Overlay in the center/bottom
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = "rgba(0,0,0,0.75)";
  ctx.fillRect(80, 240, 440, 120);
  ctx.strokeStyle = "#c9a84c";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(80, 240, 440, 120);

  ctx.fillStyle = "white";
  ctx.font = "bold 20px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText(`« ${title} »`, 300, 290);

  ctx.fillStyle = "#c9a84c";
  ctx.font = "normal 12px sans-serif";
  ctx.fillText(`Curation Hommage par ${artist}`, 300, 325);

  return canvas.toDataURL("image/jpeg", 0.85);
}

/**
 * Loads a URL and converts it to Base64 using canvas drawing.
 * In case of failure (CORS, network), it generates a gorgeous fallback artwork dynamically.
 */
export async function getArtworkBase64(artwork: PresetArtwork): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = artwork.url;
    
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const base64 = canvas.toDataURL("image/jpeg", 0.75);
          resolve(base64);
        } else {
          resolve(generateGenerativeArt(artwork.title, artwork.artist, artwork.id));
        }
      } catch (e) {
        console.warn("CORS/Security block converting image to base64. Using generative masterpiece instead:", e);
        resolve(generateGenerativeArt(artwork.title, artwork.artist, artwork.id));
      }
    };

    img.onerror = () => {
      console.warn("Failed to load image from Unsplash. Generating virtual Masterpiece fallback instead.");
      resolve(generateGenerativeArt(artwork.title, artwork.artist, artwork.id));
    };
  });
}
