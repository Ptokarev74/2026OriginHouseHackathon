"use client";

import { useState, type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { useRouter } from "next/navigation";

type StartDemoHandler = () => void;

type SectionTone = "white" | "soft" | "deep";

const trustPills = [
  "Plain-language Medicare guidance",
  "Next-step preparation",
  "Demo only",
];

const benefitStrip = [
  "Review letters and notices",
  "Spot details to verify",
  "Prepare calls and appointments",
];

const reassuranceItems = [
  {
    title: "Plain-language guidance",
    copy: "Summaries are written for review and preparation, not as official benefit decisions.",
  },
  {
    title: "Next-step preparation",
    copy: "Leave with questions, call notes, and details to confirm with the right office.",
  },
  {
    title: "Demo only",
    copy: "This demo does not contact Medicare, plans, providers, or manage real PHI workflows.",
  },
];

const matterItems = [
  {
    title: "Delayed appointments",
    copy: "A missing referral or unclear plan requirement can slow down a scheduled visit.",
  },
  {
    title: "Referral issues",
    copy: "People may not know which office needs to send, receive, or confirm a referral.",
  },
  {
    title: "Coverage confusion",
    copy: "Medicare Advantage notices and plan letters can be hard to connect to the next action.",
  },
  {
    title: "Billing surprises",
    copy: "Unclear benefit changes or network details can create questions after care happens.",
  },
  {
    title: "Care disruption",
    copy: "Discharge instructions and follow-up details can be easy to misplace or misunderstand.",
  },
  {
    title: "Call fatigue",
    copy: "Healthly helps organize the facts before calling a plan, Medicare, or a provider office.",
  },
];

const commonSituations = [
  {
    title: "A Medicare Advantage letter arrived",
    copy: "You are not sure what changed, when it takes effect, or who can confirm the details.",
  },
  {
    title: "A referral may be missing",
    copy: "The appointment is scheduled, but the paperwork does not clearly show what was authorized.",
  },
  {
    title: "Provider coverage feels unclear",
    copy: "You want to prepare the right questions before assuming a doctor or facility is in network.",
  },
  {
    title: "Discharge paperwork is confusing",
    copy: "Follow-up timing, medications, and care instructions are scattered across several pages.",
  },
  {
    title: "Coverage may need follow-up",
    copy: "A letter suggests a deadline, lapse, or plan change that should be verified quickly.",
  },
  {
    title: "A visit is coming soon",
    copy: "You want a short summary and call checklist before the appointment day arrives.",
  },
];

const reviewTypes = [
  {
    title: "Medicare notices and plan letters",
    examples: "Annual notices, enrollment updates, plan change letters",
  },
  {
    title: "Referral paperwork",
    examples: "Specialist referrals, office notes, visit requirements",
  },
  {
    title: "Prior authorization messages",
    examples: "Approval notes, pending requests, denial language to verify",
  },
  {
    title: "Discharge instructions",
    examples: "Care transition notes, follow-up windows, medication reminders",
  },
  {
    title: "Provider follow-up details",
    examples: "Office phone numbers, appointment notes, documents to bring",
  },
  {
    title: "Benefit change notices",
    examples: "Effective dates, plan rules, cost-sharing language",
  },
  {
    title: "Appointment preparation paperwork",
    examples: "Pre-visit instructions, required forms, checklist items",
  },
  {
    title: "Care coordination notes",
    examples: "Who to call, what to ask, which details need confirmation",
  },
];

const leaveWithItems = [
  "Plain-language summary of the document",
  "Flagged details that may need confirmation",
  "Key dates, names, and phone numbers to verify",
  "Call checklist for the plan or provider office",
  "Ready-to-ask questions for the next conversation",
  "Short next-step summary you can bring to a visit",
];

const workflowSteps = [
  {
    step: "01",
    title: "Add a document",
    copy: "Paste text or bring a Medicare notice, referral note, plan letter, or care instruction into the demo.",
  },
  {
    step: "02",
    title: "Review the plain-language summary",
    copy: "Healthly organizes the document into what it appears to say, what may matter, and what needs confirmation.",
  },
  {
    step: "03",
    title: "Check possible issue areas",
    copy: "The demo flags items like dates, referral language, authorization wording, and provider follow-up details.",
  },
  {
    step: "04",
    title: "Prepare the next call or visit",
    copy: "Leave with a focused checklist and questions to ask Medicare, your plan, or a provider office.",
  },
];

const faqs = [
  {
    question: "Does this tell me if I officially lost coverage?",
    answer:
      "No. Healthly can help identify language that may be worth verifying, but it does not make official Medicare, plan, eligibility, or coverage determinations.",
  },
  {
    question: "Can this confirm whether my doctor is covered?",
    answer:
      "No. It can help you prepare questions about network status or referral requirements, but you should confirm directly with your plan and provider office.",
  },
  {
    question: "What documents can I review here?",
    answer:
      "This demo is suited for Medicare notices, Medicare Advantage letters, referral notes, prior authorization messages, discharge instructions, and appointment preparation paperwork.",
  },
  {
    question: "Does this contact Medicare or my provider?",
    answer:
      "No. Healthly does not contact Medicare, plans, pharmacies, clinicians, or provider offices. It helps you prepare for those conversations.",
  },
  {
    question: "Is this a real case management system?",
    answer:
      "No. This is a frontend demo for informational guidance. It is not a clinical workflow, case management system, or real PHI processing environment.",
  },
  {
    question: "What should I do if a possible issue is flagged?",
    answer:
      "Use the summary and questions to confirm the details with Medicare, your plan, or the provider office before making care or coverage assumptions.",
  },
];

const heroPreviewRows = [
  {
    label: "Status summary",
    value: "Plan letter mentions a specialist visit and a referral requirement.",
  },
  {
    label: "Possible issue",
    value: "Authorization status is not clearly shown in the document.",
  },
  {
    label: "What to verify",
    value: "Effective date, referral number, and whether the provider is in network.",
  },
  {
    label: "Who to contact",
    value: "Medicare Advantage plan first, then the provider office scheduling team.",
  },
];

const previewChecklist = [
  "Have member ID and letter date ready",
  "Ask whether authorization is approved or pending",
  "Confirm provider and facility network status",
];

function getRevealVariants(reduceMotion: boolean | null): Variants {
  return {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0.01 : 0.48, ease: "easeOut" },
    },
  };
}

function getContainerVariants(reduceMotion: boolean | null): Variants {
  return {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.08,
        delayChildren: reduceMotion ? 0 : 0.04,
      },
    },
  };
}

function Header({ onStartDemo }: { onStartDemo: StartDemoHandler }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 py-3.5 sm:px-6 lg:px-8">
        <a
          className="flex items-center gap-3"
          href="#top"
          aria-label="Healthly home"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-700 text-lg font-bold text-white shadow-sm shadow-teal-900/20">
            H
          </span>
          <span>
            <span className="block text-xl font-bold tracking-tight text-slate-950">
              Healthly
            </span>
            <span className="hidden text-xs font-medium text-slate-500 sm:block">
              Medicare guidance demo
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
            Common situations
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

function MotionButton({
  children,
  className,
  onClick,
  type = "button",
}: {
  children: ReactNode;
  className: string;
  onClick?: StartDemoHandler;
  type?: "button" | "submit" | "reset";
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      className={className}
      onClick={onClick}
      type={type}
      whileHover={reduceMotion ? undefined : { y: -2 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      {children}
    </motion.button>
  );
}

function SectionWrapper({
  children,
  className = "",
  id,
  tone = "white",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: SectionTone;
}) {
  const reduceMotion = useReducedMotion();
  const toneClass =
    tone === "soft"
      ? "border-y border-slate-200 bg-slate-50"
      : tone === "deep"
        ? "bg-teal-950"
        : "bg-white";

  return (
    <motion.section
      className={`${toneClass} px-4 py-16 sm:px-6 sm:py-20 lg:px-8 ${className}`}
      id={id}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.18 }}
      variants={getRevealVariants(reduceMotion)}
    >
      {children}
    </motion.section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  copy,
  align = "left",
  inverse = false,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  align?: "left" | "center";
  inverse?: boolean;
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p
        className={`text-sm font-semibold uppercase tracking-wide ${
          inverse ? "text-teal-200" : "text-teal-700"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-3 text-3xl font-bold tracking-tight sm:text-4xl ${
          inverse ? "text-white" : "text-slate-950"
        }`}
      >
        {title}
      </h2>
      {copy ? (
        <p
          className={`mt-4 text-lg leading-8 ${
            inverse ? "text-teal-50/90" : "text-slate-600"
          }`}
        >
          {copy}
        </p>
      ) : null}
    </div>
  );
}

function AnimatedGrid({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.16 }}
      variants={getContainerVariants(reduceMotion)}
    >
      {children}
    </motion.div>
  );
}

function RevealCard({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article className={className} variants={getRevealVariants(reduceMotion)}>
      {children}
    </motion.article>
  );
}

function Marker({ tone = "teal" }: { tone?: "teal" | "amber" | "slate" }) {
  const color =
    tone === "amber"
      ? "border-amber-200 bg-amber-100 text-amber-800"
      : tone === "slate"
        ? "border-slate-200 bg-slate-100 text-slate-700"
        : "border-teal-200 bg-teal-50 text-teal-800";

  return (
    <span
      aria-hidden="true"
      className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${color}`}
    >
      <span className="h-2.5 w-2.5 rounded-full bg-current" />
    </span>
  );
}

function ProductPreviewCard() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.aside
      className="relative rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-300/50 sm:p-4"
      aria-label="Sample Healthly review preview"
      initial={{ opacity: 0, y: reduceMotion ? 0 : 18, scale: reduceMotion ? 1 : 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: reduceMotion ? 0.01 : 0.58, ease: "easeOut" }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
    >
      <div className="absolute -right-3 -top-3 hidden rounded-full border border-teal-200 bg-white px-4 py-2 text-xs font-semibold text-teal-800 shadow-lg shadow-slate-200/80 sm:block">
        Prepared for verification
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
              Sample output
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
              Medicare plan letter review
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Informational summary for a possible specialist referral.
            </p>
          </div>
          <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
            Demo
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
            Can you confirm whether my referral and authorization are complete
            before the specialist appointment on the letter?
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

function HeroSection({ onStartDemo }: { onStartDemo: StartDemoHandler }) {
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
            Make Medicare paperwork easier to act on before your next call or
            appointment.
          </motion.h1>

          <motion.p
            className="mt-6 max-w-2xl text-lg leading-8 text-slate-600"
            variants={getRevealVariants(reduceMotion)}
          >
            Healthly helps you review Medicare notices, plan letters, referrals,
            and care instructions. It turns confusing details into a plain-language
            summary, possible items to verify, and practical questions for the
            right office.
          </motion.p>

          <motion.p
            className="mt-4 max-w-2xl text-base leading-7 text-slate-700"
            variants={getRevealVariants(reduceMotion)}
          >
            You stay in control: Healthly prepares you for conversations, but it
            does not make official Medicare, provider, or coverage decisions.
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
              Start Healthly demo
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

function TrustStrip() {
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

function WhyThisMattersSection() {
  return (
    <SectionWrapper id="why-it-matters">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Why this matters"
          title="Small paperwork questions can turn into real care friction."
          copy="Medicare-related documents often arrive when a visit, transition, or plan change is already moving. Healthly is designed for those moments when you need to slow down and understand what to verify."
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

function CommonSituationsSection() {
  return (
    <SectionWrapper id="common-situations" tone="soft">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1fr] lg:items-start">
          <SectionHeading
            eyebrow="Common situations"
            title="Built for the confusing moments people actually bring."
            copy="The demo works best when there is a document in front of you and a practical question to prepare for."
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

function WhatItReviewsSection() {
  return (
    <SectionWrapper id="what-it-reviews">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="What it reviews"
            title="Bring the documents that usually create uncertainty."
            copy="Healthly looks for useful context in the document and organizes it into a calm, reviewable summary."
          />
          <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm leading-6 text-teal-950 md:max-w-xs">
            It can help prepare verification questions. It cannot confirm
            eligibility, benefits, network status, or payment responsibility.
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

function ExampleOutputSection() {
  const reduceMotion = useReducedMotion();

  return (
    <SectionWrapper id="what-you-leave-with" tone="soft">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.86fr_1fr] lg:items-center">
        <div>
          <SectionHeading
            eyebrow="What you leave with"
            title="A more prepared version of the next conversation."
            copy="The goal is not to replace an official answer. It is to help you know what the document appears to say, what may need confirmation, and what to ask next."
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
            <h3 className="mt-3 text-2xl font-bold">Prepared call notes</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              The notice appears to reference a specialist visit and may require
              referral or authorization confirmation before the appointment.
            </p>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-bold text-amber-950">Flagged detail</p>
              <p className="mt-2 text-sm leading-6 text-amber-900">
                Authorization wording is unclear. Confirm approval status before
                the visit.
              </p>
            </div>
            <div className="rounded-xl border border-teal-200 bg-teal-50 p-4">
              <p className="text-sm font-bold text-teal-950">Details to verify</p>
              <p className="mt-2 text-sm leading-6 text-teal-900">
                Effective date, provider name, facility, referral number, and
                plan contact.
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-bold text-slate-950">Questions to ask</p>
            <ol className="mt-3 space-y-3 text-sm leading-6 text-slate-700">
              <li>1. Is the referral received and attached to this appointment?</li>
              <li>2. Is prior authorization approved, pending, or not required?</li>
              <li>3. Is this provider and facility covered for this visit?</li>
            </ol>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

function HowItWorksSection({ onStartDemo }: { onStartDemo: StartDemoHandler }) {
  return (
    <SectionWrapper id="how-it-works">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="How Healthly works"
            title="From confusing notice to prepared next step."
            copy="A short workflow keeps the review focused on understanding, verification, and preparation."
          />
          <MotionButton
            className="inline-flex min-h-12 w-fit items-center justify-center rounded-lg bg-teal-700 px-6 py-3 text-base font-semibold text-white shadow-sm shadow-teal-900/20 transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
            onClick={onStartDemo}
            type="button"
          >
            Start Healthly demo
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

function FAQSection() {
  const [openQuestion, setOpenQuestion] = useState(faqs[0]?.question ?? "");
  const reduceMotion = useReducedMotion();

  return (
    <SectionWrapper id="faq" tone="soft">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="FAQ"
          title="Clear answers about what the demo can and cannot do."
          copy="Healthly is intentionally careful: useful for preparation, limited when an official answer is required."
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

function FinalCTASection({ onStartDemo }: { onStartDemo: StartDemoHandler }) {
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
                Start with one confusing document and leave with a clearer next
                step.
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-700">
                Use Healthly to organize what your paperwork appears to say,
                prepare verification questions, and make the next call feel less
                open-ended.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <MotionButton
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-teal-700 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-teal-900/20 transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
                onClick={onStartDemo}
                type="button"
              >
                Start Healthly demo
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
                <li>Guidance only, not an official determination</li>
                <li>No provider, plan, or Medicare contact is made</li>
                <li>Designed for preparation before you confirm details</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

function TrustSection() {
  return (
    <SectionWrapper id="trust-limits" tone="deep">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 rounded-2xl border border-white/10 bg-white/[0.06] p-6 sm:p-8 lg:grid-cols-[0.82fr_1fr] lg:p-10">
          <SectionHeading
            eyebrow="Trust & limits"
            title="Informational guidance, not an official decision."
            copy="Healthly is a Medicare guidance demo for preparing questions and organizing paperwork. It does not determine eligibility, coverage, provider participation, referral status, authorization status, medical necessity, billing responsibility, or benefits."
            inverse
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Always confirm status and benefits directly with Medicare, your plan, and provider offices.",
              "Do not use this demo for emergencies, clinical decisions, or real case management workflows.",
              "Do not enter real sensitive health information into this frontend demo.",
              "Use flagged items as prompts for verification, not as final answers.",
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

export default function LandingPage() {
  const router = useRouter();

  const handleStartDemo = () => {
    router.push("/dashboard/intake");
  };

  return (
    <main className="min-h-screen scroll-smooth bg-white font-sans text-slate-950 selection:bg-teal-200">
      <Header onStartDemo={handleStartDemo} />
      <HeroSection onStartDemo={handleStartDemo} />
      <TrustStrip />
      <WhyThisMattersSection />
      <CommonSituationsSection />
      <WhatItReviewsSection />
      <ExampleOutputSection />
      <HowItWorksSection onStartDemo={handleStartDemo} />
      <FAQSection />
      <FinalCTASection onStartDemo={handleStartDemo} />
      <TrustSection />
    </main>
  );
}
