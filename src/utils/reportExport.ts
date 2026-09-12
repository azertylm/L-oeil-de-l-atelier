/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TOOLS, CATEGORIES } from "../data.js";

export interface ReportExportOptions {
  cache: Record<string, any>;
  artistProfile?: {
    name?: string;
    style?: string;
    bio?: string;
    location?: string;
    website?: string;
    coteEstimate?: string;
  };
  artwork?: {
    title?: string;
    artist?: string;
    medium?: string;
    year?: string;
    dimensions?: string;
    imageSrc?: string;
  };
  activeSeries?: Array<{
    id: string;
    title: string;
    imageSrc: string;
    artist?: string;
    medium?: string;
    year?: string;
  }>;
}

/**
 * Generates an executive Markdown / Plain-text dossier for easy copy-paste or text export.
 */
export function generateGlobalMarkdownReport(options: ReportExportOptions): string {
  const { cache, artistProfile, artwork, activeSeries } = options;
  const dateStr = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const title = artwork?.title || "Œuvre d'Atelier";
  const artist = artistProfile?.name || artwork?.artist || "Artiste";
  const medium = artwork?.medium || artistProfile?.style || "Technique Mixte";
  const year = artwork?.year || new Date().getFullYear().toString();

  const completedTools = TOOLS.filter(t => !!cache[t.id]);

  let md = "";
  md += `================================================================================\n`;
  md += `    ŒIL D'ATELIER — DOSSIER GLOBAL D'EXPERTISE & RECOMMANDATIONS D'ART\n`;
  md += `================================================================================\n\n`;

  md += `DATE DU DIAGNOSTIC : ${dateStr}\n`;
  md += `TITRE DE L'ŒUVRE   : ${title.toUpperCase()}\n`;
  md += `ARTISTE CRÉATEUR   : ${artist}\n`;
  md += `MÉDIUM / TECHNIQUE : ${medium}\n`;
  md += `ANNÉE DE CRÉATION  : ${year}\n`;
  if (artwork?.dimensions) {
    md += `DIMENSIONS         : ${artwork.dimensions}\n`;
  }
  if (artistProfile?.location) {
    md += `LIEU DE CRÉATION   : ${artistProfile.location}\n`;
  }
  md += `OUTILS COMPLÉTÉS   : ${completedTools.length} / 16 Recommandations d'Atelier\n\n`;

  if (activeSeries && activeSeries.length > 1) {
    md += `--------------------------------------------------------------------------------\n`;
    md += `SÉRIE VERNISSAGE EN COURS (${activeSeries.length} ŒUVRES COORDONNÉES)\n`;
    md += `--------------------------------------------------------------------------------\n`;
    activeSeries.forEach((item, idx) => {
      md += `  [${idx + 1}] ${item.title} — ${item.medium || medium} (${item.year || year})\n`;
    });
    md += `\n`;
  }

  // Loop through categories
  CATEGORIES.forEach((cat, catIdx) => {
    const catTools = TOOLS.filter(t => t.cat === cat && !!cache[t.id]);
    if (catTools.length === 0) return;

    md += `\n################################################################################\n`;
    md += `PHASE ${catIdx + 1} : ${cat.toUpperCase()}\n`;
    md += `################################################################################\n\n`;

    catTools.forEach(tool => {
      const data = cache[tool.id];
      md += `--------------------------------------------------------------------------------\n`;
      md += `● [${tool.icon} ${tool.label.toUpperCase()}]\n`;
      md += `--------------------------------------------------------------------------------\n`;

      if (tool.id === "style") {
        md += `• Style Dominant : ${data.style || "Non précisé"}\n`;
        md += `• Période Estimée : ${data.periode || "Contemporaine"}\n`;
        md += `• Description Visuelle :\n  ${data.description || ""}\n`;
        md += `• Filiations & Influences :\n  ${data.influences || ""}\n`;
        if (data.mots_cles && Array.isArray(data.mots_cles)) {
          md += `• Mots-clés Clés : ${data.mots_cles.join(", ")}\n`;
        }
      } else if (tool.id === "palette") {
        md += `• Harmonie Chromatique : ${data.harmonie || "Équilibrée"}\n`;
        if (data.couleurs && Array.isArray(data.couleurs)) {
          md += `• Nuancier d'Atelier :\n`;
          data.couleurs.forEach((c: any) => {
            md += `    - ${c.nom} (${c.hex}) : ${c.role}\n`;
          });
        }
        md += `• Ambiance Émotionnelle : ${data.ambiance || ""}\n`;
        md += `• Conseil Pigments & Teintes : ${data.conseil || ""}\n`;
      } else if (tool.id === "technique") {
        if (data.etapes_supposees && Array.isArray(data.etapes_supposees)) {
          md += `• Étapes de Réalisation Probables :\n`;
          data.etapes_supposees.forEach((step: string, i: number) => {
            md += `    ${i + 1}. ${step}\n`;
          });
        }
        if (data.mediums_alternatifs && Array.isArray(data.mediums_alternatifs)) {
          md += `• Médiums & Outils Alternatifs Conseillés : ${data.mediums_alternatifs.join(" | ")}\n`;
        }
        md += `• Astuce Pro d'Atelier : ${data.astuce_pro || ""}\n`;
      } else if (tool.id === "critique") {
        md += `• Titre de la Critique : « ${data.titre_critique || ""} »\n\n`;
        md += `• Texte Critique :\n${data.texte || ""}\n\n`;
        md += `• Citation pour Catalogue :\n  « ${data.citation || ""} »\n`;
      } else if (tool.id === "conseils") {
        md += `• Niveau de Maîtrise Estimé : ${data.niveau_estime || "Avancé"}\n`;
        if (data.forces && Array.isArray(data.forces)) {
          md += `• Forces Plastiques de l'Œuvre :\n`;
          data.forces.forEach((f: string) => md += `    + ${f}\n`);
        }
        if (data.axes_amelioration && Array.isArray(data.axes_amelioration)) {
          md += `• Axes de Perfectionnement & Exercices d'Atelier :\n`;
          data.axes_amelioration.forEach((ax: any, i: number) => {
            md += `    [${i + 1}] ${ax.aspect} : ${ax.conseil}\n`;
            md += `        Exercice pratique : ${ax.exercice}\n`;
          });
        }
        if (data.ressources && Array.isArray(data.ressources)) {
          md += `• Références & Études Conseillées : ${data.ressources.join(", ")}\n`;
        }
      } else if (tool.id === "vernissage") {
        md += `• Événement : ${data.titre_event || ""}\n`;
        md += `• Date & Atmosphère : ${data.date_fictive || ""}\n`;
        md += `• Lieu Curatorial : ${data.lieu_fictif || ""}\n`;
        md += `• Phrase d'Accroche Vernissage : « ${data.phrase_accroche || ""} »\n`;
        md += `• Prompt Affiche IA : ${data.prompt_image_generator || ""}\n`;
      } else if (tool.id === "titres") {
        md += `• 5 Propositions de Titres Stratégiques :\n`;
        if (data.titres && Array.isArray(data.titres)) {
          data.titres.forEach((t: any, i: number) => {
            md += `    ${i + 1}. « ${t.nom} » [${t.registre.toUpperCase()}]\n`;
            md += `       → ${t.explication}\n`;
          });
        }
      } else if (tool.id === "expo") {
        md += `• Titre d'Exposition Suggéré : « ${data.titre_expo || ""} »\n`;
        md += `• Texte pour Cartel de Galerie / Musée :\n${data.texte_cartel || ""}\n\n`;
        md += `• Communiqué de Presse Éclair :\n${data.communique || ""}\n`;
        if (data.hashtags && Array.isArray(data.hashtags)) {
          md += `• Hashtags de Diffusion : ${data.hashtags.join(" ")}\n`;
        }
      } else if (tool.id === "artistes") {
        md += `• Filiations Artistiques & Correspondances Historiques :\n`;
        if (data.artistes && Array.isArray(data.artistes)) {
          data.artistes.forEach((art: any) => {
            md += `    - ${art.nom} (${art.periode}, ${art.nationalite})\n`;
            md += `      Lien esthétique : ${art.lien}\n`;
            md += `      Œuvre référence : « ${art.oeuvre_reference} »\n`;
          });
        }
        if (data.musees && Array.isArray(data.musees)) {
          md += `• Musées & Institutions Cibles : ${data.musees.join(" | ")}\n`;
        }
      } else if (tool.id === "prix") {
        md += `• Estimation Artiste Émergent (Format Standard) : ${data.fourchette_basse || "N/A"}\n`;
        md += `• Estimation Artiste Établi / Galerie : ${data.fourchette_haute || "N/A"}\n`;
        if (data.facteurs && Array.isArray(data.facteurs)) {
          md += `• Facteurs d'Influence sur la Valeur :\n`;
          data.facteurs.forEach((f: any) => {
            md += `    [${f.impact.toUpperCase()}] ${f.facteur} : ${f.detail}\n`;
          });
        }
        md += `• Analyse de Marché : ${data.marche || ""}\n`;
        md += `• Conseil Commercial : ${data.conseil_vente || ""}\n`;
      } else if (tool.id === "certificat") {
        md += `• Titre de l'Œuvre : « ${data.titre_oeuvre || title} »\n`;
        md += `• Technique Homologuée : ${data.technique_supposee || medium}\n`;
        md += `• Formule Juridique d'Authenticité :\n  "${data.texte_certificat || ""}"\n`;
      } else if (tool.id === "decor") {
        md += `• Cadre & Écrin Idéal :\n  ${data.style_interieur || ""}\n`;
        md += `• Profil Collectionneur Cible :\n  ${data.acheteur_cible || ""}\n`;
        md += `• Argument de Vente Coup de Cœur :\n  « ${data.argumentaire || ""} »\n`;
      } else if (tool.id === "statement") {
        md += `• Titre de la Démarche : « ${data.titre || ""} »\n\n`;
        md += `• Démarche Artistique (1ère Personne) :\n${data.texte_demarche || ""}\n\n`;
        if (data.mots_cles_marquants && Array.isArray(data.mots_cles_marquants)) {
          md += `• Concepts Moteurs : ${data.mots_cles_marquants.join(" · ")}\n`;
        }
      } else if (tool.id === "reseaux") {
        if (data.legendes && Array.isArray(data.legendes)) {
          md += `• Légendes Réseaux Sociaux :\n`;
          data.legendes.forEach((l: any) => {
            md += `    [${l.plateforme}] :\n    ${l.texte}\n\n`;
          });
        }
        if (data.hashtags && Array.isArray(data.hashtags)) {
          md += `• Top Hashtags d'Art : ${data.hashtags.join(" ")}\n`;
        }
        md += `• Scénario Vidéo Court (Reel / TikTok) :\n  ${data.reel_idea || ""}\n`;
      } else if (tool.id === "inspiration") {
        if (data.pistes && Array.isArray(data.pistes)) {
          md += `• Pistes de Continuité & Variations :\n`;
          data.pistes.forEach((p: any, i: number) => {
            md += `    [${i + 1}] ${p.concept} : ${p.pourquoi}\n`;
          });
        }
        md += `• Défi Créatif en Atelier : ${data.defi || ""}\n`;
      } else if (tool.id === "poesie") {
        md += `• Titre Poétique : « ${data.titre_poeme || ""} »\n\n`;
        md += `• Haïku Japonais :\n${data.haiku || ""}\n\n`;
        md += `• Poème en Vers Libres :\n${data.texte_poetique || ""}\n`;
      }

      md += `\n`;
    });
  });

  md += `================================================================================\n`;
  md += `DOCUMENT CONFIDENTIEL ÉMIS PAR L'ATELIER D'ART & ANALYSE DE L'ŒIL D'ATELIER\n`;
  md += `Conforme aux standards curatoriaux et aux protocoles d'expertise plastique.\n`;
  md += `================================================================================\n`;

  return md;
}

/**
 * Generates an ultra-polished, self-contained HTML report with responsive styling and print CSS.
 */
export function generateGlobalHtmlReport(options: ReportExportOptions): string {
  const { cache, artistProfile, artwork, activeSeries } = options;
  const dateStr = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const title = artwork?.title || "Œuvre d'Atelier";
  const artist = artistProfile?.name || artwork?.artist || "Artiste d'Atelier";
  const medium = artwork?.medium || artistProfile?.style || "Technique Mixte";
  const year = artwork?.year || new Date().getFullYear().toString();
  const imageSrc = artwork?.imageSrc || "";

  const completedTools = TOOLS.filter(t => !!cache[t.id]);

  let html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rapport d'Expertise Plastique — ${escapeHtml(title)} par ${escapeHtml(artist)}</title>
  <style>
    :root {
      --gold: #c9a84c;
      --gold-light: #e4cb78;
      --gold-dark: #9c7d2b;
      --bg: #0d0c0b;
      --surface: #141311;
      --surface-card: #1a1815;
      --border: rgba(201, 168, 76, 0.25);
      --text: #f5f2eb;
      --text-muted: #9e9b93;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      padding: 30px 15px;
    }

    .container {
      max-width: 960px;
      margin: 0 auto;
      background-color: var(--surface);
      border: 1px solid var(--border);
      box-shadow: 0 10px 40px rgba(0,0,0,0.6);
      padding: 40px;
    }

    /* Header */
    .header {
      border-bottom: 2px solid var(--gold);
      padding-bottom: 25px;
      margin-bottom: 35px;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .top-badge-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
    }

    .badge-gold {
      background: linear-gradient(135deg, var(--gold-dark), var(--gold));
      color: #000;
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 1.5px;
      padding: 4px 10px;
      text-transform: uppercase;
      font-family: monospace;
    }

    .meta-date {
      font-family: monospace;
      font-size: 12px;
      color: var(--gold-light);
    }

    .header-title {
      font-family: "Playfair Display", Georgia, serif;
      font-size: 28px;
      color: #fff;
      letter-spacing: 1px;
      line-height: 1.25;
    }

    .header-sub {
      color: var(--gold-light);
      font-size: 13px;
      letter-spacing: 2px;
      text-transform: uppercase;
      font-family: monospace;
    }

    /* Artwork Hero Card */
    .artwork-hero {
      display: grid;
      grid-template-columns: 240px 1fr;
      gap: 30px;
      background: var(--surface-card);
      border: 1px solid var(--border);
      padding: 25px;
      margin-bottom: 40px;
      align-items: center;
    }

    @media (max-width: 680px) {
      .artwork-hero {
        grid-template-columns: 1fr;
      }
    }

    .artwork-thumb-wrap {
      width: 100%;
      height: 240px;
      background: #000;
      border: 1px solid var(--gold);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .artwork-thumb {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }

    .artwork-details {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .artwork-name {
      font-family: "Playfair Display", Georgia, serif;
      font-size: 24px;
      color: var(--gold);
    }

    .artwork-specs-grid {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 6px 15px;
      font-size: 13px;
      margin-top: 10px;
    }

    .spec-label {
      font-family: monospace;
      color: var(--text-muted);
      text-transform: uppercase;
      font-size: 11px;
    }

    .spec-val {
      color: #fff;
      font-weight: 500;
    }

    /* Table of Contents / Progress Bar */
    .toc-bar {
      background: #0c0b0a;
      border: 1px solid rgba(255,255,255,0.08);
      padding: 15px 20px;
      margin-bottom: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 15px;
    }

    .toc-title {
      font-size: 12px;
      font-family: monospace;
      text-transform: uppercase;
      color: var(--gold);
      letter-spacing: 1px;
      font-weight: bold;
    }

    .toc-pills {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .toc-pill {
      font-size: 11px;
      font-family: monospace;
      padding: 3px 8px;
      border: 1px solid var(--border);
      color: var(--text-muted);
      text-decoration: none;
      transition: all 0.2s;
    }

    .toc-pill:hover {
      border-color: var(--gold);
      color: #fff;
    }

    /* Phase Section */
    .phase-block {
      margin-bottom: 50px;
    }

    .phase-header {
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid var(--border);
      padding-bottom: 10px;
      margin-bottom: 25px;
    }

    .phase-num {
      background: var(--gold);
      color: #000;
      font-family: monospace;
      font-weight: bold;
      font-size: 11px;
      padding: 3px 8px;
    }

    .phase-title {
      font-family: "Playfair Display", Georgia, serif;
      font-size: 18px;
      color: #fff;
      letter-spacing: 0.5px;
    }

    /* Tool Card */
    .tool-card {
      background: var(--surface-card);
      border: 1px solid rgba(255,255,255,0.08);
      margin-bottom: 25px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    }

    .tool-card-header {
      background: #11100e;
      border-bottom: 1px solid var(--border);
      padding: 12px 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .tool-card-title {
      font-size: 14px;
      font-family: "Playfair Display", Georgia, serif;
      font-weight: bold;
      color: var(--gold);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .tool-card-body {
      padding: 20px;
    }

    .field-row {
      margin-bottom: 14px;
    }

    .field-row:last-child {
      margin-bottom: 0;
    }

    .field-label {
      font-size: 11px;
      font-family: monospace;
      color: var(--gold-light);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 4px;
      font-weight: bold;
    }

    .field-text {
      font-size: 13.5px;
      color: #e5e5e5;
      line-height: 1.6;
    }

    .quote-box {
      border-left: 3px solid var(--gold);
      background: rgba(201,168,76,0.06);
      padding: 12px 16px;
      margin: 10px 0;
      font-style: italic;
      color: #fff;
      font-size: 14px;
    }

    /* Palette Swatches */
    .palette-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 12px;
      margin: 12px 0;
    }

    .swatch-card {
      border: 1px solid rgba(255,255,255,0.1);
      background: #100f0d;
      overflow: hidden;
    }

    .swatch-color {
      height: 48px;
      width: 100%;
    }

    .swatch-info {
      padding: 8px;
      font-size: 11px;
      font-family: monospace;
    }

    .swatch-hex {
      font-weight: bold;
      color: #fff;
    }

    .swatch-name {
      color: var(--gold-light);
      font-size: 10px;
    }

    /* List styling */
    .bullet-list {
      list-style: none;
      padding-left: 0;
    }

    .bullet-list li {
      position: relative;
      padding-left: 18px;
      margin-bottom: 6px;
      font-size: 13px;
    }

    .bullet-list li::before {
      content: "✦";
      position: absolute;
      left: 0;
      color: var(--gold);
      font-size: 10px;
    }

    /* Price highlight box */
    .price-box {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      background: rgba(201,168,76,0.08);
      border: 1px solid var(--gold);
      padding: 15px;
      margin: 12px 0;
      text-align: center;
    }

    .price-tag {
      font-family: monospace;
      font-size: 18px;
      font-weight: bold;
      color: var(--gold);
    }

    /* Certificate Box */
    .cert-box {
      border: 2px solid var(--gold);
      padding: 25px;
      background: #0f0e0c;
      text-align: center;
      margin: 15px 0;
    }

    .cert-seal {
      font-size: 28px;
      margin-bottom: 10px;
    }

    /* Footer / Stamp */
    .footer {
      border-top: 1px solid var(--border);
      padding-top: 25px;
      margin-top: 50px;
      text-align: center;
      font-size: 11px;
      color: var(--text-muted);
      font-family: monospace;
    }

    .footer-seal {
      display: inline-block;
      border: 1px solid var(--gold);
      padding: 6px 14px;
      margin-bottom: 12px;
      color: var(--gold);
      letter-spacing: 1.5px;
      font-weight: bold;
    }

    /* Print Stylesheet */
    @media print {
      body {
        background: #fff !important;
        color: #000 !important;
        padding: 0 !important;
      }
      .container {
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
        background: #fff !important;
      }
      .artwork-hero, .tool-card, .toc-bar, .swatch-card {
        background: #fff !important;
        border: 1px solid #ccc !important;
        color: #000 !important;
        box-shadow: none !important;
      }
      .header-title, .phase-title, .tool-card-title, .field-label, .meta-date, .artwork-name {
        color: #000 !important;
      }
      .field-text, .spec-val, .bullet-list li {
        color: #222 !important;
      }
      .quote-box {
        background: #f8f8f8 !important;
        border-left: 3px solid #000 !important;
        color: #000 !important;
      }
      .badge-gold, .phase-num {
        background: #000 !important;
        color: #fff !important;
      }
      .price-box, .cert-box {
        border: 1px solid #000 !important;
        background: #fff !important;
        color: #000 !important;
      }
      .price-tag {
        color: #000 !important;
      }
      .tool-card {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <header class="header">
      <div class="top-badge-bar">
        <span class="badge-gold">ŒIL D'ATELIER · DOSSIER GLOBAL D'EXPERTISE</span>
        <span class="meta-date">Date : ${escapeHtml(dateStr)}</span>
      </div>
      <h1 class="header-title">${escapeHtml(title)}</h1>
      <p class="header-sub">Rapport Curatorial Intégral · ${completedTools.length} Recommandations Plastiques</p>
    </header>

    <!-- Artwork Overview -->
    <section class="artwork-hero">
      <div class="artwork-thumb-wrap">
        ${imageSrc ? `<img src="${imageSrc}" alt="${escapeHtml(title)}" class="artwork-thumb">` : `<div style="font-size:40px;">🎨</div>`}
      </div>
      <div class="artwork-details">
        <h2 class="artwork-name">${escapeHtml(title)}</h2>
        <div class="artwork-specs-grid">
          <span class="spec-label">Artiste :</span>
          <span class="spec-val">${escapeHtml(artist)}</span>

          <span class="spec-label">Médium / Technique :</span>
          <span class="spec-val">${escapeHtml(medium)}</span>

          <span class="spec-label">Année :</span>
          <span class="spec-val">${escapeHtml(year)}</span>

          ${artwork?.dimensions ? `
            <span class="spec-label">Format / Dimensions :</span>
            <span class="spec-val">${escapeHtml(artwork.dimensions)}</span>
          ` : ""}

          ${artistProfile?.location ? `
            <span class="spec-label">Atelier :</span>
            <span class="spec-val">${escapeHtml(artistProfile.location)}</span>
          ` : ""}

          <span class="spec-label">Statut Curatorial :</span>
          <span class="spec-val" style="color:var(--gold);">Dossier Complet Homologué (${completedTools.length}/16)</span>
        </div>
      </div>
    </section>

    <!-- Navigation / TOC -->
    <nav class="toc-bar">
      <span class="toc-title">Phases d'Atelier Disponibles :</span>
      <div class="toc-pills">
        ${CATEGORIES.map((cat, idx) => {
          const catTools = TOOLS.filter(t => t.cat === cat && !!cache[t.id]);
          if (catTools.length === 0) return "";
          return `<span class="toc-pill">Phase ${idx + 1} (${catTools.length})</span>`;
        }).join("")}
      </div>
    </nav>

    <!-- 16 Tools Render by Phase -->
    <main>
      ${CATEGORIES.map((cat, catIdx) => {
        const catTools = TOOLS.filter(t => t.cat === cat && !!cache[t.id]);
        if (catTools.length === 0) return "";

        return `
        <section class="phase-block">
          <div class="phase-header">
            <span class="phase-num">PHASE ${catIdx + 1}</span>
            <h2 class="phase-title">${escapeHtml(cat)}</h2>
          </div>

          ${catTools.map(tool => {
            const data = cache[tool.id];
            return renderToolHtml(tool, data, title, artist, medium);
          }).join("")}
        </section>
        `;
      }).join("")}
    </main>

    <!-- Footer Stamp -->
    <footer class="footer">
      <div class="footer-seal">ŒIL D'ATELIER · PROTOCOLE DE CERTIFICATION ARTISTIQUE</div>
      <p>Ce dossier curatorial d'expertise plastique et stratégique a été formulé par l'intelligence artificielle de l'Œil d'Atelier.</p>
      <p style="margin-top:5px; opacity:0.7;">Tous droits réservés à l'artiste créateur © ${new Date().getFullYear()} ${escapeHtml(artist)}.</p>
    </footer>
  </div>
</body>
</html>`;

  return html;
}

/**
 * Internal helper to format each tool's data into clean HTML
 */
function renderToolHtml(tool: any, data: any, title: string, artist: string, medium: string): string {
  if (!data) return "";

  let body = "";

  if (tool.id === "style") {
    body = `
      <div class="field-row">
        <div class="field-label">Style Dominant & Courant</div>
        <div class="field-text"><strong>${escapeHtml(data.style || "Non déterminé")}</strong> · Période : ${escapeHtml(data.periode || "Contemporaine")}</div>
      </div>
      <div class="field-row">
        <div class="field-label">Description Visuelle de la Matière</div>
        <div class="field-text">${escapeHtml(data.description || "")}</div>
      </div>
      <div class="field-row">
        <div class="field-label">Filiations & Influences Notables</div>
        <div class="field-text">${escapeHtml(data.influences || "")}</div>
      </div>
      ${data.mots_cles && Array.isArray(data.mots_cles) ? `
        <div class="field-row">
          <div class="field-label">Mots-clés Clés</div>
          <div class="field-text">${data.mots_cles.map((k: string) => `<span style="display:inline-block; border:1px solid var(--border); padding:2px 8px; margin:2px; font-size:11px; font-family:monospace;">${escapeHtml(k)}</span>`).join(" ")}</div>
        </div>
      ` : ""}
    `;
  } else if (tool.id === "palette") {
    const swatches = data.couleurs && Array.isArray(data.couleurs) ? `
      <div class="palette-grid">
        ${data.couleurs.map((c: any) => `
          <div class="swatch-card">
            <div class="swatch-color" style="background-color: ${escapeHtml(c.hex)};"></div>
            <div class="swatch-info">
              <div class="swatch-hex">${escapeHtml(c.hex)}</div>
              <div class="swatch-name">${escapeHtml(c.nom)}</div>
              <div style="font-size:9px; color:#888; margin-top:2px;">${escapeHtml(c.role)}</div>
            </div>
          </div>
        `).join("")}
      </div>
    ` : "";

    body = `
      <div class="field-row">
        <div class="field-label">Harmonie Chromatique</div>
        <div class="field-text"><strong>${escapeHtml(data.harmonie || "Équilibrée")}</strong></div>
      </div>
      ${swatches}
      <div class="field-row">
        <div class="field-label">Ambiance Émotionnelle & Vibratoire</div>
        <div class="field-text">${escapeHtml(data.ambiance || "")}</div>
      </div>
      <div class="field-row">
        <div class="field-label">Conseil Pigments d'Atelier</div>
        <div class="field-text">${escapeHtml(data.conseil || "")}</div>
      </div>
    `;
  } else if (tool.id === "technique") {
    body = `
      ${data.etapes_supposees && Array.isArray(data.etapes_supposees) ? `
        <div class="field-row">
          <div class="field-label">Reconstitution des Étapes de Création</div>
          <ol style="padding-left:20px; font-size:13px; margin-top:5px; line-height:1.7;">
            ${data.etapes_supposees.map((s: string) => `<li>${escapeHtml(s)}</li>`).join("")}
          </ol>
        </div>
      ` : ""}
      ${data.mediums_alternatifs && Array.isArray(data.mediums_alternatifs) ? `
        <div class="field-row">
          <div class="field-label">Médiums & Liants Alternatifs Conseillés</div>
          <div class="field-text">${data.mediums_alternatifs.map((m: string) => `• ${escapeHtml(m)}`).join("<br>")}</div>
        </div>
      ` : ""}
      <div class="field-row">
        <div class="field-label">Astuce Technique d'Atelier</div>
        <div class="quote-box">${escapeHtml(data.astuce_pro || "")}</div>
      </div>
    `;
  } else if (tool.id === "critique") {
    body = `
      <div class="field-row">
        <div class="field-label">Titre Curatorial</div>
        <div class="field-text" style="font-family:'Playfair Display', serif; font-size:16px; color:var(--gold);">« ${escapeHtml(data.titre_critique || "")} »</div>
      </div>
      <div class="field-row">
        <div class="field-label">Texte Critique Littéraire</div>
        <div class="field-text" style="font-style:italic; line-height:1.8;">${escapeHtml(data.texte || "")}</div>
      </div>
      <div class="field-row">
        <div class="field-label">Citation pour Catalogue d'Exposition</div>
        <div class="quote-box">« ${escapeHtml(data.citation || "")} »</div>
      </div>
    `;
  } else if (tool.id === "conseils") {
    body = `
      <div class="field-row">
        <div class="field-label">Niveau de Maîtrise Plastique Estimé</div>
        <div class="field-text"><strong>${escapeHtml(data.niveau_estime || "Avancé")}</strong></div>
      </div>
      ${data.forces && Array.isArray(data.forces) ? `
        <div class="field-row">
          <div class="field-label">Forces Plastiques Majeures</div>
          <ul class="bullet-list">
            ${data.forces.map((f: string) => `<li>${escapeHtml(f)}</li>`).join("")}
          </ul>
        </div>
      ` : ""}
      ${data.axes_amelioration && Array.isArray(data.axes_amelioration) ? `
        <div class="field-row">
          <div class="field-label">Axes de Perfectionnement & Exercices d'Atelier</div>
          <div style="display:flex; flex-direction:column; gap:10px; margin-top:8px;">
            ${data.axes_amelioration.map((ax: any) => `
              <div style="background:#100f0d; border:1px solid rgba(255,255,255,0.06); padding:10px 14px;">
                <div style="color:var(--gold-light); font-weight:bold; font-size:12px;">${escapeHtml(ax.aspect)}</div>
                <div style="font-size:13px; margin:3px 0;">${escapeHtml(ax.conseil)}</div>
                <div style="font-size:12px; color:#aaa; font-style:italic;">💡 Exercice : ${escapeHtml(ax.exercice)}</div>
              </div>
            `).join("")}
          </div>
        </div>
      ` : ""}
    `;
  } else if (tool.id === "vernissage") {
    body = `
      <div class="field-row">
        <div class="field-label">Concept du Vernissage</div>
        <div class="field-text" style="font-size:16px; font-weight:bold; color:#fff;">« ${escapeHtml(data.titre_event || "")} »</div>
        <div style="font-size:12px; color:var(--gold-light); font-family:monospace; margin-top:2px;">${escapeHtml(data.date_fictive || "")} · ${escapeHtml(data.lieu_fictif || "")}</div>
      </div>
      <div class="field-row">
        <div class="field-label">Phrase d'Invitation Curoriale</div>
        <div class="quote-box">« ${escapeHtml(data.phrase_accroche || "")} »</div>
      </div>
      <div class="field-row">
        <div class="field-label">Prompt d'Affiche IA (Midjourney / DALL-E)</div>
        <div style="font-family:monospace; font-size:11px; background:#000; padding:10px; border:1px dashed var(--border); color:#aaa;">${escapeHtml(data.prompt_image_generator || "")}</div>
      </div>
    `;
  } else if (tool.id === "titres") {
    body = `
      <div class="field-row">
        <div class="field-label">5 Propositions de Titres par Registres</div>
        <div style="display:flex; flex-direction:column; gap:8px; margin-top:8px;">
          ${data.titres && Array.isArray(data.titres) ? data.titres.map((t: any, i: number) => `
            <div style="display:flex; justify-content:space-between; align-items:flex-start; background:#100f0d; border:1px solid rgba(255,255,255,0.06); padding:10px 14px; gap:10px;">
              <div>
                <strong style="font-size:14px; color:var(--gold);">« ${escapeHtml(t.nom)} »</strong>
                <div style="font-size:12px; color:#bbb; margin-top:2px;">${escapeHtml(t.explication)}</div>
              </div>
              <span style="font-family:monospace; font-size:10px; background:rgba(201,168,76,0.15); color:var(--gold); padding:2px 6px; text-transform:uppercase; white-space:nowrap;">${escapeHtml(t.registre)}</span>
            </div>
          `).join("") : ""}
        </div>
      </div>
    `;
  } else if (tool.id === "expo") {
    body = `
      <div class="field-row">
        <div class="field-label">Titre d'Exposition</div>
        <div class="field-text" style="font-size:15px; font-weight:bold; color:var(--gold);">« ${escapeHtml(data.titre_expo || "")} »</div>
      </div>
      <div class="field-row">
        <div class="field-label">Texte de Cartel Muséal</div>
        <div class="field-text" style="background:#0e0d0b; border:1px solid var(--border); padding:14px; font-size:13px; line-height:1.7;">${escapeHtml(data.texte_cartel || "")}</div>
      </div>
      <div class="field-row">
        <div class="field-label">Communiqué de Presse Éclair</div>
        <div class="field-text">${escapeHtml(data.communique || "")}</div>
      </div>
    `;
  } else if (tool.id === "artistes") {
    body = `
      <div class="field-row">
        <div class="field-label">Filiations & Maîtres en Miroir</div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:10px; margin-top:8px;">
          ${data.artistes && Array.isArray(data.artistes) ? data.artistes.map((art: any) => `
            <div style="background:#100f0d; border:1px solid rgba(255,255,255,0.06); padding:12px;">
              <div style="font-weight:bold; color:var(--gold); font-size:13px;">${escapeHtml(art.nom)} <span style="font-size:11px; color:#888; font-weight:normal;">(${escapeHtml(art.periode)})</span></div>
              <div style="font-size:12px; margin:4px 0; color:#ddd;">${escapeHtml(art.lien)}</div>
              <div style="font-size:11px; color:var(--gold-light); font-style:italic;">Œuvre référence : « ${escapeHtml(art.oeuvre_reference)} »</div>
            </div>
          `).join("") : ""}
        </div>
      </div>
      ${data.musees && Array.isArray(data.musees) ? `
        <div class="field-row">
          <div class="field-label">Musées Cibles d'Inspiration</div>
          <div class="field-text">${data.musees.map((m: string) => `🏛️ ${escapeHtml(m)}`).join(" &nbsp;·&nbsp; ")}</div>
        </div>
      ` : ""}
    `;
  } else if (tool.id === "prix") {
    body = `
      <div class="field-label">Fourchettes d'Estimation Marché (Format Standard)</div>
      <div class="price-box">
        <div>
          <div style="font-size:11px; color:#aaa; text-transform:uppercase; font-family:monospace;">Artiste Émergent</div>
          <div class="price-tag">${escapeHtml(data.fourchette_basse || "N/A")}</div>
        </div>
        <div>
          <div style="font-size:11px; color:#aaa; text-transform:uppercase; font-family:monospace;">Galerie / Établi</div>
          <div class="price-tag">${escapeHtml(data.fourchette_haute || "N/A")}</div>
        </div>
      </div>
      <div class="field-row">
        <div class="field-label">Analyse du Marché Contemporain</div>
        <div class="field-text">${escapeHtml(data.marche || "")}</div>
      </div>
      <div class="field-row">
        <div class="field-label">Conseil Commercial Stratégique</div>
        <div class="field-text" style="color:var(--gold-light);">${escapeHtml(data.conseil_vente || "")}</div>
      </div>
    `;
  } else if (tool.id === "certificat") {
    body = `
      <div class="cert-box">
        <div class="cert-seal">📜</div>
        <h3 style="font-family:'Playfair Display', serif; font-size:18px; color:var(--gold); margin-bottom:6px;">CERTIFICAT D'AUTHENTICITÉ</h3>
        <p style="font-family:monospace; font-size:11px; color:#888; margin-bottom:15px;">MENTION OFFICIELLE D'ATELIER</p>
        <p style="font-style:italic; font-size:13.5px; line-height:1.8; color:#eee; max-width:650px; margin:0 auto;">
          "${escapeHtml(data.texte_certificat || "")}"
        </p>
        <div style="margin-top:20px; font-family:monospace; font-size:11px; color:var(--gold-light);">
          Œuvre : « ${escapeHtml(data.titre_oeuvre || title)} » · Technique : ${escapeHtml(data.technique_supposee || medium)}
        </div>
      </div>
    `;
  } else if (tool.id === "decor") {
    body = `
      <div class="field-row">
        <div class="field-label">Écrin Idéal & Scénographie d'Intérieur</div>
        <div class="field-text">${escapeHtml(data.style_interieur || "")}</div>
      </div>
      <div class="field-row">
        <div class="field-label">Profil de l'Acheteur Idéal</div>
        <div class="field-text">${escapeHtml(data.acheteur_cible || "")}</div>
      </div>
      <div class="field-row">
        <div class="field-label">Argument Coup de Cœur</div>
        <div class="quote-box">« ${escapeHtml(data.argumentaire || "")} »</div>
      </div>
    `;
  } else if (tool.id === "statement") {
    body = `
      <div class="field-row">
        <div class="field-label">Titre de la Démarche</div>
        <div class="field-text" style="font-family:'Playfair Display', serif; font-size:16px; color:var(--gold);">« ${escapeHtml(data.titre || "")} »</div>
      </div>
      <div class="field-row">
        <div class="field-label">Démarche Artistique (1ère Personne)</div>
        <div class="field-text" style="line-height:1.8; white-space:pre-line;">${escapeHtml(data.texte_demarche || "")}</div>
      </div>
      ${data.mots_cles_marquants && Array.isArray(data.mots_cles_marquants) ? `
        <div class="field-row">
          <div class="field-label">Concepts Moteurs</div>
          <div class="field-text">${data.mots_cles_marquants.map((k: string) => `<span style="display:inline-block; border:1px solid var(--border); padding:2px 8px; margin:2px; font-size:11px; font-family:monospace;">${escapeHtml(k)}</span>`).join(" ")}</div>
        </div>
      ` : ""}
    `;
  } else if (tool.id === "reseaux") {
    body = `
      ${data.legendes && Array.isArray(data.legendes) ? `
        <div class="field-row">
          <div class="field-label">Légendes Stratégiques pour Réseaux Sociaux</div>
          <div style="display:flex; flex-direction:column; gap:10px; margin-top:8px;">
            ${data.legendes.map((leg: any) => `
              <div style="background:#100f0d; border:1px solid rgba(255,255,255,0.06); padding:10px 14px;">
                <div style="font-family:monospace; font-size:11px; color:var(--gold); font-weight:bold; margin-bottom:4px;">${escapeHtml(leg.plateforme)}</div>
                <div style="font-size:13px; color:#ddd; white-space:pre-line;">${escapeHtml(leg.texte)}</div>
              </div>
            `).join("")}
          </div>
        </div>
      ` : ""}
      ${data.hashtags && Array.isArray(data.hashtags) ? `
        <div class="field-row">
          <div class="field-label">Top Hashtags Recommandés</div>
          <div style="font-family:monospace; font-size:11px; color:var(--gold-light);">${data.hashtags.map((h: string) => escapeHtml(h)).join(" ")}</div>
        </div>
      ` : ""}
      <div class="field-row">
        <div class="field-label">Concept Vidéo Immersion d'Atelier (Reel / TikTok)</div>
        <div class="field-text">${escapeHtml(data.reel_idea || "")}</div>
      </div>
    `;
  } else if (tool.id === "inspiration") {
    body = `
      ${data.pistes && Array.isArray(data.pistes) ? `
        <div class="field-row">
          <div class="field-label">Pistes de Continuité & Diptyques</div>
          <div style="display:flex; flex-direction:column; gap:8px; margin-top:8px;">
            ${data.pistes.map((p: any, i: number) => `
              <div style="background:#100f0d; border:1px solid rgba(255,255,255,0.06); padding:10px 14px;">
                <div style="color:var(--gold); font-weight:bold; font-size:13px;">${i + 1}. ${escapeHtml(p.concept)}</div>
                <div style="font-size:12px; color:#bbb; margin-top:2px;">${escapeHtml(p.pourquoi)}</div>
              </div>
            `).join("")}
          </div>
        </div>
      ` : ""}
      <div class="field-row">
        <div class="field-label">Défi Créatif en Atelier</div>
        <div class="quote-box">${escapeHtml(data.defi || "")}</div>
      </div>
    `;
  } else if (tool.id === "poesie") {
    body = `
      <div class="field-row">
        <div class="field-label">Titre Poétique</div>
        <div class="field-text" style="font-family:'Playfair Display', serif; font-size:16px; color:var(--gold);">« ${escapeHtml(data.titre_poeme || "")} »</div>
      </div>
      <div class="field-row">
        <div class="field-label">Haïku Japonais</div>
        <div class="quote-box" style="white-space:pre-line; text-align:center; font-style:normal; letter-spacing:0.5px;">${escapeHtml(data.haiku || "")}</div>
      </div>
      <div class="field-row">
        <div class="field-label">Poème en Vers Libres</div>
        <div class="field-text" style="font-style:italic; line-height:1.9; white-space:pre-line; padding-left:15px; border-left:2px solid var(--border);">${escapeHtml(data.texte_poetique || "")}</div>
      </div>
    `;
  }

  return `
    <article class="tool-card">
      <div class="tool-card-header">
        <div class="tool-card-title">
          <span>${tool.icon}</span>
          <span>${escapeHtml(tool.label)}</span>
        </div>
        <span style="font-family:monospace; font-size:10px; color:var(--gold); text-transform:uppercase;">Complété ✓</span>
      </div>
      <div class="tool-card-body">
        ${body}
      </div>
    </article>
  `;
}

/**
 * Download a generated HTML string as an .html file
 */
export function downloadHtmlReport(filename: string, htmlContent: string) {
  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".html") ? filename : `${filename}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Download a generated text or markdown string as a file
 */
export function downloadTextReport(filename: string, textContent: string, extension: "txt" | "md" = "txt") {
  const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(`.${extension}`) ? filename : `${filename}.${extension}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Helper to share the report via navigator.share or fallback
 */
export async function shareGlobalReport(options: {
  title: string;
  text: string;
  url?: string;
  onSuccess?: () => void;
  onFallbackCopy?: () => void;
}): Promise<boolean> {
  const { title, text, url, onSuccess, onFallbackCopy } = options;

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({
        title,
        text: text.slice(0, 1800), // Ensure within mobile limit
        url: url || (typeof window !== "undefined" ? window.location.href : undefined)
      });
      if (onSuccess) onSuccess();
      return true;
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.warn("navigator.share failed, using fallback:", err);
      }
    }
  }

  // Fallback: Copy summary to clipboard
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      if (onFallbackCopy) onFallbackCopy();
      return true;
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  }

  return false;
}

function escapeHtml(str: string): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
