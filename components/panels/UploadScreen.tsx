"use client";

import { useRef } from "react";
import { signOut } from "next-auth/react";
import { COLORS } from "@/lib/constants";
import { useResume } from "@/context/ResumeContext";
import { Btn } from "@/components/ui";
import { AppLogo } from "@/components/layout/AppLogo";

export function UploadScreen() {
  const { jobDesc, setJobDesc, file, processor } = useResume();
  const { resumeText, setResumeText, fileName, isDragging, setIsDragging, readFile, pendingFile } =
    file;
  const fileRef = useRef<HTMLInputElement>(null);

  const canSubmit = resumeText.trim() || pendingFile;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) readFile(f);
  };

  const handleSubmit = () => {
    if (pendingFile) processor.process(null, pendingFile.base64, pendingFile.mimeType);
    else if (resumeText.trim()) processor.process(resumeText, null, null);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.bg,
        fontFamily: "'Inter',-apple-system,sans-serif",
        color: COLORS.text,
      }}
    >
      {/* Topbar */}
      <div
        style={{
          borderBottom: `1px solid ${COLORS.border}`,
          padding: "0 28px",
          display: "flex",
          alignItems: "center",
          height: "50px",
          background: "#0b1220",
        }}
      >
        <AppLogo />
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          style={{
            marginLeft: "auto",
            background: "transparent",
            border: "none",
            color: COLORS.textDim,
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          Sign out
        </button>
      </div>

      {/* Hero */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 50px)",
          padding: "32px 20px",
        }}
      >
        <div style={{ maxWidth: "640px", width: "100%" }}>
          <div
            style={{
              fontSize: "10px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: COLORS.blue,
              marginBottom: "12px",
              textAlign: "center",
            }}
          >
            ATS-Optimized Resume Generator
          </div>
          <h1
            style={{
              fontSize: "38px",
              fontWeight: "800",
              letterSpacing: "-2px",
              lineHeight: "1.1",
              marginBottom: "10px",
              textAlign: "center",
              background: "linear-gradient(135deg,#e2e8f0,#94a3b8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Upload resume.
            <br />
            Get the job.
          </h1>
          <p
            style={{
              color: COLORS.textDim,
              fontSize: "13.5px",
              marginBottom: "32px",
              textAlign: "center",
              lineHeight: "1.7",
            }}
          >
            Paste a job description for tailored keyword matching, ATS scoring, cover letter, and
            career tips.
          </p>

          {/* Two-column input */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px",
              marginBottom: "12px",
            }}
          >
            {/* Resume upload */}
            <div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  color: COLORS.textMuted,
                  marginBottom: "8px",
                }}
              >
                RESUME <span style={{ color: COLORS.red }}>*</span>
              </div>
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                style={{
                  border: `2px dashed ${isDragging ? COLORS.blue : COLORS.border}`,
                  borderRadius: "10px",
                  padding: "24px 16px",
                  cursor: "pointer",
                  textAlign: "center",
                  background: isDragging ? "#0f1f3d" : COLORS.surface,
                  transition: "all 0.2s",
                  minHeight: "110px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "5px",
                }}
              >
                <div style={{ fontSize: "26px" }}>📄</div>
                <div
                  style={{
                    color: fileName ? "#4ade80" : COLORS.text,
                    fontWeight: "600",
                    fontSize: "12.5px",
                  }}
                >
                  {fileName || "Drop file here"}
                </div>
                <div style={{ color: COLORS.textFaint, fontSize: "11px" }}>PDF · TXT · DOCX</div>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.txt,.doc,.docx,.md"
                  style={{ display: "none" }}
                  onChange={(e) => e.target.files?.[0] && readFile(e.target.files[0])}
                />
              </div>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="...or paste resume text here"
                style={{
                  width: "100%",
                  height: "76px",
                  marginTop: "8px",
                  background: COLORS.surface,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: "8px",
                  color: COLORS.text,
                  padding: "10px 12px",
                  fontSize: "11.5px",
                  fontFamily: "monospace",
                  resize: "none",
                  outline: "none",
                  lineHeight: "1.5",
                }}
              />
            </div>

            {/* Job description */}
            <div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  color: COLORS.textMuted,
                  marginBottom: "8px",
                }}
              >
                JOB DESCRIPTION{" "}
                <span style={{ color: COLORS.textFaint, fontWeight: "400" }}>(recommended)</span>
              </div>
              <textarea
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                placeholder="Paste the full job description. Claude will tailor keywords, bullets, cover letter, and ATS score to this role."
                style={{
                  width: "100%",
                  height: "218px",
                  background: COLORS.surface,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: "10px",
                  color: COLORS.text,
                  padding: "12px 14px",
                  fontSize: "12px",
                  lineHeight: "1.65",
                  resize: "none",
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
            </div>
          </div>

          <Btn
            variant="primary"
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{
              width: "100%",
              padding: "13px",
              fontSize: "14px",
              fontWeight: "600",
              borderRadius: "8px",
            }}
          >
            Generate Optimized Resume →
          </Btn>

          {processor.error && (
            <div
              style={{
                marginTop: "10px",
                padding: "10px 14px",
                background: "#1e0a0a",
                border: `1px solid ${COLORS.redBorder}`,
                borderRadius: "8px",
                color: COLORS.redDim,
                fontSize: "12.5px",
              }}
            >
              {processor.error}
            </div>
          )}

          {/* Feature pills */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: "8px",
              marginTop: "20px",
            }}
          >
            {(
              [
                ["🎯", "ATS Score",    "Live keyword match"],
                ["✉️", "Cover Letter", "Tailored to JD"],
                ["⚙️", "Edit Fields",  "Fine-tune every line"],
                ["📥", "PDF Export",   "Print-ready output"],
              ] as [string, string, string][]
            ).map(([icon, title, desc]) => (
              <div
                key={title}
                style={{
                  background: COLORS.surface,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: "8px",
                  padding: "12px 10px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "18px", marginBottom: "4px" }}>{icon}</div>
                <div
                  style={{ fontSize: "11.5px", fontWeight: "600", color: COLORS.text, marginBottom: "2px" }}
                >
                  {title}
                </div>
                <div style={{ fontSize: "10px", color: COLORS.textFaint }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
