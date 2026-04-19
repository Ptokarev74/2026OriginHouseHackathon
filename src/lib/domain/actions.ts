import type {
  BlockerAssessment,
  ParsedNotice,
  ReadinessCheck,
  RescueArtifact,
  RescuePath,
} from "@/lib/types";

function now() {
  return new Date().toISOString();
}

function formatList(items: string[]) {
  return items.length > 0 ? items.join(", ") : "None identified";
}

export function generateRescueArtifacts(
  parsedNotice: ParsedNotice,
  assessment: BlockerAssessment,
  rescuePath: RescuePath,
  readiness: ReadinessCheck,
): RescueArtifact[] {
  const deadlineCopy = parsedNotice.deadlineDate ?? "the deadline shown on the original notice";
  const missingCopy = formatList(readiness.missingDocuments);
  const escalationCopy = rescuePath.escalationTriggers.length > 0
    ? rescuePath.escalationTriggers.join(" ")
    : "No escalation trigger was detected in the local demo rules.";

  return [
    {
      id: "plain-language-explanation",
      label: "Plain-English notice explanation",
      kind: "plain_language_explanation",
      status: "generated",
      timestamp: now(),
      summary: "Explained the notice in patient-facing language.",
      content: parsedNotice.issueExplanation,
      details: [
        `Notice type: ${parsedNotice.noticeType.replaceAll("_", " ")}`,
        `Deadline: ${deadlineCopy}`,
        `Blocker: ${assessment.label}`,
      ],
    },
    {
      id: "missing-requirements",
      label: "Missing requirements checklist",
      kind: "missing_requirements",
      status: readiness.readyToSubmit ? "generated" : "simulated",
      timestamp: now(),
      summary: readiness.readyToSubmit
        ? "No missing document remains in the demo packet."
        : `Missing item still needed: ${missingCopy}.`,
      content: readiness.readyToSubmit
        ? "The packet appears ready for simulated submission review."
        : `Gather or upload: ${missingCopy}. Match the document to the patient name or case number before submission.`,
      details: readiness.missingDocuments.length > 0
        ? readiness.missingDocuments
        : ["All targeted requirements appear present."],
    },
    {
      id: "submission-packet",
      label: "Simulated submission packet",
      kind: "submission_packet",
      status: readiness.shouldEscalate ? "blocked" : "simulated",
      timestamp: now(),
      summary: readiness.shouldEscalate
        ? "Submission packet paused because escalation is recommended."
        : "Prepared a simulated packet checklist for the Medicaid response.",
      content: [
        `Patient: ${parsedNotice.patientName ?? "Unknown"}`,
        `Program: ${parsedNotice.medicaidProgram ?? "Medicaid program not specified"}`,
        `Response deadline: ${deadlineCopy}`,
        `Included documents: ${formatList(readiness.presentDocuments)}`,
        `Still missing: ${missingCopy}`,
      ].join("\n"),
      details: rescuePath.steps,
    },
    {
      id: "escalation-packet",
      label: "Navigator escalation packet",
      kind: "escalation_packet",
      status: readiness.shouldEscalate ? "simulated" : "generated",
      timestamp: now(),
      summary: readiness.shouldEscalate
        ? "Prepared a structured handoff for human review."
        : "Prepared an escalation fallback if the packet is not submitted in time.",
      content: [
        `Escalation reason: ${escalationCopy}`,
        `Exact blocker: ${assessment.label}`,
        `Recommended next action: ${assessment.nextAction}`,
      ].join("\n"),
      details: [
        "Include the original notice.",
        "Include any documents already gathered.",
        "Ask the reviewer to confirm whether submission, appeal, reinstatement, or manual correction applies.",
      ],
    },
    {
      id: "outreach-message",
      label: "Reminder and outreach messages",
      kind: "outreach_message",
      status: "generated",
      timestamp: now(),
      summary: "Drafted patient reminder language for the selected communication preference.",
      content: `Reminder: Your Medicaid notice needs action by ${deadlineCopy}. The blocker is ${assessment.label.toLowerCase()}. Next step: ${assessment.nextAction}`,
      details: [
        `Preferred language: ${parsedNotice.languagePreference ?? "English"}`,
        `Preferred contact: ${parsedNotice.contactMethod ?? "SMS"}`,
      ],
    },
  ];
}

export function generatePatientInstructions(
  parsedNotice: ParsedNotice,
  assessment: BlockerAssessment,
  readiness: ReadinessCheck,
) {
  const instructions = [
    assessment.nextAction,
    parsedNotice.deadlineDate
      ? `Work before ${parsedNotice.deadlineDate}; keep the notice and any confirmation number.`
      : "Confirm the response deadline before relying on this rescue plan.",
  ];

  if (readiness.missingDocuments.length > 0) {
    instructions.push(`Gather: ${readiness.missingDocuments.join(", ")}.`);
  }

  if (readiness.shouldEscalate) {
    instructions.push("Ask a navigator, advocate, or case worker to review the notice before submission.");
  }

  instructions.push(
    "This prototype explains and prepares a notice response; it does not determine Medicaid eligibility or submit paperwork.",
  );

  return instructions;
}
