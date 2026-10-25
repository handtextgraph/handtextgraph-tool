"use client";

import { useEffect, useRef, useState } from "react";
import { maxPdfSelectedPages, maxPdfSize, openPdfExtractionSession, parsePdfPageSelection, PdfExtractionError, type PdfExtractionSession } from "@/lib/pdf-extraction";
import { trackEvent } from "@/lib/analytics";

type ImportedFile = { name: string; size: number };

export function PdfTextImporter({ onTextExtracted }: { onTextExtracted: (text: string) => void }) {
  const [file, setFile] = useState<ImportedFile | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageSelection, setPageSelection] = useState("all");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionRef = useRef<PdfExtractionSession | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => {
    abortRef.current?.abort();
    void sessionRef.current?.destroy();
  }, []);

  const closeSession = async () => {
    const session = sessionRef.current;
    sessionRef.current = null;
    if (session) await session.destroy();
  };

  const importPdf = async (selectedFile: File | undefined) => {
    setError("");
    if (!selectedFile) return;
    setFile({ name: selectedFile.name, size: selectedFile.size });
    setPageCount(0);
    setPageSelection("all");
    setIsWorking(true);
    setStatus("Reading PDF details…");
    trackEvent("pdf_import_started", { tool_profile: "pdf" });
    abortRef.current?.abort();
    await closeSession();
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const session = await openPdfExtractionSession(selectedFile, controller.signal);
      sessionRef.current = session;
      setPageCount(session.pageCount);
      setStatus(`PDF ready: ${session.pageCount} page${session.pageCount === 1 ? "" : "s"}. Choose pages to extract.`);
    } catch (caughtError) {
      setStatus("");
      setError(getPdfErrorMessage(caughtError));
      trackPdfError(caughtError);
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setIsWorking(false);
    }
  };

  const extractSelectedPages = async () => {
    const session = sessionRef.current;
    if (!session) return;
    setError("");
    let pages: number[];
    try { pages = parsePdfPageSelection(pageSelection, session.pageCount); }
    catch (caughtError) { setError(getPdfErrorMessage(caughtError)); return; }
    setIsWorking(true);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const text = await session.extract(pages, ({ currentPage, totalPages, pageNumber }) => {
        setStatus(`Extracting PDF page ${pageNumber} (${currentPage} of ${totalPages})…`);
      }, controller.signal);
      onTextExtracted(text);
      setStatus("Text extracted. You can edit it below.");
      trackEvent("pdf_import_completed", { tool_profile: "pdf" });
    } catch (caughtError) {
      setStatus("");
      setError(getPdfErrorMessage(caughtError));
      trackPdfError(caughtError);
      if (caughtError instanceof PdfExtractionError && caughtError.code === "cancelled") {
        await closeSession();
        setPageCount(0);
      }
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setIsWorking(false);
    }
  };

  const cancelExtraction = async () => {
    abortRef.current?.abort();
    await closeSession();
    setPageCount(0);
    setIsWorking(false);
    setStatus("");
    setError("Extraction cancelled. Choose the PDF again to restart.");
  };

  const removeFile = async () => {
    abortRef.current?.abort();
    await closeSession();
    setFile(null); setPageCount(0); setStatus(""); setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <section className="mb-5 rounded-2xl border border-blue-100 bg-blue-50 p-4" aria-labelledby="pdf-upload-heading">
      <h3 id="pdf-upload-heading" className="text-lg font-semibold text-slate-950">Upload PDF</h3>
      <p className="mt-1 text-sm leading-6 text-slate-700">Upload a text-based PDF, select its pages, and extract editable text into the handwriting editor.</p>
      <div className={`mt-4 rounded-xl border-2 border-dashed p-5 text-center transition ${isDragging ? "border-brand-blue bg-white" : "border-blue-200 bg-white/70"}`}
        onDragEnter={(event) => { event.preventDefault(); if (!isWorking) setIsDragging(true); }} onDragOver={(event) => event.preventDefault()} onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => { event.preventDefault(); setIsDragging(false); if (!isWorking) void importPdf(event.dataTransfer.files[0]); }}>
        <input ref={inputRef} id="pdfImport" type="file" accept="application/pdf,.pdf" disabled={isWorking} className="sr-only"
          onChange={(event) => { void importPdf(event.target.files?.[0]); event.currentTarget.value = ""; }} />
        <label htmlFor="pdfImport" className={`inline-flex min-h-11 items-center rounded-full bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white ${isWorking ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-blue-700"}`}>
          {isWorking && !pageCount ? "Reading PDF…" : file ? "Replace PDF" : "Choose PDF"}
        </label>
        <p className="mt-2 text-xs text-slate-500">or drag and drop one PDF here · maximum {maxPdfSize / (1024 * 1024)} MB</p>
      </div>
      {file && <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm">
        <div className="min-w-0"><p className="truncate font-semibold text-slate-950">{file.name}</p><p className="mt-1 text-xs text-slate-500">{formatFileSize(file.size)}{pageCount ? ` · ${pageCount} page${pageCount === 1 ? "" : "s"}` : ""}</p></div>
        <button type="button" disabled={isWorking} onClick={() => void removeFile()} className="font-semibold text-slate-600 hover:text-slate-950 disabled:opacity-50">Remove</button>
      </div>}
      {pageCount > 0 && <div className="mt-3 rounded-xl border border-blue-100 bg-white p-4">
        <label htmlFor="pdfPageSelection" className="text-sm font-semibold text-slate-950">Pages to extract</label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input id="pdfPageSelection" className="input-field min-h-11 flex-1" value={pageSelection} disabled={isWorking} onChange={(event) => setPageSelection(event.target.value)} placeholder="all, 1-3, or 2,4,6" />
          <button type="button" disabled={isWorking} onClick={() => void extractSelectedPages()} className="min-h-11 rounded-full bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">Extract pages</button>
        </div>
        <p className="mt-2 text-xs leading-5 text-slate-500">Use “all”, one page, a range such as 1-3, or a list such as 2,4,6. Up to {maxPdfSelectedPages} pages per extraction.</p>
      </div>}
      {isWorking && <button type="button" onClick={() => void cancelExtraction()} className="mt-3 min-h-11 rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50">Cancel extraction</button>}
      {status && <p className="mt-3 text-sm font-semibold text-brand-blue" role="status" aria-live="polite">{status}</p>}
      {error && <p className="mt-3 text-sm font-semibold leading-6 text-rose-700" role="alert">{error}</p>}
      <p className="mt-3 text-xs leading-5 text-slate-600">Your PDF is processed in your browser and is not uploaded to our server. Scanned PDFs need OCR, which is not currently available.</p>
    </section>
  );
}

function getPdfErrorMessage(error: unknown) {
  const code = error instanceof PdfExtractionError ? error.code : "parse";
  if (code === "password") return "This PDF is password-protected and cannot be read.";
  if (code === "empty") return "No selectable text was found. This may be a scanned or image-only PDF; OCR is not currently available.";
  if (code === "cancelled") return "Extraction cancelled. Choose the PDF again to restart.";
  if (code === "invalid_range") return "Enter valid pages within this PDF, for example: all, 1, 1-3, or 2,4,6.";
  if (code === "page_limit") return `This PDF has too many pages to process safely, or the selection exceeds ${maxPdfSelectedPages} pages. Choose a smaller PDF or page range.`;
  if (code === "text_limit") return "The selected pages contain too much text for one browser session. Extract a smaller page range.";
  if (code === "too_large") return "PDF files must be 15 MB or smaller.";
  if (code === "invalid_type") return "Please upload a valid PDF file.";
  return "We couldn't read this PDF. It may be damaged or unsupported. Try another text-based PDF.";
}

function trackPdfError(error: unknown) {
  const code = error instanceof PdfExtractionError ? error.code : "parse";
  const category = code === "password" ? "password_protected" : code === "empty" ? "no_selectable_text" : code === "parse" ? "read_failed" : code;
  trackEvent("pdf_import_error", { tool_profile: "pdf", error_category: category });
}

function formatFileSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
