/**
 * staticApi.ts — permet à L'Œil de l'Atelier de tourner SANS serveur Node
 * (hébergement statique : alphabette.fr/apps/atelier/, OVH Perso).
 *
 * Importé en tout premier dans main.tsx. En mode statique (build avec
 * VITE_ALPHABETTE_STATIC=1), l'appel POST /api/analyze est exécuté directement
 * dans le navigateur par la même fonction que le serveur (analyzeArtwork.ts),
 * avec la clé Gemini que l'utilisateur a saisie dans son Profil Artiste.
 * Sans ce mode, rien ne change (le serveur répond comme avant).
 */
const STATIQUE = (import.meta as any).env?.VITE_ALPHABETTE_STATIC === '1';
const fetchNatif = window.fetch.bind(window);

const json = (corps: unknown, status = 200) =>
  new Response(JSON.stringify(corps), { status, headers: { 'Content-Type': 'application/json' } });

function lireEntete(init: RequestInit | undefined, nom: string): string | undefined {
  const h = init?.headers;
  if (!h) return undefined;
  if (h instanceof Headers) return h.get(nom) ?? undefined;
  if (Array.isArray(h)) return h.find(([k]) => k.toLowerCase() === nom)?.[1];
  const entree = Object.entries(h).find(([k]) => k.toLowerCase() === nom);
  return entree?.[1];
}

if (STATIQUE) {
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    if (typeof input === 'string' && input.startsWith('/api/')) {
      if (input === '/api/analyze' && (init?.method || 'GET').toUpperCase() === 'POST') {
        let corps: any = {};
        try {
          corps = JSON.parse(String(init?.body || '{}'));
        } catch {}
        const cle = lireEntete(init, 'x-gemini-api-key');
        if (!cle) {
          return json(
            {
              error: {
                message:
                  "Cette version de L'Œil de l'Atelier fonctionne sans serveur : renseignez votre clé API Gemini personnelle dans le Profil Artiste (gratuite sur aistudio.google.com).",
              },
            },
            400,
          );
        }
        const { analyzeArtwork } = await import('../analyzeArtwork');
        const r = await analyzeArtwork(corps, cle);
        return json(r.body, r.status);
      }
      return json({ error: { message: 'Fonction indisponible dans la version hébergée sans serveur.' } }, 503);
    }
    return fetchNatif(input, init);
  };
}

export {};
