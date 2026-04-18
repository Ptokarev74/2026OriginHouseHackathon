import type { CoverageAssessment, ParsedCase } from "@/lib/types";

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

export function assessCoverage(parsedCase: ParsedCase): CoverageAssessment {
  const insurance = `${parsedCase.insuranceType} ${parsedCase.medicareCoverageType}`.toLowerCase();
  const isMedicare =
    insurance.includes("medicare") || parsedCase.medicareCoverageType !== "Unknown";
  const isDual = parsedCase.medicareCoverageType === "Dual eligible";
  const calculatedDaysUntilDeadline = parsedCase.deadlineDate
    ? daysUntil(parsedCase.deadlineDate)
    : undefined;
  const checklistRequired =
    parsedCase.missingDocuments.length > 0 ||
    parsedCase.premiumPaymentIssue ||
    parsedCase.extractionConfidence === "low";
  const findings: string[] = [];
  const verificationQuestions: string[] = [];

  if (calculatedDaysUntilDeadline === undefined) {
    findings.push("No reliable deadline was found; verify dates directly with Medicare or the plan.");
    verificationQuestions.push("Is there a response, appeal, payment, or plan-change deadline in the original notice?");
  } else if (calculatedDaysUntilDeadline < 0) {
    findings.push(
      `A date in the document appears to have passed ${Math.abs(calculatedDaysUntilDeadline)} days ago; verify whether any options remain.`,
    );
    verificationQuestions.push("Has the plan or Medicare already taken action, and are appeal or reinstatement steps available?");
  } else if (calculatedDaysUntilDeadline <= 14) {
    findings.push(
      `A deadline appears to be in ${calculatedDaysUntilDeadline} days, so this should be verified promptly.`,
    );
    verificationQuestions.push("What must be submitted or paid before the listed date?");
  } else {
    findings.push(
      `A date appears to be ${calculatedDaysUntilDeadline} days away; keep it visible and confirm what it means.`,
    );
  }

  if (checklistRequired) {
    findings.push(
      "One or more paperwork, payment, or manual-review items should be organized before follow-up.",
    );
  }

  if (parsedCase.premiumPaymentIssue) {
    findings.push("Possible premium or payment issue detected; verify plan status before assuming coverage is active or inactive.");
    verificationQuestions.push("Does the plan show any unpaid premium, grace period, reinstatement path, or billing correction?");
  }

  if (parsedCase.possibleStatusIssue) {
    findings.push(parsedCase.possibleStatusIssue);
  }

  if (parsedCase.extractionConfidence === "low") {
    findings.push("Extraction confidence is low; review the fields before relying on this summary.");
  }

  if (isDual) {
    findings.push("Dual-eligible language was detected; confirm both Medicare plan rules and any Medicaid coordination steps.");
    verificationQuestions.push("Which program is responsible for the service, cost sharing, and transportation support?");
  } else if (isMedicare) {
    findings.push("Provider search should prioritize Medicare-compatible options and direct participation verification.");
  } else {
    findings.push("Medicare coverage type was not clearly detected; enter or verify it before acting.");
    verificationQuestions.push("Is this Original Medicare, Medicare Advantage, dual eligible, or another coverage arrangement?");
  }

  verificationQuestions.push(
    "Does the provider still accept this exact Medicare coverage and accept new patients?",
  );

  const manualReviewRequired =
    calculatedDaysUntilDeadline === undefined ||
    parsedCase.extractionConfidence === "low" ||
    parsedCase.medicareCoverageType === "Unknown";
  const possibleDisruption =
    parsedCase.premiumPaymentIssue ||
    parsedCase.issueSignals.length > 0 ||
    (calculatedDaysUntilDeadline !== undefined && calculatedDaysUntilDeadline <= 14);
  const riskLevel = manualReviewRequired
    ? "manual_review"
    : calculatedDaysUntilDeadline !== undefined && calculatedDaysUntilDeadline <= 14
      ? "urgent"
      : checklistRequired
        ? "moderate"
        : "low";

  const riskLabel =
    riskLevel === "urgent"
      ? "Prompt verification recommended"
      : riskLevel === "manual_review"
        ? "Review details before acting"
        : riskLevel === "moderate"
          ? "Possible issue detected"
          : "No urgent signal found";

  return {
    riskLevel,
    riskLabel,
    daysUntilDeadline: calculatedDaysUntilDeadline,
    checklistRequired,
    manualReviewRequired,
    possibleDisruption,
    includeMedicareCompatible: true,
    verificationQuestions,
    findings,
  };
}
