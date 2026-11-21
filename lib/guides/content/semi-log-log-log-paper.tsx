import Link from "next/link";

/**
 * Guide #12 — "How to Print Semi-Log and Log-Log Graph Paper".
 *
 * Every capability claim here was checked against the real tools before
 * writing (lib/paper-generators.ts, semi-log-paper-generator and
 * log-log-paper-generator entries, plus lib/paper-generator-engine.ts,
 * "semi-log" / "log-log" branch and logarithmicPositions, and
 * components/paper/PaperGeneratorStudio.tsx):
 * the semi-log tool has one logarithmic axis and one linear axis —
 * Logarithmic decades run from 1 to 6 in whole numbers, default 3;
 * Linear spacing runs from 3 to 25 mm in 0.25 mm steps, default
 * 5 mm; Minor line weight runs from 0.05 to 1 mm in 0.05 mm steps,
 * default 0.16 mm; the Logarithmic axis option is Horizontal (x) or
 * Vertical (y), default x; presets are "3-cycle x", "4-cycle x", and
 * "3-cycle y"; the log-log tool has Horizontal decades 1–6 and
 * Vertical decades 1–6, defaults 3 horizontal and 4 vertical, and
 * NO linear-spacing control; its presets are "3 × 3 cycles",
 * "3 × 4 cycles", and "4 × 4 cycles"; the engine stretches the
 * chosen number of cycles evenly across the full printable length,
 * so every decade is the same width (printable length divided by
 * cycles), and within each decade the minor lines sit at log10(2)
 * through log10(9) — the "2" line at 30.1% across the decade, "3"
 * at 47.7%, "4" at 60.2%, "5" at 69.9%, "6" at 77.8%, "7" at
 * 84.5%, "8" at 90.3%, and "9" at 95.4%; decade boundary lines
 * are drawn in the accent colour at 1.8 times the minor line
 * weight, minor lines in the pattern colour; the pattern colour
 * defaults to #8fb3da and the accent colour to #385f8d, and the
 * accent colour DOES affect these pages, unlike the plain graph
 * paper page; the linear axis on the semi-log tool draws a line
 * every linearSpacingMm, and every 5th line is a major line in the
 * accent colour at 1.8 times the weight — with the default 5 mm on
 * A4 portrait (273 mm printable height) that is 55 lines, 11 of
 * them major; decade widths on A4 portrait with the default 12 mm
 * margins (printable 186 mm wide by 273 mm tall): log axis x, 3
 * cycles gives 62 mm per decade, 4 cycles 46.5 mm, 2 cycles 93 mm,
 * 1 cycle 186 mm, 6 cycles 31 mm; log axis y, 3 cycles gives 91 mm
 * per decade; A4 landscape (printable width 273 mm), 3 cycles
 * gives 91 mm per decade; US Letter portrait (printable width
 * 191.9 mm), 3 cycles gives about 64 mm per decade; log-log
 * default 3 × 4 on A4 portrait gives 62 mm horizontal decades
 * and 68.25 mm vertical decades; the shared studio offers five
 * paper sizes — A3, A4, A5, US Letter, and US Legal — in portrait
 * or landscape, default A4 portrait; margins are one value applied
 * to all four sides, from 5 to 40 mm, default 12 mm; measurements
 * can be entered in millimetres or inches at 25.4 mm per inch;
 * there is a live preview and a Reset button that restores the
 * defaults; export is Download PDF (vector, page count 1–20),
 * Download PNG (150 DPI draft or 300 DPI print), Download SVG
 * (vector), and Print (browser print, with the page size set to
 * the sheet size); the tools are free, need no account, and run
 * entirely in the browser. What the tools do NOT do: NO numeric
 * labels are printed on the log axis — the engine computes decade
 * labels but never draws them, so the sheet prints lines only and
 * the decades are labelled by hand; NO axis titles; NO plotted
 * data or curves — the tools print blank paper only; NO live
 * square or line count readout for these two tools — the studio
 * shows one only for lined and square graph paper; NO Word
 * (.docx) export; settings are NOT saved — they live in component
 * state only, and leaving the page resets them, while Reset
 * restores the defaults above; log-log has no linear spacing
 * control; the maximum is 6 cycles per axis, so data spanning
 * more than 6 decades on one axis does not fit on one sheet. Uses
 * from the tool definitions: semi-log suits exponential growth
 * and decay, frequency-response plots, and scientific data spanning
 * several magnitudes; log-log suits power-law relationships,
 * scientific scaling analysis, and wide-range engineering data.
 * The registry description was honest and needed no correction:
 * the guide covers both papers, and the tools do print semi-log
 * and log-log paper with a choice of scale, spacing, and page
 * size.
 */

export const semiLogLogLogPaperFaqs: readonly {
  question: string;
  answer: string;
}[] = [
  {
    question: "Why do the lines bunch up on a log axis?",
    answer:
      "Because the spacing is logarithmic, not even. Inside each decade the lines sit at log10(2) through log10(9), so the “2” line falls 30.1% across the decade, “3” at 47.7%, and “9” at 95.4%. The lines crowd together towards the top of the decade, and that bunching is the point — it is what lets one axis cover a range from 1 to 10,000.",
  },
  {
    question: "Which axis should be logarithmic on semi-log paper?",
    answer:
      "Put the log axis on the quantity that spans several magnitudes. For growth over time, that is usually the vertical axis — choose “3-cycle y” so time runs evenly along the bottom and the growing quantity runs up the log axis. For a frequency response, the frequency usually goes on the horizontal log axis, so the default “3-cycle x” is the right start.",
  },
  {
    question: "How many cycles fit on one sheet?",
    answer:
      "From 1 to 6 per axis. On A4 portrait with the default 12 mm margins, the printable width is 186 mm, so 3 cycles gives 62 mm per decade, 4 cycles gives 46.5 mm, and 6 cycles gives 31 mm. A decade narrower than about 30 mm is hard to plot on by hand, so 3 or 4 cycles is the practical limit for most work.",
  },
  {
    question: "Are the decades labelled on the printed sheet?",
    answer:
      "No. The sheet prints lines only — no numbers, no axis titles, and no decade labels. The decade boundary lines are heavier and drawn in the accent colour, so you can see where each decade starts and ends, but you write the values (1, 10, 100, 1,000…) along the axis by hand after printing.",
  },
  {
    question: "Does semi-log paper print at true size?",
    answer:
      "Yes, if you print at Actual size or 100% and turn off Fit to page. Check with a ruler: on a 3-cycle A4 portrait sheet with the default margins, each decade should measure exactly 62 mm wide. If it does not, the printer scaled the page — go back to the print dialog and choose Actual size.",
  },
  {
    question: "What is the difference between semi-log and log-log paper?",
    answer:
      "Semi-log paper has one logarithmic axis and one linear axis, so it straightens exponential growth and decay. Log-log paper has a logarithmic axis on both sides, so it straightens power laws such as y = x². If only one of your quantities spans several magnitudes, use semi-log; if both do, use log-log.",
  },
];

export function SemiLogLogLogPaperGuideBody() {
  return (
    <>
      <p>
        Some data will not fit on ordinary graph paper: a quantity growing from 1 to 10,000 needs ten thousand squares on a plain grid. Semi-log and
        log-log paper solve that by spacing the lines unevenly on
        purpose. This guide walks through the{" "}
        <Link
          href="/tools/semi-log-paper-generator"
          className="font-bold text-brand-teal hover:underline"
        >
          Semi-Log Paper Generator
        </Link>{" "}
        and the{" "}
        <Link
          href="/tools/log-log-paper-generator"
          className="font-bold text-brand-teal hover:underline"
        >
          Log-Log Paper Generator
        </Link>{" "}
        on this site. Both are free, need no account, and print
        blank log paper at the scale you choose.
      </p>
      <p>
        These tools print blank paper, nothing else: no numbers on the axes, no axis titles, no plotted points, and no curves. The labelling and plotting are yours to add by hand, as the worked examples below show.
      </p>

      <h2>What semi-log paper is</h2>
      <p>
        Semi-log paper has one logarithmic axis and one linear
        axis. The logarithmic axis is divided into decades — one
        factor of ten each, from 1 to 10, then 10 to 100, then
        100 to 1,000 — and each decade takes up the same width on
        the page, however large the numbers get. The linear axis
        is divided evenly, with a heavier line every fifth one.
        One axis can hold 1 to 10,000 while the other stays ordinary.
      </p>
      <p>
        The generator lets you choose which axis is logarithmic:
        Horizontal (x) or Vertical (y), with x as the default.
        Decades run from 1 to 6 in whole numbers, default 3, and
        linear spacing from 3 to 25 mm in 0.25 mm steps, default
        5 mm. Three presets cover the usual choices: “3-cycle x”,
        “4-cycle x”, and “3-cycle y”. A cycle is one decade, so
        “3-cycle” means a range of a thousandfold, such as 1 to
        1,000. Semi-log suits exponential growth and decay, frequency-response plots, and data spanning several magnitudes.
      </p>

      <h2>What log-log paper is</h2>
      <p>
        Log-log paper has a logarithmic axis on both sides, holding a thousandfold range in each direction at once. Each axis has its own control, from 1 to 6
        decades, with 3 horizontal and 4 vertical as the defaults.
        Three presets cover the usual choices: “3 × 3 cycles”,
        “3 × 4 cycles”, and “4 × 4 cycles”.
      </p>
      <p>
        Log-log has no linear spacing control, because there is no
        linear axis to space. The minor line weight is the same on
        both tools, from 0.05 to 1 mm in 0.05 mm steps, default
        0.16 mm. Log-log suits power laws, scaling analysis, and wide-range engineering data.
      </p>

      <h2>How to read a log axis</h2>
      <p>
        A log axis looks strange at first, and the strangeness has
        one cause: the lines are not evenly spaced. Inside each
        decade the minor lines sit at the logarithms of 2 through
        9. The “2” line sits 30.1% of the way across the decade,
        “3” at 47.7%, “4” at 60.2%, “5” at 69.9%, “6” at 77.8%,
        “7” at 84.5%, “8” at 90.3%, and “9” at 95.4%. The lines
        bunch towards the far end, then the pattern repeats exactly
        in the next decade.
      </p>
      <p>
        That bunching is the whole trick. On a linear axis the
        distance from 1 to 2 equals the distance from 9 to 10, so
        a range of 1 to 10,000 needs ten thousand equal steps. On
        a log axis the distance from 1 to 2 equals the distance
        from 10 to 20 and from 100 to 200, because a doubling always takes the same 30.1% of a decade. The axis measures ratios, not differences.
      </p>
      <p>
        The common beginner mistake is reading the “2” line as the
        halfway mark. It is less than a third of the way across:
        the halfway point of a decade is about 3.16, between the
        “3” and “4” lines. Learn the shape instead: a wide gap,
        then lines crowding closer, then a heavy boundary line,
        then the same shape again. Each decade starts and ends
        with a boundary line in the accent colour — deep blue by
        default — at 1.8 times the minor line weight. The accent colour picker genuinely affects these pages — unlike the plain graph paper page.
      </p>

      <h2>How to choose cycles and the log axis direction</h2>
      <p>
        First, count the decades: 1 to 1,000 is three decades, so choose 3 cycles; 0.1 to 10,000 is five. The generator allows 1 to 6
        cycles per axis, and data spanning more than 6 decades on
        one axis does not fit on one sheet. Do not choose more
        cycles than needed: extra decades shrink every decade, and
        one narrower than about 30 mm is hard to plot on by hand.
      </p>
      <p>
        Second, work out the decade width: printable length divided
        by cycles, because the engine stretches the cycles evenly
        across the full printable length. On A4 portrait with the
        default 12 mm margins the printable area is 186 mm wide
        and 273 mm tall. With the log axis horizontal, 3 cycles
        gives 62 mm per decade, 4 gives 46.5 mm, 2 gives 93 mm,
        1 gives the full 186 mm, and 6 gives 31 mm. With the log
        axis vertical, 3 cycles gives 91 mm per decade. 
      </p>
      <p>
        Third, put the log axis on the quantity that spans several magnitudes. For growth over
        time that is usually the vertical axis — choose “3-cycle
        y”, so time runs evenly along the bottom and the growing
        quantity runs up the log axis, and a straight line means
        steady exponential growth. For a frequency response the
        frequency usually goes on the horizontal log axis, so the
        default “3-cycle x” is the right start. On the log-log
        tool, set the axes independently: the default 3 by 4 gives
        62 mm horizontal decades and 68.25 mm vertical decades on
        A4 portrait.
      </p>

      <h2>How to print semi-log and log-log paper in five steps</h2>

      <h3>Step 1 — Pick the tool and the preset</h3>
      <p>
        Start with the right tool: the{" "}
        <Link
          href="/tools/semi-log-paper-generator"
          className="font-bold text-brand-teal hover:underline"
        >
          Semi-Log Paper Generator
        </Link>{" "}
        when one quantity spans several magnitudes, the{" "}
        <Link
          href="/tools/log-log-paper-generator"
          className="font-bold text-brand-teal hover:underline"
        >
          Log-Log Paper Generator
        </Link>{" "}
        when both do. Then pick the nearest preset: “3-cycle x” for a frequency plot, “4-cycle x” for a wider range, “3-cycle y” for growth over time; on log-log, “3 × 3 cycles” is the everyday choice, “3 × 4 cycles” the default, “4 × 4 cycles” for a wide range in both directions.
      </p>

      <h3>Step 2 — Set the cycles, the axis, and the linear spacing</h3>
      <p>
        On the semi-log tool, set the Logarithmic decades (1 to 6) to the decades your data spans, and the Logarithmic axis to Horizontal (x) or Vertical (y). Then set the Linear spacing for the other axis: 5 mm is the default, 3 mm suits dense plots, and 10 mm or more suits big charts. Every fifth line is a major line in the accent colour at 1.8 times the weight — with the default 5 mm on A4 portrait, the vertical side holds 55 lines, 11 of them major. On the
        log-log tool there is no linear spacing: set the Horizontal
        and Vertical decades independently, each from 1 to 6.
      </p>

      <h3>Step 3 — Choose the paper size, orientation, and margins</h3>
      <p>
        Both tools share the same studio: five paper sizes — A3,
        A4, A5, US Letter, and US Legal — in portrait or
        landscape, defaulting to A4 portrait. A5 suits a small notebook, though 3 cycles gives only about 41 mm per decade there. Margins are one value for all four sides, from 5 to 40 mm, default 12 mm: wider margins shrink the printable area, which means narrower decades. Measurements
        can be entered in millimetres or inches, at 25.4 mm per
        inch.
      </p>

      <h3>Step 4 — Set the line weight and the colours</h3>
      <p>
        Keep the default 0.16 mm line weight unless you have a reason to change it: 0.1 mm to stay behind ink, 0.3 mm or more for pencil work or photocopying. The decade boundaries are always 1.8 times
        the minor weight, so they stay visibly heavier. The pattern
        colour draws the minor lines and the accent colour the
        decade boundaries and major lines — pale blue and deep blue
        by default. The background is white by default.
      </p>

      <h3>Step 5 — Download and print at actual size</h3>
      <p>
        Under the preview are four buttons: Download PDF, Download
        PNG, Download SVG, and Print. The PDF is the usual choice
        — vector, so the lines stay sharp, with a page count from
        1 to 20, so one download can print a whole pad of
        identical sheets. The PNG suits sharing (150 DPI draft, 300 DPI print), and the SVG suits editing in a drawing program. Print at Actual size or 100% with “Fit to page” off: a 62 mm decade comes out at 59.5 mm at 96%. Print one test page and measure a decade with a ruler — on a 3-cycle A4 portrait sheet with the default margins it should be exactly 62 mm.
      </p>

      <h2>Worked example: exponential growth on semi-log paper</h2>
      <p>
        Take a colony doubling every hour from a single cell: 0 hours, 1 cell; 1 hour, 2; 2 hours, 4; 3 hours, 8; 4 hours, 16; 5 hours, 32. On plain graph paper this is a curve
        shooting off the top of the page — by hour 10 the count
        would be 1,024 times the start. On semi-log paper it
        becomes a straight line, and the straightness is the proof
        that the growth is truly exponential.
      </p>
      <p>
        Print a sheet with the “3-cycle y” preset: 3 decades on
        the vertical axis, 5 mm linear spacing horizontally, A4
        portrait. The vertical axis covers three decades — say 1
        to 1,000 — each 91 mm tall. Label the decades by hand: 1 at the bottom boundary, 10 at the next heavy line, 100 at the next, 1,000 at the top. Then label the horizontal axis, one hour per 5 mm
        line, and plot: hour 0 at 1, hour 1 at 2 (30.1% up the
        first decade), hour 2 at 4 (60.2%), hour 3 at 8 (90.3%,
        just below the 10 line), hour 4 at 16 (the “6” line of the
        second decade), hour 5 at 32 (the “3” line of the second
        decade). Join the points and a straight line appears.
      </p>
      <p>
        Two checks keep the plot honest: the line should pass through (0, 1), and doubling the value should always move the point up by the same distance — if the steps vary, the growth is not truly exponential.
      </p>

      <h2>Worked example: a power law on log-log paper</h2>
      <p>
        Now take the area of a square as its side grows: sides 1,
        2, 3, 4, and 5 units give areas 1, 4, 9, 16, and 25 — that
        is y = x², a power law. On plain graph paper this is a
        curve bending upwards. On log-log paper it becomes a
        straight line, and the slope of that line is the power
        itself: 2, for a square law.
      </p>
      <p>
        Print a sheet with the default “3 × 4 cycles” preset: 3 decades across, 4 up, A4 portrait — 62 mm horizontal decades, 68.25 mm vertical. Label both axes by hand: 1 at the first boundary, 10 at the next heavy line, 100 at the next — and 1,000 up the vertical side. Plot the
        points: (1, 1) on the corner where both axes read 1;
        (2, 4) at the “2” line across and the “4” line up;
        (3, 9) at the “3” line across and the “9” line up, just
        below the 10 boundary; (4, 16) at the “4” line across and
        the “6” line of the second vertical decade; (5, 25) at the “5” line across and a little past the “2” line of the second vertical decade. Join them and a straight line appears,
        rising twice as fast as it runs: for every decade across,
        it climbs two decades up. That slope of 2 is the exponent.
      </p>
      <p>
        That slope test is how scientists use log-log paper: plot the measurements, check for a straight line, and read the slope — the slope is the power. If the points bend, the relationship is not a power law, and no rescaling will straighten it.
      </p>

      <h2>Semi-log vs log-log vs plain graph paper</h2>
      <p>
        If neither quantity spans several magnitudes — a bar chart, a straight-line graph, a shape to measure — use the{" "}
        <Link
          href="/tools/graph-paper-generator"
          className="font-bold text-brand-teal hover:underline"
        >
          graph paper generator
        </Link>
        , which prints one even grid, and read the{" "}
        <Link
          href="/guides/graph-paper"
          className="font-bold text-brand-teal hover:underline"
        >
          graph paper guide
        </Link>{" "}
        for the steps. One quantity spanning several magnitudes means semi-log; both means log-log.
      </p>
      <p>
        Two other papers in the same set cover neighbouring jobs.
        For coordinates with numbered axes and quadrants, use the{" "}
        <Link
          href="/tools/coordinate-plane-generator"
          className="font-bold text-brand-teal hover:underline"
        >
          coordinate plane generator
        </Link>
        , which prints the axes and numbers log paper leaves out.
        For calculations needing bold lines every five or ten
        squares, use the{" "}
        <Link
          href="/tools/engineering-paper-generator"
          className="font-bold text-brand-teal hover:underline"
        >
          engineering paper generator
        </Link>
        , which draws minor, major, and bold divisions. For writing rather than plotting, the{" "}
        <Link
          href="/tools/lined-paper-generator"
          className="font-bold text-brand-teal hover:underline"
        >
          lined paper generator
        </Link>{" "}
        makes plain ruled paper — the{" "}
        <Link
          href="/guides/lined-paper"
          className="font-bold text-brand-teal hover:underline"
        >
          lined paper guide
        </Link>{" "}
        covers the ruling.
      </p>

      <h2>What the semi-log and log-log generators do not do</h2>
      <p>
        An honest note, because it shapes what you should expect.
        These generators make blank log paper, and nothing else:
        no numeric labels on the axes, no axis titles, no plotted
        data or curves, and no Word document. The decade boundaries are heavier, so you can find them, but the numbers — 1, 10, 100, 1,000 — are yours to write by hand. There is no live count for these two tools, so work out the decade widths from the figures in this guide. The pages
        do not save your settings — leave the page and they reset,
        so note the cycles, axis, and paper size you settled on.
        Reset restores 3 cycles, log axis x, and 5 mm spacing on the semi-log tool, and 3 × 4 cycles on the log-log tool. The limit is 6 cycles per axis.
      </p>
    </>
  );
}
