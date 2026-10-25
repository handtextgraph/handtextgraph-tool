import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HandwritingToolLoader } from "@/components/HandwritingToolLoader";
import { editorSocialImage } from "@/lib/seo";
import { toolPageConfigs, type FunctionalToolProfile } from "@/lib/tool-pages";
import { TrackedLink } from "@/components/TrackedLink";
import { siteConfig } from "@/lib/site-config";

const siteUrl = siteConfig.origin;

const pdfExportOptions = [
  ["Current-page PDF", "Download only the page currently visible in the preview."],
  ["All-pages PDF", "Combine every generated handwriting page into one document."],
  ["Low quality", "Smaller output for memory-limited phones or quick drafts."],
  ["Medium quality", "Balanced file size and clarity for everyday printing."],
  ["High quality", "Larger canvas output for devices with enough memory."],
  ["A4 or Letter", "Match the digital page size to the paper you intend to print."],
];

export function createToolMetadata(profile: FunctionalToolProfile): Metadata {
  const tool = toolPageConfigs[profile];
  return {
    title: tool.title,
    description: tool.description,
    alternates: { canonical: tool.path },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
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
}

export function ToolExperiencePage({ profile }: { profile: FunctionalToolProfile }) {
  const tool = toolPageConfigs[profile];
  const relatedPaperTools = profile === "graph"
    ? [["Square graph generator", "/tools/graph-paper-generator"], ["Engineering paper", "/tools/engineering-paper-generator"]]
    : profile === "lined" || profile === "notes" || profile === "word" || profile === "pdf"
      ? [["Lined paper generator", "/tools/lined-paper-generator"], ["Cornell notes paper", "/tools/cornell-notes-generator"], ["Handwriting practice paper", "/tools/handwriting-practice-paper"]]
      : [["Printable paper generators", "/tools/graph-paper-generator"]];
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": ["WebApplication", "SoftwareApplication"],
      "@id": `${siteUrl}${tool.path}#application`,
      name: tool.name,
      url: `${siteUrl}${tool.path}`,
      description: tool.description,
      applicationCategory: "ProductivityApplication",
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
      dateModified: "2026-08-01",
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: `How to use ${tool.name}`,
      url: `${siteUrl}${tool.path}#how-to-use`,
      description: tool.intro,
      tool: ["Modern web browser"],
      supply: ["Typed or pasted text"],
      step: tool.howTo.map((text, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: `Step ${index + 1}`,
        text,
      })),
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
      mainEntity: tool.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ];

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />
      <section className="mx-auto max-w-5xl px-4 pb-8 pt-12 text-center sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-blue">{tool.eyebrow}</p>
        <h1 className="mx-auto mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{tool.h1}</h1>
        <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">{tool.intro}</p>
      </section>

      <section className="relative z-10 mx-auto max-w-[1500px] px-3 pb-12 sm:px-5 lg:px-7">
        <HandwritingToolLoader profile={profile} />
      </section>


      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
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
          <Image
            src={tool.sampleImage}
            alt={tool.sampleAlt}
            width={1200}
            height={760}
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="h-auto w-full rounded-2xl border border-slate-200"
          />
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-card">
          <h2 id="how-to-use" className="text-3xl font-semibold tracking-tight text-slate-950">How to use this tool</h2>
          <ol className="mt-5 list-decimal space-y-3 pl-6 text-base leading-7 text-slate-600">
            {tool.howTo.map((step) => <li key={step}>{step}</li>)}
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
        <div className="rounded-[32px] border border-emerald-100 bg-emerald-50 p-7 lg:col-span-2">
          <h2 className="text-2xl font-semibold text-slate-950">Privacy and next steps</h2>
          <p className="mt-3 leading-7 text-slate-700">{tool.privacy}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <TrackedLink href="/tools" eventName="related_tool_clicked" eventTarget="tools-hub" className="rounded-full border border-emerald-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-emerald-100">Browse all tools</TrackedLink>
            <Link href="/" className="rounded-full border border-emerald-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-emerald-100">{tool.homeLinkLabel}</Link>
            {(profile === "lined" || profile === "graph") && (
              <Link href="/templates" className="rounded-full border border-emerald-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-emerald-100">
                Print blank paper templates
              </Link>
            )}
            <Link href="/privacy-policy" className="rounded-full border border-emerald-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-emerald-100">Privacy policy</Link>
            {relatedPaperTools.map(([label, href]) => <Link key={href} href={href} className="rounded-full border border-emerald-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-emerald-100">{label}</Link>)}
          </div>
        </div>
      </section>


      {profile === "pdf" && <PdfPageDetails />}

      {tool.deepDive && (
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8" aria-labelledby="deep-dive">
          <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-card lg:p-10">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-blue">In-depth guide</p>
              <h2 id="deep-dive" className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                {tool.deepDive.heading}
              </h2>
            </div>
            <div className="mt-6 max-w-3xl space-y-5">
              {tool.deepDive.paragraphs.map((paragraph, index) => (
                <p key={index} className="leading-8 text-slate-600">{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Frequently asked questions</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {tool.faqs.map((faq) => (
            <div key={faq.question} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-950">{faq.question}</h3>
              <p className="mt-3 leading-7 text-slate-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function PdfPageDetails() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8" aria-labelledby="pdf-export-options">
      <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-card lg:p-10">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-blue">PDF Export Options</p>
          <h2 id="pdf-export-options" className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            Choose exactly what goes into your handwritten PDF
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Upload a text-based PDF or enter text manually, then use the existing controls to create new handwritten-style
            pages. The importer preserves page order as plain text rather than recreating the original visual layout.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {pdfExportOptions.map(([title, text]) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="font-semibold text-slate-950">{title}</h3>
              <p className="mt-2 leading-7 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-6 rounded-3xl border border-emerald-100 bg-emerald-50 p-6 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Before downloading all pages</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 leading-7 text-slate-700">
              <li>Confirm the word count and generated page count.</li>
              <li>Check page breaks, names, symbols, and the final line on each page.</li>
              <li>Match A4 or Letter to the printer paper you plan to use.</li>
              <li>Use medium quality first, especially on phones.</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">PDF import and editing</h2>
            <p className="mt-4 leading-7 text-slate-700">
              Selectable text is extracted locally in your browser and placed in the normal editor. Review line breaks,
              names, and symbols before exporting. Scanned PDFs need OCR and are not supported yet.
            </p>
            <Link href="/responsible-use" className="mt-5 inline-flex font-semibold text-brand-blue hover:underline">Review responsible use →</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
