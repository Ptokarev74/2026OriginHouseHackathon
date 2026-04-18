import type { LiveProvider, TinyFishFetchResult } from "@/lib/types";

// ── Extraction helpers ────────────────────────────────────────────────────────

function extractFirstMatch(text: string, patterns: RegExp[]): string {
  for (const pattern of patterns) {
    const m = text.match(pattern);
    if (m?.[1]) return m[1].trim();
  }
  return "";
}

function extractPhone(text: string): string {
  return (
    extractFirstMatch(text, [
      /(?:phone|tel|call)[:\s]+([+\d()\-.\s]{7,20})/i,
      /(\(\d{3}\)\s*\d{3}[-.]\d{4})/,
      /(\d{3}[-.]\d{3}[-.]\d{4})/,
    ]) || "See website"
  );
}

function extractAddress(text: string): string {
  return (
    extractFirstMatch(text, [
      /(?:address|location|located at)[:\s]+([^\n]{10,80})/i,
      /(\d+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:St|Ave|Blvd|Dr|Rd|Way|Ln|Pkwy)[^\n]{0,30})/,
    ]) || "See website for address"
  );
}

function extractInsurance(text: string): string {
  return (
    extractFirstMatch(text, [
      /(?:insurance|accepted insurance|we accept|accepted plans)[:\s]+([^\n]{10,200})/i,
      /(?:Medicaid|Medicare|Dual Eligible)[^\n]{0,80}/i,
    ]) || "Contact office to verify insurance"
  );
}

function extractSchedulingUrl(text: string, sourceUrl: string): string {
  const m = text.match(
    /https?:\/\/[^\s"')>]+(?:schedul|book|appoint|request)[^\s"')>]*/i,
  );
  return m?.[0] ?? sourceUrl;
}

function extractContactUrl(text: string, sourceUrl: string): string {
  const m = text.match(
    /https?:\/\/[^\s"')>]+(?:contact|referral|new.patient)[^\s"')>]*/i,
  );
  return m?.[0] ?? sourceUrl;
}

function extractAvailability(text: string): string {
  return (
    extractFirstMatch(text, [
      /(?:accepting new patients|new patients welcome)[^\n]*/i,
      /(?:next available|availability)[:\s]+([^\n]{5,60})/i,
      /(?:appointment|appoint)[\s\w]*(?:within|in)[^\n]{5,40}/i,
    ]) || "Call to check availability"
  );
}

function extractPriceHint(text: string): string {
  return (
    extractFirstMatch(text, [
      /(?:sliding scale|sliding-scale|low cost|no cost|free clinic)[^\n]*/i,
      /(?:copay|co-pay|cost)[:\s]+([^\n]{5,60})/i,
      /\$\d+[^\n]{0,30}/,
    ]) || "Contact office for cost information"
  );
}

function extractName(text: string, fallback: string): string {
  // Try the page title line (first heading)
  const heading = text.match(/^#\s+(.+)/m)?.[1];
  if (heading && heading.length < 80) return heading.trim();
  return fallback;
}

function extractSpecialty(text: string): string {
  const specialties = [
    "Cardiology",
    "Pulmonology",
    "Orthopedics",
    "Neurology",
    "Behavioral Health",
    "Endocrinology",
    "Gastroenterology",
    "Primary Care",
    "Internal Medicine",
    "Family Medicine",
  ];
  for (const s of specialties) {
    if (new RegExp(s, "i").test(text)) return s;
  }
  return "Specialty Care";
}

// ── Public function ───────────────────────────────────────────────────────────

/**
 * Converts raw TinyFish Fetch results into structured LiveProvider objects.
 * Uses lightweight regex heuristics — not an LLM — so results are best-effort.
 * Every field has a safe fallback string.
 */
export function normalizeFetchedPages(
  pages: TinyFishFetchResult[],
  source: "live" | "mock" = "live",
): LiveProvider[] {
  return pages.map((page) => {
    const text = page.text ?? "";
    return {
      provider_name: extractName(text, page.title || page.url),
      specialty: extractSpecialty(text),
      address: extractAddress(text),
      phone: extractPhone(text),
      insurance_acceptance: extractInsurance(text),
      scheduling_url: extractSchedulingUrl(text, page.final_url || page.url),
      contact_url: extractContactUrl(text, page.final_url || page.url),
      availability_hint: extractAvailability(text),
      price_hint: extractPriceHint(text),
      source_url: page.url,
      source,
    };
  });
}
