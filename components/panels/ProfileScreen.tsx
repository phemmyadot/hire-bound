"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { COLORS } from "@/lib/constants";
import { useResume } from "@/context/ResumeContext";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface Props {
  onNew: () => void;
}

export function ProfileScreen({ onNew }: Props) {
  const { data: session } = useSession();
  const { history, resume, processor } = useResume();
  const { resumes, loading, error, load, fetchOne, remove, rename } = history;
  const [loadingId, setLoadingId]     = useState<number | null>(null);
  const [deletingId, setDeletingId]   = useState<number | null>(null);
  const [renamingId, setRenamingId]   = useState<number | null>(null);
  const [renameVal, setRenameVal]     = useState("");

  useEffect(() => { load(); }, [load]);

  async function handleLoad(id: number) {
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

  function startRename(id: number, currentName: string) {
    setRenamingId(id);
    setRenameVal(currentName);
  }

  async function commitRename(id: number) {
    await rename(id, renameVal);
    setRenamingId(null);
  }

  function handleRenameKey(e: React.KeyboardEvent, id: number) {
    if (e.key === "Enter") commitRename(id);
    if (e.key === "Escape") setRenamingId(null);
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
          {email && (
            <span style={{ fontSize: "12px", color: COLORS.textDim }}>{email}</span>
          )}
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

        {/* Welcome */}
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

        {/* Saved resumes */}
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

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {resumes.map((r) => (
            <div
              key={r.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 18px",
                background: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 8,
                gap: 12,
              }}
            >
              <div style={{ minWidth: 0, flex: 1 }}>
                {renamingId === r.id ? (
                  <input
                    autoFocus
                    value={renameVal}
                    onChange={(e) => setRenameVal(e.target.value)}
                    onBlur={() => commitRename(r.id)}
                    onKeyDown={(e) => handleRenameKey(e, r.id)}
                    style={{
                      width: "100%",
                      background: COLORS.bg,
                      border: `1px solid ${COLORS.blue}`,
                      borderRadius: 4,
                      color: COLORS.text,
                      fontSize: 14,
                      fontWeight: 600,
                      padding: "2px 6px",
                      outline: "none",
                    }}
                  />
                ) : (
                  <div
                    onClick={() => startRename(r.id, r.name)}
                    title="Click to rename"
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: COLORS.text,
                      marginBottom: 3,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      cursor: "text",
                    }}
                  >
                    {r.name}
                  </div>
                )}
                <div style={{ fontSize: 11, color: COLORS.textDim }}>
                  Last saved {fmtDate(r.updated_at)}
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button
                  onClick={() => handleLoad(r.id)}
                  disabled={loadingId === r.id}
                  style={{
                    background: loadingId === r.id ? COLORS.border : COLORS.blue,
                    border: "none",
                    borderRadius: 6,
                    color: "#fff",
                    cursor: loadingId === r.id ? "not-allowed" : "pointer",
                    fontSize: 12,
                    fontWeight: 600,
                    padding: "6px 16px",
                  }}
                >
                  {loadingId === r.id ? "Loading…" : "Open"}
                </button>
                <button
                  onClick={() => startRename(r.id, r.name)}
                  style={{
                    background: "transparent",
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 6,
                    color: COLORS.textDim,
                    cursor: "pointer",
                    fontSize: 12,
                    padding: "6px 10px",
                  }}
                >
                  Rename
                </button>
                <button
                  onClick={() => handleDelete(r.id)}
                  disabled={deletingId === r.id}
                  style={{
                    background: "transparent",
                    border: `1px solid ${COLORS.redBorder}`,
                    borderRadius: 6,
                    color: COLORS.redDim,
                    cursor: deletingId === r.id ? "not-allowed" : "pointer",
                    fontSize: 12,
                    padding: "6px 10px",
                  }}
                >
                  {deletingId === r.id ? "…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
