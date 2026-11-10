/**
 * Fenêtre de don.
 *
 * L'ancienne version affichait un formulaire de carte bancaire « en mode
 * simulation » qui annonçait un paiement réussi sans rien encaisser. On ne
 * demande plus aucun numéro de carte ici : le don se fait par l'espace dons
 * officiel de l'écosystème (virement depuis votre banque).
 */
import React from "react";
import { X, Heart } from "lucide-react";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: "dark-gold" | "light";
}

export default function DonationModal({ isOpen, onClose, theme = "dark-gold" }: DonationModalProps) {
  if (!isOpen) return null;
  const isDark = theme === "dark-gold";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div
        className={`w-full max-w-md border p-6 space-y-4 ${
          isDark ? "bg-[#0E0E0E] border-white/10 text-white" : "bg-white border-stone-200 text-stone-900"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Soutenir l'application"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-serif font-bold flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#c9a84c]" />
            Soutenir L'Œil de l'Atelier
          </h2>
          <button type="button" onClick={onClose} aria-label="Fermer" className="p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm leading-relaxed">
          Merci d'y penser. Aucun paiement par carte n'est possible dans cette application : ne
          saisissez jamais votre numéro de carte ici.
        </p>
        <p className="text-sm leading-relaxed">
          Le don se fait par virement, depuis votre banque, avec les coordonnées publiées dans
          l'espace dons d'Alphabette.
        </p>
        <a
          href="https://alphabette.fr/don"
          className="block w-full text-center px-4 py-3 text-sm font-bold uppercase tracking-wider bg-[#c9a84c] text-black"
        >
          Ouvrir l'espace dons
        </a>
        <button type="button" onClick={onClose} className="w-full px-4 py-2 text-sm underline">
          Fermer
        </button>
      </div>
    </div>
  );
}
