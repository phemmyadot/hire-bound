"use client";

import { COLORS, NAV_TABS } from "@/lib/constants";
import { useResume } from "@/context/ResumeContext";
import type { TabId, TemplateKey } from "@/lib/constants";
import { TEMPLATES } from "@/lib/templates";

interface Props {
  activeTab: TabId;
  setActiveTab: (id: TabId) => void;
}

export function Sidebar({ activeTab, setActiveTab }: Props) {
  const { ats, activeTemplate, setActiveTemplate } = useResume();
  const { matched, missing } = ats;

  return (
    <div
      style={{
        width: "190px",
        borderRight: `1px solid ${COLORS.border}`,
        background: "#0b1220",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        overflowY: "auto",
      }}
    >
      {/* Navigation */}
      <div style={{ padding: "12px 10px" }}>
        <div
          style={{
            fontSize: "9px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: COLORS.textFaint,
            marginBottom: "6px",
            paddingLeft: "4px",
          }}
        >
          View
        </div>
        {NAV_TABS.map(({ id, icon, label }) => (
          <div
            key={id}
            onClick={() => setActiveTab(id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "7px 10px",
              borderRadius: "6px",
              cursor: "pointer",
              marginBottom: "2px",
              background: activeTab === id ? COLORS.borderMid : "transparent",
              color: activeTab === id ? COLORS.text : COLORS.textDim,
              fontSize: "12px",
              fontWeight: activeTab === id ? "600" : "400",
            }}
          >
            <span>{icon}</span>
            {label}
          </div>
        ))}
      </div>

      {/* Template picker — only on resume tab */}
      {activeTab === "resume" && (
        <div style={{ padding: "10px 10px", borderTop: `1px solid ${COLORS.border}` }}>
          <div
            style={{
              fontSize: "9px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: COLORS.textFaint,
              marginBottom: "6px",
              paddingLeft: "4px",
            }}
          >
            Template
          </div>
          {(Object.entries(TEMPLATES) as [TemplateKey, typeof TEMPLATES[TemplateKey]][]).map(
            ([key, t]) => (
              <div
                key={key}
                onClick={() => setActiveTemplate(key)}
                style={{
                  padding: "8px 10px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  marginBottom: "4px",
                  background: activeTemplate === key ? "#1e3a5f" : "transparent",
                  border: `1px solid ${activeTemplate === key ? COLORS.blue : "transparent"}`,
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: activeTemplate === key ? COLORS.blueLight : COLORS.textMuted,
                  }}
                >
                  {t.name}
                </div>
                <div style={{ fontSize: "10px", color: COLORS.textFaint, marginBottom: "1px" }}>
                  {t.desc}
                </div>
                <div style={{ fontSize: "10px", color: "#22c55e" }}>✓ ATS {t.ats}%</div>
              </div>
            )
          )}
        </div>
      )}

      {/* Live keyword mini-panel */}
      {(matched.length > 0 || missing.length > 0) && (
        <div
          style={{
            padding: "10px 10px",
            borderTop: `1px solid ${COLORS.border}`,
            marginTop: "auto",
          }}
        >
          <div
            style={{
              fontSize: "9px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: COLORS.textFaint,
              marginBottom: "8px",
              paddingLeft: "4px",
            }}
          >
            Keywords
          </div>
          {matched.slice(0, 6).map((k) => (
            <div key={k} style={{ fontSize: "10.5px", color: "#4ade80", marginBottom: "2px" }}>
              ✓ {k}
            </div>
          ))}
          {missing.slice(0, 4).map((k) => (
            <div key={k} style={{ fontSize: "10.5px", color: COLORS.redDim, marginBottom: "2px" }}>
              ✗ {k}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
