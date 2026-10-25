import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  buildPrintablePageModel,
  createPrintableConfig,
  getPrintableFilename,
  getPrintablePageDimensions,
  getPrintablePngDimensions,
  normalizePrintableConfig,
  printableTemplatePresets,
} from "../lib/printable-templates.ts";
import { createPrintablePdf } from "../lib/printable-template-pdf.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const expectedPresets = [
  "college-ruled", "wide-ruled", "narrow-ruled", "standard-lined",
  "graph-paper", "dot-grid", "blank-writing", "primary-handwriting",
  "seyes-ruled", "legal-ruled", "extra-wide-ruled", "journal-lined",
  "exam-answer-paper", "cornell-notes-paper", "letter-writing-paper", "meeting-notes-paper",
  "squared-paper", "fine-graph-paper", "large-graph-paper", "wide-dot-grid",
  "fine-dot-grid", "math-grid-paper",
  "cursive-uppercase-practice", "cursive-lowercase-practice", "cursive-sentence-practice",
  "name-tracing-practice", "dotted-midline-wide", "dotted-midline-narrow",
  "story-paper-primary", "spelling-word-practice", "number-tracing-practice",
  "sentence-practice-primary", "sentence-practice-standard", "quote-copy-practice",
  "print-alphabet-practice", "print-lowercase-practice", "handwriting-warmup",
  "paragraph-practice", "vocabulary-practice", "first-tracing-practice",
];
assert.deepEqual(printableTemplatePresets.map(({ id }) => id), expectedPresets);

for (const [pageSize, orientation, width, height] of [
  ["a3", "portrait", 297, 420], ["a3", "landscape", 420, 297],
  ["a4", "portrait", 210, 297], ["a4", "landscape", 297, 210],
  ["a5", "portrait", 148, 210], ["a5", "landscape", 210, 148],
  ["letter", "portrait", 215.9, 279.4], ["letter", "landscape", 279.4, 215.9],
  ["legal", "portrait", 215.9, 355.6], ["legal", "landscape", 355.6, 215.9],
]) {
  assert.deepEqual(getPrintablePageDimensions(pageSize, orientation), { width, height });
  const config = createPrintableConfig("college-ruled", { pageSize, orientation, pageCount: 3 });
  const pdf = createPrintablePdf(config);
  assert.equal(pdf.getNumberOfPages(), 3);
  assert.ok(Math.abs(pdf.internal.pageSize.getWidth() - width) < 0.02);
  assert.ok(Math.abs(pdf.internal.pageSize.getHeight() - height) < 0.02);
}

for (const preset of printableTemplatePresets) {
  const model = buildPrintablePageModel(createPrintableConfig(preset.id));
  assert.equal(model.widthMm, 210);
  assert.equal(model.heightMm, 297);
  if (preset.pattern !== "blank") assert.ok(model.primitives.length > 0, `${preset.id} should draw its pattern`);
}

const bounded = normalizePrintableConfig(createPrintableConfig("graph-paper", {
  spacingMm: 100, lineThicknessMm: 8, pageCount: 99,
  margins: { top: -2, right: 100, bottom: -3, left: 100 },
}));
assert.equal(bounded.spacingMm, 30);
assert.equal(bounded.lineThicknessMm, 1);
assert.equal(bounded.pageCount, 20);
assert.ok(Object.values(bounded.margins).every((value) => value >= 5 && value <= 50));

const withHeader = buildPrintablePageModel(createPrintableConfig("standard-lined", {
  headerEnabled: true, leftGuide: true, header: { name: "Sample", subject: "Writing", date: "2026-08-29" },
}));
assert.ok(withHeader.primitives.some((item) => item.kind === "text" && item.text.includes("Name: Sample")));
assert.ok(withHeader.primitives.some((item) => item.kind === "line" && item.color === "#dc6b73"));
const noHeader = buildPrintablePageModel(createPrintableConfig("standard-lined"));
assert.equal(noHeader.primitives.some((item) => item.kind === "text"), false);

for (const mode of ["blank", "trace", "copy"]) {
  const model = buildPrintablePageModel(createPrintableConfig("primary-handwriting", { practiceMode: mode, practiceText: "A-Z, 1-2!" }));
  const texts = model.primitives.filter((item) => item.kind === "text");
  assert.equal(mode === "blank" ? texts.length === 0 : texts.length > 0, true);
  assert.ok(model.primitives.some((item) => item.kind === "line" && item.dash?.length));
}
assert.equal(normalizePrintableConfig(createPrintableConfig("primary-handwriting", { practiceText: "x".repeat(140) })).practiceText.length, 120);

assert.equal(getPrintableFilename(createPrintableConfig("college-ruled"), "pdf"), "college-ruled-a4.pdf");
assert.equal(getPrintableFilename(createPrintableConfig("wide-ruled", { pageSize: "letter", orientation: "landscape" }), "png"), "wide-ruled-letter-landscape.png");
assert.deepEqual(getPrintablePngDimensions(createPrintableConfig("a4"), 150), { width: 1240, height: 1754 });
assert.deepEqual(getPrintablePngDimensions(createPrintableConfig("graph-paper"), 300), { width: 2480, height: 3508 });

for (const asset of [
  "printable-lined-paper-a4.pdf", "printable-graph-paper-a4.pdf",
  "handwriting-practice-sheet-a4.pdf", "best-handwriting-settings-guide.svg",
]) assert.ok(existsSync(join(root, "public", "templates", asset)), `${asset} must remain available`);

console.log("Printable template regression checks passed.");
