"use client";

import { appLanguages } from "@/lib/i18n/types";
import { useLanguage } from "./LanguageProvider";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useLanguage();

  return (
    <label
      className={
        compact
          ? "flex items-center gap-2 text-xs font-semibold text-slate-300"
          : "flex items-center gap-2 text-sm font-semibold text-slate-700"
      }
    >
      <span className={compact ? "sr-only" : "hidden sm:inline"}>Language</span>
      <select
        aria-label="Language"
        className={
          compact
            ? "rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-2 text-xs font-semibold text-white outline-none focus:ring-2 focus:ring-emerald-400"
            : "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm outline-none transition hover:border-teal-300 focus:ring-2 focus:ring-teal-600"
        }
        onChange={(event) => setLanguage(event.target.value === "es" ? "es" : "en")}
        value={language}
      >
        {appLanguages.map((item) => (
          <option key={item.code} value={item.code}>
            {item.nativeLabel}
          </option>
        ))}
      </select>
    </label>
  );
}
