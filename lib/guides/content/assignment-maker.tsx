import Link from "next/link";

/**
 * Guide #5 — "How to Make an Assignment with an Assignment Maker".
 *
 * Every capability claim here was checked against the real tool before
 * writing (components/tools/GeneratorTools.tsx, AssignmentTool, plus
 * WorksheetFrame and lib/stage5-content.ts):
 * eight header fields — title, subject, grade, topic, student, teacher,
 * institution, date — plus an instructions box and a content editor with
 * six formatting buttons: Heading, Subheading, Paragraph, Bullets,
 * Numbered list, and Page break, which inserts a "---PAGE BREAK---"
 * marker; page size is A4 or Letter, which changes only the preview
 * height; the live preview renders a title page — institution, title,
 * subject and grade, student, teacher, and submission date lines, then
 * the instructions and the structured content — in a normal typed print
 * font; the only output is a Print / Save PDF button that opens the
 * browser print dialog. There is NO handwriting conversion, NO paper or
 * ink options, NO handwriting font, NO PNG or JPG download, NO Word
 * export, NO images, NO answer-key or rubric block, NO save/load, and
 * NO true multi-page preview — page breaks show as dashed divider lines
 * in one long preview and the footer always reads "Page 1" — so the
 * registry description's "neat handwritten pages" and "set the paper
 * and ink" were corrected. The tool loads with a worked water-cycle
 * example for Grade 6 science.
 */

export const assignmentMakerFaqs: readonly {
  question: string;
  answer: string;
}[] = [
  {
    question: "Is the assignment maker free?",
    answer:
      "Yes. You can build an assignment sheet and print it without creating an account and without paying. The tool runs in your browser and nothing you type is saved on the site.",
  },
  {
    question: "Does it turn my assignment into handwriting?",
    answer:
      "No. The assignment maker formats your typed text into a clean printed sheet in a normal print font — it does not convert anything into handwriting, and there is no handwriting font, paper, or ink option. If you want the finished assignment to look handwritten, build the sheet here first, then run the wording through the text to handwriting converter instead.",
  },
  {
    question: "Which paper sizes are supported?",
    answer:
      "A4 and US Letter. Pick the size before you print so it matches the paper in your printer — a sheet set to A4 and printed on Letter paper will lose its bottom lines. The choice changes the height of the live preview, and the printed sheet follows the same size.",
  },
  {
    question: "Can I split a long assignment across pages?",
    answer:
      "Partly. The Page break button inserts a marker that shows in the preview as a dashed divider line, so you can see where one section ends and the next begins. But the preview itself is one long page, not a set of separate pages, and its footer always reads “Page 1”. When you print, the browser paginates the sheet for you — check the print preview and move a page break earlier if a question lands split across two pages.",
  },
  {
    question: "Can I add images, a rubric, or an answer key?",
    answer:
      "No. The maker is text only: headings, subheadings, paragraphs, bullets, and numbered lists, plus the header fields. There is no image upload, no rubric block, and no answer-key block. Write marks as ordinary lines in the content instead — for example “Question 1 (10 marks)” after each question, or a short “Marks” list at the end — and keep any answer key on a separate sheet.",
  },
  {
    question: "Does it save my work?",
    answer:
      "No. Everything you type lives in the browser on the page you are looking at, and closing the page loses it. Print the sheet or save it as a PDF before you close the tab, and keep a copy of your wording in a document if you plan to reuse the assignment next term.",
  },
];

export function AssignmentMakerGuideBody() {
  return (
    <>
      <p>
        An assignment maker takes the parts of a school assignment —
        the title, the subject, the instructions, and the questions —
        and lays them out on one tidy sheet you can print and hand out.
        It saves the fiddly formatting work: the header is filled in
        for you, the questions are numbered, and the whole sheet looks
        the same every time. This guide walks through the{" "}
        <Link
          href="/assignment-maker"
          className="font-bold text-brand-teal hover:underline"
        >
          assignment maker
        </Link>{" "}
        on this site, which is free, needs no account, and shows a live
        preview of the finished sheet as you type.
      </p>
      <p>
        One honest point first, because it shapes what this tool is
        for: this maker formats a typed assignment, it does not write
        one for you, and it does not turn your text into handwriting.
        The finished sheet is printed in a normal typed font, with no
        paper or ink options. You bring the questions; the tool brings
        the layout. If you want the finished pages to look handwritten,
        the{" "}
        <Link
          href="/guides/text-to-handwriting"
          className="font-bold text-brand-teal hover:underline"
        >
          text to handwriting guide
        </Link>{" "}
        shows how to convert typed text into handwritten-style pages
        instead — but for a class handout, a typed sheet is usually the
        clearer choice, because every student reads the same words.
      </p>

      <h2>How to make an assignment in six steps</h2>

      <h3>Step 1 — Fill in the header</h3>
      <p>
        Start with the eight fields at the top of the controls: Title,
        Subject, Grade, Topic, Student, Teacher, Institution, and Date.
        They print as the title page of the sheet — the institution at
        the top, then the title in large type, the subject and grade
        underneath, and the student, teacher, and submission date lines
        below that. Any field you leave blank prints as a blank line,
        so the sheet still looks finished, but a filled header is worth
        the minute it takes: it tells the student, the teacher, and the
        parent exactly what the work is, and it keeps a loose sheet
        from becoming anonymous in a pile. Write the date as the
        submission date, in full — “Friday, November 20” reads better
        than “20/11” and leaves no room for confusion. The Topic field
        is the place for the one-line summary of what the assignment
        covers, such as “How water moves through Earth’s systems”, so a
        student glancing at the sheet knows the subject before reading
        the questions.
      </p>

      <h3>Step 2 — Write the instructions</h3>
      <p>
        The instructions box sits under the header fields and prints as
        its own section headed “Instructions”. Write them as if the
        student will read them once, quickly, before starting: one task
        per sentence, plain verbs — “Explain”, “List”, “Compare”,
        “Draw” — and no jargon the class has not met. Put the essential
        facts first: what to do, how long or how much to write, and
        when it is due. State what will be marked — if spelling counts,
        say so; if a diagram is required, say so; if the work must be
        handwritten or word-processed, say so here rather than assuming
        it. A short instruction that names the deliverable, such as
        “Write three paragraphs, about 150 words, with one labelled
        diagram”, produces better work than a long instruction that
        never says what “done” looks like.
      </p>

      <h3>Step 3 — Write the content with the formatting buttons</h3>
      <p>
        The content box is where the assignment itself goes, and the
        six formatting buttons do the layout for you. Heading starts a
        new section, such as “Introduction” or “Main ideas”;
        Subheading marks a smaller part inside a section. Paragraph
        adds a plain block of text. Bullets makes a bulleted list, for
        points that have no order, and Numbered list makes a numbered
        list, which is the right choice for the questions themselves —
        students refer to “question 3” by number, so numbering is not
        decoration. The Page break button inserts a marker where a new
        section should start on a fresh stretch of the sheet. Click a
        button and the marker appears at the end of your content; you
        can also type the markers yourself — “# ” for a heading, “## ”
        for a subheading, “- ” for a bullet, “1. ” for a numbered item,
        and “---PAGE BREAK---” for a break — but the buttons are
        quicker and you cannot mistype them. The tool loads with a
        worked water-cycle example already filled in, so if you would
        rather edit than start blank, replace its title, subject, and
        content with your own and keep its structure.
      </p>

      <h3>Step 4 — Choose A4 or Letter</h3>
      <p>
        Pick the page size from the Page size dropdown: A4 or Letter.
        Choose the size that matches the paper in your printer before
        you print, not after — a sheet made for A4 and printed on
        Letter paper will lose its bottom lines, and the other way
        round leaves a wide empty margin. The choice changes the height
        of the live preview, so you can see the sheet at roughly its
        real proportions. In most of the world A4 is the right choice;
        in the United States and Canada, Letter is. If you are printing
        a class set on a school printer, check which paper is loaded
        first — it is the most common reason a printed assignment comes
        out wrong.
      </p>

      <h3>Step 5 — Check the live preview</h3>
      <p>
        The preview on the right updates as you type, so read the
        sheet the way a student would. The layout is fixed: the title
        page first, then the instructions, then the content with its
        headings, bullets, and numbered lists. Look for the small
        mistakes that are easy to miss — a question with no marks, a
        heading with nothing under it, a page-break marker sitting in
        the middle of a question. Two things to know about the preview:
        a page break shows as a dashed divider line, not as a new
        page, because the preview is one long sheet rather than a set
        of pages; and the footer always reads “Page 1”, whatever the
        length. Neither affects the printed sheet — the browser
        paginates it when you print — but do not read the preview as a
        page count. If the assignment is long, insert a page break
        before each new section so no question is split awkwardly when
        the browser divides the sheet.
      </p>

      <h3>Step 6 — Print it or save it as a PDF</h3>
      <p>
        When the sheet looks right, use the Print / Save PDF button
        under the preview. It opens your browser’s print dialog: print
        directly, or choose “Save as PDF” to keep a digital copy. That
        is the only export — there is no PNG or JPG download and no
        Word file, so if you need the assignment as a document to edit
        later, keep a copy of your wording in a text file of your own.
        Print one copy first and check it on paper: the margins, the
        page breaks, and the bottom lines. Then print the class set.
        And print before you close the page — nothing is saved, and
        each visit starts fresh with the water-cycle example.
      </p>

      <h2>Writing questions that work</h2>
      <p>
        The layout is the easy part; the questions are the assignment.
        A good set has a shape: a quick recall question first, two or
        three middle questions that ask for explanation or comparison,
        and one thinking question last, worth the most marks. Put the
        marks in brackets after each question so the weighting is
        visible before the student starts — “Question 1 (10 marks)” —
        and make the total a round number, usually 100, so a score is
        easy to read as a percentage. A workable split for five
        questions is 10 marks for the short recall opener, 20 each for
        three middle questions, and 30 for the longest answer: 10 + 20
        + 20 + 20 + 30 = 100. If you mark with a rubric, write it as a
        short list in the content too, for example “Content 60,
        Presentation 20, Spelling 20”, so the student knows how the
        total is built. Take the water-cycle example the tool loads
        with: it opens with an introduction, then three numbered main
        ideas — evaporation, condensation, precipitation — each one a
        single clear sentence. That is the shape to copy: a short
        introduction that frames the topic, then the questions in
        number order, hardest last, so a student who runs out of time
        loses the fewest marks on the easy ones.
      </p>

      <h2>More for the classroom</h2>
      <p>
        An assignment rarely travels alone. If you want the same
        wording in a handwritten style — for a display copy, or for
        students who read handwriting more easily than print — the{" "}
        <Link
          href="/guides/text-to-handwriting"
          className="font-bold text-brand-teal hover:underline"
        >
          text to handwriting guide
        </Link>{" "}
        shows how to turn typed text into handwritten-style pages with
        a choice of styles and ink. For a lighter handout to go with
        the assignment, the{" "}
        <Link
          href="/guides/word-search-maker"
          className="font-bold text-brand-teal hover:underline"
        >
          word search maker guide
        </Link>{" "}
        walks through building a puzzle from the assignment’s key
        words — a good revision warm-up for the same topic. And the{" "}
        <Link
          href="/printable-worksheets"
          className="font-bold text-brand-teal hover:underline"
        >
          printable worksheets
        </Link>{" "}
        page gathers the puzzle and paper tools in one place, so you
        can build a whole lesson set without hunting through the site.
      </p>

      <h2>What the assignment maker does not do</h2>
      <p>
        An honest note, because it shapes what you should expect. This
        maker formats one typed assignment sheet with a fixed layout:
        a header, an instructions section, and structured content. It
        does not write the assignment for you, it does not turn text
        into handwriting, and it offers no paper or ink choices — the
        finished sheet is plain typed print. There are no images, no
        Word export, and no PNG or JPG download; the only output is
        the browser print dialog, which prints the sheet or saves it
        as a PDF. There is no answer-key or rubric block, so marks and
        marking notes go in as ordinary lines of content, and there is
        no save or share — closing the page loses the sheet. Within
        those limits, the process is short: fill in the header, write
        the instructions, lay out the questions with the formatting
        buttons, pick the page size, check the preview, and print it.
      </p>
    </>
  );
}
