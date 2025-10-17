"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { LearningLanguage } from "@/components/words/language_packs";

interface LanguageContextValue {
  language: LearningLanguage;
  setLanguage: (language: LearningLanguage) => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = "axon-language";
const SUPPORTED_LANGUAGES: LearningLanguage[] = ["en", "de", "es"];

const isSupportedLanguage = (value: string): value is LearningLanguage =>
  SUPPORTED_LANGUAGES.includes(value as LearningLanguage);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LearningLanguage>("en");

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem(STORAGE_KEY);

    if (storedLanguage && isSupportedLanguage(storedLanguage)) {
      setLanguageState(storedLanguage);
    } else {
      setLanguageState("en");
    }
  }, []);

  const setLanguage = useCallback((nextLanguage: LearningLanguage) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem(STORAGE_KEY, nextLanguage);
  }, []);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
    }),
    [language, setLanguage]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
}