"use client";

import { COLORS } from "@/lib/constants";
import type { Job } from "@/lib/types";

interface Props {
  job: Job;
  activeSkills: string[];
}

export function JobCard({ job, activeSkills }: Props) {
  const matchColor = job.match >= 85 ? "#22c55e" : job.match >= 70 ? "#fbbf24" : "#f87171";
  const typeColor  = job.type === "Remote" ? "#60a5fa" : job.type === "Hybrid" ? "#a78bfa" : "#94a3b8";

  const applyLinks = [
    { label: "LinkedIn",  url: job.linkedin,  color: "#0077b5", bg: "#001f3d" },
    { label: "Indeed",    url: job.indeed,    color: "#2164f3", bg: "#0a0f2e" },
    { label: "Glassdoor", url: job.glassdoor, color: "#0caa41", bg: "#021a0e" },
  ];

  return (
    <div
      style={{
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: "10px",
        padding: "16px 18px",
        transition: "border-color 0.15s, background 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = COLORS.borderMid;
        e.currentTarget.style.background = "#0f1a2e";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = COLORS.border;
        e.currentTarget.style.background = COLORS.surface;
      }}
    >
      {/* Title + match */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px", gap: "8px" }}>
        <div style={{ fontSize: "14px", fontWeight: 700, color: COLORS.text, lineHeight: "1.3" }}>
          {job.title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px", flexShrink: 0 }}>
          <div style={{ fontSize: "10px", color: COLORS.textDim }}>Match</div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: matchColor }}>{job.match}%</div>
        </div>
      </div>

      {/* Company meta */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", flexWrap: "wrap" }}>
        <span style={{ fontSize: "12.5px", fontWeight: 600, color: COLORS.textMuted }}>{job.company}</span>
        <span style={{ color: COLORS.borderMid }}>·</span>
        <span style={{ fontSize: "11.5px", color: COLORS.textDim }}>📍 {job.location}</span>
        <span style={{ color: COLORS.borderMid }}>·</span>
        <span
          style={{
            fontSize: "11px",
            color: typeColor,
            background: `${typeColor}1a`,
            padding: "2px 7px",
            borderRadius: "10px",
            fontWeight: 500,
          }}
        >
          {job.type}
        </span>
        {job.salary && (
          <>
            <span style={{ color: COLORS.borderMid }}>·</span>
            <span style={{ fontSize: "11.5px", color: "#4ade80" }}>{job.salary}</span>
          </>
        )}
        <span style={{ fontSize: "10.5px", color: COLORS.textFaint, marginLeft: "auto" }}>{job.posted}</span>
      </div>

      {/* Description */}
      <p style={{ fontSize: "12px", color: COLORS.textDim, lineHeight: "1.65", marginBottom: "10px" }}>
        {job.description}
      </p>

      {/* Skill tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "12px" }}>
        {(job.tags || []).map((tag) => {
          const have = activeSkills.map((s) => s.toLowerCase()).includes(tag.toLowerCase());
          return (
            <span
              key={tag}
              style={{
                fontSize: "10.5px",
                padding: "2px 8px",
                borderRadius: "4px",
                background: have ? COLORS.greenBg : COLORS.surfaceAlt,
                border: `1px solid ${have ? COLORS.greenDark : "#1e3a5f"}`,
                color: have ? "#4ade80" : COLORS.textDim,
              }}
            >
              {have && "✓ "}
              {tag}
            </span>
          );
        })}
      </div>

      {/* Apply links */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {applyLinks.map(({ label, url, color, bg }) => (
          <a
            key={label}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "5px 12px",
              background: bg,
              border: `1px solid ${color}44`,
              color,
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 500,
              textDecoration: "none",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = `${color}22`; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = bg; }}
          >
            Apply on {label} ↗
          </a>
        ))}
      </div>
    </div>
  );
}
