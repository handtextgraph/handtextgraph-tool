import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { createServer } from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const outputDir = process.env.PHASE1_OUTPUT_DIR || path.resolve(repositoryRoot, "..", "outputs", "phase1");
const baseUrl = process.env.PHASE1_BASE_URL || "http://127.0.0.1:3001";
const chromeCandidates = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);
const chrome = chromeCandidates.find((candidate) => existsSync(candidate));
assert.ok(chrome, "Chrome was not found. Set CHROME_PATH to run browser checks.");

const port = await new Promise((resolve, reject) => {
  const server = createServer();
  server.once("error", reject);
  server.listen(0, "127.0.0.1", () => {
    const address = server.address();
    if (!address || typeof address === "string") {
      server.close(() => reject(new Error("Could not allocate a Chrome debugging port")));
      return;
    }
    server.close(() => resolve(address.port));
  });
});
const browserProfile = mkdtempSync(path.join(tmpdir(), "handwriting-visual-"));
mkdirSync(outputDir, { recursive: true });
const browser = spawn(chrome, ["--headless=new", "--disable-gpu", `--remote-debugging-port=${port}`, `--user-data-dir=${browserProfile}`, "--no-first-run", "about:blank"], { stdio: "ignore" });
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const stopBrowser = () => {
  if (browser.exitCode === null) browser.kill();
};
process.once("exit", stopBrowser);

let version;
for (let attempt = 0; attempt < 150; attempt += 1) {
  if (browser.exitCode !== null) throw new Error(`Chrome exited before its debugging endpoint started (exit ${browser.exitCode})`);
  try {
    version = await fetch(`http://127.0.0.1:${port}/json/version`).then((response) => response.json());
    break;
  } catch {
    await pause(100);
  }
}
assert.ok(version?.webSocketDebuggerUrl, `Chrome debugging endpoint did not start on port ${port} within 15 seconds`);

const target = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(`${baseUrl}/`)}`, { method: "PUT" }).then((response) => response.json());
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let sequence = 0;
const pending = new Map();
const runtimeExceptions = [];
socket.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  if (message.method === "Runtime.exceptionThrown") runtimeExceptions.push(message.params.exceptionDetails.text);
  if (!message.id) return;
  const waiter = pending.get(message.id);
  if (!waiter) return;
  pending.delete(message.id);
  if (message.error) waiter.reject(new Error(message.error.message));
  else waiter.resolve(message.result);
});
socket.addEventListener("close", () => {
  for (const waiter of pending.values()) waiter.reject(new Error("Chrome debugging connection closed unexpectedly"));
  pending.clear();
});
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++sequence;
  pending.set(id, { resolve, reject });
  socket.send(JSON.stringify({ id, method, params }));
});
const evaluate = async (expression) => {
  const response = await send("Runtime.evaluate", { returnByValue: true, awaitPromise: true, expression });
  if (response.exceptionDetails) {
    throw new Error(`Browser evaluation failed: ${response.exceptionDetails.exception?.description || response.exceptionDetails.text}`);
  }
  if (!response.result || !("value" in response.result)) {
    throw new Error(`Browser evaluation returned no value for ${target.url}`);
  }
  return response.result.value;
};
const getPageState = () => evaluate(`(() => {
  const cta = [...document.querySelectorAll('a')].find((node) => node.textContent?.trim() === 'Start Converting');
  const required = { header: !!document.querySelector('header'), tool: !!document.querySelector('#tool'), editor: !!document.querySelector('#handwriting-text'), cta: !!cta };
  return { url: location.href, readyState: document.readyState, fontStatus: document.fonts?.status || 'unsupported', required,
    bodyLength: document.body?.innerText?.length || 0,
    errorOverlay: !!document.querySelector('[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay') };
})()`);
const navigate = async (width, height) => {
  const navigation = await send("Page.navigate", { url: `${baseUrl}/` });
  if (navigation.errorText) throw new Error(`Navigation failed at ${width}x${height}: ${navigation.errorText}`);
  let state;
  for (let attempt = 0; attempt < 120; attempt += 1) {
    state = await getPageState();
    const selectorsReady = Object.values(state.required).every(Boolean);
    if (state.url.startsWith(baseUrl) && state.readyState === "complete" && state.fontStatus !== "loading" && selectorsReady && !state.errorOverlay) {
      await evaluate(`new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve(true))))`);
      return;
    }
    await pause(100);
  }
  throw new Error(`Page readiness timed out at ${width}x${height}: ${JSON.stringify(state)}`);
};

await send("Page.enable");
await send("Runtime.enable");

const sizes = [[320, 844], [360, 844], [390, 844], [430, 900], [768, 1024], [900, 1000], [1024, 1000], [1200, 1000], [1440, 1000]];
const measurements = [];
for (const [width, height] of sizes) {
  await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width < 768 });
  await navigate(width, height);
  const measurement = await evaluate(`(() => {
    const rect = (selector) => document.querySelector(selector)?.getBoundingClientRect();
    const menuButton = document.querySelector('button[aria-controls]');
    const label = document.querySelector('label[for="handwriting-text"]');
    const editor = document.querySelector('#handwriting-text');
    return { width: innerWidth, height: innerHeight, headerHeight: rect('header')?.height,
      toolTop: rect('#tool')?.top + scrollY, editorTop: rect('#handwriting-text')?.top + scrollY,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      ctaHref: [...document.querySelectorAll('a')].find((node) => node.textContent?.trim() === 'Start Converting')?.getAttribute('href'),
      menuVisible: !!menuButton?.getBoundingClientRect().height,
      immediateLabel: label?.nextElementSibling === editor };
  })()`);
  assert.ok(measurement && typeof measurement === "object", `Measurement missing at ${width}x${height}: ${JSON.stringify(await getPageState())}`);
  for (const field of ["overflow", "ctaHref", "menuVisible", "immediateLabel"]) {
    assert.ok(Object.hasOwn(measurement, field), `Measurement field ${field} missing at ${width}x${height}: ${JSON.stringify(measurement)}`);
  }
  measurements.push(measurement);
  assert.equal(measurement.overflow, 0, `Horizontal overflow at ${width}px`);
  assert.equal(measurement.ctaHref, "#tool", `CTA fallback missing at ${width}px`);
  assert.equal(measurement.menuVisible, width < 1024, `Menu visibility mismatch at ${width}px`);
  assert.equal(measurement.immediateLabel, true, `Textarea label is not immediate at ${width}px`);
  if ([[390, 844], [768, 1024], [1440, 1000]].some(([w, h]) => w === width && h === height)) {
    const screenshot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
    writeFileSync(path.join(outputDir, `after-${width}x${height}.png`), Buffer.from(screenshot.data, "base64"));
  }
}

await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await navigate(390, 844);
await evaluate(`(() => { const button = document.querySelector('button[aria-controls]'); button.focus(); button.click(); return true; })()`);
await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
await pause(100);
const escapeResult = await evaluate(`(() => { const button = document.querySelector('button[aria-controls]'); const menu = document.querySelector('nav[id][aria-label="Mobile navigation"]'); return { expanded: button.getAttribute('aria-expanded'), hidden: menu.hidden, focusRestored: document.activeElement === button }; })()`);
assert.deepEqual(escapeResult, { expanded: "false", hidden: true, focusRestored: true });

await evaluate(`(() => { document.querySelector('button[aria-controls]').click(); return true; })()`);
await evaluate(`(() => { document.querySelector('nav[aria-label="Mobile navigation"] a[href="/#features"]').click(); return true; })()`);
await pause(150);
const samePageResult = await evaluate(`(() => { const menu = document.querySelector('nav[id][aria-label="Mobile navigation"]'); return { hidden: menu.hidden, active: document.activeElement?.id, focusInsideHiddenMenu: menu.contains(document.activeElement) }; })()`);
assert.deepEqual(samePageResult, { hidden: true, active: "features-heading", focusInsideHiddenMenu: false });

await navigate(390, 844);
await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
await evaluate(`(() => { window.__editorFocusCount = 0; document.querySelector('#handwriting-text').addEventListener('focus', () => { window.__editorFocusCount += 1; }); [...document.querySelectorAll('a')].find((node) => node.textContent?.trim() === 'Start Converting').click(); return true; })()`);
await pause(150);
const ctaResult = await evaluate(`({ active: document.activeElement?.id, hash: location.hash, focusCount: window.__editorFocusCount })`);
assert.deepEqual(ctaResult, { active: "handwriting-text", hash: "", focusCount: 1 });

await navigate(390, 844);
const modifierResult = await evaluate(`(() => { const link = [...document.querySelectorAll('a')].find((node) => node.textContent?.trim() === 'Start Converting'); const event = new MouseEvent('click', { bubbles: true, cancelable: true, ctrlKey: true, button: 0 }); const allowed = link.dispatchEvent(event); return { allowed, hash: location.hash }; })()`);
assert.deepEqual(modifierResult, { allowed: true, hash: "" });

const pageHealth = await evaluate(`({ hasContent: document.body.innerText.trim().length > 0, hasErrorOverlay: !!document.querySelector('[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay') })`);
assert.deepEqual(pageHealth, { hasContent: true, hasErrorOverlay: false });
assert.deepEqual(runtimeExceptions, [], `Browser runtime exceptions: ${runtimeExceptions.join(", ")}`);

console.log(JSON.stringify({ measurements, escapeResult, samePageResult, ctaResult, modifierResult, pageHealth }, null, 2));
socket.close();
browser.kill();
if (browser.exitCode === null) await new Promise((resolve) => browser.once("exit", resolve));
process.removeListener("exit", stopBrowser);
await pause(500);
rmSync(browserProfile, { recursive: true, force: true, maxRetries: 20, retryDelay: 250 });
