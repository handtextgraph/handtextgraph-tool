"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { PdfTextImporter } from "@/components/PdfTextImporter";
import { DocxTextImporter } from "@/components/DocxTextImporter";

const control = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-900 outline-none focus:border-brand-blue focus:ring-2 focus:ring-blue-100";
const button = "min-h-11 rounded-full bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50";
const secondary = "min-h-11 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-slate-300";
const panel = "rounded-[28px] border border-slate-200 bg-white p-5 shadow-card sm:p-6";

export function TextExtractionTool() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [txtError, setTxtError] = useState("");
  const [txtName, setTxtName] = useState("");
  const txtInputRef = useRef<HTMLInputElement>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const downloadTxt = () => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "extracted-text.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  const readTxtFile = async (file: File | undefined) => {
    setTxtError("");
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".txt")) {
      setTxtError("Choose a .txt file here. Use the PDF or Word importer above for those formats.");
      return;
    }
    try {
      const content = await file.text();
      setTxtName(file.name);
      setText(content);
    } catch {
      setTxtError("We could not read this file. Try downloading it again and re-uploading.");
    }
  };

  return (
    <div>
      <div className="rounded-[28px] border border-amber-200 bg-amber-50 p-5 shadow-card sm:p-6" role="note">
        <h2 className="text-xl font-semibold text-slate-950">Important: this page does not read handwriting from photos</h2>
        <p className="mt-2 leading-7 text-slate-700">
          There is no handwriting OCR on this site — no tool here can turn a photo or scan of handwriting
          into text. What this page does is extract text already stored inside PDF, Word, and plain-text
          files, entirely in your browser. An image-only scanned PDF has no stored text, so it will come
          back empty. The guide below explains how to turn handwritten notes into editable text instead.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className={panel}>
          <h2 className="text-xl font-semibold">Extract text from a PDF</h2>
          <p className="mt-1 text-sm text-slate-500">Reads text stored in the PDF. PDF files up to 15 MB.</p>
          <div className="mt-4">
            <PdfTextImporter onTextExtracted={setText} />
          </div>
        </div>
        <div className={panel}>
          <h2 className="text-xl font-semibold">Extract text from a Word file</h2>
          <p className="mt-1 text-sm text-slate-500">Reads text stored in a .docx file. Word files up to 10 MB.</p>
          <div className="mt-4">
            <DocxTextImporter onTextExtracted={setText} />
          </div>
        </div>
      </div>

      <div className={`${panel} mt-6`}>
        <h2 className="text-xl font-semibold">Or open a plain-text file</h2>
        <p className="mt-1 text-sm text-slate-500">Your file is read in this browser only — nothing is uploaded.</p>
        <input
          ref={txtInputRef}
          type="file"
          accept=".txt,text/plain"
          className="mt-4 block w-full text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:font-semibold file:text-brand-blue"
          onChange={(e) => void readTxtFile(e.target.files?.[0])}
        />
        {txtName && !txtError && <p className="mt-2 text-sm font-semibold text-emerald-700">{txtName} is loaded below.</p>}
        {txtError && <p role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{txtError}</p>}
      </div>

      <div className={`${panel} mt-6`}>
        <label className="block text-[15px] font-semibold text-slate-700" htmlFor="extracted-text">
          Extracted text — edit it here
          <span className="mt-2 block">
            <textarea
              id="extracted-text"
              rows={12}
              className={control}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Extracted text appears here, or paste text directly to clean it up."
            />
          </span>
        </label>
        <p className="mt-2 text-sm text-slate-500">{text.length.toLocaleString()} characters</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button className={button} onClick={() => void copy()} disabled={!text.trim()}>
            {copied ? "Copied" : "Copy text"}
          </button>
          <button className={secondary} onClick={downloadTxt} disabled={!text.trim()}>
            Download .txt
          </button>
          <button className={secondary} onClick={() => setText("")} disabled={!text}>
            Clear
          </button>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-500">
          Want it back in handwriting? Send the cleaned text to the{" "}
          <Link href="/tools/text-to-handwriting-pdf" className="font-semibold text-brand-blue hover:underline">PDF to handwriting tool</Link>{" "}
          or the <Link href="/#studio" className="font-semibold text-brand-blue hover:underline">main handwriting studio</Link>.
        </p>
      </div>

      <section className={`${panel} mt-6`} aria-labelledby="handwritten-notes-guide">
        <h2 id="handwritten-notes-guide" className="text-2xl font-semibold text-slate-950">From handwritten notes to editable text</h2>
        <p className="mt-2 leading-7 text-slate-600">
          This site cannot do this step for you — it needs OCR (optical character recognition), which no
          tool on this site includes. Here is the honest route that works:
        </p>
        <ol className="mt-4 list-decimal space-y-3 pl-5 leading-7 text-slate-600">
          <li>
            <strong className="font-semibold text-slate-900">Photograph or scan your notes</strong> in good,
            even light, keeping the page flat and the text in focus. A phone camera is enough for clear
            handwriting.
          </li>
          <li>
            <strong className="font-semibold text-slate-900">Run OCR on your own device.</strong> On iPhone,
            Apple Notes can copy text from a photo (Live Text); on Android, Google Lens reads text from an
            image; Microsoft Lens is another free option. Open the photo in one of these apps and copy the
            recognised text.
          </li>
          <li>
            <strong className="font-semibold text-slate-900">Paste the recognised text into the box above.</strong> OCR
            makes mistakes with handwriting — check names, numbers, and unusual words against the original
            page and fix them here.
          </li>
          <li>
            <strong className="font-semibold text-slate-900">Copy or download the cleaned text</strong> and
            use it wherever you need it — a document, an email, or back in the handwriting studio.
          </li>
        </ol>
        <p className="mt-4 leading-7 text-slate-600">
          OCR accuracy depends on how clear the handwriting is. Neat, evenly spaced writing recognises
          well; rushed or faint writing needs more manual correction. That correction step is normal, not a
          sign that anything went wrong.
        </p>
      </section>
    </div>
  );
}
