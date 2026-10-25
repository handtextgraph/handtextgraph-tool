"use client";

import { useRef, useState } from "react";
import { DocxExtractionError, extractTextFromDocx, maxDocxSize } from "@/lib/docx-extraction";
import { trackEvent } from "@/lib/analytics";

type ImportedFile = { name: string; size: number };

export function DocxTextImporter({ onTextExtracted }: { onTextExtracted: (text: string) => void }) {
  const [file, setFile] = useState<ImportedFile | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const importDocx = async (selectedFile: File | undefined) => {
    setError("");
    if (!selectedFile) return;
    setFile({ name: selectedFile.name, size: selectedFile.size });
    setIsExtracting(true);
    setStatus("Extracting text from DOCX…");
    trackEvent("docx_upload_started", { tool_profile: "word" });

    try {
      const text = await extractTextFromDocx(selectedFile);
      onTextExtracted(text);
      setStatus("Text extracted. Review and edit it below.");
      trackEvent("docx_extraction_success", { tool_profile: "word" });
    } catch (caughtError) {
      setStatus("");
      const code = caughtError instanceof DocxExtractionError ? caughtError.code : "corrupt";
      setError(getDocxErrorMessage(code));
      trackEvent("docx_extraction_failed", {
        tool_profile: "word",
        error_category: code === "unsupported_doc" ? "legacy_doc" : code,
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setStatus("");
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <section className="mb-5 rounded-2xl border border-blue-100 bg-blue-50 p-4" aria-labelledby="docx-upload-heading">
      <h3 id="docx-upload-heading" className="text-lg font-semibold text-slate-950">Upload Word DOCX</h3>
      <p className="mt-1 text-sm leading-6 text-slate-700">
        Extract editable text from a .docx file, then use the existing handwriting editor and exports.
      </p>
      <div
        className={`mt-4 rounded-xl border-2 border-dashed p-5 text-center transition ${isDragging ? "border-brand-blue bg-white" : "border-blue-200 bg-white/70"}`}
        onDragEnter={(event) => { event.preventDefault(); if (!isExtracting) setIsDragging(true); }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          if (!isExtracting) void importDocx(event.dataTransfer.files[0]);
        }}
      >
        <input
          ref={inputRef}
          id="docxImport"
          type="file"
          accept=".docx,.doc,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
          disabled={isExtracting}
          className="sr-only"
          onChange={(event) => {
            void importDocx(event.target.files?.[0]);
            event.currentTarget.value = "";
          }}
        />
        <label
          htmlFor="docxImport"
          className={`inline-flex min-h-11 items-center rounded-full bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white ${isExtracting ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-blue-700"}`}
        >
          {isExtracting ? "Reading DOCX…" : file ? "Replace DOCX" : "Choose DOCX"}
        </label>
        <p className="mt-2 text-xs text-slate-500">or drag and drop one .docx file here · maximum {maxDocxSize / (1024 * 1024)} MB</p>
      </div>

      {file && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm">
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-950">{file.name}</p>
            <p className="mt-1 text-xs text-slate-500">{formatFileSize(file.size)}</p>
          </div>
          <button type="button" disabled={isExtracting} onClick={removeFile} className="font-semibold text-slate-600 hover:text-slate-950 disabled:opacity-50">
            Remove
          </button>
        </div>
      )}
      {status && <p className="mt-3 text-sm font-semibold text-brand-blue" role="status" aria-live="polite">{status}</p>}
      {error && <p className="mt-3 text-sm font-semibold leading-6 text-rose-700" role="alert">{error}</p>}
      <p className="mt-3 text-xs leading-5 text-slate-600">Your document is processed in this browser and is not uploaded to our server. Legacy .doc files are not supported.</p>
    </section>
  );
}

function getDocxErrorMessage(code: DocxExtractionError["code"]) {
  if (code === "unsupported_doc") return "Legacy .doc files are not supported. Open the file in Word and save it as .docx, or copy and paste its text.";
  if (code === "invalid_type") return "Please choose a valid .docx Word document.";
  if (code === "too_large") return "DOCX files must be 10 MB or smaller.";
  if (code === "too_complex") return "This document is too complex to process safely in the browser. Try saving a simpler .docx or copy and paste its text.";
  if (code === "empty") return "No readable text was found in this DOCX.";
  if (code === "text_limit") return "This document contains too much text for one browser session. Split it into smaller DOCX files.";
  return "We couldn't read this DOCX. It may be damaged or incomplete. Try saving it again from Word.";
}

function formatFileSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
