/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { X, User, Sparkles } from "lucide-react";
import ArtistProfileForm from "./ArtistProfileForm.js";
import { ArtistProfile } from "../types.js";

interface ArtistProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ArtistProfile;
  setProfile: React.Dispatch<React.SetStateAction<ArtistProfile>>;
  customApiKey: string;
  setCustomApiKey: (key: string) => void;
  theme?: "dark-gold" | "light";
}

export default function ArtistProfileModal({
  isOpen,
  onClose,
  profile,
  setProfile,
  customApiKey,
  setCustomApiKey,
  theme = "dark-gold"
}: ArtistProfileModalProps) {
  if (!isOpen) return null;

  const isDark = theme === "dark-gold";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className={`w-full max-w-4xl max-h-[90vh] flex flex-col border shadow-2xl rounded-none overflow-hidden transition-colors ${
          isDark ? "bg-[#0d0d0d] border-[#c9a84c] text-white" : "bg-white border-stone-300 text-stone-900"
        }`}
      >
        {/* Modal Header */}
        <div className={`p-4 sm:p-5 flex items-center justify-between border-b ${
          isDark ? "border-white/10 bg-black/60" : "border-stone-200 bg-stone-50"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 flex items-center justify-center border ${
              isDark ? "bg-[#c9a84c]/20 border-[#c9a84c] text-[#c9a84c]" : "bg-amber-100 border-[#c9a84c] text-[#9c7d2b]"
            }`}>
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base sm:text-lg tracking-wide uppercase">
                  Profil & Démarche de l'Artiste
                </h3>
                <span className="text-[10px] font-mono bg-[#c9a84c] text-black font-black px-2 py-0.5 uppercase">
                  Personnalisation
                </span>
              </div>
              <p className={`text-xs font-sans mt-0.5 ${isDark ? "text-neutral-400" : "text-stone-500"}`}>
                Vos informations permettent à l'IA d'adapter les analyses, cartels et critiques à votre identité.
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

        {/* Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          <ArtistProfileForm
            profile={profile}
            setProfile={setProfile}
            customApiKey={customApiKey}
            setCustomApiKey={setCustomApiKey}
            theme={theme}
          />
        </div>

        {/* Modal Footer */}
        <div className={`p-4 border-t flex items-center justify-between gap-3 ${
          isDark ? "border-white/10 bg-black/60" : "border-stone-200 bg-stone-50"
        }`}>
          <p className="text-[11px] font-mono opacity-70">
            {profile.name.trim() ? `Artiste actif : « ${profile.name} »` : "Aucun nom renseigné pour le moment"}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#c9a84c] hover:bg-white text-black font-bold uppercase tracking-wider text-xs transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Valider et Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
