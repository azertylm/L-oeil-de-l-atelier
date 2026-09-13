/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
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
  QrCode, 
  Share2, 
  Globe, 
  Crown, 
  BookOpen, 
  User, 
  Layers, 
  X, 
  Eye, 
  EyeOff, 
  Sliders, 
  Search,
  ExternalLink,
  ShieldCheck,
  Zap,
  Printer
} from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext.js";

interface TopExplanationTabProps {
  theme?: "dark-gold" | "light";
  isOpen: boolean;
  onToggle: () => void;
  onClose?: () => void;
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

export default function TopExplanationTab({
  theme = "dark-gold",
  isOpen,
  onToggle,
  onClose,
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
}: TopExplanationTabProps) {
  const { t } = useLanguage();
  const isDark = theme === "dark-gold";

  // Filtre par catégorie dans le guide
  const [selectedCategory, setSelectedCategory] = useState<"all" | "atelier" | "cartels" | "vente" | "galerie" | "vernissage" | "export">("all");
  const [searchFilter, setSearchFilter] = useState<string>("");

  const categories = [
    { id: "all", label: "Tout voir (36 Outils)", icon: Sparkles },
    { id: "atelier", label: "1. Atelier & IA (16)", icon: Palette },
    { id: "cartels", label: "2. Cartels & QR (50)", icon: QrCode },
    { id: "vente", label: "3. Vente & Contrats COA", icon: Award },
    { id: "galerie", label: "4. Galeries & Candidature", icon: Building2 },
    { id: "vernissage", label: "5. Vernissages & Soirées", icon: PartyPopper },
    { id: "export", label: "6. Export & Partage", icon: Share2 },
  ];

  // Liste exhaustive et claire de toutes les fonctionnalités
  const features = [
    // Atelier & IA
    {
      category: "atelier",
      title: "Analyse Stylistique & Mouvements",
      desc: "Détecte les influences historiques, techniques de touche, géométrie de composition et filiations muséales de votre œuvre.",
      actionLabel: "Ouvrir l'analyse",
      onClick: onOpenArtworkTools,
      badge: "16 Outils",
      color: "border-[#c9a84c]"
    },
    {
      category: "atelier",
      title: "Harmonie Chromatique & Pigments",
      desc: "Extrait les 5 couleurs dominantes, la température chromatique, les accords complémentaires et les pigments recommandés.",
      actionLabel: "Voir la palette",
      onClick: onOpenArtworkTools,
      badge: "Couleurs",
      color: "border-amber-400"
    },
    {
      category: "atelier",
      title: "Démarche d'Artiste (Artist Statement)",
      desc: "Rédige une déclaration d'intention poétique, claire et percutante pour vos dossiers de presse et catalogues d'exposition.",
      actionLabel: "Générer la démarche",
      onClick: onOpenArtworkTools,
      badge: "Texte Pro",
      color: "border-purple-400"
    },
    {
      category: "atelier",
      title: "Cotation Financière & Prix Conseillé",
      desc: "Calcule une estimation réaliste de valeur marchande selon le médium, les dimensions, la complexité et le marché de l'art actuel.",
      actionLabel: "Estimer la cote",
      onClick: onOpenArtworkTools,
      badge: "Évaluation",
      color: "border-emerald-400"
    },
    {
      category: "atelier",
      title: "Critique d'Art Bienveillante & Constructive",
      desc: "Recevez le regard exigeant et formateur d'un conservateur pour valoriser vos points forts et perfectionner vos séries.",
      actionLabel: "Lire la critique",
      onClick: onOpenArtworkTools,
      badge: "Conseil",
      color: "border-blue-400"
    },
    {
      category: "atelier",
      title: "Poésie & Évocation Sensorielle",
      desc: "Compose des vers inspirés par l'atmosphère, les matières et le mystère de votre création pour toucher les visiteurs.",
      actionLabel: "Créer un poème",
      onClick: onOpenArtworkTools,
      badge: "Émotion",
      color: "border-rose-400"
    },

    // Cartels & QR
    {
      category: "cartels",
      title: "Cartels Muraux Muséaux Prêts à Imprimer",
      desc: "Générez des cartels d'exposition au format standard (A6, A7 ou brique) avec titre, artiste, médium, dimensions et QR code discret.",
      actionLabel: "Générer les cartels",
      onClick: () => onOpenQrSalesModal && onOpenQrSalesModal("generator"),
      badge: "Mise en page A4",
      color: "border-[#c9a84c]"
    },
    {
      category: "cartels",
      title: "QR Code Audioguide Vocal pour Visiteurs",
      desc: "Les visiteurs scannent le cartel et écoutent une médiation sonore immersive expliquant la genèse et les secrets de votre œuvre.",
      actionLabel: "Tester l'audioguide",
      onClick: () => onOpenQrSalesModal && onOpenQrSalesModal("visitor_preview"),
      badge: "Voix IA",
      color: "border-amber-500"
    },
    {
      category: "cartels",
      title: "Livre d'Or Numérique Interactif",
      desc: "Permettez au public de vous laisser des compliments, questions ou avis enthousiastes directement depuis leur téléphone portable.",
      actionLabel: "Voir le livre d'or",
      onClick: () => onOpenQrSalesModal && onOpenQrSalesModal("guestbook"),
      badge: "Interactivité",
      color: "border-teal-400"
    },
    {
      category: "cartels",
      title: "50 Innovations Tripartites Artistes • Galeries • Public",
      desc: "50 leviers stratégiques concrets pour multiplier les ventes, enrichir l'expérience des visiteurs et professionnaliser la galerie.",
      actionLabel: "Découvrir les 50 leviers",
      onClick: () => onOpenQrSalesModal && onOpenQrSalesModal("fifty_ideas"),
      badge: "50 Idées",
      color: "border-yellow-400"
    },

    // Vente & Contrats COA
    {
      category: "vente",
      title: "Certificat d'Authenticité (COA) Infalsifiable",
      desc: "Établissez un certificat officiel conforme au Décret Marcus n° 81-255 du 3 mars 1981, avec QR code de vérification cryptographique.",
      actionLabel: "Créer un Certificat COA",
      onClick: () => onOpenQrSalesModal && onOpenQrSalesModal("contract_coa"),
      badge: "Légal Décret Marcus",
      color: "border-emerald-500"
    },
    {
      category: "vente",
      title: "Contrat de Vente & Cession d'Œuvre d'Art",
      desc: "Bon de commande et clauses juridiques préservant vos droits d'auteur (CPI L. 111-1), la réserve de propriété et le régime de TVA.",
      actionLabel: "Éditer un contrat",
      onClick: () => onOpenQrSalesModal && onOpenQrSalesModal("contract_coa"),
      badge: "Sécurisé",
      color: "border-emerald-400"
    },
    {
      category: "vente",
      title: "Défiscalisation Entreprises (Art. 238 bis AB)",
      desc: "Simulateur d'amortissement fiscal sur 5 ans pour inciter les entreprises, professions libérales et mécènes à acheter vos toiles.",
      actionLabel: "Simuler la déduction",
      onClick: onOpenCollectorSales,
      badge: "Art. 238 bis",
      color: "border-indigo-400"
    },
    {
      category: "vente",
      title: "Pitchs d'Achat & Storytelling Collectionneurs",
      desc: "Arguments sur-mesure pour déclencher l'acte d'achat d'un collectionneur hésitant lors d'un vernissage ou d'un salon.",
      actionLabel: "Préparer les pitchs",
      onClick: onOpenCollectorSales,
      badge: "Vente VIP",
      color: "border-amber-400"
    },

    // Galeries
    {
      category: "galerie",
      title: "Dossier de Candidature pour Galeries",
      desc: "Dossier complet et soigné destiné aux directeurs de galeries : note de présentation, bio d'artiste, démarche et œuvres phares.",
      actionLabel: "Préparer ma candidature",
      onClick: onOpenGalleryBridge,
      badge: "Curation",
      color: "border-[#c9a84c]"
    },
    {
      category: "galerie",
      title: "Ciblage Stratégique des Galeries",
      desc: "Identifiez le bon réseau de galeries (contemporain, figuratif, urbain, conceptuel) en phase avec votre style et vos tarifs.",
      actionLabel: "Cibler les galeries",
      onClick: onOpenGalleryBridge,
      badge: "Réseau",
      color: "border-blue-400"
    },
    {
      category: "galerie",
      title: "Fiche d'Accrochage & Instructions de Régie",
      desc: "Fiche technique pour régisseur : hauteur des cimaises, intensité lumineuse (lux), hygrométrie et manipulation sans risque.",
      actionLabel: "Fiche d'accrochage",
      onClick: onOpenGalleryBridge,
      badge: "Muséal",
      color: "border-cyan-400"
    },
    {
      category: "galerie",
      title: "Dossiers de Bourses & Résidences d'Artistes",
      desc: "Arguments structurés pour postuler aux résidences d'art, bourses DRAC, fondations d'art contemporain et appels à projets.",
      actionLabel: "Bourses & Aides",
      onClick: onOpenGalleryBridge,
      badge: "Subventions",
      color: "border-purple-400"
    },

    // Vernissages & Soirées
    {
      category: "vernissage",
      title: "Cartons d'Invitation VIP & Textes Vernissage",
      desc: "Textes d'invitation personnalisés (solennel, intimiste, festif, prestigieux) prêts à envoyer à vos collectionneurs et prescripteurs.",
      actionLabel: "Créer l'invitation",
      onClick: onOpenVernissageModal,
      badge: "Invitation",
      color: "border-rose-400"
    },
    {
      category: "vernissage",
      title: "Discours de Vernissage Captivant",
      desc: "L'IA vous rédige un discours chaleureux et mémorable de 3 à 5 minutes pour remercier la galerie et captiver le public présent.",
      actionLabel: "Rédiger mon discours",
      onClick: onOpenVernissageModal,
      badge: "Jour J",
      color: "border-amber-400"
    },
    {
      category: "vernissage",
      title: "Scénographie & Rétroplanning J-30",
      desc: "Checklist chronologique pour ne rien oublier (communication, encadrement, traiteur, photographe, assurance et décrochage).",
      actionLabel: "Voir le rétroplanning",
      onClick: onOpenVernissageModal,
      badge: "Organisation",
      color: "border-emerald-400"
    },
    {
      category: "vernissage",
      title: "Relations Presse & Communiqué Spécialisé",
      desc: "Communiqué de presse officiel aux normes des journalistes d'art, critiques de magazines et influenceurs culturels.",
      actionLabel: "Communiqué de presse",
      onClick: onOpenPressSocial,
      badge: "Presse",
      color: "border-sky-400"
    },

    // Export & Partage
    {
      category: "export",
      title: "Dossier Global Autonome en 1 Clic",
      desc: "Exportez l'ensemble de vos 16 analyses dans un fichier HTML interactif complet, visualisable hors ligne ou imprimable en livre d'art.",
      actionLabel: "Exporter le Dossier",
      onClick: onOpenGlobalReport,
      badge: "HTML & Print",
      color: "border-[#c9a84c]"
    },
    {
      category: "export",
      title: "Partage Universel Spécialisé par Rôle",
      desc: "Générez des liens directs et QR codes pré-filtrés pour galeristes, artistes, visiteurs ou acheteurs avec emails pré-rédigés.",
      actionLabel: "Partager l'application",
      onClick: onOpenShareModal,
      badge: "Partage Rapide",
      color: "border-emerald-400"
    },
    {
      category: "export",
      title: "Multilingue International (14 Langues)",
      desc: "Toute l'application, les analyses de l'IA et les cartels sont instantanément disponibles en français, anglais, espagnol, allemand, italien, chinois, etc.",
      actionLabel: "Changer de langue",
      onClick: onOpenHubModal,
      badge: "14 Langues",
      color: "border-blue-400"
    },
    {
      category: "export",
      title: "Carnet de Bord & Historique Persistant",
      desc: "Retrouvez toutes vos analyses, copies et notes enregistrées automatiquement en toute sécurité dans votre navigateur.",
      actionLabel: "Ouvrir l'historique",
      onClick: onOpenHistory,
      badge: "Sauvegarde",
      color: "border-stone-400"
    }
  ];

  const filteredFeatures = features.filter((item) => {
    const matchCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchSearch = searchFilter.trim() === "" || 
      item.title.toLowerCase().includes(searchFilter.toLowerCase()) || 
      item.desc.toLowerCase().includes(searchFilter.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (!isOpen) {
    return null;
  }

  return (
    <aside 
      aria-label="Guide et explications de l'application"
      className="w-full transition-all duration-300 relative z-30 mb-4 sm:mb-6 animate-fadeIn"
    >
      {/* L'ONGLET SUPÉRIEUR DÉPLIÉ AVEC BOUTON DE MASQUAGE CLAIR */}
      <div className={`w-full border-y sm:border transition-all duration-300 shadow-xl ${
        isDark 
          ? "bg-[#12110a] border-[#c9a84c] text-white" 
          : "bg-white border-[#c9a84c] text-stone-900"
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 border-b border-[#c9a84c]/30">
          
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center flex-shrink-0 border transition-all ${
              isDark 
                ? "bg-[#c9a84c]/20 border-[#c9a84c] text-[#c9a84c]" 
                : "bg-amber-100 border-[#c9a84c] text-[#9c7d2b]"
            }`}>
              <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-serif font-black text-xs sm:text-sm md:text-base tracking-wider uppercase text-[#c9a84c] flex items-center gap-1.5">
                  <span>💡 GUIDE & EXPLICATIONS</span>
                  <span className="text-[10px] font-mono font-bold tracking-widest px-2 py-0.2 uppercase bg-[#c9a84c] text-black">
                    TOUT CE QU'IL EST POSSIBLE DE FAIRE
                  </span>
                </span>
              </div>
              <p className={`text-[11px] sm:text-xs font-sans line-clamp-1 ${isDark ? "text-neutral-300" : "text-stone-600"}`}>
                Guide complet ouvert • Cliquez sur « Masquer le guide » pour refermer à tout moment
              </p>
            </div>
          </div>

          {/* Boutons pour Masquer l'Onglet */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={onClose || onToggle}
              className="px-3.5 py-1.5 bg-[#c9a84c] text-black hover:bg-white border border-[#c9a84c] text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
              title="Masquer le guide d'explications"
            >
              <span>Masquer le guide</span>
              <ChevronUp className="w-4 h-4" />
            </button>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className={`p-1.5 border transition-colors cursor-pointer ${
                  isDark ? "border-white/10 text-neutral-400 hover:text-white hover:bg-white/10" : "border-stone-200 text-stone-500 hover:text-black hover:bg-stone-100"
                }`}
                title="Masquer complètement le guide"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

        {/* CONTENU DU GUIDE DÉPLIÉ (TOUT CE QUI EST POSSIBLE DE FAIRE TRÈS CLAIREMENT ET SIMPLEMENT) */}
        <div className={`px-3 sm:px-6 py-5 sm:py-7 space-y-6 sm:space-y-8 ${
          isDark ? "bg-[#0c0c0c]" : "bg-stone-50"
        }`}>
            
            {/* Résumé synthétique & Message de Bienvenue */}
            <div className={`p-4 sm:p-5 border relative overflow-hidden ${
              isDark 
                ? "bg-gradient-to-r from-[#17140b] via-[#1c180d] to-black border-[#c9a84c]" 
                : "bg-gradient-to-r from-amber-100/80 via-amber-50 to-white border-[#c9a84c]"
            }`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 bg-[#c9a84c] text-black">
                      Vue d'ensemble
                    </span>
                    <h3 className="font-serif font-bold text-base sm:text-lg uppercase tracking-wide">
                      Bienvenue dans L'Œil de l'Atelier
                    </h3>
                  </div>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-neutral-200" : "text-stone-700"}`}>
                    Cette application complète transforme votre atelier d'artiste en passerelle professionnelle. 
                    En quelques secondes, analysez vos toiles grâce à l'Intelligence Artificielle Google Gemini, 
                    imprimez vos <strong>cartels muraux avec QR codes</strong>, sécurisez vos ventes avec des <strong>Certificats d'Authenticité (COA)</strong> 
                    et candidatez auprès des <strong>meilleures galeries d'art</strong>.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={onToggle}
                    className="px-3 py-1.5 bg-[#c9a84c] text-black hover:bg-white font-mono font-bold text-xs uppercase transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                    <span>Masquer l'explication</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Les 3 Étapes Essentielles pour Démarrer */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-1.5 border-[#c9a84c]/20">
                <h4 className="font-serif font-bold text-xs sm:text-sm uppercase tracking-wider text-[#c9a84c] flex items-center gap-2">
                  <span>🚀 Comment ça marche en 3 étapes simples ?</span>
                </h4>
                <span className="text-[10px] font-mono opacity-60">Prise en main immédiate</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Étape 1 */}
                <div className={`p-4 border flex flex-col justify-between ${
                  isDark ? "bg-[#141414] border-white/10" : "bg-white border-stone-200 shadow-sm"
                }`}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-mono font-black text-[#c9a84c]">01</span>
                      <UploadCloud className="w-5 h-5 text-[#c9a84c]" />
                    </div>
                    <h5 className="font-serif font-bold text-sm uppercase">1. Déposez une photo d'œuvre</h5>
                    <p className={`text-xs leading-relaxed ${isDark ? "text-neutral-400" : "text-stone-600"}`}>
                      Glissez votre image (toile, dessin, sculpture, photo) dans la grande boîte centrale ou cliquez sur les 15 exemples pré-chargés.
                    </p>
                  </div>
                  <div className="pt-3 mt-2 border-t border-white/5 text-[10px] font-mono text-[#c9a84c]">
                    ✓ Multi-sélection de séries autorisée
                  </div>
                </div>

                {/* Étape 2 */}
                <div className={`p-4 border flex flex-col justify-between ${
                  isDark ? "bg-[#141414] border-white/10" : "bg-white border-stone-200 shadow-sm"
                }`}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-mono font-black text-[#c9a84c]">02</span>
                      <Palette className="w-5 h-5 text-[#c9a84c]" />
                    </div>
                    <h5 className="font-serif font-bold text-sm uppercase">2. Choisissez l'outil IA désiré</h5>
                    <p className={`text-xs leading-relaxed ${isDark ? "text-neutral-400" : "text-stone-600"}`}>
                      Explorez l'analyse de style, la cotation financière, la palette de couleurs, le cartel muséal, la démarche d'artiste ou la critique.
                    </p>
                  </div>
                  <div className="pt-3 mt-2 border-t border-white/5 text-[10px] font-mono text-[#c9a84c]">
                    ✓ Résultat en 3 à 5 secondes
                  </div>
                </div>

                {/* Étape 3 */}
                <div className={`p-4 border flex flex-col justify-between ${
                  isDark ? "bg-[#141414] border-white/10" : "bg-white border-stone-200 shadow-sm"
                }`}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-mono font-black text-[#c9a84c]">03</span>
                      <Award className="w-5 h-5 text-[#c9a84c]" />
                    </div>
                    <h5 className="font-serif font-bold text-sm uppercase">3. Imprimez, Exportez & Vendez</h5>
                    <p className={`text-xs leading-relaxed ${isDark ? "text-neutral-400" : "text-stone-600"}`}>
                      Imprimez votre Certificat COA Décret Marcus, vos cartels avec QR codes d'audioguide, ou téléchargez le Dossier Global complet.
                    </p>
                  </div>
                  <div className="pt-3 mt-2 border-t border-white/5 text-[10px] font-mono text-[#c9a84c]">
                    ✓ Conforme aux normes juridiques d'art
                  </div>
                </div>
              </div>
            </div>

            {/* Barre de Filtrage par Catégorie & Recherche */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b pb-3 border-[#c9a84c]/20">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id as any)}
                        className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer border ${
                          isActive
                            ? "bg-[#c9a84c] text-black border-[#c9a84c]"
                            : isDark
                              ? "bg-black/50 border-white/10 text-neutral-300 hover:border-[#c9a84c] hover:text-white"
                              : "bg-white border-stone-300 text-stone-700 hover:border-[#c9a84c] hover:text-black"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Champ de recherche rapide */}
                <div className="relative shrink-0 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-[#c9a84c] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Chercher une action (ex: prix, cartel, COA...)"
                    className={`w-full pl-8 pr-3 py-1.5 text-xs border ${
                      isDark ? "bg-black border-white/15 text-white placeholder-neutral-500" : "bg-white border-stone-300 text-black placeholder-stone-400"
                    }`}
                  />
                  {searchFilter && (
                    <button
                      type="button"
                      onClick={() => setSearchFilter("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs opacity-60 hover:opacity-100"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* Grille des Fonctionnalités Disponibles avec Actions Directes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredFeatures.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-4 border transition-all flex flex-col justify-between group hover:border-[#c9a84c] ${
                      isDark ? "bg-[#121212] border-white/10" : "bg-white border-stone-200 shadow-sm"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 border ${item.color} ${
                          isDark ? "bg-black/50 text-[#c9a84c]" : "bg-amber-50 text-stone-800"
                        }`}>
                          {item.badge}
                        </span>
                        <span className="text-[10px] font-mono opacity-50 uppercase">
                          {item.category}
                        </span>
                      </div>

                      <h5 className="font-serif font-bold text-xs sm:text-sm tracking-wide group-hover:text-[#c9a84c] transition-colors">
                        {item.title}
                      </h5>

                      <p className={`text-xs leading-relaxed ${isDark ? "text-neutral-400" : "text-stone-600"}`}>
                        {item.desc}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={item.onClick}
                        className="text-xs font-mono font-bold text-[#c9a84c] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>{item.actionLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                      <span className="text-[10px] font-mono opacity-40">Direct</span>
                    </div>
                  </div>
                ))}
              </div>

              {filteredFeatures.length === 0 && (
                <div className="text-center py-8 opacity-60 font-mono text-xs">
                  Aucune fonctionnalité ne correspond à votre recherche « {searchFilter} ».
                </div>
              )}
            </div>

            {/* Pied de l'Onglet avec Bouton Masquer et Rappel Profil */}
            <div className={`p-4 border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
              isDark ? "bg-black/50 border-white/10" : "bg-stone-100 border-stone-200"
            }`}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className={isDark ? "text-neutral-300" : "text-stone-700"}>
                  Astuce : Renseignez votre <strong>nom d'artiste</strong> dans l'en-tête pour que tous les certificats COA et cartels soient automatiquement signés à votre nom.
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {onOpenProfileModal && (
                  <button
                    type="button"
                    onClick={onOpenProfileModal}
                    className="px-3 py-1.5 border border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-black font-mono font-bold text-xs uppercase cursor-pointer"
                  >
                    Profil Artiste
                  </button>
                )}

                <button
                  type="button"
                  onClick={onToggle}
                  className="px-4 py-1.5 bg-[#c9a84c] text-black hover:bg-white font-mono font-bold text-xs uppercase flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                >
                  <ChevronUp className="w-4 h-4" />
                  <span>Masquer cet onglet</span>
                </button>
              </div>
            </div>

          </div>
      </div>
    </aside>
  );
}
