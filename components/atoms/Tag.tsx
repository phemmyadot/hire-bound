"use client";

import { COLORS } from "@/lib/constants";

interface Props {
  label: string;
  active: boolean;
  onClick?: () => void;
  title?: string;
  addPrefix?: boolean;
}

export function Tag({ label, active, onClick, title: tooltip, addPrefix }: Props) {
  return (
    <button
      onClick={onClick}
      title={tooltip}
      style={{
        fontSize: "10.5px",
        background: active ? COLORS.greenBg : "#1a0a0a",
        border: `1px solid ${active ? COLORS.greenDark : COLORS.redBorder}`,
        color: active ? "#4ade80" : COLORS.redDim,
        padding: "2px 7px",
        borderRadius: "3px",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      {addPrefix && (active ? "✓ " : "+ ")}
      {label}
    </button>
  );
}
