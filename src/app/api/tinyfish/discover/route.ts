import { fetchProviderPages } from "@/lib/tinyfish/fetch";
import { getMockDiscoveryResult } from "@/lib/tinyfish/mock";
import { normalizeFetchedPages } from "@/lib/tinyfish/normalize";
import { searchProviders } from "@/lib/tinyfish/search";
import type { ProviderDiscoveryResult } from "@/lib/types";
import { NextResponse } from "next/server";


export const runtime = "nodejs";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as {
    specialty: string;
    zip: string;
    insuranceType: string;
  };

  const apiKey = process.env.TINYFISH_API_KEY ?? "";
  const useMock = !apiKey || request.url.includes("mock=true");

  if (useMock) {
    return NextResponse.json(getMockDiscoveryResult());
  }

  const log: string[] = [];

  try {
    // Step 1 — Search
    log.push(`🔍 Searching: ${body.specialty} near ${body.zip} accepts ${body.insuranceType}`);
    const searchResponse = await searchProviders(
      { specialty: body.specialty, zip: body.zip, insuranceType: body.insuranceType },
      apiKey,
    );
    const searchUrls = searchResponse.results.slice(0, 4).map((r) => r.url);
    log.push(`Found ${searchUrls.length} provider URLs from live search`);

    // Step 2 — Fetch
    log.push(`📄 Fetching content from ${searchUrls.length} pages…`);
    const fetchResponse = await fetchProviderPages(searchUrls, apiKey);
    log.push(
      `Fetched ${fetchResponse.results.length} pages (${fetchResponse.errors.length} errors)`,
    );

    // Step 3 — Normalize
    const providers = normalizeFetchedPages(fetchResponse.results, "live");
    log.push(`✅ Normalized ${providers.length} live providers`);

    const result: ProviderDiscoveryResult = {
      providers,
      mode: "live",
      searchUrls,
      log,
    };

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    log.push(`❌ TinyFish error: ${message} — falling back to mock`);

    const fallback = getMockDiscoveryResult();
    return NextResponse.json({ ...fallback, log: [...log, ...fallback.log] });
  }
}
