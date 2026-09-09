import React, { useState } from "react";
import { 
  Radio, Share2, Globe, Mail, Award, 
  X, Check, Copy, Download, Printer, RefreshCw, 
  Video, Sparkles, CheckCircle2, Search, Send, 
  FileText, ExternalLink, Hash, Instagram, 
  Calendar, Layers, Feather, HelpCircle
} from "lucide-react";
import { ArtistProfile } from "../types.js";

interface PressSocialBridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: "dark-gold" | "light";
  profile: ArtistProfile;
  activeArtworkImage?: string | null;
  activeSeries?: any[];
  onAnalyzePressTool?: (toolId: string) => Promise<any>;
}

export default function PressSocialBridgeModal({
  isOpen,
  onClose,
  theme = "dark-gold",
  profile,
  activeArtworkImage,
  activeSeries = [],
  onAnalyzePressTool
}: PressSocialBridgeModalProps) {
  const [activeTab, setActiveTab] = useState<"press" | "reels" | "seo" | "newsletter" | "grants">("press");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [loadingTool, setLoadingTool] = useState<string | null>(null);

  // Live results from AI
  const [liveResults, setLiveResults] = useState<Record<string, any>>({});

  // Interactive Press Release parameters
  const [pressExhibitionTitle, setPressExhibitionTitle] = useState<string>("MATIÈRE & SILENCE : Peintures Telluriques");
  const [pressExhibitionDates, setPressExhibitionDates] = useState<string>("15 Octobre — 28 Novembre 2026");
  const [pressExhibitionVenue, setPressExhibitionVenue] = useState<string>("Galerie de l'Échiquier, 4 rue de Saintonge, Paris 3e");

  // Interactive Newsletter parameters
  const [newsletterTheme, setNewsletterTheme] = useState<string>("Le mystère des pigments minéraux et la nuit d'atelier");

  // Interactive Grants parameters
  const [grantTarget, setGrantTarget] = useState<"drac" | "cnap" | "taylor" | "hermes">("drac");

  const isDark = theme === "dark-gold";

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleRunAi = async (toolId: string) => {
    if (!onAnalyzePressTool) return;
    setLoadingTool(toolId);
    try {
      const res = await onAnalyzePressTool(toolId);
      if (res && !res.error) {
        setLiveResults(prev => ({ ...prev, [toolId]: res }));
      }
    } catch (e) {
      console.error("Erreur lors de l'exécution de l'outil presse & médias:", e);
    } finally {
      setLoadingTool(null);
    }
  };

  // Default AI datasets
  const defaultPressData = liveResults["press_release_museum"] || {
    titre_accroche_journalistique: `L'ART DE LA MATIÈRE VIVANTE : ${profile.name ? profile.name.toUpperCase() : "L'ARTISTE"} DÉVOILE SA NOUVELLE SÉRIE D'ŒUVRES TELLURIQUES`,
    chapeau_introductif: `Du ${pressExhibitionDates}, ${pressExhibitionVenue} accueille la nouvelle exposition de ${profile.name || "l'artiste"}. Une exploration sensorielle saisissante où la matière picturale, dense et vibratoire, questionne la mémoire des éléments et le silence du regard.`,
    corps_critique_et_demarche: `Loin des artifices éphémères, la peinture de ${profile.name || "l'artiste"} s'enracine dans une quête physique de la substance. Chaque toile est un champ d'expérimentation où les pigments bruts, les terres volcaniques et les liants organiques dialoguent dans une tension constante entre équilibre architectural et surgissement instinctif. L'artiste sculpte la lumière en creux, invitant le spectateur à une contemplation immersive d'une rare intensité poétique.`,
    citations_artiste_pour_presse: [
      `« Je ne peins pas le paysage extérieur, je cherche à révéler la pulsation géologique et le souffle silencieux qui habitent la matière. »`,
      `« Chaque couche posée sur le châssis est une strate de mémoire, un dialogue physique entre le temps de la création et l'instant où le regardeur s'y abandonne. »`
    ],
    reperes_biographiques_et_palmares: `${profile.name || "L'artiste"}, diplômé(e) et reconnu(e) pour la rigueur de sa recherche plastique contemporaine, expose régulièrement en galeries et foires d'art en Europe. Ses œuvres font partie de collections privées prestigieuses en France, en Suisse et aux États-Unis.`,
    encadre_infos_pratiques_visuels: `EXPOSITION : ${pressExhibitionTitle}\nDATES : ${pressExhibitionDates}\nLIEU : ${pressExhibitionVenue}\nVERNISSAGE SUR ACCRÉDITATION : 15 Octobre dès 18h30\nCONTACT PRESSE & VISUELS HD (300 DPI) : contact@artiste-atelier.com • Tél : +33 (0)6 12 34 56 78`
  };

  const defaultReelsData = liveResults["social_atelier_reels"] || {
    positionnement_social_media: "Une ligne éditoriale axée sur l'authenticité de l'atelier, la sensorialité des matières brutes (effets ASMR, gros plans de couteau, révélation de textures) et la valorisation du processus de création.",
    scripts_reels_coulisses: [
      {
        titre_concept: "La Révélation du Vernis & Profondeur des Noirs",
        duree_secondes: "18 secondes",
        accroche_visuelle_3s: "Gros plan macro 4K sur le passage lent d'un large spalter imbibé de vernis satiné sur une matière craquelée et mate.",
        deroule_plan_par_plan: "Plan 1 (0-3s) : Gros plan du pinceau révélant instantanément l'éclat des pigments sombres.\nPlan 2 (3-9s) : Recul caméra fluide montrant la toile monumentale dans la lumière zénithale de l'atelier.\nPlan 3 (9-15s) : L'artiste de dos, observant l'équilibre de la composition avec le couteau à peindre à la main.\nPlan 4 (15-18s) : Plan d'ensemble avec le cartel et mention de l'exposition.",
        musique_ambiance_conseillee: "Son d'ambiance ASMR pur (frottement du pinceau, souffle) ou musique néoclassique douce (Ludovico Einaudi / Max Richter).",
        legende_et_call_to_action: "Le moment exact où la lumière pénètre la matière. Quelle émotion cette texture réveille-t-elle en vous ? Laissez un mot en commentaire. ✨\n\nDisponible en galerie • Lien du catalogue en bio."
      },
      {
        titre_concept: "De la Terre Brute à la Toile Finie",
        duree_secondes: "25 secondes",
        accroche_visuelle_3s: "Main broyant des pigments naturels au mortier de verre.",
        deroule_plan_par_plan: "Plan 1 (0-5s) : Préparation des pigments et de l'huile de lin.\nPlan 2 (5-12s) : Projection énergique et empâtements au couteau sur le lin brut.\nPlan 3 (12-20s) : Transition rapide sur la toile terminée et accrochée au mur de cimaise.\nPlan 4 (20-25s) : Vue de profil montrant le relief 3D de la touche picturale.",
        musique_ambiance_conseillee: "Rythme immersif lo-fi ou ambient organique captivant.",
        legende_et_call_to_action: "Rien n'est simulé. Chaque pigment a une histoire tellurique. Découvrez la série complète dans le salon privé (lien en bio)."
      }
    ],
    hashtags_strategiques_art: [
      "#contemporaryart", "#fineartcollector", "#artgalleryparis", "#textureart", 
      "#abstractexpressionism", "#artcollector", "#curatorpick", "#frenchartist", 
      "#mixedmediaart", "#luxurylifestyleart", "#contemporarypainting"
    ]
  };

  const defaultSeoData = liveResults["seo_artist_wiki"] || {
    balise_titre_seo: `${profile.name || "Artiste Contemporain"} | Peintre Plasticien — Œuvres Originales & Galerie`,
    meta_description_google: `Découvrez l'univers pictural de ${profile.name || "l'artiste"}. Peintures contemporaines telluriques, textures minérales et catalogue d'œuvres d'art pour collectionneurs.`,
    schema_json_ld_artiste: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "VisualArtist",
      "name": profile.name || "Artiste Auteur",
      "genre": "Contemporary Art / Matiérisme",
      "nationality": "French",
      "description": "Artiste peintre contemporain explorant les textures telluriques et la vibration des pigments purs.",
      "knowsAbout": ["Peinture contemporaine", "Matières organiques", "Technique mixte sur toile"],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Collection d'Œuvres d'Art Originales",
        "itemListElement": activeSeries.slice(0, 3).map((a, i) => ({
          "@type": "Offer",
          "itemOffered": {
            "@type": "VisualArtwork",
            "name": a.title || `Œuvre N°${i+1}`,
            "artMedium": a.medium || "Technique mixte",
            "artform": "Painting"
          }
        }))
      }
    }, null, 2),
    mots_cles_semantiques_prioritaires: [
      `artiste peintre ${profile.name || "contemporain"}`,
      "achat tableau art contemporain galerie",
      "peinture sur toile matiériste grand format",
      "défiscalisation achat art contemporain entreprise",
      "collectionneur art contemporain paris"
    ],
    biographie_style_encyclopedique: `${profile.name || "L'artiste"} est un peintre et plasticien contemporain. Son travail se caractérise par une recherche approfondie sur la densité des matières, la tension entre opacité et transparence, et l'impact spatial de la couleur pure sur châssis de lin.`
  };

  const defaultNewsletterData = liveResults["newsletter_storytelling"] || {
    objet_email_intrigant: `Dans le silence de l'atelier : l'histoire secrète derrière la dernière toile...`,
    preheader_apercu: `Chers amis et collectionneurs, voici ce que les pigments refusent parfois de dire au grand jour.`,
    recit_storytelling_intimiste: `Chers collectionneurs, chers amis,\n\nIl est des nuits d'atelier où la peinture refuse d'obéir. La semaine dernière, alors que je travaillais sur une nouvelle toile de grand format, la lumière d'automne a soudainement frappé un empâtement d'ocre brute que je croyais perdu.\n\nEn un instant, ce qui n'était qu'une hésitation est devenu le cœur battant de toute la composition. C'est dans ces secondes imprévisibles que réside toute la magie de la création plastique : accepter de lâcher prise pour laisser la matière s'exprimer pleinement.\n\nJe suis très heureux(se) de vous dévoiler aujourd'hui cette pièce en avant-première, avant son départ pour l'exposition en galerie.`,
    devoilement_exclusif: `Intitulée « Écho Tellurique N°4 », cette œuvre (100 × 80 cm) est désormais visible dans votre salon privé VIP avec son certificat d'authenticité.`,
    signature_chaleureuse: `Avec toute mon amitié artistique,\n${profile.name || "L'Artiste"}`
  };

  const defaultGrantData = liveResults["grant_application_dossier"] || {
    titre_du_projet_artistique: `MÉMOIRE MINÉRALE : RECHERCHE PLASTIQUE SUR LES PIGMENTS GÉOLOGIQUES & L'ÉCO-CONCEPTION D'ATELIER`,
    note_d_intention_curatoriale: `Le projet 'Mémoire Minérale' s'inscrit dans une interrogation fondamentale sur la durabilité et la matérialité de l'art à l'ère anthropocène. Il s'agit d'une recherche plastique et technique visant à substituer aux liants pétrochimiques des formulations organiques naturelles (cire d'abeille pure, caséine, huiles siccatives locales) associées à des terres et sédiments prélevés in situ. Ce projet propose un manifeste esthétique où la beauté de la toile témoigne de la résilience du monde vivant.`,
    pertinence_et_impact_culturel: `Cette démarche répond à une attente sociétale majeure : réconcilier exigence muséale d'excellence et conscience écologique rigoureuse. Le soutien financier sollicité permettra d'acquérir les équipements de broyage fins, de réaliser les tests de conservation accélérée en laboratoire et de produire une série de 12 œuvres monumentales destinées à un parcours d'exposition itinérant.`,
    calendrier_previsionnel_etapes: [
      "Phase 1 (Mois 1-3) : Échantillonnage géologique, formulation des liants écologiques et tests de compatibilité.",
      "Phase 2 (Mois 4-8) : Réalisation en atelier des 12 pièces monumentales sur châssis de lin bio français.",
      "Phase 3 (Mois 9-12) : Scénographie d'exposition, rédaction du catalogue bilingue et restitution publique."
    ],
    budget_previsionnel_repartition: [
      { poste: "Matières premières nobles, pigments naturels & toiles lin bio", pourcentage: "35%" },
      { poste: "Honoraires de recherche en atelier & frais techniques", pourcentage: "40%" },
      { poste: "Scénographie, catalogue bilingue & restitution publique", pourcentage: "25%" }
    ]
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className={`w-full max-w-5xl max-h-[92vh] flex flex-col border shadow-2xl overflow-hidden transition-all ${
        isDark ? "bg-[#0d0d0d] border-[#c9a84c] text-white" : "bg-white border-[#c9a84c] text-black"
      }`}>
        
        {/* Modal Header */}
        <div className={`p-4 sm:p-5 flex items-center justify-between border-b ${
          isDark ? "bg-[#141414] border-[#c9a84c]/30" : "bg-amber-50/70 border-[#c9a84c]/30"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 flex items-center justify-center border ${
              isDark ? "bg-[#c9a84c]/20 border-[#c9a84c] text-[#c9a84c]" : "bg-amber-200 border-[#c9a84c] text-[#9c7d2b]"
            }`}>
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`font-serif text-base sm:text-lg font-bold tracking-tight ${
                  isDark ? "text-white" : "text-black"
                }`}>
                  Rayonnement, Médias, Réseaux Sociaux & Bourses Artistiques
                </h2>
                <span className="text-[9px] font-mono font-black px-2 py-0.5 uppercase bg-[#c9a84c] text-black">
                  5 Outils Médias Déployés
                </span>
              </div>
              <p className={`text-xs font-sans mt-0.5 font-medium ${
                isDark ? "text-neutral-300" : "text-stone-700"
              }`}>
                Communiqué de presse muséal, scripts Reels/TikTok d'atelier, SEO Google & Wikidata, Newsletter de storytelling et dossiers de subventions d'art.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 border transition-colors ${
              isDark 
                ? "bg-black border-white/20 text-neutral-300 hover:text-white hover:border-[#c9a84c]" 
                : "bg-white border-stone-300 text-stone-700 hover:text-black hover:border-black"
            }`}
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5 Media & Press Tabs */}
        <div className={`flex border-b overflow-x-auto scrollbar-thin ${
          isDark ? "bg-black border-[#c9a84c]/20" : "bg-stone-100 border-stone-300"
        }`}>
          <button
            onClick={() => setActiveTab("press")}
            className={`px-4 py-3 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap border-b-2 transition-all ${
              activeTab === "press"
                ? "border-[#c9a84c] text-[#c9a84c] bg-[#c9a84c]/10"
                : isDark ? "border-transparent text-neutral-400 hover:text-white" : "border-transparent text-stone-600 hover:text-black"
            }`}
          >
            <FileText className="w-4 h-4" />
            16. Communiqué de Presse
          </button>

          <button
            onClick={() => setActiveTab("reels")}
            className={`px-4 py-3 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap border-b-2 transition-all ${
              activeTab === "reels"
                ? "border-[#c9a84c] text-[#c9a84c] bg-[#c9a84c]/10"
                : isDark ? "border-transparent text-neutral-400 hover:text-white" : "border-transparent text-stone-600 hover:text-black"
            }`}
          >
            <Video className="w-4 h-4" />
            17. Scripts Reels & Instagram
          </button>

          <button
            onClick={() => setActiveTab("seo")}
            className={`px-4 py-3 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap border-b-2 transition-all ${
              activeTab === "seo"
                ? "border-[#c9a84c] text-[#c9a84c] bg-[#c9a84c]/10"
                : isDark ? "border-transparent text-neutral-400 hover:text-white" : "border-transparent text-stone-600 hover:text-black"
            }`}
          >
            <Globe className="w-4 h-4" />
            18. Référencement SEO & Google
          </button>

          <button
            onClick={() => setActiveTab("newsletter")}
            className={`px-4 py-3 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap border-b-2 transition-all ${
              activeTab === "newsletter"
                ? "border-[#c9a84c] text-[#c9a84c] bg-[#c9a84c]/10"
                : isDark ? "border-transparent text-neutral-400 hover:text-white" : "border-transparent text-stone-600 hover:text-black"
            }`}
          >
            <Mail className="w-4 h-4" />
            19. Newsletter Collectionneurs
          </button>

          <button
            onClick={() => setActiveTab("grants")}
            className={`px-4 py-3 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap border-b-2 transition-all ${
              activeTab === "grants"
                ? "border-[#c9a84c] text-[#c9a84c] bg-[#c9a84c]/10"
                : isDark ? "border-transparent text-neutral-400 hover:text-white" : "border-transparent text-stone-600 hover:text-black"
            }`}
          >
            <Award className="w-4 h-4" />
            20. Subventions & Prix d'Art
          </button>
        </div>

        {/* Modal Tab Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 16: COMMUNIQUÉ DE PRESSE MUSÉAL */}
          {activeTab === "press" && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Press Parameters Bar */}
              <div className={`p-4 border ${isDark ? "bg-[#141414] border-[#c9a84c]" : "bg-amber-50 border-[#c9a84c]"}`}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                      Titre de l'Exposition
                    </label>
                    <input
                      type="text"
                      value={pressExhibitionTitle}
                      onChange={(e) => setPressExhibitionTitle(e.target.value)}
                      className={`w-full p-2 border text-xs font-serif ${
                        isDark ? "bg-black border-white/20 text-white" : "bg-white border-stone-300 text-black"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                      Dates de l'Exposition
                    </label>
                    <input
                      type="text"
                      value={pressExhibitionDates}
                      onChange={(e) => setPressExhibitionDates(e.target.value)}
                      className={`w-full p-2 border text-xs ${
                        isDark ? "bg-black border-white/20 text-white" : "bg-white border-stone-300 text-black"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                      Lieu & Galerie
                    </label>
                    <input
                      type="text"
                      value={pressExhibitionVenue}
                      onChange={(e) => setPressExhibitionVenue(e.target.value)}
                      className={`w-full p-2 border text-xs ${
                        isDark ? "bg-black border-white/20 text-white" : "bg-white border-stone-300 text-black"
                      }`}
                    />
                  </div>
                </div>

                <div className="mt-3 flex justify-end">
                  {onAnalyzePressTool && (
                    <button
                      onClick={() => handleRunAi("press_release_museum")}
                      disabled={loadingTool === "press_release_museum"}
                      className="px-3.5 py-1.5 bg-[#c9a84c] hover:bg-white text-black font-mono font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-md"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingTool === "press_release_museum" ? "animate-spin" : ""}`} />
                      {loadingTool === "press_release_museum" ? "Rédaction du CP..." : "Régénérer le Communiqué"}
                    </button>
                  )}
                </div>
              </div>

              {/* Printable Press Release Document */}
              <div className={`p-6 border space-y-5 shadow-xl ${
                isDark ? "bg-black border-[#c9a84c] text-white" : "bg-white border-[#c9a84c] text-black"
              }`}>
                
                {/* Header Tag */}
                <div className="flex justify-between items-center border-b pb-3 border-[#c9a84c]/30">
                  <span className="text-[10px] font-mono font-black uppercase px-2.5 py-1 bg-[#c9a84c] text-black">
                    COMMUNIQUÉ DE PRESSE — DIFFUSION IMMÉDIATE
                  </span>
                  <span className="text-xs font-mono text-neutral-400">
                    PARIS • {new Date().toLocaleDateString("fr-FR")}
                  </span>
                </div>

                {/* Main Headline */}
                <div>
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-[#c9a84c] leading-tight">
                    {defaultPressData.titre_accroche_journalistique}
                  </h3>
                  <p className="font-sans text-xs font-semibold mt-2 leading-relaxed italic border-l-2 border-[#c9a84c] pl-3">
                    {defaultPressData.chapeau_introductif}
                  </p>
                </div>

                {/* Body Text */}
                <div className="space-y-3 text-xs font-serif leading-relaxed text-neutral-300 dark:text-neutral-200">
                  <p>{defaultPressData.corps_critique_et_demarche}</p>
                </div>

                {/* Quotes Box */}
                <div className={`p-4 border space-y-2 ${
                  isDark ? "bg-[#141414] border-white/10" : "bg-stone-50 border-stone-200"
                }`}>
                  <span className="text-[10px] font-mono uppercase text-[#c9a84c] font-bold block">
                    Citations de l'Artiste à destination des Rédactions :
                  </span>
                  {defaultPressData.citations_artiste_pour_presse?.map((quote: string, i: number) => (
                    <p key={i} className="text-xs font-serif italic text-neutral-200">
                      {quote}
                    </p>
                  ))}
                </div>

                {/* Bio & Practical Info Box */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-white/10 text-xs">
                  <div>
                    <strong className="font-mono text-[11px] text-[#c9a84c] uppercase block mb-1">
                      Repères Biographiques :
                    </strong>
                    <p className="font-sans text-neutral-400 leading-relaxed text-[11px]">
                      {defaultPressData.reperes_biographiques_et_palmares}
                    </p>
                  </div>

                  <div>
                    <strong className="font-mono text-[11px] text-[#c9a84c] uppercase block mb-1">
                      Informations Pratiques & Presse :
                    </strong>
                    <pre className="font-mono text-[10px] whitespace-pre-wrap text-neutral-300">
                      {defaultPressData.encadre_infos_pratiques_visuels}
                    </pre>
                  </div>
                </div>

                {/* Action footer */}
                <div className="flex justify-between items-center pt-3 border-t border-white/10">
                  <span className="text-[10px] font-mono text-neutral-400">Kit Presse conforme aux exigences des rédactions d'art</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopy(
                        `=== COMMUNIQUÉ DE PRESSE ===\n\n${defaultPressData.titre_accroche_journalistique}\n\n${defaultPressData.chapeau_introductif}\n\n${defaultPressData.corps_critique_et_demarche}\n\n${defaultPressData.encadre_infos_pratiques_visuels}`,
                        "cp_copy"
                      )}
                      className="px-3 py-1.5 bg-black border border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors"
                    >
                      {copiedKey === "cp_copy" ? "Copié !" : "Copier le CP"}
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="px-3.5 py-1.5 bg-[#c9a84c] hover:bg-white text-black font-mono font-black text-xs uppercase tracking-wider transition-colors shadow-sm"
                    >
                      Imprimer / PDF
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 17: SCRIPTS REELS & TIKTOK D'ATELIER */}
          {activeTab === "reels" && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className={`p-4 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isDark ? "bg-[#141414] border-[#c9a84c]/40" : "bg-amber-50 border-[#c9a84c]"
              }`}>
                <div>
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-[#c9a84c]" />
                    <h3 className="font-serif font-bold text-sm text-[#c9a84c]">
                      Scripts Vidéo Courts (Instagram Reels, TikTok & YouTube Shorts)
                    </h3>
                  </div>
                  <p className={`text-xs font-sans mt-0.5 ${isDark ? "text-neutral-300" : "text-stone-800"}`}>
                    Captivez les algorithmes et attirez des acheteurs internationaux grâce à des séquences d'atelier immersives plan-par-plan.
                  </p>
                </div>

                {onAnalyzePressTool && (
                  <button
                    onClick={() => handleRunAi("social_atelier_reels")}
                    disabled={loadingTool === "social_atelier_reels"}
                    className="px-3.5 py-2 bg-[#c9a84c] hover:bg-white text-black font-mono font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors whitespace-nowrap shadow-md"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingTool === "social_atelier_reels" ? "animate-spin" : ""}`} />
                    {loadingTool === "social_atelier_reels" ? "Génération..." : "Nouveaux Scripts"}
                  </button>
                )}
              </div>

              {/* Reels Scripts Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {defaultReelsData.scripts_reels_coulisses?.map((reel: any, idx: number) => (
                  <div key={idx} className={`p-5 border space-y-4 flex flex-col justify-between ${
                    isDark ? "bg-black border-[#c9a84c]/40 text-white" : "bg-white border-[#c9a84c] text-black shadow-md"
                  }`}>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b pb-2 border-[#c9a84c]/30">
                        <span className="font-serif font-bold text-sm text-[#c9a84c]">
                          Concept {idx + 1} : {reel.titre_concept}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30 font-bold">
                          {reel.duree_secondes}
                        </span>
                      </div>

                      <div className={`p-3 border ${
                        isDark ? "bg-neutral-900 border-white/10" : "bg-amber-50/50 border-amber-200"
                      }`}>
                        <strong className="text-[10px] font-mono uppercase text-[#c9a84c] block mb-1">
                          ⚡ Hook Visuel (0-3s) :
                        </strong>
                        <p className="text-xs font-sans">{reel.accroche_visuelle_3s}</p>
                      </div>

                      <div>
                        <strong className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                          🎬 Déroulé Plan par Plan :
                        </strong>
                        <pre className="text-xs font-sans whitespace-pre-wrap text-neutral-300 leading-relaxed">
                          {reel.deroule_plan_par_plan}
                        </pre>
                      </div>

                      <div>
                        <strong className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                          🎵 Musique / Son Recommandé :
                        </strong>
                        <p className="text-xs font-mono text-[#c9a84c]">{reel.musique_ambiance_conseillee}</p>
                      </div>

                      <div>
                        <strong className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                          📝 Légende & Call-to-Action :
                        </strong>
                        <p className="text-xs font-serif italic text-neutral-300">{reel.legende_et_call_to_action}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex justify-end">
                      <button
                        onClick={() => handleCopy(
                          `=== SCRIPT REEL : ${reel.titre_concept} ===\n\nHook (3s) : ${reel.accroche_visuelle_3s}\n\nDéroulé :\n${reel.deroule_plan_par_plan}\n\nMusique : ${reel.musique_ambiance_conseillee}\n\nLégende :\n${reel.legende_et_call_to_action}`,
                          `reel_${idx}`
                        )}
                        className="px-3 py-1.5 bg-[#c9a84c] hover:bg-white text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                      >
                        {copiedKey === `reel_${idx}` ? "Script Copié !" : "Copier le Script"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Hashtag Cloud */}
              <div className={`p-4 border space-y-2 ${
                isDark ? "bg-[#141414] border-white/10" : "bg-stone-50 border-stone-200"
              }`}>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono uppercase text-[#c9a84c] font-bold">
                    Hashtags Marché de l'Art & Collectionneurs :
                  </span>
                  <button
                    onClick={() => handleCopy(defaultReelsData.hashtags_strategiques_art.join(" "), "tags_copy")}
                    className="text-[10px] font-mono text-[#c9a84c] hover:underline"
                  >
                    {copiedKey === "tags_copy" ? "Copié !" : "Copier tous les hashtags"}
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {defaultReelsData.hashtags_strategiques_art?.map((tag: string, i: number) => (
                    <span key={i} className="text-xs font-mono px-2 py-0.5 bg-black border border-white/10 text-neutral-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 18: RÉFÉRENCEMENT SEO & GOOGLE KNOWLEDGE GRAPH */}
          {activeTab === "seo" && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className={`p-4 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isDark ? "bg-[#141414] border-[#c9a84c]/40" : "bg-amber-50 border-[#c9a84c]"
              }`}>
                <div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#c9a84c]" />
                    <h3 className="font-serif font-bold text-sm text-[#c9a84c]">
                      Optimisation Google Search, Wikidata & Schema.org VisualArtist
                    </h3>
                  </div>
                  <p className={`text-xs font-sans mt-0.5 ${isDark ? "text-neutral-300" : "text-stone-800"}`}>
                    Positionnez votre nom et vos toiles en tête des résultats Google lorsqu'un collectionneur ou un curateur effectue une recherche.
                  </p>
                </div>

                <button
                  onClick={() => handleCopy(defaultSeoData.schema_json_ld_artiste, "json_ld")}
                  className="px-3.5 py-2 bg-[#c9a84c] hover:bg-white text-black font-mono font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors whitespace-nowrap shadow-md"
                >
                  {copiedKey === "json_ld" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === "json_ld" ? "Code Copié !" : "Copier le JSON-LD"}
                </button>
              </div>

              {/* Google SERP Simulator */}
              <div className={`p-5 border space-y-3 ${
                isDark ? "bg-black border-[#c9a84c]/40 text-white" : "bg-white border-[#c9a84c] text-black shadow-md"
              }`}>
                <span className="text-[10px] font-mono uppercase text-neutral-400 block">
                  Aperçu dans les résultats de recherche Google :
                </span>

                <div className={`p-4 border rounded ${isDark ? "bg-[#141414] border-white/10" : "bg-stone-50 border-stone-200"}`}>
                  <span className="text-[11px] text-emerald-500 font-mono block">
                    https://www.galerie-artiste.com › {profile.name ? profile.name.toLowerCase().replace(/\s+/g, "-") : "artiste"}
                  </span>
                  <h4 className="text-base font-sans text-blue-400 hover:underline cursor-pointer font-medium mt-0.5">
                    {defaultSeoData.balise_titre_seo}
                  </h4>
                  <p className="text-xs font-sans text-neutral-400 mt-1 leading-relaxed">
                    {defaultSeoData.meta_description_google}
                  </p>
                </div>
              </div>

              {/* Keywords & Schema */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-5 border space-y-3 ${
                  isDark ? "bg-[#111111] border-white/10 text-white" : "bg-stone-50 border-stone-200 text-black"
                }`}>
                  <h4 className="font-mono text-xs font-bold uppercase text-[#c9a84c]">
                    Mots-Clés Stratégiques à intégrer dans votre site :
                  </h4>
                  <ul className="space-y-1.5 text-xs font-sans">
                    {defaultSeoData.mots_cles_semantiques_prioritaires?.map((kw: string, i: number) => (
                      <li key={i} className="flex items-center gap-2">
                        <Search className="w-3.5 h-3.5 text-[#c9a84c]" />
                        <span>{kw}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`p-5 border space-y-3 ${
                  isDark ? "bg-[#111111] border-white/10 text-white" : "bg-stone-50 border-stone-200 text-black"
                }`}>
                  <h4 className="font-mono text-xs font-bold uppercase text-[#c9a84c]">
                    Notice Biographique pour Wikipédia / Wikidata :
                  </h4>
                  <p className="text-xs font-serif leading-relaxed text-neutral-300 italic">
                    {defaultSeoData.biographie_style_encyclopedique}
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 19: NEWSLETTER COLLECTIONNEURS & STORYTELLING */}
          {activeTab === "newsletter" && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className={`p-4 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isDark ? "bg-[#141414] border-[#c9a84c]/40" : "bg-amber-50 border-[#c9a84c]"
              }`}>
                <div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#c9a84c]" />
                    <h3 className="font-serif font-bold text-sm text-[#c9a84c]">
                      Lettre d'Information VIP & Récit Intime d'Atelier
                    </h3>
                  </div>
                  <p className={`text-xs font-sans mt-0.5 ${isDark ? "text-neutral-300" : "text-stone-800"}`}>
                    Nourrissez le lien émotionnel avec vos collectionneurs pour déclencher des coups de cœur sans faire de démarchage agressif.
                  </p>
                </div>

                <button
                  onClick={() => handleCopy(
                    `OBJET : ${defaultNewsletterData.objet_email_intrigant}\n\n${defaultNewsletterData.recit_storytelling_intimiste}\n\n${defaultNewsletterData.devoilement_exclusif}\n\n${defaultNewsletterData.signature_chaleureuse}`,
                    "newsletter_copy"
                  )}
                  className="px-3.5 py-2 bg-[#c9a84c] hover:bg-white text-black font-mono font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors whitespace-nowrap shadow-md"
                >
                  {copiedKey === "newsletter_copy" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === "newsletter_copy" ? "Lettre Copiée !" : "Copier la Newsletter"}
                </button>
              </div>

              {/* Email Mockup */}
              <div className={`p-6 border space-y-4 max-w-2xl mx-auto shadow-xl ${
                isDark ? "bg-black border-[#c9a84c] text-white" : "bg-white border-[#c9a84c] text-black"
              }`}>
                <div className="border-b pb-3 border-white/10 space-y-1">
                  <div className="flex gap-2 text-xs font-sans">
                    <span className="text-neutral-400 font-mono">Objet :</span>
                    <strong className="font-serif text-[#c9a84c]">{defaultNewsletterData.objet_email_intrigant}</strong>
                  </div>
                  <div className="flex gap-2 text-[11px] font-sans text-neutral-400">
                    <span className="font-mono">Aperçu :</span>
                    <span>{defaultNewsletterData.preheader_apercu}</span>
                  </div>
                </div>

                <div className="p-4 border bg-neutral-900/40 border-white/10 space-y-3 text-xs font-serif leading-relaxed text-neutral-200">
                  <p className="whitespace-pre-wrap">{defaultNewsletterData.recit_storytelling_intimiste}</p>
                  <div className="p-3 border border-[#c9a84c]/40 bg-[#c9a84c]/10 text-[#c9a84c] text-xs font-sans font-bold">
                    {defaultNewsletterData.devoilement_exclusif}
                  </div>
                  <p className="whitespace-pre-wrap pt-2">{defaultNewsletterData.signature_chaleureuse}</p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 20: SUBVENTIONS & PRIX D'ART */}
          {activeTab === "grants" && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className={`p-4 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isDark ? "bg-[#141414] border-[#c9a84c]/40" : "bg-amber-50 border-[#c9a84c]"
              }`}>
                <div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#c9a84c]" />
                    <h3 className="font-serif font-bold text-sm text-[#c9a84c]">
                      Dossiers de Subventions Publiques (DRAC, CNAP) & Prix Artistiques
                    </h3>
                  </div>
                  <p className={`text-xs font-sans mt-0.5 ${isDark ? "text-neutral-300" : "text-stone-800"}`}>
                    Note d'intention curatoriale, calendrier et budget prévisionnel normés pour convaincre les jurys d'aide à la création.
                  </p>
                </div>

                <button
                  onClick={() => handleCopy(
                    `=== DOSSIER DE CANDIDATURE SUBVENTION / PRIX D'ART ===\n\nTitre : ${defaultGrantData.titre_du_projet_artistique}\n\nNote d'intention :\n${defaultGrantData.note_d_intention_curatoriale}\n\nImpact Culturel :\n${defaultGrantData.pertinence_et_impact_culturel}\n\nPhasage :\n` +
                    defaultGrantData.calendrier_previsionnel_etapes.map((s: string) => `• ${s}`).join("\n"),
                    "grant_copy"
                  )}
                  className="px-3.5 py-2 bg-[#c9a84c] hover:bg-white text-black font-mono font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors whitespace-nowrap shadow-md"
                >
                  {copiedKey === "grant_copy" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === "grant_copy" ? "Dossier Copié !" : "Copier le Dossier"}
                </button>
              </div>

              {/* Grant Dossier Presentation */}
              <div className={`p-6 border space-y-5 shadow-xl ${
                isDark ? "bg-black border-[#c9a84c] text-white" : "bg-white border-[#c9a84c] text-black"
              }`}>
                <div>
                  <span className="text-[10px] font-mono font-black uppercase px-2.5 py-1 bg-[#c9a84c] text-black">
                    NOTE D'INTENTION DU PROJET DE RECHERCHE
                  </span>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-[#c9a84c] mt-2">
                    {defaultGrantData.titre_du_projet_artistique}
                  </h3>
                </div>

                <div className="space-y-3 text-xs font-serif leading-relaxed text-neutral-300">
                  <p>{defaultGrantData.note_d_intention_curatoriale}</p>
                  <p>{defaultGrantData.pertinence_et_impact_culturel}</p>
                </div>

                {/* Timeline & Budget Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3 border-t border-white/10">
                  <div className="space-y-2">
                    <strong className="font-mono text-xs text-[#c9a84c] uppercase block">
                      Phasage du Projet (12 Mois) :
                    </strong>
                    <ul className="space-y-1.5 text-xs font-sans">
                      {defaultGrantData.calendrier_previsionnel_etapes?.map((step: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#c9a84c] flex-shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <strong className="font-mono text-xs text-[#c9a84c] uppercase block">
                      Répartition Budgétaire Prévisionnelle :
                    </strong>
                    <div className="space-y-2">
                      {defaultGrantData.budget_previsionnel_repartition?.map((b: any, i: number) => (
                        <div key={i} className={`p-2.5 border flex justify-between items-center text-xs ${
                          isDark ? "bg-[#141414] border-white/10" : "bg-stone-50 border-stone-200"
                        }`}>
                          <span className="font-sans">{b.poste}</span>
                          <strong className="font-mono text-[#c9a84c]">{b.pourcentage}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className={`p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
          isDark ? "bg-[#141414] border-[#c9a84c]/30 text-neutral-400" : "bg-amber-50/50 border-[#c9a84c]/30 text-stone-600"
        }`}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px]">
              Suite Complète Artistes • Galeries • Collectionneurs • Presse (20 Outils Actifs)
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#c9a84c] hover:bg-white text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
          >
            Fermer le Module
          </button>
        </div>

      </div>
    </div>
  );
}
