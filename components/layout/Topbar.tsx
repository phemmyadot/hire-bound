"use client";

import { COLORS } from "@/lib/constants";
import { useResume } from "@/context/ResumeContext";
import { AtsBadge, Btn } from "@/components/ui";
import { AppLogo } from "./AppLogo";

interface Props {
  onNew: () => void;
  onDownload: () => void;
}

export function Topbar({ onNew, onDownload }: Props) {
  const { ats } = useResume();
  const { score, matched, missing } = ats;

  return (
    <div
      style={{
        borderBottom: `1px solid ${COLORS.border}`,
        padding: "0 14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "46px",
        background: "#0b1220",
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <AppLogo />
        <AtsBadge score={score} />
        {(matched.length > 0 || missing.length > 0) && (
          <span style={{ fontSize: "11px", color: COLORS.textDim, display: "flex", gap: "6px" }}>
            <span style={{ color: "#4ade80" }}>✓ {matched.length} matched</span>
            {missing.length > 0 && (
              <span style={{ color: COLORS.redDim }}>✗ {missing.length} missing</span>
            )}
          </span>
        )}
      </div>
      <div style={{ display: "flex", gap: "6px" }}>
        <Btn variant="ghost" onClick={onNew} style={{ padding: "4px 12px", fontSize: "11px" }}>
          ← New
        </Btn>
        <Btn variant="primary" onClick={onDownload} style={{ padding: "4px 14px", fontSize: "11px" }}>
          ⬇ Save as PDF
        </Btn>
      </div>
    </div>
  );
}
