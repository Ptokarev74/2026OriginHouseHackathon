"use client";

import { appLanguages } from "@/lib/i18n/types";
import { useLanguage } from "./LanguageProvider";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useLanguage();

  return (
    <label className="relative inline-flex h-10 w-10 shrink-0">
      <span className="sr-only">Language</span>
      <select
        aria-label="Language"
        className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
        onChange={(event) => setLanguage(event.target.value === "es" ? "es" : "en")}
        value={language}
      >
        {appLanguages.map((item) => (
          <option key={item.code} value={item.code}>
            {item.nativeLabel}
          </option>
        ))}
      </select>
      <span
        aria-hidden="true"
        className={
          compact
            ? "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-100 transition peer-hover:border-emerald-400 peer-hover:text-emerald-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-400"
            : "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-800 shadow-sm transition peer-hover:border-teal-300 peer-hover:text-teal-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-600 peer-focus:ring-offset-2"
        }
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
          <path
            d="M3 12h18M12 3a15.5 15.5 0 0 1 4 9 15.5 15.5 0 0 1-4 9 15.5 15.5 0 0 1-4-9 15.5 15.5 0 0 1 4-9Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
          <path
            d="M4.5 8h15M4.5 16h15"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </svg>
      </span>
    </label>
  );
}
