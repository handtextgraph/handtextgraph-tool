import Link from "next/link";

/**
 * Guide #6 — "How to Make Sudoku Puzzles with a Sudoku Generator".
 *
 * Every capability claim here was checked against the real tool before
 * writing (components/tools/Stage5Tools.tsx, SudokuTool, plus
 * lib/stage5-tools.ts):
 * three grid sizes — 4 × 4 (kids), 6 × 6 (classroom), 9 × 9 (classic);
 * four difficulties — easy, medium, hard, expert; clue counts are the
 * exact measured targets — 9 × 9: 40/33/27/24–26 (expert varies 24–26),
 * 6 × 6: 26/22/18/16, 4 × 4: 12/10/8/6; puzzles in a set: 1–6;
 * puzzles per page: 1, 2, 4, or 6; a deterministic seed (default
 * "classroom-1") so the same seed and options reproduce the same
 * puzzle; a Regenerate button; a Copy puzzle link button that makes a
 * shareable ?sudoku=<id> link restoring that exact puzzle; a "Show
 * separate answer pages" checkbox (on by default) with its own
 * download; export is Download PNG, Download PDF, Download SVG, and
 * Print (browser print); an on-screen Play section for one puzzle at a
 * time with click-a-cell-then-a-number entry, a Notes (pencil-mark)
 * mode, Erase, Undo (up to 50 steps), a Check button, a mistake count,
 * wrong cells highlighted in red, and a "Solved" message; there are
 * NO hints and NO timer; every puzzle is checked by a solution
 * counter before display, so each one has exactly one solution.
 * There is NO paper-size choice (A4/Letter/A3), NO custom clue count,
 * NO per-puzzle difficulty inside one set, NO puzzle import, and NO
 * save — closing the page loses the set unless you copied the link.
 * The registry description was already accurate and needed no change.
 */

export const sudokuFaqs: readonly {
  question: string;
  answer: string;
}[] = [
  {
    question: "Is the Sudoku generator free?",
    answer:
      "Yes. You can generate puzzles, play them on screen, and download or print them without creating an account and without paying. The tool runs in your browser and nothing you make is saved on the site.",
  },
  {
    question: "Does every puzzle have only one solution?",
    answer:
      "Yes. Before a puzzle is shown, a solution counter checks it, and the generator only keeps puzzles with exactly one solution. That is what the answer pages are built from, so the puzzle you print and the solution you keep always match.",
  },
  {
    question: "Can I print more than one puzzle on a page?",
    answer:
      "Yes. The “Puzzles per page” setting offers 1, 2, 4, or 6 puzzles per page. Six small puzzles fit on one sheet, which is handy for a class set or a puzzle book, while one large puzzle per page is easier to read and write on. The answers are kept on separate pages either way.",
  },
  {
    question: "Can I solve the puzzle on screen instead of printing it?",
    answer:
      "Yes. The “Play on screen” section lets you solve one puzzle at a time: click a cell, then a number. It has a Notes mode for pencil marks, Erase, Undo, a Check button that highlights wrong cells in red, and a mistake count. There are no hints and no timer, so it is a plain solving board rather than a game with help built in.",
  },
  {
    question: "Can I share a puzzle with someone else?",
    answer:
      "Yes. The “Copy puzzle link” button makes a link that opens that exact puzzle — same grid, same difficulty, same clues — for anyone who follows it. It is the simplest way to send one puzzle to a friend or a class, because the link carries the puzzle with it and the other person needs no account.",
  },
  {
    question: "What do the difficulty levels mean?",
    answer:
      "Difficulty is set by how many clues the puzzle starts with: fewer clues means harder. On the classic 9 × 9 grid, easy starts with 40 clues, medium with 33, hard with 27, and expert with 24 to 26. The 6 × 6 grid runs from 26 clues on easy down to 16 on expert, and the 4 × 4 grid from 12 down to 6. The tool page shows the full table, so you can pick a level by number rather than by guess.",
  },
];

export function SudokuGuideBody() {
  return (
    <>
      <p>
        A Sudoku generator makes fresh puzzles on demand, so you never
        have to buy a puzzle book or reuse the same grid twice. You
        pick the size and the difficulty, and the tool builds a puzzle
        with exactly one solution, ready to print or solve on screen.
        This guide walks through the{" "}
        <Link
          href="/sudoku-generator"
          className="font-bold text-brand-teal hover:underline"
        >
          Sudoku generator
        </Link>{" "}
        on this site, which is free, needs no account, and makes
        printable sets of up to six puzzles at a time.
      </p>
      <p>
        The one thing to know before you start is what the tool is
        for: it generates puzzles and answer pages, and it gives you a
        plain board to solve one puzzle on screen. It is not a Sudoku
        game with hints, a timer, or levels to unlock — there are no
        hints and no timer, and the on-screen board is there so you
        can try a puzzle before you print it, not to replace the
        printed sheet. If you want a stack of puzzles for a classroom,
        a journey, or a quiet evening, that is exactly what it does
        well.
      </p>

      <h2>How to make a Sudoku puzzle in six steps</h2>

      <h3>Step 1 — Pick the grid size</h3>
      <p>
        Start with the Grid size dropdown, which offers three sizes.
        The 9 × 9 grid is the classic Sudoku most people know: nine
        rows, nine columns, and nine 3 × 3 boxes, using the numbers 1
        to 9. The 6 × 6 grid is the classroom size — six rows and
        columns with 2 × 3 boxes, using the numbers 1 to 6 — and it
        suits younger solvers or a short warm-up, because a puzzle
        takes a few minutes rather than half an hour. The 4 × 4 grid
        is the children’s size, with 2 × 2 boxes and the numbers 1 to
        4; a child who has just learned the rules can finish one in a
        couple of minutes. Pick the size for the solver, not for
        yourself: a beginner handed a 9 × 9 expert puzzle will give
        up, while an experienced solver handed a 4 × 4 will be bored
        before the first row is done.
      </p>

      <h3>Step 2 — Pick the difficulty</h3>
      <p>
        Difficulty is set by how many clues the puzzle starts with:
        fewer given numbers means more empty cells and a harder
        puzzle. On the classic 9 × 9 grid, easy starts with 40 clues,
        medium with 33, hard with 27, and expert with 24 to 26 — the
        expert count varies slightly because the generator removes
        numbers until the puzzle is as empty as it can be while still
        having one solution. The 6 × 6 grid runs from 26 clues on easy
        down to 16 on expert, and the 4 × 4 grid from 12 down to 6.
        The tool page shows the full table of clue counts, so you can
        choose by number instead of guessing what “hard” means. If you
        are unsure, start one level easier than you think: a puzzle
        that is slightly too easy is still enjoyable, while one that
        is slightly too hard sits unfinished.
      </p>

      <h3>Step 3 — Set the seed and the size of the set</h3>
      <p>
        The “Puzzles in set” field makes between one and six puzzles
        at once, all at the same size and difficulty, and “Puzzles per
        page” decides how they are laid out: 1, 2, 4, or 6 puzzles per
        printed page. One large puzzle per page is the easiest to read
        and write on; six small ones on a page make a compact booklet
        or a class set that uses little paper. The seed box is what
        makes the set repeatable. It holds a short word — the default
        is “classroom-1” — and the same seed with the same size and
        difficulty always produces the same puzzles, so you can remake
        an identical set next week by typing the same seed again. Use a
        seed that means something to you, such as “tuesday-class” or
        “mum-birthday”, and the set becomes something you can find
        again. If you want a fresh set instead, press “Regenerate
        puzzles” and the tool builds a new one from the same settings.
      </p>

      <h3>Step 4 — Keep the answer pages separate</h3>
      <p>
        The “Show separate answer pages” checkbox is on by default,
        and it is worth leaving on. It puts the solutions on their own
        pages, with their own download, so the answers never sit next
        to the puzzles. That matters more than it sounds: a solver who
        can see the solution will glance at it, and a teacher handing
        out a class set needs the answers kept apart. Each puzzle
        sheet and its answer page are labelled with the puzzle number,
        the grid size, the difficulty, and the clue count, so a loose
        answer page can always be matched back to its puzzle. Download
        the two files separately — the puzzles as “sudoku-worksheet”
        and the answers as “sudoku-answers” — and keep the answers
        until the puzzles are finished.
      </p>

      <h3>Step 5 — Try a puzzle on screen first</h3>
      <p>
        Before you print, you can solve one puzzle in the “Play on
        screen” section underneath the sheets. Click a cell, then a
        number, and the number goes in. The Notes button switches on
        pencil marks, so you can jot the candidates for a cell in
        small type before committing to one. Erase clears a cell, Undo
        steps back through your last moves, and Check highlights any
        wrong entries in red and tells you how many there are. A
        mistake count keeps score, and when every cell matches the
        solution a “Solved” message appears. If you made a set of
        several puzzles, buttons above the board let you switch
        between them. Remember the limits here: there are no hints and
        no timer, so if you are stuck, the board will not tell you the
        next move — that is what the answer page is for. The board is
        a way to test a puzzle, not a game in itself.
      </p>

      <h3>Step 6 — Download, print, or share the set</h3>
      <p>
        Under each sheet there are four buttons: Download PNG,
        Download PDF, Download SVG, and Print. The PDF is the usual
        choice for a printed set — it keeps the grid sharp at any
        size — while the PNG suits sharing in a chat or a document,
        and the SVG suits editing the grid in a drawing program. The
        Print button opens your browser’s print dialog, so you can
        print straight from the page or choose “Save as PDF” there
        instead. To send a single puzzle to someone else, use “Copy
        puzzle link”: it makes a link that opens that exact puzzle —
        same grid, same difficulty, same clues — for anyone who follows
        it, with no account needed. Print one page first and check it
        on paper before printing a whole class set, and remember that
        closing the page loses the set unless you have copied its link
        or saved its seed.
      </p>

      <h2>Solving tips for the puzzles you make</h2>
      <p>
        A generated puzzle is only as good as the solving it invites,
        and a few habits make any difficulty more enjoyable. Start
        with the easy wins: scan each row, column, and box for a
        number that can only go in one cell, and fill those in first —
        on an easy 9 × 9 puzzle, the 40 starting clues leave several
        of these open at once. When the easy moves run out, switch on
        Notes and write the candidates in each empty cell; a cell with
        only one candidate is your next move, and a number that
        appears as a candidate in only one cell of a row, column, or
        box must go there. Work in rounds rather than hunting at
        random: finish all the easy moves, then update the notes, then
        look again. On the smaller grids the same habits apply, only
        faster — a 4 × 4 puzzle is really a lesson in the rules, and a
        6 × 6 is a good length for a ten-minute break. And if a puzzle
        beats you, check the answer page and work backwards: seeing
        where one number had to go usually shows you the move you
        missed.
      </p>

      <h2>More puzzles for the same solver</h2>
      <p>
        Sudoku is rarely the only puzzle on the table. If you are
        building a puzzle set for a classroom or a rainy afternoon, the{" "}
        <Link
          href="/guides/word-search-maker"
          className="font-bold text-brand-teal hover:underline"
        >
          word search maker guide
        </Link>{" "}
        shows how to build a word search from your own word list, which
        pairs well with Sudoku as a lighter puzzle for the same group.
        The{" "}
        <Link
          href="/word-scramble-generator"
          className="font-bold text-brand-teal hover:underline"
        >
          Word Scramble Generator
        </Link>{" "}
        turns words into jumbled puzzles to unscramble, and the{" "}
        <Link
          href="/sentence-scramble-generator"
          className="font-bold text-brand-teal hover:underline"
        >
          Sentence Scramble Generator
        </Link>{" "}
        does the same with whole sentences — both are quick to make and
        suit the same age groups as the 4 × 4 and 6 × 6 Sudoku grids.
        Together they make a small puzzle pack from one afternoon’s
        work.
      </p>

      <h2>What the Sudoku generator does not do</h2>
      <p>
        An honest note, because it shapes what you should expect. This
        generator makes puzzles and answer pages, and it gives you a
        plain board to solve one puzzle on screen. It does not offer
        hints or a timer, and it does not save your progress — closing
        the page loses the set, so copy the puzzle link or note the
        seed if you want the same puzzles again. A set holds at most
        six puzzles, and every puzzle in a set shares the same grid
        size and difficulty; there is no way to mix an easy 4 × 4 with
        a hard 9 × 9 in one set, and no way to set the clue count
        yourself — difficulty is the only control over how empty the
        grid starts. There is also no paper-size choice: the sheet is
        one fixed layout that your printer scales, so check the print
        preview if the grid looks small on the page. Within those
        limits, the process is short: pick a size and a difficulty, set
        the seed and the set size, keep the answer pages separate, try
        a puzzle on screen, and print or share the set.
      </p>
    </>
  );
}
