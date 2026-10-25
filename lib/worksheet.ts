import type { PageSize } from "@/lib/handwriting";

export type WorksheetMode = "name" | "alphabet" | "words";
export type WorksheetStyle = "print" | "cursive";
export type WorksheetLineSize = "small" | "medium" | "large";
export type WorksheetAlphabetCase = "upper" | "lower" | "both";
export type WorksheetInk = "blue" | "black";

/** High-level description of what the worksheet should contain. */
export type WorksheetSpec =
  | { mode: "name"; name: string }
  | { mode: "words"; words: string[] }
  | { mode: "alphabet"; cases: WorksheetAlphabetCase };

export interface WorksheetRenderOptions {
  pageSize: PageSize;
  style: WorksheetStyle;
  lineSize: WorksheetLineSize;
  /** Dotted tracing rows generated per content block. */
  traceRows: number;
  /** Empty guide-line practice rows generated per content block. */
  practiceRows: number;
  showGuides: boolean;
  showHeader: boolean;
  modelInk: WorksheetInk;
}

/** x-height (midline to baseline distance) in canvas pixels per line-size preset. */
export const worksheetLineHeights: Record<WorksheetLineSize, number> = {
  small: 52,
  medium: 68,
  large: 88,
};

export const worksheetPagePixels: Record<PageSize, { width: number; height: number }> = {
  a3: { width: 1754, height: 2480 },
  a4: { width: 1240, height: 1754 },
  a5: { width: 874, height: 1240 },
  letter: { width: 1275, height: 1650 },
  legal: { width: 1275, height: 2100 },
};

export const printFontFamily = '"Patrick Hand", "Comic Sans MS", cursive';
export const cursiveFontFamily = '"Caveat", "Segoe Script", cursive';

export function fontFamilyForStyle(style: WorksheetStyle): string {
  return style === "cursive" ? cursiveFontFamily : printFontFamily;
}

export function fontWeightForStyle(style: WorksheetStyle): number {
  return style === "cursive" ? 600 : 400;
}

export function sanitizeWorksheetWord(raw: string): string {
  return raw
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 40);
}

export function parseWordList(raw: string): string[] {
  const words: string[] = [];
  for (const line of raw.split(/\r?\n/)) {
    const word = sanitizeWorksheetWord(line);
    if (word) words.push(word);
    if (words.length >= 60) break;
  }
  return words;
}

export function alphabetSequence(alphabetCase: WorksheetAlphabetCase): string {
  const letters = Array.from({ length: 26 }, (_, index) => String.fromCharCode(65 + index));
  if (alphabetCase === "upper") return letters.join("  ");
  if (alphabetCase === "lower") return letters.map((letter) => letter.toLowerCase()).join("  ");
  return letters.map((letter) => `${letter}${letter.toLowerCase()}`).join("  ");
}

export function buildWorksheetSpec(args: {
  mode: WorksheetMode;
  name: string;
  wordsText: string;
  alphabetCase: WorksheetAlphabetCase;
}): WorksheetSpec | null {
  if (args.mode === "name") {
    const name = sanitizeWorksheetWord(args.name);
    return name ? { mode: "name", name } : null;
  }
  if (args.mode === "words") {
    const words = parseWordList(args.wordsText);
    return words.length > 0 ? { mode: "words", words } : null;
  }
  return { mode: "alphabet", cases: args.alphabetCase };
}

export function worksheetFileBaseName(spec: WorksheetSpec): string {
  const base =
    spec.mode === "name"
      ? `name-tracing-${spec.name}`
      : spec.mode === "words"
        ? `word-tracing-${spec.words[0] ?? "practice"}`
        : `alphabet-practice-${spec.cases}`;
  return (
    base
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "handwriting-worksheet"
  );
}
