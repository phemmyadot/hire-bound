"use client";

import { COLORS } from "@/lib/constants";

interface Props {
  score: number;
}

export function AtsBadge({ score }: Props) {
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#fbbf24" : "#ef4444";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
        background: COLORS.surface,
        border: `1px solid ${color}44`,
        borderRadius: "20px",
        padding: "3px 10px",
      }}
    >
      <div
        style={{
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          background: color,
          transition: "background 0.3s",
        }}
      />
      <span
        style={{
          fontSize: "11px",
          fontWeight: "600",
          color,
          transition: "color 0.3s",
        }}
      >
        ATS {score}/100
      </span>
    </div>
  );
}
