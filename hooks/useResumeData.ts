"use client";

import { useState, useCallback } from "react";
import type { ResumeData } from "@/lib/types";

export function useResumeData() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [editData, setEditData]     = useState<ResumeData | null>(null);
  const [activeSkills, setActiveSkills] = useState<string[]>([]);

  const initData = useCallback((parsed: ResumeData) => {
    setResumeData(parsed);
    setEditData(JSON.parse(JSON.stringify(parsed)));
    setActiveSkills(parsed.coreSkills || parsed.skills || []);
  }, []);

  const resetData = useCallback(() => {
    setResumeData(null);
    setEditData(null);
    setActiveSkills([]);
  }, []);

  // Immutable deep-set by dot-path: setField("name", "Alice")
  const setField = useCallback((path: string, value: unknown) => {
    setEditData((prev) => {
      if (!prev) return prev;
      const next = JSON.parse(JSON.stringify(prev)) as Record<string, unknown>;
      const keys = path.split(".");
      let obj: Record<string, unknown> = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]] as Record<string, unknown>;
      obj[keys[keys.length - 1]] = value;
      return next as unknown as ResumeData;
    });
  }, []);

  // ── Experience ──────────────────────────────────────────────────────────────
  const setExpField = useCallback((eIdx: number, field: string, val: string) =>
    setEditData((prev) => {
      if (!prev) return prev;
      const n = JSON.parse(JSON.stringify(prev)) as ResumeData;
      (n.experience[eIdx] as unknown as Record<string, unknown>)[field] = val;
      return n;
    }), []);

  const setExpBullet = useCallback((eIdx: number, bIdx: number, val: string) =>
    setEditData((prev) => {
      if (!prev) return prev;
      const n = JSON.parse(JSON.stringify(prev)) as ResumeData;
      n.experience[eIdx].bullets[bIdx] = val;
      return n;
    }), []);

  const addExpBullet = useCallback((eIdx: number) =>
    setEditData((prev) => {
      if (!prev) return prev;
      const n = JSON.parse(JSON.stringify(prev)) as ResumeData;
      n.experience[eIdx].bullets.push("");
      return n;
    }), []);

  const rmExpBullet = useCallback((eIdx: number, bIdx: number) =>
    setEditData((prev) => {
      if (!prev) return prev;
      const n = JSON.parse(JSON.stringify(prev)) as ResumeData;
      n.experience[eIdx].bullets.splice(bIdx, 1);
      return n;
    }), []);

  const addExp = useCallback(() =>
    setEditData((prev) =>
      prev
        ? { ...prev, experience: [...(prev.experience || []), { title: "", company: "", location: "", dates: "", bullets: [""] }] }
        : prev
    ), []);

  const rmExp = useCallback((idx: number) =>
    setEditData((prev) =>
      prev ? { ...prev, experience: prev.experience.filter((_, i) => i !== idx) } : prev
    ), []);

  // ── Projects ────────────────────────────────────────────────────────────────
  const setProjField = useCallback((pIdx: number, field: string, val: string) =>
    setEditData((prev) => {
      if (!prev) return prev;
      const n = JSON.parse(JSON.stringify(prev)) as ResumeData;
      (n.projects[pIdx] as unknown as Record<string, unknown>)[field] = val;
      return n;
    }), []);

  const setProjBullet = useCallback((pIdx: number, bIdx: number, val: string) =>
    setEditData((prev) => {
      if (!prev) return prev;
      const n = JSON.parse(JSON.stringify(prev)) as ResumeData;
      if (!Array.isArray(n.projects[pIdx].description))
        n.projects[pIdx].description = [n.projects[pIdx].description as string || ""];
      (n.projects[pIdx].description as string[])[bIdx] = val;
      return n;
    }), []);

  const addProjBullet = useCallback((pIdx: number) =>
    setEditData((prev) => {
      if (!prev) return prev;
      const n = JSON.parse(JSON.stringify(prev)) as ResumeData;
      if (!Array.isArray(n.projects[pIdx].description))
        n.projects[pIdx].description = [n.projects[pIdx].description as string || ""];
      (n.projects[pIdx].description as string[]).push("");
      return n;
    }), []);

  const rmProjBullet = useCallback((pIdx: number, bIdx: number) =>
    setEditData((prev) => {
      if (!prev) return prev;
      const n = JSON.parse(JSON.stringify(prev)) as ResumeData;
      (n.projects[pIdx].description as string[]).splice(bIdx, 1);
      return n;
    }), []);

  const addProj = useCallback(() =>
    setEditData((prev) =>
      prev
        ? { ...prev, projects: [...(prev.projects || []), { name: "", tech: "", description: [""] }] }
        : prev
    ), []);

  const rmProj = useCallback((idx: number) =>
    setEditData((prev) =>
      prev ? { ...prev, projects: prev.projects.filter((_, i) => i !== idx) } : prev
    ), []);

  // ── Education ───────────────────────────────────────────────────────────────
  const setEduField = useCallback((idx: number, field: string, val: string) =>
    setEditData((prev) => {
      if (!prev) return prev;
      const n = JSON.parse(JSON.stringify(prev)) as ResumeData;
      (n.education[idx] as unknown as Record<string, unknown>)[field] = val;
      return n;
    }), []);

  const addEdu = useCallback(() =>
    setEditData((prev) =>
      prev
        ? { ...prev, education: [...(prev.education || []), { school: "", degree: "", dates: "" }] }
        : prev
    ), []);

  const rmEdu = useCallback((idx: number) =>
    setEditData((prev) =>
      prev ? { ...prev, education: prev.education.filter((_, i) => i !== idx) } : prev
    ), []);

  return {
    resumeData,
    editData,
    activeSkills,
    setActiveSkills,
    initData,
    resetData,
    setField,
    exp: {
      setField: setExpField,
      setBullet: setExpBullet,
      addBullet: addExpBullet,
      rmBullet: rmExpBullet,
      add: addExp,
      rm: rmExp,
    },
    proj: {
      setField: setProjField,
      setBullet: setProjBullet,
      addBullet: addProjBullet,
      rmBullet: rmProjBullet,
      add: addProj,
      rm: rmProj,
    },
    edu: { setField: setEduField, add: addEdu, rm: rmEdu },
  };
}
