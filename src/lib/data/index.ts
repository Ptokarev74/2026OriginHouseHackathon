import sampleCasesJson from "./sampleCases.json";
import { copyLanguage, type AppLanguage } from "@/lib/i18n/types";
import type { SampleCase } from "@/lib/types";

const sampleCases = sampleCasesJson as SampleCase[];

const somaliSampleCopy: Record<
  string,
  {
    label: string;
    description: string;
    noticeTitle: string;
    supportingDocumentTitles: Record<string, string>;
    languagePreference?: string;
  }
> = {
  "case-income-renewal": {
    label: "Alicia Rivera - digniin cusboonaysiin, caddeyn dakhli ayaa maqan",
    description:
      "Ogeysiis cusboonaysiin Medicaid ah ayaa sheegaya in caymisku xirmi karo haddii caddeynta dakhliga aan la gudbin ka hor waqtiga kama dambaysta ah.",
    noticeTitle: "Ogeysiiska Cusboonaysiinta Medicaid - Alicia Rivera",
    supportingDocumentTitles: {
      "case-status-income": "Warqadda Xaaladda Kiiska",
    },
    languagePreference: "Soomaali",
  },
  "case-residency-action": {
    label: "Malik Johnson - ficil ayaa loo baahan yahay, caddeyn deggenaansho ayaa maqan",
    description:
      "Warqad ficil loo baahan yahay ayaa sheegaysa in deggenaanshaha aan la xaqiijin karin waxayna codsanaysaa caddeyn cinwaan ka hor inta faa'iidooyinka la xirin.",
    noticeTitle: "Ogeysiiska Medicaid ee Ficil Loo Baahan Yahay - Malik Johnson",
    supportingDocumentTitles: {
      "uploaded-identity": "Aqoonsi sawir leh oo hore loo raray",
    },
    languagePreference: "Soomaali",
  },
  "case-conflict-escalation": {
    label: "Rosa Martinez - xog dakhli oo is khilaafsan, waqtigii wuu dhaafay",
    description:
      "Ogeysiis joojin iyo warqad xaalad kiis ayaa isku khilaafsan xogta dakhliga, waqtiga kama dambaysta ahna horay ayuu u dhaafay.",
    noticeTitle: "Ogeysiiska Joojinta Medicaid - Rosa Martinez",
    supportingDocumentTitles: {
      "case-status-conflict": "Warqadda Xaaladda Kiiska",
    },
    languagePreference: "Soomaali",
  },
};

export function getSampleCases(language: AppLanguage = "en") {
  if (copyLanguage(language) !== "so") {
    return sampleCases;
  }

  return sampleCases.map((sampleCase) => {
    const copy = somaliSampleCopy[sampleCase.id];
    if (!copy) return sampleCase;

    return {
      ...sampleCase,
      label: copy.label,
      description: copy.description,
      preferences: {
        ...sampleCase.preferences,
        languagePreference: copy.languagePreference,
      },
      notice: {
        ...sampleCase.notice,
        title: copy.noticeTitle,
      },
      supportingDocuments: sampleCase.supportingDocuments.map((document) => ({
        ...document,
        title: copy.supportingDocumentTitles[document.id] ?? document.title,
      })),
    };
  });
}
