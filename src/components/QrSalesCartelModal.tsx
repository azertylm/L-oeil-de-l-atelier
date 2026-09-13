/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  QrCode, Printer, Download, Eye, Copy, Check, Sparkles, 
  Tag, DollarSign, Building2, User, Phone, Mail, Volume2, 
  VolumeX, Play, Pause, Share2, CheckCircle2, ShieldCheck, 
  Layers, ExternalLink, Bookmark, HelpCircle, X, Search,
  ArrowRight, Sliders, Smartphone, Palette, FileText, Send,
  Heart, MessageSquare, Briefcase, Calculator, ThumbsUp, FileDown, Clock, Info,
  Award, CreditCard, Lock
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { ArtistProfile } from "../types.js";
import { useLanguage } from "../i18n/LanguageContext.js";

export interface VisitorGuestbookEntry {
  id: string;
  artworkTitle: string;
  visitorName: string;
  city?: string;
  message: string;
  date: string;
  timestamp: number;
}

export interface VisitorOptionItem {
  id: string;
  artworkTitle: string;
  artworkPrice: string;
  visitorName: string;
  visitorEmail: string;
  visitorPhone?: string;
  message: string;
  date: string;
  status: "pending" | "confirmed" | "closed";
}

interface QrSalesCartelModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: "dark-gold" | "light";
  profile: ArtistProfile;
  activeArtworkImage?: string | null;
  activeArtworkTitle?: string;
  activeArtworkMedium?: string;
  activeArtworkYear?: string;
  activeArtworkDimensions?: string;
  activeSeries?: any[];
  cache?: Record<string, any>;
  onOpenGlobalReport?: () => void;
  onOpenShareModal?: () => void;
  initialTab?: "generator" | "visitor_preview" | "guestbook" | "fifty_ideas" | "print_cartels" | "contract_coa";
}

// 50 Innovations Tripartites (Artistes • Galeristes • Visiteurs)
export const FIFTY_INNOVATIONS = [
  // 🎨 Pour les Artistes (1-13)
  { id: 1, role: "artiste", category: "Atelier & Gain de temps", title: "Génération de Cartel Mural en 10 secondes", desc: "Création instantanée d'un cartel normalisé aux dimensions muséales sans passer par InDesign ou Photoshop." },
  { id: 2, role: "artiste", category: "Atelier & Gain de temps", title: "Certificat d'Authenticité (COA) auto-indexé au QR", desc: "Chaque QR code renvoie directement vers les mentions légales du certificat sécurisant la vente." },
  { id: 3, role: "artiste", category: "Cotation & Valeur", title: "Calculateur de cote d'atelier en temps réel", desc: "Aide l'artiste à fixer un prix juste basé sur le format (points de format P/F/M) et l'historique de vente." },
  { id: 4, role: "artiste", category: "Communication", title: "Audioguide IA avec la propre voix/ton de l'artiste", desc: "L'artiste enregistre ou synthétise sa démarche pour parler directement à l'oreille du visiteur en salle." },
  { id: 5, role: "artiste", category: "Logistique", title: "Fiche d'expédition et conditionnement d'atelier", desc: "Indication du sens d'accrochage, fragilité des vernis et consignes de transport intégrées au cartel digital." },
  { id: 6, role: "artiste", category: "Atelier & Gain de temps", title: "Traçabilité des séries multi-œuvres", desc: "Permet d'associer un ensemble de toiles à une même thématique avec navigation fluide entre pièces." },
  { id: 7, role: "artiste", category: "Vente & Gestion", title: "Rapprochement automatique facture d'artiste / galerie", desc: "Édition de note d'honoraires ou facture d'artiste Maison des Artistes / AGESSA en 1 clic." },
  { id: 8, role: "artiste", category: "Communication", title: "Statement d'Atelier ultra-percutant", desc: "L'IA formule la démarche artistique sans jargon prétentieux, parfaitement compréhensible par le grand public." },
  { id: 9, role: "artiste", category: "Visibilité", title: "Dossier de presse téléchargeable depuis l'œuvre", desc: "Les journalistes scannent le cartel pour télécharger le communiqué de presse et les visuels HD." },
  { id: 10, role: "artiste", category: "Relations", title: "Livre d'or d'atelier privé sans intermédiaire", desc: "Récolte directe des mots chaleureux des visiteurs et collectionneurs qui ont été touchés par l'œuvre." },
  { id: 11, role: "artiste", category: "Technique", title: "Fiche technique des pigments & liants", desc: "Transparence totale sur la longévité des matériaux utilisés (huiles pur lin, pigments résistants aux UV)." },
  { id: 12, role: "artiste", category: "Valorisation", title: "Écho poétique et inspirations de l'artiste", desc: "Partage de la genèse intime de la pièce pour créer un lien affectif fort avec l'acheteur potentiel." },
  { id: 13, role: "artiste", category: "Protection", title: "Horodatage numérique de première création", desc: "Preuve d'antériorité de la création plastique en cas de litige ou de copie." },

  // 🏛️ Pour les Galeristes (14-26)
  { id: 14, role: "galeriste", category: "Gestion de Salle", title: "Cartels muraux discrets avec statut en temps réel", desc: "Mise à jour instantanée du statut (Disponible, Option, Vendu) sans réimprimer le carton physique." },
  { id: 15, role: "galeriste", category: "Vente & Négociation", title: "Levée du tabou du prix d'art", desc: "Le visiteur consulte discrètement le tarif sur son téléphone sans avoir à oser demander à l'accueil." },
  { id: 16, role: "galeriste", category: "Expérience VIP", title: "Dossier collectionneur 'Fiche Privée' en 1 clic", desc: "Le galeriste génère une page privée avec conditions de paiement spéciales pour un client VIP." },
  { id: 17, role: "galeriste", category: "Statistiques & Curation", title: "Baromètre d'intérêt en temps réel de l'exposition", desc: "Visualisation des œuvres les plus scannées et des textes les plus lus par le public pendant le vernissage." },
  { id: 18, role: "galeriste", category: "Vente & Négociation", title: "Bouton de pose d'option discrète (48h)", desc: "Permet à un acheteur hésitant de poser une option sans pression, alertant le galeriste sur WhatsApp/Email." },
  { id: 19, role: "galeriste", category: "Communication", title: "Catalogue d'exposition dématérialisé zéro déchet", desc: "Économie de milliers d'euros d'impression de catalogues papier tout en offrant une expérience interactive." },
  { id: 20, role: "galeriste", category: "Juridique & Fiscal", title: "Simulateur fiscal Entreprises (Art. 238bis AB)", desc: "Calcul immédiat de l'économie d'impôt sur les sociétés pour les professions libérales et entreprises en salle." },
  { id: 21, role: "galeriste", category: "Logistique", title: "Inventaire et fiches de stock automatisées", desc: "Chaque QR code sert de balise d'inventaire rapide lors des montages et démontages de foires d'art." },
  { id: 22, role: "galeriste", category: "Vente & Négociation", title: "Paiement d'acompte instantané (Stripe / CB)", desc: "Verrouillage de la vente sur place au cocktail avant que l'acheteur ne quitte la galerie." },
  { id: 23, role: "galeriste", category: "Curation", title: "Texte curatorial de salle d'autorité", desc: "Un texte institutionnel solide qui valorise l'accrochage et légitime les prix demandés." },
  { id: 24, role: "galeriste", category: "Partenariats", title: "Mise en avant des décorateurs & architectes", desc: "Propose aux architectes d'intérieur des fiches complètes avec simulations 3D in-situ pour leurs projets." },
  { id: 25, role: "galeriste", category: "Relations Publiques", title: "Gestion fluidifiée des cartons de vernissage", desc: "Lien direct vers les créneaux de visites privées et le livre d'or de l'exposition." },
  { id: 26, role: "galeriste", category: "Confidentialité", title: "Option 'Prix sur Demande' avec formulaire express", desc: "Pour les pièces muséales de très grande valeur, préserve la confidentialité du marché." },

  // 👁️ Pour les Visiteurs & Collectionneurs (27-40)
  { id: 27, role: "visiteur", category: "Médiation Culturelle", title: "Audioguide instantané sans téléchargement d'application", desc: "Scan direct avec l'appareil photo du smartphone : la voix démarre sans inscription ni application à installer." },
  { id: 28, role: "visiteur", category: "Compréhension", title: "Décryptage accessible de la composition et des symboles", desc: "Comprendre pourquoi telle couleur a été choisie et ce que raconte l'œuvre, en évitant l'élitisme." },
  { id: 29, role: "visiteur", category: "Projection Intérieure", title: "Visualisation in-situ dans un salon ou bureau", desc: "Aperçu de l'échelle réelle de la toile sur un mur témoin pour savoir si le format convient chez soi." },
  { id: 30, role: "visiteur", category: "Collection", title: "Carnet de visite digital 'Mes Coups de Cœur'", desc: "Enregistrer les œuvres favorites de la galerie pour y repenser tranquillement le lendemain." },
  { id: 31, role: "visiteur", category: "Accessibilité", title: "Mode haute lisibilité pour malvoyants", desc: "Agrandissement de texte, fort contraste et lecture audio pour que l'art soit accessible à tous." },
  { id: 32, role: "visiteur", category: "Intimité d'Achat", title: "Formulaire d'offre discrète sans négociation publique", desc: "Faire une proposition au galeriste en quelques secondes dans le calme, sans gêne devant les autres visiteurs." },
  { id: 33, role: "visiteur", category: "Éducation", title: "Fiche repères : mouvements artistiques et résonances", desc: "Découvrir à quels maîtres ou courants l'œuvre se rattache pour enrichir sa culture artistique." },
  { id: 34, role: "visiteur", category: "Partage", title: "Partage direct d'une œuvre à son conjoint ou ami", desc: "Lien épuré prêt à envoyer par SMS ou WhatsApp avec photo HD et cartel pour demander un avis." },
  { id: 35, role: "visiteur", category: "Garantie", title: "Accès immédiat à la preuve de cotation et d'authenticité", desc: "Rassurance absolue sur la provenance, la signature et le sérieux de l'artiste." },
  { id: 36, role: "visiteur", category: "Expérience Sensorielle", title: "Lecture de l'écho poétique au casque", desc: "Immersion contemplative totale devant le tableau en écoutant le texte littéraire associé." },
  { id: 37, role: "visiteur", category: "Rencontre", title: "Demande de visite d'atelier en direct", desc: "Possibilité de solliciter une rencontre intime avec l'artiste dans son espace de création." },
  { id: 38, role: "visiteur", category: "Transparence", title: "Affichage clair des dimensions en centimètres et pouces", desc: "Mesures précises pour vérifier l'espace disponible au-dessus d'un canapé ou d'une cheminée." },
  { id: 39, role: "visiteur", category: "Événement", title: "Inscription en 1 clic aux prochains vernissages", desc: "Rejoindre le cercle intime des amateurs d'art informés en avant-première des sorties d'atelier." },
  { id: 40, role: "visiteur", category: "Transmission", title: "Fiche de salle téléchargeable pour les enfants et étudiants", desc: "Support pédagogique pour intéresser les jeunes publics à l'analyse plastique." },

  // 💎 Pour la Vente & l'Écosystème Global (41-50)
  { id: 41, role: "vente", category: "Paiement & Sécurité", title: "Acompte de réservation par carte ou virement instantané", desc: "Validation de la vente avec reçu numérique sécurisé." },
  { id: 42, role: "vente", category: "Logistique", title: "Estimation immédiate des frais d'emballage et de livraison", desc: "Calcul selon destination (France, Europe, Monde) et caisse bois sur-mesure." },
  { id: 43, role: "vente", category: "Clôture d'Exposition", title: "Catalogue raisonné numérique de fin d'exposition", desc: "Compilation de l'ensemble des toiles exposées avec récapitulatif des pièces vendues." },
  { id: 44, role: "vente", category: "Réseau", title: "Mise en relation directe WhatsApp Artiste - Galeriste", desc: "Notification instantanée dès qu'une option d'achat est manifestée en salle." },
  { id: 45, role: "vente", category: "Support Mural", title: "Gabarits de cartels prêts à imprimer (12x8 cm & 15x10 cm)", desc: "Repères de coupe professionnels au millimètre pour bristol épais ou dibond." },
  { id: 46, role: "vente", category: "Fiscalité", title: "Certificat de déduction fiscale prêt à signer", desc: "Génération automatique du formulaire d'amortissement fiscal d'œuvre d'art vivante." },
  { id: 47, role: "vente", category: "Événement", title: "Livre d'or digital exportable en PDF souvenir", desc: "Remis à l'artiste le soir du décrochage avec tous les mots d'amour et coordonnées laissés." },
  { id: 48, role: "vente", category: "Foires Internationales", title: "Traduction multilingue instantanée du cartel (FR / EN)", desc: "Pour les foires d'art contemporain (Art Basel, Paris Photo, FIAC) avec public international." },
  { id: 49, role: "vente", category: "Assurance", title: "Fiche d'état de conservation (Condition Report) au départ", desc: "Vérification des angles et de la tension de la toile avant cession." },
  { id: 50, role: "vente", category: "Cercle d'Amis", title: "Club des Mécènes & Fidélisation de l'Atelier", desc: "Transformer les simples visiteurs d'un soir en soutiens pérennes de la création vivante." }
];

// Messages de démonstration pour le Livre d'Or Visiteurs & Réservations
const DEFAULT_GUESTBOOK: VisitorGuestbookEntry[] = [
  {
    id: "gb-1",
    artworkTitle: "Soleil Noir & Matières",
    visitorName: "Claire B.",
    city: "Paris",
    message: "Une lumière fascinante dans les bleus et ocres profonds. Félicitations pour ce travail de texture saisissant qui respire la sincérité !",
    date: "12 Septembre 2026",
    timestamp: Date.now() - 3600000 * 24
  },
  {
    id: "gb-2",
    artworkTitle: "Nocturne Minéral",
    visitorName: "Marc V.",
    city: "Bruxelles (Collectionneur)",
    message: "Découvert au vernissage de samedi, une présence très puissante en salle. Hâte de suivre vos prochaines séries d'atelier.",
    date: "10 Septembre 2026",
    timestamp: Date.now() - 3600000 * 72
  },
  {
    id: "gb-3",
    artworkTitle: "Soleil Noir & Matières",
    visitorName: "Élodie & Thomas",
    city: "Lyon",
    message: "L'audioguide avec le QR code nous a fait vivre un moment très touchant au casque. Bravo pour cette belle passerelle d'accès à l'art !",
    date: "08 Septembre 2026",
    timestamp: Date.now() - 3600000 * 120
  }
];

const DEFAULT_OPTIONS: VisitorOptionItem[] = [
  {
    id: "opt-1",
    artworkTitle: "Soleil Noir & Matières",
    artworkPrice: "2 800 €",
    visitorName: "Laurent de Saint-Maur",
    visitorEmail: "laurent.stmaur@cabinet-conseil.fr",
    visitorPhone: "+33 6 12 34 56 78",
    message: "Bonjour, nous souhaitons poser une option 48h pour notre siège social (acquisition en mécénat Art. 238 bis AB). Merci de nous rappeler.",
    date: "11 Septembre 2026",
    status: "pending"
  }
];

export default function QrSalesCartelModal({
  isOpen,
  onClose,
  theme = "dark-gold",
  profile,
  activeArtworkImage,
  activeArtworkTitle = "Sans Titre (Étude d'Atelier)",
  activeArtworkMedium = "Huile et pigments sur toile",
  activeArtworkYear = "2026",
  activeArtworkDimensions = "100 × 80 cm",
  activeSeries = [],
  cache = {},
  onOpenGlobalReport,
  onOpenShareModal,
  initialTab = "generator"
}: QrSalesCartelModalProps) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"generator" | "visitor_preview" | "guestbook" | "fifty_ideas" | "print_cartels" | "contract_coa">(initialTab);
  const { t, language, langMeta } = useLanguage();

  // Cartel & Sale Parameters
  const [artworkTitle, setArtworkTitle] = useState<string>(activeArtworkTitle);
  const [artistName, setArtistName] = useState<string>(profile.name || "Artiste d'Atelier");
  const [artworkMedium, setArtworkMedium] = useState<string>(activeArtworkMedium);
  const [artworkYear, setArtworkYear] = useState<string>(activeArtworkYear);
  const [artworkDimensions, setArtworkDimensions] = useState<string>(activeArtworkDimensions);
  const [artworkPrice, setArtworkPrice] = useState<string>("2 800 €");
  const [isPriceOnDemand, setIsPriceOnDemand] = useState<boolean>(false);
  const [artworkStatus, setArtworkStatus] = useState<"available" | "reserved" | "sold">("available");
  
  // Contact & Gallery info
  const [galleryName, setGalleryName] = useState<string>("Galerie de l'Atelier");
  const [contactEmail, setContactEmail] = useState<string>(profile.web ? `contact@${profile.web}` : "galerie.atelier@art.com");
  const [contactPhone, setContactPhone] = useState<string>("+33 (0)1 42 68 50 00");
  const [cartelStyle, setCartelStyle] = useState<"museum_white" | "atelier_dark" | "gold_luxury">("museum_white");
  const [qrDestination, setQrDestination] = useState<"visitor_sheet" | "payment_link" | "whatsapp">("visitor_sheet");
  const [customPaymentUrl, setCustomPaymentUrl] = useState<string>("https://buy.stripe.com/demo_art_atelier");

  // Purchase Contract & Certificate of Authenticity (COA) State
  const [buyerName, setBuyerName] = useState<string>("Jean de Saint-Germain");
  const [buyerAddress, setBuyerAddress] = useState<string>("14 Avenue des Arts, 75008 Paris");
  const [buyerEmail, setBuyerEmail] = useState<string>("jean.saintgermain@art-collection.fr");
  const [buyerPhone, setBuyerPhone] = useState<string>("+33 (0)6 12 34 56 78");
  const [sellerType, setSellerType] = useState<"galerie" | "artiste">("galerie");
  const [paymentOption, setPaymentOption] = useState<"comptant" | "acompte_30">("comptant");
  const [paymentMode, setPaymentMode] = useState<"virement" | "carte" | "cheque">("virement");
  const [vatRegime, setVatRegime] = useState<"5.5" | "franchise">("5.5");
  const [certificateNumber, setCertificateNumber] = useState<string>(() => `COA-2026-${Math.floor(100000 + Math.random() * 900000)}`);
  const [contractNumber, setContractNumber] = useState<string>(() => `CTR-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [contractDate, setContractDate] = useState<string>(() => new Date().toLocaleDateString("fr-FR"));
  const [deliveryDate, setDeliveryDate] = useState<string>(() => new Date(Date.now() + 86400000 * 7).toLocaleDateString("fr-FR"));
  const [buyerNotes, setBuyerNotes] = useState<string>("Remise en main propre en galerie après décrochage de l'exposition.");
  const [contractCopied, setContractCopied] = useState<boolean>(false);
  const [coaCopied, setCoaCopied] = useState<boolean>(false);

  // Visitor interactive state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [visitorOptionSent, setVisitorOptionSent] = useState<boolean>(false);
  const [visitorName, setVisitorName] = useState<string>("");
  const [visitorEmail, setVisitorEmail] = useState<string>("");
  const [visitorMessage, setVisitorMessage] = useState<string>("Bonjour, je suis en salle devant cette œuvre et je souhaiterais poser une option d'acquisition prioritaire.");

  // Visitor Guestbook State
  const [guestbookEntries, setGuestbookEntries] = useState<VisitorGuestbookEntry[]>(() => {
    try {
      const saved = localStorage.getItem("oeil_atelier_guestbook");
      return saved ? JSON.parse(saved) : DEFAULT_GUESTBOOK;
    } catch {
      return DEFAULT_GUESTBOOK;
    }
  });

  const [visitorOptions, setVisitorOptions] = useState<VisitorOptionItem[]>(() => {
    try {
      const saved = localStorage.getItem("oeil_atelier_options");
      return saved ? JSON.parse(saved) : DEFAULT_OPTIONS;
    } catch {
      return DEFAULT_OPTIONS;
    }
  });

  // Direct guestbook form in visitor view
  const [guestbookAuthor, setGuestbookAuthor] = useState<string>("");
  const [guestbookCity, setGuestbookCity] = useState<string>("");
  const [guestbookText, setGuestbookText] = useState<string>("");
  const [guestbookSent, setGuestbookSent] = useState<boolean>(false);

  // Corporate Tax Simulator toggle
  const [isTaxSimOpen, setIsTaxSimOpen] = useState<boolean>(false);

  // Filter 50 ideas
  const [ideasFilter, setIdeasFilter] = useState<string>("all");
  const [ideasSearch, setIdeasSearch] = useState<string>("");

  const isDark = theme === "dark-gold";
  const printRef = useRef<HTMLDivElement>(null);
  const coaPrintRef = useRef<HTMLDivElement>(null);
  const contractPrintRef = useRef<HTMLDivElement>(null);

  // Synchronize initialTab if changed
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // Sync artwork details if props change
  useEffect(() => {
    if (activeArtworkTitle) setArtworkTitle(activeArtworkTitle);
    if (profile.name) setArtistName(profile.name);
    if (activeArtworkMedium) setArtworkMedium(activeArtworkMedium);
    if (activeArtworkYear) setArtworkYear(activeArtworkYear);
    if (activeArtworkDimensions) setArtworkDimensions(activeArtworkDimensions);
  }, [activeArtworkTitle, profile.name, activeArtworkMedium, activeArtworkYear, activeArtworkDimensions]);

  // Auto-detect estimated price from cache cote if available
  useEffect(() => {
    if (cache?.cote) {
      const str = typeof cache.cote === 'string' ? cache.cote : JSON.stringify(cache.cote);
      const match = str.match(/([0-9\s]{3,6})\s*€/);
      if (match && match[1]) {
        setArtworkPrice(match[1].replace(/\s+/g, ' ').trim() + " €");
      }
    }
  }, [cache?.cote]);

  // Audio guide speech synthesis in the selected language
  const fallbackSpeeches: Record<string, string> = {
    fr: `Vous contemplez l'œuvre ${artworkTitle}, créée en ${artworkYear} par ${artistName}. Cette pièce en ${artworkMedium} déploie une tension chromatique vibrante et un travail de matière profond. Une invitation contemplative au cœur de la sensibilité contemporaine.`,
    en: `You are contemplating ${artworkTitle}, created in ${artworkYear} by ${artistName}. This ${artworkMedium} piece unfolds a vibrant chromatic presence and deep material mastery. A contemplative journey into contemporary sensibility.`,
    it: `State contemplando l'opera ${artworkTitle}, creata nel ${artworkYear} da ${artistName}. Questo lavoro in ${artworkMedium} sprigiona una vibrante armonia cromatica.`,
    de: `Sie betrachten das Kunstwerk ${artworkTitle}, geschaffen im Jahr ${artworkYear} von ${artistName}. Dieses Werk in ${artworkMedium} entfaltet eine kraftvolle chromatische Tiefe.`,
    es: `Está contemplando la obra ${artworkTitle}, creada en ${artworkYear} por ${artistName}. Esta pieza en ${artworkMedium} despliega una vibrante armonía cromática.`,
    pt: `Está a contemplar a obra ${artworkTitle}, criada em ${artworkYear} por ${artistName}. Esta peça em ${artworkMedium} desenvolve uma profunda harmonia cromática.`,
    "pt-BR": `Você está contemplando a obra ${artworkTitle}, criada em ${artworkYear} por ${artistName}. Esta peça em ${artworkMedium} apresenta uma harmonia cromática vibrante.`,
    zh: `您正在欣赏 ${artistName} 于 ${artworkYear} 年创作的《${artworkTitle}》。这幅采用 ${artworkMedium} 的艺术作品展现了深邃的色彩与材质张力。`,
    ar: `أنت تتأمل العمل الفني ${artworkTitle}، الذي أبدعه الفنان ${artistName} في عام ${artworkYear}. يقدم هذا العمل المنفذ بتقنية ${artworkMedium} تناغماً لونياً وتجربة تأملية عميقة.`,
    ja: `あなたは${artistName}による${artworkYear}年の作品『${artworkTitle}』を鑑賞しています。${artworkMedium}で描かれた色彩の調和と深い質感をお楽しみください。`,
    ko: `${artistName} 작가가 ${artworkYear}년에 제작한 작품 《${artworkTitle}》을 감상하고 계십니다. ${artworkMedium} 기법으로 완성된 색채와 질감의 조화를 느껴보세요.`,
    nl: `U bewondert het kunstwerk ${artworkTitle}, gemaakt in ${artworkYear} door ${artistName}. Dit werk in ${artworkMedium} toont een krachtige chromatische diepte.`,
    ru: `Вы созерцаете произведение «${artworkTitle}», созданное в ${artworkYear} году художником ${artistName}. Работа выполнена в технике ${artworkMedium}.`,
    sv: `Du betraktar konstverket ${artworkTitle}, skapat år ${artworkYear} av ${artistName}. Detta verk i ${artworkMedium} visar en djup kromatisk harmoni.`
  };

  const defaultSpeech = fallbackSpeeches[language] || fallbackSpeeches.fr;
  const speechText = cache.critique?.critique || cache.statement?.statement || cache.style?.style || defaultSpeech;

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert(t("speech_not_supported", "La synthèse vocale n'est pas supportée par ce navigateur."));
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.lang = langMeta.bcp47 || "fr-FR";
      utterance.rate = 0.92; // slightly slower for gallery mediation
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Compute live QR payload URL
  const publicShareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/#visiteur-oeuvre-${encodeURIComponent(artworkTitle.replace(/\s+/g, '-').toLowerCase())}`
    : `https://art-atelier.app/#visiteur`;

  const qrPayload = qrDestination === "payment_link" 
    ? customPaymentUrl
    : qrDestination === "whatsapp"
      ? `https://wa.me/${contactPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour, je suis devant l'œuvre "${artworkTitle}" (${artworkPrice}) et je souhaite plus de renseignements.`)}`
      : publicShareUrl;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  // Submit new visitor option request
  const handleSubmitOption = () => {
    if (!visitorEmail && !visitorName) {
      alert("Veuillez indiquer un nom et un email ou téléphone.");
      return;
    }

    const newOption: VisitorOptionItem = {
      id: "opt-" + Date.now(),
      artworkTitle,
      artworkPrice: isPriceOnDemand ? "Prix sur demande" : artworkPrice,
      visitorName: visitorName || "Visiteur de salle",
      visitorEmail: visitorEmail || "contact@visiteur.fr",
      message: visitorMessage,
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: "pending"
    };

    const updated = [newOption, ...visitorOptions];
    setVisitorOptions(updated);
    try {
      localStorage.setItem("oeil_atelier_options", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setVisitorOptionSent(true);
  };

  // Submit message to artist's guestbook
  const handleSubmitGuestbook = () => {
    if (!guestbookText.trim()) {
      alert("Veuillez saisir votre message ou ressenti pour l'artiste.");
      return;
    }

    const newEntry: VisitorGuestbookEntry = {
      id: "gb-" + Date.now(),
      artworkTitle,
      visitorName: guestbookAuthor.trim() || "Visiteur Anonyme",
      city: guestbookCity.trim() || "En exposition",
      message: guestbookText.trim(),
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      timestamp: Date.now()
    };

    const updated = [newEntry, ...guestbookEntries];
    setGuestbookEntries(updated);
    try {
      localStorage.setItem("oeil_atelier_guestbook", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setGuestbookText("");
    setGuestbookAuthor("");
    setGuestbookCity("");
    setGuestbookSent(true);
    setTimeout(() => setGuestbookSent(false), 4000);
  };

  // Toggle option status
  const handleToggleOptionStatus = (id: string) => {
    const updated = visitorOptions.map(opt => {
      if (opt.id === id) {
        const nextStatus: "pending" | "confirmed" | "closed" = 
          opt.status === "pending" ? "confirmed" : opt.status === "confirmed" ? "closed" : "pending";
        return { ...opt, status: nextStatus };
      }
      return opt;
    });
    setVisitorOptions(updated);
    try {
      localStorage.setItem("oeil_atelier_options", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Parse price for corporate tax simulation
  const numericPrice = parseInt(artworkPrice.replace(/[^0-9]/g, "")) || 2800;
  const annualDeduction = Math.round(numericPrice / 5);
  const taxSavings = Math.round(numericPrice * 0.25); // based on French IS 25%
  const netCorporateCost = numericPrice - taxSavings;

  if (!isOpen) return null;

  // Filtered 50 ideas
  const filteredIdeas = FIFTY_INNOVATIONS.filter(item => {
    const matchesFilter = ideasFilter === "all" || item.role === ideasFilter;
    const matchesSearch = ideasSearch === "" || 
      item.title.toLowerCase().includes(ideasSearch.toLowerCase()) ||
      item.desc.toLowerCase().includes(ideasSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(ideasSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className={`w-full max-w-6xl max-h-[94vh] flex flex-col border shadow-2xl rounded-none overflow-hidden transition-colors ${
          isDark ? "bg-[#0b0b0b] border-[#c9a84c] text-white" : "bg-white border-stone-300 text-stone-900"
        }`}
      >
        {/* Header */}
        <div className={`p-4 sm:p-5 flex items-center justify-between border-b shrink-0 ${
          isDark ? "border-white/10 bg-black/60" : "border-stone-200 bg-stone-50"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 flex items-center justify-center border shrink-0 ${
              isDark ? "bg-[#c9a84c]/20 border-[#c9a84c] text-[#c9a84c]" : "bg-amber-100 border-[#c9a84c] text-[#9c7d2b]"
            }`}>
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif font-bold text-base sm:text-lg tracking-wide uppercase">
                  Passerelle Artistes • Galeristes • Visiteurs
                </h3>
                <span className="text-[10px] font-mono bg-[#c9a84c] text-black font-black px-2 py-0.5 uppercase">
                  Cartels & QR Vente
                </span>
                <span className="text-[10px] font-mono bg-emerald-700 text-white font-bold px-2 py-0.5 uppercase hidden sm:inline-block">
                  Écosystème Vente Directe
                </span>
              </div>
              <p className={`text-xs font-sans mt-0.5 ${isDark ? "text-neutral-400" : "text-stone-500"}`}>
                Génération de cartels muraux prêts à imprimer, QR codes de vente instantanée et médiation par audioguide pour les visiteurs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (onOpenShareModal) {
                  onOpenShareModal();
                } else {
                  const url = `${window.location.origin}${window.location.pathname}?view=cartels&mode=visitor`;
                  navigator.clipboard.writeText(url);
                  setCopiedKey("header_share_cartel");
                  setTimeout(() => setCopiedKey(null), 2500);
                }
              }}
              className="px-3 py-1.5 border border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-black transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono font-bold"
              title="Partager ce cartel et l'audioguide aux visiteurs & acheteurs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{copiedKey === "header_share_cartel" ? "Lien Copié !" : "Partager"}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className={`p-2 transition-colors cursor-pointer ${
                isDark ? "text-neutral-400 hover:text-white hover:bg-white/10" : "text-stone-500 hover:text-black hover:bg-stone-200"
              }`}
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={`flex border-b overflow-x-auto text-xs font-sans font-bold uppercase tracking-wider shrink-0 ${
          isDark ? "border-white/10 bg-black/40" : "border-stone-200 bg-stone-100"
        }`}>
          <button
            type="button"
            onClick={() => setActiveTab("generator")}
            className={`flex items-center gap-2 px-4 sm:px-5 py-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "generator"
                ? "border-[#c9a84c] text-[#c9a84c] bg-[#c9a84c]/10"
                : isDark ? "border-transparent text-neutral-400 hover:text-white" : "border-transparent text-stone-600 hover:text-black"
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>{t("cartel_tab_generator", "1. Cartel & QR Vente")}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("visitor_preview")}
            className={`flex items-center gap-2 px-4 sm:px-5 py-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "visitor_preview"
                ? "border-[#c9a84c] text-[#c9a84c] bg-[#c9a84c]/10"
                : isDark ? "border-transparent text-neutral-400 hover:text-white" : "border-transparent text-stone-600 hover:text-black"
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{t("cartel_tab_visitor", "2. Vision Visiteur")}</span>
            <span className="text-[9px] bg-red-600 text-white font-black px-1.5 py-0.2 rounded-full uppercase">
              Audioguide
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("guestbook")}
            className={`flex items-center gap-2 px-4 sm:px-5 py-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "guestbook"
                ? "border-[#c9a84c] text-[#c9a84c] bg-[#c9a84c]/10"
                : isDark ? "border-transparent text-neutral-400 hover:text-white" : "border-transparent text-stone-600 hover:text-black"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t("cartel_tab_guestbook", "3. Livre d'Or & Réservations")}</span>
            <span className="text-[9px] bg-emerald-600 text-white font-black px-1.5 py-0.2 rounded-full">
              {guestbookEntries.length + visitorOptions.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("print_cartels")}
            className={`flex items-center gap-2 px-4 sm:px-5 py-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "print_cartels"
                ? "border-[#c9a84c] text-[#c9a84c] bg-[#c9a84c]/10"
                : isDark ? "border-transparent text-neutral-400 hover:text-white" : "border-transparent text-stone-600 hover:text-black"
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>{t("cartel_tab_print", "4. Impression Murale")}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("contract_coa")}
            className={`flex items-center gap-2 px-4 sm:px-5 py-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "contract_coa"
                ? "border-[#c9a84c] text-[#c9a84c] bg-[#c9a84c]/10"
                : isDark ? "border-transparent text-neutral-400 hover:text-white" : "border-transparent text-stone-600 hover:text-black"
            }`}
          >
            <Award className="w-4 h-4 text-[#c9a84c]" />
            <span>{t("cartel_tab_contract_coa", "5. Achat, Contrat & Certificat COA")}</span>
            <span className="text-[9px] bg-emerald-600 text-white font-black px-1.5 py-0.2 rounded-full uppercase">
              Sécurisé
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("fifty_ideas")}
            className={`flex items-center gap-2 px-4 sm:px-5 py-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "fifty_ideas"
                ? "border-[#c9a84c] text-[#c9a84c] bg-[#c9a84c]/10"
                : isDark ? "border-transparent text-neutral-400 hover:text-white" : "border-transparent text-stone-600 hover:text-black"
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#c9a84c]" />
            <span>{t("cartel_tab_ideas", "6. 50 Leviers Tripartites")}</span>
            <span className="text-[9px] bg-[#c9a84c] text-black font-black px-1.5 py-0.2 rounded-full">
              50
            </span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* TAB 1: GÉNÉRATEUR DE CARTEL & QR CODE DE VENTE */}
          {activeTab === "generator" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Colonne de Configuration (Gauche - 6 cols) */}
              <div className="lg:col-span-6 space-y-5">
                <div className={`p-4 border rounded-none ${
                  isDark ? "bg-black/50 border-white/10" : "bg-stone-50 border-stone-200"
                }`}>
                  <h4 className="font-serif font-bold text-sm uppercase tracking-wide flex items-center gap-2 text-[#c9a84c] mb-3">
                    <Sliders className="w-4 h-4" /> Paramètres du Cartel & de la Vente
                  </h4>

                  <div className="space-y-3.5 text-xs">
                    <div>
                      <label className="block uppercase font-mono text-[10px] tracking-wider mb-1 opacity-70">
                        Titre de l'Œuvre
                      </label>
                      <input 
                        type="text" 
                        value={artworkTitle}
                        onChange={(e) => setArtworkTitle(e.target.value)}
                        className={`w-full p-2.5 border rounded-none font-serif text-sm focus:outline-none focus:border-[#c9a84c] ${
                          isDark ? "bg-neutral-900 border-neutral-700 text-white" : "bg-white border-stone-300 text-stone-900"
                        }`}
                        placeholder="Ex: Tempête Minérale"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block uppercase font-mono text-[10px] tracking-wider mb-1 opacity-70">
                          Nom de l'Artiste
                        </label>
                        <input 
                          type="text" 
                          value={artistName}
                          onChange={(e) => setArtistName(e.target.value)}
                          className={`w-full p-2 border rounded-none font-sans text-xs focus:outline-none focus:border-[#c9a84c] ${
                            isDark ? "bg-neutral-900 border-neutral-700 text-white" : "bg-white border-stone-300 text-stone-900"
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block uppercase font-mono text-[10px] tracking-wider mb-1 opacity-70">
                          Année de Création
                        </label>
                        <input 
                          type="text" 
                          value={artworkYear}
                          onChange={(e) => setArtworkYear(e.target.value)}
                          className={`w-full p-2 border rounded-none font-sans text-xs focus:outline-none focus:border-[#c9a84c] ${
                            isDark ? "bg-neutral-900 border-neutral-700 text-white" : "bg-white border-stone-300 text-stone-900"
                          }`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block uppercase font-mono text-[10px] tracking-wider mb-1 opacity-70">
                          Technique & Support
                        </label>
                        <input 
                          type="text" 
                          value={artworkMedium}
                          onChange={(e) => setArtworkMedium(e.target.value)}
                          className={`w-full p-2 border rounded-none font-sans text-xs focus:outline-none focus:border-[#c9a84c] ${
                            isDark ? "bg-neutral-900 border-neutral-700 text-white" : "bg-white border-stone-300 text-stone-900"
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block uppercase font-mono text-[10px] tracking-wider mb-1 opacity-70">
                          Dimensions (L × H cm)
                        </label>
                        <input 
                          type="text" 
                          value={artworkDimensions}
                          onChange={(e) => setArtworkDimensions(e.target.value)}
                          className={`w-full p-2 border rounded-none font-sans text-xs focus:outline-none focus:border-[#c9a84c] ${
                            isDark ? "bg-neutral-900 border-neutral-700 text-white" : "bg-white border-stone-300 text-stone-900"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Prix et Statut */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block uppercase font-mono text-[10px] tracking-wider mb-1 opacity-70">
                          Prix Public / Atelier
                        </label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="text" 
                            disabled={isPriceOnDemand}
                            value={artworkPrice}
                            onChange={(e) => setArtworkPrice(e.target.value)}
                            className={`w-full p-2 border rounded-none font-mono text-xs font-bold focus:outline-none focus:border-[#c9a84c] ${
                              isPriceOnDemand ? "opacity-40 cursor-not-allowed" : ""
                            } ${isDark ? "bg-neutral-900 border-neutral-700 text-emerald-400" : "bg-white border-stone-300 text-emerald-700"}`}
                          />
                        </div>
                        <label className="flex items-center gap-1.5 mt-1 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={isPriceOnDemand}
                            onChange={(e) => setIsPriceOnDemand(e.target.checked)}
                            className="rounded-none accent-[#c9a84c]"
                          />
                          <span className="text-[10px] opacity-80">Prix sur demande (discret)</span>
                        </label>
                      </div>

                      <div>
                        <label className="block uppercase font-mono text-[10px] tracking-wider mb-1 opacity-70">
                          Statut de Disponibilité
                        </label>
                        <div className="grid grid-cols-3 gap-1">
                          <button
                            type="button"
                            onClick={() => setArtworkStatus("available")}
                            className={`p-1.5 border text-center text-[10px] font-bold uppercase transition-all ${
                              artworkStatus === "available"
                                ? "bg-emerald-600 text-white border-emerald-500 shadow-sm"
                                : isDark ? "bg-neutral-900 border-neutral-700 text-neutral-400" : "bg-white border-stone-200 text-stone-600"
                            }`}
                          >
                            Dispo 🟢
                          </button>
                          <button
                            type="button"
                            onClick={() => setArtworkStatus("reserved")}
                            className={`p-1.5 border text-center text-[10px] font-bold uppercase transition-all ${
                              artworkStatus === "reserved"
                                ? "bg-amber-600 text-white border-amber-500 shadow-sm"
                                : isDark ? "bg-neutral-900 border-neutral-700 text-neutral-400" : "bg-white border-stone-200 text-stone-600"
                            }`}
                          >
                            Option 🟡
                          </button>
                          <button
                            type="button"
                            onClick={() => setArtworkStatus("sold")}
                            className={`p-1.5 border text-center text-[10px] font-bold uppercase transition-all ${
                              artworkStatus === "sold"
                                ? "bg-red-600 text-white border-red-500 shadow-sm"
                                : isDark ? "bg-neutral-900 border-neutral-700 text-neutral-400" : "bg-white border-stone-200 text-stone-600"
                            }`}
                          >
                            Vendu 🔴
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Contact & Galerie */}
                    <div className="pt-2 border-t border-white/10 space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block uppercase font-mono text-[10px] tracking-wider mb-1 opacity-70">
                            Galerie ou Lieu d'Expo
                          </label>
                          <input 
                            type="text" 
                            value={galleryName}
                            onChange={(e) => setGalleryName(e.target.value)}
                            className={`w-full p-2 border rounded-none text-xs ${
                              isDark ? "bg-neutral-900 border-neutral-700 text-white" : "bg-white border-stone-300 text-stone-900"
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block uppercase font-mono text-[10px] tracking-wider mb-1 opacity-70">
                            Téléphone Galerie / Artiste
                          </label>
                          <input 
                            type="text" 
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            className={`w-full p-2 border rounded-none text-xs ${
                              isDark ? "bg-neutral-900 border-neutral-700 text-white" : "bg-white border-stone-300 text-stone-900"
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Destination du QR Code */}
                    <div className="pt-2 border-t border-white/10">
                      <label className="block uppercase font-mono text-[10px] tracking-wider mb-1 text-[#c9a84c] font-bold">
                        Action Déclenchée au Scan du QR Code :
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => setQrDestination("visitor_sheet")}
                          className={`p-2 border text-left flex flex-col justify-between text-xs transition-all cursor-pointer ${
                            qrDestination === "visitor_sheet"
                              ? "border-[#c9a84c] bg-[#c9a84c]/15 text-[#c9a84c] font-bold shadow-sm"
                              : isDark ? "border-neutral-800 bg-neutral-900/50 text-neutral-400" : "border-stone-200 bg-white text-stone-700"
                          }`}
                        >
                          <span className="flex items-center gap-1 font-bold">
                            <Eye className="w-3.5 h-3.5 shrink-0" /> Fiche Visiteur
                          </span>
                          <span className="text-[10px] opacity-75 mt-1">Audioguide IA + Option</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setQrDestination("payment_link")}
                          className={`p-2 border text-left flex flex-col justify-between text-xs transition-all cursor-pointer ${
                            qrDestination === "payment_link"
                              ? "border-[#c9a84c] bg-[#c9a84c]/15 text-[#c9a84c] font-bold shadow-sm"
                              : isDark ? "border-neutral-800 bg-neutral-900/50 text-neutral-400" : "border-stone-200 bg-white text-stone-700"
                          }`}
                        >
                          <span className="flex items-center gap-1 font-bold">
                            <DollarSign className="w-3.5 h-3.5 shrink-0" /> Acompte Direct
                          </span>
                          <span className="text-[10px] opacity-75 mt-1">Stripe, PayPal, CB</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setQrDestination("whatsapp")}
                          className={`p-2 border text-left flex flex-col justify-between text-xs transition-all cursor-pointer ${
                            qrDestination === "whatsapp"
                              ? "border-[#c9a84c] bg-[#c9a84c]/15 text-[#c9a84c] font-bold shadow-sm"
                              : isDark ? "border-neutral-800 bg-neutral-900/50 text-neutral-400" : "border-stone-200 bg-white text-stone-700"
                          }`}
                        >
                          <span className="flex items-center gap-1 font-bold">
                            <Phone className="w-3.5 h-3.5 shrink-0" /> WhatsApp Direct
                          </span>
                          <span className="text-[10px] opacity-75 mt-1">Discussion privée</span>
                        </button>
                      </div>

                      {qrDestination === "payment_link" && (
                        <div className="mt-2.5">
                          <label className="block text-[10px] font-mono opacity-70 mb-0.5">Lien de paiement (URL) :</label>
                          <input 
                            type="text" 
                            value={customPaymentUrl}
                            onChange={(e) => setCustomPaymentUrl(e.target.value)}
                            className={`w-full p-2 border text-xs font-mono ${
                              isDark ? "bg-neutral-900 border-neutral-700 text-white" : "bg-white border-stone-300 text-stone-900"
                            }`}
                            placeholder="https://buy.stripe.com/..."
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Boutons d'Action Rapide */}
                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveTab("print_cartels")}
                    className="flex-1 min-w-[160px] py-2.5 px-4 bg-[#c9a84c] hover:bg-[#d8b85c] text-black font-sans font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <Printer className="w-4 h-4" /> Imprimer le Cartel
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("visitor_preview")}
                    className="flex-1 min-w-[160px] py-2.5 px-4 border border-[#c9a84c] hover:bg-[#c9a84c]/10 text-[#c9a84c] font-sans font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Eye className="w-4 h-4" /> Tester Vue Visiteur
                  </button>
                </div>
              </div>

              {/* Colonne d'Aperçu du Cartel Mural (Droite - 6 cols) */}
              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#c9a84c] font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Aperçu Cartel Mural Réel (12 × 9 cm)
                  </span>

                  {/* Sélecteur de Thème Cartel */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setCartelStyle("museum_white")}
                      className={`px-2 py-0.5 text-[10px] font-mono uppercase border ${
                        cartelStyle === "museum_white" ? "bg-white text-black border-stone-400 font-bold" : "opacity-60"
                      }`}
                    >
                      Musée Blanc
                    </button>
                    <button
                      type="button"
                      onClick={() => setCartelStyle("atelier_dark")}
                      className={`px-2 py-0.5 text-[10px] font-mono uppercase border ${
                        cartelStyle === "atelier_dark" ? "bg-black text-[#c9a84c] border-[#c9a84c] font-bold" : "opacity-60"
                      }`}
                    >
                      Atelier Noir
                    </button>
                    <button
                      type="button"
                      onClick={() => setCartelStyle("gold_luxury")}
                      className={`px-2 py-0.5 text-[10px] font-mono uppercase border ${
                        cartelStyle === "gold_luxury" ? "bg-[#c9a84c] text-black border-[#c9a84c] font-bold" : "opacity-60"
                      }`}
                    >
                      Or Luxe
                    </button>
                  </div>
                </div>

                {/* Cartel Mural physique interactif */}
                <div 
                  className={`p-6 sm:p-8 border-2 shadow-2xl transition-all relative overflow-hidden ${
                    cartelStyle === "museum_white"
                      ? "bg-[#faf9f6] text-stone-900 border-stone-300"
                      : cartelStyle === "atelier_dark"
                        ? "bg-[#0c0c0c] text-neutral-100 border-[#c9a84c]"
                        : "bg-gradient-to-br from-[#121212] via-[#1a1710] to-[#0c0c0c] text-white border-[#c9a84c]"
                  }`}
                  style={{ minHeight: "260px" }}
                >
                  {/* Repères de coupe décoratifs pour l'imprimeur */}
                  <div className="absolute top-1 left-1 text-[8px] font-mono opacity-20 select-none">┌</div>
                  <div className="absolute top-1 right-1 text-[8px] font-mono opacity-20 select-none">┐</div>
                  <div className="absolute bottom-1 left-1 text-[8px] font-mono opacity-20 select-none">└</div>
                  <div className="absolute bottom-1 right-1 text-[8px] font-mono opacity-20 select-none">┘</div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    {/* Infos de l'œuvre */}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-mono tracking-widest uppercase font-bold px-1.5 py-0.5 border ${
                          artworkStatus === "available"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500"
                            : artworkStatus === "reserved"
                              ? "bg-amber-500/10 text-amber-600 border-amber-500"
                              : "bg-red-500/10 text-red-600 border-red-500"
                        }`}>
                          {artworkStatus === "available" ? "● Disponible" : artworkStatus === "reserved" ? "● Réservé / Option" : "● Collection Privée"}
                        </span>
                        <span className="text-[10px] font-serif italic opacity-60">
                          {galleryName}
                        </span>
                      </div>

                      <h2 className="font-serif font-bold text-xl sm:text-2xl tracking-wide leading-tight">
                        {artworkTitle}
                      </h2>

                      <p className="font-sans font-semibold text-sm tracking-wide text-[#c9a84c]">
                        {artistName} <span className="font-normal opacity-70 font-mono text-xs">({artworkYear})</span>
                      </p>

                      <div className="text-xs space-y-0.5 opacity-80 font-sans pt-1">
                        <p className="italic">{artworkMedium}</p>
                        <p className="font-mono text-[11px]">{artworkDimensions}</p>
                      </div>

                      <div className="pt-2">
                        <div className="flex items-baseline gap-2">
                          <span className="font-serif font-black text-lg tracking-tight">
                            {isPriceOnDemand ? "Prix sur demande" : artworkPrice}
                          </span>
                          {!isPriceOnDemand && (
                            <span className="text-[10px] font-mono opacity-60">TTC • Facture d'Art</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bloc QR Code Haute Définition */}
                    <div className="flex flex-col items-center justify-center p-3 bg-white border border-stone-200 shadow-md shrink-0">
                      <QRCodeSVG 
                        value={qrPayload}
                        size={110}
                        level="H"
                        fgColor="#111111"
                        bgColor="#ffffff"
                      />
                      <span className="text-[8px] font-mono uppercase tracking-widest text-stone-700 font-bold mt-2">
                        SCANNER LE CARTEL
                      </span>
                      <span className="text-[7px] font-sans text-stone-500">
                        Audioguide & Réservation
                      </span>
                    </div>
                  </div>

                  {/* Bas du cartel */}
                  <div className="mt-5 pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[9px] font-mono opacity-60">
                    <span>L'Œil de l'Atelier • Passerelle Art & Galerie</span>
                    <span>COA N° {artworkYear}-{Math.abs(artworkTitle.split("").reduce((a,b)=>((a<<5)-a)+b.charCodeAt(0),0)).toString(16).slice(0,6).toUpperCase()}</span>
                  </div>
                </div>

                {/* Copier le lien / Télécharger le QR */}
                <div className={`p-4 border text-xs space-y-2.5 ${
                  isDark ? "bg-black/30 border-white/10" : "bg-stone-50 border-stone-200"
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-[#c9a84c] font-bold">
                      Lien direct pour les visiteurs :
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(qrPayload, "qr_link")}
                      className="flex items-center gap-1 text-[11px] text-[#c9a84c] hover:underline font-bold"
                    >
                      {copiedKey === "qr_link" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedKey === "qr_link" ? "Copié !" : "Copier le lien"}
                    </button>
                  </div>
                  <p className="font-mono text-[10px] break-all p-2 bg-black/40 border border-white/5 text-neutral-300">
                    {qrPayload}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VISION VISITEUR (SIMULATEUR DE CE QUE VOIT LE PUBLIC) */}
          {activeTab === "visitor_preview" && (
            <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
              <div className={`p-3.5 border text-center text-xs flex items-center justify-between ${
                isDark ? "bg-emerald-950/20 border-emerald-800/40 text-emerald-300" : "bg-emerald-50 border-emerald-200 text-emerald-800"
              }`}>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>
                    <strong>Écran Visiteur Mobile :</strong> Voici l'expérience fluide et élégante qui s'affiche sur le smartphone du visiteur après avoir scanné le cartel.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("generator")}
                  className="text-xs underline font-bold"
                >
                  Retour aux réglages
                </button>
              </div>

              {/* Fiche Visiteur Interactive façon App d'Art Contemporain */}
              <div className={`border shadow-2xl p-5 sm:p-8 space-y-6 ${
                isDark ? "bg-[#111111] border-[#c9a84c]/50 text-white" : "bg-white border-stone-300 text-stone-900"
              }`}>
                
                {/* Header Visiteur */}
                <div className="flex items-center justify-between border-b pb-4 border-white/10 dark:border-white/10">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest uppercase text-[#c9a84c] font-bold">
                      {galleryName} • Fiche de Salle Numérique
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold mt-1">
                      {artworkTitle}
                    </h2>
                    <p className="text-sm font-sans font-medium text-neutral-400">
                      Par <strong className="text-white">{artistName}</strong> — {artworkYear}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className={`inline-block text-[10px] font-mono uppercase font-bold px-2 py-0.5 border ${
                      artworkStatus === "available"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500"
                        : artworkStatus === "reserved"
                          ? "bg-amber-500/20 text-amber-400 border-amber-500"
                          : "bg-red-500/20 text-red-400 border-red-500"
                    }`}>
                      {artworkStatus === "available" ? "Disponible" : artworkStatus === "reserved" ? "Option en cours" : "Vendu"}
                    </span>
                    <p className="font-serif font-bold text-lg text-[#c9a84c] mt-1">
                      {isPriceOnDemand ? "Prix sur demande" : artworkPrice}
                    </p>
                  </div>
                </div>

                {/* Visuel de l'œuvre en grand format (si image dispo) */}
                {activeArtworkImage ? (
                  <div className="relative group overflow-hidden border border-white/10 max-h-[380px] flex items-center justify-center bg-black">
                    <img 
                      src={activeArtworkImage} 
                      alt={artworkTitle}
                      className="max-h-[380px] w-auto object-contain mx-auto transition-transform duration-500 group-hover:scale-105" 
                    />
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-[10px] font-mono text-neutral-300 border border-white/10">
                      {artworkDimensions} • {artworkMedium}
                    </div>
                  </div>
                ) : (
                  <div className="p-12 border border-dashed border-white/20 text-center space-y-2">
                    <Palette className="w-8 h-8 mx-auto text-[#c9a84c]" />
                    <p className="text-xs font-mono opacity-60">Visuel haute résolution disponible en salle</p>
                    <p className="font-serif text-sm">{artworkMedium} — {artworkDimensions}</p>
                  </div>
                )}

                {/* Audioguide IA Voix Vivante */}
                <div className={`p-4 border flex flex-col sm:flex-row items-center justify-between gap-4 ${
                  isDark ? "bg-[#18150e] border-[#c9a84c]/60" : "bg-amber-50/70 border-amber-300"
                }`}>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleToggleSpeech}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg ${
                        isPlayingAudio 
                          ? "bg-red-600 text-white animate-pulse" 
                          : "bg-[#c9a84c] text-black hover:scale-105"
                      }`}
                      title={isPlayingAudio ? "Mettre en pause l'audioguide" : "Écouter l'audioguide"}
                    >
                      {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-sm tracking-wide uppercase">
                          Audioguide d'Atelier • Voix Curatoriale
                        </span>
                        <span className="text-[9px] font-mono bg-red-600 text-white px-1.5 py-0.2 uppercase font-bold">
                          {isPlayingAudio ? "En lecture..." : "Audio IA"}
                        </span>
                      </div>
                      <p className="text-xs opacity-80 mt-0.5">
                        Écoutez l'explication sensible de l'œuvre et le secret de sa composition au casque.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleToggleSpeech}
                    className="text-xs font-mono font-bold uppercase tracking-wider text-[#c9a84c] hover:underline"
                  >
                    {isPlayingAudio ? "Arrêter l'audio" : "Lancer l'écoute ▶"}
                  </button>
                </div>

                {/* Note Curatoriale Développée */}
                <div className="space-y-3">
                  <h4 className="font-serif font-bold text-sm uppercase tracking-wide text-[#c9a84c] flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Note de Salle & Démarche de l'Artiste
                  </h4>
                  <p className="text-sm font-serif leading-relaxed opacity-90 italic">
                    « {cache.critique?.critique || cache.statement?.statement || `Dans cette toile, ${artistName} sonde l'équilibre entre tension de la matière et respiration de l'espace. Le travail subtil des glacis et la fermeté de l'empâtement confèrent à l'ensemble une présence magnétique qui dialogue intimement avec le spectateur.`} »
                  </p>
                </div>

                {/* 3 Clés de Regard Sensibles (Médiation Accessible sans Snobisme) */}
                <div className={`p-4 border space-y-3 ${
                  isDark ? "bg-[#14120c] border-[#c9a84c]/30" : "bg-amber-50/50 border-amber-200"
                }`}>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#c9a84c]" />
                    <h4 className="font-serif font-bold text-xs uppercase tracking-wide text-[#c9a84c]">
                      3 Clés pour regarder cette œuvre en salle (Sans jargon)
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs leading-relaxed">
                    <div className="p-2.5 bg-black/20 border border-white/5 space-y-1">
                      <p className="font-bold font-serif text-[#c9a84c]">1. La Matière & Le Geste</p>
                      <p className="opacity-80 text-[11px]">
                        Approchez-vous à 50 cm : remarquez le grain de la toile, les superpositions de couches et les traces vivantes du couteau ou du pinceau.
                      </p>
                    </div>
                    <div className="p-2.5 bg-black/20 border border-white/5 space-y-1">
                      <p className="font-bold font-serif text-[#c9a84c]">2. La Lumière Réelle</p>
                      <p className="opacity-80 text-[11px]">
                        Déplacez-vous légèrement de gauche à droite : observez comme les pigments réagissent aux éclairages directionnels de la galerie.
                      </p>
                    </div>
                    <div className="p-2.5 bg-black/20 border border-white/5 space-y-1">
                      <p className="font-bold font-serif text-[#c9a84c]">3. Le Recul Contemplatif</p>
                      <p className="opacity-80 text-[11px]">
                        Reculez de 2 à 3 mètres : laissez l'ensemble faire masse visuelle. Qu'évoque ce dialogue de formes en vous ?
                      </p>
                    </div>
                  </div>
                </div>

                {/* Simulateur Fiscal Entreprises & Professions Libérales (Art. 238 bis AB du CGI) */}
                <div className={`border p-4 space-y-3 ${
                  isDark ? "bg-neutral-900/60 border-neutral-700" : "bg-stone-50 border-stone-200"
                }`}>
                  <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsTaxSimOpen(!isTaxSimOpen)}>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[#c9a84c]" />
                      <div>
                        <h4 className="font-serif font-bold text-xs uppercase tracking-wide">
                          Entreprises & Professions Libérales • Déduction Fiscale
                        </h4>
                        <p className="text-[10px] opacity-70">
                          Article 238 bis AB du Code Général des Impôts : 100% du prix déductible sur 5 ans.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="text-xs font-mono font-bold text-[#c9a84c] underline"
                    >
                      {isTaxSimOpen ? "Masquer le simulateur" : "Calculer l'avantage ▶"}
                    </button>
                  </div>

                  {isTaxSimOpen && (
                    <div className="pt-3 border-t border-white/10 space-y-3 animate-fadeIn text-xs">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                        <div className="p-2 bg-black/30 border border-white/5">
                          <span className="block text-[9px] font-mono opacity-60 uppercase">Prix de l'œuvre</span>
                          <span className="font-bold text-sm text-[#c9a84c]">{artworkPrice}</span>
                        </div>
                        <div className="p-2 bg-black/30 border border-white/5">
                          <span className="block text-[9px] font-mono opacity-60 uppercase">Déduction / an (5 ans)</span>
                          <span className="font-bold text-sm text-emerald-400">{annualDeduction.toLocaleString('fr-FR')} € / an</span>
                        </div>
                        <div className="p-2 bg-black/30 border border-white/5">
                          <span className="block text-[9px] font-mono opacity-60 uppercase">Gain fiscal estimé (IS 25%)</span>
                          <span className="font-bold text-sm text-emerald-300">~{taxSavings.toLocaleString('fr-FR')} €</span>
                        </div>
                        <div className="p-2 bg-black/30 border border-white/5">
                          <span className="block text-[9px] font-mono opacity-60 uppercase">Coût net après impôt</span>
                          <span className="font-bold text-sm text-white">~{netCorporateCost.toLocaleString('fr-FR')} €</span>
                        </div>
                      </div>
                      <p className="text-[10px] opacity-75 italic leading-relaxed">
                        * Les entreprises soumises à l'IS ou à l'IR (BIC/BNC) peuvent déduire le prix d'acquisition des œuvres originales d'artistes vivants par fractions égales sur 5 ans, dans la limite de 20 000 € ou 5 ‰ du chiffre d'affaires, à condition d'exposer l'œuvre dans un lieu accessible au public ou aux salariés pendant cette période.
                      </p>
                    </div>
                  )}
                </div>

                {/* CTA Direct Achat Immédiat avec Contrat & Certificat COA */}
                <div className={`p-5 border flex flex-col sm:flex-row items-center justify-between gap-4 ${
                  isDark ? "bg-gradient-to-r from-[#1e190f] via-[#15120a] to-black border-[#c9a84c]" : "bg-gradient-to-r from-amber-100/90 via-amber-50 to-white border-[#c9a84c]"
                }`}>
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 flex items-center justify-center bg-[#c9a84c] text-black shrink-0 shadow-md">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif font-bold text-sm sm:text-base uppercase tracking-wide text-[#c9a84c]">
                          Acquérir cette Œuvre Originale en 1 Clic
                        </h4>
                        <span className="text-[9px] font-mono bg-emerald-600 text-white font-black px-1.5 py-0.2 rounded-full uppercase">
                          Vente Sécurisée
                        </span>
                      </div>
                      <p className={`text-xs mt-0.5 ${isDark ? "text-neutral-300" : "text-stone-700"}`}>
                        Générez immédiatement le Bon de Commande, le Contrat de Cession légal et le Certificat d'Authenticité (COA) infalsifiable Décret Marcus n° 81-255 avec QR code de vérification.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (visitorName) setBuyerName(visitorName);
                      if (visitorEmail) setBuyerEmail(visitorEmail);
                      setActiveTab("contract_coa");
                    }}
                    className="py-3 px-6 bg-[#c9a84c] hover:bg-white text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 shadow-lg"
                  >
                    <span>Établir le Contrat & Certificat COA</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Formulaire d'Option & Réservation pour le Visiteur */}
                <div className={`p-5 border space-y-4 ${
                  isDark ? "bg-black/60 border-white/10" : "bg-stone-50 border-stone-200"
                }`}>
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-sm uppercase tracking-wide flex items-center gap-2 text-emerald-400">
                      <ShieldCheck className="w-4 h-4" /> Poser une Option Discrète ou Réserver cette Œuvre
                    </h4>
                    <span className="text-[10px] font-mono opacity-60">
                      Sans engagement financier immédiat
                    </span>
                  </div>

                  {visitorOptionSent ? (
                    <div className="p-4 bg-emerald-950/40 border border-emerald-500 text-emerald-300 text-xs space-y-2 text-center">
                      <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-400" />
                      <p className="font-bold uppercase tracking-wider text-sm">Option de réservation transmise !</p>
                      <p className="opacity-80">
                        La galerie a bien reçu votre demande pour <strong>« {artworkTitle} »</strong>. Votre option de 48h a été enregistrée avec succès.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setVisitorOptionSent(false);
                          setActiveTab("guestbook");
                        }}
                        className="text-xs text-emerald-300 underline font-bold mt-1 inline-block cursor-pointer"
                      >
                        Consulter dans l'onglet Livre d'Or & Réservations ▶
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-mono opacity-70 mb-1">Votre Nom & Prénom *</label>
                          <input 
                            type="text" 
                            value={visitorName}
                            onChange={(e) => setVisitorName(e.target.value)}
                            placeholder="Ex: Jean de Saint-Germain"
                            className={`w-full p-2 border ${isDark ? "bg-neutral-900 border-neutral-700 text-white" : "bg-white border-stone-300"}`}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono opacity-70 mb-1">Votre Email ou Téléphone *</label>
                          <input 
                            type="text" 
                            value={visitorEmail}
                            onChange={(e) => setVisitorEmail(e.target.value)}
                            placeholder="jean@collection.fr ou 06 XX XX XX XX"
                            className={`w-full p-2 border ${isDark ? "bg-neutral-900 border-neutral-700 text-white" : "bg-white border-stone-300"}`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono opacity-70 mb-1">Message ou Proposition confidentielle</label>
                        <textarea 
                          rows={2}
                          value={visitorMessage}
                          onChange={(e) => setVisitorMessage(e.target.value)}
                          className={`w-full p-2 border ${isDark ? "bg-neutral-900 border-neutral-700 text-white" : "bg-white border-stone-300"}`}
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <span className="text-[10px] opacity-60">
                          Option prioritaire valable 48h auprès de la {galleryName}.
                        </span>
                        <button
                          type="button"
                          onClick={handleSubmitOption}
                          className="py-2 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                        >
                          <Send className="w-3.5 h-3.5" /> Poser une Option (Gratuit • 48h)
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Formulaire Livre d'Or Direct (Un mot chaleureux pour l'Artiste) */}
                <div className={`p-4 border space-y-3 ${
                  isDark ? "bg-black/30 border-white/10" : "bg-stone-50 border-stone-200"
                }`}>
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-xs uppercase tracking-wide flex items-center gap-1.5 text-[#c9a84c]">
                      <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> Laisser un mot ou votre ressenti à l'artiste
                    </h4>
                    <span className="text-[10px] opacity-60 font-mono">
                      Livre d'or direct d'Atelier
                    </span>
                  </div>

                  {guestbookSent ? (
                    <div className="p-3 bg-emerald-950/40 border border-emerald-500 text-emerald-300 text-xs text-center space-y-1">
                      <p className="font-bold">Merci infiniment pour vos mots ! ❤️</p>
                      <p className="opacity-80">Votre mot d'or a été transmis dans le carnet privé de l'artiste.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={guestbookAuthor}
                          onChange={(e) => setGuestbookAuthor(e.target.value)}
                          placeholder="Votre nom / prénom (ou Anonyme)"
                          className={`w-full p-2 border text-xs ${isDark ? "bg-neutral-900 border-neutral-700 text-white" : "bg-white border-stone-300"}`}
                        />
                        <input
                          type="text"
                          value={guestbookCity}
                          onChange={(e) => setGuestbookCity(e.target.value)}
                          placeholder="Votre ville (ex: Bordeaux, Genève...)"
                          className={`w-full p-2 border text-xs ${isDark ? "bg-neutral-900 border-neutral-700 text-white" : "bg-white border-stone-300"}`}
                        />
                      </div>
                      <textarea
                        rows={2}
                        value={guestbookText}
                        onChange={(e) => setGuestbookText(e.target.value)}
                        placeholder="Qu'avez-vous ressenti devant cette œuvre ? Vos impressions réchauffent l'atelier..."
                        className={`w-full p-2 border text-xs ${isDark ? "bg-neutral-900 border-neutral-700 text-white" : "bg-white border-stone-300"}`}
                      />
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={handleSubmitGuestbook}
                          className="py-1.5 px-4 bg-[#c9a84c] hover:bg-[#d8b85c] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Send className="w-3 h-3" /> Transmettre à l'Atelier
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pied de fiche Visiteur */}
                <div className="flex flex-wrap items-center justify-between text-xs pt-2 border-t border-white/10 opacity-70">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-[#c9a84c]" /> Contact Galerie : {contactPhone}
                  </span>
                  <span>{contactEmail}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LIVRE D'OR VISITEURS & GESTION DES OPTIONS */}
          {activeTab === "guestbook" && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Bannière de synthèse Tripartite */}
              <div className={`p-4 border flex flex-col sm:flex-row items-center justify-between gap-4 ${
                isDark ? "bg-black/50 border-[#c9a84c]/40" : "bg-amber-50/70 border-amber-300"
              }`}>
                <div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#c9a84c]" />
                    <h4 className="font-serif font-bold text-base tracking-wide uppercase">
                      Livre d'Or d'Atelier & Suivi des Options d'Acquisition
                    </h4>
                  </div>
                  <p className="text-xs opacity-75 mt-0.5">
                    Centralisez les mots chaleureux des visiteurs et les options posées en salle lors des expositions et vernissages.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-center px-3 py-1.5 bg-black/40 border border-white/10">
                    <span className="block text-[9px] font-mono uppercase opacity-60">Mots Reçus</span>
                    <span className="font-bold text-base text-[#c9a84c]">{guestbookEntries.length}</span>
                  </div>
                  <div className="text-center px-3 py-1.5 bg-black/40 border border-white/10">
                    <span className="block text-[9px] font-mono uppercase opacity-60">Options Posées</span>
                    <span className="font-bold text-base text-emerald-400">{visitorOptions.length}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const text = `=== LIVRE D'OR DE L'EXPOSITION ===\nArtiste: ${artistName}\nGalerie: ${galleryName}\n\n` +
                        `--- MOTS DU PUBLIC (${guestbookEntries.length}) ---\n` +
                        guestbookEntries.map(e => `[${e.date}] ${e.visitorName} (${e.city || 'En salle'}) sur "${e.artworkTitle}":\n"${e.message}"\n`).join('\n') +
                        `\n\n--- OPTIONS D'ACQUISITION (${visitorOptions.length}) ---\n` +
                        visitorOptions.map(o => `[${o.date}] ${o.visitorName} (${o.visitorEmail}) - Œuvre: ${o.artworkTitle} (${o.artworkPrice}) - Statut: ${o.status}\nMessage: ${o.message}\n`).join('\n');
                      
                      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `Livre_Or_Atelier_${artistName.replace(/\s+/g, '_')}.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="py-2 px-3 bg-[#c9a84c] hover:bg-[#d8b85c] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                    title="Télécharger l'intégralité du livre d'or et des options"
                  >
                    <FileDown className="w-3.5 h-3.5" /> Exporter Livre d'Or
                  </button>
                </div>
              </div>

              {/* SECTION 1: OPTIONS D'ACQUISITION (LEADS GALERIE & ATELIER) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-sm uppercase tracking-wide flex items-center gap-2 text-emerald-400">
                    <ShieldCheck className="w-4 h-4" /> Options d'Acquisition Actives ({visitorOptions.length})
                  </h4>
                  <span className="text-[10px] font-mono opacity-60">
                    À traiter sous 48h par la galerie ou l'artiste
                  </span>
                </div>

                {visitorOptions.length === 0 ? (
                  <div className="p-6 text-center border border-dashed border-white/10 text-xs opacity-60">
                    Aucune option d'acquisition posée pour l'instant. Les options envoyées depuis la fiche visiteur s'afficheront ici.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {visitorOptions.map((opt) => (
                      <div 
                        key={opt.id}
                        className={`p-4 border space-y-3 ${
                          isDark ? "bg-[#101010] border-white/10" : "bg-white border-stone-300"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-mono text-[#c9a84c] uppercase font-bold block">
                              Œuvre : {opt.artworkTitle} ({opt.artworkPrice})
                            </span>
                            <h5 className="font-serif font-bold text-base mt-0.5">{opt.visitorName}</h5>
                            <p className="text-xs opacity-75 font-mono">{opt.visitorEmail} {opt.visitorPhone ? `• ${opt.visitorPhone}` : ""}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleToggleOptionStatus(opt.id)}
                            className={`text-[9px] font-mono uppercase font-bold px-2 py-1 border transition-all cursor-pointer ${
                              opt.status === "pending"
                                ? "bg-amber-500/20 text-amber-400 border-amber-500 hover:bg-amber-500/30"
                                : opt.status === "confirmed"
                                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500 hover:bg-emerald-500/30"
                                  : "bg-neutral-700/40 text-neutral-400 border-neutral-600"
                            }`}
                            title="Cliquer pour changer le statut"
                          >
                            {opt.status === "pending" ? "⏳ En attente" : opt.status === "confirmed" ? "✅ Confirmée" : "📁 Clôturée"}
                          </button>
                        </div>

                        <p className="text-xs italic bg-black/20 p-2 border border-white/5 opacity-90 leading-relaxed">
                          « {opt.message} »
                        </p>

                        <div className="flex items-center justify-between text-[10px] opacity-60 pt-2 border-t border-white/5 font-mono">
                          <span>Reçue le {opt.date}</span>
                          <a
                            href={`mailto:${opt.visitorEmail}?subject=Votre option sur l'œuvre "${opt.artworkTitle}"&body=Bonjour ${opt.visitorName},`}
                            className="text-[#c9a84c] hover:underline font-bold"
                          >
                            Répondre par email ▶
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION 2: MOTS DU LIVRE D'OR (ÉCHOS SENSIBLES DES VISITEURS) */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="font-serif font-bold text-sm uppercase tracking-wide flex items-center gap-2 text-[#c9a84c]">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> Paroles & Impressions du Public ({guestbookEntries.length})
                  </h4>
                  <span className="text-[10px] font-mono opacity-60">
                    Ces témoignages valorisent la cote de l'artiste auprès des futurs collectionneurs
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {guestbookEntries.map((entry) => (
                    <div 
                      key={entry.id}
                      className={`p-4 border flex flex-col justify-between space-y-3 ${
                        isDark ? "bg-[#0d0d0d] border-white/10" : "bg-stone-50 border-stone-200"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-mono text-[#c9a84c]">
                          <span className="font-bold">{entry.artworkTitle}</span>
                          <span className="opacity-60">{entry.date}</span>
                        </div>
                        <p className="text-xs font-serif italic leading-relaxed opacity-90">
                          « {entry.message} »
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                        <span className="font-bold text-white/90 flex items-center gap-1">
                          <User className="w-3 h-3 text-[#c9a84c]" /> {entry.visitorName}
                        </span>
                        <span className="opacity-50">{entry.city || "Visiteur"}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Formulaire d'ajout direct d'une dédicace en régie */}
                <div className={`p-4 border mt-4 space-y-3 ${
                  isDark ? "bg-black/30 border-white/10" : "bg-stone-100 border-stone-200"
                }`}>
                  <h5 className="font-serif font-bold text-xs uppercase tracking-wide text-neutral-300 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#c9a84c]" /> Noter un mot recueilli au vernissage (Saisie Galerie / Artiste)
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <input 
                      type="text"
                      value={guestbookAuthor}
                      onChange={(e) => setGuestbookAuthor(e.target.value)}
                      placeholder="Nom du visiteur / critique"
                      className={`p-2 border text-xs ${isDark ? "bg-neutral-900 border-neutral-700 text-white" : "bg-white border-stone-300"}`}
                    />
                    <input 
                      type="text"
                      value={guestbookCity}
                      onChange={(e) => setGuestbookCity(e.target.value)}
                      placeholder="Ville ou statut (ex: Collectionneur, Paris)"
                      className={`p-2 border text-xs ${isDark ? "bg-neutral-900 border-neutral-700 text-white" : "bg-white border-stone-300"}`}
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={guestbookText}
                    onChange={(e) => setGuestbookText(e.target.value)}
                    placeholder="Transcription du mot d'or..."
                    className={`w-full p-2 border text-xs ${isDark ? "bg-neutral-900 border-neutral-700 text-white" : "bg-white border-stone-300"}`}
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleSubmitGuestbook}
                      className="py-1.5 px-4 bg-[#c9a84c] hover:bg-[#d8b85c] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" /> Enregistrer dans le Livre d'Or
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PLANCHE D'IMPRESSION MURALE (MUSÉE & GALERIE) */}
          {activeTab === "print_cartels" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 border bg-black/40 border-white/10">
                <div>
                  <h4 className="font-serif font-bold text-sm uppercase tracking-wide text-[#c9a84c]">
                    Planche d'Impression des Cartels (Format A4 - Prêt à découper)
                  </h4>
                  <p className="text-xs opacity-75 mt-0.5">
                    Cette planche génère 2 cartels avec repères de coupe au millimètre pour bristol 300g, dibond ou carton mousse.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="py-2.5 px-6 bg-[#c9a84c] hover:bg-[#d8b85c] text-black font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg"
                >
                  <Printer className="w-4 h-4" /> Lancer l'Impression Immédiate
                </button>
              </div>

              {/* Conteneur imprimable */}
              <div ref={printRef} className="space-y-6 p-6 bg-white text-black border border-stone-300 shadow-xl">
                <div className="text-center pb-4 border-b border-stone-200">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-stone-500">
                    L'Œil de l'Atelier • Cartels Muraux d'Exposition • {galleryName}
                  </span>
                </div>

                {/* Grille de 2 cartels découpables */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Cartel 1 */}
                  <div className="border-2 border-dashed border-stone-400 p-6 relative bg-[#faf9f6]">
                    <span className="absolute -top-2.5 left-4 px-2 bg-white text-[9px] font-mono uppercase text-stone-500 border border-stone-300">
                      Cartel Mural N°1 — {artworkDimensions}
                    </span>

                    <div className="space-y-2">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-[#9c7d2b] font-bold">
                        {galleryName}
                      </p>
                      <h3 className="font-serif font-bold text-xl leading-tight">
                        {artworkTitle}
                      </h3>
                      <p className="font-sans font-bold text-sm text-stone-800">
                        {artistName} <span className="font-normal text-xs text-stone-600">({artworkYear})</span>
                      </p>
                      <p className="text-xs italic text-stone-700">{artworkMedium}</p>
                      <p className="text-[11px] font-mono text-stone-600">{artworkDimensions}</p>
                      
                      <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                        <span className="font-serif font-bold text-base">
                          {isPriceOnDemand ? "Prix sur demande" : artworkPrice}
                        </span>
                        <span className="text-[9px] font-mono bg-stone-200 text-stone-700 px-1.5 py-0.5 uppercase">
                          {artworkStatus === "available" ? "Disponible" : "Réservé"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-300 flex items-center justify-between">
                      <div className="text-[9px] font-mono text-stone-600">
                        <p>Scanner pour écouter l'audioguide</p>
                        <p className="text-stone-400">Option de réservation directe</p>
                      </div>
                      <QRCodeSVG value={qrPayload} size={70} level="M" />
                    </div>
                  </div>

                  {/* Cartel 2 (Copie ou format chevalet) */}
                  <div className="border-2 border-dashed border-stone-400 p-6 relative bg-[#faf9f6]">
                    <span className="absolute -top-2.5 left-4 px-2 bg-white text-[9px] font-mono uppercase text-stone-500 border border-stone-300">
                      Cartel Mural N°2 (Format Double / Double Accrochage)
                    </span>

                    <div className="space-y-2">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-[#9c7d2b] font-bold">
                        {galleryName}
                      </p>
                      <h3 className="font-serif font-bold text-xl leading-tight">
                        {artworkTitle}
                      </h3>
                      <p className="font-sans font-bold text-sm text-stone-800">
                        {artistName} <span className="font-normal text-xs text-stone-600">({artworkYear})</span>
                      </p>
                      <p className="text-xs italic text-stone-700">{artworkMedium}</p>
                      <p className="text-[11px] font-mono text-stone-600">{artworkDimensions}</p>
                      
                      <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                        <span className="font-serif font-bold text-base">
                          {isPriceOnDemand ? "Prix sur demande" : artworkPrice}
                        </span>
                        <span className="text-[9px] font-mono bg-stone-200 text-stone-700 px-1.5 py-0.5 uppercase">
                          {artworkStatus === "available" ? "Disponible" : "Réservé"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-300 flex items-center justify-between">
                      <div className="text-[9px] font-mono text-stone-600">
                        <p>Scanner pour écouter l'audioguide</p>
                        <p className="text-stone-400">Option de réservation directe</p>
                      </div>
                      <QRCodeSVG value={qrPayload} size={70} level="M" />
                    </div>
                  </div>
                </div>

                <div className="text-center pt-4 text-[9px] font-mono text-stone-400 border-t border-stone-200">
                  Découpez le long des pointillés • Fixation conseillée : adhésif mousse double face sans acide
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ACHAT EXPRESS, CONTRAT DE VENTE & CERTIFICAT D'AUTHENTICITÉ (COA) */}
          {activeTab === "contract_coa" && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Header Banner */}
              <div className={`p-5 sm:p-6 border relative overflow-hidden ${
                isDark ? "bg-gradient-to-r from-[#1e190f] via-[#141209] to-black border-[#c9a84c]" : "bg-gradient-to-r from-amber-100/80 via-amber-50 to-white border-[#c9a84c]"
              }`}>
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 bg-[#c9a84c] text-black">
                        Module Vente & Juridique
                      </span>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5">
                        Conforme Décret Marcus n° 81-255 du 3 mars 1981
                      </span>
                    </div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight">
                      Achat Express • Contrat de Cession & Certificat d'Authenticité (COA)
                    </h3>
                    <p className={`text-xs sm:text-sm font-sans leading-relaxed ${isDark ? "text-neutral-300" : "text-stone-700"}`}>
                      Sécurisez immédiatement la vente d'une œuvre originale avec le collectionneur ou visiteur : contrat de cession complet préservant les droits d'auteur (CPI L. 111-1) et certificat d'authenticité de luxe avec QR code infalsifiable.
                    </p>
                  </div>

                  {/* Actions d'Impression & Export */}
                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        const contractText = `CONTRAT DE CESSION & BON DE COMMANDE D'ŒUVRE D'ART ORIGINALE
Référence : ${contractNumber}
Date d'établissement : ${contractDate}

VENDEUR :
${sellerType === "galerie" ? `Galerie : ${galleryName}\nContact : ${contactEmail} • ${contactPhone}` : `Artiste Auteur : ${artistName}\nContact : ${profile.contactEmail || contactEmail}\nSite web : ${profile.web || "Non renseigné"}`}

ACQUÉREUR :
Nom / Raison Sociale : ${buyerName}
Adresse : ${buyerAddress}
Email : ${buyerEmail} • Téléphone : ${buyerPhone}

DÉSIGNATION DE L'ŒUVRE ORIGINALE :
- Titre : « ${artworkTitle} »
- Artiste : ${artistName}
- Année : ${artworkYear}
- Médium / Technique : ${artworkMedium}
- Dimensions : ${artworkDimensions}
- Caractéristique : Exemplaire original unique 1/1
- Certificat d'Authenticité associé : N° ${certificateNumber} (Décret Marcus n° 81-255)

PRIX ET RÈGLEMENT :
- Prix convenu : ${artworkPrice} TTC (${vatRegime === "5.5" ? "TVA à 5,5% - Art. 278-0 bis CGI" : "Franchise de TVA - Art. 293 B CGI"})
- Modalité : ${paymentOption === "comptant" ? "Paiement comptant à la commande" : "Acompte de 30% à la réservation, solde à la livraison"}
- Mode de paiement : ${paymentMode === "virement" ? "Virement bancaire" : paymentMode === "carte" ? "Carte bancaire / Stripe" : "Chèque bancaire certifié"}
- Livraison prévue : ${deliveryDate} (${buyerNotes})

CLAUSES LÉGALES :
1. Réserve de propriété : Le transfert de propriété est effectif dès l'encaissement intégral du prix convenu.
2. Droits d'auteur : Conformément aux articles L. 111-1 et suivants du CPI, l'artiste ${artistName} conserve l'intégralité de ses droits moraux et patrimoniaux sur l'œuvre.
3. Authenticité : L'œuvre est garantie originale et unique.`;
                        navigator.clipboard.writeText(contractText);
                        setContractCopied(true);
                        setTimeout(() => setContractCopied(false), 2500);
                      }}
                      className="px-4 py-2.5 bg-black/60 border border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-black font-mono font-bold text-xs uppercase flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Copy className="w-4 h-4" />
                      <span>{contractCopied ? "Contrat Copié !" : "Copier Contrat"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        window.print();
                      }}
                      className="px-5 py-2.5 bg-[#c9a84c] hover:bg-white text-black font-mono font-bold text-xs uppercase flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Imprimer le Dossier de Vente</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Contenu Principal : Grille 2 Colonnes */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Colonne Gauche : Configuration & Contrat de Cession (6 cols) */}
                <div className="lg:col-span-6 space-y-5">
                  
                  {/* Formulaire Acquéreur & Transaction */}
                  <div className={`p-5 border space-y-4 ${
                    isDark ? "bg-[#121212] border-white/10" : "bg-stone-50 border-stone-200"
                  }`}>
                    <div className="flex items-center justify-between border-b pb-2.5 border-white/10">
                      <h4 className="font-serif font-bold text-sm uppercase tracking-wide flex items-center gap-2 text-[#c9a84c]">
                        <User className="w-4 h-4" /> Informations Acquéreur & Modalités
                      </h4>
                      <span className="text-[10px] font-mono opacity-60">
                        Réf. {contractNumber}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[10px] font-mono opacity-75 mb-1">Nom / Prénom ou Entreprise</label>
                        <input
                          type="text"
                          value={buyerName}
                          onChange={(e) => setBuyerName(e.target.value)}
                          className={`w-full p-2 border ${isDark ? "bg-black border-neutral-700 text-white" : "bg-white border-stone-300"}`}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono opacity-75 mb-1">Email de l'Acquéreur</label>
                        <input
                          type="text"
                          value={buyerEmail}
                          onChange={(e) => setBuyerEmail(e.target.value)}
                          className={`w-full p-2 border ${isDark ? "bg-black border-neutral-700 text-white" : "bg-white border-stone-300"}`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[10px] font-mono opacity-75 mb-1">Téléphone de l'Acquéreur</label>
                        <input
                          type="text"
                          value={buyerPhone}
                          onChange={(e) => setBuyerPhone(e.target.value)}
                          className={`w-full p-2 border ${isDark ? "bg-black border-neutral-700 text-white" : "bg-white border-stone-300"}`}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono opacity-75 mb-1">Entité Vendeuse</label>
                        <select
                          value={sellerType}
                          onChange={(e: any) => setSellerType(e.target.value)}
                          className={`w-full p-2 border ${isDark ? "bg-black border-neutral-700 text-white" : "bg-white border-stone-300"}`}
                        >
                          <option value="galerie">Galerie ({galleryName})</option>
                          <option value="artiste">Artiste Direct ({artistName})</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono opacity-75 mb-1">Adresse de Facturation / Domicile</label>
                      <input
                        type="text"
                        value={buyerAddress}
                        onChange={(e) => setBuyerAddress(e.target.value)}
                        className={`w-full p-2 border ${isDark ? "bg-black border-neutral-700 text-white" : "bg-white border-stone-300 text-xs"}`}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                      <div>
                        <label className="block text-[10px] font-mono opacity-75 mb-1">Prix de Cession</label>
                        <input
                          type="text"
                          value={artworkPrice}
                          onChange={(e) => setArtworkPrice(e.target.value)}
                          className={`w-full p-2 border font-bold text-[#c9a84c] ${isDark ? "bg-black border-neutral-700" : "bg-white border-stone-300"}`}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono opacity-75 mb-1">Modalité</label>
                        <select
                          value={paymentOption}
                          onChange={(e: any) => setPaymentOption(e.target.value)}
                          className={`w-full p-2 border ${isDark ? "bg-black border-neutral-700 text-white" : "bg-white border-stone-300"}`}
                        >
                          <option value="comptant">Comptant (100%)</option>
                          <option value="acompte_30">Acompte 30%</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono opacity-75 mb-1">Règlement</label>
                        <select
                          value={paymentMode}
                          onChange={(e: any) => setPaymentMode(e.target.value)}
                          className={`w-full p-2 border ${isDark ? "bg-black border-neutral-700 text-white" : "bg-white border-stone-300"}`}
                        >
                          <option value="virement">Virement Bancaire</option>
                          <option value="carte">Carte / En Ligne</option>
                          <option value="cheque">Chèque Certifié</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[10px] font-mono opacity-75 mb-1">Date du Contrat</label>
                        <input
                          type="text"
                          value={contractDate}
                          onChange={(e) => setContractDate(e.target.value)}
                          className={`w-full p-2 border ${isDark ? "bg-black border-neutral-700 text-white" : "bg-white border-stone-300"}`}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono opacity-75 mb-1">Mise à disposition / Livraison</label>
                        <input
                          type="text"
                          value={deliveryDate}
                          onChange={(e) => setDeliveryDate(e.target.value)}
                          className={`w-full p-2 border ${isDark ? "bg-black border-neutral-700 text-white" : "bg-white border-stone-300"}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Visualiseur de Contrat Imprimable */}
                  <div className={`p-5 border space-y-3 font-mono text-xs leading-relaxed ${
                    isDark ? "bg-black border-[#c9a84c]/30 text-neutral-300" : "bg-white border-stone-300 text-stone-800"
                  }`}>
                    <div className="flex items-center justify-between border-b pb-2 border-white/10">
                      <span className="font-bold text-[#c9a84c] uppercase">Contrat de Vente & Cession d'Œuvre d'Art</span>
                      <span className="text-[10px] opacity-60">Art. L. 111-1 CPI</span>
                    </div>

                    <div className="space-y-2 text-[11px] max-h-80 overflow-y-auto pr-2 scrollbar-thin">
                      <p><strong>RÉFÉRENCE :</strong> {contractNumber} • Date : {contractDate}</p>
                      <p><strong>1. VENDEUR :</strong> {sellerType === "galerie" ? `${galleryName} (pour le compte de l'artiste)` : `L'Artiste ${artistName}`}</p>
                      <p><strong>2. ACQUÉREUR :</strong> {buyerName} — {buyerAddress}</p>
                      <p><strong>3. OBJET DE LA CESSION :</strong> L'œuvre originale intitulée « {artworkTitle} », créée en {artworkYear} par {artistName}. Médium : {artworkMedium}. Dimensions : {artworkDimensions}. Exemplaire unique (1/1).</p>
                      <p><strong>4. PRIX & TVA :</strong> Montant de {artworkPrice} TTC réglé par {paymentMode} ({paymentOption === "comptant" ? "Paiement comptant" : "Acompte de 30%"}).</p>
                      <p><strong>5. RÉSERVE DE PROPRIÉTÉ :</strong> Le vendeur conserve la propriété de l'œuvre jusqu'au paiement intégral du prix convenu.</p>
                      <p><strong>6. DROITS D'AUTEUR :</strong> La présente cession ne transfère que la propriété matérielle de l'œuvre. Les droits de reproduction, représentation et adaptation demeurent la propriété exclusive et inaliénable de l'artiste {artistName} (Articles L. 111-1 et suivants du Code de la Propriété Intellectuelle).</p>
                      <p><strong>7. CERTIFICAT LIÉ :</strong> Un Certificat d'Authenticité N° {certificateNumber} conforme au Décret Marcus n° 81-255 du 3 mars 1981 est remis à l'acquéreur.</p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] text-emerald-400 font-bold">✓ Clauses légales conformes</span>
                      <button
                        type="button"
                        onClick={() => {
                          window.print();
                        }}
                        className="text-xs font-bold text-[#c9a84c] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" /> Imprimer ce Contrat ▶
                      </button>
                    </div>
                  </div>

                </div>

                {/* Colonne Droite : CERTIFICAT D'AUTHENTICITÉ (COA) INFALSIFIABLE (6 cols) */}
                <div className="lg:col-span-6 space-y-4">
                  
                  {/* Titre & Info Décret Marcus */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-sm uppercase tracking-wide flex items-center gap-2 text-[#c9a84c]">
                        <Award className="w-4 h-4" /> Certificat d'Authenticité (COA) Infalsifiable
                      </h4>
                      <p className="text-[10px] opacity-75 font-mono">
                        Décret n° 81-255 du 3 mars 1981 • Référence unique : {certificateNumber}
                      </p>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => {
                        const coaText = `CERTIFICAT D'AUTHENTICITÉ • ATELIER D'ART
Numéro d'enregistrement officiel : ${certificateNumber}

Je soussigné(e), ${artistName}, Artiste Auteur, certifie que l'œuvre originale désignée ci-après a été entièrement exécutée de ma main selon les règles de l'art, et constitue un exemplaire original et unique, conformément aux dispositions du Décret n° 81-255 du 3 mars 1981 relatif à la répression des fraudes en matière de transactions d'œuvres d'art.

TITRE DE L'ŒUVRE : « ${artworkTitle} »
ARTISTE CRÉATEUR : ${artistName}
ANNÉE DE RÉALISATION : ${artworkYear}
TECHNIQUE & SUPPORT : ${artworkMedium}
DIMENSIONS : ${artworkDimensions}
TIRAGE / ÉDITION : Exemplaire Unique Original 1/1
VALEUR DÉCLARÉE : ${artworkPrice} TTC
GALERIE DÉPOSITAIRE : ${galleryName}
ACQUÉREUR : ${buyerName}
DATE D'ÉMISSION : ${contractDate}

Vérification d'authenticité numérique :
${window.location.origin}${window.location.pathname}?verify=${certificateNumber}&title=${encodeURIComponent(artworkTitle)}&artist=${encodeURIComponent(artistName)}`;
                        navigator.clipboard.writeText(coaText);
                        setCoaCopied(true);
                        setTimeout(() => setCoaCopied(false), 2500);
                      }}
                      className="text-xs font-mono font-bold text-[#c9a84c] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{coaCopied ? "Certificat copié !" : "Copier le texte COA"}</span>
                    </button>
                  </div>

                  {/* Le Certificat Physique (Style Parchemin d'Art Grand Luxe) */}
                  <div 
                    ref={coaPrintRef}
                    className={`p-6 sm:p-8 border-4 border-double shadow-2xl relative space-y-6 ${
                      isDark 
                        ? "bg-[#0d0d0d] border-[#c9a84c] text-white" 
                        : "bg-[#fdfaf3] border-[#b8973e] text-stone-900"
                    }`}
                  >
                    {/* Filigrane d'Art & Sceau Doré */}
                    <div className="absolute top-4 right-4 opacity-15 pointer-events-none">
                      <Award className="w-32 h-32 text-[#c9a84c]" />
                    </div>

                    {/* En-tête officiel */}
                    <div className="text-center space-y-1 border-b pb-4 border-[#c9a84c]/40 relative z-10">
                      <div className="flex items-center justify-center gap-2">
                        <span className="h-px w-10 bg-[#c9a84c]"></span>
                        <Award className="w-5 h-5 text-[#c9a84c]" />
                        <span className="h-px w-10 bg-[#c9a84c]"></span>
                      </div>
                      <h2 className="font-serif text-lg sm:text-xl font-black uppercase tracking-[0.2em] text-[#c9a84c]">
                        Certificat d'Authenticité
                      </h2>
                      <p className="text-[10px] font-mono tracking-widest uppercase opacity-75">
                        Création Artistique Originale • Décret n° 81-255 du 3 mars 1981
                      </p>
                      <p className="text-[11px] font-mono font-bold text-emerald-500 pt-0.5">
                        N° D'ENREGISTREMENT : {certificateNumber}
                      </p>
                    </div>

                    {/* Visuel de l'Œuvre & Détails Clés */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center relative z-10">
                      
                      {/* Vignette de l'Œuvre */}
                      <div className="sm:col-span-4 flex justify-center">
                        <div className="w-28 h-28 sm:w-32 sm:h-32 border-2 border-[#c9a84c] p-1 bg-black/20 shadow-inner flex items-center justify-center overflow-hidden">
                          {activeArtworkImage ? (
                            <img 
                              src={activeArtworkImage} 
                              alt={artworkTitle} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Palette className="w-12 h-12 text-[#c9a84c]/60" />
                          )}
                        </div>
                      </div>

                      {/* Métadonnées Spécifiques */}
                      <div className="sm:col-span-8 space-y-1.5 text-xs font-serif">
                        <div>
                          <span className="text-[10px] font-mono uppercase opacity-60 block font-sans">Titre de l'Œuvre</span>
                          <strong className="text-base sm:text-lg text-[#c9a84c] font-black italic">« {artworkTitle} »</strong>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div>
                            <span className="text-[9px] font-mono uppercase opacity-60 block font-sans">Artiste</span>
                            <span className="font-bold">{artistName}</span>
                          </div>
                          <div>
                            <span className="text-[9px] font-mono uppercase opacity-60 block font-sans">Année de création</span>
                            <span className="font-bold">{artworkYear}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div>
                            <span className="text-[9px] font-mono uppercase opacity-60 block font-sans">Technique / Médium</span>
                            <span className="font-bold">{artworkMedium}</span>
                          </div>
                          <div>
                            <span className="text-[9px] font-mono uppercase opacity-60 block font-sans">Dimensions</span>
                            <span className="font-bold">{artworkDimensions}</span>
                          </div>
                        </div>
                        <div className="pt-1">
                          <span className="text-[9px] font-mono uppercase opacity-60 block font-sans">Spécificité</span>
                          <span className="font-bold text-emerald-400">Exemplaire Original Unique (1/1) • Signé de la main de l'artiste</span>
                        </div>
                      </div>
                    </div>

                    {/* Déclaration Solennelle d'Authenticité Décret Marcus */}
                    <div className={`p-3.5 border text-[10px] sm:text-[11px] leading-relaxed italic relative z-10 ${
                      isDark ? "bg-black/60 border-white/10 text-neutral-300" : "bg-white/80 border-stone-200 text-stone-800"
                    }`}>
                      « Je soussigné(e), <strong>{artistName}</strong>, certifie que l'œuvre désignée ci-dessus est une création originale réalisée intégralement de ma main selon les règles de l'art, et constitue un exemplaire unique et original, conformément aux dispositions du <strong>Décret n° 81-255 du 3 mars 1981</strong> relatif à la répression des fraudes en matière de transactions d'œuvres d'art et d'objets de collection. »
                    </div>

                    {/* QR Code de Sécurité & Signatures Officielles */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end pt-2 border-t border-[#c9a84c]/30 relative z-10">
                      
                      {/* QR Code de Sécurité Infalsifiable */}
                      <div className="sm:col-span-4 flex flex-col items-center text-center space-y-1">
                        <div className="p-2 bg-white border border-[#c9a84c] shadow-sm">
                          <QRCodeSVG 
                            value={`${window.location.origin}${window.location.pathname}?verify=${certificateNumber}&title=${encodeURIComponent(artworkTitle)}&artist=${encodeURIComponent(artistName)}`}
                            size={72}
                            level="M"
                          />
                        </div>
                        <span className="text-[8px] font-mono uppercase opacity-75 leading-tight">
                          Preuve Numérique & Traçabilité Clé {certificateNumber.slice(-6)}
                        </span>
                      </div>

                      {/* Signature Artiste */}
                      <div className="sm:col-span-4 text-center space-y-4">
                        <span className="text-[9px] font-mono uppercase opacity-60 block">Signature de l'Artiste</span>
                        <div className="h-10 border-b border-dashed border-[#c9a84c]/60 flex items-center justify-center italic text-[#c9a84c] font-serif text-sm">
                          {artistName}
                        </div>
                        <span className="text-[8px] opacity-60 font-mono">Fait à l'Atelier le {contractDate}</span>
                      </div>

                      {/* Cachet Galerie */}
                      <div className="sm:col-span-4 text-center space-y-4">
                        <span className="text-[9px] font-mono uppercase opacity-60 block">Visa & Cachet Galerie</span>
                        <div className="h-10 border-b border-dashed border-[#c9a84c]/60 flex items-center justify-center font-bold text-xs uppercase opacity-80">
                          {galleryName}
                        </div>
                        <span className="text-[8px] opacity-60 font-mono">Enregistré au registre de vente</span>
                      </div>

                    </div>

                  </div>

                  {/* Bouton d'impression du Certificat */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] opacity-60 font-mono">
                      Conseil : Imprimer sur papier vergé ou papier coton 300g
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        window.print();
                      }}
                      className="py-2.5 px-5 bg-[#c9a84c] hover:bg-white text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Imprimer le Certificat COA (Papier d'Art)</span>
                    </button>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* TAB 6: LES 50 LEVIERS TRIPARTITES */}
          {activeTab === "fifty_ideas" && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Header et Filtres des 50 idées */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border bg-black/40 border-white/10">
                <div>
                  <h4 className="font-serif font-bold text-base uppercase tracking-wide text-[#c9a84c] flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> 50 Innovations Stratégiques Tripartites
                  </h4>
                  <p className="text-xs opacity-75 mt-0.5">
                    Découvrez les leviers qui fluidifient le travail de l'artiste, dynamisent la galerie et enchantent le visiteur.
                  </p>
                </div>

                {/* Recherche */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 opacity-50" />
                  <input 
                    type="text" 
                    value={ideasSearch}
                    onChange={(e) => setIdeasSearch(e.target.value)}
                    placeholder="Rechercher parmi les 50 idées..."
                    className={`w-full pl-8 pr-3 py-1.5 text-xs border ${
                      isDark ? "bg-neutral-900 border-neutral-700 text-white" : "bg-white border-stone-300 text-stone-900"
                    }`}
                  />
                </div>
              </div>

              {/* Filtres par Rôle */}
              <div className="flex flex-wrap gap-2 text-xs font-mono uppercase font-bold">
                <button
                  type="button"
                  onClick={() => setIdeasFilter("all")}
                  className={`px-3 py-1.5 border transition-all ${
                    ideasFilter === "all"
                      ? "bg-[#c9a84c] text-black border-[#c9a84c]"
                      : isDark ? "border-neutral-800 text-neutral-400 hover:text-white" : "border-stone-200 text-stone-600 hover:text-black"
                  }`}
                >
                  Toutes les 50 Idées ({FIFTY_INNOVATIONS.length})
                </button>
                <button
                  type="button"
                  onClick={() => setIdeasFilter("artiste")}
                  className={`px-3 py-1.5 border transition-all ${
                    ideasFilter === "artiste"
                      ? "bg-amber-600 text-white border-amber-500"
                      : isDark ? "border-neutral-800 text-neutral-400 hover:text-white" : "border-stone-200 text-stone-600 hover:text-black"
                  }`}
                >
                  🎨 Pour l'Artiste (13)
                </button>
                <button
                  type="button"
                  onClick={() => setIdeasFilter("galeriste")}
                  className={`px-3 py-1.5 border transition-all ${
                    ideasFilter === "galeriste"
                      ? "bg-blue-600 text-white border-blue-500"
                      : isDark ? "border-neutral-800 text-neutral-400 hover:text-white" : "border-stone-200 text-stone-600 hover:text-black"
                  }`}
                >
                  🏛️ Pour le Galeriste (13)
                </button>
                <button
                  type="button"
                  onClick={() => setIdeasFilter("visiteur")}
                  className={`px-3 py-1.5 border transition-all ${
                    ideasFilter === "visiteur"
                      ? "bg-emerald-600 text-white border-emerald-500"
                      : isDark ? "border-neutral-800 text-neutral-400 hover:text-white" : "border-stone-200 text-stone-600 hover:text-black"
                  }`}
                >
                  👁️ Pour le Visiteur (14)
                </button>
                <button
                  type="button"
                  onClick={() => setIdeasFilter("vente")}
                  className={`px-3 py-1.5 border transition-all ${
                    ideasFilter === "vente"
                      ? "bg-purple-600 text-white border-purple-500"
                      : isDark ? "border-neutral-800 text-neutral-400 hover:text-white" : "border-stone-200 text-stone-600 hover:text-black"
                  }`}
                >
                  💎 Vente & Écosystème (10)
                </button>
              </div>

              {/* Grille des Cartes d'Idées */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredIdeas.map((idea) => {
                  const badgeColor = 
                    idea.role === "artiste" ? "bg-amber-950/40 text-amber-300 border-amber-800" :
                    idea.role === "galeriste" ? "bg-blue-950/40 text-blue-300 border-blue-800" :
                    idea.role === "visiteur" ? "bg-emerald-950/40 text-emerald-300 border-emerald-800" :
                    "bg-purple-950/40 text-purple-300 border-purple-800";

                  return (
                    <div 
                      key={idea.id}
                      className={`p-4 border flex flex-col justify-between transition-all hover:border-[#c9a84c] ${
                        isDark ? "bg-black/50 border-white/10" : "bg-white border-stone-200"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-[9px] font-mono uppercase px-2 py-0.5 border ${badgeColor}`}>
                            #{idea.id} • {idea.role}
                          </span>
                          <span className="text-[10px] font-mono opacity-50">
                            {idea.category}
                          </span>
                        </div>

                        <h5 className="font-serif font-bold text-sm leading-snug">
                          {idea.title}
                        </h5>

                        <p className="text-xs font-sans opacity-80 leading-relaxed">
                          {idea.desc}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => {
                            if (idea.role === "visiteur") setActiveTab("visitor_preview");
                            else if (idea.role === "artiste" || idea.role === "galeriste") setActiveTab("generator");
                            else setActiveTab("print_cartels");
                          }}
                          className="text-[11px] font-mono text-[#c9a84c] hover:underline flex items-center gap-1 font-bold"
                        >
                          Appliquer au Cartel <ArrowRight className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopy(`${idea.title} : ${idea.desc}`, `idea_${idea.id}`)}
                          className="text-[10px] opacity-60 hover:opacity-100 flex items-center gap-1"
                        >
                          {copiedKey === `idea_${idea.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className={`p-3 sm:p-4 border-t flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 ${
          isDark ? "border-white/10 bg-black/80" : "border-stone-200 bg-stone-100"
        }`}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono text-[11px] opacity-80">
              Module Cartels & QR de Vente Actif • {artistName} — « {artworkTitle} »
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-xs font-mono uppercase font-bold border transition-colors cursor-pointer ${
                isDark ? "border-neutral-700 hover:bg-white/10" : "border-stone-300 hover:bg-stone-200"
              }`}
            >
              Fermer
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("print_cartels")}
              className="px-4 py-2 text-xs font-mono uppercase font-bold bg-[#c9a84c] text-black hover:bg-[#d8b85c] transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" /> Planche d'Impression
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
