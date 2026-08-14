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
  }
};
