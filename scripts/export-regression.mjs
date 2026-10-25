import assert from "node:assert/strict";
import { jsPDF } from "jspdf";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import {
  getPhysicalPageDimensions,
  getSourceImageDimensions,
  selectExportPages,
} from "../lib/handwriting-export.ts";

const onePixelRgba = { data: new Uint8ClampedArray([29, 78, 216, 255]), width: 1, height: 1 };

assert.deepEqual(getPhysicalPageDimensions("a4"), { width: 210, height: 297 });
assert.deepEqual(getPhysicalPageDimensions("letter"), { width: 215.9, height: 279.4 });
assert.deepEqual(getPhysicalPageDimensions("a3"), { width: 297, height: 420 });
assert.deepEqual(getPhysicalPageDimensions("a5"), { width: 148, height: 210 });
assert.deepEqual(getPhysicalPageDimensions("legal"), { width: 215.9, height: 355.6 });
assert.deepEqual(getPhysicalPageDimensions("a4", "landscape"), { width: 297, height: 210 });
assert.deepEqual(selectExportPages(["one", "two", "three"], 1, "current"), ["two"]);
assert.deepEqual(selectExportPages(["one", "two", "three"], 1, "all"), ["one", "two", "three"]);
assert.deepEqual(
  getSourceImageDimensions({ naturalWidth: 2480, naturalHeight: 3508 }),
  { width: 2480, height: 3508 },
  "JPG conversion must retain the high-quality source bitmap dimensions",
);

async function createAndInspectPdf(pageSize, pageCount) {
  const dimensions = getPhysicalPageDimensions(pageSize);
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: [dimensions.width, dimensions.height] });
  for (let index = 0; index < pageCount; index += 1) {
    if (index > 0) pdf.addPage([dimensions.width, dimensions.height], "portrait");
    pdf.addImage(onePixelRgba, "RGBA", 0, 0, dimensions.width, dimensions.height);
  }

  const loadingTask = getDocument({ data: new Uint8Array(pdf.output("arraybuffer")), disableWorker: true });
  const document = await loadingTask.promise;
  try {
    assert.equal(document.numPages, pageCount);
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1 });
      const widthMm = viewport.width * 25.4 / 72;
      const heightMm = viewport.height * 25.4 / 72;
      assert.ok(Math.abs(widthMm - dimensions.width) < 0.15, `${pageSize} PDF width should be physical size`);
      assert.ok(Math.abs(heightMm - dimensions.height) < 0.15, `${pageSize} PDF height should be physical size`);
      page.cleanup();
    }
  } finally {
    await loadingTask.destroy();
  }
}

await createAndInspectPdf("a4", 1);
await createAndInspectPdf("a4", 3);
await createAndInspectPdf("letter", 1);
await createAndInspectPdf("letter", 3);

console.log("Export regression checks passed for current/all selection, PDF page counts/sizes, and JPG source dimensions.");
