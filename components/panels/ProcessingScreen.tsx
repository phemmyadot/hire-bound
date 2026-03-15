"use client";

import { COLORS } from "@/lib/constants";

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
        gap: "20px",
        fontFamily: "'Inter',-apple-system,sans-serif",
        color: COLORS.text,
      }}
    >
      <div style={{ position: "relative", width: "58px", height: "58px" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "2px solid transparent",
            borderTopColor: COLORS.blue,
            borderRightColor: COLORS.purple,
            animation: "spin 1s linear infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: "10px",
            borderRadius: "50%",
            background: COLORS.surface,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
          }}
        >
          ✨
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "15px", fontWeight: "600", marginBottom: "5px" }}>{msg}</div>
        <div style={{ fontSize: "12px", color: COLORS.textDim }}>
          {hasJD ? "Tailoring to job description…" : "Optimizing for ATS…"}
        </div>
      </div>

      <div style={{ display: "flex", gap: "5px" }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: COLORS.blue,
              animation: `pulseDot 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
