/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Globe, Check, Search, X, Sparkles } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext.js";
import { SupportedLanguage } from "../i18n/types.js";

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: "dark-gold" | "light";
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  isOpen,
  onClose,
  theme
}) => {
  const { language, setLanguage, supportedLanguages, t } = useLanguage();
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  const isDark = theme === "dark-gold";

  const filteredLanguages = supportedLanguages.filter(lang => 
    lang.name.toLowerCase().includes(search.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(search.toLowerCase()) ||
    lang.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (code: SupportedLanguage) => {
    setLanguage(code);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className={`w-full max-w-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors duration-300 ${
          isDark 
            ? "bg-[#0d0d0d] border-[#c9a84c]/50 text-white" 
            : "bg-[#FAF7F2] border-stone-300 text-stone-900"
        }`}
      >
        {/* Modal Header */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between ${
          isDark ? "border-white/10 bg-black/40" : "border-stone-200 bg-stone-100"
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#c9a84c] text-black">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg tracking-wide uppercase">
                {t("language_modal_title", "Sélectionner la Langue Officielle")}
              </h3>
              <p className="text-xs opacity-70">
                {t("language_modal_sub", "14 Langues Traduites • Curation Internationale & Audioguides")}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Multilingual Info Banner */}
        <div className="p-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une langue / Search a language (English, Español, 中文, العربية...)"
              className={`w-full pl-9 pr-3 py-2 text-xs border rounded-none focus:outline-none transition-colors ${
                isDark 
                  ? "bg-neutral-900 border-neutral-700 text-white focus:border-[#c9a84c]" 
                  : "bg-white border-stone-300 text-stone-900 focus:border-[#c9a84c]"
              }`}
            />
          </div>

          <div className={`p-2.5 border text-xs flex items-center gap-2 ${
            isDark ? "bg-[#14120c] border-[#c9a84c]/30 text-[#c9a84c]" : "bg-amber-50 border-amber-200 text-amber-900"
          }`}>
            <Sparkles className="w-4 h-4 shrink-0 text-[#c9a84c]" />
            <span className="text-[11px] leading-relaxed">
              <strong>Rayonnement International :</strong> La langue sélectionnée adapte l'interface, la voix de l'audioguide et permet à l'IA d'analyser vos toiles et de rédiger vos cartels directement dans la langue choisie.
            </span>
          </div>
        </div>

        {/* Languages Grid */}
        <div className="p-4 pt-0 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {filteredLanguages.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                className={`p-3 text-left border flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? "border-[#c9a84c] bg-[#c9a84c]/15 shadow-sm ring-1 ring-[#c9a84c]"
                    : (isDark 
                        ? "bg-black/30 border-white/10 hover:border-[#c9a84c]/50 hover:bg-white/5" 
                        : "bg-white border-stone-200 hover:border-[#c9a84c]/50 hover:bg-stone-50")
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl" role="img" aria-label={lang.name}>
                    {lang.flag}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm font-serif">{lang.nativeName}</span>
                      <span className="text-[10px] font-mono uppercase opacity-50 px-1 py-0.2 bg-black/20 border border-white/5">
                        {lang.code}
                      </span>
                    </div>
                    <span className="text-xs opacity-70 block">{lang.name}</span>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 bg-[#c9a84c] text-black rounded-full flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className={`p-3 sm:p-4 border-t flex items-center justify-between text-xs ${
          isDark ? "border-white/10 bg-black/40" : "border-stone-200 bg-stone-100"
        }`}>
          <span className="opacity-60 text-[11px] font-mono">
            14 langues officielles • Sauvegardé automatiquement
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#c9a84c] hover:bg-[#d8b85c] text-black font-bold uppercase tracking-wider text-xs transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
