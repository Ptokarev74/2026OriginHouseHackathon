import { getMockAgentStream } from "@/lib/tinyfish/mock";
import { streamSecureCare } from "@/lib/tinyfish/agent";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  const body = (await request.json()) as {
    contactUrl: string;
    providerName: string;
    specialty: string;
    insuranceType: string;
  };

  const apiKey = process.env.TINYFISH_API_KEY ?? "";
  const useMock = !apiKey || request.url.includes("mock=true");

  const headers = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  };

  if (useMock) {
    // Stream mock events with realistic per-event delays
    return new Response(getMockAgentStream() as unknown as ReadableStream<Uint8Array>, {
      headers,
    });
  }

  try {
    const agentStream = await streamSecureCare(
      {
        contactUrl: body.contactUrl,
        providerName: body.providerName,
        specialty: body.specialty,
        insuranceType: body.insuranceType,
        signal: request.signal,
      },
      apiKey,
    );

    return new Response(agentStream as unknown as ReadableStream<Uint8Array>, { headers });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    // On error, fall back to mock and include an error event first
    const errorEvent = JSON.stringify({
      type: "PROGRESS",
      run_id: "fallback",
      purpose: `⚠️ Live agent error: ${message} — switching to demo mode`,
    });
    const mockStream = getMockAgentStream();
    const errorChunk = `data: ${errorEvent}\n\n`;

    // Prepend the error event then continue with mock stream
    const combined = new ReadableStream<string>({
      async start(controller) {
        controller.enqueue(errorChunk);
        const reader = mockStream.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(value);
        }
        controller.close();
      },
    });

    return new Response(combined as unknown as ReadableStream<Uint8Array>, { headers });
  }
}
