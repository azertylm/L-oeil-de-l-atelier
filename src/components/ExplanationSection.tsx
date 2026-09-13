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
  ArrowRight,
  Award,
  Share2,
  BookOpen,
  Crown,
  Printer,
  ShieldCheck,
  Zap,
  Layers,
  Info,
  QrCode,
  Globe
} from "lucide-react";

interface ExplanationSectionProps {
  theme?: "dark-gold" | "light";
  onOpenArtworkTools?: () => void;
  onOpenGalleryBridge?: () => void;
  onOpenVernissageModal?: () => void;
  onOpenCollectorSales?: () => void;
  onOpenPressSocial?: () => void;
  onOpenProfileModal?: () => void;
  onOpenQrSalesModal?: (tab?: any) => void;
  onOpenGlobalReport?: () => void;
  onOpenShareModal?: () => void;
  onOpenHubModal?: () => void;
  onOpenSubscriptionModal?: () => void;
  onOpenHistory?: () => void;
}

export default function ExplanationSection({
  theme = "dark-gold",
  onOpenArtworkTools,
  onOpenGalleryBridge,
  onOpenVernissageModal,
  onOpenCollectorSales,
  onOpenPressSocial,
  onOpenProfileModal,
  onOpenQrSalesModal,
  onOpenGlobalReport,
  onOpenShareModal,
  onOpenHubModal,
  onOpenSubscriptionModal,
  onOpenHistory,
}: ExplanationSectionProps) {
  // Masqué par défaut sur la page d'accueil (cliquable pour dérouler toute la richesse de l'application)
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const isDark = theme === "dark-gold";

  return (
    <section 
      id="homepage-explanation-guide" 
      aria-label="Guide complet et explications de l'application"
      className="w-full max-w-5xl mx-auto my-6 sm:my-8 transition-all duration-300"
    >
      {/* 
        BANNIÈRE PRINCIPALE PLIANTE (PAGE D'ACCUEIL)
        Masquée par défaut, mise en valeur avec typographie dorée soignée, badges et flèche interactive 
      */}
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className={`w-full p-4 sm:p-6 border-2 transition-all duration-300 cursor-pointer select-none flex items-center justify-between gap-4 group rounded-none shadow-lg ${
          isDark
            ? isOpen
              ? "bg-[#14120a] border-[#c9a84c] text-white shadow-[#c9a84c]/10"
              : "bg-[#0d0d0c] border-[#c9a84c]/60 hover:border-[#c9a84c] hover:bg-[#16140e] text-neutral-200"
            : isOpen
              ? "bg-amber-50/95 border-[#c9a84c] text-stone-900 shadow-amber-900/10"
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
              {/* Titre écrit en grand et valorisé */}
              <h2 className="font-serif font-black text-2xl sm:text-3xl md:text-4xl tracking-wider uppercase leading-none">
                EXPLICATION
              </h2>
              <span className="text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 uppercase bg-[#c9a84c] text-black">
                GUIDE COMPLET DE L'APPLICATION
              </span>
              <span className="text-[10px] font-mono font-bold tracking-widest px-2 py-0.5 border border-[#c9a84c]/60 text-[#c9a84c] hidden sm:inline-block">
                5 PÔLES · 36 OUTILS IA
              </span>
            </div>
            <p className={`text-xs sm:text-sm font-sans mt-2 ${
              isDark ? "text-neutral-300" : "text-stone-600"
            }`}>
              {isOpen 
                ? "Cliquez pour refermer le guide d'explications de l'application" 
                : "Découvrez toutes les possibilités : Analyse d'œuvres, cartels muraux, certificats d'authenticité, cotation financière, dossiers galeries & vernissages."}
            </p>
          </div>
        </div>

        {/* GRANDE FLÈCHE INTERACTIVE & BOUTON D'ACTION */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <span className="text-xs font-mono font-bold hidden md:inline text-[#c9a84c] uppercase tracking-wider">
            {isOpen ? "Masquer ▲" : "Ouvrir le guide ▼"}
          </span>
          <div className={`w-11 h-11 sm:w-13 sm:h-13 border flex items-center justify-center transition-transform duration-300 ${
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

      {/* CONTENU DE L'EXPLICATION DÉPLIÉE (TOUTES LES POSSIBILITÉS DÉTAILLÉES) */}
      {isOpen && (
        <div className={`border-2 border-t-0 p-5 sm:p-8 space-y-8 animate-fadeIn shadow-2xl ${
          isDark ? "bg-[#0a0a0a] border-[#c9a84c] text-white" : "bg-white border-[#c9a84c] text-stone-900"
        }`}>
          
          {/* Bloc 1 : Présentation Générale */}
          <div className={`p-4 sm:p-6 border ${
            isDark ? "bg-[#14120c] border-[#c9a84c]/40" : "bg-amber-50/80 border-[#c9a84c]/50"
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#c9a84c]">
                EN QUELQUES MOTS
              </span>
              <span className="text-[10px] font-mono opacity-70">
                Propulsé par Google Gemini Pro Vision
              </span>
            </div>
            <h3 className="font-serif font-bold text-lg sm:text-xl md:text-2xl mb-2">
              L'Œil de l'Atelier : Votre Assistant d'Art Augmenté
            </h3>
            <p className={`text-xs sm:text-sm leading-relaxed font-sans ${isDark ? "text-neutral-300" : "text-stone-700"}`}>
              Cette application a été spécialement conçue pour les <strong>artistes peintres, sculpteurs, photographes, illustrateurs et galeristes</strong>. 
              Elle met à votre disposition l'Intelligence Artificielle visuelle la plus avancée de Google pour analyser vos œuvres en profondeur, 
              rédiger vos textes critiques et de médiation culturelle, certifier l'authenticité de vos créations, estimer une cote financière réaliste, 
              imprimer vos cartels muraux d'exposition avec QR codes de vente directe, et préparer vos dossiers pour les galeries.
            </p>
          </div>

          {/* Bloc 2 : Les 3 Étapes Ultra-Simples */}
          <div>
            <div className="mb-4">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#c9a84c]">
                PRISE EN MAIN IMMÉDIATE
              </span>
              <h3 className="font-serif font-bold text-base sm:text-lg uppercase tracking-wide">
                Comment l'utiliser en 3 étapes simples :
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Étape 1 */}
              <div className={`p-4 sm:p-5 border flex flex-col justify-between ${
                isDark ? "bg-[#111111] border-white/10" : "bg-stone-50 border-stone-200 shadow-sm"
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
                  ✓ JPEG, PNG, WEBP · Traitement sécurisé
                </p>
              </div>

              {/* Étape 2 */}
              <div className={`p-4 sm:p-5 border flex flex-col justify-between ${
                isDark ? "bg-[#111111] border-white/10" : "bg-stone-50 border-stone-200 shadow-sm"
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
                isDark ? "bg-[#111111] border-white/10" : "bg-stone-50 border-stone-200 shadow-sm"
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

          {/* Bloc 3 : Les 5 Pôles Stratégiques & 36 Outils d'Excellence */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 border-b pb-2 border-[#c9a84c]/20">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#c9a84c]">
                  ÉCOSYSTÈME COMPLET
                </span>
                <h3 className="font-serif font-bold text-base sm:text-lg uppercase tracking-wide">
                  Les 5 Pôles Métiers & 36 Outils Disponibles
                </h3>
              </div>
              {onOpenHubModal && (
                <button
                  type="button"
                  onClick={onOpenHubModal}
                  className="text-xs font-mono font-bold text-[#c9a84c] hover:underline flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>Explorer le Hub Stratégique (5 Pôles)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Passerelle Cartels Muraux & QR Vente */}
            {onOpenQrSalesModal && (
              <div 
                onClick={() => onOpenQrSalesModal("generator")}
                className={`p-4 border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-all hover:border-[#c9a84c] shadow-md mb-3 ${
                  isDark ? "bg-gradient-to-r from-[#17140b] via-[#211b0e] to-[#121008] border-[#c9a84c]/80 text-white" : "bg-gradient-to-r from-amber-100 via-amber-50 to-white border-[#c9a84c] text-black"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-[#c9a84c] text-black font-black text-lg flex-shrink-0">
                    🏷️
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="font-serif font-bold text-xs sm:text-sm uppercase text-[#c9a84c]">
                        Cartels Muraux & QR Codes de Vente Directe
                      </h5>
                      <span className="text-[9px] font-mono bg-emerald-600 text-white font-bold px-1.5 py-0.5 uppercase">
                        50 Innovations
                      </span>
                    </div>
                    <p className={`text-xs font-sans mt-0.5 ${isDark ? "text-neutral-300" : "text-stone-700"}`}>
                      Impression de cartels muraux normalisés avec QR codes, audioguide vocal immersif pour les visiteurs, livre d'or d'exposition et passerelle de vente directe discrète.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenQrSalesModal("generator");
                  }}
                  className="px-4 py-2 bg-[#c9a84c] hover:bg-white text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors flex-shrink-0 self-end sm:self-center cursor-pointer shadow"
                >
                  Générer Cartel & QR →
                </button>
              </div>
            )}

            {/* Grille des 5 Pôles */}
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
                    Style, palette chromatique, cotation financière, certificat COA, cartel, poésie & critique.
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

          {/* Bloc 4 : Fonctions d'Export, Partage & Personnalisation */}
          <div className={`p-4 border ${
            isDark ? "bg-[#12110c] border-[#c9a84c]/30" : "bg-amber-50/50 border-stone-200"
          }`}>
            <h4 className="font-serif font-bold text-xs sm:text-sm uppercase tracking-wider text-[#c9a84c] mb-2.5">
              Outils Pratiques & Gestion d'Atelier
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
              <div className="flex items-start gap-2">
                <BookOpen className="w-4 h-4 text-[#c9a84c] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-sans">Carnet de Bord</strong>
                  <span className="text-[11px] opacity-75">Historique complet de toutes vos analyses sauvegardées localement.</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Printer className="w-4 h-4 text-[#c9a84c] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-sans">Cartels & COA Imprimables</strong>
                  <span className="text-[11px] opacity-75">Impression haute fidélité avec QR codes de vente et QR d'audioguide.</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Share2 className="w-4 h-4 text-[#c9a84c] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-sans">Partage Artiste / Acheteur</strong>
                  <span className="text-[11px] opacity-75">Liens directs dédiés pour les visiteurs d'exposition ou les acheteurs.</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#c9a84c] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-sans">Sécurité & Confidentialité</strong>
                  <span className="text-[11px] opacity-75">Vos visuels restent votre propriété intellectuelle exclusive.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bloc 5 : Personnalisation facultative & bouton refermer */}
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
                  className="px-3 py-1.5 border border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-black font-bold uppercase tracking-wider text-[10px] transition-colors cursor-pointer"
                >
                  Configurer mon profil
                </button>
              )}
              {onOpenHistory && (
                <button
                  type="button"
                  onClick={onOpenHistory}
                  className="px-3 py-1.5 border border-white/20 hover:border-[#c9a84c] text-neutral-300 hover:text-white font-bold uppercase tracking-wider text-[10px] transition-colors cursor-pointer"
                >
                  Carnet de bord
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-[#c9a84c] text-black hover:bg-white font-bold uppercase tracking-wider text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow"
              >
                <ChevronUp className="w-4 h-4" />
                Masquer l'explication ▲
              </button>
            </div>
          </div>

        </div>
      )}
    </section>
  );
}
