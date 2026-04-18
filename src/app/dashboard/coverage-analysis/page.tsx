"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { Section, Badge } from "@/components/dashboard/ui";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import type { MedicareCoverageType, UrgencyLevel, ParsedCase } from "@/lib/types";

function Field({ label, value, onChange, placeholder, type = "text", min }: {
  label: string;
  value: string | number | undefined;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  type?: string;
  min?: number;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <div className="mt-2">
        {type === "text" || type === "number" ? (
          <input
            type={type}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-950 focus:ring-2 focus:ring-teal-500 outline-none"
            value={value || ""}
            onChange={onChange}
            placeholder={placeholder}
            min={min}
          />
        ) : null}
      </div>
    </label>
  );
}

export default function CoverageAnalysisPage() {
  const router = useRouter();
  const { 
    reviewCase, setReviewCase, 
    preferences, setPreferences,
    triggerNextStep 
  } = useDashboard();

  useEffect(() => {
    if (!reviewCase) {
      router.push("/dashboard/intake");
    }
  }, [reviewCase, router]);

  if (!reviewCase) return null;

  function updateParsed(patch: Partial<ParsedCase>) {
    if (!reviewCase) return;
    setReviewCase({ ...reviewCase, ...patch });
  }

  async function handleNextStep() {
    await triggerNextStep("coverage-analysis-completed", { reviewCase });
    router.push("/dashboard/provider-matching");
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-b border-slate-200 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-slate-950">Coverage Analysis</h1>
        <p className="text-slate-600 mt-2">
          Review the extracted details from your documents before we run the matching algorithm.
        </p>
      </div>

      <Section 
        eyebrow="Data Review" 
        title="Confirm Extracted Medicare Details"
      >
        <div className="mb-6 flex flex-wrap items-center gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span className="text-sm font-medium text-slate-700">Analysis complete.</span>
          <Badge tone={reviewCase.extractionConfidence === "high" ? "good" : "warn"}>
            {reviewCase.extractionConfidence.toUpperCase()} CONFIDENCE
          </Badge>
          <Badge tone="blue">{reviewCase.sourceKind.replaceAll("_", " ")}</Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Medicare coverage type</span>
            <select
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-950 focus:ring-2 focus:ring-teal-500 outline-none"
              onChange={(e) =>
                updateParsed({
                  medicareCoverageType: e.target.value as MedicareCoverageType,
                  insuranceType: e.target.value,
                })
              }
              value={reviewCase.medicareCoverageType}
            >
              <option>Original Medicare</option>
              <option>Medicare Advantage</option>
              <option>Dual eligible</option>
              <option>Unknown</option>
            </select>
          </label>
          
          <Field 
            label="Deadline or date mentioned" 
            value={reviewCase.deadlineDate} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateParsed({ deadlineDate: e.target.value })}
            placeholder="YYYY-MM-DD"
          />
          <Field 
            label="Possible status or access issue" 
            value={reviewCase.possibleStatusIssue} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateParsed({ possibleStatusIssue: e.target.value })}
          />
          <Field 
            label="Referral specialty needed" 
            value={reviewCase.specialtyNeeded} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateParsed({ specialtyNeeded: e.target.value })}
          />
          
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Urgency</span>
            <select
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-950 focus:ring-2 focus:ring-teal-500 outline-none"
              onChange={(e) => updateParsed({ urgency: e.target.value as UrgencyLevel })}
              value={reviewCase.urgency}
            >
              <option value="routine">Routine</option>
              <option value="soon">Soon</option>
              <option value="urgent">Urgent</option>
            </select>
          </label>

          <Field 
            label="ZIP code" 
            value={reviewCase.locationZip} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateParsed({ locationZip: e.target.value })}
          />
          <Field 
            label="Language preference" 
            value={reviewCase.languagePreference} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              updateParsed({ languagePreference: e.target.value });
              setPreferences({ ...preferences, languagePreference: e.target.value });
            }}
          />
          <Field 
            type="number"
            min={1}
            label="Max provider distance (miles)" 
            value={preferences.maxDistanceMiles} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPreferences({ ...preferences, maxDistanceMiles: Number(e.target.value) })}
          />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <label className="flex items-start gap-4 rounded-lg border border-slate-200 bg-slate-50 p-5 cursor-pointer hover:bg-slate-100 transition">
            <input
              checked={reviewCase.premiumPaymentIssue}
              className="mt-1 h-5 w-5 rounded text-teal-600 focus:ring-teal-500"
              onChange={(e) => updateParsed({ premiumPaymentIssue: e.target.checked })}
              type="checkbox"
            />
            <span>
              <span className="block font-semibold text-slate-950">
                Premium/Payment issue detected
              </span>
              <span className="mt-1 block text-sm leading-6 text-slate-600">
                Signals a need to verify standing with the plan before scheduling.
              </span>
            </span>
          </label>
          <label className="flex items-start gap-4 rounded-lg border border-slate-200 bg-slate-50 p-5 cursor-pointer hover:bg-slate-100 transition">
            <input
              checked={reviewCase.transportationFlag}
              className="mt-1 h-5 w-5 rounded text-teal-600 focus:ring-teal-500"
              onChange={(e) => {
                updateParsed({ transportationFlag: e.target.checked });
                setPreferences({ ...preferences, transportationNeeded: e.target.checked });
              }}
              type="checkbox"
            />
            <span>
              <span className="block font-semibold text-slate-950">
                Transportation concern
              </span>
              <span className="mt-1 block text-sm leading-6 text-slate-600">
                Include transportation constraints in appointment routing.
              </span>
            </span>
          </label>
        </div>
      </Section>

      <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
        <button
          onClick={() => router.push("/dashboard/intake")}
          className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Intake
        </button>

        <button
          onClick={handleNextStep}
          className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-teal-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-teal-500"
        >
          Match Providers
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </div>
  );
}
