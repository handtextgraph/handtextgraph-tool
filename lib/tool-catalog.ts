export type ToolCategory = "Handwriting" | "Printable paper" | "Practice and classroom" | "Personal and creative";

export type PublicToolCatalogItem = {
  name: string;
  description: string;
  href: string;
  category: ToolCategory;
};

export const toolCategoryIntros: Record<ToolCategory, string> = {
  Handwriting: "Shape typed words into readable, printable pages.",
  "Printable paper": "Generate physically accurate paper for writing, plotting, music, drawing, and technical work.",
  "Practice and classroom": "Use your own words to create activities that match the lesson.",
  "Personal and creative": "Simple workspaces for useful one-off designs.",
};

export const publicToolCatalog = [
  { name: "Text to handwriting", description: "The complete studio for paper, ink, spacing, and multi-page export.", href: "/#tool", category: "Handwriting" },
  { name: "Lined paper handwriting", description: "Start with notebook lines, a clear margin, and writing-friendly spacing.", href: "/tools/lined-paper-handwriting", category: "Handwriting" },
  { name: "Graph paper handwriting", description: "Place structured notes and labels over a clean printable grid.", href: "/tools/graph-paper-handwriting", category: "Handwriting" },
  { name: "Handwritten notes", description: "Prepare class notes, revision pages, and personal notes with an optional header.", href: "/tools/handwritten-notes", category: "Handwriting" },
  { name: "PDF to handwriting", description: "Extract selectable text from a PDF, review it, and build new handwritten pages.", href: "/tools/text-to-handwriting-pdf", category: "Handwriting" },
  { name: "Word to handwriting", description: "Extract editable DOCX text locally and turn it into handwritten PDF or image pages.", href: "/tools/word-to-handwriting", category: "Handwriting" },
  { name: "Cursive text", description: "Create short cursive designs and save them as an image or PDF.", href: "/cursive-text-generator", category: "Handwriting" },
  { name: "Square graph paper", description: "Build exact metric or quarter-inch square grids.", href: "/tools/graph-paper-generator", category: "Printable paper" },
  { name: "Lined paper", description: "Create college, wide, or custom ruled writing paper.", href: "/tools/lined-paper-generator", category: "Printable paper" },
  { name: "Dot grid paper", description: "Generate subtle dot lattices for journals and layouts.", href: "/tools/dot-grid-paper-generator", category: "Printable paper" },
  { name: "Isometric paper", description: "Sketch on accurate vertical and 30-degree axes.", href: "/tools/isometric-paper-generator", category: "Printable paper" },
  { name: "Hexagonal paper", description: "Create regular hexagon cells for maps, games, and chemistry.", href: "/tools/hexagonal-paper-generator", category: "Printable paper" },
  { name: "Triangle grid", description: "Generate equilateral triangular lattices for geometry and design.", href: "/tools/triangle-grid-generator", category: "Printable paper" },
  { name: "Coordinate plane", description: "Print centered Cartesian axes, intervals, and labels.", href: "/tools/coordinate-plane-generator", category: "Printable paper" },
  { name: "Polar graph paper", description: "Create concentric circles and exact angular rays.", href: "/tools/polar-graph-paper-generator", category: "Printable paper" },
  { name: "Semi-log paper", description: "Use one logarithmic axis with correct decade subdivisions.", href: "/tools/semi-log-paper-generator", category: "Printable paper" },
  { name: "Log-log paper", description: "Plot wide-ranging data on two logarithmic axes.", href: "/tools/log-log-paper-generator", category: "Printable paper" },
  { name: "Perspective grid", description: "Build one-point and two-point drawing guides.", href: "/tools/perspective-grid-generator", category: "Printable paper" },
  { name: "Engineering paper", description: "Generate hierarchical minor, major, and bold grid blocks.", href: "/tools/engineering-paper-generator", category: "Printable paper" },
  { name: "Cornell notes", description: "Create real cue, notes, header, and summary regions.", href: "/tools/cornell-notes-generator", category: "Printable paper" },
  { name: "Handwriting practice paper", description: "Make three-line practice rows with dashed midlines.", href: "/tools/handwriting-practice-paper", category: "Printable paper" },
  { name: "Seyes ruled paper", description: "Generate French ruling with fine subdivisions and margin line.", href: "/tools/seyes-ruled-paper-generator", category: "Printable paper" },
  { name: "Chinese character paper", description: "Create field or rice-grid square character cells.", href: "/tools/chinese-character-practice-paper-generator", category: "Printable paper" },
  { name: "Music staff paper", description: "Print evenly spaced five-line staves and bar divisions.", href: "/tools/music-staff-paper", category: "Printable paper" },
  { name: "Handwriting worksheets", description: "Make tracing and copy-writing sheets for letters, names, words, or sentences.", href: "/tools/handwriting-worksheet-generator", category: "Practice and classroom" },
  { name: "Word search", description: "Generate a vocabulary puzzle and a clear highlighted answer key.", href: "/word-search-maker", category: "Practice and classroom" },
  { name: "Word scramble", description: "Turn a spelling list into a quick printable challenge with answers.", href: "/word-scramble-generator", category: "Practice and classroom" },
  { name: "Sentence scramble", description: "Create sentence-order activities for reading and writing practice.", href: "/sentence-scramble-generator", category: "Practice and classroom" },
  { name: "Assignment maker", description: "Arrange instructions and questions on a tidy A4 or Letter page.", href: "/assignment-maker", category: "Practice and classroom" },
  { name: "Number grid generator", description: "Create custom number sequences, cell sizes, and blank-cell activities.", href: "/number-grid-generator", category: "Practice and classroom" },
  { name: "Printable number charts", description: "Print 100, 120, multiplication, or empty charts on A4 and Letter.", href: "/printable-number-charts", category: "Practice and classroom" },
  { name: "Sudoku generator", description: "Make seeded, unique-solution Sudoku puzzles with answer keys.", href: "/sudoku-generator", category: "Practice and classroom" },
  { name: "Blank table generator", description: "Design tables with custom dimensions, headers, borders, and paper settings.", href: "/blank-table-generator", category: "Practice and classroom" },
  { name: "Signature generator", description: "Type or draw a signature and export a transparent high-resolution image.", href: "/signature-generator", category: "Personal and creative" },
  { name: "Invitation maker", description: "Build a printable invitation for a birthday, wedding, or gathering.", href: "/invitation-maker", category: "Personal and creative" },
  { name: "Virtual graph paper", description: "Sketch with snapping pencils, shapes, arrows, labels, and local autosave.", href: "/virtual-graph-paper", category: "Personal and creative" },
  { name: "Pixel art generator", description: "Draw, fill, undo, zoom, and export crisp grid-based artwork.", href: "/pixel-art-generator", category: "Personal and creative" },
  { name: "Block poster maker", description: "Tile an image across overlapped printable pages for assembly.", href: "/block-poster-maker", category: "Personal and creative" },
  { name: "Multi-page image poster", description: "Crop and fit an image into a safe multipage poster PDF.", href: "/multi-page-image-poster-generator", category: "Personal and creative" },
  { name: "Printable paper", description: "Customize lined, graph, dot-grid, and practice paper for print.", href: "/templates", category: "Personal and creative" },
] as const satisfies readonly PublicToolCatalogItem[];

export const toolCategories = ["Handwriting", "Printable paper", "Practice and classroom", "Personal and creative"] as const satisfies readonly ToolCategory[];

export function toolsInCategory(category: ToolCategory) {
  return publicToolCatalog.filter((tool) => tool.category === category);
}
