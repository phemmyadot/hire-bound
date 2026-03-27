"use client";

import { signOut, useSession } from "next-auth/react";
import { COLORS } from "@/lib/constants";
import { AppLogo } from "./AppLogo";
import type { ReactNode } from "react";

interface Props {
  /** Slot rendered between logo and right side (e.g. back button) */
  left?: ReactNode;
  /** Slot rendered on the right (defaults to email + sign out) */
  right?: ReactNode;
}

export function NavBar({ left, right }: Props) {
  const { data: session } = useSession();
  const email = session?.user?.email ?? "";

  return (
    <header
      style={{
        height: "48px",
        background: COLORS.bg,
        borderBottom: `1px solid ${COLORS.border}`,
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        gap: "16px",
        flexShrink: 0,
      }}
    >
      <AppLogo />

      {left && (
        <div style={{ display: "flex", alignItems: "center", marginLeft: "8px" }}>
          {left}
        </div>
      )}

      <div style={{ flex: 1 }} />

      {right ?? (
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {email && (
            <span style={{ fontSize: "12px", color: COLORS.textDim }}>{email}</span>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            style={{
              background: "transparent",
              border: `1px solid ${COLORS.border}`,
              borderRadius: "6px",
              color: COLORS.textDim,
              cursor: "pointer",
              fontSize: "12px",
              padding: "4px 12px",
              fontFamily: "inherit",
              transition: "border-color 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = COLORS.borderMid;
              (e.currentTarget as HTMLButtonElement).style.color = COLORS.textMuted;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = COLORS.border;
              (e.currentTarget as HTMLButtonElement).style.color = COLORS.textDim;
            }}
          >
            Sign out
          </button>
        </div>
      )}
    </header>
  );
}
