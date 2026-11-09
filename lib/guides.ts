/**
 * Guides registry — the single source of truth for the /guides/ blog section.
 *
 * Adding a new guide takes two steps:
 *   1. Add one content file under lib/guides/content/<slug>.tsx that exports
 *      a `GuideBody` component and a `faqs` array, and register it in
 *      lib/guides/content/index.ts.
 *   2. Add one entry to `guides` below and flip `published` to true.
 *
 * Drafts (`published: false`) are never listed on the index page, never get
 * a static route, and never appear in the sitemap — only published guides do.
 */

export type Guide = {
  slug: string;
  title: string;
  description: string;
  /** Step 6 target keyword for this guide. No volumes are attached anywhere. */
  targetKeyword: string;
  /** The tool page this guide teaches readers to use. */
  toolHref: string;
  toolLabel: string;
  image: string;
  imageAlt: string;
  /** Tools linked from the guide's "Related tools" block (besides its own tool). */
  relatedTools: readonly { href: string; label: string }[];
  published: boolean;
  /** ISO date (YYYY-MM-DD) once published; null while a draft. */
  datePublished: string | null;
  readMinutes: number;
};

export const guides: readonly Guide[] = [
  {
    slug: "text-to-handwriting",
    title: "How to Convert Text to Handwriting",
    description:
      "Turn typed text into realistic handwritten pages with the free text to handwriting converter — pick a style and ink, set up the page, then export a PDF, PNG, or JPG.",
    targetKeyword: "how to text to handwriting",
    toolHref: "/",
    toolLabel: "Text to Handwriting Converter",
    image: "/guides/text-to-handwriting.svg",
    imageAlt: "A lined paper page with handwritten-style lines and a coral pen",
    relatedTools: [
      { href: "/tools/text-to-handwriting-pdf", label: "Text to Handwriting PDF" },
      { href: "/cursive-text-generator", label: "Cursive Text Generator" },
      { href: "/tools/handwriting-worksheet-generator", label: "Handwriting Worksheet Generator" },
      { href: "/tools/lined-paper-generator", label: "Lined Paper Generator" },
    ],
    published: true,
    datePublished: "2026-11-10",
    readMinutes: 6,
  },
  {
    slug: "signature-generator",
    title: "How to Make a Signature with a Signature Generator",
    description:
      "Design a signature you can actually use — choose a style, adjust the slant and flow, and download it as a transparent PNG.",
    targetKeyword: "how to signature generator",
    toolHref: "/signature-generator",
    toolLabel: "Signature Generator",
    image: "/guides/signature-generator.svg",
    imageAlt: "A signature drawn in flowing handwriting on a blank page",
    relatedTools: [],
    published: false,
    datePublished: null,
    readMinutes: 5,
  },
  {
    slug: "word-search-maker",
    title: "How to Make a Word Search with a Word Search Maker",
    description:
      "Build a printable word search puzzle from your own word list — set the grid size and difficulty, then print or share it.",
    targetKeyword: "how to word search maker",
    toolHref: "/word-search-maker",
    toolLabel: "Word Search Maker",
    image: "/guides/word-search-maker.svg",
    imageAlt: "A word search grid with circled words",
    relatedTools: [],
    published: false,
    datePublished: null,
    readMinutes: 5,
  },
  {
    slug: "invitation-maker",
    title: "How to Make an Invitation with an Invitation Maker",
    description:
      "Create a printable invitation for a birthday, wedding, or party — write the wording, pick a layout, and download it ready to print.",
    targetKeyword: "how to invitation maker",
    toolHref: "/invitation-maker",
    toolLabel: "Invitation Maker",
    image: "/guides/invitation-maker.svg",
    imageAlt: "A decorated invitation card with handwritten-style wording",
    relatedTools: [],
    published: false,
    datePublished: null,
    readMinutes: 5,
  },
  {
    slug: "assignment-maker",
    title: "How to Make an Assignment with an Assignment Maker",
    description:
      "Turn typed assignment text into neat handwritten pages — set the paper and ink, preview every page, and export a PDF to print.",
    targetKeyword: "how to assignment maker",
    toolHref: "/assignment-maker",
    toolLabel: "Assignment Maker",
    image: "/guides/assignment-maker.svg",
    imageAlt: "An assignment page written in neat handwriting",
    relatedTools: [],
    published: false,
    datePublished: null,
    readMinutes: 6,
  },
  {
    slug: "sudoku",
    title: "How to Make Sudoku Puzzles with a Sudoku Generator",
    description:
      "Generate printable Sudoku puzzles at the difficulty you want — one puzzle or a whole set, ready to print and solve.",
    targetKeyword: "how to sudoku generator",
    toolHref: "/sudoku-generator",
    toolLabel: "Sudoku Generator",
    image: "/guides/sudoku.svg",
    imageAlt: "A Sudoku grid with numbers filled in",
    relatedTools: [],
    published: false,
    datePublished: null,
    readMinutes: 5,
  },
  {
    slug: "handwriting-practice",
    title: "How to Make Handwriting Practice Paper",
    description:
      "Print handwriting practice paper with the right row height and guide lines — from wide primary rows to standard ruled practice sheets.",
    targetKeyword: "how to handwriting practice paper",
    toolHref: "/tools/handwriting-practice-paper",
    toolLabel: "Handwriting Practice Paper Generator",
    image: "/guides/handwriting-practice.svg",
    imageAlt: "Handwriting practice paper with three-line rows and a dashed midline",
    relatedTools: [],
    published: false,
    datePublished: null,
    readMinutes: 5,
  },
  {
    slug: "cornell-notes",
    title: "How to Make a Cornell Notes Template",
    description:
      "Set up a printable Cornell notes template with a cue column, notes area, and summary box — and use it for lectures and revision.",
    targetKeyword: "how to cornell notes template",
    toolHref: "/tools/cornell-notes-generator",
    toolLabel: "Cornell Notes Generator",
    image: "/guides/cornell-notes.svg",
    imageAlt: "A Cornell notes page with cue column, notes area, and summary box",
    relatedTools: [],
    published: false,
    datePublished: null,
    readMinutes: 5,
  },
  {
    slug: "graph-paper",
    title: "How to Print Graph Paper",
    description:
      "Print graph paper in the grid size you need — choose the spacing, page size, and layout, then download a print-ready PDF.",
    targetKeyword: "how to printable graph paper",
    toolHref: "/tools/graph-paper-generator",
    toolLabel: "Graph Paper Generator",
    image: "/guides/graph-paper.svg",
    imageAlt: "A sheet of graph paper with a square grid",
    relatedTools: [],
    published: false,
    datePublished: null,
    readMinutes: 4,
  },
  {
    slug: "lined-paper",
    title: "How to Print Lined Paper",
    description:
      "Print lined paper with college, wide, or extra-wide ruling — pick the spacing that suits the writing and print it at actual size.",
    targetKeyword: "how to printable lined paper",
    toolHref: "/tools/lined-paper-generator",
    toolLabel: "Lined Paper Generator",
    image: "/guides/lined-paper.svg",
    imageAlt: "A sheet of lined paper with evenly spaced rules",
    relatedTools: [],
    published: false,
    datePublished: null,
    readMinutes: 4,
  },
  {
    slug: "handwriting-to-text-reverse",
    title: "How to Convert Handwriting to Text",
    description:
      "Turn handwritten pages back into editable text — what the reverse direction can and cannot do, and the honest limits to expect.",
    targetKeyword: "how to convert text to handwriting",
    toolHref: "/handwriting-to-text",
    toolLabel: "Handwriting to Text",
    image: "/guides/handwriting-to-text-reverse.svg",
    imageAlt: "A handwritten page beside its typed-text version",
    relatedTools: [],
    published: false,
    datePublished: null,
    readMinutes: 5,
  },
  {
    slug: "semi-log-log-log-paper",
    title: "How to Print Semi-Log and Log-Log Graph Paper",
    description:
      "Print semi-log and log-log graph paper for charts that span wide ranges — choose the scale, spacing, and page size.",
    targetKeyword: "how to semi log graph paper",
    toolHref: "/tools/semi-log-paper-generator",
    toolLabel: "Semi-Log Paper Generator",
    image: "/guides/semi-log-log-log-paper.svg",
    imageAlt: "A sheet of semi-log graph paper with a logarithmic scale",
    relatedTools: [],
    published: false,
    datePublished: null,
    readMinutes: 5,
  },
  {
    slug: "isometric-paper",
    title: "How to Print Isometric Graph Paper",
    description:
      "Print isometric graph paper for 3D sketches and technical drawing — set the triangle spacing and download a clean PDF.",
    targetKeyword: "how to isometric graph paper",
    toolHref: "/tools/isometric-paper-generator",
    toolLabel: "Isometric Paper Generator",
    image: "/guides/isometric-paper.svg",
    imageAlt: "A sheet of isometric graph paper with a triangle grid",
    relatedTools: [],
    published: false,
    datePublished: null,
    readMinutes: 4,
  },
  {
    slug: "handwritten-notes",
    title: "How to Make Handwritten Notes",
    description:
      "Make clean handwritten notes from typed text — choose a readable style, keep the layout simple, and export pages you can print or keep.",
    targetKeyword: "how to handwritten notes",
    toolHref: "/tools/handwritten-notes",
    toolLabel: "Handwritten Notes",
    image: "/guides/handwritten-notes.svg",
    imageAlt: "Handwritten study notes on lined paper",
    relatedTools: [],
    published: false,
    datePublished: null,
    readMinutes: 5,
  },
  {
    slug: "engineering-paper",
    title: "How to Print Engineering Paper",
    description:
      "Print engineering paper with the right grid for calculations and sketches — pick the spacing and page size, then print at actual size.",
    targetKeyword: "how to engineering paper",
    toolHref: "/tools/engineering-paper-generator",
    toolLabel: "Engineering Paper Generator",
    image: "/guides/engineering-paper.svg",
    imageAlt: "A sheet of engineering paper with a fine grid",
    relatedTools: [],
    published: false,
    datePublished: null,
    readMinutes: 4,
  },
];

export function getPublishedGuides(): Guide[] {
  return guides.filter((guide) => guide.published);
}

export function getGuide(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}

export function getPublishedGuide(slug: string): Guide | undefined {
  const guide = getGuide(slug);
  return guide?.published ? guide : undefined;
}
