import fs from "node:fs";
import path from "node:path";
import { jsPDF } from "jspdf";

const outputDir = path.join(process.cwd(), "public", "templates");
fs.mkdirSync(outputDir, { recursive: true });

const blue = [84, 141, 212];
const softBlue = [214, 228, 248];
const marginRed = [229, 115, 115];
const ink = [30, 41, 59];

function addFooter(doc, label) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`${label} - free template from HandwritingTool.com`, 14, 290);
}

function save(doc, fileName) {
  doc.save(path.join(outputDir, fileName));
}

function createLinedPaper() {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 297, "F");

  doc.setDrawColor(...marginRed);
  doc.setLineWidth(0.4);
  doc.line(28, 18, 28, 282);

  doc.setDrawColor(...softBlue);
  doc.setLineWidth(0.25);

  for (let y = 25; y <= 275; y += 8) {
    doc.line(14, y, 196, y);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...ink);
  doc.text("Printable Lined Paper", 14, 12);
  addFooter(doc, "Printable lined paper");
  save(doc, "printable-lined-paper-a4.pdf");
}

function createGraphPaper() {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 297, "F");

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.1);
  for (let x = 14; x <= 196; x += 5) {
    doc.line(x, 18, x, 278);
  }
  for (let y = 18; y <= 278; y += 5) {
    doc.line(14, y, 196, y);
  }

  doc.setDrawColor(...blue);
  doc.setLineWidth(0.25);
  for (let x = 14; x <= 196; x += 25) {
    doc.line(x, 18, x, 278);
  }
  for (let y = 18; y <= 278; y += 25) {
    doc.line(14, y, 196, y);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...ink);
  doc.text("Printable Graph Paper", 14, 12);
  addFooter(doc, "Printable graph paper");
  save(doc, "printable-graph-paper-a4.pdf");
}

function createPracticeSheet() {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...ink);
  doc.text("Handwriting Practice Sheet", 14, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text("Use this printable sheet for practice, examples, drafts, or classroom-style handwriting exercises.", 14, 26);

  doc.setDrawColor(...softBlue);
  doc.setLineWidth(0.25);
  for (let y = 42; y <= 260; y += 18) {
    doc.line(14, y, 196, y);
    doc.setDrawColor(226, 232, 240);
    doc.line(14, y - 6, 196, y - 6);
    doc.setDrawColor(...softBlue);
  }

  doc.setDrawColor(...marginRed);
  doc.setLineWidth(0.35);
  doc.line(28, 36, 28, 264);

  addFooter(doc, "Handwriting practice sheet");
  save(doc, "handwriting-practice-sheet-a4.pdf");
}

function createSettingsGuideSvg() {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760" viewBox="0 0 1200 760" role="img" aria-labelledby="title desc">
  <title id="title">Best handwriting settings guide</title>
  <desc id="desc">Recommended HandwritingTool settings for notes, letters, math pages, worksheets, and quick previews.</desc>
  <rect width="1200" height="760" fill="#f8fafc"/>
  <rect x="52" y="48" width="1096" height="664" rx="26" fill="#ffffff" stroke="#dbe7f3" stroke-width="2"/>
  <text x="92" y="112" fill="#0f172a" font-family="Arial, sans-serif" font-size="42" font-weight="700">Best Handwriting Settings</text>
  <text x="92" y="152" fill="#475569" font-family="Arial, sans-serif" font-size="22">Use these starting points, then preview the page before exporting.</text>
  <g font-family="Arial, sans-serif" font-size="19">
    <rect x="92" y="198" width="1016" height="56" rx="14" fill="#0f172a"/>
    <text x="122" y="233" fill="#ffffff" font-weight="700">Use case</text>
    <text x="335" y="233" fill="#ffffff" font-weight="700">Paper</text>
    <text x="510" y="233" fill="#ffffff" font-weight="700">Ink</text>
    <text x="670" y="233" fill="#ffffff" font-weight="700">Size</text>
    <text x="815" y="233" fill="#ffffff" font-weight="700">Spacing</text>
    <text x="982" y="233" fill="#ffffff" font-weight="700">Export</text>
    ${row(278, "Study notes", "Lined", "Blue/Black", "Medium", "1.3-1.5", "PDF")}
    ${row(354, "Personal letter", "Blank", "Black", "Medium", "1.5-1.7", "PDF/PNG")}
    ${row(430, "Math or lab", "Graph", "Blue/Black", "Small-Med", "1.2-1.4", "PDF")}
    ${row(506, "Worksheet", "Blank/Lined", "Black", "Medium", "1.3-1.5", "PDF")}
    ${row(582, "Quick preview", "Any", "Blue", "Medium", "Normal", "PNG/JPG")}
  </g>
  <rect x="92" y="646" width="1016" height="40" rx="14" fill="#e0f2fe"/>
  <text x="118" y="672" fill="#075985" font-family="Arial, sans-serif" font-size="18" font-weight="700">Tip: If a page looks crowded, split long paragraphs before reducing font size.</text>
</svg>`;

  fs.writeFileSync(path.join(outputDir, "best-handwriting-settings-guide.svg"), svg, "utf8");
}

function row(y, useCase, paper, color, size, spacing, exportType) {
  return `
    <rect x="92" y="${y - 38}" width="1016" height="56" rx="14" fill="${y % 152 === 50 ? "#f1f5f9" : "#ffffff"}" stroke="#e2e8f0"/>
    <text x="122" y="${y}" fill="#0f172a" font-weight="700">${useCase}</text>
    <text x="335" y="${y}" fill="#334155">${paper}</text>
    <text x="510" y="${y}" fill="#334155">${color}</text>
    <text x="670" y="${y}" fill="#334155">${size}</text>
    <text x="815" y="${y}" fill="#334155">${spacing}</text>
    <text x="982" y="${y}" fill="#334155">${exportType}</text>`;
}

createLinedPaper();
createGraphPaper();
createPracticeSheet();
createSettingsGuideSvg();

console.log("Generated template assets in public/templates");
