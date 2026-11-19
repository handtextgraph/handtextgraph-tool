import Link from "next/link";

/**
 * Guide #10 — "How to Print Lined Paper".
 *
 * Every capability claim here was checked against the real tool before
 * writing (lib/paper-generators.ts, lined-paper-generator entry,
 * plus components/paper/PaperGeneratorStudio.tsx and
 * lib/paper-engine.ts, "lined" kind):
 * rule spacing runs from 3 to 30 mm in 0.1 mm steps, default 7.1 mm;
 * four presets — Narrow ruled 6.35 mm, College ruled 7.1 mm, Wide
 * ruled 8.7 mm, and Extra wide 11 mm; line weight runs from 0.05 to
 * 1 mm in 0.05 mm steps, default 0.16 mm; five paper sizes — A3
 * (297 × 420 mm), A4 (210 × 297 mm), A5 (148 × 210 mm), US Letter
 * (8.5 × 11 in), and US Legal (8.5 × 14 in) — in portrait or
 * landscape, default A4 portrait; margins are one value applied to
 * all four sides, from 5 to 40 mm, default 12 mm; the pattern colour
 * (default #8fb3da, pale blue) draws every rule and the background
 * colour (default white) is changeable; the accent colour picker is
 * shown in the studio but has no effect on this page, because the
 * lined build passes only the pattern colour — the rules are a
 * single colour throughout; measurements can be entered in
 * millimetres or inches, converted at 25.4 mm per inch; the studio
 * shows a live line count for the exact settings, computed from the
 * printable area (page minus margins) as floor(height / spacing) + 1
 * — with the default 12 mm margins, college ruled gives 39 lines on
 * A4 and 36 on US Letter, wide ruled gives 32 and 30, narrow ruled
 * gives 43 and 41, and extra wide gives 25 and 24; in landscape,
 * college ruled gives 27 lines on A4 and 28 on US Letter; the red
 * margin line is a toggle, off by default, drawing one vertical line
 * 20 mm in from the left edge of the printable area in a fixed red
 * (#dc6b73), slightly heavier than the rules; export is Download PDF
 * (vector, page count 1–20), Download PNG (150 DPI draft or 300 DPI
 * print), Download SVG (vector), and Print (browser print, with the
 * page size set to the sheet size); the tool is free, needs no
 * account, and runs entirely in the browser. The engine draws
 * horizontal rules only, stepping by the spacing from the top margin
 * to the bottom margin — there is NO dashed midline, NO header or
 * name/date/class fields, NO title block, NO vertical lines other
 * than the optional red margin line, NO columns, NO filled example,
 * and NO Word (.docx) export, and the PDF page count only repeats
 * identical sheets (no double-sided option). The page does not save
 * your settings — they live in component state only, there is no
 * localStorage, and leaving the page resets the defaults (a Reset
 * button restores them). The registry description was honest and
 * needed no correction: the page does print lined paper with college,
 * wide, or extra-wide ruling, and the guide tells you to print it at
 * actual size.
 */

export const linedPaperFaqs: readonly {
  question: string;
  answer: string;
}[] = [
  {
    question: "Is the lined paper generator free?",
    answer:
      "Yes. You can make and download lined paper without creating an account and without paying. The tool runs in your browser, and nothing you make is saved on the site.",
  },
  {
    question: "How many lines fit on one page?",
    answer:
      "It depends on the ruling, the paper size, and the margins. The generator shows a live count for your exact settings — for example, college ruled (7.1 mm) gives 39 lines on A4 and 36 lines on US Letter with the default 12 mm margins, and wide ruled (8.7 mm) gives 32 and 30.",
  },
  {
    question: "Can I add a red margin line?",
    answer:
      "Yes. Turn on the Red margin line option to draw a vertical red line 20 mm in from the left edge of the printable area, the way ruled notebooks do. It is off by default, and its position and colour are fixed.",
  },
  {
    question: "Can I print a whole pad of lined paper at once?",
    answer:
      "Yes. Set the PDF page count in the studio — up to 20 pages per PDF — and download one file that prints a whole pad of identical sheets.",
  },
  {
    question: "Why does my ruling print the wrong size?",
    answer:
      "The print dialog scaled the page. Choose Actual size or 100% and turn off Fit to page, then measure ten ruled gaps with a ruler — for college ruling they should span exactly 71 mm. If they do not, the printer scaled the page; go back to the print dialog and choose Actual size.",
  },
  {
    question: "Does it have a handwriting mode with a dashed midline?",
    answer:
      "No. This page draws plain ruled lines. For three-line rows with a dashed midline, use the handwriting practice paper generator instead.",
  },
];

export function LinedPaperGuideBody() {
  return (
    <>
      <p>
        Lined paper is the plainest writing paper there is: a set of
        evenly spaced horizontal rules, and nothing else. It keeps
        handwriting straight, keeps the line spacing even, and stays
        out of the way of the words. This guide walks through the{" "}
        <Link
          href="/tools/lined-paper-generator"
          className="font-bold text-brand-teal hover:underline"
        >
          Lined Paper Generator
        </Link>{" "}
        on this site, which is free, needs no account, and makes
        printable ruled paper at the spacing you choose.
      </p>
      <p>
        Before you start, know what the tool is for: blank ruled
        lines, nothing else. No header fields, no title block, no
        dashed midline, and no filled example. The heading, the
        date, and the writing are yours to add by hand after
        printing.
      </p>

      <h2>Four rulings, one choice to make</h2>
      <p>
        The ruling is the distance between two neighbouring rules,
        and it is the one decision that matters most, because it
        decides how large the handwriting can be. The generator
        offers four presets. Narrow ruled is 6.35 mm — exactly a
        quarter inch — for compact notes and small handwriting.
        College ruled is 7.1 mm, the standard US school and
        university ruling, and the best default if you are unsure.
        Wide ruled is 8.7 mm for primary school and larger
        handwriting. Extra wide is 11 mm for early writers and
        anyone who needs large, clear lines.
      </p>
      <p>
        The difference is only a few millimetres, but it changes how
        much fits on a page. With the default 12 mm margins, college
        ruled gives 39 lines on A4 and 36 on US Letter; wide ruled
        gives 32 and 30; narrow ruled gives 43 and 41; extra wide
        gives 25 and 24. The generator shows a live line count above
        the preview that updates as you change the settings — use it
        instead of guessing how many pages a piece of writing will
        need. If the count says 39 lines and the essay needs 50,
        print two pages before you start.
      </p>
      <p>
        If none of the presets matches the paper you already own,
        measure one ruled gap on that paper with a ruler and type
        the number into the custom spacing control, which runs from
        3 to 30 mm in 0.1 mm steps. Matching the paper you have
        beats buying new paper, and it keeps a half-filled notebook
        usable.
      </p>

      <h2>How to print lined paper in five steps</h2>

      <h3>Step 1 — Pick the ruling</h3>
      <p>
        Start with college ruled unless you have a reason not to.
        It is the middle of the range: small enough to hold a full
        page of notes, large enough for ordinary adult handwriting.
        Go narrow when the writing is small and the notes are long
        — revision notes, a list that must fit on one sheet, a draft
        that will be copied out later. Go wide when the writer is
        young, when the handwriting is large, or when the page will
        be read at a distance. Go extra wide for early writers.
        The test is the page itself: if the letters touch the rule
        above them, go one size wider.
      </p>

      <h3>Step 2 — Choose the paper size, orientation, and margins</h3>
      <p>
        The generator offers five paper sizes — A3, A4, A5, US
        Letter, and US Legal — in portrait or landscape. The
        default is A4 in portrait, which suits most school and
        homework use. A5 suits a small notebook or a pocket pad,
        and A3 suits a classroom wall chart. Choose US Letter if
        that is what your printer holds — an A4 PDF printed on
        Letter loses the bottom of the page, so regenerate in the
        right size instead of scaling.
      </p>
      <p>
        Landscape suits a page that will be read sideways, but it
        costs lines: college ruled gives 27 lines on A4 in landscape
        instead of 39 in portrait, and 28 on US Letter instead of
        36, because the page is shorter than it is wide. Margins are one value
        applied to all four sides, from 5 to 40 mm, with 12 mm as
        the default. Wider margins leave room for a hole punch, but
        they shrink the writing area — the live line count drops as
        the margins grow.
      </p>

      <h3>Step 3 — Set the line weight and the colours</h3>
      <p>
        Keep the default 0.16 mm line weight unless you have a
        reason to change it. The control runs from 0.05 to 1 mm in
        0.05 mm steps. Go lighter — 0.1 mm — for rules that stay in
        the background behind ink. Go heavier — 0.3 mm or more — for
        pencil work or for a sheet that will be photocopied. The rules are drawn in a
        single colour — the pattern colour, pale blue by default —
        and the background is white by default and can be changed.
        Pale blue is a good default, because it guides the eye
        without fighting with the ink written over it. One honest
        detail: the studio also shows an accent colour picker, but
        changing it does nothing on this page, because the rules
        have only one colour. Measurements can be entered in
        millimetres or inches, converted at 25.4 mm per inch.
      </p>

      <h3>Step 4 — Decide about the red margin line</h3>
      <p>
        The red margin line is a toggle, off by default. Turn it on
        and the generator draws one vertical red line 20 mm in from
        the left edge of the printable area, the way ruled notebooks
        do. It gives the page a formal frame: the body of the
        writing stays to the right of the red line. Use it for
        letters, journals, and schoolwork that should look like a
        notebook page, and leave it off for lists and drafts, where
        it only eats writing space. The line is drawn slightly
        heavier than the rules, and its position and colour are
        fixed.
      </p>

      <h3>Step 5 — Check the count, set the page count, and print at actual size</h3>
      <p>
        Read the live line count above the preview before you
        download. A letter that needs 30 lines will not fit on an
        extra-wide A4 page, which gives only 25. If the count is
        short, change the ruling or the paper size — shrinking the
        printout later would change the size of every rule. If you
        need more than one sheet, set the PDF page count before
        downloading — from 1 to 20 pages per PDF — and print the
        pad once.
      </p>
      <p>
        Then print at Actual size or 100% and turn off “Fit to
        page”, “Shrink to fit”, or any scaling option in the print
        dialog. Those options shrink the page by a few percent —
        harmless for text, but a 7.1 mm ruling printed at 96%
        becomes a 6.8 mm ruling, and the paper no longer matches
        the notebook it was meant to match. Print one test page
        first and measure ten ruled gaps with a ruler: ten
        college-ruled gaps should span exactly 71 mm.
      </p>
      <p>
        Under the preview are four buttons: Download PDF, Download
        PNG, Download SVG, and Print. The PDF is the usual choice
        for a printed set — it is vector, so the lines stay sharp,
        and it carries the page count you set. The PNG suits
        sharing, at 150 DPI for a draft or 300 DPI for print
        quality, and the SVG suits editing in a drawing program.
      </p>

      <h2>Worked example: planning a handwritten essay</h2>
      <p>
        Take a school essay of about 500 words, to be written by
        hand on college-ruled A4. College ruled gives 39 lines on
        A4 with the default margins, and an adult hand writes
        roughly 8 to 12 words on one college-ruled line, so one
        page holds roughly 300 to 450 words — call it about 350 for
        planning, and measure your own handwriting on the test page
        before trusting the estimate. At that rate, a 500-word
        essay needs about one and a half pages, so print two sheets
        and leave the second one ready.
      </p>
      <p>
        Leave the top three lines of the first page for the title
        and your name — the generator prints no header fields, so
        write them by hand — and start the essay on the fourth
        line. That leaves 36 lines on the first page, about 300
        words, and the rest flows onto the second sheet. The same
        arithmetic works for any length: divide the word count by
        the words per line, divide again by the lines per page, and
        print that many sheets plus one spare.
      </p>

      <h2>Worked example: a letter on college-ruled paper</h2>
      <p>
        A letter is the job the red margin line was made for. Print
        one college-ruled A4 sheet with the margin line turned on.
        Write the date on the first rule, at the top right, and the
        recipient&apos;s address on the next two rules. Leave one
        rule blank, write the greeting on the next rule, leave one
        more blank, and then start the body of the letter to the
        right of the red line.
      </p>
      <p>
        A short letter of about 200 words needs roughly 20 to 25
        lines at college ruling, which fits comfortably on one page
        with room for the date, the address, and the sign-off. If
        the letter runs past one page, print a second sheet with the
        same settings — the margin line and the ruling will match,
        and the letter will look like it came from one pad, not
        two.
      </p>

      <h2>Lined paper for notes, lists, and journals</h2>
      <p>
        The ruling should match the writing, not the occasion. Lists
        suit narrow ruling: more lines per page means a shopping
        list or a task list fits on one sheet instead of two, and a
        narrow-ruled A4 page gives 43 lines for it. Notes suit
        college ruling, the middle that offends nobody, with 39
        lines on A4 for a lecture or a chapter summary. Journals
        suit wide or extra-wide ruling: the extra space invites
        longer entries, and 25 lines on an extra-wide page is
        enough for a day&apos;s entry. For a journal, print a pad
        of 20 pages at once and keep it by the bed or the desk; a
        ready pad gets used, a single sheet gets lost. Keep the
        ruling the same across a whole subject — switching between
        college and wide halfway through a topic makes the notes
        harder to read back.
      </p>

      <h2>When lined paper is not the right paper</h2>
      <p>
        Plain rules suit most writing, but not every job. For
        younger writers who still need help with letter heights,
        use the{" "}
        <Link
          href="/tools/handwriting-practice-paper"
          className="font-bold text-brand-teal hover:underline"
        >
          handwriting practice paper generator
        </Link>
        , which builds three-line rows with a dashed midline — this
        page draws plain rules only, and the{" "}
        <Link
          href="/guides/handwriting-practice"
          className="font-bold text-brand-teal hover:underline"
        >
          handwriting practice guide
        </Link>{" "}
        explains how to use them. For lecture notes that need a cue
        column and a summary box, use the{" "}
        <Link
          href="/tools/cornell-notes-generator"
          className="font-bold text-brand-teal hover:underline"
        >
          Cornell notes generator
        </Link>
        , and the{" "}
        <Link
          href="/guides/cornell-notes"
          className="font-bold text-brand-teal hover:underline"
        >
          Cornell notes guide
        </Link>{" "}
        shows how to set the page up. For drawing, charts, and
        maths, use the{" "}
        <Link
          href="/tools/graph-paper-generator"
          className="font-bold text-brand-teal hover:underline"
        >
          graph paper generator
        </Link>
        , which draws a square grid instead of rules, and the{" "}
        <Link
          href="/guides/graph-paper"
          className="font-bold text-brand-teal hover:underline"
        >
          graph paper guide
        </Link>{" "}
        explains the grid sizes. For French cursive practice, use
        the{" "}
        <Link
          href="/tools/seyes-ruled-paper-generator"
          className="font-bold text-brand-teal hover:underline"
        >
          Seyes ruled paper generator
        </Link>
        , which adds fine subdivisions and vertical ruling that
        plain lined paper does not have.
      </p>

      <h2>More paper on the same site</h2>
      <p>
        Lined paper is one paper in a set. When the work is drawing
        rather than writing, the graph paper generator makes a
        square grid at the spacing you choose. When the writer is
        still learning letter heights, the handwriting practice
        paper generator builds three-line rows with a dashed
        midline. And when the notes need structure, the Cornell
        notes generator sets the page up for the Cornell method.
        Each one prints at actual size, and each one is free.
      </p>

      <h2>What the lined paper generator does not do</h2>
      <p>
        An honest note. This generator makes blank ruled lines, and
        nothing else: no dashed midline, no header or name and date
        fields, no title block, no vertical lines other than the
        optional red margin line, no columns, and no Word document.
        The margin line&apos;s position and colour are fixed, and
        the PDF page count only repeats identical sheets — there is
        no double-sided option. Write the heading, the date, and
        the title by hand after printing. The page does not save
        your settings either — leave it and they reset to the
        defaults, so note the ruling and paper size you settled on.
        Reset restores college ruled on A4.
      </p>
    </>
  );
}
