"use client";

import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { landingContent } from "./content";
import { MotionButton } from "./motion";
import { type StartDemoHandler } from "./types";

export function Header({ onStartDemo }: { onStartDemo: StartDemoHandler }) {
  const { language } = useLanguage();
  const content = landingContent[language];

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="flex w-full items-center justify-between gap-5 px-4 py-3.5 sm:px-6 lg:px-8">
        <a
          className="flex items-center gap-3"
          href="#top"
          aria-label={content.header.homeLabel}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-700 text-lg font-bold text-white shadow-sm shadow-teal-900/20">
            N
          </span>
          <span>
            <span className="block text-xl font-bold tracking-tight text-slate-950">
              Notice-to-Rescue
            </span>
            <span className="hidden text-xs font-medium text-slate-500 sm:block">
              {content.header.subtitle}
            </span>
          </span>
        </a>

        <nav
          className="hidden items-center gap-7 text-sm font-medium text-slate-600 lg:flex"
          aria-label="Primary navigation"
        >
          {content.header.nav.map((item) => (
            <a className="transition hover:text-teal-700" href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <MotionButton
            className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-teal-900/20 transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
            onClick={onStartDemo}
            type="button"
          >
            {content.header.startDemo}
          </MotionButton>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
