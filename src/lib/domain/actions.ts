import type {
  BlockerAssessment,
  ParsedNotice,
  ReadinessCheck,
  RescueArtifact,
  RescuePath,
} from "@/lib/types";
import { copyLanguage, type AppLanguage, type CopyLanguage } from "@/lib/i18n/types";

function now() {
  return new Date().toISOString();
}

function localized(language: AppLanguage, copy: Record<CopyLanguage, string>) {
  return copy[copyLanguage(language)];
}

function formatList(items: string[], language: AppLanguage) {
  if (items.length > 0) return items.join(", ");
  return localized(language, {
    en: "None identified",
    es: "Ninguno identificado",
    so: "Wax la aqoonsaday ma jiro",
  });
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
    localized(language, {
      en: "the deadline shown on the original notice",
      es: "la fecha limite mostrada en el aviso original",
      so: "waqtiga kama dambaysta ah ee ku qoran ogeysiiska asalka ah",
    });
  const missingCopy = formatList(readiness.missingDocuments, language);
  const escalationCopy = rescuePath.escalationTriggers.length > 0
    ? rescuePath.escalationTriggers.join(" ")
    : localized(language, {
        en: "No escalation trigger was detected in the local demo rules.",
        es: "No se detecto ningun disparador de escalamiento en las reglas locales de la demo.",
        so: "Wax kiciya kor-u-qaadis lagama helin xeerarka gudaha ee demo-ga.",
      });

  return [
    {
      id: "plain-language-explanation",
      label: localized(language, {
        en: "Plain-English notice explanation",
        es: "Explicacion del aviso en lenguaje claro",
        so: "Sharaxaad ogeysiis oo luqad cad ah",
      }),
      kind: "plain_language_explanation",
      status: "generated",
      timestamp: now(),
      summary:
        localized(language, {
          en: "Explained the notice in patient-facing language.",
          es: "Explico el aviso en lenguaje para la persona.",
          so: "Ogeysiiska waxaa lagu sharxay luqad qofku fahmi karo.",
        }),
      content: parsedNotice.issueExplanation,
      details: [
        `${localized(language, { en: "Notice type", es: "Tipo de aviso", so: "Nooca ogeysiiska" })}: ${parsedNotice.noticeType.replaceAll("_", " ")}`,
        `${localized(language, { en: "Deadline", es: "Fecha limite", so: "Waqti kama dambays ah" })}: ${deadlineCopy}`,
        `${localized(language, { en: "Blocker", es: "Bloqueo", so: "Xannibaad" })}: ${assessment.label}`,
      ],
    },
    {
      id: "missing-requirements",
      label: localized(language, {
        en: "Missing requirements checklist",
        es: "Lista de requisitos faltantes",
        so: "Liiska hubinta shuruudaha maqan",
      }),
      kind: "missing_requirements",
      status: readiness.readyToSubmit ? "generated" : "simulated",
      timestamp: now(),
      summary: readiness.readyToSubmit
        ? localized(language, {
            en: "No missing document remains in the demo packet.",
            es: "No queda ningun documento faltante en el paquete demo.",
            so: "Dukumiinti maqan kuma harin xirmada demo-ga.",
          })
        : localized(language, {
            en: `Missing item still needed: ${missingCopy}.`,
            es: `Item faltante aun necesario: ${missingCopy}.`,
            so: `Shay maqan oo weli loo baahan yahay: ${missingCopy}.`,
          }),
      content: readiness.readyToSubmit
        ? localized(language, {
            en: "The packet appears ready for simulated submission review.",
            es: "El paquete parece listo para revision de envio simulado.",
            so: "Xirmadu waxay u muuqataa inay diyaar u tahay dib-u-eegis gudbin oo la matalay.",
          })
        : localized(language, {
            en: `Gather or upload: ${missingCopy}. Match the document to the patient name or case number before submission.`,
            es: `Reune o sube: ${missingCopy}. Relaciona el documento con el nombre de la persona o el numero de caso antes del envio.`,
            so: `Ururi ama rar: ${missingCopy}. Ku xir dukumiintiga magaca qofka ama lambarka kiiska ka hor gudbinta.`,
          }),
      details: readiness.missingDocuments.length > 0
        ? readiness.missingDocuments
        : [
            localized(language, {
              en: "All targeted requirements appear present.",
              es: "Todos los requisitos dirigidos parecen estar presentes.",
              so: "Dhammaan shuruudaha la beegsaday waxay u muuqdaan inay jiraan.",
            }),
          ],
    },
    {
      id: "submission-packet",
      label: localized(language, {
        en: "Simulated submission packet",
        es: "Paquete de envio simulado",
        so: "Xirmo gudbin oo la matalay",
      }),
      kind: "submission_packet",
      status: readiness.shouldEscalate ? "blocked" : "simulated",
      timestamp: now(),
      summary: readiness.shouldEscalate
        ? localized(language, {
            en: "Submission packet paused because escalation is recommended.",
            es: "Paquete de envio pausado porque se recomienda escalamiento.",
            so: "Xirmada gudbinta waa la hakiyay sababtoo ah kor-u-qaadis ayaa lagu taliyay.",
          })
        : localized(language, {
            en: "Prepared a simulated packet checklist for the Medicaid response.",
            es: "Preparo una lista simulada del paquete para la respuesta de Medicaid.",
            so: "Waxaa la diyaariyay liis hubin xirmo oo la matalay oo loogu jawaabayo Medicaid.",
          }),
      content: [
        `${localized(language, { en: "Patient", es: "Persona", so: "Qof" })}: ${parsedNotice.patientName ?? localized(language, { en: "Unknown", es: "Desconocida", so: "Lama yaqaan" })}`,
        `${localized(language, { en: "Program", es: "Programa", so: "Barnaamij" })}: ${parsedNotice.medicaidProgram ?? localized(language, { en: "Medicaid program not specified", es: "Programa de Medicaid no especificado", so: "Barnaamijka Medicaid lama cayimin" })}`,
        `${localized(language, { en: "Response deadline", es: "Fecha limite de respuesta", so: "Waqtiga kama dambaysta ah ee jawaabta" })}: ${deadlineCopy}`,
        `${localized(language, { en: "Included documents", es: "Documentos incluidos", so: "Dukumiintiyada ku jira" })}: ${formatList(readiness.presentDocuments, language)}`,
        `${localized(language, { en: "Still missing", es: "Aun falta", so: "Weli maqan" })}: ${missingCopy}`,
      ].join("\n"),
      details: rescuePath.steps,
    },
    {
      id: "escalation-packet",
      label: localized(language, {
        en: "Navigator escalation packet",
        es: "Paquete de escalamiento para navegador",
        so: "Xirmada kor-u-qaadista ee hagaha",
      }),
      kind: "escalation_packet",
      status: readiness.shouldEscalate ? "simulated" : "generated",
      timestamp: now(),
      summary: readiness.shouldEscalate
        ? localized(language, {
            en: "Prepared a structured handoff for human review.",
            es: "Preparo un traspaso estructurado para revision humana.",
            so: "Waxaa la diyaariyay wareejin habaysan oo dib-u-eegis bini'aadan ah.",
          })
        : localized(language, {
            en: "Prepared an escalation fallback if the packet is not submitted in time.",
            es: "Preparo una alternativa de escalamiento si el paquete no se envia a tiempo.",
            so: "Waxaa la diyaariyay qorshe kor-u-qaadis haddii xirmada aan waqtigeeda la gudbin.",
          }),
      content: [
        `${localized(language, { en: "Escalation reason", es: "Razon de escalamiento", so: "Sababta kor-u-qaadista" })}: ${escalationCopy}`,
        `${localized(language, { en: "Exact blocker", es: "Bloqueo exacto", so: "Xannibaadda saxda ah" })}: ${assessment.label}`,
        `${localized(language, { en: "Recommended next action", es: "Siguiente accion recomendada", so: "Tallaabada xigta ee lagu taliyay" })}: ${assessment.nextAction}`,
      ].join("\n"),
      details:
        language === "so"
          ? [
              "Ku dar ogeysiiska asalka ah.",
              "Ku dar dukumiinti kasta oo hore loo ururiyay.",
              "Weydii qofka dib-u-eegaya inuu xaqiijiyo in gudbin, racfaan, dib-u-soo-celin, ama sixid gacanta ah ay khuseyso.",
            ]
          : language === "es"
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
      label: localized(language, {
        en: "Reminder and outreach messages",
        es: "Recordatorios y mensajes de contacto",
        so: "Xasuusinno iyo farriimo xiriir",
      }),
      kind: "outreach_message",
      status: "generated",
      timestamp: now(),
      summary:
        localized(language, {
          en: "Drafted patient reminder language for the selected communication preference.",
          es: "Redacto lenguaje de recordatorio para la preferencia de comunicacion seleccionada.",
          so: "Waxaa la diyaariyay farriin xasuusin ah oo ku habboon doorbidka xiriirka ee la doortay.",
        }),
      content:
        language === "so"
          ? `Xasuusin: Ogeysiiskaaga Medicaid wuxuu u baahan yahay ficil ka hor ${deadlineCopy}. Xannibaaddu waa ${assessment.label.toLowerCase()}. Tallaabada xigta: ${assessment.nextAction}`
          : language === "es"
          ? `Recordatorio: Tu aviso de Medicaid necesita accion antes de ${deadlineCopy}. El bloqueo es ${assessment.label.toLowerCase()}. Siguiente paso: ${assessment.nextAction}`
          : `Reminder: Your Medicaid notice needs action by ${deadlineCopy}. The blocker is ${assessment.label.toLowerCase()}. Next step: ${assessment.nextAction}`,
      details: [
        `${localized(language, { en: "Preferred language", es: "Idioma preferido", so: "Luqadda la doorbiday" })}: ${parsedNotice.languagePreference ?? localized(language, { en: "English", es: "Espanol", so: "Soomaali" })}`,
        `${localized(language, { en: "Preferred contact", es: "Contacto preferido", so: "Xiriirka la doorbiday" })}: ${parsedNotice.contactMethod ?? "SMS"}`,
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
      ? language === "so"
        ? `Shaqee ka hor ${parsedNotice.deadlineDate}; kaydi ogeysiiska iyo lambar kasta oo xaqiijin ah.`
        : language === "es"
        ? `Actua antes de ${parsedNotice.deadlineDate}; guarda el aviso y cualquier numero de confirmacion.`
        : `Work before ${parsedNotice.deadlineDate}; keep the notice and any confirmation number.`
      : language === "so"
        ? "Xaqiiji waqtiga kama dambaysta ah ee jawaabta ka hor intaadan ku tiirsanaan qorshahan badbaadinta."
        : language === "es"
        ? "Confirma la fecha limite de respuesta antes de depender de este plan de rescate."
        : "Confirm the response deadline before relying on this rescue plan.",
  ];

  if (readiness.missingDocuments.length > 0) {
    instructions.push(
      language === "so"
        ? `Ururi: ${readiness.missingDocuments.join(", ")}.`
        : language === "es"
        ? `Reune: ${readiness.missingDocuments.join(", ")}.`
        : `Gather: ${readiness.missingDocuments.join(", ")}.`,
    );
  }

  if (readiness.shouldEscalate) {
    instructions.push(
      language === "so"
        ? "Ka codso hage, u-doodaha, ama shaqaale kiis inuu eego ogeysiiska ka hor gudbinta."
        : language === "es"
        ? "Pide a una persona navegadora, defensora o trabajadora de caso que revise el aviso antes del envio."
        : "Ask a navigator, advocate, or case worker to review the notice before submission.",
    );
  }

  instructions.push(
    language === "so"
      ? "Noocan tijaabada ah wuxuu sharxayaa oo diyaariyaa jawaab ogeysiis; ma go'aamiyo u-qalmitaanka Medicaid mana gudbiyo waraaqo."
      : language === "es"
      ? "Este prototipo explica y prepara una respuesta al aviso; no determina elegibilidad de Medicaid ni envia papeleo."
      : "This prototype explains and prepares a notice response; it does not determine Medicaid eligibility or submit paperwork.",
  );

  return instructions;
}
