/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SupportedLanguage = 
  | "fr"    // Français
  | "en"    // English
  | "it"    // Italiano
  | "de"    // Deutsch
  | "es"    // Español
  | "pt"    // Português (Portugal)
  | "pt-BR" // Português do Brasil
  | "zh"    // 简体中文
  | "ar"    // العربية
  | "ja"    // 日本語
  | "ko"    // 한국어
  | "nl"    // Nederlands
  | "ru"    // Русский
  | "sv";   // Svenska

export interface LanguageMeta {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  dir: "ltr" | "rtl";
  bcp47: string;
  geminiPromptName: string;
}

export type TranslationKey = string;
