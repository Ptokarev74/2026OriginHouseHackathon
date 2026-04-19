import type { AppLanguage } from "@/lib/i18n/types";

export const landingContent: Record<
  AppLanguage,
  {
    header: {
      homeLabel: string;
      subtitle: string;
      nav: Array<{ href: string; label: string }>;
      startDemo: string;
    };
    hero: {
      title: string;
      copy: string;
      secondaryCopy: string;
      startDemo: string;
      seeExample: string;
    };
    trustPills: string[];
    benefitStrip: string[];
    reassuranceItems: Array<{ title: string; copy: string }>;
    sectionHeadings: {
      why: { eyebrow: string; title: string; copy: string };
      common: { eyebrow: string; title: string; copy: string };
      reviews: { eyebrow: string; title: string; copy: string; limit: string };
      leaveWith: { eyebrow: string; title: string; copy: string };
      how: { eyebrow: string; title: string; copy: string };
      faq: { eyebrow: string; title: string; copy: string };
      finalCta: {
        eyebrow: string;
        title: string;
        copy: string;
        startDemo: string;
        reviewLimits: string;
        bullets: string[];
      };
      trust: { eyebrow: string; title: string; copy: string; limits: string[] };
    };
    matterItems: Array<{ title: string; copy: string }>;
    commonSituations: Array<{ title: string; copy: string }>;
    reviewTypes: Array<{ title: string; examples: string }>;
    leaveWithItems: string[];
    workflowSteps: Array<{ step: string; title: string; copy: string }>;
    faqs: Array<{ question: string; answer: string }>;
    heroPreview: {
      ariaLabel: string;
      badge: string;
      eyebrow: string;
      title: string;
      copy: string;
      packet: string;
      readyQuestionTitle: string;
      readyQuestion: string;
      checklistTitle: string;
      rows: Array<{ label: string; value: string }>;
      checklist: string[];
    };
    exampleOutput: {
      eyebrow: string;
      title: string;
      copy: string;
      flaggedTitle: string;
      flaggedCopy: string;
      detailsTitle: string;
      detailsCopy: string;
      questionsTitle: string;
      questions: string[];
    };
  }
> = {
  en: {
    header: {
      homeLabel: "Notice-to-Rescue home",
      subtitle: "Medicaid notice agent",
      nav: [
        { href: "#why-it-matters", label: "Why it matters" },
        { href: "#common-situations", label: "Notice moments" },
        { href: "#what-it-reviews", label: "What it reviews" },
        { href: "#how-it-works", label: "How it works" },
        { href: "#trust-limits", label: "Trust & limits" },
      ],
      startDemo: "Start demo",
    },
    hero: {
      title:
        "Rescue Medicaid coverage before a confusing notice becomes an interruption.",
      copy:
        "Notice-to-Rescue reads fictional Medicaid notice packets or local pasted text, finds the exact coverage blocker, and turns dense agency language into a clear rescue path.",
      secondaryCopy:
        "It prepares next-step artifacts for the demo flow, while leaving official eligibility decisions, submissions, and legal guidance to the appropriate agency or qualified reviewer.",
      startDemo: "Start rescue demo",
      seeExample: "See example output",
    },
    trustPills: [
      "Plain-English Medicaid notice guidance",
      "Blocker and readiness check",
      "Frontend-only demo",
    ],
    benefitStrip: [
      "Read renewal and closure notices",
      "Identify exact coverage blockers",
      "Prepare packets and escalation notes",
    ],
    reassuranceItems: [
      {
        title: "Plain-English notice review",
        copy:
          "Summaries explain what a Medicaid notice appears to request, not official eligibility decisions.",
      },
      {
        title: "Blocker-focused workflow",
        copy:
          "The demo centers on the missing requirement, deadline, and readiness status for the next step.",
      },
      {
        title: "Simulated only",
        copy:
          "This frontend demo does not contact agencies, submit paperwork, store real documents, or manage PHI.",
      },
    ],
    sectionHeadings: {
      why: {
        eyebrow: "Why this matters",
        title: "Small notice details can put coverage at risk.",
        copy:
          "Medicaid action notices often arrive with tight deadlines and dense wording. Notice-to-Rescue is designed for the urgent moment when someone needs to understand the exact blocker and what to do next.",
      },
      common: {
        eyebrow: "Common situations",
        title: "Built for the notice moments people actually bring.",
        copy:
          "The prototype works best when there is a Medicaid notice in front of you and a concrete coverage-risk question to resolve.",
      },
      reviews: {
        eyebrow: "What it reviews",
        title: "Bring the paperwork that explains the risk.",
        copy:
          "Notice-to-Rescue looks for useful context in the document and organizes it into a focused, reviewable case summary.",
        limit:
          "It can help prepare a response path. It cannot confirm eligibility, submit documents, contact an agency, or provide legal advice.",
      },
      leaveWith: {
        eyebrow: "What you leave with",
        title: "A clearer path from notice to next action.",
        copy:
          "The goal is not to replace an official answer. It is to help you understand the blocker, see whether the case is document-ready, and know when escalation may be needed.",
      },
      how: {
        eyebrow: "How Notice-to-Rescue works",
        title: "From confusing notice to prepared next step.",
        copy:
          "A short workflow keeps the review focused on blocker detection, readiness, and the next rescue action.",
      },
      faq: {
        eyebrow: "FAQ",
        title: "Clear answers about what the demo can and cannot do.",
        copy:
          "Notice-to-Rescue is intentionally careful: useful for preparation, limited when an official answer or human judgment is required.",
      },
      finalCta: {
        eyebrow: "Try the demo",
        title:
          "Start with one Medicaid notice and leave with a clearer rescue path.",
        copy:
          "Use Notice-to-Rescue to identify the blocker, check whether the case is ready, and prepare simulated next-step artifacts for the prototype workflow.",
        startDemo: "Start rescue demo",
        reviewLimits: "Review demo limits",
        bullets: [
          "Guidance only, not an official Medicaid determination",
          "No agency contact or document submission is made",
          "Designed for preparation before human review or follow-up",
        ],
      },
      trust: {
        eyebrow: "Trust & limits",
        title: "Informational guidance, not an official decision.",
        copy:
          "Notice-to-Rescue is a Medicaid notice rescue demo for explaining risk language and preparing simulated follow-up artifacts. It does not determine eligibility, submit paperwork, contact agencies, provide legal advice, store real documents, or manage real PHI workflows.",
        limits: [
          "Always confirm status, deadlines, submission options, and appeal rights with the agency or a qualified reviewer.",
          "Do not use this demo for emergencies, legal decisions, or real case management workflows.",
          "Do not enter real sensitive health information or real documents into this frontend demo.",
          "Use generated artifacts as preparation prompts, not as final answers or agency submissions.",
        ],
      },
    },
    matterItems: [
      {
        title: "Coverage can close quickly",
        copy:
          "A renewal or action-required notice may give a short window before benefits are interrupted.",
      },
      {
        title: "The blocker is often buried",
        copy:
          "The key missing item may be a proof of income, residency document, or clarification hidden in dense text.",
      },
      {
        title: "Deadlines need attention",
        copy:
          "The difference between ready to submit and escalation needed can depend on a single response date.",
      },
      {
        title: "Conflicting records happen",
        copy:
          "A notice and status letter may point to different facts, making human review important before action.",
      },
      {
        title: "Packets need to be complete",
        copy:
          "A response is stronger when the notice, verification, case details, and confirmation plan are organized.",
      },
      {
        title: "Escalation should be clear",
        copy:
          "Notice-to-Rescue helps distinguish routine document gathering from cases that need a navigator or advocate.",
      },
    ],
    commonSituations: [
      {
        title: "A renewal warning arrived",
        copy:
          "The notice says Medicaid may close unless proof of income or another verification is submitted.",
      },
      {
        title: "An action-required notice is unclear",
        copy:
          "The letter names a response date, but the exact document needed is easy to miss.",
      },
      {
        title: "A termination notice has already passed",
        copy:
          "Coverage appears scheduled to end, so the case may need appeal or reinstatement review.",
      },
      {
        title: "Two documents conflict",
        copy:
          "A case status letter and notice do not agree on income, residency, or eligibility details.",
      },
      {
        title: "A patient has partial paperwork",
        copy:
          "Some verification is ready, but the packet may still be missing a required item or confirmation step.",
      },
      {
        title: "Someone pasted local notice text",
        copy:
          "The prototype can review fictional sample packets or browser-local pasted text for the demo flow.",
      },
    ],
    reviewTypes: [
      {
        title: "Medicaid renewal notices",
        examples: "Renewal warnings, missing-verification requests, action deadlines",
      },
      {
        title: "Closure and termination letters",
        examples: "Coverage end dates, closure warnings, deadline-passed language",
      },
      {
        title: "Action-required notices",
        examples: "Proof of income, proof of residency, requested document lists",
      },
      {
        title: "Case status letters",
        examples: "Agency status updates, conflicting details, eligibility flags",
      },
      {
        title: "Supporting verification",
        examples: "Pay stubs, employer letters, leases, utility bills, official mail",
      },
      {
        title: "Risk and urgency language",
        examples:
          "Coverage may close, case will close, failure to respond, deadline passed",
      },
      {
        title: "Submission instructions",
        examples:
          "Where to send documents, what to include, confirmation reminders",
      },
      {
        title: "Escalation signals",
        examples: "Low-confidence extraction, conflicting records, overdue cases",
      },
    ],
    leaveWithItems: [
      "Plain-English explanation of the notice",
      "Exact blocker putting coverage at risk",
      "Deadline, urgency, and readiness status",
      "Missing-requirements checklist",
      "Simulated submission or escalation packet",
      "Printable follow-up summary for outside review",
    ],
    workflowSteps: [
      {
        step: "01",
        title: "Choose or paste a notice",
        copy:
          "Start with a fictional Medicaid notice packet or paste local text into the browser-only demo.",
      },
      {
        step: "02",
        title: "Review extracted fields",
        copy:
          "Confirm the notice type, deadline, Medicaid program, risk language, and requested documents.",
      },
      {
        step: "03",
        title: "Run the rescue agent",
        copy:
          "The local workflow identifies the exact blocker, urgency, rescue path, and document readiness.",
      },
      {
        step: "04",
        title: "Prepare the next action",
        copy:
          "Leave with simulated packet artifacts, escalation notes, and a printable summary for follow-up.",
      },
    ],
    faqs: [
      {
        question: "Does this decide whether someone is eligible for Medicaid?",
        answer:
          "No. Notice-to-Rescue explains notice language and prepares next steps, but it does not determine Medicaid eligibility, coverage status, or appeal rights.",
      },
      {
        question: "Can this submit documents to an agency?",
        answer:
          "No. The demo can prepare simulated packet artifacts, but it does not submit paperwork, contact agencies, create accounts, or save confirmations.",
      },
      {
        question: "What documents can I review in the prototype?",
        answer:
          "The demo is suited for fictional Medicaid renewal notices, closure or termination notices, action-required letters, case status letters, and local pasted notice text.",
      },
      {
        question: "Does this store real documents or PHI?",
        answer:
          "No. The project is frontend-only. It uses sample data and browser-local text for the prototype, and it is not a real PHI workflow.",
      },
      {
        question: "Is this legal or agency advice?",
        answer:
          "No. It is informational guidance for a hackathon prototype. Always verify deadlines, submission options, appeal rights, and status with the agency or a qualified human reviewer.",
      },
      {
        question: "What should happen when escalation is flagged?",
        answer:
          "Use the generated summary to brief a navigator, advocate, case worker, or other qualified reviewer before relying on the packet.",
      },
    ],
    heroPreview: {
      ariaLabel: "Sample Notice-to-Rescue review preview",
      badge: "Packet-ready review",
      eyebrow: "Sample output",
      title: "Medicaid renewal notice review",
      copy: "Plain-English review for a missing income verification blocker.",
      packet: "Demo packet",
      readyQuestionTitle: "Ready-to-ask question",
      readyQuestion:
        "What exact proof of income is acceptable, and how can I confirm the packet was received before the response deadline?",
      checklistTitle: "Next-step checklist",
      rows: [
        {
          label: "Notice summary",
          value:
            "Renewal notice says Medicaid may close unless proof of income is received.",
        },
        {
          label: "Exact blocker",
          value:
            "Missing income verification is preventing the case from being document-ready.",
        },
        {
          label: "What to verify",
          value:
            "Deadline, acceptable proof, submission channel, and confirmation number.",
        },
        {
          label: "Rescue path",
          value:
            "Gather verification, prepare packet, and escalate if the deadline is missed.",
        },
      ],
      checklist: [
        "Attach the original notice",
        "Match documents to the patient and case",
        "Save proof of submission or confirmation",
      ],
    },
    exampleOutput: {
      eyebrow: "Example summary",
      title: "Prepared rescue notes",
      copy:
        "The notice appears to warn that Medicaid may close unless income verification is submitted before the listed response date.",
      flaggedTitle: "Flagged detail",
      flaggedCopy:
        "Missing proof of income is the blocker. Confirm acceptable documents before sending the packet.",
      detailsTitle: "Details to verify",
      detailsCopy:
        "Deadline, case identifier, submission channel, required proof, and confirmation method.",
      questionsTitle: "Questions to ask",
      questions: [
        "Which proof of income documents will satisfy this notice?",
        "How should the packet be submitted for this Medicaid case?",
        "What confirmation number or receipt should be saved?",
      ],
    },
  },
  es: {
    header: {
      homeLabel: "Inicio de Notice-to-Rescue",
      subtitle: "Agente para avisos de Medicaid",
      nav: [
        { href: "#why-it-matters", label: "Por que importa" },
        { href: "#common-situations", label: "Momentos del aviso" },
        { href: "#what-it-reviews", label: "Que revisa" },
        { href: "#how-it-works", label: "Como funciona" },
        { href: "#trust-limits", label: "Confianza y limites" },
      ],
      startDemo: "Iniciar demo",
    },
    hero: {
      title:
        "Protege la cobertura de Medicaid antes de que un aviso confuso se vuelva una interrupcion.",
      copy:
        "Notice-to-Rescue lee paquetes ficticios de avisos de Medicaid o texto pegado localmente, encuentra el bloqueo exacto de cobertura y convierte lenguaje denso de la agencia en una ruta clara de rescate.",
      secondaryCopy:
        "Prepara artefactos de siguiente paso para el flujo de demo, mientras deja las decisiones oficiales de elegibilidad, envios y orientacion legal a la agencia apropiada o a una persona revisora calificada.",
      startDemo: "Iniciar rescate",
      seeExample: "Ver ejemplo",
    },
    trustPills: [
      "Guia clara para avisos de Medicaid",
      "Revision de bloqueo y preparacion",
      "Demo solo del frontend",
    ],
    benefitStrip: [
      "Lee avisos de renovacion y cierre",
      "Identifica bloqueos exactos de cobertura",
      "Prepara paquetes y notas de escalamiento",
    ],
    reassuranceItems: [
      {
        title: "Revision del aviso en lenguaje claro",
        copy:
          "Los resumenes explican lo que un aviso de Medicaid parece pedir, no decisiones oficiales de elegibilidad.",
      },
      {
        title: "Flujo centrado en el bloqueo",
        copy:
          "La demo se centra en el requisito faltante, la fecha limite y el estado de preparacion para el siguiente paso.",
      },
      {
        title: "Solo simulado",
        copy:
          "Esta demo frontend no contacta agencias, no envia documentos, no guarda documentos reales ni maneja PHI.",
      },
    ],
    sectionHeadings: {
      why: {
        eyebrow: "Por que importa",
        title: "Detalles pequeños del aviso pueden poner la cobertura en riesgo.",
        copy:
          "Los avisos de accion de Medicaid suelen llegar con fechas limite cortas y lenguaje denso. Notice-to-Rescue esta disenado para el momento urgente en que alguien necesita entender el bloqueo exacto y que hacer despues.",
      },
      common: {
        eyebrow: "Situaciones comunes",
        title: "Hecho para los momentos de aviso que las personas realmente traen.",
        copy:
          "El prototipo funciona mejor cuando tienes un aviso de Medicaid enfrente y una pregunta concreta de riesgo de cobertura que resolver.",
      },
      reviews: {
        eyebrow: "Que revisa",
        title: "Trae el papeleo que explica el riesgo.",
        copy:
          "Notice-to-Rescue busca contexto util en el documento y lo organiza en un resumen de caso enfocado y revisable.",
        limit:
          "Puede ayudar a preparar una ruta de respuesta. No puede confirmar elegibilidad, enviar documentos, contactar una agencia ni dar asesoria legal.",
      },
      leaveWith: {
        eyebrow: "Lo que obtienes",
        title: "Una ruta mas clara desde el aviso hasta la siguiente accion.",
        copy:
          "La meta no es reemplazar una respuesta oficial. Es ayudarte a entender el bloqueo, ver si el caso esta listo con documentos y saber cuando puede hacer falta escalar.",
      },
      how: {
        eyebrow: "Como funciona Notice-to-Rescue",
        title: "Del aviso confuso al siguiente paso preparado.",
        copy:
          "Un flujo corto mantiene la revision enfocada en detectar bloqueos, preparacion y la siguiente accion de rescate.",
      },
      faq: {
        eyebrow: "Preguntas",
        title: "Respuestas claras sobre lo que la demo puede y no puede hacer.",
        copy:
          "Notice-to-Rescue es intencionalmente cuidadoso: util para preparacion, limitado cuando se requiere una respuesta oficial o juicio humano.",
      },
      finalCta: {
        eyebrow: "Prueba la demo",
        title:
          "Empieza con un aviso de Medicaid y sal con una ruta de rescate mas clara.",
        copy:
          "Usa Notice-to-Rescue para identificar el bloqueo, revisar si el caso esta listo y preparar artefactos simulados de siguiente paso para el flujo del prototipo.",
        startDemo: "Iniciar rescate",
        reviewLimits: "Revisar limites",
        bullets: [
          "Guia solamente, no una determinacion oficial de Medicaid",
          "No se contacta a agencias ni se envian documentos",
          "Disenado para preparacion antes de revision humana o seguimiento",
        ],
      },
      trust: {
        eyebrow: "Confianza y limites",
        title: "Guia informativa, no una decision oficial.",
        copy:
          "Notice-to-Rescue es una demo de rescate de avisos de Medicaid para explicar lenguaje de riesgo y preparar artefactos simulados de seguimiento. No determina elegibilidad, no envia papeleo, no contacta agencias, no da asesoria legal, no guarda documentos reales ni maneja flujos reales de PHI.",
        limits: [
          "Confirma siempre el estado, fechas limite, opciones de envio y derechos de apelacion con la agencia o una persona revisora calificada.",
          "No uses esta demo para emergencias, decisiones legales ni gestion real de casos.",
          "No ingreses informacion real sensible de salud ni documentos reales en esta demo frontend.",
          "Usa los artefactos generados como pautas de preparacion, no como respuestas finales ni envios a una agencia.",
        ],
      },
    },
    matterItems: [
      {
        title: "La cobertura puede cerrarse rapido",
        copy:
          "Un aviso de renovacion o accion requerida puede dar una ventana corta antes de que los beneficios se interrumpan.",
      },
      {
        title: "El bloqueo suele estar escondido",
        copy:
          "El elemento clave faltante puede ser prueba de ingresos, documento de residencia o una aclaracion oculta en texto denso.",
      },
      {
        title: "Las fechas limite requieren atencion",
        copy:
          "La diferencia entre listo para enviar y escalamiento necesario puede depender de una sola fecha de respuesta.",
      },
      {
        title: "Puede haber registros en conflicto",
        copy:
          "Un aviso y una carta de estado pueden apuntar a hechos diferentes, por lo que la revision humana es importante antes de actuar.",
      },
      {
        title: "Los paquetes deben estar completos",
        copy:
          "Una respuesta es mas fuerte cuando el aviso, la verificacion, los detalles del caso y el plan de confirmacion estan organizados.",
      },
      {
        title: "El escalamiento debe ser claro",
        copy:
          "Notice-to-Rescue ayuda a distinguir la recopilacion rutinaria de documentos de casos que necesitan una persona navegadora o defensora.",
      },
    ],
    commonSituations: [
      {
        title: "Llego una advertencia de renovacion",
        copy:
          "El aviso dice que Medicaid puede cerrarse si no se envia prueba de ingresos u otra verificacion.",
      },
      {
        title: "Un aviso de accion requerida no es claro",
        copy:
          "La carta nombra una fecha de respuesta, pero el documento exacto necesario es facil de pasar por alto.",
      },
      {
        title: "Un aviso de terminacion ya paso",
        copy:
          "La cobertura parece programada para terminar, asi que el caso puede necesitar revision de apelacion o reinstalacion.",
      },
      {
        title: "Dos documentos se contradicen",
        copy:
          "Una carta de estado del caso y el aviso no coinciden sobre ingresos, residencia o detalles de elegibilidad.",
      },
      {
        title: "Una persona tiene papeleo parcial",
        copy:
          "Alguna verificacion esta lista, pero al paquete aun puede faltarle un requisito o paso de confirmacion.",
      },
      {
        title: "Alguien pego texto local del aviso",
        copy:
          "El prototipo puede revisar paquetes ficticios de muestra o texto pegado localmente en el navegador para el flujo de demo.",
      },
    ],
    reviewTypes: [
      {
        title: "Avisos de renovacion de Medicaid",
        examples:
          "Advertencias de renovacion, solicitudes de verificacion faltante, fechas limite de accion",
      },
      {
        title: "Cartas de cierre y terminacion",
        examples:
          "Fechas de fin de cobertura, advertencias de cierre, lenguaje de fecha vencida",
      },
      {
        title: "Avisos de accion requerida",
        examples:
          "Prueba de ingresos, prueba de residencia, listas de documentos solicitados",
      },
      {
        title: "Cartas de estado del caso",
        examples:
          "Actualizaciones de agencia, detalles en conflicto, senales de elegibilidad",
      },
      {
        title: "Verificacion de apoyo",
        examples:
          "Talones de pago, cartas de empleador, contratos de alquiler, facturas de servicios, correo oficial",
      },
      {
        title: "Lenguaje de riesgo y urgencia",
        examples:
          "La cobertura puede cerrarse, el caso se cerrara, falta de respuesta, fecha vencida",
      },
      {
        title: "Instrucciones de envio",
        examples:
          "Donde enviar documentos, que incluir, recordatorios de confirmacion",
      },
      {
        title: "Senales de escalamiento",
        examples:
          "Extraccion de baja confianza, registros en conflicto, casos vencidos",
      },
    ],
    leaveWithItems: [
      "Explicacion del aviso en lenguaje claro",
      "Bloqueo exacto que pone la cobertura en riesgo",
      "Fecha limite, urgencia y estado de preparacion",
      "Lista de requisitos faltantes",
      "Paquete simulado de envio o escalamiento",
      "Resumen imprimible de seguimiento para revision externa",
    ],
    workflowSteps: [
      {
        step: "01",
        title: "Elige o pega un aviso",
        copy:
          "Empieza con un paquete ficticio de aviso de Medicaid o pega texto local en la demo solo del navegador.",
      },
      {
        step: "02",
        title: "Revisa campos extraidos",
        copy:
          "Confirma el tipo de aviso, fecha limite, programa de Medicaid, lenguaje de riesgo y documentos solicitados.",
      },
      {
        step: "03",
        title: "Ejecuta el agente de rescate",
        copy:
          "El flujo local identifica el bloqueo exacto, la urgencia, la ruta de rescate y la preparacion de documentos.",
      },
      {
        step: "04",
        title: "Prepara la siguiente accion",
        copy:
          "Sal con artefactos simulados de paquete, notas de escalamiento y un resumen imprimible para seguimiento.",
      },
    ],
    faqs: [
      {
        question: "Esto decide si alguien es elegible para Medicaid?",
        answer:
          "No. Notice-to-Rescue explica el lenguaje del aviso y prepara siguientes pasos, pero no determina elegibilidad de Medicaid, estado de cobertura ni derechos de apelacion.",
      },
      {
        question: "Puede enviar documentos a una agencia?",
        answer:
          "No. La demo puede preparar artefactos simulados de paquete, pero no envia papeleo, no contacta agencias, no crea cuentas ni guarda confirmaciones.",
      },
      {
        question: "Que documentos puedo revisar en el prototipo?",
        answer:
          "La demo es adecuada para avisos ficticios de renovacion de Medicaid, avisos de cierre o terminacion, cartas de accion requerida, cartas de estado del caso y texto local pegado del aviso.",
      },
      {
        question: "Guarda documentos reales o PHI?",
        answer:
          "No. El proyecto es solo frontend. Usa datos de muestra y texto local del navegador para el prototipo, y no es un flujo real de PHI.",
      },
      {
        question: "Es asesoria legal o de una agencia?",
        answer:
          "No. Es guia informativa para un prototipo de hackathon. Verifica siempre fechas limite, opciones de envio, derechos de apelacion y estado con la agencia o una persona revisora calificada.",
      },
      {
        question: "Que debe pasar cuando se marca escalamiento?",
        answer:
          "Usa el resumen generado para informar a una persona navegadora, defensora, trabajadora de caso u otra revisora calificada antes de depender del paquete.",
      },
    ],
    heroPreview: {
      ariaLabel: "Vista previa de revision de Notice-to-Rescue",
      badge: "Revision lista para paquete",
      eyebrow: "Salida de muestra",
      title: "Revision de aviso de renovacion de Medicaid",
      copy:
        "Revision en lenguaje claro para un bloqueo por verificacion de ingresos faltante.",
      packet: "Paquete demo",
      readyQuestionTitle: "Pregunta lista para hacer",
      readyQuestion:
        "Que prueba exacta de ingresos es aceptable, y como puedo confirmar que el paquete fue recibido antes de la fecha limite de respuesta?",
      checklistTitle: "Lista de siguientes pasos",
      rows: [
        {
          label: "Resumen del aviso",
          value:
            "El aviso de renovacion dice que Medicaid puede cerrarse si no se recibe prueba de ingresos.",
        },
        {
          label: "Bloqueo exacto",
          value:
            "La verificacion de ingresos faltante impide que el caso este listo con documentos.",
        },
        {
          label: "Que verificar",
          value:
            "Fecha limite, prueba aceptable, canal de envio y numero de confirmacion.",
        },
        {
          label: "Ruta de rescate",
          value:
            "Reunir verificacion, preparar el paquete y escalar si se paso la fecha limite.",
        },
      ],
      checklist: [
        "Adjuntar el aviso original",
        "Relacionar documentos con la persona y el caso",
        "Guardar prueba de envio o confirmacion",
      ],
    },
    exampleOutput: {
      eyebrow: "Resumen de ejemplo",
      title: "Notas de rescate preparadas",
      copy:
        "El aviso parece advertir que Medicaid puede cerrarse si no se envia verificacion de ingresos antes de la fecha de respuesta indicada.",
      flaggedTitle: "Detalle marcado",
      flaggedCopy:
        "La prueba de ingresos faltante es el bloqueo. Confirma documentos aceptables antes de enviar el paquete.",
      detailsTitle: "Detalles para verificar",
      detailsCopy:
        "Fecha limite, identificador del caso, canal de envio, prueba requerida y metodo de confirmacion.",
      questionsTitle: "Preguntas para hacer",
      questions: [
        "Que documentos de prueba de ingresos satisfacen este aviso?",
        "Como se debe enviar el paquete para este caso de Medicaid?",
        "Que numero de confirmacion o recibo se debe guardar?",
      ],
    },
  },
};
