import type {
  BlockerAssessment,
  CaseStatus,
  ParsedNotice,
  ReadinessCheck,
  RescuePath,
  UrgencyLevel,
} from "@/lib/types";
import type { AppLanguage } from "@/lib/i18n/types";

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

export function daysUntil(dateValue: string, now = new Date()) {
  const dueDate = new Date(`${dateValue}T12:00:00`);

  if (Number.isNaN(dueDate.getTime())) {
    return undefined;
  }

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const due = new Date(
    dueDate.getFullYear(),
    dueDate.getMonth(),
    dueDate.getDate(),
  );

  return Math.ceil((due.getTime() - today.getTime()) / MILLISECONDS_PER_DAY);
}

function statusFor(parsedNotice: ParsedNotice, days?: number): CaseStatus {
  if (
    parsedNotice.blockerType === "missed_deadline" ||
    parsedNotice.blockerType === "eligibility_inconsistency" ||
    parsedNotice.blockerType === "manual_review" ||
    (days !== undefined && days < 0)
  ) {
    return "escalation_needed";
  }

  if (parsedNotice.missingRequirements.length > 0) {
    return "awaiting_documents";
  }

  return "ready_to_submit";
}

function urgencyFor(parsedNotice: ParsedNotice, days?: number): UrgencyLevel {
  if (days !== undefined && days < 0) return "overdue";
  if (days !== undefined && days <= 7) return "urgent";
  if (days !== undefined && days <= 21) return "soon";
  return parsedNotice.urgency;
}

export function assessBlocker(
  parsedNotice: ParsedNotice,
  language: AppLanguage = "en",
): BlockerAssessment {
  const calculatedDays = parsedNotice.deadlineDate
    ? daysUntil(parsedNotice.deadlineDate)
    : undefined;
  const urgency = urgencyFor(parsedNotice, calculatedDays);
  const caseStatus = statusFor(parsedNotice, calculatedDays);
  const escalationRecommended = caseStatus === "escalation_needed";
  const canSelfResolve =
    !escalationRecommended &&
    (parsedNotice.blockerType === "missing_income_proof" ||
      parsedNotice.blockerType === "missing_residency_proof" ||
      parsedNotice.blockerType === "incomplete_renewal");
  const findings: string[] = [];

  if (calculatedDays === undefined) {
    findings.push(
      language === "es"
        ? "No se encontro una fecha limite confiable; confirma la fecha en el aviso original."
        : "No reliable deadline was found; confirm the date on the original notice.",
    );
  } else if (calculatedDays < 0) {
    findings.push(
      language === "es"
        ? `La fecha limite indicada parece haber pasado hace ${Math.abs(calculatedDays)} dia${Math.abs(calculatedDays) === 1 ? "" : "s"}.`
        : `The listed deadline appears to have passed ${Math.abs(calculatedDays)} day${Math.abs(calculatedDays) === 1 ? "" : "s"} ago.`,
    );
  } else if (calculatedDays <= 7) {
    findings.push(
      language === "es"
        ? `La fecha limite indicada es en ${calculatedDays} dia${calculatedDays === 1 ? "" : "s"}.`
        : `The listed deadline is in ${calculatedDays} day${calculatedDays === 1 ? "" : "s"}.`,
    );
  } else {
    findings.push(
      language === "es"
        ? `La fecha limite indicada es en ${calculatedDays} dia${calculatedDays === 1 ? "" : "s"}.`
        : `The listed deadline is in ${calculatedDays} day${calculatedDays === 1 ? "" : "s"}.`,
    );
  }

  if (parsedNotice.missingRequirements.length > 0) {
    findings.push(
      language === "es"
        ? `Requisito faltante identificado: ${parsedNotice.missingRequirements.join(", ")}.`
        : `Missing requirement identified: ${parsedNotice.missingRequirements.join(", ")}.`,
    );
  }

  if (parsedNotice.riskLanguage.length > 0) {
    findings.push(
      language === "es"
        ? `Lenguaje de riesgo detectado: ${parsedNotice.riskLanguage.join(", ")}.`
        : `Risk language detected: ${parsedNotice.riskLanguage.join(", ")}.`,
    );
  }

  if (parsedNotice.extractionConfidence === "low") {
    findings.push(
      language === "es"
        ? "La confianza de extraccion es baja; una persona debe verificar el aviso antes de actuar."
        : "Extraction confidence is low; a human should verify the notice before acting.",
    );
  }

  const nextAction = escalationRecommended
    ? language === "es"
      ? "Prepara el paquete de escalamiento para una persona navegadora, defensora o trabajadora de caso."
      : "Prepare the escalation packet for a navigator, advocate, or case worker."
    : parsedNotice.missingRequirements.length > 0
      ? language === "es"
        ? `Reune ${parsedNotice.missingRequirements[0]} y adjuntalo a la respuesta de renovacion.`
        : `Gather ${parsedNotice.missingRequirements[0]} and attach it to the renewal response.`
      : language === "es"
        ? "Revisa el paquete y preparalo para el envio."
        : "Review the packet and prepare it for submission.";

  return {
    blockerType: parsedNotice.blockerType,
    label: parsedNotice.blockerLabel,
    urgency,
    daysUntilDeadline: calculatedDays,
    caseStatus,
    canSelfResolve,
    escalationRecommended,
    findings,
    nextAction,
  };
}

export function determineRescuePath(
  parsedNotice: ParsedNotice,
  assessment: BlockerAssessment,
  language: AppLanguage = "en",
): RescuePath {
  const escalationTriggers: string[] = [];

  if (assessment.escalationRecommended) {
    escalationTriggers.push(
      language === "es"
        ? "El problema esta en conflicto, no es claro o paso la fecha limite."
        : "Issue is conflicting, unclear, or past deadline.",
    );
  }
  if (parsedNotice.extractionConfidence === "low") {
    escalationTriggers.push(
      language === "es"
        ? "Campos importantes del aviso no pudieron extraerse con confianza."
        : "Important notice fields could not be extracted with confidence.",
    );
  }
  if (assessment.urgency === "urgent" || assessment.urgency === "overdue") {
    escalationTriggers.push(
      language === "es"
        ? "La fecha limite es urgente o pudo haber pasado."
        : "Deadline is urgent or may have passed.",
    );
  }

  if (assessment.escalationRecommended) {
    return {
      pathType: "escalation",
      status: "escalation_needed",
      summary:
        language === "es"
          ? "Este caso debe enviarse a una persona navegadora, defensora o trabajadora de caso antes de que la persona dependa de pasos de autoservicio."
          : "This case should be routed to a navigator, advocate, or case worker before the patient relies on self-service steps.",
      steps:
        language === "es"
          ? [
              "Prepara un resumen corto del problema con el tipo de aviso, fecha limite y detalles en conflicto o vencidos.",
              "Adjunta el aviso y cualquier verificacion ya disponible.",
              "Pregunta a la persona revisora si apelacion, reinstalacion o correccion manual es la ruta correcta.",
            ]
          : [
              "Prepare a short issue summary with the notice type, deadline, and conflicting or overdue details.",
              "Attach the notice and any verification already available.",
              "Ask the human reviewer whether appeal, reinstatement, or manual correction is the right path.",
            ],
      missingItems: parsedNotice.missingRequirements,
      escalationTriggers,
    };
  }

  if (parsedNotice.blockerType === "incomplete_renewal") {
    return {
      pathType: "renewal_completion",
      status: "awaiting_documents",
      summary:
        language === "es"
          ? "La ruta de rescate es completar el paquete de renovacion y enviar las secciones faltantes antes de la fecha limite."
          : "The rescue path is to complete the renewal packet and submit the missing sections before the deadline.",
      steps:
        language === "es"
          ? [
              "Completa cada seccion en blanco del formulario de renovacion.",
              "Adjunta los documentos de verificacion solicitados.",
              "Guarda una copia del paquete y de la confirmacion de envio.",
            ]
          : [
              "Complete every blank renewal form section.",
              "Attach the requested verification documents.",
              "Keep a copy of the packet and submission confirmation.",
            ],
      missingItems: parsedNotice.missingRequirements,
      escalationTriggers,
    };
  }

  return {
    pathType: assessment.urgency === "urgent" ? "deadline_rescue" : "document_rescue",
    status: parsedNotice.missingRequirements.length > 0 ? "awaiting_documents" : "ready_to_submit",
    summary:
      language === "es"
        ? "La ruta de rescate es reunir el item faltante indicado y preparar el paquete de respuesta."
        : "The rescue path is to gather the targeted missing item and prepare the response packet.",
    steps:
      language === "es"
        ? [
            "Reune la verificacion faltante exacta indicada en el aviso.",
            "Relaciona el documento con el numero de caso de Medicaid o el nombre de la persona.",
            "Envia por el canal apropiado mostrado en el aviso y guarda la confirmacion.",
          ]
        : [
            "Gather the exact missing verification listed in the notice.",
            "Match the document to the Medicaid case number or patient name.",
            "Submit through the appropriate channel shown on the notice and save confirmation.",
          ],
    missingItems: parsedNotice.missingRequirements,
    escalationTriggers,
  };
}

export function verifyReadiness(
  parsedNotice: ParsedNotice,
  rescuePath: RescuePath,
  language: AppLanguage = "en",
): ReadinessCheck {
  const normalizedProvided = parsedNotice.providedDocuments.join(" ").toLowerCase();
  const missingDocuments = rescuePath.missingItems.filter((item) => {
    const normalizedItem = item.toLowerCase();
    return !normalizedProvided.includes(normalizedItem) &&
      !(/income|ingresos/.test(normalizedItem) && /income|pay stub|wage|earnings/.test(normalizedProvided)) &&
      !(/residency|residencia/.test(normalizedItem) && /residency|utility|lease|address/.test(normalizedProvided));
  });
  const shouldEscalate = rescuePath.status === "escalation_needed";
  const readyToSubmit = !shouldEscalate && missingDocuments.length === 0;
  const status: CaseStatus = shouldEscalate
    ? "escalation_needed"
    : readyToSubmit
      ? "ready_to_submit"
      : "awaiting_documents";

  return {
    readyToSubmit,
    shouldEscalate,
    presentDocuments: parsedNotice.providedDocuments,
    missingDocuments,
    status,
    checks: [
      parsedNotice.deadlineDate
        ? language === "es"
          ? `Fecha limite capturada: ${parsedNotice.deadlineDate}.`
          : `Deadline captured: ${parsedNotice.deadlineDate}.`
        : language === "es"
          ? "La fecha limite necesita confirmacion humana."
          : "Deadline needs human confirmation.",
      parsedNotice.blockerLabel
        ? language === "es"
          ? `Bloqueo capturado: ${parsedNotice.blockerLabel}.`
          : `Blocker captured: ${parsedNotice.blockerLabel}.`
        : language === "es"
          ? "El bloqueo necesita confirmacion humana."
          : "Blocker needs human confirmation.",
      readyToSubmit
        ? language === "es"
          ? "Todos los documentos requeridos parecen estar presentes en el paquete demo."
          : "All required documents appear present in the demo packet."
        : shouldEscalate
          ? language === "es"
            ? "El caso debe escalarse antes del envio."
            : "Case should be escalated before submission."
          : language === "es"
            ? "Todavia falta al menos un documento requerido."
            : "At least one required document is still missing.",
    ],
  };
}
