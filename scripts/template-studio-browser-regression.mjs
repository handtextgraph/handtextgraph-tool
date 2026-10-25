import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import sharp from "sharp";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const baseUrl = process.env.HANDWRITING_TEST_BASE_URL || "http://127.0.0.1:3105";
const chrome = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/usr/bin/google-chrome", "/usr/bin/chromium", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].find(existsSync);
assert.ok(chrome, "Chrome is required for template studio browser checks");
const workDir = mkdtempSync(path.join(tmpdir(), "handwriting-templates-"));
const port = await new Promise((resolve, reject) => {
  const server = createServer(); server.unref(); server.once("error", reject);
  server.listen(0, "127.0.0.1", () => { const address = server.address(); server.close(() => resolve(address.port)); });
});
const browser = spawn(chrome, ["--headless=new", "--disable-gpu", `--remote-debugging-port=${port}`, `--user-data-dir=${path.join(workDir, "profile")}`, "--no-first-run", "about:blank"], { stdio: "ignore" });
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let target;
for (let attempt = 0; attempt < 120; attempt += 1) {
  if (browser.exitCode !== null) throw new Error(`Chrome exited before startup (${browser.exitCode})`);
  try { target = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(`${baseUrl}/templates`)}`, { method: "PUT" }).then((response) => response.json()); break; } catch { await pause(100); }
}
assert.ok(target?.webSocketDebuggerUrl, "Chrome debugging endpoint did not start");
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.addEventListener("open", resolve, { once: true }); socket.addEventListener("error", reject, { once: true }); });
let sequence = 0;
const pending = new Map();
socket.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data); if (!message.id) return;
  const waiter = pending.get(message.id); if (!waiter) return; pending.delete(message.id);
  if (message.error) waiter.reject(new Error(message.error.message)); else waiter.resolve(message.result);
});
socket.addEventListener("close", () => { for (const waiter of pending.values()) waiter.reject(new Error("Chrome connection closed")); pending.clear(); });
const send = (method, params = {}) => new Promise((resolve, reject) => { const id = ++sequence; pending.set(id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params })); });
const evaluate = async (expression) => {
  const response = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.exception?.description || response.exceptionDetails.text);
  return response.result.value;
};
const waitFor = async (expression, label) => {
  for (let attempt = 0; attempt < 180; attempt += 1) { if (await evaluate(expression)) return; await pause(100); }
  const state = await evaluate(`({ url: location.href, readyState: document.readyState, bodyText: document.body?.innerText?.slice(0, 200), pageSize: document.querySelector('#templatePageSize')?.value, orientation: document.querySelector('#templateOrientation')?.value, pageCount: document.querySelector('#templatePageCount')?.value, previewText: [...document.querySelectorAll('span')].map((node) => node.textContent).find((text) => text?.includes('mm ·')), reactKeys: Object.keys(document.querySelector('#templatePageSize') || {}).slice(0, 5), buttonOnclick: typeof [...document.querySelectorAll('button')].find((node) => node.textContent.includes('College Ruled'))?.onclick })`);
  throw new Error(`Timed out waiting for ${label}: ${JSON.stringify(state)}`);
};
const waitForFile = async (filename) => {
  const file = path.join(workDir, filename);
  for (let attempt = 0; attempt < 180; attempt += 1) { if (existsSync(file)) return file; await pause(100); }
  throw new Error(`Timed out waiting for ${filename}`);
};

try {
  await send("Page.enable"); await send("Runtime.enable");
  await send("Browser.setDownloadBehavior", { behavior: "allow", downloadPath: workDir, eventsEnabled: true });
  await waitFor('document.readyState === "complete" && !!document.querySelector("#template-studio") && Object.keys(document.querySelector("#templatePageSize") || {}).some((key) => key.startsWith("__reactProps"))', "studio hydration readiness");
  assert.equal(await evaluate('!!document.querySelector("[data-nextjs-dialog]")'), false);
  await evaluate(`(() => { const set = (selector, value) => { const input = document.querySelector(selector); const prototype = input instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(prototype, 'value').set.call(input, value); input.dispatchEvent(new Event('input', { bubbles: true })); input.dispatchEvent(new Event('change', { bubbles: true })); }; set('#templateSpacing', '9'); set('#templatePageSize', 'letter'); set('#templateOrientation', 'landscape'); set('#templatePageCount', '2'); document.querySelector('#templateHeader').click(); })()`);
  await waitFor('document.body.innerText.includes("279.4 × 215.9 mm · 2 pages")', "Letter landscape preview");
  await evaluate(`([...document.querySelectorAll('button')].find((node) => node.textContent.trim() === 'Download PDF')).click()`);
  const paperPath = await waitForFile("college-ruled-letter-landscape.pdf");
  const paperTask = getDocument({ data: new Uint8Array(readFileSync(paperPath)), disableWorker: true });
  const paper = await paperTask.promise; assert.equal(paper.numPages, 2);
  const viewport = (await paper.getPage(1)).getViewport({ scale: 1 });
  assert.ok(Math.abs(viewport.width * 25.4 / 72 - 279.4) < 0.15); assert.ok(Math.abs(viewport.height * 25.4 / 72 - 215.9) < 0.15); await paperTask.destroy();

  await evaluate(`([...document.querySelectorAll('button')].find((node) => node.textContent.includes('Primary Handwriting Practice'))).click()`);
  await evaluate(`(() => { const select = (selector, value) => { const input = document.querySelector(selector); Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set.call(input, value); input.dispatchEvent(new Event('change', { bubbles: true })); }; select('#templatePageSize', 'a4'); select('#templateOrientation', 'portrait'); const input = document.querySelector('#practiceText'); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, 'Practice safely'); input.dispatchEvent(new Event('input', { bubbles: true })); input.dispatchEvent(new Event('change', { bubbles: true })); [...document.querySelectorAll('button')].find((node) => node.textContent.trim() === 'trace').click(); })()`);
  await waitFor('document.querySelector("#practiceText")?.value === "Practice safely" && !!document.querySelector("svg[aria-label*=Handwriting]")', "trace preview");
  await evaluate(`([...document.querySelectorAll('button')].find((node) => node.textContent.trim() === 'Download PDF')).click()`);
  const practiceTask = getDocument({ data: new Uint8Array(readFileSync(await waitForFile("handwriting-practice-a4.pdf"))), disableWorker: true });
  const practice = await practiceTask.promise; assert.equal(practice.numPages, 2); await practiceTask.destroy();

  await evaluate(`([...document.querySelectorAll('button')].find((node) => node.textContent.includes('Dot Grid Paper'))).click()`);
  await evaluate(`(() => { const select = (selector, value) => { const input = document.querySelector(selector); Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set.call(input, value); input.dispatchEvent(new Event('change', { bubbles: true })); }; select('#templatePageSize', 'a3'); select('#templatePngDpi', '300'); })()`);
  await waitFor('document.body.innerText.includes("297 × 420 mm · 2 pages") && document.querySelector("#templatePngDpi")?.value === "300"', "A3 300 DPI preview");
  await evaluate(`([...document.querySelectorAll('button')].find((node) => node.textContent.trim() === 'Download PNG')).click()`);
  const png = await sharp(await waitForFile("dot-grid-a3.png")).metadata(); assert.deepEqual([png.width, png.height], [3508, 4961]);
  await evaluate(`([...document.querySelectorAll('button')].find((node) => node.textContent.trim() === 'Download SVG')).click()`);
  const svg = readFileSync(await waitForFile("dot-grid-a3.svg"), "utf8");
  assert.match(svg, /width="297mm" height="420mm" viewBox="0 0 297 420"/);
  for (const [width, height] of [[390, 844], [768, 1024], [1440, 1000]]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width < 768 });
    assert.equal(await evaluate('document.documentElement.scrollWidth - document.documentElement.clientWidth'), 0, `Overflow at ${width}px`);
  }
  console.log("Template studio browser checks passed for PDF, practice, 300 DPI PNG, SVG, and responsive workflows.");
} finally {
  socket.close(); browser.kill(); if (browser.exitCode === null) await new Promise((resolve) => browser.once("exit", resolve)); await pause(500);
  rmSync(workDir, { recursive: true, force: true, maxRetries: 20, retryDelay: 250 });
}
