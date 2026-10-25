import { splitMathSegments } from "./math.ts";
import { buildGeneratorPageModel } from "./paper-generator-engine.ts";
import { getPaperGenerator, type PaperGeneratorSlug } from "./paper-generators.ts";
import type { PaperPrimitive } from "./paper-engine.ts";

export type PageType = "lined" | "blank" | "graph" | "custom";
export type InkColor = "blue" | "black" | "darkGray" | "custom";
export type ExportFormat = "png" | "jpg" | "pdf";
export type PageSize = "a3" | "a4" | "a5" | "letter" | "legal";
export type PageOrientation = "portrait" | "landscape";
export type TextAlignment = "left" | "center" | "right";
export type PdfQuality = "low" | "medium" | "high";

export interface HandwritingStyle {
  id: string;
  label: string;
  primary: string;
  alternates: string[];
  slant: number;
  weight: number;
  sizeJitter: number;
  xJitter: number;
  yJitter: number;
  rotateJitter: number;
  pressure: number;
}

export interface RenderSettings {
  styleId: string;
  pageType: PageType;
  fontSize: number;
  lineSpacing: number;
  wordSpacing: number;
  letterSpacing: number;
  inkColor: InkColor;
  customInkColor: string;
  randomness: number;
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  paragraphIndentMode: boolean;
  pageSize: PageSize;
  orientation: PageOrientation;
  textAlignment: TextAlignment;
  paperPatternId: PaperGeneratorSlug | "none";
  paperPatternSpacingMm: number;
  pdfQuality: PdfQuality;
  paperBrightness: number;
  showMarginLine: boolean;
  pageTilt: number;
}

export interface RenderResult {
  pages: HTMLCanvasElement[];
  pageWidth: number;
  pageHeight: number;
}

export interface RenderAssets {
  customPaperImage?: HTMLImageElement;
  transparentBackground?: boolean;
}

const fontReadyTimeoutMs = 2000;

const pageDimensions: Record<PageSize, { width: number; height: number }> = {
  a3: { width: 1754, height: 2480 },
  a4: { width: 1240, height: 1754 },
  a5: { width: 874, height: 1240 },
  letter: { width: 1275, height: 1650 },
  legal: { width: 1275, height: 2100 },
};

const qualityScale: Record<PdfQuality, number> = {
  low: 1,
  medium: 1.5,
  high: 2,
};

export const handwritingStyles: HandwritingStyle[] = [
  {
    id: "classic-student",
    label: "Clear Print",
    primary: '"Kalam", "Comic Sans MS", cursive',
    alternates: ['"Caveat", cursive', '"Patrick Hand", cursive'],
    slant: -0.01,
    weight: 400,
    sizeJitter: 0.65,
    xJitter: 0.9,
    yJitter: 1.15,
    rotateJitter: 0.014,
    pressure: 0.92,
  },
  {
    id: "clean-notes",
    label: "Clean Notes",
    primary: '"Patrick Hand", "Comic Sans MS", cursive',
    alternates: ['"Kalam", cursive', '"Architects Daughter", cursive'],
    slant: 0.005,
    weight: 400,
    sizeJitter: 0.45,
    xJitter: 0.7,
    yJitter: 0.9,
    rotateJitter: 0.012,
    pressure: 0.95,
  },
  {
    id: "soft-cursive",
    label: "Soft Cursive",
    primary: '"Caveat", cursive',
    alternates: ['"Shadows Into Light", cursive', '"Kalam", cursive'],
    slant: -0.03,
    weight: 600,
    sizeJitter: 0.8,
    xJitter: 1.0,
    yJitter: 1.3,
    rotateJitter: 0.018,
    pressure: 0.86,
  },
  {
    id: "practice-sheet",
    label: "Practice Sheet",
    primary: '"Architects Daughter", "Comic Sans MS", cursive',
    alternates: ['"Patrick Hand", cursive', '"Indie Flower", cursive'],
    slant: 0.012,
    weight: 400,
    sizeJitter: 0.55,
    xJitter: 0.85,
    yJitter: 0.95,
    rotateJitter: 0.012,
    pressure: 0.94,
  },
  {
    id: "rounded-ink",
    label: "Rounded Ink",
    primary: '"Indie Flower", cursive',
    alternates: ['"Schoolbell", cursive', '"Kalam", cursive'],
    slant: -0.008,
    weight: 400,
    sizeJitter: 0.7,
    xJitter: 1.05,
    yJitter: 1.15,
    rotateJitter: 0.016,
    pressure: 0.88,
  },
  {
    id: "neat-margin",
    label: "Neat Margin",
    primary: '"Shadows Into Light", cursive',
    alternates: ['"Patrick Hand", cursive', '"Caveat", cursive'],
    slant: 0.003,
    weight: 400,
    sizeJitter: 0.48,
    xJitter: 0.72,
    yJitter: 0.85,
    rotateJitter: 0.011,
    pressure: 0.93,
  },
  {
    id: "lecture-fast",
    label: "Lecture Fast",
    primary: '"Schoolbell", cursive',
    alternates: ['"Kalam", cursive', '"Architects Daughter", cursive'],
    slant: -0.014,
    weight: 400,
    sizeJitter: 0.9,
    xJitter: 1.18,
    yJitter: 1.25,
    rotateJitter: 0.02,
    pressure: 0.84,
  },
  {
    id: "ink-flow",
    label: "Ink Flow",
    primary: '"Caveat Brush", "Caveat", cursive',
    alternates: ['"Kalam", cursive', '"Indie Flower", cursive'],
    slant: -0.022,
    weight: 600,
    sizeJitter: 0.78,
    xJitter: 1.0,
    yJitter: 1.1,
    rotateJitter: 0.017,
    pressure: 0.87,
  },
  {
    id: "lab-record",
    label: "Lab Record",
    primary: '"Patrick Hand", cursive',
    alternates: ['"Schoolbell", cursive', '"Shadows Into Light", cursive'],
    slant: 0.01,
    weight: 400,
    sizeJitter: 0.52,
    xJitter: 0.76,
    yJitter: 0.92,
    rotateJitter: 0.012,
    pressure: 0.91,
  },
  {
    id: "daily-notebook",
    label: "Daily Notebook",
    primary: '"Kalam", cursive',
    alternates: ['"Architects Daughter", cursive', '"Indie Flower", cursive'],
    slant: -0.012,
    weight: 400,
    sizeJitter: 0.68,
    xJitter: 0.9,
    yJitter: 1.0,
    rotateJitter: 0.015,
    pressure: 0.9,
  },
];

/**
 * Session-only registry for user-uploaded fonts (see lib/custom-fonts.ts).
 * Entries live here so `renderHandwriting` can resolve them exactly like
 * built-in styles; they vanish on page refresh by design.
 */
const customStyleRegistry = new Map<string, HandwritingStyle>();

export function registerCustomHandwritingStyle(style: HandwritingStyle): void {
  if (!customStyleRegistry.has(style.id)) {
    customStyleRegistry.set(style.id, style);
  }
}

export function unregisterCustomHandwritingStyle(styleId: string): void {
  customStyleRegistry.delete(styleId);
}

export function getCustomHandwritingStyles(): HandwritingStyle[] {
  return [...customStyleRegistry.values()];
}

export function isCustomHandwritingStyle(styleId: string): boolean {
  return customStyleRegistry.has(styleId);
}

export const defaultSettings: RenderSettings = {
  styleId: handwritingStyles[0].id,
  pageType: "lined",
  fontSize: 34,
  lineSpacing: 1.55,
  wordSpacing: 1,
  letterSpacing: 0,
  inkColor: "blue",
  customInkColor: "#1d4ed8",
  randomness: 0.38,
  leftMargin: 165,
  rightMargin: 110,
  topMargin: 120,
  bottomMargin: 120,
  paragraphIndentMode: true,
  pageSize: "a4",
  orientation: "portrait",
  textAlignment: "left",
  paperPatternId: "none",
  paperPatternSpacingMm: 7.1,
  pdfQuality: "medium",
  paperBrightness: 98,
  showMarginLine: true,
  pageTilt: 0,
};

const colorMap: Record<InkColor, string> = {
  blue: "#1d4ed8",
  black: "#111827",
  darkGray: "#374151",
  custom: "#1d4ed8",
};

function hashString(input: string) {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  return () => {
    let value = (seed += 0x6d2b79f5);
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function chooseStyle(styleId: string) {
  return (
    handwritingStyles.find((style) => style.id === styleId) ??
    customStyleRegistry.get(styleId) ??
    handwritingStyles[0]
  );
}

function getPageDimensions(settings: RenderSettings) {
  const dimensions = pageDimensions[settings.pageSize] ?? pageDimensions.a4;
  return settings.orientation === "landscape" ? { width: dimensions.height, height: dimensions.width } : dimensions;
}

function getPixelRatio(settings: RenderSettings) {
  return qualityScale[settings.pdfQuality] ?? qualityScale.medium;
}

function makeCanvas(settings: RenderSettings) {
  const dimensions = getPageDimensions(settings);
  const pixelRatio = getPixelRatio(settings);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(dimensions.width * pixelRatio);
  canvas.height = Math.round(dimensions.height * pixelRatio);
  return canvas;
}

function setupContext(ctx: CanvasRenderingContext2D, settings: RenderSettings) {
  const pixelRatio = getPixelRatio(settings);
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.textBaseline = "alphabetic";
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
}

function drawSharedPaperPattern(ctx: CanvasRenderingContext2D, settings: RenderSettings, width: number, height: number) {
  if (settings.paperPatternId === "none") return false;
  const definition = getPaperGenerator(settings.paperPatternId);
  if (!definition) return false;
  const values = { ...definition.defaults, spacingMm: settings.paperPatternSpacingMm };
  const model = buildGeneratorPageModel({
    size: settings.pageSize,
    orientation: settings.orientation,
    marginsMm: { top: 5, right: 5, bottom: 5, left: 5 },
    background: "#ffffff",
    pattern: definition.build(values),
  });
  ctx.fillStyle = model.background;
  ctx.fillRect(0, 0, width, height);
  const scaleX = width / model.widthMm, scaleY = height / model.heightMm;
  const drawPrimitive = (primitive: PaperPrimitive) => {
    ctx.save();
    ctx.strokeStyle = primitive.color;
    ctx.fillStyle = primitive.color;
    if (primitive.kind === "line") {
      ctx.lineWidth = Math.max(0.5, primitive.width * (scaleX + scaleY) / 2);
      ctx.setLineDash((primitive.dash ?? []).map((value) => value * (scaleX + scaleY) / 2));
      ctx.beginPath(); ctx.moveTo(primitive.x1 * scaleX, primitive.y1 * scaleY); ctx.lineTo(primitive.x2 * scaleX, primitive.y2 * scaleY); ctx.stroke();
    } else if (primitive.kind === "circle") {
      ctx.beginPath(); ctx.arc(primitive.x * scaleX, primitive.y * scaleY, primitive.radius * (scaleX + scaleY) / 2, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.globalAlpha = primitive.opacity ?? 1;
      ctx.font = `${primitive.weight === "bold" ? 700 : 400} ${primitive.size * scaleY}px sans-serif`;
      ctx.fillText(primitive.text, primitive.x * scaleX, primitive.y * scaleY);
    }
    ctx.restore();
  };
  model.primitives.forEach(drawPrimitive);
  return true;
}

function drawPaper(ctx: CanvasRenderingContext2D, settings: RenderSettings, rng: () => number, assets?: RenderAssets) {
  const { width, height } = getPageDimensions(settings);
  if (assets?.transparentBackground) {
    return;
  }
  const sharedPatternDrawn = drawSharedPaperPattern(ctx, settings, width, height);
  const brightness = Math.max(90, Math.min(settings.paperBrightness, 104));
  if (sharedPatternDrawn) {
    // The shared paper geometry is the background layer; text metrics remain independent.
  } else if (settings.pageType === "custom" && assets?.customPaperImage) {
    drawCoverImage(ctx, assets.customPaperImage, width, height);
    const brightnessOverlay = Math.abs(brightness - 100) / 100;
    if (brightnessOverlay > 0) {
      ctx.fillStyle = brightness >= 100
        ? `rgba(255, 255, 255, ${brightnessOverlay})`
        : `rgba(0, 0, 0, ${brightnessOverlay})`;
      ctx.fillRect(0, 0, width, height);
    }
  } else {
    const startLightness = Math.min(100, brightness);
    const endLightness = Math.max(88, brightness - 2);
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, `hsl(42 55% ${startLightness}%)`);
    gradient.addColorStop(1, `hsl(44 45% ${endLightness}%)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  if (!sharedPatternDrawn && (settings.pageType === "lined" || settings.pageType === "graph")) {
    ctx.strokeStyle = "rgba(37, 99, 235, 0.22)";
    ctx.lineWidth = 1.5;
    const baseLineGap = settings.fontSize * settings.lineSpacing;
    const gap = settings.pageType === "graph" ? baseLineGap * 0.58 : baseLineGap;
    for (let y = settings.topMargin - 12; y < height - settings.bottomMargin + gap; y += gap) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    if (settings.pageType === "graph") {
      for (let x = settings.leftMargin - 70; x < width - settings.rightMargin + gap; x += gap) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
    }
  }

  if (settings.showMarginLine) {
    ctx.strokeStyle = "rgba(220, 38, 38, 0.55)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(settings.leftMargin - 42, 0);
    ctx.lineTo(settings.leftMargin - 42, height);
    ctx.stroke();
  }

  for (let i = 0; i < 280; i += 1) {
    ctx.fillStyle = `rgba(15, 23, 42, ${0.012 + rng() * 0.01})`;
    const x = rng() * width;
    const y = rng() * height;
    const size = rng() * 1.4;
    ctx.fillRect(x, y, size, size);
  }

  ctx.fillStyle = "rgba(15, 23, 42, 0.05)";
  ctx.fillRect(width - 22, 0, 22, height);
}

function drawCoverImage(ctx: CanvasRenderingContext2D, image: HTMLImageElement, width: number, height: number) {
  const sourceWidth = image.naturalWidth;
  const sourceHeight = image.naturalHeight;
  if (!sourceWidth || !sourceHeight) return;
  const scale = Math.max(width / sourceWidth, height / sourceHeight);
  const drawWidth = sourceWidth * scale;
  const drawHeight = sourceHeight * scale;
  ctx.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
}

function fontForChar(style: HandwritingStyle, ctx: CanvasRenderingContext2D, size: number, charSeed: number) {
  const familyPool = [style.primary, ...style.alternates];
  const family = charSeed % 9 === 0 ? familyPool[charSeed % familyPool.length] : style.primary;
  ctx.font = `${style.weight} ${size}px ${family}`;
}

interface RenderLine {
  text: string;
  /** True for `$$...$$` display math lines: centered, roomier, never wrapped. */
  math: boolean;
}

function measureTextWithSize(
  ctx: CanvasRenderingContext2D,
  text: string,
  style: HandwritingStyle,
  size: number,
  settings: RenderSettings,
  charSpacing = 0,
) {
  let width = 0;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    fontForChar(style, ctx, size, index);
    if (char === " ") {
      width += size * 0.38 * settings.wordSpacing;
    } else {
      width += ctx.measureText(char).width;
    }
    width += charSpacing + settings.letterSpacing;
  }
  return width;
}

function measureText(
  ctx: CanvasRenderingContext2D,
  text: string,
  style: HandwritingStyle,
  settings: RenderSettings,
) {
  return measureTextWithSize(ctx, text, style, settings.fontSize, settings);
}

function splitIntoLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  style: HandwritingStyle,
  settings: RenderSettings,
  maxWidth: number,
): RenderLine[] {
  const paragraphs = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: RenderLine[] = [];

  paragraphs.forEach((paragraph) => {
    if (!paragraph.trim()) {
      blocks.push({ text: "", math: false });
      return;
    }

    splitMathSegments(paragraph).forEach((segment) => {
      if (segment.math) {
        blocks.push({ text: segment.text, math: true });
        return;
      }

      if (!segment.text.trim()) {
        return;
      }

      const words = segment.text.trim().split(/\s+/);
      let currentLine = "";

      words.forEach((word) => {
        const nextLine = currentLine ? `${currentLine} ${word}` : word;
        const nextWidth = measureText(ctx, nextLine, style, settings);
        if (nextWidth > maxWidth && currentLine) {
          blocks.push({ text: currentLine, math: false });
          currentLine = word;
        } else {
          currentLine = nextLine;
        }
      });

      if (currentLine) {
        blocks.push({ text: currentLine, math: false });
      }
    });
    blocks.push({ text: "", math: false });
  });

  const last = blocks.at(-1);
  if (last && last.text === "" && !last.math) {
    blocks.pop();
  }

  return blocks;
}

function drawLine(
  ctx: CanvasRenderingContext2D,
  line: string,
  originX: number,
  baselineY: number,
  style: HandwritingStyle,
  settings: RenderSettings,
  rng: () => number,
) {
  let x = originX;
  const ink = settings.inkColor === "custom" && /^#[0-9a-f]{6}$/i.test(settings.customInkColor) ? settings.customInkColor : colorMap[settings.inkColor];
  const intensity = style.pressure - settings.randomness * 0.06;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === " ") {
      x += settings.fontSize * 0.38 * settings.wordSpacing + rng() * settings.randomness * 1.8;
      continue;
    }

    const size =
      settings.fontSize + (rng() - 0.5) * style.sizeJitter * settings.randomness * settings.fontSize * 0.1;
    fontForChar(style, ctx, size, index);
    ctx.fillStyle = ink;
    ctx.globalAlpha = intensity + rng() * 0.05;

    const jitterX = (rng() - 0.5) * style.xJitter * settings.randomness * 2.2;
    const jitterY = (rng() - 0.5) * style.yJitter * settings.randomness * 1.6;
    const angle = style.slant * 0.5 + (rng() - 0.5) * style.rotateJitter * settings.randomness * 2.2;

    ctx.save();
    ctx.translate(x + jitterX, baselineY + jitterY);
    ctx.rotate(angle);
    ctx.fillText(char, 0, 0);
    ctx.restore();

    x += ctx.measureText(char).width + settings.letterSpacing + rng() * settings.randomness * 0.7;
  }

  ctx.globalAlpha = 1;
}

/**
 * Draw a `$$...$$` display math line: centered, slightly larger, with airy
 * character spacing and gentler jitter so formulas stay legible. Long
 * formulas shrink to fit the usable page width. Rendered in the user's
 * handwriting font — this is careful spacing of plain text, not typeset math.
 */
function drawMathLine(
  ctx: CanvasRenderingContext2D,
  line: string,
  originX: number,
  maxWidth: number,
  baselineY: number,
  style: HandwritingStyle,
  settings: RenderSettings,
  rng: () => number,
) {
  const ink = settings.inkColor === "custom" && /^#[0-9a-f]{6}$/i.test(settings.customInkColor) ? settings.customInkColor : colorMap[settings.inkColor];
  const intensity = style.pressure - settings.randomness * 0.06;
  const targetSize = settings.fontSize * 1.15;
  const spacing = targetSize * 0.07;

  let size = targetSize;
  let width = measureTextWithSize(ctx, line, style, size, settings, spacing);
  if (width > maxWidth && width > 0) {
    size = Math.max(12, (targetSize * maxWidth) / width);
    width = measureTextWithSize(ctx, line, style, size, settings, spacing);
  }

  let x = originX + Math.max(0, (maxWidth - width) / 2);

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === " ") {
      x += size * 0.38 * settings.wordSpacing + spacing + rng() * settings.randomness * 1.8;
      continue;
    }

    const charSize =
      size + (rng() - 0.5) * style.sizeJitter * settings.randomness * size * 0.05;
    ctx.font = `${style.weight} ${charSize}px ${style.primary}`;
    ctx.fillStyle = ink;
    ctx.globalAlpha = intensity + rng() * 0.05;

    const jitterX = (rng() - 0.5) * style.xJitter * settings.randomness * 1.1;
    const jitterY = (rng() - 0.5) * style.yJitter * settings.randomness * 0.8;
    const angle = style.slant * 0.5 + (rng() - 0.5) * style.rotateJitter * settings.randomness * 1.1;

    ctx.save();
    ctx.translate(x + jitterX, baselineY + jitterY);
    ctx.rotate(angle);
    ctx.fillText(char, 0, 0);
    ctx.restore();

    x += ctx.measureText(char).width + spacing + settings.letterSpacing + rng() * settings.randomness * 0.7;
  }

  ctx.globalAlpha = 1;
}

export async function renderHandwriting(text: string, settings: RenderSettings, assets?: RenderAssets): Promise<RenderResult> {
  if ("fonts" in document) {
    await Promise.race([
      document.fonts.ready,
      new Promise((resolve) => {
        window.setTimeout(resolve, fontReadyTimeoutMs);
      }),
    ]);
  }

  const sanitized = text.trim() || "Write your notes here...";
  const style = chooseStyle(settings.styleId);
  const seed = hashString(`${sanitized}::${JSON.stringify(settings)}`);
  const rng = mulberry32(seed);
  const pages: HTMLCanvasElement[] = [];
  const { width: pageWidth, height: pageHeight } = getPageDimensions(settings);

  const scratch = makeCanvas(settings);
  const scratchCtx = scratch.getContext("2d");
  if (!scratchCtx) {
    throw new Error("Canvas is not supported in this browser.");
  }
  setupContext(scratchCtx, settings);

  const usableWidth = pageWidth - settings.leftMargin - settings.rightMargin;
  const lineHeight = settings.fontSize * settings.lineSpacing;
  const lines = splitIntoLines(scratchCtx, sanitized, style, settings, usableWidth);

  let page = makeCanvas(settings);
  let ctx = page.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas context could not be created.");
  }

  setupContext(ctx, settings);
  drawPaper(ctx, settings, rng, assets);
  let y = settings.topMargin + settings.fontSize;

  const pushPage = () => {
    applyPageTilt(page, settings, rng, assets?.transparentBackground ?? false);
    pages.push(page);
    page = makeCanvas(settings);
    const nextCtx = page.getContext("2d");
    if (!nextCtx) {
      throw new Error("Canvas context could not be created.");
    }
    ctx = nextCtx;
    setupContext(ctx, settings);
    drawPaper(ctx, settings, rng, assets);
    y = settings.topMargin + settings.fontSize;
  };

  lines.forEach((line, index) => {
    const isBlank = line.text === "" && !line.math;
    const indent =
      settings.paragraphIndentMode && !isBlank && !line.math && (index === 0 || lines[index - 1].text === "")
        ? 48
        : 0;
    const baseline = y + (isBlank ? lineHeight * 0.35 : 0);

    if (baseline > pageHeight - settings.bottomMargin) {
      pushPage();
    }

    if (!isBlank) {
      if (line.math) {
        drawMathLine(ctx!, line.text, settings.leftMargin, usableWidth, y, style, settings, rng);
      } else {
        const measuredWidth = measureText(ctx!, line.text, style, settings);
        const alignedOffset = settings.textAlignment === "center"
          ? Math.max(0, (usableWidth - measuredWidth) / 2)
          : settings.textAlignment === "right" ? Math.max(0, usableWidth - measuredWidth) : indent;
        drawLine(ctx!, line.text, settings.leftMargin + alignedOffset, y, style, settings, rng);
      }
    }

    y += isBlank ? lineHeight * 0.78 : line.math ? lineHeight * 1.25 : lineHeight;
  });

  applyPageTilt(page, settings, rng, assets?.transparentBackground ?? false);
  pages.push(page);

  return {
    pages,
    pageWidth,
    pageHeight,
  };
}

function applyPageTilt(
  page: HTMLCanvasElement,
  settings: RenderSettings,
  rng: () => number,
  transparentBackground: boolean,
) {
  if (settings.pageTilt <= 0) {
    return;
  }

  const pixelRatio = getPixelRatio(settings);
  const angle = ((rng() - 0.5) * settings.pageTilt * Math.PI) / 180;
  const copy = document.createElement("canvas");
  copy.width = page.width;
  copy.height = page.height;
  const copyCtx = copy.getContext("2d");
  const ctx = page.getContext("2d");

  if (!copyCtx || !ctx) {
    return;
  }

  copyCtx.drawImage(page, 0, 0);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, page.width, page.height);
  if (!transparentBackground) {
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, page.width, page.height);
  }
  ctx.translate(page.width / 2, page.height / 2);
  ctx.rotate(angle);
  ctx.drawImage(copy, -page.width / 2, -page.height / 2);
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}
