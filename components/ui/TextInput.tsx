"use client";

import { COLORS } from "@/lib/constants";
import type { CSSProperties } from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  style?: CSSProperties;
}

export function TextInput({ value, onChange, placeholder, style }: Props) {
  return (
    <input
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || ""}
      style={{
        width: "100%",
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: "6px",
        color: COLORS.text,
        padding: "7px 10px",
        fontSize: "12.5px",
        outline: "none",
        ...style,
      }}
    />
  );
}
