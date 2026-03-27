"use client";

import { useEffect, useState } from "react";
import { COLORS } from "@/lib/constants";
import { useResume } from "@/context/ResumeContext";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function HistoryTab() {
  const { history, resume } = useResume();
  const { resumes, loading, error, load, fetchOne, remove, rename } = history;
  const [loadingId, setLoadingId]   = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [renameVal, setRenameVal]   = useState("");

  useEffect(() => {
    load();
  }, [load]);

  async function handleLoad(id: number) {
    setLoadingId(id);
    const data = await fetchOne(id);
    if (data) resume.initData(data);
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

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700, color: COLORS.text }}>
            Saved Resumes
          </h2>
          <button
            onClick={load}
            disabled={loading}
            style={{
              background: "transparent",
              border: `1px solid ${COLORS.border}`,
              borderRadius: 6,
              color: COLORS.textMuted,
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: 12,
              padding: "4px 12px",
            }}
          >
            {loading ? "Loading…" : "Refresh"}
          </button>
        </div>

        {error && (
          <p style={{ color: COLORS.redDim, fontSize: 13, marginBottom: 16 }}>{error}</p>
        )}

        {!loading && resumes.length === 0 && (
          <div style={{
            textAlign: "center",
            padding: "48px 0",
            color: COLORS.textDim,
            fontSize: 14,
            border: `1px dashed ${COLORS.border}`,
            borderRadius: 8,
          }}>
            No saved resumes yet. Process a resume and use the Save button to store it.
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
                  Saved {fmtDate(r.updated_at)}
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
                    padding: "5px 14px",
                  }}
                >
                  {loadingId === r.id ? "Loading…" : "Load"}
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
                    padding: "5px 10px",
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
                    padding: "5px 10px",
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
