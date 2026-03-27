"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { apiFetch } from "@/lib/api";
import type { ResumeData } from "@/lib/types";

export interface ResumeListItem {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export function useResumeHistory() {
  const { data: session } = useSession();
  const [resumes, setResumes] = useState<ResumeListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const token = (session as { accessToken?: string } | null)?.accessToken ?? "";

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/resumes", token);
      if (!res.ok) throw new Error("Failed to load");
      setResumes(await res.json());
    } catch {
      setError("Could not load saved resumes.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const save = useCallback(async (data: ResumeData): Promise<number | null> => {
    if (!token) return null;
    const name = data.name?.trim() || "Untitled Resume";
    try {
      const res = await apiFetch("/resumes", token, {
        method: "POST",
        body: JSON.stringify({ name, data }),
      });
      if (!res.ok) return null;
      const created: ResumeListItem = await res.json();
      setResumes((prev) => [created, ...prev]);
      return created.id;
    } catch {
      return null;
    }
  }, [token]);

  const update = useCallback(async (id: number, data: ResumeData): Promise<boolean> => {
    if (!token) return false;
    try {
      const res = await apiFetch(`/resumes/${id}`, token, {
        method: "PATCH",
        body: JSON.stringify({ name: data.name?.trim() || "Untitled Resume", data }),
      });
      if (!res.ok) return false;
      const updated: ResumeListItem = await res.json();
      setResumes((prev) => prev.map((r) => (r.id === id ? updated : r)));
      return true;
    } catch {
      return false;
    }
  }, [token]);

  const remove = useCallback(async (id: number) => {
    if (!token) return;
    try {
      await apiFetch(`/resumes/${id}`, token, { method: "DELETE" });
      setResumes((prev) => prev.filter((r) => r.id !== id));
    } catch {
      // ignore
    }
  }, [token]);

  const fetchOne = useCallback(async (id: number): Promise<ResumeData | null> => {
    if (!token) return null;
    try {
      const res = await apiFetch(`/resumes/${id}`, token);
      if (!res.ok) return null;
      const detail = await res.json();
      return detail.data as ResumeData;
    } catch {
      return null;
    }
  }, [token]);

  const rename = useCallback(async (id: number, name: string): Promise<boolean> => {
    if (!token) return false;
    const trimmed = name.trim() || "Untitled Resume";
    try {
      const res = await apiFetch(`/resumes/${id}`, token, {
        method: "PATCH",
        body: JSON.stringify({ name: trimmed }),
      });
      if (!res.ok) return false;
      const updated: ResumeListItem = await res.json();
      setResumes((prev) => prev.map((r) => (r.id === id ? updated : r)));
      return true;
    } catch {
      return false;
    }
  }, [token]);

  return { resumes, loading, error, load, save, update, remove, fetchOne, rename };
}
