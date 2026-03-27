"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { COLORS } from "@/lib/constants";
import { useResume } from "@/context/ResumeContext";
import { ResumeCard } from "@/components/molecules";

interface Props {
  onNew: () => void;
}

export function ProfileScreen({ onNew }: Props) {
  const { data: session } = useSession();
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

  const email = session?.user?.email ?? "";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.bg,
        fontFamily: "'Inter',-apple-system,sans-serif",
        color: COLORS.text,
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: `1px solid ${COLORS.border}`,
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "52px",
          background: "#0b1220",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: "15px", letterSpacing: "-0.5px", color: COLORS.text }}>
          HireBound
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {email && <span style={{ fontSize: "12px", color: COLORS.textDim }}>{email}</span>}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            style={{
              background: "transparent",
              border: `1px solid ${COLORS.border}`,
              borderRadius: 6,
              color: COLORS.textDim,
              cursor: "pointer",
              fontSize: "12px",
              padding: "4px 12px",
            }}
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px" }}>

        <div style={{ marginBottom: 36 }}>
          <h1 style={{ margin: "0 0 6px", fontSize: "1.5rem", fontWeight: 700, color: COLORS.text }}>
            My Resumes
          </h1>
          <p style={{ margin: 0, fontSize: "13px", color: COLORS.textDim }}>
            Load a saved resume to continue editing, or create a new one.
          </p>
        </div>

        {/* New resume CTA */}
        <button
          onClick={onNew}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            width: "100%",
            padding: "18px 20px",
            marginBottom: 24,
            background: "linear-gradient(135deg,#1e3a5f,#1e1b4b)",
            border: `1px solid ${COLORS.blue}`,
            borderRadius: 10,
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <span style={{ fontSize: 28 }}>+</span>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>New Resume</div>
            <div style={{ fontSize: "12px", color: COLORS.textDim, marginTop: 2 }}>
              Upload or paste your resume to generate an ATS-optimized version
            </div>
          </div>
        </button>

        {/* States */}
        {error && <p style={{ color: COLORS.redDim, fontSize: 13, marginBottom: 12 }}>{error}</p>}
        {loading && resumes.length === 0 && (
          <p style={{ color: COLORS.textDim, fontSize: 13 }}>Loading…</p>
        )}
        {!loading && resumes.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "40px 0",
              color: COLORS.textDim,
              fontSize: 13,
              border: `1px dashed ${COLORS.border}`,
              borderRadius: 8,
            }}
          >
            No saved resumes yet. Click <strong style={{ color: COLORS.text }}>New Resume</strong> to get started.
          </div>
        )}

        {/* Resume list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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
    </div>
  );
}
