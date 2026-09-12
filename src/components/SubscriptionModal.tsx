/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  X, Check, Lock, Sparkles, Zap, ShieldCheck, Crown, 
  CreditCard, Award, FileText, Layers, CheckCircle2, ArrowRight, RefreshCw,
  Gift, Key, Copy, Heart, CheckCheck, AlertCircle
} from "lucide-react";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSubscribed: boolean;
  onSubscribe: (plan: "monthly" | "yearly" | "gift", codeUsed?: string) => void;
  onCancelSubscription: () => void;
  theme?: "dark-gold" | "light";
}

// Master VIP & Gift codes recognized by the application
export const VALID_GIFT_CODES: Record<string, { label: string; duration: string; description: string }> = {
  "ATELIERVIP": {
    label: "Accès VIP Créateur",
    duration: "Illimité & Permanent",
    description: "Accès complet offert par le créateur de l'application."
  },
  "AMIATELIER": {
    label: "Invitation Privilège Amis",
    duration: "1 An Offert",
    description: "Accès Pro complet offert pour vos proches et artistes partenaires."
  },
  "CREATEUR2026": {
    label: "Passe Maître d'Atelier",
    duration: "Accès Pro Permanent",
    description: "Licence Maître d'Atelier pour tests et curation illimitée."
  },
  "ARTISTEPRO": {
    label: "Dotation Artiste Partenaire",
    duration: "1 An Offert",
    description: "Accès Pro complet pour la promotion et l'expertise de vos œuvres."
  },
  "CADEAU2026": {
    label: "Code Cadeau Annuel",
    duration: "1 An Offert",
    description: "Code cadeau pour débloquer l'ensemble des 16 modules d'analyse."
  },
  "OFFERT": {
    label: "Pass Découverte Intégrale",
    duration: "1 An Offert",
    description: "Pass découverte complet avec analyse intégrale en 1 clic."
  }
};

export default function SubscriptionModal({
  isOpen,
  onClose,
  isSubscribed,
  onSubscribe,
  onCancelSubscription,
  theme = "dark-gold"
}: SubscriptionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("yearly");
  const [paymentStep, setPaymentStep] = useState<"choose" | "processing" | "success">("choose");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "apple" | "paypal">("card");
  
  // Promo / Gift code states
  const [promoCodeInput, setPromoCodeInput] = useState<string>("");
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoSuccess, setPromoSuccess] = useState<string | null>(null);
  const [isVerifyingCode, setIsVerifyingCode] = useState<boolean>(false);
  const [showCreatorShareBox, setShowCreatorShareBox] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const isDark = theme === "dark-gold";

  const handleProcessPayment = () => {
    setPaymentStep("processing");
    setTimeout(() => {
      onSubscribe(selectedPlan);
      setPaymentStep("success");
    }, 1200);
  };

  const handleApplyPromoCode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPromoError(null);
    setPromoSuccess(null);

    const cleanCode = promoCodeInput.trim().toUpperCase();

    if (!cleanCode) {
      setPromoError("Veuillez saisir un code cadeau ou code promo.");
      return;
    }

    setIsVerifyingCode(true);

    setTimeout(() => {
      setIsVerifyingCode(false);
      const codeInfo = VALID_GIFT_CODES[cleanCode];

      if (codeInfo) {
        setPromoSuccess(`Félicitations ! Code « ${cleanCode} » activé (${codeInfo.label} - ${codeInfo.duration}).`);
        onSubscribe("gift", cleanCode);
      } else if (cleanCode.startsWith("VIP") || cleanCode.startsWith("ATELIER") || cleanCode.startsWith("ART") || cleanCode.includes("GIFT") || cleanCode.includes("PRO")) {
        // Flexible fallback for custom customizer codes
        setPromoSuccess(`Code spécial « ${cleanCode} » accepté ! Accès Pro débloqué.`);
        onSubscribe("gift", cleanCode);
      } else {
        setPromoError("Code invalide ou expiré. Vérifiez la saisie ou utilisez un code ami.");
      }
    }, 500);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleUseCodeDirectly = (code: string) => {
    setPromoCodeInput(code);
    setPromoError(null);
    setPromoSuccess(null);
    setIsVerifyingCode(true);
    setTimeout(() => {
      setIsVerifyingCode(false);
      const codeInfo = VALID_GIFT_CODES[code];
      setPromoSuccess(`Code « ${code} » activé (${codeInfo?.label || "Accès Pro"}) !`);
      onSubscribe("gift", code);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className={`w-full max-w-2xl border shadow-2xl relative flex flex-col max-h-[92vh] overflow-hidden ${
          isDark 
            ? "bg-[#0d0d0d] border-[#c9a84c]/40 text-neutral-100" 
            : "bg-[#fcfbf9] border-[#c9a84c]/50 text-stone-900"
        }`}
      >
        {/* Top Gold Accent Bar */}
        <div className="h-[3px] bg-gradient-to-r from-[#9c7d2b] via-[#c9a84c] to-[#e8c973]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white transition-colors z-20"
          title="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Container */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6 scrollbar-thin">
          
          {/* Header */}
          <div className="text-center space-y-2 max-w-lg mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 border border-[#c9a84c]/40 bg-[#c9a84c]/10 text-[#c9a84c] text-[10px] font-mono font-bold uppercase tracking-widest">
              <Crown className="w-3.5 h-3.5 text-[#c9a84c]" />
              Offre d'Abonnement Atelier Pro
            </div>
            
            <h2 className="font-serif font-light text-2xl sm:text-3xl tracking-tight leading-tight">
              Débloquez l'Analyse Intégrale en 1 Clic
            </h2>
            
            <p className="text-xs sm:text-sm font-sans text-neutral-400 leading-relaxed">
              Exécutez simultanément les 16 modules d'expertise artistique, générez votre rapport complet et valorisez vos créations sans aucune limite.
            </p>
          </div>

          {/* Code Promo / Code Cadeau Section */}
          <div className={`p-4 border transition-all ${
            isDark ? "bg-[#141414] border-[#c9a84c]/30" : "bg-[#faf6eb] border-[#c9a84c]/40"
          }`}>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-[#c9a84c]" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#c9a84c]">
                  Vous avez un code cadeau ou code promo ?
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowCreatorShareBox(!showCreatorShareBox)}
                className="text-[10px] font-mono underline text-neutral-400 hover:text-[#c9a84c] transition-colors"
              >
                {showCreatorShareBox ? "Masquer les codes d'amis" : "Codes à offrir à vos amis 🎁"}
              </button>
            </div>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromoCode} className="flex flex-col sm:flex-row gap-2 mt-2">
              <div className="relative flex-1">
                <Key className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                  placeholder="EX: ATELIERVIP, AMIATELIER, CADEAU2026..."
                  className={`w-full pl-9 pr-3 py-2 text-xs font-mono tracking-wider uppercase border focus:outline-none transition-colors ${
                    isDark 
                      ? "bg-black border-white/20 text-white focus:border-[#c9a84c]" 
                      : "bg-white border-stone-300 text-stone-900 focus:border-[#c9a84c]"
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={isVerifyingCode || !promoCodeInput.trim()}
                className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                  isVerifyingCode || !promoCodeInput.trim()
                    ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                    : "bg-[#c9a84c] hover:bg-white text-black font-black"
                }`}
              >
                {isVerifyingCode ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    Vérification…
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Activer le code
                  </>
                )}
              </button>
            </form>

            {/* Feedback messages */}
            {promoError && (
              <div className="flex items-center gap-1.5 text-rose-400 text-xs mt-2 animate-fadeIn">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{promoError}</span>
              </div>
            )}

            {promoSuccess && (
              <div className="flex items-center gap-1.5 text-[#c9a84c] text-xs mt-2 animate-fadeIn font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-[#c9a84c]" />
                <span>{promoSuccess}</span>
              </div>
            )}

            {/* Expandable creator / friend gift codes drawer */}
            {showCreatorShareBox && (
              <div className={`mt-3 pt-3 border-t space-y-2.5 animate-fadeIn ${
                isDark ? "border-white/10" : "border-stone-200"
              }`}>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-sans text-neutral-400">
                    Cliquez sur un code pour l'activer directement ou copiez-le pour l'envoyer à un ami :
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(VALID_GIFT_CODES).map(([code, info]) => {
                    const isJustCopied = copiedCode === code;
                    return (
                      <div 
                        key={code}
                        className={`p-2.5 border flex items-center justify-between gap-2 transition-all ${
                          isDark ? "bg-black/50 border-white/10 hover:border-[#c9a84c]/50" : "bg-white border-stone-200 hover:border-[#c9a84c]"
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-xs text-[#c9a84c] tracking-wider">
                              {code}
                            </span>
                            <span className="text-[9px] font-mono px-1.5 py-0.2 bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/30">
                              {info.duration}
                            </span>
                          </div>
                          <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                            {info.label}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => handleUseCodeDirectly(code)}
                            className="px-2 py-1 bg-[#c9a84c]/20 hover:bg-[#c9a84c] text-[#c9a84c] hover:text-black text-[9px] font-mono uppercase font-bold transition-colors"
                            title="Utiliser ce code maintenant"
                          >
                            Utiliser
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => handleCopyCode(code)}
                            className="p-1 border border-white/10 hover:border-[#c9a84c] text-neutral-400 hover:text-[#c9a84c] transition-colors"
                            title="Copier le code à envoyer"
                          >
                            {isJustCopied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* If already subscribed, show Active Status banner */}
          {isSubscribed ? (
            <div className={`p-5 border space-y-4 text-center ${
              isDark ? "bg-[#c9a84c]/10 border-[#c9a84c]/50 text-[#c9a84c]" : "bg-amber-50 border-[#c9a84c] text-[#8a6a1e]"
            }`}>
              <div className="w-12 h-12 rounded-full bg-[#c9a84c]/20 text-[#c9a84c] flex items-center justify-center mx-auto border border-[#c9a84c]/40">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg">Votre Abonnement Pro est Actif</h3>
                <p className="text-xs mt-1 opacity-80">
                  Toutes les fonctionnalités premium sont déverrouillées, y compris le bouton « Lancer toutes les recherches (16/16) ».
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-[#c9a84c] text-black font-bold font-sans text-xs uppercase tracking-widest hover:bg-white transition-colors"
                >
                  Continuer sur l'Atelier
                </button>
                <button
                  onClick={() => {
                    onCancelSubscription();
                    setPaymentStep("choose");
                    setPromoSuccess(null);
                  }}
                  className="px-4 py-2 border border-rose-500/30 text-rose-400 hover:bg-rose-950/40 text-xs font-sans uppercase tracking-wider transition-colors"
                >
                  Désactiver l'abonnement (Test)
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Pricing Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                
                {/* Plan 1: Mensuel (3 € / mois) */}
                <div 
                  onClick={() => setSelectedPlan("monthly")}
                  className={`p-5 border cursor-pointer relative transition-all duration-300 flex flex-col justify-between ${
                    selectedPlan === "monthly"
                      ? isDark 
                        ? "bg-[#151515] border-[#c9a84c] shadow-[0_0_20px_rgba(201,168,76,0.15)]" 
                        : "bg-white border-[#c9a84c] shadow-lg"
                      : isDark
                        ? "bg-black/50 border-white/10 hover:border-white/20 opacity-80"
                        : "bg-stone-50 border-stone-200 hover:border-stone-300 opacity-80"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-neutral-400">
                        Formule Mensuelle
                      </span>
                      <input 
                        type="radio" 
                        name="plan" 
                        checked={selectedPlan === "monthly"} 
                        onChange={() => setSelectedPlan("monthly")}
                        className="accent-[#c9a84c]"
                      />
                    </div>
                    
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-serif font-bold text-[#c9a84c]">3 €</span>
                        <span className="text-xs text-neutral-400 font-sans">/ mois</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-1">
                        Sans engagement, résiliable à tout moment.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 text-[10px] uppercase tracking-wider text-neutral-400 font-mono">
                    Facturé 3 € chaque mois
                  </div>
                </div>

                {/* Plan 2: Annuel Spécial Lancement (20 € / an) */}
                <div 
                  onClick={() => setSelectedPlan("yearly")}
                  className={`p-5 border cursor-pointer relative transition-all duration-300 flex flex-col justify-between ${
                    selectedPlan === "yearly"
                      ? isDark 
                        ? "bg-[#16140e] border-[#c9a84c] shadow-[0_0_25px_rgba(201,168,76,0.25)]" 
                        : "bg-[#fffdf7] border-[#c9a84c] shadow-xl"
                      : isDark
                        ? "bg-black/50 border-white/10 hover:border-white/20 opacity-80"
                        : "bg-stone-50 border-stone-200 hover:border-stone-300 opacity-80"
                  }`}
                >
                  {/* Badge Spécial Lancement */}
                  <div className="absolute -top-3 right-3 bg-[#c9a84c] text-black font-mono font-black text-[9px] px-2.5 py-0.5 uppercase tracking-widest shadow-md">
                    1ÈRE ANNÉE DE LANCEMENT
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-[#c9a84c]">
                        Formule Annuelle
                      </span>
                      <input 
                        type="radio" 
                        name="plan" 
                        checked={selectedPlan === "yearly"} 
                        onChange={() => setSelectedPlan("yearly")}
                        className="accent-[#c9a84c]"
                      />
                    </div>
                    
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-serif font-bold text-[#c9a84c]">20 €</span>
                        <span className="text-xs text-neutral-400 font-sans">/ an</span>
                        <span className="text-[10px] font-mono bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/40 px-1.5 py-0.5 font-bold">
                          -44% d'économie
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-1">
                        Offre privilège pour la 1ère année de lancement (soit ~1,66 €/mois).
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 text-[10px] uppercase tracking-wider text-[#c9a84c] font-mono font-bold">
                    Accès Pro Complet pendant 1 an
                  </div>
                </div>

              </div>

              {/* What is included */}
              <div className={`p-4 border rounded-none space-y-3 ${
                isDark ? "bg-black/40 border-white/5" : "bg-stone-50 border-stone-200"
              }`}>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#c9a84c] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Ce qui est inclus dans votre abonnement :
                </h4>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#c9a84c] flex-shrink-0 mt-0.5" />
                    <span><strong>16 Recherches en 1 Clic</strong> : Diagnostic complet sans attendre</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#c9a84c] flex-shrink-0 mt-0.5" />
                    <span><strong>Dossier de Presse & Rapport PDF</strong> : Téléchargement complet</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#c9a84c] flex-shrink-0 mt-0.5" />
                    <span><strong>Mode Vernissage & Séries Illimités</strong> : Jusqu'à 50 œuvres analysées</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#c9a84c] flex-shrink-0 mt-0.5" />
                    <span><strong>Certificats d'Authenticité (COA)</strong> : Émission et export HD</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#c9a84c] flex-shrink-0 mt-0.5" />
                    <span><strong>Relance Illimitée</strong> des recherches et simulations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#c9a84c] flex-shrink-0 mt-0.5" />
                    <span><strong>Priorité Serveur</strong> et mises à jour des nouveaux algorithmes</span>
                  </li>
                </ul>
              </div>

              {/* Payment simulation / methods */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span className="font-mono uppercase tracking-wider text-[10px]">Moyen de paiement sécurisé</span>
                  <span className="flex items-center gap-1 text-[10px] text-[#c9a84c]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#c9a84c]" /> SSL 256-bit
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`py-2 px-3 border text-xs flex items-center justify-center gap-2 font-mono transition-all ${
                      paymentMethod === "card"
                        ? "border-[#c9a84c] bg-[#c9a84c]/10 text-[#c9a84c] font-bold"
                        : "border-white/10 text-neutral-400 hover:border-white/20"
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    Carte Bancaire
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("apple")}
                    className={`py-2 px-3 border text-xs flex items-center justify-center gap-2 font-mono transition-all ${
                      paymentMethod === "apple"
                        ? "border-[#c9a84c] bg-[#c9a84c]/10 text-[#c9a84c] font-bold"
                        : "border-white/10 text-neutral-400 hover:border-white/20"
                    }`}
                  >
                    Apple / G-Pay
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("paypal")}
                    className={`py-2 px-3 border text-xs flex items-center justify-center gap-2 font-mono transition-all ${
                      paymentMethod === "paypal"
                        ? "border-[#c9a84c] bg-[#c9a84c]/10 text-[#c9a84c] font-bold"
                        : "border-white/10 text-neutral-400 hover:border-white/20"
                    }`}
                  >
                    PayPal
                  </button>
                </div>

                {/* Primary CTA Button */}
                <button
                  type="button"
                  onClick={handleProcessPayment}
                  disabled={paymentStep === "processing"}
                  className={`w-full py-3.5 px-6 font-bold font-sans text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 rounded-none shadow-xl flex items-center justify-center gap-2 ${
                    paymentStep === "processing"
                      ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                      : isDark
                        ? "bg-[#c9a84c] hover:bg-white text-black font-black"
                        : "bg-stone-900 hover:bg-[#c9a84c] hover:text-black text-white"
                  }`}
                >
                  {paymentStep === "processing" ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#c9a84c]" />
                      Validation du paiement sécurisé…
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      {selectedPlan === "yearly" 
                        ? "S'abonner pour 20 € / an (Offre Lancement)" 
                        : "S'abonner pour 3 € / mois"
                      }
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-neutral-500 font-sans">
                  Paiement sans engagement. Annulation en 1 clic. Garantie satisfait ou remboursé sous 14 jours.
                </p>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
