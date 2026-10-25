/**
 * Custom font upload for the handwriting converter.
 *
 * Fonts are loaded with the FontFace API and registered in the renderer's
 * session-only custom style registry (see lib/handwriting.ts). Because the
 * preview and every export (PNG, JPG, PDF) are rasterized from the same
 * canvas pages, an uploaded font automatically appears in exports — there is
 * no separate font-embedding step.
 *
 * Availability is intentionally session-only: uploaded fonts live in
 * `document.fonts` for the current tab and are gone after a refresh.
 */

import {
  getCustomHandwritingStyles,
  registerCustomHandwritingStyle,
  unregisterCustomHandwritingStyle,
  type HandwritingStyle,
} from "./handwriting.ts";

export const CUSTOM_FONT_MAX_BYTES = 5 * 1024 * 1024;
export const CUSTOM_FONT_MAX_LABEL = "5 MB";

export interface CustomFontUploadResult {
  style: HandwritingStyle | null;
  error: string | null;
}

function fail(error: string): CustomFontUploadResult {
  return { style: null, error };
}

function sanitizeFamilyName(fileName: string): string {
  const withoutExtension = fileName.replace(/\.(ttf|otf)$/i, "");
  const cleaned = withoutExtension
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned || "Custom Font";
}

function truncate(value: string, maxLength: number): string {
  return value.length > maxLength ? `${value.slice(0, maxLength - 1).trimEnd()}…` : value;
}

function familyNameTaken(family: string): boolean {
  const needle = `"${family.toLowerCase()}"`;
  return getCustomHandwritingStyles().some((style) =>
    style.primary.toLowerCase().includes(needle),
  );
}

function uniqueFamilyName(base: string): string {
  let candidate = base;
  let counter = 2;
  while (familyNameTaken(candidate)) {
    candidate = `${base} ${counter}`;
    counter += 1;
  }
  return candidate;
}

function styleIdTaken(id: string): boolean {
  return getCustomHandwritingStyles().some((style) => style.id === id);
}

function uniqueStyleId(family: string): string {
  const slug =
    family
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "font";
  let candidate = `custom-font-${slug}`;
  let counter = 2;
  while (styleIdTaken(candidate)) {
    candidate = `custom-font-${slug}-${counter}`;
    counter += 1;
  }
  return candidate;
}

/**
 * Quick magic-byte check so a renamed non-font file (e.g. a .txt saved as
 * .ttf) gets a clear error instead of a cryptic FontFace failure.
 * Accepts TrueType (0x00010000, "true", "typ1") and OpenType ("OTTO").
 */
export function hasFontMagicBytes(buffer: ArrayBuffer): boolean {
  if (buffer.byteLength < 4) return false;
  const bytes = new Uint8Array(buffer, 0, 4);
  const signature = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]);
  if (signature === "OTTO" || signature === "true" || signature === "typ1") return true;
  return new DataView(buffer, 0, 4).getUint32(0, false) === 0x00010000;
}

/**
 * Validate and load a user-supplied .ttf/.otf file, registering it as a
 * selectable handwriting style. Returns the new style on success.
 */
export async function uploadCustomFont(file: File): Promise<CustomFontUploadResult> {
  const fileName = file.name || "";
  const lowerName = fileName.toLowerCase();
  if (!lowerName.endsWith(".ttf") && !lowerName.endsWith(".otf")) {
    return fail("Please choose a font file ending in .ttf or .otf.");
  }
  if (file.size === 0) {
    return fail("This file is empty. Choose a valid .ttf or .otf font file.");
  }
  if (file.size > CUSTOM_FONT_MAX_BYTES) {
    return fail(
      `Font files must be ${CUSTOM_FONT_MAX_LABEL} or smaller. Try a smaller font file.`,
    );
  }

  let buffer: ArrayBuffer;
  try {
    buffer = await file.arrayBuffer();
  } catch {
    return fail("We could not read this file. Try downloading it again and re-uploading.");
  }

  if (!hasFontMagicBytes(buffer)) {
    return fail(
      "This file does not look like a TTF or OTF font. It may be corrupted or renamed from another format.",
    );
  }

  const family = uniqueFamilyName(sanitizeFamilyName(fileName));

  let face: FontFace;
  try {
    face = new FontFace(family, buffer);
    await face.load();
  } catch {
    return fail(
      "This font could not be loaded. The file may be corrupted or use an unsupported format.",
    );
  }

  document.fonts.add(face);

  const style: HandwritingStyle = {
    id: uniqueStyleId(family),
    label: `${truncate(family, 22)} · Custom`,
    primary: `"${family}", "Comic Sans MS", cursive`,
    alternates: [],
    slant: 0,
    weight: 400,
    sizeJitter: 0.5,
    xJitter: 0.8,
    yJitter: 1.0,
    rotateJitter: 0.012,
    pressure: 0.92,
  };
  registerCustomHandwritingStyle(style);

  return { style, error: null };
}

/** Remove an uploaded font from the session registry. */
export function removeCustomFont(styleId: string): void {
  unregisterCustomHandwritingStyle(styleId);
}
