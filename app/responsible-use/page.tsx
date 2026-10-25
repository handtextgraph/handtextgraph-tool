import { defaultSocialImage } from "@/lib/seo";

export const metadata = {
  title: "Responsible Use | HandTextGraph",
  description:
    "Learn how to use HandTextGraph responsibly for notes, drafts, worksheets, examples, journal pages, documents, and creative projects.",
  alternates: {
    canonical: "/responsible-use",
  },
  openGraph: {
    title: "Responsible Use | HandTextGraph",
    description:
      "Learn how to use HandTextGraph responsibly for notes, drafts, worksheets, examples, journal pages, documents, and creative projects.",
    url: "/responsible-use",
    type: "website",
    images: [defaultSocialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Responsible Use | HandTextGraph",
    description:
      "Learn how to use HandTextGraph responsibly for notes, drafts, worksheets, examples, journal pages, documents, and creative projects.",
    images: [defaultSocialImage.url],
  },
};

const recommendedUses = [
  "Creating notes, revision pages, and printable learning material",
  "Preparing drafts, examples, worksheets, templates, and classroom resources",
  "Formatting content into handwritten-style documents, journal pages, and visual previews",
  "Making personal notes, letters, recipe cards, greeting card drafts, and creative mockups",
];

const avoidUses = [
  "Misrepresenting generated pages or authorship",
  "Bypassing school, college, workplace, or platform rules",
  "Creating false records, forged signatures, misleading submissions, or deceptive materials",
  "Creating or distributing completed term papers, answers, credentials, or documents intended to deceive",
  "Imitating another person's handwriting, signature, identity, or authorization",
  "Using generated output in a way that violates someone else's instructions, rights, or trust",
];

export default function ResponsibleUsePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <article className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-card lg:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-blue">Responsible Use</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Use HandTextGraph Clearly and Honestly
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          HandTextGraph is designed to help people create readable handwritten-style pages for notes, drafts,
          worksheets, examples, printable resources, journal pages, and documents. It should be used in ways that
          respect instructions, workplace rules, creative ownership, and the trust of readers.
        </p>

        <section className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-6">
            <h2 className="text-2xl font-semibold text-slate-950">Good Uses</h2>
            <ul className="mt-5 space-y-3 text-base leading-7 text-slate-700">
              {recommendedUses.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-rose-100 bg-rose-50 p-6">
            <h2 className="text-2xl font-semibold text-slate-950">Do Not Use It For</h2>
            <ul className="mt-5 space-y-3 text-base leading-7 text-slate-700">
              {avoidUses.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>


        <section className="mt-12 space-y-4 text-lg leading-8 text-slate-600">
          <h2 className="text-2xl font-semibold text-slate-950">For Notes, Documents, and Learning Resources</h2>
          <p>
            HandTextGraph works best as a planning, drafting, formatting, and preview tool. Use it to make your work
            easier to read, organize, print, or share.
          </p>
          <p>
            Review the final page for readability, completeness, and accuracy before printing or sharing it.
          </p>
        </section>

        <section className="mt-12 space-y-4 text-lg leading-8 text-slate-600">
          <h2 className="text-2xl font-semibold text-slate-950">What the Tool Does Not Do</h2>
          <p>
            HandTextGraph formats text supplied by the user. It does not write essays, solve questions, generate
            answers, copy a person&apos;s handwriting, reproduce signatures, create credentials, or verify authorship.
          </p>
          <p>
            A handwritten-style appearance does not establish that a page was physically written by hand. When the
            origin of a document matters, describe generated output accurately and follow the rules that apply to it.
          </p>
        </section>


        <section className="mt-12 rounded-3xl border border-blue-100 bg-blue-50 p-6">
          <h2 className="text-2xl font-semibold text-slate-950">Simple Rule</h2>
          <p className="mt-4 text-lg leading-8 text-slate-700">
            Use the tool to make legitimate work easier to read and manage, not to mislead people about how that work
            was created.
          </p>
        </section>
      </article>
    </main>
  );
}
