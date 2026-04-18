import type { TinyFishAgentEvent } from "@/lib/types";

const AGENT_SSE_URL = "https://agent.tinyfish.ai/v1/automation/run-sse";

export interface StreamSecureCareOptions {
  contactUrl: string;
  providerName: string;
  specialty: string;
  insuranceType: string;
  /** Signal to abort the fetch request (passed from the Next.js route handler). */
  signal?: AbortSignal;
}

/**
 * Starts a TinyFish Agent run against the provider's contact/scheduling page.
 * The goal is written to stop before final form submission — safe for demo use.
 *
 * Returns a ReadableStream<string> of raw SSE lines so the API route can pipe
 * them straight through to the browser.
 */
export async function streamSecureCare(
  options: StreamSecureCareOptions,
  apiKey: string,
): Promise<ReadableStream<string>> {
  const { contactUrl, providerName, specialty, insuranceType, signal } = options;

  const goal = [
    `Navigate to ${contactUrl}.`,
    `Locate the contact form, new patient request form, or referral request form.`,
    `Fill in the following fields where present:`,
    `  Patient type: New patient`,
    `  Reason for visit: ${specialty} follow-up referral`,
    `  Insurance: ${insuranceType}`,
    `  Notes: Coverage-to-Care Rescue demo — do not submit`,
    `Do NOT click the final submit or send button.`,
    `Stop before submission and confirm which fields were filled.`,
    `Return a JSON object with: { provider: "${providerName}", fields_found: [...], fields_filled: [...], stopped_before_submit: true }`,
  ].join(" ");

  const response = await fetch(AGENT_SSE_URL, {
    method: "POST",
    headers: {
      "X-API-Key": apiKey,
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify({ url: contactUrl, goal }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`TinyFish Agent returned ${response.status}: ${await response.text()}`);
  }

  if (!response.body) {
    throw new Error("TinyFish Agent response has no body stream.");
  }

  // Decode bytes → UTF-8 strings and pass through
  return response.body.pipeThrough(new TextDecoderStream());
}

/** Parses a raw SSE line like `data: {...}` into a TinyFishAgentEvent. */
export function parseAgentSseLine(line: string): TinyFishAgentEvent | null {
  const trimmed = line.trim();
  if (!trimmed.startsWith("data:")) return null;
  const jsonStr = trimmed.slice(5).trim();
  try {
    return JSON.parse(jsonStr) as TinyFishAgentEvent;
  } catch {
    return null;
  }
}
