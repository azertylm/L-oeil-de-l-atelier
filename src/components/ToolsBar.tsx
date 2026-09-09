/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Tool } from "../types.js";
import { TOOLS, CATEGORIES } from "../data.js";
import {
  Search,
  Palette,
  Layers,
  Feather,
  Compass,
  DollarSign,
  Award,
  Home,
  Type,
  Library,
  FileText,
  Wine,
  Share2,
  Scroll,
  Zap,
  PenTool,
  Sparkles,
  Lock,
  RefreshCw,
  Crown,
  CheckCircle2,
  Loader2
} from "lucide-react";

interface ToolsBarProps {
  activeToolId: string;
  onSelectTool: (id: string) => void;
  cache: Record<string, any>;
  theme?: "dark-gold" | "light";
  isSubscribed?: boolean;
  onRunAllAnalyses?: () => void;
  onOpenSubscriptionModal?: () => void;
  onOpenGalleryBridge?: () => void;
  onOpenVernissageModal?: () => void;
  onOpenCollectorSales?: () => void;
  onOpenPressSocial?: () => void;
  batchProgress?: { current: number; total: number; currentToolName: string } | null;
  onRerunTool?: (id: string) => void;
}

// Map tool IDs to Lucide components
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

// Short caps display labels
const labelMap: Record<string, string> = {
  style: "STYLE",
  palette: "PALETTE",
  technique: "TECHNIQUE",
  critique: "CRITIQUE",
  conseils: "CONSEILS",
  prix: "ESTIMATION",
  certificat: "CERTIFICAT",
  decor: "SITUATION",
  titres: "TITRES",
  artistes: "ARTISTES",
  expo: "TEXTE EXPO",
  vernissage: "VERNISSAGE",
  reseaux: "RÉSEAUX",
  statement: "DÉMARCHE",
  inspiration: "PISTES",
  poesie: "POÉSIE"
};

export default function ToolsBar({ 
  activeToolId, 
  onSelectTool, 
  cache, 
  theme = "dark-gold",
  isSubscribed = false,
  onRunAllAnalyses,
  onOpenSubscriptionModal,
  onOpenGalleryBridge,
  onOpenVernissageModal,
  onOpenCollectorSales,
  onOpenPressSocial,
  batchProgress,
  onRerunTool
}: ToolsBarProps) {
  const [selectedPhase, setSelectedPhase] = useState<string>("all");
  const isDark = theme === "dark-gold";

  // Completed count
  const completedCount = TOOLS.filter(t => !!cache[t.id]).length;

  // Group tools by category
  const toolsByPhase = CATEGORIES.map((cat) => ({
    category: cat,
    tools: TOOLS.filter((t) => t.cat === cat)
  }));

  const filteredTools = selectedPhase === "all" 
    ? TOOLS 
    : TOOLS.filter(t => t.cat === selectedPhase);

  return (
    <div className="space-y-5">
      
      {/* Premium All-in-One Analysis Feature Banner / Button */}
      <div className={`p-3.5 sm:p-4 border transition-all duration-300 relative overflow-hidden ${
        isDark 
          ? isSubscribed ? "bg-gradient-to-r from-black via-[#16140e] to-black border-[#c9a84c]/50" : "bg-[#141414] border-white/10"
          : isSubscribed ? "bg-gradient-to-r from-[#faf6eb] via-white to-[#faf6eb] border-[#c9a84c]" : "bg-stone-50 border-stone-200"
      }`}>
        {/* Ambient Top Glow */}
        {isSubscribed && (
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 border ${
                isSubscribed 
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" 
                  : "bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/30"
              }`}>
                {isSubscribed ? "PRO ACTIVÉ" : "OFFRE ABONNEMENT"}
              </span>
              <span className={`text-xs font-serif font-bold ${isDark ? "text-white" : "text-stone-900"}`}>
                Diagnostic Intégral de l'Œuvre (16/16)
              </span>
            </div>
            
            <p className={`text-[11px] font-sans ${isDark ? "text-neutral-400" : "text-stone-600"}`}>
              {isSubscribed 
                ? `${completedCount}/16 analyses effectuées pour cette œuvre.`
                : "Lancez toutes les recherches en une seule fois (Compris dans l'abonnement à 3 €/mois ou 20 €/an)."
              }
            </p>
          </div>

          {/* Action Button: Locked or Unlocked */}
          <div>
            {!isSubscribed ? (
              <button
                type="button"
                onClick={onOpenSubscriptionModal}
                className={`w-full sm:w-auto px-4 py-2.5 text-xs font-sans font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 border shadow-md ${
                  isDark
                    ? "bg-black/60 hover:bg-[#c9a84c] text-neutral-300 hover:text-black border-[#c9a84c]/40 hover:border-[#c9a84c]"
                    : "bg-white hover:bg-[#c9a84c] text-stone-800 hover:text-black border-stone-300 hover:border-[#c9a84c]"
                }`}
                title="Débloquer l'analyse simultanée de tous les 16 modules"
              >
                <Lock className="w-3.5 h-3.5 text-[#c9a84c]" />
                <span>Lancer tout en 1 clic</span>
                <span className="text-[9px] font-mono bg-[#c9a84c] text-black px-1.5 py-0.2 font-black">
                  VERROUILLÉ
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onRunAllAnalyses}
                disabled={!!batchProgress}
                className={`w-full sm:w-auto px-4 py-2.5 text-xs font-sans font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 border-none shadow-lg ${
                  batchProgress
                    ? "bg-neutral-800 text-neutral-400 cursor-not-allowed"
                    : isDark
                      ? "bg-[#c9a84c] hover:bg-white text-black"
                      : "bg-stone-900 hover:bg-[#c9a84c] text-white hover:text-black"
                }`}
              >
                {batchProgress ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#c9a84c]" />
                    <span>{batchProgress.current}/{batchProgress.total} en cours…</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Lancer les 16 recherches</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar during Batch Analysis */}
        {batchProgress && (
          <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5 animate-fadeIn">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-[#c9a84c] font-bold truncate">
                {batchProgress.currentToolName}
              </span>
              <span className="text-neutral-400">
                {Math.round((batchProgress.current / batchProgress.total) * 100)}% ({batchProgress.current}/{batchProgress.total})
              </span>
            </div>
            <div className="w-full h-1.5 bg-neutral-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#9c7d2b] to-[#c9a84c] transition-all duration-300"
                style={{ width: `${(batchProgress.current / batchProgress.total) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 4 Dedicated Strategic Launchers (Passerelle, Vernissages, Ventes, Presse) */}
      {(onOpenGalleryBridge || onOpenVernissageModal || onOpenCollectorSales || onOpenPressSocial) && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between pb-1 border-b border-[#c9a84c]/20">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#c9a84c]">
              4 Pôles Métiers & Marché de l'Art (20 Outils Stratégiques)
            </span>
          </div>

          {onOpenGalleryBridge && (
            <div 
              onClick={onOpenGalleryBridge}
              className={`p-3.5 sm:p-4 border flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-all duration-300 shadow-md ${
                isDark 
                  ? "bg-[#0d0d0d] hover:bg-[#141414] border-[#c9a84c] text-white" 
                  : "bg-amber-50/70 hover:bg-amber-100/70 border-[#c9a84c] text-black"
              }`}
            >
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center bg-[#c9a84c] text-black font-black text-sm flex-shrink-0">
                  🏛️
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs sm:text-sm font-serif font-bold tracking-wide">
                      Passerelle Galeries & Prospection Artistique
                    </span>
                    <span className="text-[9px] font-mono bg-[#c9a84c] text-black font-black px-1.5 py-0.5 uppercase">
                      5 Outils Galeries
                    </span>
                  </div>
                  <p className={`text-[11px] sm:text-xs font-sans mt-0.5 ${isDark ? "text-neutral-300" : "text-stone-700"}`}>
                    Curator Matchmaking, Dossier de Candidature, Bourse aux Murs, Contrat de Dépôt, Salons & Prix.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="px-4 py-2 bg-[#c9a84c] hover:bg-white text-black font-mono font-black text-xs uppercase tracking-wider transition-colors flex-shrink-0 shadow-sm self-end sm:self-center"
              >
                Ouvrir la Passerelle →
              </button>
            </div>
          )}

          {onOpenVernissageModal && (
            <div 
              onClick={onOpenVernissageModal}
              className={`p-3.5 sm:p-4 border flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-all duration-300 shadow-md ${
                isDark 
                  ? "bg-[#0d0d0d] hover:bg-[#141414] border-[#c9a84c] text-white" 
                  : "bg-amber-50/70 hover:bg-amber-100/70 border-[#c9a84c] text-black"
              }`}
            >
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center bg-[#c9a84c] text-black font-black text-sm flex-shrink-0">
                  🥂
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs sm:text-sm font-serif font-bold tracking-wide">
                      Soirées de Vernissage & Expérience Visiteur
                    </span>
                    <span className="text-[9px] font-mono bg-[#c9a84c] text-black font-black px-1.5 py-0.5 uppercase">
                      5 Outils Événements
                    </span>
                  </div>
                  <p className={`text-[11px] sm:text-xs font-sans mt-0.5 ${isDark ? "text-neutral-300" : "text-stone-700"}`}>
                    QR Cartel Connecté & Audioguide, Invitations VIP & RSVP, Livre d'Or, Traiteur & Scénographie 2D.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="px-4 py-2 bg-[#c9a84c] hover:bg-white text-black font-mono font-black text-xs uppercase tracking-wider transition-colors flex-shrink-0 shadow-sm self-end sm:self-center"
              >
                Ouvrir les Vernissages →
              </button>
            </div>
          )}

          {onOpenCollectorSales && (
            <div 
              onClick={onOpenCollectorSales}
              className={`p-3.5 sm:p-4 border flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-all duration-300 shadow-md ${
                isDark 
                  ? "bg-[#0d0d0d] hover:bg-[#141414] border-[#c9a84c] text-white" 
                  : "bg-amber-50/70 hover:bg-amber-100/70 border-[#c9a84c] text-black"
              }`}
            >
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center bg-[#c9a84c] text-black font-black text-sm flex-shrink-0">
                  💼
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs sm:text-sm font-serif font-bold tracking-wide">
                      Ventes Privées, Collectionneurs & Sécurisation Financière
                    </span>
                    <span className="text-[9px] font-mono bg-[#c9a84c] text-black font-black px-1.5 py-0.5 uppercase">
                      5 Outils Ventes
                    </span>
                  </div>
                  <p className={`text-[11px] sm:text-xs font-sans mt-0.5 ${isDark ? "text-neutral-300" : "text-stone-700"}`}>
                    Portrait-robot des acheteurs, simulateur défiscalisation (Art. 238 bis AB CGI), facture & décret Marcus, salon VIP.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="px-4 py-2 bg-[#c9a84c] hover:bg-white text-black font-mono font-black text-xs uppercase tracking-wider transition-colors flex-shrink-0 shadow-sm self-end sm:self-center"
              >
                Ouvrir les Ventes →
              </button>
            </div>
          )}

          {onOpenPressSocial && (
            <div 
              onClick={onOpenPressSocial}
              className={`p-3.5 sm:p-4 border flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-all duration-300 shadow-md ${
                isDark 
                  ? "bg-[#0d0d0d] hover:bg-[#141414] border-[#c9a84c] text-white" 
                  : "bg-amber-50/70 hover:bg-amber-100/70 border-[#c9a84c] text-black"
              }`}
            >
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center bg-[#c9a84c] text-black font-black text-sm flex-shrink-0">
                  📣
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs sm:text-sm font-serif font-bold tracking-wide">
                      Presse, Médias, Réseaux Sociaux & Bourses de Création
                    </span>
                    <span className="text-[9px] font-mono bg-[#c9a84c] text-black font-black px-1.5 py-0.5 uppercase">
                      5 Outils Médias
                    </span>
                  </div>
                  <p className={`text-[11px] sm:text-xs font-sans mt-0.5 ${isDark ? "text-neutral-300" : "text-stone-700"}`}>
                    Communiqué de presse muséal, scripts Reels TikTok d'atelier, SEO Google & Wikidata, Newsletter storytelling et dossiers DRAC/CNAP.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="px-4 py-2 bg-[#c9a84c] hover:bg-white text-black font-mono font-black text-xs uppercase tracking-wider transition-colors flex-shrink-0 shadow-sm self-end sm:self-center"
              >
                Ouvrir Médias →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Phase Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b pb-3 border-white/10 items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedPhase("all")}
            className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider font-bold transition-all ${
              selectedPhase === "all"
                ? isDark 
                  ? "bg-[#c9a84c] text-black" 
                  : "bg-stone-900 text-white"
                : isDark
                  ? "bg-white/5 text-neutral-400 hover:text-white"
                  : "bg-stone-100 text-stone-600 hover:text-stone-900"
            }`}
          >
            Tous les Modules ({completedCount}/16)
          </button>

          {CATEGORIES.map((cat, idx) => {
            const isActive = selectedPhase === cat;
            const shortName = `Phase ${idx + 1}`;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedPhase(cat)}
                className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider font-bold transition-all flex items-center gap-1 ${
                  isActive
                    ? isDark 
                      ? "bg-[#c9a84c] text-black" 
                      : "bg-[#c9a84c] text-black"
                    : isDark
                      ? "bg-white/5 text-neutral-400 hover:text-white"
                      : "bg-stone-100 text-stone-600 hover:text-stone-900"
                }`}
              >
                <span>{shortName}</span>
              </button>
            );
          })}
        </div>

        {/* Global summary badge */}
        <span className="text-[10px] font-mono text-neutral-500 hidden sm:inline">
          Sélectionnez un outil pour voir ou relancer
        </span>
      </div>

      {/* If "all" is selected, render grouped sections by Phase */}
      {selectedPhase === "all" ? (
        <div className="space-y-6">
          {toolsByPhase.map((phase, pIdx) => (
            <div key={phase.category} className="space-y-2.5">
              <div className="flex items-center gap-2 border-b pb-1.5 border-white/5">
                <span className="w-4 h-4 rounded-full bg-[#c9a84c] text-black font-mono font-bold text-[9px] flex items-center justify-center flex-shrink-0">
                  {pIdx + 1}
                </span>
                <h4 className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#c9a84c]">
                  {phase.category}
                </h4>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {phase.tools.map((tool) => {
                  const isActive = activeToolId === tool.id;
                  const isCached = !!cache[tool.id];
                  const IconComponent = iconMap[tool.id] || Search;
                  const displayLabel = labelMap[tool.id] || tool.label.toUpperCase();

                  return (
                    <div
                      key={tool.id}
                      onClick={() => onSelectTool(tool.id)}
                      title={tool.description}
                      className={`p-3 rounded-none border text-center transition-all duration-300 relative flex flex-col items-center justify-center min-h-[90px] cursor-pointer group ${
                        isActive
                          ? isDark
                            ? "bg-[#0E0E0E] border-[#c9a84c] text-[#c9a84c] shadow-[0_0_15px_rgba(201,168,76,0.15)]"
                            : "bg-white border-[#c9a84c] text-[#9c7d2b] shadow-[0_2px_12px_rgba(156,125,43,0.15)] font-bold"
                          : isDark
                            ? "bg-black border-white/5 text-neutral-500 hover:border-white/20 hover:text-neutral-300"
                            : "bg-[#FAF7F2] border-stone-200 text-stone-600 hover:border-[#c9a84c]/50 hover:text-stone-900"
                      }`}
                    >
                      <IconComponent 
                        className={`w-4 h-4 mb-2 transition-transform duration-300 group-hover:scale-110 ${
                          isActive
                            ? isDark ? "text-[#c9a84c]" : "text-[#9c7d2b]"
                            : isDark ? "text-neutral-600 group-hover:text-[#c9a84c]/80" : "text-stone-400 group-hover:text-stone-600"
                        }`}
                      />

                      <span className={`text-[9px] font-sans font-bold tracking-[0.12em] block leading-tight transition-colors duration-300 ${
                        isActive
                          ? isDark ? "text-[#c9a84c]" : "text-[#9c7d2b]"
                          : isDark ? "text-neutral-400" : "text-stone-700"
                      }`}>
                        {displayLabel}
                      </span>

                      {/* Status indicator & Relance icon */}
                      <div className="flex items-center gap-1 mt-1">
                        {isCached ? (
                          <span className={`text-[8px] font-sans font-black tracking-widest block leading-none transition-all ${
                            isActive
                              ? isDark ? "text-[#c9a84c]" : "text-[#9c7d2b]"
                              : "text-emerald-500/80"
                          }`}>
                            ✓ FAIT
                          </span>
                        ) : (
                          <span className="text-[8px] font-sans text-neutral-500">
                            À FAIRE
                          </span>
                        )}

                        {onRerunTool && isCached && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRerunTool(tool.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-[#c9a84c] text-neutral-400 transition-opacity ml-1"
                            title="Relancer cette recherche"
                          >
                            <RefreshCw className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Render filtered category grid */
        <div className="grid grid-cols-3 gap-3">
          {filteredTools.map((tool) => {
            const isActive = activeToolId === tool.id;
            const isCached = !!cache[tool.id];
            const IconComponent = iconMap[tool.id] || Search;
            const displayLabel = labelMap[tool.id] || tool.label.toUpperCase();

            return (
              <div
                key={tool.id}
                onClick={() => onSelectTool(tool.id)}
                title={tool.description}
                className={`p-4 rounded-none border text-center transition-all duration-300 relative flex flex-col items-center justify-center min-h-[95px] cursor-pointer group ${
                  isActive
                    ? isDark
                      ? "bg-[#0E0E0E] border-[#c9a84c] text-[#c9a84c] shadow-[0_0_15px_rgba(201,168,76,0.1)]"
                      : "bg-white border-[#c9a84c] text-[#9c7d2b] shadow-[0_2px_12px_rgba(156,125,43,0.1)] font-bold"
                    : isDark
                      ? "bg-black border-white/5 text-neutral-500 hover:border-white/20 hover:text-neutral-300"
                      : "bg-[#FAF7F2] border-stone-200 text-stone-600 hover:border-[#c9a84c]/50 hover:text-stone-900"
                }`}
              >
                <IconComponent 
                  className={`w-5 h-5 mb-2.5 transition-transform duration-300 group-hover:scale-110 ${
                    isActive
                      ? isDark ? "text-[#c9a84c]" : "text-[#9c7d2b]"
                      : isDark ? "text-neutral-600 group-hover:text-[#c9a84c]/80" : "text-stone-400 group-hover:text-stone-600"
                  }`}
                />

                <span className={`text-[10px] font-sans font-bold tracking-[0.15em] block leading-none transition-colors duration-300 ${
                  isActive
                    ? isDark ? "text-[#c9a84c]" : "text-[#9c7d2b]"
                    : isDark ? "text-neutral-400" : "text-stone-700"
                }`}>
                  {displayLabel}
                </span>

                {/* Status indicator & Relance icon */}
                <div className="flex items-center gap-1 mt-1.5">
                  {isCached ? (
                    <span className={`text-[8px] font-sans font-black tracking-widest block leading-none transition-all ${
                      isActive
                        ? isDark ? "text-[#c9a84c]" : "text-[#9c7d2b]"
                        : "text-emerald-500/70"
                    }`}>
                      ✓ FAIT
                    </span>
                  ) : (
                    <span className="text-[8px] font-sans text-neutral-500">
                      À FAIRE
                    </span>
                  )}

                  {onRerunTool && isCached && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRerunTool(tool.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-[#c9a84c] text-neutral-400 transition-opacity ml-1"
                      title="Relancer cette recherche"
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
