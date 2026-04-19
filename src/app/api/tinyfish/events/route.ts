import { NextResponse } from "next/server";
import type { ReasoningEvent } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const event = (await request.json()) as ReasoningEvent;

    if (!event.id || !event.stepName || !event.message) {
      return NextResponse.json(
        { error: { message: "Invalid event payload." } },
        { status: 400 },
      );
    }

    // placeholder: validate API key against process.env.TINYFISH_API_KEY
    // placeholder: push the event to your external orchestration backend

    return NextResponse.json({ success: true, receivedId: event.id });
  } catch {
    return NextResponse.json(
      { error: { message: "Request body must be valid JSON." } },
      { status: 400 },
    );
  }
}
