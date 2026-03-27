"use client";

import { COLORS } from "@/lib/constants";
import { useResume } from "@/context/ResumeContext";
import { SkillPill, ScoreBar, Tag, Btn } from "@/components/atoms";
import { PriorityCard } from "@/components/molecules";

export function SuggestionsTab() {
  const { resume, ats } = useResume();
  const { resumeData, activeSkills, setActiveSkills } = resume;
  const { score, color, matched, missing } = ats;

  return (
    <div
      style={{ flex: 1, overflow: "auto", padding: "24px 28px", animation: "fadeIn 0.2s ease" }}
    >
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "19px", fontWeight: "700", marginBottom: "3px" }}>Suggestions</h2>
          <p style={{ color: COLORS.textDim, fontSize: "12.5px" }}>
            Manage skills and get personalized career tips
          </p>
        </div>

        {/* Skills on resume */}
        <div
          style={{
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            borderRadius: "10px",
            padding: "16px 18px",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: COLORS.textFaint,
              marginBottom: "10px",
            }}
          >
            Skills on Resume{" "}
            <span style={{ color: COLORS.blue, fontWeight: "700" }}>{activeSkills.length}</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {activeSkills.map((skill) => (
              <SkillPill
                key={skill}
                label={skill}
                onRemove={() => setActiveSkills((p) => p.filter((s) => s !== skill))}
              />
            ))}
            {activeSkills.length === 0 && (
              <span style={{ color: COLORS.textFaint, fontSize: "12px" }}>No skills on resume</span>
            )}
          </div>
        </div>

        {/* ATS score + keywords */}
        <div
          style={{
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            borderRadius: "10px",
            padding: "16px 18px",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <span style={{ fontSize: "13px", fontWeight: "600" }}>ATS Compatibility Score</span>
            <span style={{ fontSize: "24px", fontWeight: "800", color, transition: "color 0.3s" }}>
              {score}
              <span style={{ fontSize: "13px", color: COLORS.textDim }}>/100</span>
            </span>
          </div>
          <ScoreBar score={score} />
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "14px" }}>
            {matched.length > 0 && (
              <div>
                <div
                  style={{
                    fontSize: "9px",
                    color: COLORS.textDim,
                    marginBottom: "5px",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  Matched ({matched.length})
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {matched.map((k) => (
                    <span
                      key={k}
                      style={{
                        fontSize: "10.5px",
                        background: COLORS.greenBg,
                        border: `1px solid ${COLORS.greenDark}`,
                        color: "#4ade80",
                        padding: "2px 7px",
                        borderRadius: "3px",
                      }}
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {missing.length > 0 && (
              <div>
                <div
                  style={{
                    fontSize: "9px",
                    color: COLORS.textDim,
                    marginBottom: "5px",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  Missing ({missing.length})
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {missing.map((k) => {
                    const has = activeSkills.includes(k);
                    return (
                      <Tag
                        key={k}
                        label={k}
                        active={has}
                        addPrefix
                        onClick={() => !has && setActiveSkills((p) => [...p, k])}
                        title={has ? "Already on resume" : "Add to skills"}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Career tips */}
        <div
          style={{
            fontSize: "10px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: COLORS.textFaint,
            marginBottom: "10px",
            marginTop: "4px",
          }}
        >
          Career Tips
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
          {(resumeData?.suggestions || []).map((s, i) => (
            <PriorityCard key={i} item={s} index={i} />
          ))}
        </div>

        {/* Deprioritized skills */}
        {(resumeData?.deprioritizedSkills?.length ?? 0) > 0 && (
          <div
            style={{
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              borderRadius: "10px",
              padding: "16px 18px",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: COLORS.textFaint,
                marginBottom: "4px",
              }}
            >
              Skills Not Shown
            </div>
            <p style={{ fontSize: "11px", color: COLORS.textFaint, marginBottom: "10px" }}>
              Deprioritized for this role. Add if relevant.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {resumeData!.deprioritizedSkills.map(({ skill, reason }) => {
                const isActive = activeSkills.includes(skill);
                return (
                  <div
                    key={skill}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "10px",
                      padding: "8px 12px",
                      background: isActive ? COLORS.greenBg : COLORS.surfaceAlt,
                      border: `1px solid ${isActive ? COLORS.greenDark : COLORS.border}`,
                      borderRadius: "7px",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <span
                        style={{
                          fontSize: "12.5px",
                          fontWeight: "600",
                          color: isActive ? "#4ade80" : COLORS.textMuted,
                          marginRight: "8px",
                        }}
                      >
                        {skill}
                      </span>
                      <span style={{ fontSize: "11px", color: COLORS.textFaint }}>{reason}</span>
                    </div>
                    <Btn
                      onClick={() =>
                        setActiveSkills((p) =>
                          isActive ? p.filter((s) => s !== skill) : [...p, skill]
                        )
                      }
                      style={{
                        background: isActive ? "#14532d" : COLORS.borderMid,
                        border: `1px solid ${isActive ? "#22c55e" : COLORS.borderMid}`,
                        color: isActive ? "#4ade80" : COLORS.textDim,
                        fontSize: "11px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {isActive ? "✓ Added" : "+ Add"}
                    </Btn>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
