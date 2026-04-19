import type {
  BlockerAssessment,
  CaseStatus,
  ParsedNotice,
  ReadinessCheck,
  RescuePath,
  UrgencyLevel,
} from "@/lib/types";

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

export function daysUntil(dateValue: string, now = new Date()) {
  const dueDate = new Date(`${dateValue}T12:00:00`);

  if (Number.isNaN(dueDate.getTime())) {
    return undefined;
  }

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const due = new Date(
    dueDate.getFullYear(),
    dueDate.getMonth(),
    dueDate.getDate(),
  );

  return Math.ceil((due.getTime() - today.getTime()) / MILLISECONDS_PER_DAY);
}

function statusFor(parsedNotice: ParsedNotice, days?: number): CaseStatus {
  if (
    parsedNotice.blockerType === "missed_deadline" ||
    parsedNotice.blockerType === "eligibility_inconsistency" ||
    parsedNotice.blockerType === "manual_review" ||
    (days !== undefined && days < 0)
  ) {
    return "escalation_needed";
  }

  if (parsedNotice.missingRequirements.length > 0) {
    return "awaiting_documents";
  }

  return "ready_to_submit";
}

function urgencyFor(parsedNotice: ParsedNotice, days?: number): UrgencyLevel {
  if (days !== undefined && days < 0) return "overdue";
  if (days !== undefined && days <= 7) return "urgent";
  if (days !== undefined && days <= 21) return "soon";
  return parsedNotice.urgency;
}

export function assessBlocker(parsedNotice: ParsedNotice): BlockerAssessment {
  const calculatedDays = parsedNotice.deadlineDate
    ? daysUntil(parsedNotice.deadlineDate)
    : undefined;
  const urgency = urgencyFor(parsedNotice, calculatedDays);
  const caseStatus = statusFor(parsedNotice, calculatedDays);
  const escalationRecommended = caseStatus === "escalation_needed";
  const canSelfResolve =
    !escalationRecommended &&
    (parsedNotice.blockerType === "missing_income_proof" ||
      parsedNotice.blockerType === "missing_residency_proof" ||
      parsedNotice.blockerType === "incomplete_renewal");
  const findings: string[] = [];

  if (calculatedDays === undefined) {
    findings.push("No reliable deadline was found; confirm the date on the original notice.");
  } else if (calculatedDays < 0) {
    findings.push(
      `The listed deadline appears to have passed ${Math.abs(calculatedDays)} day${Math.abs(calculatedDays) === 1 ? "" : "s"} ago.`,
    );
  } else if (calculatedDays <= 7) {
    findings.push(`The listed deadline is in ${calculatedDays} day${calculatedDays === 1 ? "" : "s"}.`);
  } else {
    findings.push(`The listed deadline is in ${calculatedDays} day${calculatedDays === 1 ? "" : "s"}.`);
  }

  if (parsedNotice.missingRequirements.length > 0) {
    findings.push(
      `Missing requirement identified: ${parsedNotice.missingRequirements.join(", ")}.`,
    );
  }

  if (parsedNotice.riskLanguage.length > 0) {
    findings.push(`Risk language detected: ${parsedNotice.riskLanguage.join(", ")}.`);
  }

  if (parsedNotice.extractionConfidence === "low") {
    findings.push("Extraction confidence is low; a human should verify the notice before acting.");
  }

  const nextAction = escalationRecommended
    ? "Prepare the escalation packet for a navigator, advocate, or case worker."
    : parsedNotice.missingRequirements.length > 0
      ? `Gather ${parsedNotice.missingRequirements[0]} and attach it to the renewal response.`
      : "Review the packet and prepare it for submission.";

  return {
    blockerType: parsedNotice.blockerType,
    label: parsedNotice.blockerLabel,
    urgency,
    daysUntilDeadline: calculatedDays,
    caseStatus,
    canSelfResolve,
    escalationRecommended,
    findings,
    nextAction,
  };
}

export function determineRescuePath(
  parsedNotice: ParsedNotice,
  assessment: BlockerAssessment,
): RescuePath {
  const escalationTriggers: string[] = [];

  if (assessment.escalationRecommended) {
    escalationTriggers.push("Issue is conflicting, unclear, or past deadline.");
  }
  if (parsedNotice.extractionConfidence === "low") {
    escalationTriggers.push("Important notice fields could not be extracted with confidence.");
  }
  if (assessment.urgency === "urgent" || assessment.urgency === "overdue") {
    escalationTriggers.push("Deadline is urgent or may have passed.");
  }

  if (assessment.escalationRecommended) {
    return {
      pathType: "escalation",
      status: "escalation_needed",
      summary: "This case should be routed to a navigator, advocate, or case worker before the patient relies on self-service steps.",
      steps: [
        "Prepare a short issue summary with the notice type, deadline, and conflicting or overdue details.",
        "Attach the notice and any verification already available.",
        "Ask the human reviewer whether appeal, reinstatement, or manual correction is the right path.",
      ],
      missingItems: parsedNotice.missingRequirements,
      escalationTriggers,
    };
  }

  if (parsedNotice.blockerType === "incomplete_renewal") {
    return {
      pathType: "renewal_completion",
      status: "awaiting_documents",
      summary: "The rescue path is to complete the renewal packet and submit the missing sections before the deadline.",
      steps: [
        "Complete every blank renewal form section.",
        "Attach the requested verification documents.",
        "Keep a copy of the packet and submission confirmation.",
      ],
      missingItems: parsedNotice.missingRequirements,
      escalationTriggers,
    };
  }

  return {
    pathType: assessment.urgency === "urgent" ? "deadline_rescue" : "document_rescue",
    status: parsedNotice.missingRequirements.length > 0 ? "awaiting_documents" : "ready_to_submit",
    summary: "The rescue path is to gather the targeted missing item and prepare the response packet.",
    steps: [
      "Gather the exact missing verification listed in the notice.",
      "Match the document to the Medicaid case number or patient name.",
      "Submit through the appropriate channel shown on the notice and save confirmation.",
    ],
    missingItems: parsedNotice.missingRequirements,
    escalationTriggers,
  };
}

export function verifyReadiness(
  parsedNotice: ParsedNotice,
  rescuePath: RescuePath,
): ReadinessCheck {
  const normalizedProvided = parsedNotice.providedDocuments.join(" ").toLowerCase();
  const missingDocuments = rescuePath.missingItems.filter((item) => {
    const normalizedItem = item.toLowerCase();
    return !normalizedProvided.includes(normalizedItem) &&
      !(normalizedItem.includes("income") && /income|pay stub|wage|earnings/.test(normalizedProvided)) &&
      !(normalizedItem.includes("residency") && /residency|utility|lease|address/.test(normalizedProvided));
  });
  const shouldEscalate = rescuePath.status === "escalation_needed";
  const readyToSubmit = !shouldEscalate && missingDocuments.length === 0;
  const status: CaseStatus = shouldEscalate
    ? "escalation_needed"
    : readyToSubmit
      ? "ready_to_submit"
      : "awaiting_documents";

  return {
    readyToSubmit,
    shouldEscalate,
    presentDocuments: parsedNotice.providedDocuments,
    missingDocuments,
    status,
    checks: [
      parsedNotice.deadlineDate
        ? `Deadline captured: ${parsedNotice.deadlineDate}.`
        : "Deadline needs human confirmation.",
      parsedNotice.blockerLabel
        ? `Blocker captured: ${parsedNotice.blockerLabel}.`
        : "Blocker needs human confirmation.",
      readyToSubmit
        ? "All required documents appear present in the demo packet."
        : shouldEscalate
          ? "Case should be escalated before submission."
          : "At least one required document is still missing.",
    ],
  };
}
