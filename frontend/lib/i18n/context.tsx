"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { en, zh, type TranslationKey } from "./translations";

export type Locale = "en" | "zh";

const dictionaries: Record<Locale, Record<TranslationKey, string>> = {
  en,
  zh,
};

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: "en",
  setLocale: () => {},
  t: (key) => en[key],
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => dictionaries[locale][key] ?? en[key],
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
