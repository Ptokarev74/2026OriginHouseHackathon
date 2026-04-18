import type { ParsedCase, ReferralAssessment } from "@/lib/types";

function defaultWindowForUrgency(urgency: ParsedCase["urgency"]) {
  if (urgency === "urgent") {
    return "within 7 days";
  }

  if (urgency === "soon") {
    return "within 14 days";
  }

  return "within 30 days";
}

export function assessReferral(parsedCase: ParsedCase): ReferralAssessment {
  const recommendedFollowUpWindow =
    parsedCase.recommendedFollowUpWindow ??
    defaultWindowForUrgency(parsedCase.urgency);
  const findings = [
    `${parsedCase.specialtyNeeded} follow-up was identified from the available document text.`,
    `Urgency was normalized to ${parsedCase.urgency}; confirm this with the clinician or discharge paperwork.`,
    `Suggested appointment target is ${recommendedFollowUpWindow}.`,
  ];

  if (parsedCase.transportationFlag) {
    findings.push("Transportation should be planned before any in-person appointment.");
  }

  return {
    specialtyNeeded: parsedCase.specialtyNeeded,
    urgency: parsedCase.urgency,
    recommendedFollowUpWindow,
    findings,
  };
}
