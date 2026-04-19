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
  ReasoningEvent,
  SampleCase,
  SourceDocument,
} from "@/lib/types";
import { copyLanguage, type AppLanguage, type CopyLanguage } from "@/lib/i18n/types";

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

function localized(language: AppLanguage, copy: Record<CopyLanguage, string>) {
  return copy[copyLanguage(language)];
}

function localizeOcrProgress(progress: OcrProgress, language: AppLanguage): OcrProgress {
  if (copyLanguage(language) !== "so") return progress;

  const detail = progress.detail
    ?.replace("Loading local English OCR data", "Raraya xogta OCR Ingiriisiga ee gudaha")
    .replace("Starting local OCR worker", "Bilaabaya shaqaalaha OCR ee gudaha")
    .replace("Reading document text", "Akhriyaya qoraalka dukumiintiga")
    .replace("Preparing image in the browser", "Diyaarinaya sawirka browser-ka")
    .replace("Running OCR on image", "OCR ku samaynaya sawirka")
    .replace("Rendering PDF locally", "PDF gudaha lagu soo bandhigayo")
    .replace(/Rendering page (\d+) of (\d+)/, "Soo bandhigaya bogga $1 ee $2")
    .replace(/Reading page (\d+) of (\d+)/, "Akhriyaya bogga $1 ee $2");

  return {
    ...progress,
    label: progress.label === "Extracting text..." ? "Qoraalka ayaa la soo saarayaa..." : progress.label,
    detail,
  };
}

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

function buildUploadedDocument(
  text: string,
  sourceKind: DocumentSourceKind,
  language: AppLanguage,
): SourceDocument {
  const titles: Record<Exclude<DocumentSourceKind, "sample">, Record<CopyLanguage, string>> = {
    pasted: {
      en: "Pasted Medicaid notice text",
      es: "Texto pegado del aviso de Medicaid",
      so: "Qoraalka ogeysiiska Medicaid ee la dhajiyay",
    },
    txt_upload: {
      en: "Uploaded text file",
      es: "Archivo de texto subido",
      so: "Fayl qoraal ah oo la raray",
    },
    pdf_ocr: {
      en: "OCR text from uploaded PDF",
      es: "Texto OCR del PDF subido",
      so: "Qoraalka OCR ee PDF la raray",
    },
    image_ocr: {
      en: "OCR text from uploaded image",
      es: "Texto OCR de la imagen subida",
      so: "Qoraalka OCR ee sawirka la raray",
    },
  };

  return {
    id: "uploaded-local-medicaid-notice",
    title: sourceKind === "sample"
      ? localized(language, {
          en: "Sample notice",
          es: "Aviso de muestra",
          so: "Ogeysiis tusaale ah",
        })
      : titles[sourceKind][copyLanguage(language)],
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
  traceEvents: ReasoningEvent[];
  triggerNextStep: (stepName: string, message: string, data?: Record<string, unknown>) => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  const sampleCases = useMemo(() => getSampleCases(language), [language]);

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
        [buildUploadedDocument(storedText, "pasted", language)],
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
  const [traceEvents, setTraceEvents] = useState<ReasoningEvent[]>([]);

  const selectedCase = useMemo(
    () => sampleCases.find((sampleCase) => sampleCase.id === selectedCaseId) ?? sampleCases[0],
    [sampleCases, selectedCaseId],
  );

  const activeDocuments = useMemo(() => {
    if (mode === "sample" && selectedCase) {
      return [selectedCase.notice, ...selectedCase.supportingDocuments];
    }
    if (uploadText.trim()) {
      return [buildUploadedDocument(uploadText, uploadSourceKind, language)];
    }
    return [];
  }, [language, mode, selectedCase, uploadSourceKind, uploadText]);

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
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;

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
    });

    return () => {
      cancelled = true;
    };
    // Reparse localized generated copy when the language changes without resetting user edits on every intake change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  function resetRunState() {
    setResult(undefined);
    setStatus("idle");
    setActiveStep(undefined);
    setLiveGuidanceStatus("idle");
    setLiveGuidance(undefined);
    setLiveGuidanceError(undefined);
    setTraceEvents([]);
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
          [buildUploadedDocument(text, sourceKind, language)],
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
        [buildUploadedDocument(uploadText, uploadSourceKind, language)],
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
        setFileStatus(
          copyLanguage(language) === "so"
            ? "Faylasha way ka weyn yihiin xadka demo-gan gudaha ah. Isku day sawir ka yar ama gacanta ku dhaji qoraalka ogeysiiska."
            : limitMessage,
          "error",
        );
        setOcrState({ status: "error", progress: 0 });
        return;
      }

      setUploadText("");
      setUploadSourceKind(ocrKind === "pdf" ? "pdf_ocr" : "image_ocr");
      setReviewNotice(undefined);
      setOcrState({
        status: "extracting",
        progress: 0.02,
        label: localized(language, {
          en: "Extracting text...",
          es: "Extrayendo texto...",
          so: "Qoraalka ayaa la soo saarayaa...",
        }),
        detail:
          ocrKind === "pdf"
            ? localized(language, {
                en: "Rendering PDF pages locally",
                es: "Renderizando paginas PDF localmente",
                so: "Bogagga PDF gudaha ayaa la soo bandhigayaa",
              })
            : localized(language, {
                en: "Preparing image locally",
                es: "Preparando imagen localmente",
                so: "Sawirka gudaha ayaa la diyaarinayaa",
              }),
      });

      try {
        const { extractTextFromOcrFile } = await import("@/lib/ocr/browserOcr");
        const result = await extractTextFromOcrFile(file, (progress: OcrProgress) => {
          const localizedProgress = localizeOcrProgress(progress, language);
          setOcrState({
            status: "extracting",
            progress: localizedProgress.progress,
            label: localizedProgress.label,
            detail: localizedProgress.detail,
          });
        });
        const extractedText = result.text.trim();

        if (extractedText.length < 40) {
          setUploadText(extractedText);
          setUploadSourceKind(result.sourceKind);
          setReviewNotice(undefined);
          setFileStatus(
            localized(language, {
              en: "OCR finished, but it did not find enough notice text to parse. Paste the notice text manually to continue.",
              es: "El OCR termino, pero no encontro suficiente texto del aviso para analizar. Pega el texto del aviso manualmente para continuar.",
              so: "OCR wuu dhammaaday, laakiin ma helin qoraal ogeysiis oo ku filan in la falanqeeyo. Gacanta ku dhaji qoraalka ogeysiiska si aad u sii waddo.",
            }),
            "error",
          );
          setOcrState({
            status: "error",
            progress: 1,
            label: localized(language, {
              en: "Text extraction incomplete",
              es: "Extraccion de texto incompleta",
              so: "Soo saarista qoraalka ma dhammeystirna",
            }),
          });
          return;
        }

        const parsed = applyUploadText(extractedText, result.sourceKind);
        const confidenceWarning =
          result.confidence < 55 || parsed?.extractionConfidence === "low";

        setOcrState({
          status: "success",
          progress: 1,
          label: localized(language, {
            en: "Text extracted",
            es: "Texto extraido",
            so: "Qoraalka waa la soo saaray",
          }),
          detail:
            result.sourceKind === "pdf_ocr"
              ? localized(language, {
                  en: `${result.pageCount} PDF page${result.pageCount === 1 ? "" : "s"} processed locally`,
                  es: `${result.pageCount} pagina${result.pageCount === 1 ? "" : "s"} PDF procesada${result.pageCount === 1 ? "" : "s"} localmente`,
                  so: `${result.pageCount} bog PDF ah ayaa gudaha lagu farsameeyay`,
                })
              : localized(language, {
                  en: "Image processed locally",
                  es: "Imagen procesada localmente",
                  so: "Sawirka gudaha ayaa lagu farsameeyay",
                }),
        });
        setFileStatus(
          confidenceWarning
            ? localized(language, {
                en: `${file.name} was OCR-read locally, but confidence is low. Review and edit the extracted text before analyzing.`,
                es: `${file.name} se leyo con OCR localmente, pero la confianza es baja. Revisa y edita el texto extraido antes de analizar.`,
                so: `${file.name} waxaa OCR loogu akhriyay gudaha, laakiin kalsoonidu way hooseysaa. Dib u eeg oo tafatir qoraalka la soo saaray ka hor falanqaynta.`,
              })
            : localized(language, {
                en: `${file.name} was OCR-read locally in the browser. Review the extracted text before analyzing.`,
                es: `${file.name} se leyo con OCR localmente en el navegador. Revisa el texto extraido antes de analizar.`,
                so: `${file.name} waxaa OCR loogu akhriyay gudaha browser-ka. Dib u eeg qoraalka la soo saaray ka hor falanqaynta.`,
              }),
          confidenceWarning ? "warn" : "success",
        );
      } catch (error) {
        setOcrState({
          status: "error",
          progress: 0,
          label: localized(language, {
            en: "Text extraction failed",
            es: "Fallo la extraccion de texto",
            so: "Soo saarista qoraalka way fashilantay",
          }),
        });
        setFileStatus(
          copyLanguage(language) === "so"
            ? "OCR kama soo saari karin ogeysiiskan. Gacanta ku dhaji qoraalka si aad u sii waddo."
            : error instanceof Error
            ? `${error.message} You can paste the notice text manually to continue.`
            : "OCR could not extract this notice. Paste the text manually to continue.",
          "error",
        );
      }
      return;
    }

    if (!lowerName.endsWith(".txt") && file.type !== "text/plain") {
      setFileStatus(
        localized(language, {
          en: "Upload .txt, PDF, PNG, JPG, or JPEG files for local browser review.",
          es: "Sube archivos .txt, PDF, PNG, JPG o JPEG para revision local en el navegador.",
          so: "Rar faylal .txt, PDF, PNG, JPG, ama JPEG ah si browser-ka gudihiisa loogu eego.",
        }),
        "error",
      );
      return;
    }

    if (file.size > ocrFileLimits.maxTextFileBytes) {
      setFileStatus(
        localized(language, {
          en: "Text files are limited to 1 MB for this demo. Paste the relevant notice text manually to continue.",
          es: "Los archivos de texto estan limitados a 1 MB para esta demo. Pega manualmente el texto relevante del aviso para continuar.",
          so: "Faylasha qoraalka waxay demo-gan ku xaddidan yihiin 1 MB. Gacanta ku dhaji qoraalka ogeysiiska ee khuseeya si aad u sii waddo.",
        }),
        "error",
      );
      return;
    }

    try {
      const text = await readTextFile(file);
      applyUploadText(text, "txt_upload");
      setFileStatus(
        localized(language, {
          en: `${file.name} loaded locally in the browser.`,
          es: `${file.name} se cargo localmente en el navegador.`,
          so: `${file.name} waxaa gudaha loogu raray browser-ka.`,
        }),
        "success",
      );
    } catch {
      setFileStatus(
        localized(language, {
          en: "The file could not be read. Paste the text manually to continue.",
          es: "No se pudo leer el archivo. Pega el texto manualmente para continuar.",
          so: "Faylka lama akhrin karin. Gacanta ku dhaji qoraalka si aad u sii waddo.",
        }),
        "error",
      );
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
      await triggerNextStep(step.id, step.description);
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
      language,
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
            : localized(language, {
                en: "Live guidance verification failed.",
                es: "Fallo la verificacion de guia en vivo.",
                so: "Xaqiijinta hagidda tooska ah way fashilantay.",
              });
        throw new Error(message);
      }

      setLiveGuidance(payload as LiveGuidanceResult);
      setLiveGuidanceStatus("success");
    } catch (error) {
      setLiveGuidanceStatus("error");
      setLiveGuidanceError(
        error instanceof Error
          ? error.message
          : localized(language, {
              en: "Live guidance verification failed.",
              es: "Fallo la verificacion de guia en vivo.",
              so: "Xaqiijinta hagidda tooska ah way fashilantay.",
            }),
      );
    }
  }

  async function triggerNextStep(stepName: string, message: string, data?: Record<string, unknown>) {
    const event: ReasoningEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      stepName,
      message,
      data,
    };
    
    setTraceEvents((prev) => [...prev, event]);
    console.log(`[Event Trigger] notice-rescue/${stepName}`, data || {});
    
    // Tinyfish Event Orchestration Placeholder
    // fetch("/api/tinyfish/events", { method: "POST", body: JSON.stringify(event) }).catch(() => {});
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
        traceEvents,
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
