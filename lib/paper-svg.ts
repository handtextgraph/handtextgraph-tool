import type { PaperPageModel, PaperPrimitive } from "./paper-engine.ts";

const escapeXml = (value: string) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[character]!);
const number = (value: number) => Number(value.toFixed(4));

export function paperPrimitiveToSvg(primitive: PaperPrimitive) {
  if (primitive.kind === "line") return `<line x1="${number(primitive.x1)}" y1="${number(primitive.y1)}" x2="${number(primitive.x2)}" y2="${number(primitive.y2)}" stroke="${primitive.color}" stroke-width="${number(primitive.width)}"${primitive.dash?.length ? ` stroke-dasharray="${primitive.dash.map(number).join(" ")}"` : ""}/>`;
  if (primitive.kind === "circle") return `<circle cx="${number(primitive.x)}" cy="${number(primitive.y)}" r="${number(primitive.radius)}" fill="${primitive.color}"/>`;
  return `<text x="${number(primitive.x)}" y="${number(primitive.y)}" fill="${primitive.color}" font-family="Arial, sans-serif" font-size="${number(primitive.size)}" font-weight="${primitive.weight === "bold" ? 700 : 400}"${primitive.opacity === undefined ? "" : ` opacity="${number(primitive.opacity)}"`}>${escapeXml(primitive.text)}</text>`;
}

export function serializePaperSvg(model: PaperPageModel) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${model.widthMm}mm" height="${model.heightMm}mm" viewBox="0 0 ${model.widthMm} ${model.heightMm}"><rect width="${model.widthMm}" height="${model.heightMm}" fill="${model.background}"/>${model.primitives.map(paperPrimitiveToSvg).join("")}</svg>`;
}
