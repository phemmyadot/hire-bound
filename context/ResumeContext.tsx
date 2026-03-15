"use client";

import { createContext, useContext } from "react";
import type { ResumeData } from "@/lib/types";
import type { AtsResult } from "@/lib/ats";
import type { TabId, TemplateKey } from "@/lib/constants";
import type { useResumeData } from "@/hooks/useResumeData";
import type { useResumeProcessor } from "@/hooks/useResumeProcessor";
import type { useFileReader } from "@/hooks/useFileReader";
import type { useJobFinder } from "@/hooks/useJobFinder";

export interface ResumeContextValue {
  resume: ReturnType<typeof useResumeData>;
  processor: ReturnType<typeof useResumeProcessor>;
  file: ReturnType<typeof useFileReader>;
  jobs: ReturnType<typeof useJobFinder>;
  ats: AtsResult & { color: string };
  jobDesc: string;
  setJobDesc: (v: string) => void;
  activeTemplate: TemplateKey;
  setActiveTemplate: (t: TemplateKey) => void;
}

export const ResumeContext = createContext<ResumeContextValue | null>(null);

export function useResume(): ResumeContextValue {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error("useResume must be used inside ResumeContext.Provider");
  return ctx;
}
