export type CostLevel = "low" | "medium" | "high";
export type CoverageRiskLevel = "low" | "moderate" | "urgent" | "manual_review";
export type UrgencyLevel = "routine" | "soon" | "urgent";
export type ActionStatus = "completed" | "simulated" | "blocked";
export type MedicareCoverageType =
  | "Original Medicare"
  | "Medicare Advantage"
  | "Dual eligible"
  | "Unknown";
export type ExtractionConfidence = "low" | "medium" | "high";
export type DocumentSourceKind = "sample" | "pasted" | "txt_upload" | "pdf_unsupported";
export type DocumentType =
  | "medicare_notice"
  | "plan_notice"
  | "referral_note"
  | "discharge_summary"
  | "provider_letter"
  | "uploaded_text";

export type PatientPreferences = {
  maxDistanceMiles: number;
  needsTelehealth?: boolean;
  languagePreference?: string;
  transportationNeeded?: boolean;
};

export type ParsedCase = {
  patientName?: string;
  insuranceType: string;
  medicareCoverageType: MedicareCoverageType;
  possibleStatusIssue?: string;
  deadlineDate?: string;
  premiumPaymentIssue: boolean;
  issueSignals: string[];
  documentSummary: string;
  extractionConfidence: ExtractionConfidence;
  sourceKind: DocumentSourceKind;
  missingDocuments: string[];
  specialtyNeeded: string;
  urgency: UrgencyLevel;
  locationZip: string;
  transportationFlag: boolean;
  languagePreference?: string;
  recommendedFollowUpWindow?: string;
};

export type CoverageAssessment = {
  riskLevel: CoverageRiskLevel;
  riskLabel: string;
  daysUntilDeadline?: number;
  checklistRequired: boolean;
  manualReviewRequired: boolean;
  possibleDisruption: boolean;
  includeMedicareCompatible: boolean;
  verificationQuestions: string[];
  findings: string[];
};

export type ReferralAssessment = {
  specialtyNeeded: string;
  urgency: UrgencyLevel;
  recommendedFollowUpWindow: string;
  findings: string[];
};

export type Provider = {
  id: string;
  name: string;
  specialty: string;
  acceptedInsurance: string[];
  distanceMiles: number;
  availabilityDays: number;
  estimatedCostLevel: CostLevel;
  languages: string[];
  telehealth: boolean;
  acceptingNewPatients: boolean;
};

export type RankedProvider = Provider & {
  score: number;
  scoreBreakdown: {
    insurance: number;
    specialty: number;
    distance: number;
    availability: number;
    cost: number;
  };
  explanation: string[];
};

export type RenewalChecklist = {
  required: boolean;
  dueDate?: string;
  items: string[];
  submissionPlan: string[];
};

export type ActionResult = {
  id: string;
  label: string;
  status: ActionStatus;
  timestamp: string;
  summary: string;
  details: string[];
};

export type AgentRunResult = {
  parsedCase: ParsedCase;
  coverageAssessment: CoverageAssessment;
  referralAssessment: ReferralAssessment;
  rankedProviders: RankedProvider[];
  selectedProvider?: RankedProvider;
  renewalChecklist: RenewalChecklist;
  actions: ActionResult[];
  patientInstructions: string[];
  finalStatus: "next_steps_ready" | "manual_review_needed" | "no_provider_match";
  outcomeSummary: string;
};

export type SourceDocument = {
  id: string;
  title: string;
  documentType: DocumentType;
  content: string;
};

export type SampleCase = {
  id: string;
  label: string;
  description: string;
  noticeId: string;
  referralNoteId: string;
  preferences: PatientPreferences;
  notice: SourceDocument;
  referralNote: SourceDocument;
};

export type AgentInputCase = {
  documents: SourceDocument[];
  preferences: PatientPreferences;
  providers: Provider[];
  reviewedCase?: ParsedCase;
};
