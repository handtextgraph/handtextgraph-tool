import { defaultSettings, type PageSize, type RenderSettings } from "@/lib/handwriting";

export type ToolProfile = "default" | "lined" | "graph" | "notes" | "pdf" | "word";

type ToolProfileConfig = {
  eyebrow: string;
  editorTitle: string;
  inputLabel: string;
  placeholder: string;
  starterText: string;
  fileName: string;
  settings: RenderSettings;
  /**
   * Paper sizes the profile's own page text promises. Every profile offers
   * all five sizes and landscape except "pdf", whose page states A4 or
   * Letter with no landscape output — the editor dropdown must match that
   * instead of offering sizes the page says it does not support.
   */
  allowedPageSizes: PageSize[];
  allowLandscape: boolean;
};

const allPageSizes: PageSize[] = ["a3", "a4", "a5", "letter", "legal"];

export const toolProfiles: Record<ToolProfile, ToolProfileConfig> = {
  default: {
    eyebrow: "Handwriting Studio",
    editorTitle: "Create readable handwritten-style pages",
    inputLabel: "Paste notes, worksheet text, drafts, or article copy",
    placeholder: "Paste personal notes, worksheet text, journal drafts, or article copy here...",
    starterText: `Title: Weekly Planning Notes
Topic: Printable page draft

This page is a simple example for planning, teaching, journaling, or creative layout work. Use the editor to test paper styles, spacing, margins, and ink color before exporting a clean printable page.

When the page looks right, export it as a PDF, PNG, or JPG.`,
    fileName: "handwriting-pages",
    allowedPageSizes: allPageSizes,
    allowLandscape: true,
    settings: defaultSettings,
  },
  lined: {
    eyebrow: "Lined Paper Tool",
    editorTitle: "Create handwriting on lined paper",
    inputLabel: "Type or paste the text for your lined notebook page",
    placeholder: "Type notes, paragraphs, letters, or worksheet text...",
    starterText: `Lined Paper Notes

Use a readable handwriting style, comfortable line spacing, and a visible left margin for a familiar notebook layout.

Preview the complete A4 page before downloading it as PDF, PNG, or JPG.`,
    fileName: "lined-paper-handwriting",
    allowedPageSizes: allPageSizes,
    allowLandscape: true,
    settings: {
      ...defaultSettings,
      pageType: "lined",
      pageSize: "a4",
      styleId: "clean-notes",
      fontSize: 32,
      lineSpacing: 1.5,
      leftMargin: 170,
      topMargin: 110,
      showMarginLine: true,
      paragraphIndentMode: false,
    },
  },
  graph: {
    eyebrow: "Graph Paper Tool",
    editorTitle: "Create structured graph-paper handwriting",
    inputLabel: "Type or paste text for a graph or grid paper page",
    placeholder: "Type lab notes, structured observations, or text-based math notes...",
    starterText: `Lab Record: Pendulum Observation

Aim: Observe how string length affects the time of one swing.

Method: Keep the mass constant, change the string length, and record each observation clearly.

Result: Use the grid as a visual structure for notes and add diagrams separately.`,
    fileName: "graph-paper-handwriting",
    allowedPageSizes: allPageSizes,
    allowLandscape: true,
    settings: {
      ...defaultSettings,
      pageType: "graph",
      pageSize: "a4",
      styleId: "lab-record",
      inkColor: "black",
      fontSize: 30,
      lineSpacing: 1.5,
      leftMargin: 155,
      topMargin: 110,
      randomness: 0.28,
      showMarginLine: false,
      paragraphIndentMode: false,
    },
  },
  notes: {
    eyebrow: "Notes Studio",
    editorTitle: "Turn typed notes into handwritten pages",
    inputLabel: "Write or paste class notes, revision points, or simple notes",
    placeholder: "Add short headings, key points, examples, and revision questions...",
    starterText: `Photosynthesis — Revision Notes

Main idea:
Plants convert light energy into chemical energy.

Inputs:
Carbon dioxide, water, and light.

Quick check:
Where does the light-dependent stage occur?`,
    fileName: "handwritten-notes",
    allowedPageSizes: allPageSizes,
    allowLandscape: true,
    settings: {
      ...defaultSettings,
      pageType: "lined",
      pageSize: "a4",
      styleId: "clean-notes",
      fontSize: 32,
      lineSpacing: 1.5,
      leftMargin: 170,
      topMargin: 115,
      randomness: 0.3,
      showMarginLine: true,
      paragraphIndentMode: false,
    },
  },
  pdf: {
    eyebrow: "PDF Handwriting Tool",
    editorTitle: "Convert PDF text into handwritten pages",
    inputLabel: "Edit the imported text, or type and paste text manually",
    placeholder: "Type or paste the text you want to turn into handwritten pages, or upload a text-based PDF below...",
    starterText: `PDF to Handwriting Draft

Type or paste your text, or upload a text-based PDF to extract its selectable text.

Choose A4 or Letter, review every page, set the filename and PDF quality, then export the current page or the complete document.`,
    fileName: "text-to-handwriting",
    // The PDF page promises A4 or Letter with no landscape output.
    allowedPageSizes: ["a4", "letter"],
    allowLandscape: false,
    settings: {
      ...defaultSettings,
      pageSize: "a4",
      pageType: "lined",
      pdfQuality: "medium",
      paragraphIndentMode: false,
    },
  },
  word: {
    eyebrow: "Word Handwriting Tool",
    editorTitle: "Convert DOCX text into handwritten pages",
    inputLabel: "Edit the imported document text, or type and paste text manually",
    placeholder: "Upload a DOCX above, or paste the document text you want to turn into handwritten pages...",
    starterText: `Word to Handwriting Draft

Upload a .docx file to extract its text in your browser, or replace this example with text you type or paste manually.

Review the editable text, choose a supported paper size and orientation, preview every page, then export the result as PDF, PNG, or JPG.`,
    fileName: "word-to-handwriting",
    allowedPageSizes: allPageSizes,
    allowLandscape: true,
    settings: {
      ...defaultSettings,
      pageSize: "a4",
      pageType: "lined",
      pdfQuality: "medium",
      paragraphIndentMode: false,
    },
  },
};
