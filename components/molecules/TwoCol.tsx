"use client";

import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function TwoCol({ children }: Props) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
      {children}
    </div>
  );
}
