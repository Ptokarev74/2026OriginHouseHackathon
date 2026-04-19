"use client";

import { appLanguages } from "@/lib/i18n/types";
import { useLanguage } from "./LanguageProvider";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useLanguage();
  const currentLanguageIndex = appLanguages.findIndex((item) => item.code === language);
  const nextLanguage =
    appLanguages[(currentLanguageIndex + 1) % appLanguages.length] ?? appLanguages[0];

  return (
    <button
      aria-label={`Change language to ${nextLanguage.nativeLabel}`}
      className={
        compact
          ? "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-100 transition hover:border-emerald-400 hover:text-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          : "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-800 shadow-sm transition hover:border-teal-300 hover:text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
      }
      onClick={() => setLanguage(nextLanguage.code)}
      title={`Change language to ${nextLanguage.nativeLabel}`}
      type="button"
    >
      <svg
        aria-hidden="true"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
      >
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
    </button>
  );
}
