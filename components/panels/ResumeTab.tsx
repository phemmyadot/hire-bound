"use client";

import { useRef, type RefObject } from "react";
import { COLORS } from "@/lib/constants";
import { useResume } from "@/context/ResumeContext";
import { TEMPLATES } from "@/lib/templates";

interface Props {
  iframeRef: RefObject<HTMLIFrameElement | null>;
}

export function ResumeTab({ iframeRef }: Props) {
  const { resume, ats, activeTemplate } = useResume();
  const { editData, activeSkills } = resume;
  const { score, color } = ats;

  const previewHtml = editData ? TEMPLATES[activeTemplate].render(editData, activeSkills) : "";

  return (
    <>
      <div
        style={{
          padding: "5px 14px",
          background: "#e2e8f0",
          borderBottom: "1px solid #cbd5e1",
          fontSize: "11px",
          color: "#64748b",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", gap: "4px" }}>
          {["#fc8181", "#fbbf24", "#34d399"].map((c) => (
            <div
              key={c}
              style={{ width: "8px", height: "8px", borderRadius: "50%", background: c }}
            />
          ))}
        </div>
        {TEMPLATES[activeTemplate].name} Template · ATS{" "}
        <strong style={{ color }}>{score}/100</strong> · All templates ATS-safe
      </div>
      <iframe
        ref={iframeRef}
        srcDoc={`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>@media print{@page{margin:0.5in;size:letter}}</style></head><body>${previewHtml}</body></html>`}
        style={{ flex: 1, border: "none", width: "100%" }}
        title="Resume Preview"
      />
    </>
  );
}
