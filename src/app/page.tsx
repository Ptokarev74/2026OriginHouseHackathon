"use client";

import { useRouter } from "next/navigation";

type StartDemoHandler = () => void;

const reviewItems = [
  {
    label: "Coverage type",
    value: "Medicare Advantage notice",
  },
  {
    label: "Possible concern",
    value: "Referral or plan authorization may need confirmation",
  },
  {
    label: "Recommended verification",
    value: "Call the plan and provider office before the visit",
  },
  {
    label: "Suggested next step",
    value: "Prepare questions, dates, and document details for the call",
  },
];

const benefits = [
  {
    title: "Clearer",
    copy: "Turn complex Medicare notices into plain-language questions and next steps you can review before care is delayed.",
  },
  {
    title: "Practical",
    copy: "Prepare focused questions for your plan, provider office, or care team using details already found in your paperwork.",
  },
  {
    title: "Careful",
    copy: "Flag possible issues without making official Medicare, provider, eligibility, or coverage determinations.",
  },
];

const reviewTypes = [
  "Medicare notices and plan letters",
  "Referral and authorization paperwork",
  "Discharge or care transition instructions",
  "Provider office follow-up details",
];

const workflowSteps = [
  {
    step: "01",
    title: "Upload or paste a Medicare notice",
    copy: "Bring a letter, referral note, or care document into the demo workspace for review.",
  },
  {
    step: "02",
    title: "Review possible coverage risks and questions",
    copy: "Healthly highlights details that may be worth verifying with Medicare, your plan, or provider offices.",
  },
  {
    step: "03",
    title: "Leave with a visit-ready next-step summary",
    copy: "Use the summary to prepare calls, appointments, and care conversations with clearer context.",
  },
];

function Header({ onStartDemo }: { onStartDemo: StartDemoHandler }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <a className="flex items-center gap-3" href="#top" aria-label="Healthly home">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-600 text-lg font-bold text-white shadow-sm">
            H
          </span>
          <span className="text-xl font-bold tracking-tight text-slate-950">
            Goonmaster 6769
          </span>
        </a>

        <nav
          className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex"
          aria-label="Primary navigation"
        >
          <a className="transition hover:text-teal-700" href="#how-it-works">
            How it works
          </a>
          <a className="transition hover:text-teal-700" href="#what-it-reviews">
            What it reviews
          </a>
          <a className="transition hover:text-teal-700" href="#trust-limits">
            Trust & limits
          </a>
        </nav>

        <button
          className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
          onClick={onStartDemo}
          type="button"
        >
          Start Healthly demo
        </button>
      </div>
    </header>
  );
}

function SampleReviewCard() {
  return (
    <aside
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/70 sm:p-5"
      aria-label="Sample Healthly review"
    >
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
              Sample review
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
              Notice summary
            </h2>
          </div>
          <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
            Demo
          </span>
        </div>

        <dl className="mt-6 space-y-3">
          {reviewItems.map((item) => (
            <div
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
              key={item.label}
            >
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {item.label}
              </dt>
              <dd className="mt-1 text-sm font-semibold leading-6 text-slate-900">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 rounded-lg border border-teal-200 bg-teal-50 p-4">
          <p className="text-sm font-semibold text-teal-950">
            Ready-to-ask question
          </p>
          <p className="mt-2 text-sm leading-6 text-teal-900">
            What should I confirm before my appointment so coverage or referral
            questions do not delay care?
          </p>
        </div>
      </div>
    </aside>
  );
}

function HeroSection({ onStartDemo }: { onStartDemo: StartDemoHandler }) {
  return (
    <section
      className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-teal-50/80 via-white to-white"
      id="top"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1.02fr)_minmax(24rem,0.78fr)] lg:px-8 lg:py-24">
        <div className="flex flex-col justify-center">
          <p className="inline-flex w-fit rounded-full border border-teal-200 bg-white px-3 py-1 text-sm font-semibold text-teal-800 shadow-sm">
            Medicare guidance demo
          </p>

          <h1 className="mt-7 max-w-4xl text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Understand your Medicare paperwork before it disrupts your care.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Healthly helps you review Medicare notices, referral documents, and
            care paperwork in one place. It highlights possible issues, suggests
            questions to ask, and helps you prepare next steps before coverage
            problems delay care.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-teal-700 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
              onClick={onStartDemo}
              type="button"
            >
              Start Healthly demo
            </button>
            <a
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-800 shadow-sm transition hover:border-teal-300 hover:text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
              href="#how-it-works"
            >
              See how it works
            </a>
          </div>

          <div className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
            {["Plain-language review", "Verification questions", "Demo only"].map(
              (item) => (
                <div
                  className="rounded-lg border border-slate-200 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm"
                  key={item}
                >
                  {item}
                </div>
              ),
            )}
          </div>
        </div>

        <div className="flex items-center">
          <SampleReviewCard />
        </div>
      </div>
    </section>
  );
}

function WhyHealthlySection() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8" id="why-healthly">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
            Why Healthly
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Practical guidance for Medicare paperwork moments.
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Healthly is designed to help people slow down, organize what a notice
            says, and prepare better questions before making calls or attending a
            visit.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {benefits.map((benefit) => (
            <article
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              key={benefit.title}
            >
              <h3 className="text-xl font-bold text-slate-950">
                {benefit.title}
              </h3>
              <p className="mt-3 text-base leading-7 text-slate-600">
                {benefit.copy}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhatItReviewsSection() {
  return (
    <section
      className="border-y border-slate-200 bg-slate-50 px-4 py-16 sm:px-6 lg:px-8"
      id="what-it-reviews"
    >
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
            What it reviews
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Bring the documents that usually create confusion.
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {reviewTypes.map((type) => (
            <div
              className="rounded-xl border border-slate-200 bg-white p-5 text-base font-semibold leading-7 text-slate-800 shadow-sm"
              key={type}
            >
              {type}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection({ onStartDemo }: { onStartDemo: StartDemoHandler }) {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8" id="how-it-works">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
              How Healthly works
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              From confusing notice to prepared next step.
            </h2>
          </div>
          <button
            className="inline-flex min-h-12 w-fit items-center justify-center rounded-lg bg-teal-700 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
            onClick={onStartDemo}
            type="button"
          >
            Start Healthly demo
          </button>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {workflowSteps.map((step) => (
            <article
              className="rounded-xl border border-slate-200 bg-slate-50 p-6"
              key={step.step}
            >
              <span className="text-sm font-bold text-teal-700">
                {step.step}
              </span>
              <h3 className="mt-4 text-xl font-bold text-slate-950">
                {step.title}
              </h3>
              <p className="mt-3 text-base leading-7 text-slate-600">
                {step.copy}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section className="bg-teal-950 px-4 py-12 sm:px-6 lg:px-8" id="trust-limits">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-200">
            Trust & limits
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white">
            Informational guidance, not an official decision.
          </h2>
          <p className="mt-4 max-w-4xl text-base leading-8 text-teal-50">
            Healthly provides informational guidance only and does not make
            official Medicare, provider, or coverage determinations. Always
            confirm status and benefits directly with Medicare, your plan, and
            provider offices.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const router = useRouter();

  const handleStartDemo = () => {
    router.push("/dashboard/intake");
  };

  return (
    <main className="min-h-screen bg-white font-sans text-slate-950 selection:bg-teal-200">
      <Header onStartDemo={handleStartDemo} />
      <HeroSection onStartDemo={handleStartDemo} />
      <WhyHealthlySection />
      <WhatItReviewsSection />
      <HowItWorksSection onStartDemo={handleStartDemo} />
      <TrustSection />
    </main>
  );
}
