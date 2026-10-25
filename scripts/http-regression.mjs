import assert from "node:assert/strict";
import { publicToolCatalog } from "../lib/tool-catalog.ts";
import { curatedTemplatePages } from "../lib/template-library.ts";

const baseUrl = process.env.HANDWRITING_TEST_BASE_URL || "http://127.0.0.1:3105";
const canonicalOrigin = process.env.NEXT_PUBLIC_SITE_URL || "https://handtextgraph.com";
const uniqueToolPaths = [...new Set(publicToolCatalog.map((tool) => tool.href.split("#")[0] || "/"))];
const detailPaths = curatedTemplatePages.map((page) => `/templates/${page.family}/${page.slug}`);
const paths = [...new Set(["/", "/tools", "/templates", "/about", "/contact", "/privacy-policy", "/terms", "/responsible-use", ...uniqueToolPaths, ...detailPaths])];

for (const path of paths) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: "manual" });
  assert.equal(response.status, 200, `${path} status`);
  const html = await response.text();
  assert.match(html, /<title>[^<]{8,}<\/title>/i, `${path} title`);
  assert.match(html, /<meta name="description" content="[^"]{40,}"/i, `${path} description`);
  const canonicalPath = path === "/" ? "" : path;
  assert.ok(html.includes(`<link rel="canonical" href="${canonicalOrigin}${canonicalPath}"`), `${path} canonical`);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${path} must have one H1`);
  assert.doesNotMatch(html, /handwritingtool\.com/i, `${path} must not claim the former domain`);
}

const homepage = await fetch(`${baseUrl}/`).then((response) => response.text());
for (const type of ["Organization", "WebSite"]) assert.ok(homepage.includes(type), `Homepage ${type} schema`);
assert.ok(homepage.includes("HandTextGraph"), "Homepage brand");
const sitemap = await fetch(`${baseUrl}/sitemap.xml`).then((response) => { assert.equal(response.status, 200); return response.text(); });
for (const path of ["/", "/tools", "/templates", ...detailPaths]) {
  const expected = `${canonicalOrigin}${path === "/" ? "" : path}`;
  assert.ok(sitemap.includes(expected), `Sitemap includes ${path}`);
}
assert.doesNotMatch(sitemap, /\/templates\/download\//, "Download endpoints stay out of sitemap");
assert.doesNotMatch(sitemap, /handwritingtool\.com/i, "Sitemap must not use former domain");

const robots = await fetch(`${baseUrl}/robots.txt`).then((response) => { assert.equal(response.status, 200); return response.text(); });
assert.match(robots, /User-Agent: \*/i);
assert.ok(robots.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`));

for (const [source, destination] of [["/privacy", "/privacy-policy"], ["/terms-and-conditions", "/terms"]]) {
  const response = await fetch(`${baseUrl}${source}`, { redirect: "manual" });
  assert.ok([301, 307, 308].includes(response.status), `${source} redirect status`);
  assert.equal(new URL(response.headers.get("location"), baseUrl).pathname, destination, `${source} redirect destination`);
}

const headers = await fetch(`${baseUrl}/`).then((response) => response.headers);
assert.equal(headers.get("x-content-type-options"), "nosniff");
assert.equal(headers.get("x-frame-options"), "SAMEORIGIN");
assert.ok(headers.get("permissions-policy")?.includes("camera=()"));
console.log(`HTTP regression passed for ${paths.length} indexable routes, canonicals, schemas, sitemap, redirects, and security headers.`);
