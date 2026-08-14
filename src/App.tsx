/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Sparkles, BookOpen, Trash2, ArrowLeft, Paintbrush, HelpCircle, 
  AlertTriangle, Plus, FolderPlus, Heart, Check, X, Calendar, Eye, 
  Layers, FileText, RefreshCw, Loader2 
} from "lucide-react";
import { ArtistProfile, HistoryItem, CustomArtwork } from "./types.js";
import { TOOLS } from "./data.js";
import { PRESET_ARTWORKS, getArtworkBase64, PresetArtwork } from "./presets.js";
import ArtistProfileForm from "./components/ArtistProfileForm.js";
import AppDescriptionBanner from "./components/AppDescriptionBanner.js";
import DropZone from "./components/DropZone.js";
import HistoryModal from "./components/HistoryModal.js";
import ResultsPanel from "./components/ResultsPanel.js";
import ToolsBar from "./components/ToolsBar.js";
import DonationModal from "./components/DonationModal.js";

const DEFAULT_PROFILE: ArtistProfile = {
  name: "",
  instagram: "",
  web: "",
  style: "",
  desc: "",
  bio: "",
  contactEmail: "",
  mediums: "",
  achievements: "",
  philosophy: ""
};

// Helper: Resize and compress image base64 for history to stay within localStorage quota
function resizeImageBase64(base64: string, maxWidth: number = 300, maxHeight: number = 300): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.75));
      } else {
        resolve(base64);
      }
    };
    img.onerror = () => {
      resolve(base64);
    };
  });
}

// Helper: Convert File to Base64 Promise
function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Format de fichier non pris en charge."));
      }
    };
    reader.onerror = () => reject(reader.error || new Error("Erreur de lecture de fichier."));
    reader.readAsDataURL(file);
  });
}

export default function App() {
  // Session States
  const [file, setFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeSeries, setActiveSeries] = useState<Array<{ id: string; title: string; imageSrc: string; artist?: string; medium?: string; year?: string }>>([]);
  const [activeToolId, setActiveToolId] = useState<string>("style");
  const [cache, setCache] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<"dark-gold" | "light">("dark-gold");

  // Persistence States
  const [profile, setProfile] = useState<ArtistProfile>(DEFAULT_PROFILE);
  const [customApiKey, setCustomApiKey] = useState<string>("");
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isDonationOpen, setIsDonationOpen] = useState<boolean>(false);

  // Gallery States
  const [customArtworks, setCustomArtworks] = useState<CustomArtwork[]>([]);
  const [selectedArtwork, setSelectedArtwork] = useState<CustomArtwork | PresetArtwork | null>(null);
  const [isPresetLoading, setIsPresetLoading] = useState<boolean>(false);
  const [batchLoadingStatus, setBatchLoadingStatus] = useState<string | null>(null);
  const [galleryTab, setGalleryTab] = useState<"presets" | "custom">("presets");
  const [saveFormOpen, setSaveFormOpen] = useState<boolean>(false);
  const [saveTitle, setSaveTitle] = useState<string>("");
  const [saveArtist, setSaveArtist] = useState<string>("");
  const [saveMedium, setSaveMedium] = useState<string>("");
  const [saveYear, setSaveYear] = useState<string>("");

  // Load Persisted Data on Mount
  useEffect(() => {
    const savedProfile = localStorage.getItem("oeilAtelier_profile");
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error("Error parsing saved profile:", e);
      }
    }

    const savedKey = localStorage.getItem("oeilAtelier_custom_key");
    if (savedKey) {
      setCustomApiKey(savedKey);
    }

    const savedCustomArtworks = localStorage.getItem("oeilAtelier_custom_artworks");
    if (savedCustomArtworks) {
      try {
        setCustomArtworks(JSON.parse(savedCustomArtworks));
      } catch (e) {
        console.error("Error parsing custom artworks:", e);
      }
    }

    const savedHistory = localStorage.getItem("oeilAtelier_history");
    if (savedHistory) {
      try {
        setHistoryList(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Error parsing saved history:", e);
      }
    }

    const savedTheme = localStorage.getItem("oeilAtelier_theme");
    if (savedTheme === "dark-gold" || savedTheme === "light") {
      setTheme(savedTheme);
    }
  }, []);

  const handleToggleTheme = () => {
    const nextTheme = theme === "dark-gold" ? "light" : "dark-gold";
    setTheme(nextTheme);
    localStorage.setItem("oeilAtelier_theme", nextTheme);
  };

  // Helper: Convert File to Base64
  const convertFileToBase64 = (selectedFile: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageBase64(reader.result);
      }
    };
    reader.onerror = (err) => {
      console.error("Failed to read file as Base64:", err);
      setError("Impossible de charger le fichier d'image. Réessayez.");
    };
    reader.readAsDataURL(selectedFile);
  };

  // Handler: Artwork Upload Selected
  const handleFileSelected = async (selectedFile: File) => {
    setError(null);
    setFile(selectedFile);
    setCache({}); // Reset cache for the new artwork
    setActiveToolId("style"); // Reset to style tool
    
    try {
      const base64 = await readFileAsBase64(selectedFile);
      setImageBase64(base64);
      setPreviewUrl(base64);
      
      const title = selectedFile.name.split('.')[0] || "Sans titre";
      setActiveSeries([{
        id: `uploaded-${Date.now()}`,
        title,
        imageSrc: base64,
        artist: profile.name || "Artiste",
        medium: profile.style || "Technique Mixte",
        year: new Date().getFullYear().toString()
      }]);
    } catch (err: any) {
      console.error("Failed to read uploaded file:", err);
      setError("Impossible de charger le fichier d'image. Réessayez.");
    }
  };

  // Handler: Multiple Artwork Upload / Batch Import (Up to 50 works total)
  const handleMultipleFilesSelected = async (selectedFiles: File[]) => {
    setError(null);
    if (selectedFiles.length === 0) return;
    
    // Check space left in gallery (max 50 works total)
    const currentCount = customArtworks.length;
    if (currentCount >= 50) {
      setError("Votre galerie virtuelle est pleine (maximum 50 œuvres). Veuillez supprimer des œuvres existantes pour en importer d'autres.");
      return;
    }
    
    // Determine how many we can import
    const spaceLeft = 50 - currentCount;
    const filesToImport = selectedFiles.slice(0, spaceLeft);
    const skippedCount = selectedFiles.length - filesToImport.length;
    
    setBatchLoadingStatus(`Préparation de l'importation de ${filesToImport.length} œuvre(s)...`);
    
    const importedArtworks: CustomArtwork[] = [];
    
    try {
      for (let i = 0; i < filesToImport.length; i++) {
        const file = filesToImport[i];
        setBatchLoadingStatus(`Importation ${i + 1}/${filesToImport.length} : « ${file.name.split('.')[0]} »...`);
        
        // Convert to Base64
        const base64 = await readFileAsBase64(file);
        
        // Compress image to 320x320 specifically for gallery to stay within localStorage quota
        const compressed = await resizeImageBase64(base64, 320, 320);
        
        // Generate metadata
        const title = file.name.split('.')[0] || "Sans titre";
        const artist = profile.name.trim() || "Artiste d'Atelier";
        const medium = profile.style.trim() || "Technique Mixte";
        const year = new Date().getFullYear().toString();
        
        const newArtwork: CustomArtwork = {
          id: `custom-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
          title,
          artist,
          medium,
          year,
          imageSrc: compressed
        };
        
        importedArtworks.push(newArtwork);
      }
      
      const updated = [...importedArtworks, ...customArtworks];
      setCustomArtworks(updated);
      localStorage.setItem("oeilAtelier_custom_artworks", JSON.stringify(updated));
      
      setGalleryTab("custom"); // Automatically switch to virtual gallery tab so they see them!
      
      if (skippedCount > 0) {
        setError(`Importation réussie de ${filesToImport.length} œuvre(s) en série. ${skippedCount} œuvre(s) ont été ignorées car la capacité maximale de votre galerie (50 œuvres) is atteinte.`);
      }
      
      // Select the first imported artwork to display in the main workspace and populate activeSeries
      if (importedArtworks.length > 0) {
        const firstArt = importedArtworks[0];
        setActiveSeries(importedArtworks.map(art => ({
          id: art.id,
          title: art.title,
          imageSrc: art.imageSrc,
          artist: art.artist,
          medium: art.medium,
          year: art.year
        })));
        setSelectedArtwork(firstArt);
        setImageBase64(firstArt.imageSrc);
        setPreviewUrl(firstArt.imageSrc);
        setFile(null);
        setActiveToolId("style");
        setCache({});

        // Automatically run initial global analysis for the whole series!
        setIsLoading(true);
        const headers: Record<string, string> = {
          "Content-Type": "application/json"
        };
        if (customApiKey) {
          headers["x-goog-api-key"] = customApiKey;
          headers["x-gemini-api-key"] = customApiKey;
        }
        
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            images: importedArtworks.map(art => art.imageSrc),
            image: firstArt.imageSrc,
            mimeType: "image/jpeg",
            toolId: "style",
            artistProfile: profile
          })
        });

        const data = await response.json();
        if (response.ok) {
          setCache({ style: data });
        } else {
          throw new Error(data.error?.message || "Erreur lors de l'analyse automatique.");
        }
      }
    } catch (err: any) {
      console.error("Batch import failed:", err);
      setError(`L'importation en série a échoué : ${err.message || err}`);
    } finally {
      setBatchLoadingStatus(null);
      setIsLoading(false);
    }
  };

  // Handler: Reset Current Artwork Selection
  const handleReset = () => {
    setFile(null);
    setImageBase64(null);
    setPreviewUrl(null);
    setActiveSeries([]);
    setCache({});
    setError(null);
    setIsLoading(false);
    setSelectedArtwork(null);
    setSaveFormOpen(false);
  };

  // Handler: Select a Preset or Saved Custom Artwork with auto-analysis
  const handleSelectArtwork = async (artwork: PresetArtwork | CustomArtwork) => {
    setIsPresetLoading(true);
    setError(null);
    setCache({});
    setFile(null);
    setSelectedArtwork(artwork);

    try {
      let base64 = "";
      if ("url" in artwork && !("imageSrc" in artwork)) {
        // It's a PresetArtwork
        base64 = await getArtworkBase64(artwork as PresetArtwork);
      } else {
        // It's a CustomArtwork
        base64 = (artwork as CustomArtwork).imageSrc;
      }

      setImageBase64(base64);
      setPreviewUrl(base64);
      setActiveSeries([{
        id: artwork.id,
        title: artwork.title,
        imageSrc: base64,
        artist: artwork.artist,
        medium: artwork.medium,
        year: artwork.year
      }]);
      setActiveToolId("style");
      
      // Automatically run primary analysis for a stellar instant feedback experience
      setIsLoading(true);
      const headers: Record<string, string> = {
        "Content-Type": "application/json"
      };
      if (customApiKey) {
        headers["x-goog-api-key"] = customApiKey;
        headers["x-gemini-api-key"] = customApiKey;
      }
      
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          image: base64,
          mimeType: "image/jpeg",
          toolId: "style",
          artistProfile: {
            ...profile,
            name: profile.name || artwork.artist,
            style: profile.style || artwork.medium
          }
        })
      });

      const data = await response.json();
      if (response.ok) {
        setCache({ style: data });
      } else {
        throw new Error(data.error?.message || "Erreur lors de l'analyse automatique.");
      }
    } catch (err: any) {
      console.error("Auto analysis failed on select:", err);
      setError(`L'œuvre d'art a été chargée, mais l'analyse initiale a échoué : ${err.message}`);
    } finally {
      setIsPresetLoading(false);
      setIsLoading(false);
    }
  };

  // Handler: Remove item from active series
  const handleRemoveFromSeries = (itemId: string) => {
    const updated = activeSeries.filter(item => item.id !== itemId);
    setActiveSeries(updated);
    setCache({}); // Reset cache as the collection has changed
    
    if (updated.length > 0) {
      // Focus on the first remaining item
      const nextFocus = updated[0];
      setImageBase64(nextFocus.imageSrc);
      setPreviewUrl(nextFocus.imageSrc);
    } else {
      // Series is empty, reset back to main screen
      handleReset();
    }
  };

  // Handler: Add items directly to active series from file picker
  const handleAddToSeriesFromFiles = async (filesToAdd: File[]) => {
    setError(null);
    if (filesToAdd.length === 0) return;
    
    try {
      const newItems: typeof activeSeries = [];
      for (const file of filesToAdd) {
        if (!file.type.startsWith("image/")) continue;
        const base64 = await readFileAsBase64(file);
        const title = file.name.split('.')[0] || "Œuvre";
        newItems.push({
          id: `uploaded-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title,
          imageSrc: base64,
          artist: profile.name || "Artiste",
          medium: profile.style || "Technique Mixte",
          year: new Date().getFullYear().toString()
        });
      }
      
      const updated = [...activeSeries, ...newItems];
      setActiveSeries(updated);
      setCache({}); // Reset cache
      
      // Auto-focus the last added item
      if (newItems.length > 0) {
        const lastAdded = newItems[newItems.length - 1];
        setImageBase64(lastAdded.imageSrc);
        setPreviewUrl(lastAdded.imageSrc);
      }
    } catch (err: any) {
      console.error("Failed to add files to series:", err);
      setError("Impossible d'ajouter ces images à la série.");
    }
  };

  // Handler: Toggle artwork in active analysis series
  const handleToggleInSeries = async (item: { id: string; title: string; imageSrc: string; artist?: string; medium?: string; year?: string }) => {
    setError(null);
    setCache({}); // Reset cache since the active group of works has changed
    
    // Check if it's a preset URL that we need to convert to base64 for proper offline analysis
    let finalImageSrc = item.imageSrc;
    if (item.imageSrc.startsWith("http") || item.imageSrc.startsWith("/")) {
      try {
        setIsPresetLoading(true);
        // Find if this is a preset and fetch base64
        const matchedPreset = PRESET_ARTWORKS.find(p => p.id === item.id);
        if (matchedPreset) {
          finalImageSrc = await getArtworkBase64(matchedPreset);
        }
      } catch (err) {
        console.error("Failed to load base64 for series preset:", err);
      } finally {
        setIsPresetLoading(false);
      }
    }

    const isInSeries = activeSeries.some(s => s.id === item.id);
    let updatedSeries = [];
    
    if (isInSeries) {
      updatedSeries = activeSeries.filter(s => s.id !== item.id);
    } else {
      updatedSeries = [...activeSeries, { ...item, imageSrc: finalImageSrc }];
    }
    
    setActiveSeries(updatedSeries);
    
    if (updatedSeries.length > 0) {
      // Focus on the newly interacted item or first item
      const focusItem = isInSeries ? updatedSeries[0] : { ...item, imageSrc: finalImageSrc };
      setImageBase64(focusItem.imageSrc);
      setPreviewUrl(focusItem.imageSrc);
      setFile(null);
      setActiveToolId("style");
    } else {
      // If the series became empty, clean up the workbench
      handleReset();
    }
  };

  // Handler: Open the custom artwork metadata form
  const handleOpenSaveForm = () => {
    setSaveTitle(file?.name?.split(".")[0] || (selectedArtwork ? selectedArtwork.title : "") || "Œuvre d'Atelier");
    setSaveArtist(profile.name || (selectedArtwork ? selectedArtwork.artist : "") || "Artiste");
    setSaveMedium(profile.style || (selectedArtwork ? selectedArtwork.medium : "") || "Technique Mixte");
    setSaveYear(new Date().getFullYear().toString());
    setSaveFormOpen(true);
  };

  // Handler: Save current active artwork to Ma Galerie Virtuelle
  const handleSaveCustomArtwork = async () => {
    if (!imageBase64) return;
    
    if (customArtworks.length >= 50) {
      setError("Votre galerie virtuelle est pleine (maximum 50 œuvres). Supprimez une œuvre existante pour en ajouter une nouvelle.");
      return;
    }

    try {
      // Compress to 320x320 specifically for the gallery thumbnail to save localStorage space!
      const compressed = await resizeImageBase64(imageBase64, 320, 320);
      
      const newArtwork: CustomArtwork = {
        id: `custom-${Date.now()}`,
        title: saveTitle.trim() || "Œuvre d'Atelier",
        artist: saveArtist.trim() || "Artiste d'Atelier",
        medium: saveMedium.trim() || "Technique Mixte",
        year: saveYear.trim() || new Date().getFullYear().toString(),
        imageSrc: compressed
      };

      const updated = [newArtwork, ...customArtworks];
      setCustomArtworks(updated);
      localStorage.setItem("oeilAtelier_custom_artworks", JSON.stringify(updated));
      
      // Reset form states
      setSaveFormOpen(false);
      setSelectedArtwork(newArtwork);
    } catch (err) {
      console.error("Failed to save custom artwork:", err);
      setError("Impossible d'enregistrer l'œuvre d'art dans votre galerie d'atelier.");
    }
  };

  // Handler: Delete custom artwork
  const handleDeleteCustomArtwork = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customArtworks.filter(art => art.id !== id);
    setCustomArtworks(updated);
    localStorage.setItem("oeilAtelier_custom_artworks", JSON.stringify(updated));
    if (selectedArtwork && selectedArtwork.id === id) {
      setSelectedArtwork(null);
    }
  };

  // Handler: Execute Gemini Analysis
  const executeAnalysis = async (toolIdToRun: string) => {
    if (!imageBase64 || isLoading) return;
    setIsLoading(true);
    setError(null);

    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    };
    if (customApiKey) {
      headers["x-goog-api-key"] = customApiKey;
      headers["x-gemini-api-key"] = customApiKey;
    }

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          image: imageBase64,
          images: activeSeries.length > 1 ? activeSeries.map(item => item.imageSrc) : undefined,
          mimeType: file ? file.type : "image/jpeg",
          toolId: toolIdToRun,
          artistProfile: profile
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Une erreur inconnue s'est produite.");
      }

      // 1. Save results to Session Cache
      setCache((prev) => ({ ...prev, [toolIdToRun]: data }));

      // 2. Format a summary sentence from the result
      let summaryText = "";
      if (data.style) {
        summaryText = `Analyse de style: ${data.style}`;
      } else if (data.harmonie) {
        summaryText = `Palette de couleurs: ${data.harmonie}`;
      } else if (data.titre_critique) {
        summaryText = `Critique: ${data.titre_critique}`;
      } else if (data.titre_oeuvre) {
        summaryText = `Certificat pour « ${data.titre_oeuvre} »`;
      } else if (data.titre_expo) {
        summaryText = `Expo: ${data.titre_expo}`;
      } else if (data.titre_event) {
        summaryText = `Vernissage: ${data.titre_event}`;
      } else if (data.titre_poeme) {
        summaryText = `Poème: ${data.titre_poeme}`;
      } else {
        const foundTool = TOOLS.find((t) => t.id === toolIdToRun);
        summaryText = `Génération ${foundTool?.label || "Outil"}`;
      }

      // Append series indicator if applicable
      if (activeSeries.length > 1) {
        summaryText = `[Série de ${activeSeries.length} œuvres] ${summaryText}`;
      }

      // 3. Save to Local History Logs
      const activeTool = TOOLS.find((t) => t.id === toolIdToRun);
      
      let compressedImage = imageBase64;
      try {
        compressedImage = await resizeImageBase64(imageBase64, 300, 300);
      } catch (resizeErr) {
        console.warn("Failed to compress image for history:", resizeErr);
      }

      const newHistoryItem: HistoryItem = {
        id: Date.now(),
        date: new Date().toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit"
        }),
        filename: activeSeries.length > 1 ? `Série de ${activeSeries.length} œuvres` : (file ? file.name : "oeuvre_atelier.jpg"),
        toolId: toolIdToRun,
        toolLabel: activeTool?.label || "Outil",
        summary: summaryText,
        result: data,
        imageSrc: compressedImage
      };

      const updatedHistory = [newHistoryItem, ...historyList].slice(0, 50); // limit to 50 items
      setHistoryList(updatedHistory);
      
      // Save safely to prevent localStorage QuotaExceededError
      try {
        localStorage.setItem("oeilAtelier_history", JSON.stringify(updatedHistory));
      } catch (storageError) {
        console.warn("localStorage quota exceeded, pruning history images to save space...");
        let prunedHistory = [...updatedHistory];
        
        // Step 1: Keep imageSrc only for the 3 most recent items, clear for older ones
        for (let i = 3; i < prunedHistory.length; i++) {
          if (prunedHistory[i]) {
            prunedHistory[i] = { ...prunedHistory[i], imageSrc: "" };
          }
        }
        
        try {
          localStorage.setItem("oeilAtelier_history", JSON.stringify(prunedHistory));
          setHistoryList(prunedHistory);
        } catch (innerError) {
          console.warn("Still exceeding quota. Keeping imageSrc only for the single most recent item...");
          // Step 2: Keep imageSrc only for the most recent item, clear for all others
          for (let i = 1; i < prunedHistory.length; i++) {
            if (prunedHistory[i]) {
              prunedHistory[i] = { ...prunedHistory[i], imageSrc: "" };
            }
          }
          
          try {
            localStorage.setItem("oeilAtelier_history", JSON.stringify(prunedHistory));
            setHistoryList(prunedHistory);
          } catch (lastError) {
            console.error("Even minimal history exceeds quota. Truncating history to 5 items without images...");
            // Step 3: Clear all images and limit to 5 entries
            const tinyHistory = prunedHistory.slice(0, 5).map(item => ({ ...item, imageSrc: "" }));
            try {
              localStorage.setItem("oeilAtelier_history", JSON.stringify(tinyHistory));
              setHistoryList(tinyHistory);
            } catch (err) {
              console.error("Failed to save history completely. Resetting history state.");
              localStorage.removeItem("oeilAtelier_history");
              setHistoryList([]);
            }
          }
        }
      }

    } catch (err: any) {
      console.error("Analysis execution error:", err);
      setError(err.message || "Une erreur réseau ou serveur s'est produite lors de l'analyse.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handler: Select a Tool
  const handleSelectTool = async (toolId: string) => {
    setActiveToolId(toolId);
    setError(null);
    // If we don't have results for this tool yet, and an image is loaded, launch the analysis immediately
    if (!cache[toolId] && imageBase64) {
      await executeAnalysis(toolId);
    }
  };

  // Handler: Force manual retry / rerun
  const handleRerun = async () => {
    await executeAnalysis(activeToolId);
  };

  // Handler: Clear History
  const handleClearHistory = () => {
    setHistoryList([]);
    localStorage.removeItem("oeilAtelier_history");
  };

  // Handler: Load past History item
  const handleLoadHistoryItem = (item: HistoryItem) => {
    setImageBase64(item.imageSrc);
    setPreviewUrl(item.imageSrc);
    setFile(null); // File handle is lost since we reloaded from base64 string
    setActiveToolId(item.toolId);
    
    // Seed cache with the saved result of this history item
    setCache({
      [item.toolId]: item.result
    });
    setError(null);
  };

  return (
    <div className={`min-h-screen relative overflow-x-hidden flex flex-col justify-between selection:bg-[#c9a84c] selection:text-black transition-colors duration-500 ${
      theme === "dark-gold"
        ? "bg-[#0A0A0A] text-[#E0E0E0] border-[#141414] border-[12px] sm:border-[16px]"
        : "bg-[#FAF7F2] text-[#2C2A29] border-[#e8dfd3] border-[12px] sm:border-[16px]"
    }`}>
      
      {/* Background film-grain noise */}
      <div 
        className="fixed inset-0 opacity-[0.02] pointer-events-none z-0 bg-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Foreground Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col">
        
        {/* Header */}
        <header className={`mb-8 flex flex-col md:flex-row md:items-baseline justify-between gap-6 pb-6 border-b transition-colors duration-500 ${
          theme === "dark-gold" ? "border-white/10" : "border-stone-200"
        }`}>
          <div className="text-center md:text-left flex flex-col">
            <span className={`text-[11px] font-sans font-bold tracking-[0.35em] uppercase mb-1.5 transition-colors duration-300 ${
              theme === "dark-gold" ? "text-neutral-500" : "text-stone-500"
            }`}>
              INTELLIGENCE ARTIFICIELLE & BEAUX-ARTS
            </span>
            <h1 className={`font-serif font-light text-5xl sm:text-6xl tracking-tight leading-none transition-colors duration-300 ${
              theme === "dark-gold" ? "text-white" : "text-stone-950"
            }`}>
              L'Œil de <span className="italic text-[#c9a84c] font-light font-serif">l'Atelier</span>
            </h1>
            <p className={`text-[10px] tracking-[0.25em] uppercase font-sans mt-3.5 transition-colors duration-300 ${
              theme === "dark-gold" ? "text-[#c9a84c]" : "text-[#9c7d2b]"
            }`}>
              16 OUTILS IA POUR LES ARTISTES
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 items-center md:items-baseline">
            <div className={`border-l pl-6 hidden sm:block text-left transition-colors duration-300 ${
              theme === "dark-gold" ? "border-white/20" : "border-black/10"
            }`}>
              <p className={`text-[10px] uppercase tracking-widest font-sans transition-colors duration-300 ${
                theme === "dark-gold" ? "text-neutral-500" : "text-stone-500"
              }`}>PORTFOLIO STATUS</p>
              <p className="text-base font-light italic font-serif">Ready for Review</p>
            </div>

            {/* Theme Selector Toggle */}
            <button
              onClick={handleToggleTheme}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs tracking-wider uppercase font-sans font-black transition-all duration-300 rounded-none shadow-md border ${
                theme === "dark-gold"
                  ? "bg-black text-[#c9a84c] border-[#c9a84c] hover:bg-[#c9a84c] hover:text-black"
                  : "bg-white text-stone-900 border-stone-300 hover:bg-stone-50"
              }`}
            >
              <Paintbrush className="w-4 h-4" />
              {theme === "dark-gold" ? "Mode Clair" : "Noir & Or"}
            </button>

            {/* Donation System Trigger */}
            <button
              onClick={() => setIsDonationOpen(true)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs tracking-wider uppercase font-sans font-black transition-all duration-300 rounded-none shadow-md border ${
                theme === "dark-gold"
                  ? "bg-rose-950/20 text-rose-300 border-rose-900/40 hover:bg-rose-900 hover:text-white"
                  : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 hover:text-rose-800"
              }`}
            >
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
              Soutenir l'Atelier
            </button>

            <button
              onClick={() => setIsHistoryOpen(true)}
              className={`flex items-center gap-2 px-5 py-2.5 text-xs tracking-wider uppercase font-sans font-black transition-all duration-300 rounded-none shadow-md border-none ${
                theme === "dark-gold"
                  ? "bg-[#c9a84c] text-black hover:bg-white"
                  : "bg-stone-900 text-white hover:bg-[#c9a84c] hover:text-black"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Carnet de Bord
            </button>
          </div>
        </header>

        {/* Presentation & App Guide Banner */}
        <AppDescriptionBanner theme={theme} />

        {/* Configuration panel */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3 border-b pb-2 border-[#c9a84c]/30">
            <span className="bg-[#c9a84c] text-black font-mono font-bold text-xs px-2.5 py-1 uppercase tracking-wider">
              Étape 1 sur 4
            </span>
            <div>
              <h3 className={`text-sm sm:text-base font-serif font-bold uppercase tracking-wider ${
                theme === "dark-gold" ? "text-white" : "text-stone-900"
              }`}>
                Profil & Intention de l'Artiste (Simulateur Personnalisé)
              </h3>
              <p className={`text-xs font-sans mt-0.5 ${
                theme === "dark-gold" ? "text-neutral-400" : "text-stone-600"
              }`}>
                Renseignez vos coordonnées et votre univers plastique pour adapter les réponses du simulateur d'atelier.
              </p>
            </div>
          </div>

          <ArtistProfileForm
            profile={profile}
            setProfile={setProfile}
            customApiKey={customApiKey}
            setCustomApiKey={setCustomApiKey}
            theme={theme}
          />
        </div>

        {/* Main Interface Workspace */}
        <main className="flex-1 flex flex-col justify-center">
          {!previewUrl ? (
            /* Upload Screen & Art Library */
            <div className="animate-fadeIn py-4 space-y-10">
              
              {/* Step 2 Chapter Heading */}
              <div className="flex items-center gap-3 border-b pb-2.5 border-[#c9a84c]/30">
                <span className="bg-[#c9a84c] text-black font-mono font-bold text-xs px-2.5 py-1 uppercase tracking-wider">
                  Étape 2 sur 4
                </span>
                <div>
                  <h3 className={`text-sm sm:text-base font-serif font-bold uppercase tracking-wider ${
                    theme === "dark-gold" ? "text-white" : "text-stone-900"
                  }`}>
                    Insérer l'Image d'une Œuvre ou Constituer une Série de Vernissage
                  </h3>
                  <p className={`text-xs font-sans mt-0.5 ${
                    theme === "dark-gold" ? "text-neutral-400" : "text-stone-600"
                  }`}>
                    Glissez-déposez le visuel d'une création unique ou sélectionnez plusieurs toiles pour simuler un vernissage complet.
                  </p>
                </div>
              </div>

              {/* Main Drag-and-Drop Area */}
              <div>
                <DropZone 
                  onFileSelected={handleFileSelected} 
                  onMultipleFilesSelected={handleMultipleFilesSelected} 
                  theme={theme} 
                />
              </div>

              {/* Loader indicator for presets or batch imports */}
              {(isPresetLoading || batchLoadingStatus) && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-8 bg-black/95 transition-opacity duration-300">
                  <div className="text-center space-y-6 max-w-lg">
                    <Loader2 className="w-12 h-12 text-[#c9a84c] animate-spin mx-auto" />
                    <h3 className="text-[#f0e8d8] font-serif font-light text-2xl tracking-wide uppercase">
                      {batchLoadingStatus ? "Vernissage & Transfert de Série..." : "Curation & Préparation Artistique..."}
                    </h3>
                    <p className="text-[#c9a84c] font-sans text-xs tracking-widest uppercase">
                      {batchLoadingStatus ? "Mise en ligne de vos créations d'atelier" : "Génération du chef-d'œuvre virtuel"}
                    </p>
                    <div className="h-[1px] w-24 bg-[#c9a84c]/40 mx-auto" />
                    <p className="text-neutral-400 font-serif italic text-sm leading-relaxed px-4">
                      {batchLoadingStatus ? batchLoadingStatus : (selectedArtwork?.id ? `« ${PRESET_ARTWORKS.find(art => art.id === selectedArtwork.id)?.styleDesc || "Chargement..."} »` : "« L'art ne reproduit pas le visible, il rend visible. » — Paul Klee")}
                    </p>
                  </div>
                </div>
              )}

              {/* Decorative Divider */}
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t transition-colors duration-300 ${
                    theme === "dark-gold" ? "border-white/10" : "border-stone-200"
                  }`} />
                </div>
                <div className={`relative px-6 py-1 font-serif italic text-sm transition-all duration-300 flex items-center gap-2 ${
                  theme === "dark-gold" ? "bg-[#0A0A0A] text-[#c9a84c]" : "bg-[#FAF7F2] text-[#9c7d2b]"
                }`}>
                  <Layers className="w-4 h-4" />
                  Sélectionner un chef-d'œuvre existant ou vos œuvres
                </div>
              </div>

              {/* Gallery section containing at least 15 artworks */}
              <div className={`border p-6 sm:p-8 rounded-none transition-colors duration-300 ${
                theme === "dark-gold" ? "bg-[#111111] border-white/10 shadow-2xl" : "bg-white border-[#e8dfd3] shadow-lg"
              }`}>
                {/* Tabs Selector */}
                <div className="flex border-b border-white/5 mb-6 justify-center sm:justify-start gap-4">
                  <button
                    onClick={() => setGalleryTab("presets")}
                    className={`pb-3 text-xs tracking-widest uppercase font-sans font-bold border-b-2 transition-all duration-300 flex items-center gap-2 ${
                      galleryTab === "presets"
                        ? "border-[#c9a84c] text-[#c9a84c]"
                        : "border-transparent text-neutral-500 hover:text-neutral-300"
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    Chefs-d'œuvre (15)
                  </button>
                  <button
                    onClick={() => setGalleryTab("custom")}
                    className={`pb-3 text-xs tracking-widest uppercase font-sans font-bold border-b-2 transition-all duration-300 flex items-center gap-2 ${
                      galleryTab === "custom"
                        ? "border-[#c9a84c] text-[#c9a84c]"
                        : "border-transparent text-neutral-500 hover:text-neutral-300"
                    }`}
                  >
                    <FolderPlus className="w-4 h-4" />
                    Ma Galerie Virtuelle ({customArtworks.length}/50)
                  </button>
                </div>

                {/* Presets Gallery Grid */}
                {galleryTab === "presets" && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                    {PRESET_ARTWORKS.map((artwork) => (
                      <div
                        key={artwork.id}
                        onClick={() => handleSelectArtwork(artwork)}
                        className={`group border cursor-pointer relative overflow-hidden transition-all duration-300 flex flex-col justify-between ${
                          theme === "dark-gold"
                            ? "bg-[#0d0d0d] border-white/10 hover:border-[#c9a84c]/50"
                            : "bg-stone-50 border-stone-200 hover:border-[#c9a84c]/50 hover:bg-stone-100/50"
                        }`}
                      >
                        {/* Artwork Frame Accent */}
                        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-transparent group-hover:bg-[#c9a84c] transition-colors" />
                        
                        <div className="space-y-2">
                          {/* Image Box */}
                          <div className="aspect-[4/3] w-full overflow-hidden relative bg-black flex items-center justify-center">
                            <img
                              src={artwork.url}
                              alt={artwork.title}
                              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                              referrerPolicy="no-referrer"
                              loading="lazy"
                            />
                            {/* Inner ambient shine */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                            
                            {/* Year badge */}
                            <span className="absolute bottom-1.5 right-1.5 text-[8px] font-mono tracking-widest uppercase bg-black/70 text-[#c9a84c] px-1.5 py-0.5 border border-[#c9a84c]/20">
                              {artwork.year}
                            </span>
                          </div>

                          {/* Meta Details */}
                          <div className="px-3 pb-1">
                            <h4 className={`text-xs font-serif font-bold italic tracking-wide line-clamp-1 group-hover:text-[#c9a84c] transition-colors ${
                              theme === "dark-gold" ? "text-neutral-200" : "text-stone-900"
                            }`}>
                              {artwork.title}
                            </h4>
                            <p className="text-[9px] uppercase tracking-widest text-neutral-400 font-sans truncate">
                              {artwork.artist}
                            </p>
                            <p className="text-[8px] font-sans text-neutral-500 truncate italic mt-0.5">
                              {artwork.medium}
                            </p>
                          </div>
                        </div>

                        {/* Hover Overlay Button Action */}
                        <div className="p-2 border-t border-white/5 bg-black/10 flex gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectArtwork(artwork);
                            }}
                            className={`flex-1 py-1 text-[8px] tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-1.5 font-bold ${
                              theme === "dark-gold"
                                ? "bg-neutral-900 text-[#c9a84c] hover:bg-[#c9a84c] hover:text-black"
                                : "bg-stone-200 text-stone-700 hover:bg-[#c9a84c] hover:text-black"
                            }`}
                          >
                            <Eye className="w-3 h-3" />
                            Analyser
                          </button>
                          
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleInSeries({
                                id: artwork.id,
                                title: artwork.title,
                                imageSrc: artwork.url,
                                artist: artwork.artist,
                                medium: artwork.medium,
                                year: artwork.year
                              });
                            }}
                            className={`px-2 py-1 text-[8px] tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-1 font-bold ${
                              activeSeries.some(item => item.id === artwork.id)
                                ? "bg-[#c9a84c] text-black"
                                : (theme === "dark-gold" ? "bg-neutral-900 text-neutral-400 hover:text-[#c9a84c]" : "bg-stone-200 text-stone-500 hover:text-[#c9a84c]")
                            }`}
                            title={activeSeries.some(item => item.id === artwork.id) ? "Retirer de la série de vernissage" : "Ajouter à la série de vernissage"}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Custom Gallery Grid */}
                {galleryTab === "custom" && (
                  <div>
                    {customArtworks.length === 0 ? (
                      <div className="text-center py-12 space-y-4">
                        <div className="w-12 h-12 rounded-none border border-white/10 flex items-center justify-center mx-auto text-neutral-500">
                          <FolderPlus className="w-5 h-5" />
                        </div>
                        <div className="max-w-md mx-auto space-y-1.5">
                          <p className={`font-serif text-base italic ${
                            theme === "dark-gold" ? "text-neutral-300" : "text-stone-700"
                          }`}>
                            Votre galerie d'atelier est vide pour l'instant
                          </p>
                          <p className="text-[10px] font-sans uppercase tracking-widest text-neutral-500 leading-relaxed">
                            Chargez une œuvre d'art via la zone de dépôt ci-dessus, puis utilisez l'option de sauvegarde pour la conserver dans cette galerie virtuelle.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                        {customArtworks.map((artwork) => (
                          <div
                            key={artwork.id}
                            onClick={() => handleSelectArtwork(artwork)}
                            className={`group border cursor-pointer relative overflow-hidden transition-all duration-300 flex flex-col justify-between ${
                              theme === "dark-gold"
                                ? "bg-[#0d0d0d] border-white/10 hover:border-[#c9a84c]/50"
                                : "bg-stone-50 border-stone-200 hover:border-[#c9a84c]/50 hover:bg-stone-100/50"
                            }`}
                          >
                            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-transparent group-hover:bg-[#c9a84c] transition-colors" />

                            <div className="space-y-2">
                              {/* Image Box */}
                              <div className="aspect-[4/3] w-full overflow-hidden relative bg-black flex items-center justify-center">
                                <img
                                  src={artwork.imageSrc}
                                  alt={artwork.title}
                                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                  referrerPolicy="no-referrer"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                                
                                {/* Trash delete button */}
                                <button
                                  onClick={(e) => handleDeleteCustomArtwork(artwork.id, e)}
                                  className="absolute top-1.5 right-1.5 p-1.5 bg-black/60 hover:bg-rose-950 hover:text-rose-400 text-neutral-400 transition-colors border border-white/5"
                                  title="Supprimer de la galerie"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>

                                {/* Year badge */}
                                <span className="absolute bottom-1.5 right-1.5 text-[8px] font-mono tracking-widest uppercase bg-black/70 text-[#c9a84c] px-1.5 py-0.5 border border-[#c9a84c]/20">
                                  {artwork.year}
                                </span>
                              </div>

                              {/* Meta Details */}
                              <div className="px-3 pb-1">
                                <h4 className={`text-xs font-serif font-bold italic tracking-wide line-clamp-1 group-hover:text-[#c9a84c] transition-colors ${
                                  theme === "dark-gold" ? "text-neutral-200" : "text-stone-900"
                                }`}>
                                  {artwork.title}
                                </h4>
                                <p className="text-[9px] uppercase tracking-widest text-neutral-400 font-sans truncate">
                                  {artwork.artist}
                                </p>
                                <p className="text-[8px] font-sans text-neutral-500 truncate italic mt-0.5">
                                  {artwork.medium}
                                </p>
                              </div>
                            </div>

                            {/* Hover Overlay Button Action */}
                            <div className="p-2 border-t border-white/5 bg-black/10 flex gap-1.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectArtwork(artwork);
                                }}
                                className={`flex-1 py-1 text-[8px] tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-1.5 font-bold ${
                                  theme === "dark-gold"
                                    ? "bg-neutral-900 text-[#c9a84c] hover:bg-[#c9a84c] hover:text-black"
                                    : "bg-stone-200 text-stone-700 hover:bg-[#c9a84c] hover:text-black"
                                }`}
                              >
                                <Eye className="w-3 h-3" />
                                Analyser
                              </button>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleInSeries({
                                    id: artwork.id,
                                    title: artwork.title,
                                    imageSrc: artwork.imageSrc,
                                    artist: artwork.artist,
                                    medium: artwork.medium,
                                    year: artwork.year
                                  });
                                }}
                                className={`px-2 py-1 text-[8px] tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-1 font-bold ${
                                  activeSeries.some(item => item.id === artwork.id)
                                    ? "bg-[#c9a84c] text-black"
                                    : (theme === "dark-gold" ? "bg-neutral-900 text-neutral-400 hover:text-[#c9a84c]" : "bg-stone-200 text-stone-500 hover:text-[#c9a84c]")
                                }`}
                                title={activeSeries.some(item => item.id === artwork.id) ? "Retirer de la série de vernissage" : "Ajouter à la série de vernissage"}
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Active Dashboard */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
              
              {/* Left Column: Visual Artwork & Tools list */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Visual Framing Card */}
                <div className={`border p-4 rounded-none shadow-xl relative overflow-hidden group transition-colors duration-300 ${
                  theme === "dark-gold" ? "bg-[#111111] border-white/10" : "bg-white border-[#e8dfd3]"
                }`}>
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#c9a84c]" />
                  
                  {/* Elegant gold corner accents */}
                  <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#c9a84c]/40" />
                  <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#c9a84c]/40" />
                  <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#c9a84c]/40" />
                  <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#c9a84c]/40" />

                  <div className={`aspect-square flex items-center justify-center overflow-hidden border rounded-none relative transition-colors duration-300 ${
                    theme === "dark-gold" ? "bg-black border-neutral-900" : "bg-stone-50 border-stone-200"
                  }`}>
                    <img
                      src={previewUrl}
                      alt="Aperçu de l'œuvre d'art"
                      className="max-w-full max-h-full object-contain filter brightness-95 group-hover:scale-[1.01] transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  
                  {file && (
                    <p className={`text-[10px] text-center font-mono mt-3 uppercase tracking-wider truncate px-4 ${
                      theme === "dark-gold" ? "text-neutral-500" : "text-stone-500"
                    }`}>
                      {file.name} · {Math.round(file.size / 1024)} ko
                    </p>
                  )}
                </div>

                {/* Active Series Curation Workspace */}
                {activeSeries.length > 0 && (
                  <div className={`border p-4 rounded-none transition-colors duration-300 animate-fadeIn ${
                    theme === "dark-gold" ? "bg-[#111111] border-white/10" : "bg-white border-[#e8dfd3]"
                  }`}>
                    <div className="flex items-center justify-between mb-3 border-b border-[#c9a84c]/20 pb-2">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-[#c9a84c]" />
                        <h4 className="text-xs font-sans font-bold tracking-widest uppercase text-neutral-300">
                          Série de Vernissage en cours
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono bg-[#c9a84c]/20 text-[#c9a84c] px-2 py-0.5 font-bold">
                        {activeSeries.length} ŒUVRE{activeSeries.length > 1 ? 'S' : ''}
                      </span>
                    </div>

                    <p className="text-[10px] text-neutral-400 italic mb-4 leading-relaxed">
                      {activeSeries.length > 1 
                        ? "Analyse globale activée. L'IA étudie les connexions esthétiques, thématiques et la continuité de la série." 
                        : "Ajoutez d'autres œuvres depuis la galerie ci-dessous pour activer l'analyse globale de la série."
                      }
                    </p>

                    {/* Horizontal list of thumbnails */}
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
                      {activeSeries.map((item) => {
                        const isFocused = item.imageSrc === imageBase64;
                        return (
                          <div 
                            key={item.id}
                            onClick={() => {
                              setImageBase64(item.imageSrc);
                              setPreviewUrl(item.imageSrc);
                            }}
                            className={`relative flex-shrink-0 w-16 h-16 border cursor-pointer group transition-all duration-300 ${
                              isFocused 
                                ? "border-[#c9a84c] scale-105" 
                                : "border-neutral-800 hover:border-neutral-500"
                            }`}
                          >
                            <img 
                              src={item.imageSrc} 
                              alt={item.title} 
                              className="w-full h-full object-cover" 
                            />
                            {/* Overlay focus indicator */}
                            {isFocused && (
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <span className="text-[9px] font-mono font-bold text-[#c9a84c] bg-black/80 px-1 py-0.5 scale-75 border border-[#c9a84c]/30">FOCUS</span>
                              </div>
                            )}
                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFromSeries(item.id);
                              }}
                              className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-black/80 border border-white/20 text-neutral-400 hover:text-white hover:bg-rose-950 flex items-center justify-center transition-colors animate-fadeIn"
                              title="Retirer de la série"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        );
                      })}
                      
                      {/* Upload more directly into series */}
                      <label className={`w-16 h-16 flex-shrink-0 border border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
                        theme === "dark-gold" 
                          ? "border-neutral-800 hover:border-[#c9a84c]/30 text-neutral-500 hover:text-[#c9a84c]" 
                          : "border-stone-300 hover:border-[#c9a84c]/30 text-stone-400 hover:text-stone-700"
                      }`}>
                        <Plus className="w-5 h-5" />
                        <span className="text-[8px] uppercase tracking-widest mt-1">Ajouter</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          multiple 
                          onChange={(e) => {
                            if (e.target.files) {
                              handleAddToSeriesFromFiles(Array.from(e.target.files));
                            }
                          }}
                          className="hidden" 
                        />
                      </label>
                    </div>
                  </div>
                )}

                {/* Main Action Bar */}
                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    className={`flex-1 py-3 border text-xs tracking-widest uppercase transition-all duration-300 rounded-none flex items-center justify-center gap-2 font-bold ${
                      theme === "dark-gold"
                        ? "border-white/10 text-neutral-400 hover:text-white hover:border-[#c9a84c]/40 bg-[#0d0d0d]"
                        : "border-[#e8dfd3] text-stone-600 hover:text-stone-900 hover:border-[#c9a84c]/60 bg-white shadow-sm"
                    }`}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Changer d'œuvre
                  </button>

                  <button
                    onClick={handleRerun}
                    disabled={isLoading}
                    className={`flex-1 py-3 font-black text-xs tracking-widest uppercase transition-all duration-300 rounded-none flex items-center justify-center gap-2 shadow-lg border-none ${
                      theme === "dark-gold"
                        ? "bg-[#c9a84c] hover:bg-white text-black disabled:opacity-50"
                        : "bg-stone-900 hover:bg-[#c9a84c] hover:text-black text-white disabled:opacity-50"
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    {isLoading ? "Observation…" : "Réanalyser"}
                  </button>
                </div>

                {/* Save to personal gallery section */}
                {previewUrl && (
                  <div className="space-y-3">
                    {/* Check if current artwork is already saved */}
                    {customArtworks.some(art => art.imageSrc === imageBase64) || (selectedArtwork && !("url" in selectedArtwork)) ? (
                      <div className={`p-3 text-center border text-[11px] font-sans tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-300 ${
                        theme === "dark-gold" 
                          ? "bg-neutral-900/40 border-[#c9a84c]/20 text-[#c9a84c]" 
                          : "bg-[#fdfcf7] border-[#c9a84c]/30 text-[#9c7d2b]"
                      }`}>
                        <Check className="w-4 h-4 text-[#c9a84c]" />
                        Œuvre enregistrée dans votre galerie d'atelier
                      </div>
                    ) : (
                      <>
                        {!saveFormOpen ? (
                          <button
                            onClick={handleOpenSaveForm}
                            className={`w-full py-2.5 border text-[11px] tracking-widest uppercase transition-all duration-300 rounded-none flex items-center justify-center gap-2 font-bold ${
                              theme === "dark-gold"
                                ? "border-white/10 text-neutral-300 hover:text-white hover:border-[#c9a84c]/40 bg-black/40"
                                : "border-[#e8dfd3] text-stone-700 hover:text-stone-900 hover:border-[#c9a84c]/50 bg-stone-50"
                            }`}
                          >
                            <FolderPlus className="w-4 h-4 text-[#c9a84c]" />
                            Conserver dans ma galerie (Max 50)
                          </button>
                        ) : (
                          <div className={`border p-4 transition-all duration-300 animate-fadeIn ${
                            theme === "dark-gold" ? "bg-[#141414] border-white/10" : "bg-white border-[#e8dfd3]"
                          }`}>
                            <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/5">
                              <h4 className="text-xs uppercase tracking-widest font-bold text-[#c9a84c] flex items-center gap-1.5">
                                <FolderPlus className="w-3.5 h-3.5" />
                                Enregistrer l'œuvre d'art
                              </h4>
                              <button 
                                onClick={() => setSaveFormOpen(false)}
                                className="text-neutral-500 hover:text-neutral-200 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <div className="space-y-3 text-left">
                              <div>
                                <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-1">Titre de l'œuvre</label>
                                <input
                                  type="text"
                                  value={saveTitle}
                                  onChange={(e) => setSaveTitle(e.target.value)}
                                  placeholder="Entrez le titre..."
                                  className={`w-full px-3 py-1.5 text-xs rounded-none border focus:outline-none transition-colors ${
                                    theme === "dark-gold"
                                      ? "bg-black border-white/10 text-white focus:border-[#c9a84c]"
                                      : "bg-white border-stone-200 text-stone-900 focus:border-[#c9a84c]"
                                  }`}
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-1">Artiste</label>
                                  <input
                                    type="text"
                                    value={saveArtist}
                                    onChange={(e) => setSaveArtist(e.target.value)}
                                    placeholder="Nom de l'artiste"
                                    className={`w-full px-3 py-1.5 text-xs rounded-none border focus:outline-none transition-colors ${
                                      theme === "dark-gold"
                                        ? "bg-black border-white/10 text-white focus:border-[#c9a84c]"
                                        : "bg-white border-stone-200 text-stone-900 focus:border-[#c9a84c]"
                                    }`}
                                  />
                                </div>
                                <div>
                                  <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-1">Année</label>
                                  <input
                                    type="text"
                                    value={saveYear}
                                    onChange={(e) => setSaveYear(e.target.value)}
                                    placeholder="Ex: 2026"
                                    className={`w-full px-3 py-1.5 text-xs rounded-none border focus:outline-none transition-colors ${
                                      theme === "dark-gold"
                                        ? "bg-black border-white/10 text-white focus:border-[#c9a84c]"
                                        : "bg-white border-stone-200 text-stone-900 focus:border-[#c9a84c]"
                                    }`}
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-1">Technique / Médium</label>
                                <input
                                  type="text"
                                  value={saveMedium}
                                  onChange={(e) => setSaveMedium(e.target.value)}
                                  placeholder="Ex: Huile sur toile, Technique Mixte..."
                                  className={`w-full px-3 py-1.5 text-xs rounded-none border focus:outline-none transition-colors ${
                                    theme === "dark-gold"
                                      ? "bg-black border-white/10 text-white focus:border-[#c9a84c]"
                                      : "bg-white border-stone-200 text-stone-900 focus:border-[#c9a84c]"
                                  }`}
                                />
                              </div>

                              <button
                                onClick={handleSaveCustomArtwork}
                                className="w-full py-2 bg-[#c9a84c] hover:bg-white hover:text-black text-black transition-colors font-bold text-[10px] uppercase tracking-widest rounded-none shadow-md mt-2"
                              >
                                Confirmer la Sauvegarde
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
                {/* Error Banner */}
                {error && (
                  <div className="p-4 bg-rose-950/20 border-2 border-rose-900 text-rose-300 rounded-none text-xs flex gap-3 items-start animate-fadeIn">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
                    <div className="space-y-1.5 leading-relaxed">
                      <p className="font-semibold">Une erreur est survenue lors de l'analyse :</p>
                      <p className="text-rose-400 font-light">{error}</p>
                    </div>
                  </div>
                )}

                {/* Tools Bar selection index - Step 3 Chapter Heading */}
                <div className={`border p-5 rounded-none shadow-md transition-colors duration-300 ${
                  theme === "dark-gold" ? "bg-[#111111] border-white/10" : "bg-white border-[#e8dfd3]"
                }`}>
                  <div className="mb-4 flex items-center gap-2.5 border-b pb-2 border-[#c9a84c]/30">
                    <span className="bg-[#c9a84c] text-black font-mono font-bold text-[10px] px-2 py-0.5 uppercase tracking-wider">
                      Étape 3 sur 4
                    </span>
                    <div>
                      <h3 className={`text-xs sm:text-sm font-serif font-bold uppercase tracking-wider ${
                        theme === "dark-gold" ? "text-white" : "text-stone-900"
                      }`}>
                        Choix du Module de Simulation (16 Outils Pas-à-Pas)
                      </h3>
                      <p className={`text-[10px] font-sans ${
                        theme === "dark-gold" ? "text-neutral-400" : "text-stone-600"
                      }`}>
                        Sélectionnez un outil par phase : style, vernissage, marché ou réseaux sociaux.
                      </p>
                    </div>
                  </div>

                  <ToolsBar
                    activeToolId={activeToolId}
                    onSelectTool={handleSelectTool}
                    cache={cache}
                    theme={theme}
                  />
                </div>

              </div>

              {/* Right Column: Output Results Panel - Step 4 Chapter Heading */}
              <div className="lg:col-span-7">
                <div className="mb-3 flex items-center gap-3 border-b pb-2 border-[#c9a84c]/30">
                  <span className="bg-[#c9a84c] text-black font-mono font-bold text-xs px-2.5 py-1 uppercase tracking-wider">
                    Étape 4 sur 4
                  </span>
                  <div>
                    <h3 className={`text-sm sm:text-base font-serif font-bold uppercase tracking-wider ${
                      theme === "dark-gold" ? "text-white" : "text-stone-900"
                    }`}>
                      Résultats de la Simulation, Fiches & Certificats
                    </h3>
                    <p className={`text-xs font-sans mt-0.5 ${
                      theme === "dark-gold" ? "text-neutral-400" : "text-stone-600"
                    }`}>
                      Consultez la fiche générée, copiez les cartels et sauvegardez dans votre Carnet de Bord.
                    </p>
                  </div>
                </div>

                <ResultsPanel
                  toolId={activeToolId}
                  result={cache[activeToolId]}
                  isLoading={isLoading}
                  artistName={profile.name}
                  theme={theme}
                  previewUrl={previewUrl}
                />
              </div>

            </div>
          )}
        </main>

      </div>

      {/* Footer */}
      <footer className={`relative z-10 py-6 border-t text-center mt-12 text-[9px] uppercase tracking-[0.3em] transition-colors duration-300 ${
        theme === "dark-gold"
          ? "border-white/10 bg-black/40 text-neutral-500"
          : "border-black/5 bg-[#f0ebd8] text-stone-600"
      }`}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div>SYSTEM: OPTIMIZED | SERVER: PARIS_EAST</div>
          <div>© 2026 ŒIL_ATELIER PRO TECHNOLOGY GROUP</div>
        </div>
      </footer>

      {/* History modal ("Mon Carnet d'Atelier") */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        historyList={historyList}
        onLoadHistoryItem={handleLoadHistoryItem}
        onClearHistory={handleClearHistory}
        theme={theme}
      />

      {/* Donation modal */}
      <DonationModal
        isOpen={isDonationOpen}
        onClose={() => setIsDonationOpen(false)}
        theme={theme}
      />

    </div>
  );
}
