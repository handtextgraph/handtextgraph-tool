import Link from "next/link";

/**
 * Guide #13 — "How to Print Isometric Graph Paper".
 *
 * Every capability claim here was checked against the real tools before
 * writing (lib/paper-generators.ts, isometric-paper-generator entry, plus
 * lib/paper-generator-engine.ts, "isometric" branch, and
 * components/paper/PaperGeneratorStudio.tsx):
 * the tool draws three equally spaced line families — vertical lines plus
 * plus/minus 30-degree lines — via lattice() with angles [90, 30, -30]
 * and perpendicular spacing = spacingMm × √3/2, so the three families
 * form equilateral triangles whose side equals the chosen spacing
 * (7 mm spacing → 7 mm triangle sides, triangle height
 * 7 × √3/2 ≈ 6.06 mm); Axis spacing runs from 3 to 25 mm in 0.25 mm
 * steps, default 7 mm; Line weight runs from 0.05 to 1 mm in 0.05 mm
 * steps, default 0.16 mm; presets are Fine 5 mm, Standard 7 mm, and
 * Large 10 mm; the pattern colour defaults to #8fb3da and the accent
 * colour to #385f8d, but the isometric build passes only the pattern
 * colour — the accent colour picker has NO effect on this page, unlike
 * semi-log/log-log where accent colours the decade lines; uses from
 * the tool definition are 3D product sketches, architecture and block
 * diagrams, and voxel and game-level planning; the shared studio
 * offers five paper sizes — A3, A4, A5, US Letter, and US Legal — in
 * portrait or landscape, defaulting to A4 portrait; margins are one
 * value for all four sides, from 5 to 40 mm, default 12 mm;
 * measurements can be entered in millimetres or inches at 25.4 mm
 * per inch; there is a live preview and a Reset button that restores
 * the defaults; export is Download PDF (vector, page count 1–20),
 * Download PNG (150 DPI draft or 300 DPI print), Download SVG
 * (vector), and Print (browser print, with the page size set to the
 * sheet size); the tools are free, need no account, and run entirely
 * in the browser. Derived counts below are labelled "about" — the
 * tool shows no live count for isometric paper. On A4 portrait with
 * the default 12 mm margins the printable area is 186 mm wide and
 * 273 mm tall: at 7 mm spacing the vertical lines sit 6.06 mm apart,
 * so about 31 vertical lines fit across the width and about 45
 * triangle rows fit down the height; at 5 mm, about 43 vertical
 * lines and 63 rows; at 10 mm, about 22 vertical lines and 32 rows.
 * (Checked arithmetic: 186 ÷ 6.06 ≈ 30.7, 273 ÷ 6.06 ≈ 45.0;
 * 186 ÷ 4.33 ≈ 43.0, 273 ÷ 4.33 ≈ 63.0; 186 ÷ 8.66 ≈ 21.5,
 * 273 ÷ 8.66 ≈ 31.5.) What the tool does NOT do: NO live count
 * readout for this tool — the studio shows one only for lined paper
 * and square graph paper; NO numbered axes or labels on the sheet;
 * NO heavier major lines or bold divisions — use the engineering
 * paper generator for those; NO pre-drawn cubes, objects, or 3D
 * shapes — it prints blank isometric paper only, you draw the
 * object; NO .docx export; settings are NOT saved — leaving the
 * page resets them, while Reset restores the defaults above. The
 * registry description was honest and needed no correction: the
 * tool does print isometric paper for 3D sketches and technical
 * drawing with a chosen triangle spacing and a clean PDF download.
 */

export const isometricPaperFaqs: readonly {
  question: string;
  answer: string;
}[] = [
  {
    question: "Why 30 degrees? Why not 45?",
    answer:
      "Because 30 degrees keeps all three axes honest. The three axes of an isometric drawing sit 120 degrees apart: one runs straight up, and the other two run at 30 degrees above the horizontal on each side. At 45 degrees the receding edges would look too steep and the drawing would read as a flat diamond rather than a solid object. The 30-degree angle is the standard that technical drawing settled on, and the grid on this page is built on it: vertical lines plus lines at plus and minus 30 degrees.",
  },
  {
    question: "How many triangles fit on one A4 sheet?",
    answer:
      "It depends on the spacing, and the counts below are approximate — the tool shows no live count for isometric paper. On A4 portrait with the default 12 mm margins the printable area is 186 mm wide and 273 mm tall. At the default 7 mm spacing, about 31 vertical lines fit across the width and about 45 triangle rows fit down the height. At 5 mm, about 43 vertical lines and 63 rows; at 10 mm, about 22 vertical lines and 32 rows. Wider spacing means fewer, larger triangles — pick the spacing by the size of the object you are drawing, not by how many triangles fit.",
  },
  {
    question: "Does the accent colour change anything on isometric paper?",
    answer:
      "No. On this page only the pattern colour affects the sheet — pale blue by default. The accent colour picker is part of the shared studio, but the isometric build does not use it, so changing it changes nothing on the printed page. That is different from semi-log and log-log paper, where the accent colour draws the decade lines. If you want a different grid colour on isometric paper, change the pattern colour.",
  },
  {
    question: "Can the generator draw the cube for me?",
    answer:
      "No. It prints blank isometric paper only — three families of lines and nothing else. There are no pre-drawn cubes, objects, or 3D shapes, no numbered axes, and no labels. You draw the object yourself, using the grid as a guide. The worked cube example in this guide shows the steps: top face as a rhombus, vertical edges down, then the two visible side faces.",
  },
  {
    question: "What spacing should I use for a product sketch?",
    answer:
      "Match the spacing to the size of the object. For a small product sketch — a phone, a mug, a bracket — 5 mm (the Fine preset) gives you enough triangles to shape small details without the grid disappearing into a blur. For an everyday sketch of a box, a room layout, or a piece of furniture, the default 7 mm (Standard) is the right start. For a big diagram, a classroom demonstration, or a sketch you will present, 10 mm (Large) keeps the lines readable from a distance. If the object runs off the page, go larger in spacing, not smaller — smaller spacing only fits more of the same object if you also draw it smaller.",
  },
  {
    question: "Does isometric paper print at true size?",
    answer:
      "Yes, if you print at Actual size or 100% and turn off Fit to page. Check with a ruler: on a 5 mm sheet, ten triangle sides along any grid axis should span exactly 50 mm. If they measure less, the printer scaled the page — go back to the print dialog and choose Actual size. The PDF and SVG files are vector, so they stay sharp at any scale; the only thing that changes the printed size is the print setting, not the file.",
  },
];

export function IsometricPaperGuideBody() {
  return (
    <>
      <p>
        A cube drawn on plain paper looks flat. A cube drawn on
        isometric paper looks like a cube, because the paper
        itself holds the three directions a solid object needs.
        This guide walks through the{" "}
        <Link
          href="/tools/isometric-paper-generator"
          className="font-bold text-brand-teal hover:underline"
        >
          Isometric Paper Generator
        </Link>{" "}
        on this site. It is free, needs no account, and prints
        blank isometric paper at the spacing you choose.
      </p>
      <p>
        The generator prints blank paper, nothing else: no
        pre-drawn cubes, no numbered axes, no labels, and no
        heavier major lines. The drawing is yours to make, as the
        worked cube example below shows.
      </p>

      <h2>What isometric paper is</h2>
      <p>
        Isometric paper is a sheet ruled with three families of
        lines: one vertical, one sloping up to the right at 30
        degrees above the horizontal, and one sloping up to the
        left at 30 degrees. Where the three families cross they
        form equilateral triangles, and those triangles are the
        whole point of the paper — every line on the sheet runs
        along one of the three directions a solid object can
        travel in a drawing.
      </p>
      <p>
        The name comes from the Greek for “equal measure”: in an
        isometric drawing, the same length along any of the three
        axes measures the same on the page. A 10 mm edge looks 10
        mm whether it runs up, down-left, or down-right. That is
        what makes the paper useful for sketching — you can measure
        along any axis with the same ruler, and the object stays
        in proportion. It is not true perspective: parallel lines
        stay parallel instead of converging, and distant edges do
        not shrink. The drawing is a clear, measurable diagram of
        a solid, not a photograph of one.
      </p>

      <h2>Why 30 degrees</h2>
      <p>
        The three axes of an isometric drawing sit 120 degrees
        apart: one runs straight up, and the other two run 30
        degrees above the horizontal on each side — one to the
        left, one to the right. That is the angle technical
        drawing settled on, and it is the angle this generator
        uses: vertical lines plus lines at plus and minus 30
        degrees.
      </p>
      <p>
        The 30-degree angle is a compromise that works. A
        shallower angle would flatten the drawing until the top
        face nearly vanished; a steeper one, such as 45 degrees,
        would make the receding edges look too steep and the
        drawing would read as a flat diamond rather than a solid
        object. At 30 degrees the three faces of a cube are all
        clearly visible and all the same shape — each a rhombus —
        so the eye reads the drawing as a solid at once. If you
        have ever wondered why isometric sketches all look alike,
        this is why: the angle is a standard, not a choice.
      </p>

      <h2>How the grid is built</h2>
      <p>
        The generator builds the grid from one setting, the Axis
        spacing, which runs from 3 to 25 mm in 0.25 mm steps and
        defaults to 7 mm. That spacing is the side of the
        equilateral triangles the three line families form: at 7
        mm spacing every triangle side is 7 mm long. The lines
        themselves are spaced a little closer than the triangle
        side, because the perpendicular distance between two
        parallel lines in the grid is the triangle height —
        spacing times the square root of three over two. At 7 mm
        that is about 6.06 mm between neighbouring vertical
        lines, and the same 6.06 mm between triangle rows down
        the page.
      </p>
      <p>
        That geometry decides how much fits on a sheet. On A4
        portrait with the default 12 mm margins the printable
        area is 186 mm wide and 273 mm tall. At the default 7 mm
        spacing, about 31 vertical lines fit across the width
        and about 45 triangle rows fit down the height. At 5 mm,
        about 43 vertical lines and 63 rows; at 10 mm, about 22
        vertical lines and 32 rows. These counts are approximate
        — the generator shows no live count for isometric paper,
        so work them out from the spacing as this guide does. The
        practical lesson is simple: wider spacing means fewer,
        larger triangles, so choose the spacing for the object,
        not for the count.
      </p>

      <h2>How to choose a spacing</h2>
      <p>
        Start with the presets: Fine at 5 mm, Standard at 7 mm,
        and Large at 10 mm. Fine suits small, detailed work — a
        product sketch, a voxel plan, a game level drawn tile by
        tile — where the object is small and the details matter.
        Standard is the everyday choice: a box, a room layout, a
        piece of furniture, a block diagram. Large suits big
        diagrams, classroom demonstrations, and sketches you will
        present or pin up, where the lines must stay readable
        from a distance.
      </p>
      <p>
        The rule behind the presets is to match the spacing to
        the size of what you are drawing. Count the units your
        object needs along its longest edge, then multiply by the
        spacing and check it against the printable area. A cube
        10 units wide at 7 mm spacing needs 70 mm of page — easy
        on A4. The same cube at 5 mm needs 50 mm, which leaves
        room for annotations but makes the edges harder to follow
        by eye. A room plan 20 units wide at 10 mm needs 200 mm,
        which is wider than the 186 mm printable width on A4
        portrait — so either switch to landscape, use A3, or drop
        to 7 mm. Sketch the object first at the spacing that fits,
        then refine at a finer spacing if the details need it.
      </p>
      <p>
        The finest spacing the generator allows is 3 mm, which
        suits dense voxel plans and tiny diagrams, but below 5 mm
        the triangles get hard to follow by hand and the lines
        crowd together when photocopied. The widest is 25 mm,
        which suits posters and teaching aids. For most work, stay
        between 5 and 10 mm.
      </p>

      <h2>How to print isometric paper in five steps</h2>

      <h3>Step 1 — Open the generator and pick a preset</h3>
      <p>
        Open the{" "}
        <Link
          href="/tools/isometric-paper-generator"
          className="font-bold text-brand-teal hover:underline"
        >
          Isometric Paper Generator
        </Link>
        . The presets cover the usual choices: Fine (5 mm) for
        small detail, Standard (7 mm) for everyday sketching, and
        Large (10 mm) for big diagrams. Standard is the right
        start if you are unsure — you can change the spacing
        after seeing the preview.
      </p>

      <h3>Step 2 — Set the spacing and the line weight</h3>
      <p>
        Set the Axis spacing to the value your object needs, from
        3 to 25 mm in 0.25 mm steps. Then set the Line weight,
        from 0.05 to 1 mm in 0.05 mm steps, default 0.16 mm.
        Keep the default unless you have a reason to change it:
        0.1 mm to stay behind ink, 0.3 mm or more for pencil work
        or photocopying. The lines are all the same weight — there
        are no heavier major lines on this sheet. If your work
        needs bold divisions every five or ten units, use the{" "}
        <Link
          href="/tools/engineering-paper-generator"
          className="font-bold text-brand-teal hover:underline"
        >
          engineering paper generator
        </Link>{" "}
        instead, which draws minor, major, and bold divisions.
      </p>

      <h3>Step 3 — Choose the paper size, orientation, and margins</h3>
      <p>
        The studio offers five paper sizes — A3, A4, A5, US
        Letter, and US Legal — in portrait or landscape,
        defaulting to A4 portrait. A3 suits posters and
        presentations; A5 suits a small sketchbook. Landscape
        suits wide objects such as a room plan or a long block
        diagram, because the printable width grows. Margins are
        one value for all four sides, from 5 to 40 mm, default 12
        mm: wider margins shrink the printable area, which means
        fewer triangles on the sheet. Measurements can be entered
        in millimetres or inches, at 25.4 mm per inch. The live
        preview updates as you change the settings, so check the
        triangle size on screen before downloading.
      </p>

      <h3>Step 4 — Set the colour</h3>
      <p>
        The pattern colour draws every line on the sheet — pale
        blue by default. Change it if you want a different grid
        colour, for example a grey that stays behind pencil work.
        One honest note: the accent colour picker has no effect on
        this page. It is part of the shared studio, but the
        isometric build uses only the pattern colour, so changing
        the accent colour changes nothing on the printed sheet.
        That is different from semi-log and log-log paper, where
        the accent colour draws the decade lines — see the{" "}
        <Link
          href="/guides/semi-log-log-log-paper"
          className="font-bold text-brand-teal hover:underline"
        >
          semi-log and log-log paper guide
        </Link>{" "}
        for that behaviour.
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
        off: a 5 mm grid printed at 96% becomes a 4.8 mm grid,
        and every measurement taken from it is wrong. Print one
        test page and measure with a ruler — on a 5 mm sheet, ten
        triangle sides along any grid axis should span exactly 50
        mm.
      </p>

      <h2>Worked example: drawing a cube</h2>
      <p>
        The cube is the first object to draw on isometric paper,
        because every 3D sketch is built from the same three
        moves. Take a cube four units wide, on a 7 mm sheet, so
        each edge is 28 mm long on the page. Pick a point near
        the top of the sheet for the top corner of the cube — the
        cube hangs below it, so leave room underneath.
      </p>
      <p>
        First, draw the top face. From the top corner, follow a
        grid line down-left at 30 degrees for four triangle sides
        (28 mm), and from the same corner follow a grid line
        down-right at 30 degrees for four triangle sides. Then
        complete the rhombus: from each of those two ends, draw a
        line parallel to the opposite edge — four sides down-right
        from the left end, four sides down-left from the right
        end — until they meet at the front corner of the top face.
        You now have a rhombus made of four equal edges: the top
        of the cube, seen from above at an angle.
      </p>
      <p>
        Second, drop the vertical edges. From the two side
        corners of the rhombus and from the front corner, draw
        straight down along the vertical grid lines for four
        triangle sides each (28 mm). These are the three visible
        vertical edges of the cube. The back corner needs no
        vertical edge — it is hidden behind the cube.
      </p>
      <p>
        Third, close the two visible side faces. Join the bottom
        ends of the vertical edges with lines parallel to the top
        face edges: the left face is a rhombus bounded by the
        left top edge, two vertical edges, and a bottom edge
        parallel to the top; the right face is its mirror image.
        The bottom edges of the cube are hidden, so leave them
        out. You now have a cube with three faces showing — top,
        left, and right — each a rhombus of the same size, each
        edge four triangle sides long.
      </p>
      <p>
        Two checks keep the drawing honest: every edge of the
        cube should measure the same number of triangle sides,
        and every edge should run along a grid line — if an edge
        drifts off the grid, it is not parallel to the axis it
        claims to follow. Once the cube works, the same three
        moves build anything: a box is a stretched cube, a
        staircase is a stack of boxes, and a room is a cube with
        the front face left open.
      </p>

      <h2>Isometric paper vs other papers</h2>
      <p>
        If the work is flat — a chart, a diagram, a shape to
        measure — isometric paper is the wrong tool. Use the{" "}
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
        floor plans; the isometric grid suits anything with depth.
      </p>
      <p>
        Three neighbouring papers cover nearby jobs. For pure
        triangle work — geometry exercises, tessellations, and
        triangular charts — use the{" "}
        <Link
          href="/tools/triangle-grid-generator"
          className="font-bold text-brand-teal hover:underline"
        >
          triangle grid generator
        </Link>
        , whose lines run horizontally and at plus and minus 60
        degrees instead of vertical and plus and minus 30. For
        maps, game boards, and chemistry diagrams, the{" "}
        <Link
          href="/tools/hexagonal-paper-generator"
          className="font-bold text-brand-teal hover:underline"
        >
          hexagonal paper generator
        </Link>{" "}
        prints real edge-connected hexagons. For calculations
        that need bold lines every five or ten squares, use the{" "}
        <Link
          href="/tools/engineering-paper-generator"
          className="font-bold text-brand-teal hover:underline"
        >
          engineering paper generator
        </Link>
        . For writing rather than drawing, the{" "}
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

      <h2>What the isometric paper generator does not do</h2>
      <p>
        An honest note, because it shapes what you should expect.
        This generator makes blank isometric paper, and nothing
        else: no pre-drawn cubes or objects, no numbered axes or
        labels, no heavier major lines or bold divisions, and no
        Word document. There is no live count for this tool, so
        work out how many triangles fit from the figures in this
        guide. The accent colour picker changes nothing on this
        page — only the pattern colour draws the grid. The page
        does not save your settings — leave the page and they
        reset, so note the spacing, paper size, and margins you
        settled on. Reset restores 7 mm spacing, 0.16 mm line
        weight, A4 portrait, and 12 mm margins. Within those
        limits, the paper is exact: every triangle on the sheet is
        equilateral, every side is the spacing you chose, and a
        cube drawn on it measures true on all three axes.
      </p>
    </>
  );
}
