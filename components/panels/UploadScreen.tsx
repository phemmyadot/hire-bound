"use client";

import { useRef } from "react";
import { COLORS } from "@/lib/constants";
import { useResume } from "@/context/ResumeContext";
import { NavBar } from "@/components/layout/NavBar";

interface Props {
  onBack: (() => void) | null;
}

const LABEL: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  color: COLORS.textMuted,
  marginBottom: "8px",
};

export function UploadScreen({ onBack }: Props) {
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

  const backButton = onBack ? (
    <button
      onClick={onBack}
      style={{
        background: "transparent",
        border: "none",
        color: COLORS.textDim,
        cursor: "pointer",
        fontSize: "12px",
        fontFamily: "inherit",
        display: "flex",
        alignItems: "center",
        gap: "4px",
        padding: 0,
        transition: "color 0.15s",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = COLORS.textMuted; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = COLORS.textDim; }}
    >
      ← Back
    </button>
  ) : undefined;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.bg,
        fontFamily: "'Inter',-apple-system,sans-serif",
        color: COLORS.text,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <NavBar left={backButton} />

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
        }}
      >
        <div style={{ maxWidth: 660, width: "100%" }}>

          {/* Heading */}
          <div style={{ marginBottom: 28, textAlign: "center" }}>
            <h1
              style={{
                margin: "0 0 8px",
                fontSize: "22px",
                fontWeight: 700,
                letterSpacing: "-0.5px",
                color: COLORS.text,
              }}
            >
              New Resume
            </h1>
            <p style={{ margin: 0, fontSize: "13px", color: COLORS.textDim, lineHeight: 1.6 }}>
              Upload or paste your resume, then add a job description for tailored ATS optimization.
            </p>
          </div>

          {/* Two-column input */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            {/* Resume column */}
            <div>
              <div style={LABEL}>
                Resume <span style={{ color: COLORS.red }}>*</span>
              </div>

              {/* Drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                style={{
                  border: `1px dashed ${isDragging ? COLORS.blue : COLORS.border}`,
                  borderRadius: "8px",
                  padding: "20px 16px",
                  cursor: "pointer",
                  textAlign: "center",
                  background: isDragging ? `${COLORS.blue}0d` : COLORS.surface,
                  transition: "all 0.15s",
                  minHeight: "100px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    background: COLORS.surfaceAlt,
                    border: `1px solid ${COLORS.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    marginBottom: 4,
                  }}
                >
                  ↑
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: fileName ? COLORS.green : COLORS.text,
                  }}
                >
                  {fileName || "Drop file here"}
                </div>
                <div style={{ fontSize: "11px", color: COLORS.textFaint }}>PDF · TXT · DOCX</div>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.txt,.doc,.docx,.md"
                  style={{ display: "none" }}
                  onChange={(e) => e.target.files?.[0] && readFile(e.target.files[0])}
                />
              </div>

              {/* Paste fallback */}
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="...or paste resume text here"
                style={{
                  width: "100%",
                  height: "72px",
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
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Job description column */}
            <div>
              <div style={LABEL}>
                Job Description{" "}
                <span style={{ color: COLORS.textFaint, fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
                  (recommended)
                </span>
              </div>
              <textarea
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                placeholder="Paste the job description. Claude will tailor keywords, bullets, cover letter, and ATS score to this role."
                style={{
                  width: "100%",
                  height: "204px",
                  background: COLORS.surface,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: "8px",
                  color: COLORS.text,
                  padding: "12px 14px",
                  fontSize: "12px",
                  lineHeight: "1.65",
                  resize: "none",
                  outline: "none",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{
              width: "100%",
              padding: "12px",
              background: canSubmit ? COLORS.blue : COLORS.surfaceAlt,
              border: "none",
              borderRadius: "8px",
              color: canSubmit ? "#fff" : COLORS.textFaint,
              fontSize: "13px",
              fontWeight: 600,
              fontFamily: "inherit",
              cursor: canSubmit ? "pointer" : "not-allowed",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => {
              if (canSubmit) (e.currentTarget as HTMLButtonElement).style.opacity = "0.85";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = "1";
            }}
          >
            Generate Optimized Resume →
          </button>

          {processor.error && (
            <div
              style={{
                marginTop: "10px",
                padding: "10px 14px",
                background: COLORS.redBg,
                border: `1px solid ${COLORS.redBorder}`,
                borderRadius: "8px",
                color: COLORS.redDim,
                fontSize: "12px",
              }}
            >
              {processor.error}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
