/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Sparkles, X, CheckCircle2, Play, Search,
  Palette, Layers, Feather, Compass, DollarSign,
  Award, Home, Type, Library, FileText, Wine,
  Share2, Scroll, Zap, PenTool
} from "lucide-react";
import { TOOLS, CATEGORIES } from "../data.js";
import { Tool } from "../types.js";

interface ArtworkToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (toolId: string) => void;
  activeToolId: string;
  cache: Record<string, any>;
  theme: "dark-gold" | "light";
  onRunAllAnalyses?: () => void;
  onOpenGlobalReport?: () => void;
  isSubscribed?: boolean;
  hasArtwork?: boolean;
  onOpenSubscriptionModal?: () => void;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  style: Search,
  palette: Palette,
  technique: Layers,
  critique: Feather,
  conseils: Compass,
  prix: DollarSign,
  certificat: Award,
  decor: Home,
  titres: Type,
  artistes: Library,
  expo: FileText,
  vernissage: Wine,
  reseaux: Share2,
  statement: Scroll,
  inspiration: Zap,
  poesie: PenTool
};

export default function ArtworkToolsModal({
  isOpen,
  onClose,
  onSelectTool,
  activeToolId,
  cache,
  theme,
  onRunAllAnalyses,
  isSubscribed,
  hasArtwork,
  onOpenSubscriptionModal,
  onOpenGlobalReport
}: ArtworkToolsModalProps) {
  const [selectedPhase, setSelectedPhase] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  if (!isOpen) return null;

  const isDark = theme === "dark-gold";
  const completedCount = TOOLS.filter(t => !!cache[t.id]).length;

  const filteredTools = TOOLS.filter(tool => {
    const matchesPhase = selectedPhase === "all" || tool.cat === selectedPhase;
    const matchesSearch = tool.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPhase && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div 
        className={`w-full max-w-5xl max-h-[92vh] flex flex-col border shadow-2xl overflow-hidden transition-all duration-300 ${
          isDark ? "bg-[#0d0d0d] border-[#c9a84c] text-white" : "bg-white border-[#c9a84c] text-stone-900"
        }`}
      >
        {/* Header */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between flex-shrink-0 ${
          isDark ? "bg-black/80 border-white/10" : "bg-amber-50/70 border-stone-200"
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-[#c9a84c] text-black font-black text-lg">
              🎨
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-serif font-bold uppercase tracking-wider">
                  Suite des 16 Outils d'Analyse Plastique & Marché
                </h2>
                <span className="text-[10px] font-mono bg-[#c9a84c] text-black font-black px-2 py-0.5 uppercase">
                  {completedCount}/16 Complétés
                </span>
              </div>
              <p className={`text-xs font-sans mt-0.5 ${isDark ? "text-neutral-400" : "text-stone-600"}`}>
                Sélectionnez un outil pour l'exécuter immédiatement sur l'œuvre d'art sélectionnée.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {onOpenGlobalReport && completedCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  onOpenGlobalReport();
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#b8973e] via-[#c9a84c] to-[#e4cb78] text-black font-mono font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-md cursor-pointer transition-all"
                title="Télécharger le dossier complet en HTML ou format copier-coller"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Dossier Global ({completedCount}/16)</span>
              </button>
            )}

            {onRunAllAnalyses && (
              <button
                type="button"
                onClick={() => {
                  onRunAllAnalyses();
                  onClose();
                }}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#c9a84c] hover:bg-white text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Diagnostic Intégral (16/16)</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className={`p-2 transition-colors ${
                isDark ? "text-neutral-400 hover:text-white" : "text-stone-500 hover:text-black"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className={`p-3.5 sm:p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0 ${
          isDark ? "bg-[#111111] border-white/10" : "bg-stone-50 border-stone-200"
        }`}>
          {/* Phase Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
            <button
              type="button"
              onClick={() => setSelectedPhase("all")}
              className={`px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedPhase === "all"
                  ? "bg-[#c9a84c] text-black"
                  : isDark ? "bg-black/50 text-neutral-400 hover:text-white border border-white/10" : "bg-white text-stone-600 hover:text-black border border-stone-200"
              }`}
            >
              Tous (16)
            </button>
            {CATEGORIES.map((cat, idx) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedPhase(cat)}
                className={`px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  selectedPhase === cat
                    ? "bg-[#c9a84c] text-black"
                    : isDark ? "bg-black/50 text-neutral-400 hover:text-white border border-white/10" : "bg-white text-stone-600 hover:text-black border border-stone-200"
                }`}
              >
                Phase {idx + 1}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un outil..."
              className={`w-full pl-9 pr-3 py-1.5 text-xs rounded-none border focus:outline-none transition-colors ${
                isDark 
                  ? "bg-black border-white/10 text-white placeholder:text-neutral-500 focus:border-[#c9a84c]" 
                  : "bg-white border-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-[#c9a84c]"
              }`}
            />
          </div>
        </div>

        {/* Tools Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 scrollbar-thin">
          {completedCount > 0 && onOpenGlobalReport && (
            <div className={`p-3.5 mb-4 border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              isDark ? "bg-[#18150d] border-[#c9a84c]/60 text-white" : "bg-amber-50 border-[#c9a84c] text-stone-900"
            }`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">📜</span>
                <div>
                  <div className="text-xs font-bold text-[#c9a84c] uppercase tracking-wide">
                    Dossier Global des Recommandations Prêt ({completedCount}/16)
                  </div>
                  <div className={`text-[11px] font-sans ${isDark ? "text-neutral-300" : "text-stone-600"}`}>
                    Téléchargez l'intégralité du diagnostic en fichier HTML autonome, copiez-collez le texte brut ou partagez-le en 1 clic.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onOpenGlobalReport();
                  onClose();
                }}
                className="px-3.5 py-1.5 bg-gradient-to-r from-[#b8973e] via-[#c9a84c] to-[#e4cb78] text-black font-mono font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all whitespace-nowrap self-start sm:self-auto cursor-pointer shadow-sm"
              >
                Ouvrir le Dossier Global →
              </button>
            </div>
          )}

          {!hasArtwork && (
            <div className={`p-3 mb-4 border text-xs flex items-center justify-between gap-3 ${
              isDark ? "bg-amber-950/20 border-[#c9a84c]/30 text-amber-200" : "bg-amber-50 border-amber-200 text-amber-900"
            }`}>
              <div className="flex items-center gap-2">
                <span>💡</span>
                <span>Aucune œuvre n'est actuellement chargée. En sélectionnant un outil, vous accéderez directement à l'espace de dépôt ou de sélection.</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {filteredTools.map((tool) => {
              const IconComp = iconMap[tool.id] || Sparkles;
              const isCached = !!cache[tool.id];
              const isActive = activeToolId === tool.id;

              return (
                <div
                  key={tool.id}
                  onClick={() => {
                    onSelectTool(tool.id);
                    onClose();
                  }}
                  className={`p-3.5 border text-left flex flex-col justify-between cursor-pointer transition-all duration-300 group hover:scale-[1.01] ${
                    isActive
                      ? "border-[#c9a84c] ring-1 ring-[#c9a84c] " + (isDark ? "bg-[#18150a]" : "bg-amber-50/90")
                      : isDark
                        ? "bg-[#121212] hover:bg-[#181818] border-white/10"
                        : "bg-white hover:bg-amber-50/50 border-stone-200 shadow-sm"
                  }`}
                >
                  <div>
                    {/* Tool Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 flex items-center justify-center border transition-colors ${
                          isActive || isCached
                            ? "bg-[#c9a84c] text-black border-[#c9a84c]"
                            : isDark ? "bg-black/60 text-[#c9a84c] border-white/10" : "bg-stone-100 text-stone-700 border-stone-200"
                        }`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span className={`text-xs font-serif font-bold group-hover:text-[#c9a84c] transition-colors ${
                          isDark ? "text-white" : "text-stone-900"
                        }`}>
                          {tool.label}
                        </span>
                      </div>

                      {isCached ? (
                        <span className="flex items-center gap-1 text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-1.5 py-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          PRÊT
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono text-neutral-500 px-1.5 py-0.5 border border-transparent">
                          {tool.icon}
                        </span>
                      )}
                    </div>

                    {/* Tool Description */}
                    <p className={`text-[11px] font-sans leading-relaxed line-clamp-2 ${
                      isDark ? "text-neutral-400" : "text-stone-600"
                    }`}>
                      {tool.description}
                    </p>
                  </div>

                  {/* Footer Action */}
                  <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono font-bold">
                    <span className="text-neutral-500">{tool.cat.split(":")[0]}</span>
                    <span className="text-[#c9a84c] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      {isCached ? "Consulter" : "Lancer"} →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className={`p-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0 ${
          isDark ? "bg-black/80 border-white/10" : "bg-stone-50 border-stone-200"
        }`}>
          <span className={`text-xs font-sans ${isDark ? "text-neutral-400" : "text-stone-600"}`}>
            💡 Astuce : Les 16 analyses peuvent être exécutées individuellement ou générées en un clic via le Diagnostic Intégral.
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 border text-xs font-mono font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
