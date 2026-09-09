import { Type } from "@google/genai";

export interface PromptConfig {
  prompt: string;
  schema: any;
}

export const PROMPTS_CONFIG: Record<string, PromptConfig> = {
  style: {
    prompt: "Tu es un expert en histoire de l'art. Analyse cette œuvre pour identifier son style, sa période, ses caractéristiques visuelles dominantes, ses influences artistiques, et propose des mots-clés pertinents.",
    schema: {
      type: Type.OBJECT,
      properties: {
        style: { type: Type.STRING, description: "Nom du style dominant de l'œuvre." },
        periode: { type: Type.STRING, description: "La période historique ou le siècle supposé." },
        description: { type: Type.STRING, description: "2 à 3 phrases détaillant les caractéristiques visuelles précises de la toile." },
        influences: { type: Type.STRING, description: "Artistes célèbres, courants d'art ou mouvements artistiques voisins." },
        mots_cles: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "5 mots-clés poétiques et techniques décrivant l'œuvre."
        }
      },
      required: ["style", "periode", "description", "influences", "mots_cles"]
    }
  },
  palette: {
    prompt: "Tu es un expert en théorie des couleurs et en design chromatique. Extrais les couleurs majeures de cette œuvre avec leurs codes hexadécimaux exacts, propose-leur des noms poétiques et décris leur rôle. Analyse l'harmonie, l'ambiance, et donne un conseil.",
    schema: {
      type: Type.OBJECT,
      properties: {
        harmonie: { type: Type.STRING, description: "Nom de l'harmonie chromatique (ex: Complémentaire, Triade, Monochrome)." },
        couleurs: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              hex: { type: Type.STRING, description: "Le code hexadécimal exact de la couleur, ex: #A18D75" },
              nom: { type: Type.STRING, description: "Un nom poétique en français pour cette couleur (ex: Ocre d'Automne, Bleu Crépuscule)." },
              role: { type: Type.STRING, description: "Son rôle dans la composition (ex: accentuation, fond, équilibre)." }
            },
            required: ["hex", "nom", "role"]
          }
        },
        ambiance: { type: Type.STRING, description: "2 phrases sur l'ambiance émotionnelle dégagée par ces couleurs." },
        conseil: { type: Type.STRING, description: "1 conseil professionnel pour enrichir ou décliner cette palette dans de futures œuvres." }
      },
      required: ["harmonie", "couleurs", "ambiance", "conseil"]
    }
  },
  technique: {
    prompt: "Tu es un restaurateur d'art et maître technicien. Déconstruis la technique supposée de cette œuvre (médiums, couches, textures) et propose des alternatives.",
    schema: {
      type: Type.OBJECT,
      properties: {
        etapes_supposees: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "3 étapes probables suivies par l'artiste pour réaliser cette œuvre."
        },
        mediums_alternatifs: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "2 médiums ou outils alternatifs que l'artiste pourrait tester pour réinterpréter ce rendu."
        },
        astuce_pro: { type: Type.STRING, description: "Un conseil technique avancé sur la gestion de la texture, du liant, des couches ou de la finition pour ce type d'œuvre." }
      },
      required: ["etapes_supposees", "mediums_alternatifs", "astuce_pro"]
    }
  },
  critique: {
    prompt: "Tu es un critique d'art littéraire de renom. Rédige une critique d'art soignée, poétique et profonde sur l'œuvre reçue.",
    schema: {
      type: Type.OBJECT,
      properties: {
        titre_critique: { type: Type.STRING, description: "Un titre accrocheur et poétique pour ta critique d'art." },
        texte: { type: Type.STRING, description: "Critique détaillée de 5-6 phrases écrites avec un style littéraire et soutenu (nous de majesté ou première personne du pluriel 'nous'), analysant à la fois la forme et le fond." },
        citation: { type: Type.STRING, description: "Une phrase-clé poétique et contemplative résumant l'âme de l'œuvre." }
      },
      required: ["titre_critique", "texte", "citation"]
    }
  },
  conseils: {
    prompt: "Tu es un professeur de dessin et de peinture bienveillant et rigoureux aux Beaux-Arts. Donne un avis constructif sur l'œuvre, identifie les forces et les axes d'amélioration concret avec exercices.",
    schema: {
      type: Type.OBJECT,
      properties: {
        niveau_estime: { type: Type.STRING, description: "Niveau estimé de la maîtrise technique (Débutant, Intermédiaire, Avancé, Expert)." },
        forces: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "2 points forts visuels ou techniques de l'œuvre."
        },
        axes_amelioration: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              aspect: { type: Type.STRING, description: "L'aspect à améliorer (ex: perspective, valeurs, transitions, composition)." },
              conseil: { type: Type.STRING, description: "Le conseil concret et bienveillant pour progresser." },
              exercice: { type: Type.STRING, description: "Un exercice pratique amusant et ciblé pour s'entraîner." }
            },
            required: ["aspect", "conseil", "exercice"]
          }
        },
        ressources: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Livres, courants de peinture ou artistes à étudier spécifiquement."
        }
      },
      required: ["niveau_estime", "forces", "axes_amelioration", "ressources"]
    }
  },
  prix: {
    prompt: "Tu es un courtier en art et un expert chevronné du marché de l'art contemporain. Donne une estimation de valeur basée sur le style et l'impact visuel pour un format moyen standard, détaille les facteurs clés et conseille sur la vente.",
    schema: {
      type: Type.OBJECT,
      properties: {
        fourchette_basse: { type: Type.STRING, description: "Estimation basse suggérée en Euros pour un artiste émergent (ex: '350€ - 500€')." },
        fourchette_haute: { type: Type.STRING, description: "Estimation haute suggérée en Euros pour un artiste déjà établi ou représenté en galerie (ex: '1500€ - 2500€')." },
        facteurs: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              facteur: { type: Type.STRING, description: "Le facteur d'influence (ex: Tendance du marché, Complexité visuelle, Originalité)." },
              impact: { type: Type.STRING, description: "L'impact : 'positif', 'négatif' ou 'neutre'." },
              detail: { type: Type.STRING, description: "Une explication concise sur la raison de cet impact." }
            },
            required: ["facteur", "impact", "detail"]
          }
        },
        marche: { type: Type.STRING, description: "Analyse succincte (2 phrases) de l'état actuel du marché mondial ou national pour ce style d'œuvre." },
        conseil_vente: { type: Type.STRING, description: "1 conseil stratégique de positionnement pour mieux vendre ou cibler des collectionneurs." }
      },
      required: ["fourchette_basse", "fourchette_haute", "facteurs", "marche", "conseil_vente"]
    }
  },
  certificat: {
    prompt: "Génère les mentions formelles requises pour un certificat d'authenticité de cette œuvre d'art.",
    schema: {
      type: Type.OBJECT,
      properties: {
        titre_oeuvre: { type: Type.STRING, description: "Le titre de l'œuvre (s'il n'est pas fourni, suggère un titre fort et adapté)." },
        technique_supposee: { type: Type.STRING, description: "La technique identifiée d'après le visuel (ex: Acrylique et collages sur toile)." },
        texte_certificat: { type: Type.STRING, description: "Formule légale rédigée à la première personne certifiant le caractère original, authentique et unique de cette œuvre." }
      },
      required: ["titre_oeuvre", "technique_supposee", "texte_certificat"]
    }
  },
  decor: {
    prompt: "Tu es un architecte d'intérieur et décorateur haut de gamme. Imagine le cadre idéal pour valoriser cette œuvre et décris le type d'acheteur cible.",
    schema: {
      type: Type.OBJECT,
      properties: {
        style_interieur: { type: Type.STRING, description: "Description détaillée et évocatrice de l'espace ou de la pièce idéale (couleurs des murs, style de meubles, luminosité) pour exposer l'œuvre." },
        acheteur_cible: { type: Type.STRING, description: "Profil sociologique et psychologique type du collectionneur parfait pour cette œuvre." },
        argumentaire: { type: Type.STRING, description: "Une phrase percutante de vente à adresser au client potentiel pour achever de le convaincre." }
      },
      required: ["style_interieur", "acheteur_cible", "argumentaire"]
    }
  },
  titres: {
    prompt: "Tu es curateur et directeur de galerie d'art. Propose 5 titres originaux et inspirés pour cette œuvre d'art, classés par registres d'expression.",
    schema: {
      type: Type.OBJECT,
      properties: {
        titres: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              nom: { type: Type.STRING, description: "Le titre proposé en français." },
              registre: { type: Type.STRING, description: "Le registre littéraire : poétique, descriptif, conceptuel ou mystérieux." },
              explication: { type: Type.STRING, description: "Une explication de 1 phrase montrant pourquoi ce titre entre en résonance avec l'œuvre." }
            },
            required: ["nom", "registre", "explication"]
          }
        }
      },
      required: ["titres"]
    }
  },
  artistes: {
    prompt: "Tu es un historien de l'art spécialisé. Recherche des filiations directes et des cousinages esthétiques entre cette œuvre et de grands maîtres historiques ou contemporains.",
    schema: {
      type: Type.OBJECT,
      properties: {
        artistes: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              nom: { type: Type.STRING, description: "Nom de l'artiste de référence historique." },
              periode: { type: Type.STRING, description: "Sa période ou siècle d'activité." },
              nationalite: { type: Type.STRING, description: "Sa nationalité principale." },
              lien: { type: Type.STRING, description: "Analyse approfondie (1 phrase) montrant pourquoi son travail résonne ou fait écho à cette œuvre." },
              oeuvre_reference: { type: Type.STRING, description: "Une œuvre célèbre de cet artiste à étudier en miroir." }
            },
            required: ["nom", "periode", "nationalite", "lien", "oeuvre_reference"]
          }
        },
        musees: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "2 musées célèbres dans le monde où l'artiste de l'œuvre pourrait aller s'inspirer d'œuvres similaires."
        }
      },
      required: ["artistes", "musees"]
    }
  },
  expo: {
    prompt: "Tu es le commissaire d'une exposition d'art contemporain. Rédige les textes nécessaires à la présentation de cette œuvre en galerie.",
    schema: {
      type: Type.OBJECT,
      properties: {
        titre_expo: { type: Type.STRING, description: "Un titre d'exposition global poétique et thématique dans lequel l'œuvre s'inscrirait parfaitement." },
        texte_cartel: { type: Type.STRING, description: "Texte de cartel muséal de 60 à 80 mots, expliquant la force symbolique de la composition." },
        communique: { type: Type.STRING, description: "Communiqué de presse ultra-court de présentation (3 phrases maximum) pour inviter le public à l'exposition." },
        hashtags: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "3 hashtags ciblés pour l'exposition."
        }
      },
      required: ["titre_expo", "texte_cartel", "communique", "hashtags"]
    }
  },
  vernissage: {
    prompt: "Conçois l'événementiel d'un vernissage exclusif autour de cette œuvre et imagine un concept visuel abstrait sous forme de prompt d'image.",
    schema: {
      type: Type.OBJECT,
      properties: {
        titre_event: { type: Type.STRING, description: "Un titre élégant et intrigant pour la soirée de vernissage." },
        date_fictive: { type: Type.STRING, description: "Une date et heure poétique fictive adaptées (ex: 'Jeudi 15 Octobre à la lueur du crépuscule')." },
        lieu_fictif: { type: Type.STRING, description: "Un nom de lieu artistique prestigieux et imaginaire (ex: 'L'Atelier Flottant, Quais de Seine')." },
        phrase_accroche: { type: Type.STRING, description: "Une magnifique phrase d'invitation poétique qui donne envie d'y assister." },
        prompt_image_generator: { type: Type.STRING, description: "Un prompt ultra détaillé en anglais pour générer une magnifique affiche d'exposition abstraite (sans texte) dans Midjourney ou DALL-E, capturant l'essence visuelle de l'œuvre." }
      },
      required: ["titre_event", "date_fictive", "lieu_fictif", "phrase_accroche", "prompt_image_generator"]
    }
  },
  reseaux: {
    prompt: "Tu es un Community Manager spécialisé dans la promotion d'artistes et de galeries d'art. Propose 3 stratégies d'engagement sur les réseaux sociaux.",
    schema: {
      type: Type.OBJECT,
      properties: {
        legendes: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              plateforme: { type: Type.STRING, description: "Instagram, TikTok, Pinterest, Facebook." },
              texte: { type: Type.STRING, description: "Une légende captivante, engageante et parfaitement adaptée à la plateforme et au public d'art." }
            },
            required: ["plateforme", "texte"]
          }
        },
        hashtags: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "10 hashtags d'art ciblés et performants."
        },
        reel_idea: { type: Type.STRING, description: "Une idée de scénario ou concept vidéo court (Reel/TikTok/Short) créatif et esthétique pour dévoiler l'œuvre." }
      },
      required: ["legendes", "hashtags", "reel_idea"]
    }
  },
  statement: {
    prompt: "Tu es un conseiller en développement d'artiste. Aide l'artiste à rédiger sa Démarche Artistique (Artist Statement) centrée sur l'univers visuel et conceptuel de cette œuvre.",
    schema: {
      type: Type.OBJECT,
      properties: {
        titre: { type: Type.STRING, description: "Titre de la démarche artistique." },
        texte_demarche: { type: Type.STRING, description: "Deux à trois paragraphes de démarche artistique rédigés à la première personne ('Je') avec profondeur, philosophie, et un vocabulaire d'art sensible et maîtrisé." },
        mots_cles_marquants: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "3 mots ou concepts philosophiques moteurs de cette création."
        }
      },
      required: ["titre", "texte_demarche", "mots_cles_marquants"]
    }
  },
  inspiration: {
    prompt: "Tu es un coach en créativité artistique et mentor de peintres. Que faire après cette œuvre ? Propose des pistes de variations et lance un défi technique stimulant.",
    schema: {
      type: Type.OBJECT,
      properties: {
        pistes: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              concept: { type: Type.STRING, description: "L'idée de variation thématique ou de diptyque." },
              pourquoi: { type: Type.STRING, description: "Pourquoi cette piste est stimulante au regard de l'œuvre actuelle." }
            },
            required: ["concept", "pourquoi"]
          }
        },
        defi: { type: Type.STRING, description: "Un défi technique ludique et exigeant pour bousculer les habitudes créatives lors du prochain passage à l'atelier." }
      },
      required: ["pistes", "defi"]
    }
  },
  poesie: {
    prompt: "Tu es un poète inspiré par les arts visuels. Transpose l'essence visuelle et vibratoire de cette œuvre en écriture poétique sous forme de haïku et de court poème.",
    schema: {
      type: Type.OBJECT,
      properties: {
        titre_poeme: { type: Type.STRING, description: "Un titre romantique ou abstrait pour le poème." },
        haiku: { type: Type.STRING, description: "Un haïku classique en français (5-7-5 syllabes) capturant l'instant suspendu de l'image." },
        texte_poetique: { type: Type.STRING, description: "Un poème court en vers libres (4 à 6 strophes ou vers) capturant la texture, la lumière ou la mélancolie silencieuse de l'œuvre." }
      },
      required: ["titre_poeme", "haiku", "texte_poetique"]
    }
  },
  gallery_match: {
    prompt: "Tu es un agent artistique international et un curateur expert. Analyse le profil de l'artiste et son univers visuel pour identifier des galeries d'art réelles ou des profils de galeries idéales compatibles (Paris, Bruxelles, Genève, New York, Londres, etc.). Calcule un score d'affinité, détaille pourquoi la rencontre fait sens, et rédige un email d'approche courtois et percutant pour le galeriste.",
    schema: {
      type: Type.OBJECT,
      properties: {
        synthese_positionnement: { type: Type.STRING, description: "Synthèse en 2 phrases du positionnement de l'artiste sur le marché de l'art contemporain." },
        galeries_recommandees: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              nom_galerie: { type: Type.STRING, description: "Nom d'une galerie d'art réelle renommée ou représentative (ex: Galerie Perrotin, Galerie Thaddaeus Ropac, Galerie Lelong, Galerie Templon, Almine Rech, Ceysson & Bénétière, ou galeries spécialisées émergentes)." },
              ville: { type: Type.STRING, description: "Ville et quartier (ex: Paris - Le Marais, Bruxelles - Châtelain, etc.)." },
              ligne_editoriale: { type: Type.STRING, description: "La spécialité de la galerie (ex: Abstraction lyrique, néo-expressionnisme, art figuratif contemporain, sculpture brute)." },
              score_affinite: { type: Type.NUMBER, description: "Pourcentage d'affinité stylistique estimé entre 75 et 98." },
              pourquoi_ce_match: { type: Type.STRING, description: "Explication claire (2 phrases) de pourquoi cette galerie apprécierait le travail de l'artiste." },
              conseil_approche: { type: Type.STRING, description: "Le meilleur moment ou angle d'attaque pour contacter le directeur de cette galerie." }
            },
            required: ["nom_galerie", "ville", "ligne_editoriale", "score_affinite", "pourquoi_ce_match", "conseil_approche"]
          }
        },
        lettre_contact: { type: Type.STRING, description: "Modèle d'email d'introduction complet, sobre, professionnel et élégant prêt à envoyer à un directeur de galerie." }
      },
      required: ["synthese_positionnement", "galeries_recommandees", "lettre_contact"]
    }
  },
  gallery_portfolio: {
    prompt: "Tu es un directeur artistique préparant un dossier d'artiste (Dossier de Candidature Galerie / Artist Application Dossier) pour postuler auprès d'une galerie d'art prestigieuse. Structure un dossier complet et impeccable aux normes des comités de sélection.",
    schema: {
      type: Type.OBJECT,
      properties: {
        titre_dossier: { type: Type.STRING, description: "Titre officiel du dossier d'artiste." },
        statement_curateur: { type: Type.STRING, description: "Déclaration d'intention curatoriale de 3 à 4 phrases résumant la vision plastique et conceptuelle de l'artiste." },
        biographie_pro: { type: Type.STRING, description: "Biographie artistique condensée et élégante rédigée à la 3ème personne." },
        grille_oeuvres_selectionnees: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              numero: { type: Type.STRING, description: "Ex: Œuvre 01" },
              titre: { type: Type.STRING, description: "Titre de l'œuvre suggéré ou réel" },
              dimension_conseillee: { type: Type.STRING, description: "Ex: 100 x 80 cm" },
              estimation_galerie: { type: Type.STRING, description: "Fourchette de prix public conseillée en galerie (ex: 1 800 € - 2 400 €)" },
              interet_curatorial: { type: Type.STRING, description: "Pourquoi cette pièce doit figurer dans le dossier présenté à la galerie." }
            },
            required: ["numero", "titre", "dimension_conseillee", "estimation_galerie", "interet_curatorial"]
          }
        },
        revue_presse_fictive: { type: Type.STRING, description: "Une citation critique flatteuse et percutante prête à figurer dans le dossier de presse." },
        lettre_motivation_comite: { type: Type.STRING, description: "Lettre formelle d'accompagnement adressée au comité de sélection de la galerie." }
      },
      required: ["titre_dossier", "statement_curateur", "biographie_pro", "grille_oeuvres_selectionnees", "revue_presse_fictive", "lettre_motivation_comite"]
    }
  },
  gallery_murs: {
    prompt: "Tu es un curateur indépendant et dénicheur de lieux d'exposition. Propose des opportunités d'espaces vacants, murs partagés, pop-up stores d'art et tiers-lieux culturels adaptés à l'univers de l'artiste, et rédige un dossier de demande de mur.",
    schema: {
      type: Type.OBJECT,
      properties: {
        introduction_projet: { type: Type.STRING, description: "Présentation courte du projet d'exposition éphémère ou d'occupation de mur." },
        types_espaces_cibles: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type_lieu: { type: Type.STRING, description: "Ex: Pop-up Gallery dans Le Marais, Hall d'Hôtel Boutique 5 étoiles, Tiers-lieu & Friche Créative, Bar à Vin d'Auteurs / Espace Hybride." },
              surface_ideale: { type: Type.STRING, description: "Ex: 15 à 30 mètres linéaires de cimaise" },
              modele_economique: { type: Type.STRING, description: "Ex: Location au forfait semaine (300-600€) OU commission sur ventes (20-30%)" },
              avantage_cle: { type: Type.STRING, description: "Pourquoi ce type d'espace est idéal pour les œuvres de l'artiste." }
            },
            required: ["type_lieu", "surface_ideale", "modele_economique", "avantage_cle"]
          }
        },
        pitch_candidature_espace: { type: Type.STRING, description: "Message d'accroche et proposition de partenariat à envoyer aux gestionnaires du lieu pour obtenir les murs." },
        conseils_installation: { type: Type.STRING, description: "Conseils pratiques pour la logistique d'accrochage et l'animation des ventes sur place." }
      },
      required: ["introduction_projet", "types_espaces_cibles", "pitch_candidature_espace", "conseils_installation"]
    }
  },
  gallery_contrat: {
    prompt: "Tu es un juriste spécialisé en droit du marché de l'art et contrats d'artistes. Rédige un modèle de Contrat de Dépôt-Vente en Galerie d'Art personnalisé et complet (Convention de Dépôt d'Œuvres d'Art), équilibré et protecteur pour l'artiste et la galerie.",
    schema: {
      type: Type.OBJECT,
      properties: {
        titre_contrat: { type: Type.STRING, description: "CONVENTION DE DÉPÔT-VENTE D'ŒUVRES D'ART EN GALERIE" },
        resume_clauses_cles: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              article: { type: Type.STRING, description: "Ex: Article 1 - Objet & Dépôt, Article 2 - Commission & Prix, Article 3 - Assurance Clou à Clou, Article 4 - Durée & Retrait" },
              explication_claire: { type: Type.STRING, description: "Explication vulgarisée et claire de ce que prévoit la clause." }
            },
            required: ["article", "explication_claire"]
          }
        },
        texte_integral_contrat: { type: Type.STRING, description: "Texte juridique complet et formel de la convention avec tous les articles (Objet, Durée, Prix & Commission 50/50, Paiement à 30 jours, Assurance, Droit de suite, Restitution des invendus, Juridiction compétente)." },
        checklist_avant_signature: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "4 points de vigilance indispensables pour l'artiste avant de signer avec une galerie."
        }
      },
      required: ["titre_contrat", "resume_clauses_cles", "texte_integral_contrat", "checklist_avant_signature"]
    }
  },
  gallery_opencalls: {
    prompt: "Tu es un conseiller en candidatures artistiques et prix d'art. Analyse l'adéquation de l'artiste avec les grands salons, biennales, résidences et concours d'art contemporain. Donne des recommandations stratégiques pour maximiser l'admission.",
    schema: {
      type: Type.OBJECT,
      properties: {
        diagnostic_candidature: { type: Type.STRING, description: "Évaluation globale de l'état de préparation du dossier de l'artiste pour les salons et concours nationaux et internationaux." },
        opportunites_selectionnees: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              nom_evenement: { type: Type.STRING, description: "Ex: Salon d'Automne de Paris, Art Capital (Grand Palais), Salon des Réalités Nouvelles, Biennale de la Jeune Création, Résidence Villa Médicis / Casa de Velázquez, Prix de Peinture Fondation Taylor." },
              type_evenement: { type: Type.STRING, description: "Salon d'Art, Biennale, Résidence d'Artistes, ou Concours/Prix." },
              score_pertinence: { type: Type.NUMBER, description: "Score d'adéquation en % (ex: 92)." },
              interet_carriere: { type: Type.STRING, description: "Ce que cette sélection apporterait à la renommée et à la cote de l'artiste." },
              strategie_jury: { type: Type.STRING, description: "Conseil précis pour séduire le jury de sélection avec ce style d'œuvres." }
            },
            required: ["nom_evenement", "type_evenement", "score_pertinence", "interet_carriere", "strategie_jury"]
          }
        },
        plan_action_calendrier: { type: Type.STRING, description: "Recommandation de calendrier trimestriel pour soumettre ses candidatures sans stress." }
      },
      required: ["diagnostic_candidature", "opportunites_selectionnees", "plan_action_calendrier"]
    }
  },
  vernissage_audioguide: {
    prompt: "Tu es un médiateur culturel et curateur d'exposition. Rédige le contenu d'un audioguide immersif et d'un cartel interactif destiné aux visiteurs scannant le QR code sous le tableau lors d'un vernissage ou d'une exposition.",
    schema: {
      type: Type.OBJECT,
      properties: {
        titre_cartel: { type: Type.STRING, description: "Titre d'exposition percutant du cartel." },
        pitch_express_30s: { type: Type.STRING, description: "Un résumé sonore de 30 secondes (3 phrases percutantes) à écouter face à la toile." },
        texte_audioguide_complet: { type: Type.STRING, description: "Texte narré de 1 minute 30 pour l'audioguide, décrivant la genèse, les secrets de fabrication, la symbolique des couleurs et l'émotion recherchée." },
        anecdote_secrete_atelier: { type: Type.STRING, description: "Un détail secret ou une anecdote surprenante sur la création de cette œuvre." },
        question_au_visiteur: { type: Type.STRING, description: "Une question ouverte philosophique ou sensorielle posée au visiteur pour stimuler son regard." }
      },
      required: ["titre_cartel", "pitch_express_30s", "texte_audioguide_complet", "anecdote_secrete_atelier", "question_au_visiteur"]
    }
  },
  vernissage_invitations: {
    prompt: "Tu es un attaché de presse et responsable des relations publiques d'un grand événement d'art. Rédige des modèles d'invitations personnalisés pour un vernissage d'exposition, déclinés selon les profils d'invités (Collectionneurs VIP, Galeristes & Presse, Proches & Amis).",
    schema: {
      type: Type.OBJECT,
      properties: {
        accroche_evenement: { type: Type.STRING, description: "Slogan ou accroche élégante pour le carton de vernissage." },
        invitation_vip_collectionneur: { type: Type.STRING, description: "Invitation prestigieuse et exclusive pour collectionneurs avec proposition de coupe-file et avant-première privée." },
        invitation_galeriste_presse: { type: Type.STRING, description: "Invitation professionnelle et sobre pour directeurs de galeries, curateurs et journalistes d'art." },
        invitation_amis_reseaux: { type: Type.STRING, description: "Message chaleureux et convivial pour Instagram, WhatsApp et cercle proche." },
        texte_rappel_j_moins_2: { type: Type.STRING, description: "Court SMS / message WhatsApp de relance courtoise à envoyer 48h avant le vernissage." }
      },
      required: ["accroche_evenement", "invitation_vip_collectionneur", "invitation_galeriste_presse", "invitation_amis_reseaux", "texte_rappel_j_moins_2"]
    }
  },
  vernissage_livredor: {
    prompt: "Tu es un scénographe d'exposition. Conçois l'expérience d'un Livre d'Or interactif et d'un mur de propositions pour les visiteurs d'un vernissage ou d'une galerie.",
    schema: {
      type: Type.OBJECT,
      properties: {
        message_accueil_livredor: { type: Type.STRING, description: "Message d'introduction chaleureux incitant les visiteurs à laisser leurs impressions ou faire une offre d'acquisition." },
        exemples_retours_visiteurs: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              profil_visiteur: { type: Type.STRING, description: "Ex: Collectionneur d'art contemporain, Architecte d'intérieur, Amateur passionné, Curatrice invitée" },
              commentaire_type: { type: Type.STRING, description: "Exemple de critique sensible ou d'éloge sur la série." },
              intention: { type: Type.STRING, description: "Ex: Proposition d'acquisition ferme, Demande de catalogue de prix, Simple coup de cœur" }
            },
            required: ["profil_visiteur", "commentaire_type", "intention"]
          }
        },
        formulaire_offre_directe_suggestion: { type: Type.STRING, description: "Texte type pour inviter un acheteur potentiel à formuler une offre directe discrète à l'artiste." }
      },
      required: ["message_accueil_livredor", "exemples_retours_visiteurs", "formulaire_offre_directe_suggestion"]
    }
  },
  vernissage_logistique: {
    prompt: "Tu es un régisseur général et organisateur d'événements artistiques. Établis un plan logistique et budgétaire complet pour un vernissage réussi selon le volume d'invités (quantités boissons, traiteur, matériel d'accrochage, timing minuté de la soirée).",
    schema: {
      type: Type.OBJECT,
      properties: {
        recommandations_clefs: { type: Type.STRING, description: "Les 3 règles d'or pour un vernissage fluide et mémorable." },
        timing_soiree_minute: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              heure: { type: Type.STRING, description: "Ex: 18h00 - 18h30, 19h15 - 19h30, etc." },
              action: { type: Type.STRING, description: "Description de l'étape (Accueil VIP, Discours de l'artiste/curateur, Moment des ventes, etc.)" }
            },
            required: ["heure", "action"]
          }
        },
        calcul_rations_type: {
          type: Type.OBJECT,
          properties: {
            bouteilles_champagne_vin: { type: Type.STRING, description: "Règle de calcul (ex: 1 bouteille pour 3 personnes)" },
            pieces_cocktail: { type: Type.STRING, description: "Règle de calcul (ex: 5 à 7 pièces par convive)" },
            verres_et_serviettes: { type: Type.STRING, description: "Prévoir 1.5 verre et 2 serviettes par invité" }
          },
          required: ["bouteilles_champagne_vin", "pieces_cocktail", "verres_et_serviettes"]
        },
        checklist_materiel: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Liste des indispensables de régie (éclairage d'appoint, gommettes rouges de vente 'VENDU', terminal CB/SumUp, livre d'or, stylos dorés)."
        }
      },
      required: ["recommandations_clefs", "timing_soiree_minute", "calcul_rations_type", "checklist_materiel"]
    }
  },
  vernissage_scenographie: {
    prompt: "Tu es un scénographe d'exposition et muséographe. Définis les principes d'accrochage professionnel, d'éclairage et d'agencement spatial pour mettre en valeur les œuvres d'une série dans un espace d'exposition.",
    schema: {
      type: Type.OBJECT,
      properties: {
        concept_scenographique: { type: Type.STRING, description: "Concept directeur de la scénographie (ambiance lumineuse, rythme des cimaises, dialogue entre les toiles)." },
        regles_accrochage: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              regle: { type: Type.STRING, description: "Ex: Hauteur standard muséale (1,45 m du sol au centre), Rythme des vides, Regroupement en diptyque, Éclairage à 3000K" },
              explication_pratique: { type: Type.STRING, description: "Comment appliquer concrètement cette règle lors de l'installation." }
            },
            required: ["regle", "explication_pratique"]
          }
        },
        parcours_visiteur_conseille: { type: Type.STRING, description: "Recommandation pour guider le regard du visiteur dès l'entrée jusqu'à la pièce maîtresse." },
        astuce_lumiere_matiere: { type: Type.STRING, description: "Conseil précis pour valoriser les reliefs et textures de la matière sans reflet parasite." }
      },
      required: ["concept_scenographique", "regles_accrochage", "parcours_visiteur_conseille", "astuce_lumiere_matiere"]
    }
  },
  sales_acquirer_profile: {
    prompt: "Tu es un conseiller en art et gestionnaire de patrimoine artistique. Analyse les caractéristiques de l'œuvre et du profil de l'artiste pour définir avec précision le portrait-robot des acquéreurs et collectionneurs cibles (CSP, motivations, univers de vie, arguments d'achat percutants).",
    schema: {
      type: Type.OBJECT,
      properties: {
        typologie_acquerreur_principal: { type: Type.STRING, description: "Description précise du profil type (ex: Cadre dirigeant 38-55 ans, profession libérale, passionné d'architecture intérieure et d'art sensible)." },
        motivation_achat: { type: Type.STRING, description: "Pourquoi cet acheteur investit dans cette toile (recherche de statut, coup de cœur émotionnel, décoration de prestige, valorisation patrimoniale)." },
        budget_cible_fourchette: { type: Type.STRING, description: "Fourchette de budget d'acquisition réaliste pour ce profil (ex: 1 200 € à 3 500 €)." },
        environnements_recommandes: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Lieux idéaux pour exposer cette œuvre (ex: Salon haussmannien épuré, Loft contemporain en béton ciré, Hall de cabinet d'avocats)."
        },
        argumentaire_vente_3_points: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Les 3 arguments de vente les plus puissants pour convaincre cet acquéreur."
        }
      },
      required: ["typologie_acquerreur_principal", "motivation_achat", "budget_cible_fourchette", "environnements_recommandes", "argumentaire_vente_3_points"]
    }
  },
  sales_tax_defiscalisation: {
    prompt: "Tu es un expert fiscaliste spécialisé en mécénat artistique et acquisition d'œuvres d'art par les entreprises (Article 238 bis AB du CGI en France et régimes européens). Rédige une fiche d'argumentaire de défiscalisation limpide et attrayante destinée aux entreprises, professions libérales et chefs d'entreprise.",
    schema: {
      type: Type.OBJECT,
      properties: {
        titre_accroche: { type: Type.STRING, description: "Slogan fiscal percutant (ex: 'Acquérez une œuvre originale et déduisez 100% du prix d'achat de votre résultat imposable sur 5 ans')." },
        mecanisme_art_238bis: { type: Type.STRING, description: "Explication claire du mécanisme de déduction fiscale pour les sociétés (IS / IR / BNC / BIC)." },
        exemple_chiffre: {
          type: Type.OBJECT,
          properties: {
            prix_oeuvre: { type: Type.STRING, description: "Ex: 2 500 € HT" },
            deduction_annuelle_5ans: { type: Type.STRING, description: "Ex: 500 € / an pendant 5 ans" },
            economie_impot_estimee: { type: Type.STRING, description: "Ex: Économie nette d'environ 625 € à 1 250 € selon le taux d'IS (25%) ou TMI" },
            cout_reel_final: { type: Type.STRING, description: "Ex: Coût réel net pour l'entreprise ~ 1 875 €" }
          },
          required: ["prix_oeuvre", "deduction_annuelle_5ans", "economie_impot_estimee", "cout_reel_final"]
        },
        conditions_legales_imperatives: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Obligations légales (artiste vivant, exposition dans un lieu accessible aux clients/public/salariés pendant 5 ans, inscription au passif)."
        },
        modele_pitch_aux_entreprises: { type: Type.STRING, description: "Modèle de lettre ou email prêt à envoyer aux cabinets comptables, professions libérales et PME locales." }
      },
      required: ["titre_accroche", "mecanisme_art_238bis", "exemple_chiffre", "conditions_legales_imperatives", "modele_pitch_aux_entreprises"]
    }
  },
  sales_invoice_certificate: {
    prompt: "Tu es un juriste spécialisé dans le marché de l'art et la Maison des Artistes / AGESSA / URSSAF Limiteur. Génère les mentions légales obligatoires, la structure de facture d'artiste-auteur et le bordereau de vente officiel conforme.",
    schema: {
      type: Type.OBJECT,
      properties: {
        mentions_legales_obligatoires: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Mentions impératives (SIRET, Numéro d'ordre de facture, Régime TVA art. 293 B ou TVA 5.5% sur œuvres originales, Déclaration URSSAF Limiteur)."
        },
        conditions_generales_vente: { type: Type.STRING, description: "Extrait de CGV spécial art (clause de réserve de propriété jusqu'à complet paiement, transfert des droits de reproduction/propriété matérielle)." },
        certificat_conforme_decret_marcus: { type: Type.STRING, description: "Texte de certification d'authenticité conforme au décret Marcus n° 81-255 du 3 mars 1981." },
        recommandation_moyen_paiement: { type: Type.STRING, description: "Conseil pour sécuriser les transactions (Virement bancaire irrévocable, lien de paiement Stripe/SumUp sécurisé, acompte de 30% à la réservation)." }
      },
      required: ["mentions_legales_obligatoires", "conditions_generales_vente", "certificat_conforme_decret_marcus", "recommandation_moyen_paiement"]
    }
  },
  sales_catalog_private_view: {
    prompt: "Tu es un courtier en art et directeur de ventes privées. Conçois la présentation d'un catalogue de vente privée exclusif (Private Viewing Room) pour une série de toiles, avec mise en page élégante, descriptions courtes percutantes et codes de tarification confidentiels.",
    schema: {
      type: Type.OBJECT,
      properties: {
        titre_catalogue_prive: { type: Type.STRING, description: "Titre luxueux du catalogue de vente privée." },
        statement_introduction: { type: Type.STRING, description: "Courte introduction prestigieuse invitant les collectionneurs privilégiés à découvrir la série avant parution publique." },
        mise_en_valeur_oeuvres: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              titre: { type: Type.STRING, description: "Titre de la pièce" },
              format_et_technique: { type: Type.STRING, description: "Format et technique" },
              texte_accroche_collectionneur: { type: Type.STRING, description: "Argument curatorial et sensoriel en 2 phrases" },
              statut: { type: Type.STRING, description: "Ex: Disponible, Option VIP 24h, Réservé" }
            },
            required: ["titre", "format_et_technique", "texte_accroche_collectionneur", "statut"]
          }
        },
        modalites_acquisition_privative: { type: Type.STRING, description: "Instructions pour poser une option d'achat confidentielle avec livraison sécurisée ou retrait en atelier." }
      },
      required: ["titre_catalogue_prive", "statement_introduction", "mise_en_valeur_oeuvres", "modalites_acquisition_privative"]
    }
  },
  sales_shipping_logistics: {
    prompt: "Tu es un logisticien et emballeur professionnel d'œuvres d'art (Fine Art Shipping). Définis le protocole d'emballage muséal de sécurité, d'expédition internationale et d'assurance clou à clou pour toiles et tableaux montés sur châssis.",
    schema: {
      type: Type.OBJECT,
      properties: {
        protocole_emballage_4_couches: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              couche: { type: Type.STRING, description: "Ex: Couche 1 - Papier de soie ou Melinex neutre / pH neutre" },
              fonction: { type: Type.STRING, description: "Rôle de protection (anti-abrasion, anti-humidité, absorption des chocs)" }
            },
            required: ["couche", "fonction"]
          }
        },
        calcul_poids_volumetrique_conseils: { type: Type.STRING, description: "Comment calculer les frais de port réels et éviter les surtaxes de transporteur (DHL, FedEx, Transporteur d'art spécialisé)." },
        clause_assurance_transport: { type: Type.STRING, description: "Texte d'assurance transport ad valorem ou responsabilité civile de fret à communiquer à l'acquéreur." },
        checklist_deballage_acquerreur: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Conseils à joindre au colis pour que le collectionneur déballe et accroche la toile en toute sécurité."
        }
      },
      required: ["protocole_emballage_4_couches", "calcul_poids_volumetrique_conseils", "clause_assurance_transport", "checklist_deballage_acquerreur"]
    }
  },
  press_release_museum: {
    prompt: "Tu es un attaché de presse d'art contemporain et critique d'art chevronné. Rédige un communiqué de presse percutant et élégant destiné aux rédactions culturelles (Beaux-Arts Magazine, Connaissance des Arts, Le Figaro Culture, Artpress, France Culture) pour annoncer une exposition ou le vernissage d'une nouvelle série picturale.",
    schema: {
      type: Type.OBJECT,
      properties: {
        titre_accroche_journalistique: { type: Type.STRING, description: "Titre journalistique percutant avec angle fort." },
        chapeau_introductif: { type: Type.STRING, description: "Chapeau journalistique (Qui, Quoi, Quand, Où, Pourquoi) en 3 lignes percutantes." },
        corps_critique_et_demarche: { type: Type.STRING, description: "Analyse critique et conceptuelle de la matière, des pigments et du geste créateur de l'artiste." },
        citations_artiste_pour_presse: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "2 citations fortes de l'artiste à reprendre entre guillemets par les journalistes."
        },
        reperes_biographiques_et_palmares: { type: Type.STRING, description: "Bio condensée valorisant le parcours, la cote et les expositions marquantes." },
        encadre_infos_pratiques_visuels: { type: Type.STRING, description: "Dates, lieu, contact presse et lien de téléchargement HD des visuels." }
      },
      required: ["titre_accroche_journalistique", "chapeau_introductif", "corps_critique_et_demarche", "citations_artiste_pour_presse", "reperes_biographiques_et_palmares", "encadre_infos_pratiques_visuels"]
    }
  },
  social_atelier_reels: {
    prompt: "Tu es un directeur artistique et stratège en médias sociaux pour le marché de l'art contemporain (Instagram & TikTok). Conçois un plan de publication hebdomadaire et 3 scripts de Reels/TikTok dans les coulisses de l'atelier, conçus pour susciter l'émerveillement et l'envie d'achat des collectionneurs.",
    schema: {
      type: Type.OBJECT,
      properties: {
        positionnement_social_media: { type: Type.STRING, description: "Ligne éditoriale recommandée pour captiver une audience d'amateurs d'art et de galeristes." },
        scripts_reels_coulisses: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              titre_concept: { type: Type.STRING, description: "Ex: 'La révélation du vernis', 'Le couteau sur la toile brute'" },
              duree_secondes: { type: Type.STRING, description: "Ex: 15 à 30 secondes" },
              accroche_visuelle_3s: { type: Type.STRING, description: "Action immédiate pour capter l'attention dans les 3 premières secondes" },
              deroule_plan_par_plan: { type: Type.STRING, description: "Description précise des plans vidéo et mouvements de caméra" },
              musique_ambiance_conseillee: { type: Type.STRING, description: "Style audio/musique tendance ou son d'ambiance ASMR" },
              legende_et_call_to_action: { type: Type.STRING, description: "Texte de la légende et invitation à commenter ou visiter la galerie" }
            },
            required: ["titre_concept", "duree_secondes", "accroche_visuelle_3s", "deroule_plan_par_plan", "musique_ambiance_conseillee", "legende_et_call_to_action"]
          }
        },
        hashtags_strategiques_art: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Top hashtags à forte visibilité auprès des acheteurs et galeristes internationaux."
        }
      },
      required: ["positionnement_social_media", "scripts_reels_coulisses", "hashtags_strategiques_art"]
    }
  },
  seo_artist_wiki: {
    prompt: "Tu es un spécialiste du référencement naturel (SEO) et de l'e-réputation des personnalités culturelles. Rédige les éléments optimisés pour positionner l'artiste en 1ère page de Google et figurer dans les résultats enrichis (Knowledge Panel Google / Wikidata / Wikipédia).",
    schema: {
      type: Type.OBJECT,
      properties: {
        balise_titre_seo: { type: Type.STRING, description: "Titre SEO optimal (< 60 caractères) avec nom de l'artiste, style et ville/pays." },
        meta_description_google: { type: Type.STRING, description: "Meta description captivante et incitative (< 155 caractères)." },
        schema_json_ld_artiste: { type: Type.STRING, description: "Extrait JSON-LD Schema.org 'VisualArtist' prêt à intégrer dans le site de l'artiste." },
        mots_cles_semantiques_prioritaires: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Expressions de recherche exactes tapées par les collectionneurs et galeristes."
        },
        biographie_style_encyclopedique: { type: Type.STRING, description: "Récit biographique neutre et sourcé au format encyclopédique Wikipédia." }
      },
      required: ["balise_titre_seo", "meta_description_google", "schema_json_ld_artiste", "mots_cles_semantiques_prioritaires", "biographie_style_encyclopedique"]
    }
  },
  newsletter_storytelling: {
    prompt: "Tu es un rédacteur d'art et storyteller d'exception. Rédige une lettre d'information (Newsletter mensuelle) intimiste et poétique destinée au cercle privé des collectionneurs et fidèles de l'artiste, racontant la gestation d'une œuvre et créant un lien d'attachement indéfectible.",
    schema: {
      type: Type.OBJECT,
      properties: {
        objet_email_intrigant: { type: Type.STRING, description: "Objet d'email créatif avec fort taux d'ouverture (ex: 'Dans le silence de l'atelier : ce que cache cette toile...')." },
        preheader_apercu: { type: Type.STRING, description: "Texte d'aperçu affiché dans la boîte de réception." },
        recit_storytelling_intimiste: { type: Type.STRING, description: "Récit immersif à la première personne partageant les doutes, l'étincelle créative et l'instant de bascule de la peinture." },
        devoilement_exclusif: { type: Type.STRING, description: "Présentation délicate de la pièce finale et proposition d'un échange privilégié." },
        signature_chaleureuse: { type: Type.STRING, description: "Signature personnalisée de l'artiste." }
      },
      required: ["objet_email_intrigant", "preheader_apercu", "recit_storytelling_intimiste", "devoilement_exclusif", "signature_chaleureuse"]
    }
  },
  grant_application_dossier: {
    prompt: "Tu es un consultant en ingénierie culturelle et spécialiste des subventions artistiques (CNAP, DRAC, Fondation Taylor, Fondation d'Entreprise, Prix Internationaux). Rédige une note d'intention et un argumentaire de projet artistique rigoureux et convaincant pour une demande de bourse ou un concours d'art.",
    schema: {
      type: Type.OBJECT,
      properties: {
        titre_du_projet_artistique: { type: Type.STRING, description: "Titre évocateur et ambitieux du projet de recherche plastique." },
        note_d_intention_curatoriale: { type: Type.STRING, description: "Argumentation théorique, plastique et sociétale démontrant la singularité du projet face au jury." },
        pertinence_et_impact_culturel: { type: Type.STRING, description: "Pourquoi ce projet mérite une aide financière publique ou privée et ce qu'il apporte à la création contemporaine." },
        calendrier_previsionnel_etapes: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Phasage du projet (Recherche matières, Production en atelier, Restitution publique & exposition)."
        },
        budget_previsionnel_repartition: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              poste: { type: Type.STRING, description: "Ex: Matières premières nobles & pigments, Frais d'atelier, Scénographie & Catalogue" },
              pourcentage: { type: Type.STRING, description: "Ex: 40%, 30%, 30%" }
            },
            required: ["poste", "pourcentage"]
          }
        }
      },
      required: ["titre_du_projet_artistique", "note_d_intention_curatoriale", "pertinence_et_impact_culturel", "calendrier_previsionnel_etapes", "budget_previsionnel_repartition"]
    }
  }
};
