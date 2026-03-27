"use client";

import { COLORS } from "@/lib/constants";
import type { CSSProperties, ReactNode } from "react";

type Variant = "default" | "primary" | "ghost" | "danger" | "dashed";

const VARIANTS: Record<Variant, CSSProperties> = {
  default: { background: COLORS.borderMid,  border: `1px solid ${COLORS.borderMid}`, color: COLORS.textMuted },
  primary: { background: COLORS.blue, border: "none", color: "#fff" },
  ghost:   { background: "transparent", border: `1px solid ${COLORS.border}`, color: COLORS.textDim },
  danger:  { background: "transparent", border: "none", color: COLORS.redDim },
  dashed:  { background: "transparent", border: `1px dashed #1e3a5f`, color: COLORS.blueLight },
};

interface Props {
  children: ReactNode;
  onClick?: () => void;
  variant?: Variant;
  disabled?: boolean;
  style?: CSSProperties;
}

export function Btn({ children, onClick, variant = "default", disabled, style }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...VARIANTS[variant],
        padding: "5px 12px",
        borderRadius: "6px",
        fontSize: "12px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        fontFamily: "inherit",
        transition: "all 0.15s",
        ...style,
      }}
    >
      {children}
    </button>
  );
}
