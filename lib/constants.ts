export const COLORS = {
  // Surfaces
  bg:           "#09090b",   // zinc-950
  surface:      "#111113",   // card bg
  surfaceAlt:   "#18181b",   // zinc-900
  surfaceHover: "#1c1c20",

  // Borders
  border:       "#27272a",   // zinc-800
  borderMid:    "#3f3f46",   // zinc-700

  // Text hierarchy
  text:         "#f4f4f5",   // zinc-100
  textMuted:    "#a1a1aa",   // zinc-400
  textDim:      "#71717a",   // zinc-500
  textFaint:    "#52525b",   // zinc-600

  // Accent
  blue:         "#3b82f6",
  blueLight:    "#93c5fd",

  // Semantic
  purple:       "#a78bfa",
  green:        "#22c55e",
  greenDark:    "#166534",
  greenBg:      "#052e16",
  yellow:       "#f59e0b",
  red:          "#ef4444",
  redDim:       "#fca5a5",
  redBg:        "#450a0a",
  redBorder:    "#991b1b",
} as const;

export const PRIORITY = {
  high:   { bg: "#1c0a0a", border: "#7f1d1d", text: "#fca5a5", dot: "#ef4444" },
  medium: { bg: "#0a1a0f", border: "#166534", text: "#4ade80", dot: "#22c55e" },
  low:    { bg: "#0d0d1a", border: "#1e3a5f", text: "#93c5fd", dot: "#3b82f6" },
} as const;

export const NAV_TABS = [
  { id: "resume",      label: "Resume"       },
  { id: "cover",       label: "Cover Letter" },
  { id: "suggestions", label: "Suggestions"  },
  { id: "jobs",        label: "Job Finder"   },
  { id: "history",     label: "History"      },
  { id: "settings",    label: "Edit Fields"  },
] as const;

export type TabId       = typeof NAV_TABS[number]["id"];
export type TemplateKey = "classic" | "executive" | "compact";
