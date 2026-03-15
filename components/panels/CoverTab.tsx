"use client";

import { useState } from "react";
import { COLORS } from "@/lib/constants";
import { useResume } from "@/context/ResumeContext";
import { Btn } from "@/components/ui";

export function CoverTab() {
  const { resume, jobDesc } = useResume();
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(resume.resumeData?.coverLetter || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{ flex: 1, overflow: "auto", padding: "28px 36px", animation: "fadeIn 0.2s ease" }}
    >
      <div style={{ maxWidth: "660px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <div>
            <h2 style={{ fontSize: "19px", fontWeight: "700", marginBottom: "3px" }}>
              Cover Letter
            </h2>
            <p style={{ color: COLORS.textDim, fontSize: "12.5px" }}>
              {jobDesc.trim() ? "Tailored to the job description" : "General role"} · Ready to
              personalize
            </p>
          </div>
          <Btn
            onClick={copy}
            style={{
              padding: "7px 16px",
              background: copied ? "#0a1a0a" : COLORS.borderMid,
              border: `1px solid ${copied ? "#22c55e" : COLORS.borderMid}`,
              color: copied ? "#4ade80" : COLORS.textMuted,
            }}
          >
            {copied ? "✓ Copied!" : "Copy Text"}
          </Btn>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "10px",
            padding: "44px 50px",
            boxShadow: "0 4px 28px rgba(0,0,0,0.5)",
            minHeight: "480px",
          }}
        >
          <div
            style={{
              fontFamily: "Georgia,serif",
              fontSize: "13.5px",
              lineHeight: "2",
              color: "#1a1a1a",
              whiteSpace: "pre-wrap",
            }}
          >
            {resume.resumeData?.coverLetter || "Cover letter unavailable."}
          </div>
        </div>
      </div>
    </div>
  );
}
