import {
  guidanceErrorMessage,
  parseLiveGuidanceRequest,
  verifyLiveGuidance,
} from "@/lib/tinyfish/guidance";
import { isAppLanguage, type AppLanguage } from "@/lib/i18n/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStore = {
  headers: {
    "Cache-Control": "no-store",
  },
};

function languageFromBody(body: unknown): AppLanguage | undefined {
  if (!body || typeof body !== "object") return undefined;
  const value = (body as Record<string, unknown>).language;
  return typeof value === "string" && isAppLanguage(value) ? value : undefined;
}

function messageFor(language: AppLanguage | undefined, copy: Record<"en" | "es" | "so", string>) {
  if (language === "so") return copy.so;
  if (language === "es") return copy.es;
  return copy.en;
}

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
    const language = languageFromBody(body);
    return Response.json(
      {
        error: {
          message: messageFor(language, {
            en: "Request is missing required blocker guidance fields.",
            es: "La solicitud no incluye los campos requeridos de guia del bloqueo.",
            so: "Codsigu ma hayo meelaha hagidda xannibaadda ee loo baahan yahay.",
          }),
        },
      },
      { status: 400, ...noStore },
    );
  }

  try {
    const result = await verifyLiveGuidance(guidanceRequest);
    return Response.json(result, noStore);
  } catch (error) {
    const message = guidanceErrorMessage(error, guidanceRequest.language);
    const status = message.includes("TINYFISH_API_KEY") ? 503 : 502;

    return Response.json(
      { error: { message } },
      { status, ...noStore },
    );
  }
}
