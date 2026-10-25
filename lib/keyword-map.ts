export type KeywordPage = { url: string; intent: string; primary: string; supporting: readonly string[] };

export const keywordMap: readonly KeywordPage[] = [
  { url: "/", intent: "create", primary: "text to handwriting converter", supporting: ["handwriting generator", "text to handwriting online"] },
  { url: "/tools", intent: "browse", primary: "free online printable tools", supporting: ["educational generators", "creative tools"] },
  { url: "/templates", intent: "download", primary: "free printable paper", supporting: ["graph paper PDF", "printable templates"] },
  { url: "/tools/graph-paper-generator", intent: "create", primary: "graph paper generator", supporting: ["custom grid paper", "printable graph paper"] },
  { url: "/tools/lined-paper-generator", intent: "create", primary: "lined paper generator", supporting: ["printable writing paper"] },
  { url: "/tools/handwriting-worksheet-generator", intent: "create", primary: "handwriting worksheet generator", supporting: ["tracing worksheet maker"] },
  { url: "/number-grid-generator", intent: "create", primary: "number grid generator", supporting: ["printable number grid"] },
  { url: "/sudoku-generator", intent: "create", primary: "printable sudoku generator", supporting: ["sudoku PDF with answers"] },
  { url: "/virtual-graph-paper", intent: "draw", primary: "virtual graph paper", supporting: ["online graph paper drawing"] },
  { url: "/pixel-art-generator", intent: "draw", primary: "pixel art generator", supporting: ["online pixel grid editor"] },
] as const;
