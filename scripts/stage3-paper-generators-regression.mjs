import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { buildGeneratorPageModel } from "../lib/paper-generator-engine.ts";
import { paperGeneratorDefinitions, paperGeneratorSlugs } from "../lib/paper-generators.ts";
import { createPaperGeneratorPdf } from "../lib/paper-generator-pdf.ts";
import { serializePaperSvg } from "../lib/paper-svg.ts";

assert.equal(paperGeneratorDefinitions.length,17);
assert.equal(new Set(paperGeneratorSlugs).size,17);
assert.equal(new Set(paperGeneratorDefinitions.map(item=>item.name)).size,17);
assert.equal(new Set(paperGeneratorDefinitions.map(item=>item.description)).size,17);
assert.ok(existsSync(new URL("../app/tools/[paperGenerator]/page.tsx",import.meta.url)));

const models=new Map();
for(const definition of paperGeneratorDefinitions){
  const model=buildGeneratorPageModel({size:"a4",orientation:"portrait",marginsMm:{top:12,right:12,bottom:12,left:12},background:"#ffffff",pattern:definition.build(definition.defaults)});
  models.set(definition.slug,model);
  assert.deepEqual([model.widthMm,model.heightMm],[210,297]);
  assert.ok(model.primitives.length>0,`${definition.slug} must render real geometry`);
  assert.ok(model.primitives.every(p=>p.kind==="text"||(p.kind==="circle"?Number.isFinite(p.radius):[p.x1,p.y1,p.x2,p.y2].every(Number.isFinite))),`${definition.slug} geometry must be finite`);
  const svg=serializePaperSvg(model); assert.match(svg,/width="210mm" height="297mm"/);
  assert.equal((svg.match(/<(line|circle|text)\b/g)??[]).length,model.primitives.length);
}

const lines=(slug)=>models.get(slug).primitives.filter(item=>item.kind==="line");
const angle=(item)=>Math.round(Math.atan2(item.y2-item.y1,item.x2-item.x1)*180/Math.PI);
assert.ok(new Set(lines("isometric-paper-generator").map(angle)).size>=3,"isometric paper needs three axis families");
assert.ok(new Set(lines("triangle-grid-generator").map(angle)).size>=3,"triangle paper needs three line families");
const hex=lines("hexagonal-paper-generator"); assert.ok(hex.some(item=>Math.abs(Math.hypot(item.x2-item.x1,item.y2-item.y1)-7)<.001),"hexagon edges must equal the configured side");
const coordinate=lines("coordinate-plane-generator"); assert.ok(coordinate.some(item=>item.width>=.35),"coordinate axes must be stronger than grid lines");
const polar=models.get("polar-graph-paper-generator").primitives; assert.ok(polar.filter(item=>item.kind==="circle").length>=9); assert.ok(lines("polar-graph-paper-generator").length>=12);
const semilog=lines("semi-log-paper-generator").filter(item=>item.x1===item.x2).map(item=>item.x1).toSorted((a,b)=>a-b); assert.ok(semilog.some((value,index)=>index&&Math.abs((value-semilog[index-1])-5)>0.1),"semi-log divisions must be nonuniform");
assert.ok(lines("log-log-paper-generator").some(item=>item.x1===item.x2)&&lines("log-log-paper-generator").some(item=>item.y1===item.y2));
assert.ok(lines("perspective-grid-generator").some(item=>Math.abs(item.y1-item.y2)>.1),"perspective rays must converge");
assert.ok(new Set(lines("engineering-paper-generator").map(item=>item.width.toFixed(3))).size>=3,"engineering paper needs three line weights");
assert.ok(models.get("cornell-notes-generator").primitives.filter(item=>item.kind==="text").length>=5,"Cornell regions need labels");
assert.ok(lines("handwriting-practice-paper").some(item=>item.dash?.length),"practice paper needs dashed midlines");
const seyesY=lines("seyes-ruled-paper-generator").filter(item=>item.y1===item.y2).map(item=>item.y1).toSorted((a,b)=>a-b); assert.equal(Number((seyesY[1]-seyesY[0]).toFixed(4)),2);
assert.ok(lines("chinese-character-practice-paper-generator").some(item=>item.dash?.length),"Chinese practice cells need internal guides");
const musicHorizontal=lines("music-staff-paper").filter(item=>item.y1===item.y2); assert.equal(musicHorizontal.length%5,0,"music staves must contain five horizontal lines");

const sample=models.get("polar-graph-paper-generator"),pdf=createPaperGeneratorPdf(sample,"portrait",2); assert.equal(pdf.getNumberOfPages(),2); assert.ok(Math.abs(pdf.internal.pageSize.getWidth()-210)<.02); assert.ok(Math.abs(pdf.internal.pageSize.getHeight()-297)<.02);
const page=readFileSync(new URL("../app/tools/[paperGenerator]/page.tsx",import.meta.url),"utf8");
for(const token of ["canonical","SoftwareApplication","FAQPage","BreadcrumbList","PaperGeneratorStudio"])assert.match(page,new RegExp(token));
const sitemap=readFileSync(new URL("../app/sitemap.ts",import.meta.url),"utf8"); assert.match(sitemap,/paperGeneratorSlugs/);
console.log("Stage 3 paper generator checks passed for 17 patterns, geometry, exports, routes, and SEO.");
