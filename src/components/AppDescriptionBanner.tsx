import React, { useState } from "react";
import { 
  Sparkles, ChevronDown, ChevronUp, Palette, 
  Building2, CheckCircle2, Handshake, Users, PartyPopper, Briefcase, Radio
} from "lucide-react";

interface AppDescriptionBannerProps {
  theme: "dark-gold" | "light";
  onOpenArtworkTools?: () => void;
  onOpenGalleryBridge?: () => void;
  onOpenVernissageModal?: () => void;
  onOpenCollectorSales?: () => void;
  onOpenPressSocial?: () => void;
}

export default function AppDescriptionBanner({ 
  theme, 
  onOpenArtworkTools,
  onOpenGalleryBridge, 
  onOpenVernissageModal, 
  onOpenCollectorSales,
  onOpenPressSocial 
}: AppDescriptionBannerProps) {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const isDark = theme === "dark-gold";

  return (
    <div className={`mb-8 border transition-all duration-300 overflow-hidden ${
      isDark
        ? "bg-[#101010] border-[#c9a84c] text-white"
        : "bg-white border-[#c9a84c] text-black shadow-lg"
    }`}>
      {/* Banner Header / Summary Row */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none transition-colors ${
          isDark ? "hover:bg-white/5" : "hover:bg-amber-50/40"
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div className={`w-10 h-10 rounded-none flex items-center justify-center flex-shrink-0 border ${
            isDark ? "bg-[#c9a84c]/20 border-[#c9a84c]" : "bg-amber-100 border-[#c9a84c]"
          }`}>
            <Handshake className={`w-5 h-5 ${isDark ? "text-[#c9a84c]" : "text-[#9c7d2b]"}`} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className={`text-sm sm:text-base font-serif font-bold tracking-tight ${
                isDark ? "text-white" : "text-black"
              }`}>
                La Passerelle Stratégique entre Artistes, Galeries & Acheteurs
              </h2>
              <span className="text-[10px] font-mono font-black tracking-widest px-2.5 py-0.5 uppercase bg-[#c9a84c] text-black">
                16 Outils IA d'Expertise
              </span>
            </div>
            <p className={`text-xs font-sans mt-1 font-medium ${
              isDark ? "text-white" : "text-black"
            }`}>
              De la création en atelier à la vente en galerie : organisez vos vernissages, décrivez votre art, fixez votre cote et séduisez collectionneurs et commissaires d'exposition.
            </p>
          </div>
        </div>

        <button 
          type="button"
          className={`flex items-center gap-1.5 text-xs font-mono font-bold flex-shrink-0 ml-4 ${
            isDark ? "text-[#c9a84c] hover:text-white" : "text-[#9c7d2b] hover:text-black"
          }`}
        >
          <span className="hidden sm:inline">{isOpen ? "Masquer le guide" : "Découvrir la mission & les 16 outils"}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Content */}
      {isOpen && (
        <div className={`px-4 sm:px-6 pb-6 pt-3 border-t space-y-6 animate-fadeIn ${
          isDark ? "border-[#c9a84c]/30 bg-black/60" : "border-[#c9a84c]/30 bg-stone-50/70"
        }`}>
          
          {/* Main Elevator Pitch & 4 Strategic Modules */}
          <div className={`p-5 sm:p-6 border space-y-5 ${
            isDark 
              ? "bg-[#c9a84c]/10 border-[#c9a84c] text-white" 
              : "bg-amber-50/80 border-[#c9a84c] text-black shadow-sm"
          }`}>
            <div>
              <span className={`text-[10px] font-mono font-black uppercase tracking-widest px-2.5 py-1 ${
                isDark ? "bg-[#c9a84c] text-black" : "bg-[#c9a84c] text-black"
              }`}>
                MISSION DE LA PLATEFORME • ÉCOSYSTÈME ART & MARCHÉ
              </span>
              <h3 className={`text-base sm:text-lg font-serif font-bold mt-2.5 ${
                isDark ? "text-white" : "text-stone-950"
              }`}>
                Pourquoi L'Œil de l'Atelier ?
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed font-sans mt-2 font-medium ${
                isDark ? "text-neutral-200" : "text-stone-700"
              }`}>
                L'application agit comme le lien privilégié entre <strong>l'univers créatif de l'artiste</strong>, <strong>les exigences des directeurs de galeries</strong>, <strong>l'impact médiatique</strong> et <strong>les attentes des acheteurs & collectionneurs</strong>. Elle dote les artistes d'une suite d'intelligence artificielle sur-mesure pour formaliser leur discours plastique, orchestrer des vernissages inoubliables, estimer objectivement la valeur marchande de leurs toiles et créer des dossiers professionnels prêts à convaincre le marché de l'art.
              </p>
            </div>

            {/* 5 Interactive Strategic Modules (16 Outils d'Atelier + 4 Passerelles) */}
            <div className="space-y-2.5 pt-2 border-t border-[#c9a84c]/30">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#c9a84c] font-black block">
                  Accéder directement aux 5 pôles d'expertise (36 Outils au total) :
                </span>
              </div>

              {/* Master Card: 16 Outils d'Analyse Plastique & d'Atelier */}
              {onOpenArtworkTools && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenArtworkTools();
                  }}
                  className={`w-full p-3.5 sm:p-4 border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left transition-all duration-300 shadow-md ${
                    isDark 
                      ? "bg-gradient-to-r from-[#18150a] via-[#121212] to-black hover:bg-[#1a170e] border-[#c9a84c] text-white" 
                      : "bg-gradient-to-r from-amber-100/80 via-amber-50/80 to-white hover:bg-amber-100 border-[#c9a84c] text-black"
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-9 h-9 flex items-center justify-center bg-[#c9a84c] text-black font-black text-base flex-shrink-0">
                      🎨
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm font-serif font-bold tracking-wide">
                          Suite Complète des 16 Outils d'Analyse Plastique & d'Atelier
                        </span>
                        <span className="text-[9px] font-mono bg-[#c9a84c] text-black font-black px-1.5 py-0.5 uppercase">
                          16 Outils Majeurs
                        </span>
                      </div>
                      <p className={`text-[11px] sm:text-xs font-sans mt-0.5 ${isDark ? "text-neutral-300" : "text-stone-700"}`}>
                        Style, Palette chromatique, Technique, Critique, Cotation & Estimation, Certificat COA, Titres, Artist Statement, Démarche & Poésie.
                      </p>
                    </div>
                  </div>
                  <div className="px-3.5 py-1.5 bg-[#c9a84c] text-black font-mono font-bold text-xs uppercase tracking-wider flex-shrink-0 self-end sm:self-center flex items-center gap-1.5">
                    <span>Ouvrir les 16 Outils</span>
                    <span>→</span>
                  </div>
                </button>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {onOpenGalleryBridge && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenGalleryBridge();
                    }}
                    className={`p-3.5 border flex items-center justify-between text-left transition-all duration-300 shadow-sm ${
                      isDark 
                        ? "bg-black hover:bg-[#141414] border-[#c9a84c] text-white" 
                        : "bg-white hover:bg-amber-100/50 border-[#c9a84c] text-black"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center bg-[#c9a84c] text-black font-black text-sm flex-shrink-0">
                        🏛️
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-serif font-bold tracking-wide">
                            Passerelle Galeries
                          </span>
                          <span className="text-[9px] font-mono bg-[#c9a84c] text-black font-black px-1.5 py-0.2 uppercase">
                            5 Outils
                          </span>
                        </div>
                        <p className={`text-[11px] font-sans mt-0.5 ${isDark ? "text-neutral-400" : "text-stone-600"}`}>
                          Dossier de candidature, matchmaking & bourse aux murs
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#c9a84c] ml-2">→</span>
                  </button>
                )}

                {onOpenVernissageModal && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenVernissageModal();
                    }}
                    className={`p-3.5 border flex items-center justify-between text-left transition-all duration-300 shadow-sm ${
                      isDark 
                        ? "bg-black hover:bg-[#141414] border-[#c9a84c] text-white" 
                        : "bg-white hover:bg-amber-100/50 border-[#c9a84c] text-black"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center bg-[#c9a84c] text-black font-black text-sm flex-shrink-0">
                        🥂
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-serif font-bold tracking-wide">
                            Soirées & Vernissages
                          </span>
                          <span className="text-[9px] font-mono bg-[#c9a84c] text-black font-black px-1.5 py-0.2 uppercase">
                            5 Outils
                          </span>
                        </div>
                        <p className={`text-[11px] font-sans mt-0.5 ${isDark ? "text-neutral-400" : "text-stone-600"}`}>
                          QR cartels connectés, audioguide & invitations VIP
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#c9a84c] ml-2">→</span>
                  </button>
                )}

                {onOpenCollectorSales && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenCollectorSales();
                    }}
                    className={`p-3.5 border flex items-center justify-between text-left transition-all duration-300 shadow-sm ${
                      isDark 
                        ? "bg-black hover:bg-[#141414] border-[#c9a84c] text-white" 
                        : "bg-white hover:bg-amber-100/50 border-[#c9a84c] text-black"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center bg-[#c9a84c] text-black font-black text-sm flex-shrink-0">
                        💼
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-serif font-bold tracking-wide">
                            Ventes & Collectionneurs
                          </span>
                          <span className="text-[9px] font-mono bg-[#c9a84c] text-black font-black px-1.5 py-0.2 uppercase">
                            5 Outils
                          </span>
                        </div>
                        <p className={`text-[11px] font-sans mt-0.5 ${isDark ? "text-neutral-400" : "text-stone-600"}`}>
                          Défiscalisation Art 238 bis, factures Marcus & salon VIP
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#c9a84c] ml-2">→</span>
                  </button>
                )}

                {onOpenPressSocial && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenPressSocial();
                    }}
                    className={`p-3.5 border flex items-center justify-between text-left transition-all duration-300 shadow-sm ${
                      isDark 
                        ? "bg-black hover:bg-[#141414] border-[#c9a84c] text-white" 
                        : "bg-white hover:bg-amber-100/50 border-[#c9a84c] text-black"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center bg-[#c9a84c] text-black font-black text-sm flex-shrink-0">
                        📣
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-serif font-bold tracking-wide">
                            Presse, Médias & Subventions
                          </span>
                          <span className="text-[9px] font-mono bg-[#c9a84c] text-black font-black px-1.5 py-0.2 uppercase">
                            5 Outils
                          </span>
                        </div>
                        <p className={`text-[11px] font-sans mt-0.5 ${isDark ? "text-neutral-400" : "text-stone-600"}`}>
                          Communiqué de presse, Reels d'atelier & bourses DRAC
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#c9a84c] ml-2">→</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 3 Core Pillars: Artistes, Galeries, Acheteurs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            
            {/* Pillar 1: Pour l'Artiste */}
            <div className={`p-4 border ${
              isDark ? "bg-black border-[#c9a84c]/50 text-white" : "bg-white border-[#c9a84c]/60 text-black shadow-sm"
            }`}>
              <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-[#c9a84c]/30">
                <Palette className={`w-4 h-4 ${isDark ? "text-[#c9a84c]" : "text-[#9c7d2b]"}`} />
                <h3 className={`text-xs font-mono font-black uppercase tracking-wider ${
                  isDark ? "text-[#c9a84c]" : "text-[#9c7d2b]"
                }`}>
                  Pour les Artistes
                </h3>
              </div>
              <ul className={`space-y-2 text-xs font-normal ${isDark ? "text-white" : "text-black"}`}>
                <li className="flex items-start gap-1.5">
                  <span className={`font-bold ${isDark ? "text-[#c9a84c]" : "text-[#9c7d2b]"}`}>•</span>
                  <span><strong className="font-bold">Mots & Narration :</strong> Décrire sa démarche, trouver les titres justes, rédiger sa biographie et son <em>Artist Statement</em>.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className={`font-bold ${isDark ? "text-[#c9a84c]" : "text-[#9c7d2b]"}`}>•</span>
                  <span><strong className="font-bold">Vernissages & Événements :</strong> Idées de mise en scène, déroulé de soirée, carton d'invitation et discours d'ouverture.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className={`font-bold ${isDark ? "text-[#c9a84c]" : "text-[#9c7d2b]"}`}>•</span>
                  <span><strong className="font-bold">Exploration Plastique :</strong> Tester des variations de styles, des dialogues artistiques et anticiper les séries.</span>
                </li>
              </ul>
            </div>

            {/* Pillar 2: Pour les Galeries & Commissaires */}
            <div className={`p-4 border ${
              isDark ? "bg-black border-[#c9a84c]/50 text-white" : "bg-white border-[#c9a84c]/60 text-black shadow-sm"
            }`}>
              <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-[#c9a84c]/30">
                <Building2 className={`w-4 h-4 ${isDark ? "text-[#c9a84c]" : "text-[#9c7d2b]"}`} />
                <h3 className={`text-xs font-mono font-black uppercase tracking-wider ${
                  isDark ? "text-[#c9a84c]" : "text-[#9c7d2b]"
                }`}>
                  Pour les Galeries & Curateurs
                </h3>
              </div>
              <ul className={`space-y-2 text-xs font-normal ${isDark ? "text-white" : "text-black"}`}>
                <li className="flex items-start gap-1.5">
                  <span className={`font-bold ${isDark ? "text-[#c9a84c]" : "text-[#9c7d2b]"}`}>•</span>
                  <span><strong className="font-bold">Dossiers Prêts à Exposer :</strong> Cartels muséaux soignés, fiches d'analyse critique et cohérence thématique.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className={`font-bold ${isDark ? "text-[#c9a84c]" : "text-[#9c7d2b]"}`}>•</span>
                  <span><strong className="font-bold">Scénographie & Accrochage :</strong> Simulation d'agencement spatial pour sublimer l'espace d'exposition.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className={`font-bold ${isDark ? "text-[#c9a84c]" : "text-[#9c7d2b]"}`}>•</span>
                  <span><strong className="font-bold">Relations Presse :</strong> Communiqués de presse percutants pour journalistes et critiques d'art.</span>
                </li>
              </ul>
            </div>

            {/* Pillar 3: Pour les Acheteurs & Collectionneurs */}
            <div className={`p-4 border ${
              isDark ? "bg-black border-[#c9a84c]/50 text-white" : "bg-white border-[#c9a84c]/60 text-black shadow-sm"
            }`}>
              <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-[#c9a84c]/30">
                <Users className={`w-4 h-4 ${isDark ? "text-[#c9a84c]" : "text-[#9c7d2b]"}`} />
                <h3 className={`text-xs font-mono font-black uppercase tracking-wider ${
                  isDark ? "text-[#c9a84c]" : "text-[#9c7d2b]"
                }`}>
                  Pour les Acheteurs & Collectionneurs
                </h3>
              </div>
              <ul className={`space-y-2 text-xs font-normal ${isDark ? "text-white" : "text-black"}`}>
                <li className="flex items-start gap-1.5">
                  <span className={`font-bold ${isDark ? "text-[#c9a84c]" : "text-[#9c7d2b]"}`}>•</span>
                  <span><strong className="font-bold">Transparence & Estimation :</strong> Grilles tarifaires justifiées basées sur les dimensions, techniques et cotes du marché.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className={`font-bold ${isDark ? "text-[#c9a84c]" : "text-[#9c7d2b]"}`}>•</span>
                  <span><strong className="font-bold">Certificats d'Authenticité (COA) :</strong> Garantie d'originalité éditée en haute définition avec mentions légales.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className={`font-bold ${isDark ? "text-[#c9a84c]" : "text-[#9c7d2b]"}`}>•</span>
                  <span><strong className="font-bold">Intégration Déco & Lumière :</strong> Simulation de l'œuvre dans un intérieur contemporain ou haussmannien.</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Les 4 Phases & 16 Outils IA Expliqués */}
          <div>
            <h3 className={`text-xs font-mono font-black uppercase tracking-widest mb-3 flex items-center gap-2 ${
              isDark ? "text-[#c9a84c]" : "text-[#9c7d2b]"
            }`}>
              <Sparkles className="w-4 h-4" /> Les 16 Outils IA au Service de votre Carrière Artistique
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              
              {/* Phase 1 */}
              <div className={`p-3.5 border ${
                isDark ? "bg-black border-[#c9a84c]/40 text-white" : "bg-white border-[#c9a84c]/50 text-black shadow-sm"
              }`}>
                <span className="text-[10px] font-mono font-black px-2 py-0.5 bg-[#c9a84c] text-black uppercase mb-2 inline-block">
                  Phase 1 : Regard & Curation
                </span>
                <p className={`text-xs mb-3 font-normal leading-relaxed ${isDark ? "text-white" : "text-black"}`}>
                  Décryptage esthétique, composition, palettes chromatiques et regard critique pour structurer l'analyse.
                </p>
                <div className={`text-[11px] font-mono space-y-1.5 pt-2 border-t ${
                  isDark ? "border-white/15 text-white" : "border-stone-200 text-black"
                }`}>
                  <div>• <strong className="font-bold">Critique d'Art :</strong> Avis curatorial</div>
                  <div>• <strong className="font-bold">Technique & Palette :</strong> Pigments & harmonie</div>
                  <div>• <strong className="font-bold">Titre & Statement :</strong> Identité de l'œuvre</div>
                  <div>• <strong className="font-bold">Poésie :</strong> Résonance sensible</div>
                </div>
              </div>

              {/* Phase 2 */}
              <div className={`p-3.5 border ${
                isDark ? "bg-black border-[#c9a84c]/40 text-white" : "bg-white border-[#c9a84c]/50 text-black shadow-sm"
              }`}>
                <span className="text-[10px] font-mono font-black px-2 py-0.5 bg-[#c9a84c] text-black uppercase mb-2 inline-block">
                  Phase 2 : Galerie & Vernissage
                </span>
                <p className={`text-xs mb-3 font-normal leading-relaxed ${isDark ? "text-white" : "text-black"}`}>
                  Tout le matériel pour monter une exposition, animer un vernissage et convaincre les galeries.
                </p>
                <div className={`text-[11px] font-mono space-y-1.5 pt-2 border-t ${
                  isDark ? "border-white/15 text-white" : "border-stone-200 text-black"
                }`}>
                  <div>• <strong className="font-bold">Cartel d'Exposition :</strong> Fiche murale musée</div>
                  <div>• <strong className="font-bold">Pitch Galerie :</strong> Argumentaire pour galeriste</div>
                  <div>• <strong className="font-bold">Scénographie :</strong> Disposition & lumière</div>
                  <div>• <strong className="font-bold">Plan de Vernissage :</strong> Soirée & discours</div>
                </div>
              </div>

              {/* Phase 3 */}
              <div className={`p-3.5 border ${
                isDark ? "bg-black border-[#c9a84c]/40 text-white" : "bg-white border-[#c9a84c]/50 text-black shadow-sm"
              }`}>
                <span className="text-[10px] font-mono font-black px-2 py-0.5 bg-[#c9a84c] text-black uppercase mb-2 inline-block">
                  Phase 3 : Marché & Acheteurs
                </span>
                <p className={`text-xs mb-3 font-normal leading-relaxed ${isDark ? "text-white" : "text-black"}`}>
                  Fixation des prix, valorisation auprès des acheteurs et sécurisation juridique des transactions.
                </p>
                <div className={`text-[11px] font-mono space-y-1.5 pt-2 border-t ${
                  isDark ? "border-white/15 text-white" : "border-stone-200 text-black"
                }`}>
                  <div>• <strong className="font-bold">Estimation de Prix :</strong> Cotation rationnelle</div>
                  <div>• <strong className="font-bold">Dossier de Vente :</strong> Fiche pour collectionneurs</div>
                  <div>• <strong className="font-bold">Certificat COA :</strong> Authenticité légale</div>
                  <div>• <strong className="font-bold">Mise en Scène Déco :</strong> Rendu in situ</div>
                </div>
              </div>

              {/* Phase 4 */}
              <div className={`p-3.5 border ${
                isDark ? "bg-black border-[#c9a84c]/40 text-white" : "bg-white border-[#c9a84c]/50 text-black shadow-sm"
              }`}>
                <span className="text-[10px] font-mono font-black px-2 py-0.5 bg-[#c9a84c] text-black uppercase mb-2 inline-block">
                  Phase 4 : Réseau & Création
                </span>
                <p className={`text-xs mb-3 font-normal leading-relaxed ${isDark ? "text-white" : "text-black"}`}>
                  Communication digitale, visibilité sur les réseaux sociaux et inspiration pour vos prochaines toiles.
                </p>
                <div className={`text-[11px] font-mono space-y-1.5 pt-2 border-t ${
                  isDark ? "border-white/15 text-white" : "border-stone-200 text-black"
                }`}>
                  <div>• <strong className="font-bold">Réseaux Sociaux :</strong> Posts & hashtags</div>
                  <div>• <strong className="font-bold">Dossier de Presse :</strong> Relations médias</div>
                  <div>• <strong className="font-bold">Variations de Styles :</strong> Projections créatives</div>
                  <div>• <strong className="font-bold">Dialogue Artistique :</strong> Correspondances d'art</div>
                </div>
              </div>

            </div>
          </div>

          {/* Highlights Footer */}
          <div className={`pt-4 border-t flex flex-wrap gap-2.5 text-xs font-mono font-bold ${
            isDark ? "border-[#c9a84c]/30" : "border-stone-300"
          }`}>
            <span className={`px-3 py-1.5 border flex items-center gap-2 ${
              isDark ? "bg-black border-[#c9a84c]/60 text-white" : "bg-white border-[#c9a84c] text-black shadow-sm"
            }`}>
              <CheckCircle2 className={`w-3.5 h-3.5 ${isDark ? "text-[#c9a84c]" : "text-[#9c7d2b]"}`} />
              Connexion Artistes ↔ Galeries ↔ Collectionneurs
            </span>
            <span className={`px-3 py-1.5 border flex items-center gap-2 ${
              isDark ? "bg-black border-[#c9a84c]/60 text-white" : "bg-white border-[#c9a84c] text-black shadow-sm"
            }`}>
              <CheckCircle2 className={`w-3.5 h-3.5 ${isDark ? "text-[#c9a84c]" : "text-[#9c7d2b]"}`} />
              Organisation Clé-en-main de Soirées de Vernissage
            </span>
            <span className={`px-3 py-1.5 border flex items-center gap-2 ${
              isDark ? "bg-black border-[#c9a84c]/60 text-white" : "bg-white border-[#c9a84c] text-black shadow-sm"
            }`}>
              <CheckCircle2 className={`w-3.5 h-3.5 ${isDark ? "text-[#c9a84c]" : "text-[#9c7d2b]"}`} />
              Aide à la Rédaction, Cotation & Certificats COA
            </span>
            <span className={`px-3 py-1.5 border flex items-center gap-2 ${
              isDark ? "bg-black border-[#c9a84c]/60 text-white" : "bg-white border-[#c9a84c] text-black shadow-sm"
            }`}>
              <CheckCircle2 className={`w-3.5 h-3.5 ${isDark ? "text-[#c9a84c]" : "text-[#9c7d2b]"}`} />
              Carnet de Bord & Analyse d'Œuvres Uniques ou de Séries
            </span>
          </div>

        </div>
      )}
    </div>
  );
}
