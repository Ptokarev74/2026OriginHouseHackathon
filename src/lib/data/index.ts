import sampleCasesJson from "./sampleCases.json";
import type { SampleCase } from "@/lib/types";

const sampleCases = sampleCasesJson as SampleCase[];

export function getSampleCases() {
  return sampleCases;
}
