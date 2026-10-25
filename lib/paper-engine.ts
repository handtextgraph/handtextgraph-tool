export type PaperSize = "a3" | "a4" | "a5" | "letter" | "legal";
export type PaperOrientation = "portrait" | "landscape";
export type MillimeterBounds = { top: number; right: number; bottom: number; left: number };

export const MM_PER_INCH = 25.4;
export const QUARTER_INCH_MM = MM_PER_INCH / 4;
export const MAX_PAPER_PRIMITIVES = 25_000;
export const MAX_RASTER_PIXELS = 40_000_000;

export const paperSizesMm: Record<PaperSize, { width: number; height: number }> = {
  a3: { width: 297, height: 420 },
  a4: { width: 210, height: 297 },
  a5: { width: 148, height: 210 },
  letter: { width: 215.9, height: 279.4 },
  legal: { width: 215.9, height: 355.6 },
};

type PatternStyle = { color: string; lineWidthMm: number };
export type SquareGridSpec = PatternStyle & { kind: "square-grid"; spacingMm: number };
export type LinedPaperSpec = PatternStyle & { kind: "lined"; spacingMm: number };
export type DotGridSpec = PatternStyle & { kind: "dot-grid"; spacingMm: number; radiusMm: number };
export type BlankPaperSpec = { kind: "blank" };
export type GuidedPaperSpec = PatternStyle & { kind: "guided"; rowHeightMm: number; midlineColor: string; baselineColor: string; dashMm: number[] };
export type PaperPatternSpec = SquareGridSpec | LinedPaperSpec | DotGridSpec | BlankPaperSpec | GuidedPaperSpec;

export type PaperPrimitive =
  | { kind: "line"; x1: number; y1: number; x2: number; y2: number; color: string; width: number; dash?: number[] }
  | { kind: "circle"; x: number; y: number; radius: number; color: string }
  | { kind: "text"; x: number; y: number; text: string; color: string; size: number; weight?: "normal" | "bold"; opacity?: number };

export interface PaperDocumentSpec {
  size: PaperSize;
  orientation: PaperOrientation;
  marginsMm: MillimeterBounds;
  background: string;
  pattern: PaperPatternSpec;
}

export interface PaperPageModel {
  widthMm: number;
  heightMm: number;
  primitives: PaperPrimitive[];
  background: string;
}

const clamp = (value: number, minimum: number, maximum: number) => Math.min(maximum, Math.max(minimum, Number.isFinite(value) ? value : minimum));
const safeColor = (value: string, fallback: string) => /^#[0-9a-f]{6}$/i.test(value) ? value : fallback;

export function getPaperDimensions(size: PaperSize, orientation: PaperOrientation) {
  const physical = paperSizesMm[size] ?? paperSizesMm.a4;
  return orientation === "landscape" ? { width: physical.height, height: physical.width } : { ...physical };
}

export function getRasterDimensions(widthMm: number, heightMm: number, dpi: number) {
  const safeDpi = clamp(Math.round(dpi), 72, 600);
  const width = Math.round(widthMm / MM_PER_INCH * safeDpi);
  const height = Math.round(heightMm / MM_PER_INCH * safeDpi);
  if (width * height > MAX_RASTER_PIXELS) throw new RangeError(`Raster output exceeds the ${MAX_RASTER_PIXELS.toLocaleString()} pixel safety limit.`);
  return { width, height, dpi: safeDpi };
}

export function normalizePaperSpec(input: PaperDocumentSpec): PaperDocumentSpec {
  const size = input.size in paperSizesMm ? input.size : "a4";
  const orientation = input.orientation === "landscape" ? "landscape" : "portrait";
  const dimensions = getPaperDimensions(size, orientation);
  const maxHorizontal = Math.min(50, dimensions.width / 3);
  const maxVertical = Math.min(50, dimensions.height / 3);
  let pattern: PaperPatternSpec;
  switch (input.pattern.kind) {
    case "square-grid": pattern = { ...input.pattern, spacingMm: clamp(input.pattern.spacingMm, 2, 30), lineWidthMm: clamp(input.pattern.lineWidthMm, 0.05, 1), color: safeColor(input.pattern.color, "#b8d0ee") }; break;
    case "lined": pattern = { ...input.pattern, spacingMm: clamp(input.pattern.spacingMm, 3, 30), lineWidthMm: clamp(input.pattern.lineWidthMm, 0.05, 1), color: safeColor(input.pattern.color, "#b8d0ee") }; break;
    case "dot-grid": pattern = { ...input.pattern, spacingMm: clamp(input.pattern.spacingMm, 2, 30), radiusMm: clamp(input.pattern.radiusMm, 0.05, 0.8), lineWidthMm: clamp(input.pattern.lineWidthMm, 0.05, 1), color: safeColor(input.pattern.color, "#8faed2") }; break;
    case "guided": pattern = { ...input.pattern, rowHeightMm: clamp(input.pattern.rowHeightMm, 8, 30), lineWidthMm: clamp(input.pattern.lineWidthMm, 0.05, 1), color: safeColor(input.pattern.color, "#b8d0ee"), midlineColor: safeColor(input.pattern.midlineColor, "#a8bfdc"), baselineColor: safeColor(input.pattern.baselineColor, "#6f9bd0"), dashMm: input.pattern.dashMm.slice(0, 8).map((value) => clamp(value, 0.2, 5)) }; break;
    default: pattern = { kind: "blank" };
  }
  return {
    size,
    orientation,
    background: safeColor(input.background, "#ffffff"),
    marginsMm: { top: clamp(input.marginsMm.top, 5, maxVertical), right: clamp(input.marginsMm.right, 5, maxHorizontal), bottom: clamp(input.marginsMm.bottom, 5, maxVertical), left: clamp(input.marginsMm.left, 5, maxHorizontal) },
    pattern,
  };
}

function push(primitives: PaperPrimitive[], primitive: PaperPrimitive) {
  if (primitives.length >= MAX_PAPER_PRIMITIVES) throw new RangeError(`Paper geometry exceeds the ${MAX_PAPER_PRIMITIVES.toLocaleString()} primitive safety limit.`);
  primitives.push(primitive);
}

export function buildPaperPageModel(input: PaperDocumentSpec): PaperPageModel {
  const spec = normalizePaperSpec(input);
  const { width, height } = getPaperDimensions(spec.size, spec.orientation);
  const left = spec.marginsMm.left, right = width - spec.marginsMm.right;
  const top = spec.marginsMm.top, bottom = height - spec.marginsMm.bottom;
  const primitives: PaperPrimitive[] = [];
  const pattern = spec.pattern;
  if (pattern.kind === "lined" || pattern.kind === "square-grid") {
    for (let y = top; y <= bottom + 0.0001; y += pattern.spacingMm) push(primitives, { kind: "line", x1: left, y1: y, x2: right, y2: y, color: pattern.color, width: pattern.lineWidthMm });
    if (pattern.kind === "square-grid") for (let x = left; x <= right + 0.0001; x += pattern.spacingMm) push(primitives, { kind: "line", x1: x, y1: top, x2: x, y2: bottom, color: pattern.color, width: pattern.lineWidthMm });
  } else if (pattern.kind === "dot-grid") {
    for (let y = top; y <= bottom + 0.0001; y += pattern.spacingMm) for (let x = left; x <= right + 0.0001; x += pattern.spacingMm) push(primitives, { kind: "circle", x, y, radius: pattern.radiusMm, color: pattern.color });
  } else if (pattern.kind === "guided") {
    for (let y = top; y + pattern.rowHeightMm <= bottom + 0.0001; y += pattern.rowHeightMm) {
      const middle = y + pattern.rowHeightMm / 2, baseline = y + pattern.rowHeightMm;
      push(primitives, { kind: "line", x1: left, y1: y, x2: right, y2: y, color: pattern.color, width: pattern.lineWidthMm });
      push(primitives, { kind: "line", x1: left, y1: middle, x2: right, y2: middle, color: pattern.midlineColor, width: pattern.lineWidthMm, dash: pattern.dashMm });
      push(primitives, { kind: "line", x1: left, y1: baseline, x2: right, y2: baseline, color: pattern.baselineColor, width: Math.max(pattern.lineWidthMm, 0.28) });
    }
  }
  return { widthMm: width, heightMm: height, primitives, background: spec.background };
}
