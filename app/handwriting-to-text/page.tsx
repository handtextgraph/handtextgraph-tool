import Link from "next/link";
import { TextExtractionTool } from "@/components/tools/TextExtractionTool";
import { ToolPage } from "@/components/tools/ToolPage";
import { toolMetadata } from "@/components/tools/toolMetadata";

export function generateMetadata() { return toolMetadata("handwriting-to-text"); }

export default function Page() {
  return (
    <ToolPage slug="handwriting-to-text">
      <TextExtractionTool />
      <p className="mt-8 text-center leading-7 text-slate-600">
        Already have editable text and want it handwritten? Use the{" "}
        <Link href="/tools/text-to-handwriting-pdf" className="font-semibold text-brand-blue hover:underline">PDF to handwriting tool</Link> or
        the <Link href="/tools/word-to-handwriting" className="font-semibold text-brand-blue hover:underline">Word to handwriting tool</Link> —
        and the <Link href="/guides/text-to-handwriting" className="font-semibold text-brand-blue hover:underline">text to handwriting guide</Link> explains
        how the conversion works.
      </p>
    </ToolPage>
  );
}
