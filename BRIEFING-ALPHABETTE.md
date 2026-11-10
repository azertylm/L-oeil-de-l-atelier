BRIEFING OBLIGATOIRE — ÉCOSYSTÈME ALPHABETTE
(colle-moi en tête de chaque nouveau projet ou session IA ; je dis tout ce que l'IA doit savoir sur les barres du haut et l'écosystème)

Tu travailles sur une application de l'écosystème alphabette.fr. Lis ce briefing
EN ENTIER avant d'écrire une seule ligne de code. Si une demande contredit ce
briefing, signale-le et demande confirmation au lieu d'improviser.


═════════════════════════════════════════════════════════════════════════
1. L'ÉCOSYSTÈME — RÈGLES DE CONSTRUCTION
═════════════════════════════════════════════════════════════════════════

- Une application = un dépôt GitHub = un sous-domaine :
  https://<subdomain>.alphabette.fr
- Toute application part de la BASE COMMUNE : <AppShell> du paquet
  @alphabette/shell, installée par le générateur du hub :
      bun run new:app <slug> "Nom" "Sous-titre" [--accent "#hex"] [--dir <chemin>]
- Dans chaque application, la base vit dans src/shell/ (copy de travail) et est
  aliasée en « @alphabette/shell » (vite.config.ts + tsconfig.json "paths").
- RÈGLE D'OR : NE JAMAIS recoder, ni dupliquer, ni retoucher les barres du haut
  à la main. Toute évolution des barres se fait dans le dépôt du hub
  (packages/shell), PUIS elle se diffuse dans les applications :

      bun run sync:shell <chemin-de-l-application>     (depuis le dépôt du hub)

  Le fichier src/shell/.shell-version mémorise la version embarquée (actuelle :
  0.2.0).
- Stack : React 19, Vite, TypeScript, Bun. Avant de rendre le travail :
      bun run lint    (types)
      bun run build   (compile)


═════════════════════════════════════════════════════════════════════════
2. BARRE 1 — « ÉCOSYSTÈME » (la barre tout en haut)
═════════════════════════════════════════════════════════════════════════

Contenu, de gauche à droite :
  ◉ ALPHABETTE   ♥ DON   [5 sites]   (x/y) applications   ⭐ Pass 40 €/an
  (code : EcosystemBar.tsx)

Comportements garantis — ce sont eux qui rendent la barre « efficace » :
- CLICS FIABLES : la navigation vers un autre site de l'écosystème se fait dans
  le MÊME onglet (pas de target="_blank" automatique).
- LE SITE COURANT n'est pas un lien : affiché en surbrillance
  (aria-current="page"), ne recharge pas la page.
- APPLICATION PAS ENCORE EN LIGNE (statut « brouillon » dans le registre) :
  affichée en grisé avec « bientôt en ligne », JAMAIS un lien qui mène vers une
  page d'erreur.
- SYNCHRONISATION EN DIRECT avec le registre central du hub
  (GET https://alphabette.fr/api/apps — CORS ouvert). Le hub fait foi pour les
  URLs et les statuts. Si le hub est injoignable : liste de secours locale
  (DEFAULT_SITES) — la barre n'est jamais vide.
- COMPTEUR AUTOMATIQUE : (X/Y) se calcule tout seul depuis le registre
  (X = applications en ligne, Y = total). L'app peut le forcer via app.counter.
  Cliquer sur le compteur ouvre le registre complet (panneau « applications »).
- ♥ DON ouvre le panneau dons de la base (RIB copiable, virement SEPA,
  « Membre fondateur »). Les coordonnées sont publiées par le HUB via
  /api/config.json : NE JAMAIS coder un IBAN dans une application.
- ⭐ Pass 40 €/an ouvre le panneau tarifaire ; les tarifs et liens Stripe
  viennent de /api/config.json du hub (défauts intégrés : 15 €/app/an,
  40 € écosystème/an, 7 jours d'essai).

Les 5 sites mis en avant + leurs emojis sont concentrés à UN SEUL endroit
(DEFAULT_SITES dans la base) ; leurs URLs se mettent à jour tout seuls avec le
registre.


═════════════════════════════════════════════════════════════════════════
3. BARRE 2 — « APPLICATION » (la barre en dessous)
═════════════════════════════════════════════════════════════════════════

Contenu (code : AppHeader.tsx) :
  ☰ (optionnel)   [icône] NOM APP + SOUS-TITRE   ♥ DON · Mon Compte ·
  BIG · Clé API : état · Plein Écran · ☀ Jour/Nuit

Comportements garantis — chaque bouton mène quelque part de réel :
- ☰ : ouvre le menu latéral de l'application (si onToggleNav est fourni).
- ♥ DON : panneau dons (comme barre 1).
- Mon Compte : panneau compte (état du compte + explication du Pass),
  remplaçable par onOpenAccount.
- BIG : change la densité d'affichage (compact / normal / grand), mémorisée,
  appliquée à TOUTE la page au travers de <html data-ab-density>.
- Clé API : état visible par pastille (Prêt / … / Non configurée). Ouvre le
  panneau clés (BYOK Mistral ou clé managée Alphabette) — remplaçable par
  onOpenApiKeys.
- Plein Écran : vrai plein écran navigateur, avec repli « mode immersion »
  (les barres se cachent, un bouton ✕ permet d'en sortir).
- ☀ Jour/Nuit : bascule thème, mémorisée, appliquée à TOUTE la page au travers
  de <html data-ab-theme> — le contenu de l'app en profite en écrivant son CSS
  avec les variables --ab-*.


═════════════════════════════════════════════════════════════════════════
4. IDENTITÉ DE L'APPLICATION — LE FICHIER src/alphabette.app.ts
═════════════════════════════════════════════════════════════════════════

C'est LE SEUL endroit où l'on décrit l'identité d'une application :
  key:        identifiant technique (le slug, ex. « infos-perso »)
  name:       nom affiché
  tagline:    sous-titre en majuscules
  accent:     COULEUR D'IDENTITÉ du site (#hex)
  subdomain:  sous-domaine dédié (« infosperso » → infosperso.alphabette.fr)
  homePath:   chemin sur le domaine principal (ex. /infos-perso)
  donUrl / accountUrl / apiKeysUrl : liens éventuels personnalisés
  counter:    OPTIONNEL — sinon calculé automatiquement depuis le registre
  panels:     contenu sur mesure d'un panneau (sinon panneau par défaut)

RÈGLE D'OR : toute couleur d'interface dérive de `accent` via les variables
CSS --ab-* de la base. NE JAMAIS coder une couleur en dur dans une application.


═════════════════════════════════════════════════════════════════════════
5. LES CINQ PANNEAUX (ouverts par-dessus le contenu)
═════════════════════════════════════════════════════════════════════════

  compte  → utilisateur, synchronisé avec alphabette.fr/compte
  cles    → clés d'API IA (BYOK / clé managée), IA souveraine Mistral AI
  pass    → tarifs 15 €/app/an · 40 € écosystème/an · 7 jours d'essai, + promo
  sites   → REGISTRE complet des applications (« Tu es ici » marqué)
  dons    → RIB copiable, virement SEPA, Membre fondateur

Chaque bouton des barres ouvre un panneau concret : JAMAIS dans le vide.


═════════════════════════════════════════════════════════════════════════
6. ÉTHIQUE / SOUVERAINETÉ (non négociable)
═════════════════════════════════════════════════════════════════════════

- IA souveraine : Mistral AI (France), en BYOK (clé utilisateur) ou clé
  managée Alphabette, avec repli local. Aucune donnée utilisateur utilisée pour
  l'entraînement.
- Sans publicité, aucune revente de données, hébergement en France.
- App gratuite possible (`gratuit: true` dans src/alphabette.app.ts) : la base
  n'affiche alors ni prix, ni essai, ni paiement.


═════════════════════════════════════════════════════════════════════════
7. CRÉER UNE NOUVELLE APPLICATION (check-list)
═════════════════════════════════════════════════════════════════════════

  1. Depuis le dépôt du hub :
       bun run new:app <slug> "Nom" "Sous-titre" --accent "#hex"
     La base (barres) est embarquée automatiquement ; l'application est
     inscrite au registre central du hub (statut « brouillon »).
  2. Dans l'application : bun install && bun run dev
     → les barres fonctionnent TOUT DE SUITE, sans configuration supplémentaire.
  3. Renseigner l'identité UNIQUEMENT dans src/alphabette.app.ts.
  4. Déployer, puis activer l'application dans la console du hub (/admin) :
     elle devient cliquable dans la barre des autres applications.
  5. Plus tard, pour recevoir une évolution des barres :
       bun run sync:shell <chemin-de-l-application>     (depuis le hub)

Structure d'une application :
  src/
    main.tsx            point d'entrée
    App.tsx             contenu enveloppé par <AppShell>
    alphabette.app.ts   identité du site (nom, sous-titre, couleur, liens)
    shell/              base commune @alphabette/shell (générée — ne pas recoder)


═════════════════════════════════════════════════════════════════════════
8. PIÈGES CONNUS (à ne pas re-découvrir)
═════════════════════════════════════════════════════════════════════════

- PAS de `bun link` : la base est embarquée, pas liée. Un dépôt fraîchement
  cloné s'installe sans rien d'autre.
- TypeScript 7 : PAS de "baseUrl" dans tsconfig (option supprimée) — utiliser
  "paths" relatifs.
- Si vite.config.ts utilise node:path → "@types/node" en devDependencies.
- En développement, le registre est relayé par le proxy Vite (/api →
  localhost:3000) : pas de CORS, pas de bruit si le hub dort.
- Ne jamais laisser un compteur (x/y) codé en dur : il se décale. Soit absent
  (auto), soit forcé en connaissance de cause.
- Ne jamais coder un IBAN, un tarif ou un lien Stripe en dur : tout vient du
  hub (/api/config.json), avec repli par défaut si le hub est absent.
- Ne jamais toucher les barres dans le code généré d'une application :
  correctif = hub + sync:shell.


═════════════════════════════════════════════════════════════════════════
9. LIVRAISON
═════════════════════════════════════════════════════════════════════════

- À chaque livraison visible (fonctionnalité, correctif, style) : joindre un
  APERÇU RÉEL (rendu vivant ou capture déposée dans le volet de revue), pas une
  simple description. Un rendu qu'on ne voit pas n'est pas un rendu terminé.
- Vérifier avant de rendre : bun run lint && bun run build.

Aperçu vivant de la base : http://localhost:3000/base
Hub : https://alphabette.fr — Documentation : docs/base-application.md
