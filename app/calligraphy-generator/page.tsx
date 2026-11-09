import Link from "next/link";
import { HandwritingToolLoader } from "@/components/HandwritingToolLoader";
import { ToolPage } from "@/components/tools/ToolPage";
import { toolMetadata } from "@/components/tools/toolMetadata";

export function generateMetadata() { return toolMetadata("calligraphy-generator"); }

export default function Page() {
  return (
    <ToolPage slug="calligraphy-generator">
      <HandwritingToolLoader />
      <section className="mt-8 rounded-[28px] border border-slate-200 bg-white p-5 shadow-card sm:p-6" aria-labelledby="calligraphy-practice">
        <h2 id="calligraphy-practice" className="text-2xl font-semibold text-slate-950">Calligraphy-style, honestly labelled</h2>
        <p className="mt-3 leading-7 text-slate-600">
          This tool renders your typed text in calligraphic handwriting styles using the site&apos;s
          handwriting engine — pick <strong className="font-semibold text-slate-900">Soft Cursive</strong> or{" "}
          <strong className="font-semibold text-slate-900">Ink Flow</strong> in the style picker for the
          most calligraphic look. It is not a calligraphy pen simulator: you type words, you do not draw
          strokes, and it does not reproduce pen angle, pressure, or stroke order.
        </p>
        <h3 className="mt-6 text-lg font-semibold text-slate-950">Practise the letterforms on paper</h3>
        <p className="mt-2 leading-7 text-slate-600">
          Make <Link href="/tools/handwriting-worksheet-generator" className="font-semibold text-brand-blue hover:underline">cursive tracing worksheets</Link> from
          the same words and print them for hand practice, or create a{" "}
          <Link href="/cursive-text-generator" className="font-semibold text-brand-blue hover:underline">cursive text design</Link> for
          a card or heading. The <Link href="/guides/text-to-handwriting" className="font-semibold text-brand-blue hover:underline">text to handwriting guide</Link> explains
          how the handwriting engine turns typed text into pages.
        </p>
      </section>
    </ToolPage>
  );
}
