"use client";

import { COLORS } from "@/lib/constants";

interface Props {
  label: string;
  onRemove: () => void;
}

export function SkillPill({ label, onRemove }: Props) {
  return (
    <button
      onClick={onRemove}
      title="Click to remove"
      style={{
        fontSize: "11.5px",
        background: COLORS.greenBg,
        border: `1px solid ${COLORS.greenDark}`,
        color: "#4ade80",
        padding: "4px 10px",
        borderRadius: "4px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "5px",
        transition: "all 0.15s",
      }}
    >
      {label}{" "}
      <span style={{ color: COLORS.textFaint, fontSize: "10px" }}>✕</span>
    </button>
  );
}
