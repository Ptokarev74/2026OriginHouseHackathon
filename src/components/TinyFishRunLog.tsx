"use client";

import type { TinyFishAgentEvent, WorkflowRunMode } from "@/lib/types";
import { useEffect, useRef } from "react";

interface TinyFishRunLogProps {
  events: TinyFishAgentEvent[];
  isStreaming: boolean;
  mode: WorkflowRunMode;
  log?: string[];
  phase: "discover" | "secure_care" | "idle";
}

function eventIcon(event: TinyFishAgentEvent): string {
  switch (event.type) {
    case "STARTED":
      return "🚀";
    case "PROGRESS":
      return "⚙️";
    case "COMPLETE":
      return event.status === "COMPLETED" ? "✅" : "⚠️";
    case "ERROR":
      return "❌";
    default:
      return "•";
  }
}

export function TinyFishRunLog({
  events,
  isStreaming,
  mode,
  log = [],
  phase,
}: TinyFishRunLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events.length, log.length]);

  if (phase === "idle" && events.length === 0 && log.length === 0) return null;

  return (
    <div
      style={{
        background: "rgba(10, 15, 30, 0.85)",
        border: "1px solid rgba(99, 179, 237, 0.25)",
        borderRadius: "14px",
        padding: "20px",
        marginTop: "24px",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontSize: "13px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "14px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "18px" }}>
            {phase === "discover" ? "🔍" : phase === "secure_care" ? "🤖" : "📋"}
          </span>
          <span
            style={{
              color: "#63b3ed",
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              fontSize: "11px",
            }}
          >
            TinyFish Run Log —{" "}
            {phase === "discover"
              ? "Provider Discovery"
              : phase === "secure_care"
                ? "Secure Care Agent"
                : "Log"}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {mode === "mock" && (
            <span
              style={{
                background: "rgba(237, 137, 54, 0.15)",
                border: "1px solid rgba(237, 137, 54, 0.4)",
                color: "#ed8936",
                borderRadius: "6px",
                padding: "2px 8px",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.08em",
              }}
            >
              🔶 DEMO MODE
            </span>
          )}
          {mode === "live" && (
            <span
              style={{
                background: "rgba(72, 187, 120, 0.15)",
                border: "1px solid rgba(72, 187, 120, 0.4)",
                color: "#48bb78",
                borderRadius: "6px",
                padding: "2px 8px",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.08em",
              }}
            >
              🌐 LIVE
            </span>
          )}
          {isStreaming && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                color: "#90cdf4",
                fontSize: "10px",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#90cdf4",
                  animation: "pulse 1.2s ease-in-out infinite",
                }}
              />
              Streaming
            </span>
          )}
        </div>
      </div>

      {/* Discovery log lines */}
      {log.length > 0 && (
        <div style={{ marginBottom: "12px" }}>
          {log.map((line, i) => (
            <div
              key={i}
              style={{
                color: line.startsWith("❌")
                  ? "#fc8181"
                  : line.startsWith("✅")
                    ? "#68d391"
                    : line.startsWith("🔶")
                      ? "#ed8936"
                      : "#a0aec0",
                padding: "3px 0",
                lineHeight: 1.6,
              }}
            >
              {line}
            </div>
          ))}
        </div>
      )}

      {/* Agent SSE events */}
      {events.length > 0 && (
        <div
          style={{
            maxHeight: "260px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          {events.map((event, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                padding: "6px 10px",
                borderRadius: "8px",
                background:
                  event.type === "COMPLETE"
                    ? "rgba(72, 187, 120, 0.08)"
                    : event.type === "ERROR"
                      ? "rgba(252, 129, 129, 0.08)"
                      : "rgba(255, 255, 255, 0.03)",
                borderLeft:
                  event.type === "COMPLETE"
                    ? "3px solid #48bb78"
                    : event.type === "ERROR"
                      ? "3px solid #fc8181"
                      : "3px solid rgba(99, 179, 237, 0.3)",
              }}
            >
              <span style={{ flexShrink: 0 }}>{eventIcon(event)}</span>
              <div style={{ flex: 1 }}>
                <span
                  style={{
                    color:
                      event.type === "COMPLETE"
                        ? "#68d391"
                        : event.type === "ERROR"
                          ? "#fc8181"
                          : "#cbd5e0",
                    lineHeight: 1.5,
                  }}
                >
                  {event.purpose ??
                    (event.type === "STARTED"
                      ? `Agent started — run ID: ${event.run_id}`
                      : event.type === "COMPLETE"
                        ? `Agent complete — status: ${event.status}`
                        : event.type)}
                </span>
                {event.type === "COMPLETE" && event.result && (
                  <div
                    style={{
                      marginTop: "6px",
                      padding: "8px",
                      background: "rgba(0,0,0,0.3)",
                      borderRadius: "6px",
                      color: "#68d391",
                      fontSize: "11px",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {JSON.stringify(event.result, null, 2)}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isStreaming && (
            <div
              style={{
                color: "#4a5568",
                padding: "4px 10px",
                fontSize: "11px",
                fontStyle: "italic",
              }}
            >
              ⏳ Waiting for next event…
            </div>
          )}
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
