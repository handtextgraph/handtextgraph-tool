export type ExportCanvasOptions = { title?: string; background?: string; transparent?: boolean };

export function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export async function downloadCanvas(canvas: HTMLCanvasElement, filename: string, kind: "png" | "jpg" | "pdf") {
  if (kind === "pdf") {
    const { jsPDF } = await import("jspdf");
    const orientation = canvas.width > canvas.height ? "landscape" : "portrait";
    const pdf = new jsPDF({ orientation, unit: "px", format: [canvas.width, canvas.height], hotfixes: ["px_scaling"] });
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, canvas.width, canvas.height, undefined, "FAST");
    pdf.save(`${filename}.pdf`);
    return;
  }
  downloadDataUrl(canvas.toDataURL(kind === "jpg" ? "image/jpeg" : "image/png", 0.95), `${filename}.${kind}`);
}

export function wrapCanvasText(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  let cursor = y;
  for (const paragraph of text.split("\n")) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    let line = "";
    if (!words.length) cursor += lineHeight;
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (context.measureText(candidate).width > maxWidth && line) {
        context.fillText(line, x, cursor);
        cursor += lineHeight;
        line = word;
      } else line = candidate;
    }
    if (line) { context.fillText(line, x, cursor); cursor += lineHeight; }
  }
  return cursor;
}
