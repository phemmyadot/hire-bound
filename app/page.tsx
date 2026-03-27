"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { COLORS } from "@/lib/constants";
import { TEMPLATES } from "@/lib/templates";
import type { TabId, TemplateKey } from "@/lib/constants";
import { computeAts } from "@/lib/ats";
import { ResumeContext } from "@/context/ResumeContext";
import { useResumeData } from "@/hooks/useResumeData";
import { useResumeProcessor } from "@/hooks/useResumeProcessor";
import { useFileReader } from "@/hooks/useFileReader";
import { useJobFinder } from "@/hooks/useJobFinder";
import { useResumeHistory } from "@/hooks/useResumeHistory";
import type { ResumeData } from "@/lib/types";
import { Topbar } from "@/components/layout/Topbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { UploadScreen } from "@/components/panels/UploadScreen";
import { ProcessingScreen } from "@/components/panels/ProcessingScreen";
import { ResumeTab } from "@/components/panels/ResumeTab";
import { CoverTab } from "@/components/panels/CoverTab";
import { SuggestionsTab } from "@/components/panels/SuggestionsTab";
import { JobsTab } from "@/components/panels/JobsTab";
import { HistoryTab } from "@/components/panels/HistoryTab";
import { SettingsTab } from "@/components/panels/SettingsTab";

const GLOBAL_STYLES = `
  @keyframes fadeIn   { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin     { to{transform:rotate(360deg)} }
  @keyframes pulse    { 0%,100%{opacity:0.35} 50%{opacity:0.9} }
  @keyframes pulseDot { 0%,100%{opacity:.3;transform:scale(.8)} 50%{opacity:1;transform:scale(1.2)} }
  textarea:focus, input:focus { border-color: #3b82f6 !important; outline: none; }
  textarea, input { transition: border-color 0.15s; }
  * { box-sizing: border-box; }
`;

export default function App() {
  const [jobDesc, setJobDesc]               = useState("");
  const [activeTab, setActiveTab]           = useState<TabId>("resume");
  const [activeTemplate, setActiveTemplate] = useState<TemplateKey>("classic");
  const [savedId, setSavedId]               = useState<number | null>(null);
  const [saving, setSaving]                 = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const resume    = useResumeData();
  const history   = useResumeHistory();

  // Auto-save after processing completes
  const initDataAndSave = useCallback(async (data: ResumeData) => {
    if (!data) return;
    resume.initData(data);
    const id = await history.save(data);
    if (id) setSavedId(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resume.initData, history.save]);

  const processor = useResumeProcessor({ jobDesc, initData: initDataAndSave });
  const file      = useFileReader();
  const jobFinder = useJobFinder({ editData: resume.editData, activeSkills: resume.activeSkills, jobDesc });

  // Load history list on mount
  useEffect(() => { history.load(); }, [history.load]);

  // Manual save / update
  const onSave = useCallback(async () => {
    if (!resume.editData) return;
    setSaving(true);
    if (savedId) {
      await history.update(savedId, resume.editData);
    } else {
      const id = await history.save(resume.editData);
      if (id) setSavedId(id);
    }
    setSaving(false);
  }, [resume.editData, savedId, history.update, history.save]);

  // Derived ATS
  const atsResult  = computeAts({ resumeData: resume.resumeData, editData: resume.editData, activeSkills: resume.activeSkills });
  const atsScore   = atsResult.score;
  const atsColor   = atsScore >= 80 ? "#22c55e" : atsScore >= 60 ? "#fbbf24" : "#ef4444";
  const liveMatched = atsResult.matched.length ? atsResult.matched : (resume.resumeData?.keywordsMatched || []);
  const liveMissing = atsResult.missing.length ? atsResult.missing : (resume.resumeData?.keywordsMissing || []);
  const ats = { score: atsScore, color: atsColor, matched: liveMatched, missing: liveMissing };

  const handleReset = () => {
    processor.setStep("upload");
    resume.resetData();
    file.reset();
    jobFinder.reset();
    setSavedId(null);
    setActiveTab("resume");
  };

  const handleDownload = () => {
    if (!resume.editData) return;
    const html = TEMPLATES[activeTemplate].render(resume.editData, resume.activeSkills);
    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${resume.editData.name || "Resume"}</title>
  <style>@media print{@page{margin:0.5in;size:letter}body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style>
</head>
<body>${html}
<script>window.onload=function(){setTimeout(function(){window.print();},300)}<\/script>
</body>
</html>`;
    const blob = new Blob([fullHtml], { type: "text/html" });
    const url  = URL.createObjectURL(blob);
    const win  = window.open(url, "_blank");
    if (!win) {
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(resume.editData.name || "resume").replace(/\s+/g, "_")}.html`;
      a.click();
    }
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  const ctx = {
    resume,
    processor,
    file,
    jobs: jobFinder,
    history,
    ats,
    jobDesc,
    setJobDesc,
    activeTemplate,
    setActiveTemplate,
    savedId,
    onSave,
    saving,
  };

  return (
    <ResumeContext.Provider value={ctx}>
      <style>{GLOBAL_STYLES}</style>

      {processor.step === "upload" && <UploadScreen />}

      {processor.step === "processing" && (
        <ProcessingScreen msg={processor.processingMsg} hasJD={!!jobDesc.trim()} />
      )}

      {processor.step === "preview" && (
        <div
          style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            background: COLORS.bg,
            fontFamily: "'Inter',-apple-system,sans-serif",
            color: COLORS.text,
          }}
        >
          <Topbar onNew={handleReset} onDownload={handleDownload} />

          <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              {activeTab === "resume"      && <ResumeTab iframeRef={iframeRef} />}
              {activeTab === "cover"       && <CoverTab />}
              {activeTab === "suggestions" && <SuggestionsTab />}
              {activeTab === "jobs"        && <JobsTab />}
              {activeTab === "history"     && <HistoryTab />}
              {activeTab === "settings"    && <SettingsTab onPreview={() => setActiveTab("resume")} />}
            </div>
          </div>
        </div>
      )}
    </ResumeContext.Provider>
  );
}
