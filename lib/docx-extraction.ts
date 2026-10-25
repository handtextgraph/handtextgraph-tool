export const maxDocxSize = 10 * 1024 * 1024;
export const maxDocxEntries = 2_000;
export const maxDocxUncompressedSize = 60 * 1024 * 1024;
export const maxDocxTextCharacters = 500_000;

export type DocxExtractionErrorCode =
  | "unsupported_doc"
  | "invalid_type"
  | "too_large"
  | "too_complex"
  | "empty"
  | "text_limit"
  | "corrupt";

export class DocxExtractionError extends Error {
  readonly code: DocxExtractionErrorCode;

  constructor(code: DocxExtractionErrorCode) {
    super(code);
    this.name = "DocxExtractionError";
    this.code = code;
  }
}

const docxMime = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const acceptedFallbackMimes = new Set(["", "application/octet-stream", "application/zip"]);

export function validateDocxFile(file: Pick<File, "name" | "type" | "size">) {
  const lowerName = file.name.toLowerCase();
  if (lowerName.endsWith(".doc") && !lowerName.endsWith(".docx")) {
    throw new DocxExtractionError("unsupported_doc");
  }
  if (!lowerName.endsWith(".docx") || (file.type !== docxMime && !acceptedFallbackMimes.has(file.type))) {
    throw new DocxExtractionError("invalid_type");
  }
  if (file.size > maxDocxSize) throw new DocxExtractionError("too_large");
}

function assertSafeZip(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  const view = new DataView(buffer);
  const minimumEocdOffset = Math.max(0, bytes.length - 65_557);
  let eocdOffset = -1;

  for (let offset = bytes.length - 22; offset >= minimumEocdOffset; offset -= 1) {
    if (view.getUint32(offset, true) === 0x06054b50) {
      eocdOffset = offset;
      break;
    }
  }
  if (eocdOffset < 0) throw new DocxExtractionError("corrupt");

  const entryCount = view.getUint16(eocdOffset + 10, true);
  const directorySize = view.getUint32(eocdOffset + 12, true);
  const directoryOffset = view.getUint32(eocdOffset + 16, true);
  if (entryCount > maxDocxEntries || entryCount === 0xffff) throw new DocxExtractionError("too_complex");
  if (directoryOffset + directorySize > bytes.length) throw new DocxExtractionError("corrupt");

  let offset = directoryOffset;
  let totalUncompressedSize = 0;
  for (let entry = 0; entry < entryCount; entry += 1) {
    if (offset + 46 > bytes.length || view.getUint32(offset, true) !== 0x02014b50) {
      throw new DocxExtractionError("corrupt");
    }
    const compressedSize = view.getUint32(offset + 20, true);
    const uncompressedSize = view.getUint32(offset + 24, true);
    if (compressedSize === 0xffffffff || uncompressedSize === 0xffffffff) {
      throw new DocxExtractionError("too_complex");
    }
    totalUncompressedSize += uncompressedSize;
    if (totalUncompressedSize > maxDocxUncompressedSize) throw new DocxExtractionError("too_complex");
    if (uncompressedSize > 1024 * 1024 && compressedSize > 0 && uncompressedSize / compressedSize > 200) {
      throw new DocxExtractionError("too_complex");
    }
    const fileNameLength = view.getUint16(offset + 28, true);
    const extraLength = view.getUint16(offset + 30, true);
    const commentLength = view.getUint16(offset + 32, true);
    offset += 46 + fileNameLength + extraLength + commentLength;
  }
}

export function normalizeExtractedDocumentText(text: string) {
  return text
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[\t ]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function extractTextFromDocx(file: File) {
  validateDocxFile(file);
  const arrayBuffer = await file.arrayBuffer();
  assertSafeZip(arrayBuffer);

  try {
    const mammoth = await import("mammoth/mammoth.browser.js");
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = normalizeExtractedDocumentText(result.value);
    if (!text) throw new DocxExtractionError("empty");
    if (text.length > maxDocxTextCharacters) throw new DocxExtractionError("text_limit");
    return text;
  } catch (error) {
    if (error instanceof DocxExtractionError) throw error;
    throw new DocxExtractionError("corrupt");
  }
}
