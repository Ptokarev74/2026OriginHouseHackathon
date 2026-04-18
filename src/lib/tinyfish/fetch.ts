import type { TinyFishFetchResult } from "@/lib/types";

const FETCH_BASE = "https://api.fetch.tinyfish.ai";

export interface FetchProviderPagesResponse {
  results: TinyFishFetchResult[];
  errors: { url: string; error: string }[];
}

/**
 * Uses TinyFish Fetch to render each provider URL and return clean markdown
 * text. Multiple URLs are batched in a single call. Failed URLs are returned
 * in the errors array rather than throwing.
 */
export async function fetchProviderPages(
  urls: string[],
  apiKey: string,
): Promise<FetchProviderPagesResponse> {
  const response = await fetch(FETCH_BASE, {
    method: "POST",
    headers: {
      "X-API-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      urls,
      format: "markdown",
      proxy_config: { country_code: "US" },
    }),
  });

  if (!response.ok) {
    throw new Error(`TinyFish Fetch returned ${response.status}: ${await response.text()}`);
  }

  return response.json() as Promise<FetchProviderPagesResponse>;
}
