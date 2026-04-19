"use client";

import { MotionButton } from "./motion";
import { type StartDemoHandler } from "./types";

export function Header({ onStartDemo }: { onStartDemo: StartDemoHandler }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 py-3.5 sm:px-6 lg:px-8">
        <a
          className="flex items-center gap-3"
          href="#top"
          aria-label="Notice-to-Rescue home"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-700 text-lg font-bold text-white shadow-sm shadow-teal-900/20">
            N
          </span>
          <span>
            <span className="block text-xl font-bold tracking-tight text-slate-950">
              Notice-to-Rescue
            </span>
            <span className="hidden text-xs font-medium text-slate-500 sm:block">
              Medicaid notice agent
            </span>
          </span>
        </a>

        <nav
          className="hidden items-center gap-7 text-sm font-medium text-slate-600 lg:flex"
          aria-label="Primary navigation"
        >
          <a className="transition hover:text-teal-700" href="#why-it-matters">
            Why it matters
          </a>
          <a className="transition hover:text-teal-700" href="#common-situations">
            Notice moments
          </a>
          <a className="transition hover:text-teal-700" href="#what-it-reviews">
            What it reviews
          </a>
          <a className="transition hover:text-teal-700" href="#how-it-works">
            How it works
          </a>
          <a className="transition hover:text-teal-700" href="#trust-limits">
            Trust & limits
          </a>
        </nav>

        <MotionButton
          className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-teal-900/20 transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
          onClick={onStartDemo}
          type="button"
        >
          Start demo
        </MotionButton>
      </div>
    </header>
  );
}
