/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { X, Calendar, FileImage, Trash2, Eye, Sparkles } from "lucide-react";
import { HistoryItem } from "../types.js";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyList: HistoryItem[];
  onLoadHistoryItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
  theme?: "dark-gold" | "light";
}

export default function HistoryModal({
  isOpen,
  onClose,
  historyList,
  onLoadHistoryItem,
  onClearHistory,
  theme = "dark-gold"
}: HistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className={`rounded-none w-full max-w-2xl max-h-[85vh] flex flex-col relative transition-all duration-300 border-2 shadow-[0_0_50px_rgba(201,168,76,0.15)] ${
        theme === "dark-gold" ? "bg-[#111111] border-[#c9a84c]" : "bg-white border-[#c9a84c]"
      }`}>
        {/* Gold accent line on top */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#c9a84c]" />

        {/* Modal Header */}
        <div className={`p-5 border-b flex items-center justify-between ${
          theme === "dark-gold" ? "border-white/10" : "border-stone-200"
        }`}>
          <div>
            <h2 className={`font-sans font-black uppercase tracking-wide flex items-center gap-2 text-base ${
              theme === "dark-gold" ? "text-white" : "text-stone-900"
            }`}>
              <Sparkles className="w-5 h-5 text-[#c9a84c]" />
              Mon Carnet de Bord d'Atelier
            </h2>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Toutes vos analyses sont conservées localement dans votre navigateur.
            </p>
          </div>
          <button
            onClick={onClose}
            className={`transition-colors p-1 ${
              theme === "dark-gold" ? "text-neutral-500 hover:text-[#c9a84c]" : "text-stone-400 hover:text-[#c9a84c]"
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3 custom-scrollbar">
          {historyList.length === 0 ? (
            <div className="text-center py-12">
              <FileImage className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
              <p className="text-sm text-neutral-400 font-light italic">
                Votre carnet de bord est vide pour le moment.
              </p>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto font-sans">
                Commencez par importer une œuvre d'art et lancer une analyse pour enregistrer vos travaux.
              </p>
            </div>
          ) : (
            historyList.map((item) => (
              <div
                key={item.id}
                className={`p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between transition-all duration-200 rounded-none group border ${
                  theme === "dark-gold" 
                    ? "bg-[#0A0A0A] border-white/10 hover:border-[#c9a84c]/40" 
                    : "bg-stone-50 border-stone-200 hover:border-[#c9a84c]/40"
                }`}
              >
                <div className="flex gap-4 items-center">
                  {/* Miniature Image Preview */}
                  {item.imageSrc && (
                    <div className="w-14 h-14 bg-black border border-white/10 flex-shrink-0 flex items-center justify-center overflow-hidden rounded-none relative">
                      <img
                        src={item.imageSrc}
                        alt="Miniature"
                        className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                  
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] border py-0.5 px-2 rounded-none uppercase tracking-wider font-bold font-sans ${
                        theme === "dark-gold" ? "bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/20" : "bg-[#c9a84c]/10 text-[#9c7d2b] border-[#c9a84c]/30"
                      }`}>
                        {item.toolLabel}
                      </span>
                      <span className="text-[10px] text-neutral-400 flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3" />
                        {item.date}
                      </span>
                    </div>
                    
                    <h4 className={`font-sans font-bold text-sm tracking-wide mt-1.5 truncate max-w-[280px] sm:max-w-[340px] ${
                      theme === "dark-gold" ? "text-white" : "text-stone-900"
                    }`}>
                      {item.summary}
                    </h4>
                    <p className="text-[11px] text-neutral-400 truncate max-w-[280px] sm:max-w-[340px] mt-0.5">
                      Fichier : {item.filename}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onLoadHistoryItem(item);
                    onClose();
                  }}
                  className={`px-3 py-1.5 font-sans text-[10px] tracking-widest uppercase transition-all duration-200 rounded-none font-bold flex items-center gap-1.5 self-end sm:self-auto border-none ${
                    theme === "dark-gold"
                      ? "bg-[#c9a84c] hover:bg-white text-black"
                      : "bg-stone-900 hover:bg-[#c9a84c] hover:text-black text-white"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Consulter
                </button>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        {historyList.length > 0 && (
          <div className={`p-4 border-t flex justify-between items-center ${
            theme === "dark-gold" ? "bg-black border-white/10" : "bg-stone-50 border-stone-200"
          }`}>
            <span className="text-[11px] text-neutral-400 font-mono">
              {historyList.length} entrées mémorisées
            </span>
            <button
              onClick={() => {
                if (confirm("Effacer définitivement l'ensemble de votre carnet local ?")) {
                  onClearHistory();
                }
              }}
              className="text-rose-400 hover:text-rose-300 text-xs font-sans tracking-wider uppercase flex items-center gap-1.5 transition-colors font-bold"
            >
              <Trash2 className="w-4 h-4" />
              Vider le Carnet de Bord
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
