"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getSampleCases } from "@/lib/data";
import { parseDocuments } from "@/lib/domain/parsing";
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

export type WorkflowStatus = "idle" | "running" | "complete";
export type IntakeMode = "sample" | "upload";
export type LiveGuidanceStatus = "idle" | "loading" | "success" | "error";

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
  return {
    id: "uploaded-local-medicaid-notice",
    title: sourceKind === "txt_upload" ? "Uploaded text file" : "Pasted Medicaid notice text",
    documentType: "uploaded_text",
    content: text,
  };
}

function parseForReview(
  documents: SourceDocument[],
  preferences: CommunicationPreferences,
  sourceKind: DocumentSourceKind,
) {
  return parseDocuments(documents, preferences, sourceKind);
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
  handleFile: (file: File) => void;
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
  const sampleCases = useMemo(() => getSampleCases(), []);

  const [mode, setModeState] = useState<IntakeMode>(getStoredMode);
  const [selectedCaseId, setSelectedCaseId] = useState(sampleCases[0]?.id ?? "");
  const [preferences, setPreferences] =
    useState<CommunicationPreferences>(getStoredPreferences);
  const [uploadText, setUploadText] = useState(getStoredSessionText);
  const [uploadSourceKind, setUploadSourceKind] = useState<DocumentSourceKind>("pasted");
  const [fileMessage, setFileMessage] = useState<string>();

  const [reviewNotice, setReviewNotice] = useState<ParsedNotice | undefined>(() => {
    const storedMode = getStoredMode();
    const storedPreferences = getStoredPreferences();
    const storedText = getStoredSessionText();

    if (storedMode === "upload" && storedText.trim()) {
      return parseForReview(
        [buildUploadedDocument(storedText, "pasted")],
        storedPreferences,
        "pasted",
      );
    }
    if (sampleCases[0]) {
      return parseForReview(
        [sampleCases[0].notice, ...sampleCases[0].supportingDocuments],
        sampleCases[0].preferences,
        "sample",
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

  function resetRunState() {
    setResult(undefined);
    setStatus("idle");
    setActiveStep(undefined);
    setLiveGuidanceStatus("idle");
    setLiveGuidance(undefined);
    setLiveGuidanceError(undefined);
  }

  function setMode(nextMode: IntakeMode) {
    setModeState(nextMode);
    resetRunState();

    if (nextMode === "sample") {
      const parsed = parseForReview(
        [selectedCase.notice, ...selectedCase.supportingDocuments],
        selectedCase.preferences,
        "sample",
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
    );
    setSelectedCaseId(id);
    setPreferences(mergePreferencesFromParsed(parsed, nextCase.preferences));
    setReviewNotice(parsed);
    resetRunState();
  }

  function updateUploadText(value: string) {
    setUploadText(value);
    setUploadSourceKind("pasted");
    setFileMessage(undefined);

    if (value.trim()) {
      setReviewNotice(
        parseForReview([buildUploadedDocument(value, "pasted")], preferences, "pasted"),
      );
    } else {
      setReviewNotice(undefined);
    }
    resetRunState();
  }

  function handleFile(file: File) {
    const lowerName = file.name.toLowerCase();
    if (lowerName.endsWith(".pdf") || file.type === "application/pdf") {
      setFileMessage(
        "PDF parsing is not included in this local prototype. Paste text from the PDF into the notice box to continue.",
      );
      setUploadSourceKind("pdf_unsupported");
      return;
    }
    if (!lowerName.endsWith(".txt") && file.type !== "text/plain") {
      setFileMessage("Only .txt files are read locally in this prototype.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      setUploadText(text);
      setUploadSourceKind("txt_upload");
      setReviewNotice(
        text.trim()
          ? parseForReview(
              [buildUploadedDocument(text, "txt_upload")],
              preferences,
              "txt_upload",
            )
          : undefined,
      );
      resetRunState();
      setFileMessage(`${file.name} loaded locally in the browser.`);
    };
    reader.onerror = () => {
      setFileMessage("The file could not be read. Paste the text manually to continue.");
    };
    reader.readAsText(file);
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
