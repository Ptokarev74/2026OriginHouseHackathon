"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { getSampleCases } from "@/lib/data";
import { parseDocuments } from "@/lib/domain/parsing";
import {
  getOcrFileKind,
  getOcrFileLimitMessage,
  ocrFileLimits,
  type OcrProgress,
} from "@/lib/ocr/browserOcr";
import {
  runNoticeToRescueAgent,
  workflowSteps,
  type WorkflowStepId,
} from "@/lib/workflow/agent";
import type {
  AgentRunResult,
  CommunicationPreferences,
  DocumentSourceKind,
  LiveGuidanceResult,
  LiveGuidanceRequest,
  ParsedNotice,
  SampleCase,
  SourceDocument,
} from "@/lib/types";
import type { AppLanguage } from "@/lib/i18n/types";

export type WorkflowStatus = "idle" | "running" | "complete";
export type IntakeMode = "sample" | "upload";
export type LiveGuidanceStatus = "idle" | "loading" | "success" | "error";
export type FileMessageTone = "info" | "success" | "warn" | "error";

export type OcrState = {
  status: "idle" | "extracting" | "success" | "error";
  progress: number;
  label?: string;
  detail?: string;
};

const modeStorageKey = "notice-rescue-mode";
const preferencesStorageKey = "notice-rescue-preferences";
const sessionTextKey = "notice-rescue-session-text";

const defaultPreferences: CommunicationPreferences = {
  languagePreference: "English",
  contactMethod: "SMS",
};

function getStoredMode(): IntakeMode {
  if (typeof window === "undefined") return "sample";
  const storedMode = window.localStorage.getItem(modeStorageKey);
  return storedMode === "upload" || storedMode === "sample" ? storedMode : "sample";
}

function getStoredPreferences(): CommunicationPreferences {
  if (typeof window === "undefined") return defaultPreferences;
  const storedPreferences = window.localStorage.getItem(preferencesStorageKey);
  if (!storedPreferences) return defaultPreferences;
  try {
    return {
      ...defaultPreferences,
      ...(JSON.parse(storedPreferences) as CommunicationPreferences),
    };
  } catch {
    return defaultPreferences;
  }
}

function getStoredSessionText() {
  return typeof window !== "undefined"
    ? window.sessionStorage.getItem(sessionTextKey) ?? ""
    : "";
}

function buildUploadedDocument(text: string, sourceKind: DocumentSourceKind): SourceDocument {
  const titles: Record<Exclude<DocumentSourceKind, "sample">, string> = {
    pasted: "Pasted Medicaid notice text",
    txt_upload: "Uploaded text file",
    pdf_ocr: "OCR text from uploaded PDF",
    image_ocr: "OCR text from uploaded image",
  };

  return {
    id: "uploaded-local-medicaid-notice",
    title: sourceKind === "sample" ? "Sample notice" : titles[sourceKind],
    documentType: "uploaded_text",
    content: text,
  };
}

function parseForReview(
  documents: SourceDocument[],
  preferences: CommunicationPreferences,
  sourceKind: DocumentSourceKind,
  language: AppLanguage,
) {
  return parseDocuments(documents, preferences, sourceKind, language);
}

function mergePreferencesFromParsed(
  parsed: ParsedNotice,
  preferences: CommunicationPreferences,
): CommunicationPreferences {
  return {
    ...preferences,
    languagePreference: parsed.languagePreference || preferences.languagePreference,
    contactMethod: parsed.contactMethod || preferences.contactMethod,
  };
}

function wait(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function readTextFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("The file could not be read."));
    reader.readAsText(file);
  });
}

interface DashboardContextType {
  mode: IntakeMode;
  setMode: (mode: IntakeMode) => void;
  sampleCases: SampleCase[];
  selectedCaseId: string;
  selectedCase: SampleCase;
  updateSelectedCase: (id: string) => void;
  preferences: CommunicationPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<CommunicationPreferences>>;
  uploadText: string;
  updateUploadText: (value: string) => void;
  uploadSourceKind: DocumentSourceKind;
  fileMessage?: string;
  fileMessageTone: FileMessageTone;
  ocrState: OcrState;
  handleFile: (file: File) => Promise<void>;
  reviewNotice: ParsedNotice | undefined;
  setReviewNotice: React.Dispatch<React.SetStateAction<ParsedNotice | undefined>>;
  status: WorkflowStatus;
  activeStep: WorkflowStepId | undefined;
  result: AgentRunResult | undefined;
  liveGuidanceStatus: LiveGuidanceStatus;
  liveGuidance: LiveGuidanceResult | undefined;
  liveGuidanceError: string | undefined;
  runWorkflow: () => Promise<void>;
  verifyLiveGuidance: () => Promise<void>;
  activeDocuments: SourceDocument[];
  triggerNextStep: (stepName: string, data?: Record<string, unknown>) => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  const sampleCases = useMemo(() => getSampleCases(), []);

  const [mode, setModeState] = useState<IntakeMode>(getStoredMode);
  const [selectedCaseId, setSelectedCaseId] = useState(sampleCases[0]?.id ?? "");
  const [preferences, setPreferences] =
    useState<CommunicationPreferences>(getStoredPreferences);
  const [uploadText, setUploadText] = useState(getStoredSessionText);
  const [uploadSourceKind, setUploadSourceKind] = useState<DocumentSourceKind>("pasted");
  const [fileMessage, setFileMessage] = useState<string>();
  const [fileMessageTone, setFileMessageTone] = useState<FileMessageTone>("info");
  const [ocrState, setOcrState] = useState<OcrState>({
    status: "idle",
    progress: 0,
  });

  const [reviewNotice, setReviewNotice] = useState<ParsedNotice | undefined>(() => {
    const storedMode = getStoredMode();
    const storedPreferences = getStoredPreferences();
    const storedText = getStoredSessionText();

    if (storedMode === "upload" && storedText.trim()) {
      return parseForReview(
        [buildUploadedDocument(storedText, "pasted")],
        storedPreferences,
        "pasted",
        language,
      );
    }
    if (sampleCases[0]) {
      return parseForReview(
        [sampleCases[0].notice, ...sampleCases[0].supportingDocuments],
        sampleCases[0].preferences,
        "sample",
        language,
      );
    }
    return undefined;
  });

  const [status, setStatus] = useState<WorkflowStatus>("idle");
  const [activeStep, setActiveStep] = useState<WorkflowStepId>();
  const [result, setResult] = useState<AgentRunResult>();
  const [liveGuidanceStatus, setLiveGuidanceStatus] =
    useState<LiveGuidanceStatus>("idle");
  const [liveGuidance, setLiveGuidance] = useState<LiveGuidanceResult>();
  const [liveGuidanceError, setLiveGuidanceError] = useState<string>();

  const selectedCase = useMemo(
    () => sampleCases.find((sampleCase) => sampleCase.id === selectedCaseId) ?? sampleCases[0],
    [sampleCases, selectedCaseId],
  );

  const activeDocuments = useMemo(() => {
    if (mode === "sample" && selectedCase) {
      return [selectedCase.notice, ...selectedCase.supportingDocuments];
    }
    if (uploadText.trim()) {
      return [buildUploadedDocument(uploadText, uploadSourceKind)];
    }
    return [];
  }, [mode, selectedCase, uploadSourceKind, uploadText]);

  useEffect(() => {
    window.localStorage.setItem(modeStorageKey, mode);
  }, [mode]);

  useEffect(() => {
    window.localStorage.setItem(preferencesStorageKey, JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    if (uploadText.trim()) {
      window.sessionStorage.setItem(sessionTextKey, uploadText);
    } else {
      window.sessionStorage.removeItem(sessionTextKey);
    }
  }, [uploadText]);

  useEffect(() => {
    if (activeDocuments.length === 0) {
      setReviewNotice(undefined);
      return;
    }

    const sourceKind = mode === "sample" ? "sample" : uploadSourceKind;
    const nextPreferences = mode === "sample" ? selectedCase.preferences : preferences;
    setReviewNotice(parseForReview(activeDocuments, nextPreferences, sourceKind, language));
    setResult(undefined);
    setStatus("idle");
    setActiveStep(undefined);
    setLiveGuidanceStatus("idle");
    setLiveGuidance(undefined);
    setLiveGuidanceError(undefined);
  }, [language]);

  function resetRunState() {
    setResult(undefined);
    setStatus("idle");
    setActiveStep(undefined);
    setLiveGuidanceStatus("idle");
    setLiveGuidance(undefined);
    setLiveGuidanceError(undefined);
  }

  function setFileStatus(message: string, tone: FileMessageTone = "info") {
    setFileMessage(message);
    setFileMessageTone(tone);
  }

  function applyUploadText(
    text: string,
    sourceKind: Extract<DocumentSourceKind, "pasted" | "txt_upload" | "pdf_ocr" | "image_ocr">,
  ) {
    const parsed = text.trim()
      ? parseForReview(
          [buildUploadedDocument(text, sourceKind)],
          preferences,
          sourceKind,
          language,
        )
      : undefined;

    setUploadText(text);
    setUploadSourceKind(sourceKind);
    setReviewNotice(parsed);
    resetRunState();

    return parsed;
  }

  function setMode(nextMode: IntakeMode) {
    setModeState(nextMode);
    resetRunState();

    if (nextMode === "sample") {
      const parsed = parseForReview(
        [selectedCase.notice, ...selectedCase.supportingDocuments],
        selectedCase.preferences,
        "sample",
        language,
      );
      setPreferences(mergePreferencesFromParsed(parsed, selectedCase.preferences));
      setReviewNotice(parsed);
      return;
    }

    if (uploadText.trim()) {
      const parsed = parseForReview(
        [buildUploadedDocument(uploadText, uploadSourceKind)],
        preferences,
        uploadSourceKind,
        language,
      );
      setReviewNotice(parsed);
    } else {
      setReviewNotice(undefined);
    }
  }

  function updateSelectedCase(id: string) {
    const nextCase = sampleCases.find((sampleCase) => sampleCase.id === id) ?? selectedCase;
    const parsed = parseForReview(
      [nextCase.notice, ...nextCase.supportingDocuments],
      nextCase.preferences,
      "sample",
      language,
    );
    setSelectedCaseId(id);
    setPreferences(mergePreferencesFromParsed(parsed, nextCase.preferences));
    setReviewNotice(parsed);
    resetRunState();
  }

  function updateUploadText(value: string) {
    applyUploadText(value, "pasted");
    setFileMessage(undefined);
    setFileMessageTone("info");
    setOcrState({ status: "idle", progress: 0 });
  }

  async function handleFile(file: File) {
    const lowerName = file.name.toLowerCase();
    const ocrKind = getOcrFileKind(file);

    setFileMessage(undefined);
    setFileMessageTone("info");
    setOcrState({ status: "idle", progress: 0 });
    resetRunState();

    if (ocrKind) {
      const limitMessage = getOcrFileLimitMessage(file);

      if (limitMessage) {
        setUploadText("");
        setReviewNotice(undefined);
        setFileStatus(limitMessage, "error");
        setOcrState({ status: "error", progress: 0 });
        return;
      }

      setUploadText("");
      setUploadSourceKind(ocrKind === "pdf" ? "pdf_ocr" : "image_ocr");
      setReviewNotice(undefined);
      setOcrState({
        status: "extracting",
        progress: 0.02,
        label: "Extracting text...",
        detail:
          ocrKind === "pdf"
            ? "Rendering PDF pages locally"
            : "Preparing image locally",
      });

      try {
        const { extractTextFromOcrFile } = await import("@/lib/ocr/browserOcr");
        const result = await extractTextFromOcrFile(file, (progress: OcrProgress) => {
          setOcrState({
            status: "extracting",
            progress: progress.progress,
            label: progress.label,
            detail: progress.detail,
          });
        });
        const extractedText = result.text.trim();

        if (extractedText.length < 40) {
          setUploadText(extractedText);
          setUploadSourceKind(result.sourceKind);
          setReviewNotice(undefined);
          setFileStatus(
            "OCR finished, but it did not find enough notice text to parse. Paste the notice text manually to continue.",
            "error",
          );
          setOcrState({
            status: "error",
            progress: 1,
            label: "Text extraction incomplete",
          });
          return;
        }

        const parsed = applyUploadText(extractedText, result.sourceKind);
        const confidenceWarning =
          result.confidence < 55 || parsed?.extractionConfidence === "low";

        setOcrState({
          status: "success",
          progress: 1,
          label: "Text extracted",
          detail:
            result.sourceKind === "pdf_ocr"
              ? `${result.pageCount} PDF page${result.pageCount === 1 ? "" : "s"} processed locally`
              : "Image processed locally",
        });
        setFileStatus(
          confidenceWarning
            ? `${file.name} was OCR-read locally, but confidence is low. Review and edit the extracted text before analyzing.`
            : `${file.name} was OCR-read locally in the browser. Review the extracted text before analyzing.`,
          confidenceWarning ? "warn" : "success",
        );
      } catch (error) {
        setOcrState({
          status: "error",
          progress: 0,
          label: "Text extraction failed",
        });
        setFileStatus(
          error instanceof Error
            ? `${error.message} You can paste the notice text manually to continue.`
            : "OCR could not extract this notice. Paste the text manually to continue.",
          "error",
        );
      }
      return;
    }

    if (!lowerName.endsWith(".txt") && file.type !== "text/plain") {
      setFileStatus("Upload .txt, PDF, PNG, JPG, or JPEG files for local browser review.", "error");
      return;
    }

    if (file.size > ocrFileLimits.maxTextFileBytes) {
      setFileStatus(
        "Text files are limited to 1 MB for this demo. Paste the relevant notice text manually to continue.",
        "error",
      );
      return;
    }

    try {
      const text = await readTextFile(file);
      applyUploadText(text, "txt_upload");
      setFileStatus(`${file.name} loaded locally in the browser.`, "success");
    } catch {
      setFileStatus("The file could not be read. Paste the text manually to continue.", "error");
    }
  }

  async function runWorkflow() {
    if (!reviewNotice || activeDocuments.length === 0 || status === "running") {
      return;
    }
    const runPreferences = mergePreferencesFromParsed(reviewNotice, preferences);
    setResult(undefined);
    setStatus("running");

    for (const step of workflowSteps) {
      setActiveStep(step.id);
      await wait(step.id === "outcome" ? 320 : 460);
    }

    const runResult = runNoticeToRescueAgent({
      documents: activeDocuments,
      reviewedNotice: reviewNotice,
      preferences: runPreferences,
      language,
    });

    setResult(runResult);
    setStatus("complete");
    setActiveStep(undefined);
    setLiveGuidanceStatus("idle");
    setLiveGuidance(undefined);
    setLiveGuidanceError(undefined);
  }

  function buildGuidanceRequest(runResult: AgentRunResult): LiveGuidanceRequest {
    return {
      blockerType: runResult.blockerAssessment.blockerType,
      blockerLabel: runResult.blockerAssessment.label,
      noticeType: runResult.parsedNotice.noticeType,
      medicaidProgram: runResult.parsedNotice.medicaidProgram,
      urgency: runResult.blockerAssessment.urgency,
      missingRequirements:
        runResult.readinessCheck.missingDocuments.length > 0
          ? runResult.readinessCheck.missingDocuments
          : runResult.parsedNotice.missingRequirements,
      shouldEscalate: runResult.readinessCheck.shouldEscalate,
    };
  }

  async function verifyLiveGuidance() {
    if (!result || liveGuidanceStatus === "loading") {
      return;
    }

    setLiveGuidanceStatus("loading");
    setLiveGuidance(undefined);
    setLiveGuidanceError(undefined);

    try {
      const response = await fetch("/api/tinyfish/guidance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildGuidanceRequest(result)),
      });

      const payload = await response.json();

      if (!response.ok) {
        const message =
          typeof payload?.error?.message === "string"
            ? payload.error.message
            : "Live guidance verification failed.";
        throw new Error(message);
      }

      setLiveGuidance(payload as LiveGuidanceResult);
      setLiveGuidanceStatus("success");
    } catch (error) {
      setLiveGuidanceStatus("error");
      setLiveGuidanceError(
        error instanceof Error
          ? error.message
          : "Live guidance verification failed.",
      );
    }
  }

  async function triggerNextStep(stepName: string, data?: Record<string, unknown>) {
    console.log(`[Event Trigger] notice-rescue/${stepName}`, data || {});
  }

  return (
    <DashboardContext.Provider
      value={{
        mode,
        setMode,
        sampleCases,
        selectedCaseId,
        selectedCase,
        updateSelectedCase,
        preferences,
        setPreferences,
        uploadText,
        updateUploadText,
        uploadSourceKind,
        fileMessage,
        fileMessageTone,
        ocrState,
        handleFile,
        reviewNotice,
        setReviewNotice,
        status,
        activeStep,
        result,
        liveGuidanceStatus,
        liveGuidance,
        liveGuidanceError,
        runWorkflow,
        verifyLiveGuidance,
        activeDocuments,
        triggerNextStep,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
