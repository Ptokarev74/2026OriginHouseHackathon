"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import {
  commonSituations,
  faqs,
  leaveWithItems,
  matterItems,
  reassuranceItems,
  reviewTypes,
  workflowSteps,
} from "./content";
import {
  AnimatedGrid,
  getRevealVariants,
  Marker,
  MotionButton,
  RevealCard,
  SectionHeading,
  SectionWrapper,
} from "./motion";
import { type StartDemoHandler } from "./types";

export function TrustStrip() {
  return (
    <section className="border-b border-slate-200 bg-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-3">
        {reassuranceItems.map((item) => (
          <div
            className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-4"
            key={item.title}
          >
            <Marker />
            <div>
              <h2 className="text-sm font-bold text-slate-950">{item.title}</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">{item.copy}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function WhyThisMattersSection() {
  return (
    <SectionWrapper id="why-it-matters">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Why this matters"
          title="Small notice details can put coverage at risk."
          copy="Medicaid action notices often arrive with tight deadlines and dense wording. Notice-to-Rescue is designed for the urgent moment when someone needs to understand the exact blocker and what to do next."
        />

        <AnimatedGrid className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {matterItems.map((item, index) => (
            <RevealCard
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70"
              key={item.title}
            >
              <div className="flex items-start gap-4">
                <Marker tone={index === 3 ? "amber" : index === 5 ? "slate" : "teal"} />
                <div>
                  <h3 className="text-lg font-bold text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-base leading-7 text-slate-600">{item.copy}</p>
                </div>
              </div>
            </RevealCard>
          ))}
        </AnimatedGrid>
      </div>
    </SectionWrapper>
  );
}

export function CommonSituationsSection() {
  return (
    <SectionWrapper id="common-situations" tone="soft">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1fr] lg:items-start">
          <SectionHeading
            eyebrow="Common situations"
            title="Built for the notice moments people actually bring."
            copy="The prototype works best when there is a Medicaid notice in front of you and a concrete coverage-risk question to resolve."
          />

          <AnimatedGrid className="grid gap-4 sm:grid-cols-2">
            {commonSituations.map((situation) => (
              <RevealCard
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                key={situation.title}
              >
                <h3 className="text-lg font-bold text-slate-950">
                  {situation.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {situation.copy}
                </p>
              </RevealCard>
            ))}
          </AnimatedGrid>
        </div>
      </div>
    </SectionWrapper>
  );
}

export function WhatItReviewsSection() {
  return (
    <SectionWrapper id="what-it-reviews">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="What it reviews"
            title="Bring the paperwork that explains the risk."
            copy="Notice-to-Rescue looks for useful context in the document and organizes it into a focused, reviewable case summary."
          />
          <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm leading-6 text-teal-950 md:max-w-xs">
            It can help prepare a response path. It cannot confirm eligibility,
            submit documents, contact an agency, or provide legal advice.
          </div>
        </div>

        <AnimatedGrid className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reviewTypes.map((type) => (
            <RevealCard
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70"
              key={type.title}
            >
              <div className="flex h-full flex-col">
                <Marker />
                <h3 className="mt-5 text-lg font-bold leading-7 text-slate-950">
                  {type.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {type.examples}
                </p>
              </div>
            </RevealCard>
          ))}
        </AnimatedGrid>
      </div>
    </SectionWrapper>
  );
}

export function ExampleOutputSection() {
  const reduceMotion = useReducedMotion();

  return (
    <SectionWrapper id="what-you-leave-with" tone="soft">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.86fr_1fr] lg:items-center">
        <div>
          <SectionHeading
            eyebrow="What you leave with"
            title="A clearer path from notice to next action."
            copy="The goal is not to replace an official answer. It is to help you understand the blocker, see whether the case is document-ready, and know when escalation may be needed."
          />
          <AnimatedGrid className="mt-8 grid gap-3 sm:grid-cols-2">
            {leaveWithItems.map((item) => (
              <motion.div
                className="flex gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold leading-6 text-slate-700 shadow-sm"
                key={item}
                variants={getRevealVariants(reduceMotion)}
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600" />
                {item}
              </motion.div>
            ))}
          </AnimatedGrid>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/70">
          <div className="rounded-xl border border-slate-200 bg-slate-950 p-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-200">
              Example summary
            </p>
            <h3 className="mt-3 text-2xl font-bold">Prepared rescue notes</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              The notice appears to warn that Medicaid may close unless income
              verification is submitted before the listed response date.
            </p>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-bold text-amber-950">Flagged detail</p>
              <p className="mt-2 text-sm leading-6 text-amber-900">
                Missing proof of income is the blocker. Confirm acceptable
                documents before sending the packet.
              </p>
            </div>
            <div className="rounded-xl border border-teal-200 bg-teal-50 p-4">
              <p className="text-sm font-bold text-teal-950">Details to verify</p>
              <p className="mt-2 text-sm leading-6 text-teal-900">
                Deadline, case identifier, submission channel, required proof,
                and confirmation method.
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-bold text-slate-950">Questions to ask</p>
            <ol className="mt-3 space-y-3 text-sm leading-6 text-slate-700">
              <li>1. Which proof of income documents will satisfy this notice?</li>
              <li>2. How should the packet be submitted for this Medicaid case?</li>
              <li>3. What confirmation number or receipt should be saved?</li>
            </ol>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

export function HowItWorksSection({ onStartDemo }: { onStartDemo: StartDemoHandler }) {
  return (
    <SectionWrapper id="how-it-works">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="How Notice-to-Rescue works"
            title="From confusing notice to prepared next step."
            copy="A short workflow keeps the review focused on blocker detection, readiness, and the next rescue action."
          />
          <MotionButton
            className="inline-flex min-h-12 w-fit items-center justify-center rounded-lg bg-teal-700 px-6 py-3 text-base font-semibold text-white shadow-sm shadow-teal-900/20 transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
            onClick={onStartDemo}
            type="button"
          >
            Start rescue demo
          </MotionButton>
        </div>

        <AnimatedGrid className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {workflowSteps.map((step) => (
            <RevealCard
              className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-6"
              key={step.step}
            >
              <span className="text-sm font-bold text-teal-700">{step.step}</span>
              <h3 className="mt-4 text-xl font-bold leading-7 text-slate-950">
                {step.title}
              </h3>
              <p className="mt-3 text-base leading-7 text-slate-600">{step.copy}</p>
              <span
                aria-hidden="true"
                className="absolute -bottom-7 -right-7 h-24 w-24 rounded-full bg-teal-100"
              />
            </RevealCard>
          ))}
        </AnimatedGrid>
      </div>
    </SectionWrapper>
  );
}

export function FAQSection() {
  const [openQuestion, setOpenQuestion] = useState(faqs[0]?.question ?? "");
  const reduceMotion = useReducedMotion();

  return (
    <SectionWrapper id="faq" tone="soft">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="FAQ"
          title="Clear answers about what the demo can and cannot do."
          copy="Notice-to-Rescue is intentionally careful: useful for preparation, limited when an official answer or human judgment is required."
          align="center"
        />

        <AnimatedGrid className="mt-10 space-y-3">
          {faqs.map((faq) => {
            const isOpen = openQuestion === faq.question;

            return (
              <motion.div
                className="rounded-xl border border-slate-200 bg-white shadow-sm"
                key={faq.question}
                variants={getRevealVariants(reduceMotion)}
              >
                <button
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-bold text-slate-950 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-600"
                  onClick={() => setOpenQuestion(isOpen ? "" : faq.question)}
                  type="button"
                >
                  <span>{faq.question}</span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-xl leading-none text-teal-700 transition ${
                      isOpen ? "rotate-45" : ""
                    }`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>
                {isOpen ? (
                  <motion.div
                    className="px-5 pb-5 text-sm leading-7 text-slate-600"
                    initial={reduceMotion ? false : { opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  >
                    {faq.answer}
                  </motion.div>
                ) : null}
              </motion.div>
            );
          })}
        </AnimatedGrid>
      </div>
    </SectionWrapper>
  );
}

export function FinalCTASection({ onStartDemo }: { onStartDemo: StartDemoHandler }) {
  const reduceMotion = useReducedMotion();

  return (
    <SectionWrapper>
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-2xl border border-teal-200 bg-teal-50 p-6 sm:p-8 lg:p-10">
          <motion.div
            className="absolute right-[-5rem] top-[-6rem] h-64 w-64 rounded-full bg-white/70 blur-3xl"
            aria-hidden="true"
            animate={reduceMotion ? undefined : { opacity: [0.55, 0.8, 0.55] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_0.55fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
                Try the demo
              </p>
              <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Start with one Medicaid notice and leave with a clearer rescue
                path.
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-700">
                Use Notice-to-Rescue to identify the blocker, check whether the
                case is ready, and prepare simulated next-step artifacts for the
                prototype workflow.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <MotionButton
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-teal-700 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-teal-900/20 transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
                onClick={onStartDemo}
                type="button"
              >
                Start rescue demo
              </MotionButton>
              <motion.a
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-teal-300 bg-white px-6 py-3 text-base font-semibold text-teal-900 shadow-sm transition hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
                href="#trust-limits"
                whileHover={reduceMotion ? undefined : { y: -2 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              >
                Review demo limits
              </motion.a>
              <ul className="space-y-2 text-sm leading-6 text-teal-950">
                <li>Guidance only, not an official Medicaid determination</li>
                <li>No agency contact or document submission is made</li>
                <li>Designed for preparation before human review or follow-up</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

export function TrustSection() {
  return (
    <SectionWrapper id="trust-limits" tone="deep">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 rounded-2xl border border-white/10 bg-white/[0.06] p-6 sm:p-8 lg:grid-cols-[0.82fr_1fr] lg:p-10">
          <SectionHeading
            eyebrow="Trust & limits"
            title="Informational guidance, not an official decision."
            copy="Notice-to-Rescue is a Medicaid notice rescue demo for explaining risk language and preparing simulated follow-up artifacts. It does not determine eligibility, submit paperwork, contact agencies, provide legal advice, store real documents, or manage real PHI workflows."
            inverse
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Always confirm status, deadlines, submission options, and appeal rights with the agency or a qualified reviewer.",
              "Do not use this demo for emergencies, legal decisions, or real case management workflows.",
              "Do not enter real sensitive health information or real documents into this frontend demo.",
              "Use generated artifacts as preparation prompts, not as final answers or agency submissions.",
            ].map((item) => (
              <div
                className="rounded-xl border border-white/10 bg-white/[0.07] p-4 text-sm leading-7 text-teal-50"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
