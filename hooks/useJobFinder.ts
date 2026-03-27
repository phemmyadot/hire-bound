"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { callClaude } from "@/lib/api";
import type { ResumeData, Job } from "@/lib/types";

interface Options {
  editData: ResumeData | null;
  activeSkills: string[];
  jobDesc: string;
}

export function useJobFinder({ editData, activeSkills, jobDesc }: Options) {
  const { data: session } = useSession();
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
      const title      = editData.experience?.[0]?.title || editData.tagline || "Software Engineer";
      const skills     = activeSkills.slice(0, 8).join(", ");
      const location   = editData.location || "";
      const jd_snippet = jobDesc?.trim().slice(0, 400) || "not provided";
      const token      = (session as { accessToken?: string } | null)?.accessToken;

      const parsed = await callClaude<Job[] | { jobs: Job[] }>({
        promptName: "jobs",
        vars: { title, skills, location, jd_snippet },
        maxTokens: 3000,
        token,
      });
      setJobs(Array.isArray(parsed) ? parsed : (parsed as { jobs: Job[] }).jobs || []);
    } catch {
      setError("Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [editData, activeSkills, jobDesc, session]);

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
