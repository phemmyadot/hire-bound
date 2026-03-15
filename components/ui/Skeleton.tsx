"use client";

import { COLORS } from "@/lib/constants";

interface Props {
  width?: string;
  height?: string;
}

export function Skeleton({ width = "100%", height = "12px" }: Props) {
  return (
    <div
      style={{
        width,
        height,
        background: COLORS.border,
        borderRadius: "4px",
        animation: "pulse 1.4s ease-in-out infinite",
      }}
    />
  );
}
