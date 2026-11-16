import Link from "next/link";

/**
 * Guide #7 — "How to Make Handwriting Practice Paper".
 *
 * Every capability claim here was checked against the real tool before
 * writing (lib/paper-generators.ts, handwriting-practice-paper entry,
 * plus components/paper/PaperGeneratorStudio.tsx and
 * lib/paper-engine.ts, "guided" kind):
 * each row has three lines — a top guide, a dashed x-height midline
 * (1.3 mm dash on, 1.3 mm off), and a stronger baseline; row height
 * is adjustable from 8 to 30 mm in 0.25 mm steps, default 18 mm;
 * three presets — Primary 18 mm (default), Wide 24 mm, Standard
 * 12 mm; guide weight (line width) 0.05–1 mm, default 0.16 mm;
 * paper sizes A3, A4, A5, US Letter, and US Legal, portrait or
 * landscape, default A4 portrait; margins 5–40 mm on all four sides,
 * default 12 mm; rows per page with the default 12 mm margins — A4:
 * Wide 24 mm gives 11 rows, Primary 18 mm gives 15, Standard 12 mm
 * gives 22; US Letter: 10, 14, and 21; colours — pattern colour
 * (default #8fb3da) draws the top guide, accent colour (default
 * #6f9bd0) draws the baseline, the midline stays a fixed pale blue
 * (#a8bfdc), and the background colour is also changeable; export is
 * Download PDF (vector, page count 1–20), Download PNG (150 or
 * 300 DPI), Download SVG (vector), and Print (browser print); the
 * tool is free, needs no account, and runs entirely in the browser.
 * There are NO tracing letters, NO model letters, NO trace words or
 * sentences, NO picture box, NO name header, NO journal margin, and
 * NO red margin line; every row on a page has the same height; the
 * page does not save your settings — leaving it resets the defaults.
 * The registry description was corrected: it conflated the Wide and
 * Primary presets into "wide primary rows" and called the sheets
 * "standard ruled", when Standard is a row height and the rows are
 * three-line guided rows, not ruled lines.
 */

export const handwritingPracticeFaqs: readonly {
  question: string;
  answer: string;
}[] = [
  {
    question: "Is the handwriting practice paper generator free?",
    answer:
      "Yes. You can make and download practice paper without creating an account and without paying. The tool runs in your browser, and nothing you make is saved on the site.",
  },
  {
    question: "What are the three lines in each row?",
    answer:
      "Each row has a top guide, a dashed midline, and a stronger baseline. The top guide marks the height of tall letters — b, d, f, h, k, l, and capitals. The dashed midline marks the height of small letters — a, c, e, m, n, o, r, s, u, v, w, x, z. Every letter sits on the baseline, and letters with tails — g, j, p, q, y — drop below it.",
  },
  {
    question: "Which row height should a 6-year-old use?",
    answer:
      "Primary 18 mm or Wide 24 mm. Start with Wide 24 mm for first letters and move to Primary 18 mm as the letters get smaller. The ages are a rough guide — if letters crowd the lines, go one size larger; if the writing rattles around in rows twice as tall as the letters, go one size smaller.",
  },
  {
    question: "How many rows fit on one page?",
    answer:
      "With the default 12 mm margins, A4 gives 11 rows at Wide 24 mm, 15 at Primary 18 mm, and 22 at Standard 12 mm. US Letter gives 10, 14, and 21 rows. The generator shows a live row count for your exact settings, so change the paper size, margins, or row height and the number updates.",
  },
  {
    question: "Does it include tracing letters or words?",
    answer:
      "No. This generator makes blank ruled rows only; it does not add model letters, trace words, or sentences. For tracing sheets with a model row, dotted tracing rows, and blank practice rows, use the handwriting worksheet generator on this site.",
  },
  {
    question: "Can I print more than one page at a time?",
    answer:
      "Yes. Set the PDF page count up to 20 pages to print a whole pad at once. The PDF is vector, so every page prints at the exact row height you set, as long as you print at Actual size or 100%.",
  },
];

export function HandwritingPracticeGuideBody() {
  return (
    <>
      <p>
        Handwriting practice paper is ruled paper with a job: each row
        has three lines instead of one, so a writer can see exactly
        how tall each letter should be. The top guide marks the height
        of tall letters, the dashed midline marks the height of small
        letters, and the stronger baseline is where every letter sits.
        This guide walks through the{" "}
        <Link
          href="/tools/handwriting-practice-paper"
          className="font-bold text-brand-teal hover:underline"
        >
          Handwriting Practice Paper Generator
        </Link>{" "}
        on this site, which is free, needs no account, and makes
        printable practice sheets at the row height you choose.
      </p>
      <p>
        The one thing to know before you start is what the tool is
        for: it makes blank three-line rows, nothing else. It does not
        add model letters, tracing dots, words, or sentences — the
        page is empty on purpose, so the writer fills it. If you want
        tracing sheets, the handwriting worksheet generator on this
        site is the right tool; this page is for the practice that
        comes after the tracing, when the model is no longer needed
        and the writer needs clean rows at the right height.
      </p>

      <h2>How to make handwriting practice paper in six steps</h2>

      <h3>Step 1 — Pick the row height</h3>
      <p>
        Start with the presets, which are spaced for different hands.
        Wide 24 mm suits the youngest writers, around ages 5 to 7,
        who are still learning letter shapes and need room for tall
        letters and tails. Primary 18 mm suits early primary writers,
        around ages 6 to 8, whose letters are getting smaller but
        still need a clear midline — it is also the default, so the
        page opens on it. Standard 12 mm suits older children, around
        ages 8 and up, and adults — anyone whose handwriting is
        already small and controlled. These are rough guides, not
        rules: children vary, and the right test is the page itself.
        If letters crowd the lines or climb above the top guide, go
        one size larger; if the writing rattles around in rows twice
        as tall as the letters, go one size smaller.
      </p>
      <p>
        If none of the presets fits, the row height control runs from
        8 to 30 mm in 0.25 mm steps, so you can set any size between
        or beyond them — 15 mm, for example, for a child between
        Primary and Standard. The row height also decides how many
        rows fit on a page. With the default 12 mm margins, A4 gives
        11 rows at Wide 24 mm, 15 at Primary 18 mm, and 22 at
        Standard 12 mm; US Letter gives 10, 14, and 21 rows. The
        generator shows a live row count for your exact settings, so
        change the paper size, margins, or row height and the number
        updates — use it to plan how many pages a practice set needs.
      </p>

      <h3>Step 2 — Learn the three lines</h3>
      <p>
        Each row has three lines, and each one has a job. The top
        guide marks the height of tall letters: b, d, f, h, k, l, and
        capitals. The dashed midline marks the height of small
        letters: a, c, e, m, n, o, r, s, u, v, w, x, z. The stronger
        baseline is where every letter sits. Letters with tails — g,
        j, p, q, y — drop below the baseline into the space above the
        next row’s top guide. The midline is dashed on purpose: it is
        a guide, not a line to write on, and the dashes keep it
        visually lighter than the baseline so the writer’s eye goes to
        the baseline first.
      </p>
      <p>
        Teach the lines by name before the first row is written. A
        child who can say where a letter belongs before writing it
        will place it correctly far more often than a child who just
        copies a shape. Ask “tall or small?” for each letter: tall
        letters reach the top guide, small letters stop at the dashed
        midline, every letter stands on the baseline, and tails drop
        below it. For cursive, the same rows apply, but the joins
        matter more than the heights: letters should join along the
        baseline, not float between lines. If joins keep breaking, the
        row height is probably too small for the writer’s current
        control — go one size larger until the joins hold.
      </p>

      <h3>Step 3 — Choose the paper size, orientation, and margins</h3>
      <p>
        The generator offers five paper sizes — A3, A4, A5, US Letter,
        and US Legal — in portrait or landscape. The default is A4 in
        portrait, which suits most school practice. Landscape gives
        longer rows, which suits sentence practice and older writers
        who write across the page; A5 suits a small notebook or a
        pocket practice pad; A3 suits a classroom wall sheet or a
        demonstration page. Pick the size that matches the paper your
        printer holds, not the size you wish you had — a sheet
        generated for one size and printed on another will not
        measure true.
      </p>
      <p>
        Margins run from 5 to 40 mm on all four sides, with 12 mm as
        the default, and the same margin applies on every side. Wider
        margins leave room for a hole punch or a binder, and they
        reduce the rows per page; narrower margins fit more rows but
        leave little room at the edges. The row counts quoted in this
        guide all use the default 12 mm margins — widen the margins
        and the counts fall, so check the live row count on the page
        after changing them.
      </p>

      <h3>Step 4 — Set the guide weight and colours</h3>
      <p>
        The guide weight control sets how heavy the lines print, from
        0.05 to 1 mm, with 0.16 mm as the default. Lighter lines suit
        confident writers who only need a faint guide; heavier lines
        suit beginners who need the rows to stand out. Keep the
        weight light enough that the lines guide the writing without
        competing with it — a line that is darker than the pencil
        makes the page look ruled rather than written on.
      </p>
      <p>
        Colours are adjustable too, with one exception. The pattern
        colour draws the top guide and the accent colour draws the
        baseline, and both can be changed to any colour. The midline
        stays a fixed pale blue whatever you choose, which keeps it
        visibly lighter than the other two lines. The background
        colour can also be changed, though white is the sensible
        default: a coloured background uses more ink and makes pencil
        harder to see. If you change the colours, print one test page
        first — a pale line that looks fine on screen can disappear
        on paper.
      </p>

      <h3>Step 5 — Print at actual size</h3>
      <p>
        Practice paper is only useful if the rows are the size they
        claim to be, so print at Actual size or 100% and turn off
        “Fit to page”, “Shrink to fit”, or any scaling option in the
        print dialog. Those options shrink the page by a few percent
        to fit inside the printer’s unprintable margins — harmless
        for text, but an 18 mm row printed at 96% becomes a 17.3 mm
        row, and the handwriting practised on it is trained to the
        wrong height. Print one test page and measure a row with a
        ruler before printing a class set: the distance from one
        baseline to the next should match the row height you set.
      </p>
      <p>
        Mind the paper size as well. An A4 PDF printed on US Letter
        paper at 100% loses the bottom 17.6 mm, and a Letter PDF
        printed on A4 leaves a gap at the bottom. Regenerate the
        sheet in the size your printer holds instead of scaling. The
        PDF and SVG files are vector, so they stay sharp at any
        scale — the only thing that changes the printed size is the
        print setting, not the file.
      </p>

      <h3>Step 6 — Download or print the pad</h3>
      <p>
        Under the preview there are four buttons: Download PDF,
        Download PNG, Download SVG, and Print. The PDF is the usual
        choice for a printed set — it is vector, so it keeps the
        lines sharp, and the page count runs from 1 to 20, so you can
        print a whole pad of identical sheets at once. The PNG suits
        sharing in a chat or a document, at 150 DPI for a draft or
        300 DPI for print quality, and the SVG suits editing the
        rows in a drawing program. The Print button opens your
        browser’s print dialog, so you can print straight from the
        page or choose “Save as PDF” there instead. For a term’s
        worth of paper, set the PDF page count to 20 and print the
        whole pad at once; for reusable sheets, print once and slip
        the page into a dry-erase pocket or laminate it, then practise
        with a dry-erase marker.
      </p>

      <h2>Teaching order: letters, then words, then sentences</h2>
      <p>
        Start with single letters, one row per letter, in alphabetical
        order or in the order the child’s school teaches them. Then
        move to short words — the child’s name first, then two- and
        three-letter words — with one word per row. Only then move to
        sentences, one sentence per row, with a capital at the start
        and a full stop at the end. Each stage uses the same rows;
        only the writing gets longer, which is the point — the lines
        stay familiar while the task grows.
      </p>
      <p>
        Short, frequent practice beats long sessions: ten minutes a
        day produces steadier progress than an hour once a week. End
        each session on a success — a row the child is proud of —
        rather than pushing through to the end of a page. And always
        review the page together: circle the best-formed letter in
        each row and ask the child to copy that one again, rather
        than pointing at the worst. When the child can write a row of
        letters without looking at a model, move to the next size
        down — that is the moment the smaller rows start to help
        rather than frustrate.
      </p>

      <h2>More practice on the same site</h2>
      <p>
        Blank practice paper is the middle step, not the whole
        journey. For the step before it, the{" "}
        <Link
          href="/tools/handwriting-worksheet-generator"
          className="font-bold text-brand-teal hover:underline"
        >
          handwriting worksheet generator
        </Link>{" "}
        builds tracing sheets for names, the A–Z alphabet, and your
        own word lists, with a model row, dotted tracing rows, and
        blank practice rows, in print or cursive. Use the two
        together: the worksheet generator for the model, this page
        for extra blank practice paper at the same row height. For
        the step after it, the{" "}
        <Link
          href="/guides/text-to-handwriting"
          className="font-bold text-brand-teal hover:underline"
        >
          text to handwriting guide
        </Link>{" "}
        shows how to turn typed text into handwritten-style pages,
        which is a good way to show a learner what fluent writing on
        these rows can look like. And when the writer no longer needs
        the midline at all, the{" "}
        <Link
          href="/tools/lined-paper-generator"
          className="font-bold text-brand-teal hover:underline"
        >
          lined paper generator
        </Link>{" "}
        makes plain ruled paper in college, wide, or extra-wide
        ruling — the natural next paper once the three lines have
        done their job.
      </p>

      <h2>What the practice paper generator does not do</h2>
      <p>
        An honest note, because it shapes what you should expect.
        This generator makes blank three-line rows, and nothing else:
        no model letters, no tracing dots, no words or sentences, no
        picture box, no name header, and no red margin line. Every
        row on a page has the same height, so you cannot mix a wide
        row for capitals with a standard row for sentences on one
        sheet. The page does not save your settings either — leave
        it and they reset to the defaults, so note the row height you
        settled on if you want the same paper again. Within those
        limits, the process is short: pick a row height, learn the
        three lines, set the size and margins, adjust the weight and
        colours, print at actual size, and download the pad.
      </p>
    </>
  );
}
