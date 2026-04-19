import "server-only";

import {
  fetchTinyFishContent,
  searchTinyFish,
  TinyFishConfigError,
  TinyFishHttpError,
  type TinyFishFetchResult,
  type TinyFishSearchResult,
} from "@/lib/tinyfish/client";
import type {
  BlockerType,
  LiveGuidanceRequest,
  LiveGuidanceResult,
  LiveGuidanceSource,
  NoticeType,
  UrgencyLevel,
} from "@/lib/types";

const blockedHosts = [
  "facebook.com",
  "instagram.com",
  "linkedin.com",
  "pinterest.com",
  "reddit.com",
  "tiktok.com",
  "x.com",
  "youtube.com",
];

function normalizeSpaces(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function textValue(value: unknown) {
  return typeof value === "string" ? normalizeSpaces(value).slice(0, 120) : undefined;
}

function stringArrayValue(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string").map(normalizeSpaces).filter(Boolean).slice(0, 5)
    : [];
}

function isBlockerType(value: unknown): value is BlockerType {
  return (
    value === "missing_income_proof" ||
    value === "missing_residency_proof" ||
    value === "incomplete_renewal" ||
    value === "eligibility_inconsistency" ||
    value === "missed_deadline" ||
    value === "upcoming_deadline" ||
    value === "manual_review"
  );
}

function isNoticeType(value: unknown): value is NoticeType {
  return (
    value === "closure" ||
    value === "renewal" ||
    value === "termination" ||
    value === "action_required" ||
    value === "case_status" ||
    value === "uploaded_text"
  );
}

function isUrgencyLevel(value: unknown): value is UrgencyLevel {
  return value === "routine" || value === "soon" || value === "urgent" || value === "overdue";
}

export function parseLiveGuidanceRequest(value: unknown): LiveGuidanceRequest | undefined {
  if (!value || typeof value !== "object") return undefined;
  const record = value as Record<string, unknown>;

  if (
    !isBlockerType(record.blockerType) ||
    !isNoticeType(record.noticeType) ||
    !isUrgencyLevel(record.urgency)
  ) {
    return undefined;
  }

  const blockerLabel = textValue(record.blockerLabel);
  if (!blockerLabel) return undefined;

  return {
    blockerType: record.blockerType,
    blockerLabel,
    noticeType: record.noticeType,
    medicaidProgram: textValue(record.medicaidProgram),
    urgency: record.urgency,
    missingRequirements: stringArrayValue(record.missingRequirements),
    shouldEscalate: record.shouldEscalate === true,
  };
}

function buildSearchQuery(input: LiveGuidanceRequest) {
  const program = input.medicaidProgram || "Medicaid";
  const noticeType = input.noticeType.replaceAll("_", " ");
  const missing = input.missingRequirements.slice(0, 2).join(" ");
  const escalationTerms = input.shouldEscalate || input.urgency === "overdue"
    ? "appeal fair hearing deadline"
    : "verification documents renewal";

  return normalizeSpaces(
    `official ${program} guidance ${noticeType} ${input.blockerLabel} ${missing} ${escalationTerms}`,
  ).slice(0, 240);
}

function hostFromUrl(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function isUsableUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;
    return !blockedHosts.some((host) => parsed.hostname.endsWith(host));
  } catch {
    return false;
  }
}

function resultScore(result: TinyFishSearchResult) {
  const host = hostFromUrl(result.url);
  let score = 0;
  if (host.endsWith(".gov")) score += 5;
  if (host.includes("medicaid") || host.includes("cms") || host.includes("hhs")) score += 3;
  if (/official|agency|department|eligibility|renewal|appeal|hearing/i.test(result.title)) score += 2;
  return score;
}

function selectSearchResults(results: TinyFishSearchResult[]) {
  return results
    .filter((result) => isUsableUrl(result.url))
    .map((result, index) => ({ result, index }))
    .sort((a, b) => resultScore(b.result) - resultScore(a.result) || a.index - b.index)
    .map(({ result }) => result)
    .slice(0, 3);
}

function keywordList(input: LiveGuidanceRequest) {
  return [
    ...input.blockerLabel.toLowerCase().split(/\W+/),
    ...input.missingRequirements.flatMap((item) => item.toLowerCase().split(/\W+/)),
    "medicaid",
    "renewal",
    "verification",
    "appeal",
    "deadline",
  ].filter((word) => word.length > 3);
}

function excerptFor(page: TinyFishFetchResult, input: LiveGuidanceRequest) {
  if (typeof page.text !== "string") return undefined;

  const cleanText = normalizeSpaces(page.text);
  const lowerText = cleanText.toLowerCase();
  const keywords = keywordList(input);
  const matchIndex = keywords
    .map((keyword) => lowerText.indexOf(keyword))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];

  const start = Math.max((matchIndex ?? 0) - 80, 0);
  const excerpt = cleanText.slice(start, start + 360);
  return excerpt ? `${start > 0 ? "..." : ""}${excerpt}${start + 360 < cleanText.length ? "..." : ""}` : undefined;
}

function sourceFromSearch(result: TinyFishSearchResult): LiveGuidanceSource {
  return {
    title: result.title,
    url: result.url,
    siteName: result.site_name || hostFromUrl(result.url),
    snippet: result.snippet,
  };
}

function mergeFetchedContent(
  selectedResults: TinyFishSearchResult[],
  fetchedPages: TinyFishFetchResult[],
  input: LiveGuidanceRequest,
) {
  const fetchedByUrl = new Map(fetchedPages.map((page) => [page.url, page]));

  return selectedResults.map((result) => {
    const fetched = fetchedByUrl.get(result.url);
    return {
      ...sourceFromSearch(result),
      title: fetched?.title || result.title,
      finalUrl: fetched?.final_url,
      description: fetched?.description,
      publishedDate: fetched?.published_date,
      excerpt: fetched ? excerptFor(fetched, input) : undefined,
    };
  });
}

function buildSummary(input: LiveGuidanceRequest, sources: LiveGuidanceSource[]) {
  const sourceCount = sources.length;
  const officialCount = sources.filter((source) => hostFromUrl(source.finalUrl || source.url).endsWith(".gov")).length;
  const blocker = input.blockerLabel.toLowerCase();

  if (sourceCount === 0) {
    return "TinyFish did not return a public source that could be used for live guidance verification.";
  }

  const sourceCopy = `${sourceCount} public source${sourceCount === 1 ? "" : "s"}`;
  const officialCopy = officialCount > 0 ? `, including ${officialCount} government source${officialCount === 1 ? "" : "s"}` : "";
  const actionCopy = input.shouldEscalate
    ? "Use the sources to confirm appeal, fair hearing, reinstatement, or manual-review channels before relying on a self-service packet."
    : `Use the sources to confirm the requested ${blocker} documentation, accepted submission channel, and confirmation requirements.`;

  return `TinyFish verified live public-web guidance against ${sourceCopy}${officialCopy}. ${actionCopy}`;
}

function userSafeError(error: unknown) {
  if (error instanceof TinyFishConfigError) {
    return "TINYFISH_API_KEY is not configured on the server.";
  }

  if (error instanceof TinyFishHttpError) {
    if (error.status === 401) return "TinyFish authentication failed. Check the server API key.";
    if (error.status === 402 || error.status === 403) return "TinyFish access is not enabled or credits are unavailable.";
    if (error.status === 429) return "TinyFish rate limit was reached. Try again shortly.";
    return `TinyFish returned HTTP ${error.status}.`;
  }

  if (error instanceof DOMException && error.name === "TimeoutError") {
    return "TinyFish request timed out.";
  }

  return "TinyFish guidance verification failed.";
}

export async function verifyLiveGuidance(input: LiveGuidanceRequest): Promise<LiveGuidanceResult> {
  const query = buildSearchQuery(input);
  const errors: string[] = [];
  const searchResponse = await searchTinyFish({ query, location: "US", language: "en" });
  const selectedResults = selectSearchResults(searchResponse.results);

  if (selectedResults.length === 0) {
    return {
      status: "partial",
      query,
      generatedAt: new Date().toISOString(),
      summary: buildSummary(input, []),
      caveats: [
        "No source was strong enough to cite; confirm directly with the notice, state Medicaid agency, or a qualified reviewer.",
      ],
      sources: [],
      errors,
    };
  }

  let sources = selectedResults.map(sourceFromSearch);

  try {
    const fetchResponse = await fetchTinyFishContent(selectedResults.map((result) => result.url));
    sources = mergeFetchedContent(selectedResults, fetchResponse.results, input);
    errors.push(...fetchResponse.errors.map((item) => `${hostFromUrl(item.url) || item.url}: ${item.error}`));
  } catch (error) {
    errors.push(userSafeError(error));
  }

  return {
    status: sources.some((source) => source.excerpt || source.description) ? "verified" : "partial",
    query,
    generatedAt: new Date().toISOString(),
    summary: buildSummary(input, sources),
    caveats: [
      "This live check is informational and does not determine eligibility, provide legal advice, or replace official case-specific instructions.",
      "Always verify deadlines, appeal rights, and submission channels with the notice or the appropriate Medicaid agency.",
    ],
    sources,
    errors,
  };
}

export function guidanceErrorMessage(error: unknown) {
  return userSafeError(error);
}
