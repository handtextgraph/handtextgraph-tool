import assert from "node:assert/strict";
import { extractTextFromDocx, maxDocxSize, validateDocxFile, DocxExtractionError } from "../lib/docx-extraction.ts";
import { maxPdfPageCount, maxPdfSize, openPdfExtractionSession, parsePdfPageSelection, PdfExtractionError, validatePdfFile } from "../lib/pdf-extraction.ts";
import { createDocxFixture, createPdfFixture } from "./document-fixtures.mjs";

const docxMime = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const docxBytes = await createDocxFixture();
const docxText = await extractTextFromDocx(new File([docxBytes], "sample.docx", { type: docxMime }));
for (const expected of ["Project Heading", "First paragraph.", "Second paragraph on a new line.", "First list item", "Second list item", "Name", "Value", "Alpha", "42"]) assert.ok(docxText.includes(expected), `DOCX text should include ${expected}`);
assert.ok(docxText.indexOf("Project Heading") < docxText.indexOf("First paragraph."));
assert.ok(docxText.includes("First paragraph.\n\nSecond paragraph"), "DOCX paragraphs should retain useful breaks");

await assert.rejects(() => extractTextFromDocx(new File(["broken"], "broken.docx", { type: docxMime })), (error) => error instanceof DocxExtractionError && error.code === "corrupt");
assert.throws(() => validateDocxFile({ name: "old.doc", type: "application/msword", size: 10 }), (error) => error instanceof DocxExtractionError && error.code === "unsupported_doc");
assert.throws(() => validateDocxFile({ name: "huge.docx", type: docxMime, size: maxDocxSize + 1 }), (error) => error instanceof DocxExtractionError && error.code === "too_large");

assert.deepEqual(parsePdfPageSelection("all", 4), [1, 2, 3, 4]);
assert.deepEqual(parsePdfPageSelection("1-3", 5), [1, 2, 3]);
assert.deepEqual(parsePdfPageSelection("4,2,4,6", 6), [2, 4, 6]);
assert.throws(() => parsePdfPageSelection("all", 201), (error) => error instanceof PdfExtractionError && error.code === "page_limit");
for (const invalid of ["0", "3-2", "1-7", "hello", "1,,2"]) assert.throws(() => parsePdfPageSelection(invalid, 6), (error) => error instanceof PdfExtractionError && error.code === "invalid_range");
assert.throws(() => validatePdfFile({ name: "fake.txt", type: "text/plain", size: 2 }), (error) => error instanceof PdfExtractionError && error.code === "invalid_type");
assert.throws(() => validatePdfFile({ name: "huge.pdf", type: "application/pdf", size: maxPdfSize + 1 }), (error) => error instanceof PdfExtractionError && error.code === "too_large");

const pdfBytes = createPdfFixture(["PDF PAGE ONE", "PDF PAGE TWO", "PDF PAGE THREE"]);
const session = await openPdfExtractionSession(new File([pdfBytes], "pages.pdf", { type: "application/pdf" }));
assert.equal(session.pageCount, 3);
const selectedText = await session.extract([2, 3]);
assert.ok(selectedText.includes("PDF PAGE TWO") && selectedText.includes("PDF PAGE THREE"));
assert.ok(!selectedText.includes("PDF PAGE ONE"));
assert.ok(selectedText.indexOf("TWO") < selectedText.indexOf("THREE"));
await session.destroy();

const emptySession = await openPdfExtractionSession(new File([createPdfFixture([""])], "empty.pdf", { type: "application/pdf" }));
await assert.rejects(() => emptySession.extract([1]), (error) => error instanceof PdfExtractionError && error.code === "empty");
await emptySession.destroy();
await assert.rejects(() => openPdfExtractionSession(new File(["broken"], "broken.pdf", { type: "application/pdf" })), (error) => error instanceof PdfExtractionError && error.code === "parse");

const aborted = new AbortController();
aborted.abort();
await assert.rejects(() => openPdfExtractionSession(new File([pdfBytes], "cancel.pdf", { type: "application/pdf" }), aborted.signal), (error) => error instanceof PdfExtractionError && error.code === "cancelled");

const tooManyPages = createPdfFixture(Array.from({ length: maxPdfPageCount + 1 }, () => "page"));
await assert.rejects(() => openPdfExtractionSession(new File([tooManyPages], "many.pdf", { type: "application/pdf" })), (error) => error instanceof PdfExtractionError && error.code === "page_limit");

const encrypted = createPdfFixture(["secret"], { password: "test-password" });
await assert.rejects(() => openPdfExtractionSession(new File([encrypted], "protected.pdf", { type: "application/pdf" })), (error) => error instanceof PdfExtractionError && error.code === "password");

console.log("Document import regression checks passed", { docxCharacters: docxText.length, pdfPages: 3 });
