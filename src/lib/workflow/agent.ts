import {
  generatePatientInstructions,
  generateRenewalChecklist,
  simulateBookAppointment,
  simulateSendRecords,
} from "@/lib/domain/actions";
import { assessCoverage } from "@/lib/domain/coverage";
import { parseDocuments } from "@/lib/domain/parsing";
import {
  filterProviders,
  rankProviders,
  selectBestProvider,
} from "@/lib/domain/providers";
import { assessReferral } from "@/lib/domain/referral";
import type { AgentInputCase, AgentRunResult } from "@/lib/types";

export const workflowSteps = [
  {
    id: "parse",
    label: "Read documents",
    description: "Extract Medicare coverage, date, referral, urgency, and preference signals.",
  },
  {
    id: "coverage",
    label: "Review Medicare signals",
    description: "Flag possible access issues, deadline signals, and questions to verify.",
  },
  {
    id: "referral",
    label: "Review care needs",
    description: "Normalize specialty, urgency, and follow-up timing from local text.",
  },
  {
    id: "providers",
    label: "Rank provider options",
    description: "Score local provider options by Medicare fit, specialty, distance, and access.",
  },
  {
    id: "actions",
    label: "Prepare next steps",
    description: "Generate verification questions, paperwork checklist, and provider call prep.",
  },
  {
    id: "outcome",
    label: "Build summary",
    description: "Return an informational patient handoff summary.",
  },
] as const;

export type WorkflowStepId = (typeof workflowSteps)[number]["id"];

export function runCoverageToCareAgent(inputCase: AgentInputCase): AgentRunResult {
  const parsedCase =
    inputCase.reviewedCase ??
    parseDocuments(
      inputCase.documents,
      inputCase.preferences.languagePreference,
      inputCase.preferences.transportationNeeded,
    );
  const coverageAssessment = assessCoverage(parsedCase);
  const referralAssessment = assessReferral(parsedCase);
  const eligibleProviders = filterProviders(
    inputCase.providers,
    parsedCase,
    coverageAssessment,
    inputCase.preferences,
  );
  const rankedProviders = rankProviders(
    eligibleProviders,
    parsedCase,
    coverageAssessment,
    inputCase.preferences,
  );
  const selectedProvider = selectBestProvider(rankedProviders);
  const renewalChecklist = generateRenewalChecklist(parsedCase);
  const bookingResult = simulateBookAppointment(parsedCase, selectedProvider);
  const recordsResult = simulateSendRecords(selectedProvider);
  const patientInstructions = generatePatientInstructions(
    parsedCase,
    renewalChecklist,
    selectedProvider,
  );
  const finalStatus = selectedProvider
    ? "next_steps_ready"
    : coverageAssessment.manualReviewRequired
      ? "manual_review_needed"
      : "no_provider_match";
  const outcomeSummary = selectedProvider
    ? `${selectedProvider.name} is the strongest local provider option in this prototype with a ${selectedProvider.score}/100 access score. Verify plan participation before scheduling.`
    : "No provider option matched the filters. Continue manual provider review and verify coverage details directly.";

  return {
    parsedCase,
    coverageAssessment,
    referralAssessment,
    rankedProviders,
    selectedProvider,
    renewalChecklist,
    actions: [
      {
        id: "checklist",
        label: "Verification checklist",
        status: renewalChecklist.required ? "simulated" : "completed",
        timestamp: new Date().toISOString(),
        summary: renewalChecklist.required
          ? "Generated a Medicare verification checklist from possible issue signals."
          : "No urgent checklist item was detected in the parsed text.",
        details: renewalChecklist.items,
      },
      bookingResult,
      recordsResult,
      {
        id: "instructions",
        label: "Suggested next steps",
        status: "simulated",
        timestamp: new Date().toISOString(),
        summary: "Generated patient-facing next steps for direct verification.",
        details: patientInstructions,
      },
    ],
    patientInstructions,
    finalStatus,
    outcomeSummary,
  };
}
