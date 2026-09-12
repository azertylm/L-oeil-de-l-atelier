/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  X, 
  Images, 
  Check, 
  Plus, 
  FolderPlus, 
  Sparkles, 
  Search, 
  Trash2, 
  UploadCloud, 
  Layers, 
  CheckCircle2 
} from "lucide-react";
import { CustomArtwork } from "../types.js";
import { PRESET_ARTWORKS, PresetArtwork, getArtworkBase64 } from "../presets.js";

interface AddFromGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  customArtworks: CustomArtwork[];
  activeSeries: Array<{ id: string; title: string; imageSrc: string; artist?: string; medium?: string; year?: string }>;
  onToggleItem: (item: { id: string; title: string; imageSrc: string; artist?: string; medium?: string; year?: string }) => void;
  onAddMultiple: (items: Array<{ id: string; title: string; imageSrc: string; artist?: string; medium?: string; year?: string }>) => void;
  onRemoveMultiple: (ids: string[]) => void;
  onUploadNewFiles?: (files: File[]) => void;
  theme?: "dark-gold" | "light";
}

export default function AddFromGalleryModal({
  isOpen,
  onClose,
  customArtworks,
  activeSeries,
  onToggleItem,
  onAddMultiple,
  onRemoveMultiple,
  onUploadNewFiles,
  theme = "dark-gold"
}: AddFromGalleryModalProps) {
  const [activeTab, setActiveTab] = useState<"custom" | "presets">(
    customArtworks.length > 0 ? "custom" : "presets"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const isDark = theme === "dark-gold";
  const activeSeriesIds = new Set(activeSeries.map(item => item.id));

  // Filtered lists based on search
  const filteredCustom = customArtworks.filter(art => 
    art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    art.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    art.medium.toLowerCase().includes(searchQuery.toLowerCase()) ||
    art.year.includes(searchQuery)
  );

  const filteredPresets = PRESET_ARTWORKS.filter(art => 
    art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    art.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    art.medium.toLowerCase().includes(searchQuery.toLowerCase()) ||
    art.year.includes(searchQuery)
  );

  // Quick Action: Add all filtered artworks in current tab
  const handleAddAllInTab = async () => {
    setIsProcessing(true);
    try {
      if (activeTab === "custom") {
        const toAdd = filteredCustom
          .filter(art => !activeSeriesIds.has(art.id))
          .map(art => ({
            id: art.id,
            title: art.title,
            imageSrc: art.imageSrc,
            artist: art.artist,
            medium: art.medium,
            year: art.year
          }));
        if (toAdd.length > 0) {
          onAddMultiple(toAdd);
        }
      } else {
        // Presets need base64 conversion
        const presetsToAdd: Array<{ id: string; title: string; imageSrc: string; artist: string; medium: string; year: string }> = [];
        for (const preset of filteredPresets) {
          if (!activeSeriesIds.has(preset.id)) {
            const base64 = await getArtworkBase64(preset);
            presetsToAdd.push({
              id: preset.id,
              title: preset.title,
              imageSrc: base64,
              artist: preset.artist,
              medium: preset.medium,
              year: preset.year
            });
          }
        }
        if (presetsToAdd.length > 0) {
          onAddMultiple(presetsToAdd);
        }
      }
    } catch (e) {
      console.error("Error adding all artworks to series:", e);
    } finally {
      setIsProcessing(false);
    }
  };

  // Quick Action: Remove all from active series
  const handleRemoveAll = () => {
    const ids = activeSeries.map(item => item.id);
    onRemoveMultiple(ids);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div 
        className={`w-full max-w-5xl max-h-[92vh] flex flex-col border shadow-2xl transition-colors duration-300 relative ${
          isDark 
            ? "bg-[#0f0f0f] border-[#c9a84c]/60 text-white" 
            : "bg-white border-[#c9a84c] text-stone-900"
        }`}
      >
        {/* Top Gold Accent Bar */}
        <div className="h-1 bg-gradient-to-r from-[#b8973e] via-[#c9a84c] to-[#e4cb78] w-full" />

        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-[#c9a84c]/20 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 border border-[#c9a84c] bg-[#c9a84c]/10 flex items-center justify-center flex-shrink-0">
              <Images className="w-5 h-5 sm:w-6 sm:h-6 text-[#c9a84c]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif font-bold text-base sm:text-xl md:text-2xl uppercase tracking-wider">
                  Ajouter des Photos Déjà Importées
                </h3>
                <span className="text-[10px] font-mono font-bold bg-[#c9a84c] text-black px-2 py-0.5 uppercase tracking-wider">
                  SÉRIE DE VERNISSAGE
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-400 font-sans mt-0.5">
                Cochez ou cliquez sur vos toiles déjà importées pour les intégrer instantanément à l'analyse active.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer border border-transparent hover:border-white/10"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls & Tab Bar */}
        <div className="px-4 sm:px-6 py-3 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-black/20">
          {/* Tabs */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("custom")}
              className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 border ${
                activeTab === "custom"
                  ? "bg-[#c9a84c] text-black border-[#c9a84c]"
                  : "bg-black/40 text-neutral-400 border-white/10 hover:border-white/30"
              }`}
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>Ma Galerie ({customArtworks.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("presets")}
              className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 border ${
                activeTab === "presets"
                  ? "bg-[#c9a84c] text-black border-[#c9a84c]"
                  : "bg-black/40 text-neutral-400 border-white/10 hover:border-white/30"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Chefs-d'œuvre Exemples (15)</span>
            </button>
          </div>

          {/* Search bar & batch toggles */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                placeholder="Rechercher une œuvre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-8 pr-3 py-1.5 text-xs border bg-transparent font-sans focus:outline-none ${
                  isDark ? "border-white/10 text-white focus:border-[#c9a84c]" : "border-stone-300 text-black focus:border-[#c9a84c]"
                }`}
              />
            </div>

            <button
              type="button"
              disabled={isProcessing}
              onClick={handleAddAllInTab}
              className="px-2.5 py-1.5 text-[10px] font-mono font-bold uppercase bg-[#c9a84c]/20 hover:bg-[#c9a84c] text-[#c9a84c] hover:text-black border border-[#c9a84c]/40 transition-colors disabled:opacity-50"
              title="Ajouter toutes les œuvres affichées dans l'onglet"
            >
              + Tout ajouter
            </button>

            {activeSeries.length > 0 && (
              <button
                type="button"
                onClick={handleRemoveAll}
                className="px-2.5 py-1.5 text-[10px] font-mono uppercase bg-rose-950/40 hover:bg-rose-900 text-rose-300 border border-rose-800/40 transition-colors"
                title="Vider la sélection de série"
              >
                Vider série
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Gallery Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 max-h-[58vh] scrollbar-thin space-y-4">
          
          {/* TAB 1: Custom Artworks */}
          {activeTab === "custom" && (
            <div>
              {customArtworks.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-14 h-14 border border-dashed border-[#c9a84c]/40 flex items-center justify-center mx-auto text-[#c9a84c]">
                    <FolderPlus className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-lg">Votre galerie virtuelle d'atelier ne contient pas encore d'œuvres</h4>
                  <p className="text-xs text-neutral-400 max-w-md mx-auto">
                    Importez des photos via le bouton ci-dessous pour les retrouver ici à tout moment et composer des séries en 1 clic.
                  </p>
                  {onUploadNewFiles && (
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#c9a84c] text-black font-mono font-bold text-xs uppercase cursor-pointer hover:bg-white transition-colors mt-2">
                      <UploadCloud className="w-4 h-4" />
                      <span>Importer de nouvelles photos</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          if (e.target.files) {
                            onUploadNewFiles(Array.from(e.target.files));
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              ) : filteredCustom.length === 0 ? (
                <div className="text-center py-8 text-neutral-400 text-xs">
                  Aucune œuvre ne correspond à « {searchQuery} ».
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
                  {filteredCustom.map((artwork) => {
                    const isSelected = activeSeriesIds.has(artwork.id);
                    return (
                      <div
                        key={artwork.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => onToggleItem({
                          id: artwork.id,
                          title: artwork.title,
                          imageSrc: artwork.imageSrc,
                          artist: artwork.artist,
                          medium: artwork.medium,
                          year: artwork.year
                        })}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            onToggleItem({
                              id: artwork.id,
                              title: artwork.title,
                              imageSrc: artwork.imageSrc,
                              artist: artwork.artist,
                              medium: artwork.medium,
                              year: artwork.year
                            });
                          }
                        }}
                        className={`group border cursor-pointer relative overflow-hidden transition-all duration-300 flex flex-col justify-between select-none ${
                          isSelected
                            ? "border-[#c9a84c] ring-2 ring-[#c9a84c]/50 bg-[#c9a84c]/5 shadow-lg shadow-[#c9a84c]/10"
                            : (isDark 
                                ? "bg-[#141414] border-white/10 hover:border-[#c9a84c]/50 hover:bg-[#1a1a1a]" 
                                : "bg-stone-50 border-stone-200 hover:border-[#c9a84c]/50 hover:bg-stone-100")
                        }`}
                      >
                        {/* Status Ribbon / Badge */}
                        <div className="absolute top-1.5 left-1.5 z-10">
                          {isSelected ? (
                            <span className="flex items-center gap-1 bg-[#c9a84c] text-black font-mono font-black text-[9px] px-2 py-0.5 uppercase tracking-wider shadow">
                              <Check className="w-3 h-3 stroke-[3]" /> Dans la série
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 bg-black/70 text-neutral-300 group-hover:text-white font-mono text-[9px] px-1.5 py-0.5 uppercase tracking-wider border border-white/10">
                              <Plus className="w-2.5 h-2.5" /> Ajouter
                            </span>
                          )}
                        </div>

                        {/* Thumbnail Image */}
                        <div className="aspect-[4/3] w-full overflow-hidden relative bg-black flex items-center justify-center">
                          <img
                            src={artwork.imageSrc}
                            alt={artwork.title}
                            className={`w-full h-full object-cover transition-transform duration-300 ${
                              isSelected ? "scale-105 opacity-100" : "opacity-85 group-hover:opacity-100 group-hover:scale-105"
                            }`}
                            referrerPolicy="no-referrer"
                            loading="lazy"
                          />
                          <span className="absolute bottom-1 right-1 text-[8px] font-mono bg-black/80 text-[#c9a84c] px-1 py-0.2">
                            {artwork.year}
                          </span>
                        </div>

                        {/* Details */}
                        <div className="p-2.5 space-y-1">
                          <h4 className="font-serif font-bold text-xs truncate leading-tight group-hover:text-[#c9a84c] transition-colors">
                            {artwork.title}
                          </h4>
                          <p className="text-[10px] text-neutral-400 font-sans truncate">
                            {artwork.artist}
                          </p>
                          <p className="text-[9px] text-neutral-500 font-sans truncate italic">
                            {artwork.medium}
                          </p>
                        </div>

                        {/* Action Bar */}
                        <div className="p-1.5 border-t border-white/5 bg-black/20 flex items-center justify-between">
                          <span className="text-[9px] font-mono text-neutral-400">
                            {isSelected ? "Cliquer pour retirer" : "Cliquer pour ajouter"}
                          </span>
                          <div className={`w-4 h-4 rounded-none border flex items-center justify-center ${
                            isSelected ? "bg-[#c9a84c] border-[#c9a84c] text-black" : "border-white/20 text-transparent"
                          }`}>
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Presets Masterpieces */}
          {activeTab === "presets" && (
            <div>
              {filteredPresets.length === 0 ? (
                <div className="text-center py-8 text-neutral-400 text-xs">
                  Aucun exemple ne correspond à « {searchQuery} ».
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
                  {filteredPresets.map((preset) => {
                    const isSelected = activeSeriesIds.has(preset.id);
                    return (
                      <div
                        key={preset.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => onToggleItem({
                          id: preset.id,
                          title: preset.title,
                          imageSrc: preset.url,
                          artist: preset.artist,
                          medium: preset.medium,
                          year: preset.year
                        })}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            onToggleItem({
                              id: preset.id,
                              title: preset.title,
                              imageSrc: preset.url,
                              artist: preset.artist,
                              medium: preset.medium,
                              year: preset.year
                            });
                          }
                        }}
                        className={`group border cursor-pointer relative overflow-hidden transition-all duration-300 flex flex-col justify-between select-none ${
                          isSelected
                            ? "border-[#c9a84c] ring-2 ring-[#c9a84c]/50 bg-[#c9a84c]/5 shadow-lg shadow-[#c9a84c]/10"
                            : (isDark 
                                ? "bg-[#141414] border-white/10 hover:border-[#c9a84c]/50 hover:bg-[#1a1a1a]" 
                                : "bg-stone-50 border-stone-200 hover:border-[#c9a84c]/50 hover:bg-stone-100")
                        }`}
                      >
                        {/* Status Ribbon / Badge */}
                        <div className="absolute top-1.5 left-1.5 z-10">
                          {isSelected ? (
                            <span className="flex items-center gap-1 bg-[#c9a84c] text-black font-mono font-black text-[9px] px-2 py-0.5 uppercase tracking-wider shadow">
                              <Check className="w-3 h-3 stroke-[3]" /> Dans la série
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 bg-black/70 text-neutral-300 group-hover:text-white font-mono text-[9px] px-1.5 py-0.5 uppercase tracking-wider border border-white/10">
                              <Plus className="w-2.5 h-2.5" /> Ajouter
                            </span>
                          )}
                        </div>

                        {/* Thumbnail Image */}
                        <div className="aspect-[4/3] w-full overflow-hidden relative bg-black flex items-center justify-center">
                          <img
                            src={preset.url}
                            alt={preset.title}
                            className={`w-full h-full object-cover transition-transform duration-300 ${
                              isSelected ? "scale-105 opacity-100" : "opacity-85 group-hover:opacity-100 group-hover:scale-105"
                            }`}
                            referrerPolicy="no-referrer"
                            loading="lazy"
                          />
                          <span className="absolute bottom-1 right-1 text-[8px] font-mono bg-black/80 text-[#c9a84c] px-1 py-0.2">
                            {preset.year}
                          </span>
                        </div>

                        {/* Details */}
                        <div className="p-2.5 space-y-1">
                          <h4 className="font-serif font-bold text-xs truncate leading-tight group-hover:text-[#c9a84c] transition-colors">
                            {preset.title}
                          </h4>
                          <p className="text-[10px] text-neutral-400 font-sans truncate">
                            {preset.artist}
                          </p>
                          <p className="text-[9px] text-neutral-500 font-sans truncate italic">
                            {preset.medium}
                          </p>
                        </div>

                        {/* Action Bar */}
                        <div className="p-1.5 border-t border-white/5 bg-black/20 flex items-center justify-between">
                          <span className="text-[9px] font-mono text-neutral-400">
                            {isSelected ? "Cliquer pour retirer" : "Cliquer pour ajouter"}
                          </span>
                          <div className={`w-4 h-4 rounded-none border flex items-center justify-center ${
                            isSelected ? "bg-[#c9a84c] border-[#c9a84c] text-black" : "border-white/20 text-transparent"
                          }`}>
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-[#c9a84c]/20 bg-black/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-none border border-[#c9a84c] bg-[#c9a84c]/20 flex items-center justify-center text-[#c9a84c]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-[#c9a84c] uppercase tracking-wider block">
                Série Active : {activeSeries.length} ŒUVRE{activeSeries.length > 1 ? "S" : ""}
              </span>
              <p className="text-[11px] text-neutral-400 font-sans">
                {activeSeries.length > 1 
                  ? "L'analyse globale comparera le style, la palette et le discours de l'ensemble de ces créations."
                  : "Sélectionnez 2 œuvres ou plus pour débloquer l'analyse globale de série."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {onUploadNewFiles && (
              <label className="flex-1 sm:flex-initial px-3.5 py-2 border border-white/20 hover:border-white/40 text-xs font-mono uppercase transition-colors cursor-pointer flex items-center justify-center gap-1.5 text-neutral-300">
                <UploadCloud className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">+ Autre fichier</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      onUploadNewFiles(Array.from(e.target.files));
                    }
                  }}
                  className="hidden"
                />
              </label>
            )}

            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-6 py-2 bg-gradient-to-r from-[#b8973e] via-[#c9a84c] to-[#e4cb78] text-black font-mono font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Valider la Série ({activeSeries.length})</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
