"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { appLanguages, isAppLanguage, type AppLanguage } from "@/lib/i18n/types";

const languageStorageKey = "notice-rescue-language";

type LanguageContextValue = {
  language: AppLanguage;
  languageLabel: string;
  setLanguage: (language: AppLanguage) => void;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function readStoredLanguage(): AppLanguage {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(languageStorageKey);
  return isAppLanguage(stored) ? stored : "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<AppLanguage>(readStoredLanguage);

  useEffect(() => {
    window.localStorage.setItem(languageStorageKey, language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<LanguageContextValue>(() => {
    const languageLabel =
      appLanguages.find((item) => item.code === language)?.nativeLabel ?? "English";

    return { language, languageLabel, setLanguage };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return context;
}
