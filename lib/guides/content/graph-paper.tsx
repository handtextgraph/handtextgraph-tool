import Link from "next/link";

/**
 * Guide #9 — "How to Print Graph Paper".
 *
 * Every capability claim here was checked against the real tool before
 * writing (lib/paper-generators.ts, graph-paper-generator entry,
 * plus components/paper/PaperGeneratorStudio.tsx and
 * lib/paper-engine.ts, "square-grid" kind):
 * grid spacing runs from 2 to 30 mm in 0.25 mm steps, default 5 mm;
 * three presets — 5 mm, 1 cm (10 mm), and Quarter inch (exactly
 * 6.35 mm); line weight runs from 0.05 to 1 mm in 0.05 mm steps,
 * default 0.16 mm; five paper sizes — A3 (297 × 420 mm), A4
 * (210 × 297 mm), A5 (148 × 210 mm), US Letter (8.5 × 11 in), and
 * US Legal (8.5 × 14 in) — in portrait or landscape, default A4
 * portrait; margins are one value applied to all four sides, from
 * 5 to 40 mm, default 12 mm; the pattern colour (default #8fb3da,
 * pale blue) draws every grid line and the background colour
 * (default white) is changeable; the accent colour picker is shown
 * in the studio but has no effect on this page, because the
 * square-grid build passes only the pattern colour — the grid is a
 * single colour throughout; measurements can be entered in
 * millimetres or inches, converted at 25.4 mm per inch; the studio
 * shows a live square count for the exact settings, computed from
 * the printable area (page minus margins), counting grid lines per
 * side — with the default 12 mm margins, 5 mm spacing gives
 * 38 × 55 = 2,090 squares on A4 and 39 × 52 = 2,028 on US Letter,
 * 2 mm gives 94 × 137 = 12,878 on A4 and 96 × 128 = 12,288 on
 * Letter, quarter inch gives 30 × 43 = 1,290 on A4 and
 * 31 × 41 = 1,271 on Letter, and 1 cm gives 19 × 28 = 532 on A4
 * and 20 × 26 = 520 on Letter; export is Download PDF (vector,
 * page count 1–20), Download PNG (150 DPI draft or 300 DPI print),
 * Download SVG (vector), and Print (browser print, with the page
 * size set to the sheet size); the tool is free, needs no account,
 * and runs entirely in the browser. The engine draws one even grid:
 * horizontal lines stepping by the spacing from the top margin to
 * the bottom, and vertical lines stepping the same way, all in the
 * one pattern colour at the one line weight — there are NO heavier
 * major lines, NO numbered axes, NO quadrants, NO log scales, NO
 * title block or header, NO filled example, and NO Word (.docx)
 * export. The page does not save your settings — they live in
 * component state only, there is no localStorage, and leaving the
 * page resets the defaults (a Reset button restores them). The
 * registry description was honest and needed no correction: the
 * page does print graph paper in the grid size you choose, with a
 * choice of spacing, page size, and layout, and a print-ready PDF.
 */

export const graphPaperFaqs: readonly {
  question: string;
  answer: string;
}[] = [
  {
    question: "Is the graph paper generator free?",
    answer:
      "Yes. You can make and download graph paper without creating an account and without paying. The tool runs in your browser, and nothing you make is saved on the site.",
  },
  {
    question: "How many squares fit on one page?",
    answer:
      "It depends on the spacing, the paper size, and the margins. The generator shows a live count for your exact settings — for example, 5 mm spacing on A4 gives 38 × 55 = 2,090 squares with the default 12 mm margins, and 1 cm spacing gives 19 × 28 = 532.",
  },
  {
    question: "What grid spacing should I choose?",
    answer:
      "5 mm suits everyday maths, charts, and schoolwork; 1 cm suits young learners and big diagrams; 2 mm suits fine detail and dense plots; quarter inch (6.35 mm) matches US school paper. You can also type any spacing from 2 to 30 mm in 0.25 mm steps.",
  },
  {
    question: "Does the grid have heavier lines every five or ten squares?",
    answer:
      "No. This generator draws one even grid, with every line the same weight and colour. If you need minor, major, and bold divisions, use the engineering paper generator instead.",
  },
  {
    question: "Can I print a whole pad of graph paper at once?",
    answer:
      "Yes. Set the PDF page count in the studio — up to 20 pages per PDF — and download one file that prints a whole pad of identical sheets.",
  },
  {
    question: "Why does my grid print the wrong size?",
    answer:
      "The print dialog scaled the page. Choose Actual size or 100% and turn off Fit to page, then measure ten 5 mm squares with a ruler — they should span exactly 50 mm. If they do not, the printer scaled the page; go back to the print dialog and choose Actual size.",
  },
];

export function GraphPaperGuideBody() {
  return (
    <>
      <p>
        Graph paper is the plainest tool in maths: a sheet of equal
        squares, and nothing else. It turns counting into measuring.
        This guide walks through the{" "}
        <Link
          href="/tools/graph-paper-generator"
          className="font-bold text-brand-teal hover:underline"
        >
          Graph Paper Generator
        </Link>{" "}
        on this site, which is free, needs no account, and makes a
        printable square grid at the spacing you choose.
      </p>
      <p>
        Before you start, know what the tool is for: blank grids,
        nothing else. No numbered axes, no labels, no title block,
        and no filled example. The grid is the whole page, and the
        labelling, the axes, and the drawing are yours to add by
        hand after printing.
      </p>

      <h2>One even grid — and what that means</h2>
      <p>
        Every horizontal and vertical line on the page uses the same
        spacing, so every cell is a true square in the preview and
        in the downloaded file. The spacing control runs from 2 to
        30 mm in 0.25 mm steps, with 5 mm as the default. Three
        presets cover the usual choices: 5 mm, 1 cm, and quarter
        inch — stored as exactly 6.35 mm.
      </p>
      <p>
        The line weight control sets how heavy the lines print,
        from 0.05 to 1 mm in 0.05 mm steps, with 0.16 mm as the
        default. Lighter lines suit a faint guide; heavier lines
        suit pencil work or a grid that will be photocopied. The
        grid is drawn in a single colour — the pattern colour, pale
        blue by default — and the background is white by default
        and can be changed. One honest detail: the studio also shows
        an accent colour picker, but changing it does nothing on
        this page, because the grid has only one colour of line.
      </p>
      <p>
        There are no heavier major lines: every line is the same
        weight. If you need a bold line every five or ten squares,
        the engineering paper generator draws minor, major, and
        bold divisions for that job. What this page does instead is
        tell you exactly how many squares you are getting. Above the preview, a live count reads
        something like “38 × 55 = 2,090 squares on A4 (portrait)”,
        and it updates the moment you change the spacing, the
        paper size, or the margins. With the default 12 mm
        margins, 5 mm spacing gives 2,090 squares on A4; 2 mm gives
        12,878; and 1 cm gives 532. Use the count before you print —
        if the chart needs 40 squares across and the count says 38,
        widen the paper or shrink the spacing.
      </p>

      <h2>How to print graph paper in five steps</h2>

      <h3>Step 1 — Pick the spacing</h3>
      <p>
        Start with a preset, then adjust only if the work demands
        it. 5 mm is the right default for school maths, charts, and
        diagrams: the squares are small enough to hold a full
        calculation and large enough to write a digit in. 1 cm
        suits young learners and big diagrams. 2 mm suits dense plots
        and fine detail, where a 5 mm grid would run out of room.
        Quarter inch suits anyone matching US school paper. If none
        of those fits, type any spacing from 2 to 30 mm, in 0.25 mm
        steps. Pick the spacing by what one square will stand for —
        one square per unit keeps the counting honest.
      </p>

      <h3>Step 2 — Choose the paper size, orientation, and margins</h3>
      <p>
        The generator offers five paper sizes — A3, A4, A5, US
        Letter, and US Legal — in portrait or landscape. The
        default is A4 in portrait, which suits most school and
        homework use. A5 suits a small notebook or a pocket pad,
        and A3 suits a classroom wall chart or a poster.
        Landscape suits a bar chart with many categories or a
        timeline that runs across the page.
      </p>
      <p>
        Margins are one value applied to all four sides, from 5 to
        40 mm, with 12 mm as the default. Wider margins leave room
        for a hole punch or a binder, and they also shrink the
        grid — the live square count drops as the margins grow,
        because the printable area is the page minus the margins
        on each side.
      </p>

      <h3>Step 3 — Set the line weight and the colours</h3>
      <p>
        Keep the default 0.16 mm line weight unless you have a
        reason to change it. Go lighter — 0.1 mm — for a grid
        that stays in the background behind ink or printed labels.
        Go heavier — 0.3 mm or more — for pencil work, for young
        writers, or for a sheet that will be photocopied.
        The pattern colour draws the grid; pale blue is the
        default and a good one, because it guides the eye without
        fighting with the ink written over it. Inches are
        converted at 25.4 mm per inch, so a quarter inch entered
        in inches is the same 6.35 mm grid.
      </p>

      <h3>Step 4 — Check the count and set the page count</h3>
      <p>
        Read the live square count above the preview before you
        download. It is the check that the sheet will hold the
        work: a bar chart with 12 categories and values up to 30
        needs at least 12 squares across and 30 up, plus room for
        labels. If the count is short, change the spacing or the
        paper size — shrinking the printout later would change the
        size of every square.
      </p>
      <p>
        If you need more than one sheet, set the PDF page count
        before downloading — from 1 to 20 pages per PDF. Print the
        pad once, keep it by the desk, and tear off a sheet
        whenever a calculation needs one.
      </p>

      <h3>Step 5 — Print at actual size and check with a ruler</h3>
      <p>
        Graph paper is only useful if the squares are the size
        they claim to be, so print at Actual size or 100% and turn
        off “Fit to page”, “Shrink to fit”, or any scaling option
        in the print dialog. Those options shrink the page by a
        few percent — harmless for text, but a 5 mm grid printed
        at 96% becomes a 4.8 mm grid, and every measurement taken
        from it is wrong. Print one test page first and measure ten
        squares with a ruler: ten 5 mm squares should span exactly
        50 mm.
      </p>
      <p>
        Mind the paper size as well. An A4 PDF printed on US
        Letter paper at 100% loses the bottom 17.6 mm, and a
        Letter PDF printed on A4 leaves a gap — regenerate the
        sheet in the size your printer holds instead of scaling.
        Under the preview there are four buttons: Download PDF,
        Download PNG, Download SVG, and Print. The PDF is the
        usual choice for a printed set — it is vector, so the lines
        stay sharp, and it carries the page count you set. The PNG
        suits sharing, at 150 DPI for a draft or 300 DPI for print
        quality, and the SVG suits editing in a drawing program.
      </p>

      <h2>Worked example: a bar chart from a class survey</h2>
      <p>
        Take a class of 30 pupils asked for their favourite fruit.
        The results are: apples 12, bananas 9, oranges 6, and
        grapes 3. On a 5 mm grid, let one square stand for one
        pupil. Draw the axes by hand — the tool prints no axes —
        leaving room for the fruit names below and the numbers on
        the left. Then build each bar one square at a time: apples
        rises 12 squares, bananas 9, oranges 6, and grapes 3.
        Leave one empty square between bars so they read as
        separate columns, and write the title at the top by hand.
      </p>
      <p>
        The grid does the arithmetic for you. The tallest bar is
        12 squares, so the chart needs at least 12 squares of
        height plus room for labels — the live count says a 5 mm
        A4 sheet gives 55 squares down, so there is room to spare.
        Count the squares in any bar and you have the number, with
        no scale to misread.
      </p>

      <h2>Worked example: plotting a straight line</h2>
      <p>
        A square grid is also the fastest way to see what an
        equation means. Take y = 2x + 1, and let one square stand
        for one unit on both axes. Make a small table first: when
        x is −2, y is −3; when x is −1, y is −1; when x is 0, y
        is 1; when x is 1, y is 3; when x is 2, y is 5. Then draw
        the axes by hand near the middle of the page, mark the
        points one square at a time, and join them with a ruler —
        the straight line appears.
      </p>
      <p>
        Two checks keep the plot honest. First, the line should
        pass through (0, 1): if it does not, a point was plotted
        on the wrong square. Second, every step of one square
        across should rise two squares up — that is what the 2
        in 2x + 1 means.
      </p>

      <h2>Counting area, square by square</h2>
      <p>
        Area is where a square grid earns its keep, because it
        turns a formula into something you can count. Draw a
        rectangle 6 squares wide and 4 squares tall on a 5 mm
        grid. Count the squares: 24. Each square is 5 mm by 5 mm,
        so the rectangle is 30 mm by 20 mm, and 30 times 20 is
        600 square millimetres — 6 square centimetres.
      </p>
      <p>
        The method also handles shapes with no neat formula. Draw
        an L-shape, count the full squares inside it, then count
        the half squares along the stepped edge and add half their
        number. The grid makes the estimate visible — you can see
        exactly which squares were counted and which were halved —
        and a finer grid makes it more accurate, because the half
        squares matter less.
      </p>

      <h2>Enlarging a drawing, one square at a time</h2>
      <p>
        The same grid that measures can also copy. Draw a small
        picture on a 5 mm grid — a rocket, a flower, a simple
        smiley face made of filled squares, eight squares wide
        and eight tall — and then copy it square by square onto a
        1 cm grid. Each square on the small drawing becomes one
        square on the large one, so the picture comes out exactly
        twice as wide and twice as tall, with every proportion
        kept.
      </p>

      <h2>When a square grid is not the right paper</h2>
      <p>
        A plain square grid suits most jobs, but not every job.
        For plotting coordinates, use the{" "}
        <Link
          href="/tools/coordinate-plane-generator"
          className="font-bold text-brand-teal hover:underline"
        >
          coordinate plane generator
        </Link>
        , which adds numbered axes and quadrants — the grid on
        this page prints no numbers, so every axis has to be
        drawn and labelled by hand. For sketching in three
        dimensions, use the{" "}        <Link
          href="/tools/isometric-paper-generator"
          className="font-bold text-brand-teal hover:underline"
        >
          isometric paper generator
        </Link>
        , which draws a triangle grid instead of squares. For
        charts spanning wide ranges, use the{" "}
        <Link
          href="/tools/semi-log-paper-generator"
          className="font-bold text-brand-teal hover:underline"
        >
          semi-log paper generator
        </Link>
        , because a plain square grid cannot show a range from 1
        to 10,000 on one page. And for calculations that need
        bold lines every five or ten squares, use the{" "}
        <Link
          href="/tools/engineering-paper-generator"
          className="font-bold text-brand-teal hover:underline"
        >
          engineering paper generator
        </Link>
        , which draws minor, major, and bold divisions.
      </p>

      <h2>More paper on the same site</h2>
      <p>
        Graph paper is one paper in a set. When the work is
        writing rather than drawing, the{" "}
        <Link
          href="/tools/lined-paper-generator"
          className="font-bold text-brand-teal hover:underline"
        >
          lined paper generator
        </Link>{" "}
        makes plain ruled paper in narrow, college, wide, or
        extra-wide ruling. For younger writers who still need
        help with letter heights, the{" "}
        <Link
          href="/tools/handwriting-practice-paper"
          className="font-bold text-brand-teal hover:underline"
        >
          handwriting practice paper generator
        </Link>{" "}
        builds three-line rows with a dashed midline, and the{" "}
        <Link
          href="/guides/handwriting-practice"
          className="font-bold text-brand-teal hover:underline"
        >
          handwriting practice guide
        </Link>{" "}
        explains how to use them. The{" "}
        <Link
          href="/guides/cornell-notes"
          className="font-bold text-brand-teal hover:underline"
        >
          Cornell notes guide
        </Link>{" "}
        shows how to set up a page with a cue column, a notes
        area, and a summary box.
      </p>

      <h2>What the graph paper generator does not do</h2>
      <p>
        An honest note, because it shapes what you should expect.
        This generator makes blank square grids, and nothing else:
        no numbered axes, no labels, no title block, no heavier
        major lines, no log scales, and no Word document. Draw
        the axes and write the title by hand after printing. The
        page does not save your settings either — leave it and
        they reset to the defaults, so note the spacing and paper
        size you settled on. Reset restores 5 mm on A4.
      </p>
    </>
  );
}
