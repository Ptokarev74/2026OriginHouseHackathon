import type { TinyFishSearchResult } from "@/lib/types";

const SEARCH_BASE = "https://api.search.tinyfish.ai";

export interface SearchProvidersOptions {
  specialty: string;
  zip: string;
  insuranceType: string;
  maxResults?: number;
}

export interface SearchProvidersResponse {
  query: string;
  results: TinyFishSearchResult[];
  total_results: number;
}

/**
 * Uses TinyFish Search to find provider and network directory pages for the
 * given specialty, ZIP, and insurance type. Returns raw search results with
 * URL, title, and snippet — ready to pass into fetchProviderPages().
 */
export async function searchProviders(
  options: SearchProvidersOptions,
  apiKey: string,
): Promise<SearchProvidersResponse> {
  const { specialty, zip, insuranceType, maxResults = 5 } = options;
  const query = `${specialty} doctor near ${zip} accepts ${insuranceType} new patients`;

  const url = new URL(SEARCH_BASE);
  url.searchParams.set("q", query);
  url.searchParams.set("num", String(maxResults));

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "X-API-Key": apiKey,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`TinyFish Search returned ${response.status}: ${await response.text()}`);
  }

  return response.json() as Promise<SearchProvidersResponse>;
}
