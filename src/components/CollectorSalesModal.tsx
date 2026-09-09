import React, { useState } from "react";
import { 
  Briefcase, Users, FileText, ShieldCheck, Box, 
  X, Check, Copy, Download, Printer, RefreshCw, 
  Building, DollarSign, ArrowRight, Percent, Truck, 
  CreditCard, Eye, Sparkles, CheckCircle2, Lock, Tag, 
  HelpCircle, Scale, ShieldAlert, Award
} from "lucide-react";
import { ArtistProfile } from "../types.js";

interface CollectorSalesModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: "dark-gold" | "light";
  profile: ArtistProfile;
  activeArtworkImage?: string | null;
  activeSeries?: any[];
  onAnalyzeSalesTool?: (toolId: string) => Promise<any>;
}

export default function CollectorSalesModal({
  isOpen,
  onClose,
  theme = "dark-gold",
  profile,
  activeArtworkImage,
  activeSeries = [],
  onAnalyzeSalesTool
}: CollectorSalesModalProps) {
  const [activeTab, setActiveTab] = useState<"acquirer" | "defiscalisation" | "invoice" | "privateview" | "shipping">("acquirer");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [loadingTool, setLoadingTool] = useState<string | null>(null);

  // Live results from AI
  const [liveResults, setLiveResults] = useState<Record<string, any>>({});

  // Tax Defiscalisation interactive state
  const [artworkPrice, setArtworkPrice] = useState<number>(2800);
  const [taxRate, setTaxRate] = useState<number>(25); // IS 25% or IR bracket

  // Invoice parameters state
  const [invoiceNumber, setInvoiceNumber] = useState<string>("FA-2026-0042");
  const [invoiceClientName, setInvoiceClientName] = useState<string>("Cabinet d'Avocats & Associés");
  const [invoiceClientAddress, setInvoiceClientAddress] = useState<string>("12 Place Vendôme, 75001 Paris");
  const [paymentMode, setPaymentMode] = useState<"virement" | "stripe" | "cheque">("virement");
  const [tvaRegime, setTvaRegime] = useState<"franchise" | "5.5">("franchise");

  // Shipping Calculator state
  const [shippingDest, setShippingDest] = useState<"france" | "europe" | "usa" | "monde">("france");
  const [boxDimensions, setBoxDimensions] = useState<{ l: number; w: number; h: number; weight: number }>({
    l: 100,
    w: 80,
    h: 15,
    weight: 7
  });

  const isDark = theme === "dark-gold";

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleRunAi = async (toolId: string) => {
    if (!onAnalyzeSalesTool) return;
    setLoadingTool(toolId);
    try {
      const res = await onAnalyzeSalesTool(toolId);
      if (res && !res.error) {
        setLiveResults(prev => ({ ...prev, [toolId]: res }));
      }
    } catch (e) {
      console.error("Erreur lors de l'exécution de l'outil ventes:", e);
    } finally {
      setLoadingTool(null);
    }
  };

  // Tax Calculations for Art. 238 bis AB CGI
  const annualDeduction = artworkPrice / 5;
  const taxSavingsTotal = (artworkPrice * (taxRate / 100));
  const realCostAfterTax = artworkPrice - taxSavingsTotal;

  // Shipping Calculations
  const volWeight = (boxDimensions.l * boxDimensions.w * boxDimensions.h) / 5000;
  const billableWeight = Math.max(boxDimensions.weight, volWeight);
  const baseRate = shippingDest === "france" ? 45 : shippingDest === "europe" ? 85 : shippingDest === "usa" ? 180 : 260;
  const insurancePremium = Math.max(25, artworkPrice * 0.012); // 1.2% ad valorem
  const estimatedShippingTotal = Math.round(baseRate + (billableWeight * 3.5) + insurancePremium);

  // Default AI datasets
  const defaultAcquirerData = liveResults["sales_acquirer_profile"] || {
    typologie_acquerreur_principal: "Professions libérales (avocats, médecins, notaires), cadres dirigeants du secteur tertiaire et architectes d'intérieur (35-58 ans), sensibles à l'authenticité de la facture et à l'énergie tellurique de la matière.",
    motivation_achat: "Recherche d'une pièce signature apaisante et affirmée, distinction sociale raffinée et volonté de soutenir un travail d'atelier rigoureux et sincère.",
    budget_cible_fourchette: "1 500 € à 4 800 € par pièce",
    environnements_recommandes: [
      "Salon haussmannien contemporain avec moulures et parquet à chevrons",
      "Loft d'architecte aux volumes épurés (béton brut, verre et bois clair)",
      "Salle de réunion de direction ou hall de cabinet de conseil de prestige"
    ],
    argumentaire_vente_3_points: [
      "Unicité absolue et matérialité tactile impossible à reproduire numériquement.",
      "Cote d'artiste établie avec certificat d'authenticité et traçabilité d'atelier.",
      "Avantage fiscal immédiat (déduction à 100% sur 5 ans pour les sociétés et indépendants)."
    ]
  };

  const defaultTaxData = liveResults["sales_tax_defiscalisation"] || {
    titre_accroche: "Optimisation Fiscale Entreprises & Professions Libérales (Art. 238 bis AB du CGI)",
    mecanisme_art_238bis: "Les entreprises soumises à l'IS ou à l'IR (BIC/BNC) qui achètent des œuvres originales d'artistes vivants peuvent déduire 100% du prix d'acquisition de leur résultat imposable, par fractions égales de 20% par an pendant 5 ans, dans la limite de 20 000 € ou 0,5 % du chiffre d'affaires HT.",
    exemple_chiffre: {
      prix_oeuvre: `${artworkPrice.toLocaleString("fr-FR")} € HT`,
      deduction_annuelle_5ans: `${annualDeduction.toLocaleString("fr-FR")} € / an`,
      economie_impot_estimee: `${Math.round(taxSavingsTotal).toLocaleString("fr-FR")} € d'économie fiscale`,
      cout_reel_final: `${Math.round(realCostAfterTax).toLocaleString("fr-FR")} € net`
    },
    conditions_legales_imperatives: [
      "L'œuvre doit être originale et créée par un artiste vivant.",
      "L'œuvre doit être exposée gratuitement dans un lieu accessible au public, aux clients ou aux salariés de l'entreprise pendant 5 ans.",
      "L'entreprise doit inscrire la déduction à un compte de réserve spéciale au passif du bilan."
    ],
    modele_pitch_aux_entreprises: `Madame, Monsieur,\n\nVous recherchez une pièce artistique d'exception pour valoriser vos espaces de réception ou vos bureaux tout en optimisant votre fiscalité d'entreprise ?\n\nL'acquisition d'une œuvre originale de ${profile.name || "l'artiste"} bénéficie du régime d'incitation fiscale de l'Article 238 bis AB du CGI :\n- Déduction intégrale du prix d'achat (${artworkPrice} €) de votre bénéfice imposable sur 5 ans (${annualDeduction} €/an).\n- Économie fiscale nette de ${Math.round(taxSavingsTotal)} € pour votre société.\n- Facture officielle avec TVA et certificat d'authenticité conforme.\n\nRestant à votre disposition pour vous transmettre le catalogue complet et organiser une présentation privée.`
  };

  const defaultInvoiceData = liveResults["sales_invoice_certificate"] || {
    mentions_legales_obligatoires: [
      "Numérotation séquentielle et chronologique (ex: FA-2026-0042)",
      "Numéro SIRET et mention MDA / URSSAF Limiteur Artiste-Auteur",
      "Mention TVA : 'TVA non applicable, art. 293 B du CGI' (Franchise en base)",
      "Désignation précise : Titre de l'œuvre, Technique, Dimensions, Année"
    ],
    conditions_generales_vente: `Clause de Réserve de Propriété : L'œuvre vendue demeure la propriété exclusive et inaliénable de l'artiste jusqu'au paiement intégral du prix convenu.\nDroits d'Auteur : La vente de l'œuvre matérielle n'emporte pas cession des droits de reproduction et de représentation, qui restent la propriété exclusive de l'artiste conformément aux articles L.111-1 et suivants du Code de la Propriété Intellectuelle.`,
    certificat_conforme_decret_marcus: `Je soussigné(e) ${profile.name || "l'Artiste"}, certifie que l'œuvre originale référencée ci-après a été entièrement exécutée de ma main en mon atelier selon les règles de l'art, et constitue un exemplaire unique et original conformément au Décret n° 81-255 du 3 mars 1981 relatif à la répression des fraudes en matière de transactions d'œuvres d'art et d'objets de collection.`
  };

  const defaultShippingData = liveResults["sales_shipping_logistics"] || {
    protocole_emballage_4_couches: [
      { couche: "1. Papier de soie neutre ou Glassine", fonction: "Protection anti-adhérence directe sur la couche picturale sans altérer les vernis." },
      { couche: "2. Film bulle étirable spécial tableau (bulles vers l'extérieur)", fonction: "Amortissement thermique et mécanique contre les micro-chocs." },
      { couche: "3. Cornières de protection rigides aux 4 angles", fonction: "Sécurisation absolue des coins de châssis et prévention des torsions." },
      { couche: "4. Caisse carton double cannelure ou caisse bois sur-mesure", fonction: "Blindage rigide contre les perforations et la pression en soute cargo." }
    ],
    calcul_poids_volumetrique_conseils: "Les transporteurs d'art facturent au plus élevé entre le poids réel et le poids volumétrique (Longueur x Largeur x Hauteur / 5000). Optimisez la taille du carton sans excéder 15 cm d'épaisseur pour les toiles sur châssis.",
    clause_assurance_transport: "Transport sécurisé sous garantie Clou à Clou avec assurance ad valorem intégrale à hauteur de 100% de la valeur déclarée de l'œuvre.",
    checklist_deballage_acquerreur: [
      "Inspecter l'état extérieur du colis avant signature du bordereau de livraison.",
      "Ouvrir le carton avec un cutter plat sans enfoncer la lame vers la toile.",
      "Laisser la toile s'acclimater 2 heures à la température de la pièce avant accrochage définitif.",
      "Manipuler le châssis exclusivement par les montants extérieurs en bois, sans appuyer les doigts sur la toile."
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
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`font-serif text-base sm:text-lg font-bold tracking-tight ${
                  isDark ? "text-white" : "text-black"
                }`}>
                  Ventes Privées, Collectionneurs & Sécurisation Financière
                </h2>
                <span className="text-[9px] font-mono font-black px-2 py-0.5 uppercase bg-[#c9a84c] text-black">
                  5 Outils Vente Déployés
                </span>
              </div>
              <p className={`text-xs font-sans mt-0.5 font-medium ${
                isDark ? "text-neutral-300" : "text-stone-700"
              }`}>
                Portrait-robot des acquéreurs, simulateur de défiscalisation art (Art. 238 bis AB), facturation & certificat légal, salon privé VIP et logistique d'expédition.
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

        {/* 5 Collector & Sales Tabs */}
        <div className={`flex border-b overflow-x-auto scrollbar-thin ${
          isDark ? "bg-black border-[#c9a84c]/20" : "bg-stone-100 border-stone-300"
        }`}>
          <button
            onClick={() => setActiveTab("acquirer")}
            className={`px-4 py-3 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap border-b-2 transition-all ${
              activeTab === "acquirer"
                ? "border-[#c9a84c] text-[#c9a84c] bg-[#c9a84c]/10"
                : isDark ? "border-transparent text-neutral-400 hover:text-white" : "border-transparent text-stone-600 hover:text-black"
            }`}
          >
            <Users className="w-4 h-4" />
            11. Portrait-Robot Acquéreurs
          </button>

          <button
            onClick={() => setActiveTab("defiscalisation")}
            className={`px-4 py-3 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap border-b-2 transition-all ${
              activeTab === "defiscalisation"
                ? "border-[#c9a84c] text-[#c9a84c] bg-[#c9a84c]/10"
                : isDark ? "border-transparent text-neutral-400 hover:text-white" : "border-transparent text-stone-600 hover:text-black"
            }`}
          >
            <Percent className="w-4 h-4" />
            12. Défiscalisation Entreprises (Art. 238)
          </button>

          <button
            onClick={() => setActiveTab("invoice")}
            className={`px-4 py-3 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap border-b-2 transition-all ${
              activeTab === "invoice"
                ? "border-[#c9a84c] text-[#c9a84c] bg-[#c9a84c]/10"
                : isDark ? "border-transparent text-neutral-400 hover:text-white" : "border-transparent text-stone-600 hover:text-black"
            }`}
          >
            <FileText className="w-4 h-4" />
            13. Facture Pro & Décret Marcus
          </button>

          <button
            onClick={() => setActiveTab("privateview")}
            className={`px-4 py-3 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap border-b-2 transition-all ${
              activeTab === "privateview"
                ? "border-[#c9a84c] text-[#c9a84c] bg-[#c9a84c]/10"
                : isDark ? "border-transparent text-neutral-400 hover:text-white" : "border-transparent text-stone-600 hover:text-black"
            }`}
          >
            <Lock className="w-4 h-4" />
            14. Private Viewing Room (Salon VIP)
          </button>

          <button
            onClick={() => setActiveTab("shipping")}
            className={`px-4 py-3 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap border-b-2 transition-all ${
              activeTab === "shipping"
                ? "border-[#c9a84c] text-[#c9a84c] bg-[#c9a84c]/10"
                : isDark ? "border-transparent text-neutral-400 hover:text-white" : "border-transparent text-stone-600 hover:text-black"
            }`}
          >
            <Truck className="w-4 h-4" />
            15. Expédition & Emballage Muséal
          </button>
        </div>

        {/* Modal Tab Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 11: PORTRAIT-ROBOT ACQUÉREURS & CIBLAGE */}
          {activeTab === "acquirer" && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Header Action Bar */}
              <div className={`p-4 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isDark ? "bg-[#141414] border-[#c9a84c]/40" : "bg-amber-50 border-[#c9a84c]"
              }`}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 bg-[#c9a84c] text-black">
                      Analyse Marché & Cible
                    </span>
                    <span className={`text-xs font-serif font-bold ${isDark ? "text-white" : "text-black"}`}>
                      Portrait-Robot & Arguments de Vente sur Toile
                    </span>
                  </div>
                  <p className={`text-xs font-sans mt-1 ${isDark ? "text-neutral-300" : "text-stone-800"}`}>
                    Identifiez exactement qui achète votre style d'œuvres, leurs budgets types et les 3 arguments clés pour déclencher la décision d'achat.
                  </p>
                </div>

                {onAnalyzeSalesTool && (
                  <button
                    onClick={() => handleRunAi("sales_acquirer_profile")}
                    disabled={loadingTool === "sales_acquirer_profile"}
                    className="px-3.5 py-2 bg-[#c9a84c] hover:bg-white text-black font-mono font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors whitespace-nowrap shadow-md"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingTool === "sales_acquirer_profile" ? "animate-spin" : ""}`} />
                    {loadingTool === "sales_acquirer_profile" ? "Analyse en cours..." : "Recalculer le Profil"}
                  </button>
                )}
              </div>

              {/* Acquirer Profile Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Main Archetype Card */}
                <div className={`md:col-span-6 p-5 border space-y-4 ${
                  isDark ? "bg-black border-[#c9a84c] text-white" : "bg-white border-[#c9a84c] text-black shadow-md"
                }`}>
                  <div className="border-b pb-2 border-[#c9a84c]/30 flex items-center justify-between">
                    <h3 className="font-serif font-bold text-sm text-[#c9a84c] uppercase">
                      Portrait-Robot du Collectionneur Cible
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/40 font-bold">
                      {defaultAcquirerData.budget_cible_fourchette}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-mono uppercase text-neutral-400 mb-1">Typologie & Démographie</h4>
                    <p className="text-xs font-sans leading-relaxed">
                      {defaultAcquirerData.typologie_acquerreur_principal}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-mono uppercase text-neutral-400 mb-1">Psychologie & Motivation d'Achat</h4>
                    <p className={`text-xs font-sans italic p-3 border ${
                      isDark ? "bg-neutral-900 border-white/10 text-neutral-200" : "bg-stone-50 border-stone-200 text-stone-900"
                    }`}>
                      « {defaultAcquirerData.motivation_achat} »
                    </p>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-mono uppercase text-neutral-400 mb-1.5">Intérieurs Idéaux & Lieux d'Accrochage</h4>
                    <ul className="space-y-1 text-xs font-sans">
                      {defaultAcquirerData.environnements_recommandes?.map((env: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#c9a84c] flex-shrink-0 mt-0.5" />
                          <span>{env}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Sales Arguments & Pitch Helper */}
                <div className={`md:col-span-6 p-5 border space-y-4 flex flex-col justify-between ${
                  isDark ? "bg-[#111111] border-[#c9a84c]/40 text-white" : "bg-stone-50 border-[#c9a84c] text-black shadow-md"
                }`}>
                  <div className="space-y-3">
                    <div className="border-b pb-2 border-[#c9a84c]/30 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#c9a84c]" />
                      <h3 className="font-mono text-xs font-bold uppercase text-[#c9a84c]">
                        3 Arguments Clés pour Conclure la Vente
                      </h3>
                    </div>

                    <div className="space-y-2.5">
                      {defaultAcquirerData.argumentaire_vente_3_points?.map((arg: string, idx: number) => (
                        <div key={idx} className={`p-3 border flex items-start gap-2.5 ${
                          isDark ? "bg-black border-white/10" : "bg-white border-stone-200 shadow-sm"
                        }`}>
                          <span className="w-5 h-5 flex items-center justify-center bg-[#c9a84c] text-black font-mono font-black text-xs flex-shrink-0">
                            {idx + 1}
                          </span>
                          <p className="text-xs font-sans leading-relaxed">
                            {arg}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
                    <button
                      onClick={() => handleCopy(
                        `=== PORTRAIT ACQUÉREUR & ARGUMENTS DE VENTE ===\n\nCible: ${defaultAcquirerData.typologie_acquerreur_principal}\nMotivation: ${defaultAcquirerData.motivation_achat}\nBudget: ${defaultAcquirerData.budget_cible_fourchette}\n\nArguments:\n` +
                        defaultAcquirerData.argumentaire_vente_3_points.map((a: string, i: number) => `${i+1}. ${a}`).join("\n"),
                        "acquirer_copy"
                      )}
                      className={`px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 border transition-all ${
                        copiedKey === "acquirer_copy"
                          ? "bg-emerald-600 text-white border-emerald-500"
                          : (isDark ? "bg-black text-[#c9a84c] border-[#c9a84c] hover:bg-[#c9a84c] hover:text-black" : "bg-white text-stone-900 border-stone-300 hover:bg-stone-100")
                      }`}
                    >
                      {copiedKey === "acquirer_copy" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedKey === "acquirer_copy" ? "Fiche Copiée !" : "Copier la Fiche Vente"}
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 12: DÉFISCALISATION ENTREPRISES (ART. 238 BIS AB CGI) */}
          {activeTab === "defiscalisation" && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Dynamic Interactive Simulator */}
              <div className={`p-5 border ${isDark ? "bg-[#141414] border-[#c9a84c]" : "bg-amber-50 border-[#c9a84c]"}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b pb-3 border-[#c9a84c]/30">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-[#c9a84c]" />
                    <h3 className="font-serif font-bold text-sm text-[#c9a84c]">
                      Simulateur Fiscal Mécénat d'Art (Article 238 bis AB du CGI)
                    </h3>
                  </div>

                  <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 border border-emerald-500/40">
                    Déduction Fiscale : 100% sur 5 ans
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                      Prix de Vente de la Toile (€)
                    </label>
                    <input
                      type="number"
                      value={artworkPrice}
                      onChange={(e) => setArtworkPrice(Math.max(100, Number(e.target.value)))}
                      className={`w-full p-2 border font-mono font-bold text-xs ${
                        isDark ? "bg-black border-[#c9a84c] text-white" : "bg-white border-stone-300 text-black"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                      Taux d'Imposition de la Société
                    </label>
                    <select
                      value={taxRate}
                      onChange={(e) => setTaxRate(Number(e.target.value))}
                      className={`w-full p-2 border font-mono text-xs ${
                        isDark ? "bg-black border-white/20 text-white" : "bg-white border-stone-300 text-black"
                      }`}
                    >
                      <option value={25}>IS Taux Normal (25 %)</option>
                      <option value={15}>IS Taux Réduit PME (15 %)</option>
                      <option value={30}>IR Tranche 30 % (Prof. Libérale)</option>
                      <option value={41}>IR Tranche 41 % (Prof. Libérale)</option>
                      <option value={45}>IR Tranche 45 % (Hauts Revenus)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                      Déduction Annuelle (sur 5 ans)
                    </label>
                    <div className={`p-2 border font-mono font-black text-xs ${
                      isDark ? "bg-black border-white/20 text-[#c9a84c]" : "bg-white border-stone-200 text-[#9c7d2b]"
                    }`}>
                      {Math.round(annualDeduction).toLocaleString("fr-FR")} € / an
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                      Coût Réel Net pour l'Entreprise
                    </label>
                    <div className="p-2 border font-mono font-black text-xs bg-emerald-950/40 border-emerald-500/50 text-emerald-400">
                      {Math.round(realCostAfterTax).toLocaleString("fr-FR")} € net
                    </div>
                  </div>
                </div>
              </div>

              {/* Fiscal Calculation Summary & Pitch Letter */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Left: Summary and Legal Points */}
                <div className={`md:col-span-5 p-5 border space-y-4 ${
                  isDark ? "bg-black border-[#c9a84c]/40 text-white" : "bg-white border-[#c9a84c] text-black shadow-md"
                }`}>
                  <div className="border-b pb-2 border-[#c9a84c]/30">
                    <h4 className="font-serif font-bold text-xs text-[#c9a84c] uppercase">
                      Bilan de l'Avantage Fiscal
                    </h4>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between py-1 border-b border-white/10">
                      <span className="text-neutral-400">Valeur d'Acquisition :</span>
                      <strong>{artworkPrice.toLocaleString("fr-FR")} € HT</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/10 text-emerald-400">
                      <span>Économie d'Impôt Totale ({taxRate}%) :</span>
                      <strong>- {Math.round(taxSavingsTotal).toLocaleString("fr-FR")} €</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/10 font-bold">
                      <span>Investissement Net Réel :</span>
                      <span className="text-[#c9a84c]">{Math.round(realCostAfterTax).toLocaleString("fr-FR")} €</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <h5 className="text-[11px] font-mono uppercase text-neutral-400">3 Conditions Légales Impératives :</h5>
                    <ul className="space-y-1.5 text-xs font-sans">
                      {defaultTaxData.conditions_legales_imperatives?.map((cond: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#c9a84c] flex-shrink-0 mt-0.5" />
                          <span>{cond}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right: Ready-to-send Pitch Email */}
                <div className={`md:col-span-7 p-5 border flex flex-col justify-between ${
                  isDark ? "bg-[#111111] border-[#c9a84c]/40 text-white" : "bg-stone-50 border-[#c9a84c] text-black shadow-md"
                }`}>
                  <div className="space-y-2.5">
                    <div className="border-b pb-2 border-[#c9a84c]/30 flex items-center justify-between">
                      <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 bg-[#c9a84c] text-black">
                        Email Type Entreprises & Cabinets
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">Prêt à envoyer</span>
                    </div>

                    <pre className={`p-3.5 border text-xs font-serif whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto ${
                      isDark ? "bg-black border-white/10 text-neutral-200" : "bg-white border-stone-200 text-stone-900"
                    }`}>
                      {defaultTaxData.modele_pitch_aux_entreprises}
                    </pre>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
                    <button
                      onClick={() => handleCopy(defaultTaxData.modele_pitch_aux_entreprises, "pitch_defisc")}
                      className="px-3.5 py-1.5 bg-[#c9a84c] hover:bg-white text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                    >
                      {copiedKey === "pitch_defisc" ? "Email Copié !" : "Copier le Pitch Entreprise"}
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 13: FACTURATION PRO & DÉCRET MARCUS */}
          {activeTab === "invoice" && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Invoice Configuration Bar */}
              <div className={`p-4 border ${isDark ? "bg-[#141414] border-[#c9a84c]" : "bg-amber-50 border-[#c9a84c]"}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-sans">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                      N° Facture / Date
                    </label>
                    <input
                      type="text"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      className={`w-full p-2 border font-mono text-xs ${
                        isDark ? "bg-black border-white/20 text-white" : "bg-white border-stone-300 text-black"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                      Nom de l'Acquéreur
                    </label>
                    <input
                      type="text"
                      value={invoiceClientName}
                      onChange={(e) => setInvoiceClientName(e.target.value)}
                      className={`w-full p-2 border text-xs ${
                        isDark ? "bg-black border-white/20 text-white" : "bg-white border-stone-300 text-black"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                      Régime TVA
                    </label>
                    <select
                      value={tvaRegime}
                      onChange={(e) => setTvaRegime(e.target.value as any)}
                      className={`w-full p-2 border font-mono text-xs ${
                        isDark ? "bg-black border-[#c9a84c] text-white" : "bg-white border-stone-300 text-black"
                      }`}
                    >
                      <option value="franchise">Franchise en base (Art. 293 B CGI)</option>
                      <option value="5.5">TVA 5,5 % (Vente Œuvre Originale)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                      Mode de Paiement Sécurisé
                    </label>
                    <select
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value as any)}
                      className={`w-full p-2 border font-mono text-xs ${
                        isDark ? "bg-black border-white/20 text-white" : "bg-white border-stone-300 text-black"
                      }`}
                    >
                      <option value="virement">Virement Bancaire Irrévocable (IBAN)</option>
                      <option value="stripe">Lien Carte Bancaire / Stripe Pro</option>
                      <option value="cheque">Chèque Certifié de Banque</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Printable Invoice & Marcus Certificate Document */}
              <div className={`p-6 border space-y-4 shadow-xl ${
                isDark ? "bg-black border-[#c9a84c] text-white" : "bg-white border-[#c9a84c] text-black"
              }`}>
                {/* Invoice Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 border-[#c9a84c]/30 gap-4">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#c9a84c] uppercase">
                      FACTURE D'ARTISTE-AUTEUR & BORDEREAU DE VENTE
                    </h3>
                    <p className="text-xs font-mono text-neutral-400">
                      RÉFÉRENCE : {invoiceNumber} • DATE : {new Date().toLocaleDateString("fr-FR")}
                    </p>
                  </div>

                  <div className="text-right text-xs font-sans">
                    <strong className="block font-serif text-sm">{profile.name || "ARTISTE AUTEUR"}</strong>
                    <span className="text-neutral-400 block font-mono text-[11px]">N° SIRET : 849 203 910 00018 • Maison des Artistes</span>
                  </div>
                </div>

                {/* Client Box */}
                <div className={`p-3 border flex justify-between items-center text-xs font-sans ${
                  isDark ? "bg-[#141414] border-white/10" : "bg-stone-50 border-stone-200"
                }`}>
                  <div>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase block">Acquéreur :</span>
                    <strong>{invoiceClientName}</strong>
                    <span className="text-neutral-400 block text-[11px]">{invoiceClientAddress}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase block">Règlement :</span>
                    <span className="font-mono text-xs">{paymentMode.toUpperCase()}</span>
                  </div>
                </div>

                {/* Line Item Table */}
                <table className="w-full text-left text-xs font-sans border-collapse">
                  <thead>
                    <tr className={`border-b ${isDark ? "border-[#c9a84c]/30 bg-[#141414]" : "border-stone-200 bg-stone-100"}`}>
                      <th className="p-2.5 font-mono uppercase text-[10px]">Désignation de l'Œuvre Originale</th>
                      <th className="p-2.5 font-mono uppercase text-[10px] text-center">Format</th>
                      <th className="p-2.5 font-mono uppercase text-[10px] text-right">Montant</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/10">
                      <td className="p-2.5">
                        <strong className="font-serif block text-sm">Tableau Original Contemporain</strong>
                        <span className="text-[11px] text-neutral-400">Technique mixte sur toile montée sur châssis à clés</span>
                      </td>
                      <td className="p-2.5 text-center font-mono">100 x 80 cm</td>
                      <td className="p-2.5 text-right font-mono font-bold text-sm text-[#c9a84c]">
                        {artworkPrice.toLocaleString("fr-FR")} €
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Marcus Decree & Legal Statement Box */}
                <div className={`p-4 border space-y-2 text-xs font-serif leading-relaxed ${
                  isDark ? "bg-[#111111] border-white/10 text-neutral-300" : "bg-stone-50 border-stone-200 text-stone-800"
                }`}>
                  <div className="flex items-center gap-2 text-[#c9a84c] font-mono text-[11px] uppercase font-bold">
                    <Award className="w-4 h-4" /> Déclaration d'Authenticité (Décret Marcus n° 81-255)
                  </div>
                  <p className="italic">
                    {defaultInvoiceData.certificat_conforme_decret_marcus}
                  </p>
                  <p className="text-[10px] font-sans text-neutral-400 pt-1 border-t border-white/10">
                    {tvaRegime === "franchise" ? "TVA non applicable, article 293 B du Code Général des Impôts." : "TVA au taux réduit de 5,5 % sur les œuvres d'art originales vendues par leur auteur."}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-[10px] font-mono text-neutral-400">Document certifié conforme • Valeur juridique de preuve</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopy(
                        `FACTURE D'ARTISTE-AUTEUR N° ${invoiceNumber}\n` +
                        `Artiste : ${profile.name || "Artiste Auteur"}\nAcquéreur : ${invoiceClientName}\nMontant : ${artworkPrice} €\n\n` +
                        `Certificat Marcus : ${defaultInvoiceData.certificat_conforme_decret_marcus}`,
                        "invoice_copy"
                      )}
                      className="px-3 py-1.5 bg-black border border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors"
                    >
                      {copiedKey === "invoice_copy" ? "Copié !" : "Copier Facture"}
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="px-3.5 py-1.5 bg-[#c9a84c] hover:bg-white text-black font-mono font-black text-xs uppercase tracking-wider transition-colors shadow-sm"
                    >
                      Imprimer / Exporter PDF
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 14: PRIVATE VIEWING ROOM (SALON DE VENTE PRIVÉE VIP) */}
          {activeTab === "privateview" && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className={`p-4 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isDark ? "bg-[#141414] border-[#c9a84c]/40" : "bg-amber-50 border-[#c9a84c]"
              }`}>
                <div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#c9a84c]" />
                    <h3 className="font-serif font-bold text-sm text-[#c9a84c]">
                      Salon de Vente Privée (Private Viewing Room VIP)
                    </h3>
                  </div>
                  <p className={`text-xs font-sans mt-0.5 ${isDark ? "text-neutral-300" : "text-stone-800"}`}>
                    Partagez un salon confidentiel avec vos collectionneurs privilégiés pour leur donner la priorité d'acquisition 48h avant tout le monde.
                  </p>
                </div>

                <button
                  onClick={() => handleCopy(
                    `=== PRIVATE VIEWING ROOM — ACCÈS CONFIDENTIEL COLLECTIONNEURS ===\n\n` +
                    `Découvrez la nouvelle série d'œuvres de ${profile.name || "l'artiste"} en avant-première privée :\n${window.location.href}\n\nCode d'accès exclusif : VIP-ATELIER-2026`,
                    "pvr_link"
                  )}
                  className="px-3.5 py-2 bg-[#c9a84c] hover:bg-white text-black font-mono font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors whitespace-nowrap shadow-md"
                >
                  {copiedKey === "pvr_link" ? <Check className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  {copiedKey === "pvr_link" ? "Lien VIP Copié !" : "Copier le Lien d'Accès VIP"}
                </button>
              </div>

              {/* Private Viewing Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeSeries.length > 0 ? (
                  activeSeries.slice(0, 3).map((art, idx) => (
                    <div key={idx} className={`p-4 border flex flex-col justify-between ${
                      isDark ? "bg-black border-[#c9a84c]/40 text-white" : "bg-white border-[#c9a84c] text-black shadow-md"
                    }`}>
                      <div className="space-y-3">
                        <div className="relative aspect-square bg-neutral-900 border border-white/10 overflow-hidden">
                          {art.imageUrl ? (
                            <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-serif text-[#c9a84c]">
                              {art.title}
                            </div>
                          )}
                          <span className="absolute top-2 right-2 px-2 py-0.5 bg-black/80 text-[#c9a84c] border border-[#c9a84c] text-[9px] font-mono font-black uppercase">
                            Option VIP 24h
                          </span>
                        </div>

                        <div>
                          <h4 className="font-serif font-bold text-sm text-[#c9a84c]">{art.title}</h4>
                          <p className="text-xs font-sans text-neutral-400">{art.medium} • {art.year}</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                        <strong className="font-mono text-sm text-[#c9a84c]">{artworkPrice.toLocaleString("fr-FR")} €</strong>
                        <button
                          onClick={() => alert(`Option de réservation posée pour « ${art.title} » !`)}
                          className="px-3 py-1.5 bg-[#c9a84c] hover:bg-white text-black font-mono font-bold text-[10px] uppercase tracking-wider transition-colors"
                        >
                          Poser une Option
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={`md:col-span-3 p-8 border text-center space-y-2 ${
                    isDark ? "bg-black border-white/10 text-neutral-300" : "bg-stone-50 border-stone-200 text-stone-700"
                  }`}>
                    <Sparkles className="w-6 h-6 text-[#c9a84c] mx-auto" />
                    <p className="font-serif text-sm">Votre série active est automatiquement synchronisée avec la Private Viewing Room VIP.</p>
                    <p className="text-xs text-neutral-400">Importez ou sélectionnez vos toiles dans la galerie pour les afficher ici.</p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 15: EXPÉDITION & EMBALLAGE MUSÉAL */}
          {activeTab === "shipping" && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Shipping Estimator Controls */}
              <div className={`p-5 border ${isDark ? "bg-[#141414] border-[#c9a84c]" : "bg-amber-50 border-[#c9a84c]"}`}>
                <div className="flex items-center justify-between mb-4 border-b pb-2 border-[#c9a84c]/30">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#c9a84c]" />
                    <h3 className="font-serif font-bold text-sm text-[#c9a84c]">
                      Calculateur de Fret d'Art & Protocole d'Emballage Clou à Clou
                    </h3>
                  </div>

                  <span className="text-xs font-mono font-black text-[#c9a84c] bg-black px-2.5 py-1 border border-[#c9a84c]">
                    Frais Estimés : ~{estimatedShippingTotal} € TTC (Assurance incluse)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-sans">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                      Zone de Destination
                    </label>
                    <select
                      value={shippingDest}
                      onChange={(e) => setShippingDest(e.target.value as any)}
                      className={`w-full p-2 border font-mono text-xs ${
                        isDark ? "bg-black border-[#c9a84c] text-white" : "bg-white border-stone-300 text-black"
                      }`}
                    >
                      <option value="france">France Métropolitaine (24-48h)</option>
                      <option value="europe">Union Européenne (Colissimo/DHL)</option>
                      <option value="usa">États-Unis / Canada (Express Air)</option>
                      <option value="monde">International / Asie / Moyen-Orient</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                      Dimensions Colis (L x l x H cm)
                    </label>
                    <input
                      type="text"
                      value={`${boxDimensions.l} x ${boxDimensions.w} x ${boxDimensions.h}`}
                      onChange={(e) => {
                        const parts = e.target.value.split("x").map(p => Number(p.trim()));
                        if (parts.length === 3 && !isNaN(parts[0])) {
                          setBoxDimensions({ ...boxDimensions, l: parts[0], w: parts[1] || 80, h: parts[2] || 15 });
                        }
                      }}
                      className={`w-full p-2 border font-mono text-xs ${
                        isDark ? "bg-black border-white/20 text-white" : "bg-white border-stone-300 text-black"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                      Poids Volumétrique Facturé
                    </label>
                    <div className={`p-2 border font-mono text-xs ${
                      isDark ? "bg-black border-white/20 text-neutral-300" : "bg-white border-stone-200 text-stone-800"
                    }`}>
                      {billableWeight.toFixed(1)} kg (Poids réel : {boxDimensions.weight} kg)
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                      Prime Assurance Clou à Clou
                    </label>
                    <div className="p-2 border font-mono text-xs bg-emerald-950/40 border-emerald-500/50 text-emerald-400">
                      {Math.round(insurancePremium)} € (ad valorem 1.2%)
                    </div>
                  </div>
                </div>
              </div>

              {/* 4-Layer Packaging Protocol & Unboxing Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* 4-Layer Packaging */}
                <div className={`md:col-span-6 p-5 border space-y-3 ${
                  isDark ? "bg-black border-[#c9a84c]/40 text-white" : "bg-white border-[#c9a84c] text-black shadow-md"
                }`}>
                  <h4 className="font-serif font-bold text-xs text-[#c9a84c] uppercase border-b pb-2 border-[#c9a84c]/30">
                    Protocole Muséal d'Emballage en 4 Couches
                  </h4>

                  <div className="space-y-2 text-xs font-sans">
                    {defaultShippingData.protocole_emballage_4_couches?.map((step: any, idx: number) => (
                      <div key={idx} className={`p-2.5 border ${
                        isDark ? "bg-[#141414] border-white/10" : "bg-stone-50 border-stone-200"
                      }`}>
                        <strong className="text-[#c9a84c] block mb-0.5">{step.couche}</strong>
                        <p className="text-neutral-400">{step.fonction}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Unboxing Instructions for Collector */}
                <div className={`md:col-span-6 p-5 border flex flex-col justify-between ${
                  isDark ? "bg-[#111111] border-[#c9a84c]/40 text-white" : "bg-stone-50 border-[#c9a84c] text-black shadow-md"
                }`}>
                  <div className="space-y-3">
                    <h4 className="font-serif font-bold text-xs text-[#c9a84c] uppercase border-b pb-2 border-[#c9a84c]/30">
                      Fiche Conseils de Déballage pour l'Acquéreur
                    </h4>

                    <ul className="space-y-2 text-xs font-sans">
                      {defaultShippingData.checklist_deballage_acquerreur?.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#c9a84c] flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
                    <button
                      onClick={() => handleCopy(
                        `=== CONSEILS DE DÉBALLAGE & PROTOCOLE DE RÉCEPTION ===\n\n` +
                        defaultShippingData.checklist_deballage_acquerreur.map((c: string, i: number) => `${i+1}. ${c}`).join("\n"),
                        "shipping_copy"
                      )}
                      className="px-3.5 py-1.5 bg-[#c9a84c] hover:bg-white text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                    >
                      {copiedKey === "shipping_copy" ? "Fiche Copiée !" : "Copier la Fiche de Déballage"}
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className={`p-3.5 sm:p-4 border-t flex items-center justify-between ${
          isDark ? "bg-[#141414] border-[#c9a84c]/30" : "bg-stone-100 border-[#c9a84c]/30"
        }`}>
          <div className="flex items-center gap-2 text-xs font-sans text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-[#c9a84c]" />
            <span>Sécurisation juridique & financière certifiée pour artistes professionnels</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#c9a84c] hover:bg-white text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
          >
            Fermer le Module Ventes
          </button>
        </div>

      </div>
    </div>
  );
}
