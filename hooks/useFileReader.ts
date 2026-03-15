"use client";

import { useState, useCallback } from "react";

export function useFileReader() {
  const [resumeText, setResumeText]   = useState("");
  const [fileName, setFileName]       = useState("");
  const [pendingFile, setPendingFile] = useState<{ base64: string; mimeType: string } | null>(null);
  const [isDragging, setIsDragging]   = useState(false);

  const readFile = useCallback(async (file: File) => {
    setFileName(file.name);
    if (file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = (e.target as FileReader).result as string;
        setPendingFile({ base64: result.split(",")[1], mimeType: file.type });
      };
      reader.readAsDataURL(file);
    } else {
      const text = await file.text();
      setResumeText(text);
      setPendingFile(null);
    }
  }, []);

  const reset = useCallback(() => {
    setResumeText("");
    setFileName("");
    setPendingFile(null);
    setIsDragging(false);
  }, []);

  return {
    resumeText,
    setResumeText,
    fileName,
    pendingFile,
    isDragging,
    setIsDragging,
    readFile,
    reset,
  };
}
