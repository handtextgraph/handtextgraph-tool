import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read=(path)=>readFileSync(new URL(`../${path}`,import.meta.url),"utf8");
const layout=read("app/layout.tsx"),sitemap=read("app/sitemap.ts"),robots=read("app/robots.ts"),home=read("app/page.tsx"),tools=read("app/tools/page.tsx"),templates=read("app/templates/page.tsx");
assert.match(layout,/metadataBase: new URL\(siteConfig\.origin\)/);assert.match(layout,/"@type": "Organization"/);assert.match(home,/canonical: "\/"/);assert.match(tools,/canonical: "\/tools"/);assert.match(templates,/canonical: "\/templates"/);assert.match(robots,/sitemap: `\$\{siteConfig\.origin\}\/sitemap\.xml`/);assert.doesNotMatch(sitemap,/editorialArticles/);
console.log("SEO regression checks passed for public canonicals, schema, sitemap, and robots.");
