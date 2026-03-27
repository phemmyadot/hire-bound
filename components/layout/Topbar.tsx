"use client";

import { signOut } from "next-auth/react";
import { COLORS } from "@/lib/constants";
import { useResume } from "@/context/ResumeContext";
import { AppLogo } from "./AppLogo";

interface Props {
  onNew: () => void;
  onDownload: () => void;
}

const btn = (active = false): React.CSSProperties => ({
  background: active ? COLORS.surfaceAlt : "transparent",
  border: `1px solid ${active ? COLORS.borderMid : COLORS.border}`,
  borderRadius: "6px",
  color: active ? COLORS.text : COLORS.textMuted,
  cursor: "pointer",
  fontSize: "12px",
  fontFamily: "inherit",
  fontWeight: 500,
  padding: "4px 12px",
  whiteSpace: "nowrap" as const,
  transition: "all 0.15s",
});

export function Topbar({ onNew, onDownload }: Props) {
  const { ats, onSave, saving, savedId } = useResume();
  const { score, matched, missing } = ats;

  const atsColor = score >= 80 ? COLORS.green : score >= 60 ? COLORS.yellow : COLORS.red;

  return (
    <header
      style={{
        height: "48px",
        background: COLORS.bg,
        borderBottom: `1px solid ${COLORS.border}`,
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        gap: "12px",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <AppLogo />

      {/* Divider */}
      <div style={{ width: "1px", height: "20px", background: COLORS.border }} />

      {/* ATS score */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            background: COLORS.surface,
            border: `1px solid ${atsColor}33`,
            borderRadius: "6px",
            padding: "3px 9px",
          }}
        >
          <div
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: atsColor,
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: "11px", fontWeight: 600, color: atsColor }}>
            ATS {score}/100
          </span>
        </div>

        {(matched.length > 0 || missing.length > 0) && (
          <span style={{ fontSize: "11px", color: COLORS.textDim, display: "flex", gap: "8px" }}>
            {matched.length > 0 && (
              <span style={{ color: COLORS.green }}>✓ {matched.length}</span>
            )}
            {missing.length > 0 && (
              <span style={{ color: COLORS.redDim }}>✗ {missing.length}</span>
            )}
          </span>
        )}
      </div>

      <div style={{ flex: 1 }} />

      {/* Actions */}
      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
        <button onClick={onNew} style={btn()}>← New</button>

        <button onClick={onSave} disabled={saving} style={btn(!!savedId && !saving)}>
          {saving ? "Saving…" : savedId ? "✓ Saved" : "Save"}
        </button>

        <button
          onClick={onDownload}
          style={{
            background: COLORS.blue,
            border: "none",
            borderRadius: "6px",
            color: "#fff",
            cursor: "pointer",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 600,
            padding: "5px 14px",
            whiteSpace: "nowrap",
            transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
        >
          Export PDF
        </button>

        <div style={{ width: "1px", height: "20px", background: COLORS.border }} />

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          style={btn()}
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
