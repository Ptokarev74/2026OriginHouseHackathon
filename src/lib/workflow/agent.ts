import {
  generatePatientInstructions,
  generateRescueArtifacts,
} from "@/lib/domain/actions";
import { parseDocuments } from "@/lib/domain/parsing";
import {
  assessBlocker,
  determineRescuePath,
  verifyReadiness,
} from "@/lib/domain/rescue";
import type { AgentInputCase, AgentRunResult } from "@/lib/types";

export const workflowSteps = [
  {
    id: "read_notice",
    label: "Read notice",
    description: "Extract notice type, deadline, risk language, program context, and urgency.",
  },
  {
    id: "identify_blocker",
    label: "Identify blocker",
    description: "Classify the exact issue putting coverage at risk.",
  },
  {
    id: "determine_path",
    label: "Determine rescue path",
    description: "Choose document rescue, renewal completion, deadline rescue, or escalation.",
  },
  {
    id: "prepare_packet",
    label: "Prepare packet",
    description: "Generate explanation, checklist, submission packet, handoff, and reminders.",
  },
  {
    id: "verify_readiness",
    label: "Verify readiness",
    description: "Check whether required documents are present or escalation is needed.",
  },
  {
    id: "outcome",
    label: "Build final status",
    description: "Return the dashboard status and patient next steps.",
  },
] as const;

export type WorkflowStepId = (typeof workflowSteps)[number]["id"];

export function runNoticeToRescueAgent(inputCase: AgentInputCase): AgentRunResult {
  const parsedNotice =
    inputCase.reviewedNotice ??
    parseDocuments(inputCase.documents, inputCase.preferences);
  const blockerAssessment = assessBlocker(parsedNotice);
  const rescuePath = determineRescuePath(parsedNotice, blockerAssessment);
  const readinessCheck = verifyReadiness(parsedNotice, rescuePath);
  const artifacts = generateRescueArtifacts(
    parsedNotice,
    blockerAssessment,
    rescuePath,
    readinessCheck,
  );
  const patientInstructions = generatePatientInstructions(
    parsedNotice,
    blockerAssessment,
    readinessCheck,
  );
  const finalStatus = readinessCheck.status;
  const outcomeSummary = readinessCheck.shouldEscalate
    ? `Escalation needed. ${blockerAssessment.label} requires human review before the patient relies on a submission path.`
    : readinessCheck.readyToSubmit
      ? `Rescue path identified. ${blockerAssessment.label} is addressed in the demo packet. Status: ready to submit.`
      : `Rescue path identified. Missing item: ${readinessCheck.missingDocuments.join(", ")}. Status: awaiting documents.`;

  return {
    parsedNotice,
    blockerAssessment,
    rescuePath,
    readinessCheck,
    artifacts,
    patientInstructions,
    finalStatus,
    outcomeSummary,
  };
}
