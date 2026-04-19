"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { Badge, Section } from "@/components/dashboard/ui";
import {
  blockerTypeLabel,
  caseStatusLabel,
  getDashboardCopy,
  noticeTypeLabel,
  sourceKindLabel,
  urgencyLabel,
} from "@/lib/i18n/dashboard";
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
  const { language } = useLanguage();
  const copy = getDashboardCopy(language);
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
        <h1 className="text-3xl font-bold text-slate-950">{copy.analysis.title}</h1>
        <p className="mt-2 text-slate-600">
          {copy.analysis.copy}
        </p>
      </div>

      <Section eyebrow={copy.analysis.eyebrow} title={copy.analysis.sectionTitle}>
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          <span className="text-sm font-medium text-slate-700">
            {copy.common.localExtractionComplete}
          </span>
          <Badge tone={reviewNotice.extractionConfidence === "high" ? "good" : "warn"}>
            {reviewNotice.extractionConfidence.toUpperCase()} {copy.common.confidence}
          </Badge>
          <Badge tone="blue">{sourceKindLabel(language, reviewNotice.sourceKind)}</Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              {copy.analysis.noticeType}
            </span>
            <select
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none focus:ring-2 focus:ring-emerald-500"
              onChange={(event) => updateParsed({ noticeType: event.target.value as NoticeType })}
              value={reviewNotice.noticeType}
            >
              <option value="closure">{noticeTypeLabel(language, "closure")}</option>
              <option value="renewal">{noticeTypeLabel(language, "renewal")}</option>
              <option value="termination">{noticeTypeLabel(language, "termination")}</option>
              <option value="action_required">
                {noticeTypeLabel(language, "action_required")}
              </option>
              <option value="case_status">{noticeTypeLabel(language, "case_status")}</option>
              <option value="uploaded_text">
                {noticeTypeLabel(language, "uploaded_text")}
              </option>
            </select>
          </label>

          <Field
            label={copy.analysis.deadline}
            onChange={(event) => updateParsed({ deadlineDate: event.target.value })}
            placeholder={copy.common.extractionPlaceholder}
            value={reviewNotice.deadlineDate}
          />

          <Field
            label={copy.analysis.patientName}
            onChange={(event) => updateParsed({ patientName: event.target.value })}
            value={reviewNotice.patientName}
          />

          <Field
            label={copy.analysis.medicaidProgram}
            onChange={(event) => updateParsed({ medicaidProgram: event.target.value })}
            placeholder={copy.common.familyProgramPlaceholder}
            value={reviewNotice.medicaidProgram}
          />

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              {copy.analysis.exactBlocker}
            </span>
            <select
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none focus:ring-2 focus:ring-emerald-500"
              onChange={(event) =>
                updateParsed({ blockerType: event.target.value as BlockerType })
              }
              value={reviewNotice.blockerType}
            >
              <option value="missing_income_proof">
                {blockerTypeLabel(language, "missing_income_proof")}
              </option>
              <option value="missing_residency_proof">
                {blockerTypeLabel(language, "missing_residency_proof")}
              </option>
              <option value="incomplete_renewal">
                {blockerTypeLabel(language, "incomplete_renewal")}
              </option>
              <option value="eligibility_inconsistency">
                {blockerTypeLabel(language, "eligibility_inconsistency")}
              </option>
              <option value="missed_deadline">
                {blockerTypeLabel(language, "missed_deadline")}
              </option>
              <option value="upcoming_deadline">
                {blockerTypeLabel(language, "upcoming_deadline")}
              </option>
              <option value="manual_review">
                {blockerTypeLabel(language, "manual_review")}
              </option>
            </select>
          </label>

          <Field
            label={copy.analysis.blockerLabel}
            onChange={(event) => updateParsed({ blockerLabel: event.target.value })}
            value={reviewNotice.blockerLabel}
          />

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              {copy.analysis.urgency}
            </span>
            <select
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none focus:ring-2 focus:ring-emerald-500"
              onChange={(event) => updateParsed({ urgency: event.target.value as UrgencyLevel })}
              value={reviewNotice.urgency}
            >
              <option value="routine">{urgencyLabel(language, "routine")}</option>
              <option value="soon">{urgencyLabel(language, "soon")}</option>
              <option value="urgent">{urgencyLabel(language, "urgent")}</option>
              <option value="overdue">{urgencyLabel(language, "overdue")}</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              {copy.analysis.caseStatus}
            </span>
            <select
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none focus:ring-2 focus:ring-emerald-500"
              onChange={(event) =>
                updateParsed({ caseStatus: event.target.value as CaseStatus })
              }
              value={reviewNotice.caseStatus}
            >
              <option value="notice_received">
                {caseStatusLabel(language, "notice_received")}
              </option>
              <option value="blocker_identified">
                {caseStatusLabel(language, "blocker_identified")}
              </option>
              <option value="awaiting_documents">
                {caseStatusLabel(language, "awaiting_documents")}
              </option>
              <option value="ready_to_submit">
                {caseStatusLabel(language, "ready_to_submit")}
              </option>
              <option value="escalation_needed">
                {caseStatusLabel(language, "escalation_needed")}
              </option>
              <option value="rescue_in_progress">
                {caseStatusLabel(language, "rescue_in_progress")}
              </option>
              <option value="resolved">{caseStatusLabel(language, "resolved")}</option>
            </select>
          </label>

          <Field
            label={copy.analysis.languagePreference}
            onChange={(event) => {
              updateParsed({ languagePreference: event.target.value });
              setPreferences({ ...preferences, languagePreference: event.target.value });
            }}
            value={reviewNotice.languagePreference}
          />

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              {copy.analysis.communicationPreference}
            </span>
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
              {copy.analysis.missingRequirements}
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
            <span className="text-sm font-semibold text-slate-700">
              {copy.analysis.riskLanguage}
            </span>
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
          {copy.analysis.back}
        </button>

        <button
          className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-600"
          onClick={handleNextStep}
          type="button"
        >
          {copy.analysis.run}
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
