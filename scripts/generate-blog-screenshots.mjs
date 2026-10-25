import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const outputDir = path.join(root, "public", "blog");

const assets = [
  ["current-tool-output-preview.png", "Live Output Preview", "Current Tool UI", "Typed content, paper preview, and export choices shown in the updated HandwritingTool workspace.", "workspace", "blue"],
  ["current-tool-home-preview.png", "Converter Home Preview", "Fresh Homepage", "A clean first-screen view with the converter promise, browser-ready workflow, and page output focus.", "hero", "emerald"],
  ["current-tool-editor-controls.png", "Editor and Page Controls", "Settings Panel", "Handwriting style, paper type, ink color, line spacing, margins, and download controls in one place.", "controls", "indigo"],
  ["current-tool-export-options.png", "PDF, PNG, and JPG Export", "Download Ready", "Preview the handwritten page first, then export the current page or every generated page.", "export", "slate"],
  ["blog-handwriting-text-preview.png", "Handwriting Text Preview", "Text to Page", "A focused view of typed text becoming readable notebook-style handwriting.", "workspace", "cyan"],
  ["blog-create-pages-workspace.png", "Create Handwritten Pages", "Full Page Builder", "Paste paragraphs, tune the page, and review a complete handwritten output before download.", "pages", "emerald"],
  ["blog-convert-text-workflow.png", "Convert Text Workflow", "Beginner Guide", "Paste text, choose a style, preview the page, and download the final handwritten result.", "steps", "blue"],
  ["blog-convert-text-settings.png", "Best Settings Check", "Before Export", "Review handwriting style, line spacing, word spacing, and paper type before saving.", "controls", "emerald"],
  ["blog-graph-paper-preview.png", "Graph Paper Handwriting", "Grid Layout", "Graph paper output for math notes, lab records, formulas, and structured handwriting pages.", "graph", "slate"],
  ["blog-handwritten-text-generator-home.png", "Handwritten Text Generator", "Quick Start", "A fresh generator view for turning short typed sections into handwritten-looking text.", "hero", "indigo"],
  ["blog-handwritten-text-generator-controls.png", "Generator Controls", "Customize Output", "Choose handwriting style, ink color, page brightness, and natural variation.", "controls", "cyan"],
  ["blog-notes-generator-editor.png", "Notes Generator Editor", "Study Notes", "An editor view for class notes, summaries, revision sheets, and quick study pages.", "workspace", "emerald"],
  ["blog-notes-generator-preview.png", "Notebook Preview", "Readable Notes", "Line spacing and margins tuned for clean handwritten-style notebook pages.", "paper", "blue"],
  ["blog-word-to-handwriting-import.png", "Word to Handwriting", "Copy and Paste", "Bring text from Word, Docs, or notes into the browser and preview it as handwriting.", "import", "indigo"],
  ["blog-word-to-handwriting-controls.png", "Document Controls", "Format Page", "Document text can be adjusted with paper, ink, spacing, margins, and export options.", "controls", "slate"],
  ["blog-assignment-online-layout.png", "Assignment Page Layout", "Permitted Use", "A complete page layout for drafts, worksheets, examples, and allowed handwritten-style formats.", "assignment", "blue"],
  ["blog-pdf-generator-export.png", "Handwriting PDF Export", "PDF Generator", "Generate handwritten pages and save them as a clean PDF after checking the preview.", "export", "emerald"],
  ["blog-lined-paper-output.png", "Lined Paper Output", "Notebook Style", "Blue ink, margin line, and lined paper output for normal notes and assignments.", "lined", "cyan"],
  ["blog-realistic-handwriting-settings.png", "Realistic Handwriting Settings", "Natural Variation", "Small differences in letter flow, spacing, and page layout help the output feel less repetitive.", "settings", "indigo"],
  ["blog-typed-notes-preview.png", "Typed Notes to Handwriting", "Study Workflow", "Typed notes on the left, handwritten page preview on the right, ready for export.", "workspace", "slate"],
  ["blog-best-fonts-comparison.png", "Handwriting Font Comparison", "Font Guide", "Compare readable handwriting styles before choosing one for an assignment or note page.", "fonts", "blue"],
  ["blog-student-generator-dashboard.png", "Student Handwriting Generator", "Student Workflow", "A simple dashboard-style view for study notes, class summaries, and printable pages.", "dashboard", "emerald"],
  ["blog-tools-comparison-matrix.png", "Text to Handwriting Tool Comparison", "2026 Comparison", "Compare converters by signup friction, page controls, export formats, and privacy workflow.", "matrix", "slate"],
  ["blog-free-generator-no-signup.png", "Free Generator Without Sign Up", "No Account", "Open the converter, paste text, preview handwriting, and download without creating an account.", "noSignup", "cyan"],
  ["blog-tool-vs-generator-flow.png", "Tool vs Generator", "Workflow Difference", "A generator creates the handwriting effect; a tool adds page layout, preview, and export controls.", "flow", "indigo"],
  ["blog-mobile-pdf-preview.png", "Mobile Handwriting PDF", "Phone Ready", "Preview a page on mobile and download a PDF when the layout looks right.", "mobile", "emerald"],
  ["blog-write-assignments-faster-board.png", "Faster Assignment Drafting", "Planning Board", "Plan the text, generate a page preview, and export only after checking the final layout.", "board", "blue"],
  ["blog-pdf-to-handwriting-workflow.png", "PDF Text to Handwriting Workflow", "PDF Guide", "Extract allowed text from a PDF, paste it into the converter, and rebuild it as handwriting.", "pdfFlow", "slate"],
].map(([file, title, eyebrow, body, layout, accent]) => ({ file, title, eyebrow, body, layout, accent }));

const accents = {
  blue: ["#2563eb", "#dbeafe", "#eff6ff"],
  emerald: ["#059669", "#d1fae5", "#ecfdf5"],
  indigo: ["#4f46e5", "#e0e7ff", "#f5f3ff"],
  cyan: ["#0e7490", "#cffafe", "#ecfeff"],
  slate: ["#0f172a", "#e2e8f0", "#f8fafc"],
};

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function wrap(value, max) {
  const words = value.split(/\s+/);
  const lines = [];
  let line = "";

  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }

  if (line) lines.push(line);
  return lines;
}

function text(value, x, y, options = {}) {
  const {
    size = 24,
    color = "#0f172a",
    weight = 600,
    max = 42,
    lineHeight = Math.round(size * 1.35),
    family = "Arial, sans-serif",
    letterSpacing = 0,
  } = options;

  return wrap(value, max)
    .map(
      (line, index) =>
        `<text x="${x}" y="${y + index * lineHeight}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" letter-spacing="${letterSpacing}">${esc(line)}</text>`,
    )
    .join("");
}

function rect(x, y, w, h, fill, stroke = "#dbe3ef", rx = 24) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" />`;
}

function pill(label, x, y, fill, color, w = 145) {
  return `${rect(x, y, w, 36, fill, fill, 18)}${text(label, x + 15, y + 24, { size: 13, color, weight: 800, max: 18 })}`;
}

function logo(ink) {
  return `
    ${rect(46, 38, 48, 48, "#ffffff", ink, 13)}
    <text x="64" y="70" fill="${ink}" font-family="Georgia, serif" font-size="28" font-weight="700" transform="rotate(-7 70 62)">H</text>
    ${text("Handwriting", 108, 58, { size: 16, weight: 800, max: 14 })}
    ${text("Tool", 108, 78, { size: 16, weight: 800, color: ink, max: 14 })}
  `;
}

function pageLines(x, y, w, h, ink, mode = "lined") {
  let lines = "";
  if (mode === "graph") {
    for (let yy = y + 26; yy < y + h; yy += 28) lines += `<line x1="${x}" y1="${yy}" x2="${x + w}" y2="${yy}" stroke="#e2e8f0" />`;
    for (let xx = x + 28; xx < x + w; xx += 28) lines += `<line x1="${xx}" y1="${y}" x2="${xx}" y2="${y + h}" stroke="#e2e8f0" />`;
  } else {
    for (let yy = y + 58; yy < y + h; yy += 36) lines += `<line x1="${x}" y1="${yy}" x2="${x + w}" y2="${yy}" stroke="#dbeafe" />`;
  }
  return `
    ${rect(x, y, w, h, "#fffefa", "#dbe3ef", 24)}
    ${lines}
    <line x1="${x + 62}" y1="${y}" x2="${x + 62}" y2="${y + h}" stroke="#fecaca" stroke-width="2" />
    ${text("Name: Alex Carter", x + 86, y + 56, { size: 16, color: "#334155", weight: 600, max: 35 })}
    ${text("Topic: Clean handwritten pages", x + 86, y + 84, { size: 16, color: "#334155", weight: 600, max: 35 })}
    ${text("The updated HandwritingTool preview keeps typed text and page output close together, so spacing, margins, and ink can be checked before export.", x + 86, y + 130, { size: 22, color: ink, weight: 500, max: 43, lineHeight: 37, family: "Comic Sans MS, Comic Sans, cursive" })}
    ${text("PDF, PNG, and JPG export after preview.", x + 86, y + 315, { size: 22, color: ink, weight: 500, max: 34, lineHeight: 37, family: "Comic Sans MS, Comic Sans, cursive" })}
  `;
}

function controls(x, y, w, h, ink, soft) {
  const rows = ["Handwriting Style", "Page Type", "Ink Color", "Line Spacing", "Natural Variation", "PDF Quality"];
  return `
    ${rect(x, y, w, h, "#ffffff")}
    ${rows
      .map((row, index) => {
        const yy = y + 28 + index * 58;
        return `${rect(x + 28, yy, w - 56, 42, "#f8fafc", "#e2e8f0", 14)}${text(row, x + 46, yy + 27, { size: 15, color: "#334155", weight: 700, max: 20 })}${text(index % 2 === 0 ? "Selected" : "Balanced", x + w - 132, yy + 27, { size: 15, color: ink, weight: 800, max: 12 })}`;
      })
      .join("")}
    ${rect(x + 28, y + h - 92, 156, 44, ink, ink, 22)}
    ${text("Download PDF", x + 50, y + h - 64, { size: 15, color: "#ffffff", weight: 800, max: 14 })}
    ${rect(x + 200, y + h - 92, 190, 44, soft, soft, 22)}
    ${text("PNG and JPG", x + 224, y + h - 64, { size: 15, color: ink, weight: 800, max: 14 })}
  `;
}

function renderMain(asset, ink, soft) {
  const mode = asset.layout;

  if (mode === "hero") {
    return `
      ${pill("No login required", 70, 350, soft, ink, 168)}
      ${text(asset.title, 70, 422, { size: 48, weight: 800, max: 18, lineHeight: 54 })}
      ${text(asset.body, 70, 545, { size: 20, color: "#475569", weight: 500, max: 40, lineHeight: 30 })}
      ${rect(710, 326, 420, 296, "#ffffff")}
      ${pageLines(732, 348, 376, 252, ink, "lined")}
    `;
  }

  if (mode === "controls" || mode === "settings") {
    return `${controls(70, 318, 500, 380, ink, soft)}${pageLines(610, 318, 520, 380, ink, "lined")}`;
  }

  if (mode === "export") {
    return `
      ${pageLines(70, 318, 520, 380, ink, "lined")}
      ${rect(630, 318, 500, 380, "#ffffff")}
      ${text("Export Options", 664, 372, { size: 30, weight: 800, max: 20 })}
      ${["PDF - Current page", "PNG - Image export", "JPG - Shareable preview"].map((label, i) => `${rect(664, 410 + i * 62, 396, 44, i === 0 ? soft : "#f8fafc", i === 0 ? ink : "#e2e8f0", 14)}${text(label, 684, 438 + i * 62, { size: 16, color: i === 0 ? ink : "#334155", weight: 800, max: 30 })}`).join("")}
      ${rect(664, 620, 226, 46, ink, ink, 23)}
      ${text("Download checked page", 686, 649, { size: 15, color: "#ffffff", weight: 800, max: 24 })}
    `;
  }

  if (mode === "steps" || mode === "flow" || mode === "pdfFlow") {
    const steps = mode === "pdfFlow" ? ["Extract text", "Paste", "Preview", "Export"] : ["Paste text", "Choose settings", "Preview page", "Download"];
    return steps
      .map((step, i) => {
        const x = 70 + i * 270;
        return `${rect(x, 350, 240, 260, "#ffffff")} ${rect(x + 28, 378, 48, 48, ink, ink, 16)}${text(String(i + 1), x + 46, 409, { size: 22, color: "#ffffff", weight: 900, max: 2 })}${text(step, x + 28, 480, { size: 25, weight: 800, max: 15, lineHeight: 31 })}${text("Keep the workflow simple and browser-based.", x + 28, 555, { size: 16, color: "#64748b", weight: 500, max: 22, lineHeight: 24 })}`;
      })
      .join("");
  }

  if (mode === "graph") {
    return `${controls(70, 340, 430, 310, ink, soft)}${pageLines(540, 318, 590, 380, ink, "graph")}`;
  }

  if (mode === "fonts") {
    const fonts = ["Classic Student", "Clean Notes", "Lab Record", "Exam Sheet", "Neat Margin", "Quick Draft"];
    return fonts
      .map((font, i) => {
        const x = 70 + (i % 3) * 360;
        const y = 320 + Math.floor(i / 3) * 170;
        return `${rect(x, y, 320, 134, "#ffffff")}${text(font, x + 26, y + 36, { size: 17, color: "#334155", weight: 800, max: 18 })}${text("Hello sample", x + 26, y + 95, { size: 36, color: ink, weight: 500, max: 20, family: "Comic Sans MS, Comic Sans, cursive" })}`;
      })
      .join("");
  }

  if (mode === "matrix") {
    const rows = [["Feature", "HandwritingTool", "Basic tools"], ["No signup", "Yes", "Often required"], ["PDF export", "Included", "Varies"], ["Page controls", "Detailed", "Basic"], ["Preview", "Real page", "Text only"]];
    return `${rect(90, 320, 1020, 310, "#ffffff")}${rows
      .map((row, r) =>
        row
          .map((cell, c) => {
            const x = 90 + c * 340;
            const y = 320 + r * 62;
            return `${rect(x, y, 340, 62, r === 0 ? "#0f172a" : "#ffffff", "#e2e8f0", 0)}${text(cell, x + 24, y + 39, { size: 18, color: r === 0 ? "#ffffff" : "#334155", weight: r === 0 ? 800 : 650, max: 24 })}`;
          })
          .join(""),
      )
      .join("")}`;
  }

  if (mode === "mobile") {
    return `
      ${rect(155, 300, 310, 420, "#0f172a", "#0f172a", 42)}
      ${pageLines(180, 324, 260, 370, ink, "lined")}
      ${rect(560, 370, 480, 240, "#ffffff")}
      ${text("Mobile preview", 594, 430, { size: 34, weight: 800, max: 18 })}
      ${text("Check the handwritten page on a phone-size layout before saving a PDF.", 594, 486, { size: 20, color: "#64748b", weight: 500, max: 40, lineHeight: 30 })}
      ${rect(594, 560, 160, 44, ink, ink, 22)}
      ${text("Download PDF", 616, 588, { size: 15, color: "#ffffff", weight: 800, max: 14 })}
    `;
  }

  if (mode === "board" || mode === "dashboard" || mode === "noSignup") {
    const cards = ["Draft text", "Generate", "Review", "Export"];
    return cards
      .map((card, i) => {
        const x = 70 + i * 270;
        return `${rect(x, 350, 240, 245, "#ffffff")}${rect(x + 28, 382, 48, 48, ink, ink, 16)}${text(String(i + 1), x + 46, 413, { size: 22, color: "#ffffff", weight: 900, max: 2 })}${text(card, x + 28, 494, { size: 25, weight: 800, max: 15 })}${text("Check the page before the final download.", x + 28, 552, { size: 16, color: "#64748b", weight: 500, max: 22, lineHeight: 24 })}`;
      })
      .join("");
  }

  if (mode === "import") {
    return `
      ${rect(70, 338, 480, 320, "#ffffff")}
      ${text("Word / Docs text", 104, 398, { size: 30, weight: 800, max: 22 })}
      ${text("Copy document paragraphs and paste them into the converter.", 104, 452, { size: 19, color: "#64748b", weight: 500, max: 36, lineHeight: 28 })}
      ${rect(104, 540, 360, 16, "#e2e8f0", "#e2e8f0", 8)}
      ${rect(104, 574, 310, 16, "#e2e8f0", "#e2e8f0", 8)}
      ${rect(104, 608, 230, 16, "#e2e8f0", "#e2e8f0", 8)}
      ${pageLines(590, 318, 540, 380, ink, "lined")}
    `;
  }

  if (mode === "lined" || mode === "paper" || mode === "assignment" || mode === "pages") {
    return `${pageLines(220, 306, 760, 410, ink, "lined")}`;
  }

  return `
    ${rect(70, 318, 500, 380, "#ffffff")}
    ${text("Typed content", 104, 370, { size: 30, weight: 800, max: 20 })}
    ${text("Paste notes, worksheet text, drafts, or article content into the editor.", 104, 425, { size: 19, color: "#64748b", weight: 500, max: 36, lineHeight: 29 })}
    ${pill("Worksheet", 104, 535, ink, "#ffffff", 118)}
    ${pill("Class Notes", 236, 535, soft, ink, 132)}
    ${pill("Lab Record", 382, 535, "#0f172a", "#ffffff", 120)}
    ${pageLines(610, 318, 520, 380, ink, "lined")}
  `;
}

function svg(asset) {
  const [ink, soft, pale] = accents[asset.accent];
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760" viewBox="0 0 1200 760">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#f8fafc" />
          <stop offset="52%" stop-color="${pale}" />
          <stop offset="100%" stop-color="#ffffff" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="24" stdDeviation="24" flood-color="#0f172a" flood-opacity="0.12" />
        </filter>
      </defs>
      <rect width="1200" height="760" fill="url(#bg)" />
      ${logo(ink)}
      ${text("Converter", 784, 68, { size: 14, color: "#475569", weight: 700, max: 10 })}
      ${text("Features", 880, 68, { size: 14, color: "#475569", weight: 700, max: 10 })}
      ${text("Guide", 970, 68, { size: 14, color: "#475569", weight: 700, max: 10 })}
      ${text("Blog", 1040, 68, { size: 14, color: "#475569", weight: 700, max: 10 })}
      ${text(asset.eyebrow.toUpperCase(), 70, 142, { size: 14, color: ink, weight: 800, max: 42, letterSpacing: 4 })}
      ${text(asset.title, 70, 202, { size: 44, weight: 800, max: 38, lineHeight: 50 })}
      ${text(asset.body, 70, 266, { size: 19, color: "#475569", weight: 500, max: 82, lineHeight: 28 })}
      <g filter="url(#shadow)">
        ${renderMain(asset, ink, soft)}
      </g>
    </svg>
  `;
}

fs.mkdirSync(outputDir, { recursive: true });

for (const asset of assets) {
  const pngPath = path.join(outputDir, asset.file);
  await sharp(Buffer.from(svg(asset))).png().toFile(pngPath);
  console.log(asset.file);
}
