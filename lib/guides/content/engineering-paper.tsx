import Link from "next/link";

/**
 * Guide #15 — "How to Print Engineering Paper".
 *
 * Every capability claim here was checked against the real tool before
 * writing (lib/paper-generators.ts, engineering-paper-generator entry,
 * plus lib/paper-generator-engine.ts, "engineering" branch, and
 * components/paper/PaperGeneratorStudio.tsx): minor spacing runs from
 * 1 to 10 mm in 0.25 mm steps, default 2 mm; "Major every" runs from 2
 * to 10, default 5; "Bold every" runs from 5 to 20, default 10; minor
 * line weight runs from 0.05 to 0.6 mm in 0.05 mm steps, default
 * 0.1 mm. The engine steps lines from the top-left edge of the
 * printable area, index i starting at 0: a line is bold when
 * i % boldEvery === 0, major when i % majorEvery === 0, and bold wins
 * where both apply — so because i = 0 counts as both, the very first
 * line along the top and left edges is a bold line. Bold lines are
 * 2.2x the minor weight in fixed dark blue #294f78; major lines are
 * 1.5x in the accent colour (default #385f8d, changeable in the
 * studio); minor lines are 1x in the pattern colour (default pale
 * blue #8fb3da). The nesting is only clean when Bold every is a
 * multiple of Major every — for example major 5 / bold 10. If bold is
 * not a multiple of major (for example major 3, bold 7), some bold
 * lines fall between major lines instead of on them. Presets: "2 mm /
 * 10 mm" (minor 2, major every 5, so major blocks are 10 mm), "1 mm /
 * 5 mm" (minor 1, major every 5, so major blocks are 5 mm), and
 * "5 mm / 25 mm" (minor 5, major every 5, so major blocks are 25 mm).
 * Presets do NOT change Bold every — it stays at the default 10
 * minor cells unless the user changes it, so the three presets give
 * bold blocks of 20 mm, 10 mm, and 50 mm respectively. The shared
 * studio offers five paper sizes — A3, A4, A5, US Letter, and US
 * Legal — in portrait or landscape, defaulting to A4 portrait;
 * margins are one value for all four sides, from 5 to 40 mm,
 * default 12 mm; measurements can be entered in millimetres or
 * inches at 25.4 mm per inch; there is a live preview and a Reset
 * button that restores the defaults (2 mm minor, major 5, bold 10,
 * 0.1 mm weight, A4 portrait, 12 mm margins); export is Download
 * PDF (vector, page count 1–20), Download PNG (150 DPI draft or
 * 300 DPI print), Download SVG (vector), and Print; the tools are
 * free, need no account, and run entirely in the browser. The
 * tool's stated uses are engineering paper for calculations,
 * technical diagrams, and laboratory notebooks. Derived counts
 * below are labelled "about" — the tool shows no live count for
 * engineering paper (verified in PaperGeneratorStudio.tsx lines
 * 32–60: the readout is computed only for lined-paper-generator and
 * graph-paper-generator, and returns null for every other tool).
 * On A4 portrait with the default 12 mm margins the printable area
 * is 186 mm wide and 273 mm tall (210 − 24 = 186; 297 − 24 = 273).
 * The engine includes both edges because it steps while
 * x <= right + 0.001, so the count is floor(width ÷ spacing) + 1.
 * At the default 2 mm minor spacing: vertical lines
 * floor(186 ÷ 2) + 1 = 93 + 1 = 94 (0–186 mm), horizontal lines
 * floor(273 ÷ 2) + 1 = 136 + 1 = 137 (0–272 mm); major lines every
 * 5th (10 mm apart): vertical indices 0, 5, …, 90 = 19, horizontal
 * indices 0, 5, …, 135 = 28; bold lines every 10th (20 mm apart):
 * vertical indices 0, 10, …, 90 = 10, horizontal indices 0, 10, …,
 * 130 = 14; minor squares (94 − 1) × (137 − 1) = 93 × 136 = 12,648.
 * At 5 mm spacing: vertical floor(186 ÷ 5) + 1 = 37 + 1 = 38,
 * horizontal floor(273 ÷ 5) + 1 = 54 + 1 = 55. At 1 mm spacing:
 * vertical floor(186 ÷ 1) + 1 = 187, horizontal
 * floor(273 ÷ 1) + 1 = 274. What the tool does NOT do: NO live
 * count readout for this tool — the studio shows one only for lined
 * paper and square graph paper, so work counts out from the spacing
 * as this guide does; NO numbered axes, labels, or title block; NO
 * pre-drawn content — blank paper only, you write the calculation;
 * NO .docx export; settings are NOT saved — leaving the page resets
 * them, while Reset restores the defaults above. The registry
 * description was honest and needed no correction: the tool does
 * print engineering paper with a chosen grid for calculations and
 * sketches at actual size.
 */

export const engineeringPaperFaqs: readonly {
  question: string;
  answer: string;
}[] = [
  {
    question: "What is engineering paper, and how is it different from graph paper?",
    answer:
      "Engineering paper is graph paper with a hierarchy: fine minor lines, heavier major lines every few squares, and still heavier bold lines every few major blocks. The three weights let you read a calculation at a glance — one digit per minor square, one number per major block, one step of the working per bold block — without counting lines. Ordinary graph paper has one even grid, so every line looks the same and a long sum is easy to lose your place in. The guide's comparison section explains when each one is the right choice.",
  },
  {
    question: "How many squares fit on one A4 sheet of engineering paper?",
    answer:
      "It depends on the spacing, and the counts below are approximate — the tool shows no live count for engineering paper. On A4 portrait with the default 12 mm margins the printable area is 186 mm wide and 273 mm tall. At the default 2 mm spacing, about 94 vertical lines and 137 horizontal lines fit, giving 93 × 136 = 12,648 minor squares; major lines fall every 10 mm (19 vertical, 28 horizontal) and bold lines every 20 mm (10 vertical, 14 horizontal). At 5 mm spacing, about 38 vertical and 55 horizontal lines; at 1 mm, about 187 vertical and 274 horizontal lines. Pick the spacing by the size of your handwriting and the length of the calculation, not by the count.",
  },
  {
    question: "Why are the bold lines not always on top of major lines?",
    answer:
      "Because the nesting is only clean when Bold every is a multiple of Major every. The engine draws a line as bold when its index is a multiple of Bold every, and as major when its index is a multiple of Major every. With the defaults — major 5, bold 10 — every bold line is also a major line, because 10 is a multiple of 5. But if you set major 3 and bold 7, the bold lines at indices 7, 14, and 21 fall between major lines instead of on them, and the grid looks muddled. Keep bold a multiple of major: 5 and 10, 4 and 8, or 5 and 15 all work.",
  },
  {
    question: "Which preset should I choose?",
    answer:
      "Start with the default, “2 mm / 10 mm”: 2 mm minor squares with major blocks of 10 mm and bold blocks of 20 mm — the standard engineering pad, good for most calculations. Choose “1 mm / 5 mm” for fine, dense work such as long unit conversions or small handwriting, where the bold blocks are 10 mm. Choose “5 mm / 25 mm” for big, clear working — classroom demonstrations, laboratory notebooks, or a calculation you will present — where the bold blocks are 50 mm. Remember the presets do not change Bold every: it stays at 10 minor cells unless you change it yourself.",
  },
  {
    question: "Can I use engineering paper for a laboratory notebook?",
    answer:
      "Yes — that is one of the tool's stated uses, along with calculations and technical diagrams. The bold blocks give each experiment step or each table its own frame, and the major blocks keep columns of readings aligned. Print a pad of identical sheets with the PDF page count (1–20 pages) so every entry in the notebook looks the same. Two honest limits: the sheet has no numbered axes, labels, or title block, so write the experiment name, date, and page number in by hand; and the page does not save your settings, so note the spacing and margins you settled on.",
  },
  {
    question: "Does engineering paper print at true size?",
    answer:
      "Yes, if you print at Actual size or 100% and turn off Fit to page. Check with a ruler: on a 2 mm sheet, ten minor squares should span exactly 20 mm — the width of one major block — and five major blocks should span exactly 100 mm. If they measure less, the printer scaled the page — go back to the print dialog and choose Actual size. The PDF and SVG files are vector, so they stay sharp at any scale; the only thing that changes the printed size is the print setting, not the file.",
  },
];

export function EngineeringPaperGuideBody() {
  return (
    <>
      <p>
        A long calculation on plain paper drifts. Digits creep out
        of their columns, decimal points wander, and by the third
        line you are no longer sure which number belongs to which
        step. Engineering paper exists to stop that drift: a grid
        with three weights of line — fine, heavier, heaviest —
        that holds every digit in its place. This guide walks
        through the{" "}
        <Link
          href="/tools/engineering-paper-generator"
          className="font-bold text-brand-teal hover:underline"
        >
          Engineering Paper Generator
        </Link>{" "}
        on this site. It is free, needs no account, and prints
        blank engineering paper at the spacing you choose.
      </p>
      <p>
        The generator prints blank paper, nothing else: no
        pre-drawn content, no numbered axes, no labels, and no
        title block. The calculation is yours to write, as the
        worked beam example below shows — the paper only makes
        sure it stays readable.
      </p>

      <h2>What engineering paper is</h2>
      <p>
        Engineering paper is a sheet ruled with a square grid in
        three weights. The lightest lines are the minor grid: one
        small square per digit, so a number written one digit per
        square keeps its columns perfectly straight. Every few
        minor squares a heavier major line marks a block — the
        unit of one number, one term, or one short step. Every
        few major blocks a still heavier bold line frames a
        larger section — one full step of the working, one
        complete equation, or one table.
      </p>
      <p>
        That hierarchy is the whole point of the paper. On an
        ordinary sheet of graph paper every line looks the same,
        so a long sum is a sea of identical squares and it is
        easy to lose your place. On engineering paper the eye can
        find its way back at once: the bold lines say where a
        step starts and ends, the major lines say where a number
        starts and ends, and the minor lines say where a digit
        sits. Engineers, students, and laboratory workers have
        used this layout for generations, because a calculation
        that is easy to read is also easy to check — and a
        calculation that cannot be checked cannot be trusted.
      </p>
      <p>
        The standard use is hand calculation: structural sums,
        electrical work, unit conversions, and laboratory
        readings. The tool&apos;s stated uses are engineering
        paper for calculations, technical diagrams, and
        laboratory notebooks — the three jobs where the grid
        earns its keep. It also suits any sketch that needs
        measured alignment, from a circuit layout to a
        dimensioned part, because the bold blocks give the
        drawing a frame to measure against.
      </p>

      <h2>How the three line weights work</h2>
      <p>
        The generator builds the grid from four settings. Minor
        spacing runs from 1 to 10 mm in 0.25 mm steps and
        defaults to 2 mm — that is the size of one small square.
        “Major every” runs from 2 to 10 and defaults to 5: a
        major line falls every fifth minor line, so with the
        default spacing the major blocks are 10 mm wide. “Bold
        every” runs from 5 to 20 and defaults to 10: a bold line
        falls every tenth minor line, so with the defaults the
        bold blocks are 20 mm wide. Minor line weight runs from
        0.05 to 0.6 mm in 0.05 mm steps and defaults to 0.1 mm —
        light enough to stay behind ink.
      </p>
      <p>
        The three weights are drawn from the line&apos;s position
        in the grid. Lines step from the top-left edge of the
        printable area, counting from zero: a line is bold when
        its index is a multiple of Bold every, and major when its
        index is a multiple of Major every. Where both apply, bold
        wins. Because index zero counts as both, the very first
        line along the top and left edges is a bold line — the
        sheet starts with a frame, not a faint edge. Bold lines
        are drawn 2.2 times the minor weight in a fixed dark blue
        (#294f78), major lines 1.5 times in the accent colour
        (pale blue #385f8d by default, changeable in the studio),
        and minor lines at the chosen weight in the pattern
        colour (pale blue #8fb3da by default).
      </p>
      <p>
        One rule keeps the hierarchy clean: Bold every should be
        a multiple of Major every. With the defaults — major 5,
        bold 10 — every bold line is also a major line, so the
        blocks nest neatly: five minor squares make a major
        block, two major blocks make a bold block. But if you set
        major 3 and bold 7, the bold lines at indices 7, 14, and
        21 fall between major lines instead of on them, and the
        grid looks muddled — bold lines cutting through major
        blocks instead of framing them. Combinations that nest
        cleanly include major 5 with bold 10 or 15, and major 4
        with bold 8 or 12. If the grid ever looks wrong, check
        this pairing first.
      </p>

      <h2>How much fits on one sheet</h2>
      <p>
        On A4 portrait with the default 12 mm margins the
        printable area is 186 mm wide and 273 mm tall. At the
        default 2 mm minor spacing, about 94 vertical lines and
        137 horizontal lines fit, giving 93 by 136 minor squares
        — 12,648 of them. The major lines fall every 10 mm, about
        19 vertical and 28 horizontal; the bold lines fall every
        20 mm, about 10 vertical and 14 horizontal. That is a
        generous sheet: roughly nine bold blocks across and
        thirteen down, each one a 20 mm square that holds a short
        line of working.
      </p>
      <p>
        Change the spacing and the sheet changes with it. At 5 mm
        spacing, about 38 vertical and 55 horizontal lines fit —
        a coarser grid for big, clear handwriting, where each
        bold block is 50 mm wide and holds a whole equation. At 1
        mm spacing, about 187 vertical and 274 horizontal lines
        fit — a fine grid for dense work, where each bold block is
        10 mm wide and the sheet holds thousands of tiny squares.
        These counts are approximate, and the generator shows no
        live count for engineering paper — the studio shows one
        only for lined paper and square graph paper — so work
        them out from the spacing as this guide does. The
        practical lesson is to pick the spacing by the size of
        your handwriting and the length of the calculation, not
        by the count.
      </p>

      <h2>How to choose a preset</h2>
      <p>
        The generator offers three presets, and they cover the
        usual choices. “2 mm / 10 mm” is the default and the
        standard engineering pad: 2 mm minor squares, major
        blocks of 10 mm, bold blocks of 20 mm. It suits most
        calculations — handwriting at a normal size, numbers up
        to six or seven digits, and working that runs a page or
        two. If you are unsure, start here.
      </p>
      <p>
        “1 mm / 5 mm” is for fine, dense work: long unit
        conversions, small handwriting, or a calculation with
        many decimal places, where the bold blocks are 10 mm and
        the sheet holds far more digits. “5 mm / 25 mm” is for
        big, clear working: a classroom demonstration, a
        laboratory notebook entry, or a calculation you will
        present or pin up, where the bold blocks are 50 mm and
        every line stays readable from a distance.
      </p>
      <p>
        One honest note about the presets: they do not change
        Bold every. It stays at the default of 10 minor cells
        unless you change it yourself, so the three presets give
        bold blocks of 20 mm, 10 mm, and 50 mm respectively —
        because 10 cells at 2 mm, 1 mm, and 5 mm are 20, 10, and
        50 mm. If you want a different bold block — say 30 mm
        blocks on the 2 mm grid — set Major every to 5 and Bold
        every to 15 yourself, and check that 15 is a multiple of
        5 so the nesting stays clean.
      </p>

      <h2>How to print engineering paper in five steps</h2>

      <h3>Step 1 — Open the generator and pick a preset</h3>
      <p>
        Open the{" "}
        <Link
          href="/tools/engineering-paper-generator"
          className="font-bold text-brand-teal hover:underline"
        >
          Engineering Paper Generator
        </Link>
        . The presets cover the usual choices: “2 mm / 10 mm”
        for everyday calculations, “1 mm / 5 mm” for fine dense
        work, and “5 mm / 25 mm” for big clear working. The
        default preset is the right start if you are unsure —
        you can change the spacing after seeing the preview.
      </p>

      <h3>Step 2 — Set the spacing, the divisions, and the line weight</h3>
      <p>
        Set the minor spacing to the value your handwriting
        needs, from 1 to 10 mm in 0.25 mm steps. Then set “Major
        every” (2 to 10, default 5) and “Bold every” (5 to 20,
        default 10), keeping bold a multiple of major so the
        blocks nest cleanly. Then set the minor line weight, from
        0.05 to 0.6 mm in 0.05 mm steps, default 0.1 mm. Keep the
        default unless you have a reason to change it: 0.05 mm
        to stay well behind ink, 0.2 mm or more for pencil work
        or photocopying. The bold and major lines scale with the
        minor weight — 2.2 times and 1.5 times — so raising the
        minor weight raises the whole hierarchy together.
      </p>

      <h3>Step 3 — Choose the paper size, orientation, and margins</h3>
      <p>
        The studio offers five paper sizes — A3, A4, A5, US
        Letter, and US Legal — in portrait or landscape,
        defaulting to A4 portrait. A3 suits posters and
        presentations; A5 suits a small notebook. Landscape suits
        wide working such as a long table of readings or a
        dimensioned sketch, because the printable width grows.
        Margins are one value for all four sides, from 5 to 40 mm,
        default 12 mm: wider margins shrink the printable area,
        which means fewer squares on the sheet. Measurements can
        be entered in millimetres or inches, at 25.4 mm per inch.
        The live preview updates as you change the settings, so
        check the block sizes on screen before downloading.
      </p>

      <h3>Step 4 — Set the colours</h3>
      <p>
        The pattern colour draws the minor lines — pale blue by
        default. Change it if you want a different grid colour,
        for example a grey that stays behind pencil work. The
        accent colour draws the major lines — pale blue by
        default, and changeable in the studio. The bold lines
        stay a fixed dark blue whatever you choose, which is by
        design: the bold frame should always be the darkest
        lines on the sheet. Keep the colours pale and the grid
        stays behind your ink, which is exactly where it
        belongs.
      </p>

      <h3>Step 5 — Download and print at actual size</h3>
      <p>
        Under the preview are four buttons: Download PDF, Download
        PNG, Download SVG, and Print. The PDF is the usual choice
        — vector, so the lines stay sharp, with a page count from
        1 to 20, so one download can print a whole pad of
        identical sheets. The PNG suits sharing (150 DPI draft,
        300 DPI print), and the SVG suits editing in a drawing
        program. Print at Actual size or 100% with “Fit to page”
        off: a 2 mm grid printed at 96% becomes a 1.92 mm grid,
        and every measurement taken from it is wrong. Print one
        test page and measure with a ruler — ten minor squares
        should span exactly 20 mm, the width of one major block,
        and five major blocks should span exactly 100 mm.
      </p>

      <h2>Worked example: a beam deflection calculation</h2>
      <p>
        The best way to see the grid working is to lay a real
        calculation on it. Take a steel cantilever beam — a beam
        fixed at one end and free at the other — carrying a 500 N
        load at its free end. The question is how far the free end
        bends down. The formula is the standard cantilever
        deflection, δ = PL³ ÷ 3EI, where P is the load, L is the
        beam length, E is the steel&apos;s stiffness, and I is the
        cross-section&apos;s second moment of area. The beam is
        1.2 m long with a rectangular cross-section 20 mm wide
        and 40 mm deep, and steel has E = 200 GPa.
      </p>
      <p>
        Start at the top of the sheet and give each step its own
        bold block — one bold block per step, so the eye can find
        each step at once. In the first bold block, work out the
        second moment of area. For a rectangle, I = bh³ ÷ 12.
        Write one digit per minor square: b = 20 mm = 0.02 m,
        h = 40 mm = 0.04 m. Then h³ = 0.04³ = 0.000064 m³, b × h³
        = 0.02 × 0.000064 = 0.00000128, and dividing by 12 gives
        I = 1.067 × 10⁻⁷ m⁴. The bold block frames the whole step,
        and the major blocks keep the digits of each number in
        their own columns, so the powers of ten stay aligned.
      </p>
      <p>
        In the second bold block, work out the bending stiffness
        EI. E = 200 GPa = 200 × 10⁹ Pa, and I = 1.067 × 10⁻⁷ m⁴,
        so EI = 200 × 10⁹ × 1.067 × 10⁻⁷ = 21,333 N·m². In the
        third bold block, work out the load term: L = 1.2 m, so
        L³ = 1.728 m³, and PL³ = 500 × 1.728 = 864 N·m³. In the
        fourth bold block, bring it together: δ = 864 ÷ (3 ×
        21,333) = 864 ÷ 64,000 = 0.0135 m, which is 13.5 mm.
        The free end bends down by about 13.5 mm.
      </p>
      <p>
        Two checks keep the calculation honest, and the grid
        makes both easy. First, the units: N·m³ divided by N·m²
        leaves metres, so the answer is a length, as a deflection
        should be. Second, the size: 13.5 mm on a 1,200 mm beam
        is about one percent of the length, which is a sensible
        deflection for a steel beam under a moderate load — if
        the answer had come out as 135 mm or 1.35 mm, a power of
        ten would have slipped somewhere, and the aligned digits
        would show exactly where. That is the real value of the
        paper: it does not do the maths for you, but it makes a
        slipped digit visible before the answer is trusted.
      </p>

      <h2>Engineering paper vs other papers</h2>
      <p>
        If the work is flat and needs no hierarchy — a chart, a
        shape to measure, a floor plan — engineering paper is
        more than you need. Use the{" "}
        <Link
          href="/tools/graph-paper-generator"
          className="font-bold text-brand-teal hover:underline"
        >
          graph paper generator
        </Link>
        , which prints one even square grid, and read the{" "}
        <Link
          href="/guides/graph-paper"
          className="font-bold text-brand-teal hover:underline"
        >
          graph paper guide
        </Link>{" "}
        for the steps. One square grid suits maths, charts, and
        diagrams where every square is equal; the engineering
        grid suits calculations, where the steps are not.
      </p>
      <p>
        Three neighbouring papers cover nearby jobs. For sketching
        a solid object — a bracket, a box, a piece of furniture —
        use the{" "}
        <Link
          href="/guides/isometric-paper"
          className="font-bold text-brand-teal hover:underline"
        >
          isometric paper guide
        </Link>
        , whose grid runs in three directions at 30 degrees. For
        a calculation that spans orders of magnitude, such as a
        decay curve or a frequency response, the{" "}
        <Link
          href="/guides/semi-log-log-log-paper"
          className="font-bold text-brand-teal hover:underline"
        >
          semi-log and log-log paper guide
        </Link>{" "}
        covers paper whose axes are logarithmic. For plotting
        points against two axes, the{" "}
        <Link
          href="/tools/coordinate-plane-generator"
          className="font-bold text-brand-teal hover:underline"
        >
          coordinate plane generator
        </Link>{" "}
        prints a grid with numbered axes. For writing rather than
        calculating, the{" "}
        <Link
          href="/guides/lined-paper"
          className="font-bold text-brand-teal hover:underline"
        >
          lined paper guide
        </Link>{" "}
        covers ruled paper, and the{" "}
        <Link
          href="/guides/cornell-notes"
          className="font-bold text-brand-teal hover:underline"
        >
          Cornell notes guide
        </Link>{" "}
        covers structured note-taking.
      </p>

      <h2>What the engineering paper generator does not do</h2>
      <p>
        An honest note, because it shapes what you should expect.
        This generator makes blank engineering paper, and nothing
        else: no pre-drawn content, no numbered axes or labels,
        and no title block — you write the calculation, the
        experiment name, the date, and the page number in by
        hand. There is no live count for this tool, so work out
        how many lines and squares fit from the figures in this
        guide. There is no Word document export. The page does
        not save your settings — leave the page and they reset,
        so note the spacing, the major and bold divisions, the
        paper size, and the margins you settled on. Reset
        restores 2 mm minor spacing, major every 5, bold every
        10, 0.1 mm line weight, A4 portrait, and 12 mm margins.
        Within those limits, the paper is exact: every square is
        the spacing you chose, every major block holds the same
        number of squares, every bold block holds the same number
        of major blocks, and a calculation written one digit per
        square stays aligned from the first line to the last.
      </p>
    </>
  );
}
