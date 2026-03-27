"use client";

import { useState } from "react";
import { COLORS } from "@/lib/constants";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface Props {
  id: number;
  name: string;
  updatedAt: string;
  loadLabel?: string;
  loading?: boolean;
  deleting?: boolean;
  onOpen: () => void;
  onRename: (name: string) => Promise<boolean>;
  onDelete: () => void;
}

export function ResumeCard({
  name,
  updatedAt,
  loadLabel = "Open",
  loading,
  deleting,
  onOpen,
  onRename,
  onDelete,
}: Props) {
  const [renaming, setRenaming] = useState(false);
  const [renameVal, setRenameVal] = useState("");

  function startRename() {
    setRenameVal(name);
    setRenaming(true);
  }

  async function commitRename() {
    await onRename(renameVal);
    setRenaming(false);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") commitRename();
    if (e.key === "Escape") setRenaming(false);
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 18px",
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: "8px",
        gap: "12px",
      }}
    >
      {/* Name + date */}
      <div style={{ minWidth: 0, flex: 1 }}>
        {renaming ? (
          <input
            autoFocus
            value={renameVal}
            onChange={(e) => setRenameVal(e.target.value)}
            onBlur={commitRename}
            onKeyDown={handleKey}
            style={{
              width: "100%",
              background: COLORS.bg,
              border: `1px solid ${COLORS.blue}`,
              borderRadius: "4px",
              color: COLORS.text,
              fontSize: "14px",
              fontWeight: 600,
              padding: "2px 6px",
              outline: "none",
            }}
          />
        ) : (
          <div
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: COLORS.text,
              marginBottom: "3px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {name}
          </div>
        )}
        <div style={{ fontSize: "11px", color: COLORS.textDim }}>
          Last saved {fmtDate(updatedAt)}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
        <button
          onClick={onOpen}
          disabled={loading}
          style={{
            background: loading ? COLORS.border : COLORS.blue,
            border: "none",
            borderRadius: "6px",
            color: "#fff",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "12px",
            fontWeight: 600,
            padding: "6px 16px",
          }}
        >
          {loading ? "Loading…" : loadLabel}
        </button>
        <button
          onClick={startRename}
          style={{
            background: "transparent",
            border: `1px solid ${COLORS.border}`,
            borderRadius: "6px",
            color: COLORS.textDim,
            cursor: "pointer",
            fontSize: "12px",
            padding: "6px 10px",
          }}
        >
          Rename
        </button>
        <button
          onClick={onDelete}
          disabled={deleting}
          style={{
            background: "transparent",
            border: `1px solid ${COLORS.redBorder}`,
            borderRadius: "6px",
            color: COLORS.redDim,
            cursor: deleting ? "not-allowed" : "pointer",
            fontSize: "12px",
            padding: "6px 10px",
          }}
        >
          {deleting ? "…" : "Delete"}
        </button>
      </div>
    </div>
  );
}
