import Link from "next/link";

/**
 * Guide #11 — "How to Convert Handwriting to Text".
 *
 * Every capability claim here was checked against the real tool before
 * writing (components/tools/TextExtractionTool.tsx, plus
 * components/PdfTextImporter.tsx and components/DocxTextImporter.tsx):
 * the page does NOT do handwriting OCR — it cannot turn a photo or scan
 * of handwriting into text, and the tool page says so plainly in an
 * amber notice; what it DOES do is extract text already stored inside
 * files, entirely in the browser, nothing uploaded — PDF (up to 15 MB),
 * Word .docx (up to 10 MB), and plain .txt; an image-only scanned PDF
 * has no stored text and comes back empty; the PDF importer shows the
 * page count after a file is chosen and lets the reader pick which
 * pages to extract ("all", a range such as 1-3, or a list such as
 * 2,4,6) with an Extract pages button, up to 200 pages per extraction,
 * and a Cancel button while it works; password-protected PDFs cannot
 * be read; the Word importer rejects legacy .doc files with an error
 * telling the reader to save as .docx; after extraction the text
 * appears in an editable textarea with a live character count, with a
 * Copy text button, a Download .txt button (saved as
 * extracted-text.txt), and a Clear button; the copy button shows
 * "Copied" for two seconds after a successful copy, and all three
 * buttons are disabled while the box is empty (Copy and Download are
 * disabled when the text is blank or whitespace-only, Clear when the
 * box is empty); pasting text directly into the box works too, and the
 * box's placeholder says so; the .txt importer rejects any file that
 * does not end in .txt, with an error telling the reader to use the
 * PDF or Word importer for those formats; the tool page links onward to
 * the PDF to handwriting tool and the main handwriting studio for the
 * reverse direction; and the tool page's own 4-step section for real
 * handwritten notes is: photograph or scan in good, even light with the
 * page flat and in focus → run OCR on your own device (iPhone Live Text
 * in Apple Notes, Google Lens on Android, Microsoft Lens) → paste the
 * recognised text into the box and proofread it (names, numbers,
 * unusual words) → copy or download the cleaned text; OCR accuracy
 * depends on how neat the writing is, and correction is normal. The
 * registry description was honest and needed no correction: the page
 * does turn pages back into editable text only where the text is
 * already stored in the file, and the guide says so plainly.
 */

export const handwritingToTextReverseFaqs: readonly {
  question: string;
  answer: string;
}[] = [
  {
    question: "Is there handwriting OCR on this site?",
    answer:
      "No. No tool on this site can turn a photo or scan of handwriting into text — there is no handwriting OCR here at all. The Handwriting to Text tool extracts text that is already stored inside PDF, Word, and plain-text files. For a photo of handwritten notes, run OCR on your own device first — iPhone Live Text in Apple Notes, Google Lens on Android, or Microsoft Lens — then paste the recognised text into the box here to clean it up.",
  },
  {
    question: "Why did my scanned PDF come back empty?",
    answer:
      "Because a scanned PDF is a picture of a page, not a document with text stored inside it. The tool can only read text that is stored in the file, so an image-only scan has nothing for it to extract and comes back empty. If the PDF was made from a scan, run OCR on it first — your phone's built-in tools can do it — and paste the result into the box.",
  },
  {
    question: "Which file types can I extract text from?",
    answer:
      "Three: PDF files up to 15 MB, Word .docx files up to 10 MB, and plain .txt files. The PDF and Word importers each read the text stored inside the file, and the plain-text option reads the file straight into the editing box. Other formats, such as images or older .doc files, are not supported — convert them to PDF or .txt first.",
  },
  {
    question: "Is my file uploaded anywhere?",
    answer:
      "No. The extraction happens entirely in your browser, and nothing you open is sent to a server. The page reads the file on your own device, so the contents stay with you. When you copy or download the extracted text, that happens in your browser too.",
  },
  {
    question: "How do I turn a photo of my handwritten notes into text?",
    answer:
      "Photograph the page in good, even light, keeping it flat and in focus. Then run OCR on your own device: on iPhone, Apple Notes can copy text from a photo with Live Text; on Android, Google Lens reads text from an image; Microsoft Lens is another free option. Copy the recognised text, paste it into the box on the Handwriting to Text tool, and proofread it — check names, numbers, and unusual words against the original page — then copy or download the cleaned text.",
  },
  {
    question: "What can I do with the extracted text afterwards?",
    answer:
      "Edit it in the box, which shows a live character count as you type. Then use Copy text to put it on the clipboard, or Download .txt to save it as a file called extracted-text.txt. From there it can go into a document, an email, or back into the handwriting studio on this site — the PDF to handwriting tool turns cleaned text into a handwritten-style PDF.",
  },
];

export function HandwritingToTextReverseGuideBody() {
  return (
    <>
      <p>
        The honest answer first: this site cannot read your
        handwriting from a photo. There is no handwriting OCR here
        — no tool on handtextgraph.com can turn a picture of a
        handwritten page into text, and anyone who promises that
        without showing you the OCR step is skipping the hard part.
        What the{" "}
        <Link
          href="/handwriting-to-text"
          className="font-bold text-brand-teal hover:underline"
        >
          Handwriting to Text tool
        </Link>{" "}
        does instead is simpler, and it does it well: it pulls out
        text that is already stored inside a file — a PDF, a Word
        document, or a plain-text file — and gives it back to you
        as editable text you can copy, fix, and use.
      </p>
      <p>
        That distinction matters, because it decides whether the
        tool will work for you at all. A PDF made in Word, a report
        exported from a spreadsheet, or a .docx your colleague sent
        you all carry their text inside the file, stored as
        characters. The tool reads those characters out. A photo of
        a handwritten page, or a PDF made by scanning a printed
        page, carries only pixels — a picture of words, not the
        words themselves. There is nothing stored to read, so the
        tool comes back empty. That is not a bug and it is not a
        failure of the page; it is the difference between a file
        that contains text and a file that contains a picture of
        text.
      </p>
      <p>
        This guide explains both sides of the job: how to use the
        tool for the files it handles, why a scan comes back empty,
        and the honest route for turning real handwritten notes
        into editable text — the route the tool page itself
        recommends, using OCR on your own phone.
      </p>

      <h2>What the Handwriting to Text tool does</h2>
      <p>
        The tool extracts text already stored inside files,
        entirely in your browser. Nothing is uploaded: the file is
        read on your own device, so its contents never leave your
        computer or phone. Three file types are supported. PDF
        files up to 15 MB, where the importer reads the text stored
        in the document. Word .docx files up to 10 MB, where the
        importer reads the text stored in the document. And plain
        .txt files, which are read straight into the editing box.
        If you open a file with the wrong importer — a .txt file in
        the PDF slot, for example — the page tells you so and
        points you to the right one.
      </p>
      <p>
        The limits are worth knowing before you start. The PDF
        importer takes files up to 15 MB, which covers almost any
        ordinary document; a PDF larger than that is usually full
        of high-resolution images, and the text inside it is a
        small part of the file. The Word importer takes .docx files
        up to 10 MB — the modern Word format. Older .doc files are
        not supported, so if you have one, open it in Word or
        Google Docs and save it as .docx first. Image files such as
        JPG or PNG are not supported either, for the same reason a
        scanned PDF comes back empty: they hold pictures, not
        stored text.
      </p>

      <h2>How to extract text from a PDF</h2>
      <p>
        Open the{" "}
        <Link
          href="/handwriting-to-text"
          className="font-bold text-brand-teal hover:underline"
        >
          Handwriting to Text tool
        </Link>{" "}
        and find the panel headed “Extract text from a PDF”. Choose
        your file — the PDF must be 15 MB or smaller — and the
        importer reads the document and shows how many pages it
        has. Then choose which pages to extract: “all”, a single
        page, a range such as 1-3, or a list such as 2,4,6 — up to
        200 pages in one extraction — and click “Extract pages”.
        The text from those pages appears in the editing box below.
        The text arrives as plain text: the words are there, but the
        original fonts, colours, and layout are not carried over. That is normal for text
        extraction. A two-column report will come out as one
        flowing block of text, a table will come out as lines of
        words without its grid, and a heading will look the same as
        a paragraph. The words are what you keep; the layout is
        yours to rebuild.
      </p>
      <p>
        If the box stays empty after you choose a PDF, the file
        almost certainly has no stored text. The usual cause is a
        scan: the PDF was made by photographing or scanning paper
        pages, so every page is an image. Another possibility is a
        PDF that was exported as images, which some scanners and
        some apps do by default. In both cases the fix is the same
        — run OCR on the file first, then work with the recognised
        text. The section below on handwritten notes walks through
        that route step by step.
      </p>
      <p>
        A quick test before you blame the tool: open the PDF in
        your usual reader and try to select a sentence with the
        mouse or your finger. If you can highlight the words, the
        text is stored in the file and the tool should read it. If
        you cannot select anything and the page behaves like a
        picture, the text is not stored, and no extractor — on this
        site or anywhere else — will find it without OCR.
      </p>

      <h2>How to extract text from a Word file</h2>
      <p>
        The Word panel works the same way, for .docx files up to
        10 MB. Choose the file and its stored text appears in the
        editing box. As with a PDF, what you get is the words
        themselves: bold, italics, headings, and tables come out as
        plain text, and any images embedded in the document are
        left behind, because they are pictures, not text. If the
        document has a header or footer, the text in it usually
        comes out with the rest, in the order the importer reads
        it — check the top and bottom of the extracted text for
        stray lines like a page number or a running title, and
        delete them in the box.
      </p>
      <p>
        Word files are the most reliable of the three formats for
        this job, because a .docx almost always stores its text
        properly. The exception is a Word document built by pasting
        in scanned images of pages — rare, but it happens with
        documents assembled from a scanner. If that is what you
        have, the box will come back empty or nearly empty, and the
        OCR route below is the way forward.
      </p>

      <h2>How to open a plain-text file</h2>
      <p>
        The third panel, “Or open a plain-text file”, is the
        simplest of the three. Choose a .txt file and its contents
        are read straight into the editing box — nothing is
        extracted, because a plain-text file is already just text.
        This is useful when a file is already in the right form but
        you want the editing box, the character count, and the copy
        and download buttons for it. It is also the panel to use
        for text you pasted in yourself: the box accepts pasted
        text directly, so anything on your clipboard — OCR output
        from your phone, a paragraph from an email, a chunk of a
        document — can be dropped in and cleaned up there. The
        placeholder in the empty box says so: extracted text
        appears here, or paste text directly to clean it up.
      </p>

      <h2>What you can do with the extracted text</h2>
      <p>
        Once the text is in the box, it is yours to edit. The box
        is a plain textarea, twelve rows tall, and everything in it
        can be changed: fix a typo, delete a stray line, rejoin a
        sentence that the extractor split across two lines, or
        rewrite a paragraph. Below the box a live character count
        updates as you type, which is handy when the text has to
        fit a limit — a form field, a social media post, or a
        message with a maximum length.
      </p>
      <p>
        Three buttons sit under the count. Copy text puts the whole
        contents of the box on the clipboard, and the button
        briefly changes to “Copied” for two seconds so you know it
        worked. Download .txt saves the text as a file called
        extracted-text.txt, in plain text with UTF-8 encoding, so
        it opens in any text editor or word processor. Clear empties
        the box so you can start again with another file. The
        buttons are disabled while there is nothing to act on —
        Copy and Download stay greyed out until the box holds some
        real text, and Clear stays greyed out while the box is
        empty — so a click that does nothing is never a mystery.
        One detail worth knowing: the file you download is always
        called extracted-text.txt, whatever the original file was
        named, so rename it when you save it if the name matters.
      </p>
      <p>
        The most common use is the simplest one: get the words out
        of a file and into somewhere useful. A quote from a PDF into
        an essay. The body of a Word document into an email. The
        text of a report into a notes app. Because the extraction
        happens in the browser and nothing is uploaded, it is also
        a safe way to handle a private document — a contract, a
        medical letter, a piece of work under review — without
        sending it to a server you do not control.
      </p>

      <h2>Why a scanned PDF comes back empty</h2>
      <p>
        This is the question that causes the most confusion, so it
        is worth a section of its own. A scanned PDF looks like a
        document, opens like a document, and prints like a
        document — but inside, it is a set of images. The scanner
        took a photograph of each page and stored the photograph.
        No characters were ever stored, because the scanner never
        knew what the words were; it only knew what they looked
        like. An extractor reads stored characters, so it finds
        nothing to read, and the box stays empty.
      </p>
      <p>
        Some PDFs are mixed: a report typed in Word and then
        printed and scanned will have image pages throughout, while
        a PDF assembled from two sources might have stored text on
        some pages and images on others. In that case the tool
        returns the text from the pages that have it and nothing
        from the pages that do not, which can look like half the
        document went missing. It did not go missing — it was
        never stored as text. The selection test above is the
        fastest way to tell which pages are which.
      </p>
      <p>
        The same logic applies to a photograph of a handwritten
        page saved as a PDF. The file holds a picture of
        handwriting, and a picture of handwriting is not text, no
        matter how clearly the words can be read by a person. Only
        OCR — software that looks at the shapes of the letters and
        guesses the characters — can turn that picture into text.
        This site does not include OCR, which is why the honest
        route below starts on your phone rather than on this page.
      </p>

      <h2>From handwritten notes to editable text: the honest route</h2>
      <p>
        Your handwritten notes can still become editable text. It
        just takes a step this site cannot do for you, and it is
        better to know that now than to spend an afternoon
        uploading photos to a page that was never built for them.
        The route has four steps, and the first two happen on your
        own device.
      </p>

      <h3>Step 1 — Photograph or scan the page well</h3>
      <p>
        Good OCR starts with a good picture. Photograph or scan
        your notes in good, even light, keeping the page flat and
        the text in focus. A phone camera is enough for clear
        handwriting. Avoid shadows across the page, avoid glare
        from a lamp or a window, and hold the phone square above
        the page rather than at an angle — a page photographed at a
        slant comes out with lines that lean, and leaning lines
        confuse OCR. If the page is curled or creased, flatten it
        under a book first. One page per photograph, with the whole
        page in the frame and a small margin around it, gives the
        best results.
      </p>

      <h3>Step 2 — Run OCR on your own device</h3>
      <p>
        OCR is optical character recognition: software that looks
        at the shapes in a picture and works out which letters they
        are. Your phone already has it. On iPhone, Apple Notes can
        copy text from a photo with Live Text — open the photo,
        tap the text, and copy it. On Android, Google Lens reads
        text from an image — open the photo in Lens and copy what
        it finds. Microsoft Lens is another free option that works
        on both, and it is built for exactly this job: photograph a
        page, let it read the words, and copy the result. None of
        these needs an account for the basic job, and none of them
        needs the photo to leave your phone to do it.
      </p>
      <p>
        Expect the first result to be imperfect. OCR accuracy
        depends on how clear the handwriting is. Neat, evenly
        spaced writing with consistent letter shapes recognises
        well; rushed writing, faint pencil, narrow line spacing,
        and unusual abbreviations need more correction. That
        correction step is normal, not a sign that anything went
        wrong — even the best OCR on the tidiest handwriting makes
        mistakes, and a page of quick lecture notes will always
        need a human eye over it.
      </p>

      <h3>Step 3 — Paste the text into the box and proofread it</h3>
      <p>
        Copy the recognised text from your phone and paste it into
        the editing box on the{" "}
        <Link
          href="/handwriting-to-text"
          className="font-bold text-brand-teal hover:underline"
        >
          Handwriting to Text tool
        </Link>
        . This is where the tool earns its place in the route: the
        box, the character count, and the copy and download buttons
        are all there for exactly this clean-up job. Read the pasted
        text against the original page, line by line, and fix what
        the OCR got wrong. Check names first — OCR regularly turns
        an unfamiliar name into a familiar word — then numbers,
        dates, and amounts, where a misread digit changes the
        meaning, and then unusual words: technical terms, foreign
        words, and abbreviations the software has never seen. Short
        words are the other classic failure: “in” becomes “m”,
        “a” disappears, and a crossed-out word comes back as a
        nonsense string. Delete the crossings-out, rejoin the lines
        the OCR split in the wrong place, and put the paragraph
        breaks back where they belong.
      </p>
      <p>
        Proofread in two passes if the page matters. The first pass
        catches the obvious errors — the words that are clearly
        wrong. The second pass, read aloud or read backwards
        sentence by sentence, catches the errors that look right:
        a real word in the wrong place, a number that is plausible
        but wrong, a name spelled almost correctly. For a page of
        class notes the first pass is usually enough. For anything
        that will be sent to someone else — an application, a
        letter, a piece of work — do both.
      </p>

      <h3>Step 4 — Copy or download the cleaned text</h3>
      <p>
        When the text reads correctly, use Copy text to put it on
        the clipboard, or Download .txt to save it as
        extracted-text.txt. From there it can go wherever it is
        needed: into a document, an email, a notes app, or a
        message. And if the journey is a round trip — notes that
        started as handwriting, became text, and need to go back to
        handwriting — the site can do that half of it: send the
        cleaned text to the{" "}
        <Link
          href="/tools/text-to-handwriting-pdf"
          className="font-bold text-brand-teal hover:underline"
        >
          PDF to handwriting tool
        </Link>{" "}
        or the{" "}
        <Link
          href="/#studio"
          className="font-bold text-brand-teal hover:underline"
        >
          main handwriting studio
        </Link>
        , which turn typed text into a handwritten-style page.
      </p>

      <h2>Getting better results from OCR</h2>
      <p>
        A few habits make a large difference to how much correction
        a page needs. Write with a dark pen on plain white or
        pale-lined paper — faint pencil and coloured ink are both
        harder for OCR to read. Keep the line spacing even and
        leave a clear gap between lines; writing that crowds the
        line above it merges the letters in the photograph. Form
        each letter fully rather than joining everything into a
        single stroke, and keep the slant consistent across the
        page. Numbers deserve extra care: write them clearly and
        leave a space around them, because a “1” that touches a
        “7” reads as one character. If a page is a draft full of
        crossings-out and arrows, copy the final version out
        neatly before photographing it — the five minutes of
        copying saves fifteen minutes of correction.
      </p>
      <p>
        The same advice applies to the photograph itself. Bright,
        even daylight beats a desk lamp, because a lamp lights one
        side of the page more than the other. A dark background
        behind a white page helps the phone find the edges of the
        sheet. And if the OCR keeps failing on one page, try
        photographing it again closer up, one half at a time — a
        larger image of fewer words is easier to read than a small
        image of a whole crowded page.
      </p>

      <h2>The reverse direction: text back into handwriting</h2>
      <p>
        The tool on this page is one half of a two-way street. The
        other half is the direction this site is built for: turning
        typed text into handwriting. The{" "}
        <Link
          href="/guides/text-to-handwriting"
          className="font-bold text-brand-teal hover:underline"
        >
          text to handwriting guide
        </Link>{" "}
        explains the main studio, where you type or paste text,
        choose a handwriting style, and download the result as a
        handwritten-style page. The{" "}
        <Link
          href="/tools/text-to-handwriting-pdf"
          className="font-bold text-brand-teal hover:underline"
        >
          PDF to handwriting tool
        </Link>{" "}
        does the same job as a PDF, and the{" "}
        <Link
          href="/tools/word-to-handwriting"
          className="font-bold text-brand-teal hover:underline"
        >
          Word to handwriting tool
        </Link>{" "}
        turns a Word document into handwritten-style pages. So a
        piece of writing can make the full round trip: handwritten
        notes become text through your phone&apos;s OCR, the text
        is cleaned up in the box on this page, and the cleaned text
        goes back into handwriting as a neat, finished page. Each
        step uses the tool built for it, and none of them pretends
        to do the others&apos; job.
      </p>

      <h2>What this tool does not do</h2>
      <p>
        A short, honest list, so there are no surprises. It does
        not do handwriting OCR, and it cannot turn a photo or a
        scan of handwriting into text — that step belongs on your
        phone, with Live Text, Google Lens, or Microsoft Lens. It
        does not read image files, and it does not read older .doc
        files. It does not keep the formatting of the original
        document: fonts, colours, tables, and layout are left
        behind, and only the words come through. It does not save
        your text anywhere — leave the page and the box is empty
        again, so copy or download before you go. And it does not
        upload your file, which is a feature rather than a
        limitation: a private document stays private, because it
        never leaves your device. Within those limits, it does one
        job cleanly: it gets the words out of a file and into your
        hands, ready to edit and use.
      </p>
    </>
  );
}
