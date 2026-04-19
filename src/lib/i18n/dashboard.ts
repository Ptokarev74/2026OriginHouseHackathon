import type {
  AppLanguage,
} from "@/lib/i18n/types";
import type {
  BlockerType,
  CaseStatus,
  DocumentSourceKind,
  NoticeType,
  UrgencyLevel,
} from "@/lib/types";

export const dashboardCopy = {
  en: {
    languageLabel: "Language",
    appSubtitle: "Medicaid notice agent",
    nav: {
      intake: "Intake",
      analysis: "Notice Analysis",
      rescuePath: "Rescue Path",
      packetPrep: "Packet Prep",
      finalStatus: "Final Status",
      primary: "Primary navigation",
    },
    shell: {
      agentStatus: "Agent status",
    },
    status: {
      idle: "IDLE",
      running: "RUNNING",
      complete: "COMPLETE",
      done: "Done",
    },
    trace: {
      title: "Agent Reasoning Trace",
      awaiting: "Awaiting next workflow step...",
      fallback: "Awaiting active notice context...",
      items: {
        "/dashboard/intake": [
          "Loaded local sample notice packets and current intake mode.",
          "Preparing notice text, case status letter, and verification documents for parsing.",
          "No real documents leave the browser in this prototype.",
        ],
        "/dashboard/coverage-analysis": [
          "Extracting notice type, response date, program context, and risk language.",
          "Classifying missing verification and deadline signals.",
          "Preparing editable fields before the rescue agent runs.",
        ],
        "/dashboard/rescue-path": [
          "Reading unstructured notice text with deterministic local rules.",
          "Identifying the exact blocker putting coverage at risk.",
          "Choosing document rescue, deadline rescue, renewal completion, or escalation.",
        ],
        "/dashboard/action-execution": [
          "Generating plain-language explanation and missing-requirements checklist.",
          "Building simulated submission and escalation packets.",
          "Checking whether documents are present or human review is needed.",
        ],
        "/dashboard/final-status": [
          "Aggregating rescue artifacts into a print-ready case summary.",
          "Setting final case status from readiness and escalation checks.",
          "Preparing patient next steps for follow-up outside this prototype.",
        ],
      },
    },
    common: {
      running: "Running",
      confidence: "CONFIDENCE",
      source: "SOURCE",
      sources: "SOURCES",
      verify: "Verify",
      verifyManually: "Verify manually",
      informationalOnly: "Informational only",
      noMissingRequirement: "No targeted missing requirement remains in the demo packet.",
      localExtractionComplete: "Local extraction complete.",
      extractionPlaceholder: "YYYY-MM-DD",
      familyProgramPlaceholder: "Family Medicaid, Adult Medicaid...",
    },
    intake: {
      title: "Intake",
      copy:
        "Select a fictional Medicaid notice packet or paste local notice text to begin the rescue workflow.",
      sampleTitle: "Sample Packets",
      sampleCopy:
        "Use fictional notices to see blocker detection, readiness checks, and packet preparation.",
      uploadTitle: "Paste or Upload",
      uploadCopy:
        "Paste text, upload .txt, or OCR a scanned PDF/image locally in the browser.",
      demoEyebrow: "Demo Path",
      choosePacket: "Choose a notice packet",
      sampleCase: "Sample case",
      packetContents: "Packet contents",
      notice: "Notice",
      supportingDocs: "Supporting docs",
      preference: "Preference",
      yourNotice: "Your Notice",
      provideText: "Provide Medicaid notice text",
      pasteText: "Paste text",
      pasteTextCopy: "Type or paste notice text directly into the review box.",
      uploadTxt: "Upload .txt",
      uploadTxtCopy: "Read plain-text notices locally for the current session.",
      ocr: "OCR PDF/image",
      ocrCopy: "Render PDFs or images in-browser and extract editable text.",
      extractedText: "Extracted notice text",
      noticeContent: "Notice content",
      ocrReady:
        "OCR text is ready for review. Edit anything that looks wrong before analyzing.",
      uploadFile: "Upload notice file",
      txtFiles: ".txt files load as text",
      pdfFiles: "PDFs OCR up to 5 pages",
      imageFiles: "PNG/JPG images OCR locally",
      ocrLocal:
        "OCR runs in this browser tab and only produces editable text for the existing demo workflow.",
      analyzeNotice: "Analyze Notice",
      placeholder:
        "Paste Medicaid closure, renewal, termination, action-required, or case status letter text here.",
    },
    analysis: {
      title: "Notice Analysis",
      copy:
        "Review the extracted Medicaid notice fields before running the rescue agent.",
      eyebrow: "Data Review",
      sectionTitle: "Confirm extracted notice details",
      noticeType: "Notice type",
      deadline: "Deadline or response date",
      patientName: "Patient name",
      medicaidProgram: "Medicaid program",
      exactBlocker: "Exact blocker",
      blockerLabel: "Blocker label",
      urgency: "Urgency",
      caseStatus: "Case status",
      languagePreference: "Language preference",
      communicationPreference: "Communication preference",
      missingRequirements: "Missing requirements",
      riskLanguage: "Risk language",
      back: "Back to Intake",
      run: "Run Rescue Agent",
    },
    rescue: {
      title: "Rescue Path",
      copy:
        "Run the local rescue agent to identify the blocker, urgency, status, and next action.",
      readyTitle: "Ready to run rescue agent",
      readyCopy:
        "The agent will read the notice, classify the exact blocker, choose the rescue path, and check readiness.",
      run: "Run Rescue Agent",
      readingTitle: "Reading notice packet...",
      readingCopy:
        "Extracting deadline, risk language, missing requirements, and readiness.",
      statNoticeType: "Notice type",
      statNoticeHelper: "Extracted from the notice packet",
      statDeadline: "Deadline",
      statDeadlineHelper: "Response date to confirm",
      statBlocker: "Blocker",
      statBlockerHelper: "Exact blocker putting coverage at risk",
      statStatus: "Status",
      statStatusHelper: "Agent readiness status",
      decisionEyebrow: "Decision",
      decisionTitle: "Rescue path identified",
      nextAction: "Next action",
      guidanceEyebrow: "Live Guidance",
      guidanceTitle: "Public-web verification",
      guidanceCopy:
        "TinyFish checks fresh public sources for guidance related to the blocker, missing requirements, deadlines, and escalation path.",
      refreshGuidance: "Refresh Guidance",
      verifyGuidance: "Verify Guidance",
      searching:
        "Searching public-web guidance and extracting the strongest sources...",
      guidanceFailed: "Live guidance verification failed.",
      verificationSummary: "Verification summary",
      query: "Query",
      findingsEyebrow: "Blocker Evidence",
      findingsTitle: "Findings",
      planEyebrow: "Plan",
      planTitle: "Required rescue steps",
      recheck: "Recheck Fields",
      preparePacket: "Prepare Packet",
    },
    packet: {
      title: "Packet Preparation",
      copy: "Review the simulated artifacts generated by the rescue agent.",
      timelineEyebrow: "Orchestration",
      timelineTitle: "Agent timeline",
      readinessEyebrow: "Readiness",
      readinessTitle: "Packet readiness check",
      awaiting: "Awaiting rescue agent results...",
      missingRequirements: "Missing requirements",
      artifactsEyebrow: "Artifacts",
      artifactsTitle: "Generated rescue packet",
      back: "Back to Rescue Path",
      next: "View Final Status",
      ready: "READY",
      escalate: "ESCALATE",
      missingItems: "MISSING ITEMS",
    },
    final: {
      title: "Final Status",
      copy: "Review the rescue result and print a case summary for follow-up.",
      print: "Print Summary",
      outcome: "Rescue outcome",
      nextSteps: "Next steps",
      referenceEyebrow: "Reference File",
      referenceTitle: "Printable rescue summary",
      summaryTitle: "Medicaid notice rescue summary",
      summaryCopy:
        "This summary is generated from fictional or locally pasted text for a frontend demo.",
      noticeSummary: "Notice summary",
      reviewedDetails: "Reviewed details",
      notice: "Notice:",
      deadline: "Deadline:",
      blocker: "Blocker:",
      status: "Status:",
      riskLanguage: "Risk language",
      missingItems: "Missing items",
      readinessChecks: "Readiness checks",
      disclaimer:
        "This prototype interprets notices and prepares next steps. It does not determine Medicaid eligibility, provide legal advice, submit paperwork, contact agencies, store real sensitive information, or replace a human reviewer.",
      back: "Back to Packet",
      restart: "Restart Workflow",
    },
  },
  es: {
    languageLabel: "Idioma",
    appSubtitle: "Agente para avisos de Medicaid",
    nav: {
      intake: "Ingreso",
      analysis: "Analisis del aviso",
      rescuePath: "Ruta de rescate",
      packetPrep: "Paquete",
      finalStatus: "Estado final",
      primary: "Navegacion principal",
    },
    shell: {
      agentStatus: "Estado del agente",
    },
    status: {
      idle: "INACTIVO",
      running: "EJECUTANDO",
      complete: "COMPLETO",
      done: "Listo",
    },
    trace: {
      title: "Rastro de razonamiento del agente",
      awaiting: "Esperando el siguiente paso del flujo...",
      fallback: "Esperando contexto activo del aviso...",
      items: {
        "/dashboard/intake": [
          "Se cargaron paquetes locales de avisos de muestra y el modo de ingreso actual.",
          "Preparando texto del aviso, carta de estado del caso y documentos de verificacion para analizar.",
          "Ningun documento real sale del navegador en este prototipo.",
        ],
        "/dashboard/coverage-analysis": [
          "Extrayendo tipo de aviso, fecha de respuesta, contexto del programa y lenguaje de riesgo.",
          "Clasificando senales de verificacion faltante y fecha limite.",
          "Preparando campos editables antes de ejecutar el agente de rescate.",
        ],
        "/dashboard/rescue-path": [
          "Leyendo texto no estructurado del aviso con reglas locales deterministicas.",
          "Identificando el bloqueo exacto que pone la cobertura en riesgo.",
          "Eligiendo rescate de documentos, rescate de fecha limite, completar renovacion o escalamiento.",
        ],
        "/dashboard/action-execution": [
          "Generando explicacion en lenguaje claro y lista de requisitos faltantes.",
          "Construyendo paquetes simulados de envio y escalamiento.",
          "Revisando si los documentos estan presentes o si hace falta revision humana.",
        ],
        "/dashboard/final-status": [
          "Agregando artefactos de rescate en un resumen imprimible del caso.",
          "Definiendo el estado final del caso desde revisiones de preparacion y escalamiento.",
          "Preparando siguientes pasos para seguimiento fuera de este prototipo.",
        ],
      },
    },
    common: {
      running: "Ejecutando",
      confidence: "CONFIANZA",
      source: "FUENTE",
      sources: "FUENTES",
      verify: "Verificar",
      verifyManually: "Verificar manualmente",
      informationalOnly: "Solo informativo",
      noMissingRequirement: "No queda ningun requisito faltante dirigido en el paquete demo.",
      localExtractionComplete: "Extraccion local completa.",
      extractionPlaceholder: "AAAA-MM-DD",
      familyProgramPlaceholder: "Medicaid familiar, Medicaid para adultos...",
    },
    intake: {
      title: "Ingreso",
      copy:
        "Selecciona un paquete ficticio de aviso de Medicaid o pega texto local del aviso para comenzar el flujo de rescate.",
      sampleTitle: "Paquetes de muestra",
      sampleCopy:
        "Usa avisos ficticios para ver deteccion de bloqueos, revisiones de preparacion y preparacion del paquete.",
      uploadTitle: "Pegar o subir",
      uploadCopy:
        "Pega texto, sube .txt o extrae OCR de un PDF/imagen escaneado localmente en el navegador.",
      demoEyebrow: "Ruta demo",
      choosePacket: "Elige un paquete de aviso",
      sampleCase: "Caso de muestra",
      packetContents: "Contenido del paquete",
      notice: "Aviso",
      supportingDocs: "Docs de apoyo",
      preference: "Preferencia",
      yourNotice: "Tu aviso",
      provideText: "Proporciona texto del aviso de Medicaid",
      pasteText: "Pegar texto",
      pasteTextCopy: "Escribe o pega texto del aviso directamente en el cuadro de revision.",
      uploadTxt: "Subir .txt",
      uploadTxtCopy: "Lee avisos de texto plano localmente para la sesion actual.",
      ocr: "OCR PDF/imagen",
      ocrCopy: "Renderiza PDFs o imagenes en el navegador y extrae texto editable.",
      extractedText: "Texto extraido del aviso",
      noticeContent: "Contenido del aviso",
      ocrReady:
        "El texto OCR esta listo para revisar. Edita cualquier cosa que parezca incorrecta antes de analizar.",
      uploadFile: "Subir archivo del aviso",
      txtFiles: "Los archivos .txt cargan como texto",
      pdfFiles: "PDFs con OCR hasta 5 paginas",
      imageFiles: "Imagenes PNG/JPG con OCR local",
      ocrLocal:
        "El OCR corre en esta pestana del navegador y solo produce texto editable para el flujo demo existente.",
      analyzeNotice: "Analizar aviso",
      placeholder:
        "Pega aqui texto de cierre, renovacion, terminacion, accion requerida o carta de estado de Medicaid.",
    },
    analysis: {
      title: "Analisis del aviso",
      copy:
        "Revisa los campos extraidos del aviso de Medicaid antes de ejecutar el agente de rescate.",
      eyebrow: "Revision de datos",
      sectionTitle: "Confirma los detalles extraidos del aviso",
      noticeType: "Tipo de aviso",
      deadline: "Fecha limite o de respuesta",
      patientName: "Nombre de la persona",
      medicaidProgram: "Programa de Medicaid",
      exactBlocker: "Bloqueo exacto",
      blockerLabel: "Etiqueta del bloqueo",
      urgency: "Urgencia",
      caseStatus: "Estado del caso",
      languagePreference: "Preferencia de idioma",
      communicationPreference: "Preferencia de comunicacion",
      missingRequirements: "Requisitos faltantes",
      riskLanguage: "Lenguaje de riesgo",
      back: "Volver al ingreso",
      run: "Ejecutar agente",
    },
    rescue: {
      title: "Ruta de rescate",
      copy:
        "Ejecuta el agente local de rescate para identificar el bloqueo, urgencia, estado y siguiente accion.",
      readyTitle: "Listo para ejecutar el agente de rescate",
      readyCopy:
        "El agente leera el aviso, clasificara el bloqueo exacto, elegira la ruta de rescate y revisara la preparacion.",
      run: "Ejecutar agente",
      readingTitle: "Leyendo paquete del aviso...",
      readingCopy:
        "Extrayendo fecha limite, lenguaje de riesgo, requisitos faltantes y preparacion.",
      statNoticeType: "Tipo de aviso",
      statNoticeHelper: "Extraido del paquete del aviso",
      statDeadline: "Fecha limite",
      statDeadlineHelper: "Fecha de respuesta para confirmar",
      statBlocker: "Bloqueo",
      statBlockerHelper: "Bloqueo exacto que pone la cobertura en riesgo",
      statStatus: "Estado",
      statStatusHelper: "Estado de preparacion del agente",
      decisionEyebrow: "Decision",
      decisionTitle: "Ruta de rescate identificada",
      nextAction: "Siguiente accion",
      guidanceEyebrow: "Guia en vivo",
      guidanceTitle: "Verificacion web publica",
      guidanceCopy:
        "TinyFish revisa fuentes publicas recientes para guia relacionada con el bloqueo, requisitos faltantes, fechas limite y ruta de escalamiento.",
      refreshGuidance: "Actualizar guia",
      verifyGuidance: "Verificar guia",
      searching:
        "Buscando guia en la web publica y extrayendo las fuentes mas fuertes...",
      guidanceFailed: "La verificacion de guia en vivo fallo.",
      verificationSummary: "Resumen de verificacion",
      query: "Consulta",
      findingsEyebrow: "Evidencia del bloqueo",
      findingsTitle: "Hallazgos",
      planEyebrow: "Plan",
      planTitle: "Pasos de rescate requeridos",
      recheck: "Revisar campos",
      preparePacket: "Preparar paquete",
    },
    packet: {
      title: "Preparacion del paquete",
      copy: "Revisa los artefactos simulados generados por el agente de rescate.",
      timelineEyebrow: "Orquestacion",
      timelineTitle: "Linea de tiempo del agente",
      readinessEyebrow: "Preparacion",
      readinessTitle: "Revision de preparacion del paquete",
      awaiting: "Esperando resultados del agente de rescate...",
      missingRequirements: "Requisitos faltantes",
      artifactsEyebrow: "Artefactos",
      artifactsTitle: "Paquete de rescate generado",
      back: "Volver a ruta de rescate",
      next: "Ver estado final",
      ready: "LISTO",
      escalate: "ESCALAR",
      missingItems: "FALTAN ITEMS",
    },
    final: {
      title: "Estado final",
      copy: "Revisa el resultado del rescate e imprime un resumen del caso para seguimiento.",
      print: "Imprimir resumen",
      outcome: "Resultado del rescate",
      nextSteps: "Siguientes pasos",
      referenceEyebrow: "Archivo de referencia",
      referenceTitle: "Resumen imprimible de rescate",
      summaryTitle: "Resumen de rescate del aviso de Medicaid",
      summaryCopy:
        "Este resumen se genera desde texto ficticio o pegado localmente para una demo frontend.",
      noticeSummary: "Resumen del aviso",
      reviewedDetails: "Detalles revisados",
      notice: "Aviso:",
      deadline: "Fecha limite:",
      blocker: "Bloqueo:",
      status: "Estado:",
      riskLanguage: "Lenguaje de riesgo",
      missingItems: "Items faltantes",
      readinessChecks: "Revisiones de preparacion",
      disclaimer:
        "Este prototipo interpreta avisos y prepara siguientes pasos. No determina elegibilidad de Medicaid, no da asesoria legal, no envia papeleo, no contacta agencias, no guarda informacion sensible real ni reemplaza una revision humana.",
      back: "Volver al paquete",
      restart: "Reiniciar flujo",
    },
  },
} as const;

export function noticeTypeLabel(language: AppLanguage, value: NoticeType) {
  const labels: Record<AppLanguage, Record<NoticeType, string>> = {
    en: {
      closure: "Closure",
      renewal: "Renewal",
      termination: "Termination",
      action_required: "Action required",
      case_status: "Case status",
      uploaded_text: "Uploaded text",
    },
    es: {
      closure: "Cierre",
      renewal: "Renovacion",
      termination: "Terminacion",
      action_required: "Accion requerida",
      case_status: "Estado del caso",
      uploaded_text: "Texto subido",
    },
  };

  return labels[language][value];
}

export function blockerTypeLabel(language: AppLanguage, value: BlockerType) {
  const labels: Record<AppLanguage, Record<BlockerType, string>> = {
    en: {
      missing_income_proof: "Missing proof of income",
      missing_residency_proof: "Missing proof of residency",
      incomplete_renewal: "Incomplete renewal paperwork",
      eligibility_inconsistency: "Eligibility inconsistency",
      missed_deadline: "Missed deadline",
      upcoming_deadline: "Upcoming deadline",
      manual_review: "Manual review",
    },
    es: {
      missing_income_proof: "Falta prueba de ingresos",
      missing_residency_proof: "Falta prueba de residencia",
      incomplete_renewal: "Renovacion incompleta",
      eligibility_inconsistency: "Inconsistencia de elegibilidad",
      missed_deadline: "Fecha limite vencida",
      upcoming_deadline: "Fecha limite proxima",
      manual_review: "Revision manual",
    },
  };

  return labels[language][value];
}

export function urgencyLabel(language: AppLanguage, value: UrgencyLevel) {
  const labels: Record<AppLanguage, Record<UrgencyLevel, string>> = {
    en: {
      routine: "Routine",
      soon: "Soon",
      urgent: "Urgent",
      overdue: "Overdue",
    },
    es: {
      routine: "Rutina",
      soon: "Pronto",
      urgent: "Urgente",
      overdue: "Vencido",
    },
  };

  return labels[language][value];
}

export function caseStatusLabel(language: AppLanguage, value: CaseStatus) {
  const labels: Record<AppLanguage, Record<CaseStatus, string>> = {
    en: {
      notice_received: "Notice received",
      blocker_identified: "Blocker identified",
      awaiting_documents: "Awaiting documents",
      ready_to_submit: "Ready to submit",
      escalation_needed: "Escalation needed",
      rescue_in_progress: "Rescue in progress",
      resolved: "Resolved",
    },
    es: {
      notice_received: "Aviso recibido",
      blocker_identified: "Bloqueo identificado",
      awaiting_documents: "Esperando documentos",
      ready_to_submit: "Listo para enviar",
      escalation_needed: "Escalamiento necesario",
      rescue_in_progress: "Rescate en progreso",
      resolved: "Resuelto",
    },
  };

  return labels[language][value];
}

export function sourceKindLabel(language: AppLanguage, value: DocumentSourceKind) {
  const labels: Record<AppLanguage, Record<DocumentSourceKind, string>> = {
    en: {
      sample: "sample",
      pasted: "pasted",
      txt_upload: "txt upload",
      pdf_ocr: "pdf ocr",
      image_ocr: "image ocr",
    },
    es: {
      sample: "muestra",
      pasted: "pegado",
      txt_upload: "subida txt",
      pdf_ocr: "ocr pdf",
      image_ocr: "ocr imagen",
    },
  };

  return labels[language][value];
}

export function finalStatusHeadline(language: AppLanguage, value: CaseStatus) {
  if (value === "ready_to_submit") {
    return language === "es" ? "Listo para enviar" : "Ready to submit";
  }
  if (value === "escalation_needed") {
    return language === "es" ? "Escalamiento necesario" : "Escalation needed";
  }

  return language === "es" ? "Esperando documentos" : "Awaiting documents";
}
