import { alphabetSequence, fontFamilyForStyle, fontWeightForStyle, worksheetLineHeights, worksheetPagePixels } from "@/lib/worksheet";
import type { WorksheetRenderOptions, WorksheetSpec } from "@/lib/worksheet";

type RowKind = "model" | "trace" | "blank" | "gap";

interface RowSpec {
  kind: RowKind;
  /** For model: the text shown once. For trace: the pattern repeated across the row. */
  text: string;
}

const guideColors = {
  sky: "#8fb8e8",
  grass: "#e08080",
  ground: "#4a7fc9",
  trace: "#9aa7b8",
  header: "#334155",
  footer: "#94a3b8",
};

const modelInks = {
  blue: "#1d4ed8",
  black: "#1f2937",
};

/** Wait for the worksheet handwriting fonts so canvas text uses the right letterforms. */
export async function ensureWorksheetFonts(): Promise<void> {
  if (typeof document === "undefined" || !("fonts" in document)) return;
  try {
    await Promise.race([
      Promise.all([document.fonts.load('400 100px "Patrick Hand"'), document.fonts.load('600 100px "Caveat"')]),
      new Promise((resolve) => setTimeout(resolve, 2500)),
    ]);
  } catch {
    // Fall back to system fonts if the webfonts cannot load.
  }
}

interface RowGeometry {
  unit: number;
  rowHeight: number;
  gapHeight: number;
  fontPx: number;
  marginX: number;
  topMargin: number;
  bottomMargin: number;
  contentWidth: number;
}

function buildRows(spec: WorksheetSpec, options: WorksheetRenderOptions, measure: (text: string) => number, contentWidth: number): RowSpec[] {
  const rows: RowSpec[] = [];
  const pushBlock = (modelText: string, tracePattern: string) => {
    rows.push({ kind: "model", text: modelText });
    for (let i = 0; i < options.traceRows; i += 1) rows.push({ kind: "trace", text: tracePattern });
    for (let i = 0; i < options.practiceRows; i += 1) rows.push({ kind: "blank", text: "" });
    rows.push({ kind: "gap", text: "" });
  };

  if (spec.mode === "name") {
    pushBlock(spec.name, spec.name);
  } else if (spec.mode === "words") {
    for (const word of spec.words) pushBlock(word, word);
  } else {
    const sequence = alphabetSequence(spec.cases);
    for (const chunk of chunkSequence(sequence, measure, contentWidth)) {
      pushBlock(chunk, chunk);
    }
  }

  // Drop the trailing gap.
  if (rows.length > 0 && rows[rows.length - 1].kind === "gap") rows.pop();
  return rows;
}

function chunkSequence(sequence: string, measure: (text: string) => number, contentWidth: number): string[] {
  const tokens = sequence.split("  ");
  const chunks: string[] = [];
  let current = "";
  for (const token of tokens) {
    const candidate = current ? `${current}  ${token}` : token;
    if (measure(candidate) <= contentWidth) {
      current = candidate;
    } else {
      if (current) chunks.push(current);
      current = token;
    }
  }
  if (current) chunks.push(current);
  return chunks.length > 0 ? chunks : [sequence];
}

function fillRowPattern(measure: (text: string) => number, pattern: string, contentWidth: number): string {
  if (measure(pattern) >= contentWidth) return pattern;
  let text = pattern;
  const separator = "   ";
  let guard = 0;
  while (measure(`${text}${separator}${pattern}`) <= contentWidth && guard < 60) {
    text = `${text}${separator}${pattern}`;
    guard += 1;
  }
  return text;
}

function fitFontSize(ctx: CanvasRenderingContext2D, fontFamily: string, weight: number, ascentTarget: number, descentTarget: number): number {
  const probe = 100;
  ctx.font = `${weight} ${probe}px ${fontFamily}`;
  const metrics = ctx.measureText("Agjy Qq");
  const ascent = metrics.actualBoundingBoxAscent || probe * 0.8;
  const descent = metrics.actualBoundingBoxDescent || probe * 0.22;
  return Math.min(ascentTarget / ascent, descentTarget / descent) * probe;
}

function drawGuides(
  ctx: CanvasRenderingContext2D,
  x0: number,
  x1: number,
  topY: number,
  midY: number,
  baseY: number,
  unit: number,
): void {
  ctx.save();
  ctx.lineCap = "butt";
  // Sky line (top, solid).
  ctx.strokeStyle = guideColors.sky;
  ctx.lineWidth = Math.max(2, unit * 0.035);
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(x0, topY);
  ctx.lineTo(x1, topY);
  ctx.stroke();
  // Grass line (middle, dashed).
  ctx.strokeStyle = guideColors.grass;
  ctx.lineWidth = Math.max(1.5, unit * 0.03);
  ctx.setLineDash([unit * 0.22, unit * 0.16]);
  ctx.beginPath();
  ctx.moveTo(x0, midY);
  ctx.lineTo(x1, midY);
  ctx.stroke();
  // Ground line (baseline, solid).
  ctx.strokeStyle = guideColors.ground;
  ctx.lineWidth = Math.max(2.5, unit * 0.045);
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(x0, baseY);
  ctx.lineTo(x1, baseY);
  ctx.stroke();
  ctx.restore();
}

function drawHeader(ctx: CanvasRenderingContext2D, x0: number, x1: number, y: number, unit: number): void {
  ctx.save();
  ctx.fillStyle = guideColors.header;
  const fontPx = Math.max(22, unit * 0.52);
  ctx.font = `600 ${fontPx}px "DM Sans", system-ui, sans-serif`;
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  const labelGap = fontPx * 0.4;
  const lineLength = (x1 - x0) * 0.32;
  ctx.fillText("Name:", x0, y);
  const nameLabelWidth = ctx.measureText("Name:").width;
  drawWriteLine(ctx, x0 + nameLabelWidth + labelGap, y, lineLength);
  ctx.textAlign = "right";
  ctx.fillText("Date:", x1 - lineLength * 0.62 - labelGap, y);
  drawWriteLine(ctx, x1 - lineLength * 0.62, y, lineLength * 0.62);
  ctx.restore();
}

function drawWriteLine(ctx: CanvasRenderingContext2D, x: number, y: number, length: number): void {
  ctx.save();
  ctx.strokeStyle = guideColors.header;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y + 6);
  ctx.lineTo(x + length, y + 6);
  ctx.stroke();
  ctx.restore();
}

/**
 * Render every worksheet page to a canvas. Pages are full-resolution
 * (A4: 1240x1754, Letter: 1275x1650) so PDF/PNG exports print sharply.
 */
export async function renderWorksheetPages(spec: WorksheetSpec, options: WorksheetRenderOptions): Promise<HTMLCanvasElement[]> {
  await ensureWorksheetFonts();

  const { width: pageWidth, height: pageHeight } = worksheetPagePixels[options.pageSize];
  const unit = worksheetLineHeights[options.lineSize];
  const fontFamily = fontFamilyForStyle(options.style);
  const fontWeight = fontWeightForStyle(options.style);

  const marginX = Math.round(pageWidth * 0.075);
  const topMargin = options.showHeader ? Math.round(unit * 2.4) : Math.round(unit * 1.2);
  const bottomMargin = Math.round(unit * 1.6);
  const contentWidth = pageWidth - marginX * 2;

  const ascZone = unit * 1.15;
  const xhZone = unit;
  const descZone = unit * 0.85;
  const rowGap = unit * 0.95;
  const rowHeight = ascZone + xhZone + descZone + rowGap;
  const gapHeight = unit * 0.6;

  const scratch = document.createElement("canvas");
  const scratchCtx = scratch.getContext("2d");
  if (!scratchCtx) throw new Error("Canvas 2D is not available in this browser.");
  const fontPx = fitFontSize(scratchCtx, fontFamily, fontWeight, ascZone + xhZone, descZone);
  const setFont = (ctx: CanvasRenderingContext2D, scale = 1) => {
    ctx.font = `${fontWeight} ${fontPx * scale}px ${fontFamily}`;
  };
  setFont(scratchCtx);
  const measure = (text: string) => scratchCtx.measureText(text).width;

  const rows = buildRows(spec, options, measure, contentWidth);

  const pages: HTMLCanvasElement[] = [];
  let canvas = document.createElement("canvas");
  canvas.width = pageWidth;
  canvas.height = pageHeight;
  let ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D is not available in this browser.");

  const startPage = () => {
    canvas = document.createElement("canvas");
    canvas.width = pageWidth;
    canvas.height = pageHeight;
    const next = canvas.getContext("2d");
    if (!next) throw new Error("Canvas 2D is not available in this browser.");
    ctx = next;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, pageWidth, pageHeight);
    if (options.showHeader) drawHeader(ctx, marginX, pageWidth - marginX, unit * 1.15, unit);
    pages.push(canvas);
    return topMargin;
  };

  let y = startPage();

  const finishPageFooter = (page: HTMLCanvasElement, index: number, total: number) => {
    const pageCtx = page.getContext("2d");
    if (!pageCtx || total < 2) return;
    pageCtx.save();
    pageCtx.fillStyle = guideColors.footer;
    pageCtx.font = `500 ${Math.max(20, unit * 0.42)}px "DM Sans", system-ui, sans-serif`;
    pageCtx.textAlign = "center";
    pageCtx.textBaseline = "alphabetic";
    pageCtx.fillText(`Page ${index + 1} of ${total}`, pageWidth / 2, pageHeight - unit * 0.55);
    pageCtx.restore();
  };

  for (const row of rows) {
    const height = row.kind === "gap" ? gapHeight : rowHeight;
    if (y + height > pageHeight - bottomMargin) {
      y = startPage();
    }
    if (row.kind === "gap") {
      y += gapHeight;
      continue;
    }

    const topY = y;
    const midY = y + ascZone;
    const baseY = y + ascZone + xhZone;
    const x0 = marginX;
    const x1 = pageWidth - marginX;

    if (options.showGuides) {
      drawGuides(ctx, x0, x1, topY, midY, baseY, unit);
    }

    if (row.kind !== "blank") {
      const text = row.kind === "model" ? row.text : fillRowPattern(measure, row.text, contentWidth);
      // Shrink the font only if a single long word would overflow the row.
      const naturalWidth = measure(text);
      const scale = naturalWidth > contentWidth ? (contentWidth / naturalWidth) * 0.98 : 1;
      setFont(ctx, scale);
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      if (row.kind === "model") {
        ctx.fillStyle = modelInks[options.modelInk];
        ctx.fillText(text, x0, baseY);
      } else {
        ctx.save();
        ctx.strokeStyle = guideColors.trace;
        ctx.lineWidth = Math.max(2.5, unit * 0.045);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.setLineDash([0.1, unit * 0.15]);
        ctx.strokeText(text, x0, baseY);
        ctx.restore();
      }
    }

    y += rowHeight;
  }

  pages.forEach((page, index) => finishPageFooter(page, index, pages.length));
  return pages;
}
