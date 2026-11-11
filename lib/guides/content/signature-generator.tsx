import Link from "next/link";

/**
 * Guide #2 — "How to Make a Signature with a Signature Generator".
 *
 * Every capability claim here was checked against the real tool before
 * writing (components/tools/GeneratorTools.tsx, SignatureTool):
 * two modes (Typed / Draw); Typed renders the name at a fixed 112px in
 * one of four styles (Classic Cursive, Segoe Script, Brush Script MT,
 * Kalam); Draw is freehand on a 1200x420 canvas with pen thickness
 * 1–12, one-step Undo, and Clear; ink colour picker and a Transparent
 * PNG checkbox (on by default) in both modes; downloads as PNG, JPG,
 * or PDF; no account, nothing saved on the site. There is NO slant
 * control, NO flow control, and NO font-size control in this tool —
 * the registry description's "adjust the slant and flow" does not
 * match the tool, so this guide does not claim it. The tool itself
 * states generated signatures are visual assets, not certified
 * electronic signatures.
 */

export const signatureGeneratorFaqs: readonly {
  question: string;
  answer: string;
}[] = [
  {
    question: "Is the signature generator free?",
    answer:
      "Yes. You can make a signature and download it as a PNG, JPG, or PDF without creating an account and without paying.",
  },
  {
    question: "Can I download my signature with a transparent background?",
    answer:
      "Yes. Keep the Transparent PNG checkbox ticked — it is on by default — and download the PNG. JPG and PDF do not carry transparency, so use PNG when the signature has to sit on a coloured background or a document.",
  },
  {
    question: "Should I use the typed style or draw my signature?",
    answer:
      "Use Typed when you want a clean, repeatable signature quickly: type your name and pick one of the four styles. Use Draw when you want the signature to look like your own hand — draw it with a mouse, finger, or stylus, and use Undo to step back one stroke at a time.",
  },
  {
    question: "Can I use this signature to sign legal documents?",
    answer:
      "No, not as a certified electronic signature. The tool produces a visual image of a signature. It carries no identity check or legal verification, so do not rely on it where a document needs a legally recognised signature.",
  },
  {
    question: "Why does my signature look different on another device?",
    answer:
      "Two of the typed styles — Segoe Script and Brush Script MT — rely on fonts installed on the device you are using, so the exact look can vary slightly between devices. Classic Cursive and Kalam are the safer picks when the signature has to look the same everywhere. A drawn signature never has this problem, because it is your own strokes.",
  },
  {
    question: "Is my name stored anywhere when I make a signature?",
    answer:
      "No. The tool runs in your browser and there is no account and no saving on the site — the signature exists only in your browser until you download it. Each visit starts fresh, so download the file before you close the page.",
  },
];

export function SignatureGeneratorGuideBody() {
  return (
    <>
      <p>
        A signature generator turns a name into a signature you can use —
        an image file you can drop into a document, an email, or a form,
        instead of signing the same thing by hand every time. There are
        two honest ways to make one: type your name and let a script
        style render it, or draw it yourself with a mouse, finger, or
        stylus. This guide covers both, because the{" "}
        <Link
          href="/signature-generator"
          className="font-bold text-brand-teal hover:underline"
        >
          signature generator
        </Link>{" "}
        on this site offers both, free and without an account.
      </p>
      <p>
        Before the steps, one thing to know: the signature this tool makes
        is a visual asset — an image of a signature. It is not a certified
        electronic signature and it carries no identity check or legal
        verification. It is right for emails, letters, and everyday
        documents. It is not the right thing where a document needs a
        legally recognised signature.
      </p>

      <h2>How to make a signature in five steps</h2>

      <h3>Step 1 — Open the tool and choose Typed or Draw</h3>
      <p>
        Open the signature generator and pick a mode. Typed is the quick
        route: you type your name and choose a style. Draw is the personal
        route: you sign on the canvas yourself. You can switch between
        them at any time — switching to Draw clears the canvas, so finish
        one version before you try the other.
      </p>

      <h3>Step 2 — Typed: type your name and pick a style</h3>
      <p>
        In Typed mode, replace the example name with your own — your full
        name, or just the form you actually sign with. Then choose one of
        the four styles: Classic Cursive, Segoe Script, Brush Script MT,
        or Kalam. Each one has a different character: Classic Cursive is
        neat and formal, Segoe Script is light and flowing, Brush Script
        MT is bold and expressive, and Kalam has a handwritten, marker-like
        feel. Try all four before you settle — the same name can look
        completely different in each style, and the preview updates as you
        change it. There is no font-size control; the name is rendered at
        one fixed size on a wide canvas, which keeps the proportions
        consistent.
      </p>

      <h3>Step 3 — Draw: sign it yourself</h3>
      <p>
        In Draw mode, sign directly on the preview canvas with a mouse,
        finger, or stylus. Set the pen thickness first — the slider runs
        from 1 to 12, with thin strokes for a fine signature and thick
        strokes for a bold one. Sign the way you normally would, in one
        flowing motion if you can. If a stroke goes wrong, Undo steps back
        one stroke at a time, and Clear wipes the canvas so you can start
        over. A stylus or touchscreen gives the most natural result, but a
        mouse works fine for a simple, readable signature.
      </p>

      <h3>Step 4 — Set the ink colour and the background</h3>
      <p>
        Both modes share two settings. Pick the ink colour — dark navy or
        black reads best on documents, while a coloured ink suits a logo
        or a personal brand. Then check the Transparent PNG box, which is
        on by default. With it on, the PNG has no background at all, so
        the signature sits cleanly on any page or coloured background.
        With it off, the signature gets a plain white background instead.
        If you plan to place the signature on anything other than white,
        leave transparency on.
      </p>

      <h3>Step 5 — Preview, download, and check it small</h3>
      <p>
        Check the high-resolution preview — the canvas is 1200 by 420
        pixels, so the download stays sharp when it is placed in a
        document. Then download it as a PNG, JPG, or PDF. PNG is the
        right choice when you need the transparent background; JPG is
        smaller and fine for a plain white page; PDF is handy when the
        signature has to travel as a document page. Before you call it
        done, look at the signature at the size you will actually use it
        — a flourish that looks good large can turn into a blur at email
        size, so test it small and simplify if it does not hold up.
      </p>

      <h2>What you can use your signature for</h2>
      <p>
        Once you have the image file, the same signature works anywhere an
        image can go:
      </p>
      <ul>
        <li>
          <strong>Email signatures</strong> — add the transparent PNG
          under your name in your email settings so every message carries
          it.
        </li>
        <li>
          <strong>Documents and letters</strong> — place the image in a
          Word document or PDF where a signature line would normally go.
          For a full handwritten page to go with it, the{" "}
          <Link
            href="/guides/text-to-handwriting"
            className="font-bold text-brand-teal hover:underline"
          >
            text to handwriting guide
          </Link>{" "}
          shows how to turn typed text into handwritten pages.
        </li>
        <li>
          <strong>Forms and applications</strong> — many online forms
          accept an uploaded signature image; the JPG or PDF download
          suits these best.
        </li>
        <li>
          <strong>Personal branding</strong> — use the same signature on
          a portfolio, a blog, or social profiles so people recognise it.
          The{" "}
          <Link
            href="/handwriting-font"
            className="font-bold text-brand-teal hover:underline"
          >
            handwriting font previewer
          </Link>{" "}
          can help you find a matching handwritten style for the rest of
          the page.
        </li>
        <li>
          <strong>Artwork and cards</strong> — sign a digital card, a
          poster, or a piece of artwork the way an artist signs a print.
        </li>
      </ul>

      <h2>Tips for a signature that looks good and stays usable</h2>
      <ul>
        <li>
          <strong>Keep it short.</strong> A first name, or initials plus
          a surname, reads better than a long full name squeezed into
          one line.
        </li>
        <li>
          <strong>Pick one version and stick to it.</strong> A signature
          works because people recognise it. Download the version you
          like, keep the file safe, and reuse it instead of making a new
          one each time.
        </li>
        <li>
          <strong>Test it on a dark background.</strong> If the signature
          will ever sit on a coloured page, check the transparent PNG on
          that colour first — dark ink disappears on a dark background.
        </li>
        <li>
          <strong>Draw it twice and keep the better one.</strong> In Draw
          mode, your second attempt is usually smoother than your first.
          Use Undo for single strokes and Clear for a fresh start.
        </li>
        <li>
          <strong>Match the style to the job.</strong> A formal style
          suits documents and business email; a bolder style suits a
          personal brand. The{" "}
          <Link
            href="/cursive-text-generator"
            className="font-bold text-brand-teal hover:underline"
          >
            cursive text generator
          </Link>{" "}
          offers the same script styles for longer text when you want the
          whole page to match.
        </li>
        <li>
          <strong>Try a calligraphy style for something special.</strong>{" "}
          For a wedding card or a certificate, the{" "}
          <Link
            href="/calligraphy-generator"
            className="font-bold text-brand-teal hover:underline"
          >
            calligraphy generator
          </Link>{" "}
          gives a more decorative finish than a plain signature style.
        </li>
      </ul>

      <h2>What the signature generator does not do</h2>
      <p>
        An honest note, because it shapes what you should expect. The
        typed mode renders your name in a script font — it does not copy
        your real handwriting, and you cannot change the slant, the
        letter spacing, or the size of the letters; the style and the ink
        colour are the controls you get. The drawn mode is your own hand,
        but it is still a picture of a signature, not a verified
        electronic signature, so it proves nothing about who signed. And
        nothing is saved: there is no account and no stored signature, so
        the file you download is the only copy — keep it somewhere safe
        if you want to reuse it. Within those limits, the process is
        short: choose Typed or Draw, make the signature look right, keep
        the transparent background on, and download the PNG.
      </p>
    </>
  );
}
