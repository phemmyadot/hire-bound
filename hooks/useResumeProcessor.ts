"use client";

import { useState, useCallback } from "react";
import { callClaude } from "@/lib/api";
import { RESUME_SYSTEM_PROMPT } from "@/lib/prompts";
import type { ResumeData } from "@/lib/types";

const PROCESSING_MESSAGES = [
  "Parsing resume content…",
  "Matching job description keywords…",
  "Rewriting bullets with impact…",
  "Calculating ATS score…",
  "Drafting cover letter…",
  "Generating career insights…",
];

interface Options {
  jobDesc: string;
  initData: (data: ResumeData) => void;
}

export type Step = "upload" | "processing" | "preview";

export function useResumeProcessor({ jobDesc, initData }: Options) {
  const [step, setStep]               = useState<Step>("upload");
  const [processingMsg, setProcessingMsg] = useState(PROCESSING_MESSAGES[0]);
  const [error, setError]             = useState("");

  const process = useCallback(
    async (text: string | null, base64: string | null, mimeType: string | null) => {
      setStep("processing");
      setError("");

      let i = 0;
      const ticker = setInterval(() => {
        i = (i + 1) % PROCESSING_MESSAGES.length;
        setProcessingMsg(PROCESSING_MESSAGES[i]);
      }, 1600);

      try {
        const jdBlock = jobDesc.trim()
          ? `\n\n--- JOB DESCRIPTION ---\n${jobDesc.trim()}\n--- END ---`
          : "";

        const userContent = base64
          ? [
              { type: "document", source: { type: "base64", media_type: mimeType, data: base64 } },
              { type: "text", text: `Analyze and improve this resume.${jdBlock}\nReturn only the JSON.` },
            ]
          : `Here is my resume:\n\n${text}${jdBlock}\n\nReturn only the JSON.`;

        const parsed = await callClaude<ResumeData>({
          system: RESUME_SYSTEM_PROMPT(!!jobDesc.trim()),
          userContent,
        });

        initData(parsed);
        setStep("preview");
      } catch {
        setError("Something went wrong processing your resume. Please try again.");
        setStep("upload");
      } finally {
        clearInterval(ticker);
      }
    },
    [jobDesc, initData]
  );

  return { step, setStep, processingMsg, error, process };
}
