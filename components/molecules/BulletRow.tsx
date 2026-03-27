"use client";

import { COLORS } from "@/lib/constants";
import { Btn } from "@/components/atoms/Btn";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onRemove: () => void;
}

export function BulletRow({ value, onChange, onRemove }: Props) {
  return (
    <div style={{ display: "flex", gap: "6px", marginBottom: "6px", alignItems: "flex-start" }}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        style={{
          flex: 1,
          background: COLORS.surfaceAlt,
          border: `1px solid ${COLORS.border}`,
          borderRadius: "5px",
          color: COLORS.text,
          padding: "6px 8px",
          fontSize: "12px",
          fontFamily: "inherit",
          resize: "vertical",
          outline: "none",
        }}
      />
      <Btn variant="danger" onClick={onRemove} style={{ padding: "4px 6px", fontSize: "14px" }}>
        ✕
      </Btn>
    </div>
  );
}
