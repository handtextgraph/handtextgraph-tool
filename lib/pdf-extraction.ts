export const maxPdfSize = 15 * 1024 * 1024;
export const maxPdfPageCount = 500;
export const maxPdfSelectedPages = 200;
export const maxPdfTextCharacters = 500_000;

export type PdfExtractionProgress = { currentPage: number; totalPages: number; pageNumber: number };
export type PdfExtractionErrorCode = "password" | "empty" | "parse" | "cancelled" | "invalid_range" | "page_limit" | "text_limit" | "too_large" | "invalid_type";

export class PdfExtractionError extends Error {
  readonly code: PdfExtractionErrorCode;

  constructor(code: PdfExtractionErrorCode) {
    super(code);
    this.name = "PdfExtractionError";
    this.code = code;
  }
}

type PdfTextItem = { str: string; hasEOL?: boolean; transform: number[] };
type PdfLoadingTask = ReturnType<typeof import("pdfjs-dist")["getDocument"]>;
type PdfDocument = Awaited<PdfLoadingTask["promise"]>;

export type PdfExtractionSession = {
  readonly pageCount: number;
  extract(pageNumbers: number[], onProgress?: (progress: PdfExtractionProgress) => void, signal?: AbortSignal): Promise<string>;
  destroy(): Promise<void>;
};

export function validatePdfFile(file: Pick<File, "name" | "type" | "size">) {
  const hasPdfExtension = file.name.toLowerCase().endsWith(".pdf");
  if (!hasPdfExtension || (file.type !== "" && file.type !== "application/pdf")) throw new PdfExtractionError("invalid_type");
  if (file.size > maxPdfSize) throw new PdfExtractionError("too_large");
}

export function parsePdfPageSelection(input: string, totalPages: number) {
  const normalized = input.trim().toLowerCase();
  if (!normalized || normalized === "all") {
    if (totalPages > maxPdfSelectedPages) throw new PdfExtractionError("page_limit");
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }
  const selected = new Set<number>();
  for (const segment of normalized.split(",")) {
    const value = segment.trim();
    const rangeMatch = /^(\d+)\s*-\s*(\d+)$/.exec(value);
    if (rangeMatch) {
      const start = Number(rangeMatch[1]);
      const end = Number(rangeMatch[2]);
      if (start < 1 || end < start || end > totalPages) throw new PdfExtractionError("invalid_range");
      for (let page = start; page <= end; page += 1) selected.add(page);
    } else {
      if (!/^\d+$/.test(value)) throw new PdfExtractionError("invalid_range");
      const page = Number(value);
      if (page < 1 || page > totalPages) throw new PdfExtractionError("invalid_range");
      selected.add(page);
    }
  }
  const pages = [...selected].sort((a, b) => a - b);
  if (!pages.length) throw new PdfExtractionError("invalid_range");
  if (pages.length > maxPdfSelectedPages) throw new PdfExtractionError("page_limit");
  return pages;
}

function isPdfTextItem(item: unknown): item is PdfTextItem {
  if (!item || typeof item !== "object") return false;
  const candidate = item as Partial<PdfTextItem>;
  return typeof candidate.str === "string" && Array.isArray(candidate.transform);
}

function extractReadablePageText(items: unknown[]) {
  const lines: string[] = [];
  let lineParts: string[] = [];
  let lineY: number | null = null;
  const flushLine = () => {
    const line = lineParts.join(" ").replace(/[\t ]+/g, " ").trim();
    if (line) lines.push(line);
    lineParts = [];
  };
  for (const item of items) {
    if (!isPdfTextItem(item) || !item.str.trim()) continue;
    const itemY = item.transform[5];
    if (lineY !== null && Number.isFinite(itemY) && Math.abs(itemY - lineY) > 2) flushLine();
    lineY = Number.isFinite(itemY) ? itemY : lineY;
    lineParts.push(item.str.trim());
    if (item.hasEOL) { flushLine(); lineY = null; }
  }
  flushLine();
  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function throwMappedPdfError(error: unknown): never {
  if (error instanceof PdfExtractionError) throw error;
  if (error instanceof DOMException && error.name === "AbortError") throw new PdfExtractionError("cancelled");
  const name = error instanceof Error ? error.name : "";
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  if (name === "PasswordException" || message.includes("password")) throw new PdfExtractionError("password");
  if (name === "AbortException" || message.includes("destroyed")) throw new PdfExtractionError("cancelled");
  throw new PdfExtractionError("parse");
}

export async function openPdfExtractionSession(file: File, signal?: AbortSignal): Promise<PdfExtractionSession> {
  validatePdfFile(file);
  const pdfjs = typeof window === "undefined"
    ? await import("pdfjs-dist/legacy/build/pdf.mjs")
    : await import("pdfjs-dist");
  if (typeof window !== "undefined") {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
  }
  if (signal?.aborted) throw new PdfExtractionError("cancelled");
  const data = new Uint8Array(await file.arrayBuffer());
  if (signal?.aborted) throw new PdfExtractionError("cancelled");
  const loadingTask = pdfjs.getDocument({ data });
  const cancelLoading = () => { void loadingTask.destroy(); };
  signal?.addEventListener("abort", cancelLoading, { once: true });
  let pdfDocument: PdfDocument;
  try {
    pdfDocument = await loadingTask.promise;
  } catch (error) {
    throwMappedPdfError(error);
  } finally {
    signal?.removeEventListener("abort", cancelLoading);
  }
  if (pdfDocument.numPages > maxPdfPageCount) {
    await loadingTask.destroy();
    throw new PdfExtractionError("page_limit");
  }
  let destroyed = false;
  return {
    pageCount: pdfDocument.numPages,
    async extract(pageNumbers, onProgress, extractionSignal) {
      if (destroyed || extractionSignal?.aborted) throw new PdfExtractionError("cancelled");
      if (pageNumbers.length > maxPdfSelectedPages) throw new PdfExtractionError("page_limit");
      if (!pageNumbers.length || pageNumbers.some((page) => page < 1 || page > pdfDocument.numPages)) throw new PdfExtractionError("invalid_range");
      const pages: string[] = [];
      let characterCount = 0;
      try {
        for (let index = 0; index < pageNumbers.length; index += 1) {
          if (extractionSignal?.aborted || destroyed) throw new PdfExtractionError("cancelled");
          const pageNumber = pageNumbers[index];
          onProgress?.({ currentPage: index + 1, totalPages: pageNumbers.length, pageNumber });
          const page = await pdfDocument.getPage(pageNumber);
          try {
            const content = await page.getTextContent();
            const pageText = extractReadablePageText(content.items);
            characterCount += pageText.length;
            if (characterCount > maxPdfTextCharacters) throw new PdfExtractionError("text_limit");
            pages.push(pageText);
          } finally { page.cleanup(); }
        }
        const text = pages.filter(Boolean).join("\n\n").replace(/\n{3,}/g, "\n\n").trim();
        if (text.replace(/\s/g, "").length < 3) throw new PdfExtractionError("empty");
        return text;
      } catch (error) { throwMappedPdfError(error); }
    },
    async destroy() {
      if (destroyed) return;
      destroyed = true;
      await loadingTask.destroy();
    },
  };
}

export async function extractTextFromPdf(file: File, onProgress?: (progress: PdfExtractionProgress) => void) {
  const session = await openPdfExtractionSession(file);
  try { return await session.extract(parsePdfPageSelection("all", session.pageCount), onProgress); }
  finally { await session.destroy(); }
}
