/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ArtistProfile } from "../types.js";
import { 
  User, Instagram, Globe, Mail, FileText, Sparkles, 
  Award, Eye, EyeOff, ChevronDown, ChevronUp, Key, Check
} from "lucide-react";

interface ArtistProfileFormProps {
  profile: ArtistProfile;
  setProfile: React.Dispatch<React.SetStateAction<ArtistProfile>>;
  customApiKey: string;
  setCustomApiKey: (key: string) => void;
  theme?: "dark-gold" | "light";
}

export default function ArtistProfileForm({
  profile,
  setProfile,
  customApiKey,
  setCustomApiKey,
  theme = "dark-gold"
}: ArtistProfileFormProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileDetailsCollapsed, setIsProfileDetailsCollapsed] = useState(false);
  const [isApiKeyCollapsed, setIsApiKeyCollapsed] = useState(false);

  // Load collapse state from localStorage
  useEffect(() => {
    const savedCollapsed = localStorage.getItem("oeilAtelier_profile_collapsed");
    if (savedCollapsed === "true") {
      setIsCollapsed(true);
    }
    const savedDetailsCollapsed = localStorage.getItem("oeilAtelier_profile_details_collapsed");
    if (savedDetailsCollapsed === "true") {
      setIsProfileDetailsCollapsed(true);
    }
    const savedApiKeyCollapsed = localStorage.getItem("oeilAtelier_api_key_collapsed");
    if (savedApiKeyCollapsed === "true") {
      setIsApiKeyCollapsed(true);
    }
  }, []);

  const toggleCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem("oeilAtelier_profile_collapsed", String(nextState));
  };

  const toggleDetailsCollapse = () => {
    const nextState = !isProfileDetailsCollapsed;
    setIsProfileDetailsCollapsed(nextState);
    localStorage.setItem("oeilAtelier_profile_details_collapsed", String(nextState));
  };

  const toggleApiKeyCollapse = () => {
    const nextState = !isApiKeyCollapsed;
    setIsApiKeyCollapsed(nextState);
    localStorage.setItem("oeilAtelier_api_key_collapsed", String(nextState));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updated = { ...profile, [name]: value };
    setProfile(updated);
    localStorage.setItem("oeilAtelier_profile", JSON.stringify(updated));
  };

  const handleSaveApiKey = () => {
    localStorage.setItem("oeilAtelier_custom_key", customApiKey);
    setIsSaved(true);
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomApiKey(e.target.value);
    setIsSaved(false);
  };

  const isDark = theme === "dark-gold";

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn space-y-4">
      {/* Header Bar with Toggle (Masquer / Afficher) */}
      <div 
        onClick={toggleCollapse}
        className={`border p-4 flex items-center justify-between cursor-pointer select-none transition-all duration-300 shadow-sm ${
          isDark 
            ? "bg-[#0E0E0E] border-white/10 hover:border-[#c9a84c]/30 text-white" 
            : "bg-white border-stone-200 hover:border-[#c9a84c]/40 text-stone-900"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 transition-colors ${isDark ? "bg-black text-[#c9a84c]" : "bg-[#FAF7F2] text-[#9c7d2b]"}`}>
            <User className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h3 className={`text-xs font-sans font-bold tracking-[0.25em] uppercase transition-colors ${
              isDark ? "text-[#c9a84c]" : "text-[#9c7d2b]"
            }`}>
              {profile.name ? `Atelier de ${profile.name}` : "Profil de l'Artiste & Configuration"}
            </h3>
            <p className="text-[10px] font-sans text-neutral-500 tracking-wider">
              {isCollapsed 
                ? "Cliquez pour déployer et configurer votre profil complet d'artiste" 
                : "Cliquez pour masquer cet onglet de configuration pour libérer l'espace"
              }
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Quick status dots */}
          {profile.name && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-none text-[9px] font-mono tracking-widest uppercase bg-emerald-950/40 text-emerald-400 border border-emerald-800/30">
              Profil Complété
            </span>
          )}
          {customApiKey && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-none text-[9px] font-mono tracking-widest uppercase bg-amber-950/40 text-[#c9a84c] border border-[#c9a84c]/20">
              Clé API Active
            </span>
          )}

          <button 
            type="button"
            className={`p-1.5 transition-colors ${isDark ? "text-neutral-400 hover:text-white" : "text-stone-500 hover:text-stone-950"}`}
          >
            {isCollapsed ? <ChevronDown className="w-5 h-5 animate-pulse" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expandable Panel */}
      {!isCollapsed && (
        <div className="space-y-6 animate-slideDown">
          {/* Main Grid for Artist Profile Details */}
          <div className={`border p-6 sm:p-8 rounded-none shadow-md transition-colors duration-300 ${
            isDark ? "bg-[#0E0E0E] border-white/10" : "bg-white border-stone-200"
          }`}>
            <div 
              onClick={toggleDetailsCollapse}
              className="border-b border-[#c9a84c]/20 pb-4 mb-6 flex items-center justify-between cursor-pointer select-none hover:opacity-80 transition-all"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#c9a84c]" />
                <h4 className={`text-xs font-sans font-bold tracking-[0.2em] uppercase ${
                  isDark ? "text-[#c9a84c]" : "text-[#9c7d2b]"
                }`}>
                  DÉTAILS COMPLETS DE L'ARTISTE
                </h4>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-[10px] font-sans text-neutral-500 italic hidden sm:block">
                  Ces informations guident l'IA dans l'analyse de vos créations.
                </p>
                <span className={`p-1.5 transition-colors ${isDark ? "text-neutral-400 hover:text-white" : "text-stone-500 hover:text-stone-950"}`}>
                  {isProfileDetailsCollapsed ? <ChevronDown className="w-4 h-4 animate-pulse" /> : <ChevronUp className="w-4 h-4" />}
                </span>
              </div>
            </div>

            {!isProfileDetailsCollapsed && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slideDown">
              
              {/* Left Column: Identity & Media */}
              <div className="space-y-5">
                <div className="space-y-1.5 text-left">
                  <label className="text-[9px] font-sans font-bold tracking-widest uppercase text-neutral-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#c9a84c]" />
                    Nom d'Artiste / Pseudonyme *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    placeholder="ex: Valentin Richaud, Tintoon"
                    className={`w-full border text-xs py-2.5 px-3 rounded-none outline-none transition-colors duration-200 font-sans ${
                      isDark
                        ? "bg-[#050505] border-white/10 focus:border-[#c9a84c]/50 text-white placeholder:text-neutral-600"
                        : "bg-[#FAF7F2] border-stone-200 focus:border-[#c9a84c] text-stone-900 placeholder:text-stone-400"
                    }`}
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[9px] font-sans font-bold tracking-widest uppercase text-neutral-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#c9a84c]" />
                    Médiums & Techniques de prédilection
                  </label>
                  <input
                    type="text"
                    name="mediums"
                    value={profile.mediums || ""}
                    onChange={handleInputChange}
                    placeholder="ex: Peinture acrylique, Huile classique, Estampe, Photo argentique"
                    className={`w-full border text-xs py-2.5 px-3 rounded-none outline-none transition-colors duration-200 font-sans ${
                      isDark
                        ? "bg-[#050505] border-white/10 focus:border-[#c9a84c]/50 text-white placeholder:text-neutral-600"
                        : "bg-[#FAF7F2] border-stone-200 focus:border-[#c9a84c] text-stone-900 placeholder:text-stone-400"
                    }`}
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[9px] font-sans font-bold tracking-widest uppercase text-neutral-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#c9a84c]" />
                    Style Visuel / Courant artistique
                  </label>
                  <input
                    type="text"
                    name="style"
                    value={profile.style}
                    onChange={handleInputChange}
                    placeholder="ex: Abstraction lyrique, Chiaroscuro, Minimalisme, Expressionnisme"
                    className={`w-full border text-xs py-2.5 px-3 rounded-none outline-none transition-colors duration-200 font-sans ${
                      isDark
                        ? "bg-[#050505] border-white/10 focus:border-[#c9a84c]/50 text-white placeholder:text-neutral-600"
                        : "bg-[#FAF7F2] border-stone-200 focus:border-[#c9a84c] text-stone-900 placeholder:text-stone-400"
                    }`}
                  />
                </div>

                {/* Socials & Website in Sub-grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[9px] font-sans font-bold tracking-widest uppercase text-neutral-400 flex items-center gap-1.5">
                      <Instagram className="w-3.5 h-3.5 text-[#c9a84c]" />
                      Instagram
                    </label>
                    <input
                      type="text"
                      name="instagram"
                      value={profile.instagram}
                      onChange={handleInputChange}
                      placeholder="@votre.compte"
                      className={`w-full border text-xs py-2.5 px-3 rounded-none outline-none transition-colors duration-200 font-sans ${
                        isDark
                          ? "bg-[#050505] border-white/10 focus:border-[#c9a84c]/50 text-white placeholder:text-neutral-600"
                          : "bg-[#FAF7F2] border-stone-200 focus:border-[#c9a84c] text-stone-900 placeholder:text-stone-400"
                      }`}
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-[9px] font-sans font-bold tracking-widest uppercase text-neutral-400 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-[#c9a84c]" />
                      Site Portfolio Web
                    </label>
                    <input
                      type="text"
                      name="web"
                      value={profile.web}
                      onChange={handleInputChange}
                      placeholder="https://monportfolio.com"
                      className={`w-full border text-xs py-2.5 px-3 rounded-none outline-none transition-colors duration-200 font-sans ${
                        isDark
                          ? "bg-[#050505] border-white/10 focus:border-[#c9a84c]/50 text-white placeholder:text-neutral-600"
                          : "bg-[#FAF7F2] border-stone-200 focus:border-[#c9a84c] text-stone-900 placeholder:text-stone-400"
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[9px] font-sans font-bold tracking-widest uppercase text-neutral-400 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#c9a84c]" />
                    Email de Contact / Collectionneurs
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={profile.contactEmail || ""}
                    onChange={handleInputChange}
                    placeholder="contact@artiste.com"
                    className={`w-full border text-xs py-2.5 px-3 rounded-none outline-none transition-colors duration-200 font-sans ${
                      isDark
                        ? "bg-[#050505] border-white/10 focus:border-[#c9a84c]/50 text-white placeholder:text-neutral-600"
                        : "bg-[#FAF7F2] border-stone-200 focus:border-[#c9a84c] text-stone-900 placeholder:text-stone-400"
                    }`}
                  />
                </div>
              </div>

              {/* Right Column: Narrative, Biography & Philosophy */}
              <div className="space-y-5">
                <div className="space-y-1.5 text-left">
                  <label className="text-[9px] font-sans font-bold tracking-widest uppercase text-neutral-400 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#c9a84c]" />
                    Note d'Intention Artistique / Démarche
                  </label>
                  <textarea
                    name="desc"
                    value={profile.desc}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Décrivez votre vision artistique, vos thèmes clés et l'esprit de vos œuvres d'atelier..."
                    className={`w-full border text-xs py-2.5 px-3 rounded-none outline-none transition-colors duration-200 font-sans resize-none leading-relaxed ${
                      isDark
                        ? "bg-[#050505] border-white/10 focus:border-[#c9a84c]/50 text-white placeholder:text-neutral-600"
                        : "bg-[#FAF7F2] border-stone-200 focus:border-[#c9a84c] text-stone-900 placeholder:text-stone-400"
                    }`}
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[9px] font-sans font-bold tracking-widest uppercase text-neutral-400 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#c9a84c]" />
                    Philosophie de l'Atelier
                  </label>
                  <textarea
                    name="philosophy"
                    value={profile.philosophy || ""}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Quelle philosophie régit votre processus de création ? (ex: recherche de la lumière pure, esthétique du chaos...)"
                    className={`w-full border text-xs py-2.5 px-3 rounded-none outline-none transition-colors duration-200 font-sans resize-none leading-relaxed ${
                      isDark
                        ? "bg-[#050505] border-white/10 focus:border-[#c9a84c]/50 text-white placeholder:text-neutral-600"
                        : "bg-[#FAF7F2] border-stone-200 focus:border-[#c9a84c] text-stone-900 placeholder:text-stone-400"
                    }`}
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[9px] font-sans font-bold tracking-widest uppercase text-neutral-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#c9a84c]" />
                    Biographie Artistique complète
                  </label>
                  <textarea
                    name="bio"
                    value={profile.bio || ""}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Votre parcours, vos formations artistiques, votre histoire créative..."
                    className={`w-full border text-xs py-2.5 px-3 rounded-none outline-none transition-colors duration-200 font-sans resize-none leading-relaxed ${
                      isDark
                        ? "bg-[#050505] border-white/10 focus:border-[#c9a84c]/50 text-white placeholder:text-neutral-600"
                        : "bg-[#FAF7F2] border-stone-200 focus:border-[#c9a84c] text-stone-900 placeholder:text-stone-400"
                    }`}
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[9px] font-sans font-bold tracking-widest uppercase text-neutral-400 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#c9a84c]" />
                    Expositions, Distinctions & Parutions majeures
                  </label>
                  <textarea
                    name="achievements"
                    value={profile.achievements || ""}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Listez vos principales galeries, prix reçus ou foires d'art contemporain auxquelles vous avez participé..."
                    className={`w-full border text-xs py-2.5 px-3 rounded-none outline-none transition-colors duration-200 font-sans resize-none leading-relaxed ${
                      isDark
                        ? "bg-[#050505] border-white/10 focus:border-[#c9a84c]/50 text-white placeholder:text-neutral-600"
                        : "bg-[#FAF7F2] border-stone-200 focus:border-[#c9a84c] text-stone-900 placeholder:text-stone-400"
                    }`}
                  />
                </div>
              </div>

            </div>
            )}
          </div>

          {/* 3. API Key Panel */}
          <div className={`border p-6 rounded-none shadow-sm transition-colors duration-300 relative ${
            isDark ? "bg-[#0E0E0E] border-white/10" : "bg-white border-stone-200"
          }`}>
            <div 
              onClick={toggleApiKeyCollapse}
              className="border-b border-[#c9a84c]/20 pb-4 mb-6 flex items-center justify-between cursor-pointer select-none hover:opacity-80 transition-all"
            >
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-[#c9a84c]" />
                <h4 className={`text-xs font-sans font-bold tracking-[0.2em] uppercase ${
                  isDark ? "text-[#c9a84c]" : "text-[#9c7d2b]"
                }`}>
                  CLÉ API GOOGLE GEMINI PERSONNELLE (OPTIONNELLE)
                </h4>
              </div>
              <div className="flex items-center gap-3">
                <span className={`p-1.5 transition-colors ${isDark ? "text-neutral-400 hover:text-white" : "text-stone-500 hover:text-stone-950"}`}>
                  {isApiKeyCollapsed ? <ChevronDown className="w-4 h-4 animate-pulse" /> : <ChevronUp className="w-4 h-4" />}
                </span>
              </div>
            </div>
            
            {!isApiKeyCollapsed && (
              <div className="space-y-4 animate-slideDown">
                <div className="flex flex-col sm:flex-row items-stretch gap-4">
                  <div className="flex-1 relative flex items-center">
                    <div className="absolute left-3 text-neutral-500">
                      <Key className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      value={customApiKey}
                      onChange={handleApiKeyChange}
                      placeholder="Saisissez votre clé API Google Gemini pour contourner les quotas"
                      className={`w-full border text-xs py-2.5 pl-10 pr-3 rounded-none outline-none transition-colors duration-200 font-mono tracking-widest ${
                        isDark
                          ? "bg-[#050505] border-white/10 focus:border-[#c9a84c]/50 text-white placeholder:text-neutral-700"
                          : "bg-[#FAF7F2] border-stone-200 focus:border-[#c9a84c] text-stone-900 placeholder:text-stone-400"
                      }`}
                    />
                  </div>
                  
                  <button
                    onClick={handleSaveApiKey}
                    className={`px-6 py-2.5 text-[10px] font-sans font-bold tracking-[0.2em] uppercase transition-all duration-300 rounded-none border ${
                      isDark
                        ? "border-[#c9a84c]/30 text-[#c9a84c] bg-black hover:bg-[#c9a84c] hover:text-black"
                        : "border-[#9c7d2b]/30 text-[#9c7d2b] bg-white hover:bg-[#9c7d2b] hover:text-white"
                    }`}
                  >
                    MÉMORISER LA CLÉ
                  </button>
                </div>

                {/* Saved Status Indicator */}
                {((customApiKey && isSaved) || (!customApiKey && localStorage.getItem("oeilAtelier_custom_key"))) && (
                  <div className="text-[10px] uppercase tracking-wider text-emerald-500 font-bold mt-2 flex items-center gap-1.5 animate-fadeIn">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    Clé API Gemini mémorisée localement en toute sécurité
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
