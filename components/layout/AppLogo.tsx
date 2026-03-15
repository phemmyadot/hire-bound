"use client";

export function AppLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div
        style={{
          width: "22px",
          height: "22px",
          background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
          borderRadius: "5px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "800",
          fontSize: "11px",
          color: "#fff",
        }}
      >
        R
      </div>
      <span style={{ fontSize: "13px", fontWeight: "600" }}>ResumeAI</span>
      <span
        style={{
          fontSize: "10px",
          background: "#1e3a5f",
          color: "#60a5fa",
          padding: "2px 8px",
          borderRadius: "10px",
        }}
      >
        Claude-powered
      </span>
    </div>
  );
}
