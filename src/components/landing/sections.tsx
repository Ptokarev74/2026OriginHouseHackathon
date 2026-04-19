"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { useLanguage } from "@/components/i18n/LanguageProvider";
import { getLandingContent } from "./content";
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
  const { language } = useLanguage();
  const content = getLandingContent(language);

  return (
    <section className="border-b border-slate-200 bg-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-3">
        {content.reassuranceItems.map((item) => (
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
  const { language } = useLanguage();
  const content = getLandingContent(language);

  return (
    <SectionWrapper id="why-it-matters">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow={content.sectionHeadings.why.eyebrow}
          title={content.sectionHeadings.why.title}
          copy={content.sectionHeadings.why.copy}
        />

        <AnimatedGrid className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {content.matterItems.map((item, index) => (
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
  const { language } = useLanguage();
  const content = getLandingContent(language);

  return (
    <SectionWrapper id="common-situations" tone="soft">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1fr] lg:items-start">
          <SectionHeading
            eyebrow={content.sectionHeadings.common.eyebrow}
            title={content.sectionHeadings.common.title}
            copy={content.sectionHeadings.common.copy}
          />

          <AnimatedGrid className="grid gap-4 sm:grid-cols-2">
            {content.commonSituations.map((situation) => (
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
  const { language } = useLanguage();
  const content = getLandingContent(language);

  return (
    <SectionWrapper id="what-it-reviews">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow={content.sectionHeadings.reviews.eyebrow}
            title={content.sectionHeadings.reviews.title}
            copy={content.sectionHeadings.reviews.copy}
          />
          <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm leading-6 text-teal-950 md:max-w-xs">
            {content.sectionHeadings.reviews.limit}
          </div>
        </div>

        <AnimatedGrid className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {content.reviewTypes.map((type) => (
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
  const { language } = useLanguage();
  const content = getLandingContent(language);

  return (
    <SectionWrapper id="what-you-leave-with" tone="soft">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.86fr_1fr] lg:items-center">
        <div>
          <SectionHeading
            eyebrow={content.sectionHeadings.leaveWith.eyebrow}
            title={content.sectionHeadings.leaveWith.title}
            copy={content.sectionHeadings.leaveWith.copy}
          />
          <AnimatedGrid className="mt-8 grid gap-3 sm:grid-cols-2">
            {content.leaveWithItems.map((item) => (
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
              {content.exampleOutput.eyebrow}
            </p>
            <h3 className="mt-3 text-2xl font-bold">{content.exampleOutput.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              {content.exampleOutput.copy}
            </p>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-bold text-amber-950">
                {content.exampleOutput.flaggedTitle}
              </p>
              <p className="mt-2 text-sm leading-6 text-amber-900">
                {content.exampleOutput.flaggedCopy}
              </p>
            </div>
            <div className="rounded-xl border border-teal-200 bg-teal-50 p-4">
              <p className="text-sm font-bold text-teal-950">
                {content.exampleOutput.detailsTitle}
              </p>
              <p className="mt-2 text-sm leading-6 text-teal-900">
                {content.exampleOutput.detailsCopy}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-bold text-slate-950">
              {content.exampleOutput.questionsTitle}
            </p>
            <ol className="mt-3 space-y-3 text-sm leading-6 text-slate-700">
              {content.exampleOutput.questions.map((question, index) => (
                <li key={question}>
                  {index + 1}. {question}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

export function HowItWorksSection({ onStartDemo }: { onStartDemo: StartDemoHandler }) {
  const { language } = useLanguage();
  const content = getLandingContent(language);

  return (
    <SectionWrapper id="how-it-works">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow={content.sectionHeadings.how.eyebrow}
            title={content.sectionHeadings.how.title}
            copy={content.sectionHeadings.how.copy}
          />
          <MotionButton
            className="inline-flex min-h-12 w-fit items-center justify-center rounded-lg bg-teal-700 px-6 py-3 text-base font-semibold text-white shadow-sm shadow-teal-900/20 transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
            onClick={onStartDemo}
            type="button"
          >
            {content.hero.startDemo}
          </MotionButton>
        </div>

        <AnimatedGrid className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {content.workflowSteps.map((step) => (
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
  const reduceMotion = useReducedMotion();
  const { language } = useLanguage();
  const content = getLandingContent(language);
  const [openQuestion, setOpenQuestion] = useState(content.faqs[0]?.question ?? "");

  return (
    <SectionWrapper id="faq" tone="soft">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow={content.sectionHeadings.faq.eyebrow}
          title={content.sectionHeadings.faq.title}
          copy={content.sectionHeadings.faq.copy}
          align="center"
        />

        <AnimatedGrid className="mt-10 space-y-3">
          {content.faqs.map((faq) => {
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
  const { language } = useLanguage();
  const content = getLandingContent(language);

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
                {content.sectionHeadings.finalCta.eyebrow}
              </p>
              <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                {content.sectionHeadings.finalCta.title}
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-700">
                {content.sectionHeadings.finalCta.copy}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <MotionButton
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-teal-700 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-teal-900/20 transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
                onClick={onStartDemo}
                type="button"
              >
                {content.sectionHeadings.finalCta.startDemo}
              </MotionButton>
              <motion.a
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-teal-300 bg-white px-6 py-3 text-base font-semibold text-teal-900 shadow-sm transition hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
                href="#trust-limits"
                whileHover={reduceMotion ? undefined : { y: -2 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              >
                {content.sectionHeadings.finalCta.reviewLimits}
              </motion.a>
              <ul className="space-y-2 text-sm leading-6 text-teal-950">
                {content.sectionHeadings.finalCta.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

export function TrustSection() {
  const { language } = useLanguage();
  const content = getLandingContent(language);

  return (
    <SectionWrapper id="trust-limits" tone="deep">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 rounded-2xl border border-white/10 bg-white/[0.06] p-6 sm:p-8 lg:grid-cols-[0.82fr_1fr] lg:p-10">
          <SectionHeading
            eyebrow={content.sectionHeadings.trust.eyebrow}
            title={content.sectionHeadings.trust.title}
            copy={content.sectionHeadings.trust.copy}
            inverse
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {content.sectionHeadings.trust.limits.map((item) => (
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
