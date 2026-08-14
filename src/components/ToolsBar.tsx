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
  Sparkles
} from "lucide-react";

interface ToolsBarProps {
  activeToolId: string;
  onSelectTool: (id: string) => void;
  cache: Record<string, any>;
  theme?: "dark-gold" | "light";
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

export default function ToolsBar({ activeToolId, onSelectTool, cache, theme = "dark-gold" }: ToolsBarProps) {
  const [selectedPhase, setSelectedPhase] = useState<string>("all");
  const isDark = theme === "dark-gold";

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
      {/* Phase Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b pb-3 border-white/10">
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
          Tous les Modules (16)
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
                    <button
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

                      {isCached && (
                        <span className={`text-[8px] font-sans font-black tracking-widest block mt-1 leading-none transition-all ${
                          isActive
                            ? isDark ? "text-[#c9a84c]" : "text-[#9c7d2b]"
                            : "text-emerald-500/80"
                        }`}>
                          ✓ FAIT
                        </span>
                      )}
                    </button>
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
              <button
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

                {isCached && (
                  <span className={`text-[8px] font-sans font-black tracking-widest block mt-1.5 leading-none transition-all ${
                    isActive
                      ? isDark ? "text-[#c9a84c]" : "text-[#9c7d2b]"
                      : "text-emerald-500/70"
                  }`}>
                    ✓ FAIT
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
