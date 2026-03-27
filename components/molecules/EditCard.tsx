"use client";

import { COLORS } from "@/lib/constants";
import { Btn } from "@/components/atoms/Btn";
import type { ReactNode } from "react";

interface Props {
  title: string;
  onRemove?: () => void;
  children: ReactNode;
}

export function EditCard({ title, onRemove, children }: Props) {
  return (
    <div
      style={{
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: "10px",
        padding: "14px 16px",
        marginBottom: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <span style={{ fontSize: "12px", fontWeight: "600", color: COLORS.textMuted }}>
          {title}
        </span>
        {onRemove && (
          <Btn variant="danger" onClick={onRemove} style={{ fontSize: "10px", padding: "2px 6px" }}>
            Remove
          </Btn>
        )}
      </div>
      {children}
    </div>
  );
}
