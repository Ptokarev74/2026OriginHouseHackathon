import "server-only";

import {
  fetchTinyFishContent,
  searchTinyFish,
  TinyFishConfigError,
  TinyFishHttpError,
  type TinyFishFetchResult,
  type TinyFishSearchResult,
} from "@/lib/tinyfish/client";
import { copyLanguage, isAppLanguage, type AppLanguage, type CopyLanguage } from "@/lib/i18n/types";
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

function localized(language: AppLanguage | undefined, copy: Record<CopyLanguage, string>) {
  return copy[language ? copyLanguage(language) : "en"];
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
  const language =
    typeof record.language === "string" && isAppLanguage(record.language)
      ? record.language
      : undefined;

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
    language,
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
    return localized(input.language, {
      en: "TinyFish did not return a public source that could be used for live guidance verification.",
      es: "TinyFish no devolvio una fuente publica que pudiera usarse para verificar la guia en vivo.",
      so: "TinyFish ma soo celin il dadweyne oo loo adeegsan karo xaqiijinta hagidda tooska ah.",
    });
  }

  const sourceCopy = localized(input.language, {
    en: `${sourceCount} public source${sourceCount === 1 ? "" : "s"}`,
    es: `${sourceCount} fuente${sourceCount === 1 ? "" : "s"} publica${sourceCount === 1 ? "" : "s"}`,
    so: sourceCount === 1 ? "1 il dadweyne" : `${sourceCount} ilo dadweyne`,
  });
  const officialCopy = officialCount > 0
    ? localized(input.language, {
        en: `, including ${officialCount} government source${officialCount === 1 ? "" : "s"}`,
        es: `, incluida${officialCount === 1 ? "" : "s"} ${officialCount} fuente${officialCount === 1 ? "" : "s"} gubernamental${officialCount === 1 ? "" : "es"}`,
        so: officialCount === 1
          ? ", oo ay ku jirto 1 il dowladeed"
          : `, oo ay ku jiraan ${officialCount} ilo dowladeed`,
      })
    : "";
  const actionCopy = input.shouldEscalate
    ? localized(input.language, {
        en: "Use the sources to confirm appeal, fair hearing, reinstatement, or manual-review channels before relying on a self-service packet.",
        es: "Usa las fuentes para confirmar canales de apelacion, audiencia imparcial, restablecimiento o revision manual antes de depender de un paquete de autoservicio.",
        so: "Isticmaal ilaha si aad u xaqiijiso racfaan, dhageysi cadaalad ah, soo celin, ama kanaalada dib-u-eegista gacanta ka hor intaadan ku tiirsanaan xirmo is-adeegsi ah.",
      })
    : localized(input.language, {
        en: `Use the sources to confirm the requested ${blocker} documentation, accepted submission channel, and confirmation requirements.`,
        es: `Usa las fuentes para confirmar la documentacion solicitada de ${blocker}, el canal de envio aceptado y los requisitos de confirmacion.`,
        so: `Isticmaal ilaha si aad u xaqiijiso dukumiintiyada ${blocker} ee la codsaday, kanaalka gudbinta la aqbalo, iyo shuruudaha xaqiijinta.`,
      });

  return localized(input.language, {
    en: `TinyFish verified live public-web guidance against ${sourceCopy}${officialCopy}. ${actionCopy}`,
    es: `TinyFish verifico la guia publica en vivo contra ${sourceCopy}${officialCopy}. ${actionCopy}`,
    so: `TinyFish wuxuu xaqiijiyay hagidda webka dadweynaha iyadoo lala barbar dhigay ${sourceCopy}${officialCopy}. ${actionCopy}`,
  });
}

function userSafeError(error: unknown, language?: AppLanguage) {
  if (error instanceof TinyFishConfigError) {
    return localized(language, {
      en: "TINYFISH_API_KEY is not configured on the server.",
      es: "TINYFISH_API_KEY no esta configurada en el servidor.",
      so: "TINYFISH_API_KEY laguma dejin server-ka.",
    });
  }

  if (error instanceof TinyFishHttpError) {
    if (error.status === 401) {
      return localized(language, {
        en: "TinyFish authentication failed. Check the server API key.",
        es: "Fallo la autenticacion de TinyFish. Revisa la clave API del servidor.",
        so: "Xaqiijinta TinyFish way fashilantay. Hubi furaha API ee server-ka.",
      });
    }
    if (error.status === 402 || error.status === 403) {
      return localized(language, {
        en: "TinyFish access is not enabled or credits are unavailable.",
        es: "El acceso a TinyFish no esta habilitado o no hay creditos disponibles.",
        so: "Gelitaanka TinyFish lama hawlgelin ama dhibco lama heli karo.",
      });
    }
    if (error.status === 429) {
      return localized(language, {
        en: "TinyFish rate limit was reached. Try again shortly.",
        es: "Se alcanzo el limite de TinyFish. Intenta de nuevo pronto.",
        so: "Xadka isticmaalka TinyFish ayaa la gaaray. Mar dhow isku day mar kale.",
      });
    }
    return localized(language, {
      en: `TinyFish returned HTTP ${error.status}.`,
      es: `TinyFish devolvio HTTP ${error.status}.`,
      so: `TinyFish wuxuu soo celiyay HTTP ${error.status}.`,
    });
  }

  if (error instanceof DOMException && error.name === "TimeoutError") {
    return localized(language, {
      en: "TinyFish request timed out.",
      es: "La solicitud a TinyFish agoto el tiempo.",
      so: "Codsiga TinyFish waqtigiisii wuu dhammaaday.",
    });
  }

  return localized(language, {
    en: "TinyFish guidance verification failed.",
    es: "Fallo la verificacion de guia de TinyFish.",
    so: "Xaqiijinta hagidda TinyFish way fashilantay.",
  });
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
        localized(input.language, {
          en: "No source was strong enough to cite; confirm directly with the notice, state Medicaid agency, or a qualified reviewer.",
          es: "Ninguna fuente fue suficientemente fuerte para citar; confirma directamente con el aviso, la agencia estatal de Medicaid o una persona revisora calificada.",
          so: "Ma jirin il ku filan oo la xigan karo; si toos ah ugu xaqiiji ogeysiiska, hay'adda Medicaid ee gobolka, ama qof dib-u-eegis aqoon leh.",
        }),
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
    errors.push(userSafeError(error, input.language));
  }

  return {
    status: sources.some((source) => source.excerpt || source.description) ? "verified" : "partial",
    query,
    generatedAt: new Date().toISOString(),
    summary: buildSummary(input, sources),
    caveats: [
      localized(input.language, {
        en: "This live check is informational and does not determine eligibility, provide legal advice, or replace official case-specific instructions.",
        es: "Esta revision en vivo es informativa y no determina elegibilidad, no da asesoria legal ni reemplaza instrucciones oficiales del caso.",
        so: "Hubintan tooska ah waa macluumaad keliya mana go'aamiso u-qalmitaan, ma bixiso talo sharci, mana beddesho tilmaamaha rasmiga ah ee kiiska.",
      }),
      localized(input.language, {
        en: "Always verify deadlines, appeal rights, and submission channels with the notice or the appropriate Medicaid agency.",
        es: "Siempre verifica fechas limite, derechos de apelacion y canales de envio con el aviso o la agencia de Medicaid correspondiente.",
        so: "Had iyo jeer ku xaqiiji waqtiyada kama dambaysta ah, xuquuqda racfaanka, iyo kanaalada gudbinta ogeysiiska ama hay'adda Medicaid ee ku habboon.",
      }),
    ],
    sources,
    errors,
  };
}

export function guidanceErrorMessage(error: unknown, language?: AppLanguage) {
  return userSafeError(error, language);
}
