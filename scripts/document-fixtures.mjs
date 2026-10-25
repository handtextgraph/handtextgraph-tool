import JSZip from "jszip";
import { jsPDF } from "jspdf";

const escapeXml = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const paragraph = (text, options = {}) => `<w:p>${options.style ? `<w:pPr><w:pStyle w:val="${options.style}"/></w:pPr>` : ""}${options.numbered ? '<w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr></w:pPr>' : ""}<w:r><w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r></w:p>`;

export async function createDocxFixture({ long = false } = {}) {
  const zip = new JSZip();
  zip.file("[Content_Types].xml", `<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`);
  zip.file("_rels/.rels", `<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`);
  const longParagraphs = long ? Array.from({ length: 30 }, (_, index) => paragraph(`Long document paragraph ${index + 1}. ${"Handwriting pagination content ".repeat(8)}`)).join("") : "";
  const body = [
    paragraph("Project Heading", { style: "Heading1" }),
    paragraph("First paragraph."),
    paragraph("Second paragraph on a new line."),
    paragraph("First list item", { numbered: true }),
    paragraph("Second list item", { numbered: true }),
    `<w:tbl><w:tr><w:tc>${paragraph("Name")}</w:tc><w:tc>${paragraph("Value")}</w:tc></w:tr><w:tr><w:tc>${paragraph("Alpha")}</w:tc><w:tc>${paragraph("42")}</w:tc></w:tr></w:tbl>`,
    longParagraphs,
  ].join("");
  zip.file("word/document.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body}<w:sectPr/></w:body></w:document>`);
  return zip.generateAsync({ type: "uint8array", compression: "DEFLATE" });
}

export function createPdfFixture(pageTexts, options = {}) {
  const pdf = new jsPDF({ unit: "mm", format: "a4", encryption: options.password ? { userPassword: options.password, ownerPassword: options.password, userPermissions: ["print"] } : undefined });
  pageTexts.forEach((text, index) => {
    if (index) pdf.addPage();
    if (text) pdf.text(text, 20, 25);
  });
  return new Uint8Array(pdf.output("arraybuffer"));
}
