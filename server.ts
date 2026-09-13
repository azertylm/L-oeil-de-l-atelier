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
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // API endpoint for artwork analysis
  app.post("/api/analyze", async (req, res) => {
    try {
      const { image, images, mimeType, toolId, artistProfile, language } = req.body;

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
        // Cap series sample to a maximum of 8 images to prevent payload overflow
        const selectedImages = images.slice(0, 8);
        selectedImages.forEach((img: string) => {
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

      // Multilingual Official Translation Directive
      const LANGUAGE_PROMPT_MAP: Record<string, string> = {
        fr: "French (Français)",
        en: "English",
        it: "Italian (Italiano)",
        de: "German (Deutsch)",
        es: "Spanish (Español)",
        pt: "European Portuguese (Português de Portugal)",
        "pt-BR": "Brazilian Portuguese (Português do Brasil)",
        zh: "Simplified Chinese (简体中文)",
        ar: "Modern Standard Arabic (العربية الفصحى)",
        ja: "Japanese (日本語)",
        ko: "Korean (한국어)",
        nl: "Dutch (Nederlands)",
        ru: "Russian (Русский)",
        sv: "Swedish (Svenska)"
      };

      if (language && LANGUAGE_PROMPT_MAP[language]) {
        const targetLang = LANGUAGE_PROMPT_MAP[language];
        contextText += `\n\n=== EXIGENCE LINGUISTIQUE OFFICIELLE : TOUTE LA RÉPONSE EN ${targetLang.toUpperCase()} ===\n`;
        contextText += `IMPORTANT : L'utilisateur a sélectionné la langue "${targetLang}". Tu dois OBLIGATOIREMENT rédiger TOUTES les parties de ta réponse (titres, critiques d'art, analyses plastiques, démarches d'atelier, conseils, descriptions de cartels, poésies, etc.) en ${targetLang}.`;
      }

      // Supported Gemini models ordered for maximum availability and rapid fallback
      const modelsToTry = [
        "gemini-3.8-flash",
        "gemini-3.1-flash-lite",
        "gemini-flash-latest",
        "gemini-3.7-flash"
      ];

      const requestPayload = {
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
          temperature: 0.8,
        }
      };

      let response: any = null;
      let lastError: any = null;

      // Attempt across supported models with immediate cascade on high demand (503) or rate limits (429)
      for (let attempt = 0; attempt < 2 && !response?.text; attempt++) {
        for (let m = 0; m < modelsToTry.length; m++) {
          const modelName = modelsToTry[m];

          try {
            response = await ai.models.generateContent({
              model: modelName,
              ...requestPayload
            });

            if (response && response.text) {
              // Successfully generated content
              break;
            }
          } catch (err: any) {
            lastError = err;
            // Silent fallback between models without logging raw error JSON to stdout
            if (m < modelsToTry.length - 1) {
              await new Promise((resolve) => setTimeout(resolve, 150));
            }
          }
        }

        // If first round had transient demand spikes on all models, brief pause before 2nd pass
        if (!response?.text && attempt === 0) {
          await new Promise((resolve) => setTimeout(resolve, 800));
        }
      }

      if (!response || !response.text) {
        console.error("Gemini failed on all fallback models:", lastError);
        const errMsg = lastError?.message || "";
        const isQuotaExceeded = errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("Quota exceeded") || errMsg.includes("quota");
        const isDemandSpike = errMsg.includes("503") || errMsg.includes("UNAVAILABLE") || errMsg.includes("high demand");

        if (isQuotaExceeded) {
          return res.status(429).json({
            error: {
              code: 429,
              message: "Le quota de requêtes gratuites de l'IA est temporairement atteint. Veuillez patienter environ 20-30 secondes que la limite se réinitialise, ou utilisez votre clé API Gemini personnelle dans le Profil Artiste."
            }
          });
        }

        if (isDemandSpike) {
          return res.status(503).json({
            error: {
              code: 503,
              message: "Les serveurs d'analyse IA rencontrent une forte affluence passagère. Veuillez relancer l'analyse dans quelques secondes."
            }
          });
        }

        return res.status(500).json({
          error: {
            message: lastError?.message || "Une erreur s'est produite lors de l'analyse de l'œuvre d'art."
          }
        });
      }

      // Clean markdown fences if any and parse JSON
      let rawText = response.text.trim();
      if (rawText.startsWith("```json")) {
        rawText = rawText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
      } else if (rawText.startsWith("```")) {
        rawText = rawText.replace(/^```\s*/, "").replace(/\s*```$/, "");
      }

      const jsonResponse = JSON.parse(rawText.trim());
      return res.json(jsonResponse);

    } catch (error: any) {
      console.error("Gemini API Error:", error);
      const errMsg = error?.message || "";
      const isQuota = errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("Quota");
      return res.status(isQuota ? 429 : 500).json({
        error: {
          code: isQuota ? 429 : 500,
          message: error.message || "Une erreur s'est produite lors de l'analyse de l'œuvre."
        }
      });
    }
  });

  // Dedicated API error handler to guarantee JSON responses for /api routes
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.path.startsWith("/api")) {
      const status = err.status || err.statusCode || 500;
      return res.status(status).json({
        error: {
          code: status,
          message: err.type === "entity.too.large"
            ? "Le volume des images transmises dépasse la taille maximale autorisée (50 Mo). Veuillez réduire la taille ou le nombre d'images."
            : (err.message || "Erreur lors du traitement de la requête.")
        }
      });
    }
    next(err);
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
