/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Heart, CreditCard, Sparkles, X, CheckCircle2, 
  Award, ShieldCheck, Coins, Gift, Loader2, Printer 
} from "lucide-react";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: "dark-gold" | "light";
}

export default function DonationModal({
  isOpen,
  onClose,
  theme = "dark-gold"
}: DonationModalProps) {
  const [selectedTier, setSelectedTier] = useState<number | "custom">(15);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const isDark = theme === "dark-gold";

  const tiers = [
    { id: 5, label: "L'Étincelle", price: 5, desc: "Soutien modeste pour faire vivre le projet et couvrir l'hébergement." },
    { id: 15, label: "Le Coup de Pinceau", price: 15, desc: "Finance environ 200 analyses IA approfondies d'œuvres d'art." },
    { id: 50, label: "Le Vernissage", price: 50, desc: "Soutien majeur. Contribue directement au développement de nouveaux outils." }
  ];

  const getAmount = () => {
    if (selectedTier === "custom") {
      return parseFloat(customAmount) || 0;
    }
    return selectedTier;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format card number: xxxx xxxx xxxx xxxx
    const val = e.target.value.replace(/\D/g, "").substring(0, 16);
    const formatted = val.match(/.{1,4}/g)?.join(" ") || val;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format MM/YY
    const val = e.target.value.replace(/\D/g, "").substring(0, 4);
    if (val.length >= 2) {
      setCardExpiry(`${val.substring(0, 2)}/${val.substring(2)}`);
    } else {
      setCardExpiry(val);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardCvv(e.target.value.replace(/\D/g, "").substring(0, 3));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const amount = getAmount();
    if (amount <= 0) {
      setErrorMsg("Veuillez choisir ou saisir un montant valide.");
      return;
    }

    if (!cardName.trim()) {
      setErrorMsg("Veuillez saisir le nom du titulaire de la carte.");
      return;
    }

    if (cardNumber.replace(/\s/g, "").length < 16) {
      setErrorMsg("Le numéro de carte semble incomplet.");
      return;
    }

    if (cardExpiry.length < 5) {
      setErrorMsg("La date d'expiration doit être au format MM/YY.");
      return;
    }

    if (cardCvv.length < 3) {
      setErrorMsg("Le code de sécurité CVV doit comporter 3 chiffres.");
      return;
    }

    setIsProcessing(true);

    // Simulate payment call
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2200);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className={`w-full max-w-2xl border transition-colors duration-300 relative overflow-hidden flex flex-col max-h-[90vh] ${
        isDark ? "bg-[#0E0E0E] border-white/10 text-white" : "bg-white border-stone-200 text-stone-900"
      }`}>
        
        {/* Top Gold Border Decor */}
        <div className="h-1 w-full bg-gradient-to-r from-amber-600 via-[#c9a84c] to-amber-600" />

        {/* Modal Header */}
        <div className={`px-6 py-4 flex items-center justify-between border-b ${
          isDark ? "border-white/5" : "border-stone-100"
        }`}>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#c9a84c] fill-[#c9a84c]/20" />
            <h3 className="font-serif font-light text-lg uppercase tracking-widest">
              Soutenir l'Atelier <span className="text-[#c9a84c] italic">Mécénat</span>
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Introduction */}
              <div className="space-y-2 text-center max-w-lg mx-auto">
                <Coins className="w-8 h-8 text-[#c9a84c] mx-auto animate-bounce" />
                <p className="font-serif italic text-sm text-neutral-400">
                  « L'art est un don qui grandit à mesure qu'on le partage. »
                </p>
                <p className="text-xs font-sans text-neutral-500 leading-relaxed uppercase tracking-wider">
                  Cette application est mise gratuitement à la disposition des créateurs. Vos contributions nous permettent d'héberger les modèles d'IA et de garantir l'absence de publicité.
                </p>
              </div>

              {/* Tiers Selector */}
              <div className="space-y-3 text-left">
                <label className="text-[10px] font-sans font-bold tracking-widest uppercase text-neutral-400">
                  Choisissez votre niveau de don :
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {tiers.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTier(t.price)}
                      className={`border p-4 cursor-pointer transition-all duration-300 flex flex-col justify-between relative ${
                        selectedTier === t.price
                          ? (isDark ? "bg-[#161616] border-[#c9a84c] shadow-md" : "bg-[#FAF7F2] border-[#c9a84c] shadow-md")
                          : (isDark ? "bg-black/40 border-white/5 hover:border-white/20" : "bg-stone-50 border-stone-200 hover:border-stone-300")
                      }`}
                    >
                      {selectedTier === t.price && (
                        <div className="absolute top-1.5 right-1.5">
                          <CheckCircle2 className="w-4 h-4 text-[#c9a84c] fill-black" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-serif font-bold italic text-sm">{t.label}</h4>
                        <p className="text-xs text-neutral-400 mt-1">{t.desc}</p>
                      </div>
                      <div className="mt-4 pt-2 border-t border-white/5 flex items-baseline justify-between">
                        <span className="text-[10px] font-sans uppercase tracking-widest text-neutral-500">Montant</span>
                        <span className="text-lg font-serif font-bold text-[#c9a84c]">{t.price} €</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom amount */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-white/5 bg-black/20">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    id="tier-custom"
                    checked={selectedTier === "custom"}
                    onChange={() => setSelectedTier("custom")}
                    className="accent-[#c9a84c]"
                  />
                  <label htmlFor="tier-custom" className="text-xs font-sans uppercase tracking-widest text-neutral-300 font-bold">
                    Saisir un montant libre (en €)
                  </label>
                </div>
                {selectedTier === "custom" && (
                  <div className="relative w-full sm:w-40">
                    <span className="absolute left-3 top-2 text-[#c9a84c] text-sm font-bold">€</span>
                    <input
                      type="number"
                      min="1"
                      placeholder="Montant"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className={`w-full py-1.5 pl-8 pr-3 text-xs font-bold outline-none border focus:border-[#c9a84c] ${
                        isDark ? "bg-[#0A0A0A] border-white/10 text-white" : "bg-white border-stone-200 text-stone-950"
                      }`}
                    />
                  </div>
                )}
              </div>

              {/* Secure payment form */}
              <div className={`border p-5 space-y-4 ${
                isDark ? "bg-[#111111]/60 border-white/5" : "bg-stone-50/50 border-stone-100"
              }`}>
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-[9px] font-sans font-bold tracking-widest text-[#c9a84c] uppercase flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#c9a84c]" />
                    Paiement par carte sécurisé (Mode Simulation)
                  </span>
                  <div className="flex gap-1">
                    <div className="w-6 h-4 bg-neutral-800 rounded-sm flex items-center justify-center text-[6px] font-bold text-neutral-400">VISA</div>
                    <div className="w-6 h-4 bg-neutral-800 rounded-sm flex items-center justify-center text-[6px] font-bold text-neutral-400">MC</div>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-rose-950/20 border border-rose-900 text-rose-300 text-xs font-sans">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-sans uppercase tracking-widest text-neutral-400">Nom du titulaire</label>
                    <input
                      type="text"
                      placeholder="ex: M. Valentin Richaud"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className={`w-full py-2 px-3 text-xs outline-none border ${
                        isDark ? "bg-black border-white/10 text-white" : "bg-white border-stone-200 text-stone-900"
                      }`}
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-sans uppercase tracking-widest text-neutral-400">Numéro de carte</label>
                    <input
                      type="text"
                      placeholder="4000 1234 5678 9010"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className={`w-full py-2 px-3 text-xs outline-none border font-mono tracking-widest ${
                        isDark ? "bg-black border-white/10 text-white" : "bg-white border-stone-200 text-stone-900"
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-sans uppercase tracking-widest text-neutral-400">Date d'expiration</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      className={`w-full py-2 px-3 text-xs outline-none border font-mono tracking-widest text-center ${
                        isDark ? "bg-black border-white/10 text-white" : "bg-white border-stone-200 text-stone-900"
                      }`}
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-sans uppercase tracking-widest text-neutral-400">Code CVV</label>
                    <input
                      type="password"
                      placeholder="•••"
                      maxLength={3}
                      value={cardCvv}
                      onChange={handleCvvChange}
                      className={`w-full py-2 px-3 text-xs outline-none border font-mono tracking-widest text-center ${
                        isDark ? "bg-black border-white/10 text-white" : "bg-white border-stone-200 text-stone-900"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 bg-[#c9a84c] hover:bg-white hover:text-black text-black font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 rounded-none"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    Traitement de votre don en cours...
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 fill-black" />
                    Faire un don de {getAmount()} € pour l'Atelier
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Success View: Beautiful Patrons Certificate */
            <div className="space-y-6 text-center py-4 animate-scaleUp">
              
              {/* Beautiful luxury certificate */}
              <div 
                id="mecene-certificate"
                className={`p-8 sm:p-12 border-[6px] border-double relative select-none text-center ${
                  isDark 
                    ? "bg-[#070707] border-[#c9a84c]/40 text-stone-200" 
                    : "bg-[#FDFCF9] border-[#9c7d2b]/40 text-stone-900"
                }`}
              >
                {/* Vintage style corners */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#c9a84c]" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#c9a84c]" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#c9a84c]" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#c9a84c]" />

                <Award className="w-16 h-16 text-[#c9a84c] mx-auto mb-4" />
                
                <span className="text-[10px] font-sans font-bold tracking-[0.4em] uppercase text-[#c9a84c] block mb-2">
                  DIPLÔME DE BIENFAITEUR & MÉCÈNE
                </span>
                
                <h2 className="font-serif font-light text-3xl sm:text-4xl italic tracking-wide leading-tight mb-6">
                  L'Œil de l'Atelier
                </h2>

                <p className="text-xs font-sans text-neutral-400 uppercase tracking-widest max-w-md mx-auto leading-relaxed mb-6">
                  Le présent titre est décerné avec toute notre gratitude à :
                </p>

                <p className="font-serif text-2xl sm:text-3xl font-light text-[#c9a84c] tracking-wider mb-6 underline decoration-[#c9a84c]/20 underline-offset-8 decoration-1">
                  {cardName || "Artiste Bienfaiteur"}
                </p>

                <p className="text-xs font-serif italic text-neutral-400 max-w-lg mx-auto leading-relaxed mb-8">
                  En remerciement de son généreux don de <span className="font-bold text-[#c9a84c]">{getAmount()} €</span> qui contribue activement à la pérennité, à l'indépendance financière et à la liberté de création de l'Atelier de critique et d'accompagnement artistique par Intelligence Artificielle.
                </p>

                <div className="grid grid-cols-2 gap-4 items-center justify-between border-t border-white/5 pt-6 mt-8">
                  <div className="text-left">
                    <p className="text-[8px] font-sans text-neutral-500 uppercase tracking-wider">Date d'octroi</p>
                    <p className="text-[10px] font-serif font-bold italic mt-0.5 text-neutral-300">
                      {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-sans text-neutral-500 uppercase tracking-wider">Sceau Officiel</p>
                    <p className="text-[10px] font-serif italic font-bold mt-0.5 text-[#c9a84c]">
                      ★ MÉCÈNAT D'ATELIER ★
                    </p>
                  </div>
                </div>

                {/* Simulated Wax Seal watermark in background */}
                <div className="absolute right-8 top-8 opacity-5 pointer-events-none">
                  <div className="w-24 h-24 rounded-full bg-red-600 flex items-center justify-center font-bold text-white uppercase text-center border-4 border-red-800 rotate-12">
                    SEAL OF SUPPORT
                  </div>
                </div>
              </div>

              {/* Thank you and buttons */}
              <div className="space-y-4 max-w-lg mx-auto">
                <p className="text-xs text-neutral-400 leading-relaxed uppercase tracking-wider">
                  Votre contribution a été enregistrée avec succès. Un reçu symbolique est envoyé sur votre boîte de réception. Vous êtes officiellement un parrain de l'art technologique contemporain !
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handlePrint}
                    className="flex-1 py-2.5 border border-white/10 hover:border-[#c9a84c]/30 text-[10px] tracking-widest uppercase font-sans font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#c9a84c]" />
                    Imprimer le Titre
                  </button>
                  
                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      onClose();
                    }}
                    className="flex-1 py-2.5 bg-[#c9a84c] hover:bg-white text-black text-[10px] tracking-widest uppercase font-sans font-black transition-colors"
                  >
                    Retour à l'Atelier
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
