/**
 * Ancienne fenêtre « Atelier Pro ».
 *
 * Elle affichait un faux paiement (carte, Apple Pay, PayPal) qui débloquait
 * l'accès sans rien encaisser, et des codes cadeaux factices. Aucun paiement
 * n'existe dans cette application : tous les modules sont donc ouverts à tous,
 * et cette fenêtre le dit simplement.
 */
import React from "react";
import { X, CheckCircle2 } from "lucide-react";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSubscribed: boolean;
  onSubscribe: (plan: "monthly" | "yearly" | "gift", codeUsed?: string) => void;
  onCancelSubscription: () => void;
  theme?: "dark-gold" | "light";
}

export default function SubscriptionModal({ isOpen, onClose, theme = "dark-gold" }: SubscriptionModalProps) {
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
        aria-label="Accès à l'application"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-serif font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#c9a84c]" />
            Tous les modules sont ouverts
          </h2>
          <button type="button" onClick={onClose} aria-label="Fermer" className="p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm leading-relaxed">
          Aucun paiement n'est demandé dans L'Œil de l'Atelier et aucune carte bancaire n'y est
          saisie. Les analyses utilisent votre propre clé Gemini (à renseigner dans le Profil
          Artiste) : c'est Google qui applique ses limites d'usage, pas nous.
        </p>
        <p className="text-sm leading-relaxed">
          Pour soutenir l'écosystème Alphabette, utilisez le bouton « DON » ou le Pass dans la barre
          tout en haut de la page.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="w-full px-4 py-3 text-sm font-bold uppercase tracking-wider bg-[#c9a84c] text-black"
        >
          Continuer
        </button>
      </div>
    </div>
  );
}
