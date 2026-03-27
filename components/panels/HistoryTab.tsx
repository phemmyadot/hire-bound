"use client";

import { useEffect, useState } from "react";
import { COLORS } from "@/lib/constants";
import { useResume } from "@/context/ResumeContext";
import { ResumeCard } from "@/components/molecules";

export function HistoryTab() {
  const { history, resume } = useResume();
  const { resumes, loading, error, load, fetchOne, remove, rename } = history;
  const [loadingId, setLoadingId]   = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => { load(); }, [load]);

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

        {error && <p style={{ color: COLORS.redDim, fontSize: 13, marginBottom: 16 }}>{error}</p>}

        {!loading && resumes.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "48px 0",
              color: COLORS.textDim,
              fontSize: 14,
              border: `1px dashed ${COLORS.border}`,
              borderRadius: 8,
            }}
          >
            No saved resumes yet. Process a resume and use the Save button to store it.
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {resumes.map((r) => (
            <ResumeCard
              key={r.id}
              id={r.id}
              name={r.name}
              updatedAt={r.updated_at}
              loadLabel="Load"
              loading={loadingId === r.id}
              deleting={deletingId === r.id}
              onOpen={() => handleLoad(r.id)}
              onRename={(name) => rename(r.id, name)}
              onDelete={() => handleDelete(r.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
