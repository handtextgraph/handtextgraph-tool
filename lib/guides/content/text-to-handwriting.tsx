import Link from "next/link";

/**
 * Guide #1 — "How to Convert Text to Handwriting".
 *
 * Every capability claim here was checked against the real tool before
 * writing (components/HandwritingTool.tsx, lib/handwriting.ts):
 * browser-local canvas rendering, 10 handwriting styles, blue/black/dark
 * gray/custom ink, lined/blank/graph/custom paper, A3/A4/A5/Letter/Legal
 * sizes, portrait/landscape, multi-page flow, PDF/PNG/JPG export, PDF and
 * DOCX text import, session-only custom font upload, transparent PNG.
 * Nothing here invents a feature, size, or claim.
 */

export const textToHandwritingFaqs: readonly {
  question: string;
  answer: string;
}[] = [
  {
    question: "Is the text to handwriting converter free?",
    answer:
      "Yes. You can convert text to handwriting and download the result without creating an account and without paying.",
  },
  {
    question: "Does my text leave my browser?",
    answer:
      "No. The handwriting renderer runs locally in your browser, so the text you type is not sent to our application server just to create the output.",
  },
  {
    question: "Can I convert a long document into more than one page?",
    answer:
      "Yes. Longer text flows across pages automatically, and PDF export keeps the complete set together in one file, so you can print the whole document at once.",
  },
  {
    question: "Which export format should I choose?",
    answer:
      "Choose PDF when you want to print or keep a multi-page document together. Choose PNG for a single page or an image you plan to place somewhere else — transparent background is available for PNG only. Choose JPG when you want the smallest file.",
  },
  {
    question: "Can I use my own handwriting instead of a built-in style?",
    answer:
      "You can upload your own handwriting font and use it as a style for the current session. The upload is session-only, so it disappears when you refresh or close the page, and you would need to upload it again next time.",
  },
  {
    question: "Can the converter read my handwriting from a photo or scan?",
    answer:
      "No. This tool goes in the other direction: it turns typed text into handwriting-style pages. It cannot read handwriting out of an image.",
  },
];

export function TextToHandwritingGuideBody() {
  return (
    <>
      <p>
        Converting text to handwriting means taking words you type and
        rendering them so they look like they were written by hand — on
        lined paper, in a chosen ink, with the uneven rhythm real
        handwriting has. It is a practical shortcut when you want the feel
        of a handwritten page without writing it out by hand: class notes,
        a letter, an assignment, or a quote you want to keep.
      </p>
      <p>
        The{" "}
        <Link href="/" className="font-bold text-brand-teal hover:underline">
          text to handwriting converter
        </Link>{" "}
        on this site does exactly that, free and without an account. The
        rendering happens in your browser, so what you type is not sent to
        our server to create the page. This guide walks through the four
        steps, what you can make with it, and a few tips that keep the
        result looking natural instead of typed text in a fancy font.
      </p>

      <h2>How to convert text to handwriting in four steps</h2>

      <h3>Step 1 — Type, paste, or import your text</h3>
      <p>
        Start by putting your words into the studio on the homepage. You
        can type directly into the text box, or paste text you already
        have. If your text lives in a file, you can also import it from a
        PDF or a Word (.docx) document instead of copying it by hand.
        Blank lines in your text become blank lines on the page, so keep
        your paragraphs as you want them to appear.
      </p>

      <h3>Step 2 — Choose a handwriting style and ink</h3>
      <p>
        Pick one of the ten built-in styles — Clear Print, Clean Notes,
        Soft Cursive, Practice Sheet, Rounded Ink, Neat Margin, Lecture
        Fast, Ink Flow, Lab Record, or Daily Notebook. A print style suits
        notes and assignments; a cursive style suits letters and quotes.
        Then choose the ink: blue, black, dark gray, or any custom color.
        Each style adds a small amount of natural variation to letter
        size, position, and slant, which is what stops the page from
        looking like a printed font.
      </p>

      <h3>Step 3 — Set up the page</h3>
      <p>
        Choose the paper first: lined, blank, or graph, or upload your
        own paper image to write on. Then choose the page size — A4 and
        Letter are the usual choices for printing, and A3, A5, and Legal
        are available too — in portrait or landscape. You can also adjust
        the font size, line spacing, word and letter spacing, margins, and
        whether a red margin line shows. If you plan to print, set the
        page size to match the paper in your printer before you export.
      </p>

      <h3>Step 4 — Preview, export, or print</h3>
      <p>
        Check the live preview before you download anything, and look at
        every page if your text runs long — longer text flows across
        pages automatically. When you are happy with it, export the whole
        document as a multi-page PDF, or download single pages as PNG or
        JPG images. A PDF is the best choice for printing, because it
        keeps all the pages together at the size you chose. You can also
        print the page straight from the browser.
      </p>

      <h2>What you can make with it</h2>
      <p>
        The converter is a general page maker, so the same four steps
        cover most everyday jobs:
      </p>
      <ul>
        <li>
          <strong>Class and lecture notes</strong> — turn typed notes into
          pages that read like a notebook, with lined paper and a margin
          line.
        </li>
        <li>
          <strong>Letters and cards</strong> — write a letter or a quote
          in a cursive style on blank paper, then export it as a PNG or
          print it.
        </li>
        <li>
          <strong>Assignments</strong> — for a full assignment, the{" "}
          <Link
            href="/tools/text-to-handwriting-pdf"
            className="font-bold text-brand-teal hover:underline"
          >
            text to handwriting PDF
          </Link>{" "}
          tool is the same converter set up for multi-page documents and
          PDF export.
        </li>
        <li>
          <strong>Journal pages</strong> — keep a daily note or diary
          entry on lined paper with a style that feels personal.
        </li>
        <li>
          <strong>Practice sheets</strong> — pair the finished page with
          a sheet from the{" "}
          <Link
            href="/tools/handwriting-worksheet-generator"
            className="font-bold text-brand-teal hover:underline"
          >
            handwriting worksheet generator
          </Link>{" "}
          when you want to practise the same words by hand afterwards.
        </li>
      </ul>

      <h2>Tips for pages that look genuinely handwritten</h2>
      <ul>
        <li>
          <strong>Keep the randomness gentle.</strong> A little variation
          in letter size and position reads as handwriting; too much reads
          as a mistake. The default setting is a good starting point.
        </li>
        <li>
          <strong>Match the page to the printer.</strong> Choose the same
          A4 or Letter size as your physical paper, preview every page,
          and print at actual size so the lines and margins land where
          you expect.
        </li>
        <li>
          <strong>Give the lines room.</strong> Slightly wider line
          spacing is easier to read and looks more like a real notebook
          page than tightly packed text.
        </li>
        <li>
          <strong>Use high PDF quality for printing.</strong> The export
          quality setting controls how sharp the download is — choose high
          when the page will be printed, and low or medium when you only
          need a quick preview on a phone.
        </li>
        <li>
          <strong>Try a cursive style for short pieces.</strong> The{" "}
          <Link
            href="/cursive-text-generator"
            className="font-bold text-brand-teal hover:underline"
          >
            cursive text generator
          </Link>{" "}
          style is ideal for a short letter or quote; for long notes, a
          clear print style stays readable page after page.
        </li>
        <li>
          <strong>Check the last page.</strong> Short documents often end
          with a nearly empty final page. Trim or add a line of text so
          the ending looks deliberate.
        </li>
      </ul>

      <h2>What the converter does not do</h2>
      <p>
        An honest note, because it shapes what you should expect. The
        converter renders your typed text in a handwriting-style font — it
        does not copy your real handwriting. If you want your own hand to
        show, you can upload your own handwriting font for the session,
        but that upload is not saved. It also cannot read handwriting out
        of a photo or scan; that is the reverse direction, turning
        handwriting back into editable text. And the output is a digital
        page: it only becomes ink on paper when you print it, so the
        paper you print on matters as much as the style you pick. A{" "}
        <Link
          href="/tools/lined-paper-generator"
          className="font-bold text-brand-teal hover:underline"
        >
          lined paper generator
        </Link>{" "}
        can give you blank ruled sheets if you would rather write the
        words yourself after all.
      </p>
      <p>
        Within those limits, the process is short: type or import your
        text, choose a style and ink, set up the page, preview it, and
        export a PDF, PNG, or JPG. Four steps, no account, and the page
        you download is the page you saw in the preview.
      </p>
    </>
  );
}
