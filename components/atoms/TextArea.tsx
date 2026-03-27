"use client";

import { COLORS } from "@/lib/constants";
import type { CSSProperties } from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  style?: CSSProperties;
}

export function TextArea({ value, onChange, placeholder, rows = 3, style }: Props) {
  return (
    <textarea
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || ""}
      rows={rows}
      style={{
        width: "100%",
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: "6px",
        color: COLORS.text,
        padding: "8px 10px",
        fontSize: "12.5px",
        fontFamily: "inherit",
        resize: "vertical",
        outline: "none",
        lineHeight: "1.6",
        ...style,
      }}
    />
  );
}
