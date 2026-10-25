import { buildPaperPageModel, getPaperDimensions, getRasterDimensions, type PaperPageModel, type PaperPrimitive, type PaperSize } from "./paper-engine.ts";

export type PrintableOrientation = "portrait" | "landscape";
export type PrintablePageSize = PaperSize;
export type PrintablePattern = "lined" | "graph" | "dots" | "blank" | "guided";
export type PracticeMode = "blank" | "trace" | "copy";

export interface PrintableTemplatePreset {
  id: string;
  name: string;
  category: "Printable Paper" | "Graph & Dot Grid" | "Handwriting Practice";
  description: string;
  pattern: PrintablePattern;
  spacingMm: number;
  lineThicknessMm: number;
  leftGuide: boolean;
  practice: boolean;
}

export interface PrintableTemplateConfig {
  presetId: string;
  pageSize: PrintablePageSize;
  orientation: PrintableOrientation;
  spacingMm: number;
  lineThicknessMm: number;
  margins: { top: number; right: number; bottom: number; left: number };
  pageCount: number;
  leftGuide: boolean;
  headerEnabled: boolean;
  header: { name: string; date: string; subject: string };
  practiceMode: PracticeMode;
  practiceText: string;
}

export type PrintablePrimitive = PaperPrimitive;
export type PrintablePageModel = PaperPageModel;

export const printableTemplatePresets: PrintableTemplatePreset[] = [
  { id: "college-ruled", name: "College Ruled Paper", category: "Printable Paper", description: "Balanced ruling for everyday notes and longer writing.", pattern: "lined", spacingMm: 7.1, lineThicknessMm: 0.22, leftGuide: true, practice: false },
  { id: "wide-ruled", name: "Wide Ruled Paper", category: "Printable Paper", description: "More vertical room for larger handwriting and early practice.", pattern: "lined", spacingMm: 8.7, lineThicknessMm: 0.24, leftGuide: true, practice: false },
  { id: "narrow-ruled", name: "Narrow Ruled Paper", category: "Printable Paper", description: "Compact lines for smaller writing and dense notes.", pattern: "lined", spacingMm: 6, lineThicknessMm: 0.2, leftGuide: true, practice: false },
  { id: "standard-lined", name: "Standard Lined Paper", category: "Printable Paper", description: "A neutral notebook layout with manually adjustable spacing.", pattern: "lined", spacingMm: 8, lineThicknessMm: 0.22, leftGuide: false, practice: false },
  { id: "graph-paper", name: "Graph Paper", category: "Graph & Dot Grid", description: "A crisp square grid for calculations, diagrams, and layouts.", pattern: "graph", spacingMm: 5, lineThicknessMm: 0.14, leftGuide: false, practice: false },
  { id: "dot-grid", name: "Dot Grid Paper", category: "Graph & Dot Grid", description: "Subtle dots for flexible writing, planning, and sketching.", pattern: "dots", spacingMm: 5, lineThicknessMm: 0.32, leftGuide: false, practice: false },
  { id: "blank-writing", name: "Blank Writing Paper", category: "Printable Paper", description: "Clean printable paper with optional margins and header.", pattern: "blank", spacingMm: 8, lineThicknessMm: 0.2, leftGuide: false, practice: false },
  { id: "primary-handwriting", name: "Primary Handwriting Practice", category: "Handwriting Practice", description: "Solid upper and baseline guides with a dashed middle guide.", pattern: "guided", spacingMm: 18, lineThicknessMm: 0.24, leftGuide: false, practice: true },
  { id: "seyes-ruled", name: "Seyes Ruled Paper", category: "Printable Paper", description: "French-style Seyes ruling with fine vertical guides for precise cursive and small writing.", pattern: "lined", spacingMm: 8, lineThicknessMm: 0.2, leftGuide: true, practice: false },
  { id: "legal-ruled", name: "Legal Ruled Paper", category: "Printable Paper", description: "Classic legal-pad spacing with a left margin guide for drafts and longer notes.", pattern: "lined", spacingMm: 8.7, lineThicknessMm: 0.22, leftGuide: true, practice: false },
  { id: "extra-wide-ruled", name: "Extra Wide Ruled Paper", category: "Printable Paper", description: "Large 11 mm spacing for early learners, large print, and bold writing.", pattern: "lined", spacingMm: 11, lineThicknessMm: 0.26, leftGuide: true, practice: false },
  { id: "journal-lined", name: "Journal Lined Paper", category: "Printable Paper", description: "Clean lined layout without a margin guide for journals, letters, and lists.", pattern: "lined", spacingMm: 8, lineThicknessMm: 0.2, leftGuide: false, practice: false },
  { id: "exam-answer-paper", name: "Exam Answer Paper", category: "Printable Paper", description: "Comfortable ruling with a margin guide for exam answers, essays, and timed writing.", pattern: "lined", spacingMm: 8.7, lineThicknessMm: 0.22, leftGuide: true, practice: false },
  { id: "cornell-notes-paper", name: "Cornell Notes Paper", category: "Printable Paper", description: "Ruled paper with a left cue column for notes, keywords, and summaries.", pattern: "lined", spacingMm: 8, lineThicknessMm: 0.22, leftGuide: true, practice: false },
  { id: "letter-writing-paper", name: "Letter Writing Paper", category: "Printable Paper", description: "Open lined spacing for personal letters and friendly correspondence.", pattern: "lined", spacingMm: 8.7, lineThicknessMm: 0.2, leftGuide: false, practice: false },
  { id: "meeting-notes-paper", name: "Meeting Notes Paper", category: "Printable Paper", description: "Neutral ruled layout for meeting minutes, agendas, and action lists.", pattern: "lined", spacingMm: 8, lineThicknessMm: 0.22, leftGuide: true, practice: false },
  { id: "squared-paper", name: "Squared Paper (5 mm)", category: "Graph & Dot Grid", description: "Classic squared maths paper with 5 mm grid for calculations and charts.", pattern: "graph", spacingMm: 5, lineThicknessMm: 0.15, leftGuide: false, practice: false },
  { id: "fine-graph-paper", name: "Fine Graph Paper (2.5 mm)", category: "Graph & Dot Grid", description: "Tight 2.5 mm grid for precise diagrams and miniature layouts.", pattern: "graph", spacingMm: 2.5, lineThicknessMm: 0.12, leftGuide: false, practice: false },
  { id: "large-graph-paper", name: "Large Graph Paper (10 mm)", category: "Graph & Dot Grid", description: "Bold 10 mm grid for sketching, mapping, and planning big ideas.", pattern: "graph", spacingMm: 10, lineThicknessMm: 0.18, leftGuide: false, practice: false },
  { id: "wide-dot-grid", name: "Wide Dot Grid Paper (7 mm)", category: "Graph & Dot Grid", description: "Open 7 mm dot spacing for journaling and relaxed page layouts.", pattern: "dots", spacingMm: 7, lineThicknessMm: 0.34, leftGuide: false, practice: false },
  { id: "fine-dot-grid", name: "Fine Dot Grid Paper (4 mm)", category: "Graph & Dot Grid", description: "Compact 4 mm dot spacing for trackers and detailed notes.", pattern: "dots", spacingMm: 4, lineThicknessMm: 0.3, leftGuide: false, practice: false },
  { id: "math-grid-paper", name: "Math Grid Paper", category: "Graph & Dot Grid", description: "Grid tuned for column arithmetic, long division, and neat number work.", pattern: "graph", spacingMm: 5, lineThicknessMm: 0.16, leftGuide: false, practice: false },
  { id: "cursive-uppercase-practice", name: "Cursive Uppercase Practice", category: "Handwriting Practice", description: "Tall guided rows for tracing and copying the uppercase cursive alphabet — paste A–Z into the practice text.", pattern: "guided", spacingMm: 22, lineThicknessMm: 0.24, leftGuide: false, practice: true },
  { id: "cursive-lowercase-practice", name: "Cursive Lowercase Practice", category: "Handwriting Practice", description: "Guided rows for lowercase cursive joins and flow — paste a–z into the practice text.", pattern: "guided", spacingMm: 16, lineThicknessMm: 0.24, leftGuide: false, practice: true },
  { id: "cursive-sentence-practice", name: "Cursive Sentence Practice", category: "Handwriting Practice", description: "Guided rows for full-sentence cursive writing and smooth letter connections.", pattern: "guided", spacingMm: 14, lineThicknessMm: 0.24, leftGuide: false, practice: true },
  { id: "name-tracing-practice", name: "Name Tracing Sheets", category: "Handwriting Practice", description: "Guided rows for tracing and copying a name — type it into the practice text field.", pattern: "guided", spacingMm: 20, lineThicknessMm: 0.24, leftGuide: false, practice: true },
  { id: "dotted-midline-wide", name: "Dotted Midline Practice (Wide)", category: "Handwriting Practice", description: "Extra-tall three-line groups with a dotted midline for early writers.", pattern: "guided", spacingMm: 24, lineThicknessMm: 0.26, leftGuide: false, practice: true },
  { id: "dotted-midline-narrow", name: "Dotted Midline Practice (Narrow)", category: "Handwriting Practice", description: "Compact three-line groups with a dotted midline for confident writers.", pattern: "guided", spacingMm: 12, lineThicknessMm: 0.22, leftGuide: false, practice: true },
  { id: "story-paper-primary", name: "Story Paper (Primary)", category: "Handwriting Practice", description: "Tall guided rows with generous spacing for young storytellers and picture captions.", pattern: "guided", spacingMm: 20, lineThicknessMm: 0.24, leftGuide: false, practice: true },
  { id: "spelling-word-practice", name: "Spelling Word Practice", category: "Handwriting Practice", description: "Guided rows sized for weekly spelling lists — type the words into the practice text.", pattern: "guided", spacingMm: 16, lineThicknessMm: 0.24, leftGuide: false, practice: true },
  { id: "number-tracing-practice", name: "Number Tracing Practice", category: "Handwriting Practice", description: "Guided rows for tracing and copying numbers 0–9 — type the digits into the practice text.", pattern: "guided", spacingMm: 18, lineThicknessMm: 0.24, leftGuide: false, practice: true },
  { id: "sentence-practice-primary", name: "Sentence Practice (Primary)", category: "Handwriting Practice", description: "Tall guided rows for writing complete sentences with proper letter height.", pattern: "guided", spacingMm: 18, lineThicknessMm: 0.24, leftGuide: false, practice: true },
  { id: "sentence-practice-standard", name: "Sentence Practice (Standard)", category: "Handwriting Practice", description: "Standard guided rows for everyday sentence handwriting practice.", pattern: "guided", spacingMm: 12, lineThicknessMm: 0.22, leftGuide: false, practice: true },
  { id: "quote-copy-practice", name: "Quote Copy Practice", category: "Handwriting Practice", description: "Guided rows for copying quotes and affirmations neatly — type the quote into the practice text.", pattern: "guided", spacingMm: 14, lineThicknessMm: 0.24, leftGuide: false, practice: true },
  { id: "print-alphabet-practice", name: "Print Alphabet Practice", category: "Handwriting Practice", description: "Guided rows for printing uppercase letters A–Z with consistent height.", pattern: "guided", spacingMm: 18, lineThicknessMm: 0.24, leftGuide: false, practice: true },
  { id: "print-lowercase-practice", name: "Print Lowercase Practice", category: "Handwriting Practice", description: "Guided rows for printing lowercase letters with correct x-height.", pattern: "guided", spacingMm: 14, lineThicknessMm: 0.24, leftGuide: false, practice: true },
  { id: "handwriting-warmup", name: "Handwriting Warm-Up Sheet", category: "Handwriting Practice", description: "Standard guided rows for daily drills, loops, and stroke warm-ups.", pattern: "guided", spacingMm: 14, lineThicknessMm: 0.24, leftGuide: false, practice: true },
  { id: "paragraph-practice", name: "Paragraph Practice", category: "Handwriting Practice", description: "Guided rows for writing full paragraphs with consistent size and spacing.", pattern: "guided", spacingMm: 12, lineThicknessMm: 0.22, leftGuide: false, practice: true },
  { id: "vocabulary-practice", name: "Vocabulary Practice", category: "Handwriting Practice", description: "Guided rows for copying new vocabulary words and short definitions.", pattern: "guided", spacingMm: 14, lineThicknessMm: 0.24, leftGuide: false, practice: true },
  { id: "first-tracing-practice", name: "First Tracing Practice", category: "Handwriting Practice", description: "Extra-tall guided rows for pre-writers learning basic strokes and curves.", pattern: "guided", spacingMm: 26, lineThicknessMm: 0.26, leftGuide: false, practice: true },
];

const presetMap = new Map(printableTemplatePresets.map((preset) => [preset.id, preset]));
const clamp = (value: number, minimum: number, maximum: number) => Math.min(maximum, Math.max(minimum, Number.isFinite(value) ? value : minimum));

export function getPrintablePreset(id: string) {
  return presetMap.get(id) ?? printableTemplatePresets[0];
}

export function createPrintableConfig(presetId = printableTemplatePresets[0].id, overrides: Partial<PrintableTemplateConfig> = {}): PrintableTemplateConfig {
  const preset = getPrintablePreset(presetId);
  return {
    presetId: preset.id,
    pageSize: "a4",
    orientation: "portrait",
    spacingMm: preset.spacingMm,
    lineThicknessMm: preset.lineThicknessMm,
    margins: { top: 15, right: 14, bottom: 15, left: 18 },
    pageCount: 1,
    leftGuide: preset.leftGuide,
    headerEnabled: false,
    header: { name: "", date: "", subject: "" },
    practiceMode: "blank",
    practiceText: "Practice makes progress",
    ...overrides,
  };
}

export function normalizePrintableConfig(config: PrintableTemplateConfig): PrintableTemplateConfig {
  const dimensions = getPrintablePageDimensions(config.pageSize, config.orientation);
  return {
    ...config,
    presetId: getPrintablePreset(config.presetId).id,
    spacingMm: clamp(config.spacingMm, 3, 30),
    lineThicknessMm: clamp(config.lineThicknessMm, 0.1, 1),
    pageCount: Math.round(clamp(config.pageCount, 1, 20)),
    margins: {
      top: clamp(config.margins.top, 5, Math.min(50, dimensions.height / 3)),
      right: clamp(config.margins.right, 5, Math.min(50, dimensions.width / 3)),
      bottom: clamp(config.margins.bottom, 5, Math.min(50, dimensions.height / 3)),
      left: clamp(config.margins.left, 5, Math.min(50, dimensions.width / 3)),
    },
    header: {
      name: config.header.name.slice(0, 60),
      date: config.header.date.slice(0, 40),
      subject: config.header.subject.slice(0, 80),
    },
    practiceText: config.practiceText.slice(0, 120),
  };
}

export function getPrintablePageDimensions(pageSize: PrintablePageSize, orientation: PrintableOrientation) {
  return getPaperDimensions(pageSize, orientation);
}

export function getPrintablePngDimensions(config: PrintableTemplateConfig, dpi = 150) {
  const dimensions = getPrintablePageDimensions(config.pageSize, config.orientation);
  const raster = getRasterDimensions(dimensions.width, dimensions.height, dpi);
  return { width: raster.width, height: raster.height };
}

export function getPrintableFilename(config: PrintableTemplateConfig, extension: "pdf" | "png" | "svg") {
  const preset = getPrintablePreset(config.presetId);
  const base = preset.practice ? "handwriting-practice" : preset.id;
  return `${base}-${config.pageSize}${config.orientation === "landscape" ? "-landscape" : ""}.${extension}`;
}

export function buildPrintablePageModel(input: PrintableTemplateConfig): PrintablePageModel {
  const config = normalizePrintableConfig(input);
  const preset = getPrintablePreset(config.presetId);
  const { width, height } = getPrintablePageDimensions(config.pageSize, config.orientation);
  const primitives: PrintablePrimitive[] = [];
  const ink = "#0f172a";
  const rule = "#b8d0ee";
  const guide = "#dc6b73";
  let contentTop = config.margins.top;
  const contentBottom = height - config.margins.bottom;
  const contentLeft = config.margins.left;
  const contentRight = width - config.margins.right;

  if (config.headerEnabled) {
    const headerY = contentTop + 4;
    primitives.push({ kind: "text", x: contentLeft, y: headerY, text: `Name: ${config.header.name}`, color: ink, size: 3.5 });
    primitives.push({ kind: "text", x: width / 2, y: headerY, text: `Subject: ${config.header.subject}`, color: ink, size: 3.5 });
    primitives.push({ kind: "text", x: contentRight - 35, y: headerY, text: `Date: ${config.header.date}`, color: ink, size: 3.5 });
    primitives.push({ kind: "line", x1: contentLeft, y1: headerY + 4, x2: contentRight, y2: headerY + 4, color: "#cbd5e1", width: 0.2 });
    contentTop += 16;
  }

  if (config.leftGuide) {
    const x = Math.min(contentRight - 5, contentLeft + 12);
    primitives.push({ kind: "line", x1: x, y1: contentTop, x2: x, y2: contentBottom, color: guide, width: Math.max(0.22, config.lineThicknessMm) });
  }

  const pattern = preset.pattern === "lined"
    ? { kind: "lined" as const, spacingMm: config.spacingMm, color: rule, lineWidthMm: config.lineThicknessMm }
    : preset.pattern === "graph"
      ? { kind: "square-grid" as const, spacingMm: config.spacingMm, color: rule, lineWidthMm: config.lineThicknessMm }
      : preset.pattern === "dots"
        ? { kind: "dot-grid" as const, spacingMm: config.spacingMm, color: "#8faed2", lineWidthMm: config.lineThicknessMm, radiusMm: config.lineThicknessMm }
        : preset.pattern === "guided"
          ? { kind: "guided" as const, rowHeightMm: config.spacingMm, color: rule, lineWidthMm: config.lineThicknessMm, midlineColor: "#a8bfdc", baselineColor: "#6f9bd0", dashMm: [1.3, 1.3] }
          : { kind: "blank" as const };
  const baseModel = buildPaperPageModel({
    size: config.pageSize,
    orientation: config.orientation,
    marginsMm: { top: contentTop, right: config.margins.right, bottom: config.margins.bottom, left: config.margins.left },
    background: "#ffffff",
    pattern,
  });
  primitives.push(...baseModel.primitives);

  if (preset.pattern === "guided") {
    let rowIndex = 0;
    for (let y = contentTop; y + config.spacingMm <= contentBottom + 0.01; y += config.spacingMm, rowIndex += 1) {
      const baseline = y + config.spacingMm;
      const showTrace = config.practiceMode === "trace" && rowIndex % 2 === 0;
      const showCopy = config.practiceMode === "copy" && rowIndex === 0;
      if ((showTrace || showCopy) && config.practiceText.trim()) {
        primitives.push({ kind: "text", x: contentLeft + 2, y: baseline - 1.4, text: config.practiceText.trim(), color: ink, size: Math.min(7, config.spacingMm * 0.42), opacity: showTrace ? 0.24 : 0.9 });
      }
    }
  }

  return { widthMm: width, heightMm: height, primitives, background: baseModel.background };
}
