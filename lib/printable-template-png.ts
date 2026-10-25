import { buildPrintablePageModel, getPrintableFilename, getPrintablePngDimensions, normalizePrintableConfig, type PrintableTemplateConfig } from "./printable-templates.ts";

export function createPrintablePngCanvas(configInput: PrintableTemplateConfig, dpi = 150) {
  const config = normalizePrintableConfig(configInput);
  const model = buildPrintablePageModel(config);
  const dimensions = getPrintablePngDimensions(config, dpi);
  const canvas = document.createElement("canvas");
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is unavailable.");
  const scale = dimensions.width / model.widthMm;
  context.fillStyle = model.background;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.lineCap = "round";
  for (const primitive of model.primitives) {
    if (primitive.kind === "line") {
      context.strokeStyle = primitive.color;
      context.lineWidth = Math.max(1, primitive.width * scale);
      context.setLineDash((primitive.dash ?? []).map((value) => value * scale));
      context.beginPath();
      context.moveTo(primitive.x1 * scale, primitive.y1 * scale);
      context.lineTo(primitive.x2 * scale, primitive.y2 * scale);
      context.stroke();
    } else if (primitive.kind === "circle") {
      context.fillStyle = primitive.color;
      context.beginPath();
      context.arc(primitive.x * scale, primitive.y * scale, Math.max(1, primitive.radius * scale), 0, Math.PI * 2);
      context.fill();
    } else {
      context.save();
      context.globalAlpha = primitive.opacity ?? 1;
      context.fillStyle = primitive.color;
      context.font = `${primitive.weight === "bold" ? "700" : "400"} ${primitive.size * scale}px Arial, sans-serif`;
      context.fillText(primitive.text, primitive.x * scale, primitive.y * scale, Math.max(10, (model.widthMm - primitive.x - 8) * scale));
      context.restore();
    }
  }
  return canvas;
}

export async function downloadPrintablePng(config: PrintableTemplateConfig, dpi = 150) {
  const canvas = createPrintablePngCanvas(config, dpi);
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error("PNG encoding failed.")), "image/png"));
  const url = URL.createObjectURL(blob);
  try {
    const link = document.createElement("a");
    link.href = url;
    link.download = getPrintableFilename(config, "png");
    link.click();
  } finally {
    URL.revokeObjectURL(url);
    canvas.width = 1;
    canvas.height = 1;
  }
}
