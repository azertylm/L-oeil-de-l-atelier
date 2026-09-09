import React, { useState, useEffect } from "react";
import { 
  PartyPopper, QrCode, Mail, MessageSquareHeart, Calculator, 
  Layout, X, Check, Copy, Volume2, VolumeX, Play, Pause, 
  Download, Printer, Share2, Send, Clock, Users, GlassWater, 
  Sparkles, CheckCircle2, AlertCircle, RefreshCw, Eye, Sliders,
  Calendar, MapPin, DollarSign, ArrowRight, Heart
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { ArtistProfile } from "../types.js";

interface VernissageEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: "dark-gold" | "light";
  profile: ArtistProfile;
  activeArtworkImage?: string | null;
  activeSeries?: any[];
  onAnalyzeVernissageTool?: (toolId: string) => Promise<any>;
}

export default function VernissageEventModal({
  isOpen,
  onClose,
  theme = "dark-gold",
  profile,
  activeArtworkImage,
  activeSeries = [],
  onAnalyzeVernissageTool
}: VernissageEventModalProps) {
  const [activeTab, setActiveTab] = useState<"qrcode" | "invitations" | "livredor" | "logistique" | "scenographie">("qrcode");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [loadingTool, setLoadingTool] = useState<string | null>(null);

  // Audio Speech state for immersive audio-guide
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Live results from AI
  const [liveResults, setLiveResults] = useState<Record<string, any>>({});

  // Event parameters
  const [expoTitle, setExpoTitle] = useState<string>("ÉCHOS DE LA MATIÈRE — NOUVELLES TOILES");
  const [expoDate, setExpoDate] = useState<string>("Jeudi 15 Octobre 2026");
  const [expoTime, setExpoTime] = useState<string>("18h30 - 22h00");
  const [expoVenue, setExpoVenue] = useState<string>("Galerie de l'Atelier, 24 rue de Turenne, Paris 3e");

  // Logistic Calculator parameters
  const [guestCount, setGuestCount] = useState<number>(45);
  const [cocktailType, setCocktailType] = useState<"standard" | "prestige" | "eco">("prestige");

  // Guestbook simulated comments state
  const [guestComments, setGuestComments] = useState<Array<{ name: string; role: string; message: string; date: string; intention?: string }>>([
    {
      name: "Claire & Marc de Valmont",
      role: "Collectionneurs privés",
      message: "Un travail magistral sur la lumière et la densité de la matière ! Nous avons eu un immense coup de cœur pour la grande toile centrale.",
      date: "Ce soir à 19h12",
      intention: "Option d'achat confirmée"
    },
    {
      name: "Julien Renoir",
      role: "Architecte d'intérieur (Studio R&A)",
      message: "Les harmonies chromatiques sont d'une élégance rare. Je souhaiterais intégrer deux pièces dans un projet de penthouse dans le Marais.",
      date: "Ce soir à 19h45",
      intention: "Demande de catalogue pro"
    },
    {
      name: "Sophie Lambert",
      role: "Critique d'art & Curatrice",
      message: "Une démarche qui gagne en maturité d'exposition en exposition. La vibration des pigments est saisissante.",
      date: "Ce soir à 20h10",
      intention: "Coup de cœur artistique"
    }
  ]);
  const [newCommentName, setNewCommentName] = useState<string>("");
  const [newCommentRole, setNewCommentRole] = useState<string>("Visiteur passionné");
  const [newCommentText, setNewCommentText] = useState<string>("");
  const [newCommentIntention, setNewCommentIntention] = useState<string>("Coup de cœur");

  // Scenography simulator controls
  const [wallColor, setWallColor] = useState<"white" | "dark" | "stone">("white");
  const [wallLighting, setWallLighting] = useState<"3000k" | "2700k" | "4000k">("3000k");
  const [artworkSpacing, setArtworkSpacing] = useState<number>(40); // cm

  const isDark = theme === "dark-gold";

  // Stop speech if modal closes or tab changes
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleRunAi = async (toolId: string) => {
    if (!onAnalyzeVernissageTool) return;
    setLoadingTool(toolId);
    try {
      const res = await onAnalyzeVernissageTool(toolId);
      if (res && !res.error) {
        setLiveResults(prev => ({ ...prev, [toolId]: res }));
      }
    } catch (e) {
      console.error("Erreur lors de l'exécution de l'outil vernissage:", e);
    } finally {
      setLoadingTool(null);
    }
  };

  // Audioguide speech handler
  const handleToggleSpeech = (text: string) => {
    if (!window.speechSynthesis) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    utterance.rate = 0.95; // Slightly slower, elegant museum pace
    utterance.pitch = 1.0;

    // Pick best French voice if available
    const voices = window.speechSynthesis.getVoices();
    const frenchVoice = voices.find(v => v.lang.startsWith("fr") && (v.name.includes("Audrey") || v.name.includes("Thomas") || v.name.includes("Google") || v.name.includes("Natural")));
    if (frenchVoice) {
      utterance.voice = frenchVoice;
    }

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  // Add new comment in virtual guestbook
  const handleAddGuestComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newEntry = {
      name: newCommentName.trim() || "Visiteur anonyme",
      role: newCommentRole,
      message: newCommentText.trim(),
      date: "À l'instant",
      intention: newCommentIntention
    };

    setGuestComments([newEntry, ...guestComments]);
    setNewCommentName("");
    setNewCommentText("");
  };

  // Print cartel handler
  const handlePrintCartel = () => {
    window.print();
  };

  // Default AI datasets
  const defaultAudioguideData = liveResults["vernissage_audioguide"] || {
    titre_cartel: `${profile.name ? profile.name.toUpperCase() : "ARTISTE"} — SÉRIE D'ATELIER CONTEMPORAINE`,
    pitch_express_30s: `Face à cette toile, l'œil est d'abord saisi par la vibration des couches successives. L'artiste ne peint pas un sujet figé, mais capture l'énergie d'un instant en tension entre matière brute et suspension poétique. Prenez quelques secondes pour laisser votre regard s'immerger dans la profondeur du champ.`,
    texte_audioguide_complet: `Bienvenue devant cette création majeure de ${profile.name || "l'artiste"}.\n\nPour composer cette pièce, l'artiste a travaillé par superpositions successives de glacis et d'empâtements au couteau, créant une mémoire sédimentaire où chaque strate de couleur dialogue avec la lumière environnante.\n\nCe tableau explore le silence actif : là où les masses denses semblent retenir le souffle, les éclaircies chromatiques ouvrent un espace de contemplation intime. L'œuvre vit au rythme des variations de l'éclairage de la salle.`,
    anecdote_secrete_atelier: `L'artiste a travaillé cette toile à la lumière naturelle du crépuscule pendant 3 semaines consécutives pour obtenir cet équilibre d'ombres veloutées.`,
    question_au_visiteur: `Quelle émotion ou quel lieu oublié cette texture réveille-t-elle en vous ?`
  };

  const defaultInvitationsData = liveResults["vernissage_invitations"] || {
    accroche_evenement: `« Une rencontre avec la matière vivante et l'indicible pictural. »`,
    invitation_vip_collectionneur: `Madame, Monsieur,\n\nÀ l'occasion du vernissage de la nouvelle exposition de ${profile.name || "l'artiste"} intitulée « ${expoTitle} »,\n\nNous avons le grand honneur de vous convier en avant-première VIP :\n📅 ${expoDate} à partir de ${expoTime}\n📍 ${expoVenue}\n\nUn accueil privilégié et une présentation privée des œuvres par l'artiste vous seront réservés dès 18h30 avant l'ouverture publique.\n\nRSVP souhaité avant le 10 Octobre.`,
    invitation_galeriste_presse: `Chers confrères et passionnés d'art,\n\nVous êtes cordialement invités au vernissage de l'exposition « ${expoTitle} » présentant les nouvelles recherches plastiques de ${profile.name || "l'artiste"}.\n\n📅 ${expoDate} — ${expoTime}\n📍 ${expoVenue}\n\nDossier de presse et catalogue d'exposition disponibles à l'accueil. Rencontre avec l'artiste et coupe de bienvenue.`,
    invitation_amis_reseaux: `🎉 C'est le grand soir ! Je vous donne rendez-vous pour le vernissage de ma nouvelle série de toiles « ${expoTitle} » !\n\n📅 ${expoDate} dès ${expoTime}\n📍 ${expoVenue}\n\nHâte de partager ce moment chaleureux avec vous autour d'un verre et de vous faire découvrir mes dernières créations d'atelier ! Entrée libre, venez nombreux ! 🥂✨`,
    texte_rappel_j_moins_2: `Bonjour ! Petit rappel amical : nous nous retrouvons ce ${expoDate} à ${expoTime.split('-')[0].trim()} pour le vernissage de « ${expoTitle} » à la ${expoVenue.split(',')[0]}. Hâte de vous y voir ! 🥂`
  };

  // Traiteur calculations
  const calculateCatering = () => {
    let bottlePrice = cocktailType === "prestige" ? 28 : cocktailType === "standard" ? 14 : 9;
    let piecePrice = cocktailType === "prestige" ? 2.5 : cocktailType === "standard" ? 1.6 : 1.0;
    let piecesPerGuest = cocktailType === "prestige" ? 7 : cocktailType === "standard" ? 5 : 3;

    const bottlesChampagne = Math.ceil(guestCount / 3.2); // ~3-4 coupes par personne
    const bottlesSoftWater = Math.ceil(guestCount / 6);
    const totalPieces = guestCount * piecesPerGuest;
    const glassesNeeded = Math.ceil(guestCount * 1.5);
    const napkinsNeeded = guestCount * 2;

    const budgetDrinks = bottlesChampagne * bottlePrice + bottlesSoftWater * 4;
    const budgetFood = totalPieces * piecePrice;
    const budgetMisc = 60; // glaçons, serviettes, déco
    const totalEstimated = budgetDrinks + budgetFood + budgetMisc;

    return {
      bottlesChampagne,
      bottlesSoftWater,
      totalPieces,
      glassesNeeded,
      napkinsNeeded,
      totalEstimated,
      budgetDrinks,
      budgetFood
    };
  };

  const catering = calculateCatering();

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
              <PartyPopper className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`font-serif text-base sm:text-lg font-bold tracking-tight ${
                  isDark ? "text-white" : "text-black"
                }`}>
                  Soirées de Vernissage, Événements & Expérience Visiteur
                </h2>
                <span className="text-[9px] font-mono font-black px-2 py-0.5 uppercase bg-[#c9a84c] text-black">
                  5 Outils Déployés
                </span>
              </div>
              <p className={`text-xs font-sans mt-0.5 font-medium ${
                isDark ? "text-neutral-300" : "text-stone-700"
              }`}>
                Cartel QR code & audioguide, cartons d'invitation VIP, livre d'or interactif, calculateur traiteur et scénographie.
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

        {/* 5 Vernissage Tabs Navigation */}
        <div className={`flex border-b overflow-x-auto scrollbar-thin ${
          isDark ? "bg-black border-[#c9a84c]/20" : "bg-stone-100 border-stone-300"
        }`}>
          <button
            onClick={() => setActiveTab("qrcode")}
            className={`px-4 py-3 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap border-b-2 transition-all ${
              activeTab === "qrcode"
                ? "border-[#c9a84c] text-[#c9a84c] bg-[#c9a84c]/10"
                : isDark ? "border-transparent text-neutral-400 hover:text-white" : "border-transparent text-stone-600 hover:text-black"
            }`}
          >
            <QrCode className="w-4 h-4" />
            6. QR Cartel & Audioguide
          </button>

          <button
            onClick={() => setActiveTab("invitations")}
            className={`px-4 py-3 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap border-b-2 transition-all ${
              activeTab === "invitations"
                ? "border-[#c9a84c] text-[#c9a84c] bg-[#c9a84c]/10"
                : isDark ? "border-transparent text-neutral-400 hover:text-white" : "border-transparent text-stone-600 hover:text-black"
            }`}
          >
            <Mail className="w-4 h-4" />
            7. Invitations VIP & RSVP
          </button>

          <button
            onClick={() => setActiveTab("livredor")}
            className={`px-4 py-3 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap border-b-2 transition-all ${
              activeTab === "livredor"
                ? "border-[#c9a84c] text-[#c9a84c] bg-[#c9a84c]/10"
                : isDark ? "border-transparent text-neutral-400 hover:text-white" : "border-transparent text-stone-600 hover:text-black"
            }`}
          >
            <MessageSquareHeart className="w-4 h-4" />
            8. Livre d'Or & Offres Directes
          </button>

          <button
            onClick={() => setActiveTab("logistique")}
            className={`px-4 py-3 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap border-b-2 transition-all ${
              activeTab === "logistique"
                ? "border-[#c9a84c] text-[#c9a84c] bg-[#c9a84c]/10"
                : isDark ? "border-transparent text-neutral-400 hover:text-white" : "border-transparent text-stone-600 hover:text-black"
            }`}
          >
            <Calculator className="w-4 h-4" />
            9. Calculateur Traiteur & Régie
          </button>

          <button
            onClick={() => setActiveTab("scenographie")}
            className={`px-4 py-3 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap border-b-2 transition-all ${
              activeTab === "scenographie"
                ? "border-[#c9a84c] text-[#c9a84c] bg-[#c9a84c]/10"
                : isDark ? "border-transparent text-neutral-400 hover:text-white" : "border-transparent text-stone-600 hover:text-black"
            }`}
          >
            <Layout className="w-4 h-4" />
            10. Scénographie & Accrochage
          </button>
        </div>

        {/* Modal Tab Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 6: QR CODE CARTEL CONNECTÉ & AUDIOGUIDE */}
          {activeTab === "qrcode" && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Header Action Bar */}
              <div className={`p-4 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isDark ? "bg-[#141414] border-[#c9a84c]/40" : "bg-amber-50 border-[#c9a84c]"
              }`}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 bg-[#c9a84c] text-black">
                      Cartel d'Exposition Connecté
                    </span>
                    <span className={`text-xs font-serif font-bold ${isDark ? "text-white" : "text-black"}`}>
                      QR Code Haute Résolution + Audioguide Immersion Visiteur
                    </span>
                  </div>
                  <p className={`text-xs font-sans mt-1 ${isDark ? "text-neutral-300" : "text-stone-800"}`}>
                    Imprimez ce cartel et collez-le sous chaque tableau lors du vernissage. Vos invités scannent pour écouter l'audioguide et découvrir les secrets d'atelier.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {onAnalyzeVernissageTool && (
                    <button
                      onClick={() => handleRunAi("vernissage_audioguide")}
                      disabled={loadingTool === "vernissage_audioguide"}
                      className="px-3.5 py-2 bg-[#c9a84c] hover:bg-white text-black font-mono font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors whitespace-nowrap shadow-md"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingTool === "vernissage_audioguide" ? "animate-spin" : ""}`} />
                      {loadingTool === "vernissage_audioguide" ? "Génération..." : "Régénérer Texte"}
                    </button>
                  )}
                  <button
                    onClick={handlePrintCartel}
                    className={`px-3.5 py-2 border font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                      isDark ? "bg-black border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-black" : "bg-white border-stone-400 text-black hover:bg-stone-100"
                    }`}
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Imprimer le Cartel
                  </button>
                </div>
              </div>

              {/* Printable Museum Cartel Card Preview */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Physical Cartel Box */}
                <div className={`md:col-span-6 p-6 border flex flex-col justify-between relative shadow-xl ${
                  isDark ? "bg-black border-[#c9a84c] text-white" : "bg-white border-[#c9a84c] text-black"
                }`}>
                  <div className="absolute top-2 right-2 text-[9px] font-mono uppercase tracking-widest text-[#c9a84c]/60">
                    CARTEL MUSÉAL • DIMENSIONS 15 x 10 CM
                  </div>

                  <div className="space-y-3 mt-2">
                    <div className="border-b pb-2 border-[#c9a84c]/30">
                      <h3 className="font-serif font-bold text-lg text-[#c9a84c] uppercase tracking-wide">
                        {profile.name || "ARTISTE PEINTRE"}
                      </h3>
                      <p className={`text-xs font-serif italic ${isDark ? "text-neutral-300" : "text-stone-700"}`}>
                        {defaultAudioguideData.titre_cartel}
                      </p>
                    </div>

                    <p className="text-xs font-sans leading-relaxed">
                      {defaultAudioguideData.pitch_express_30s}
                    </p>

                    <div className={`p-2.5 border text-[11px] font-sans italic ${
                      isDark ? "bg-[#141414] border-white/10 text-neutral-300" : "bg-stone-50 border-stone-200 text-stone-800"
                    }`}>
                      💡 <strong>Secret d'atelier :</strong> {defaultAudioguideData.anecdote_secrete_atelier}
                    </div>
                  </div>

                  {/* QR Code & Audio badge */}
                  <div className="mt-6 pt-4 border-t border-[#c9a84c]/30 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-white border border-[#c9a84c] shadow-sm">
                        <QRCodeSVG 
                          value={window.location.href} 
                          size={70} 
                          level="M" 
                          fgColor="#000000" 
                          bgColor="#FFFFFF"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider block text-[#c9a84c]">
                          SCANNEZ AVEC VOTRE SMARTPHONE
                        </span>
                        <p className="text-[11px] font-sans font-medium">
                          🎧 Écoutez l'audioguide immersif & découvrez le certificat d'authenticité.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactive Audio Player & Guide Narrative */}
                <div className={`md:col-span-6 p-5 border flex flex-col justify-between ${
                  isDark ? "bg-[#111111] border-[#c9a84c]/40 text-white" : "bg-stone-50 border-[#c9a84c] text-black"
                }`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b pb-2 border-[#c9a84c]/30">
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-[#c9a84c]" />
                        <h4 className="font-mono text-xs font-bold uppercase text-[#c9a84c]">
                          Audioguide Vocal pour les Visiteurs
                        </h4>
                      </div>

                      {/* Web Speech Trigger */}
                      <button
                        onClick={() => handleToggleSpeech(defaultAudioguideData.texte_audioguide_complet)}
                        className={`px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                          isPlayingAudio 
                            ? "bg-red-600 text-white animate-pulse" 
                            : "bg-[#c9a84c] text-black hover:bg-white"
                        }`}
                      >
                        {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        {isPlayingAudio ? "Arrêter la voix" : "Écouter la narration vocale"}
                      </button>
                    </div>

                    <div className={`p-4 border text-xs font-serif leading-relaxed max-h-60 overflow-y-auto ${
                      isDark ? "bg-black border-white/10 text-neutral-200" : "bg-white border-stone-200 text-stone-900"
                    }`}>
                      <p className="whitespace-pre-wrap">{defaultAudioguideData.texte_audioguide_complet}</p>
                    </div>

                    <div className={`p-3 border text-xs font-sans ${
                      isDark ? "bg-[#161616] border-[#c9a84c]/30 text-neutral-300" : "bg-amber-50 border-[#c9a84c]/40 text-stone-900"
                    }`}>
                      <strong className="text-[#c9a84c] block mb-1">Question d'immersion au visiteur :</strong>
                      {defaultAudioguideData.question_au_visiteur}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
                    <button
                      onClick={() => handleCopy(
                        `${defaultAudioguideData.titre_cartel}\n\n${defaultAudioguideData.pitch_express_30s}\n\n${defaultAudioguideData.texte_audioguide_complet}\n\nSecret d'atelier: ${defaultAudioguideData.anecdote_secrete_atelier}`,
                        "audioguide_text"
                      )}
                      className={`px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 border transition-all ${
                        copiedKey === "audioguide_text"
                          ? "bg-emerald-600 text-white border-emerald-500"
                          : (isDark ? "bg-black text-[#c9a84c] border-[#c9a84c] hover:bg-[#c9a84c] hover:text-black" : "bg-white text-stone-900 border-stone-300 hover:bg-stone-100")
                      }`}
                    >
                      {copiedKey === "audioguide_text" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedKey === "audioguide_text" ? "Texte Copié !" : "Copier le texte d'audioguide"}
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 7: INVITATIONS VIP & RSVP */}
          {activeTab === "invitations" && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Event Parameters Config */}
              <div className={`p-4 border ${isDark ? "bg-[#141414] border-[#c9a84c]" : "bg-amber-50 border-[#c9a84c]"}`}>
                <div className="flex items-center gap-2 mb-3">
                  <Sliders className="w-4 h-4 text-[#c9a84c]" />
                  <h3 className="font-serif font-bold text-sm text-[#c9a84c]">
                    Informations Clés de Votre Vernissage
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-sans">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                      Titre de l'Exposition
                    </label>
                    <input
                      type="text"
                      value={expoTitle}
                      onChange={(e) => setExpoTitle(e.target.value)}
                      className={`w-full p-2 border font-serif font-bold text-xs ${
                        isDark ? "bg-black border-[#c9a84c] text-white" : "bg-white border-stone-300 text-black"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                      Date du Vernissage
                    </label>
                    <input
                      type="text"
                      value={expoDate}
                      onChange={(e) => setExpoDate(e.target.value)}
                      className={`w-full p-2 border font-mono text-xs ${
                        isDark ? "bg-black border-white/20 text-white" : "bg-white border-stone-300 text-black"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                      Horaires & Cocktail
                    </label>
                    <input
                      type="text"
                      value={expoTime}
                      onChange={(e) => setExpoTime(e.target.value)}
                      className={`w-full p-2 border font-mono text-xs ${
                        isDark ? "bg-black border-white/20 text-white" : "bg-white border-stone-300 text-black"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                      Galerie / Adresse
                    </label>
                    <input
                      type="text"
                      value={expoVenue}
                      onChange={(e) => setExpoVenue(e.target.value)}
                      className={`w-full p-2 border text-xs ${
                        isDark ? "bg-black border-white/20 text-white" : "bg-white border-stone-300 text-black"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* 3 Declinations of Invitations */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. VIP Collectionneurs */}
                <div className={`p-4 border flex flex-col justify-between ${
                  isDark ? "bg-black border-[#c9a84c]/40 text-white" : "bg-white border-[#c9a84c] text-black shadow-md"
                }`}>
                  <div className="space-y-2.5">
                    <div className="border-b pb-2 border-[#c9a84c]/30 flex items-center justify-between">
                      <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 bg-[#c9a84c] text-black">
                        Collectionneurs VIP
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">Avant-première</span>
                    </div>

                    <pre className={`p-3 border text-xs font-serif whitespace-pre-wrap leading-relaxed max-h-52 overflow-y-auto ${
                      isDark ? "bg-neutral-900 border-white/10 text-neutral-200" : "bg-stone-50 border-stone-200 text-stone-900"
                    }`}>
                      {defaultInvitationsData.invitation_vip_collectionneur}
                    </pre>
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/10 flex gap-2">
                    <button
                      onClick={() => handleCopy(defaultInvitationsData.invitation_vip_collectionneur, "invit_vip")}
                      className="w-full py-1.5 bg-[#c9a84c] hover:bg-white text-black text-xs font-mono font-bold uppercase tracking-wider transition-colors"
                    >
                      {copiedKey === "invit_vip" ? "Copié !" : "Copier Email VIP"}
                    </button>
                  </div>
                </div>

                {/* 2. Directeurs Galeries & Presse */}
                <div className={`p-4 border flex flex-col justify-between ${
                  isDark ? "bg-black border-[#c9a84c]/40 text-white" : "bg-white border-[#c9a84c] text-black shadow-md"
                }`}>
                  <div className="space-y-2.5">
                    <div className="border-b pb-2 border-[#c9a84c]/30 flex items-center justify-between">
                      <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 bg-[#c9a84c] text-black">
                        Galeristes & Presse
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">Dossier Presse</span>
                    </div>

                    <pre className={`p-3 border text-xs font-serif whitespace-pre-wrap leading-relaxed max-h-52 overflow-y-auto ${
                      isDark ? "bg-neutral-900 border-white/10 text-neutral-200" : "bg-stone-50 border-stone-200 text-stone-900"
                    }`}>
                      {defaultInvitationsData.invitation_galeriste_presse}
                    </pre>
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/10 flex gap-2">
                    <button
                      onClick={() => handleCopy(defaultInvitationsData.invitation_galeriste_presse, "invit_presse")}
                      className="w-full py-1.5 bg-[#c9a84c] hover:bg-white text-black text-xs font-mono font-bold uppercase tracking-wider transition-colors"
                    >
                      {copiedKey === "invit_presse" ? "Copié !" : "Copier Invitation Pro"}
                    </button>
                  </div>
                </div>

                {/* 3. Amis & Réseaux Sociaux (WhatsApp/Insta) */}
                <div className={`p-4 border flex flex-col justify-between ${
                  isDark ? "bg-black border-[#c9a84c]/40 text-white" : "bg-white border-[#c9a84c] text-black shadow-md"
                }`}>
                  <div className="space-y-2.5">
                    <div className="border-b pb-2 border-[#c9a84c]/30 flex items-center justify-between">
                      <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 bg-[#c9a84c] text-black">
                        WhatsApp & Instagram
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">Réseaux & Amis</span>
                    </div>

                    <pre className={`p-3 border text-xs font-serif whitespace-pre-wrap leading-relaxed max-h-52 overflow-y-auto ${
                      isDark ? "bg-neutral-900 border-white/10 text-neutral-200" : "bg-stone-50 border-stone-200 text-stone-900"
                    }`}>
                      {defaultInvitationsData.invitation_amis_reseaux}
                    </pre>
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/10 flex gap-2">
                    <button
                      onClick={() => handleCopy(defaultInvitationsData.invitation_amis_reseaux, "invit_insta")}
                      className="w-full py-1.5 bg-[#c9a84c] hover:bg-white text-black text-xs font-mono font-bold uppercase tracking-wider transition-colors"
                    >
                      {copiedKey === "invit_insta" ? "Copié !" : "Copier WhatsApp/Insta"}
                    </button>
                  </div>
                </div>

              </div>

              {/* SMS Reminder J-2 */}
              <div className={`p-4 border flex items-center justify-between gap-4 ${
                isDark ? "bg-[#141414] border-white/10 text-white" : "bg-stone-50 border-stone-200 text-black"
              }`}>
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase text-[#c9a84c] flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Message de Rappel Automatique J-2
                  </h4>
                  <p className="text-xs font-sans mt-1">
                    {defaultInvitationsData.texte_rappel_j_moins_2}
                  </p>
                </div>

                <button
                  onClick={() => handleCopy(defaultInvitationsData.texte_rappel_j_moins_2, "rappel_j2")}
                  className="px-3 py-1.5 bg-black border border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-black font-mono font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-colors"
                >
                  {copiedKey === "rappel_j2" ? "Copié !" : "Copier le SMS"}
                </button>
              </div>

            </div>
          )}

          {/* TAB 8: LIVRE D'OR VIRTUEL & OFFRES DIRECTES */}
          {activeTab === "livredor" && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className={`p-4 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isDark ? "bg-[#141414] border-[#c9a84c]/40" : "bg-amber-50 border-[#c9a84c]"
              }`}>
                <div>
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#c9a84c]">
                    Livre d'Or Connecté & Mur des Offres Directes
                  </h3>
                  <p className={`text-xs font-sans mt-0.5 ${isDark ? "text-neutral-300" : "text-stone-800"}`}>
                    Les visiteurs et collectionneurs peuvent laisser un mot doux d'admiration ou formuler une proposition d'acquisition discrète.
                  </p>
                </div>

                <button
                  onClick={() => handleCopy(
                    `=== LIVRE D'OR D'EXPOSITION — ${expoTitle} ===\n\n` +
                    guestComments.map(c => `[${c.date}] ${c.name} (${c.role}) — ${c.intention}\n« ${c.message} »`).join("\n\n"),
                    "livredor_export"
                  )}
                  className="px-3.5 py-2 bg-[#c9a84c] hover:bg-white text-black font-mono font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors whitespace-nowrap shadow-md"
                >
                  {copiedKey === "livredor_export" ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                  {copiedKey === "livredor_export" ? "Livre d'Or Copié !" : "Exporter les Messages"}
                </button>
              </div>

              {/* Add Comment Form & Live Feed */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Form to add note */}
                <div className={`md:col-span-5 p-5 border ${
                  isDark ? "bg-black border-[#c9a84c]" : "bg-white border-[#c9a84c] shadow-md"
                }`}>
                  <h4 className="font-serif font-bold text-sm text-[#c9a84c] mb-3 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-[#c9a84c]" /> Laisser un mot ou une offre
                  </h4>

                  <form onSubmit={handleAddGuestComment} className="space-y-3 text-xs font-sans">
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                        Votre Nom / Société
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Jean-Luc Moreau (Collectionneur)"
                        value={newCommentName}
                        onChange={(e) => setNewCommentName(e.target.value)}
                        className={`w-full p-2 border text-xs ${
                          isDark ? "bg-neutral-900 border-white/20 text-white" : "bg-stone-50 border-stone-300 text-black"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                        Intention / Objet
                      </label>
                      <select
                        value={newCommentIntention}
                        onChange={(e) => setNewCommentIntention(e.target.value)}
                        className={`w-full p-2 border font-mono text-xs ${
                          isDark ? "bg-neutral-900 border-[#c9a84c] text-white" : "bg-stone-50 border-stone-300 text-black"
                        }`}
                      >
                        <option value="Coup de cœur artistique">💖 Coup de cœur artistique</option>
                        <option value="Proposition d'achat / Option">💎 Proposition d'achat / Option</option>
                        <option value="Demande de catalogue pro">📄 Demande de catalogue de prix</option>
                        <option value="Invitation exposition / Galerie">🏛️ Invitation exposition / Galerie</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                        Votre Message / Remarque
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Écrivez votre mot doux ou votre proposition..."
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        className={`w-full p-2 border text-xs leading-relaxed ${
                          isDark ? "bg-neutral-900 border-white/20 text-white" : "bg-stone-50 border-stone-300 text-black"
                        }`}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-[#c9a84c] hover:bg-white text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Signer le Livre d'Or
                    </button>
                  </form>
                </div>

                {/* Feed of entries */}
                <div className={`md:col-span-7 p-5 border space-y-3 max-h-[450px] overflow-y-auto ${
                  isDark ? "bg-[#111111] border-white/10" : "bg-stone-50 border-stone-200"
                }`}>
                  <h4 className="font-mono text-xs font-bold uppercase text-[#c9a84c] mb-2 flex items-center justify-between">
                    <span>Messages des Visiteurs ({guestComments.length})</span>
                    <span className="text-[10px] font-normal text-neutral-400">Mis à jour en direct</span>
                  </h4>

                  {guestComments.map((entry, idx) => (
                    <div key={idx} className={`p-3.5 border transition-all ${
                      isDark ? "bg-black border-[#c9a84c]/30 text-white" : "bg-white border-stone-300 text-black shadow-sm"
                    }`}>
                      <div className="flex items-start justify-between gap-2 border-b pb-1.5 border-white/10 mb-2">
                        <div>
                          <strong className="font-serif text-xs font-bold text-[#c9a84c]">{entry.name}</strong>
                          <span className="text-[10px] font-mono text-neutral-400 ml-2">({entry.role})</span>
                        </div>
                        <span className="text-[9px] font-mono px-2 py-0.5 bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/40 uppercase">
                          {entry.intention}
                        </span>
                      </div>

                      <p className="text-xs font-sans leading-relaxed italic">
                        « {entry.message} »
                      </p>

                      <div className="text-right text-[9px] font-mono text-neutral-400 mt-2">
                        {entry.date}
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>
          )}

          {/* TAB 9: CALCULATEUR DE LOGISTIQUE & TRAITEUR */}
          {activeTab === "logistique" && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Dynamic Interactive Sliders */}
              <div className={`p-5 border ${isDark ? "bg-[#141414] border-[#c9a84c]" : "bg-amber-50 border-[#c9a84c]"}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-[#c9a84c]" />
                    <h3 className="font-serif font-bold text-sm text-[#c9a84c]">
                      Simulateur Traiteur & Budget Logistique Vernissage
                    </h3>
                  </div>

                  <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-950/40 px-2.5 py-1 border border-emerald-500/40">
                    Budget Estimé : ~{catering.totalEstimated} €
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-neutral-400">Nombre d'Invités Attendus :</span>
                      <strong className="text-[#c9a84c] text-sm">{guestCount} personnes</strong>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={200}
                      step={5}
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full accent-[#c9a84c] cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] font-mono text-neutral-400 mt-1">
                      <span>10 pers. (Intimiste)</span>
                      <span>50 pers. (Standard)</span>
                      <span>200 pers. (Grand Événement)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                      Gamme de Réception
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setCocktailType("eco")}
                        className={`p-2 border text-xs font-mono font-bold transition-all ${
                          cocktailType === "eco"
                            ? "bg-[#c9a84c] text-black border-[#c9a84c]"
                            : isDark ? "bg-black border-white/20 text-white" : "bg-white border-stone-300 text-black"
                        }`}
                      >
                        Éco / Vin
                      </button>

                      <button
                        type="button"
                        onClick={() => setCocktailType("standard")}
                        className={`p-2 border text-xs font-mono font-bold transition-all ${
                          cocktailType === "standard"
                            ? "bg-[#c9a84c] text-black border-[#c9a84c]"
                            : isDark ? "bg-black border-white/20 text-white" : "bg-white border-stone-300 text-black"
                        }`}
                      >
                        Crémant & Canapés
                      </button>

                      <button
                        type="button"
                        onClick={() => setCocktailType("prestige")}
                        className={`p-2 border text-xs font-mono font-bold transition-all ${
                          cocktailType === "prestige"
                            ? "bg-[#c9a84c] text-black border-[#c9a84c]"
                            : isDark ? "bg-black border-white/20 text-white" : "bg-white border-stone-300 text-black"
                        }`}
                      >
                        Champagne VIP
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rations & Quantities Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className={`p-4 border text-center ${isDark ? "bg-black border-[#c9a84c]/40 text-white" : "bg-white border-[#c9a84c] text-black shadow-sm"}`}>
                  <span className="text-[10px] font-mono uppercase text-neutral-400 block">Bouteilles Bulles / Vin</span>
                  <strong className="text-xl font-mono font-black text-[#c9a84c] my-1 block">{catering.bottlesChampagne}</strong>
                  <span className="text-[10px] font-sans text-neutral-400">(~3 coupes / pers.)</span>
                </div>

                <div className={`p-4 border text-center ${isDark ? "bg-black border-[#c9a84c]/40 text-white" : "bg-white border-[#c9a84c] text-black shadow-sm"}`}>
                  <span className="text-[10px] font-mono uppercase text-neutral-400 block">Pièces Cocktail Salées</span>
                  <strong className="text-xl font-mono font-black text-[#c9a84c] my-1 block">{catering.totalPieces}</strong>
                  <span className="text-[10px] font-sans text-neutral-400">(Amuse-bouches frais)</span>
                </div>

                <div className={`p-4 border text-center ${isDark ? "bg-black border-[#c9a84c]/40 text-white" : "bg-white border-[#c9a84c] text-black shadow-sm"}`}>
                  <span className="text-[10px] font-mono uppercase text-neutral-400 block">Verres & Flûtes</span>
                  <strong className="text-xl font-mono font-black text-[#c9a84c] my-1 block">{catering.glassesNeeded}</strong>
                  <span className="text-[10px] font-sans text-neutral-400">(Ratio 1.5 par invité)</span>
                </div>

                <div className={`p-4 border text-center ${isDark ? "bg-black border-[#c9a84c]/40 text-white" : "bg-white border-[#c9a84c] text-black shadow-sm"}`}>
                  <span className="text-[10px] font-mono uppercase text-neutral-400 block">Eaux & Softs</span>
                  <strong className="text-xl font-mono font-black text-[#c9a84c] my-1 block">{catering.bottlesSoftWater}</strong>
                  <span className="text-[10px] font-sans text-neutral-400">(Bouteilles 1.5L)</span>
                </div>
              </div>

              {/* Timing of the evening & Regie Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Minuted Timing */}
                <div className={`p-4 border ${isDark ? "bg-black border-[#c9a84c]/40" : "bg-white border-[#c9a84c]"}`}>
                  <h4 className="text-xs font-mono font-bold uppercase text-[#c9a84c] mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Déroulé Minuté Conseillé de la Soirée
                  </h4>

                  <div className="space-y-2 text-xs font-sans">
                    <div className="flex gap-2">
                      <strong className="font-mono text-[#c9a84c] w-24 flex-shrink-0">18h00 - 18h30</strong>
                      <span>Accueil VIP & Collectionneurs en avant-première calme.</span>
                    </div>
                    <div className="flex gap-2">
                      <strong className="font-mono text-[#c9a84c] w-24 flex-shrink-0">18h30 - 19h15</strong>
                      <span>Arrivée des invités, service des premières coupes, immersion musicale.</span>
                    </div>
                    <div className="flex gap-2">
                      <strong className="font-mono text-[#c9a84c] w-24 flex-shrink-0">19h15 - 19h30</strong>
                      <span>Discours court de l'artiste & du galeriste (max 5 minutes) + remerciements.</span>
                    </div>
                    <div className="flex gap-2">
                      <strong className="font-mono text-[#c9a84c] w-24 flex-shrink-0">19h30 - 21h30</strong>
                      <span>Moment des échanges intimes, dédicaces de catalogues et ventes directes.</span>
                    </div>
                  </div>
                </div>

                {/* Regie Checklist */}
                <div className={`p-4 border ${isDark ? "bg-black border-[#c9a84c]/40" : "bg-white border-[#c9a84c]"}`}>
                  <h4 className="text-xs font-mono font-bold uppercase text-[#c9a84c] mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Checklist de Régie Indispensable
                  </h4>

                  <ul className="space-y-1.5 text-xs font-sans">
                    <li className="flex items-center gap-2">
                      <span className="text-red-500 font-bold">🔴</span>
                      <span>Gommettes rouges adhésives pour marquer les toiles <strong>« VENDU »</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#c9a84c] font-bold">💳</span>
                      <span>Terminal de paiement CB / SumUp chargé à 100% avec connexion 4G</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#c9a84c] font-bold">📖</span>
                      <span>Livre d'or papier posé sur pupitre avec deux feutres dorés/noirs fins</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#c9a84c] font-bold">🏷️</span>
                      <span>Cartels QR code collés sous chaque tableau à niveau laser</span>
                    </li>
                  </ul>
                </div>

              </div>

            </div>
          )}

          {/* TAB 10: SCÉNOGRAPHIE 2D & PLAN D'ACCROCHAGE */}
          {activeTab === "scenographie" && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Scenography Controls */}
              <div className={`p-4 border ${isDark ? "bg-[#141414] border-[#c9a84c]" : "bg-amber-50 border-[#c9a84c]"}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Layout className="w-4 h-4 text-[#c9a84c]" />
                    <h3 className="font-serif font-bold text-sm text-[#c9a84c]">
                      Simulateur de Mur de Galerie & Normes Muséales
                    </h3>
                  </div>

                  <span className="text-[10px] font-mono uppercase bg-[#c9a84c] text-black px-2 py-0.5 font-bold">
                    Norme Muséale : Axe Médian à 1,45 m du Sol
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                      Couleur de Cimaise
                    </label>
                    <select
                      value={wallColor}
                      onChange={(e) => setWallColor(e.target.value as any)}
                      className={`w-full p-2 border font-mono text-xs ${
                        isDark ? "bg-black border-[#c9a84c] text-white" : "bg-white border-stone-300 text-black"
                      }`}
                    >
                      <option value="white">Blanc Pur Galerie (Ral 9010)</option>
                      <option value="stone">Gris Minéral / Béton Ciré</option>
                      <option value="dark">Noir Ébène Mat d'Exposition</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                      Éclairage Spots
                    </label>
                    <select
                      value={wallLighting}
                      onChange={(e) => setWallLighting(e.target.value as any)}
                      className={`w-full p-2 border font-mono text-xs ${
                        isDark ? "bg-black border-[#c9a84c] text-white" : "bg-white border-stone-300 text-black"
                      }`}
                    >
                      <option value="3000k">3000K (Blanc Chaud Naturel - Idéal Peinture)</option>
                      <option value="2700k">2700K (Ambiance Tamisée Intimiste)</option>
                      <option value="4000k">4000K (Lumière du Jour Neutre)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                      Espacement entre Toiles ({artworkSpacing} cm)
                    </label>
                    <input
                      type="range"
                      min={20}
                      max={80}
                      step={5}
                      value={artworkSpacing}
                      onChange={(e) => setArtworkSpacing(Number(e.target.value))}
                      className="w-full accent-[#c9a84c] cursor-pointer mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Visual 2D Gallery Wall Render Canvas */}
              <div className={`p-6 border relative overflow-hidden transition-all duration-500 shadow-2xl min-h-[280px] flex flex-col justify-between ${
                wallColor === "white" 
                  ? "bg-neutral-100 border-neutral-300" 
                  : wallColor === "stone" 
                    ? "bg-[#2b2b2b] border-[#444]" 
                    : "bg-[#0a0a0a] border-[#c9a84c]/50"
              }`}>
                
                {/* Spotlights effects on top */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-b from-yellow-300/40 to-transparent" />
                <div className="flex justify-around items-center border-b border-black/10 pb-2 mb-4">
                  <div className="w-4 h-2 bg-neutral-700 rounded-b shadow" />
                  <div className="w-4 h-2 bg-neutral-700 rounded-b shadow" />
                  <div className="w-4 h-2 bg-neutral-700 rounded-b shadow" />
                </div>

                {/* Paintings on the wall */}
                <div className="flex items-center justify-center gap-6 sm:gap-10 my-auto py-6" style={{ gap: `${artworkSpacing}px` }}>
                  
                  {/* Artwork 1 */}
                  <div className="flex flex-col items-center group">
                    <div className="w-24 sm:w-32 h-32 sm:h-40 bg-neutral-900 border-4 border-[#c9a84c] shadow-2xl overflow-hidden relative transition-transform duration-300 group-hover:scale-105">
                      {activeArtworkImage ? (
                        <img src={activeArtworkImage} alt="Artwork" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-amber-800 to-black flex items-center justify-center p-2 text-center text-[10px] text-white">
                          Toile 01 (100x80)
                        </div>
                      )}
                    </div>
                    {/* Cartel under painting */}
                    <div className="mt-2 px-2 py-0.5 bg-white border border-neutral-400 text-[8px] text-black font-mono shadow-sm">
                      Axe 1,45m • Cartel QR
                    </div>
                  </div>

                  {/* Artwork 2 (Diptyque / Second work) */}
                  <div className="flex flex-col items-center group">
                    <div className="w-20 sm:w-28 h-28 sm:h-36 bg-neutral-900 border-4 border-black shadow-2xl overflow-hidden relative transition-transform duration-300 group-hover:scale-105">
                      {activeSeries && activeSeries.length > 1 && activeSeries[1]?.image ? (
                        <img src={activeSeries[1].image} alt="Artwork 2" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-neutral-800 via-amber-950 to-neutral-900 flex items-center justify-center p-2 text-center text-[10px] text-white">
                          Toile 02 (80x80)
                        </div>
                      )}
                    </div>
                    <div className="mt-2 px-2 py-0.5 bg-white border border-neutral-400 text-[8px] text-black font-mono shadow-sm">
                      Axe 1,45m • Cartel QR
                    </div>
                  </div>

                  {/* Artwork 3 */}
                  <div className="hidden sm:flex flex-col items-center group">
                    <div className="w-28 sm:w-36 h-36 sm:h-44 bg-neutral-900 border-4 border-[#c9a84c] shadow-2xl overflow-hidden relative transition-transform duration-300 group-hover:scale-105">
                      {activeSeries && activeSeries.length > 2 && activeSeries[2]?.image ? (
                        <img src={activeSeries[2].image} alt="Artwork 3" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-bl from-amber-700 to-stone-900 flex items-center justify-center p-2 text-center text-[10px] text-white">
                          Toile 03 (120x100)
                        </div>
                      )}
                    </div>
                    <div className="mt-2 px-2 py-0.5 bg-white border border-neutral-400 text-[8px] text-black font-mono shadow-sm">
                      Axe 1,45m • Cartel QR
                    </div>
                  </div>

                </div>

                {/* Museum Guideline Baseline */}
                <div className="border-t border-dashed border-[#c9a84c]/60 pt-2 flex items-center justify-between text-[10px] font-mono text-[#c9a84c]">
                  <span>Plinthe / Sol</span>
                  <span className="bg-black/80 px-2 py-0.5 text-white">← Métrage Linéaire Total Cimaise Recommandé : 8,50 m →</span>
                  <span>Hauteur Sous Plafond 3,20 m</span>
                </div>
              </div>

              {/* Scenography Guidelines */}
              <div className={`p-4 border ${isDark ? "bg-black border-[#c9a84c]/40" : "bg-white border-[#c9a84c]"}`}>
                <h4 className="text-xs font-mono font-bold uppercase text-[#c9a84c] mb-2">
                  Conseils d'Accrochage Professionnel pour Valoriser la Vente
                </h4>
                <p className="text-xs font-sans leading-relaxed text-neutral-300">
                  Disposez votre œuvre phare (la plus contrastée ou de plus grand format) directement dans l'axe de vision de la porte d'entrée de la galerie. Laissez respirer chaque tableau avec un vide d'au moins 40 cm pour ne pas saturer le regard du collectionneur.
                </p>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
