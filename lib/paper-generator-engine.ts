import {
  buildPaperPageModel,
  getPaperDimensions,
  MAX_PAPER_PRIMITIVES,
  normalizePaperSpec,
  type PaperDocumentSpec,
  type PaperOrientation,
  type PaperPageModel,
  type PaperPatternSpec,
  type PaperPrimitive,
  type PaperSize,
} from "./paper-engine.ts";

type Style = { color: string; lineWidthMm: number };
export type IsometricSpec = Style & { kind: "isometric"; spacingMm: number };
export type HexagonalSpec = Style & { kind: "hexagonal"; sideMm: number };
export type TriangleSpec = Style & { kind: "triangle"; spacingMm: number };
export type CoordinateSpec = Style & { kind: "coordinate"; spacingMm: number; majorEvery: number; axisColor: string; axisWidthMm: number; labels: boolean };
export type PolarSpec = Style & { kind: "polar"; radialSpacingMm: number; angleStepDeg: number; majorEvery: number };
export type SemiLogSpec = Style & { kind: "semi-log"; cycles: number; linearSpacingMm: number; logAxis: "x" | "y"; majorColor: string };
export type LogLogSpec = Style & { kind: "log-log"; xCycles: number; yCycles: number; majorColor: string };
export type PerspectiveSpec = Style & { kind: "perspective"; mode: "one-point" | "two-point"; horizonRatio: number; rayCount: number; depthLines: number; horizonColor: string };
export type EngineeringSpec = Style & { kind: "engineering"; minorSpacingMm: number; majorEvery: number; boldEvery: number; majorColor: string; boldColor: string };
export type CornellSpec = Style & { kind: "cornell"; cueWidthMm: number; summaryHeightMm: number; headerHeightMm: number; ruledSpacingMm: number; accentColor: string };
export type SeyesSpec = Style & { kind: "seyes"; majorSpacingMm: number; subdivisions: number; verticalSpacingMm: number; marginColor: string };
export type ChinesePracticeSpec = Style & { kind: "chinese-practice"; cellSizeMm: number; guideStyle: "rice" | "field"; guideColor: string };
export type MusicStaffSpec = Style & { kind: "music-staff"; lineSpacingMm: number; staffGapMm: number; barLines: number };

export type AdvancedPatternSpec = IsometricSpec | HexagonalSpec | TriangleSpec | CoordinateSpec | PolarSpec | SemiLogSpec | LogLogSpec | PerspectiveSpec | EngineeringSpec | CornellSpec | SeyesSpec | ChinesePracticeSpec | MusicStaffSpec;
export type GeneratorPatternSpec = PaperPatternSpec | AdvancedPatternSpec;

export interface GeneratorDocumentSpec extends Omit<PaperDocumentSpec, "pattern"> {
  pattern: GeneratorPatternSpec;
}

const clamp = (value: number, minimum: number, maximum: number) => Math.min(maximum, Math.max(minimum, Number.isFinite(value) ? value : minimum));
const color = (value: string, fallback: string) => /^#[0-9a-f]{6}$/i.test(value) ? value : fallback;

function add(primitives: PaperPrimitive[], primitive: PaperPrimitive) {
  if (primitives.length >= MAX_PAPER_PRIMITIVES) throw new RangeError("This configuration creates too many printable elements. Increase spacing or reduce detail.");
  primitives.push(primitive);
}

type Bounds = { left: number; right: number; top: number; bottom: number; width: number; height: number };
function line(primitives: PaperPrimitive[], x1: number, y1: number, x2: number, y2: number, stroke: string, width: number, dash?: number[]) {
  add(primitives, { kind: "line", x1, y1, x2, y2, color: stroke, width, dash });
}
function text(primitives: PaperPrimitive[], x: number, y: number, value: string, stroke: string, size = 2.6) {
  add(primitives, { kind: "text", x, y, text: value, color: stroke, size });
}
function clippedInfiniteLine(primitives: PaperPrimitive[], bounds: Bounds, x: number, y: number, dx: number, dy: number, stroke: string, width: number, dash?: number[]) {
  const hits: Array<[number, number]> = [];
  const candidates = [
    dx === 0 ? null : [(bounds.left - x) / dx, bounds.left, 0] as const,
    dx === 0 ? null : [(bounds.right - x) / dx, bounds.right, 0] as const,
    dy === 0 ? null : [(bounds.top - y) / dy, 0, bounds.top] as const,
    dy === 0 ? null : [(bounds.bottom - y) / dy, 0, bounds.bottom] as const,
  ];
  for (const candidate of candidates) {
    if (!candidate) continue;
    const [t, fixedX, fixedY] = candidate;
    const px = fixedX || x + t * dx, py = fixedY || y + t * dy;
    if (px >= bounds.left - 0.001 && px <= bounds.right + 0.001 && py >= bounds.top - 0.001 && py <= bounds.bottom + 0.001 && !hits.some(([hx, hy]) => Math.abs(hx - px) < 0.001 && Math.abs(hy - py) < 0.001)) hits.push([px, py]);
  }
  if (hits.length >= 2) line(primitives, hits[0][0], hits[0][1], hits[1][0], hits[1][1], stroke, width, dash);
}

function lattice(primitives: PaperPrimitive[], bounds: Bounds, spacing: number, angles: number[], stroke: string, width: number) {
  const diagonal = Math.hypot(bounds.width, bounds.height);
  for (const angle of angles) {
    const radians = angle * Math.PI / 180, dx = Math.cos(radians), dy = Math.sin(radians), nx = -dy, ny = dx;
    const count = Math.ceil(diagonal / spacing) + 2;
    for (let index = -count; index <= count; index += 1) clippedInfiniteLine(primitives, bounds, bounds.left + bounds.width / 2 + nx * index * spacing, bounds.top + bounds.height / 2 + ny * index * spacing, dx, dy, stroke, width);
  }
}

function logarithmicPositions(start: number, length: number, cycles: number) {
  const positions: Array<{ value: number; major: boolean; label?: string }> = [];
  for (let cycle = 0; cycle <= cycles; cycle += 1) positions.push({ value: start + length * cycle / cycles, major: true, label: cycle < cycles ? `10${cycle === 0 ? "⁰" : cycle === 1 ? "¹" : cycle === 2 ? "²" : `^${cycle}`}` : undefined });
  for (let cycle = 0; cycle < cycles; cycle += 1) for (let mantissa = 2; mantissa <= 9; mantissa += 1) positions.push({ value: start + length * (cycle + Math.log10(mantissa)) / cycles, major: false });
  return positions.toSorted((a, b) => a.value - b.value);
}

export function normalizeGeneratorSpec(input: GeneratorDocumentSpec): GeneratorDocumentSpec {
  if (["square-grid", "lined", "dot-grid", "blank", "guided"].includes(input.pattern.kind)) return normalizePaperSpec(input as PaperDocumentSpec) as GeneratorDocumentSpec;
  const base = normalizePaperSpec({ ...input, pattern: { kind: "blank" } });
  const p = input.pattern as AdvancedPatternSpec;
  const common = { color: color(p.color, "#94b7df"), lineWidthMm: clamp(p.lineWidthMm, 0.05, 1) };
  let pattern: GeneratorPatternSpec = { kind: "blank" };
  switch (p.kind) {
    case "isometric": pattern = { ...p, ...common, spacingMm: clamp(p.spacingMm, 3, 25) }; break;
    case "hexagonal": pattern = { ...p, ...common, sideMm: clamp(p.sideMm, 3, 20) }; break;
    case "triangle": pattern = { ...p, ...common, spacingMm: clamp(p.spacingMm, 3, 25) }; break;
    case "coordinate": pattern = { ...p, ...common, spacingMm: clamp(p.spacingMm, 2, 25), majorEvery: Math.round(clamp(p.majorEvery, 2, 10)), axisColor: color(p.axisColor, "#334155"), axisWidthMm: clamp(p.axisWidthMm, 0.15, 1.5), labels: Boolean(p.labels) }; break;
    case "polar": pattern = { ...p, ...common, radialSpacingMm: clamp(p.radialSpacingMm, 3, 20), angleStepDeg: clamp(p.angleStepDeg, 5, 45), majorEvery: Math.round(clamp(p.majorEvery, 2, 10)) }; break;
    case "semi-log": pattern = { ...p, ...common, cycles: Math.round(clamp(p.cycles, 1, 6)), linearSpacingMm: clamp(p.linearSpacingMm, 3, 25), logAxis: p.logAxis === "y" ? "y" : "x", majorColor: color(p.majorColor, "#55789f") }; break;
    case "log-log": pattern = { ...p, ...common, xCycles: Math.round(clamp(p.xCycles, 1, 6)), yCycles: Math.round(clamp(p.yCycles, 1, 6)), majorColor: color(p.majorColor, "#55789f") }; break;
    case "perspective": pattern = { ...p, ...common, mode: p.mode === "one-point" ? "one-point" : "two-point", horizonRatio: clamp(p.horizonRatio, 0.2, 0.8), rayCount: Math.round(clamp(p.rayCount, 5, 30)), depthLines: Math.round(clamp(p.depthLines, 4, 24)), horizonColor: color(p.horizonColor, "#475569") }; break;
    case "engineering": pattern = { ...p, ...common, minorSpacingMm: clamp(p.minorSpacingMm, 1, 10), majorEvery: Math.round(clamp(p.majorEvery, 2, 10)), boldEvery: Math.round(clamp(p.boldEvery, 5, 20)), majorColor: color(p.majorColor, "#7da4cc"), boldColor: color(p.boldColor, "#4f79a6") }; break;
    case "cornell": pattern = { ...p, ...common, cueWidthMm: clamp(p.cueWidthMm, 30, 80), summaryHeightMm: clamp(p.summaryHeightMm, 30, 80), headerHeightMm: clamp(p.headerHeightMm, 10, 30), ruledSpacingMm: clamp(p.ruledSpacingMm, 5, 15), accentColor: color(p.accentColor, "#365f8d") }; break;
    case "seyes": pattern = { ...p, ...common, majorSpacingMm: clamp(p.majorSpacingMm, 6, 12), subdivisions: Math.round(clamp(p.subdivisions, 2, 6)), verticalSpacingMm: clamp(p.verticalSpacingMm, 4, 12), marginColor: color(p.marginColor, "#dc6b73") }; break;
    case "chinese-practice": pattern = { ...p, ...common, cellSizeMm: clamp(p.cellSizeMm, 10, 30), guideStyle: p.guideStyle === "field" ? "field" : "rice", guideColor: color(p.guideColor, "#b9c8d8") }; break;
    case "music-staff": pattern = { ...p, ...common, lineSpacingMm: clamp(p.lineSpacingMm, 1.5, 4), staffGapMm: clamp(p.staffGapMm, 8, 30), barLines: Math.round(clamp(p.barLines, 0, 8)) }; break;
  }
  return { ...base, pattern };
}

export function buildGeneratorPageModel(input: GeneratorDocumentSpec): PaperPageModel {
  const spec = normalizeGeneratorSpec(input);
  if (["square-grid", "lined", "dot-grid", "blank", "guided"].includes(spec.pattern.kind)) return buildPaperPageModel(spec as PaperDocumentSpec);
  const { width, height } = getPaperDimensions(spec.size, spec.orientation);
  const b: Bounds = { left: spec.marginsMm.left, right: width - spec.marginsMm.right, top: spec.marginsMm.top, bottom: height - spec.marginsMm.bottom, width: width - spec.marginsMm.left - spec.marginsMm.right, height: height - spec.marginsMm.top - spec.marginsMm.bottom };
  const primitives: PaperPrimitive[] = [], p = spec.pattern;
  if (p.kind === "isometric") lattice(primitives, b, p.spacingMm * Math.sqrt(3) / 2, [90, 30, -30], p.color, p.lineWidthMm);
  else if (p.kind === "triangle") lattice(primitives, b, p.spacingMm * Math.sqrt(3) / 2, [0, 60, -60], p.color, p.lineWidthMm);
  else if (p.kind === "hexagonal") {
    const dx = 1.5 * p.sideMm, dy = Math.sqrt(3) * p.sideMm;
    for (let column = -1, cx = b.left; cx <= b.right + p.sideMm; column += 1, cx = b.left + column * dx) for (let cy = b.top - dy; cy <= b.bottom + dy; cy += dy) {
      const centerY = cy + (column % 2 ? dy / 2 : 0), points = Array.from({ length: 6 }, (_, i) => [cx + p.sideMm * Math.cos(i * Math.PI / 3), centerY + p.sideMm * Math.sin(i * Math.PI / 3)] as const);
      for (let i = 0; i < 6; i += 1) { const a = points[i], z = points[(i + 1) % 6]; if (a[0] >= b.left && a[0] <= b.right && a[1] >= b.top && a[1] <= b.bottom && z[0] >= b.left && z[0] <= b.right && z[1] >= b.top && z[1] <= b.bottom) line(primitives, a[0], a[1], z[0], z[1], p.color, p.lineWidthMm); }
    }
  } else if (p.kind === "coordinate") {
    const cx = b.left + b.width / 2, cy = b.top + b.height / 2;
    for (let x = cx, i = 0; x <= b.right + 0.001; x += p.spacingMm, i += 1) line(primitives, x, b.top, x, b.bottom, i % p.majorEvery ? p.color : p.axisColor, i % p.majorEvery ? p.lineWidthMm : p.lineWidthMm * 1.6);
    for (let x = cx - p.spacingMm, i = 1; x >= b.left - 0.001; x -= p.spacingMm, i += 1) line(primitives, x, b.top, x, b.bottom, i % p.majorEvery ? p.color : p.axisColor, i % p.majorEvery ? p.lineWidthMm : p.lineWidthMm * 1.6);
    for (let y = cy, i = 0; y <= b.bottom + 0.001; y += p.spacingMm, i += 1) line(primitives, b.left, y, b.right, y, i % p.majorEvery ? p.color : p.axisColor, i % p.majorEvery ? p.lineWidthMm : p.lineWidthMm * 1.6);
    for (let y = cy - p.spacingMm, i = 1; y >= b.top - 0.001; y -= p.spacingMm, i += 1) line(primitives, b.left, y, b.right, y, i % p.majorEvery ? p.color : p.axisColor, i % p.majorEvery ? p.lineWidthMm : p.lineWidthMm * 1.6);
    line(primitives, b.left, cy, b.right, cy, p.axisColor, p.axisWidthMm); line(primitives, cx, b.top, cx, b.bottom, p.axisColor, p.axisWidthMm);
    if (p.labels) for (let i = p.majorEvery; cx + i * p.spacingMm < b.right; i += p.majorEvery) { text(primitives, cx + i * p.spacingMm + 1, cy - 1, String(i), p.axisColor); text(primitives, cx - i * p.spacingMm + 1, cy - 1, String(-i), p.axisColor); }
  } else if (p.kind === "polar") {
    const cx = b.left + b.width / 2, cy = b.top + b.height / 2, radius = Math.min(b.width, b.height) / 2;
    for (let r = p.radialSpacingMm, i = 1; r <= radius + 0.001; r += p.radialSpacingMm, i += 1) add(primitives, { kind: "circle", x: cx, y: cy, radius: r, color: p.color });
    for (let angle = 0; angle < 360; angle += p.angleStepDeg) { const radians = angle * Math.PI / 180; line(primitives, cx, cy, cx + Math.cos(radians) * radius, cy + Math.sin(radians) * radius, p.color, angle % (p.angleStepDeg * p.majorEvery) === 0 ? p.lineWidthMm * 1.8 : p.lineWidthMm); }
  } else if (p.kind === "semi-log" || p.kind === "log-log") {
    const xLog = p.kind === "log-log" || p.logAxis === "x", yLog = p.kind === "log-log" || p.logAxis === "y";
    const xCycles = p.kind === "log-log" ? p.xCycles : p.cycles, yCycles = p.kind === "log-log" ? p.yCycles : p.cycles, major = p.majorColor;
    const linearSpacing = p.kind === "semi-log" ? p.linearSpacingMm : 5;
    const xs = xLog ? logarithmicPositions(b.left, b.width, xCycles) : Array.from({ length: Math.floor(b.width / linearSpacing) + 1 }, (_, i) => ({ value: b.left + i * linearSpacing, major: i % 5 === 0 }));
    const ys = yLog ? logarithmicPositions(b.top, b.height, yCycles) : Array.from({ length: Math.floor(b.height / linearSpacing) + 1 }, (_, i) => ({ value: b.top + i * linearSpacing, major: i % 5 === 0 }));
    for (const item of xs) line(primitives, item.value, b.top, item.value, b.bottom, item.major ? major : p.color, item.major ? p.lineWidthMm * 1.8 : p.lineWidthMm);
    for (const item of ys) line(primitives, b.left, item.value, b.right, item.value, item.major ? major : p.color, item.major ? p.lineWidthMm * 1.8 : p.lineWidthMm);
  } else if (p.kind === "perspective") {
    const horizon = b.top + b.height * p.horizonRatio; line(primitives, b.left, horizon, b.right, horizon, p.horizonColor, p.lineWidthMm * 1.8);
    const vanishingPoints = p.mode === "one-point" ? [b.left + b.width / 2] : [b.left, b.right];
    for (const vp of vanishingPoints) for (let i = 0; i <= p.rayCount; i += 1) { const targetX = b.left + b.width * i / p.rayCount; line(primitives, vp, horizon, targetX, b.bottom, p.color, p.lineWidthMm); line(primitives, vp, horizon, targetX, b.top, p.color, p.lineWidthMm); }
    for (let i = 1; i <= p.depthLines; i += 1) { const t = i / (p.depthLines + 1), eased = t * t; line(primitives, b.left, horizon + (b.bottom - horizon) * eased, b.right, horizon + (b.bottom - horizon) * eased, p.color, p.lineWidthMm); line(primitives, b.left, horizon - (horizon - b.top) * eased, b.right, horizon - (horizon - b.top) * eased, p.color, p.lineWidthMm); }
  } else if (p.kind === "engineering") {
    for (let x = b.left, i = 0; x <= b.right + 0.001; x += p.minorSpacingMm, i += 1) { const bold = i % p.boldEvery === 0, major = i % p.majorEvery === 0; line(primitives, x, b.top, x, b.bottom, bold ? p.boldColor : major ? p.majorColor : p.color, p.lineWidthMm * (bold ? 2.2 : major ? 1.5 : 1)); }
    for (let y = b.top, i = 0; y <= b.bottom + 0.001; y += p.minorSpacingMm, i += 1) { const bold = i % p.boldEvery === 0, major = i % p.majorEvery === 0; line(primitives, b.left, y, b.right, y, bold ? p.boldColor : major ? p.majorColor : p.color, p.lineWidthMm * (bold ? 2.2 : major ? 1.5 : 1)); }
  } else if (p.kind === "cornell") {
    const headerY = b.top + p.headerHeightMm, summaryY = b.bottom - p.summaryHeightMm, cueX = b.left + p.cueWidthMm;
    line(primitives, b.left, headerY, b.right, headerY, p.accentColor, p.lineWidthMm * 1.8); line(primitives, cueX, headerY, cueX, summaryY, p.accentColor, p.lineWidthMm * 1.8); line(primitives, b.left, summaryY, b.right, summaryY, p.accentColor, p.lineWidthMm * 1.8);
    text(primitives, b.left + 2, b.top + 5, "Topic:", p.accentColor, 3.2); text(primitives, b.right - 35, b.top + 5, "Date:", p.accentColor, 3.2); text(primitives, b.left + 2, headerY + 6, "Cues", p.accentColor, 3); text(primitives, cueX + 2, headerY + 6, "Notes", p.accentColor, 3); text(primitives, b.left + 2, summaryY + 6, "Summary", p.accentColor, 3);
    for (let y = headerY + p.ruledSpacingMm; y < summaryY; y += p.ruledSpacingMm) line(primitives, cueX, y, b.right, y, p.color, p.lineWidthMm);
  } else if (p.kind === "seyes") {
    const minor = p.majorSpacingMm / p.subdivisions;
    for (let y = b.top, i = 0; y <= b.bottom + 0.001; y += minor, i += 1) line(primitives, b.left, y, b.right, y, p.color, p.lineWidthMm * (i % p.subdivisions === 0 ? 1.8 : 1));
    for (let x = b.left; x <= b.right + 0.001; x += p.verticalSpacingMm) line(primitives, x, b.top, x, b.bottom, p.color, p.lineWidthMm);
    line(primitives, b.left + 20, b.top, b.left + 20, b.bottom, p.marginColor, Math.max(0.25, p.lineWidthMm * 1.8));
  } else if (p.kind === "chinese-practice") {
    const dash = [1.2, 1.2];
    for (let y = b.top; y + p.cellSizeMm <= b.bottom + 0.001; y += p.cellSizeMm) for (let x = b.left; x + p.cellSizeMm <= b.right + 0.001; x += p.cellSizeMm) {
      line(primitives, x, y, x + p.cellSizeMm, y, p.color, p.lineWidthMm); line(primitives, x + p.cellSizeMm, y, x + p.cellSizeMm, y + p.cellSizeMm, p.color, p.lineWidthMm); line(primitives, x + p.cellSizeMm, y + p.cellSizeMm, x, y + p.cellSizeMm, p.color, p.lineWidthMm); line(primitives, x, y + p.cellSizeMm, x, y, p.color, p.lineWidthMm);
      line(primitives, x + p.cellSizeMm / 2, y, x + p.cellSizeMm / 2, y + p.cellSizeMm, p.guideColor, p.lineWidthMm, dash); line(primitives, x, y + p.cellSizeMm / 2, x + p.cellSizeMm, y + p.cellSizeMm / 2, p.guideColor, p.lineWidthMm, dash);
      if (p.guideStyle === "rice") { line(primitives, x, y, x + p.cellSizeMm, y + p.cellSizeMm, p.guideColor, p.lineWidthMm, dash); line(primitives, x + p.cellSizeMm, y, x, y + p.cellSizeMm, p.guideColor, p.lineWidthMm, dash); }
    }
  } else if (p.kind === "music-staff") {
    const staffHeight = p.lineSpacingMm * 4, step = staffHeight + p.staffGapMm;
    for (let top = b.top; top + staffHeight <= b.bottom + 0.001; top += step) {
      for (let i = 0; i < 5; i += 1) line(primitives, b.left, top + i * p.lineSpacingMm, b.right, top + i * p.lineSpacingMm, p.color, p.lineWidthMm);
      for (let bar = 0; bar <= p.barLines; bar += 1) { const x = b.left + b.width * bar / Math.max(1, p.barLines); line(primitives, x, top, x, top + staffHeight, p.color, p.lineWidthMm); }
    }
  }
  return { widthMm: width, heightMm: height, primitives, background: spec.background };
}

export type GeneratorPaperSize = PaperSize;
export type GeneratorOrientation = PaperOrientation;
