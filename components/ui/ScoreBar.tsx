"use client";

import { COLORS } from "@/lib/constants";

interface Props {
  score: number;
}

export function ScoreBar({ score }: Props) {
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#fbbf24" : "#ef4444";
  return (
    <div
      style={{
        background: COLORS.border,
        borderRadius: "4px",
        height: "5px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${score}%`,
          height: "100%",
          background: color,
          borderRadius: "4px",
          transition: "width 0.4s ease, background 0.3s",
        }}
      />
    </div>
  );
}
