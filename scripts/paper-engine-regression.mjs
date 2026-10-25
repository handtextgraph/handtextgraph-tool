import assert from "node:assert/strict";
import { buildPaperPageModel, getPaperDimensions, getRasterDimensions, paperSizesMm, QUARTER_INCH_MM } from "../lib/paper-engine.ts";
import { serializePaperSvg } from "../lib/paper-svg.ts";
import { createPrintableConfig, buildPrintablePageModel } from "../lib/printable-templates.ts";
import { createPrintablePdf } from "../lib/printable-template-pdf.ts";
import { createPrintableSvg } from "../lib/printable-template-svg.ts";

assert.deepEqual(paperSizesMm.a4, { width: 210, height: 297 });
assert.deepEqual(paperSizesMm.letter, { width: 215.9, height: 279.4 });
assert.equal(QUARTER_INCH_MM, 6.35);

for (const [size, width, height] of [["a3", 297, 420], ["a4", 210, 297], ["a5", 148, 210], ["letter", 215.9, 279.4], ["legal", 215.9, 355.6]]) {
  assert.deepEqual(getPaperDimensions(size, "portrait"), { width, height });
  assert.deepEqual(getPaperDimensions(size, "landscape"), { width: height, height: width });
}

for (const pattern of [
  { kind: "square-grid", spacingMm: QUARTER_INCH_MM, color: "#b8d0ee", lineWidthMm: 0.14 },
  { kind: "lined", spacingMm: 7.1, color: "#b8d0ee", lineWidthMm: 0.22 },
  { kind: "dot-grid", spacingMm: 5, radiusMm: 0.32, color: "#8faed2", lineWidthMm: 0.32 },
  { kind: "blank" },
  { kind: "guided", rowHeightMm: 18, color: "#b8d0ee", lineWidthMm: 0.24, midlineColor: "#a8bfdc", baselineColor: "#6f9bd0", dashMm: [1.3, 1.3] },
]) {
  const model = buildPaperPageModel({ size: "a4", orientation: "portrait", marginsMm: { top: 15, right: 14, bottom: 15, left: 18 }, background: "#ffffff", pattern });
  assert.equal(model.widthMm, 210);
  assert.equal(model.heightMm, 297);
  assert.equal(pattern.kind === "blank" ? model.primitives.length === 0 : model.primitives.length > 0, true);
  const svg = serializePaperSvg(model);
  assert.match(svg, /width="210mm" height="297mm" viewBox="0 0 210 297"/);
}

const quarterGrid = buildPaperPageModel({ size: "a4", orientation: "portrait", marginsMm: { top: 15, right: 14, bottom: 15, left: 18 }, background: "#ffffff", pattern: { kind: "square-grid", spacingMm: QUARTER_INCH_MM, color: "#b8d0ee", lineWidthMm: 0.14 } });
const verticalLines = quarterGrid.primitives.filter((primitive) => primitive.kind === "line" && primitive.x1 === primitive.x2);
assert.equal(Number((verticalLines[1].x1 - verticalLines[0].x1).toFixed(10)), 6.35);

const config = createPrintableConfig("graph-paper", { pageSize: "legal", orientation: "landscape" });
const compatibilityModel = buildPrintablePageModel(config);
const svg = createPrintableSvg(config);
const pdf = createPrintablePdf(config);
assert.match(svg, new RegExp(`viewBox="0 0 ${compatibilityModel.widthMm} ${compatibilityModel.heightMm}"`));
assert.equal((svg.match(/<(line|circle|text)\b/g) ?? []).length, compatibilityModel.primitives.length, "SVG must render every shared geometry primitive");
assert.ok(Math.abs(pdf.internal.pageSize.getWidth() - compatibilityModel.widthMm) < 0.02);
assert.ok(Math.abs(pdf.internal.pageSize.getHeight() - compatibilityModel.heightMm) < 0.02);
assert.deepEqual(getRasterDimensions(210, 297, 300), { width: 2480, height: 3508, dpi: 300 });
assert.throws(() => getRasterDimensions(297, 420, 600), /pixel safety limit/);

console.log("Shared paper engine regression checks passed.");
