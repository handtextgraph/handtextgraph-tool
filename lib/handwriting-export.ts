import type { PageOrientation, PageSize } from "./handwriting";

export type ExportablePage = {
  pngUrl: string;
  width: number;
  height: number;
};

export const physicalPageDimensions: Record<PageSize, { width: number; height: number }> = {
  a3: { width: 297, height: 420 },
  a4: { width: 210, height: 297 },
  a5: { width: 148, height: 210 },
  letter: { width: 215.9, height: 279.4 },
  legal: { width: 215.9, height: 355.6 },
};

export function getPhysicalPageDimensions(pageSize: PageSize, orientation: PageOrientation = "portrait") {
  const dimensions = physicalPageDimensions[pageSize] ?? physicalPageDimensions.a4;
  return orientation === "landscape" ? { width: dimensions.height, height: dimensions.width } : dimensions;
}

export function selectExportPages<Page>(pages: Page[], currentPageIndex: number, scope: "all" | "current") {
  return scope === "all" ? pages : pages.slice(currentPageIndex, currentPageIndex + 1);
}

export function getSourceImageDimensions(image: Pick<HTMLImageElement, "naturalWidth" | "naturalHeight">) {
  if (!image.naturalWidth || !image.naturalHeight) {
    throw new Error("The source image has no readable dimensions.");
  }

  return { width: image.naturalWidth, height: image.naturalHeight };
}
