"use client";

import { useEffect, useState } from "react";
import { COLORS } from "@/lib/constants";
import { useResume } from "@/context/ResumeContext";
import { NavBar } from "@/components/layout/NavBar";
import { ResumeCard } from "@/components/molecules";

interface Props {
  onNew: () => void;
}

export function ProfileScreen({ onNew }: Props) {
  const { history, resume, processor } = useResume();
  const { resumes, loading, error, load, fetchOne, remove, rename } = history;
  const [loadingId, setLoadingId]   = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => { load(); }, [load]);

  async function handleOpen(id: number) {
    setLoadingId(id);
    const data = await fetchOne(id);
    if (data) {
      resume.initData(data);
      processor.setStep("preview");
    }
    setLoadingId(null);
  }

  async function handleDelete(id: number) {
    setDeletingId(id);
    await remove(id);
    setDeletingId(null);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.bg,
        color: COLORS.text,
        fontFamily: "'Inter',-apple-system,sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <NavBar />

      <main style={{ flex: 1, padding: "48px 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>

          {/* Page heading */}
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ margin: "0 0 6px", fontSize: "22px", fontWeight: 700, color: COLORS.text, letterSpacing: "-0.5px" }}>
              My Resumes
            </h1>
            <p style={{ margin: 0, fontSize: "13px", color: COLORS.textDim }}>
              Open a saved resume or create a new one.
            </p>
          </div>

          {/* New resume CTA */}
          <button
            onClick={onNew}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              width: "100%",
              padding: "16px 20px",
              marginBottom: 24,
              background: COLORS.surface,
              border: `1px solid ${COLORS.blue}`,
              borderRadius: 10,
              cursor: "pointer",
              textAlign: "left",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = COLORS.surfaceAlt; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = COLORS.surface; }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                background: `${COLORS.blue}22`,
                border: `1px solid ${COLORS.blue}44`,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                color: COLORS.blue,
                flexShrink: 0,
              }}
            >
              +
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: COLORS.text, marginBottom: 2 }}>
                New Resume
              </div>
              <div style={{ fontSize: "12px", color: COLORS.textDim }}>
                Upload or paste your resume to generate an ATS-optimized version
              </div>
            </div>
          </button>

          {/* States */}
          {error && (
            <p style={{ color: COLORS.redDim, fontSize: 13, marginBottom: 12 }}>{error}</p>
          )}
          {loading && resumes.length === 0 && (
            <p style={{ color: COLORS.textDim, fontSize: 13 }}>Loading…</p>
          )}
          {!loading && resumes.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "48px 0",
                color: COLORS.textDim,
                fontSize: 13,
                border: `1px dashed ${COLORS.border}`,
                borderRadius: 8,
              }}
            >
              No saved resumes yet.{" "}
              <button
                onClick={onNew}
                style={{
                  background: "none",
                  border: "none",
                  color: COLORS.blue,
                  cursor: "pointer",
                  fontSize: 13,
                  padding: 0,
                  fontFamily: "inherit",
                }}
              >
                Create your first one →
              </button>
            </div>
          )}

          {/* Resume list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {resumes.map((r) => (
              <ResumeCard
                key={r.id}
                id={r.id}
                name={r.name}
                updatedAt={r.updated_at}
                loading={loadingId === r.id}
                deleting={deletingId === r.id}
                onOpen={() => handleOpen(r.id)}
                onRename={(name) => rename(r.id, name)}
                onDelete={() => handleDelete(r.id)}
              />
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}
