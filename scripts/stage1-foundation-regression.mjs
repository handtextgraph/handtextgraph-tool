import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { publicToolCatalog, toolCategories, toolsInCategory } from "../lib/tool-catalog.ts";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const home = read("app/page.tsx");
const adminLayout = read("app/admin/layout.tsx");
const toolsPage = read("app/tools/page.tsx");
const publicUi = read("components/ui/PublicUi.tsx");
const tailwind = read("tailwind.config.ts");

assert.equal(publicToolCatalog.length, 40);
assert.equal(new Set(publicToolCatalog.map(({ href }) => href)).size, publicToolCatalog.length, "Tool catalog URLs must be unique");
assert.deepEqual(toolCategories.map((category) => toolsInCategory(category).length), [7, 17, 9, 7]);
for (const tool of publicToolCatalog) {
  const pathname = tool.href.split("#")[0] || "/";
  if (pathname === "/") continue;
  const isPaperGenerator = tool.category === "Printable paper";
  assert.ok(isPaperGenerator ? existsSync(new URL("../app/tools/[paperGenerator]/page.tsx", import.meta.url)) : existsSync(new URL(`../app${pathname}/page.tsx`, import.meta.url)), `Catalog route must exist: ${pathname}`);
}

assert.match(home, /Your words\./, "Stage 1 must preserve the homepage implementation");
assert.doesNotMatch(home, /PublicContainer|ToolDirectoryLink/, "Stage 1 shared UI must not redesign the homepage");
assert.match(adminLayout, /robots:\{index:false,follow:false/, "Stage 1 must preserve the admin noindex boundary");
assert.match(toolsPage, /toolsInCategory/);
assert.match(publicUi, /aria-label="Breadcrumb"/);
assert.match(publicUi, /aria-current="page"/);
for (const token of ["navy", "teal", "ice", "amber", "slate"]) assert.match(tailwind, new RegExp(`${token}:`));

for (const deferredRoute of ["virtual-graph-paper", "sudoku-generator"]) {
  assert.ok(!existsSync(new URL(`../app/tools/${deferredRoute}/page.tsx`, import.meta.url)), `${deferredRoute} belongs to a later stage`);
}

console.log("Stage 1 foundation regression checks passed.");
