/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Sparkles, 
  UploadCloud, 
  Palette, 
  FileText, 
  Building2, 
  PartyPopper, 
  Briefcase, 
  Radio, 
  CheckCircle2,
  ArrowRight
} from "lucide-react";

interface ExplanationSectionProps {
  theme?: "dark-gold" | "light";
  onOpenArtworkTools?: () => void;
  onOpenGalleryBridge?: () => void;
  onOpenVernissageModal?: () => void;
  onOpenCollectorSales?: () => void;
  onOpenPressSocial?: () => void;
  onOpenProfileModal?: () => void;
}

export default function ExplanationSection({
  theme = "dark-gold",
  onOpenArtworkTools,
  onOpenGalleryBridge,
  onOpenVernissageModal,
  onOpenCollectorSales,
  onOpenPressSocial,
  onOpenProfileModal,
}: ExplanationSectionProps) {
  // Masqué par défaut comme demandé par l'utilisateur
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const isDark = theme === "dark-gold";

  return (
    <section className="w-full max-w-4xl mx-auto my-6 sm:my-8 transition-all duration-300">
      {/* Barre Principale Pliante : Écrit en GROS "EXPLICATION" avec une grande flèche */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className={`w-full p-4 sm:p-6 border-2 transition-all duration-300 cursor-pointer select-none flex items-center justify-between gap-4 group rounded-none shadow-md ${
          isDark
            ? isOpen
              ? "bg-[#14120a] border-[#c9a84c] text-white"
              : "bg-[#0f0f0f] border-[#c9a84c]/60 hover:border-[#c9a84c] hover:bg-[#16140d] text-neutral-200"
            : isOpen
              ? "bg-amber-50/90 border-[#c9a84c] text-stone-900"
              : "bg-white border-stone-300 hover:border-[#c9a84c] hover:bg-stone-50 text-stone-900"
        }`}
      >
        <div className="flex items-center gap-4 sm:gap-6 min-w-0">
          <div className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center flex-shrink-0 border transition-all ${
            isDark 
              ? "bg-[#c9a84c]/20 border-[#c9a84c] text-[#c9a84c] group-hover:bg-[#c9a84c] group-hover:text-black" 
              : "bg-amber-100 border-[#c9a84c] text-[#9c7d2b] group-hover:bg-[#c9a84c] group-hover:text-black"
          }`}>
            <HelpCircle className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>

          <div className="min-w-0 text-left">
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* ÉCRIT EN GROS EXPLICATION */}
              <h2 className="font-serif font-black text-2xl sm:text-3xl md:text-4xl tracking-wider uppercase leading-none">
                EXPLICATION
              </h2>
              <span className="text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 uppercase bg-[#c9a84c] text-black">
                GUIDE DÉBUTANT
              </span>
            </div>
            <p className={`text-xs sm:text-sm font-sans mt-1.5 line-clamp-1 sm:line-clamp-none ${
              isDark ? "text-neutral-400" : "text-stone-600"
            }`}>
              {isOpen 
                ? "Cliquez sur la flèche pour refermer le guide d'utilisation" 
                : "Comment fonctionne l'application ? Tout savoir en 3 étapes simples (cliquez pour dérouler)"}
            </p>
          </div>
        </div>

        {/* GRANDE FLÈCHE INTERACTIVE */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs font-mono font-bold hidden md:inline text-[#c9a84c]">
            {isOpen ? "Masquer" : "Regarder l'explication"}
          </span>
          <div className={`w-10 h-10 sm:w-12 sm:h-12 border flex items-center justify-center transition-transform duration-300 ${
            isDark ? "border-[#c9a84c]/60 bg-black group-hover:border-[#c9a84c]" : "border-stone-300 bg-white group-hover:border-[#c9a84c]"
          }`}>
            {isOpen ? (
              <ChevronUp className="w-6 h-6 sm:w-7 sm:h-7 text-[#c9a84c] transition-transform" />
            ) : (
              <ChevronDown className="w-6 h-6 sm:w-7 sm:h-7 text-[#c9a84c] transition-transform group-hover:translate-y-0.5" />
            )}
          </div>
        </div>
      </div>

      {/* CONTENU DE L'EXPLICATION DÉPLIÉE */}
      {isOpen && (
        <div className={`border-2 border-t-0 p-5 sm:p-8 space-y-8 animate-fadeIn ${
          isDark ? "bg-[#0a0a0a] border-[#c9a84c] text-white" : "bg-white border-[#c9a84c] text-stone-900 shadow-xl"
        }`}>
          {/* Bloc 1 : En quelques mots */}
          <div className={`p-4 sm:p-6 border ${
            isDark ? "bg-[#14120c] border-[#c9a84c]/40" : "bg-amber-50/70 border-[#c9a84c]/40"
          }`}>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#c9a84c]">
              EN QUELQUES MOTS
            </span>
            <h3 className="font-serif font-bold text-lg sm:text-xl mt-1 mb-2">
              L'Œil de l'Atelier : Votre Assistant d'Art Augmenté
            </h3>
            <p className={`text-xs sm:text-sm leading-relaxed font-sans ${isDark ? "text-neutral-300" : "text-stone-700"}`}>
              Cette application a été conçue pour les <strong>artistes peintres, sculpteurs, photographes, illustrateurs et galeristes</strong>. 
              Elle met à votre service la puissance de l'Intelligence Artificielle de Google (Gemini) pour analyser vos œuvres en profondeur, 
              rédiger vos textes de médiation culturelle, certifier l'authenticité de vos toiles, calculer une cote financière réaliste 
              et préparer vos candidatures auprès des galeries d'art.
            </p>
          </div>

          {/* Bloc 2 : Les 3 Étapes Ultra-Simples */}
          <div>
            <div className="mb-4">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#c9a84c]">
                MODE D'EMPLOI PAS À PAS
              </span>
              <h3 className="font-serif font-bold text-base sm:text-lg uppercase tracking-wide">
                Comment l'utiliser en 3 étapes simples :
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Étape 1 */}
              <div className={`p-4 sm:p-5 border flex flex-col justify-between ${
                isDark ? "bg-black/50 border-white/10" : "bg-stone-50 border-stone-200"
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-mono font-black text-[#c9a84c]">01</span>
                    <UploadCloud className="w-5 h-5 text-[#c9a84c]" />
                  </div>
                  <h4 className="font-serif font-bold text-sm uppercase mb-2">
                    1. Déposez votre Image
                  </h4>
                  <p className={`text-xs leading-relaxed ${isDark ? "text-neutral-400" : "text-stone-600"}`}>
                    Glissez-déposez la photo d'un tableau, dessin, sculpture ou photo dans la zone d'importation au-dessus. 
                    Vous pouvez aussi sélectionner plusieurs toiles en même temps pour créer une <strong>série de vernissage</strong>.
                  </p>
                </div>
                <p className="text-[10px] font-mono text-[#c9a84c] mt-3 font-semibold">
                  ✓ Formats : JPEG, PNG, WEBP
                </p>
              </div>

              {/* Étape 2 */}
              <div className={`p-4 sm:p-5 border flex flex-col justify-between ${
                isDark ? "bg-black/50 border-white/10" : "bg-stone-50 border-stone-200"
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-mono font-black text-[#c9a84c]">02</span>
                    <Palette className="w-5 h-5 text-[#c9a84c]" />
                  </div>
                  <h4 className="font-serif font-bold text-sm uppercase mb-2">
                    2. Choisissez une Expertise
                  </h4>
                  <p className={`text-xs leading-relaxed ${isDark ? "text-neutral-400" : "text-stone-600"}`}>
                    Sélectionnez l'outil de votre choix parmi les <strong>16 expertises d'atelier</strong> : 
                    Analyse de style, harmonie chromatique, estimation de prix, cartel muséal, certificat d'authenticité, démarche d'artiste ou critique d'art.
                  </p>
                </div>
                <p className="text-[10px] font-mono text-[#c9a84c] mt-3 font-semibold">
                  ✓ Analyse instantanée en 3-5 secondes
                </p>
              </div>

              {/* Étape 3 */}
              <div className={`p-4 sm:p-5 border flex flex-col justify-between ${
                isDark ? "bg-black/50 border-white/10" : "bg-stone-50 border-stone-200"
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-mono font-black text-[#c9a84c]">03</span>
                    <FileText className="w-5 h-5 text-[#c9a84c]" />
                  </div>
                  <h4 className="font-serif font-bold text-sm uppercase mb-2">
                    3. Exportez vos Documents
                  </h4>
                  <p className={`text-xs leading-relaxed ${isDark ? "text-neutral-400" : "text-stone-600"}`}>
                    En un clic, copiez le résultat dans votre presse-papier, téléchargez-le en format texte ou imprimez directement 
                    votre <strong>Certificat d'Authenticité (COA)</strong> ou votre <strong>Cartel d'exposition</strong> prêt à être affiché au mur.
                  </p>
                </div>
                <p className="text-[10px] font-mono text-[#c9a84c] mt-3 font-semibold">
                  ✓ Export PDF, Impression & Carnet de bord
                </p>
              </div>
            </div>
          </div>

          {/* Bloc 3 : Les 5 Pôles & Passerelles Métiers (36 Outils au total) */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 border-b pb-2 border-[#c9a84c]/20">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#c9a84c]">
                  ÉCOSYSTÈME COMPLET
                </span>
                <h3 className="font-serif font-bold text-base sm:text-lg uppercase tracking-wide">
                  Les 5 Passerelles Métiers (36 Outils d'Excellence)
                </h3>
              </div>
              <span className="text-[11px] font-mono opacity-60">
                Disponibles à tout moment dans le menu ou ci-dessous
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Outils d'Atelier */}
              <div 
                onClick={onOpenArtworkTools}
                className={`p-3.5 border text-left cursor-pointer transition-all hover:border-[#c9a84c] flex flex-col justify-between ${
                  isDark ? "bg-[#111] hover:bg-[#16140e] border-white/10" : "bg-stone-50 hover:bg-amber-50 border-stone-200"
                }`}
              >
                <div>
                  <div className="text-xl mb-1.5">🎨</div>
                  <h5 className="font-serif font-bold text-xs uppercase text-[#c9a84c]">16 Outils d'Atelier</h5>
                  <p className="text-[11px] font-sans opacity-80 mt-1 leading-snug">
                    Style, palette, cotation financière, certificat COA, cartel, poésie & critique.
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#c9a84c] mt-2 flex items-center gap-1">
                  Ouvrir <ArrowRight className="w-3 h-3" />
                </span>
              </div>

              {/* Passerelle Galeries */}
              <div 
                onClick={onOpenGalleryBridge}
                className={`p-3.5 border text-left cursor-pointer transition-all hover:border-[#c9a84c] flex flex-col justify-between ${
                  isDark ? "bg-[#111] hover:bg-[#16140e] border-white/10" : "bg-stone-50 hover:bg-amber-50 border-stone-200"
                }`}
              >
                <div>
                  <div className="text-xl mb-1.5">🏛️</div>
                  <h5 className="font-serif font-bold text-xs uppercase text-[#c9a84c]">Passerelle Galeries</h5>
                  <p className="text-[11px] font-sans opacity-80 mt-1 leading-snug">
                    Dossiers de candidature, ciblage des directeurs de galeries & bourses d'exposition.
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#c9a84c] mt-2 flex items-center gap-1">
                  Ouvrir <ArrowRight className="w-3 h-3" />
                </span>
              </div>

              {/* Soirées & Vernissages */}
              <div 
                onClick={onOpenVernissageModal}
                className={`p-3.5 border text-left cursor-pointer transition-all hover:border-[#c9a84c] flex flex-col justify-between ${
                  isDark ? "bg-[#111] hover:bg-[#16140e] border-white/10" : "bg-stone-50 hover:bg-amber-50 border-stone-200"
                }`}
              >
                <div>
                  <div className="text-xl mb-1.5">🥂</div>
                  <h5 className="font-serif font-bold text-xs uppercase text-[#c9a84c]">Vernissages</h5>
                  <p className="text-[11px] font-sans opacity-80 mt-1 leading-snug">
                    Scénographie, rétroplanning, carton d'invitation VIP & discours de vernissage.
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#c9a84c] mt-2 flex items-center gap-1">
                  Ouvrir <ArrowRight className="w-3 h-3" />
                </span>
              </div>

              {/* Ventes Collectionneurs */}
              <div 
                onClick={onOpenCollectorSales}
                className={`p-3.5 border text-left cursor-pointer transition-all hover:border-[#c9a84c] flex flex-col justify-between ${
                  isDark ? "bg-[#111] hover:bg-[#16140e] border-white/10" : "bg-stone-50 hover:bg-amber-50 border-stone-200"
                }`}
              >
                <div>
                  <div className="text-xl mb-1.5">💼</div>
                  <h5 className="font-serif font-bold text-xs uppercase text-[#c9a84c]">Ventes & Collectionneurs</h5>
                  <p className="text-[11px] font-sans opacity-80 mt-1 leading-snug">
                    Fiches d'offres privées, pitchs d'achat, défiscalisation entreprises Art 238 bis.
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#c9a84c] mt-2 flex items-center gap-1">
                  Ouvrir <ArrowRight className="w-3 h-3" />
                </span>
              </div>

              {/* Presse & Réseaux */}
              <div 
                onClick={onOpenPressSocial}
                className={`p-3.5 border text-left cursor-pointer transition-all hover:border-[#c9a84c] flex flex-col justify-between ${
                  isDark ? "bg-[#111] hover:bg-[#16140e] border-white/10" : "bg-stone-50 hover:bg-amber-50 border-stone-200"
                }`}
              >
                <div>
                  <div className="text-xl mb-1.5">📣</div>
                  <h5 className="font-serif font-bold text-xs uppercase text-[#c9a84c]">Presse & Réseaux</h5>
                  <p className="text-[11px] font-sans opacity-80 mt-1 leading-snug">
                    Communiqués de presse muséaux, scripts Reels/TikTok et aides publiques DRAC.
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#c9a84c] mt-2 flex items-center gap-1">
                  Ouvrir <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>

          {/* Bloc 4 : Personnalisation facultative & bouton refermer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#c9a84c]/20">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <p className="text-xs font-sans opacity-80">
                Vous pouvez personnaliser votre nom d'artiste et vos coordonnées à tout moment via le bouton « Profil Artiste » dans l'en-tête.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {onOpenProfileModal && (
                <button
                  type="button"
                  onClick={onOpenProfileModal}
                  className="px-3 py-1.5 border border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-black font-bold uppercase tracking-wider text-[10px] transition-colors"
                >
                  Configurer mon profil
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3.5 py-1.5 bg-[#c9a84c] text-black hover:bg-white font-bold uppercase tracking-wider text-[10px] transition-colors flex items-center gap-1"
              >
                <ChevronUp className="w-3.5 h-3.5" />
                Refermer l'explication
              </button>
            </div>
          </div>

        </div>
      )}
    </section>
  );
}
