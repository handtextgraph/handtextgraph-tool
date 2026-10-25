/**
 * Math line support for the handwriting converter.
 *
 * Display math lines are written in plain text wrapped in double dollar signs,
 * e.g. `$$x^2 + 2x + 1 = 0$$`. The renderer pulls each `$$...$$` segment out of
 * the paragraph flow and draws it as a centered display line in the user's
 * handwriting font with roomy spacing.
 *
 * This is intentionally NOT typeset LaTeX: there are no fractions, square
 * roots, or stacked symbols — just careful, legible spacing of plain text.
 * The UI copy must stay honest about that.
 *
 * Everything in this module is pure (no DOM), so it can be unit-tested in node.
 */

export interface MathSegment {
  /** Segment text. For math segments, whitespace is collapsed to single spaces. */
  text: string;
  /** True when the segment came from a `$$...$$` delimiter pair. */
  math: boolean;
}

const MATH_DELIMITER_PATTERN = /\$\$([\s\S]*?)\$\$/g;

/**
 * Split a paragraph into plain-text and math segments.
 * Each `$$...$$` pair becomes its own math segment; surrounding text stays
 * as regular segments. Unmatched `$$` is left untouched as regular text.
 */
export function splitMathSegments(paragraph: string): MathSegment[] {
  const segments: MathSegment[] = [];
  MATH_DELIMITER_PATTERN.lastIndex = 0;

  let cursor = 0;
  let match: RegExpExecArray | null;
  while ((match = MATH_DELIMITER_PATTERN.exec(paragraph)) !== null) {
    if (match.index > cursor) {
      segments.push({ text: paragraph.slice(cursor, match.index), math: false });
    }
    const mathText = match[1].replace(/\s+/g, " ").trim();
    if (mathText) {
      segments.push({ text: mathText, math: true });
    } else {
      // An empty `$$$$` pair carries no meaning; keep it out of the way.
      segments.push({ text: "", math: false });
    }
    cursor = match.index + match[0].length;
  }

  if (cursor < paragraph.length) {
    segments.push({ text: paragraph.slice(cursor), math: false });
  }

  if (segments.length === 0) {
    segments.push({ text: paragraph, math: false });
  }

  return segments;
}
