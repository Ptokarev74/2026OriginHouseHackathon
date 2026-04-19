import type { AppLanguage } from "@/lib/i18n/types";

export type UrgencyLevel = "routine" | "soon" | "urgent" | "overdue";
export type ExtractionConfidence = "low" | "medium" | "high";
export type DocumentSourceKind =
  | "sample"
  | "pasted"
  | "txt_upload"
  | "pdf_ocr"
  | "image_ocr";

export type NoticeType =
  | "closure"
  | "renewal"
  | "termination"
  | "action_required"
  | "case_status"
  | "uploaded_text";

export type DocumentType =
  | "medicaid_notice"
  | "renewal_notice"
  | "closure_notice"
  | "case_status_letter"
  | "verification_document"
  | "uploaded_text";

export type BlockerType =
  | "missing_income_proof"
  | "missing_residency_proof"
  | "incomplete_renewal"
  | "eligibility_inconsistency"
  | "missed_deadline"
  | "upcoming_deadline"
  | "manual_review";

export type CaseStatus =
  | "notice_received"
  | "blocker_identified"
  | "awaiting_documents"
  | "ready_to_submit"
  | "escalation_needed"
  | "rescue_in_progress"
  | "resolved";

export type ActionStatus = "generated" | "simulated" | "blocked";
export type ArtifactKind =
  | "plain_language_explanation"
  | "missing_requirements"
  | "submission_packet"
  | "escalation_packet"
  | "outreach_message";

export type CommunicationPreferences = {
  languagePreference?: string;
  contactMethod?: "SMS" | "Email" | "Phone";
};

export type SourceDocument = {
  id: string;
  title: string;
  documentType: DocumentType;
  content: string;
};

export type ParsedNotice = {
  patientName?: string;
  medicaidProgram?: string;
  noticeType: NoticeType;
  deadlineDate?: string;
  riskLanguage: string[];
  blockerType: BlockerType;
  blockerLabel: string;
  missingRequirements: string[];
  providedDocuments: string[];
  documentSummary: string;
  issueExplanation: string;
  extractionConfidence: ExtractionConfidence;
  sourceKind: DocumentSourceKind;
  urgency: UrgencyLevel;
  caseStatus: CaseStatus;
  languagePreference?: string;
  contactMethod?: CommunicationPreferences["contactMethod"];
};

export type BlockerAssessment = {
  blockerType: BlockerType;
  label: string;
  urgency: UrgencyLevel;
  daysUntilDeadline?: number;
  caseStatus: CaseStatus;
  canSelfResolve: boolean;
  escalationRecommended: boolean;
  findings: string[];
  nextAction: string;
};

export type RescuePath = {
  pathType: "document_rescue" | "renewal_completion" | "deadline_rescue" | "escalation";
  status: CaseStatus;
  summary: string;
  steps: string[];
  missingItems: string[];
  escalationTriggers: string[];
};

export type ReadinessCheck = {
  readyToSubmit: boolean;
  shouldEscalate: boolean;
  presentDocuments: string[];
  missingDocuments: string[];
  status: CaseStatus;
  checks: string[];
};

export type RescueArtifact = {
  id: string;
  label: string;
  kind: ArtifactKind;
  status: ActionStatus;
  timestamp: string;
  summary: string;
  content: string;
  details: string[];
};

export type AgentRunResult = {
  parsedNotice: ParsedNotice;
  blockerAssessment: BlockerAssessment;
  rescuePath: RescuePath;
  readinessCheck: ReadinessCheck;
  artifacts: RescueArtifact[];
  patientInstructions: string[];
  finalStatus: CaseStatus;
  outcomeSummary: string;
};

export type SampleCase = {
  id: string;
  label: string;
  description: string;
  notice: SourceDocument;
  supportingDocuments: SourceDocument[];
  preferences: CommunicationPreferences;
};

export type AgentInputCase = {
  documents: SourceDocument[];
  preferences: CommunicationPreferences;
  reviewedNotice?: ParsedNotice;
  language?: AppLanguage;
};

export type LiveGuidanceRequest = {
  blockerType: BlockerType;
  blockerLabel: string;
  noticeType: NoticeType;
  medicaidProgram?: string;
  urgency: UrgencyLevel;
  missingRequirements: string[];
  shouldEscalate: boolean;
};

export type LiveGuidanceSource = {
  title: string;
  url: string;
  siteName?: string;
  snippet?: string;
  finalUrl?: string;
  description?: string;
  publishedDate?: string;
  excerpt?: string;
};

export type LiveGuidanceResult = {
  status: "verified" | "partial";
  query: string;
  generatedAt: string;
  summary: string;
  caveats: string[];
  sources: LiveGuidanceSource[];
  errors: string[];
};

export type ReasoningEvent = {
  id: string;
  timestamp: string;
  stepName: string;
  message: string;
  data?: Record<string, unknown>;
};
