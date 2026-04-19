import {
  generatePatientInstructions,
  generateRescueArtifacts,
} from "@/lib/domain/actions";
import { parseDocuments } from "@/lib/domain/parsing";
import {
  assessBlocker,
  determineRescuePath,
  verifyReadiness,
} from "@/lib/domain/rescue";
import type { AgentInputCase, AgentRunResult } from "@/lib/types";
import type { AppLanguage } from "@/lib/i18n/types";

export const workflowSteps = [
  {
    id: "read_notice",
    label: "Read notice",
    description: "Extract notice type, deadline, risk language, program context, and urgency.",
  },
  {
    id: "identify_blocker",
    label: "Identify blocker",
    description: "Classify the exact issue putting coverage at risk.",
  },
  {
    id: "determine_path",
    label: "Determine rescue path",
    description: "Choose document rescue, renewal completion, deadline rescue, or escalation.",
  },
  {
    id: "prepare_packet",
    label: "Prepare packet",
    description: "Generate explanation, checklist, submission packet, handoff, and reminders.",
  },
  {
    id: "verify_readiness",
    label: "Verify readiness",
    description: "Check whether required documents are present or escalation is needed.",
  },
  {
    id: "outcome",
    label: "Build final status",
    description: "Return the dashboard status and patient next steps.",
  },
] as const;

export type WorkflowStepId = (typeof workflowSteps)[number]["id"];

export function localizedWorkflowSteps(language: AppLanguage = "en") {
  if (language === "so") {
    return [
      {
        id: "read_notice",
        label: "Akhri ogeysiiska",
        description:
          "Soo saar nooca ogeysiiska, waqtiga kama dambaysta ah, luqadda halista, macnaha barnaamijka, iyo degdegga.",
      },
      {
        id: "identify_blocker",
        label: "Aqoonso xannibaadda",
        description: "Kala saar arrinta saxda ah ee caymiska halis gelinaysa.",
      },
      {
        id: "determine_path",
        label: "Go'aami waddada",
        description:
          "Dooro badbaadin dukumiinti, dhammaystir cusboonaysiin, badbaadin waqti, ama kor-u-qaadis.",
      },
      {
        id: "prepare_packet",
        label: "Diyaari xirmada",
        description:
          "Samee sharaxaad, liis hubin, xirmo gudbin, wareejin, iyo xasuusinno.",
      },
      {
        id: "verify_readiness",
        label: "Xaqiiji diyaar ahaanshaha",
        description:
          "Hubi in dukumiintiyada loo baahan yahay jiraan ama kor-u-qaadis loo baahan yahay.",
      },
      {
        id: "outcome",
        label: "Dhis xaaladda ugu dambeysa",
        description: "Soo celi xaaladda dashboard-ka iyo tallaabooyinka xiga ee qofka.",
      },
    ] as const;
  }

  if (language === "es") {
    return [
      {
        id: "read_notice",
        label: "Leer aviso",
        description:
          "Extraer tipo de aviso, fecha limite, lenguaje de riesgo, contexto del programa y urgencia.",
      },
      {
        id: "identify_blocker",
        label: "Identificar bloqueo",
        description: "Clasificar el problema exacto que pone la cobertura en riesgo.",
      },
      {
        id: "determine_path",
        label: "Determinar ruta",
        description:
          "Elegir rescate de documentos, completar renovacion, rescate de fecha limite o escalamiento.",
      },
      {
        id: "prepare_packet",
        label: "Preparar paquete",
        description:
          "Generar explicacion, lista, paquete de envio, traspaso y recordatorios.",
      },
      {
        id: "verify_readiness",
        label: "Verificar preparacion",
        description:
          "Revisar si los documentos requeridos estan presentes o si hace falta escalamiento.",
      },
      {
        id: "outcome",
        label: "Crear estado final",
        description: "Devolver el estado del dashboard y siguientes pasos para la persona.",
      },
    ] as const;
  }

  return workflowSteps;
}

export function runNoticeToRescueAgent(inputCase: AgentInputCase): AgentRunResult {
  const language = inputCase.language ?? "en";
  const parsedNotice =
    inputCase.reviewedNotice ??
    parseDocuments(inputCase.documents, inputCase.preferences, "sample", language);
  const blockerAssessment = assessBlocker(parsedNotice, language);
  const rescuePath = determineRescuePath(parsedNotice, blockerAssessment, language);
  const readinessCheck = verifyReadiness(parsedNotice, rescuePath, language);
  const artifacts = generateRescueArtifacts(
    parsedNotice,
    blockerAssessment,
    rescuePath,
    readinessCheck,
    language,
  );
  const patientInstructions = generatePatientInstructions(
    parsedNotice,
    blockerAssessment,
    readinessCheck,
    language,
  );
  const finalStatus = readinessCheck.status;
  const outcomeSummary = readinessCheck.shouldEscalate
    ? language === "so"
      ? `Kor-u-qaadis ayaa loo baahan yahay. ${blockerAssessment.label} wuxuu u baahan yahay dib-u-eegis bini'aadan ka hor inta qofku ku tiirsanaan waddo gudbin.`
      : language === "es"
      ? `Escalamiento necesario. ${blockerAssessment.label} requiere revision humana antes de que la persona dependa de una ruta de envio.`
      : `Escalation needed. ${blockerAssessment.label} requires human review before the patient relies on a submission path.`
    : readinessCheck.readyToSubmit
      ? language === "so"
        ? `Waddada badbaadinta waa la aqoonsaday. ${blockerAssessment.label} waxaa lagu daboolay xirmada demo-ga. Xaalad: diyaar u ah gudbin.`
        : language === "es"
        ? `Ruta de rescate identificada. ${blockerAssessment.label} esta cubierto en el paquete demo. Estado: listo para enviar.`
        : `Rescue path identified. ${blockerAssessment.label} is addressed in the demo packet. Status: ready to submit.`
      : language === "so"
        ? `Waddada badbaadinta waa la aqoonsaday. Shay maqan: ${readinessCheck.missingDocuments.join(", ")}. Xaalad: sugaya dukumiintiyo.`
        : language === "es"
        ? `Ruta de rescate identificada. Item faltante: ${readinessCheck.missingDocuments.join(", ")}. Estado: esperando documentos.`
        : `Rescue path identified. Missing item: ${readinessCheck.missingDocuments.join(", ")}. Status: awaiting documents.`;

  return {
    parsedNotice,
    blockerAssessment,
    rescuePath,
    readinessCheck,
    artifacts,
    patientInstructions,
    finalStatus,
    outcomeSummary,
  };
}
