import Link from "next/link";

/**
 * Guide #3 — "How to Make a Word Search with a Word Search Maker".
 *
 * Every capability claim here was checked against the real tool before
 * writing (components/tools/GeneratorTools.tsx, WordSearchTool, plus
 * lib/puzzle-generators.ts, makeWordSearch, and the WorksheetFrame
 * "Print / Save PDF" button):
 * word list typed one per line or comma-separated, 3–40 words work best;
 * grid sizes 10, 12, 15, 18, 20, 22, 25; difficulty presets easy
 * (across + down only), medium (adds diagonals), hard (adds backwards,
 * including reverse diagonals), with four direction switches that can be
 * mixed freely; editable puzzle title; "Generate new puzzle" reshuffles
 * the same words and settings; words that cannot be placed are reported
 * by name with the advice to use a larger grid or shorter words; words
 * are uppercased, accents are folded to the base letter (café → CAFE)
 * and anything that is not a letter is stripped, so a phrase like
 * "ice cream" becomes ICECREAM; filler letters are drawn from the
 * letters in the word list itself; "Show highlighted answer key" shows
 * a second grid with the placed words circled in yellow and prints it
 * on a new page; downloads are PNG only (puzzle and answer key, the key
 * with yellow circles); the printable sheet carries the title plus
 * Name and Date lines. There is NO shareable link, NO save/load, and
 * NO PDF download from this tool — the Print / Save PDF button prints
 * the sheet or saves it as a PDF through the browser. The registry
 * description's "print or share it" was tightened to "print it or
 * download it as a PNG" because the tool has no share feature.
 */

export const wordSearchMakerFaqs: readonly {
  question: string;
  answer: string;
}[] = [
  {
    question: "Is the word search maker free?",
    answer:
      "Yes. You can make a word search, print it, and download it as a PNG without creating an account and without paying. The tool runs in your browser and nothing you type is saved on the site.",
  },
  {
    question: "How many words can I put in a word search?",
    answer:
      "Lists of 3 to 40 words work best, according to the tool itself. Match the list to the grid: a 10 by 10 grid suits 3 to 8 short words, a 12 by 12 grid suits 8 to 12 words, and the largest 25 by 25 grid fits 20 to 40 words. A word that is longer than the grid, or that simply has no room left, is reported by name instead of being silently dropped.",
  },
  {
    question: "Can I print the puzzle and the answer key?",
    answer:
      "Yes. The Print / Save PDF button prints the puzzle sheet, which has Name and Date lines at the top. Tick “Show highlighted answer key” first and the key prints on a separate page, with the placed words circled in yellow — hand out the puzzle page and keep the key for yourself. You can also download the puzzle and the answer key as separate PNG images.",
  },
  {
    question: "Why did one of my words not appear in the puzzle?",
    answer:
      "The tool tells you by name when a word could not be placed. It usually means the word is longer than the grid or the grid is already full. Pick a larger grid size, shorten the word, or drop a few words from the list, then generate the puzzle again.",
  },
  {
    question: "How do I make the puzzle harder?",
    answer:
      "Switch the difficulty to hard, which adds backwards words — including words running backwards along diagonals — on top of the across, down, and diagonal words in medium. You can also mix the four direction switches yourself, for example diagonals on and backwards off, and use a bigger grid with a longer word list.",
  },
  {
    question: "Can I share the puzzle with my class or family?",
    answer:
      "There is no shareable link, so share the file instead: download the puzzle as a PNG and send that image, or print copies with the Print / Save PDF button. Keep in mind that nothing is saved — if you close the page, the puzzle is gone, so download or print it before you leave.",
  },
];

export function WordSearchMakerGuideBody() {
  return (
    <>
      <p>
        A word search maker turns a list of words you choose into a puzzle
        grid — the words hidden across, down, or diagonally among random
        letters, with the list printed underneath for the solver to find.
        It is the quick way to make a spelling-list puzzle, a classroom
        vocabulary game, or a party puzzle from your own words instead of
        a ready-made one. This guide walks through the{" "}
        <Link
          href="/word-search-maker"
          className="font-bold text-brand-teal hover:underline"
        >
          word search maker
        </Link>{" "}
        on this site, which is free, needs no account, and builds the
        puzzle in your browser from whatever words you type in.
      </p>
      <p>
        The whole job takes a few minutes: write the word list, pick a
        grid size and a difficulty, check the puzzle, then print it or
        download it. The tool does the fiddly part — fitting the words
        into the grid so they cross each other — and tells you plainly
        when a word does not fit, instead of quietly leaving it out.
      </p>

      <h2>How to make a word search in six steps</h2>

      <h3>Step 1 — Write your word list</h3>
      <p>
        Type one word per line in the Words box, or separate them with
        commas — either works. The tool suggests lists of 3 to 40 words:
        fewer than three is barely a puzzle, and more than forty will not
        fit even the biggest grid. Start with the ready-made fruit list
        (apple, banana, orange, grape, mango) to see how it works, then
        replace it with your own words — a spelling list, the vocabulary
        from a lesson, names for a birthday puzzle, or places for a travel
        game. Keep each entry to a single word: the tool strips out
        anything that is not a letter, so a phrase such as “ice cream”
        becomes ICECREAM, one long word, rather than two words. Accented
        letters are folded to their plain form, so café becomes CAFE.
      </p>

      <h3>Step 2 — Give the puzzle a title</h3>
      <p>
        Change the title at the top of the controls — it appears at the
        top of the puzzle, on the printed sheet, and on the downloaded
        PNG. A clear title tells the solver what the puzzle is about
        before they read a single letter: “Fruit Word Search”, “Grade 3
        Spelling — Week 6”, or “Emma’s Birthday Puzzle”. The printed
        sheet also has Name and Date lines under the title, which is
        handy when the puzzle is homework or a classroom handout.
      </p>

      <h3>Step 3 — Pick a grid size</h3>
      <p>
        Choose the grid from 10 by 10 up to 25 by 25. The size should
        match the list, not the other way round: a small grid with a long
        list has nowhere to put the words, and a big grid with five short
        words leaves the solver staring at mostly empty letters. The
        tool’s own guide on the page is a good starting point — 10 by 10
        for 3 to 8 short words and first puzzles for ages 6 to 8, 12 by
        12 for 8 to 12 words such as a spelling list, 15 by 15 for 10 to
        15 topic words, and 25 by 25 for 20 to 40 words for adults and
        large lists. When in doubt, go one size up: a slightly roomier
        grid is easier to solve and far less likely to reject a word.
      </p>

      <h3>Step 4 — Set the difficulty</h3>
      <p>
        The difficulty preset decides which directions the words can run
        in. Easy hides words across and down only, which is right for
        young children and first puzzles. Medium adds diagonals, the
        usual step up for ages 8 and over. Hard adds backwards words as
        well, including words running backwards along diagonals — that is
        the setting for teenagers and adults who find the easier puzzles
        too quick. Below the preset there are four switches — Horizontal,
        Vertical, Diagonal, Backwards — and you can mix them yourself
        instead of taking a preset, for example diagonals on with
        backwards off, which is a fair challenge without being frustrating.
      </p>

      <h3>Step 5 — Generate and check the puzzle</h3>
      <p>
        The puzzle builds itself as you type, and the “Generate new
        puzzle” button reshuffles the same words and settings into a
        fresh layout — useful when you want a second copy for another
        class, or when the first layout looks too easy because several
        words landed in plain sight. Always read the puzzle before you
        print it. If a word could not be placed, the tool says so by name
        — “Could not place: STRAWBERRY. Choose a larger grid or shorter
        words.” — so check that message, pick a bigger grid, shorten the
        word, or drop a word or two, and generate again. A word longer
        than the grid itself can never be placed, so a 12-letter word
        needs at least a 12 by 12 grid.
      </p>

      <h3>Step 6 — Print it or download it</h3>
      <p>
        When the puzzle looks right, use the Print / Save PDF button
        under the puzzle to print it or save it as a PDF through your
        browser. Before printing, decide about the answer key: tick “Show
        highlighted answer key” and a second grid appears below the
        puzzle, with every placed word circled in yellow, and it prints
        on its own page — hand out the puzzle page and keep the key.
        Alternatively, download the puzzle as a PNG, and download the
        answer key as a second PNG with the words circled in yellow,
        which you can send as an image or print separately. Either way,
        download or print before you close the page: nothing is saved,
        and each visit starts fresh.
      </p>

      <h2>Choosing words that make a good puzzle</h2>
      <p>
        The list matters more than any setting. A good list has words of
        different lengths — a mix of short and long words fills the grid
        better than ten words that are all five letters, because the tool
        places longer words first and likes words that cross each other.
        Avoid near-duplicates such as CAT and CATS or RUN and RUNNING,
        which confuse the solver when one word hides inside another.
        Theme the list when you can: animals, space, food, or the words
        from this week’s lesson all make the puzzle feel made for its
        solver rather than random. And remember the two quirks from step
        one — phrases are joined into one word, and accents are folded
        away — so write “icecream” as a single word if you mean it, and
        use the plain spelling of an accented word.
      </p>

      <h2>Matching the puzzle to the solver</h2>
      <p>
        The same tool makes a first puzzle for a six-year-old and a hard
        puzzle for an adult; the difference is the size and the
        directions. For ages 6 to 8, use a 10 by 10 grid, easy difficulty,
        and 3 to 8 short words they already know. For a spelling list,
        use 12 by 12 on easy or medium with the week’s words. For a
        classroom topic, 15 by 15 on medium with 10 to 15 vocabulary
        words is the sweet spot. For teenagers and adults, go to 20 by 20
        or larger on hard with 15 or more words. Teachers can reuse the
        same list at two difficulties — easy for the younger group, hard
        for the older one — and the “Generate new puzzle” button gives
        each group a different layout from the same words.
      </p>

      <h2>More puzzles from the same words</h2>
      <p>
        One word list can feed more than one puzzle. The{" "}
        <Link
          href="/word-scramble-generator"
          className="font-bold text-brand-teal hover:underline"
        >
          word scramble generator
        </Link>{" "}
        turns the same list into a set of jumbled words to unscramble,
        with optional hints and its own answer key — a good second
        activity for the same lesson. The{" "}
        <Link
          href="/sentence-scramble-generator"
          className="font-bold text-brand-teal hover:underline"
        >
          sentence scramble generator
        </Link>{" "}
        works the same way with whole sentences, and the{" "}
        <Link
          href="/sudoku-generator"
          className="font-bold text-brand-teal hover:underline"
        >
          Sudoku generator
        </Link>{" "}
        makes a number puzzle for the solvers who finish the word search
        early. For a full set of classroom printables, the{" "}
        <Link
          href="/printable-worksheets"
          className="font-bold text-brand-teal hover:underline"
        >
          printable worksheets
        </Link>{" "}
        page gathers the puzzle and paper tools in one place, and the{" "}
        <Link
          href="/guides/text-to-handwriting"
          className="font-bold text-brand-teal hover:underline"
        >
          text to handwriting guide
        </Link>{" "}
        shows how to turn the same lesson text into handwritten practice
        pages to go with the puzzle.
      </p>

      <h2>What the word search maker does not do</h2>
      <p>
        An honest note, because it shapes what you should expect. There
        is no shareable link and no saved puzzle: the only way to pass a
        puzzle on is the printed sheet or the downloaded PNG file, and
        closing the page loses it. Words must fit the grid, so a very
        long word needs a big grid, and a crowded list will lose words
        the tool reports by name. Phrases are joined into single words
        and accents are folded away, so the puzzle only ever contains
        plain capital letters. The filler letters are drawn from the
        letters in your own word list, which keeps the grid looking
        natural — but it also means a real word can occasionally appear
        in the filler by chance, so the answer key only circles the words
        you entered, and that is the list that counts. Within those
        limits, the process is short: write the list, size the grid,
        set the difficulty, check the layout, and print or download it.
      </p>
    </>
  );
}
