/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon } from "lucide-react";

interface DropZoneProps {
  onFileSelected: (file: File) => void;
  onMultipleFilesSelected?: (files: File[]) => void;
  theme?: "dark-gold" | "light";
}

export default function DropZone({ onFileSelected, onMultipleFilesSelected, theme = "dark-gold" }: DropZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const imageFiles: File[] = [];
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        const file = e.dataTransfer.files[i];
        if (file.type.startsWith("image/")) {
          imageFiles.push(file);
        }
      }
      
      if (imageFiles.length > 1 && onMultipleFilesSelected) {
        onMultipleFilesSelected(imageFiles);
      } else if (imageFiles.length > 0) {
        onFileSelected(imageFiles[0]);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const imageFiles: File[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        if (file.type.startsWith("image/")) {
          imageFiles.push(file);
        }
      }

      if (imageFiles.length > 1 && onMultipleFilesSelected) {
        onMultipleFilesSelected(imageFiles);
      } else if (imageFiles.length > 0) {
        onFileSelected(imageFiles[0]);
      }
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`border-2 border-dashed transition-all duration-300 rounded-none p-12 text-center max-w-3xl mx-auto cursor-pointer relative overflow-hidden flex flex-col items-center justify-center min-h-[300px] ${
        theme === "dark-gold"
          ? isDragActive
            ? "border-[#c9a84c] bg-[#1a1a15] shadow-[0_0_20px_rgba(201,168,76,0.1)]"
            : "border-white/10 bg-[#111111] hover:border-[#c9a84c]/50 hover:bg-[#1a1a17]"
          : isDragActive
            ? "border-[#c9a84c] bg-[#fdfbfa] shadow-[0_0_20px_rgba(201,168,76,0.15)]"
            : "border-[#e8dfd3] bg-white hover:border-[#c9a84c]/50 hover:bg-stone-50"
      }`}
      onClick={onButtonClick}
    >
      {/* Subtle radial ambient gradient backing */}
      <div className="absolute inset-0 bg-radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.03) 0%, transparent 70%) pointer-events-none" />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
        className="hidden"
      />

      <div className="relative z-10 flex flex-col items-center">
        <div className={`w-16 h-16 border flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300 shadow-inner rounded-none ${
          theme === "dark-gold" ? "bg-black border-white/10" : "bg-stone-50 border-stone-200"
        }`}>
          <UploadCloud className={`w-7 h-7 transition-colors ${
            theme === "dark-gold" ? "text-neutral-400 hover:text-[#c9a84c]" : "text-stone-500 hover:text-[#c9a84c]"
          }`} />
        </div>
        
        <h3 className={`font-serif font-light text-2xl sm:text-3xl tracking-tight uppercase mb-2 ${
          theme === "dark-gold" ? "text-[#f0e8d8]" : "text-stone-900"
        }`}>
          Déposez l'œuvre de votre choix ici
        </h3>
        
        <p className={`text-[10px] uppercase tracking-widest mb-6 font-sans ${
          theme === "dark-gold" ? "text-neutral-400" : "text-stone-500"
        }`}>
          Formats acceptés : JPEG · PNG · WEBP (Max 15 Mo)
        </p>

        <button
          type="button"
          className={`px-6 py-2.5 font-sans text-xs tracking-widest uppercase transition-all duration-300 rounded-none font-bold shadow-md border-none ${
            theme === "dark-gold"
              ? "bg-[#c9a84c] hover:bg-white text-black"
              : "bg-stone-900 hover:bg-[#c9a84c] hover:text-black text-white"
          }`}
        >
          Parcourir mes fichiers d'atelier
        </button>
      </div>
    </div>
  );
}
