import type {
  BlockerType,
  CaseStatus,
  CommunicationPreferences,
  DocumentSourceKind,
  NoticeType,
  ParsedNotice,
  SourceDocument,
  UrgencyLevel,
} from "@/lib/types";

function findValue(content: string, labels: string[]) {
  for (const label of labels) {
    const expression = new RegExp(`${label}\\s*:\\s*([^\\n]+)`, "i");
    const match = content.match(expression);

    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return undefined;
}

function splitList(value?: string) {
  if (!value || /none|not listed|n\/a/i.test(value)) {
    return [];
  }

  return value
    .split(/,|;| and |\n-/i)
    .map((item) => item.trim().replace(/^-\s*/, ""))
    .filter(Boolean);
}

function findDate(content: string) {
  const labeledDate = findValue(content, [
    "Deadline",
    "Due date",
    "Respond by",
    "Submit by",
    "Closure date",
    "Termination date",
    "Coverage end date",
    "Renewal due",
    "Appeal deadline",
  ]);

  if (labeledDate) {
    return labeledDate;
  }

  return (
    content.match(/\b\d{4}-\d{2}-\d{2}\b/)?.[0] ??
    content.match(/\b\d{1,2}\/\d{1,2}\/\d{4}\b/)?.[0]
  );
}

function inferNoticeType(content: string): NoticeType {
  const labeled = findValue(content, ["Notice type", "Type"]);

  if (/closure/i.test(labeled ?? content)) return "closure";
  if (/termination|terminate|ending/i.test(labeled ?? content)) return "termination";
  if (/renewal|redetermination/i.test(labeled ?? content)) return "renewal";
  if (/action required|failure to respond|must respond|requested information/i.test(labeled ?? content)) {
    return "action_required";
  }
  if (/case status|pending|case letter/i.test(labeled ?? content)) return "case_status";

  return "uploaded_text";
}

function inferRiskLanguage(content: string) {
  const signals = [
    ["Closure language found", /closure|close your case|case will close|benefits will close/i],
    ["Termination language found", /termination|terminate|benefits will end|coverage will end/i],
    ["Renewal action required", /renewal|redetermination|renew your coverage/i],
    ["Failure-to-respond language found", /failure to respond|did not respond|we have not received/i],
    ["Missing verification language found", /missing verification|proof required|send proof|provide proof/i],
    ["Deadline language found", /deadline|due date|respond by|submit by|before/i],
    ["Eligibility conflict language found", /inconsistent|conflicting|cannot verify|does not match/i],
  ] as const;

  return signals
    .filter(([, expression]) => expression.test(content))
    .map(([label]) => label);
}

function inferMissingRequirements(content: string) {
  const labeled = splitList(
    findValue(content, [
      "Missing requirements",
      "Missing documents",
      "Requested documents",
      "Documents needed",
      "Verification needed",
      "Required proof",
    ]),
  );

  if (labeled.length > 0) {
    return labeled;
  }

  const requirements = [
    ["proof of income", /proof of income|income verification|pay stub|wage|earnings/i],
    ["proof of residency", /proof of residency|residency verification|utility bill|lease|address proof/i],
    ["completed renewal form", /incomplete renewal|renewal form|redetermination form|signature missing/i],
    ["identity verification", /identity|photo id|identification|date of birth/i],
  ] as const;

  return requirements
    .filter(([, expression]) => expression.test(content))
    .map(([label]) => label);
}

function inferProvidedDocuments(documents: SourceDocument[], combined: string) {
  const labeled = splitList(
    findValue(combined, [
      "Uploaded documents",
      "Provided documents",
      "Documents attached",
      "Documents on file",
    ]),
  );

  const inferred = documents
    .filter((document) => document.documentType === "verification_document")
    .map((document) => document.title);

  return Array.from(new Set([...labeled, ...inferred]));
}

function inferBlockerType(content: string, missingRequirements: string[], deadlineDate?: string): BlockerType {
  const explicit = findValue(content, ["Blocker", "Issue", "Reason"]) ?? "";
  const text = `${explicit} ${content}`;

  if (/missed deadline|deadline passed|past the deadline|already closed/i.test(text)) {
    return "missed_deadline";
  }
  if (/conflicting|inconsistent|cannot verify|does not match|manual review/i.test(text)) {
    return "eligibility_inconsistency";
  }
  if (/income|pay stub|wage|earnings/i.test(text) || missingRequirements.some((item) => /income|pay/i.test(item))) {
    return "missing_income_proof";
  }
  if (/residency|address|utility bill|lease/i.test(text) || missingRequirements.some((item) => /residency|address|utility|lease/i.test(item))) {
    return "missing_residency_proof";
  }
  if (/incomplete renewal|renewal form|redetermination form|signature/i.test(text)) {
    return "incomplete_renewal";
  }
  if (deadlineDate) {
    return "upcoming_deadline";
  }

  return "manual_review";
}

function blockerLabel(blockerType: BlockerType) {
  const labels: Record<BlockerType, string> = {
    missing_income_proof: "Missing proof of income",
    missing_residency_proof: "Missing proof of residency",
    incomplete_renewal: "Incomplete renewal paperwork",
    eligibility_inconsistency: "Eligibility information conflict",
    missed_deadline: "Deadline may have been missed",
    upcoming_deadline: "Upcoming response deadline",
    manual_review: "Unclear issue needing manual review",
  };

  return labels[blockerType];
}

function inferUrgency(content: string, blockerType: BlockerType): UrgencyLevel {
  if (blockerType === "missed_deadline") return "overdue";
  if (/urgent|immediately|termination|closure|coverage will end|before benefits close/i.test(content)) {
    return "urgent";
  }
  if (/soon|respond by|submit by|renewal due|action required/i.test(content)) {
    return "soon";
  }

  return "routine";
}

function inferCaseStatus(blockerType: BlockerType, missingRequirements: string[]): CaseStatus {
  if (
    blockerType === "missed_deadline" ||
    blockerType === "eligibility_inconsistency" ||
    blockerType === "manual_review"
  ) {
    return "escalation_needed";
  }
  if (missingRequirements.length > 0) {
    return "awaiting_documents";
  }

  return "blocker_identified";
}

function inferIssueExplanation(noticeType: NoticeType, blockerType: BlockerType, deadlineDate?: string) {
  const noticeCopy = noticeType.replaceAll("_", " ");
  const dueCopy = deadlineDate ? ` by ${deadlineDate}` : "";

  if (blockerType === "missing_income_proof") {
    return `Coverage is at risk because this ${noticeCopy} asks for proof of income${dueCopy}.`;
  }
  if (blockerType === "missing_residency_proof") {
    return `Coverage is at risk because this ${noticeCopy} asks for proof of residency${dueCopy}.`;
  }
  if (blockerType === "incomplete_renewal") {
    return `Coverage is at risk because the renewal paperwork appears incomplete${dueCopy}.`;
  }
  if (blockerType === "eligibility_inconsistency") {
    return "The notice includes conflicting eligibility information, so a navigator should review it before submission.";
  }
  if (blockerType === "missed_deadline") {
    return "The notice suggests a deadline may have already passed, so the case should be escalated for appeal or reinstatement review.";
  }

  return `The notice includes an action deadline${dueCopy}, but the exact requirement should be confirmed.`;
}

function summarizeDocument(content: string, noticeType: NoticeType, riskLanguage: string[]) {
  const firstLine = content
    .split(/\n+/)
    .map((line) => line.trim())
    .find(Boolean);

  if (firstLine && firstLine.length <= 120) {
    return `${firstLine}. ${riskLanguage.length} risk signal${riskLanguage.length === 1 ? "" : "s"} found.`;
  }

  return `Medicaid ${noticeType.replaceAll("_", " ")} text reviewed locally. ${riskLanguage.length} risk signal${riskLanguage.length === 1 ? "" : "s"} found.`;
}

function getConfidence(parsedFieldCount: number): ParsedNotice["extractionConfidence"] {
  if (parsedFieldCount >= 6) return "high";
  if (parsedFieldCount >= 3) return "medium";
  return "low";
}

export function parseDocuments(
  documents: SourceDocument[],
  preferences: CommunicationPreferences = {},
  sourceKind: DocumentSourceKind = "sample",
): ParsedNotice {
  const combined = documents.map((document) => document.content).join("\n");
  const patientName = findValue(combined, ["Patient", "Member", "Client"]);
  const medicaidProgram = findValue(combined, [
    "Medicaid program",
    "Program",
    "Coverage",
    "Plan",
  ]);
  const noticeType = inferNoticeType(combined);
  const deadlineDate = findDate(combined);
  const riskLanguage = inferRiskLanguage(combined);
  const missingRequirements = inferMissingRequirements(combined);
  const providedDocuments = inferProvidedDocuments(documents, combined);
  const blockerType = inferBlockerType(combined, missingRequirements, deadlineDate);
  const urgency = inferUrgency(combined, blockerType);
  const languagePreference =
    findValue(combined, ["Language preference", "Preferred language"]) ??
    preferences.languagePreference;
  const contactMethod =
    (findValue(combined, ["Contact method", "Communication preference"]) as
      | CommunicationPreferences["contactMethod"]
      | undefined) ?? preferences.contactMethod;
  const caseStatus = inferCaseStatus(blockerType, missingRequirements);
  const parsedFieldCount = [
    patientName,
    medicaidProgram,
    noticeType !== "uploaded_text" ? noticeType : undefined,
    deadlineDate,
    riskLanguage.length > 0 ? riskLanguage.join(", ") : undefined,
    missingRequirements.length > 0 ? missingRequirements.join(", ") : undefined,
    providedDocuments.length > 0 ? providedDocuments.join(", ") : undefined,
    languagePreference,
    contactMethod,
  ].filter(Boolean).length;

  return {
    patientName,
    medicaidProgram,
    noticeType,
    deadlineDate,
    riskLanguage,
    blockerType,
    blockerLabel: blockerLabel(blockerType),
    missingRequirements,
    providedDocuments,
    documentSummary: summarizeDocument(combined, noticeType, riskLanguage),
    issueExplanation: inferIssueExplanation(noticeType, blockerType, deadlineDate),
    extractionConfidence: getConfidence(parsedFieldCount),
    sourceKind,
    urgency,
    caseStatus,
    languagePreference,
    contactMethod,
  };
}
