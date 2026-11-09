export const newTools = [
  { slug: "cursive-text-generator", name: "Cursive Text Generator", category: "Handwriting Tools", description: "Cursive text generator: create, style, and export cursive text as PNG, JPG, or PDF." },
  { slug: "signature-generator", name: "Signature Generator", category: "Handwriting Tools", description: "Free signature generator: type or draw a high-resolution signature and export it privately as a transparent image." },
  { slug: "sentence-scramble-generator", name: "Sentence Scramble Generator", category: "Educational Tools", description: "Sentence scramble generator: make randomized sentence-order worksheets with answer keys." },
  { slug: "word-search-maker", name: "Free Word Search Maker", category: "Educational Tools", description: "Free word search maker: generate validated word-search puzzles and highlighted answer keys." },
  { slug: "word-scramble-generator", name: "Word Scramble Generator", category: "Educational Tools", description: "Create letter-scramble worksheets with hints and answers." },
  { slug: "assignment-maker", name: "Assignment Maker", category: "Educational Tools", description: "Assignment maker: build formatted assignments with live A4 or Letter previews." },
  { slug: "invitation-maker", name: "Invitation Maker", category: "Creative Tools", description: "Free invitation maker: design printable invitations for birthdays, weddings, and more." },
  { slug: "number-grid-generator", name: "Number Grid Generator", category: "Educational Tools", description: "Build custom sequential number grids with optional blanks and print-ready exports." },
  { slug: "printable-number-charts", name: "Printable Number Charts", category: "Educational Tools", description: "Printable number chart maker: create 1–100, 1–120, multiplication, and empty number charts for A4 or Letter paper." },
  { slug: "sudoku-generator", name: "Sudoku Generator", category: "Educational Tools", description: "Sudoku generator: generate seeded easy, medium, or hard Sudoku puzzles with unique solutions and answer keys." },
  { slug: "blank-table-generator", name: "Blank Table Generator", category: "Educational Tools", description: "Blank table generator: design printable blank tables with custom cells, headers, colors, and page settings." },
  { slug: "virtual-graph-paper", name: "Virtual Graph Paper", category: "Creative Tools", description: "Draw on a snapping graph-paper canvas with shapes, labels, undo, autosave, and SVG or PNG export." },
  { slug: "pixel-art-generator", name: "Pixel Art Generator", category: "Creative Tools", description: "Pixel art generator: create pixel art with pencil, eraser, flood fill, palettes, autosave, and lossless exports." },
  { slug: "block-poster-maker", name: "Block Poster Maker", category: "Creative Tools", description: "Block poster maker: turn an image into an accurately overlapped tiled poster for home printing and assembly." },
  { slug: "multi-page-image-poster-generator", name: "Multi-page Image Poster Generator", category: "Creative Tools", description: "Crop, fit, and tile a large image across multiple A4 or Letter PDF pages." },
  { slug: "calligraphy-generator", name: "Calligraphy Generator", category: "Handwriting Tools", description: "Calligraphy generator: type text and render it in calligraphic handwriting styles — Soft Cursive and Ink Flow — then export it as PNG, JPG, or PDF." },
  { slug: "fancy-text-generator", name: "Fancy Text Generator", category: "Handwriting Tools", description: "Fancy text generator: turn plain text into styled Unicode text — bold, italic, script, fraktur, circled, and more — and copy it anywhere." },
  { slug: "handwriting-font", name: "Handwriting Font", category: "Handwriting Tools", description: "Handwriting font previewer: type text, preview it in handwriting fonts including Kalam, upload your own font, and export the preview as an image." },
  { slug: "printable-worksheets", name: "Printable Worksheets", category: "Educational Tools", description: "Printable worksheets library: tracing sheets, number practice, word puzzles, and classroom sheets — every worksheet made with the site's own generators." },
  { slug: "handwriting-to-text", name: "Handwriting to Text Converter", category: "Handwriting Tools", description: "Handwriting to text converter: pull editable text out of PDF, Word, and plain-text files in your browser, with a guide for turning handwritten notes into editable text. This site does not do handwriting OCR." },
] as const;

export type NewToolSlug = (typeof newTools)[number]["slug"];

export function newTool(slug: NewToolSlug) {
  return newTools.find((tool) => tool.slug === slug)!;
}
