import Link from "next/link";
import { HandwritingFontTool } from "@/components/tools/HandwritingFontTool";
import { ToolPage } from "@/components/tools/ToolPage";
import { toolMetadata } from "@/components/tools/toolMetadata";

export function generateMetadata() { return toolMetadata("handwriting-font"); }

export default function Page() {
  return (
    <ToolPage slug="handwriting-font">
      <HandwritingFontTool />
      <p className="mt-8 text-center leading-7 text-slate-600">
        Once you have picked a font, use it across a full page in the{" "}
        <Link href="/#studio" className="font-semibold text-brand-blue hover:underline">text to handwriting studio</Link>, or
        preview a name as a <Link href="/signature-generator" className="font-semibold text-brand-blue hover:underline">signature</Link> and
        a heading as <Link href="/cursive-text-generator" className="font-semibold text-brand-blue hover:underline">cursive text</Link>.
      </p>
    </ToolPage>
  );
}
