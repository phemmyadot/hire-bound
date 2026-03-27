"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { COLORS } from "@/lib/constants";
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
import { ProfileScreen } from "@/components/panels/ProfileScreen";
import { UploadScreen } from "@/components/panels/UploadScreen";
import { ProcessingScreen } from "@/components/panels/ProcessingScreen";
import { ResumeTab } from "@/components/panels/ResumeTab";
import { CoverTab } from "@/components/panels/CoverTab";
import { SuggestionsTab } from "@/components/panels/SuggestionsTab";
import { JobsTab } from "@/components/panels/JobsTab";
import { HistoryTab } from "@/components/panels/HistoryTab";
import { SettingsTab } from "@/components/panels/SettingsTab";

type View = "profile" | "upload";

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
  const [view, setView]                     = useState<View>("profile");
  const [jobDesc, setJobDesc]               = useState("");
  const [activeTab, setActiveTab]           = useState<TabId>("resume");
  const [activeTemplate, setActiveTemplate] = useState<TemplateKey>("classic");
  const [savedId, setSavedId]               = useState<number | null>(null);
  const [saving, setSaving]                 = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const resume  = useResumeData();
  const history = useResumeHistory();

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

  useEffect(() => { history.load(); }, [history.load]);

  // "New" from the preview toolbar → back to profile and reset state
  const handleNew = useCallback(() => {
    processor.setStep("upload");
    resume.resetData();
    file.reset();
    jobFinder.reset();
    setSavedId(null);
    setJobDesc("");
    setActiveTab("resume");
    setView("profile");
  }, [processor, resume, file, jobFinder]);

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
  const atsResult   = computeAts({ resumeData: resume.resumeData, editData: resume.editData, activeSkills: resume.activeSkills });
  const atsScore    = atsResult.score;
  const atsColor    = atsScore >= 80 ? "#22c55e" : atsScore >= 60 ? "#fbbf24" : "#ef4444";
  const liveMatched = atsResult.matched.length ? atsResult.matched : (resume.resumeData?.keywordsMatched || []);
  const liveMissing = atsResult.missing.length ? atsResult.missing : (resume.resumeData?.keywordsMissing || []);
  const ats = { score: atsScore, color: atsColor, matched: liveMatched, missing: liveMissing };

  const handleDownload = () => {
    const cw = iframeRef.current?.contentWindow;
    if (!cw) return;
    cw.focus();
    cw.print();
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

      {/* Profile — default landing page */}
      {view === "profile" && processor.step !== "preview" && (
        <ProfileScreen onNew={() => setView("upload")} />
      )}

      {/* Upload */}
      {view === "upload" && processor.step === "upload" && <UploadScreen onBack={() => setView("profile")} />}

      {/* Processing */}
      {processor.step === "processing" && (
        <ProcessingScreen msg={processor.processingMsg} hasJD={!!jobDesc.trim()} />
      )}

      {/* Preview */}
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
          <Topbar onNew={handleNew} onDownload={handleDownload} />

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
