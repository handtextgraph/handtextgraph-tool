import assert from "node:assert/strict";
import fs from "node:fs";

const read = (path) => fs.readFileSync(path, "utf8");
assert.ok(!fs.existsSync("lib/editorial-content.ts"));
assert.ok(!fs.existsSync("app/blog/page.tsx"));
assert.ok(!fs.existsSync("app/blog/[slug]/page.tsx"));
assert.match(read("lib/site-config.ts"), /NEXT_PUBLIC_SITE_URL/);
const keywordMap = read("lib/keyword-map.ts");
for (const route of ["/", "/tools", "/templates"]) assert.ok(keywordMap.includes(`url: "${route}"`));
assert.doesNotMatch(read("app/sitemap.ts"), /editorialArticles/);
const header = read("components/SiteHeader.tsx");
for (const label of ["Handwriting", "Paper", "Templates", "Education", "Creative"]) assert.ok(header.includes(`label:\"${label}\"`) || header.includes(`label: \"${label}\"`));
const home = read("app/page.tsx");
assert.match(home, /HandwritingToolLoader/);
assert.match(home, /id="studio"/);
console.log("Stage 7+8 regression passed: blog removed, centralized SEO config, navigation, and homepage studio verified.");
