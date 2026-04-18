import providersJson from "./providers.json";
import referralNotesJson from "./referralNotes.json";
import renewalNoticesJson from "./renewalNotices.json";
import sampleCasesJson from "./sampleCases.json";
import type {
  Provider,
  SampleCase,
  SourceDocument,
} from "@/lib/types";

type SampleCaseSeed = Omit<SampleCase, "notice" | "referralNote">;

const renewalNotices = renewalNoticesJson as SourceDocument[];
const referralNotes = referralNotesJson as SourceDocument[];
const providers = providersJson as Provider[];
const sampleCaseSeeds = sampleCasesJson as SampleCaseSeed[];

function requireDocument(documents: SourceDocument[], id: string) {
  const document = documents.find((item) => item.id === id);

  if (!document) {
    throw new Error(`Missing source document: ${id}`);
  }

  return document;
}

export function getProviders() {
  return providers;
}

export function getSampleCases(): SampleCase[] {
  return sampleCaseSeeds.map((sampleCase) => ({
    ...sampleCase,
    notice: requireDocument(renewalNotices, sampleCase.noticeId),
    referralNote: requireDocument(referralNotes, sampleCase.referralNoteId),
  }));
}
