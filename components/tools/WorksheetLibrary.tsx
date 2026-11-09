import Link from "next/link";

const card = "rounded-[28px] border border-slate-200 bg-white p-5 shadow-card sm:p-6";
const linkClass = "font-semibold text-brand-blue hover:underline";

type LibraryItem = { name: string; href: string; description: string };
type LibrarySection = { heading: string; intro: string; items: LibraryItem[] };

const sections: LibrarySection[] = [
  {
    heading: "Tracing & copy work",
    intro: "Sheets that teach letter formation, one word at a time.",
    items: [
      { name: "Handwriting worksheet generator", href: "/tools/handwriting-worksheet-generator", description: "Tracing sheets for names, the A–Z alphabet, and your own word lists — model row, dotted tracing rows, and blank practice rows, in print or cursive." },
      { name: "Handwriting practice paper", href: "/tools/handwriting-practice-paper", description: "Three-line practice paper with dashed midlines for copy work without tracing dots." },
      { name: "Cursive text generator", href: "/cursive-text-generator", description: "Cursive headings and model words to copy, exported as PNG, JPG, or PDF." },
    ],
  },
  {
    heading: "Number practice",
    intro: "Charts and grids for counting, sequences, and missing-number work.",
    items: [
      { name: "Printable number charts", href: "/printable-number-charts", description: "1–100, 1–120, multiplication, and empty number charts for A4 or Letter paper." },
      { name: "Number grid generator", href: "/number-grid-generator", description: "Custom number sequences with optional blank cells for missing-number exercises." },
    ],
  },
  {
    heading: "Word puzzles & logic",
    intro: "Puzzles built from your own words — ready for warm-ups and homework.",
    items: [
      { name: "Word search maker", href: "/word-search-maker", description: "A vocabulary puzzle from your word list, with a highlighted answer key." },
      { name: "Word scramble generator", href: "/word-scramble-generator", description: "Letter-scramble worksheets with hints and answers." },
      { name: "Sentence scramble generator", href: "/sentence-scramble-generator", description: "Sentence-order worksheets with answer keys." },
      { name: "Sudoku generator", href: "/sudoku-generator", description: "Seeded easy, medium, and hard Sudoku puzzles with unique solutions and answer keys." },
    ],
  },
  {
    heading: "Classroom sheets",
    intro: "Tidy, printable sheets for assignments, records, and data.",
    items: [
      { name: "Assignment maker", href: "/assignment-maker", description: "Formatted assignments with a title, instructions, and A4 or Letter preview." },
      { name: "Blank table generator", href: "/blank-table-generator", description: "Printable blank tables with custom cells, headers, and page settings." },
    ],
  },
  {
    heading: "Ready-made printable paper",
    intro: "Downloadable PDFs made with the site's own paper engine — no settings to choose, just print.",
    items: [
      { name: "Primary handwriting practice paper", href: "/templates/handwriting-practice/primary", description: "Primary-ruled handwriting paper as a ready-made PDF." },
      { name: "A4 5 mm graph paper", href: "/templates/graph-paper/a4-5mm", description: "A4 square graph paper with exact 5 mm spacing." },
      { name: "A4 Cornell notes template", href: "/templates/cornell-notes/a4", description: "Cornell notes layout with cue, notes, and summary regions." },
    ],
  },
];

export function WorksheetLibrary() {
  return (
    <div>
      <p className="mx-auto max-w-3xl text-center leading-8 text-slate-600">
        Every worksheet below is made with this site&apos;s own generators — enter your own words or
        numbers and print a fresh sheet. Nothing here is a pre-filled workbook page.
      </p>
      <div className="mt-8 space-y-10">
        {sections.map((section) => (
          <section key={section.heading} aria-labelledby={section.heading}>
            <h2 id={section.heading} className="text-2xl font-semibold text-slate-950">{section.heading}</h2>
            <p className="mt-2 leading-7 text-slate-600">{section.intro}</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {section.items.map((item) => (
                <article key={item.href} className={card}>
                  <h3 className="text-lg font-semibold text-slate-950">
                    <Link href={item.href} className={linkClass}>{item.name}</Link>
                  </h3>
                  <p className="mt-2 leading-7 text-slate-600">{item.description}</p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
      <p className="mt-10 text-center leading-7 text-slate-600">
        Looking for plain paper instead of a worksheet? Browse all{" "}
        <Link href="/templates" className={linkClass}>printable templates</Link> or see{" "}
        <Link href="/tools" className={linkClass}>all free tools</Link>.
      </p>
    </div>
  );
}
