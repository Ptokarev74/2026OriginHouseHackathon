"use client";

import { motion, useReducedMotion } from "motion/react";

import {
  benefitStrip,
  heroPreviewRows,
  previewChecklist,
  trustPills,
} from "./content";
import {
  getContainerVariants,
  getRevealVariants,
  MotionButton,
} from "./motion";
import { type StartDemoHandler } from "./types";

function ProductPreviewCard() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.aside
      className="relative rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-300/50 sm:p-4"
      aria-label="Sample Notice-to-Rescue review preview"
      initial={{ opacity: 0, y: reduceMotion ? 0 : 18, scale: reduceMotion ? 1 : 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: reduceMotion ? 0.01 : 0.58, ease: "easeOut" }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
    >
      <div className="absolute -right-3 -top-3 hidden rounded-full border border-teal-200 bg-white px-4 py-2 text-xs font-semibold text-teal-800 shadow-lg shadow-slate-200/80 sm:block">
        Packet-ready review
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
              Sample output
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
              Medicaid renewal notice review
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Plain-English review for a missing income verification blocker.
            </p>
          </div>
          <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
            Demo packet
          </span>
        </div>

        <div className="mt-5 grid gap-3">
          {heroPreviewRows.map((item, index) => (
            <div
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
              key={item.label}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-1 h-2.5 w-2.5 rounded-full ${
                    index === 1 ? "bg-amber-500" : "bg-teal-600"
                  }`}
                  aria-hidden="true"
                />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold leading-6 text-slate-900">
                    {item.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-bold text-amber-950">Ready-to-ask question</p>
          <p className="mt-2 text-sm leading-6 text-amber-900">
            What exact proof of income is acceptable, and how can I confirm the
            packet was received before the response deadline?
          </p>
        </div>

        <div className="mt-4 rounded-lg border border-teal-200 bg-white p-4">
          <p className="text-sm font-bold text-slate-950">Next-step checklist</p>
          <ul className="mt-3 space-y-2">
            {previewChecklist.map((item) => (
              <li className="flex gap-2 text-sm leading-6 text-slate-700" key={item}>
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.aside>
  );
}

export function HeroSection({ onStartDemo }: { onStartDemo: StartDemoHandler }) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden border-b border-slate-200 bg-[linear-gradient(180deg,#ecfeff_0%,#ffffff_62%,#f8fafc_100%)]"
      id="top"
    >
      <motion.div
        className="absolute left-[-8rem] top-16 h-72 w-72 rounded-full bg-teal-200/40 blur-3xl"
        aria-hidden="true"
        animate={reduceMotion ? undefined : { y: [0, 14, 0], opacity: [0.55, 0.7, 0.55] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-6rem] top-28 h-80 w-80 rounded-full bg-sky-200/35 blur-3xl"
        aria-hidden="true"
        animate={reduceMotion ? undefined : { y: [0, -12, 0], opacity: [0.45, 0.62, 0.45] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(25rem,0.82fr)] lg:px-8 lg:py-24">
        <motion.div
          className="flex flex-col justify-center"
          initial="hidden"
          animate="show"
          variants={getContainerVariants(reduceMotion)}
        >
          <motion.div
            className="flex flex-wrap gap-2"
            variants={getRevealVariants(reduceMotion)}
          >
            {trustPills.map((pill) => (
              <span
                className="rounded-full border border-teal-200 bg-white/85 px-3 py-1 text-sm font-semibold text-teal-800 shadow-sm"
                key={pill}
              >
                {pill}
              </span>
            ))}
          </motion.div>

          <motion.h1
            className="mt-7 max-w-4xl text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl"
            variants={getRevealVariants(reduceMotion)}
          >
            Rescue Medicaid coverage before a confusing notice becomes an
            interruption.
          </motion.h1>

          <motion.p
            className="mt-6 max-w-2xl text-lg leading-8 text-slate-600"
            variants={getRevealVariants(reduceMotion)}
          >
            Notice-to-Rescue reads fictional Medicaid notice packets or local
            pasted text, finds the exact coverage blocker, and turns dense
            agency language into a clear rescue path.
          </motion.p>

          <motion.p
            className="mt-4 max-w-2xl text-base leading-7 text-slate-700"
            variants={getRevealVariants(reduceMotion)}
          >
            It prepares next-step artifacts for the demo flow, while leaving
            official eligibility decisions, submissions, and legal guidance to
            the appropriate agency or qualified reviewer.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-col gap-3 sm:flex-row"
            variants={getRevealVariants(reduceMotion)}
          >
            <MotionButton
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-teal-700 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-teal-900/20 transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
              onClick={onStartDemo}
              type="button"
            >
              Start rescue demo
            </MotionButton>
            <motion.a
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-800 shadow-sm transition hover:border-teal-300 hover:text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
              href="#what-you-leave-with"
              whileHover={reduceMotion ? undefined : { y: -2 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              See example output
            </motion.a>
          </motion.div>

          <motion.div
            className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-3"
            variants={getContainerVariants(reduceMotion)}
          >
            {benefitStrip.map((item) => (
              <motion.div
                className="rounded-lg border border-slate-200 bg-white/85 px-4 py-3 text-sm font-semibold leading-6 text-slate-700 shadow-sm"
                key={item}
                variants={getRevealVariants(reduceMotion)}
              >
                {item}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <div className="flex items-center">
          <ProductPreviewCard />
        </div>
      </div>
    </section>
  );
}
