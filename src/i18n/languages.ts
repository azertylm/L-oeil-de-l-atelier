/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LanguageMeta, SupportedLanguage } from "./types.js";

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  {
    code: "fr",
    name: "Français",
    nativeName: "Français",
    flag: "🇫🇷",
    dir: "ltr",
    bcp47: "fr-FR",
    geminiPromptName: "French (Français)"
  },
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇬🇧",
    dir: "ltr",
    bcp47: "en-US",
    geminiPromptName: "English"
  },
  {
    code: "it",
    name: "Italien",
    nativeName: "Italiano",
    flag: "🇮🇹",
    dir: "ltr",
    bcp47: "it-IT",
    geminiPromptName: "Italian (Italiano)"
  },
  {
    code: "de",
    name: "Allemand",
    nativeName: "Deutsch",
    flag: "🇩🇪",
    dir: "ltr",
    bcp47: "de-DE",
    geminiPromptName: "German (Deutsch)"
  },
  {
    code: "es",
    name: "Espagnol",
    nativeName: "Español",
    flag: "🇪🇸",
    dir: "ltr",
    bcp47: "es-ES",
    geminiPromptName: "Spanish (Español)"
  },
  {
    code: "pt",
    name: "Portugais (Portugal)",
    nativeName: "Português",
    flag: "🇵🇹",
    dir: "ltr",
    bcp47: "pt-PT",
    geminiPromptName: "European Portuguese (Português de Portugal)"
  },
  {
    code: "pt-BR",
    name: "Brésilien",
    nativeName: "Português (Brasil)",
    flag: "🇧🇷",
    dir: "ltr",
    bcp47: "pt-BR",
    geminiPromptName: "Brazilian Portuguese (Português do Brasil)"
  },
  {
    code: "zh",
    name: "Chinois",
    nativeName: "简体中文",
    flag: "🇨🇳",
    dir: "ltr",
    bcp47: "zh-CN",
    geminiPromptName: "Simplified Chinese (简体中文)"
  },
  {
    code: "ar",
    name: "Arabe",
    nativeName: "العربية",
    flag: "🇸🇦",
    dir: "rtl",
    bcp47: "ar-SA",
    geminiPromptName: "Modern Standard Arabic (العربية الفصحى)"
  },
  {
    code: "ja",
    name: "Japonais",
    nativeName: "日本語",
    flag: "🇯🇵",
    dir: "ltr",
    bcp47: "ja-JP",
    geminiPromptName: "Japanese (日本語)"
  },
  {
    code: "ko",
    name: "Coréen",
    nativeName: "한국어",
    flag: "🇰🇷",
    dir: "ltr",
    bcp47: "ko-KR",
    geminiPromptName: "Korean (한국어)"
  },
  {
    code: "nl",
    name: "Néerlandais",
    nativeName: "Nederlands",
    flag: "🇳🇱",
    dir: "ltr",
    bcp47: "nl-NL",
    geminiPromptName: "Dutch (Nederlands)"
  },
  {
    code: "ru",
    name: "Russe",
    nativeName: "Русский",
    flag: "🇷🇺",
    dir: "ltr",
    bcp47: "ru-RU",
    geminiPromptName: "Russian (Русский)"
  },
  {
    code: "sv",
    name: "Suédois",
    nativeName: "Svenska",
    flag: "🇸🇪",
    dir: "ltr",
    bcp47: "sv-SE",
    geminiPromptName: "Swedish (Svenska)"
  }
];

export const DEFAULT_LANGUAGE: SupportedLanguage = "fr";

export function getLanguageMeta(code: SupportedLanguage): LanguageMeta {
  return SUPPORTED_LANGUAGES.find(l => l.code === code) || SUPPORTED_LANGUAGES[0];
}
