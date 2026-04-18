"use client";

import type { LiveProvider } from "@/lib/types";

interface LiveProviderCardProps {
  provider: LiveProvider;
  rank: number;
  isSelected: boolean;
  onSelectSecureCare: (provider: LiveProvider) => void;
}

export function LiveProviderCard({
  provider,
  rank,
  isSelected,
  onSelectSecureCare,
}: LiveProviderCardProps) {
  return (
    <div
      style={{
        background: isSelected
          ? "linear-gradient(135deg, rgba(99,179,237,0.12) 0%, rgba(49,130,206,0.08) 100%)"
          : "rgba(255,255,255,0.04)",
        border: isSelected
          ? "1.5px solid rgba(99, 179, 237, 0.5)"
          : "1px solid rgba(255,255,255,0.1)",
        borderRadius: "14px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        transition: "all 0.2s ease",
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              background: "linear-gradient(135deg, #2b6cb0, #4299e1)",
              color: "#fff",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "14px",
              flexShrink: 0,
            }}
          >
            {rank}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#e2e8f0", fontWeight: 700, fontSize: "16px" }}>
                {provider.provider_name}
              </span>
              <span
                style={{
                  background: provider.source === "live"
                    ? "rgba(72, 187, 120, 0.15)"
                    : "rgba(237, 137, 54, 0.15)",
                  border: provider.source === "live"
                    ? "1px solid rgba(72, 187, 120, 0.4)"
                    : "1px solid rgba(237, 137, 54, 0.4)",
                  color: provider.source === "live" ? "#48bb78" : "#ed8936",
                  borderRadius: "5px",
                  padding: "1px 7px",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                }}
              >
                {provider.source === "live" ? "🌐 LIVE" : "🔶 DEMO"}
              </span>
            </div>
            <div style={{ color: "#63b3ed", fontSize: "13px", marginTop: "2px" }}>
              {provider.specialty}
            </div>
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
          fontSize: "13px",
        }}
      >
        <Detail icon="📍" label="Address" value={provider.address} />
        <Detail icon="📞" label="Phone" value={provider.phone} />
        <Detail icon="📅" label="Availability" value={provider.availability_hint} />
        <Detail icon="💰" label="Cost" value={provider.price_hint} />
        <div style={{ gridColumn: "1 / -1" }}>
          <Detail icon="🏥" label="Insurance Accepted" value={provider.insurance_acceptance} />
        </div>
      </div>

      {/* Source URL */}
      <div style={{ fontSize: "11px", color: "#4a5568" }}>
        Source:{" "}
        <a
          href={provider.source_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#63b3ed", textDecoration: "underline" }}
        >
          {provider.source_url}
        </a>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {provider.scheduling_url && (
          <a
            href={provider.scheduling_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "rgba(49, 130, 206, 0.15)",
              border: "1px solid rgba(49, 130, 206, 0.35)",
              color: "#90cdf4",
              borderRadius: "8px",
              padding: "7px 14px",
              fontSize: "13px",
              textDecoration: "none",
              fontWeight: 600,
              transition: "background 0.15s ease",
            }}
          >
            🗓 Schedule
          </a>
        )}
        <button
          onClick={() => onSelectSecureCare(provider)}
          style={{
            background: isSelected
              ? "linear-gradient(135deg, #2b6cb0, #4299e1)"
              : "rgba(72, 187, 120, 0.12)",
            border: isSelected
              ? "none"
              : "1px solid rgba(72, 187, 120, 0.4)",
            color: isSelected ? "#fff" : "#68d391",
            borderRadius: "8px",
            padding: "7px 16px",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.18s ease",
          }}
        >
          {isSelected ? "✅ Securing Care…" : "🛡 Secure Care"}
        </button>
      </div>
    </div>
  );
}

function Detail({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div>
      <div style={{ color: "#4a5568", fontSize: "11px", letterSpacing: "0.04em", marginBottom: "2px" }}>
        {icon} {label.toUpperCase()}
      </div>
      <div style={{ color: "#a0aec0", lineHeight: 1.4 }}>{value || "—"}</div>
    </div>
  );
}
