import { serializePaperSvg } from "./paper-svg.ts";
import type { PaperPageModel } from "./paper-engine.ts";

export function downloadPaperGeneratorSvg(model: PaperPageModel, filename: string) {
  const blob = new Blob([serializePaperSvg(model)], { type: "image/svg+xml;charset=utf-8" }), url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.svg`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}
