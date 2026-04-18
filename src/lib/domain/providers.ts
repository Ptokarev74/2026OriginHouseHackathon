import type {
  CoverageAssessment,
  ParsedCase,
  PatientPreferences,
  Provider,
  RankedProvider,
} from "@/lib/types";

const SCORE_WEIGHTS = {
  insurance: 40,
  specialty: 20,
  distance: 15,
  availability: 15,
  cost: 10,
};

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function hasSpecialtyMatch(provider: Provider, specialtyNeeded: string) {
  return normalize(provider.specialty) === normalize(specialtyNeeded);
}

function hasLanguageMatch(provider: Provider, languagePreference?: string) {
  if (!languagePreference) {
    return true;
  }

  return provider.languages.some(
    (language) => normalize(language) === normalize(languagePreference),
  );
}

function hasInsuranceMatch(
  provider: Provider,
  insuranceType: string,
  includeMedicareCompatible: boolean,
) {
  const insurance = normalize(insuranceType);
  const accepted = provider.acceptedInsurance.map(normalize);

  if (
    accepted.some(
      (item) => insurance.includes(item) || item.includes(insurance),
    )
  ) {
    return true;
  }

  if (insurance.includes("medicaid") && accepted.some((item) => item.includes("medicaid"))) {
    return true;
  }

  if (
    includeMedicareCompatible &&
    accepted.some(
      (item) =>
        item.includes("medicare") ||
        item.includes("medicareadvantage") ||
        item.includes("dualeligible"),
    )
  ) {
    return true;
  }

  return false;
}

function getDistanceScore(distanceMiles: number, maxDistanceMiles: number) {
  if (distanceMiles > maxDistanceMiles) {
    return 0;
  }

  const distanceRatio = distanceMiles / Math.max(maxDistanceMiles, 1);
  return Math.round(SCORE_WEIGHTS.distance * (1 - distanceRatio));
}

function getAvailabilityScore(availabilityDays: number) {
  if (availabilityDays <= 3) {
    return SCORE_WEIGHTS.availability;
  }

  if (availabilityDays <= 7) {
    return 11;
  }

  if (availabilityDays <= 14) {
    return 7;
  }

  return 3;
}

function getCostScore(costLevel: Provider["estimatedCostLevel"]) {
  if (costLevel === "low") {
    return SCORE_WEIGHTS.cost;
  }

  if (costLevel === "medium") {
    return 6;
  }

  return 2;
}

export function filterProviders(
  providers: Provider[],
  parsedCase: ParsedCase,
  coverageAssessment: CoverageAssessment,
  preferences: PatientPreferences,
) {
  return providers.filter(
    (provider) =>
      provider.acceptingNewPatients &&
      hasSpecialtyMatch(provider, parsedCase.specialtyNeeded) &&
      provider.distanceMiles <= preferences.maxDistanceMiles &&
      hasLanguageMatch(
        provider,
        parsedCase.languagePreference ?? preferences.languagePreference,
      ) &&
      hasInsuranceMatch(
        provider,
        parsedCase.insuranceType,
        coverageAssessment.includeMedicareCompatible,
      ),
  );
}

export function rankProviders(
  providers: Provider[],
  parsedCase: ParsedCase,
  coverageAssessment: CoverageAssessment,
  preferences: PatientPreferences,
): RankedProvider[] {
  return providers
    .map((provider) => {
      const insurance = hasInsuranceMatch(
        provider,
        parsedCase.insuranceType,
        coverageAssessment.includeMedicareCompatible,
      )
        ? SCORE_WEIGHTS.insurance
        : 0;
      const specialty = hasSpecialtyMatch(provider, parsedCase.specialtyNeeded)
        ? SCORE_WEIGHTS.specialty
        : 0;
      const distance = getDistanceScore(
        provider.distanceMiles,
        preferences.maxDistanceMiles,
      );
      const availability = getAvailabilityScore(provider.availabilityDays);
      const cost = getCostScore(provider.estimatedCostLevel);
      const score = insurance + specialty + distance + availability + cost;

      return {
        ...provider,
        score,
        scoreBreakdown: {
          insurance,
          specialty,
          distance,
          availability,
          cost,
        },
        explanation: [
          `Medicare coverage fit signal contributed ${insurance}/40 points; verify directly before scheduling.`,
          `${provider.specialty} specialty match contributed ${specialty}/20 points.`,
          `${provider.distanceMiles.toFixed(1)} miles away contributed ${distance}/15 distance points.`,
          `${provider.availabilityDays}-day availability contributed ${availability}/15 points.`,
          `${provider.estimatedCostLevel} cost signal contributed ${cost}/10 points.`,
        ],
      };
    })
    .sort((first, second) => {
      if (second.score !== first.score) {
        return second.score - first.score;
      }

      if (first.availabilityDays !== second.availabilityDays) {
        return first.availabilityDays - second.availabilityDays;
      }

      return first.distanceMiles - second.distanceMiles;
    });
}

export function selectBestProvider(rankedProviders: RankedProvider[]) {
  return rankedProviders[0];
}
