"use client";

import { COLORS } from "@/lib/constants";
import { useResume } from "@/context/ResumeContext";
import { Btn } from "@/components/atoms";
import { JobSkeleton, JobCard } from "@/components/molecules";

export function JobsTab() {
  const { resume, jobs } = useResume();
  const { activeSkills } = resume;
  const { filteredJobs, loading, error, filter, setFilter, search, setSearch, load, jobs: allJobs } = jobs;

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "24px 28px", animation: "fadeIn 0.2s ease" }}>
      <div style={{ maxWidth: "780px", margin: "0 auto" }}>

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "20px",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2 style={{ fontSize: "19px", fontWeight: 700, marginBottom: "3px" }}>Job Finder</h2>
            <p style={{ color: COLORS.textDim, fontSize: "12.5px" }}>
              Roles matched to your profile · Click any card to apply
            </p>
          </div>
          <Btn
            variant="primary"
            onClick={load}
            disabled={loading}
            style={{ padding: "8px 18px", fontSize: "12.5px", fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 }}
          >
            {loading ? "Finding jobs…" : allJobs.length ? "↺ Refresh" : "Find Matching Jobs"}
          </Btn>
        </div>

        {/* Empty state */}
        {!loading && allJobs.length === 0 && !error && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              borderRadius: "12px",
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "14px" }}>🔍</div>
            <div style={{ fontSize: "15px", fontWeight: 600, marginBottom: "8px" }}>
              Find jobs that match your resume
            </div>
            <div style={{ color: COLORS.textFaint, fontSize: "12.5px", marginBottom: "20px", lineHeight: "1.7" }}>
              Claude generates tailored listings based on your title, skills, and experience — with direct apply links.
            </div>
            <Btn variant="primary" onClick={load} style={{ padding: "10px 24px", fontSize: "13px", fontWeight: 600 }}>
              Find Matching Jobs →
            </Btn>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[...Array(6)].map((_, i) => <JobSkeleton key={i} delay={i * 0.1} />)}
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            style={{
              padding: "14px 16px",
              background: "#1e0a0a",
              border: `1px solid ${COLORS.redBorder}`,
              borderRadius: "8px",
              color: COLORS.redDim,
              fontSize: "12.5px",
              marginBottom: "16px",
            }}
          >
            {error}
          </div>
        )}

        {/* Filters */}
        {allJobs.length > 0 && !loading && (
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center" }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, company, tag…"
              style={{
                flex: 1,
                minWidth: "180px",
                background: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
                borderRadius: "6px",
                color: COLORS.text,
                padding: "7px 10px",
                fontSize: "12px",
                outline: "none",
              }}
            />
            {["all", "Remote", "Hybrid", "On-site"].map((f) => (
              <Btn
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  background: filter === f ? "#1e3a5f" : COLORS.surface,
                  border: `1px solid ${filter === f ? COLORS.blue : COLORS.border}`,
                  color: filter === f ? COLORS.blueLight : COLORS.textDim,
                  whiteSpace: "nowrap",
                }}
              >
                {f === "all" ? "All Types" : f}
              </Btn>
            ))}
            <span style={{ fontSize: "11px", color: COLORS.textFaint, whiteSpace: "nowrap" }}>
              {filteredJobs.length} results
            </span>
          </div>
        )}

        {/* Job cards */}
        {!loading && filteredJobs.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {filteredJobs.map((job, i) => (
              <JobCard key={job.id || i} job={job} activeSkills={activeSkills} />
            ))}
          </div>
        )}

        {!loading && allJobs.length > 0 && filteredJobs.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px", color: COLORS.textFaint, fontSize: "13px" }}>
            No jobs match your filter.
          </div>
        )}

      </div>
    </div>
  );
}
