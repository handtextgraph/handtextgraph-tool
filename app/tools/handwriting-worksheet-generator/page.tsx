import type { Metadata } from "next";
import Link from "next/link";
import { Caveat, Patrick_Hand } from "next/font/google";
import { WorksheetGenerator } from "@/components/worksheet/WorksheetGenerator";
import { CustomWorksheetBuilder } from "@/components/worksheet/CustomWorksheetBuilder";
import { editorSocialImage } from "@/lib/seo";
import { toolPageConfigs } from "@/lib/tool-pages";
import { publicToolContent } from "@/lib/cms/public";
import { siteConfig } from "@/lib/site-config";

const worksheetPrintFont = Patrick_Hand({ subsets: ["latin"], weight: "400", variable: "--font-ws-print" });
const worksheetCursiveFont = Caveat({ subsets: ["latin"], weight: ["600"], variable: "--font-ws-cursive" });

const tool = toolPageConfigs.worksheet;
const siteUrl = siteConfig.origin;

const defaultMetadata: Metadata = {
  title: tool.title,
  description: tool.description,
  alternates: { canonical: tool.path },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    title: tool.title,
    description: tool.description,
    url: tool.path,
    type: "website",
    images: [editorSocialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: tool.title,
    description: tool.description,
    images: [editorSocialImage.url],
  },
};

export async function generateMetadata():Promise<Metadata>{const cms=await publicToolContent("tools/handwriting-worksheet-generator");if(!cms)return defaultMetadata;const title=cms.seo_title||cms.display_name||tool.title,description=cms.meta_description||cms.description||tool.description;return{title,description,alternates:{canonical:tool.path},robots:{index:!cms.noindex,follow:true},openGraph:{title,description,url:tool.path,type:"website",images:[editorSocialImage]},twitter:{card:"summary_large_image",title,description,images:[editorSocialImage.url]}}}

const faqs = [
  {
    question: "Is this handwriting worksheet generator free?",
    answer:
      "Yes. You can create unlimited tracing sheets — names, alphabets, and word lists — and download them as PDF or PNG without creating an account. Everything renders in your browser, so there is nothing to sign up for and no watermark on the output.",
  },
  {
    question: "What is the difference between print and cursive mode?",
    answer:
      "Print mode uses clear block letters, which is where most children start. Cursive mode switches the model and tracing letters to a joined, slanted script so older kids can practice flowing letterforms and connections. You can generate the same word list in both styles to bridge the transition from print to cursive.",
  },
  {
    question: "How do the sky, grass, and ground guide lines work?",
    answer:
      "Each practice row has three lines. The top sky line marks where tall letters like b, d, and h reach. The dashed grass midline marks the top of small letters like a, e, and n. The solid ground baseline is where every letter sits. Keeping the guides visible gives children a constant visual reference for letter size and placement.",
  },
  {
    question: "Can I make tracing sheets with my own spelling words?",
    answer:
      "Yes. Switch to the Word list tab, paste up to 60 words (one per line), and each word gets its own block: a solid model row, dotted tracing rows, and blank practice rows. It is a quick way to turn that week's spelling list or sight words into a printable practice pack.",
  },
  {
    question: "Which paper size should I choose, A4 or Letter?",
    answer:
      "Match the paper in your printer. A4 (210 × 297 mm) is standard in most of the world, while Letter (8.5 × 11 in) is standard in the US. Choose the same size here and in your print dialog, and print at 100% or “Actual size” so the guide lines come out at their true size.",
  },
  {
    question: "How do I reuse a worksheet without reprinting it?",
    answer:
      "Print the sheet, slide it into a dry-erase pocket or laminate it, and let kids trace with a dry-erase marker. Wipe it clean and it is ready for the next round. This works especially well for name tracing and alphabet sheets that get practiced daily.",
  },
  {
    question: "Can I use these worksheets in my classroom?",
    answer:
      "Yes. Teachers and homeschoolers can generate and print as many copies as they need for classroom or home use. The name-and-date header on every page makes it easy to hand out, collect, and file the finished practice.",
  },
];

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": ["WebApplication", "SoftwareApplication"],
    "@id": `${siteUrl}${tool.path}#application`,
    name: tool.name,
    url: `${siteUrl}${tool.path}`,
    description: tool.description,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    browserRequirements: "Requires a modern browser with HTML canvas support",
    inLanguage: "en",
    isAccessibleForFree: true,
    featureList: tool.benefits,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}${tool.path}#webpage`,
    url: `${siteUrl}${tool.path}`,
    name: tool.title,
    description: tool.description,
    inLanguage: "en",
    isPartOf: { "@id": `${siteUrl}/#website` },
    mainEntity: { "@id": `${siteUrl}${tool.path}#application` },
    dateModified: "2026-09-28",
  },
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use ${tool.name}`,
    url: `${siteUrl}${tool.path}#how-to-use`,
    description: tool.intro,
    tool: ["Modern web browser", "Printer (optional)"],
    supply: ["A name, alphabet, or word list"],
    step: tool.howTo.map((text, index) => ({ "@type": "HowToStep", position: index + 1, name: `Step ${index + 1}`, text })),
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Tools", item: `${siteUrl}/tools` },
      { "@type": "ListItem", position: 3, name: tool.name, item: `${siteUrl}${tool.path}` },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  },
];

const cardClass = "rounded-[32px] border border-slate-200 bg-white p-7 shadow-card";

export default async function HandwritingWorksheetGeneratorPage() {
  const cms=await publicToolContent("tools/handwriting-worksheet-generator");
  return (
    <main className={`${worksheetPrintFont.variable} ${worksheetCursiveFont.variable}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />

      <section className="mx-auto max-w-5xl px-4 pb-8 pt-12 text-center sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-blue">{tool.eyebrow}</p>
        <h1 className="mx-auto mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{cms?.display_name||tool.h1}</h1>
        <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">{cms?.intro||cms?.description||tool.intro}</p>
      </section>

      <section className="relative z-10 mx-auto max-w-[1500px] px-3 pb-12 sm:px-5 lg:px-7" aria-label="Worksheet generator">
        <WorksheetGenerator />
        <CustomWorksheetBuilder />
      </section>

      {cms?.hero_image_url&&<figure className="mx-auto max-w-6xl px-4 pb-10 sm:px-6 lg:px-8"><img src={cms.hero_image_url} alt={cms.hero_image_alt||cms.display_name} className="mx-auto max-h-[520px] rounded-3xl border bg-white object-contain shadow-sm"/></figure>}
      {cms?.content_html&&<section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8"><article className="prose prose-slate max-w-none rounded-[32px] border border-slate-200 bg-white p-6 shadow-card sm:p-8" dangerouslySetInnerHTML={{__html:cms.content_html}}/></section>}

      {!cms?.content_html&&<><section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-7 rounded-[32px] border border-slate-200 bg-white p-6 shadow-card lg:grid-cols-[0.9fr,1.1fr] lg:p-9">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">Current Output Example</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">What this focused tool creates</h2>
            <p className="mt-4 leading-7 text-slate-600">{tool.sampleCaption}</p>
            <ul className="mt-5 space-y-3 text-sm font-semibold text-slate-700">
              {tool.benefits.map((benefit) => (
                <li key={benefit} className="flex gap-3">
                  <span aria-hidden="true" className="text-brand-green">&#10003;</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
          <img
            src={tool.sampleImage}
            alt={tool.sampleAlt}
            width={1200}
            height={760}
            className="h-auto w-full rounded-2xl border border-slate-200 bg-white"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8" aria-labelledby="worksheet-types">
        <h2 id="worksheet-types" className="text-3xl font-semibold tracking-tight text-slate-950">Three worksheet types, one generator</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className={cardClass}>
            <h3 className="text-xl font-semibold text-slate-950">Name tracing sheets</h3>
            <p className="mt-3 leading-7 text-slate-600">
              Type any name and get a dedicated tracing page: a solid model row to study, dotted rows to trace over,
              and blank guide rows for independent practice. It is the fastest way to help a child learn to write
              their own name — the single most motivating first word for most preschoolers and kindergarteners.
            </p>
          </div>
          <div className={cardClass}>
            <h3 className="text-xl font-semibold text-slate-950">A–Z alphabet practice</h3>
            <p className="mt-3 leading-7 text-slate-600">
              Generate the full alphabet in uppercase, lowercase, or both, in print or cursive. Each letter flows
              across model, tracing, and practice rows, so one sheet covers the complete letter set in reading order.
              It works as a daily warm-up page or as a multi-page practice pack for the whole alphabet.
            </p>
          </div>
          <div className={cardClass}>
            <h3 className="text-xl font-semibold text-slate-950">Custom word lists</h3>
            <p className="mt-3 leading-7 text-slate-600">
              Paste up to 60 words — spelling lists, sight words, vocabulary, or names of family members — and every
              word gets its own model, tracing, and practice block. Because the words are yours, the same sheet
              doubles as handwriting practice and reading reinforcement.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-card">
          <h2 id="how-to-use" className="text-3xl font-semibold tracking-tight text-slate-950">How to use this tool</h2>
          <ol className="mt-5 list-decimal space-y-3 pl-6 text-base leading-7 text-slate-600">
            {tool.howTo.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
        <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-card">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Recommended settings</h2>
          <dl className="mt-5 space-y-4">
            {tool.settings.map((setting) => (
              <div key={setting.label}>
                <dt className="font-semibold text-slate-950">{setting.label}</dt>
                <dd className="mt-1 leading-7 text-slate-600">{setting.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="rounded-[32px] border border-blue-100 bg-blue-50 p-7">
          <h2 className="text-2xl font-semibold text-slate-950">{tool.practicalHeading}</h2>
          <p className="mt-3 leading-7 text-slate-700">{tool.practicalText}</p>
        </div>
        <div className="rounded-[32px] border border-amber-100 bg-amber-50 p-7">
          <h2 className="text-2xl font-semibold text-slate-950">Current limitations</h2>
          <p className="mt-3 leading-7 text-slate-700">{tool.limitations}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8" aria-labelledby="who-its-for">
        <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-card lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-blue">Who it helps</p>
          <h2 id="who-its-for" className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            Built for parents, teachers, and homeschoolers
          </h2>
          <div className="mt-6 grid gap-6 text-slate-600 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold text-slate-950">Parents</h3>
              <p className="mt-2 leading-7">
                Make a fresh tracing sheet in under a minute whenever motivation strikes — a name page before school,
                a few spelling words after dinner. Because each sheet is generated on demand, practice always feels
                new instead of recycled from the same workbook page.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-950">Teachers</h3>
              <p className="mt-2 leading-7">
                Differentiate without extra prep: large lines and extra tracing rows for beginners, smaller lines
                and more blank practice rows for confident writers. Print a class set from one word list, with a
                name-and-date header on every page for easy collecting and filing.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-950">Homeschoolers</h3>
              <p className="mt-2 leading-7">
                Build handwriting into any curriculum by generating sheets from the words you are already studying —
              science vocabulary, history terms, or this week&apos;s reading words. The cursive mode gives you a real
                path from print to joined writing without buying a separate cursive program.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-950">Tutors and therapists</h3>
              <p className="mt-2 leading-7">
                Target exactly the letters or words a learner struggles with. A short, focused sheet with just the
                tricky words — practiced a little every day — beats a generic workbook for building letter formation
                and fine-motor confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8" aria-labelledby="guide-lines">
        <div className="rounded-[32px] border border-emerald-100 bg-emerald-50 p-7 lg:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-blue">Guide lines explained</p>
            <h2 id="guide-lines" className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              Sky, grass, and ground: why three lines beat one
            </h2>
          </div>
          <div className="mt-6 max-w-3xl space-y-5">
            <p className="leading-8 text-slate-600">
              A single baseline tells a child where letters sit, but not how tall they should be. That is why this
              generator draws three kid-friendly guide lines on every row. The top <strong className="font-semibold text-slate-800">sky line</strong> shows
              where tall letters like b, d, f, h, k, l, and t reach. The dashed <strong className="font-semibold text-slate-800">grass midline</strong> marks
              the top of small letters like a, c, e, m, n, and o. The solid <strong className="font-semibold text-slate-800">ground baseline</strong> is
              where every letter rests its feet, with tails like g, j, p, q, and y dipping just below it.
            </p>
            <p className="leading-8 text-slate-600">
              When children can see all three zones, common problems fix themselves: floating letters land on the
              ground line, oversized small letters shrink to the grass line, and tall letters stop crashing into the
              row above. If a learner is very new to writing, choose the large line size — bigger zones are more
              forgiving for developing fine-motor control. As control improves, move to medium and then small lines,
              which is the same progression most school handwriting programs follow.
            </p>
            <p className="leading-8 text-slate-600">
              You can switch the guides off for a clean look, but keep them on while letter formation is still being
              learned. Begin with short, familiar words and repeat them across several small sessions instead of one long task. Browse <Link href="/templates" className="font-semibold text-brand-blue hover:underline">blank printable templates</Link> when
              you want plain lined paper without any tracing content.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8" aria-labelledby="printing-tips">
        <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-card lg:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-blue">Printing tips</p>
            <h2 id="printing-tips" className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              Get crisp, true-to-size printouts
            </h2>
          </div>
          <div className="mt-6 max-w-3xl space-y-5">
            <p className="leading-8 text-slate-600">
              The preview is rendered at full print resolution, so what you see is what the printer produces — as
              long as the print dialog cooperates. Always print at 100% or “Actual size” rather than “Fit to page”;
              scaling shrinks the guide lines and defeats the sizing you chose. Match the A4 or Letter setting here
              to the paper loaded in the printer before you hit print.
            </p>
            <p className="leading-8 text-slate-600">
              For everyday practice, plain copy paper is fine. If sheets will be handled a lot — or wiped clean in a
              dry-erase pocket — use slightly heavier paper (around 24 lb / 90 gsm) so it stays flat. Printing in
              grayscale keeps the dotted tracing lines light and easy to trace over, and it saves color ink. For
              classroom sets, the multi-page PDF export keeps a whole alphabet or spelling pack in one file that
              prints in order.
            </p>
            <p className="leading-8 text-slate-600">
              Handwriting practice works best in short, regular sessions: ten focused minutes tracing and copying
              beats an hour of tired scribbling. See all of our <Link href="/tools" className="font-semibold text-brand-blue hover:underline">free handwriting tools</Link> for
              lined paper, notes, and PDF conversion alongside this worksheet generator.
            </p>
          </div>
          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-lg font-semibold text-slate-950">Privacy</h3>
            <p className="mt-2 leading-7 text-slate-600">{tool.privacy}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8" aria-labelledby="worksheet-faq">
        <h2 id="worksheet-faq" className="text-3xl font-semibold tracking-tight text-slate-950">Frequently asked questions</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {faqs.map((faq) => (
            <div key={faq.question} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-950">{faq.question}</h3>
              <p className="mt-3 leading-7 text-slate-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
      </>}
    </main>
  );
}
