"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/dashboard/ui";

function TrustBanner() {
  return (
    <section className="border-y border-amber-200 bg-amber-50 px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl text-sm leading-6 text-amber-950 flex gap-3 text-left">
        <span className="text-amber-600 mt-0.5">⚠️</span>
        <p>
          <strong>Prototype limits:</strong> results are informational only. This
          tool does not determine Medicare eligibility, benefits, plan status, or
          provider acceptance. Verify Medicare status, plan participation, payment
          issues, and appointment availability directly with Medicare, your plan,
          and provider offices. No real appointments are booked and no records are
          sent.
        </p>
      </div>
    </section>
  );
}

function PricingSection({
  isSubscriber,
  onWorkspace,
}: {
  isSubscriber: boolean;
  onWorkspace: () => void;
}) {
  return (
    <section className="bg-white px-4 py-12 sm:px-6 lg:px-8" id="pricing">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,0.9fr)_24rem]">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-teal-700">
            Subscriber plan
          </div>
          <h2 className="mt-2 text-3xl font-bold text-slate-950">
            A patient workspace for Medicare paperwork.
          </h2>
          <p className="mt-4 max-w-3xl leading-7 text-slate-600 text-lg">
            The subscription experience is simulated. It shows how a consumer
            product could organize Medicare notices, surface possible coverage
            continuity questions, and prepare provider calls without storing
            documents or charging a card.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              "Paste or upload local text",
              "Review extracted fields",
              "Print a visit-ready summary",
            ].map((item) => (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm font-semibold text-slate-800 shadow-sm" key={item}>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="flex items-start justify-between gap-3 relative z-10">
            <div>
              <div className="text-sm font-semibold text-teal-300 tracking-wide uppercase">
                Coverage Companion
              </div>
              <div className="mt-2 text-5xl font-bold tracking-tight">$12</div>
              <div className="text-sm text-slate-400 mt-1 font-medium">per month, simulated</div>
            </div>
            <Badge tone="good">
              Prototype
            </Badge>
          </div>
          <ul className="mt-8 space-y-4 text-sm text-slate-300 relative z-10">
            <li className="flex gap-2"><span className="text-teal-400">✓</span> Medicare letter and plan notice organizer.</li>
            <li className="flex gap-2"><span className="text-teal-400">✓</span> Possible issue flags and verification questions.</li>
            <li className="flex gap-2"><span className="text-teal-400">✓</span> Local provider fit ranking over fictional demo data.</li>
            <li className="flex gap-2 text-slate-400"><span className="text-slate-600">✓</span> No real payment, account, storage, or claim decision.</li>
          </ul>
          <button
            className="mt-8 w-full rounded-xl bg-teal-500 px-5 py-3.5 font-semibold text-slate-950 transition hover:bg-teal-400 shadow-md hover:shadow-lg relative z-10"
            onClick={onWorkspace}
            type="button"
          >
            {isSubscriber ? "Open subscriber workspace" : "Continue to prototype"}
          </button>
        </div>
      </div>
    </section>
  );
}

function ProductHero({
  onWorkspace,
}: {
  onWorkspace: () => void;
}) {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      {/* Decorative background gradient */}
      <div className="absolute inset-x-0 bottom-0 top-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-900/40 via-slate-950 to-slate-950 pointer-events-none"></div>

      <div className="mx-auto grid min-h-[680px] max-w-7xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.8fr)] lg:px-8 relative z-10">
        <div className="flex flex-col justify-center pb-10 pt-6">
          <div className="mb-6">
            <Badge tone="dark">Frontend-only Medicare prototype</Badge>
          </div>
          <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight leading-[1.1] sm:text-6xl lg:text-7xl">
            Understand Medicare paperwork before it disrupts your care.
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-slate-300">
            Coverage-to-Care Rescue helps Medicare users review letters, plan
            notices, referral notes, and discharge paperwork for possible access
            issues, questions to verify, provider options, and next steps.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <button
              className="min-h-14 rounded-xl bg-teal-500 px-8 py-3 font-semibold tracking-wide text-slate-950 shadow-lg shadow-teal-500/20 transition hover:bg-teal-400 hover:-translate-y-0.5"
              onClick={onWorkspace}
              type="button"
            >
              Start Rescue Workflow
            </button>
            <a
              className="inline-flex min-h-14 items-center rounded-xl border border-white/20 px-8 py-3 font-semibold text-white transition hover:bg-white/10 hover:border-white/40"
              href="#pricing"
            >
              See prototype details
            </a>
          </div>
          <div className="mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
            {[
              ["Local", "Text is processed securely in your browser for this demo."],
              ["Careful", "Flags possible issues, never makes official determinations."],
              ["Practical", "Turns confusing paperwork into clear verification questions."],
            ].map(([label, copy]) => (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm" key={label}>
                <div className="font-bold text-teal-400 tracking-wide">{label}</div>
                <p className="mt-2 text-sm leading-6 text-slate-400">{copy}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-end lg:items-center">
          <div className="w-full rounded-2xl border border-white/10 bg-white p-2 text-slate-950 shadow-[0_0_50px_-12px_rgba(20,184,166,0.25)]">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Document review
                  </div>
                  <div className="mt-1 text-xl font-bold tracking-tight">Medicare notice scan</div>
                </div>
                <Badge tone="warn">Verify</Badge>
              </div>
              <div className="mt-6 space-y-3">
                {[
                  ["Coverage type", "Medicare Advantage"],
                  ["Possible issue", "Premium/payment notice"],
                  ["Deadline", "April 26, 2026"],
                  ["Provider fit", "Confirm plan participation"],
                ].map(([label, value]) => (
                  <div
                    className="grid grid-cols-[8rem_1fr] gap-3 rounded-xl border border-slate-200 bg-white p-3.5 text-sm shadow-sm"
                    key={label}
                  >
                    <div className="font-semibold text-slate-500">{label}</div>
                    <div className="font-bold text-slate-900">{value}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-xl border border-teal-100 bg-teal-50/50 p-4 text-sm leading-6 text-teal-900">
                <span className="font-semibold mr-1 text-teal-700">Suggested next step:</span> 
                Call the plan and provider office to confirm
                payment status, participation, and appointment requirements.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [isSubscriber, setIsSubscriber] = useState(false);

  const handleStartWorkspace = () => {
    setIsSubscriber(true);
    router.push("/dashboard/intake");
  };

  return (
    <main className="min-h-screen bg-[#f7f9f6] font-sans selection:bg-teal-500/30">
      <ProductHero 
        onWorkspace={handleStartWorkspace} 
      />
      <PricingSection 
        isSubscriber={isSubscriber} 
        onWorkspace={handleStartWorkspace} 
      />
      <TrustBanner />
    </main>
  );
}
