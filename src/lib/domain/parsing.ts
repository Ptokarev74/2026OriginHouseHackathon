import type {
  DocumentSourceKind,
  MedicareCoverageType,
  ParsedCase,
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

function findDate(content: string) {
  const labeledDate = findValue(content, [
    "Deadline",
    "Due date",
    "Payment due date",
    "Respond by",
    "Termination date",
    "Effective date",
    "Coverage end date",
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

function normalizeUrgency(value?: string): UrgencyLevel {
  const normalized = value?.toLowerCase() ?? "";

  if (normalized.includes("urgent") || normalized.includes("stat")) {
    return "urgent";
  }

  if (
    normalized.includes("soon") ||
    normalized.includes("14") ||
    normalized.includes("two week")
  ) {
    return "soon";
  }

  return "routine";
}

function inferUrgency(content: string, labeledUrgency?: string): UrgencyLevel {
  if (labeledUrgency) {
    return normalizeUrgency(labeledUrgency);
  }

  if (/urgent|immediately|termination|discharge|within 7 days|stat/i.test(content)) {
    return "urgent";
  }

  if (/soon|within 14 days|follow.?up|referral|specialist/i.test(content)) {
    return "soon";
  }

  return "routine";
}

function parseMissingDocuments(value?: string) {
  if (!value || /none/i.test(value)) {
    return [];
  }

  return value
    .split(/,|;| and /i)
    .map((item) => item.trim())
    .filter(Boolean);
}

function inferMissingDocuments(content: string) {
  const labeled = parseMissingDocuments(
    findValue(content, [
      "Missing documents",
      "Requested documents",
      "Documents needed",
      "Paperwork needed",
    ]),
  );

  if (labeled.length > 0) {
    return labeled;
  }

  const documents = [
    ["premium payment notice", /premium|payment|past due|non.?payment/i],
    ["plan notice or letter", /notice|letter|coverage change/i],
    ["referral or discharge paperwork", /referral|discharge|hospital/i],
    ["provider network confirmation", /network|accepts|participating provider/i],
  ] as const;

  return documents
    .filter(([, expression]) => expression.test(content))
    .map(([label]) => label);
}

function parseTransportationFlag(content: string, preferenceFlag?: boolean) {
  if (preferenceFlag) {
    return true;
  }

  return /no reliable transportation|transportation needed|needs transportation/i.test(
    content,
  );
}

function inferCoverageType(content: string): MedicareCoverageType {
  if (/dual eligible|dual-eligible|medicare and medicaid|medicaid and medicare/i.test(content)) {
    return "Dual eligible";
  }

  if (/medicare advantage|part c|\bma\b|hmo|ppo/i.test(content)) {
    return "Medicare Advantage";
  }

  if (/original medicare|part a|part b|traditional medicare/i.test(content)) {
    return "Original Medicare";
  }

  if (/medicare/i.test(content)) {
    return "Original Medicare";
  }

  return "Unknown";
}

function inferInsuranceType(content: string, coverageType: MedicareCoverageType) {
  return (
    findValue(content, [
      "Insurance",
      "Coverage",
      "Plan",
      "Medicare coverage",
      "Coverage type",
      "Plan type",
    ]) ?? coverageType
  );
}

function inferIssueSignals(content: string) {
  const signals = [
    [
      "Premium or payment issue mentioned",
      /premium|payment|past due|non.?payment|unpaid|bill/i,
    ],
    [
      "Deadline or response date mentioned",
      /deadline|due date|respond by|termination date|appeal/i,
    ],
    [
      "Plan or network change mentioned",
      /plan change|network|provider directory|no longer participating|out of network/i,
    ],
    [
      "Referral or discharge follow-up mentioned",
      /referral|discharge|hospital|follow.?up|specialist/i,
    ],
    [
      "Transportation concern mentioned",
      /transportation|ride|no reliable transportation|public transit/i,
    ],
    [
      "Language preference mentioned",
      /language preference|interpreter|spanish|polish|mandarin|vietnamese/i,
    ],
  ] as const;

  return signals
    .filter(([, expression]) => expression.test(content))
    .map(([label]) => label);
}

function inferPossibleIssue(content: string) {
  const labeled = findValue(content, [
    "Possible issue",
    "Issue",
    "Status issue",
    "Notice",
    "Reason",
  ]);

  if (labeled) {
    return labeled;
  }

  if (/premium|payment|past due|non.?payment|unpaid/i.test(content)) {
    return "Possible premium or payment issue that should be verified with the plan.";
  }

  if (/termination|coverage end|cancel|lapse/i.test(content)) {
    return "Possible coverage interruption language that should be verified directly.";
  }

  if (/network|no longer participating|out of network|provider directory/i.test(content)) {
    return "Possible provider network or plan participation change.";
  }

  if (/referral|discharge|hospital|follow.?up/i.test(content)) {
    return "Follow-up care paperwork may need confirmation before the next appointment.";
  }

  return "No specific Medicare issue was confidently detected; review the document details manually.";
}

function inferSpecialty(content: string) {
  const labeled = findValue(content, [
    "Recommended specialty",
    "Specialty",
    "Referral specialty",
    "Provider specialty",
  ]);

  if (labeled) {
    return labeled;
  }

  const specialties = [
    "Cardiology",
    "Pulmonology",
    "Orthopedics",
    "Neurology",
    "Behavioral Health",
    "Endocrinology",
    "Gastroenterology",
  ];

  return (
    specialties.find((specialty) =>
      new RegExp(specialty.replace(" ", "\\s+"), "i").test(content),
    ) ?? "Primary Care"
  );
}

function summarizeDocument(content: string, issueSignals: string[]) {
  const firstLine = content
    .split(/\n+/)
    .map((line) => line.trim())
    .find(Boolean);

  if (firstLine && firstLine.length <= 120) {
    return `${firstLine}. ${issueSignals.length} possible signal${issueSignals.length === 1 ? "" : "s"} found for review.`;
  }

  return `Uploaded Medicare-related text reviewed locally. ${issueSignals.length} possible signal${issueSignals.length === 1 ? "" : "s"} found for review.`;
}

function getConfidence(parsedFieldCount: number): ParsedCase["extractionConfidence"] {
  if (parsedFieldCount >= 6) {
    return "high";
  }

  if (parsedFieldCount >= 3) {
    return "medium";
  }

  return "low";
}

export function parseDocuments(
  documents: SourceDocument[],
  fallbackLanguagePreference?: string,
  fallbackTransportationFlag?: boolean,
  sourceKind: DocumentSourceKind = "sample",
): ParsedCase {
  const combined = documents.map((document) => document.content).join("\n");
  const patientName = findValue(combined, ["Patient", "Member"]);
  const medicareCoverageType = inferCoverageType(combined);
  const insuranceType = inferInsuranceType(combined, medicareCoverageType);
  const deadlineDate = findDate(combined);
  const missingDocuments = inferMissingDocuments(combined);
  const specialtyNeeded = inferSpecialty(combined);
  const urgency = inferUrgency(
    combined,
    findValue(combined, ["Urgency", "Priority"]),
  );
  const locationZip =
    findValue(combined, ["ZIP", "Zip code", "Postal code"]) ?? "Unknown";
  const languagePreference =
    findValue(combined, ["Language preference"]) ?? fallbackLanguagePreference;
  const recommendedFollowUpWindow = findValue(combined, [
    "Recommended follow-up window",
    "Follow-up window",
  ]);
  const issueSignals = inferIssueSignals(combined);
  const premiumPaymentIssue = /premium|payment|past due|non.?payment|unpaid|bill/i.test(
    combined,
  );
  const parsedFieldCount = [
    patientName,
    insuranceType !== "Unknown" ? insuranceType : undefined,
    medicareCoverageType !== "Unknown" ? medicareCoverageType : undefined,
    deadlineDate,
    locationZip !== "Unknown" ? locationZip : undefined,
    languagePreference,
    recommendedFollowUpWindow,
    specialtyNeeded !== "Primary Care" ? specialtyNeeded : undefined,
    issueSignals.length > 0 ? issueSignals.join(", ") : undefined,
  ].filter(Boolean).length;

  return {
    patientName,
    insuranceType,
    medicareCoverageType,
    possibleStatusIssue: inferPossibleIssue(combined),
    deadlineDate,
    premiumPaymentIssue,
    issueSignals,
    documentSummary: summarizeDocument(combined, issueSignals),
    extractionConfidence: getConfidence(parsedFieldCount),
    sourceKind,
    missingDocuments,
    specialtyNeeded,
    urgency,
    locationZip,
    transportationFlag: parseTransportationFlag(
      combined,
      fallbackTransportationFlag,
    ),
    languagePreference,
    recommendedFollowUpWindow,
  };
}
