import type {
  BlockerAssessment,
  ParsedNotice,
  ReadinessCheck,
  RescueArtifact,
  RescuePath,
} from "@/lib/types";
import type { AppLanguage } from "@/lib/i18n/types";

function now() {
  return new Date().toISOString();
}

function formatList(items: string[], language: AppLanguage) {
  if (items.length > 0) return items.join(", ");
  return language === "es" ? "Ninguno identificado" : "None identified";
}

export function generateRescueArtifacts(
  parsedNotice: ParsedNotice,
  assessment: BlockerAssessment,
  rescuePath: RescuePath,
  readiness: ReadinessCheck,
  language: AppLanguage = "en",
): RescueArtifact[] {
  const deadlineCopy =
    parsedNotice.deadlineDate ??
    (language === "es"
      ? "la fecha limite mostrada en el aviso original"
      : "the deadline shown on the original notice");
  const missingCopy = formatList(readiness.missingDocuments, language);
  const escalationCopy = rescuePath.escalationTriggers.length > 0
    ? rescuePath.escalationTriggers.join(" ")
    : language === "es"
      ? "No se detecto ningun disparador de escalamiento en las reglas locales de la demo."
      : "No escalation trigger was detected in the local demo rules.";

  return [
    {
      id: "plain-language-explanation",
      label: language === "es" ? "Explicacion del aviso en lenguaje claro" : "Plain-English notice explanation",
      kind: "plain_language_explanation",
      status: "generated",
      timestamp: now(),
      summary:
        language === "es"
          ? "Explico el aviso en lenguaje para la persona."
          : "Explained the notice in patient-facing language.",
      content: parsedNotice.issueExplanation,
      details: [
        `${language === "es" ? "Tipo de aviso" : "Notice type"}: ${parsedNotice.noticeType.replaceAll("_", " ")}`,
        `${language === "es" ? "Fecha limite" : "Deadline"}: ${deadlineCopy}`,
        `${language === "es" ? "Bloqueo" : "Blocker"}: ${assessment.label}`,
      ],
    },
    {
      id: "missing-requirements",
      label: language === "es" ? "Lista de requisitos faltantes" : "Missing requirements checklist",
      kind: "missing_requirements",
      status: readiness.readyToSubmit ? "generated" : "simulated",
      timestamp: now(),
      summary: readiness.readyToSubmit
        ? language === "es"
          ? "No queda ningun documento faltante en el paquete demo."
          : "No missing document remains in the demo packet."
        : language === "es"
          ? `Item faltante aun necesario: ${missingCopy}.`
          : `Missing item still needed: ${missingCopy}.`,
      content: readiness.readyToSubmit
        ? language === "es"
          ? "El paquete parece listo para revision de envio simulado."
          : "The packet appears ready for simulated submission review."
        : language === "es"
          ? `Reune o sube: ${missingCopy}. Relaciona el documento con el nombre de la persona o el numero de caso antes del envio.`
          : `Gather or upload: ${missingCopy}. Match the document to the patient name or case number before submission.`,
      details: readiness.missingDocuments.length > 0
        ? readiness.missingDocuments
        : [
            language === "es"
              ? "Todos los requisitos dirigidos parecen estar presentes."
              : "All targeted requirements appear present.",
          ],
    },
    {
      id: "submission-packet",
      label: language === "es" ? "Paquete de envio simulado" : "Simulated submission packet",
      kind: "submission_packet",
      status: readiness.shouldEscalate ? "blocked" : "simulated",
      timestamp: now(),
      summary: readiness.shouldEscalate
        ? language === "es"
          ? "Paquete de envio pausado porque se recomienda escalamiento."
          : "Submission packet paused because escalation is recommended."
        : language === "es"
          ? "Preparo una lista simulada del paquete para la respuesta de Medicaid."
          : "Prepared a simulated packet checklist for the Medicaid response.",
      content: [
        `${language === "es" ? "Persona" : "Patient"}: ${parsedNotice.patientName ?? (language === "es" ? "Desconocida" : "Unknown")}`,
        `${language === "es" ? "Programa" : "Program"}: ${parsedNotice.medicaidProgram ?? (language === "es" ? "Programa de Medicaid no especificado" : "Medicaid program not specified")}`,
        `${language === "es" ? "Fecha limite de respuesta" : "Response deadline"}: ${deadlineCopy}`,
        `${language === "es" ? "Documentos incluidos" : "Included documents"}: ${formatList(readiness.presentDocuments, language)}`,
        `${language === "es" ? "Aun falta" : "Still missing"}: ${missingCopy}`,
      ].join("\n"),
      details: rescuePath.steps,
    },
    {
      id: "escalation-packet",
      label: language === "es" ? "Paquete de escalamiento para navegador" : "Navigator escalation packet",
      kind: "escalation_packet",
      status: readiness.shouldEscalate ? "simulated" : "generated",
      timestamp: now(),
      summary: readiness.shouldEscalate
        ? language === "es"
          ? "Preparo un traspaso estructurado para revision humana."
          : "Prepared a structured handoff for human review."
        : language === "es"
          ? "Preparo una alternativa de escalamiento si el paquete no se envia a tiempo."
          : "Prepared an escalation fallback if the packet is not submitted in time.",
      content: [
        `${language === "es" ? "Razon de escalamiento" : "Escalation reason"}: ${escalationCopy}`,
        `${language === "es" ? "Bloqueo exacto" : "Exact blocker"}: ${assessment.label}`,
        `${language === "es" ? "Siguiente accion recomendada" : "Recommended next action"}: ${assessment.nextAction}`,
      ].join("\n"),
      details:
        language === "es"
          ? [
              "Incluye el aviso original.",
              "Incluye cualquier documento ya reunido.",
              "Pide a la persona revisora confirmar si aplica envio, apelacion, reinstalacion o correccion manual.",
            ]
          : [
              "Include the original notice.",
              "Include any documents already gathered.",
              "Ask the reviewer to confirm whether submission, appeal, reinstatement, or manual correction applies.",
            ],
    },
    {
      id: "outreach-message",
      label: language === "es" ? "Recordatorios y mensajes de contacto" : "Reminder and outreach messages",
      kind: "outreach_message",
      status: "generated",
      timestamp: now(),
      summary:
        language === "es"
          ? "Redacto lenguaje de recordatorio para la preferencia de comunicacion seleccionada."
          : "Drafted patient reminder language for the selected communication preference.",
      content:
        language === "es"
          ? `Recordatorio: Tu aviso de Medicaid necesita accion antes de ${deadlineCopy}. El bloqueo es ${assessment.label.toLowerCase()}. Siguiente paso: ${assessment.nextAction}`
          : `Reminder: Your Medicaid notice needs action by ${deadlineCopy}. The blocker is ${assessment.label.toLowerCase()}. Next step: ${assessment.nextAction}`,
      details: [
        `${language === "es" ? "Idioma preferido" : "Preferred language"}: ${parsedNotice.languagePreference ?? (language === "es" ? "Espanol" : "English")}`,
        `${language === "es" ? "Contacto preferido" : "Preferred contact"}: ${parsedNotice.contactMethod ?? "SMS"}`,
      ],
    },
  ];
}

export function generatePatientInstructions(
  parsedNotice: ParsedNotice,
  assessment: BlockerAssessment,
  readiness: ReadinessCheck,
  language: AppLanguage = "en",
) {
  const instructions = [
    assessment.nextAction,
    parsedNotice.deadlineDate
      ? language === "es"
        ? `Actua antes de ${parsedNotice.deadlineDate}; guarda el aviso y cualquier numero de confirmacion.`
        : `Work before ${parsedNotice.deadlineDate}; keep the notice and any confirmation number.`
      : language === "es"
        ? "Confirma la fecha limite de respuesta antes de depender de este plan de rescate."
        : "Confirm the response deadline before relying on this rescue plan.",
  ];

  if (readiness.missingDocuments.length > 0) {
    instructions.push(
      language === "es"
        ? `Reune: ${readiness.missingDocuments.join(", ")}.`
        : `Gather: ${readiness.missingDocuments.join(", ")}.`,
    );
  }

  if (readiness.shouldEscalate) {
    instructions.push(
      language === "es"
        ? "Pide a una persona navegadora, defensora o trabajadora de caso que revise el aviso antes del envio."
        : "Ask a navigator, advocate, or case worker to review the notice before submission.",
    );
  }

  instructions.push(
    language === "es"
      ? "Este prototipo explica y prepara una respuesta al aviso; no determina elegibilidad de Medicaid ni envia papeleo."
      : "This prototype explains and prepares a notice response; it does not determine Medicaid eligibility or submit paperwork.",
  );

  return instructions;
}
