import { jsPDF } from "jspdf";
import type { PaperPageModel } from "./paper-engine.ts";

const rgb = (hex: string) => { const value = Number.parseInt(hex.slice(1), 16); return [(value >> 16) & 255, (value >> 8) & 255, value & 255] as const; };

export function createPaperGeneratorPdf(model: PaperPageModel, orientation: "portrait" | "landscape", pageCount = 1) {
  const pdf = new jsPDF({ orientation, unit: "mm", format: [model.widthMm, model.heightMm], compress: true });
  for (let page = 0; page < pageCount; page += 1) {
    if (page > 0) pdf.addPage([model.widthMm, model.heightMm], orientation);
    const background = rgb(model.background); pdf.setFillColor(...background); pdf.rect(0, 0, model.widthMm, model.heightMm, "F");
    for (const primitive of model.primitives) {
      const shade = rgb(primitive.color);
      if (primitive.kind === "line") { pdf.setDrawColor(...shade); pdf.setLineWidth(primitive.width); pdf.setLineDashPattern(primitive.dash ?? [], 0); pdf.line(primitive.x1, primitive.y1, primitive.x2, primitive.y2); }
      else if (primitive.kind === "circle") { pdf.setFillColor(...shade); pdf.circle(primitive.x, primitive.y, primitive.radius, "F"); }
      else { pdf.setTextColor(...shade); pdf.setFont("helvetica", primitive.weight ?? "normal"); pdf.setFontSize(primitive.size * 2.83465); pdf.text(primitive.text, primitive.x, primitive.y, { maxWidth: Math.max(5, model.widthMm - primitive.x - 4) }); }
    }
    pdf.setLineDashPattern([], 0);
  }
  return pdf;
}

export function downloadPaperGeneratorPdf(model: PaperPageModel, orientation: "portrait" | "landscape", filename: string, pageCount = 1) { createPaperGeneratorPdf(model, orientation, pageCount).save(`${filename}.pdf`); }
