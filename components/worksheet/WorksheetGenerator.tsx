"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getPhysicalPageDimensions } from "@/lib/handwriting-export";
import type { PageSize } from "@/lib/handwriting";
import {
  buildWorksheetSpec,
  worksheetFileBaseName,
  type WorksheetAlphabetCase,
  type WorksheetInk,
  type WorksheetLineSize,
  type WorksheetMode,
  type WorksheetSpec,
  type WorksheetStyle,
} from "@/lib/worksheet";
import { renderWorksheetPages } from "./worksheetRenderer";

const modeTabs: Array<{ id: WorksheetMode; label: string; hint: string }> = [
  { id: "name", label: "Name tracing", hint: "Trace a name or single word" },
  { id: "alphabet", label: "A–Z alphabet", hint: "Uppercase and lowercase letters" },
  { id: "words", label: "Word list", hint: "Your own spelling or sight words" },
];

const lineSizeOptions: Array<{ id: WorksheetLineSize; label: string; hint: string }> = [
  { id: "small", label: "Small", hint: "Confident writers" },
  { id: "medium", label: "Medium", hint: "Most kids" },
  { id: "large", label: "Large", hint: "Beginners" },
];

function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Array<{ id: T; label: string; hint?: string }>;
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-900">{label}</p>
      <div className="mt-2 grid grid-cols-3 gap-2" role="group" aria-label={label}>
        {options.map((option) => {
          const active = option.id === value;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              aria-pressed={active}
              className={`rounded-2xl border px-3 py-2.5 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue ${
                active ? "border-brand-blue bg-blue-50 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <span className={`block text-sm font-semibold ${active ? "text-brand-blue" : "text-slate-800"}`}>{option.label}</span>
              {option.hint && <span className="mt-0.5 block text-xs leading-4 text-slate-500">{option.hint}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RowCountControl({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm font-semibold text-slate-900">{label}</p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
          className="h-9 w-9 rounded-full border border-slate-200 bg-white text-lg font-semibold text-slate-700 transition hover:border-slate-300 disabled:opacity-40"
        >
          −
        </button>
        <span className="w-8 text-center text-sm font-bold text-slate-900" aria-live="polite">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
          className="h-9 w-9 rounded-full border border-slate-200 bg-white text-lg font-semibold text-slate-700 transition hover:border-slate-300 disabled:opacity-40"
        >
          +
        </button>
      </div>
    </div>
  );
}

function ToggleControl({ label, hint, checked, onChange }: { label: string; hint: string; checked: boolean; onChange: (next: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-slate-300"
    >
      <span>
        <span className="block text-sm font-semibold text-slate-900">{label}</span>
        <span className="mt-0.5 block text-xs leading-4 text-slate-500">{hint}</span>
      </span>
      <span
        aria-hidden="true"
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${checked ? "bg-brand-blue" : "bg-slate-300"}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${checked ? "translate-x-6" : "translate-x-1"}`} />
      </span>
    </button>
  );
}

export function WorksheetGenerator() {
  const [mode, setMode] = useState<WorksheetMode>("name");
  const [name, setName] = useState("Emma");
  const [wordsText, setWordsText] = useState("cat\ndog\nsun\nfish\ntree");
  const [alphabetCase, setAlphabetCase] = useState<WorksheetAlphabetCase>("both");
  const [style, setStyle] = useState<WorksheetStyle>("print");
  const [lineSize, setLineSize] = useState<WorksheetLineSize>("medium");
  const [traceRows, setTraceRows] = useState(2);
  const [practiceRows, setPracticeRows] = useState(2);
  const [showGuides, setShowGuides] = useState(true);
  const [showHeader, setShowHeader] = useState(true);
  const [modelInk, setModelInk] = useState<WorksheetInk>("blue");
  const [pageSize, setPageSize] = useState<PageSize>("a4");

  const [pages, setPages] = useState<HTMLCanvasElement[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [rendering, setRendering] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [status, setStatus] = useState("");
  const previewRef = useRef<HTMLCanvasElement>(null);
  const renderToken = useRef(0);

  const spec: WorksheetSpec | null = useMemo(
    () => buildWorksheetSpec({ mode, name, wordsText, alphabetCase }),
    [mode, name, wordsText, alphabetCase],
  );

  useEffect(() => {
    const token = ++renderToken.current;
    const timer = setTimeout(async () => {
      setRendering(true);
      try {
        if (!spec) {
          if (renderToken.current === token) {
            setPages([]);
            setPageIndex(0);
            setRendering(false);
          }
          return;
        }
        const rendered = await renderWorksheetPages(spec, {
          pageSize,
          style,
          lineSize,
          traceRows,
          practiceRows,
          showGuides,
          showHeader,
          modelInk,
        });
        if (renderToken.current === token) {
          setPages(rendered);
          setPageIndex((current) => Math.min(current, Math.max(0, rendered.length - 1)));
        }
      } catch {
        if (renderToken.current === token) setStatus("The preview could not be rendered in this browser. Try reloading the page.");
      } finally {
        if (renderToken.current === token) setRendering(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [spec, pageSize, style, lineSize, traceRows, practiceRows, showGuides, showHeader, modelInk]);

  useEffect(() => {
    const page = pages[pageIndex];
    const preview = previewRef.current;
    if (!page || !preview) return;
    preview.width = page.width;
    preview.height = page.height;
    preview.getContext("2d")?.drawImage(page, 0, 0);
  }, [pages, pageIndex]);

  const baseName = spec ? worksheetFileBaseName(spec) : "handwriting-worksheet";

  const exportPng = () => {
    const page = pages[pageIndex];
    if (!page || exporting) return;
    setExporting(true);
    try {
      const link = document.createElement("a");
      link.href = page.toDataURL("image/png");
      link.download = `${baseName}-page-${pageIndex + 1}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setStatus(`PNG for page ${pageIndex + 1} downloaded.`);
    } catch {
      setStatus("The PNG download failed. Try the PDF export instead.");
    } finally {
      setExporting(false);
    }
  };

  const exportPdf = async () => {
    if (pages.length === 0 || exporting) return;
    setExporting(true);
    setStatus(`Preparing ${pages.length}-page PDF…`);
    try {
      const { jsPDF } = await import("jspdf");
      const physical = getPhysicalPageDimensions(pageSize);
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: [physical.width, physical.height], compress: true });
      pages.forEach((page, index) => {
        if (index > 0) pdf.addPage([physical.width, physical.height], "portrait");
        pdf.addImage(page.toDataURL("image/png"), "PNG", 0, 0, physical.width, physical.height, undefined, "FAST");
      });
      pdf.save(`${baseName}.pdf`);
      setStatus("PDF download complete.");
    } catch {
      setStatus("The PDF could not be created. Try exporting fewer rows per page or a single PNG.");
    } finally {
      setExporting(false);
    }
  };

  const printWorksheet = () => {
    if (!pages.length) return;
    const popup = window.open("", "_blank", "noopener,noreferrer");
    if (!popup) { setStatus("Allow pop-ups to print the worksheet."); return; }
    popup.document.write(`<html><head><title>${baseName}</title><style>@page{margin:0}body{margin:0}.page{display:block;width:100%;page-break-after:always}</style></head><body>${pages.map((page) => `<img class="page" src="${page.toDataURL("image/png")}" alt="Worksheet page">`).join("")}</body></html>`);
    popup.document.close(); popup.focus(); window.setTimeout(() => popup.print(), 250);
  };

  const resetWorksheet = () => { setMode("name"); setName("Emma"); setWordsText("cat\ndog\nsun\nfish\ntree"); setAlphabetCase("both"); setStyle("print"); setLineSize("medium"); setTraceRows(2); setPracticeRows(2); setShowGuides(true); setShowHeader(true); setModelInk("blue"); setPageSize("a4"); setStatus("Worksheet reset."); };

  const emptyInput = spec === null;

  return (
    <div className="grid gap-6 lg:grid-cols-[400px,1fr]">
      <div className="space-y-5">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-card sm:p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-blue">1 · Content</p>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Worksheet type">
            {modeTabs.map((tab) => {
              const active = tab.id === mode;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setMode(tab.id)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue ${
                    active ? "border-brand-blue bg-brand-blue text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="mt-4">
            {mode === "name" && (
              <div>
                <label htmlFor="ws-name" className="text-sm font-semibold text-slate-900">
                  Name or word to trace
                </label>
                <input
                  id="ws-name"
                  type="text"
                  value={name}
                  maxLength={40}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Type a name, e.g. Emma"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
                <p className="mt-2 text-xs leading-5 text-slate-500">One name or word per sheet works best. Keep it short for large letters.</p>
              </div>
            )}
            {mode === "alphabet" && (
              <SegmentedControl<WorksheetAlphabetCase>
                label="Letter case"
                value={alphabetCase}
                onChange={setAlphabetCase}
                options={[
                  { id: "upper", label: "ABC", hint: "Uppercase" },
                  { id: "lower", label: "abc", hint: "Lowercase" },
                  { id: "both", label: "Aa", hint: "Both cases" },
                ]}
              />
            )}
            {mode === "words" && (
              <div>
                <label htmlFor="ws-words" className="text-sm font-semibold text-slate-900">
                  Word list <span className="font-normal text-slate-500">(one word per line)</span>
                </label>
                <textarea
                  id="ws-words"
                  value={wordsText}
                  rows={7}
                  onChange={(event) => setWordsText(event.target.value)}
                  placeholder={"cat\ndog\nsun"}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
                <p className="mt-2 text-xs leading-5 text-slate-500">Paste spelling lists, sight words, or vocabulary — up to 60 words per sheet.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5 rounded-[28px] border border-slate-200 bg-white p-5 shadow-card sm:p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-blue">2 · Style</p>
          <SegmentedControl<WorksheetStyle>
            label="Letter style"
            value={style}
            onChange={setStyle}
            options={[
              { id: "print", label: "Print", hint: "Block letters" },
              { id: "cursive", label: "Cursive", hint: "Joined letters" },
            ]}
          />
          <SegmentedControl<WorksheetLineSize>
            label="Line size"
            value={lineSize}
            onChange={setLineSize}
            options={lineSizeOptions}
          />
          <SegmentedControl<WorksheetInk>
            label="Model ink"
            value={modelInk}
            onChange={setModelInk}
            options={[
              { id: "blue", label: "Blue", hint: "Classic school ink" },
              { id: "black", label: "Black", hint: "High contrast" },
            ]}
          />
          <SegmentedControl<PageSize>
            label="Paper size"
            value={pageSize}
            onChange={setPageSize}
            options={[
              { id: "a4", label: "A4", hint: "210 × 297 mm" },
              { id: "letter", label: "Letter", hint: "8.5 × 11 in" },
            ]}
          />
          <div className="space-y-3 border-t border-slate-100 pt-4">
            <RowCountControl label="Tracing rows per block" value={traceRows} min={1} max={3} onChange={setTraceRows} />
            <RowCountControl label="Blank practice rows" value={practiceRows} min={0} max={3} onChange={setPracticeRows} />
          </div>
          <div className="space-y-3">
            <ToggleControl label="Guide lines" hint="Sky, grass and ground lines on every row" checked={showGuides} onChange={setShowGuides} />
            <ToggleControl label="Name & date header" hint="A write-in header on every page" checked={showHeader} onChange={setShowHeader} />
          </div>
        </div>
      </div>

      <div className="lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-card sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-blue">3 · Preview & export</p>
              <p className="mt-1 text-sm text-slate-500" aria-live="polite">
                {rendering ? "Rendering…" : pages.length > 0 ? `${pages.length} page${pages.length > 1 ? "s" : ""} ready` : "Type something to preview your sheet"}
              </p>
            </div>
            {pages.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPageIndex((i) => Math.max(0, i - 1))}
                  disabled={pageIndex === 0}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 disabled:opacity-40"
                >
                  ← Prev
                </button>
                <span className="text-sm font-semibold text-slate-700">
                  {pageIndex + 1} / {pages.length}
                </span>
                <button
                  type="button"
                  onClick={() => setPageIndex((i) => Math.min(pages.length - 1, i + 1))}
                  disabled={pageIndex >= pages.length - 1}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            {pages.length > 0 ? (
              <canvas ref={previewRef} className="h-auto w-full" aria-label={`Worksheet preview, page ${pageIndex + 1}`} />
            ) : (
              <div className="flex min-h-[420px] items-center justify-center p-8 text-center">
                <p className="max-w-xs text-sm leading-6 text-slate-500">
                  {emptyInput ? "Enter a name or word list above and your tracing sheet will appear here." : "Preparing your worksheet…"}
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={exportPdf}
              disabled={pages.length === 0 || exporting}
              className="flex-1 rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {exporting ? "Working…" : `Download PDF${pages.length > 1 ? ` (${pages.length} pages)` : ""}`}
            </button>
            <button
              type="button"
              onClick={exportPng}
              disabled={pages.length === 0 || exporting}
              className="flex-1 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 disabled:opacity-50"
            >
              Download PNG (this page)
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={printWorksheet} disabled={!pages.length} className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-slate-300 disabled:opacity-50">Print worksheet</button>
            <button type="button" onClick={resetWorksheet} className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-slate-300">Reset worksheet</button>
            <button type="button" onClick={() => { setName(""); setWordsText(""); setMode("name"); setStatus("Ready for another worksheet."); }} className="rounded-full border border-blue-100 bg-blue-50 px-5 py-2.5 text-sm font-semibold text-brand-blue hover:bg-blue-100">Generate another</button>
          </div>
          {status && (
            <p className="mt-3 text-sm font-medium text-slate-600" role="status">
              {status}
            </p>
          )}
          <p className="mt-3 text-xs leading-5 text-slate-500">
            Everything renders in your browser — nothing is uploaded. Print at 100% / “Actual size” so the guide lines match the on-screen size.
          </p>
        </div>
      </div>
    </div>
  );
}
