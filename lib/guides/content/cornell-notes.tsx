import Link from "next/link";

/**
 * Guide #8 — "How to Make a Cornell Notes Template".
 *
 * Every capability claim here was checked against the real tool before
 * writing (lib/paper-generators.ts, cornell-notes-generator entry,
 * plus components/paper/PaperGeneratorStudio.tsx and
 * lib/paper-generator-engine.ts, "cornell" kind):
 * the page has a 16 mm header strip with printed "Topic:" and "Date:"
 * labels, a cue column, a ruled notes area, and a summary box, with
 * printed "Cues", "Notes", and "Summary" labels; cue column width is
 * adjustable from 30 to 80 mm in 1 mm steps, default 55 mm; summary
 * height is adjustable from 30 to 80 mm in 1 mm steps, default 45 mm;
 * notes ruling is adjustable from 5 to 15 mm in 0.1 mm steps, default
 * 7.1 mm; line weight is adjustable from 0.05 to 1 mm in 0.05 mm
 * steps, default 0.16 mm; three presets — Standard (cue 55, summary
 * 45), Wide cues (cue 70), Large summary (summary 60); paper sizes
 * A3, A4, A5, US Letter, and US Legal, portrait or landscape,
 * default A4 portrait; margins 5–40 mm on all four sides, default
 * 12 mm; pattern colour (default #8fb3da) draws the ruled lines,
 * accent colour (default #385f8d) draws the three divider lines and
 * the printed labels, and the background colour is also changeable;
 * export is Download PDF (vector, page count 1–20), Download PNG
 * (150 or 300 DPI), Download SVG (vector), and Print (browser print);
 * the tool is free, needs no account, and runs entirely in the
 * browser. The cue divider ends at the summary boundary and the ruled
 * lines run only inside the notes region, from the cue divider to the
 * right edge. With the default settings, A4 portrait gives 29 ruled
 * lines in the notes area and US Letter gives 27 (derived from the
 * engine: lines step by the ruling from one ruling below the header
 * until the summary boundary). There is NO Word (.docx) export, NO
 * name, class, or essential-question fields, and NO filled example
 * page — the generator makes blank templates only. The page does not
 * save your settings — leaving it resets the defaults (the studio
 * keeps settings in component state only; there is no localStorage).
 * The registry description was honest and needed no correction: the
 * template does have a cue column, a notes area, and a summary box,
 * and it is made for lectures and revision.
 */

export const cornellNotesFaqs: readonly {
  question: string;
  answer: string;
}[] = [
  {
    question: "Is the Cornell notes template generator free?",
    answer:
      "Yes. You can make and download Cornell notes templates without creating an account and without paying. The tool runs in your browser, and nothing you make is saved on the site.",
  },
  {
    question: "What is the Cornell method?",
    answer:
      "A note-taking system with three zones: a cue column for questions and keywords, a notes area for the lecture or reading, and a summary at the bottom. Fill in the cues and the summary after class, then use the cues to quiz yourself by covering the notes and answering them aloud.",
  },
  {
    question: "How wide should the cue column be?",
    answer:
      "Start with the Standard preset, 55 mm. That leaves a wide notes area on A4 and fits a short question or keyword on each line. Widen it to 70 mm with the Wide cues preset if your cues run long — for example, full questions in a language class — or narrow it towards 30 mm if your cues are single words. On A5, 40 mm is a good balance.",
  },
  {
    question: "Can I download a Word (.docx) Cornell template?",
    answer:
      "No. This generator exports PDF, PNG, and SVG; Word templates are not offered. Download the PDF if you want to print the template, or the SVG if you want to edit the page in a drawing program.",
  },
  {
    question: "Does it include a filled example page?",
    answer:
      "No. The generator makes blank templates; the worked water-cycle example on this page shows what a filled page looks like. Write your own notes in by hand after printing — that is the point of the method.",
  },
  {
    question: "Can I make an A5 Cornell template?",
    answer:
      "Yes. Choose A5 as the paper size and set the cue column to 40 mm and the summary height to 40 mm — both controls run from 30 to 80 mm. That leaves a comfortable notes column on the narrower page.",
  },
];

export function CornellNotesGuideBody() {
  return (
    <>
      <p>
        Cornell notes split a page into three zones with three
        different jobs: a wide notes area where you write during the
        lesson, a narrow cue column where you write questions
        afterwards, and a summary box at the bottom where you boil
        the whole page down to a few sentences. The system was
        developed at Cornell University in the 1950s by Walter Pauk.
        This guide walks through the{" "}
        <Link
          href="/tools/cornell-notes-generator"
          className="font-bold text-brand-teal hover:underline"
        >
          Cornell Notes Generator
        </Link>{" "}
        on this site, which is free, needs no account, and makes a
        printable Cornell template at the proportions you choose.
      </p>
      <p>
        Before you start, know what the tool is for: blank
        templates, nothing else. No filled example page, no name
        or class fields, and no Word document. The page is empty
        on purpose, so the work of filling it — in the right
        order, at the right time — is yours.
      </p>

      <h2>The three zones — and the header strip</h2>
      <p>
        Every page the generator makes has the same layout. Across
        the top is a 16 mm header strip with “Topic:” printed on
        the left and “Date:” on the right — write the lesson title
        and the date there by hand after printing. Below the header,
        a vertical divider splits the page: the cue column on the
        left, the notes area on the right. The divider stops at the
        summary boundary, and a horizontal line there marks off the
        summary box, which runs the full width of the page at the
        bottom. Each zone is labelled on the page itself — “Cues”,
        “Notes”, and “Summary”.
      </p>
      <p>
        The ruled lines sit only inside the notes area, running
        from the cue divider to the right edge. The cue column and
        the summary box are deliberately unruled: cues are short
        enough not to need lines, and a summary written without
        ruling tends to stay short. With the default settings —
        A4 portrait, 55 mm cue column, 45 mm summary, 7.1 mm
        ruling — the notes area holds 29 ruled lines; on US Letter
        it holds 27.
      </p>

      <h2>How to make a Cornell notes template in five steps</h2>

      <h3>Step 1 — Set the cue column and the summary height</h3>
      <p>
        Start with the presets, which cover the three shapes most
        people need. Standard is the default: a 55 mm cue column
        and a 45 mm summary, which suits most lectures. Wide cues
        widens the cue column to 70 mm, which suits cues that run
        long — full questions, foreign words with translations, or
        formula names. Large summary raises the summary box to
        60 mm, for lessons that need a longer summing-up.
      </p>
      <p>
        If none of the presets fits, both controls run from 30 to
        80 mm in 1 mm steps. A narrow cue column — 30 to 40 mm —
        suits single-word cues or a small A5 notebook, where the
        page is too narrow to spare 55 mm for questions. A tall
        summary — up to 80 mm — suits a lesson that needs a
        paragraph rather than two sentences. The trade-off is always
        the same: every millimetre given to the cue column or the
        summary is a millimetre taken from the notes area, so widen
        a zone only when you know why you need it.
      </p>

      <h3>Step 2 — Set the notes ruling and the line weight</h3>
      <p>
        The notes ruling control sets the gap between the ruled
        lines in the notes area, from 5 to 15 mm in 0.1 mm steps,
        with 7.1 mm as the default. That default is college ruling,
        the standard spacing of US school and university paper,
        and the right starting point for most adult handwriting.
        Go wider — 8.7 mm or 9 mm — for larger handwriting or
        fast lectures. Go narrower — 5 or 6 mm — for small, neat
        handwriting or a page that has to hold a lot of material.
      </p>
      <p>
        The ruling also decides how many lines the notes area
        holds. At 7.1 mm, A4 portrait gives 29 lines; at 9 mm it
        gives about 23; at 5 mm it gives about 42. Pick the ruling
        by the size of your handwriting, not by how much you want
        to fit on the page. The
        line weight control sets how heavy the lines print, from
        0.05 to 1 mm, with 0.16 mm as the default. Lighter lines
        suit confident writers who only need a faint guide; heavier
        lines suit beginners or anyone writing in pencil.
      </p>

      <h3>Step 3 — Choose the paper size, orientation, and margins</h3>
      <p>
        The generator offers five paper sizes — A3, A4, A5, US
        Letter, and US Legal — in portrait or landscape. The
        default is A4 in portrait, which suits most school and
        university notes. Landscape gives a wider notes area; A5
        suits a small notebook or a pocket revision pad; A3 suits
        a classroom wall sheet.
      </p>
      <p>
        For A5, set the cue column to 40 mm and the summary height
        to 40 mm — both are inside the 30 to 80 mm range. Margins
        run from 5 to 40 mm on all four sides, with 12 mm as the
        default. Wider margins leave room for a hole punch or a
        binder.
      </p>

      <h3>Step 4 — Set the colours</h3>
      <p>
        Two colours are adjustable. The pattern colour draws the
        ruled lines in the notes area, and the accent colour draws
        the three divider lines — the header line, the cue divider,
        and the summary line — plus the printed labels. The
        defaults are a pale blue for the ruling and a darker slate
        blue for the dividers. You can change either to any colour,
        and the background colour can be changed too, though white
        is the sensible default: a coloured background uses more
        ink and makes pencil harder to see.
      </p>

      <h3>Step 5 — Print at actual size and download the pad</h3>
      <p>
        Cornell paper is only useful if the zones are the size
        they claim to be, so print at Actual size or 100% and turn
        off “Fit to page”, “Shrink to fit”, or any scaling option
        in the print dialog. Those options shrink the page by a
        few percent — harmless for text, but a 55 mm cue column
        printed at 96% becomes a 52.8 mm cue column. Print one
        test page and measure the cue column with a ruler before
        printing a class set. Mind the paper size as well: an A4
        PDF printed on US Letter paper at 100% loses the bottom
        17.6 mm, and a Letter PDF printed on A4 leaves a gap at
        the bottom. Regenerate the sheet in the size your printer
        holds instead of scaling.
      </p>
      <p>
        Under the preview there are four buttons: Download PDF,
        Download PNG, Download SVG, and Print. The PDF is the
        usual choice for a printed set — it is vector, so it keeps
        the lines sharp, and the page count runs from 1 to 20, so
        you can print a whole pad of identical sheets at once.
        The PNG suits sharing in a chat or a document, at 150 DPI
        for a draft or 300 DPI for print quality, and the SVG
        suits editing the page in a drawing program. The Print
        button opens your browser’s print dialog, so you can print
        straight from the page.
      </p>

      <h2>The 5 R’s: how to use the page once it is printed</h2>
      <p>
        The template is only half the method; the other half is
        the order in which you fill it in. The five steps are
        Record, Reduce, Recite, Reflect, and Review, and they
        happen at different times — that timing is the whole
        point. Record: during the lesson, write in the notes area
        only, capturing the main ideas in your own words, in short
        phrases, not full sentences copied from the board. Leave
        the cue column and the summary empty — they are for later.
        Reduce: within a day, read your notes and reduce each
        block to a cue in the left column — a question, a keyword,
        or a short prompt. Good cues ask something (“Why does
        the water cycle repeat?”) rather than labelling it
        (“Water cycle”). If a block of notes produces no cue, it
        probably was not worth writing down. Recite: cover the
        notes area with your hand or a sheet of paper and answer
        the cues out loud, in your own words. If you cannot say
        it, you do not know it yet, and the cue tells you exactly
        which block to restudy. Reflect: add your own thinking —
        opinions, connections to other topics, questions the
        lesson raised. A note that only repeats the teacher is a
        transcript; a note with your reflections is understanding.
        Review: revisit the page regularly — a quick pass within
        24 hours, then weekly. Each review should take minutes,
        because the cues tell you what to recall.
      </p>
      <p>
        The most common mistake is leaving the cue column blank.
        A page of notes with no cues is just a page of notes —
        the method only starts when you reduce the notes to
        questions afterwards. The second mistake is writing cues
        as labels instead of questions: “Water cycle” as a cue
        tells you nothing when you cover the notes, while “Why
        does the water cycle repeat?” tells you exactly what to
        recall. The third is writing full sentences in the notes
        area, which are slow to write and slow to review. And the
        fourth is rereading instead of reciting: reading a page
        over feels like studying, but it is the weakest form of
        review.
      </p>

      <h2>Worked example: a geography page on the water cycle</h2>
      <p>
        Imagine a lesson on the water cycle. In the notes area,
        the student writes: “Water evaporates from seas, lakes,
        and land, warmed by the sun. Water vapour rises and cools,
        condensing into clouds. Clouds move with the wind, then
        the water falls as rain or snow. Rain collects in rivers
        and soaks into the ground, then flows back to the sea.”
      </p>
      <p>
        In the cue column, the same student writes: “What warms
        the water so it evaporates?”, “What happens when water
        vapour cools?”, “How does water get back to the sea?” At
        the bottom, the summary reads: “The water cycle is driven
        by the sun: water evaporates, condenses into clouds, falls
        as rain or snow, and returns to the sea through rivers and
        groundwater.”
      </p>
      <p>
        Notice the pattern: the notes are facts, the cues are
        questions that point at those facts, and the summary is
        two sentences that could stand alone.
      </p>

      <h2>Cues for different subjects</h2>
      <p>
        The zones stay the same, but the cues change with the
        subject. For maths, write the problem type or formula as
        the cue (“Quadratic formula — when do I use it?”) and the
        worked steps in the notes area. For science, cue with
        terms and processes, as in the water-cycle example above.
        For history, cue with causes and dates (“Why did the war
        start in 1914?”). For language learning, cue with a word
        or grammar rule and put the example sentence in the notes.
        For meetings, cue with decisions and actions (“Who owns
        the follow-up?”).
      </p>

      <h2>More paper on the same site</h2>
      <p>
        Cornell notes are one paper in a set. When the writer no
        longer needs the cue column at all, the{" "}
        <Link
          href="/tools/lined-paper-generator"
          className="font-bold text-brand-teal hover:underline"
        >
          lined paper generator
        </Link>{" "}
        makes plain ruled paper in narrow, college, wide, or
        extra-wide ruling. For younger writers who still
        need help with letter heights, the{" "}
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
        explains how to use them.
      </p>

      <h2>What the Cornell notes generator does not do</h2>
      <p>
        An honest note, because it shapes what you should expect.
        This generator makes blank Cornell templates, and nothing
        else: no filled example page, no Word document, and no
        fields for your name, your class, or an essential question.
        Write the topic and date in the header strip by hand after
        printing, and put the lesson’s big question at the top of
        the notes area or in the summary box. The page does not
        save your settings either — leave it and they reset to
        the defaults, so note the cue width and summary height you
        settled on.
      </p>
    </>
  );
}
