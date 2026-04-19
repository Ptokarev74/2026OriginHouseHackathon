import type { DocumentSourceKind } from "@/lib/types";

export const ocrFileLimits = {
  maxFileBytes: 10 * 1024 * 1024,
  maxTextFileBytes: 1 * 1024 * 1024,
  maxPdfPages: 5,
  maxCanvasPixels: 4_000_000,
  timeoutMs: 120_000,
};

export type OcrProgress = {
  label: string;
  detail?: string;
  progress: number;
};

export type OcrFileKind = "pdf" | "image";

export type OcrResult = {
  text: string;
  confidence: number;
  pageCount: number;
  sourceKind: Extract<DocumentSourceKind, "pdf_ocr" | "image_ocr">;
};

type TesseractModule = typeof import("tesseract.js");
type TesseractWorker = Awaited<ReturnType<TesseractModule["createWorker"]>>;
type PdfJsModule = typeof import("pdfjs-dist");

const supportedImageTypes = new Set(["image/png", "image/jpeg"]);

export function getOcrFileKind(file: File): OcrFileKind | undefined {
  const lowerName = file.name.toLowerCase();

  if (file.type === "application/pdf" || lowerName.endsWith(".pdf")) {
    return "pdf";
  }
  if (
    supportedImageTypes.has(file.type) ||
    lowerName.endsWith(".png") ||
    lowerName.endsWith(".jpg") ||
    lowerName.endsWith(".jpeg")
  ) {
    return "image";
  }

  return undefined;
}

export function getOcrFileLimitMessage(file: File) {
  if (file.size > ocrFileLimits.maxFileBytes) {
    return `Files are limited to ${formatMegabytes(ocrFileLimits.maxFileBytes)} for this local demo. Try a smaller scan or paste the notice text manually.`;
  }

  return undefined;
}

export async function extractTextFromOcrFile(
  file: File,
  onProgress: (progress: OcrProgress) => void,
): Promise<OcrResult> {
  const kind = getOcrFileKind(file);

  if (!kind) {
    throw new Error("Upload a PDF, PNG, JPG, or JPEG notice for local OCR.");
  }

  const limitMessage = getOcrFileLimitMessage(file);
  if (limitMessage) {
    throw new Error(limitMessage);
  }

  return runWithTimeout(async (signal) => {
    if (kind === "pdf") {
      return extractPdfText(file, onProgress, signal);
    }

    return extractImageText(file, onProgress, signal);
  });
}

function formatMegabytes(bytes: number) {
  return `${Math.round(bytes / 1024 / 1024)} MB`;
}

async function runWithTimeout<T>(
  operation: (signal: AbortSignal) => Promise<T>,
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), ocrFileLimits.timeoutMs);

  try {
    return await operation(controller.signal);
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error("Text extraction timed out. Try a smaller scan or paste the text manually.");
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function throwIfAborted(signal: AbortSignal) {
  if (signal.aborted) {
    throw new Error("OCR cancelled.");
  }
}

async function withAbort<T>(
  promise: Promise<T>,
  signal: AbortSignal,
  onAbort?: () => void | Promise<void>,
) {
  if (signal.aborted) {
    await onAbort?.();
    throw new Error("OCR cancelled.");
  }

  let abortHandler: (() => void) | undefined;

  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        abortHandler = () => {
          void onAbort?.();
          reject(new Error("OCR cancelled."));
        };
        signal.addEventListener("abort", abortHandler, { once: true });
      }),
    ]);
  } finally {
    if (abortHandler) {
      signal.removeEventListener("abort", abortHandler);
    }
  }
}

async function loadTesseract() {
  const tesseractModule = await import("tesseract.js");
  const withDefault = tesseractModule as TesseractModule & {
    default?: TesseractModule;
  };

  return withDefault.default ?? tesseractModule;
}

async function createLocalWorker(
  onProgress: (progress: OcrProgress) => void,
): Promise<TesseractWorker> {
  const tesseract = await loadTesseract();

  const worker = await tesseract.createWorker("eng", undefined, {
    workerPath: "/vendor/tesseract/worker.min.js",
    corePath: "/vendor/tesseract-core",
    langPath: "/vendor/tesseract-lang",
    cacheMethod: "none",
    workerBlobURL: false,
    gzip: true,
    logger: (message) => {
      onProgress({
        label: "Extracting text...",
        detail: humanizeTesseractStatus(message.status),
        progress: clampProgress(message.progress),
      });
    },
  });

  await worker.setParameters({
    preserve_interword_spaces: "1",
    tessedit_pageseg_mode: tesseract.PSM.AUTO,
  });

  return worker;
}

function humanizeTesseractStatus(status: string) {
  if (/loading language/i.test(status)) return "Loading local English OCR data";
  if (/initializing/i.test(status)) return "Starting local OCR worker";
  if (/recognizing/i.test(status)) return "Reading document text";

  return status;
}

function clampProgress(progress: number) {
  if (!Number.isFinite(progress)) return 0;
  return Math.min(1, Math.max(0, progress));
}

async function extractImageText(
  file: File,
  onProgress: (progress: OcrProgress) => void,
  signal: AbortSignal,
): Promise<OcrResult> {
  let worker: TesseractWorker | undefined;
  let canvas: HTMLCanvasElement | undefined;

  try {
    onProgress({
      label: "Extracting text...",
      detail: "Preparing image in the browser",
      progress: 0.05,
    });
    canvas = await createImageCanvas(file, signal);
    throwIfAborted(signal);
    worker = await withAbort(createLocalWorker(onProgress), signal);

    onProgress({
      label: "Extracting text...",
      detail: "Running OCR on image",
      progress: 0.2,
    });
    const result = await withAbort(
      worker.recognize(canvas, { rotateAuto: true }),
      signal,
      async () => {
        await worker?.terminate();
      },
    );

    return {
      text: normalizeOcrText(result.data.text),
      confidence: result.data.confidence,
      pageCount: 1,
      sourceKind: "image_ocr",
    };
  } finally {
    cleanupCanvas(canvas);
    await worker?.terminate();
  }
}

async function createImageCanvas(file: File, signal: AbortSignal) {
  const bitmap = await createImageBitmap(file);
  try {
    throwIfAborted(signal);
    const scale = Math.min(
      1,
      Math.sqrt(ocrFileLimits.maxCanvasPixels / (bitmap.width * bitmap.height)),
    );
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));

    const context = canvas.getContext("2d", { alpha: false });
    if (!context) {
      throw new Error("The browser could not prepare the image for OCR.");
    }

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    return canvas;
  } finally {
    bitmap.close();
  }
}

async function extractPdfText(
  file: File,
  onProgress: (progress: OcrProgress) => void,
  signal: AbortSignal,
): Promise<OcrResult> {
  const pdfjs = await loadPdfJs();
  let worker: TesseractWorker | undefined;
  let pdf: Awaited<ReturnType<PdfJsModule["getDocument"]>["promise"]> | undefined;

  const loadingTask = pdfjs.getDocument({
    data: await file.arrayBuffer(),
    isEvalSupported: false,
  });

  try {
    onProgress({
      label: "Extracting text...",
      detail: "Rendering PDF locally",
      progress: 0.05,
    });
    pdf = await withAbort(loadingTask.promise, signal, () => loadingTask.destroy());

    if (pdf.numPages > ocrFileLimits.maxPdfPages) {
      throw new Error(
        `PDFs are limited to ${ocrFileLimits.maxPdfPages} pages for this demo. Upload fewer pages or paste the notice text manually.`,
      );
    }

    worker = await withAbort(createLocalWorker(onProgress), signal);

    const pages: string[] = [];
    let confidenceTotal = 0;

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      throwIfAborted(signal);
      const pageText = await renderAndRecognizePdfPage({
        pageNumber,
        pageCount: pdf.numPages,
        pdf,
        worker,
        signal,
        onProgress,
      });
      pages.push(pageText.text);
      confidenceTotal += pageText.confidence;
    }

    return {
      text: normalizeOcrText(pages.join("\n\n")),
      confidence: confidenceTotal / Math.max(1, pdf.numPages),
      pageCount: pdf.numPages,
      sourceKind: "pdf_ocr",
    };
  } finally {
    await worker?.terminate();
    if (pdf) {
      await pdf.destroy();
    } else {
      await loadingTask.destroy();
    }
  }
}

async function loadPdfJs() {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/vendor/pdfjs/pdf.worker.min.mjs";

  return pdfjs;
}

async function renderAndRecognizePdfPage({
  pageNumber,
  pageCount,
  pdf,
  worker,
  signal,
  onProgress,
}: {
  pageNumber: number;
  pageCount: number;
  pdf: Awaited<ReturnType<PdfJsModule["getDocument"]>["promise"]>;
  worker: TesseractWorker;
  signal: AbortSignal;
  onProgress: (progress: OcrProgress) => void;
}) {
  const page = await withAbort(pdf.getPage(pageNumber), signal);
  let canvas: HTMLCanvasElement | undefined;

  try {
    const baseViewport = page.getViewport({ scale: 1 });
    const scale = Math.min(
      2,
      Math.sqrt(
        ocrFileLimits.maxCanvasPixels / (baseViewport.width * baseViewport.height),
      ),
    );
    const viewport = page.getViewport({ scale });
    canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    const context = canvas.getContext("2d", { alpha: false });
    if (!context) {
      throw new Error("The browser could not render the PDF page for OCR.");
    }

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    onProgress({
      label: "Extracting text...",
      detail: `Rendering page ${pageNumber} of ${pageCount}`,
      progress: pageProgress(pageNumber, pageCount, 0.15),
    });
    const renderTask = page.render({
      canvas,
      canvasContext: context,
      viewport,
    });
    await withAbort(renderTask.promise, signal, () => renderTask.cancel());

    onProgress({
      label: "Extracting text...",
      detail: `Reading page ${pageNumber} of ${pageCount}`,
      progress: pageProgress(pageNumber, pageCount, 0.45),
    });
    const result = await withAbort(
      worker.recognize(canvas, { rotateAuto: true }),
      signal,
      async () => {
        await worker.terminate();
      },
    );

    return {
      text: result.data.text,
      confidence: result.data.confidence,
    };
  } finally {
    cleanupCanvas(canvas);
    page.cleanup();
  }
}

function pageProgress(pageNumber: number, pageCount: number, phaseProgress: number) {
  const pagePortion = (pageNumber - 1 + phaseProgress) / pageCount;

  return 0.1 + pagePortion * 0.85;
}

function cleanupCanvas(canvas?: HTMLCanvasElement) {
  if (!canvas) return;

  const context = canvas.getContext("2d");
  context?.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = 0;
  canvas.height = 0;
}

function normalizeOcrText(text: string) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
