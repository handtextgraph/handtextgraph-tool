import { serializePaperSvg } from "./paper-svg.ts";
import { buildPrintablePageModel, getPrintableFilename, normalizePrintableConfig, type PrintableTemplateConfig } from "./printable-templates.ts";

export function createPrintableSvg(configInput: PrintableTemplateConfig) {
  return serializePaperSvg(buildPrintablePageModel(normalizePrintableConfig(configInput)));
}

export function downloadPrintableSvg(config: PrintableTemplateConfig) {
  const blob = new Blob([createPrintableSvg(config)], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    const link = document.createElement("a");
    link.href = url;
    link.download = getPrintableFilename(config, "svg");
    link.click();
  } finally {
    URL.revokeObjectURL(url);
  }
}
