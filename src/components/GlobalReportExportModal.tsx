/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { 
  X, Download, Copy, Share2, Check, FileCode, FileText, 
  Printer, ExternalLink, Mail, Sparkles, CheckCircle2, 
  Layers, Eye, RefreshCw
} from "lucide-react";
import { TOOLS, CATEGORIES } from "../data.js";
import { 
  generateGlobalHtmlReport, 
  generateGlobalMarkdownReport, 
  downloadHtmlReport, 
  downloadTextReport, 
  shareGlobalReport,
  ReportExportOptions
} from "../utils/reportExport.js";

interface GlobalReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
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
  theme?: "dark-gold" | "light";
}

export default function GlobalReportExportModal({
  isOpen,
  onClose,
  cache,
  artistProfile,
  artwork,
  activeSeries,
  theme = "dark-gold"
}: GlobalReportExportModalProps) {
  const [activeTab, setActiveTab] = useState<"html-preview" | "text-preview" | "tools-summary">("html-preview");
  const [copied, setCopied] = useState<boolean>(false);
  const [sharedNotice, setSharedNotice] = useState<string | null>(null);

  const isDark = theme === "dark-gold";

  // Filter completed tools
  const completedTools = useMemo(() => {
    return TOOLS.filter(t => !!cache[t.id]);
  }, [cache]);

  // Generate options
  const exportOptions: ReportExportOptions = useMemo(() => ({
    cache,
    artistProfile,
    artwork,
    activeSeries
  }), [cache, artistProfile, artwork, activeSeries]);

  // Generate contents
  const htmlContent = useMemo(() => {
    if (!isOpen) return "";
    return generateGlobalHtmlReport(exportOptions);
  }, [exportOptions, isOpen]);

  const textContent = useMemo(() => {
    if (!isOpen) return "";
    return generateGlobalMarkdownReport(exportOptions);
  }, [exportOptions, isOpen]);

  if (!isOpen) return null;

  const artworkTitle = artwork?.title || "Oeuvre_Atelier";
  const sanitizedTitle = artworkTitle.replace(/[^a-zA-Z0-9_-]/g, "_");
  const filename = `Rapport_Expertise_${sanitizedTitle}_16_Outils`;

  // Handlers
  const handleDownloadHtml = () => {
    downloadHtmlReport(filename, htmlContent);
  };

  const handleDownloadTxt = () => {
    downloadTextReport(filename, textContent, "txt");
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(textContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Clipboard copy error:", err);
    }
  };

  const handleShare = async () => {
    const success = await shareGlobalReport({
      title: `Rapport d'Expertise Artistique — ${artworkTitle}`,
      text: textContent,
      onSuccess: () => {
        setSharedNotice("Partage réussi !");
        setTimeout(() => setSharedNotice(null), 3000);
      },
      onFallbackCopy: () => {
        setSharedNotice("Dossier copié dans le presse-papier !");
        setTimeout(() => setSharedNotice(null), 3000);
      }
    });
    if (!success) {
      setSharedNotice("Dossier copié !");
      setTimeout(() => setSharedNotice(null), 3000);
    }
  };

  const handleOpenPrint = () => {
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, "_blank");
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };
    }
  };

  const handlePrepareEmail = () => {
    const subject = encodeURIComponent(`Dossier d'Expertise Plastique & Recommandations — ${artworkTitle}`);
    const summaryExcerpt = textContent.slice(0, 1500) + "\n\n[... Dossier complet téléchargeable en HTML ...]";
    const body = encodeURIComponent(summaryExcerpt);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div 
        className={`w-full max-w-6xl max-h-[94vh] flex flex-col border shadow-2xl overflow-hidden transition-all duration-300 ${
          isDark ? "bg-[#0c0c0b] border-[#c9a84c] text-white" : "bg-white border-[#c9a84c] text-stone-900"
        }`}
      >
        {/* Header */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between flex-shrink-0 ${
          isDark ? "bg-[#14120e] border-[#c9a84c]/20" : "bg-amber-50 border-[#c9a84c]/30"
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-[#c9a84c] text-black font-black text-lg shadow-md">
              📜
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-serif font-bold uppercase tracking-wider">
                  Dossier Global des 16 Recommandations d'Atelier
                </h2>
                <span className="text-[10px] font-mono bg-gradient-to-r from-[#b8973e] via-[#c9a84c] to-[#e4cb78] text-black font-black px-2 py-0.5 uppercase tracking-wider">
                  {completedTools.length}/16 Disponibles
                </span>
              </div>
              <p className={`text-xs font-sans mt-0.5 ${isDark ? "text-neutral-400" : "text-stone-600"}`}>
                Téléchargez le rapport complet en HTML autonome, copiez-collez le texte brut ou partagez-le directement.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`p-2 transition-colors cursor-pointer ${
              isDark ? "text-neutral-400 hover:text-white" : "text-stone-500 hover:text-black"
            }`}
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Main Action Cards (HTML, Copier-Coller, Partager) */}
        <div className={`p-4 sm:p-5 border-b grid grid-cols-1 md:grid-cols-3 gap-3.5 flex-shrink-0 ${
          isDark ? "bg-[#11100e] border-white/10" : "bg-stone-50 border-stone-200"
        }`}>
          {/* Card 1: Télécharger HTML */}
          <div className={`p-4 border flex flex-col justify-between transition-all duration-300 relative group ${
            isDark 
              ? "bg-[#161410] border-[#c9a84c]/40 hover:border-[#c9a84c]" 
              : "bg-white border-[#c9a84c]/40 hover:border-[#c9a84c] shadow-sm"
          }`}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#c9a84c] uppercase tracking-wider">
                  <FileCode className="w-4 h-4" />
                  <span>1. Fichier HTML Complet</span>
                </span>
                <span className="text-[9px] font-mono bg-[#c9a84c]/20 text-[#c9a84c] px-1.5 py-0.5 font-bold">
                  AUTONOME & PDF
                </span>
              </div>
              <p className={`text-[11px] font-sans leading-relaxed mb-3 ${
                isDark ? "text-neutral-300" : "text-stone-600"
              }`}>
                Fichier autonome avec typographie soignée, nuancier couleur et styles d'impression PDF pour catalogue.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-white/5">
              <button
                type="button"
                onClick={handleDownloadHtml}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-gradient-to-r from-[#b8973e] via-[#c9a84c] to-[#e4cb78] text-black font-mono font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-md cursor-pointer transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Télécharger .HTML</span>
              </button>
              <button
                type="button"
                onClick={handleOpenPrint}
                className={`p-2 border transition-colors cursor-pointer ${
                  isDark ? "border-white/15 hover:border-[#c9a84c] text-neutral-300" : "border-stone-300 hover:border-[#c9a84c] text-stone-700"
                }`}
                title="Imprimer ou enregistrer en PDF"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: Copier-Coller */}
          <div className={`p-4 border flex flex-col justify-between transition-all duration-300 ${
            isDark 
              ? "bg-[#161410] border-[#c9a84c]/40 hover:border-[#c9a84c]" 
              : "bg-white border-[#c9a84c]/40 hover:border-[#c9a84c] shadow-sm"
          }`}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#c9a84c] uppercase tracking-wider">
                  <FileText className="w-4 h-4" />
                  <span>2. Format Copier-Coller</span>
                </span>
                <span className="text-[9px] font-mono bg-neutral-800 text-neutral-300 px-1.5 py-0.5 font-bold">
                  WORD / NOTES / TXT
                </span>
              </div>
              <p className={`text-[11px] font-sans leading-relaxed mb-3 ${
                isDark ? "text-neutral-300" : "text-stone-600"
              }`}>
                Texte brut et Markdown structuré prêt à coller dans vos fiches, e-mails de galeries ou dossiers Word.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-white/5">
              <button
                type="button"
                onClick={handleCopyText}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md ${
                  copied 
                    ? "bg-emerald-600 text-white" 
                    : "bg-[#c9a84c] text-black hover:bg-white"
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copié ✓" : "Copier tout le dossier"}</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadTxt}
                className={`p-2 border transition-colors cursor-pointer ${
                  isDark ? "border-white/15 hover:border-[#c9a84c] text-neutral-300" : "border-stone-300 hover:border-[#c9a84c] text-stone-700"
                }`}
                title="Télécharger en fichier texte .txt"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 3: Partager le Dossier */}
          <div className={`p-4 border flex flex-col justify-between transition-all duration-300 ${
            isDark 
              ? "bg-[#161410] border-[#c9a84c]/40 hover:border-[#c9a84c]" 
              : "bg-white border-[#c9a84c]/40 hover:border-[#c9a84c] shadow-sm"
          }`}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#c9a84c] uppercase tracking-wider">
                  <Share2 className="w-4 h-4" />
                  <span>3. Partage Immédiat</span>
                </span>
                <span className="text-[9px] font-mono bg-blue-950/60 text-blue-300 border border-blue-800/40 px-1.5 py-0.5 font-bold">
                  AIRDROP / MAIL / SOCIAUX
                </span>
              </div>
              <p className={`text-[11px] font-sans leading-relaxed mb-3 ${
                isDark ? "text-neutral-300" : "text-stone-600"
              }`}>
                Partagez le diagnostic avec un galeriste, collectionneur ou mentor par e-mail ou via l'application native.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-white/5">
              <button
                type="button"
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-md cursor-pointer transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{sharedNotice || "Partager le Dossier"}</span>
              </button>
              <button
                type="button"
                onClick={handlePrepareEmail}
                className={`p-2 border transition-colors cursor-pointer ${
                  isDark ? "border-white/15 hover:border-[#c9a84c] text-neutral-300" : "border-stone-300 hover:border-[#c9a84c] text-stone-700"
                }`}
                title="Préparer un e-mail avec la synthèse du dossier"
              >
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Preview Tabs Selector */}
        <div className={`px-5 pt-3 border-b flex items-center justify-between flex-shrink-0 ${
          isDark ? "bg-[#0e0d0b] border-white/10" : "bg-stone-100 border-stone-200"
        }`}>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setActiveTab("html-preview")}
              className={`pb-2.5 text-xs tracking-wider uppercase font-mono font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "html-preview"
                  ? "border-[#c9a84c] text-[#c9a84c]"
                  : "border-transparent text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Aperçu HTML Rendu</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("text-preview")}
              className={`pb-2.5 text-xs tracking-wider uppercase font-mono font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "text-preview"
                  ? "border-[#c9a84c] text-[#c9a84c]"
                  : "border-transparent text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Aperçu Texte (Copier-Coller)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("tools-summary")}
              className={`pb-2.5 text-xs tracking-wider uppercase font-mono font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "tools-summary"
                  ? "border-[#c9a84c] text-[#c9a84c]"
                  : "border-transparent text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Checklist des 16 Outils ({completedTools.length}/16)</span>
            </button>
          </div>

          <span className="text-[10px] font-mono text-neutral-500 hidden sm:inline-block">
            Œuvre : « {artworkTitle} »
          </span>
        </div>

        {/* Tab Content Display */}
        <div className="flex-1 overflow-hidden relative">
          {activeTab === "html-preview" && (
            <div className="w-full h-full bg-[#080808] relative">
              <iframe
                title="Aperçu du Rapport HTML"
                srcDoc={htmlContent}
                className="w-full h-full border-0 bg-transparent"
                sandbox="allow-same-origin"
              />
            </div>
          )}

          {activeTab === "text-preview" && (
            <div className="w-full h-full flex flex-col p-4 overflow-hidden relative bg-[#0a0a0a]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-[#c9a84c] font-bold uppercase">
                  Contenu texte brut et Markdown (Sélectionnez ou copiez en 1 clic) :
                </span>
                <button
                  type="button"
                  onClick={handleCopyText}
                  className="flex items-center gap-1.5 px-3 py-1 bg-[#c9a84c] text-black font-mono font-bold text-xs uppercase hover:bg-white transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copié !" : "Copier le texte"}</span>
                </button>
              </div>
              <textarea
                readOnly
                value={textContent}
                className="w-full flex-1 p-4 bg-black border border-white/10 text-neutral-200 font-mono text-xs leading-relaxed rounded-none resize-none focus:outline-none focus:border-[#c9a84c]"
              />
            </div>
          )}

          {activeTab === "tools-summary" && (
            <div className="w-full h-full p-6 overflow-y-auto bg-[#0a0a0a] scrollbar-thin">
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h3 className="font-serif font-bold text-base text-white">
                      État des 16 Recommandations d'Atelier
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1 font-sans">
                      Toutes les recommandations complétées sont automatiquement fusionnées dans le dossier global téléchargeable.
                    </p>
                  </div>
                  <span className="text-sm font-mono font-bold text-[#c9a84c] bg-[#c9a84c]/10 border border-[#c9a84c]/30 px-3 py-1">
                    {completedTools.length} / 16 Inclus
                  </span>
                </div>

                {CATEGORIES.map((cat, catIdx) => {
                  const toolsInCat = TOOLS.filter(t => t.cat === cat);
                  return (
                    <div key={cat} className="border border-white/10 p-4 bg-[#12110f]">
                      <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                        <span className="text-xs font-mono font-bold text-[#c9a84c] uppercase">
                          Phase {catIdx + 1} : {cat}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400">
                          {toolsInCat.filter(t => !!cache[t.id]).length} / {toolsInCat.length}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {toolsInCat.map(tool => {
                          const isDone = !!cache[tool.id];
                          return (
                            <div 
                              key={tool.id} 
                              className={`p-2.5 border flex items-center justify-between ${
                                isDone 
                                  ? "border-[#c9a84c]/40 bg-[#171511]" 
                                  : "border-white/5 bg-black/40 opacity-60"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-base">{tool.icon}</span>
                                <div>
                                  <div className="text-xs font-bold text-white">{tool.label}</div>
                                  <div className="text-[10px] text-neutral-400 line-clamp-1">{tool.description}</div>
                                </div>
                              </div>
                              <span className={`text-[9px] font-mono px-1.5 py-0.5 font-bold uppercase ${
                                isDone 
                                  ? "bg-emerald-950 text-emerald-300 border border-emerald-500/30" 
                                  : "bg-neutral-800 text-neutral-500"
                              }`}>
                                {isDone ? "Prêt ✓" : "En attente"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0 ${
          isDark ? "bg-[#14120e] border-[#c9a84c]/20" : "bg-amber-50 border-[#c9a84c]/30"
        }`}>
          <div className="flex items-center gap-2 text-xs font-sans text-neutral-400">
            <span className="text-[#c9a84c]">💡</span>
            <span>Le fichier HTML téléchargé est 100% autonome et peut être visualisé hors-ligne ou imprimé en PDF.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadHtml}
              className="px-4 py-1.5 bg-gradient-to-r from-[#b8973e] via-[#c9a84c] to-[#e4cb78] text-black font-mono font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-sm cursor-pointer"
            >
              Télécharger .HTML
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 border border-white/20 text-xs font-mono font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer text-white"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
