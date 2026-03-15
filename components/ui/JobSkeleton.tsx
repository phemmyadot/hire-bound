"use client";

import { COLORS } from "@/lib/constants";
import { Skeleton } from "./Skeleton";

interface Props {
  delay?: number;
}

export function JobSkeleton({ delay = 0 }: Props) {
  return (
    <div
      style={{
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: "10px",
        padding: "18px 20px",
        animation: `pulse 1.4s ease-in-out ${delay}s infinite`,
      }}
    >
      <div
        style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}
      >
        <Skeleton width="200px" height="14px" />
        <Skeleton width="60px" height="14px" />
      </div>
      <Skeleton width="140px" height="11px" />
      <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
        <Skeleton width="80px" height="22px" />
        <Skeleton width="60px" height="22px" />
        <Skeleton width="70px" height="22px" />
      </div>
    </div>
  );
}
