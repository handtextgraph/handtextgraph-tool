import Link from "next/link";
import { FancyTextTool } from "@/components/tools/FancyTextTool";
import { ToolPage } from "@/components/tools/ToolPage";
import { toolMetadata } from "@/components/tools/toolMetadata";

export function generateMetadata() { return toolMetadata("fancy-text-generator"); }

export default function Page() {
  return (
    <ToolPage slug="fancy-text-generator">
      <FancyTextTool />
      <p className="mt-8 text-center leading-7 text-slate-600">
        Want the same words as an image instead? Try the{" "}
        <Link href="/cursive-text-generator" className="font-semibold text-brand-blue hover:underline">cursive text generator</Link> or
        turn a name into a downloadable <Link href="/signature-generator" className="font-semibold text-brand-blue hover:underline">signature image</Link>.
      </p>
    </ToolPage>
  );
}
