import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { analyzeArtwork } from "./analyzeArtwork";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Set high limits for file uploads as base64 images can be quite large
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // API endpoint for artwork analysis
  app.post("/api/analyze", async (req, res) => {
    const resultat = await analyzeArtwork(
      req.body,
      req.headers["x-gemini-api-key"] as string | undefined,
      process.env.GEMINI_API_KEY,
    );
    res.status(resultat.status).json(resultat.body);
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
