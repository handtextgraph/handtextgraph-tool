"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ExportFormat,
  HandwritingStyle,
  handwritingStyles,
  getCustomHandwritingStyles,
  isCustomHandwritingStyle,
  renderHandwriting,
  RenderSettings,
} from "@/lib/handwriting";
import { removeCustomFont } from "@/lib/custom-fonts";
import { FontUploadControl } from "@/components/FontUpload";
import { toolProfiles, type ToolProfile } from "@/lib/tool-profiles";
import { type HandwritingDraft, useHandwritingDraft } from "@/hooks/useHandwritingDraft";
import { paperGeneratorDefinitions, type PaperGeneratorSlug } from "@/lib/paper-generators";
import { PdfTextImporter } from "@/components/PdfTextImporter";
import { DocxTextImporter } from "@/components/DocxTextImporter";
import { getPageCountBand, trackEvent, trackPreviewError, trackPreviewRendered, trackToolView } from "@/lib/analytics";
import {
  getPhysicalPageDimensions,
  getSourceImageDimensions,
  selectExportPages,
  type ExportablePage,
} from "@/lib/handwriting-export";

const pageTypes = [
  { value: "lined", label: "Lined Paper" },
  { value: "blank", label: "Blank Paper" },
  { value: "graph", label: "Graph Paper" },
  { value: "custom", label: "Custom Paper" },
] as const;

const inkColors = [
  { value: "blue", label: "Blue Ink" },
  { value: "black", label: "Black Ink" },
  { value: "darkGray", label: "Dark Gray Ink" },
  { value: "custom", label: "Custom Ink Color" },
] as const;

const pageSizes = [
  { value: "a3", label: "A3 — 297 × 420 mm" },
  { value: "a4", label: "A4" },
  { value: "a5", label: "A5 — 148 × 210 mm" },
  { value: "letter", label: "US Letter" },
  { value: "legal", label: "US Legal" },
] as const;

const pdfQualities = [
  { value: "low", label: "150 DPI — efficient" },
  { value: "medium", label: "225 DPI — balanced" },
  { value: "high", label: "300 DPI — print" },
] as const;

const settingPresets: Array<{
  label: string;
  icon: string;
  className: string;
  settings: Partial<RenderSettings>;
}> = [
  {
    label: "Worksheet",
    icon: "doc",
    className: "bg-brand-blue text-white shadow-paper hover:bg-blue-700",
    settings: {
      styleId: "classic-student",
      pageType: "lined",
      inkColor: "blue",
      fontSize: 34,
      lineSpacing: 1.55,
      wordSpacing: 1,
      randomness: 0.38,
      leftMargin: 165,
      topMargin: 120,
      paragraphIndentMode: true,
    },
  },
  {
    label: "Class Notes",
    icon: "note",
    className: "bg-emerald-600 text-white shadow-paper hover:bg-emerald-700",
    settings: {
      styleId: "clean-notes",
      pageType: "lined",
      inkColor: "blue",
      fontSize: 32,
      lineSpacing: 1.45,
      wordSpacing: 0.95,
      randomness: 0.32,
      leftMargin: 150,
      topMargin: 105,
      paragraphIndentMode: false,
    },
  },
  {
    label: "Lab Record",
    icon: "grid",
    className: "bg-slate-950 text-white shadow-paper hover:bg-slate-800",
    settings: {
      styleId: "lab-record",
      pageType: "graph",
      inkColor: "black",
      fontSize: 30,
      lineSpacing: 1.5,
      wordSpacing: 0.95,
      randomness: 0.28,
      leftMargin: 155,
      topMargin: 110,
      paragraphIndentMode: true,
    },
  },
  {
    label: "Practice Sheet",
    icon: "check",
    className: "bg-indigo-600 text-white shadow-paper hover:bg-indigo-700",
    settings: {
      styleId: "practice-sheet",
      pageType: "blank",
      inkColor: "black",
      fontSize: 31,
      lineSpacing: 1.6,
      wordSpacing: 1,
      randomness: 0.26,
      leftMargin: 140,
      topMargin: 95,
      paragraphIndentMode: true,
    },
  },
  {
    label: "Neat Notebook",
    icon: "book",
    className: "bg-cyan-700 text-white shadow-paper hover:bg-cyan-800",
    settings: {
      styleId: "neat-margin",
      pageType: "lined",
      inkColor: "blue",
      fontSize: 30,
      lineSpacing: 1.5,
      wordSpacing: 1.05,
      randomness: 0.22,
      leftMargin: 170,
      topMargin: 115,
      paragraphIndentMode: false,
    },
  },
  {
    label: "Revision Notes",
    icon: "book",
    className: "bg-violet-700 text-white shadow-paper hover:bg-violet-800",
    settings: {
      styleId: "clean-notes",
      pageType: "lined",
      pageSize: "a4",
      inkColor: "black",
      fontSize: 31,
      lineSpacing: 1.55,
      wordSpacing: 1,
      randomness: 0.26,
      leftMargin: 170,
      topMargin: 115,
      showMarginLine: true,
      paragraphIndentMode: false,
    },
  },
  {
    label: "Simple Notes",
    icon: "note",
    className: "bg-slate-600 text-white shadow-paper hover:bg-slate-700",
    settings: {
      styleId: "daily-notebook",
      pageType: "blank",
      pageSize: "a4",
      inkColor: "blue",
      fontSize: 32,
      lineSpacing: 1.5,
      wordSpacing: 1,
      randomness: 0.3,
      leftMargin: 145,
      topMargin: 110,
      showMarginLine: false,
      paragraphIndentMode: false,
    },
  },
];

type RenderedPage = ExportablePage;

type ExportState = {
  active: boolean;
  message: string;
};

export function HandwritingTool({ profile = "default" }: { profile?: ToolProfile }) {
  const profileConfig = toolProfiles[profile];
  const [text, setText] = useState(profileConfig.starterText);
  const [settings, setSettings] = useState<RenderSettings>(profileConfig.settings);
  const [pages, setPages] = useState<RenderedPage[]>([]);
  const [fileName, setFileName] = useState(profileConfig.fileName);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteSubject, setNoteSubject] = useState("");
  const [noteDate, setNoteDate] = useState("");
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [scope, setScope] = useState<"current" | "all">("current");
  const [isRendering, setIsRendering] = useState(true);
  const [renderError, setRenderError] = useState("");
  const [renderAttempt, setRenderAttempt] = useState(0);
  const [exportState, setExportState] = useState<ExportState>({ active: false, message: "" });
  const [customPaperImage, setCustomPaperImage] = useState<HTMLImageElement | null>(null);
  const [customPaperName, setCustomPaperName] = useState("");
  const [customPaperError, setCustomPaperError] = useState("");
  const [transparentPng, setTransparentPng] = useState(false);
  const [previewZoom, setPreviewZoom] = useState(70);
  const [customFonts, setCustomFonts] = useState<HandwritingStyle[]>(() => getCustomHandwritingStyles());
  const renderRequestId = useRef(0);
  const exportLock = useRef(false);
  const editorFocusTracked = useRef(false);
  const stylePreviewCache = useRef(new Map<string, HTMLCanvasElement>());
  const customPaperUrl = useRef<string | null>(null);
  const hasUserText = text.trim().length > 0;

  const draft = useMemo<HandwritingDraft>(() => ({
    text,
    settings,
    fileName,
    noteTitle,
    noteSubject,
    noteDate,
  }), [fileName, noteDate, noteSubject, noteTitle, settings, text]);
  const { clearDraft, isSaved } = useHandwritingDraft(profile, draft, (restored) => {
    setText(restored.text);
    setSettings({ ...profileConfig.settings, ...restored.settings });
    setFileName(restored.fileName);
    setNoteTitle(restored.noteTitle);
    setNoteSubject(restored.noteSubject);
    setNoteDate(restored.noteDate);
  });

  useEffect(() => () => {
    if (customPaperUrl.current) URL.revokeObjectURL(customPaperUrl.current);
  }, []);

  useEffect(() => {
    trackToolView(profile);
  }, [profile]);

  useEffect(() => {
    if (!hasUserText) {
      renderRequestId.current += 1;
      const timeoutId = window.setTimeout(() => {
        setPages([]);
        setIsRendering(false);
      }, 0);
      return () => window.clearTimeout(timeoutId);
    }

    const requestId = renderRequestId.current + 1;
    renderRequestId.current = requestId;

    const timeoutId = window.setTimeout(() => {
      setIsRendering(true);
      setRenderError("");
      void renderHandwriting(text, settings, customPaperImage ? { customPaperImage } : undefined)
        .then((result) => {
          if (renderRequestId.current !== requestId) {
            return;
          }

          const nextPages = result.pages.map((page) => ({
              pngUrl: page.toDataURL("image/png"),
              width: result.pageWidth,
              height: result.pageHeight,
            }));
          setPages(nextPages);
          trackPreviewRendered(profile, getPageCountBand(nextPages.length));
        })
        .catch((error) => {
          console.error("Failed to render handwriting preview", error);
          if (renderRequestId.current === requestId) {
            setPages([]);
            setRenderError(
              "We could not create the preview. Your browser may be low on memory, or the document may be too large. Try again, reduce PDF quality, or split the text into smaller sections.",
            );
            trackPreviewError(profile, "render_failed");
          }
        })
        .finally(() => {
          if (renderRequestId.current === requestId) {
            setIsRendering(false);
          }
        });
    }, hasUserText ? 120 : 0);

    return () => window.clearTimeout(timeoutId);
  }, [customPaperImage, hasUserText, profile, renderAttempt, settings, text]);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const shownPageCount = hasUserText ? Math.max(pages.length, 1) : 0;
  const canDownload = hasUserText && pages.length > 0 && !isRendering && !exportState.active;
  const safeBaseName = sanitizeFileName(fileName) || "handwriting-pages";
  const selectedPageIndex = Math.min(currentPageIndex, Math.max(pages.length - 1, 0));

  const updateSetting = <Key extends keyof RenderSettings>(key: Key, value: RenderSettings[Key]) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const downloadImage = async (page: RenderedPage, pageIndex: number, format: Extract<ExportFormat, "png" | "jpg">) => {
    const link = document.createElement("a");
    link.download = `${safeBaseName}-page-${pageIndex + 1}.${format}`;
    link.href = format === "png" ? page.pngUrl : await convertPngToJpg(page);
    link.click();
  };

  const getTransparentPages = async () => {
    const result = await renderHandwriting(text, settings, { transparentBackground: true });
    return result.pages.map((page) => ({
      pngUrl: page.toDataURL("image/png"),
      width: result.pageWidth,
      height: result.pageHeight,
    }));
  };

  const downloadImages = async (format: Extract<ExportFormat, "png" | "jpg">) => {
    if (!canDownload || exportLock.current) return;
    exportLock.current = true;
    const pageCountBand = getPageCountBand(pages.length);
    trackEvent("export_started", { tool_profile: profile, export_format: format, page_count_band: pageCountBand });

    setExportState({ active: true, message: `Preparing ${pages.length} ${format.toUpperCase()} files…` });
    try {
      const exportPages = format === "png" && transparentPng ? await getTransparentPages() : pages;
      for (let index = 0; index < exportPages.length; index += 1) {
        setExportState({ active: true, message: `Downloading page ${index + 1} of ${exportPages.length}…` });
        await downloadImage(exportPages[index], index, format);
      }
      setExportState({ active: false, message: `${format.toUpperCase()} download complete.` });
      trackEvent("export_completed", { tool_profile: profile, export_format: format, page_count_band: pageCountBand });
    } catch {
      setExportState({ active: false, message: "The image download failed. Try the current page, use PNG, or reduce PDF quality." });
      trackEvent("export_error", { tool_profile: profile, export_format: format, error_category: "image_download_failed" });
    } finally {
      exportLock.current = false;
    }
  };

  const downloadCurrentImage = async (format: Extract<ExportFormat, "png" | "jpg">) => {
    if (!canDownload || exportLock.current) return;
    exportLock.current = true;
    trackEvent("export_started", { tool_profile: profile, export_format: format, page_count_band: "1" });

    const page = pages[selectedPageIndex];
    if (!page) {
      exportLock.current = false;
      return;
    }

    setExportState({ active: true, message: `Preparing page ${selectedPageIndex + 1}…` });
    try {
      const exportPage = format === "png" && transparentPng
        ? (await getTransparentPages())[selectedPageIndex]
        : page;
      if (!exportPage) throw new Error("The selected page is unavailable.");
      await downloadImage(exportPage, selectedPageIndex, format);
      setExportState({ active: false, message: `${format.toUpperCase()} download complete.` });
      trackEvent("export_completed", { tool_profile: profile, export_format: format, page_count_band: "1" });
    } catch {
      setExportState({ active: false, message: "The image download failed. Try PNG or reduce PDF quality." });
      trackEvent("export_error", { tool_profile: profile, export_format: format, error_category: "image_download_failed" });
    } finally {
      exportLock.current = false;
    }
  };

  const downloadPdf = async (scope: "all" | "current") => {
    if (!canDownload || exportLock.current) return;
    exportLock.current = true;

    const targetPages = selectExportPages(pages, selectedPageIndex, scope);
    const pageCountBand = getPageCountBand(targetPages.length);
    trackEvent("export_started", { tool_profile: profile, export_format: "pdf", page_count_band: pageCountBand });
    const firstPage = targetPages[0];

    if (!firstPage) {
      exportLock.current = false;
      return;
    }

    setExportState({ active: true, message: `Preparing ${targetPages.length}-page PDF…` });
    try {
      const { jsPDF } = await import("jspdf");
      const basePhysicalSize = getPhysicalPageDimensions(settings.pageSize);
      const physicalSize = getPhysicalPageDimensions(settings.pageSize, settings.orientation);
      const pdf = new jsPDF({
        orientation: settings.orientation,
        unit: "mm",
        format: [basePhysicalSize.width, basePhysicalSize.height],
        compress: true,
      });

      targetPages.forEach((page, index) => {
        setExportState({ active: true, message: `Adding page ${index + 1} of ${targetPages.length}…` });
        if (index > 0) pdf.addPage([basePhysicalSize.width, basePhysicalSize.height], settings.orientation);
        pdf.addImage(page.pngUrl, "PNG", 0, 0, physicalSize.width, physicalSize.height, undefined, settings.pdfQuality === "high" ? "NONE" : "FAST");
      });

      pdf.save(`${safeBaseName}${scope === "current" ? `-page-${selectedPageIndex + 1}` : ""}.pdf`);
      setExportState({ active: false, message: "PDF download complete." });
      trackEvent("export_completed", { tool_profile: profile, export_format: "pdf", page_count_band: pageCountBand });
    } catch {
      setExportState({ active: false, message: "The PDF could not be created. Try a lower quality setting, export one page, or split the document." });
      trackEvent("export_error", { tool_profile: profile, export_format: "pdf", error_category: "pdf_creation_failed" });
    } finally {
      exportLock.current = false;
    }
  };

  const clearText = () => {
    clearDraft();
    setText("");
  };

  const resetText = () => {
    clearDraft();
    setText(profileConfig.starterText);
    setRenderError("");
  };

  const handleCustomPaper = (file: File | undefined) => {
    setCustomPaperError("");
    if (!file) return;
    if (!(["image/png", "image/jpeg", "image/webp"] as string[]).includes(file.type)) {
      setCustomPaperError("Choose a PNG, JPG, JPEG, or WebP image.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setCustomPaperError("Custom paper images must be 8 MB or smaller.");
      return;
    }

    const nextUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const previousUrl = customPaperUrl.current;
      customPaperUrl.current = nextUrl;
      setCustomPaperImage(image);
      setCustomPaperName(file.name);
      if (previousUrl) URL.revokeObjectURL(previousUrl);
    };
    image.onerror = () => {
      URL.revokeObjectURL(nextUrl);
      setCustomPaperError("This image could not be decoded. Try another PNG, JPG, or WebP file.");
    };
    image.src = nextUrl;
  };

  const handleFontUploaded = (style: HandwritingStyle) => {
    setCustomFonts(getCustomHandwritingStyles());
    updateSetting("styleId", style.id);
  };

  const handleRemoveCustomFont = (styleId: string) => {
    removeCustomFont(styleId);
    setCustomFonts(getCustomHandwritingStyles());
    if (settings.styleId === styleId) {
      updateSetting("styleId", handwritingStyles[0].id);
    }
  };

  const uploadedFontMissing =
    !handwritingStyles.some((style) => style.id === settings.styleId) &&
    !isCustomHandwritingStyle(settings.styleId);

  const applyNoteHeader = () => {
    const body = text.replace(/^(?:Title|Subject|Date):.*\n(?:Subject:.*\n)?(?:Date:.*\n)?\n/, "");
    const header = [
      noteTitle.trim() ? `Title: ${noteTitle.trim()}` : "",
      noteSubject.trim() ? `Subject: ${noteSubject.trim()}` : "",
      noteDate ? `Date: ${noteDate}` : "",
    ].filter(Boolean);

    setText(header.length ? `${header.join("\n")}\n\n${body}` : body);
  };

  const largeDocument = wordCount >= 5000 || text.length >= 30000;
  const manyPages = pages.length >= 10;

  return (
    <section className="handwriting-workspace grid scroll-mt-36 items-start gap-0 border-y border-slate-200 bg-white md:scroll-mt-28 lg:grid-cols-[minmax(0,0.82fr)_minmax(440px,1.18fr)]">
      <div className="editor-panel min-w-0 bg-white px-5 py-6 sm:px-6 lg:border-r lg:border-slate-200 lg:px-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-blue">{profileConfig.eyebrow}</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">{profileConfig.editorTitle}</h2>
          </div>
          <div className="shrink-0 border-l border-slate-200 pl-4 text-xs font-semibold text-brand-blue">
            {wordCount} words / {shownPageCount} page{shownPageCount === 1 ? "" : "s"}
          </div>
        </div>

        {profile === "pdf" && <PdfTextImporter onTextExtracted={setText} />}
        {profile === "word" && <DocxTextImporter onTextExtracted={setText} />}
        {profile === "notes" && (
          <fieldset className="mb-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
            <legend className="px-2 text-sm font-semibold text-slate-950">Optional note details</legend>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="input-label" htmlFor="noteTitle">Note title</label>
                <input id="noteTitle" className="input-field" value={noteTitle} onChange={(event) => setNoteTitle(event.target.value)} placeholder="Chapter summary" />
              </div>
              <div>
                <label className="input-label" htmlFor="noteSubject">Subject</label>
                <input id="noteSubject" className="input-field" value={noteSubject} onChange={(event) => setNoteSubject(event.target.value)} placeholder="Biology" />
              </div>
              <div>
                <label className="input-label" htmlFor="noteDate">Date</label>
                <input id="noteDate" className="input-field" type="date" value={noteDate} onChange={(event) => setNoteDate(event.target.value)} />
              </div>
            </div>
            <button type="button" onClick={applyNoteHeader} className="mt-3 inline-flex min-h-11 items-center rounded-full bg-brand-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
              Apply note details
            </button>
          </fieldset>
        )}
        <label className="input-label" htmlFor="handwriting-text">
          {profileConfig.inputLabel}
        </label>
        <textarea
          id="handwriting-text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onFocus={() => {
            if (editorFocusTracked.current) return;
            editorFocusTracked.current = true;
            trackEvent("editor_focus", { tool_profile: profile });
          }}
          className="input-field min-h-[210px] resize-y rounded-xl leading-6"
          placeholder={profileConfig.placeholder}
        />
        <div className="mt-4">
          <p className="input-label">Quick presets</p>
          <div className="flex flex-wrap gap-2">
            {settingPresets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() =>
                  setSettings((current) => ({
                    ...current,
                    ...preset.settings,
                  }))
                }
                className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition focus:outline-none focus:ring-4 focus:ring-blue-100 ${preset.className}`}
              >
                <PresetIcon name={preset.icon} className="h-4 w-4" />
                {preset.label}
              </button>
            ))}
          </div>
        </div>
        {text.length === 0 && (
          <div className="mt-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={resetText}
                className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-brand-blue transition hover:bg-blue-100"
              >
                Try sample text →
              </button>
              <p className="text-sm text-slate-500">or paste your own content above</p>
            </div>
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
          <p>
            {wordCount} words detected. Preview updates after you pause typing.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={clearText}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Clear Text
            </button>
            <button type="button" onClick={() => { clearDraft(); setSettings(profileConfig.settings); setFileName(profileConfig.fileName); setTransparentPng(false); setPreviewZoom(70); }} className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-50">Reset settings</button>
            {text.length > 0 && (
              <button
                type="button"
                onClick={resetText}
                className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 font-semibold text-brand-blue transition hover:bg-blue-100"
              >
                Try sample text →
              </button>
            )}
          </div>
        </div>
        {isSaved && <p className="mt-2 text-xs font-medium text-slate-500">Saved in this browser</p>}

        <div id="input-guidance" className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-6 text-slate-700">
          <p>
            There is no fixed text limit. For faster previews, work in sections when a document reaches several thousand
            words, and use low or medium PDF quality on memory-limited phones.
          </p>
          {(largeDocument || manyPages) && (
            <p className="mt-2 font-semibold text-amber-800" role="status">
              {manyPages
                ? `This document currently uses ${pages.length} pages. Large exports may take longer and use more memory.`
                : "This is a large document. Preview and export may take longer; splitting it into sections can improve reliability."}
            </p>
          )}
        </div>

        <details className="mt-4 rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3">
          <summary className="cursor-pointer text-sm font-semibold text-slate-950">
            Math lines with <code className="rounded bg-violet-100 px-1">$$</code>
            <span className="ml-2 text-sm font-normal text-slate-500">
              Centered display lines for formulas.
            </span>
          </summary>
          <div className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
            <p>
              Wrap any formula in double dollar signs, like{" "}
              <code className="rounded bg-violet-100 px-1">$$x^2 + 2x + 1 = 0$$</code>, and it becomes
              a centered display line with roomy spacing — handy for worksheets and revision notes. You
              can mix math with normal text: the <code className="rounded bg-violet-100 px-1">$$...$$</code>{" "}
              part gets its own line wherever it appears in a paragraph.
            </p>
            <p>
              Math lines are drawn in your handwriting font; this is not typeset LaTeX, so fractions,
              square roots, and stacked symbols will not render as textbook notation — write them in
              plain text (for example <code className="rounded bg-violet-100 px-1">(a+b)/2</code> or{" "}
              <code className="rounded bg-violet-100 px-1">sqrt(x)</code>). Very long formulas shrink to
              fit the page width. Math lines work with every paper type and are included in PNG, JPG,
              and PDF exports.
            </p>
          </div>
        </details>

        {renderError && (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm leading-6 text-rose-800" role="alert">
            <p>{renderError}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => setRenderAttempt((attempt) => attempt + 1)} className="inline-flex min-h-11 items-center rounded-full bg-rose-700 px-4 py-2 font-semibold text-white transition hover:bg-rose-800">
                Retry Preview
              </button>
              <button type="button" onClick={() => { clearDraft(); setSettings(profileConfig.settings); }} className="inline-flex min-h-11 items-center rounded-full border border-rose-200 bg-white px-4 py-2 font-semibold text-rose-800 transition hover:bg-rose-100">
                Reset Settings
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="border-t border-slate-200 pt-5 md:col-span-2 xl:col-span-3">
            <p className="input-label" id="styleId">
              Handwriting Style
            </p>
            <div className="flex flex-wrap gap-2" aria-labelledby="styleId">
              {customFonts.map((style) => (
                <StylePreviewCard
                  key={style.id}
                  style={style}
                  selected={settings.styleId === style.id}
                  previewCache={stylePreviewCache}
                  onClick={() => updateSetting("styleId", style.id)}
                  badge="Custom"
                  onRemove={() => handleRemoveCustomFont(style.id)}
                />
              ))}
              {handwritingStyles.map((style) => (
                <StylePreviewCard
                  key={style.id}
                  style={style}
                  selected={settings.styleId === style.id}
                  previewCache={stylePreviewCache}
                  onClick={() => updateSetting("styleId", style.id)}
                />
              ))}
            </div>
            {uploadedFontMissing && (
              <p className="mt-2 text-xs font-semibold text-amber-700" role="status">
                Your previously uploaded font is no longer available — uploaded fonts are kept for the
                current session only. Upload it again to keep using it.
              </p>
            )}
            <FontUploadControl onUploaded={handleFontUploaded} />
          </div>

          <div>
            <label className="input-label" htmlFor="pageType">
              Page Type
            </label>
            <select
              id="pageType"
              className="input-field"
              value={settings.pageType}
              onChange={(event) => updateSetting("pageType", event.target.value as RenderSettings["pageType"])}
            >
              {pageTypes.map((pageType) => (
                <option key={pageType.value} value={pageType.value}>
                  {pageType.label}
                </option>
              ))}
            </select>
            {settings.pageType === "custom" && (
              <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3">
                <label className="block cursor-pointer text-sm font-semibold text-slate-700" htmlFor="customPaper">
                  Upload custom paper
                </label>
                <input
                  id="customPaper"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="mt-2 block w-full text-xs text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:font-semibold file:text-brand-blue"
                  onChange={(event) => handleCustomPaper(event.target.files?.[0])}
                />
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  PNG, JPG, or WebP up to 8 MB. The image stays in this browser and is center-cropped to cover the page.
                </p>
                {customPaperName ? (
                  <p className="mt-2 text-xs font-semibold text-emerald-700">Using {customPaperName}</p>
                ) : (
                  <p className="mt-2 text-xs font-semibold text-amber-700">Upload the custom paper again after refreshing.</p>
                )}
                {customPaperError && <p className="mt-2 text-xs font-semibold text-rose-700" role="alert">{customPaperError}</p>}
              </div>
            )}
          </div>

          <div>
            <label className="input-label" htmlFor="pageSize">
              Page Size
            </label>
            <select
              id="pageSize"
              className="input-field"
              value={settings.pageSize}
              onChange={(event) => updateSetting("pageSize", event.target.value as RenderSettings["pageSize"])}
            >
              {pageSizes.map((pageSize) => (
                <option key={pageSize.value} value={pageSize.value}>
                  {pageSize.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="input-label" htmlFor="orientation">Orientation</label>
            <select id="orientation" className="input-field" value={settings.orientation} onChange={(event) => updateSetting("orientation", event.target.value as RenderSettings["orientation"])}>
              <option value="portrait">Portrait</option><option value="landscape">Landscape</option>
            </select>
          </div>

          <div>
            <label className="input-label" htmlFor="paperPatternId">Shared paper background</label>
            <select id="paperPatternId" className="input-field" value={settings.paperPatternId} onChange={(event) => updateSetting("paperPatternId", event.target.value as PaperGeneratorSlug | "none")}>
              <option value="none">Use page type above</option>
              {paperGeneratorDefinitions.map((definition) => <option key={definition.slug} value={definition.slug}>{definition.shortName}</option>)}
            </select>
            <p className="mt-1 text-xs leading-5 text-slate-500">Uses the printable-paper engine as a background layer. Handwriting line spacing remains independent.</p>
          </div>

          {settings.paperPatternId !== "none" && <RangeControl id="paperPatternSpacingMm" label="Background spacing (mm)" min={2} max={30} step={0.25} value={settings.paperPatternSpacingMm} onChange={(value) => updateSetting("paperPatternSpacingMm", value)} />}

          <div>
            <label className="input-label" htmlFor="textAlignment">Text alignment</label>
            <select id="textAlignment" className="input-field" value={settings.textAlignment} onChange={(event) => updateSetting("textAlignment", event.target.value as RenderSettings["textAlignment"])}>
              <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
            </select>
          </div>

          <div>
            <label className="input-label" htmlFor="inkColor">
              Ink Color
            </label>
            <select
              id="inkColor"
              className="input-field"
              value={settings.inkColor}
              onChange={(event) => updateSetting("inkColor", event.target.value as RenderSettings["inkColor"])}
            >
              {inkColors.map((color) => (
                <option key={color.value} value={color.value}>
                  {color.label}
                </option>
              ))}
            </select>
            {settings.inkColor === "custom" && <input aria-label="Custom ink color" className="mt-2 h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-white p-1" type="color" value={settings.customInkColor} onChange={(event) => updateSetting("customInkColor", event.target.value)} />}
          </div>

          <div>
            <label className="input-label" htmlFor="pdfQuality">
              Export resolution
            </label>
            <select
              id="pdfQuality"
              className="input-field"
              value={settings.pdfQuality}
              onChange={(event) => updateSetting("pdfQuality", event.target.value as RenderSettings["pdfQuality"])}
            >
              {pdfQualities.map((quality) => (
                <option key={quality.value} value={quality.value}>
                  {quality.label}
                </option>
              ))}
            </select>
          </div>

          <RangeControl
            id="fontSize"
            label="Font Size"
            min={24}
            max={44}
            step={1}
            value={settings.fontSize}
            onChange={(value) => updateSetting("fontSize", value)}
          />
          <RangeControl
            id="lineSpacing"
            label="Line Spacing"
            min={1.2}
            max={2.2}
            step={0.05}
            value={settings.lineSpacing}
            onChange={(value) => updateSetting("lineSpacing", value)}
          />
          <RangeControl
            id="wordSpacing"
            label="Word Spacing"
            min={0.8}
            max={1.6}
            step={0.05}
            value={settings.wordSpacing}
            onChange={(value) => updateSetting("wordSpacing", value)}
          />
          <RangeControl id="letterSpacing" label="Letter Spacing" min={-1} max={5} step={0.25} value={settings.letterSpacing} onChange={(value) => updateSetting("letterSpacing", value)} />
        </div>

        <details className="mt-6 border-y border-slate-200 py-4">
          <summary className="cursor-pointer list-none text-sm font-semibold text-slate-950">
            <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-xs text-slate-600">
              &gt;
            </span>
            Advanced Settings
            <span className="ml-2 text-sm font-normal text-slate-500">
              Fine-tune margins, paper brightness, tilt, and handwriting variation.
            </span>
          </summary>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <RangeControl
              id="randomness"
              label="Natural Variation"
              min={0.05}
              max={0.9}
              step={0.05}
              value={settings.randomness}
              onChange={(value) => updateSetting("randomness", value)}
            />
            <RangeControl
              id="leftMargin"
              label="Left Margin"
              min={120}
              max={240}
              step={2}
              value={settings.leftMargin}
              onChange={(value) => updateSetting("leftMargin", value)}
            />
            <RangeControl
              id="topMargin"
              label="Top Margin"
              min={70}
              max={180}
              step={2}
              value={settings.topMargin}
              onChange={(value) => updateSetting("topMargin", value)}
            />
            <RangeControl
              id="paperBrightness"
              label="Paper Brightness"
              min={90}
              max={104}
              step={1}
              value={settings.paperBrightness}
              onChange={(value) => updateSetting("paperBrightness", value)}
            />
            <RangeControl
              id="pageTilt"
              label="Optional Page Tilt"
              min={0}
              max={0.6}
              step={0.1}
              value={settings.pageTilt}
              onChange={(value) => updateSetting("pageTilt", value)}
            />
          </div>
        </details>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={settings.paragraphIndentMode}
              onChange={(event) => updateSetting("paragraphIndentMode", event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
            />
            Paragraph Indent
          </label>
          <label className="inline-flex items-center gap-3 border-l border-slate-200 pl-4 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={settings.showMarginLine}
              onChange={(event) => updateSetting("showMarginLine", event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
            />
            Margin Line
          </label>
        </div>

        <div className="mt-6 grid gap-4 border-t border-slate-200 pt-5 lg:grid-cols-[1fr,auto] lg:items-end">
          <div>
            <label className="input-label" htmlFor="fileName">
              Export File Name
            </label>
            <input
              id="fileName"
              className="input-field"
              value={fileName}
              onChange={(event) => setFileName(event.target.value)}
              placeholder="handwriting-pages"
            />
          </div>
          <div>
            <label className="input-label" htmlFor="currentPage">
              Current Page
            </label>
            <select
              id="currentPage"
              className="input-field min-w-40"
              value={selectedPageIndex}
              onChange={(event) => setCurrentPageIndex(Number(event.target.value))}
              disabled={!hasUserText || !pages.length}
            >
              {pages.map((_, index) => (
                <option key={index} value={index}>
                  Page {index + 1}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 border-t border-slate-200 pt-5">
          <div className="flex flex-wrap gap-2">
            {(["current", "all"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setScope(item)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  scope === item
                    ? "bg-blue-50 text-brand-blue ring-1 ring-blue-100"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {item === "current" ? "Current page" : "All pages"}
              </button>
            ))}
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={() => {
                void downloadPdf(scope);
              }}
              disabled={!canDownload}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-brand-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {exportState.active ? "Preparing…" : "Download PDF"}
            </button>
          </div>

          <section className="mt-4 border-t border-slate-200 pt-4" aria-labelledby="more-formats-heading">
            <h3 id="more-formats-heading" className="text-sm font-semibold text-slate-950">More formats</h3>
            <label className="mt-3 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={transparentPng}
                onChange={(event) => setTransparentPng(event.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
              />
              <span>
                <span className="block font-semibold text-slate-950">Transparent PNG background</span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">PNG only. Paper remains visible in the preview, PDF, and JPG exports.</span>
              </span>
            </label>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  void (scope === "current" ? downloadCurrentImage("png") : downloadImages("png"));
                }}
                disabled={!canDownload}
                className="inline-flex min-h-11 items-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Download PNG
              </button>
              <button
                type="button"
                onClick={() => {
                  void (scope === "current" ? downloadCurrentImage("jpg") : downloadImages("jpg"));
                }}
                disabled={!canDownload}
                className="inline-flex min-h-11 items-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Download JPG
              </button>
            </div>
          </section>

          <p className="mt-4 text-xs leading-5 text-slate-500">
            Export only content you created or have permission to use. Do not use generated pages to misrepresent
            authorship, identity, records, or assessed work. See our{" "}
            <Link href="/responsible-use" className="font-semibold text-brand-blue hover:underline">
              responsible-use guidance
            </Link>
            .
          </p>

          {exportState.message && (
            <div
              className={`mt-4 rounded-2xl border px-4 py-3 text-sm leading-6 ${
                exportState.message.includes("failed") || exportState.message.includes("could not")
                  ? "border-rose-200 bg-rose-50 text-rose-800"
                  : "border-blue-100 bg-blue-50 text-slate-700"
              }`}
              role={exportState.message.includes("failed") || exportState.message.includes("could not") ? "alert" : "status"}
              aria-live="polite"
            >
              {exportState.message}
            </div>
          )}
        </div>
      </div>

      <div className="preview-panel page-preview relative self-start bg-[#f3f5f8] px-5 py-6 sm:px-7 lg:sticky lg:top-24 lg:min-h-[760px]">
        {isRendering && <div className="absolute left-0 top-0 h-[3px] w-full animate-pulse bg-brand-blue" />}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-green">Preview</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-950">Real-time handwritten pages</h3>
          </div>
          <div className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold text-brand-green">
            {hasUserText ? "Live preview" : "Waiting for text"}
          </div>
          <div className="flex items-center gap-2" aria-label="Preview zoom controls">
            <button type="button" onClick={() => setPreviewZoom((value) => Math.max(40, value - 10))} className="grid h-10 w-10 place-items-center rounded-full border border-slate-300 bg-white font-bold" aria-label="Zoom out">−</button>
            <span className="min-w-12 text-center text-xs font-semibold tabular-nums text-slate-600">{previewZoom}%</span>
            <button type="button" onClick={() => setPreviewZoom((value) => Math.min(110, value + 10))} className="grid h-10 w-10 place-items-center rounded-full border border-slate-300 bg-white font-bold" aria-label="Zoom in">+</button>
          </div>
        </div>

        <p id="preview-description" className="sr-only">
          The preview contains {pages.length || (hasUserText ? 1 : 0)} handwritten-style page{pages.length === 1 ? "" : "s"} generated from the text editor. Decorative paper lines and text positioning are represented in the preview images.
        </p>
        <div className="studio-preview-scroll max-h-[800px] space-y-6 overflow-auto px-1 pb-5" aria-live="polite" aria-describedby="preview-description" aria-busy={isRendering}>
          {!pages.length && (hasUserText ? <StaticPreviewPaper /> : <BlankPreviewPaper />)}
          {pages.map((page, index) => (
            <div
              key={`${page.pngUrl}-${index}`}
              className="paper-frame relative mx-auto bg-white shadow-[0_18px_48px_rgba(15,23,42,0.16)] ring-1 ring-slate-300/70"
              style={{ width: `${previewZoom}%`, maxWidth: 760 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={page.pngUrl}
                alt={`Handwriting preview page ${index + 1}`}
                className="h-auto w-full"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StylePreviewCard({
  style,
  selected,
  previewCache,
  onClick,
  badge,
  onRemove,
}: {
  style: HandwritingStyle;
  selected: boolean;
  previewCache: { current: Map<string, HTMLCanvasElement> };
  onClick: () => void;
  badge?: string;
  onRemove?: () => void;
}) {
  void previewCache;

  return (
    <div className="relative min-h-[66px] flex-1 basis-[120px]">
      <button
        type="button"
        onClick={onClick}
        className={`h-full w-full rounded-lg p-1.5 text-left transition ${
          selected
            ? "border-2 border-brand-blue bg-blue-50"
            : "border border-slate-200 bg-white hover:bg-slate-50"
        }`}
      >
        <span className="block truncate text-xs font-semibold text-slate-950">
          {style.label}
          {badge && (
            <span className="ml-1.5 rounded-full bg-violet-100 px-1.5 py-0.5 align-middle text-[10px] font-bold uppercase tracking-wide text-violet-700">
              {badge}
            </span>
          )}
        </span>
        <span
          className="mt-1 block h-8 w-full truncate bg-white/70 px-1 py-1 text-lg leading-6 text-brand-blue"
          style={{ fontFamily: style.primary }}
        >
          Hello sample
        </span>
      </button>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove the uploaded font ${style.label}`}
          title="Remove this uploaded font"
          className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 text-sm font-bold leading-none text-white shadow transition hover:bg-rose-700"
        >
          ×
        </button>
      )}
    </div>
  );
}

function BlankPreviewPaper() {
  return (
    <div className="paper-frame mx-auto max-w-[570px] bg-white shadow-[0_18px_48px_rgba(15,23,42,0.16)] ring-1 ring-slate-300/70">
      <div className="relative aspect-[1240/1754] overflow-hidden bg-[#fffdf4]">
        <div className="absolute bottom-0 left-0 top-0 w-[11%] border-r-2 border-red-200/80" />
        <div className="absolute inset-x-0 top-[11%] space-y-[4.7%]">
          {Array.from({ length: 16 }).map((_, index) => (
            <div key={index} className="h-px bg-blue-200/70" />
          ))}
        </div>
      </div>
    </div>
  );
}

function StaticPreviewPaper() {
  return (
    <div className="paper-frame mx-auto max-w-[570px] bg-white shadow-[0_18px_48px_rgba(15,23,42,0.16)] ring-1 ring-slate-300/70">
      <div className="relative aspect-[1240/1754] overflow-hidden bg-[#fffdf4]">
        <div className="absolute bottom-0 left-0 top-0 w-[11%] border-r-2 border-red-200/80" />
        <div className="absolute inset-x-0 top-[11%] space-y-[4.7%]">
          {Array.from({ length: 16 }).map((_, index) => (
            <div key={index} className="h-px bg-blue-200/70" />
          ))}
        </div>
        <div className="absolute left-[16%] right-[8%] top-[10%] text-brand-blue">
          <p className="font-hand text-[clamp(1.2rem,3vw,2.4rem)] leading-snug">Title: Weekly Planning Notes</p>
          <p className="font-hand mt-[5%] text-[clamp(1.05rem,2.5vw,2rem)] leading-snug">
            This preview shows how your typed notes can become a readable handwritten-style page.
          </p>
          <p className="font-hand mt-[5%] text-[clamp(1.05rem,2.5vw,2rem)] leading-snug">
            Adjust paper, spacing, margins, ink color, and style before exporting.
          </p>
          <p className="font-hand mt-[5%] text-[clamp(1.05rem,2.5vw,2rem)] leading-snug">
            Use it for notes, worksheets, journal drafts, printables, and design previews.
          </p>
        </div>
      </div>
    </div>
  );
}

function PresetIcon({ name, className }: { name: string; className?: string }) {
  if (name === "note") {
    return (
      <svg
        aria-hidden="true"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.3"
        viewBox="0 0 24 24"
      >
        <path d="M5 4h14v16H5Z" />
        <path d="M8 8h8" />
        <path d="M8 12h8" />
        <path d="M8 16h5" />
      </svg>
    );
  }

  if (name === "grid") {
    return (
      <svg
        aria-hidden="true"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.3"
        viewBox="0 0 24 24"
      >
        <path d="M4 4h16v16H4Z" />
        <path d="M4 10h16" />
        <path d="M4 16h16" />
        <path d="M10 4v16" />
        <path d="M16 4v16" />
      </svg>
    );
  }

  if (name === "check") {
    return (
      <svg
        aria-hidden="true"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.3"
        viewBox="0 0 24 24"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    );
  }

  if (name === "book") {
    return (
      <svg
        aria-hidden="true"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.3"
        viewBox="0 0 24 24"
      >
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 1 4 17.5Z" />
        <path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.3"
      viewBox="0 0 24 24"
    >
      <path d="M6 3h9l3 3v15H6Z" />
      <path d="M14 3v4h4" />
      <path d="M9 13h6" />
      <path d="M9 17h4" />
    </svg>
  );
}

function RangeControl({
  id,
  label,
  min,
  max,
  step,
  value,
  onChange,
}: {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="border-b border-slate-100 pb-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="text-xs font-semibold text-slate-700" htmlFor={id}>{label}</label>
        <span className="text-xs font-semibold tabular-nums text-brand-blue">{value.toFixed(step < 1 ? 2 : 0)}</span>
      </div>
      <div>
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={`${label}: ${value.toFixed(step < 1 ? 2 : 0)}`}
          onChange={(event) => onChange(Number(event.target.value))}
          className="range-field"
        />
        <div className="mt-1 flex justify-between text-[10px] text-slate-400"><span>{min}</span><span>{max}</span></div>
      </div>
    </div>
  );
}

function sanitizeFileName(value: string) {
  return value
    .trim()
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function convertPngToJpg(page: RenderedPage) {
  return new Promise<string>((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const sourceSize = getSourceImageDimensions(image);
      canvas.width = sourceSize.width;
      canvas.height = sourceSize.height;

      if (!ctx) {
        reject(new Error("Canvas context could not be created."));
        return;
      }

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.95));
    };
    image.onerror = () => reject(new Error("Could not prepare JPG download."));
    image.src = page.pngUrl;
  });
}
