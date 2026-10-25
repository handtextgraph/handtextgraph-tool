import assert from "node:assert/strict";
import { existsSync,readFileSync,readdirSync,statSync } from "node:fs";
import path from "node:path";import{fileURLToPath}from"node:url";
import { paperGeneratorSlugs } from "../lib/paper-generators.ts";
const root=fileURLToPath(new URL("..",import.meta.url)),appRoot=path.join(root,"app"),sources=[];
function collect(dir){for(const name of readdirSync(dir)){const full=path.join(dir,name);if(statSync(full).isDirectory())collect(full);else if(/\.(?:tsx)$/.test(name))sources.push(full)}}collect(appRoot);
const routes=new Set(["/"]);for(const file of sources){if(path.basename(file)==="page.tsx"&&!file.includes("[")){const relative=path.relative(appRoot,path.dirname(file)).replaceAll("\\","/");const segments=relative.split("/").filter(x=>x&&!/^\(.+\)$/.test(x));routes.add(segments.length?`/${segments.join("/")}`:"/")}}
for(const slug of paperGeneratorSlugs)routes.add(`/tools/${slug}`);
const checked=new Set();for(const file of sources){const source=readFileSync(file,"utf8"),links=[...[...source.matchAll(/href=["'](\/[^"']+)["']/g)].map(m=>m[1])];for(const href of links){const pathname=href.split("#")[0].split("?")[0]||"/";if(/\.[a-z0-9]{2,5}$/i.test(pathname)){assert.ok(existsSync(path.join(root,"public",pathname)),`Missing asset ${href}`);continue}checked.add(pathname);assert.ok(routes.has(pathname),`Missing route ${href} in ${path.relative(root,file)}`)}}
for(const route of ["/tools","/templates","/tools/handwriting-worksheet-generator"])assert.ok(checked.has(route),`Strategic URL has no internal link: ${route}`);
console.log(`Internal-link regression checks passed for ${checked.size} route destinations.`);
