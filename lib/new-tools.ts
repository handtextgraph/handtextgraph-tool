export const newTools = [
  { slug: "cursive-text-generator", name: "Cursive Text Generator", category: "Handwriting Tools", description: "Create, style, and export cursive text as PNG, JPG, or PDF." },
  { slug: "signature-generator", name: "Signature Generator", category: "Handwriting Tools", description: "Type or draw a high-resolution signature and export it privately." },
  { slug: "sentence-scramble-generator", name: "Sentence Scramble Generator", category: "Educational Tools", description: "Make randomized sentence-order worksheets with answer keys." },
  { slug: "word-search-maker", name: "Free Word Search Maker", category: "Educational Tools", description: "Generate validated word-search puzzles and highlighted answer keys." },
  { slug: "word-scramble-generator", name: "Word Scramble Generator", category: "Educational Tools", description: "Create letter-scramble worksheets with hints and answers." },
  { slug: "assignment-maker", name: "Assignment Maker", category: "Educational Tools", description: "Build formatted assignments with live A4 or Letter previews." },
  { slug: "invitation-maker", name: "Invitation Maker", category: "Creative Tools", description: "Design printable invitations for birthdays, weddings, and more." },
  { slug: "number-grid-generator", name: "Number Grid Generator", category: "Educational Tools", description: "Build custom sequential number grids with optional blanks and print-ready exports." },
  { slug: "printable-number-charts", name: "Printable Number Charts", category: "Educational Tools", description: "Create 1–100, 1–120, multiplication, and empty number charts for A4 or Letter paper." },
  { slug: "sudoku-generator", name: "Sudoku Generator", category: "Educational Tools", description: "Generate seeded easy, medium, or hard Sudoku puzzles with unique solutions and answer keys." },
  { slug: "blank-table-generator", name: "Blank Table Generator", category: "Educational Tools", description: "Design printable blank tables with custom cells, headers, colors, and page settings." },
  { slug: "virtual-graph-paper", name: "Virtual Graph Paper", category: "Creative Tools", description: "Draw on a snapping graph-paper canvas with shapes, labels, undo, autosave, and SVG or PNG export." },
  { slug: "pixel-art-generator", name: "Pixel Art Generator", category: "Creative Tools", description: "Create pixel art with pencil, eraser, flood fill, palettes, autosave, and lossless exports." },
  { slug: "block-poster-maker", name: "Block Poster Maker", category: "Creative Tools", description: "Turn an image into an accurately overlapped tiled poster for home printing and assembly." },
  { slug: "multi-page-image-poster-generator", name: "Multi-page Image Poster Generator", category: "Creative Tools", description: "Crop, fit, and tile a large image across multiple A4 or Letter PDF pages." },
] as const;

export type NewToolSlug = (typeof newTools)[number]["slug"];

export function newTool(slug: NewToolSlug) {
  return newTools.find((tool) => tool.slug === slug)!;
}
