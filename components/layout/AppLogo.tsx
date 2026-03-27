"use client";

export function AppLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div
        style={{
          width: "26px",
          height: "26px",
          background: "#3b82f6",
          borderRadius: "7px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "800",
          fontSize: "10px",
          letterSpacing: "-0.5px",
          color: "#fff",
          flexShrink: 0,
        }}
      >
        HB
      </div>
      <span
        style={{
          fontSize: "14px",
          fontWeight: "600",
          color: "#f4f4f5",
          letterSpacing: "-0.3px",
        }}
      >
        HireBound
      </span>
    </div>
  );
}
