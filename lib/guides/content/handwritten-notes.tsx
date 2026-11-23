import Link from "next/link";

/**
 * Guide #14 — "How to Make Handwritten Notes".
 *
 * Every capability claim here was checked against the real tool before
 * writing (lib/tool-profiles.ts, "notes" profile; lib/tool-pages.ts,
 * "notes" entry; components/HandwritingTool.tsx presets; and
 * lib/handwriting.ts, the rendering engine):
 * the workspace turns TYPED notes into handwritten-style pages on the
 * site's browser-based handwriting engine; the notes defaults are
 * lined A4, style "clean-notes", font size 32, line spacing 1.5,
 * left margin 170, top margin 115, randomness 0.3, margin line shown,
 * and no paragraph indent; optional title, subject, and date fields
 * (noteTitle, noteSubject, noteDate in HandwritingTool.tsx) are added
 * as simple plain-text header lines, e.g. "Title: ..."; the three
 * presets are Class Notes (lined A4, blue ink, clean-notes style,
 * font size 32, line spacing 1.45, randomness 0.32), Revision Notes
 * (lined A4, black ink, clean-notes style, font size 31, line
 * spacing 1.55, randomness 0.26), and Simple Notes (blank A4, blue
 * ink, style "daily-notebook", font size 32, line spacing 1.5,
 * randomness 0.3, margin line off); all five page sizes (A3, A4,
 * A5, US Letter, US Legal) are available and landscape is allowed;
 * export is multi-page PDF (current-page PDF or all-pages PDF),
 * Download PNG, and Download JPG — there is NO in-tool Print button
 * on this workspace, so printing means exporting the PDF and
 * printing from it, or using the browser's own print; the tool page
 * itself says "print one test page before producing a large set".
 * Ink colours in the engine are blue (#1d4ed8), black (#111827),
 * dark grey (#374151), or a custom hex colour. The tool does NOT
 * summarize, generate, fact-check, or automatically structure
 * notes — the user brings the content; it does NOT upload DOCX or
 * PDF files in this workspace (the tool page's limitations text:
 * import a DOCX through the separate Word workflow or a
 * selectable-text PDF through the PDF converter, then move the
 * reviewed text into this notes workspace); it does NOT reproduce
 * anyone's real handwriting — every page is rendered in one of the
 * engine's shared styles, so your notes look like the Clean Notes
 * style, not like your own hand; rendering is local in the browser
 * and the text is not stored on a HandTextGraph server (the tool
 * page's privacy text adds that third-party website services may
 * still process technical and usage information). The tool page's
 * own starter example is photosynthesis revision notes — the worked
 * example in this guide uses the water cycle instead, written from
 * scratch. The registry description was honest and needed no
 * correction: the tool does make clean handwritten notes from typed
 * text, with a readable style, a simple layout, and pages you can
 * print or keep.
 */

export const handwrittenNotesFaqs: readonly {
  question: string;
  answer: string;
}[] = [
  {
    question: "Does it summarise my notes with AI?",
    answer:
      "No. The workspace does not summarise, generate, fact-check, or automatically structure anything. It only renders the text you type or paste into handwritten-style pages. If your notes are a mess, the output will be a tidy-looking mess — so clean the notes first, shorten them into key points, and add a short heading and a recap question for each topic before you render them.",
  },
  {
    question: "Can I add a title, subject, and date to my notes?",
    answer:
      "Yes. The notes workspace has optional title, subject, and date fields, and they are added as simple plain-text lines at the top of the page — for example, \"Title: The Water Cycle\". Fill them in before you render, and keep them short: a long title eats the first lines of the page. The date is useful for revision sets, because it tells you at a glance which version of a topic you are looking at.",
  },
  {
    question: "Can I upload a Word document or a PDF here?",
    answer:
      "No, not in this workspace. There is no DOCX or PDF upload on the handwritten notes page. If your notes live in a Word file, use the separate Word-to-handwriting workflow; if they are in a PDF with selectable text, use the PDF converter. In both cases, check the extracted text first, then paste the reviewed text into this notes workspace and render it here.",
  },
  {
    question: "Can I print the notes?",
    answer:
      "Yes. Export the set as a PDF — the all-pages PDF combines every generated page into one document — and print from the PDF. There is no Print button inside this workspace, so printing happens from the exported file or from the browser's own print command. Print one test page first and check it: the handwriting size, the line spacing, and whether the last line of a page is cut off. Only then print the whole set.",
  },
  {
    question: "Which preset should I use for revision?",
    answer:
      "Use Revision Notes for revision sets. It renders on lined A4 in black ink, in the Clean Notes style, with slightly tighter spacing and lower variation than Class Notes, which suits short, dense sections you will read again under time pressure. Class Notes is the better pick for notes taken in class — blue ink, a little more open spacing, and a readable style for longer passages. Simple Notes suits short lists and reminders: blank A4, blue ink, no margin line, and a natural spacing that does not fight with one-line items.",
  },
  {
    question: "Will it copy my real handwriting?",
    answer:
      "No. Nothing on this site learns or copies your handwriting. The pages are rendered in one of the engine's shared styles — Clean Notes by default for this workspace — so your notes will look like that style, not like your own hand. That is a fair trade for study notes: the style is consistent from the first page to the last, every word is legible, and a whole revision set looks like it belongs together.",
  },
];

export function HandwrittenNotesGuideBody() {
  return (
    <>
      <p>
        Handwritten notes are easier to revise from than a wall of
        typed text, but writing a whole revision set by hand takes
        hours — and most students give up halfway through. The{" "}
        <Link
          href="/tools/handwritten-notes"
          className="font-bold text-brand-teal hover:underline"
        >
          Handwritten Notes Generator
        </Link>{" "}
        on this site closes that gap: you type or paste notes you
        have already written, and it renders them as clean
        handwritten-style pages on lined A4, ready to export as a
        PDF and print. This guide shows the workflow that makes
        those pages worth revising from — because the tool only
        styles your notes, it cannot fix them.
      </p>
      <p>
        That last point matters more than any setting on the page.
        The workspace does not summarise, generate, fact-check, or
        structure your notes. It takes the words you give it and
        draws them in a neat handwriting style. Good notes in,
        good pages out; a copied paragraph in, a tidy-looking
        paragraph out that you still cannot revise from. So the
        work in this guide is mostly done before you open the
        tool: clean the notes, cut them to key points, and shape
        them so each page teaches one topic.
      </p>

      <h2>What the tool does</h2>
      <p>
        The workspace is a notes studio built on the site&apos;s
        browser-based handwriting engine. You write or paste your
        notes into the editor, add an optional title, subject, and
        date, pick a preset, and watch a live preview of the
        rendered pages. Everything happens in your browser, and
        the text is not stored on a HandTextGraph server — the
        pages exist on your screen and in the files you export,
        nowhere else.
      </p>
      <p>
        The defaults are chosen for readable study notes: lined
        A4, the Clean Notes style, font size 32, line spacing 1.5,
        a left margin of 170, a top margin of 115, a little
        natural variation (randomness 0.3), the margin line shown,
        and no paragraph indent. The ink defaults to blue. Three
        presets sit on top of those defaults. Class Notes keeps
        the lined A4 and blue ink with a readable style and open
        spacing, for notes you will read through slowly. Revision
        Notes switches to black ink with concise sections and low
        variation, for short sets you will re-read under time
        pressure. Simple Notes drops the lines altogether — blank
        A4, blue ink, natural spacing, no margin line — for short
        lists and reminders that do not need ruling. All five page
        sizes are available, and landscape is allowed if a topic
        needs the width.
      </p>
      <p>
        Export is where the set becomes useful. The all-pages PDF
        combines every generated page into one document, which is
        the practical export for a multi-page revision set. PNG
        and JPG downloads cover single pages — a page to share, or
        one to keep on a phone. There is no Print button inside
        the workspace, so printing means exporting the PDF and
        printing from it, or using the browser&apos;s own print.
        Either way, print one test page first: check the size of
        the handwriting, the spacing, and whether any line is cut
        off at the bottom of the page.
      </p>

      <h2>Step 1 — Clean the notes first</h2>
      <p>
        Before you open the tool, read your notes once and ask
        three questions: is every fact right, is anything
        missing, and is anything repeated? Fix the facts first,
        because a beautifully rendered wrong date is still a
        wrong date, and the tool will not catch it. Then cut
        anything that does not help you answer a question: copied
        definitions you already know, examples that repeat the
        same point twice, and filler sentences that only connect
        one idea to the next. A page of notes should hold what
        you need to remember, not everything the textbook said.
      </p>
      <p>
        A useful test: if a sentence cannot become a question,
        cut it or shorten it. &ldquo;Evaporation is the process by
        which water changes from a liquid to a gas&rdquo; becomes a
        question at once — &ldquo;What is evaporation?&rdquo; — so it
        earns its place. A sentence like &ldquo;This topic is very
        important for the exam and students should study it
        carefully&rdquo; becomes no question at all, so it goes.
        Clean notes are short notes, and short notes are the only
        kind you will actually re-read.
      </p>

      <h2>Step 2 — Shape the page: headings, one idea per line</h2>
      <p>
        A revision page is not an essay. Give each topic a short
        heading, then put one idea on each line or bullet. One
        idea per line is the single most important rule in this
        guide: when every line holds exactly one fact, your eye
        can scan the page and find the fact it needs, and you can
        cover a line with your thumb and test yourself on it.
        Long lines that wrap across two or three rules defeat
        both tricks, so break them up. If a point needs more than
        one line, it is two points — split it.
      </p>
      <p>
        Keep paragraphs short and keep the breaks. The tool
        preserves paragraph breaks, so the structure you type is
        the structure you get: a heading, a blank line, then the
        points. Resist the urge to fill every line. White space
        is not wasted space on a revision page — it is where your
        eye rests, and where you will add a correction later in
        pen. A page that looks half empty is usually a page that
        works; a page crammed edge to edge is a page you will
        avoid opening.
      </p>
      <p>
        End each topic with a recap question, written in your own
        words. Not a heading that says &ldquo;Summary&rdquo;, and not a
        repeat of the heading — a real question you can try to
        answer from memory. &ldquo;Where does condensation happen,
        and what triggers it?&rdquo; is a recap question; &ldquo;The
        water cycle&rdquo; is not. The question turns the page from
        something you read into something you practise with, and
        it is the cheapest revision technique there is — one line,
        no extra tools, and it works every time you open the
        page.
      </p>

      <h2>Step 3 — Add a title, subject, and date</h2>
      <p>
        The workspace has optional title, subject, and date
        fields, and they are added as simple plain-text lines at
        the top of the page. Use them. A title tells you which
        topic the page covers without reading the first line; a
        subject tells you which paper or module it belongs to;
        a date tells you which version of the topic you are
        holding, which matters when you rewrite a topic a month
        later and end up with two sets.
      </p>
      <p>
        Keep all three short. A title like &ldquo;The Water Cycle
        — Revision Notes&rdquo; is enough; a title that runs to two
        lines eats the first ruled lines of the page and pushes
        the content down. The same goes for the subject: &ldquo;Geography
        — Year 9&rdquo; is plenty. Fill the fields in before you
        render, because they are part of the page layout — adding
        them afterwards reflows everything below them.
      </p>

      <h2>Step 4 — Pick a preset for the job</h2>
      <p>
        Start with the preset that matches what the pages are
        for, then adjust only if the preview asks for it. Class
        Notes is the default shape: lined A4, blue ink, the Clean
        Notes style, open spacing. It suits notes you will read
        through slowly — class notes, a first pass over a new
        topic, anything long. Revision Notes is the same style on
        lined A4 but in black ink, with tighter spacing and lower
        variation, which suits short, dense sections you will
        re-read quickly before a test. Simple Notes is the odd
        one out: blank A4, blue ink, no margin line, natural
        spacing — it suits short lists, reminders, and one-page
        summaries where ruled lines would only get in the way.
      </p>
      <p>
        If none of the presets fits, the settings underneath are
        all adjustable: font size, line spacing, margins, ink
        colour, and the amount of natural variation. Blue, black,
        and dark grey inks are built in, and a custom hex colour
        is available too. Two cautions: a very large font size
        pushes a short topic onto two pages, and very high
        variation looks lively on one page but tiring across a
        twenty-page set. For a revision set, consistency beats
        character — pick one preset, one ink, and one size, and
        use them for the whole set.
      </p>

      <h2>Step 5 — Check every page in the preview</h2>
      <p>
        The live preview is your proofreader. Read each page in
        it before you export, and look for four specific
        problems. First, a heading stranded at the bottom of a
        page with its points on the next — add a blank line
        before the heading or shorten the section above it.
        Second, a line that runs past the right margin — shorten
        the line or split the point. Third, a page that ends
        half empty because one long section refused to split —
        break the section into two topics. Fourth, a typo that
        survived the clean-up — the handwriting style makes
        spelling mistakes harder to spot, not easier, so read
        slowly.
      </p>
      <p>
        The preview also shows you the pagination, which is the
        part most people skip. A revision set is read page by
        page, so each page should end at a sensible place: the
        end of a topic, or the end of a section — never in the
        middle of a list. If a page breaks awkwardly, add or
        remove a line above the break until it lands cleanly.
        Five minutes of preview checking saves a reprint of the
        whole set.
      </p>

      <h2>Step 6 — Export the PDF and print one test page</h2>
      <p>
        For a multi-page set, export the all-pages PDF: one file,
        every page in order, ready to print or keep. The
        current-page PDF is for a single page you want on its
        own. PNG and JPG downloads cover one page at a time — a
        page to send to a study partner, or one to keep on your
        phone for a quick read on the bus. Name the file by topic
        and date, not by the default name, so you can find it
        again in a month: &ldquo;water-cycle-revision-nov-2026&rdquo;
        will still make sense in January.
      </p>
      <p>
        Then print one test page before you print the set. Check
        the handwriting size against your normal reading distance,
        check that no line is cut off at the bottom, and check
        that the margin line and the ruled lines sit where you
        expect them. If the test page is wrong, the whole set
        will be wrong in exactly the same way — fix the setting,
        re-export, and test again. If the test page is right,
        print the set, and keep the PDF: when you rewrite the
        topic next month, you will want the file, not just the
        paper.
      </p>

      <h2>Worked example: the water cycle, one topic per page</h2>
      <p>
        Here is the workflow on a real topic, written from
        scratch for this guide. The topic is the water cycle, for
        a geography revision set, and the whole topic fits on one
        page: a title line, four short sections, and a recap
        question at the end. Each section holds one idea per
        line, and nothing is copied from a textbook paragraph.
      </p>
      <p>
        The typed text looks like this. Title: The Water Cycle.
        Subject: Geography. Date: 23 November 2026. Then the
        sections. &ldquo;Evaporation — Water changes from liquid to
        gas. Heat from the sun drives it. Most evaporation happens
        from oceans and lakes.&rdquo; Then, &ldquo;Condensation — Water
        vapour cools and changes back to liquid. Tiny droplets
        form around dust particles. Clouds are collections of
        these droplets.&rdquo; Then, &ldquo;Precipitation — Droplets join
        until they are too heavy to stay up. They fall as rain,
        snow, or hail. The form depends on the temperature of the
        air below the cloud.&rdquo; Then, &ldquo;Collection — Water gathers
        in rivers, lakes, and oceans. Some soaks into the ground
        and becomes groundwater. The cycle starts again.&rdquo; And
        finally the recap question: &ldquo;Where does condensation
        happen, and what triggers it?&rdquo;
      </p>
      <p>
        Render that with the Revision Notes preset — lined A4,
        black ink, concise sections — and the result is a page
        you can revise from in two minutes: four sections, each
        one idea per line, and a question at the bottom that
        tests the whole page. If a section grows past the page,
        split it: evaporation and condensation on page one,
        precipitation and collection on page two, with the recap
        question at the end of page two. Never let a section
        straddle a page break if you can avoid it.
      </p>

      <h2>The same-day rewrite habit</h2>
      <p>
        The best time to make handwritten notes is the same day
        you first meet the topic. Notes written the same day are
        a rewrite, not a copy: you remember the lesson well
        enough to shorten it, but not so well that you can skip
        the thinking. Wait a week, and the same notes become a
        transcription exercise — you copy the textbook because
        you no longer remember what mattered. So build the habit
        into the workflow: class in the morning, clean notes in
        the evening, rendered pages before bed. Ten minutes a
        day beats a five-hour session the night before the test.
      </p>
      <p>
        Keep the sets topic by topic, not date by date. One PDF
        per topic, named by topic and date, is a revision library
        you can actually use: open the topic you are weak on,
        read it, answer the recap question, and move on. A single
        giant file called &ldquo;notes-november&rdquo; is a drawer you
        will never open. And when you rewrite a topic — which you
        should, once, about a month later — keep the old version.
        Comparing the two sets shows you what you have learned,
        and the date on each page tells you which is which.
      </p>

      <h2>Handwritten notes vs Cornell notes</h2>
      <p>
        If you want a stricter structure than plain headings and
        bullets, the{" "}
        <Link
          href="/guides/cornell-notes"
          className="font-bold text-brand-teal hover:underline"
        >
          Cornell notes guide
        </Link>{" "}
        covers a layout with a cue column, a notes column, and a
        summary strip — a good fit for lectures, where you need
        questions down the side and a summary at the bottom.
        Plain handwritten notes are looser: no columns, no
        summary strip, just headings, points, and a recap
        question. Use Cornell notes when the material is dense
        and you need the structure to force you to summarise; use
        plain handwritten notes when the topic is short and the
        structure would only slow you down. Many students use
        both — Cornell for lectures, plain notes for revision
        sets — and that is a sensible split.
      </p>
      <p>
        The same choice applies to the paper underneath. If your
        notes are mostly lists and short points, the lined paper
        in this workspace is enough. If you want blank or ruled
        sheets without any handwriting on them — for notes you
        will write out by hand later — the{" "}
        <Link
          href="/tools/lined-paper-handwriting"
          className="font-bold text-brand-teal hover:underline"
        >
          lined paper tool
        </Link>{" "}
        prints the sheets themselves, and the{" "}
        <Link
          href="/guides/lined-paper"
          className="font-bold text-brand-teal hover:underline"
        >
          lined paper guide
        </Link>{" "}
        covers how to choose the ruling. And if you are still
        deciding whether typed-to-handwritten pages suit you at
        all, the{" "}
        <Link
          href="/guides/text-to-handwriting"
          className="font-bold text-brand-teal hover:underline"
        >
          text-to-handwriting guide
        </Link>{" "}
        walks through the general converter first, while the{" "}
        <Link
          href="/guides/handwriting-practice"
          className="font-bold text-brand-teal hover:underline"
        >
          handwriting practice guide
        </Link>{" "}
        covers improving your own handwriting on paper — the other
        half of the same skill.
      </p>

      <h2>What it does not do</h2>
      <p>
        A plain statement of the limits, so nothing here is
        oversold. This workspace does not summarise, generate,
        fact-check, or automatically structure your notes — the
        content is yours, and so are any mistakes in it. It does
        not accept Word or PDF uploads here; those go through the
        separate Word workflow and PDF converter, and only the
        reviewed text comes into this workspace. It does not
        reproduce your real handwriting — every page is rendered
        in one of the engine&apos;s shared styles, so the notes
        look like the Clean Notes style, not like you. And it does
        not store your text on a server; the pages live in your
        browser and in the files you export, which is good for
        privacy and means there is no cloud copy to recover if
        you close the tab without exporting. Within those limits,
        it does one thing well: it turns notes you have already
        thought about into clean, consistent, printable pages
        you will actually re-read.
      </p>
    </>
  );
}
