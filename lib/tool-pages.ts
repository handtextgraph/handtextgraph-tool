import type { ToolProfile } from "@/lib/tool-profiles";

export type FunctionalToolProfile = Exclude<ToolProfile, "default">;

/**
 * Worksheet tool: a custom interactive page (not the standard text converter),
 * so it extends the tool-page config map without joining the ToolProfile union
 * that drives the shared editor components.
 */
export type WorksheetToolProfile = "worksheet";

type ToolFaq = { question: string; answer: string };

export type ToolPageConfig = {
  profile: FunctionalToolProfile | WorksheetToolProfile;
  path: string;
  name: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  intro: string;
  sampleImage: string;
  sampleAlt: string;
  sampleCaption: string;
  benefits: string[];
  howTo: string[];
  settings: Array<{ label: string; value: string }>;
  practicalHeading: string;
  practicalText: string;
  limitations: string;
  privacy: string;
  guideHref: string;
  guideLabel: string;
  homeLinkLabel: string;
  faqs: ToolFaq[];
  deepDive?: {
    heading: string;
    paragraphs: string[];
  };
};

export const toolPageConfigs: Record<FunctionalToolProfile | WorksheetToolProfile, ToolPageConfig> = {
  word: {
    profile: "word", path: "/tools/word-to-handwriting", name: "Word to Handwriting Converter",
    title: "Word to Handwriting Converter — DOCX to PDF, PNG or JPG | HandTextGraph",
    description: "Extract editable text from a DOCX in your browser, convert it to handwriting, and export multipage PDF, PNG, or JPG files.",
    eyebrow: "Browser-local DOCX converter", h1: "Convert Word DOCX text to handwriting",
    intro: "Choose a valid DOCX file, review its extracted paragraphs in the editor, apply handwriting and paper settings, then export the resulting pages without uploading the source document to our server.",
    sampleImage: "/gallery/multi-page-pdf-output.png", sampleAlt: "Multipage handwritten document preview", sampleCaption: "The shared handwriting workspace turns extracted, editable DOCX text into consistent multipage output.",
    benefits: ["Private browser-local DOCX extraction", "Editable extracted text and paragraph breaks", "PDF, transparent PNG, PNG, and JPG exports"],
    howTo: ["Choose a .docx file of 10 MB or less.", "Wait for extraction, then review paragraph breaks and edit the text.", "Choose handwriting, paper background, page size, orientation, spacing, margins, and ink.", "Review each generated page and export the current page or all pages."],
    settings: [{ label: "Document support", value: "DOCX only; legacy .doc is clearly rejected" }, { label: "Privacy", value: "Extraction and rendering remain in the browser" }, { label: "Recommended export", value: "Use a multipage PDF for documents; PNG or JPG for individual pages" }],
    practicalHeading: "What the importer preserves", practicalText: "The workflow preserves readable text and meaningful paragraph breaks where the DOCX structure exposes them. The extracted text remains editable before rendering.",
    limitations: "This is a text extraction workflow, not a Word layout clone. It does not preserve exact fonts, columns, floating images, headers, footers, page breaks, comments, tracked changes, or legacy .doc files.",
    privacy: "The DOCX is read in your browser. It is not sent to an external document-processing service or stored by the HandTextGraph application server.", guideHref: "/tools/word-to-handwriting", guideLabel: "Use the DOCX converter", homeLinkLabel: "Main text to handwriting converter",
    faqs: [{ question: "Are .doc files supported?", answer: "No. Save a legacy .doc file as .docx first, or copy and paste its text." }, { question: "Does it preserve the original Word layout?", answer: "No. It extracts editable text and paragraph breaks; it does not recreate Word page layout." }, { question: "Is my document uploaded?", answer: "No. DOCX extraction and handwriting rendering happen locally in your browser." }],
  },
  lined: {
    profile: "lined",
    path: "/tools/lined-paper-handwriting",
    name: "Lined Paper Handwriting Generator",
    title: "Lined Paper Handwriting Generator | HandTextGraph",
    description: "Create handwriting on lined A4 or Letter paper, adjust notebook spacing and margins, preview every page, and export PDF, PNG, or JPG.",
    eyebrow: "Lined Paper Handwriting Generator",
    h1: "Create handwriting on lined paper",
    intro: "Type or paste your text into a notebook-focused editor with lined A4 paper, readable spacing, and a visible left margin selected by default.",
    sampleImage: "/blog/blog-lined-paper-output.png",
    sampleAlt: "Lined paper handwriting output with blue ink and notebook margin",
    sampleCaption: "Current lined-paper output with blue ink, ruled baselines, and a visible left margin.",
    benefits: ["Notebook-ready ruled layout", "A4 and Letter page sizes", "Current page or complete PDF export"],
    howTo: [
      "Enter your notes, letter, worksheet text, or paragraph in the editor.",
      "Choose a readable handwriting style and keep lined paper selected.",
      "Adjust font size, line spacing, word spacing, margins, variation, and ink.",
      "Review every page, then download the current page or all pages as PDF, PNG, or JPG.",
    ],
    settings: [
      { label: "Notebook notes", value: "A4, lined paper, blue ink, medium size, slightly open spacing" },
      { label: "Clean printing", value: "A4 or Letter to match the printer, black ink, medium PDF quality" },
      { label: "Room for annotations", value: "Keep the margin line and use a wider left margin" },
    ],
    practicalHeading: "Printing and export",
    practicalText: "Choose the same page size as your printer and test one page at actual size. PDF keeps multi-page layouts together; PNG is best for a sharp single page, while JPG creates a smaller image.",
    limitations: "The tool renders typed text with preset handwriting styles. It does not copy your own handwriting, understand document formatting, or guarantee perfect alignment for every style. Preview the ruled baseline before export.",
    privacy: "Handwriting text is rendered in your browser and is not sent to a HandTextGraph application server for conversion or storage. Website analytics, hosting, and security services may still process technical usage data.",
    guideHref: "/blog/text-to-handwriting-on-lined-paper",
    guideLabel: "Read the lined-paper layout guide",
    homeLinkLabel: "Free text to handwriting tool",
    faqs: [
      { question: "Can I create handwriting on lined paper for free?", answer: "Yes. Enter text, adjust the lined-paper settings, preview the pages, and export without creating an account." },
      { question: "Can I use A4 and Letter paper?", answer: "Yes. Select A4 or Letter in the page-size control before rendering and printing." },
      { question: "Which export is best for printing?", answer: "PDF is usually best for printing and multi-page output. Test one page at actual size first." },
    ],
  },
  graph: {
    profile: "graph",
    path: "/tools/graph-paper-handwriting",
    name: "Graph Paper Handwriting Generator",
    title: "Graph Paper Handwriting Generator | HandTextGraph",
    description: "Create handwritten-style text on printable graph paper for lab records and structured notes, with live preview and PDF, PNG, or JPG export.",
    eyebrow: "Graph Paper Handwriting Generator",
    h1: "Create handwritten-style pages on graph paper",
    intro: "Use a grid-focused editor with graph paper, A4 sizing, black ink, and structured spacing selected by default for lab records and text-based math or science notes.",
    sampleImage: "/blog/blog-graph-paper-preview.png",
    sampleAlt: "Graph paper handwriting output with structured black-ink notes",
    sampleCaption: "Current graph-paper preset showing readable text over a printable grid.",
    benefits: ["Structured grid-paper preset", "Spacing controls for readable labels", "PDF, PNG, and JPG export"],
    howTo: [
      "Enter plain-text observations, steps, labels, or structured notes.",
      "Keep graph paper selected or adjust the page size and handwriting style.",
      "Tune spacing and margins so the writing remains clear against the grid.",
      "Preview the complete layout and export it as PDF, PNG, or JPG.",
    ],
    settings: [
      { label: "Lab record", value: "Graph paper, black ink, medium text, low variation" },
      { label: "Structured revision", value: "Graph paper, blue or black ink, short sections" },
      { label: "Printing", value: "A4 or Letter to match the printer, medium PDF quality" },
    ],
    practicalHeading: "Math and science note use",
    practicalText: "The grid provides visual structure for labels, observations, short calculations, and lab notes. Add complex equations, charts, and diagrams separately when the page requires them.",
    limitations: "This tool does not solve equations, parse LaTeX, understand mathematical meaning, or draw diagrams. It renders the plain text you provide over a graph-paper background, so verify every symbol in the preview.",
    privacy: "The text-to-page rendering happens in your browser. HandTextGraph does not receive the note text for conversion, although normal analytics, hosting, and security telemetry may still apply to the website.",
    guideHref: "/blog/graph-paper-handwriting-generator",
    guideLabel: "Read the graph-paper workflow guide",
    homeLinkLabel: "Convert text to handwriting",
    faqs: [
      { question: "Can I make printable graph-paper handwriting pages?", answer: "Yes. Select the matching paper size, preview the grid and text, then export a PDF for printing." },
      { question: "Does the tool solve math or render LaTeX?", answer: "No. It renders plain text on a grid and does not provide mathematical intelligence or LaTeX typesetting." },
      { question: "Can I download graph-paper pages as images?", answer: "Yes. PNG and JPG are available alongside PDF export." },
    ],
    deepDive: {
      heading: "Graph Paper Deep Dive: Structured Notes, Lab Records, and Organized Study Pages",
      paragraphs: [
        "Graph paper is the right choice when alignment matters more than prose. If your pages are mostly labels, measurements, short steps, or lists, the grid keeps every line visually anchored so the page stays scannable at a glance. It is less suited to long essays — for continuous writing, lined paper reads more naturally — but for structured material it beats a blank page every time.",
        "Start with clean plain text: short lines, one idea per line, and blank lines between blocks. Open the graph-paper tool and keep the defaults — graph paper, A4, black ink — unless you have a reason to change them. Choose a readable handwriting style rather than a decorative one; on a grid, flamboyant letterforms fight the lines instead of flowing with them. Set a medium text size with low variation so characters sit evenly, and open the line spacing slightly so descenders do not collide with the row below. Preview the full page before exporting: the grid should sit quietly behind the text, not compete with it.",
        "Lab records are the classic use case. Write the date, aim, materials, and method as short headed sections, then log observations line by line — the grid keeps columns of readings roughly aligned without any table formatting. Because the tool renders plain text, describe simple results in words, for example noting that a temperature rose two degrees per minute, rather than expecting drawn charts. Export the finished set as a PDF so the page order and grid scale stay fixed for printing or filing.",
        "Math and science revision works the same way: one concept per block, formulas on their own lines, and worked steps numbered down the page. Keep symbols simple and verify every character in the preview — the tool does not understand mathematical meaning, so a misread minus sign is yours to catch. For anything beyond text, such as actual plots, geometric diagrams, or chemical structures, draw them separately and combine the pages afterwards.",
        "The grid also makes an excellent lightweight planner. Daily checklists, habit trackers, project task lists, and vocabulary sets all benefit from the implicit columns: write the item on the left and the status, date, or translation on the right. Short entries plus consistent spacing produce a printable page that looks deliberately organized rather than improvised.",
        "Before printing, match the digital page size to your printer paper — A4 or Letter — and use medium PDF quality, which balances sharpness and file size for grid pages. Print one test page first: grids reveal margin problems faster than lined paper does, and a page that looks fine on screen can feel cramped on paper. If it does, widen the margins or split the content across two pages rather than shrinking the text.",
        "If text crowds the grid, resist the urge to shrink the font. Increase line spacing first, then widen the margins, and only then consider splitting the content. Small text on a dense grid is the most common reason a graph-paper page looks messy — the fix is almost always more whitespace, not smaller letters. Black ink gives the sharpest print result, while blue works if the tone is dark enough.",
        "Two final choices shape the result more than any other. First, grid density: the default grid suits most notes, but if your handwriting runs large, open the spacing rather than fighting small squares — letters that straddle grid lines look accidental. Second, variation: a little variation keeps pages feeling human, but on graph paper high variation makes aligned lists look ragged, so keep it low for anything structured. Save these preferences mentally as your personal preset: graph paper, A4, black ink, medium size, low variation, slightly open spacing. Return to it every time, and every graph-paper page you produce will look like it came from the same careful notebook.",
      ],
    },
  },
  notes: {
    profile: "notes",
    path: "/tools/handwritten-notes",
    name: "Handwritten Notes Generator",
    title: "Handwritten Notes Generator for Study | HandTextGraph",
    description: "Turn typed class, revision, or simple notes into readable handwritten-style pages with optional note details, presets, live preview, and PDF export.",
    eyebrow: "Handwritten Notes Generator",
    h1: "Turn typed notes into handwritten-style pages",
    intro: "Prepare class notes, revision points, or simple notes with optional title, subject, and date fields, then render them with the same reliable browser-based handwriting engine.",
    sampleImage: "/blog/blog-notes-generator-preview.png",
    sampleAlt: "Handwritten revision notes on lined notebook paper",
    sampleCaption: "A readable notes preset with a simple header, lined paper, and open spacing.",
    benefits: ["Optional title, subject, and date", "Class and revision-note presets", "Multi-page study-note PDF export"],
    howTo: [
      "Clean and verify the notes before styling them.",
      "Optionally add a title, subject, and date, then apply those details to the editor.",
      "Choose Class Notes, Revision Notes, Simple Notes, or another shared preset.",
      "Preserve paragraph breaks, review each page, and export a PDF or image.",
    ],
    settings: [
      { label: "Class Notes", value: "Lined A4, blue ink, readable style, open spacing" },
      { label: "Revision Notes", value: "Lined A4, black ink, concise sections, low variation" },
      { label: "Simple Notes", value: "Blank A4, blue ink, natural spacing, no margin line" },
    ],
    practicalHeading: "Readable study-note workflow",
    practicalText: "Use short headings, key points, one example, and a recap question. PDF is the practical export for multi-page revision sets; print one test page before producing a large set.",
    limitations: "The notes workspace does not summarize, generate, fact-check, or automatically structure notes. Import a DOCX through the separate Word workflow or a selectable-text PDF through the PDF converter, then move the reviewed text into this notes workspace.",
    privacy: "The note text is rendered locally in your browser and is not stored by a HandTextGraph application server. Third-party website services may still process technical and usage information as described in the privacy policy.",
    guideHref: "/blog/handwritten-notes-generator",
    guideLabel: "Read the study-notes formatting guide",
    homeLinkLabel: "Text to handwriting converter",
    faqs: [
      { question: "Does this tool summarize notes with AI?", answer: "No. It converts the notes you write or paste; it does not summarize or generate study content." },
      { question: "Can I add a title, subject, and date?", answer: "Yes. The optional note-detail fields insert a simple plain-text header while leaving the main editor available." },
      { question: "Can I upload a Word file or PDF?", answer: "Document upload is handled by the separate Word DOCX workflow and PDF to handwriting converter. After extraction, review the text before formatting it as notes." },
    ],
    deepDive: {
      heading: "Handwritten Notes Deep Dive: From Rough Class Notes to Polished Revision Pages",
      paragraphs: [
        "The handwritten-notes workspace is built for one job: turning study material you already have into clean, readable handwritten-style pages. It does not summarize, generate, or fact-check — you bring the content, and the tool handles the presentation. Optional title, subject, and date fields add a simple plain-text header, which makes multi-page sets feel like a real notebook instead of loose exports.",
        "Start by cleaning your text: fix typos, break up long paragraphs, and decide the order of topics. Add the title, subject, and date if you want the header, then apply them to the editor. Choose the preset that matches the job — Class Notes for same-day rewrites, Revision Notes for condensed exam material, Simple Notes for minimal pages — or adjust the controls manually. Keep paragraph breaks intact so topics stay visually separated, then review every page in the preview before exporting.",
        "The highest-value habit is rewriting class notes the same day. Paste the day's rough notes, trim the filler, and render them with the Class Notes preset: lined A4, blue ink, a readable style, open spacing. Reading and restructuring the material as you clean it is genuine revision, and the finished pages are far easier to revisit than the original scrawl or a wall of typed text.",
        "For exam season, build revision sets topic by topic. Condense each topic to its essentials — short headings, key points, one worked example, and a recap question — and export each topic as its own PDF with a clear filename. Multi-page PDF export keeps a whole topic in one file, and consistent settings across topics make the full set feel coherent when you print it.",
        "The same workflow suits meeting notes, reading notes, and project logs. Capture now, clean later: dump raw points into the editor during the meeting, then tidy and render afterwards. Archived as dated PDFs, these become a personal record that is genuinely pleasant to re-read — which is the whole point of keeping notes at all.",
        "A few readability rules pay off everywhere. Keep headings short and frequent; a page of unbroken paragraphs is hard to scan no matter how nice the handwriting. Put one idea per bullet or line, leave breathing room between sections, and end dense topics with a recap question you can answer from memory later. Always print one test page before producing a large set — spacing that looks generous on screen can feel tight on paper.",
        "Recommended settings are starting points, not rules. Class Notes works well as lined A4 with blue ink and open spacing; Revision Notes benefits from black ink, concise sections, and low variation so dense pages stay legible; Simple Notes suits blank A4 with natural spacing and no margin line. Change one control at a time and re-preview — when every adjustment is deliberate, the final pages look it.",
        "Know what the workspace will not do, and you will never be disappointed by it. It will not fix your arguments, check your facts, or turn a vague paragraph into a clear one — editing remains your job, and that is exactly why the finished output is worth keeping. It will not reproduce anyone else's handwriting, forge signatures, or make a document look officially handwritten where that would mislead a reader; school and workplace rules about generated pages still apply. Used honestly — your words, your notes, your revision — it is simply the fastest way to make study material you will actually re-read.",
        "For export, match the format to the job. PDF is the default for anything multi-page: revision sets, meeting archives, and printed notebooks stay in order and print predictably. PNG suits single pages you want to drop into slides, documents, or design mockups at full sharpness. JPG is the lightweight option for quick sharing where file size matters more than crisp edges. Whatever you choose, export once from the preview — repeated re-exports soften the letterforms, especially in JPG.",
      ],
    },
  },
  pdf: {
    profile: "pdf",
    path: "/tools/text-to-handwriting-pdf",
    name: "PDF to Handwriting Converter",
    title: "PDF to Handwriting Converter Online Free | HandTextGraph",
    description: "Upload a selectable-text PDF, choose pages or ranges, edit the extracted text, and export handwritten pages as PDF, PNG, or JPG.",
    eyebrow: "PDF to Handwriting Converter",
    h1: "PDF to Handwriting Converter",
    intro: "Upload a text-based PDF or paste text manually, turn the extracted content into handwritten-style pages, customize the paper and ink, then download PDF, PNG, or JPG output.",
    sampleImage: "/gallery/multi-page-pdf-output.png",
    sampleAlt: "Live text to handwriting PDF generator showing 684 words and seven generated pages",
    sampleCaption: "A real long-document test in the current tool: 684 detected words produced seven preview pages before the PDF was downloaded.",
    benefits: ["Browser-local selectable-text extraction", "Page, range, and comma-list selection", "Editable text with PDF, PNG, and JPG export"],
    howTo: [
      "Upload a text-based PDF and check its detected page count.",
      "Choose all pages, one page, a range such as 1-3, or a list such as 2,4,6.",
      "Review and edit the extracted text before conversion.",
      "Choose A4 or Letter, paper style, handwriting, ink, spacing, and margins.",
      "Select low, medium, or high PDF quality and set a safe filename.",
      "Review every page and download either the current page or all pages as one PDF.",
    ],
    settings: [
      { label: "Everyday PDF", value: "A4, lined paper, medium quality, all pages" },
      { label: "Print test", value: "Current page, matching paper size, medium quality" },
      { label: "Memory-limited phone", value: "Low quality or shorter text sections" },
    ],
    practicalHeading: "From PDF text to handwritten pages",
    practicalText: "The importer detects the PDF page count, validates page selections, reads selectable text in source-page order, and places it in the editor. You can cancel extraction or correct line breaks before rendering handwritten pages.",
    limitations: "The importer supports selectable-text PDFs only. It does not include OCR for scanned or image-only pages, password entry, original-layout preservation, page-number generation, headers and footers, or landscape output.",
    privacy: "The source PDF and extracted text are processed in your browser and are not uploaded to a HandTextGraph application server. The source file is not saved in browser storage; normal website analytics remain separate.",
    guideHref: "/blog/text-to-handwriting-pdf-generator",
    guideLabel: "Read the PDF extraction and cleanup guide",
    homeLinkLabel: "Main text to handwriting tool",
    faqs: [
      { question: "Can I convert text to a handwritten PDF?", answer: "Yes. Enter text, preview the rendered pages, choose current or all pages, and select Download PDF." },
      { question: "Can I upload an existing PDF?", answer: "Yes. Upload a text-based PDF to extract its selectable text, edit it, and convert it into handwritten-style pages." },
      { question: "Can it read a scanned PDF?", answer: "Not yet. Scanned or image-only PDFs require OCR, which is not included in this batch." },
      { question: "Which PDF quality should I use?", answer: "Medium is a sensible default. Use low on memory-limited devices and high only when the browser can handle larger canvases." },
      { question: "Can I download all handwritten pages in one PDF?", answer: "Yes. Choose All pages in the export controls to combine every generated handwriting page into one PDF file." },
      { question: "Does the PDF generator support A4 and Letter paper?", answer: "Yes. Select A4 or Letter before export so the generated page matches your intended print size." },
      { question: "Is the PDF to handwriting converter online free?", answer: "Yes. PDF text extraction, handwriting conversion, preview, and export are free to use without an account." },
    ],
  },
  worksheet: {
    profile: "worksheet",
    path: "/tools/handwriting-worksheet-generator",
    name: "Handwriting Worksheet Generator",
    title: "Handwriting Worksheet Generator | Printable Tracing & Cursive Practice Sheets | HandTextGraph",
    description: "Free handwriting worksheet generator: printable name tracing sheets, A–Z alphabet practice in print and cursive, and custom word tracing pages with kid-friendly guide lines. Export PDF or PNG.",
    eyebrow: "Free Printable Tracing Sheets",
    h1: "Handwriting worksheet generator",
    intro: "Create printable handwriting practice sheets in seconds: traceable name pages, A–Z alphabet practice in print or cursive, and custom word lists — all on kid-friendly sky, grass, and ground guide lines, with PDF and PNG export.",
    sampleImage: "/worksheet-generator-sample.svg",
    sampleAlt: "Sample handwriting worksheet with name tracing rows on sky, grass, and ground guide lines",
    sampleCaption: "A name-tracing sheet from the generator: solid model row, dotted tracing row, and blank practice row on three-line guides.",
    benefits: ["Name, alphabet, and custom word tracing modes", "Print and cursive letter styles", "Sky/grass/ground guide lines with adjustable sizing", "Multi-page PDF and PNG export"],
    howTo: [
      "Pick a worksheet type: name tracing, A–Z alphabet, or your own word list.",
      "Type the name, choose the letter case, or paste words one per line.",
      "Select print or cursive style, line size, tracing and practice row counts.",
      "Preview every page, then download the full PDF or the current page as PNG.",
    ],
    settings: [
      { label: "Beginner name tracing", value: "Name mode, print style, large lines, 3 tracing rows, 2 practice rows" },
      { label: "Alphabet practice pack", value: "Alphabet mode, both cases, medium lines, A4 or Letter to match the printer" },
      { label: "Weekly spelling words", value: "Word list mode, print or cursive, medium lines, export multi-page PDF" },
    ],
    practicalHeading: "Printing and classroom use",
    practicalText: "Match the A4 or Letter setting to your printer paper and print at 100% (actual size) so the guide lines come out at their true size. For reusable sheets, print once and slip the page into a dry-erase pocket or laminate it, then trace with a dry-erase marker.",
    limitations: "The generator renders tracing and practice rows from the text you provide; it does not teach letter formation order, check a child's tracing, or reproduce any specific school handwriting program's letterforms. Review the letter shapes in the preview before printing a class set.",
    privacy: "Worksheets are rendered entirely in your browser. Names, words, and generated pages are never uploaded to a HandTextGraph application server. Standard website analytics, hosting, and security services may still process technical usage data.",
    guideHref: "/blog/how-to-make-handwriting-practice-sheets",
    guideLabel: "Read the practice-sheet guide",
    homeLinkLabel: "Free text to handwriting tool",
    faqs: [
      { question: "Is this handwriting worksheet generator free?", answer: "Yes. Create unlimited tracing sheets — names, alphabets, and word lists — and download them as PDF or PNG without an account." },
      { question: "What is the difference between print and cursive mode?", answer: "Print mode uses clear block letters for beginners. Cursive mode switches to a joined, slanted script so older kids can practice flowing letterforms." },
      { question: "How do the sky, grass, and ground guide lines work?", answer: "The top sky line marks tall-letter height, the dashed grass midline marks small-letter height, and the solid ground baseline is where every letter sits." },
      { question: "Can I make tracing sheets with my own spelling words?", answer: "Yes. Paste up to 60 words, one per line, and each word gets a model row, dotted tracing rows, and blank practice rows." },
      { question: "Which paper size should I choose, A4 or Letter?", answer: "Match the paper in your printer — A4 in most of the world, Letter in the US — and print at 100% or actual size." },
      { question: "How do I reuse a worksheet without reprinting it?", answer: "Print the sheet, slide it into a dry-erase pocket or laminate it, and trace with a dry-erase marker. Wipe clean and reuse." },
      { question: "Can I use these worksheets in my classroom?", answer: "Yes. Generate and print as many copies as you need for classroom or home use, with a name-and-date header on every page." },
    ],
  },
};
