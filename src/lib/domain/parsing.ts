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
import { copyLanguage, type AppLanguage, type CopyLanguage } from "@/lib/i18n/types";

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

function inferRiskLanguage(content: string, language: AppLanguage) {
  const signals = [
    ["closure", /closure|close your case|case will close|benefits will close/i],
    ["termination", /termination|terminate|benefits will end|coverage will end/i],
    ["renewal", /renewal|redetermination|renew your coverage/i],
    ["failure", /failure to respond|did not respond|we have not received/i],
    ["verification", /missing verification|proof required|send proof|provide proof/i],
    ["deadline", /deadline|due date|respond by|submit by|before/i],
    ["conflict", /inconsistent|conflicting|cannot verify|does not match/i],
  ] as const;
  const labels: Record<CopyLanguage, Record<(typeof signals)[number][0], string>> = {
    en: {
      closure: "Closure language found",
      termination: "Termination language found",
      renewal: "Renewal action required",
      failure: "Failure-to-respond language found",
      verification: "Missing verification language found",
      deadline: "Deadline language found",
      conflict: "Eligibility conflict language found",
    },
    es: {
      closure: "Lenguaje de cierre encontrado",
      termination: "Lenguaje de terminacion encontrado",
      renewal: "Renovacion requiere accion",
      failure: "Lenguaje de falta de respuesta encontrado",
      verification: "Lenguaje de verificacion faltante encontrado",
      deadline: "Lenguaje de fecha limite encontrado",
      conflict: "Lenguaje de conflicto de elegibilidad encontrado",
    },
  };

  return signals
    .filter(([, expression]) => expression.test(content))
    .map(([key]) => labels[copyLanguage(language)][key]);
}

function inferMissingRequirements(content: string, language: AppLanguage) {
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
    ["income", /proof of income|income verification|pay stub|wage|earnings/i],
    ["residency", /proof of residency|residency verification|utility bill|lease|address proof/i],
    ["renewal", /incomplete renewal|renewal form|redetermination form|signature missing/i],
    ["identity", /identity|photo id|identification|date of birth/i],
  ] as const;
  const labels: Record<CopyLanguage, Record<(typeof requirements)[number][0], string>> = {
    en: {
      income: "proof of income",
      residency: "proof of residency",
      renewal: "completed renewal form",
      identity: "identity verification",
    },
    es: {
      income: "prueba de ingresos",
      residency: "prueba de residencia",
      renewal: "formulario de renovacion completo",
      identity: "verificacion de identidad",
    },
  };

  return requirements
    .filter(([, expression]) => expression.test(content))
    .map(([key]) => labels[copyLanguage(language)][key]);
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
  if (/income|pay stub|wage|earnings/i.test(text) || missingRequirements.some((item) => /income|pay|ingresos/i.test(item))) {
    return "missing_income_proof";
  }
  if (/residency|address|utility bill|lease/i.test(text) || missingRequirements.some((item) => /residency|address|utility|lease|residencia/i.test(item))) {
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

function blockerLabel(blockerType: BlockerType, language: AppLanguage) {
  const labels: Record<CopyLanguage, Record<BlockerType, string>> = {
    en: {
      missing_income_proof: "Missing proof of income",
      missing_residency_proof: "Missing proof of residency",
      incomplete_renewal: "Incomplete renewal paperwork",
      eligibility_inconsistency: "Eligibility information conflict",
      missed_deadline: "Deadline may have been missed",
      upcoming_deadline: "Upcoming response deadline",
      manual_review: "Unclear issue needing manual review",
    },
    es: {
      missing_income_proof: "Falta prueba de ingresos",
      missing_residency_proof: "Falta prueba de residencia",
      incomplete_renewal: "Papeleo de renovacion incompleto",
      eligibility_inconsistency: "Conflicto de informacion de elegibilidad",
      missed_deadline: "La fecha limite puede haberse vencido",
      upcoming_deadline: "Fecha limite de respuesta proxima",
      manual_review: "Problema poco claro que necesita revision manual",
    },
  };

  return labels[copyLanguage(language)][blockerType];
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

function inferIssueExplanation(
  noticeType: NoticeType,
  blockerType: BlockerType,
  language: AppLanguage,
  deadlineDate?: string,
) {
  const noticeCopy = noticeType.replaceAll("_", " ");
  const dueCopy = deadlineDate
    ? language === "es"
      ? ` antes de ${deadlineDate}`
      : ` by ${deadlineDate}`
    : "";

  if (language === "es") {
    if (blockerType === "missing_income_proof") {
      return `La cobertura esta en riesgo porque este aviso de ${noticeCopy} pide prueba de ingresos${dueCopy}.`;
    }
    if (blockerType === "missing_residency_proof") {
      return `La cobertura esta en riesgo porque este aviso de ${noticeCopy} pide prueba de residencia${dueCopy}.`;
    }
    if (blockerType === "incomplete_renewal") {
      return `La cobertura esta en riesgo porque el papeleo de renovacion parece incompleto${dueCopy}.`;
    }
    if (blockerType === "eligibility_inconsistency") {
      return "El aviso incluye informacion de elegibilidad en conflicto, asi que una persona navegadora debe revisarlo antes del envio.";
    }
    if (blockerType === "missed_deadline") {
      return "El aviso sugiere que una fecha limite ya pudo haber pasado, asi que el caso debe escalarse para revision de apelacion o reinstalacion.";
    }

    return `El aviso incluye una fecha limite de accion${dueCopy}, pero se debe confirmar el requisito exacto.`;
  }

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

function summarizeDocument(
  content: string,
  noticeType: NoticeType,
  riskLanguage: string[],
  language: AppLanguage,
) {
  const firstLine = content
    .split(/\n+/)
    .map((line) => line.trim())
    .find(Boolean);

  if (firstLine && firstLine.length <= 120) {
    return language === "es"
      ? `${firstLine}. ${riskLanguage.length} senal${riskLanguage.length === 1 ? "" : "es"} de riesgo encontrada${riskLanguage.length === 1 ? "" : "s"}.`
      : `${firstLine}. ${riskLanguage.length} risk signal${riskLanguage.length === 1 ? "" : "s"} found.`;
  }

  return language === "es"
    ? `Texto de Medicaid (${noticeType.replaceAll("_", " ")}) revisado localmente. ${riskLanguage.length} senal${riskLanguage.length === 1 ? "" : "es"} de riesgo encontrada${riskLanguage.length === 1 ? "" : "s"}.`
    : `Medicaid ${noticeType.replaceAll("_", " ")} text reviewed locally. ${riskLanguage.length} risk signal${riskLanguage.length === 1 ? "" : "s"} found.`;
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
  language: AppLanguage = "en",
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
  const riskLanguage = inferRiskLanguage(combined, language);
  const missingRequirements = inferMissingRequirements(combined, language);
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
    blockerLabel: blockerLabel(blockerType, language),
    missingRequirements,
    providedDocuments,
    documentSummary: summarizeDocument(combined, noticeType, riskLanguage, language),
    issueExplanation: inferIssueExplanation(
      noticeType,
      blockerType,
      language,
      deadlineDate,
    ),
    extractionConfidence: getConfidence(parsedFieldCount),
    sourceKind,
    urgency,
    caseStatus,
    languagePreference,
    contactMethod,
  };
}
