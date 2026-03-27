"use client";

import { COLORS } from "@/lib/constants";
import { AppLogo } from "@/components/layout/AppLogo";

interface Props {
  msg: string;
  hasJD: boolean;
}

export function ProcessingScreen({ msg, hasJD }: Props) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "24px",
        fontFamily: "'Inter',-apple-system,sans-serif",
        color: COLORS.text,
      }}
    >
      <AppLogo />

      {/* Spinner */}
      <div style={{ position: "relative", width: "48px", height: "48px" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: `2px solid ${COLORS.border}`,
            borderTopColor: COLORS.blue,
            animation: "spin 0.9s linear infinite",
          }}
        />
      </div>

      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "14px", fontWeight: 600, color: COLORS.text, marginBottom: "4px" }}>
          {msg}
        </div>
        <div style={{ fontSize: "12px", color: COLORS.textDim }}>
          {hasJD ? "Tailoring to job description…" : "Optimizing for ATS…"}
        </div>
      </div>

      <div style={{ display: "flex", gap: "5px" }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: COLORS.blue,
              opacity: 0.4,
              animation: `pulseDot 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
