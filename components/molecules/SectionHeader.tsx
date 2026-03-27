"use client";

import { COLORS } from "@/lib/constants";

interface Props {
  title: string;
  onAdd?: () => void;
  addLabel?: string;
}

export function SectionHeader({ title, onAdd, addLabel }: Props) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "12px",
        marginTop: "24px",
      }}
    >
      <div
        style={{
          fontSize: "10px",
          fontWeight: "700",
          letterSpacing: "2px",
          textTransform: "uppercase",
          color: COLORS.textFaint,
        }}
      >
        {title}
      </div>
      {onAdd && (
        <button
          onClick={onAdd}
          style={{
            fontSize: "11px",
            padding: "3px 10px",
            background: COLORS.borderMid,
            border: `1px solid ${COLORS.borderMid}`,
            color: COLORS.textMuted,
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          + {addLabel || "Add"}
        </button>
      )}
    </div>
  );
}
