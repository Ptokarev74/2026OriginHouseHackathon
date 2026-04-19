import {
  guidanceErrorMessage,
  parseLiveGuidanceRequest,
  verifyLiveGuidance,
} from "@/lib/tinyfish/guidance";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStore = {
  headers: {
    "Cache-Control": "no-store",
  },
};

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: { message: "Request body must be valid JSON." } },
      { status: 400, ...noStore },
    );
  }

  const guidanceRequest = parseLiveGuidanceRequest(body);
  if (!guidanceRequest) {
    return Response.json(
      { error: { message: "Request is missing required blocker guidance fields." } },
      { status: 400, ...noStore },
    );
  }

  try {
    const result = await verifyLiveGuidance(guidanceRequest);
    return Response.json(result, noStore);
  } catch (error) {
    const message = guidanceErrorMessage(error);
    const status = message.includes("TINYFISH_API_KEY") ? 503 : 502;

    return Response.json(
      { error: { message } },
      { status, ...noStore },
    );
  }
}
