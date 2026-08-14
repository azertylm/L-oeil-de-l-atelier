/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Copy, Check, Palette as PaletteIcon, Award, Sparkles, BookOpen, 
  MapPin, TrendingUp, HelpCircle, CheckCircle, Quote, FileText, 
  ShieldCheck, Share2, Compass, AlertCircle, Eye, Calendar, Trash2, X,
  Maximize2, ArrowRight, Layers, Sliders, Layout, RefreshCw, Printer
} from "lucide-react";

interface ResultsPanelProps {
  toolId: string;
  result: any;
  isLoading: boolean;
  artistName: string;
  theme?: "dark-gold" | "light";
  previewUrl?: string | null;
}

export default function ResultsPanel({ 
  toolId, 
  result, 
  isLoading, 
  artistName, 
  theme = "dark-gold",
  previewUrl 
}: ResultsPanelProps) {
  const [copied, setCopied] = useState<string | null>(null);
  
  // Custom states for visualization enhancements
  const [selectedRoom, setSelectedRoom] = useState<"haussmann" | "loft" | "zen">("haussmann");
  const [selectedFrame, setSelectedFrame] = useState<"gold" | "black" | "oak">("gold");
  const [certPaperColor, setCertPaperColor] = useState<"parchment" | "white" | "ivory">("parchment");

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopyAllJson = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied("all-json");
    setTimeout(() => setCopied(null), 2000);
  };

  const handlePrintCertificate = () => {
    const printContent = document.getElementById("certificate-printable-area");
    if (!printContent) return;
    
    // Open a temporary print frame or just trigger print on window.
    // For general compatibility, we tell the user how to print or offer standard print window.
    window.print();
  };

  if (isLoading) {
    return (
      <div className={`flex flex-col items-center justify-center py-20 min-h-[450px] relative rounded-none border transition-colors duration-300 ${
        theme === "dark-gold" ? "bg-[#111111] border-white/10" : "bg-white border-[#e8dfd3]"
      }`}>
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#c9a84c]" />
        
        {/* Animated radar-like scanner lines for artistic effect */}
        <div className="relative mb-6">
          <div className="w-16 h-16 border-2 border-[#c9a84c]/20 border-t-[#c9a84c] rounded-full animate-spin" />
          <div className="absolute inset-2 border border-dashed border-[#c9a84c]/30 rounded-full animate-pulse" />
        </div>
        
        <p className={`font-sans font-bold text-sm tracking-widest uppercase animate-pulse ${
          theme === "dark-gold" ? "text-[#c9a84c]" : "text-[#9c7d2b]"
        }`}>
          ŒIL_ATELIER EN OBSERVATION…
        </p>
        <p className={`text-[11px] mt-2.5 text-center max-w-xs px-4 font-sans tracking-wide leading-relaxed ${
          theme === "dark-gold" ? "text-neutral-400" : "text-stone-500"
        }`}>
          Formulation de l'analyse esthétique, technique et historique par l'intelligence artificielle.
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className={`flex flex-col items-center justify-center py-24 min-h-[450px] text-center px-6 rounded-none border transition-colors duration-300 ${
        theme === "dark-gold" ? "bg-[#111111] border-white/10" : "bg-white border-[#e8dfd3]"
      }`}>
        <Compass className="w-10 h-10 text-neutral-500 mb-4 stroke-[1.2] animate-bounce" />
        <p className={`font-sans uppercase font-bold tracking-[0.2em] text-sm ${
          theme === "dark-gold" ? "text-neutral-300" : "text-stone-700"
        }`}>Aucune analyse active</p>
        <p className="text-xs text-neutral-500 mt-2.5 max-w-xs leading-relaxed font-sans">
          Sélectionnez l'un des 16 outils professionnels de l'Atelier ci-dessous et laissez l'œil opérer sa magie.
        </p>
      </div>
    );
  }

  // Color helpers
  const getGoldText = () => theme === "dark-gold" ? "text-[#c9a84c]" : "text-[#9c7d2b]";
  const getHeadingText = () => theme === "dark-gold" ? "text-white" : "text-stone-900";
  const getBodyText = () => theme === "dark-gold" ? "text-neutral-200" : "text-stone-800";
  const getMutedText = () => theme === "dark-gold" ? "text-neutral-400" : "text-stone-500";
  const getBgCard = () => theme === "dark-gold" ? "bg-black border border-white/10" : "bg-[#FAF7F2] border border-[#e8dfd3]";
  const getBorderColor = () => theme === "dark-gold" ? "border-white/10" : "border-stone-200";

  return (
    <div className={`p-6 sm:p-8 rounded-none relative min-h-[450px] shadow-2xl flex flex-col justify-between border transition-all duration-300 ${
      theme === "dark-gold" ? "bg-[#111111] border-white/10" : "bg-white border-[#e8dfd3]"
    }`}>
      {/* Top ambient gold line */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#c9a84c]" />

      {/* Copy Actions Header */}
      <div className={`flex justify-end gap-3 mb-6 border-b pb-4 ${getBorderColor()}`}>
        <button
          onClick={handleCopyAllJson}
          className={`flex items-center gap-1.5 px-3 py-1 border text-[10px] tracking-wider uppercase rounded-none transition-all duration-200 font-bold ${
            theme === "dark-gold"
              ? "bg-black hover:bg-neutral-900 text-neutral-400 hover:text-white border-white/10"
              : "bg-stone-50 hover:bg-stone-100 text-stone-600 hover:text-stone-900 border-stone-200"
          }`}
        >
          {copied === "all-json" ? (
            <>
              <Check className={`w-3 h-3 ${getGoldText()}`} />
              JSON Copié !
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              Copier les données brutes (JSON)
            </>
          )}
        </button>
      </div>

      {/* Content Rendering Zone */}
      <div className="flex-1">
        
        {/* TOOL 1: STYLE */}
        {toolId === "style" && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <p className={`text-[10px] tracking-[0.35em] uppercase font-sans font-bold ${getGoldText()}`}>Style Identifié</p>
              <h3 className={`text-2xl sm:text-3xl font-serif font-light tracking-tight uppercase mt-1.5 ${getHeadingText()}`}>
                {result.style || "Non déterminé"}
              </h3>
            </div>

            <div className={`space-y-4 text-sm leading-relaxed font-sans ${getMutedText()}`}>
              <p>
                <strong className={`uppercase tracking-wider text-[10px] block mb-1 font-bold ${getGoldText()}`}>Période ou Siècle :</strong>
                <span className={getBodyText()}>{result.periode || "Indéterminée"}</span>
              </p>
              
              <p>
                <strong className={`uppercase tracking-wider text-[10px] block mb-1 font-bold ${getGoldText()}`}>Analyse Esthétique :</strong>
                <span className={getBodyText()}>{result.description}</span>
              </p>

              {result.influences && (
                <p>
                  <strong className={`uppercase tracking-wider text-[10px] block mb-1 font-bold ${getGoldText()}`}>Courants & Influences :</strong>
                  <span className={`${getBodyText()} italic`}>{result.influences}</span>
                </p>
              )}
            </div>

            {result.mots_cles && result.mots_cles.length > 0 && (
              <div className={`pt-4 border-t ${getBorderColor()}`}>
                <p className={`text-[10px] tracking-[0.2em] uppercase font-sans mb-2.5 font-bold ${getMutedText()}`}>Mots-clés de l'œuvre</p>
                <div className="flex flex-wrap gap-2">
                  {result.mots_cles.map((word: string, i: number) => (
                    <span 
                      key={i} 
                      className={`text-[11px] font-mono border py-1 px-3 rounded-none transition-colors duration-200 ${
                        theme === "dark-gold"
                          ? "border-white/10 text-neutral-300 bg-black hover:border-[#c9a84c]/50 hover:text-[#c9a84c]"
                          : "border-stone-200 text-stone-700 bg-stone-50 hover:border-[#c9a84c]/50 hover:text-[#c9a84c]"
                      }`}
                    >
                      #{word}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TOOL 2: PALETTE (UPGRADED VISUALIZATION) */}
        {toolId === "palette" && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <p className={`text-[10px] tracking-[0.35em] uppercase font-sans font-bold ${getGoldText()}`}>Harmonie Chromatique</p>
              <h3 className={`text-2xl sm:text-3xl font-serif font-light tracking-tight uppercase mt-1.5 ${getHeadingText()}`}>
                {result.harmonie || "Analyse de Couleur"}
              </h3>
            </div>

            {/* Interactive Color Palette Swatches */}
            <div>
              <p className={`text-[10px] tracking-[0.2em] uppercase font-sans mb-3.5 font-bold ${getMutedText()}`}>
                Palette extraite (Cliquez pour copier la valeur HEX)
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {result.couleurs?.map((color: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => handleCopyText(color.hex, `hex-${idx}`)}
                    className={`flex flex-col items-center gap-2 group text-left p-2 rounded-none transition-all duration-300 relative overflow-hidden ${getBgCard()}`}
                  >
                    <div 
                      className="w-full h-16 rounded-none border border-black/30 relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                      style={{ backgroundColor: color.hex }}
                    >
                      <span className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        {copied === `hex-${idx}` ? (
                          <Check className="w-4 h-4 text-white drop-shadow-lg" />
                        ) : (
                          <Copy className="w-4 h-4 text-white opacity-80 drop-shadow-lg" />
                        )}
                      </span>
                    </div>
                    <span className={`text-[11px] font-mono font-bold group-hover:text-[#c9a84c] transition-colors ${
                      theme === "dark-gold" ? "text-neutral-300" : "text-stone-700"
                    }`}>
                      {color.hex}
                    </span>
                    <span className={`text-[11px] font-sans font-bold italic truncate w-full text-center ${
                      theme === "dark-gold" ? "text-white" : "text-stone-900"
                    }`}>
                      {color.nom}
                    </span>
                    <span className="text-[9px] text-neutral-500 uppercase tracking-wider text-center w-full leading-tight font-sans font-bold">
                      {color.role}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* UPGRADE: Seamless Color Distribution Signature Bar */}
            {result.couleurs && result.couleurs.length > 0 && (
              <div className={`p-4 rounded-none border ${getBorderColor()} ${theme === "dark-gold" ? "bg-black" : "bg-white"}`}>
                <span className={`text-[10px] uppercase tracking-wider block mb-2 font-bold ${getMutedText()}`}>
                  Empreinte Chromatique de l'Œuvre
                </span>
                <div className="h-6 w-full flex rounded-none overflow-hidden border border-black/20">
                  {result.couleurs.map((color: any, idx: number) => {
                    // Create simulated realistic distributions (e.g. primary takes most space)
                    const distribution = idx === 0 ? "40%" : idx === 1 ? "25%" : idx === 2 ? "18%" : idx === 3 ? "12%" : "5%";
                    return (
                      <div 
                        key={idx} 
                        style={{ backgroundColor: color.hex, width: distribution }}
                        className="h-full relative group cursor-pointer"
                        title={`${color.nom} (${color.hex}) - Rôle: ${color.role}`}
                      >
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-[9px] text-neutral-500 mt-1.5 font-mono">
                  <span>Dominante ({result.couleurs[0]?.hex})</span>
                  <span>Accents ({result.couleurs[result.couleurs.length-1]?.hex})</span>
                </div>
              </div>
            )}

            <div className={`space-y-4 text-sm leading-relaxed font-sans border-t pt-5 ${getBorderColor()}`}>
              <p>
                <strong className={`uppercase tracking-wider text-[10px] block mb-1 font-bold ${getGoldText()}`}>Ambiance Émotionnelle :</strong>
                <span className={getBodyText()}>{result.ambiance}</span>
              </p>

              <div className={`p-4 border-l-4 rounded-none ${
                theme === "dark-gold" ? "bg-black border-l-[#c9a84c] border-white/10" : "bg-[#FAF7F2] border-l-[#c9a84c] border-[#e8dfd3]"
              }`}>
                <strong className={`uppercase tracking-wider text-[10px] block mb-1 font-bold ${getGoldText()}`}>Conseil Chromatique :</strong>
                <p className={`text-xs italic ${getBodyText()}`}>{result.conseil}</p>
              </div>
            </div>
          </div>
        )}

        {/* TOOL 3: TECHNIQUE (UPGRADED PROCESS TIMELINE) */}
        {toolId === "technique" && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <p className={`text-[10px] tracking-[0.35em] uppercase font-sans font-bold ${getGoldText()}`}>Analyse de l'Artisanat</p>
              <h3 className={`text-2xl sm:text-3xl font-serif font-light tracking-tight uppercase mt-1.5 ${getHeadingText()}`}>
                Déconstruction Technique
              </h3>
            </div>

            <div className="space-y-6">
              {result.etapes_supposees && (
                <div>
                  <h4 className={`uppercase tracking-wider text-[10px] mb-4 flex items-center gap-2 font-bold ${getGoldText()}`}>
                    <Layers className="w-4 h-4" />
                    Étapes de Réalisation (Chronologie Supposée) :
                  </h4>
                  
                  {/* UPGRADE: Sleek vertical workshop timeline blueprint */}
                  <div className="relative border-l border-dashed border-[#c9a84c]/30 ml-3 pl-6 space-y-6">
                    {result.etapes_supposees.map((step: string, i: number) => (
                      <div key={i} className="relative group">
                        {/* Timeline node */}
                        <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border flex items-center justify-center transition-colors duration-300 ${
                          theme === "dark-gold" 
                            ? "bg-black border-[#c9a84c] text-[#c9a84c]" 
                            : "bg-white border-[#9c7d2b] text-[#9c7d2b]"
                        }`}>
                          <span className="text-[9px] font-mono font-bold">{i + 1}</span>
                        </div>
                        
                        <div className="space-y-1">
                          <span className={`text-[10px] font-mono tracking-wider block font-bold transition-colors ${getGoldText()}`}>
                            PHASE {i + 1}
                          </span>
                          <p className={`text-sm leading-relaxed ${getBodyText()}`}>
                            {step}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.mediums_alternatifs && (
                <div className={`border-t pt-5 ${getBorderColor()}`}>
                  <h4 className={`uppercase tracking-wider text-[10px] mb-3 flex items-center gap-2 font-bold ${getGoldText()}`}>
                    <Compass className={`w-4 h-4 ${getGoldText()}`} />
                    Médiums Alternatifs Suggérés :
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {result.mediums_alternatifs.map((m: string, i: number) => (
                      <div 
                        key={i} 
                        className={`p-2.5 rounded-none border text-xs font-sans flex items-center gap-2 ${
                          theme === "dark-gold" ? "bg-black/50 border-white/5 text-neutral-300" : "bg-stone-50 border-stone-100 text-stone-700"
                        }`}
                      >
                        <div className="w-1.5 h-1.5 bg-[#c9a84c] rounded-full" />
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.astuce_pro && (
                <div className={`p-4 border-l-4 rounded-none ${
                  theme === "dark-gold" ? "bg-black border-white/10 border-l-[#c9a84c]" : "bg-[#FAF7F2] border-[#e8dfd3] border-l-[#c9a84c]"
                }`}>
                  <span className={`text-[10px] font-mono uppercase tracking-widest block mb-1 font-bold ${getGoldText()}`}>
                    L'Astuce Technique de l'Atelier
                  </span>
                  <p className={`text-xs leading-relaxed italic ${getBodyText()}`}>
                    "{result.astuce_pro}"
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TOOL 4: CRITIQUE (ELEGANT EDITORIAL CARD) */}
        {toolId === "critique" && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <p className={`text-[10px] tracking-[0.35em] uppercase font-sans font-bold ${getGoldText()}`}>Regard Littéraire</p>
              <h3 className={`text-2xl sm:text-3xl font-serif font-light tracking-tight uppercase mt-1.5 ${getHeadingText()}`}>
                « {result.titre_critique || "Critique Esthétique"} »
              </h3>
            </div>

            {/* UPGRADE: Museum-Guide editorial spread styled layout */}
            <div className={`p-6 sm:p-8 rounded-none border relative overflow-hidden ${
              theme === "dark-gold" ? "bg-[#0c0c0c] border-white/10" : "bg-stone-50 border-stone-200"
            }`}>
              {/* Drop cap effect on first letter */}
              <Quote className="absolute top-4 right-4 w-12 h-12 text-[#c9a84c]/5 stroke-[0.5] pointer-events-none" />
              
              <div className="space-y-4 font-serif font-light text-base leading-loose italic whitespace-pre-line text-justify select-text">
                {result.texte}
              </div>
            </div>

            {result.citation && (
              <div className={`text-center py-6 px-4 border-2 border-dashed rounded-none ${
                theme === "dark-gold" ? "border-white/10 bg-black" : "border-[#e8dfd3] bg-[#FAF7F2]"
              }`}>
                <span className={`text-[9px] tracking-[0.25em] uppercase font-sans block mb-2 font-bold ${getGoldText()}`}>Axiome d'Art</span>
                <p className={`font-serif text-[17px] italic font-light ${getHeadingText()}`}>
                  « {result.citation} »
                </p>
              </div>
            )}
          </div>
        )}

        {/* TOOL 5: CONSEILS */}
        {toolId === "conseils" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className={`text-[10px] tracking-[0.35em] uppercase font-sans font-bold ${getGoldText()}`}>Coaching Académique</p>
                <h3 className={`text-2xl sm:text-3xl font-serif font-light tracking-tight uppercase mt-1.5 ${getHeadingText()}`}>
                  Conseils d'Atelier
                </h3>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className={`text-[10px] uppercase tracking-widest font-sans font-bold ${getMutedText()}`}>Maîtrise estimée :</span>
                <span className={`text-xs font-mono font-bold py-0.5 px-3 rounded-none border ${
                  theme === "dark-gold" 
                    ? "bg-[#c9a84c]/10 border-[#c9a84c]/30 text-[#c9a84c]" 
                    : "bg-[#c9a84c]/10 border-[#c9a84c]/30 text-[#9c7d2b]"
                }`}>
                  {result.niveau_estime || "Intermédiaire"}
                </span>
              </div>
            </div>

            <div className="space-y-5">
              {result.forces && (
                <div>
                  <h4 className={`font-sans text-xs uppercase tracking-wider mb-2 font-bold ${getGoldText()}`}>Points Forts de la Composition :</h4>
                  <ul className={`space-y-1.5 list-disc list-inside text-sm font-sans ${getBodyText()}`}>
                    {result.forces.map((force: string, i: number) => (
                      <li key={i}>{force}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.axes_amelioration && (
                <div className={`border-t pt-5 ${getBorderColor()}`}>
                  <h4 className={`font-sans text-xs uppercase tracking-wider mb-3 font-bold ${getGoldText()}`}>Axes de Progression & Exercices :</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {result.axes_amelioration.map((axe: any, i: number) => (
                      <div key={i} className={`p-4 rounded-none hover:border-[#c9a84c]/30 transition-all border ${
                        theme === "dark-gold" ? "bg-black border-white/10" : "bg-[#FAF7F2] border-stone-200"
                      }`}>
                        <span className={`text-xs font-sans font-bold uppercase border-b pb-1.5 block mb-2 ${
                          theme === "dark-gold" ? "text-white border-white/10" : "text-stone-900 border-stone-200"
                        }`}>
                          {i + 1}. Améliorer : {axe.aspect}
                        </span>
                        <p className={`text-xs leading-relaxed font-sans mb-2 ${getMutedText()}`}>{axe.conseil}</p>
                        <p className={`text-xs italic p-2.5 rounded-none border ${
                          theme === "dark-gold" 
                            ? "text-[#c9a84c] bg-neutral-900/50 border-white/5" 
                            : "text-[#9c7d2b] bg-white border-[#e8dfd3]"
                        }`}>
                          <strong className="font-bold">Exercice d'atelier :</strong> {axe.exercice}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.ressources && result.ressources.length > 0 && (
                <div className={`border-t pt-4 ${getBorderColor()}`}>
                  <p className={`text-xs font-sans ${getMutedText()}`}>
                    <strong className={`font-sans text-xs uppercase tracking-wider font-bold ${getGoldText()}`}>Références & Études suggérées :</strong>{" "}
                    {result.ressources.join(" · ")}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TOOL 6: ESTIMATION PRIX (UPGRADED LINEAR SLIDER SCALE) */}
        {toolId === "prix" && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <p className={`text-[10px] tracking-[0.35em] uppercase font-sans font-bold ${getGoldText()}`}>Marché de l'Art</p>
              <h3 className={`text-2xl sm:text-3xl font-serif font-light tracking-tight uppercase mt-1.5 ${getHeadingText()}`}>
                Positionnement & Estimation
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={`p-4 text-center rounded-none border transition-all ${
                theme === "dark-gold" ? "bg-black border-white/10" : "bg-stone-50 border-stone-200"
              }`}>
                <span className={`text-[10px] uppercase tracking-widest block mb-1 font-bold ${getMutedText()}`}>Cote Artiste Émergent (Min)</span>
                <span className={`text-2xl font-mono font-bold ${theme === "dark-gold" ? "text-neutral-300" : "text-stone-800"}`}>{result.fourchette_basse}</span>
              </div>
              
              <div className={`p-4 text-center rounded-none shadow-md border transition-all ${
                theme === "dark-gold" ? "bg-[#1a1a15] border-[#c9a84c]/40" : "bg-[#fdfbfa] border-[#c9a84c]/50"
              }`}>
                <span className={`text-[10px] uppercase tracking-widest block mb-1 font-bold ${getGoldText()}`}>Cote Artiste Établi / Galerie (Max)</span>
                <span className={`text-2xl font-mono font-bold ${getGoldText()}`}>{result.fourchette_haute}</span>
              </div>
            </div>

            {/* UPGRADE: Interactive Market Value Range Axis */}
            <div className={`p-5 rounded-none border ${getBorderColor()} ${theme === "dark-gold" ? "bg-black" : "bg-white"}`}>
              <div className="flex justify-between items-center mb-4">
                <span className={`text-[10px] uppercase tracking-wider font-bold ${getMutedText()}`}>
                  Spectre de Valorisation Marché
                </span>
                <span className={`text-[9px] font-mono font-bold uppercase py-0.5 px-2 bg-amber-500/10 border border-amber-500/20 ${getGoldText()}`}>
                  Zone de Revente Optimale
                </span>
              </div>
              
              {/* Sliding Range Track */}
              <div className="relative pt-3 pb-6">
                <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden relative">
                  <div className="absolute left-[20%] right-[30%] h-full bg-[#c9a84c]" />
                </div>
                
                {/* Scale nodes */}
                <div className="absolute left-0 top-1 w-2.5 h-2.5 bg-neutral-600 rounded-full" title="Émergent" />
                <div className="absolute left-[20%] top-0.5 w-3.5 h-3.5 bg-[#c9a84c] rounded-full border border-black shadow" title="Estimation Basse" />
                <div className="absolute right-[30%] top-0.5 w-3.5 h-3.5 bg-[#c9a84c] rounded-full border border-black shadow" title="Estimation Haute" />
                <div className="absolute right-0 top-1 w-2.5 h-2.5 bg-neutral-600 rounded-full" title="Marché International" />
                
                {/* Scale indicators */}
                <div className="flex justify-between text-[8px] text-neutral-500 font-mono mt-2 uppercase">
                  <span>Atelier Artiste</span>
                  <span>Bas de Fourchette</span>
                  <span>Haut de Fourchette</span>
                  <span>Galerie / Encan</span>
                </div>
              </div>
            </div>

            {result.facteurs && (
              <div className={`border-t pt-5 ${getBorderColor()}`}>
                <h4 className={`font-sans text-xs uppercase tracking-wider mb-3 font-bold ${getGoldText()}`}>Facteurs de Valorisation :</h4>
                <div className="space-y-2.5 font-sans">
                  {result.facteurs.map((f: any, i: number) => {
                    const colors: any = {
                      positif: "text-emerald-500 bg-emerald-500/5 border-emerald-500/20",
                      négatif: "text-rose-500 bg-rose-500/5 border-rose-500/20",
                      neutre: "text-neutral-500 bg-neutral-500/5 border-neutral-500/20"
                    };
                    return (
                      <div key={i} className="flex gap-3 text-xs leading-relaxed items-start">
                        <span className={`px-2 py-0.5 border text-[9px] font-bold uppercase rounded-none ${colors[f.impact] || colors.neutre}`}>
                          {f.impact}
                        </span>
                        <span className={getBodyText()}>
                          <strong className={`${getHeadingText()} font-bold`}>{f.facteur} :</strong> {f.detail}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className={`border-t pt-5 text-sm leading-relaxed font-sans space-y-4 ${getMutedText()}`}>
              <p>
                <strong className={theme === "dark-gold" ? "text-neutral-200" : "text-stone-900"}>État du Marché :</strong> {result.marche}
              </p>
              {result.conseil_vente && (
                <div className={`p-4 border-l-4 rounded-none ${
                  theme === "dark-gold" ? "bg-black border-white/10 border-l-[#c9a84c]" : "bg-[#FAF7F2] border-[#e8dfd3] border-l-[#c9a84c]"
                }`}>
                  <strong className={`text-xs uppercase tracking-wider font-bold block mb-1 ${getGoldText()}`}>Coup de pouce de courtier :</strong>
                  <p className={`text-xs italic ${getBodyText()}`}>"{result.conseil_vente}"</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TOOL 7: CERTIFICAT (UPGRADED MUSEUM DOCUMENT DISPLAY) */}
        {toolId === "certificat" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className={`text-[10px] tracking-[0.35em] uppercase font-sans font-bold ${getGoldText()}`}>Mentions Légales</p>
                <h3 className={`text-2xl sm:text-3xl font-serif font-light tracking-tight uppercase mt-1.5 ${getHeadingText()}`}>
                  Génération de Certificat
                </h3>
              </div>
              
              {/* Document color presets & Print trigger */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setCertPaperColor("parchment")}
                  className={`w-4 h-4 rounded-full bg-[#f6f2e8] border ${certPaperColor === "parchment" ? "border-[#c9a84c] scale-110" : "border-neutral-400"}`}
                  title="Parchemin"
                />
                <button
                  onClick={() => setCertPaperColor("white")}
                  className={`w-4 h-4 rounded-full bg-white border ${certPaperColor === "white" ? "border-[#c9a84c] scale-110" : "border-neutral-400"}`}
                  title="Blanc d'art"
                />
                <button
                  onClick={() => setCertPaperColor("ivory")}
                  className={`w-4 h-4 rounded-full bg-[#fffff4] border ${certPaperColor === "ivory" ? "border-[#c9a84c] scale-110" : "border-neutral-400"}`}
                  title="Ivoire"
                />
                <button
                  onClick={handlePrintCertificate}
                  className={`ml-2 flex items-center gap-1.5 px-3 py-1.5 border text-[10px] tracking-wider uppercase rounded-none transition-all duration-200 font-bold ${
                    theme === "dark-gold"
                      ? "bg-black border-white/10 text-[#c9a84c] hover:bg-neutral-900"
                      : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  <Printer className="w-3.5 h-3.5" />
                  Imprimer (PDF)
                </button>
              </div>
            </div>

            {/* Certificat High Fidelity Document Card */}
            <div 
              id="certificate-printable-area"
              className={`p-8 sm:p-12 text-center relative max-w-xl mx-auto shadow-2xl rounded-none border-[6px] border-double transition-all duration-300 ${
                certPaperColor === "parchment"
                  ? "bg-[#FAF5EA] text-[#3e2a14] border-[#c9a84c]"
                  : certPaperColor === "ivory"
                    ? "bg-[#FFFFFA] text-stone-900 border-[#9c7d2b]"
                    : "bg-white text-stone-900 border-[#c9a84c]"
              }`}
            >
              {/* Subtle vintage border */}
              <div className="absolute top-2 left-2 right-2 bottom-2 border border-[#c9a84c]/20 pointer-events-none" />
              
              {/* Optional embedded thumbnail of artwork for stunning visualisation! */}
              {previewUrl && (
                <div className="absolute top-4 right-4 w-12 h-12 border border-[#c9a84c]/40 p-0.5 bg-white/40 hidden sm:block">
                  <img src={previewUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                </div>
              )}

              <h4 className="text-xl uppercase tracking-[0.25em] font-serif font-light mb-8 border-b pb-4 border-[#c9a84c]/30">
                Certificat d'Authenticité
              </h4>
              
              <div className="text-left space-y-4 font-sans text-sm">
                <p className="flex justify-between border-b pb-1.5 border-[#c9a84c]/20">
                  <span className="font-sans text-[10px] uppercase tracking-wider font-bold opacity-60">Auteur de l'œuvre :</span>
                  <span className="font-bold text-base">{artistName || "Nom de l'Artiste"}</span>
                </p>
                <p className="flex justify-between border-b pb-1.5 border-[#c9a84c]/20">
                  <span className="font-sans text-[10px] uppercase tracking-wider font-bold opacity-60">Titre de l'œuvre :</span>
                  <span className="font-serif italic font-bold text-base">« {result.titre_oeuvre} »</span>
                </p>
                <p className="flex justify-between border-b pb-1.5 border-[#c9a84c]/20">
                  <span className="font-sans text-[10px] uppercase tracking-wider font-bold opacity-60">Technique & Médium :</span>
                  <span className="font-bold">{result.technique_supposee}</span>
                </p>
                <p className="flex justify-between border-b pb-1.5 border-[#c9a84c]/20">
                  <span className="font-sans text-[10px] uppercase tracking-wider font-bold opacity-60">Émission du Certificat :</span>
                  <span className="font-bold">{new Date().toLocaleDateString("fr-FR")}</span>
                </p>

                <div className="pt-6 text-xs font-sans italic leading-relaxed text-center opacity-80 border-t border-dashed border-[#c9a84c]/30 mt-4 px-4">
                  "{result.texte_certificat}"
                </div>

                <div className="pt-10 flex justify-between items-end">
                  <div className="text-left font-sans">
                    {/* SVG Seal Watermark simulation */}
                    <div className="w-14 h-14 rounded-full border-2 border-[#c9a84c]/60 flex flex-col items-center justify-center text-[7px] uppercase tracking-tighter text-[#c9a84c] font-black italic relative opacity-80 mb-2 rotate-[-12deg]">
                      <span className="scale-75">AUTHENTIQUE</span>
                      <div className="absolute inset-1 border border-dashed border-[#c9a84c]/30 rounded-full" />
                    </div>
                    <span className="text-[10px] text-neutral-500 uppercase block font-bold leading-none">L'Œil de l'Atelier</span>
                    <span className="text-[9px] uppercase font-bold text-[#c9a84c]">Sceau Numérique d'Authenticité</span>
                  </div>
                  <div className="text-right border-t border-dashed border-stone-400 w-36 pt-1 font-sans">
                    <span className="text-[10px] text-neutral-500 uppercase font-bold">Signature de l'Artiste</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-neutral-500 italic mt-4 font-sans leading-relaxed px-6">
              Ce modèle de certificat est juridiquement rédigé. Vous pouvez l'exporter en PDF ou l'imprimer sur un beau papier d'art à grain pour l'inclure lors de la vente de l'œuvre physique.
            </p>
          </div>
        )}

        {/* TOOL 8: DESIGN INTÉRIEUR / DECOR (UPGRADED INTERACTIVE ROOM WALL VISUALIZER) */}
        {toolId === "decor" && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <p className={`text-[10px] tracking-[0.35em] uppercase font-sans font-bold ${getGoldText()}`}>Valorisation Spatiale</p>
              <h3 className={`text-2xl sm:text-3xl font-serif font-light tracking-tight uppercase mt-1.5 ${getHeadingText()}`}>
                Mise en Situation Intérieure
              </h3>
            </div>

            {/* Room Simulator Custom Visualizer */}
            <div className={`p-4 rounded-none border ${getBorderColor()} ${theme === "dark-gold" ? "bg-black" : "bg-white"}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <span className={`text-[10px] uppercase tracking-wider font-bold ${getMutedText()}`}>
                  Simulateur d'Exposition Interactive (Salon Virtuel)
                </span>
                
                {/* Visual Options Toolbar */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Room selectors */}
                  <div className="flex items-center gap-1.5 border border-neutral-800/80 p-0.5 bg-black/30">
                    <button
                      onClick={() => setSelectedRoom("haussmann")}
                      className={`px-2 py-0.5 text-[8px] font-sans font-bold uppercase transition-all tracking-wider ${
                        selectedRoom === "haussmann" ? "bg-[#c9a84c] text-black" : "text-neutral-400"
                      }`}
                    >
                      Salon Haussmannien
                    </button>
                    <button
                      onClick={() => setSelectedRoom("loft")}
                      className={`px-2 py-0.5 text-[8px] font-sans font-bold uppercase transition-all tracking-wider ${
                        selectedRoom === "loft" ? "bg-[#c9a84c] text-black" : "text-neutral-400"
                      }`}
                    >
                      Loft Industriel
                    </button>
                    <button
                      onClick={() => setSelectedRoom("zen")}
                      className={`px-2 py-0.5 text-[8px] font-sans font-bold uppercase transition-all tracking-wider ${
                        selectedRoom === "zen" ? "bg-[#c9a84c] text-black" : "text-neutral-400"
                      }`}
                    >
                      Chambre Zen
                    </button>
                  </div>
                  
                  {/* Frame selectors */}
                  <div className="flex items-center gap-1.5 border border-neutral-800/80 p-0.5 bg-black/30">
                    <button
                      onClick={() => setSelectedFrame("gold")}
                      className={`px-2 py-0.5 text-[8px] font-sans font-bold uppercase transition-all tracking-wider ${
                        selectedFrame === "gold" ? "bg-amber-500/10 text-amber-400" : "text-neutral-400"
                      }`}
                      title="Cadre Or Classique"
                    >
                      Moulure Or
                    </button>
                    <button
                      onClick={() => setSelectedFrame("black")}
                      className={`px-2 py-0.5 text-[8px] font-sans font-bold uppercase transition-all tracking-wider ${
                        selectedFrame === "black" ? "bg-neutral-800 text-white" : "text-neutral-400"
                      }`}
                      title="Cadre Noir Chic"
                    >
                      Noir Chic
                    </button>
                    <button
                      onClick={() => setSelectedFrame("oak")}
                      className={`px-2 py-0.5 text-[8px] font-sans font-bold uppercase transition-all tracking-wider ${
                        selectedFrame === "oak" ? "bg-amber-700/20 text-orange-200" : "text-neutral-400"
                      }`}
                      title="Chêne Naturel"
                    >
                      Chêne
                    </button>
                  </div>
                </div>
              </div>

              {/* The Room Render Stage */}
              <div 
                className="w-full aspect-[16/10] relative flex items-center justify-center overflow-hidden border border-black/40 shadow-inner bg-cover bg-center transition-all duration-500"
                style={{
                  backgroundImage: 
                    selectedRoom === "haussmann"
                      ? `url('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800')` // haussmann parlor fireplace style
                      : selectedRoom === "loft"
                        ? `url('https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&q=80&w=800')` // industrial brick studio
                        : `url('https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=800')` // minimal beige bedroom headboard
                }}
              >
                {/* Backdrop lighting mask overlay */}
                <div className="absolute inset-0 bg-black/25 pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

                {/* Simulated Sofa / Couch foreground for perspective depth */}
                <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-black/30 backdrop-blur-xs pointer-events-none border-t border-white/5" />

                {/* THE PICTURE ON THE WALL WITH ADJUSTABLE FRAMING STYLES! */}
                {previewUrl ? (
                  <div 
                    className={`absolute w-[24%] aspect-square bottom-[35%] transition-all duration-300 shadow-2xl flex items-center justify-center bg-white ${
                      selectedFrame === "gold"
                        ? "border-[8px] border-amber-500 shadow-[0_15px_30px_rgba(0,0,0,0.4)] relative" // gold moulding style
                        : selectedFrame === "black"
                          ? "border-[4px] border-neutral-900 shadow-[0_12px_25px_rgba(0,0,0,0.5)] relative" // minimal black style
                          : "border-[6px] border-amber-800/80 shadow-[0_10px_20px_rgba(0,0,0,0.35)] relative" // oak warm style
                    }`}
                  >
                    {/* Inner passe-partout mount margin */}
                    <div className="absolute inset-1.5 border border-stone-200 pointer-events-none bg-transparent" />
                    <div className="w-full h-full p-2 bg-stone-50 overflow-hidden flex items-center justify-center">
                      <img 
                        src={previewUrl} 
                        alt="Simulated Picture" 
                        className="max-w-full max-h-full object-contain filter brightness-[0.98] contrast-[1.02]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="absolute w-[25%] aspect-square bottom-[35%] bg-stone-800 border-4 border-dashed border-stone-600 flex flex-col items-center justify-center text-stone-500 text-[10px]">
                    <p>Image Manquante</p>
                  </div>
                )}
              </div>
            </div>

            <div className={`space-y-5 text-sm leading-relaxed font-sans ${getBodyText()}`}>
              <div className="space-y-1">
                <span className={`text-[10px] uppercase tracking-widest font-bold block ${getGoldText()}`}>Lieu d'exposition rêvé :</span>
                <p className={`font-bold ${getHeadingText()}`}>{result.style_interieur}</p>
              </div>

              <div className={`border-t pt-4 space-y-1 ${getBorderColor()}`}>
                <span className={`text-[10px] uppercase tracking-widest font-bold block ${getGoldText()}`}>Profil de l'Acheteur Cible :</span>
                <p className={`font-bold ${getHeadingText()}`}>{result.acheteur_cible}</p>
              </div>

              <div className={`pt-4 border-t ${getBorderColor()}`}>
                <Quote className="w-5 h-5 text-[#c9a84c]/40 mb-1" />
                <p className={`font-serif italic text-base leading-relaxed pl-4 border-l-4 border-[#c9a84c] ${getHeadingText()}`}>
                  « {result.argumentaire} »
                </p>
                <span className="text-[9px] uppercase text-neutral-500 tracking-wider font-sans block mt-1.5 pl-5 font-bold">
                  L'argument de vente majeur suggéré pour convaincre un collectionneur
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TOOL 9: TITRES */}
        {toolId === "titres" && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <p className={`text-[10px] tracking-[0.35em] uppercase font-sans font-bold ${getGoldText()}`}>Curation d'Œuvre</p>
              <h3 className={`text-2xl sm:text-3xl font-serif font-light tracking-tight uppercase mt-1.5 ${getHeadingText()}`}>
                Suggestions de Titres d'Œuvre
              </h3>
            </div>

            <div className="space-y-4">
              {result.titres?.map((t: any, i: number) => (
                <div key={i} className={`p-4 rounded-none flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#c9a84c]/30 transition-all border ${
                  theme === "dark-gold" ? "bg-black border-white/10" : "bg-[#FAF7F2] border-stone-200"
                }`}>
                  <div className="space-y-1">
                    <span className={`text-[9px] font-mono uppercase tracking-widest block font-bold ${getGoldText()}`}>
                      Registre : {t.registre}
                    </span>
                    <h4 className={`font-serif text-base font-bold italic ${getHeadingText()}`}>
                      « {t.nom} »
                    </h4>
                    <p className={`text-xs font-sans leading-relaxed ${getMutedText()}`}>
                      {t.explication}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleCopyText(`« ${t.nom} »`, `title-${i}`)}
                    className={`px-3 py-1 text-[10px] tracking-wider uppercase border rounded-none self-end sm:self-auto transition-colors font-bold ${
                      theme === "dark-gold"
                        ? "bg-neutral-900 hover:bg-[#c9a84c] hover:text-black text-neutral-400 border-white/10"
                        : "bg-white hover:bg-[#c9a84c] hover:text-white text-stone-600 border-stone-200"
                    }`}
                  >
                    {copied === `title-${i}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TOOL 10: ARTISTES */}
        {toolId === "artistes" && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <p className={`text-[10px] tracking-[0.35em] uppercase font-sans font-bold ${getGoldText()}`}>Généalogie d'Art</p>
              <h3 className={`text-2xl sm:text-3xl font-serif font-light tracking-tight uppercase mt-1.5 ${getHeadingText()}`}>
                Filiations & Correspondances
              </h3>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4">
                {result.artistes?.map((a: any, i: number) => (
                  <div key={i} className={`p-4 rounded-none border ${
                    theme === "dark-gold" ? "bg-black border-white/10" : "bg-stone-50 border-stone-200"
                  }`}>
                    <div className={`flex flex-wrap items-center justify-between border-b pb-2 mb-2 ${getBorderColor()}`}>
                      <span className={`text-sm font-sans font-bold uppercase ${getHeadingText()}`}>
                        {a.nom}
                      </span>
                      <span className="text-[10px] text-neutral-400 uppercase font-mono tracking-wider font-bold">
                        {a.nationalite} · {a.periode}
                      </span>
                    </div>
                    <p className={`text-xs leading-relaxed font-sans mb-2.5 ${getBodyText()}`}>
                      {a.lien}
                    </p>
                    <p className={`text-xs italic ${getGoldText()}`}>
                      <strong className="font-bold">Œuvre repère à étudier :</strong> {a.oeuvre_reference}
                    </p>
                  </div>
                ))}
              </div>

              {result.musees && result.musees.length > 0 && (
                <div className={`pt-4 flex items-center gap-2 border-t ${getBorderColor()}`}>
                  <MapPin className={`w-4 h-4 flex-shrink-0 ${getGoldText()}`} />
                  <span className={`text-xs font-sans ${getMutedText()}`}>
                    <strong className={`${getHeadingText()} font-sans text-xs uppercase tracking-wider font-bold`}>Musées recommandés pour s'inspirer :</strong>{" "}
                    {result.musees.join(" · ")}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TOOL 11: EXPOSITION TEXTS */}
        {toolId === "expo" && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <p className={`text-[10px] tracking-[0.35em] uppercase font-sans font-bold ${getGoldText()}`}>Scénographie & Curation</p>
              <h3 className={`text-2xl sm:text-3xl font-serif font-light tracking-tight uppercase mt-1.5 ${getHeadingText()}`}>
                Textes d'Exposition
              </h3>
            </div>

            <div className="space-y-5">
              <div>
                <span className={`text-[10px] uppercase tracking-widest block mb-1 font-bold ${getMutedText()}`}>Concept Global d'Exposition :</span>
                <span className={`text-lg font-serif font-medium uppercase italic ${getGoldText()}`}>
                  « {result.titre_expo} »
                </span>
              </div>

              {/* Museum Cartel Block */}
              <div className={`p-5 rounded-none relative border ${
                theme === "dark-gold" ? "border-white/10 bg-black" : "border-stone-200 bg-[#FAF7F2]"
              }`}>
                <div className="flex justify-between items-center mb-3">
                  <span className={`text-[10px] uppercase tracking-widest font-bold ${getMutedText()}`}>Le Cartel d'Atelier (À coller près de l'œuvre)</span>
                  <button
                    onClick={() => handleCopyText(result.texte_cartel, "cartel")}
                    className={`p-1 transition-colors ${theme === "dark-gold" ? "hover:text-[#c9a84c] text-neutral-500" : "hover:text-[#c9a84c] text-stone-500"}`}
                    title="Copier le cartel"
                  >
                    {copied === "cartel" ? <Check className={`w-4 h-4 ${getGoldText()}`} /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className={`font-serif italic text-sm leading-relaxed border-l-4 border-[#c9a84c] pl-4 ${getBodyText()}`}>
                  {result.texte_cartel}
                </p>
              </div>

              {/* Press Release communique */}
              <div className={`p-5 rounded-none border ${
                theme === "dark-gold" ? "border-white/10 bg-black/40" : "border-stone-200 bg-stone-50"
              }`}>
                <span className={`text-[10px] uppercase tracking-widest block mb-2 font-bold ${getMutedText()}`}>Communiqué de presse d'Exposition (Extrait)</span>
                <p className={`text-xs leading-relaxed font-sans ${getBodyText()}`}>
                  {result.communique}
                </p>
              </div>

              {result.hashtags && result.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {result.hashtags.map((h: string, i: number) => (
                    <span key={i} className="text-xs font-mono text-neutral-500">
                      {h}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TOOL 12: VERNISSAGE */}
        {toolId === "vernissage" && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <p className={`text-[10px] tracking-[0.35em] uppercase font-sans font-bold ${getGoldText()}`}>Promotion Événementielle</p>
              <h3 className={`text-2xl sm:text-3xl font-serif font-light tracking-tight uppercase mt-1.5 ${getHeadingText()}`}>
                Concept de Vernissage
              </h3>
            </div>

            <div className="space-y-5">
              {/* Event card invitation */}
              <div className={`p-6 sm:p-8 text-center rounded-none relative shadow-lg overflow-hidden border-2 border-dashed ${
                theme === "dark-gold" ? "bg-black border-[#c9a84c]" : "bg-white border-[#c9a84c]"
              }`}>
                <div className="absolute inset-1 border border-neutral-500/5 pointer-events-none" />
                
                <span className={`text-[9px] uppercase tracking-[0.25em] block mb-2 font-bold ${getGoldText()}`}>Invitation Exclusive</span>
                <h4 className={`font-serif font-light text-xl uppercase italic mb-4 ${getHeadingText()}`}>
                  {result.titre_event}
                </h4>
                
                <div className="space-y-1 text-xs font-sans tracking-wide uppercase font-bold text-neutral-400">
                  <p className={theme === "dark-gold" ? "text-neutral-200" : "text-stone-800"}>{result.date_fictive}</p>
                  <p className="text-neutral-500">{result.lieu_fictif}</p>
                </div>

                <p className={`mt-5 font-serif text-sm italic max-w-sm mx-auto leading-relaxed font-bold ${getGoldText()}`}>
                  « {result.phrase_accroche} »
                </p>
              </div>

              {/* Midjourney prompt visual generator */}
              <div className={`p-5 rounded-none border ${
                theme === "dark-gold" ? "border-white/10 bg-black" : "border-stone-200 bg-stone-50"
              }`}>
                <div className="flex justify-between items-center mb-3">
                  <span className={`text-[10px] uppercase tracking-widest flex items-center gap-1 font-bold ${getMutedText()}`}>
                    Prompt de Création de Visuel d'Affiche (Midjourney)
                  </span>
                  <button
                    onClick={() => handleCopyText(result.prompt_image_generator, "image-prompt")}
                    className={`p-1 transition-colors ${theme === "dark-gold" ? "hover:text-[#c9a84c] text-neutral-500" : "hover:text-[#c9a84c] text-stone-550"}`}
                    title="Copier le prompt"
                  >
                    {copied === "image-prompt" ? (
                      <Check className={`w-4 h-4 ${getGoldText()}`} />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="text-xs font-mono text-emerald-600 leading-relaxed break-words bg-[#0a0a0a] p-3 rounded-none border border-white/5 select-all dark:text-emerald-400">
                  {result.prompt_image_generator}
                </div>
                <p className="text-[10px] text-neutral-500 mt-2 font-sans">
                  Insérez ce prompt stylisé dans votre générateur d'images favori (Midjourney, DALL-E, Imagen) pour obtenir une affiche artistique fidèle au style de votre œuvre d'art originale.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TOOL 13: RESEAUX SOCIAUX */}
        {toolId === "reseaux" && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <p className={`text-[10px] tracking-[0.35em] uppercase font-sans font-bold ${getGoldText()}`}>Stratégie Digitale</p>
              <h3 className={`text-2xl sm:text-3xl font-serif font-light tracking-tight uppercase mt-1.5 ${getHeadingText()}`}>
                Réseaux Sociaux & Vidéos
              </h3>
            </div>

            <div className="space-y-5">
              {result.legendes?.map((l: any, i: number) => (
                <div key={i} className={`p-4 rounded-none border ${getBgCard()}`}>
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono font-bold">
                      Canal : {l.plateforme}
                    </span>
                    <button
                      onClick={() => handleCopyText(l.texte, `social-${i}`)}
                      className={`p-1 transition-colors ${theme === "dark-gold" ? "hover:text-[#c9a84c] text-neutral-500" : "hover:text-[#c9a84c] text-stone-500"}`}
                      title="Copier la publication"
                    >
                      {copied === `social-${i}` ? (
                        <Check className={`w-3.5 h-3.5 ${getGoldText()}`} />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <p className={`text-xs leading-relaxed font-sans ${getBodyText()}`}>
                    {l.texte}
                  </p>
                </div>
              ))}

              {result.hashtags && result.hashtags.length > 0 && (
                <div className={`border-t pt-4 ${getBorderColor()}`}>
                  <span className={`text-[10px] uppercase tracking-widest block mb-2 font-bold ${getMutedText()}`}>Hashtags recommandés :</span>
                  <p className={`text-xs font-mono leading-relaxed whitespace-pre-wrap select-all ${getGoldText()}`}>
                    {result.hashtags.join(" ")}
                  </p>
                </div>
              )}

              {result.reel_idea && (
                <div className={`p-4 border border-dashed rounded-none ${
                  theme === "dark-gold" ? "border-[#c9a84c]/30 bg-black" : "border-[#c9a84c]/40 bg-[#FAF7F2]"
                }`}>
                  <span className={`text-[10px] font-mono uppercase tracking-widest block mb-1 font-bold ${getGoldText()}`}>
                    🎬 Idée de Scénario Vidéo (Reel / TikTok)
                  </span>
                  <p className={`text-xs leading-relaxed italic font-sans ${getBodyText()}`}>
                    "{result.reel_idea}"
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TOOL 14: ARTIST STATEMENT */}
        {toolId === "statement" && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <p className={`text-[10px] tracking-[0.35em] uppercase font-sans font-bold ${getGoldText()}`}>Dossier d'Artiste</p>
              <h3 className={`text-2xl sm:text-3xl font-serif font-light tracking-tight uppercase mt-1.5 ${getHeadingText()}`}>
                {result.titre || "Artist Statement"}
              </h3>
            </div>

            <div className="space-y-4">
              <p className={`font-serif font-light text-base leading-loose italic whitespace-pre-line pl-5 border-l-4 border-[#c9a84c] ${getBodyText()}`}>
                {result.texte_demarche}
              </p>

              {result.mots_cles_marquants && (
                <div className={`pt-4 border-t flex flex-wrap gap-2 items-center ${getBorderColor()}`}>
                  <span className={`text-[10px] uppercase tracking-wider mr-2 font-mono font-bold ${getMutedText()}`}>Piliers Philosophiques :</span>
                  {result.mots_cles_marquants.map((k: string, i: number) => (
                    <span key={i} className={`text-xs font-sans font-bold italic py-0.5 px-2.5 rounded-none border ${
                      theme === "dark-gold" 
                        ? "text-[#c9a84c] bg-[#c9a84c]/5 border-[#c9a84c]/10" 
                        : "text-[#9c7d2b] bg-[#c9a84c]/5 border-[#c9a84c]/20"
                    }`}>
                      {k}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TOOL 15: INSPIRATION / CONTINUATION */}
        {toolId === "inspiration" && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <p className={`text-[10px] tracking-[0.35em] uppercase font-sans font-bold ${getGoldText()}`}>Déblocage Créatif</p>
              <h3 className={`text-2xl sm:text-3xl font-serif font-light tracking-tight uppercase mt-1.5 ${getHeadingText()}`}>
                Prochaines Pistes de l'Atelier
              </h3>
            </div>

            <div className="space-y-5">
              <div className="space-y-3">
                {result.pistes?.map((p: any, i: number) => (
                  <div key={i} className={`p-4 rounded-none border ${getBgCard()}`}>
                    <span className={`text-[10px] font-mono uppercase tracking-widest block mb-1 font-bold ${getGoldText()}`}>
                      Piste de variation #{i + 1}
                    </span>
                    <h4 className={`text-sm font-sans font-black uppercase mb-1 ${getHeadingText()}`}>
                      {p.concept}
                    </h4>
                    <p className={`text-xs font-sans leading-relaxed ${getMutedText()}`}>
                      {p.pourquoi}
                    </p>
                  </div>
                ))}
              </div>

              {result.defi && (
                <div className={`p-5 text-center rounded-none relative overflow-hidden shadow-md border ${
                  theme === "dark-gold" ? "border-[#c9a84c]/40 bg-[#1a1a15]" : "border-[#c9a84c]/40 bg-[#fdfbfa]"
                }`}>
                  <span className={`text-[10px] font-mono tracking-[0.25em] uppercase block mb-2 font-bold ${getGoldText()}`}>
                    Le Défi Créatif d'Atelier
                  </span>
                  <p className={`text-sm font-sans italic leading-relaxed max-w-md mx-auto font-bold ${getHeadingText()}`}>
                    "{result.defi}"
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TOOL 16: POÉSIE (ELEGANT VINTAGE SHEET PRINT) */}
        {toolId === "poesie" && (
          <div className="space-y-8 py-4 animate-fadeIn">
            <div className="text-center">
              <p className={`text-[10px] tracking-[0.35em] uppercase font-sans font-bold ${getGoldText()}`}>Inspiration Poétique</p>
              <h3 className={`text-2xl sm:text-3xl font-serif font-light tracking-tight uppercase mt-1.5 ${getHeadingText()}`}>
                « {result.titre_poeme} »
              </h3>
            </div>

            {/* Haiku view */}
            <div className={`text-center max-w-sm mx-auto p-5 border-y border-dashed ${
              theme === "dark-gold" ? "border-[#c9a84c]/30 bg-black/40" : "border-[#c9a84c]/40 bg-[#FAF7F2]"
            }`}>
              <span className={`text-[9px] uppercase tracking-widest block mb-3.5 font-mono font-bold ${getGoldText()}`}>Haïku suspendu (5-7-5)</span>
              <p className={`font-serif text-[17px] leading-loose italic whitespace-pre-line font-medium ${getHeadingText()}`}>
                {result.haiku}
              </p>
            </div>

            {/* Free verse poem with subtle background lines */}
            <div className="text-center max-w-md mx-auto py-4">
              <p className={`font-serif text-[15px] leading-loose whitespace-pre-line italic text-stone-300 ${getBodyText()}`}>
                {result.texte_poetique}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer helper */}
      <div className={`mt-8 pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${getBorderColor()}`}>
        <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-mono">
          Analyseur OS v2.5 · Propulsé par Google Gemini
        </span>
        <span className="text-[10px] text-neutral-400 font-sans italic font-bold">
          L'Œil de l'Atelier observe le monde sensible.
        </span>
      </div>
    </div>
  );
}
