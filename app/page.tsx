"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { COLORS, NAV_TABS } from "@/lib/constants";
import type { TabId, TemplateKey } from "@/lib/constants";
import { computeAts } from "@/lib/ats";
import { ResumeContext } from "@/context/ResumeContext";
import { useResumeData } from "@/hooks/useResumeData";
import { useResumeProcessor } from "@/hooks/useResumeProcessor";
import { useFileReader } from "@/hooks/useFileReader";
import { useJobFinder } from "@/hooks/useJobFinder";
import { useResumeHistory } from "@/hooks/useResumeHistory";
import { useIsMobile } from "@/hooks/useIsMobile";
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
  const [appReady, setAppReady]             = useState(false);
  const [canGoBack, setCanGoBack]           = useState(false);
  const { status } = useSession();
  const isMobile = useIsMobile();

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

  // On mount: load history and auto-open the latest resume
  useEffect(() => {
    if (status !== "authenticated") return;
    history.load().then((list) => {
      if (!list.length) {
        setAppReady(true);
        return;
      }
      history.fetchOne(list[0].id).then((data) => {
        if (data) {
          resume.initData(data);
          setSavedId(list[0].id);
          processor.setStep("preview");
        }
        setAppReady(true);
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // "New" from preview toolbar → reset and go to upload
  const handleNew = useCallback(() => {
    setCanGoBack(true);
    processor.setStep("upload");
    resume.resetData();
    file.reset();
    jobFinder.reset();
    setSavedId(null);
    setJobDesc("");
    setActiveTab("resume");
  }, [processor, resume, file, jobFinder]);

  // Back from upload → return to preview
  const handleBackFromUpload = useCallback(() => {
    setCanGoBack(false);
    processor.setStep("preview");
  }, [processor]);

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

      {/* Upload */}
      {appReady && processor.step === "upload" && (
        <UploadScreen onBack={canGoBack ? handleBackFromUpload : null} />
      )}

      {/* Processing */}
      {processor.step === "processing" && (
        <ProcessingScreen msg={processor.processingMsg} hasJD={!!jobDesc.trim()} />
      )}

      {/* Preview / editor */}
      {appReady && processor.step === "preview" && (
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

          {/* Mobile tab strip */}
          {isMobile && (
            <div
              style={{
                display: "flex",
                overflowX: "auto",
                borderBottom: `1px solid ${COLORS.border}`,
                background: COLORS.bg,
                flexShrink: 0,
                scrollbarWidth: "none",
              }}
            >
              {NAV_TABS.map(({ id, label }) => {
                const active = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    style={{
                      flexShrink: 0,
                      padding: "10px 16px",
                      background: "transparent",
                      border: "none",
                      borderBottom: `2px solid ${active ? COLORS.blue : "transparent"}`,
                      color: active ? COLORS.text : COLORS.textDim,
                      fontSize: "12px",
                      fontWeight: active ? 600 : 400,
                      fontFamily: "inherit",
                      cursor: "pointer",
                      transition: "color 0.15s",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}

          <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
            {/* Sidebar — desktop only */}
            {!isMobile && <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />}

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
