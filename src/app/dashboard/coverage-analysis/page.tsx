"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { Badge, Section } from "@/components/dashboard/ui";
import type {
  BlockerType,
  CaseStatus,
  NoticeType,
  ParsedNotice,
  UrgencyLevel,
} from "@/lib/types";

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string | undefined;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-950 outline-none focus:ring-2 focus:ring-emerald-500"
        onChange={onChange}
        placeholder={placeholder}
        type="text"
        value={value || ""}
      />
    </label>
  );
}

function splitTextarea(value: string) {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function NoticeAnalysisPage() {
  const router = useRouter();
  const {
    reviewNotice,
    setReviewNotice,
    preferences,
    setPreferences,
    triggerNextStep,
  } = useDashboard();

  useEffect(() => {
    if (!reviewNotice) {
      router.push("/dashboard/intake");
    }
  }, [reviewNotice, router]);

  if (!reviewNotice) return null;

  function updateParsed(patch: Partial<ParsedNotice>) {
    if (!reviewNotice) return;
    setReviewNotice({ ...reviewNotice, ...patch });
  }

  async function handleNextStep() {
    await triggerNextStep("notice-analysis-completed", { reviewNotice });
    router.push("/dashboard/rescue-path");
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-bold text-slate-950">Notice Analysis</h1>
        <p className="mt-2 text-slate-600">
          Review the extracted Medicaid notice fields before running the rescue agent.
        </p>
      </div>

      <Section eyebrow="Data Review" title="Confirm extracted notice details">
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          <span className="text-sm font-medium text-slate-700">Local extraction complete.</span>
          <Badge tone={reviewNotice.extractionConfidence === "high" ? "good" : "warn"}>
            {reviewNotice.extractionConfidence.toUpperCase()} CONFIDENCE
          </Badge>
          <Badge tone="blue">{reviewNotice.sourceKind.replaceAll("_", " ")}</Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Notice type</span>
            <select
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none focus:ring-2 focus:ring-emerald-500"
              onChange={(event) => updateParsed({ noticeType: event.target.value as NoticeType })}
              value={reviewNotice.noticeType}
            >
              <option value="closure">Closure</option>
              <option value="renewal">Renewal</option>
              <option value="termination">Termination</option>
              <option value="action_required">Action required</option>
              <option value="case_status">Case status</option>
              <option value="uploaded_text">Uploaded text</option>
            </select>
          </label>

          <Field
            label="Deadline or response date"
            onChange={(event) => updateParsed({ deadlineDate: event.target.value })}
            placeholder="YYYY-MM-DD"
            value={reviewNotice.deadlineDate}
          />

          <Field
            label="Patient name"
            onChange={(event) => updateParsed({ patientName: event.target.value })}
            value={reviewNotice.patientName}
          />

          <Field
            label="Medicaid program"
            onChange={(event) => updateParsed({ medicaidProgram: event.target.value })}
            placeholder="Family Medicaid, Adult Medicaid..."
            value={reviewNotice.medicaidProgram}
          />

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Exact blocker</span>
            <select
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none focus:ring-2 focus:ring-emerald-500"
              onChange={(event) =>
                updateParsed({ blockerType: event.target.value as BlockerType })
              }
              value={reviewNotice.blockerType}
            >
              <option value="missing_income_proof">Missing proof of income</option>
              <option value="missing_residency_proof">Missing proof of residency</option>
              <option value="incomplete_renewal">Incomplete renewal paperwork</option>
              <option value="eligibility_inconsistency">Eligibility inconsistency</option>
              <option value="missed_deadline">Missed deadline</option>
              <option value="upcoming_deadline">Upcoming deadline</option>
              <option value="manual_review">Manual review</option>
            </select>
          </label>

          <Field
            label="Blocker label"
            onChange={(event) => updateParsed({ blockerLabel: event.target.value })}
            value={reviewNotice.blockerLabel}
          />

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Urgency</span>
            <select
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none focus:ring-2 focus:ring-emerald-500"
              onChange={(event) => updateParsed({ urgency: event.target.value as UrgencyLevel })}
              value={reviewNotice.urgency}
            >
              <option value="routine">Routine</option>
              <option value="soon">Soon</option>
              <option value="urgent">Urgent</option>
              <option value="overdue">Overdue</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Case status</span>
            <select
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none focus:ring-2 focus:ring-emerald-500"
              onChange={(event) =>
                updateParsed({ caseStatus: event.target.value as CaseStatus })
              }
              value={reviewNotice.caseStatus}
            >
              <option value="notice_received">Notice received</option>
              <option value="blocker_identified">Blocker identified</option>
              <option value="awaiting_documents">Awaiting documents</option>
              <option value="ready_to_submit">Ready to submit</option>
              <option value="escalation_needed">Escalation needed</option>
              <option value="rescue_in_progress">Rescue in progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </label>

          <Field
            label="Language preference"
            onChange={(event) => {
              updateParsed({ languagePreference: event.target.value });
              setPreferences({ ...preferences, languagePreference: event.target.value });
            }}
            value={reviewNotice.languagePreference}
          />

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Communication preference</span>
            <select
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none focus:ring-2 focus:ring-emerald-500"
              onChange={(event) => {
                const contactMethod = event.target.value as "SMS" | "Email" | "Phone";
                updateParsed({ contactMethod });
                setPreferences({ ...preferences, contactMethod });
              }}
              value={reviewNotice.contactMethod ?? "SMS"}
            >
              <option value="SMS">SMS</option>
              <option value="Email">Email</option>
              <option value="Phone">Phone</option>
            </select>
          </label>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              Missing requirements
            </span>
            <textarea
              className="mt-2 min-h-32 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-950 outline-none focus:ring-2 focus:ring-emerald-500"
              onChange={(event) =>
                updateParsed({ missingRequirements: splitTextarea(event.target.value) })
              }
              value={reviewNotice.missingRequirements.join("\n")}
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Risk language</span>
            <textarea
              className="mt-2 min-h-32 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-950 outline-none focus:ring-2 focus:ring-emerald-500"
              onChange={(event) =>
                updateParsed({ riskLanguage: splitTextarea(event.target.value) })
              }
              value={reviewNotice.riskLanguage.join("\n")}
            />
          </label>
        </div>
      </Section>

      <div className="flex items-center justify-between border-t border-slate-200 pt-6">
        <button
          className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          onClick={() => router.push("/dashboard/intake")}
          type="button"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Intake
        </button>

        <button
          className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-600"
          onClick={handleNextStep}
          type="button"
        >
          Run Rescue Agent
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
