/**
 * @file lot6-navigateur.ts
 * Version « script » des briques du Lot 6 pour les pages HTML sans React (/transfert, /aidant, /idees, /kits, /presse).
 * Construite dans public/assets/alphabette-lot6.js (bun run build:lot6). Expose window.AB6.
 */
import {
  appliquerPasseport, collecterPasseport, dechiffrerPasseport, chiffrerPasseport, deposerPasseport, lireLien, lienReception,
  passeportAidant, recevoirPasseport, nettoyerPasseport, VERSION_PASSEPORT, versBase64Url, depuisBase64Url,
} from './passeport';
import { calculerNutriScore, svgNutriScore, COULEURS_LETTRE } from './nutriscore';
import { constatsDe } from './NutriEtiquette';
import { demarrerDictee, dicteePossible } from './audio/dictee';
import { guideIaNonConfiguree } from './guideIA';
import { meteoDepuisStatut } from './meteo';

declare global { interface Window { AB6?: unknown } }

const AB6 = {
  passeport: {
    appliquerPasseport, collecterPasseport, dechiffrerPasseport, chiffrerPasseport, deposerPasseport, lireLien, lienReception,
    passeportAidant, recevoirPasseport, nettoyerPasseport, VERSION_PASSEPORT, versBase64Url, depuisBase64Url,
  },
  nutri: { calculerNutriScore, svgNutriScore, COULEURS_LETTRE, constatsDe },
  dictee: { demarrerDictee, dicteePossible },
  guideIA: guideIaNonConfiguree,
  meteo: meteoDepuisStatut,
};

if (typeof window !== 'undefined') window.AB6 = AB6;
