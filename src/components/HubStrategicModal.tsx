/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { X, Layers, Sparkles, Building2, PartyPopper, Briefcase, Radio, ArrowRight, QrCode, Tag } from "lucide-react";
import { TOOLS } from "../data.js";

interface HubStrategicModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: "dark-gold" | "light";
  onOpenArtworkTools: () => void;
  onOpenGalleryBridge: () => void;
  onOpenVernissageModal: () => void;
  onOpenCollectorSales: () => void;
  onOpenPressSocial: () => void;
  onOpenQrSalesModal?: () => void;
  onSelectTool: (toolId: string) => void;
  activeToolId: string;
  cache: Record<string, any>;
}

export default function HubStrategicModal({
  isOpen,
  onClose,
  theme,
  onOpenArtworkTools,
  onOpenGalleryBridge,
  onOpenVernissageModal,
  onOpenCollectorSales,
  onOpenPressSocial,
  onOpenQrSalesModal,
  onSelectTool,
  activeToolId,
  cache
}: HubStrategicModalProps) {
  if (!isOpen) return null;

  const isDark = theme === "dark-gold";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div 
        className={`w-full max-w-5xl max-h-[92vh] flex flex-col border shadow-2xl rounded-none overflow-hidden transition-colors ${
          isDark ? "bg-[#0d0d0d] border-[#c9a84c] text-white" : "bg-white border-stone-300 text-stone-900"
        }`}
      >
        {/* Header */}
        <div className={`p-4 sm:p-5 flex items-center justify-between border-b ${
          isDark ? "border-white/10 bg-black/60" : "border-stone-200 bg-stone-50"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 flex items-center justify-center border ${
              isDark ? "bg-[#c9a84c]/20 border-[#c9a84c] text-[#c9a84c]" : "bg-amber-100 border-[#c9a84c] text-[#9c7d2b]"
            }`}>
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base sm:text-lg tracking-wide uppercase">
                  Hub Stratégique • 5 Pôles & 36 Outils d'Art
                </h3>
                <span className="text-[10px] font-mono bg-[#c9a84c] text-black font-black px-2 py-0.5 uppercase">
                  Écosystème Métiers
                </span>
              </div>
              <p className={`text-xs font-sans mt-0.5 ${isDark ? "text-neutral-400" : "text-stone-500"}`}>
                Accédez directement aux 16 expertises d'atelier et aux 4 passerelles professionnelles.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`p-2 transition-colors ${
              isDark ? "text-neutral-400 hover:text-white hover:bg-white/10" : "text-stone-500 hover:text-black hover:bg-stone-200"
            }`}
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Nouveau Banner Tripartite : Cartels & QR de Vente Directe */}
          {onOpenQrSalesModal && (
            <div 
              role="button"
              tabIndex={0}
              onClick={() => {
                onClose();
                onOpenQrSalesModal();
              }}
              className={`p-4 border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition-all hover:border-white shadow-lg ${
                isDark 
                  ? "bg-gradient-to-r from-[#17140b] via-[#241d0e] to-[#121008] border-[#c9a84c] text-white" 
                  : "bg-gradient-to-r from-amber-100 via-amber-50 to-white border-[#c9a84c] text-black"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 flex items-center justify-center bg-[#c9a84c] text-black font-black text-lg flex-shrink-0 shadow-md">
                  🏷️
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-serif font-bold text-sm sm:text-base uppercase tracking-wide">
                      Passerelle Artistes • Galeristes • Visiteurs
                    </h4>
                    <span className="text-[10px] font-mono bg-emerald-600 text-white font-bold px-2 py-0.5 uppercase">
                      Cartels & QR Vente
                    </span>
                    <span className="text-[10px] font-mono bg-[#c9a84c] text-black font-black px-2 py-0.5 uppercase">
                      50 Innovations
                    </span>
                  </div>
                  <p className={`text-xs font-sans mt-1 ${isDark ? "text-neutral-300" : "text-stone-700"}`}>
                    Générez des cartels muraux prêts à imprimer avec QR codes de vente, audioguide vocal pour les visiteurs et options d'achat discrètes.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="px-5 py-2.5 bg-[#c9a84c] hover:bg-white text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors flex-shrink-0 shadow-md self-end sm:self-center"
              >
                Ouvrir le Module QR & Cartels →
              </button>
            </div>
          )}

          {/* 5 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {/* Pôle 1 : Atelier */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => {
                onClose();
                onOpenArtworkTools();
              }}
              className={`p-4 border text-left flex flex-col justify-between transition-all group hover:border-[#c9a84c] cursor-pointer ${
                isDark ? "bg-black/60 border-white/10 text-white" : "bg-stone-50 border-stone-200 text-stone-900"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">🎨</span>
                  <span className="text-[9px] font-mono bg-[#c9a84c] text-black font-black px-1.5 py-0.5">
                    16 OUTILS
                  </span>
                </div>
                <h4 className="text-xs font-serif font-bold uppercase group-hover:text-[#c9a84c]">
                  Outils d'Atelier
                </h4>
                <p className={`text-[11px] font-sans mt-1 leading-relaxed ${isDark ? "text-neutral-400" : "text-stone-600"}`}>
                  Cotation financière, palette, certificat COA, cartel d'exposition, poésie & analyse plastique.
                </p>
              </div>
              <div className="text-[10px] font-mono font-bold text-[#c9a84c] mt-3 flex items-center gap-1">
                <span>Ouvrir l'Atelier</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Pôle 2 : Galeries */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => {
                onClose();
                onOpenGalleryBridge();
              }}
              className={`p-4 border text-left flex flex-col justify-between transition-all group hover:border-[#c9a84c] cursor-pointer ${
                isDark ? "bg-black/60 border-white/10 text-white" : "bg-stone-50 border-stone-200 text-stone-900"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">🏛️</span>
                  <span className="text-[9px] font-mono bg-[#c9a84c] text-black font-black px-1.5 py-0.5">
                    5 OUTILS
                  </span>
                </div>
                <h4 className="text-xs font-serif font-bold uppercase group-hover:text-[#c9a84c]">
                  Passerelle Galeries
                </h4>
                <p className={`text-[11px] font-sans mt-1 leading-relaxed ${isDark ? "text-neutral-400" : "text-stone-600"}`}>
                  Dossier de candidature, ciblage galeries, bourse aux murs & lettre au directeur.
                </p>
              </div>
              <div className="text-[10px] font-mono font-bold text-[#c9a84c] mt-3 flex items-center gap-1">
                <span>Ouvrir Galeries</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Pôle 3 : Vernissages */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => {
                onClose();
                onOpenVernissageModal();
              }}
              className={`p-4 border text-left flex flex-col justify-between transition-all group hover:border-[#c9a84c] cursor-pointer ${
                isDark ? "bg-black/60 border-white/10 text-white" : "bg-stone-50 border-stone-200 text-stone-900"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">🥂</span>
                  <span className="text-[9px] font-mono bg-[#c9a84c] text-black font-black px-1.5 py-0.5">
                    5 OUTILS
                  </span>
                </div>
                <h4 className="text-xs font-serif font-bold uppercase group-hover:text-[#c9a84c]">
                  Soirées & Vernissages
                </h4>
                <p className={`text-[11px] font-sans mt-1 leading-relaxed ${isDark ? "text-neutral-400" : "text-stone-600"}`}>
                  Scénographie, rétroplanning d'accrochage, cartons d'invitation VIP & discours.
                </p>
              </div>
              <div className="text-[10px] font-mono font-bold text-[#c9a84c] mt-3 flex items-center gap-1">
                <span>Ouvrir Vernissages</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Pôle 4 : Ventes & Collectionneurs */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => {
                onClose();
                onOpenCollectorSales();
              }}
              className={`p-4 border text-left flex flex-col justify-between transition-all group hover:border-[#c9a84c] cursor-pointer ${
                isDark ? "bg-black/60 border-white/10 text-white" : "bg-stone-50 border-stone-200 text-stone-900"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">💼</span>
                  <span className="text-[9px] font-mono bg-[#c9a84c] text-black font-black px-1.5 py-0.5">
                    5 OUTILS
                  </span>
                </div>
                <h4 className="text-xs font-serif font-bold uppercase group-hover:text-[#c9a84c]">
                  Ventes Privées
                </h4>
                <p className={`text-[11px] font-sans mt-1 leading-relaxed ${isDark ? "text-neutral-400" : "text-stone-600"}`}>
                  Fiches d'offres privées, pitchs de vente, défiscalisation mécénat Art 238 bis.
                </p>
              </div>
              <div className="text-[10px] font-mono font-bold text-[#c9a84c] mt-3 flex items-center gap-1">
                <span>Ouvrir Ventes</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Pôle 5 : Presse & Réseaux */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => {
                onClose();
                onOpenPressSocial();
              }}
              className={`p-4 border text-left flex flex-col justify-between transition-all group hover:border-[#c9a84c] cursor-pointer ${
                isDark ? "bg-black/60 border-white/10 text-white" : "bg-stone-50 border-stone-200 text-stone-900"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">📣</span>
                  <span className="text-[9px] font-mono bg-[#c9a84c] text-black font-black px-1.5 py-0.5">
                    5 OUTILS
                  </span>
                </div>
                <h4 className="text-xs font-serif font-bold uppercase group-hover:text-[#c9a84c]">
                  Presse & Réseaux
                </h4>
                <p className={`text-[11px] font-sans mt-1 leading-relaxed ${isDark ? "text-neutral-400" : "text-stone-600"}`}>
                  Communiqués muséaux, scripts Reels/TikTok et dossiers de subventions DRAC/CNAP.
                </p>
              </div>
              <div className="text-[10px] font-mono font-bold text-[#c9a84c] mt-3 flex items-center gap-1">
                <span>Ouvrir Médias</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Direct chips for the 16 workshop tools */}
          <div className="pt-4 border-t border-[#c9a84c]/20">
            <h5 className="text-xs font-mono uppercase tracking-wider text-[#c9a84c] font-black mb-3">
              ⚡ Lancement direct des 16 Outils d'Atelier :
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
              {TOOLS.map((tool) => {
                const isSelected = activeToolId === tool.id;
                const isReady = !!cache[tool.id];

                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => {
                      onClose();
                      onSelectTool(tool.id);
                    }}
                    title={tool.description}
                    className={`px-2.5 py-2 border text-left flex items-center justify-between gap-1 transition-all text-[11px] font-mono ${
                      isSelected
                        ? "bg-[#c9a84c] text-black border-[#c9a84c] font-bold shadow-sm"
                        : isReady
                        ? isDark
                          ? "bg-[#161616] text-amber-200 border-[#c9a84c]/40 hover:border-[#c9a84c]"
                          : "bg-white text-amber-900 border-[#c9a84c]/40 hover:border-[#c9a84c]"
                        : isDark
                        ? "bg-black/60 text-neutral-400 border-white/10 hover:text-white hover:border-[#c9a84c]/60"
                        : "bg-white text-stone-600 border-stone-200 hover:text-black hover:border-[#c9a84c]"
                    }`}
                  >
                    <span className="truncate">{tool.label}</span>
                    {isReady && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex items-center justify-end ${
          isDark ? "border-white/10 bg-black/60" : "border-stone-200 bg-stone-50"
        }`}>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#c9a84c] hover:bg-white text-black font-bold uppercase tracking-wider text-xs transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
