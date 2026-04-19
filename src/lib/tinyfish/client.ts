import "server-only";

export type TinyFishSearchResult = {
  position: number;
  site_name?: string;
  title: string;
  snippet: string;
  url: string;
};

export type TinyFishSearchResponse = {
  query: string;
  results: TinyFishSearchResult[];
  total_results: number;
};

export type TinyFishFetchResult = {
  url: string;
  final_url?: string;
  title?: string;
  description?: string;
  language?: string;
  author?: string;
  published_date?: string;
  text: string | object;
  links?: string[];
  image_links?: string[];
  latency_ms?: number | null;
  format: "markdown" | "html" | "json";
};

export type TinyFishFetchError = {
  url: string;
  error: "timeout" | "bot_blocked" | "empty_content" | "invalid_url" | "proxy_error" | "fetch_error" | string;
};

export type TinyFishFetchResponse = {
  results: TinyFishFetchResult[];
  errors: TinyFishFetchError[];
};

type TinyFishApiErrorBody = {
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
};

export class TinyFishConfigError extends Error {
  constructor() {
    super("TinyFish is not configured.");
    this.name = "TinyFishConfigError";
  }
}

export class TinyFishHttpError extends Error {
  status: number;
  code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = "TinyFishHttpError";
    this.status = status;
    this.code = code;
  }
}

const searchEndpoint = "https://api.search.tinyfish.ai";
const fetchEndpoint = "https://api.fetch.tinyfish.ai";

function getApiKey() {
  const apiKey = process.env.TINYFISH_API_KEY?.trim();
  if (!apiKey) {
    throw new TinyFishConfigError();
  }
  return apiKey;
}

async function parseError(response: Response) {
  let body: TinyFishApiErrorBody | undefined;

  try {
    body = (await response.json()) as TinyFishApiErrorBody;
  } catch {
    body = undefined;
  }

  const message = body?.error?.message ?? `TinyFish request failed with HTTP ${response.status}.`;
  throw new TinyFishHttpError(response.status, message, body?.error?.code);
}

export async function searchTinyFish({
  query,
  location = "US",
  language = "en",
}: {
  query: string;
  location?: string;
  language?: string;
}) {
  const url = new URL(searchEndpoint);
  url.searchParams.set("query", query);
  url.searchParams.set("location", location);
  url.searchParams.set("language", language);

  const response = await fetch(url, {
    headers: {
      "X-API-Key": getApiKey(),
    },
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  });

  if (!response.ok) {
    await parseError(response);
  }

  return (await response.json()) as TinyFishSearchResponse;
}

export async function fetchTinyFishContent(urls: string[]) {
  const response = await fetch(fetchEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": getApiKey(),
    },
    body: JSON.stringify({
      urls: urls.slice(0, 10),
      format: "markdown",
      links: false,
      image_links: false,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(45_000),
  });

  if (!response.ok) {
    await parseError(response);
  }

  return (await response.json()) as TinyFishFetchResponse;
}
