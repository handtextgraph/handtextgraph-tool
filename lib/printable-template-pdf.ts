import { jsPDF } from "jspdf";
import { buildPrintablePageModel, getPrintableFilename, normalizePrintableConfig, type PrintableTemplateConfig } from "./printable-templates.ts";

function hexToRgb(hex: string) {
  const value = Number.parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255] as const;
}

export function createPrintablePdf(configInput: PrintableTemplateConfig) {
  const config = normalizePrintableConfig(configInput);
  const model = buildPrintablePageModel(config);
  const pdf = new jsPDF({
    orientation: config.orientation,
    unit: "mm",
    format: [model.widthMm, model.heightMm],
    compress: true,
  });

  for (let pageIndex = 0; pageIndex < config.pageCount; pageIndex += 1) {
    if (pageIndex > 0) pdf.addPage([model.widthMm, model.heightMm], config.orientation);
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, model.widthMm, model.heightMm, "F");
    for (const primitive of model.primitives) {
      const [red, green, blue] = hexToRgb(primitive.color);
      if (primitive.kind === "line") {
        pdf.setDrawColor(red, green, blue);
        pdf.setLineWidth(primitive.width);
        pdf.setLineDashPattern(primitive.dash ?? [], 0);
        pdf.line(primitive.x1, primitive.y1, primitive.x2, primitive.y2);
      } else if (primitive.kind === "circle") {
        pdf.setFillColor(red, green, blue);
        pdf.circle(primitive.x, primitive.y, primitive.radius, "F");
      } else {
        pdf.setTextColor(red, green, blue);
        pdf.setFont("helvetica", primitive.weight ?? "normal");
        pdf.setFontSize(primitive.size * 2.83465);
        if (primitive.opacity !== undefined && primitive.opacity < 0.5) pdf.setTextColor(170, 180, 192);
        pdf.text(primitive.text, primitive.x, primitive.y, { maxWidth: Math.max(10, model.widthMm - primitive.x - 8) });
      }
    }
    pdf.setLineDashPattern([], 0);
  }

  return pdf;
}

export function downloadPrintablePdf(config: PrintableTemplateConfig) {
  createPrintablePdf(config).save(getPrintableFilename(config, "pdf"));
}
