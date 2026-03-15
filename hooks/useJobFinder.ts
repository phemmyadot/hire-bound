"use client";

import { useState, useCallback } from "react";
import { callClaude } from "@/lib/api";
import { JOBS_SYSTEM_PROMPT, buildJobsPrompt } from "@/lib/prompts";
import type { ResumeData, Job } from "@/lib/types";

interface Options {
  editData: ResumeData | null;
  activeSkills: string[];
  jobDesc: string;
}

export function useJobFinder({ editData, activeSkills, jobDesc }: Options) {
  const [jobs, setJobs]       = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [filter, setFilter]   = useState("all");
  const [search, setSearch]   = useState("");

  const load = useCallback(async () => {
    if (!editData) return;
    setLoading(true);
    setError("");
    try {
      const title    = editData.experience?.[0]?.title || editData.tagline || "Software Engineer";
      const skills   = activeSkills.slice(0, 8).join(", ");
      const location = editData.location || "";
      const parsed   = await callClaude<Job[] | { jobs: Job[] }>({
        system: JOBS_SYSTEM_PROMPT,
        userContent: buildJobsPrompt({ title, skills, location, jobDesc }),
        maxTokens: 3000,
      });
      setJobs(Array.isArray(parsed) ? parsed : (parsed as { jobs: Job[] }).jobs || []);
    } catch {
      setError("Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [editData, activeSkills, jobDesc]);

  const reset = useCallback(() => {
    setJobs([]);
    setError("");
  }, []);

  const filteredJobs = jobs.filter((j) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      j.title.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q) ||
      (j.tags || []).some((t) => t.toLowerCase().includes(q));
    const matchFilter = filter === "all" || j.type === filter;
    return matchSearch && matchFilter;
  });

  return { jobs, filteredJobs, loading, error, filter, setFilter, search, setSearch, load, reset };
}
