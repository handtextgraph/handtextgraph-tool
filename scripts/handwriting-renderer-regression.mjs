import assert from "node:assert/strict";
import { defaultSettings, renderHandwriting } from "../lib/handwriting.ts";

class FakeGradient {
  addColorStop() {}
}

class FakeContext {
  fillRectCount = 0;
  setTransform() {}
  createLinearGradient() { return new FakeGradient(); }
  fillRect() { this.fillRectCount += 1; }
  beginPath() {}
  moveTo() {}
  lineTo() {}
  stroke() {}
  save() {}
  translate() {}
  rotate() {}
  fillText() {}
  restore() {}
  clearRect() {}
  drawImage() {}
  measureText(text) { return { width: [...text].length * 18 }; }
}

class FakeCanvas {
  width = 0;
  height = 0;
  context = new FakeContext();
  getContext() { return this.context; }
  toDataURL() { return "data:image/png;base64,fake"; }
}

const canvases = [];
globalThis.document = {
  fonts: { ready: Promise.resolve() },
  createElement(name) {
    assert.equal(name, "canvas");
    const canvas = new FakeCanvas();
    canvases.push(canvas);
    return canvas;
  },
};
globalThis.window = { setTimeout };

async function render(text, overrides = {}, assets) {
  canvases.length = 0;
  const result = await renderHandwriting(text, { ...defaultSettings, ...overrides }, assets);
  return { result, canvases: [...canvases] };
}

const shortText = await render("A short handwriting regression test.");
assert.equal(shortText.result.pages.length, 1);
assert.deepEqual([shortText.result.pageWidth, shortText.result.pageHeight], [1240, 1754]);

const multiline = await render("First line\nSecond line\n\nThird paragraph");
assert.equal(multiline.result.pages.length, 1);

const blank = await render("   \n   ");
assert.equal(blank.result.pages.length, 1, "Blank input should retain the renderer's placeholder-page behavior");

const multipage = await render(Array.from({ length: 500 }, (_, index) => `word${index}`).join(" "));
assert.ok(multipage.result.pages.length > 1, "Long text should paginate");

const letter = await render("Letter page", { pageSize: "letter" });
assert.deepEqual([letter.result.pageWidth, letter.result.pageHeight], [1275, 1650]);

for (const [quality, scale] of [["low", 1], ["medium", 1.5], ["high", 2]]) {
  const qualityResult = await render("Quality page", { pdfQuality: quality });
  const page = qualityResult.result.pages[0];
  assert.equal(page.width, Math.round(1240 * scale), `${quality} A4 pixel width`);
  assert.equal(page.height, Math.round(1754 * scale), `${quality} A4 pixel height`);
}

let firstMultipageLineCount = 0;
for (let lineCount = 1; lineCount <= 80; lineCount += 1) {
  const boundary = await render(Array.from({ length: lineCount }, (_, index) => `Line ${index + 1}`).join("\n"));
  if (boundary.result.pages.length > 1) {
    firstMultipageLineCount = lineCount;
    const previous = await render(Array.from({ length: lineCount - 1 }, (_, index) => `Line ${index + 1}`).join("\n"));
    assert.equal(previous.result.pages.length, 1, "The line before the pagination boundary should remain on one page");
    break;
  }
}
assert.ok(firstMultipageLineCount > 1, "A pagination boundary should be detected");

const opaque = await render("Opaque page");
assert.ok(opaque.result.pages[0].context.fillRectCount > 0, "Normal paper should paint opaque pixels");
const transparent = await render("Transparent page", { pageTilt: 0.6 }, { transparentBackground: true });
assert.equal(transparent.result.pages[0].context.fillRectCount, 0, "Transparent rendering, including tilt, must not paint a background");

console.log(`Handwriting renderer regression checks passed (pagination boundary: ${firstMultipageLineCount} lines).`);
