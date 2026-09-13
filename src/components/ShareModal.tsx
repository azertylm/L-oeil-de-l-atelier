import React, { useState } from "react";
import { 
  Share2, X, Copy, Check, QrCode, Globe, Send, 
  Mail, MessageSquare, Linkedin, Twitter, Sparkles, 
  ExternalLink, Clock, Building2, User, Download, 
  Printer, ArrowRight, ShieldCheck, CheckCircle2
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useLanguage } from "../i18n/LanguageContext.js";
import { ArtistProfile } from "../types.js";

export type ShareRole = "all" | "gallerist" | "visitor" | "collector" | "galeriste" | "visiteur" | "collectionneur";

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: "dark-gold" | "light";
  profile?: ArtistProfile;
  activeArtworkTitle?: string;
  initialRole?: ShareRole;
  onNavigateToView?: (viewId: string) => void;
}

export default function ShareModal({
  isOpen,
  onClose,
  theme = "dark-gold",
  profile,
  activeArtworkTitle = "Œuvre d'Atelier",
  initialRole = "all",
  onNavigateToView
}: ShareModalProps) {
  const { t, language } = useLanguage();
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const normalizeTarget = (r: ShareRole): "all" | "gallerist" | "visitor" | "collector" => {
    if (r === "galeriste" || r === "gallerist") return "gallerist";
    if (r === "visiteur" || r === "visitor") return "visitor";
    if (r === "collectionneur" || r === "collector") return "collector";
    return "all";
  };

  const [activeTarget, setActiveTarget] = useState<"all" | "gallerist" | "visitor" | "collector">(normalizeTarget(initialRole));

  React.useEffect(() => {
    if (initialRole) {
      setActiveTarget(normalizeTarget(initialRole));
    }
  }, [initialRole, isOpen]);

  const isDark = theme === "dark-gold";

  if (!isOpen) return null;

  // Base URL
  const baseUrl = typeof window !== "undefined" 
    ? `${window.location.origin}${window.location.pathname}`
    : "https://oeil-de-latelier.art";

  // Target-specific deep links
  const links = {
    general: `${baseUrl}?utm_source=share&utm_medium=direct`,
    gallerist: `${baseUrl}?view=galerie&role=gallerist`,
    visitor: `${baseUrl}?view=cartels&mode=visitor`,
    collector: `${baseUrl}?view=cartels&tab=contract_coa`
  };

  const currentLink = activeTarget === "gallerist" 
    ? links.gallerist 
    : activeTarget === "visitor" 
      ? links.visitor 
      : activeTarget === "collector"
        ? links.collector
        : links.general;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  // Web Share API native on mobile
  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "L'Œil de l'Atelier — Le Pont Intelligent Entre Artistes, Galeries & Acheteurs",
          text: `Découvrez L'Œil de l'Atelier : la plateforme d'art contemporain qui fait gagner un temps précieux aux artistes et galeries, avec cartels muraux QR, audioguide immersif, contrats de vente et certificats d'authenticité.`,
          url: currentLink,
        });
      } catch (err) {
        console.warn("Share cancelled or failed:", err);
      }
    } else {
      handleCopy(currentLink, "native");
    }
  };

  // Pre-formatted messages
  const artistName = profile?.name?.trim() ? profile.name : "L'Atelier";
  
  const emailSubject = `Découverte & Passerelle Professionnelle : L'Œil de l'Atelier [${artistName}]`;
  const emailBody = `Bonjour,

Je vous partage le lien vers L'Œil de l'Atelier : une plateforme innovante qui révolutionne les échanges entre artistes, galeries d'art et collectionneurs.

Ce que la plateforme permet :
1. Pour les GALERISTES & CURATEURS : Fiches techniques d'œuvres normalisées, dossiers de présentation clés en main, cotes justifiées et contrats de dépôt-consignation prêts à signer en 2 minutes (gain de 15h d'échanges par exposition).
2. Pour les ARTISTES : Outils d'expertise IA, cartels muraux d'exposition prêts à imprimer avec QR codes et valorisation de démarche.
3. Pour les VISITEURS & ACHETEURS : Audioguide au casque par QR code, livre d'or d'atelier, réservation d'œuvres et contrats d'achat direct avec Certificat d'Authenticité (COA) infalsifiable.

Accéder directement à l'espace :
${currentLink}

Bien cordialement,
${artistName}`;

  const whatsappMessage = encodeURIComponent(
    `🎨 *L'Œil de l'Atelier — Le Pont Intelligent Artistes ⇄ Galeries*\n\n` +
    `Fini les heures perdues en échanges d'e-mails : découvrez les cartels muraux avec QR code, l'audioguide pour les visiteurs, et le générateur de contrats de vente avec Certificats d'Authenticité (COA) en 1 clic.\n\n` +
    `👉 Voir ici : ${currentLink}`
  );

  const linkedinText = encodeURIComponent(
    `Découvrez L'Œil de l'Atelier : le pont intelligent entre artistes plasticiens, galeries d'art contemporain et collectionneurs.\n\n` +
    `Un standard de communication qui fait gagner un temps précieux aux galeristes et met en valeur les visiteurs d'exposition via des cartels muraux à QR code, des audioguides immersifs et des contrats de vente sécurisés avec certificats d'authenticité conformes au Décret Marcus.\n\n${currentLink}`
  );

  const twitterText = encodeURIComponent(
    `Le pont intelligent entre artistes, galeries et collectionneurs : cartels muraux QR, audioguide immersif, contrats d'achat et certificats d'authenticité en 1 clic.\n${currentLink}`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className={`w-full max-w-4xl max-h-[92vh] flex flex-col border shadow-2xl overflow-hidden transition-all ${
        isDark ? "bg-[#0d0d0d] border-[#c9a84c] text-white" : "bg-white border-[#c9a84c] text-stone-900"
      }`}>
        
        {/* Modal Header */}
        <div className={`p-4 sm:p-5 flex items-center justify-between border-b ${
          isDark ? "bg-[#141414] border-[#c9a84c]/30" : "bg-amber-50/70 border-[#c9a84c]/30"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 flex items-center justify-center border ${
              isDark ? "bg-[#c9a84c]/20 border-[#c9a84c] text-[#c9a84c]" : "bg-amber-100 border-[#c9a84c] text-[#9c7d2b]"
            }`}>
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-serif text-lg sm:text-xl font-bold tracking-tight">
                  Partager l'Atelier & Diffuser les Liens
                </h2>
                <span className="text-[9px] font-mono font-black px-2 py-0.5 uppercase bg-[#c9a84c] text-black">
                  Passerelle Tripartite
                </span>
              </div>
              <p className="text-xs opacity-75 mt-0.5">
                Donnez accès à vos œuvres, facilitez le travail des galeristes et séduisez les visiteurs en 1 clic.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 border transition-colors cursor-pointer ${
              isDark 
                ? "bg-black border-white/20 text-neutral-300 hover:text-white hover:border-[#c9a84c]" 
                : "bg-white border-stone-300 text-stone-700 hover:text-black hover:border-black"
            }`}
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">

          {/* MANIFESTE DU GAIN DE TEMPS ARTISTE ⇄ GALERISTE */}
          <div className={`p-4 sm:p-5 border space-y-3 relative overflow-hidden ${
            isDark ? "bg-gradient-to-br from-[#18150e] to-black border-[#c9a84c]/60" : "bg-gradient-to-br from-amber-50 to-stone-50 border-[#c9a84c]"
          }`}>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#c9a84c]" />
                <h3 className="font-serif font-bold text-sm sm:text-base uppercase tracking-wide text-[#c9a84c]">
                  Pourquoi ce lien est capital : Le Gain de Temps Mutuel Artiste ⇄ Galeriste
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold bg-[#c9a84c] text-black px-2 py-0.5">
                ~15 heures économisées par exposition
              </span>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed opacity-90">
              Dans le monde de l'art, les artistes et les galeristes perdent en moyenne <strong>15 à 20 heures</strong> en échanges chaotiques : formats de photos inadaptés, dimensions imprécises, textes de présentation à réécrire, cartels à bricoler manuellement et hésitations sur les cotes.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 bg-black/30 border border-white/10 space-y-1">
                <div className="flex items-center gap-1.5 font-serif font-bold text-[#c9a84c]">
                  <Building2 className="w-3.5 h-3.5" /> Pour le Galeriste
                </div>
                <p className="text-[11px] opacity-80 leading-relaxed">
                  Reçoit des fiches techniques normalisées, des textes d'analyse prêts à diffuser, des cartels muraux et des contrats de dépôt clou à clou pré-remplis. Fini les relances !
                </p>
              </div>

              <div className="p-3 bg-black/30 border border-white/10 space-y-1">
                <div className="flex items-center gap-1.5 font-serif font-bold text-[#c9a84c]">
                  <User className="w-3.5 h-3.5" /> Pour l'Artiste
                </div>
                <p className="text-[11px] opacity-80 leading-relaxed">
                  Valorise sa démarche professionnelle, justifie sa cotation avec rigueur et propose des pièces prêtes à exposer avec une crédibilité institutionnelle immédiate.
                </p>
              </div>

              <div className="p-3 bg-black/30 border border-white/10 space-y-1">
                <div className="flex items-center gap-1.5 font-serif font-bold text-[#c9a84c]">
                  <QrCode className="w-3.5 h-3.5" /> Pour le Visiteur
                </div>
                <p className="text-[11px] opacity-80 leading-relaxed">
                  Scanne le cartel pour écouter l'audioguide, poser une option 48h discrète ou obtenir immédiatement son contrat d'achat et son certificat d'authenticité infalsifiable.
                </p>
              </div>
            </div>
          </div>

          {/* SÉLECTEUR DE DESTINATAIRE / LIEN CIBLÉ */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#c9a84c] flex items-center gap-2">
              <Globe className="w-4 h-4" /> 1. Choisissez le type de lien selon votre destinataire :
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setActiveTarget("all")}
                className={`p-3 border text-left transition-all cursor-pointer ${
                  activeTarget === "all"
                    ? "border-[#c9a84c] bg-[#c9a84c] text-black font-bold shadow-md"
                    : isDark ? "bg-black/40 border-white/10 text-white hover:border-[#c9a84c]/50" : "bg-stone-50 border-stone-200 text-stone-900"
                }`}
              >
                <span className="block text-[10px] font-mono uppercase opacity-70">Lien Universel</span>
                <span className="font-serif font-bold text-xs">Atelier Complet</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTarget("gallerist")}
                className={`p-3 border text-left transition-all cursor-pointer ${
                  activeTarget === "gallerist"
                    ? "border-[#c9a84c] bg-[#c9a84c] text-black font-bold shadow-md"
                    : isDark ? "bg-black/40 border-white/10 text-white hover:border-[#c9a84c]/50" : "bg-stone-50 border-stone-200 text-stone-900"
                }`}
              >
                <span className="block text-[10px] font-mono uppercase opacity-70">Pour Galeriste</span>
                <span className="font-serif font-bold text-xs">Dossier & Contrat</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTarget("visitor")}
                className={`p-3 border text-left transition-all cursor-pointer ${
                  activeTarget === "visitor"
                    ? "border-[#c9a84c] bg-[#c9a84c] text-black font-bold shadow-md"
                    : isDark ? "bg-black/40 border-white/10 text-white hover:border-[#c9a84c]/50" : "bg-stone-50 border-stone-200 text-stone-900"
                }`}
              >
                <span className="block text-[10px] font-mono uppercase opacity-70">Pour Visiteur</span>
                <span className="font-serif font-bold text-xs">Audioguide & Cartel</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTarget("collector")}
                className={`p-3 border text-left transition-all cursor-pointer ${
                  activeTarget === "collector"
                    ? "border-[#c9a84c] bg-[#c9a84c] text-black font-bold shadow-md"
                    : isDark ? "bg-black/40 border-white/10 text-white hover:border-[#c9a84c]/50" : "bg-stone-50 border-stone-200 text-stone-900"
                }`}
              >
                <span className="block text-[10px] font-mono uppercase opacity-70">Pour Acheteur</span>
                <span className="font-serif font-bold text-xs">Contrat Vente & COA</span>
              </button>
            </div>
          </div>

          {/* CHAMP URL & BOUTONS COPIER / NATIVE SHARE */}
          <div className={`p-4 border space-y-3 ${
            isDark ? "bg-black/60 border-white/10" : "bg-stone-50 border-stone-200"
          }`}>
            <label className="block uppercase font-mono text-[10px] tracking-wider opacity-70">
              Lien direct à copier ou partager :
            </label>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                readOnly
                value={currentLink}
                className={`w-full p-2.5 font-mono text-xs border truncate ${
                  isDark ? "bg-neutral-900 border-neutral-700 text-[#c9a84c]" : "bg-white border-stone-300 text-stone-900"
                }`}
              />

              <button
                type="button"
                onClick={() => handleCopy(currentLink, "url")}
                className="py-2.5 px-6 bg-[#c9a84c] hover:bg-[#d8b85c] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 shadow-md"
              >
                {copiedType === "url" ? <Check className="w-4 h-4 text-emerald-900" /> : <Copy className="w-4 h-4" />}
                <span>{copiedType === "url" ? "Lien Copié !" : "Copier le Lien"}</span>
              </button>

              <button
                type="button"
                onClick={handleNativeShare}
                className="py-2.5 px-4 bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
                title="Partager via le menu natif de votre smartphone ou ordinateur"
              >
                <Send className="w-4 h-4 text-[#c9a84c]" />
                <span className="hidden sm:inline">Partager</span>
              </button>
            </div>
          </div>

          {/* PARTAGE 1-CLIC VERS LES APPLICATIONS & RÉSEAUX */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#c9a84c] flex items-center gap-2">
              <Share2 className="w-4 h-4" /> 2. Partage instantané en 1 clic :
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 border flex items-center gap-2.5 bg-emerald-600/10 border-emerald-500/40 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <div>
                  <span className="font-bold block">WhatsApp</span>
                  <span className="text-[10px] opacity-70">Message direct</span>
                </div>
              </a>

              {/* Email pré-rempli */}
              <a
                href={`mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
                className="p-3 border flex items-center gap-2.5 bg-blue-600/10 border-blue-500/40 text-blue-400 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4 shrink-0" />
                <div>
                  <span className="font-bold block">Email Pro</span>
                  <span className="text-[10px] opacity-70">Message complet</span>
                </div>
              </a>

              {/* LinkedIn */}
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentLink)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 border flex items-center gap-2.5 bg-sky-600/10 border-sky-500/40 text-sky-400 hover:bg-sky-600 hover:text-white transition-all cursor-pointer"
              >
                <Linkedin className="w-4 h-4 shrink-0" />
                <div>
                  <span className="font-bold block">LinkedIn</span>
                  <span className="text-[10px] opacity-70">Réseau pro & art</span>
                </div>
              </a>

              {/* X / Twitter */}
              <a
                href={`https://twitter.com/intent/tweet?text=${twitterText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 border flex items-center gap-2.5 bg-neutral-800 border-neutral-600 text-neutral-300 hover:bg-black hover:text-white transition-all cursor-pointer"
              >
                <Twitter className="w-4 h-4 shrink-0" />
                <div>
                  <span className="font-bold block">X / Twitter</span>
                  <span className="text-[10px] opacity-70">Post d'atelier</span>
                </div>
              </a>
            </div>
          </div>

          {/* QR CODE GRAND FORMAT SCANNABLE & IMPRIMABLE */}
          <div className={`p-5 border flex flex-col sm:flex-row items-center gap-6 ${
            isDark ? "bg-[#111111] border-[#c9a84c]/40" : "bg-amber-50/50 border-amber-300"
          }`}>
            <div className="p-3 bg-white border-2 border-[#c9a84c] shadow-lg shrink-0">
              <QRCodeSVG value={currentLink} size={130} level="H" />
            </div>

            <div className="space-y-3 flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <QrCode className="w-5 h-5 text-[#c9a84c]" />
                <h4 className="font-serif font-bold text-sm sm:text-base uppercase tracking-wide">
                  QR Code Direct d'Accès à l'Atelier
                </h4>
              </div>

              <p className="text-xs opacity-80 leading-relaxed">
                Affichez ce QR code à l'entrée de votre exposition, sur votre carte de visite d'artiste ou sur vos vitrines de galerie. Les visiteurs et galeristes accèdent instantanément à l'expérience sur leur smartphone sans aucune application à installer.
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const printWindow = window.open('', '_blank');
                    if (printWindow) {
                      printWindow.document.write(`
                        <html>
                          <head>
                            <title>QR Code Atelier - ${artistName}</title>
                            <style>
                              body { font-family: sans-serif; text-align: center; padding: 40px; }
                              h1 { font-family: serif; color: #111; margin-bottom: 8px; }
                              p { color: #555; font-size: 14px; max-width: 400px; margin: 0 auto 24px; }
                              .qr { margin: 20px auto; }
                            </style>
                          </head>
                          <body>
                            <h1>L'ŒIL DE L'ATELIER</h1>
                            <p>Scannez pour découvrir l'atelier, l'audioguide immersif, les cartels et les œuvres disponibles</p>
                            <div class="qr">${document.querySelector('.p-3.bg-white')?.innerHTML || ''}</div>
                            <p style="font-size: 11px; color: #888;">${currentLink}</p>
                            <script>window.print();</script>
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                    }
                  }}
                  className="py-1.5 px-3 border border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Imprimer la Fiche QR
                </button>

                <button
                  type="button"
                  onClick={() => handleCopy(emailBody, "email_text")}
                  className="py-1.5 px-3 bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-[#c9a84c]" />
                  <span>{copiedType === "email_text" ? "Texte Email Copié !" : "Copier le texte d'invitation"}</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className={`p-4 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${
          isDark ? "bg-[#141414] border-white/10" : "bg-stone-100 border-stone-200"
        }`}>
          <div className="flex items-center gap-2 opacity-70">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Tous les liens sont universels, sécurisés et consultables sur mobile, tablette et ordinateur.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="py-2 px-5 bg-[#c9a84c] hover:bg-[#d8b85c] text-black font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Terminer
          </button>
        </div>

      </div>
    </div>
  );
}
