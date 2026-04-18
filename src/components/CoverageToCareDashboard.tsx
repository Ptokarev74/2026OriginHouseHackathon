"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { parseDocuments } from "@/lib/domain/parsing";
import {
  runCoverageToCareAgent,
  workflowSteps,
  type WorkflowStepId,
} from "@/lib/workflow/agent";
import { LiveProviderCard } from "@/components/LiveProviderCard";
import { TinyFishRunLog } from "@/components/TinyFishRunLog";
import type {
  AgentRunResult,
  DocumentSourceKind,
  LiveProvider,
  MedicareCoverageType,
  ParsedCase,
  PatientPreferences,
  Provider,
  ProviderDiscoveryResult,
  RankedProvider,
  SampleCase,
  SecureCareStatus,
  SourceDocument,
  TinyFishAgentEvent,
  UrgencyLevel,
  WorkflowRunMode,
} from "@/lib/types";


type WorkflowStatus = "idle" | "running" | "complete";
type IntakeMode = "sample" | "upload";

type CoverageToCareDashboardProps = {
  sampleCases: SampleCase[];
  providers: Provider[];
};

const stepOrder = workflowSteps.map((step) => step.id);
const modeStorageKey = "coverage-companion-mode";
const subscriberStorageKey = "coverage-companion-subscriber";
const preferencesStorageKey = "coverage-companion-preferences";
const sessionTextKey = "coverage-companion-session-text";

const defaultPreferences: PatientPreferences = {
  maxDistanceMiles: 20,
  languagePreference: "English",
  transportationNeeded: false,
  needsTelehealth: false,
};

function getStoredMode(): IntakeMode {
  if (typeof window === "undefined") {
    return "sample";
  }

  const storedMode = window.localStorage.getItem(modeStorageKey);
  return storedMode === "upload" || storedMode === "sample" ? storedMode : "sample";
}

function getStoredSubscriber() {
  return typeof window !== "undefined"
    ? window.localStorage.getItem(subscriberStorageKey) === "true"
    : false;
}

function getStoredPreferences(): PatientPreferences {
  if (typeof window === "undefined") {
    return defaultPreferences;
  }

  const storedPreferences = window.localStorage.getItem(preferencesStorageKey);

  if (!storedPreferences) {
    return defaultPreferences;
  }

  try {
    return {
      ...defaultPreferences,
      ...(JSON.parse(storedPreferences) as PatientPreferences),
    };
  } catch {
    return defaultPreferences;
  }
}

function getStoredSessionText() {
  return typeof window !== "undefined"
    ? window.sessionStorage.getItem(sessionTextKey) ?? ""
    : "";
}

function wait(milliseconds: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

function classNames(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function titleStatus(status: WorkflowStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function buildUploadedDocument(text: string, sourceKind: DocumentSourceKind): SourceDocument {
  return {
    id: "uploaded-local-document",
    title: sourceKind === "txt_upload" ? "Uploaded text file" : "Pasted Medicare documents",
    documentType: "uploaded_text",
    content: text,
  };
}

function parseForReview(
  documents: SourceDocument[],
  preferences: PatientPreferences,
  sourceKind: DocumentSourceKind,
) {
  return parseDocuments(
    documents,
    preferences.languagePreference,
    preferences.transportationNeeded,
    sourceKind,
  );
}

function mergePreferencesFromParsed(
  parsed: ParsedCase,
  preferences: PatientPreferences,
): PatientPreferences {
  return {
    ...preferences,
    languagePreference: parsed.languagePreference || preferences.languagePreference,
    transportationNeeded: parsed.transportationFlag,
  };
}

function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "good" | "warn" | "danger" | "blue" | "dark";
}) {
  return (
    <span
      className={classNames(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        tone === "good" && "border-emerald-200 bg-emerald-50 text-emerald-800",
        tone === "warn" && "border-amber-200 bg-amber-50 text-amber-800",
        tone === "danger" && "border-rose-200 bg-rose-50 text-rose-800",
        tone === "blue" && "border-sky-200 bg-sky-50 text-sky-800",
        tone === "dark" && "border-slate-700 bg-slate-950 text-white",
        tone === "neutral" && "border-slate-200 bg-slate-50 text-slate-700",
      )}
    >
      {children}
    </span>
  );
}

function Section({
  title,
  eyebrow,
  children,
  className,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={classNames(
        "rounded-lg border border-slate-200 bg-white p-5 shadow-sm",
        className,
      )}
    >
      <div className="mb-4">
        {eyebrow ? (
          <div className="text-xs font-semibold uppercase tracking-wide text-teal-700">
            {eyebrow}
          </div>
        ) : null}
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function StatCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-2xl font-bold text-slate-950">{value}</div>
      <p className="mt-1 text-sm text-slate-600">{helper}</p>
    </div>
  );
}

function ProductHero({
  isSubscriber,
  onStart,
  onWorkspace,
}: {
  isSubscriber: boolean;
  onStart: () => void;
  onWorkspace: () => void;
}) {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="mx-auto grid min-h-[620px] max-w-7xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.8fr)] lg:px-8">
        <div className="flex flex-col justify-center pb-10 pt-6">
          <Badge tone="dark">Frontend-only Medicare prototype</Badge>
          <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight sm:text-6xl">
            Understand Medicare paperwork before it disrupts your care.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-200">
            Coverage-to-Care Rescue helps Medicare users review letters, plan
            notices, referral notes, and discharge paperwork for possible access
            issues, questions to verify, provider options, and next steps.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              className="min-h-12 rounded-lg bg-teal-400 px-5 py-3 font-semibold text-slate-950 shadow-sm transition hover:bg-teal-300"
              onClick={isSubscriber ? onWorkspace : onStart}
              type="button"
            >
              {isSubscriber ? "Continue as subscriber" : "Start subscription"}
            </button>
            <a
              className="inline-flex min-h-12 items-center rounded-lg border border-white/20 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
              href="#pricing"
            >
              See prototype plan
            </a>
          </div>
          <div className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
            {[
              ["Local", "Text is processed in your browser for this demo."],
              ["Careful", "Flags possible issues, never official determinations."],
              ["Practical", "Turns paperwork into verification questions."],
            ].map(([label, copy]) => (
              <div className="rounded-lg border border-white/10 bg-white/5 p-4" key={label}>
                <div className="font-semibold text-teal-200">{label}</div>
                <p className="mt-1 text-sm leading-6 text-slate-300">{copy}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-end lg:items-center">
          <div className="w-full rounded-lg border border-white/10 bg-white p-4 text-slate-950 shadow-2xl">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Document review
                  </div>
                  <div className="mt-1 text-xl font-bold">Medicare notice scan</div>
                </div>
                <Badge tone="warn">Verify</Badge>
              </div>
              <div className="mt-5 space-y-3">
                {[
                  ["Coverage type", "Medicare Advantage"],
                  ["Possible issue", "Premium/payment notice"],
                  ["Deadline", "April 26, 2026"],
                  ["Provider fit", "Confirm plan participation"],
                ].map(([label, value]) => (
                  <div
                    className="grid grid-cols-[8rem_1fr] gap-3 rounded-lg border border-slate-200 bg-white p-3 text-sm"
                    key={label}
                  >
                    <div className="font-semibold text-slate-500">{label}</div>
                    <div className="font-semibold text-slate-950">{value}</div>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-lg bg-teal-50 p-4 text-sm leading-6 text-teal-950">
                Suggested next step: call the plan and provider office to confirm
                payment status, participation, and appointment requirements.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingSection({
  isSubscriber,
  onStart,
  onWorkspace,
}: {
  isSubscriber: boolean;
  onStart: () => void;
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
          <p className="mt-4 max-w-3xl leading-7 text-slate-650">
            The subscription experience is simulated. It shows how a consumer
            product could organize Medicare notices, surface possible coverage
            continuity questions, and prepare provider calls without storing
            documents or charging a card.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              "Paste or upload local text",
              "Review extracted fields",
              "Print a visit-ready summary",
            ].map((item) => (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-800" key={item}>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-950 p-5 text-white shadow-xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-teal-200">
                Coverage Companion
              </div>
              <div className="mt-2 text-4xl font-bold">$12</div>
              <div className="text-sm text-slate-300">per month, simulated</div>
            </div>
            <Badge tone={isSubscriber ? "good" : "dark"}>
              {isSubscriber ? "Subscriber" : "Prototype"}
            </Badge>
          </div>
          <ul className="mt-6 space-y-3 text-sm text-slate-200">
            <li>Medicare letter and plan notice organizer.</li>
            <li>Possible issue flags and verification questions.</li>
            <li>Local provider fit ranking over fictional demo data.</li>
            <li>No real payment, account, storage, or claim decision.</li>
          </ul>
          <button
            className="mt-6 w-full rounded-lg bg-teal-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-teal-300"
            onClick={isSubscriber ? onWorkspace : onStart}
            type="button"
          >
            {isSubscriber ? "Open subscriber workspace" : "Continue as subscriber"}
          </button>
        </div>
      </div>
    </section>
  );
}

function TrustBanner() {
  return (
    <section className="border-y border-amber-200 bg-amber-50 px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl text-sm leading-6 text-amber-950">
        <strong>Prototype limits:</strong> results are informational only. This
        tool does not determine Medicare eligibility, benefits, plan status, or
        provider acceptance. Verify Medicare status, plan participation, payment
        issues, and appointment availability directly with Medicare, your plan,
        and provider offices. No real appointments are booked and no records are
        sent.
      </div>
    </section>
  );
}

function ModeSelector({
  mode,
  setMode,
}: {
  mode: IntakeMode;
  setMode: (mode: IntakeMode) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {[
        {
          id: "sample" as const,
          title: "Try a sample Medicare case",
          copy: "Use fictional local data to see the full workflow quickly.",
        },
        {
          id: "upload" as const,
          title: "Upload my documents",
          copy: "Paste text or upload a .txt file for local browser review.",
        },
      ].map((item) => (
        <button
          className={classNames(
            "rounded-lg border p-4 text-left transition",
            mode === item.id
              ? "border-teal-500 bg-teal-50 shadow-sm"
              : "border-slate-200 bg-white hover:border-slate-300",
          )}
          key={item.id}
          onClick={() => setMode(item.id)}
          type="button"
        >
          <div className="font-semibold text-slate-950">{item.title}</div>
          <p className="mt-1 text-sm leading-6 text-slate-600">{item.copy}</p>
        </button>
      ))}
    </div>
  );
}

function DocumentViewer({ documents }: { documents: SourceDocument[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {documents.map((document) => (
        <article
          className="rounded-lg border border-slate-200 bg-slate-50 p-4"
          key={document.id}
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold text-slate-950">{document.title}</h3>
            <Badge tone="blue">{document.documentType.replaceAll("_", " ")}</Badge>
          </div>
          <pre className="max-h-72 overflow-auto whitespace-pre-wrap text-sm leading-6 text-slate-700">
            {document.content}
          </pre>
        </article>
      ))}
    </div>
  );
}

function SampleIntake({
  sampleCases,
  selectedCase,
  onSelect,
}: {
  sampleCases: SampleCase[];
  selectedCase: SampleCase;
  onSelect: (id: string) => void;
}) {
  return (
    <Section eyebrow="Demo path" title="Try a sample Medicare case">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_17rem]">
        <div>
          <label className="text-sm font-semibold text-slate-700" htmlFor="case-select">
            Case
          </label>
          <select
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-slate-950 shadow-sm"
            id="case-select"
            onChange={(event) => onSelect(event.target.value)}
            value={selectedCase.id}
          >
            {sampleCases.map((sampleCase) => (
              <option key={sampleCase.id} value={sampleCase.id}>
                {sampleCase.label}
              </option>
            ))}
          </select>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {selectedCase.description}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Preferences
          </div>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Max distance</dt>
              <dd className="font-semibold text-slate-950">
                {selectedCase.preferences.maxDistanceMiles} miles
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Language</dt>
              <dd className="font-semibold text-slate-950">
                {selectedCase.preferences.languagePreference ?? "Any"}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Transportation</dt>
              <dd className="font-semibold text-slate-950">
                {selectedCase.preferences.transportationNeeded ? "Concern" : "None"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </Section>
  );
}

function UploadIntake({
  uploadText,
  fileMessage,
  onTextChange,
  onFileChange,
}: {
  uploadText: string;
  fileMessage?: string;
  onTextChange: (value: string) => void;
  onFileChange: (file: File) => void;
}) {
  return (
    <Section eyebrow="Your documents" title="Paste or upload Medicare text">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div>
          <label className="text-sm font-semibold text-slate-700" htmlFor="upload-text">
            Document text
          </label>
          <textarea
            className="mt-2 min-h-72 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm leading-6 text-slate-950 shadow-sm"
            id="upload-text"
            onChange={(event) => onTextChange(event.target.value)}
            placeholder="Paste Medicare notices, plan letters, referral notes, discharge instructions, or provider letters here."
            value={uploadText}
          />
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <label className="text-sm font-semibold text-slate-700" htmlFor="file-upload">
            Local file
          </label>
          <input
            accept=".txt,.pdf,text/plain,application/pdf"
            className="mt-2 block w-full text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-950 file:px-3 file:py-2 file:font-semibold file:text-white"
            id="file-upload"
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (file) {
                onFileChange(file);
              }
            }}
            type="file"
          />
          <p className="mt-3 text-sm leading-6 text-slate-600">
            `.txt` files are read in the browser. PDFs are not parsed in this
            prototype; paste text from the PDF instead.
          </p>
          {fileMessage ? (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
              {fileMessage}
            </div>
          ) : null}
        </div>
      </div>
    </Section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function ReviewForm({
  parsedCase,
  preferences,
  onParsedChange,
  onPreferencesChange,
}: {
  parsedCase: ParsedCase;
  preferences: PatientPreferences;
  onParsedChange: (parsedCase: ParsedCase) => void;
  onPreferencesChange: (preferences: PatientPreferences) => void;
}) {
  function updateParsed(patch: Partial<ParsedCase>) {
    onParsedChange({ ...parsedCase, ...patch });
  }

  function updatePreferences(patch: Partial<PatientPreferences>) {
    onPreferencesChange({ ...preferences, ...patch });
  }

  return (
    <Section eyebrow="Review before running" title="Confirm extracted Medicare details">
      <div className="mb-4 flex flex-wrap gap-2">
        <Badge tone={parsedCase.extractionConfidence === "high" ? "good" : "warn"}>
          {titleCase(parsedCase.extractionConfidence)} confidence
        </Badge>
        <Badge tone="blue">{parsedCase.sourceKind.replaceAll("_", " ")}</Badge>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Medicare coverage type">
          <select
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-slate-950"
            onChange={(event) =>
              updateParsed({
                medicareCoverageType: event.target.value as MedicareCoverageType,
                insuranceType: event.target.value,
              })
            }
            value={parsedCase.medicareCoverageType}
          >
            <option>Original Medicare</option>
            <option>Medicare Advantage</option>
            <option>Dual eligible</option>
            <option>Unknown</option>
          </select>
        </Field>
        <Field label="Deadline or date mentioned">
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-3 text-slate-950"
            onChange={(event) => updateParsed({ deadlineDate: event.target.value })}
            placeholder="YYYY-MM-DD or date from notice"
            value={parsedCase.deadlineDate ?? ""}
          />
        </Field>
        <Field label="Possible status or access issue">
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-3 text-slate-950"
            onChange={(event) =>
              updateParsed({ possibleStatusIssue: event.target.value })
            }
            value={parsedCase.possibleStatusIssue ?? ""}
          />
        </Field>
        <Field label="Referral specialty needed">
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-3 text-slate-950"
            onChange={(event) => updateParsed({ specialtyNeeded: event.target.value })}
            value={parsedCase.specialtyNeeded}
          />
        </Field>
        <Field label="Urgency">
          <select
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-slate-950"
            onChange={(event) =>
              updateParsed({ urgency: event.target.value as UrgencyLevel })
            }
            value={parsedCase.urgency}
          >
            <option value="routine">Routine</option>
            <option value="soon">Soon</option>
            <option value="urgent">Urgent</option>
          </select>
        </Field>
        <Field label="ZIP code">
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-3 text-slate-950"
            onChange={(event) => updateParsed({ locationZip: event.target.value })}
            value={parsedCase.locationZip}
          />
        </Field>
        <Field label="Language preference">
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-3 text-slate-950"
            onChange={(event) => {
              updateParsed({ languagePreference: event.target.value });
              updatePreferences({ languagePreference: event.target.value });
            }}
            value={parsedCase.languagePreference ?? ""}
          />
        </Field>
        <Field label="Max provider distance">
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-3 text-slate-950"
            min={1}
            onChange={(event) =>
              updatePreferences({ maxDistanceMiles: Number(event.target.value) })
            }
            type="number"
            value={preferences.maxDistanceMiles}
          />
        </Field>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <input
            checked={parsedCase.premiumPaymentIssue}
            className="mt-1 h-4 w-4"
            onChange={(event) =>
              updateParsed({ premiumPaymentIssue: event.target.checked })
            }
            type="checkbox"
          />
          <span>
            <span className="block font-semibold text-slate-950">
              Premium or payment issue mentioned
            </span>
            <span className="mt-1 block text-sm leading-6 text-slate-600">
              Use this only as a signal to verify with the plan.
            </span>
          </span>
        </label>
        <label className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <input
            checked={parsedCase.transportationFlag}
            className="mt-1 h-4 w-4"
            onChange={(event) => {
              updateParsed({ transportationFlag: event.target.checked });
              updatePreferences({ transportationNeeded: event.target.checked });
            }}
            type="checkbox"
          />
          <span>
            <span className="block font-semibold text-slate-950">
              Transportation concern
            </span>
            <span className="mt-1 block text-sm leading-6 text-slate-600">
              Include transportation in appointment preparation.
            </span>
          </span>
        </label>
      </div>
    </Section>
  );
}

function WorkflowTimeline({
  activeStep,
  status,
  result,
}: {
  activeStep?: WorkflowStepId;
  status: WorkflowStatus;
  result?: AgentRunResult;
}) {
  const activeIndex = activeStep ? stepOrder.indexOf(activeStep) : -1;

  return (
    <div className="space-y-3">
      {workflowSteps.map((step, index) => {
        const completed =
          status === "complete" || (status === "running" && index < activeIndex);
        const active = status === "running" && activeStep === step.id;

        return (
          <div className="grid grid-cols-[2rem_1fr] gap-3" key={step.id}>
            <div
              className={classNames(
                "flex h-8 w-8 items-center justify-center rounded-full border text-sm font-bold",
                completed && "border-emerald-300 bg-emerald-100 text-emerald-800",
                active && "border-sky-300 bg-sky-100 text-sky-800",
                !completed &&
                  !active &&
                  "border-slate-200 bg-slate-50 text-slate-400",
              )}
            >
              {completed ? "OK" : index + 1}
            </div>
            <div className="pb-2">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-slate-950">{step.label}</h3>
                {active ? <Badge tone="blue">Running</Badge> : null}
                {completed ? <Badge tone="good">Done</Badge> : null}
              </div>
              <p className="mt-1 text-sm text-slate-600">{step.description}</p>
            </div>
          </div>
        );
      })}

      {result ? (
        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h3 className="font-semibold text-slate-950">Simulated action log</h3>
          <div className="mt-3 space-y-3">
            {result.actions.map((action) => (
              <div className="rounded-lg border border-slate-200 bg-white p-3" key={action.id}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-slate-900">{action.label}</span>
                  <Badge tone={action.status === "blocked" ? "danger" : "good"}>
                    {action.status}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-slate-700">{action.summary}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ParsedSummary({ result }: { result: AgentRunResult }) {
  const parsedCase = result.parsedCase;
  const rows = [
    ["Coverage type", parsedCase.medicareCoverageType],
    ["Plan or insurance", parsedCase.insuranceType],
    ["Date to verify", parsedCase.deadlineDate ?? "No reliable date found"],
    ["Specialty", parsedCase.specialtyNeeded],
    ["Urgency", parsedCase.urgency],
    ["ZIP", parsedCase.locationZip],
    ["Language", parsedCase.languagePreference ?? "No preference entered"],
    ["Transportation", parsedCase.transportationFlag ? "Concern noted" : "Not flagged"],
  ];

  return (
    <div>
      <p className="mb-4 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700">
        {parsedCase.documentSummary}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3" key={label}>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {label}
            </div>
            <div className="mt-1 font-semibold text-slate-950">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CoveragePanel({ result }: { result: AgentRunResult }) {
  const assessment = result.coverageAssessment;
  const tone =
    assessment.riskLevel === "urgent"
      ? "danger"
      : assessment.riskLevel === "low"
        ? "good"
        : "warn";

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        <Badge tone={tone}>{assessment.riskLabel}</Badge>
        {assessment.possibleDisruption ? (
          <Badge tone="warn">Possible disruption signal</Badge>
        ) : null}
        <Badge tone="blue">Verify directly</Badge>
      </div>
      <ul className="space-y-2 text-sm text-slate-700">
        {assessment.findings.map((finding) => (
          <li className="rounded-lg bg-slate-50 p-3" key={finding}>
            {finding}
          </li>
        ))}
      </ul>
    </div>
  );
}

function QuestionsPanel({ result }: { result: AgentRunResult }) {
  return (
    <ul className="space-y-2 text-sm text-slate-700">
      {result.coverageAssessment.verificationQuestions.map((question) => (
        <li className="rounded-lg bg-slate-50 p-3" key={question}>
          {question}
        </li>
      ))}
    </ul>
  );
}

function ProviderTable({ providers }: { providers: RankedProvider[] }) {
  if (providers.length === 0) {
    return (
      <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
        No local provider options matched the current specialty, Medicare fit,
        distance, language, and new-patient filters. Try widening distance or
        verifying provider participation manually.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left text-sm">
        <thead>
          <tr className="text-xs uppercase tracking-wide text-slate-500">
            <th className="border-b border-slate-200 px-3 py-2">Provider</th>
            <th className="border-b border-slate-200 px-3 py-2">Score</th>
            <th className="border-b border-slate-200 px-3 py-2">Access</th>
            <th className="border-b border-slate-200 px-3 py-2">Languages</th>
            <th className="border-b border-slate-200 px-3 py-2">Why ranked here</th>
          </tr>
        </thead>
        <tbody>
          {providers.map((provider, index) => (
            <tr className="align-top" key={provider.id}>
              <td className="border-b border-slate-100 px-3 py-4">
                <div className="font-semibold text-slate-950">{provider.name}</div>
                <div className="text-slate-500">{provider.specialty}</div>
                {index === 0 ? (
                  <div className="mt-2">
                    <Badge tone="good">Top local option</Badge>
                  </div>
                ) : null}
              </td>
              <td className="border-b border-slate-100 px-3 py-4">
                <div className="text-2xl font-bold text-slate-950">{provider.score}</div>
                <div className="text-slate-500">of 100</div>
              </td>
              <td className="border-b border-slate-100 px-3 py-4 text-slate-700">
                <div>{provider.distanceMiles.toFixed(1)} miles</div>
                <div>{provider.availabilityDays} day availability signal</div>
                <div>{provider.estimatedCostLevel} cost signal</div>
                <div>{provider.telehealth ? "Telehealth listed" : "In person"}</div>
              </td>
              <td className="border-b border-slate-100 px-3 py-4 text-slate-700">
                {provider.languages.join(", ")}
              </td>
              <td className="border-b border-slate-100 px-3 py-4">
                <ul className="space-y-1 text-slate-600">
                  {provider.explanation.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FinalOutcome({ result }: { result: AgentRunResult }) {
  const provider = result.selectedProvider;

  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
            Suggested next steps
          </div>
          <h2 className="mt-1 text-2xl font-bold text-emerald-950">
            {result.finalStatus === "next_steps_ready"
              ? "Summary ready for verification"
              : "Manual review recommended"}
          </h2>
        </div>
        <Badge tone={result.finalStatus === "next_steps_ready" ? "good" : "warn"}>
          {result.finalStatus.replaceAll("_", " ")}
        </Badge>
      </div>
      <p className="mt-4 text-slate-800">{result.outcomeSummary}</p>
      {provider ? (
        <div className="mt-4 rounded-lg bg-white/80 p-4">
          <div className="font-semibold text-slate-950">
            Top provider option: {provider.name}
          </div>
          <p className="mt-1 text-sm text-slate-700">
            Ranking is based on local demo data. Confirm plan participation,
            new-patient status, costs, and availability directly.
          </p>
        </div>
      ) : null}
      <div className="mt-4">
        <h3 className="font-semibold text-emerald-950">Next steps</h3>
        <ul className="mt-2 space-y-2 text-sm text-slate-800">
          {result.patientInstructions.map((instruction) => (
            <li className="rounded-lg bg-white/70 p-3" key={instruction}>
              {instruction}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PrintableSummary({ result }: { result: AgentRunResult }) {
  const topProviders = result.rankedProviders.slice(0, 3);

  return (
    <section className="print-summary mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-teal-700">
            Printable summary
          </div>
          <h2 className="mt-1 text-2xl font-bold text-slate-950">
            Medicare paperwork review
          </h2>
        </div>
        <Badge tone="neutral">Informational only</Badge>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-950">Document summary</h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            {result.parsedCase.documentSummary}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-950">Reviewed details</h3>
          <dl className="mt-2 space-y-1 text-sm text-slate-700">
            <div>Coverage: {result.parsedCase.medicareCoverageType}</div>
            <div>Date: {result.parsedCase.deadlineDate ?? "Verify manually"}</div>
            <div>Specialty: {result.parsedCase.specialtyNeeded}</div>
            <div>ZIP: {result.parsedCase.locationZip}</div>
          </dl>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-950">Possible issue flags</h3>
          <ul className="mt-2 space-y-2 text-sm text-slate-700">
            {result.coverageAssessment.findings.slice(0, 5).map((finding) => (
              <li key={finding}>{finding}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-950">Top provider options</h3>
          <ul className="mt-2 space-y-2 text-sm text-slate-700">
            {topProviders.length > 0 ? (
              topProviders.map((provider) => (
                <li key={provider.id}>
                  {provider.name} - {provider.score}/100, {provider.distanceMiles.toFixed(1)} miles
                </li>
              ))
            ) : (
              <li>No local provider match in the demo dataset.</li>
            )}
          </ul>
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-950">Suggested next steps</h3>
          <ul className="mt-2 space-y-2 text-sm text-slate-700">
            {result.patientInstructions.map((instruction) => (
              <li key={instruction}>{instruction}</li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-5 rounded-lg bg-amber-50 p-4 text-sm leading-6 text-amber-950">
        This summary is from a frontend-only prototype. It does not determine
        Medicare eligibility, benefits, plan status, provider acceptance, or
        appointment availability. Confirm details directly before taking action.
      </p>
    </section>
  );
}

export function CoverageToCareDashboard({
  sampleCases,
  providers,
}: CoverageToCareDashboardProps) {
  const [isSubscriber, setIsSubscriber] = useState(getStoredSubscriber);
  const [showWorkspace, setShowWorkspace] = useState(getStoredSubscriber);
  const [mode, setModeState] = useState<IntakeMode>(getStoredMode);
  const [selectedCaseId, setSelectedCaseId] = useState(sampleCases[0]?.id ?? "");
  const [preferences, setPreferences] =
    useState<PatientPreferences>(getStoredPreferences);
  const [uploadText, setUploadText] = useState(getStoredSessionText);
  const [uploadSourceKind, setUploadSourceKind] =
    useState<DocumentSourceKind>("pasted");
  const [fileMessage, setFileMessage] = useState<string>();
  const [reviewCase, setReviewCase] = useState<ParsedCase | undefined>(() => {
    const storedMode = getStoredMode();
    const storedPreferences = getStoredPreferences();
    const storedText = getStoredSessionText();

    if (storedMode === "upload" && storedText.trim()) {
      return parseForReview(
        [buildUploadedDocument(storedText, "pasted")],
        storedPreferences,
        "pasted",
      );
    }

    if (sampleCases[0]) {
      return parseForReview(
        [sampleCases[0].notice, sampleCases[0].referralNote],
        sampleCases[0].preferences,
        "sample",
      );
    }

    return undefined;
  });
  const [status, setStatus] = useState<WorkflowStatus>("idle");
  const [activeStep, setActiveStep] = useState<WorkflowStepId>();
  const [result, setResult] = useState<AgentRunResult>();

  // ── TinyFish state ────────────────────────────────────────────────────────
  const [discoveryResult, setDiscoveryResult] = useState<ProviderDiscoveryResult>();
  const [discoveryLoading, setDiscoveryLoading] = useState(false);
  const [tinyfishRunMode, setTinyfishRunMode] = useState<WorkflowRunMode>("local");
  const [agentEvents, setAgentEvents] = useState<TinyFishAgentEvent[]>([]);
  const [agentStreaming, setAgentStreaming] = useState(false);
  const [selectedLiveProvider, setSelectedLiveProvider] = useState<LiveProvider>();
  const [secureCareStatus, setSecureCareStatus] = useState<SecureCareStatus>();
  const [logPhase, setLogPhase] =
    useState<"idle" | "discover" | "secure_care">("idle");


  const selectedCase = useMemo(
    () =>
      sampleCases.find((sampleCase) => sampleCase.id === selectedCaseId) ??
      sampleCases[0],
    [sampleCases, selectedCaseId],
  );

  const activeDocuments = useMemo(() => {
    if (mode === "sample" && selectedCase) {
      return [selectedCase.notice, selectedCase.referralNote];
    }

    if (uploadText.trim()) {
      return [buildUploadedDocument(uploadText, uploadSourceKind)];
    }

    return [];
  }, [mode, selectedCase, uploadSourceKind, uploadText]);

  useEffect(() => {
    window.localStorage.setItem(modeStorageKey, mode);
  }, [mode]);

  useEffect(() => {
    window.localStorage.setItem(preferencesStorageKey, JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    if (uploadText.trim()) {
      window.sessionStorage.setItem(sessionTextKey, uploadText);
    } else {
      window.sessionStorage.removeItem(sessionTextKey);
    }
  }, [uploadText]);

  function setMode(nextMode: IntakeMode) {
    setModeState(nextMode);
    setResult(undefined);
    setStatus("idle");
    setActiveStep(undefined);

    if (nextMode === "sample") {
      const parsed = parseForReview(
        [selectedCase.notice, selectedCase.referralNote],
        selectedCase.preferences,
        "sample",
      );
      setPreferences(mergePreferencesFromParsed(parsed, selectedCase.preferences));
      setReviewCase(parsed);
      return;
    }

    if (uploadText.trim()) {
      const parsed = parseForReview(
        [buildUploadedDocument(uploadText, uploadSourceKind)],
        preferences,
        uploadSourceKind,
      );
      setReviewCase(parsed);
    } else {
      setReviewCase(undefined);
    }
  }

  function startSubscription() {
    window.localStorage.setItem(subscriberStorageKey, "true");
    setIsSubscriber(true);
    setShowWorkspace(true);
  }

  function updateSelectedCase(id: string) {
    const nextCase =
      sampleCases.find((sampleCase) => sampleCase.id === id) ?? selectedCase;
    const parsed = parseForReview(
      [nextCase.notice, nextCase.referralNote],
      nextCase.preferences,
      "sample",
    );

    setSelectedCaseId(id);
    setPreferences(mergePreferencesFromParsed(parsed, nextCase.preferences));
    setReviewCase(parsed);
    setResult(undefined);
    setStatus("idle");
    setActiveStep(undefined);
  }

  function updateUploadText(value: string) {
    setUploadText(value);
    setUploadSourceKind("pasted");
    setFileMessage(undefined);

    if (value.trim()) {
      setReviewCase(
        parseForReview([buildUploadedDocument(value, "pasted")], preferences, "pasted"),
      );
    } else {
      setReviewCase(undefined);
    }

    setResult(undefined);
    setStatus("idle");
    setActiveStep(undefined);
  }

  function handleFile(file: File) {
    const lowerName = file.name.toLowerCase();

    if (lowerName.endsWith(".pdf") || file.type === "application/pdf") {
      setFileMessage(
        "PDF parsing is not included in this local prototype. Paste text from the PDF into the document box to continue.",
      );
      setUploadSourceKind("pdf_unsupported");
      return;
    }

    if (!lowerName.endsWith(".txt") && file.type !== "text/plain") {
      setFileMessage("Only .txt files are read locally in this prototype.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      setUploadText(text);
      setUploadSourceKind("txt_upload");
      setReviewCase(
        text.trim()
          ? parseForReview(
              [buildUploadedDocument(text, "txt_upload")],
              preferences,
              "txt_upload",
            )
          : undefined,
      );
      setResult(undefined);
      setStatus("idle");
      setActiveStep(undefined);
      setFileMessage(`${file.name} loaded locally in the browser.`);
    };
    reader.onerror = () => {
      setFileMessage("The file could not be read. Paste the text manually to continue.");
    };
    reader.readAsText(file);
  }

  async function runWorkflow() {
    if (!reviewCase || activeDocuments.length === 0 || status === "running") {
      return;
    }

    const runPreferences = mergePreferencesFromParsed(reviewCase, preferences);

    setResult(undefined);
    setStatus("running");
    // Reset TinyFish state on new run
    setDiscoveryResult(undefined);
    setAgentEvents([]);
    setSelectedLiveProvider(undefined);
    setSecureCareStatus(undefined);
    setLogPhase("idle");

    for (const step of workflowSteps) {
      setActiveStep(step.id);
      await wait(step.id === "outcome" ? 320 : 460);
    }

    const runResult = runCoverageToCareAgent({
      documents: activeDocuments,
      reviewedCase: reviewCase,
      preferences: runPreferences,
      providers,
    });

    setResult(runResult);
    setStatus("complete");
    setActiveStep(undefined);
  }

  /** Calls the /api/tinyfish/discover route and updates state. */
  const runProviderDiscovery = useCallback(async () => {
    if (!reviewCase || discoveryLoading) return;
    setDiscoveryLoading(true);
    setDiscoveryResult(undefined);
    setAgentEvents([]);
    setSelectedLiveProvider(undefined);
    setSecureCareStatus(undefined);
    setLogPhase("discover");

    try {
      const response = await fetch("/api/tinyfish/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          specialty: reviewCase.specialtyNeeded,
          zip: reviewCase.locationZip !== "Unknown" ? reviewCase.locationZip : "78701",
          insuranceType: reviewCase.insuranceType,
        }),
      });
      const data = (await response.json()) as ProviderDiscoveryResult;
      setDiscoveryResult(data);
      setTinyfishRunMode(data.mode);
    } catch (err) {
      console.error("Discovery failed", err);
    } finally {
      setDiscoveryLoading(false);
    }
  }, [reviewCase, discoveryLoading]);

  /** Calls /api/tinyfish/secure-care and streams SSE events into state. */
  const runSecureCare = useCallback(
    async (provider: LiveProvider) => {
      if (agentStreaming) return;
      setSelectedLiveProvider(provider);
      setSecureCareStatus("in_progress");
      setAgentEvents([]);
      setAgentStreaming(true);
      setLogPhase("secure_care");

      try {
        const response = await fetch("/api/tinyfish/secure-care", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contactUrl: provider.contact_url,
            providerName: provider.provider_name,
            specialty: provider.specialty,
            insuranceType: reviewCase?.insuranceType ?? "Medicaid",
          }),
        });

        if (!response.body) throw new Error("No stream body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const jsonStr = trimmed.slice(5).trim();
            try {
              const event = JSON.parse(jsonStr) as TinyFishAgentEvent;
              setAgentEvents((prev) => [...prev, event]);
              if (event.type === "COMPLETE") {
                setSecureCareStatus("contact_requested");
              }
            } catch {
              // partial JSON — ignore
            }
          }
        }
      } catch (err) {
        console.error("Secure care agent failed", err);
        setSecureCareStatus("needs_escalation");
      } finally {
        setAgentStreaming(false);
      }
    },
    [agentStreaming, reviewCase],
  );


  if (!selectedCase) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-6 text-rose-900">
          No sample cases are available.
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f9f6] text-slate-950">
      <div className="no-print">
        <ProductHero
          isSubscriber={isSubscriber}
          onStart={startSubscription}
          onWorkspace={() => setShowWorkspace(true)}
        />
        <PricingSection
          isSubscriber={isSubscriber}
          onStart={startSubscription}
          onWorkspace={() => setShowWorkspace(true)}
        />
        <TrustBanner />
      </div>

      {showWorkspace ? (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <header className="no-print mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-sm font-semibold uppercase tracking-wide text-teal-700">
                Subscriber workspace
              </div>
              <h2 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">
                Medicare continuity review
              </h2>
              <p className="mt-3 max-w-3xl leading-7 text-slate-650">
                Choose a sample or review your own local text, confirm the
                extracted fields, then run the workflow for informational next
                steps and provider-fit signals.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {result ? (
                <button
                  className="inline-flex min-h-12 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-950 shadow-sm transition hover:bg-slate-50"
                  onClick={() => window.print()}
                  type="button"
                >
                  Print summary
                </button>
              ) : null}
              <button
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-slate-950 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                disabled={!reviewCase || activeDocuments.length === 0 || status === "running"}
                onClick={runWorkflow}
                type="button"
              >
                {status === "running" ? "Review running..." : "Run Medicare review"}
              </button>
            </div>
          </header>

          <div className="no-print mb-6 grid gap-4 md:grid-cols-4">
            <StatCard
              helper="Fictional local cases"
              label="Sample cases"
              value={String(sampleCases.length)}
            />
            <StatCard
              helper="Ranked locally"
              label="Provider dataset"
              value={String(providers.length)}
            />
            <StatCard
              helper={discoveryResult ? `${discoveryResult.providers.length} found • ${discoveryResult.mode}` : "Not yet run"}
              label="Live discovery"
              value={discoveryResult ? String(discoveryResult.providers.length) : "—"}
            />
            <StatCard
              helper={status === "complete" ? "Summary ready" : "Awaiting review"}
              label="Status"
              value={secureCareStatus ?? (status === "complete" ? "Ready" : titleStatus(status))}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
            <div className="space-y-6">
              <div className="no-print">
                <ModeSelector mode={mode} setMode={setMode} />
              </div>

              <div className="no-print space-y-6">
                {mode === "sample" ? (
                  <>
                    <SampleIntake
                      onSelect={updateSelectedCase}
                      sampleCases={sampleCases}
                      selectedCase={selectedCase}
                    />
                    <Section eyebrow="Documents" title="Source documents">
                      <DocumentViewer documents={activeDocuments} />
                    </Section>
                  </>
                ) : (
                  <UploadIntake
                    fileMessage={fileMessage}
                    onFileChange={handleFile}
                    onTextChange={updateUploadText}
                    uploadText={uploadText}
                  />
                )}

                {reviewCase ? (
                  <ReviewForm
                    onParsedChange={setReviewCase}
                    onPreferencesChange={setPreferences}
                    parsedCase={reviewCase}
                    preferences={preferences}
                  />
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
                    <h2 className="text-xl font-semibold text-slate-950">
                      Add Medicare document text to begin
                    </h2>
                    <p className="mx-auto mt-2 max-w-2xl text-slate-600">
                      The review step will appear after sample or uploaded text
                      is available.
                    </p>
                  </div>
                )}
              </div>

              {result ? (
                <>
                  <div className="no-print grid gap-6 xl:grid-cols-2">
                    <Section
                      eyebrow="What we found"
                      title="What we found in your Medicare documents"
                    >
                      <ParsedSummary result={result} />
                    </Section>
                    <Section
                      eyebrow="Medicare signals"
                      title="Possible Medicare issues to review"
                    >
                      <CoveragePanel result={result} />
                    </Section>
                  </div>

                  <div className="no-print grid gap-6 xl:grid-cols-2">
                    <Section
                      eyebrow="Care follow-up"
                      title="What to confirm before your appointment"
                    >
                      <div className="grid gap-4 sm:grid-cols-3">
                        <StatCard
                          helper="From reviewed details"
                          label="Specialty"
                          value={result.referralAssessment.specialtyNeeded}
                        />
                        <StatCard
                          helper="Confirm clinically"
                          label="Urgency"
                          value={result.referralAssessment.urgency}
                        />
                        <StatCard
                          helper="Suggested target"
                          label="Follow-up"
                          value={result.referralAssessment.recommendedFollowUpWindow}
                        />
                      </div>
                    </Section>
                    <Section
                      eyebrow="Verification"
                      title="Questions to ask Medicare or your plan"
                    >
                      <QuestionsPanel result={result} />
                    </Section>
                  </div>

                  <Section
                    className="no-print"
                    eyebrow="Provider search"
                    title="Providers that may fit your coverage"
                  >
                    <ProviderTable providers={result.rankedProviders} />
                  </Section>

                  {/* ── TinyFish Live Provider Discovery ── */}
                  <section
                    className="no-print rounded-lg border border-slate-200 bg-slate-950 p-5 shadow-sm"
                    style={{ color: "#e2e8f0" }}
                  >
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.07em",
                            color: "#63b3ed",
                            marginBottom: "4px",
                          }}
                        >
                          TinyFish Live Web Search
                        </div>
                        <h2
                          style={{
                            fontSize: "20px",
                            fontWeight: 700,
                            color: "#e2e8f0",
                          }}
                        >
                          Live Provider Discovery
                        </h2>
                        <p
                          style={{
                            fontSize: "13px",
                            color: "#718096",
                            marginTop: "4px",
                          }}
                        >
                          TinyFish searches the live web for providers accepting{" "}
                          {reviewCase?.insuranceType ?? "your insurance"} near{" "}
                          {reviewCase?.locationZip ?? "your ZIP code"}.
                        </p>
                      </div>
                      <button
                        disabled={discoveryLoading}
                        onClick={() => void runProviderDiscovery()}
                        style={{
                          background: discoveryLoading
                            ? "#2d3748"
                            : "linear-gradient(135deg, #2b6cb0, #4299e1)",
                          color: "#fff",
                          border: "none",
                          borderRadius: "10px",
                          padding: "10px 20px",
                          fontWeight: 700,
                          fontSize: "14px",
                          cursor: discoveryLoading ? "not-allowed" : "pointer",
                          transition: "all 0.2s ease",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                        type="button"
                      >
                        {discoveryLoading ? "🔍 Searching…" : "🌐 Run Live Discovery"}
                      </button>
                    </div>

                    {/* TinyFish run log for discovery phase */}
                    <TinyFishRunLog
                      events={logPhase === "secure_care" ? agentEvents : []}
                      isStreaming={agentStreaming}
                      log={discoveryResult?.log ?? []}
                      mode={tinyfishRunMode}
                      phase={logPhase}
                    />

                    {/* Live provider cards */}
                    {discoveryResult?.providers && discoveryResult.providers.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "14px",
                          marginTop: logPhase !== "idle" ? "20px" : "0",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "13px",
                            color: "#a0aec0",
                            borderTop: "1px solid rgba(255,255,255,0.08)",
                            paddingTop: "16px",
                          }}
                        >
                          {discoveryResult.providers.length} live provider
                          {discoveryResult.providers.length !== 1 ? "s" : ""} found. Click{" "}
                          <strong style={{ color: "#68d391" }}>Secure Care</strong> to run
                          the TinyFish Agent on the provider&apos;s contact page.
                        </div>
                        {discoveryResult.providers.map((lp, i) => (
                          <LiveProviderCard
                            isSelected={selectedLiveProvider?.source_url === lp.source_url}
                            key={lp.source_url}
                            onSelectSecureCare={(p) => void runSecureCare(p)}
                            provider={lp}
                            rank={i + 1}
                          />
                        ))}
                      </div>
                    )}

                    {/* Secure Care outcome banner */}
                    {secureCareStatus && secureCareStatus !== "in_progress" && (
                      <div
                        style={{
                          marginTop: "20px",
                          padding: "16px",
                          borderRadius: "12px",
                          background:
                            secureCareStatus === "contact_requested"
                              ? "rgba(72, 187, 120, 0.12)"
                              : "rgba(252, 129, 129, 0.1)",
                          border:
                            secureCareStatus === "contact_requested"
                              ? "1px solid rgba(72, 187, 120, 0.4)"
                              : "1px solid rgba(252, 129, 129, 0.4)",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: "16px",
                            color:
                              secureCareStatus === "contact_requested" ? "#68d391" : "#fc8181",
                            marginBottom: "6px",
                          }}
                        >
                          {secureCareStatus === "contact_requested"
                            ? "✅ Contact request prepared"
                            : "⚠️ Escalation needed"}
                        </div>
                        <p style={{ fontSize: "13px", color: "#a0aec0", lineHeight: 1.6 }}>
                          {secureCareStatus === "contact_requested"
                            ? `TinyFish navigated to ${selectedLiveProvider?.provider_name ?? "the provider"}'s contact page, filled the new patient form fields, and stopped before submitting. Review the form, confirm the details, and submit manually when ready.`
                            : "The TinyFish agent encountered an issue. Manual outreach is recommended. Call the provider office directly using the phone number shown above."}
                        </p>
                      </div>
                    )}
                  </section>

                  <div className="no-print">
                    <FinalOutcome result={result} />
                  </div>

                  <PrintableSummary result={result} />
                </>
              ) : (
                <div className="no-print rounded-lg border border-dashed border-slate-300 bg-white/80 p-8 text-center">
                  <h2 className="text-xl font-semibold text-slate-950">
                    Ready for your Medicare review
                  </h2>
                  <p className="mx-auto mt-2 max-w-2xl text-slate-600">
                    Confirm the extracted fields, then run the local workflow to
                    see possible issue flags, provider options, simulated
                    preparation steps, and a printable summary.
                  </p>
                </div>
              )}
            </div>

            <aside className="no-print space-y-6">
              <Section eyebrow="Orchestration" title="Review timeline">
                <WorkflowTimeline
                  activeStep={activeStep}
                  result={result}
                  status={status}
                />
              </Section>

              {result?.renewalChecklist ? (
                <Section eyebrow="Preparation" title="Verification checklist">
                  <div className="mb-3 flex flex-wrap gap-2">
                    <Badge tone={result.renewalChecklist.required ? "warn" : "good"}>
                      {result.renewalChecklist.required
                        ? "Action recommended"
                        : "No urgent item"}
                    </Badge>
                    {result.renewalChecklist.dueDate ? (
                      <Badge tone="blue">Date {result.renewalChecklist.dueDate}</Badge>
                    ) : null}
                  </div>
                  <ul className="space-y-2 text-sm text-slate-700">
                    {result.renewalChecklist.items.map((item) => (
                      <li className="rounded-lg bg-slate-50 p-3" key={item}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </Section>
              ) : null}
            </aside>
          </div>
        </div>
      ) : null}
    </main>
  );
}
