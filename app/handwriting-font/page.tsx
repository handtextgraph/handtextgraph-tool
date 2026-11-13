import Link from "next/link";
import { HandwritingFontTool } from "@/components/tools/HandwritingFontTool";
import { ToolPage } from "@/components/tools/ToolPage";
import { toolMetadata } from "@/components/tools/toolMetadata";

export async function generateMetadata() {
  const base = await toolMetadata("handwriting-font");
  const title = "Best Handwriting Fonts (Free): 11 to Preview & Download | HandTextGraph";
  const description =
    "Compare 11 free handwriting fonts — Caveat, Dancing Script, Kalam and more. Preview each in your words, check its licence, and download it from Google Fonts.";
  return {
    ...base,
    title,
    description,
    openGraph: { ...base.openGraph, title, description },
    twitter: { ...base.twitter, title, description },
  };
}

const specimenFonts: Array<{ name: string; family: string; specimen: string; inTool: boolean }> = [
  { name: "Caveat", family: "'Caveat', cursive", specimen: "https://fonts.google.com/specimen/Caveat", inTool: true },
  { name: "Shadows Into Light", family: "'Shadows Into Light', cursive", specimen: "https://fonts.google.com/specimen/Shadows+Into+Light", inTool: true },
  { name: "Patrick Hand", family: "'Patrick Hand', cursive", specimen: "https://fonts.google.com/specimen/Patrick+Hand", inTool: true },
  { name: "Indie Flower", family: "'Indie Flower', cursive", specimen: "https://fonts.google.com/specimen/Indie+Flower", inTool: true },
  { name: "Architects Daughter", family: "'Architects Daughter', cursive", specimen: "https://fonts.google.com/specimen/Architects+Daughter", inTool: true },
  { name: "Schoolbell", family: "'Schoolbell', cursive", specimen: "https://fonts.google.com/specimen/Schoolbell", inTool: true },
  { name: "Kalam", family: "var(--font-hand), cursive", specimen: "https://fonts.google.com/specimen/Kalam", inTool: true },
  { name: "Dancing Script", family: "'Dancing Script', cursive", specimen: "https://fonts.google.com/specimen/Dancing+Script", inTool: false },
  { name: "Sacramento", family: "'Sacramento', cursive", specimen: "https://fonts.google.com/specimen/Sacramento", inTool: false },
  { name: "Homemade Apple", family: "'Homemade Apple', cursive", specimen: "https://fonts.google.com/specimen/Homemade+Apple", inTool: false },
  { name: "Gochi Hand", family: "'Gochi Hand', cursive", specimen: "https://fonts.google.com/specimen/Gochi+Hand", inTool: false },
];

export default function Page() {
  return (
    <ToolPage slug="handwriting-font">
      <HandwritingFontTool />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Gochi+Hand&family=Homemade+Apple&family=Sacramento&display=swap"
      />
      <section className="mx-auto mt-10 max-w-6xl rounded-[32px] border border-slate-200 bg-white p-7 shadow-card lg:p-10">
        <h2 className="text-2xl font-semibold text-slate-950">The 11 fonts — see them and get the file</h2>
        <p className="mt-3 max-w-3xl leading-7 text-slate-600">
          Each font below is shown in its own style. Seven of them are in the previewer above — type your own words
          there to try them. The other four are not in the previewer, so use their Google Fonts specimen pages to try
          them. This site hosts no font files: every download is a link to that font&apos;s official Google Fonts page.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {specimenFonts.map((font) => (
            <div key={font.name} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-2xl leading-snug text-slate-900" style={{ fontFamily: font.family }}>
                The quick brown fox jumps over the lazy dog
              </p>
              <p className="mt-3 font-semibold text-slate-950">{font.name}</p>
              <p className="mt-1 text-sm text-slate-600">
                {font.inTool ? "In the previewer above" : "Not in the previewer — listicle only"}
              </p>
              <a
                className="mt-2 inline-block text-sm font-semibold text-brand-blue hover:underline"
                href={font.specimen}
                target="_blank"
                rel="noopener noreferrer"
              >
                Get {font.name} on Google Fonts
              </a>
            </div>
          ))}
        </div>
      </section>
      <p className="mt-8 text-center leading-7 text-slate-600">
        Once you have picked a font, use it across a full page in the{" "}
        <Link href="/#studio" className="font-semibold text-brand-blue hover:underline">text to handwriting studio</Link>, or
        preview a name as a <Link href="/signature-generator" className="font-semibold text-brand-blue hover:underline">signature</Link> and
        a heading as <Link href="/cursive-text-generator" className="font-semibold text-brand-blue hover:underline">cursive text</Link>.
        For a step-by-step walkthrough, read the{" "}
        <Link href="/guides/text-to-handwriting" className="font-semibold text-brand-blue hover:underline">text to handwriting guide</Link>.
      </p>
    </ToolPage>
  );
}
