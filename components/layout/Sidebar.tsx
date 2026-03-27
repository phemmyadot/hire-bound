"use client";

import { COLORS, NAV_TABS } from "@/lib/constants";
import { useResume } from "@/context/ResumeContext";
import type { TabId, TemplateKey } from "@/lib/constants";
import { TEMPLATES } from "@/lib/templates";

const LABEL_STYLE: React.CSSProperties = {
  fontSize: "10px",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: COLORS.textFaint,
  padding: "0 12px",
  marginBottom: "4px",
  marginTop: "4px",
};

interface Props {
  activeTab: TabId;
  setActiveTab: (id: TabId) => void;
}

export function Sidebar({ activeTab, setActiveTab }: Props) {
  const { ats, activeTemplate, setActiveTemplate } = useResume();
  const { matched, missing } = ats;

  return (
    <nav
      style={{
        width: "192px",
        borderRight: `1px solid ${COLORS.border}`,
        background: COLORS.bg,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        overflowY: "auto",
        paddingTop: "8px",
      }}
    >
      {/* Navigation */}
      <div style={{ padding: "0 8px" }}>
        <div style={LABEL_STYLE}>Views</div>
        {NAV_TABS.map(({ id, label }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                padding: "7px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                marginBottom: "1px",
                background: active ? COLORS.surfaceAlt : "transparent",
                border: "none",
                color: active ? COLORS.text : COLORS.textDim,
                fontSize: "13px",
                fontWeight: active ? 500 : 400,
                fontFamily: "inherit",
                textAlign: "left",
                transition: "background 0.1s, color 0.1s",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                if (!active) (e.currentTarget as HTMLButtonElement).style.color = COLORS.textMuted;
              }}
              onMouseLeave={(e) => {
                if (!active) (e.currentTarget as HTMLButtonElement).style.color = COLORS.textDim;
              }}
            >
              {active && (
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "4px",
                    bottom: "4px",
                    width: "2px",
                    background: COLORS.blue,
                    borderRadius: "0 2px 2px 0",
                  }}
                />
              )}
              {label}
            </button>
          );
        })}
      </div>

      {/* Template picker */}
      {activeTab === "resume" && (
        <div
          style={{
            padding: "12px 8px 8px",
            borderTop: `1px solid ${COLORS.border}`,
            marginTop: "8px",
          }}
        >
          <div style={LABEL_STYLE}>Template</div>
          {(Object.entries(TEMPLATES) as [TemplateKey, typeof TEMPLATES[TemplateKey]][]).map(
            ([key, t]) => {
              const active = activeTemplate === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTemplate(key)}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    marginBottom: "2px",
                    background: active ? COLORS.surfaceAlt : "transparent",
                    border: `1px solid ${active ? COLORS.blue : "transparent"}`,
                    textAlign: "left",
                    fontFamily: "inherit",
                    transition: "all 0.1s",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 500,
                      color: active ? COLORS.blueLight : COLORS.textMuted,
                      marginBottom: "2px",
                    }}
                  >
                    {t.name}
                  </div>
                  <div style={{ fontSize: "10px", color: COLORS.textFaint }}>{t.desc}</div>
                </button>
              );
            }
          )}
        </div>
      )}

      {/* Keyword mini-panel */}
      {(matched.length > 0 || missing.length > 0) && (
        <div
          style={{
            padding: "12px 8px 8px",
            borderTop: `1px solid ${COLORS.border}`,
            marginTop: "auto",
          }}
        >
          <div style={LABEL_STYLE}>Keywords</div>
          <div style={{ padding: "0 4px" }}>
            {matched.slice(0, 6).map((k) => (
              <div key={k} style={{ fontSize: "11px", color: COLORS.green, marginBottom: "3px" }}>
                ✓ {k}
              </div>
            ))}
            {missing.slice(0, 4).map((k) => (
              <div key={k} style={{ fontSize: "11px", color: COLORS.redDim, marginBottom: "3px" }}>
                ✗ {k}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
