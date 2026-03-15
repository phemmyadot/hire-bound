"use client";

import { COLORS, PRIORITY } from "@/lib/constants";
import type { Suggestion } from "@/lib/types";

interface Props {
  item: Suggestion;
  index: number;
}

export function PriorityCard({ item, index }: Props) {
  const p = PRIORITY[item.priority] || PRIORITY.low;
  return (
    <div
      style={{
        background: p.bg,
        border: `1px solid ${p.border}`,
        borderRadius: "10px",
        padding: "14px 16px",
        animation: `fadeIn 0.3s ease ${index * 0.06}s both`,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
        <div
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: p.dot,
            marginTop: "5px",
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              marginBottom: "5px",
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: "13px", fontWeight: "600", color: COLORS.text }}>
              {item.title}
            </span>
            <span
              style={{
                fontSize: "9.5px",
                background: `${p.border}66`,
                color: p.text,
                padding: "2px 7px",
                borderRadius: "10px",
                textTransform: "uppercase",
              }}
            >
              {item.priority}
            </span>
            <span style={{ fontSize: "10px", color: COLORS.textFaint }}>{item.category}</span>
          </div>
          <p style={{ fontSize: "12px", color: COLORS.textMuted, lineHeight: "1.65", margin: 0 }}>
            {item.reason}
          </p>
        </div>
      </div>
    </div>
  );
}
