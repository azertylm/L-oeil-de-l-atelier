/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { SupportedLanguage, LanguageMeta } from "./types.js";
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, getLanguageMeta } from "./languages.js";
import { getTranslation } from "./translations.js";

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;
  langMeta: LanguageMeta;
  isRTL: boolean;
  supportedLanguages: LanguageMeta[];
}

const LanguageContext = createContext<LanguageContextType>({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
  t: (key, fallback) => fallback || key,
  langMeta: SUPPORTED_LANGUAGES[0],
  isRTL: false,
  supportedLanguages: SUPPORTED_LANGUAGES
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem("oeilAtelier_lang") as SupportedLanguage;
      if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
        return saved;
      }
    } catch (e) {
      console.warn("Could not read saved language from localStorage:", e);
    }
    return DEFAULT_LANGUAGE;
  });

  const langMeta = useMemo(() => getLanguageMeta(language), [language]);
  const isRTL = langMeta.dir === "rtl";

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("oeilAtelier_lang", lang);
    } catch (e) {
      console.warn("Could not save language to localStorage:", e);
    }
  };

  useEffect(() => {
    // Update HTML root attributes for true native i18n support
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [language, isRTL]);

  const t = (key: string, fallback?: string): string => {
    return getTranslation(language, key, fallback);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        langMeta,
        isRTL,
        supportedLanguages: SUPPORTED_LANGUAGES
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  return useContext(LanguageContext);
}
