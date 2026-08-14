import React, { useState } from "react";
import { 
  Sparkles, Compass, ChevronDown, ChevronUp, Palette, 
  Coins, Building2, Share2, CheckCircle2, HelpCircle, ArrowRight
} from "lucide-react";

interface AppDescriptionBannerProps {
  theme: "dark-gold" | "light";
}

export default function AppDescriptionBanner({ theme }: AppDescriptionBannerProps) {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <div className={`mb-8 border transition-all duration-300 overflow-hidden ${
      theme === "dark-gold"
        ? "bg-[#121212] border-[#c9a84c]/40 text-neutral-200"
        : "bg-white border-[#e8dfd3] text-stone-800 shadow-md"
    }`}>
      {/* Banner Header / Summary Row */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none transition-colors ${
          theme === "dark-gold" ? "hover:bg-white/5" : "hover:bg-stone-50"
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-none bg-[#c9a84c]/20 border border-[#c9a84c]/50 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-[#c9a84c]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className={`text-sm sm:text-base font-serif font-semibold tracking-tight ${
                theme === "dark-gold" ? "text-white" : "text-stone-900"
              }`}>
                Simulateur d'Atelier & Curation Plastique par IA
              </h2>
              <span className="text-[9px] font-mono font-bold tracking-widest px-2 py-0.5 uppercase bg-[#c9a84c] text-black">
                Guide Pas-à-Pas
              </span>
            </div>
            <p className={`text-xs font-sans mt-0.5 ${
              theme === "dark-gold" ? "text-neutral-400" : "text-stone-600"
            }`}>
              Suivez les 4 étapes ci-dessous pour insérer votre œuvre, simuler un changement de style, préparer un vernissage ou estimer sa valeur.
            </p>
          </div>
        </div>

        <button 
          type="button"
          className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#c9a84c] hover:underline flex-shrink-0 ml-4"
        >
          <span className="hidden sm:inline">{isOpen ? "Masquer le guide" : "Voir le mode d'emploi"}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Content */}
      {isOpen && (
        <div className={`px-4 sm:px-6 pb-6 pt-3 border-t space-y-6 animate-fadeIn ${
          theme === "dark-gold" ? "border-white/10 bg-black/40" : "border-stone-100 bg-stone-50/50"
        }`}>
          
          {/* Main Elevator Pitch */}
          <div className={`p-4 border ${
            theme === "dark-gold" ? "bg-[#c9a84c]/10 border-[#c9a84c]/30 text-neutral-200" : "bg-amber-50/80 border-[#c9a84c]/30 text-stone-800"
          }`}>
            <p className="text-xs sm:text-sm leading-relaxed font-sans">
              <strong className="font-semibold text-[#c9a84c]">Bienvenue dans le Simulateur d'Atelier :</strong> Cet outil vous accompagne pas-à-pas pour transformer n'importe quelle création visuelle (tableau, sculpture, photo) en un projet d'exposition achevé. Insérez une image unique ou importez plusieurs toiles pour simuler la continuité d'un <strong>vernissage de série</strong>, explorez des <strong>variations de style</strong>, calculez une <strong>estimation de marché</strong> et éditez vos <strong>certificats officiels</strong>.
            </p>
          </div>

          {/* Step-by-Step Pathway Diagram */}
          <div>
            <h3 className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#c9a84c] mb-3 flex items-center gap-2">
              <Compass className="w-3.5 h-3.5" /> Parcours de Simulation Pas-à-Pas (4 Étapes Simplifiées)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Step 1 Box */}
              <div className={`p-3.5 border relative ${
                theme === "dark-gold" ? "bg-neutral-900/90 border-white/10" : "bg-white border-stone-200"
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 bg-[#c9a84c]/20 text-[#c9a84c] uppercase">
                    Étape 1
                  </span>
                  <Palette className="w-4 h-4 text-[#c9a84c]" />
                </div>
                <h4 className={`text-xs font-bold uppercase tracking-wider mb-1 ${
                  theme === "dark-gold" ? "text-white" : "text-stone-900"
                }`}>
                  1. Profil & Intention
                </h4>
                <p className={`text-[11px] leading-relaxed ${
                  theme === "dark-gold" ? "text-neutral-400" : "text-stone-600"
                }`}>
                  Indiquez votre nom, démarche artistique et réseau. Le simulateur adapte automatiquement ses analyses à votre univers.
                </p>
              </div>

              {/* Step 2 Box */}
              <div className={`p-3.5 border relative ${
                theme === "dark-gold" ? "bg-neutral-900/90 border-white/10" : "bg-white border-stone-200"
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 bg-[#c9a84c]/20 text-[#c9a84c] uppercase">
                    Étape 2
                  </span>
                  <Building2 className="w-4 h-4 text-[#c9a84c]" />
                </div>
                <h4 className={`text-xs font-bold uppercase tracking-wider mb-1 ${
                  theme === "dark-gold" ? "text-white" : "text-stone-900"
                }`}>
                  2. Image ou Vernissage
                </h4>
                <p className={`text-[11px] leading-relaxed ${
                  theme === "dark-gold" ? "text-neutral-400" : "text-stone-600"
                }`}>
                  Insérez une image unique ou importez jusqu'à 50 visuels pour simuler l'accrochage et le fil conducteur d'un vernissage de série.
                </p>
              </div>

              {/* Step 3 Box */}
              <div className={`p-3.5 border relative ${
                theme === "dark-gold" ? "bg-neutral-900/90 border-white/10" : "bg-white border-stone-200"
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 bg-[#c9a84c]/20 text-[#c9a84c] uppercase">
                    Étape 3
                  </span>
                  <Sparkles className="w-4 h-4 text-[#c9a84c]" />
                </div>
                <h4 className={`text-xs font-bold uppercase tracking-wider mb-1 ${
                  theme === "dark-gold" ? "text-white" : "text-stone-900"
                }`}>
                  3. Simulation (16 Outils)
                </h4>
                <p className={`text-[11px] leading-relaxed ${
                  theme === "dark-gold" ? "text-neutral-400" : "text-stone-600"
                }`}>
                  Choisissez un module : changement de style, estimation de prix, cartel d'exposition, scénographie ou réseaux sociaux.
                </p>
              </div>

              {/* Step 4 Box */}
              <div className={`p-3.5 border relative ${
                theme === "dark-gold" ? "bg-neutral-900/90 border-white/10" : "bg-white border-stone-200"
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 bg-[#c9a84c]/20 text-[#c9a84c] uppercase">
                    Étape 4
                  </span>
                  <Coins className="w-4 h-4 text-[#c9a84c]" />
                </div>
                <h4 className={`text-xs font-bold uppercase tracking-wider mb-1 ${
                  theme === "dark-gold" ? "text-white" : "text-stone-900"
                }`}>
                  4. Bilan & Exportation
                </h4>
                <p className={`text-[11px] leading-relaxed ${
                  theme === "dark-gold" ? "text-neutral-400" : "text-stone-600"
                }`}>
                  Consultez la réponse du simulateur, éditez vos certificats légaux d'authenticité et sauvegardez dans votre Carnet de Bord.
                </p>
              </div>
            </div>
          </div>

          {/* Highlights Pills */}
          <div className={`pt-3 border-t flex flex-wrap gap-2 text-[10px] font-mono ${
            theme === "dark-gold" ? "border-white/10" : "border-stone-200"
          }`}>
            <span className={`px-2.5 py-1 border flex items-center gap-1.5 ${
              theme === "dark-gold" ? "bg-white/5 border-white/10 text-neutral-300" : "bg-white border-stone-200 text-stone-700"
            }`}>
              <CheckCircle2 className="w-3 h-3 text-[#c9a84c]" />
              Simulation d'Œuvre Unique ou de Séries Complètes (Vernissage)
            </span>
            <span className={`px-2.5 py-1 border flex items-center gap-1.5 ${
              theme === "dark-gold" ? "bg-white/5 border-white/10 text-neutral-300" : "bg-white border-stone-200 text-stone-700"
            }`}>
              <CheckCircle2 className="w-3 h-3 text-[#c9a84c]" />
              16 Modules d'Expertise Spécialisés
            </span>
            <span className={`px-2.5 py-1 border flex items-center gap-1.5 ${
              theme === "dark-gold" ? "bg-white/5 border-white/10 text-neutral-300" : "bg-white border-stone-200 text-stone-700"
            }`}>
              <CheckCircle2 className="w-3 h-3 text-[#c9a84c]" />
              Export PDF / Fiches de Cartel / Certificat COA
            </span>
            <span className={`px-2.5 py-1 border flex items-center gap-1.5 ${
              theme === "dark-gold" ? "bg-white/5 border-white/10 text-neutral-300" : "bg-white border-stone-200 text-stone-700"
            }`}>
              <CheckCircle2 className="w-3 h-3 text-[#c9a84c]" />
              Carnet de Bord d'Atelier (Historique Sécurisé)
            </span>
          </div>

        </div>
      )}
    </div>
  );
}
