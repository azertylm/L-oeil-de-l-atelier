import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { PROMPTS_CONFIG } from "./serverPrompts.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Set high limits for file uploads as base64 images can be quite large
  app.use(express.json({ limit: "25mb" }));
  app.use(express.urlencoded({ limit: "25mb", extended: true }));

  // API endpoint for artwork analysis
  app.post("/api/analyze", async (req, res) => {
    try {
      const { image, images, mimeType, toolId, artistProfile } = req.body;

      if (!image && (!images || images.length === 0)) {
        return res.status(400).json({ error: { message: "Aucune image fournie." } });
      }

      if (!toolId) {
        return res.status(400).json({ error: { message: "Identifiant d'outil (toolId) manquant." } });
      }

      const config = PROMPTS_CONFIG[toolId];
      if (!config) {
        return res.status(400).json({ error: { message: `Outil non supporté : ${toolId}` } });
      }

      // Check for Gemini API key (env or fallback header)
      const apiKey = process.env.GEMINI_API_KEY || (req.headers["x-gemini-api-key"] as string);
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        return res.status(400).json({
          error: {
            message: "Clé API Gemini introuvable. Veuillez renseigner votre clé dans les Secrets de Google AI Studio ou utiliser le champ Clé API de l'application."
          }
        });
      }

      // Initialize Gemini Client
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      // Format image data
      const imageParts: any[] = [];
      const hasMultipleImages = images && Array.isArray(images) && images.length > 0;

      if (hasMultipleImages) {
        images.forEach((img: string) => {
          let base64Data = img;
          if (base64Data.includes(";base64,")) {
            base64Data = base64Data.split(";base64,")[1];
          }
          imageParts.push({
            inlineData: {
              mimeType: mimeType || "image/jpeg",
              data: base64Data,
            },
          });
        });
      } else if (image) {
        let base64Data = image;
        if (base64Data.includes(";base64,")) {
          base64Data = base64Data.split(";base64,")[1];
        }
        imageParts.push({
          inlineData: {
            mimeType: mimeType || "image/jpeg",
            data: base64Data,
          },
        });
      }

      // Construct hyper-personalized context prompt based on the Artist Profile
      let contextText = `Analyse cette œuvre d'art et retourne la réponse au format JSON strict, conforme au schéma de réponse attendu.`;
      
      if (hasMultipleImages) {
        contextText = `Analyse cette série de ${images.length} œuvres d'art dans son ensemble et retourne la réponse au format JSON strict, conforme au schéma de réponse attendu.\n\n`;
        contextText += `=== CONTEXTE DE SÉRIE D'ŒUVRES (VERNISSAGE / DIALOGUE DE SÉRIE) ===\n`;
        contextText += `Tu as reçu plusieurs images représentant une série d'œuvres d'art complémentaires d'un même artiste ou conçues pour être exposées ensemble.\n`;
        contextText += `L'analyse doit impérativement porter sur la cohérence de la série dans sa globalité. Repère le fil conducteur visuel, thématique ou émotionnel. Évalue la continuité chromatique et stylistique, et comment ces œuvres se répondent mutuellement. Adapte tes descriptions, critiques, palettes de couleurs et conseils pour englober la série complète d'œuvres d'art plutôt qu'une seule création.\n\n`;
      }
      
      if (artistProfile) {
        const { name, instagram, web, style, desc } = artistProfile;
        contextText += `\n=== PROFIL ET INTENTION DE L'ARTISTE ===`;
        if (name) contextText += `\n- Nom de l'artiste : ${name}`;
        if (instagram) contextText += `\n- Instagram / Réseau : ${instagram}`;
        if (web) contextText += `\n- Site internet / Portfolio : ${web}`;
        if (style) contextText += `\n- Style artistique affirmé : ${style}`;
        if (desc) contextText += `\n- Note d'intention / Thèmes / Médium : ${desc}`;
        
        contextText += `\n\nCONSIGNE DE PERSONNALISATION ABSOLUE : Intègre de façon fluide, naturelle et élégante ces données de profil dans ta réponse. Rédige comme si tu parlais de cet artiste en particulier (ex: cite son nom dans la critique, mentionne ses objectifs dans l'Artist Statement, adapte les hashtags et publications de réseaux sociaux à son portfolio, etc.). Évite absolument les formules impersonnelles.`;
      }

      // Call Gemini 2.5-flash with proper multimodal contents structure
      let response;
      try {
        response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: {
            parts: [
              ...imageParts,
              { text: contextText }
            ]
          },
          config: {
            systemInstruction: config.prompt,
            responseMimeType: "application/json",
            responseSchema: config.schema,
            temperature: 1.0,
          }
        });
      } catch (primaryError: any) {
        console.warn("Primary gemini-2.5-flash model call failed, falling back to gemini-2.0-flash:", primaryError);
        response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: {
            parts: [
              ...imageParts,
              { text: contextText }
            ]
          },
          config: {
            systemInstruction: config.prompt,
            responseMimeType: "application/json",
            responseSchema: config.schema,
            temperature: 1.0,
          }
        });
      }

      if (!response.text) {
        console.error("Full Gemini Response without text:", JSON.stringify(response, null, 2));
        const candidate = response.candidates?.[0];
        const finishReason = candidate?.finishReason;
        const safetyRatings = candidate?.safetyRatings;
        throw new Error(`L'API Gemini n'a renvoyé aucun texte. finishReason: ${finishReason}, safetyRatings: ${JSON.stringify(safetyRatings)}`);
      }

      // Parse and return the JSON
      const jsonResponse = JSON.parse(response.text.trim());
      return res.json(jsonResponse);

    } catch (error: any) {
      console.error("Gemini API Error:", error);
      return res.status(500).json({
        error: {
          message: error.message || "Une erreur s'est produite lors de l'analyse de l'œuvre."
        }
      });
    }
  });

  // Serve static client assets using Vite or Express
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
