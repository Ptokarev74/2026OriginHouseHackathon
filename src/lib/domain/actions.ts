import type {
  ActionResult,
  ParsedCase,
  RankedProvider,
  RenewalChecklist,
} from "@/lib/types";

function now() {
  return new Date().toISOString();
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function generateRenewalChecklist(parsedCase: ParsedCase): RenewalChecklist {
  const documentItems = parsedCase.missingDocuments.map((document) =>
    `Gather or confirm ${document}`,
  );
  const required =
    parsedCase.missingDocuments.length > 0 ||
    parsedCase.premiumPaymentIssue ||
    parsedCase.extractionConfidence === "low";

  return {
    required,
    dueDate: parsedCase.deadlineDate,
    items: required
      ? [
          ...documentItems,
          parsedCase.premiumPaymentIssue
            ? "Ask the plan whether a premium balance, grace period, or billing correction exists"
            : "Confirm whether the notice requires any payment or paperwork",
          "Call Medicare, the plan, or the listed sender to confirm what the notice means",
          "Keep a copy of the notice and any confirmation number from calls",
        ]
      : ["No urgent paperwork item was detected, but plan details should still be verified."],
    submissionPlan: required
      ? [
          "Prioritize verification before the listed deadline or appointment.",
          parsedCase.transportationFlag
            ? "Plan transportation before any in-person office visit or document pickup."
            : "Prepare call notes and questions before contacting the plan or provider.",
        ]
      : ["Keep the document with appointment paperwork and confirm provider participation before the visit."],
  };
}

export function simulateBookAppointment(
  parsedCase: ParsedCase,
  provider?: RankedProvider,
): ActionResult {
  if (!provider) {
    return {
      id: "booking",
      label: "Provider confirmation prep",
      status: "blocked",
      timestamp: now(),
      summary: "No local provider option matched the current filters.",
      details: ["Manual provider search is recommended before calling for an appointment."],
    };
  }

  return {
    id: "booking",
    label: "Provider confirmation prep",
    status: "simulated",
    timestamp: now(),
    summary: `Prepared questions for a possible ${parsedCase.specialtyNeeded} visit with ${provider.name}.`,
    details: [
      `Ask whether the earliest real appointment is around ${provider.availabilityDays} days out.`,
      `Confirm the provider accepts the exact coverage: ${parsedCase.insuranceType}.`,
      provider.telehealth
        ? "Ask whether telehealth is available and appropriate for the visit."
        : "This appears to be in-person; transportation planning may be needed.",
    ],
  };
}

export function simulateSendRecords(provider?: RankedProvider): ActionResult {
  if (!provider) {
    return {
      id: "records",
      label: "Paperwork packet",
      status: "blocked",
      timestamp: now(),
      summary: "Paperwork packet paused because no provider option was selected.",
      details: ["Prepare documents once provider participation is verified."],
    };
  }

  return {
    id: "records",
    label: "Paperwork packet",
    status: "simulated",
    timestamp: now(),
    summary: `Prepared a local checklist for documents to bring or send to ${provider.name}.`,
    details: [
      "Include Medicare notice, plan card, referral or discharge notes, medication list, and questions for the office.",
      "No real records were sent; this prototype only organizes local browser information.",
    ],
  };
}

export function generatePatientInstructions(
  parsedCase: ParsedCase,
  checklist: RenewalChecklist,
  provider?: RankedProvider,
) {
  const instructions = [
    provider
      ? `Call ${provider.name} to verify they accept your exact Medicare coverage and ask about appointment availability.`
      : "Use the findings to continue a manual provider search before assuming a provider fit.",
  ];

  if (checklist.required) {
    instructions.push(
      `Work through the verification checklist before ${parsedCase.deadlineDate ?? "any listed deadline"}.`,
    );
  }

  if (parsedCase.languagePreference) {
    instructions.push(
      `${titleCase(parsedCase.languagePreference)} language support is flagged for outreach.`,
    );
  }

  if (parsedCase.transportationFlag) {
    instructions.push("Arrange transportation support before the appointment day.");
  }

  instructions.push(
    "This prototype does not determine Medicare status, submit paperwork, book appointments, or send records.",
  );

  return instructions;
}
