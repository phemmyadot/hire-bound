export const COLORS = {
  bg: "#080c14",
  surface: "#0d1525",
  surfaceAlt: "#111827",
  border: "#1e293b",
  borderMid: "#334155",
  text: "#e2e8f0",
  textMuted: "#94a3b8",
  textDim: "#64748b",
  textFaint: "#475569",
  blue: "#3b82f6",
  blueLight: "#60a5fa",
  purple: "#8b5cf6",
  green: "#22c55e",
  greenDark: "#14532d",
  greenBg: "#0a1a0a",
  yellow: "#fbbf24",
  red: "#ef4444",
  redDim: "#f87171",
  redBg: "#1a0a0a",
  redBorder: "#7f1d1d",
} as const;

export const PRIORITY = {
  high:   { bg: "#1a0a0a", border: "#7f1d1d", text: "#f87171", dot: "#ef4444" },
  medium: { bg: "#0a110a", border: "#14532d", text: "#4ade80", dot: "#22c55e" },
  low:    { bg: "#0a0e1a", border: "#1e3a5f", text: "#60a5fa", dot: "#3b82f6" },
} as const;

export const NAV_TABS = [
  { id: "resume",      icon: "📄", label: "Resume" },
  { id: "cover",       icon: "✉️", label: "Cover Letter" },
  { id: "suggestions", icon: "💡", label: "Suggestions" },
  { id: "jobs",        icon: "🔍", label: "Job Finder" },
  { id: "history",     icon: "🗂️", label: "History" },
  { id: "settings",   icon: "⚙️", label: "Edit Fields" },
] as const;

export type TabId = typeof NAV_TABS[number]["id"];
export type TemplateKey = "classic" | "executive" | "compact";
