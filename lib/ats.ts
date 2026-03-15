import type { ResumeData } from "./types";

interface AtsInput {
  resumeData: ResumeData | null;
  editData: ResumeData | null;
  activeSkills: string[];
}

export interface AtsResult {
  score: number;
  matched: string[];
  missing: string[];
}

export function computeAts({ resumeData, editData, activeSkills }: AtsInput): AtsResult {
  if (!resumeData || !editData) return { score: 0, matched: [], missing: [] };

  const allKeywords = [
    ...(resumeData.keywordsMatched || []),
    ...(resumeData.keywordsMissing || []),
  ];

  // No JD — score by core skill coverage
  if (!allKeywords.length) {
    const base = resumeData.atsScore || 0;
    const coreCount = (resumeData.coreSkills || []).length || 1;
    const activeCore = (resumeData.coreSkills || []).filter((s) =>
      activeSkills.includes(s)
    ).length;
    const delta = Math.round(((activeCore / coreCount) - 1) * 15);
    return { score: Math.min(100, Math.max(0, base + delta)), matched: [], missing: [] };
  }

  // Build full-resume text corpus for keyword matching
  const corpus = [
    ...activeSkills,
    editData.summary || "",
    ...(editData.experience || []).flatMap((e) => e.bullets || []),
    ...(editData.projects || []).flatMap((p) =>
      Array.isArray(p.description) ? p.description : [p.description || ""]
    ),
  ]
    .join(" ")
    .toLowerCase();

  const matched = allKeywords.filter((k) => corpus.includes(k.toLowerCase()));
  const missing = allKeywords.filter((k) => !corpus.includes(k.toLowerCase()));

  const origMatched = (resumeData.keywordsMatched || []).length;
  const kw = 0.45;
  const base =
    (resumeData.atsScore || 0) -
    Math.round((origMatched / allKeywords.length) * 100 * kw);
  const score = Math.min(
    100,
    Math.max(0, base + Math.round((matched.length / allKeywords.length) * 100 * kw))
  );

  return { score, matched, missing };
}
