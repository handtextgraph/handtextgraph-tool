import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PaperGeneratorStudio } from "@/components/paper/PaperGeneratorStudio";
import { Breadcrumbs, ContentPanel, Eyebrow, PublicContainer } from "@/components/ui/PublicUi";
import { getPaperGenerator, paperGeneratorSlugs } from "@/lib/paper-generators";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

const siteUrl = siteConfig.origin;
export const dynamicParams = false;
export function generateStaticParams() { return paperGeneratorSlugs.map((paperGenerator) => ({ paperGenerator })); }

export async function generateMetadata({ params }: { params: Promise<{ paperGenerator: string }> }): Promise<Metadata> {
  const definition = getPaperGenerator((await params).paperGenerator); if (!definition) return {};
  const path = `/tools/${definition.slug}`;
  return { title: `${definition.name} — Free Printable PDF, PNG & SVG`, description: definition.description, alternates: { canonical: path }, openGraph: { title: definition.name, description: definition.description, url: absoluteUrl(path), type: "website" } };
}

export default async function PaperGeneratorPage({ params }: { params: Promise<{ paperGenerator: string }> }) {
  const definition = getPaperGenerator((await params).paperGenerator); if (!definition) notFound();
  const related = definition.related.map((slug) => getPaperGenerator(slug)).filter(Boolean);
  const schema = [
    { "@context":"https://schema.org", "@type":"SoftwareApplication", name:definition.name, applicationCategory:"DesignApplication", operatingSystem:"Any modern web browser", url:`${siteUrl}/tools/${definition.slug}`, description:definition.description, offers:{"@type":"Offer",price:"0",priceCurrency:"USD"} },
    { "@context":"https://schema.org", "@type":"FAQPage", mainEntity:definition.faqs.map(item=>({"@type":"Question",name:item.question,acceptedAnswer:{"@type":"Answer",text:item.answer}})) },
    { "@context":"https://schema.org", "@type":"BreadcrumbList", itemListElement:[{ "@type":"ListItem",position:1,name:"Home",item:siteUrl},{"@type":"ListItem",position:2,name:"Tools",item:`${siteUrl}/tools`},{"@type":"ListItem",position:3,name:definition.name,item:`${siteUrl}/tools/${definition.slug}`}] },
  ];
  return <main>
    {schema.map((item,index)=><script key={index} type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(item).replace(/</g,"\\u003c")}}/>)}
    <section className="border-b border-platform-border bg-white py-12 sm:py-16"><PublicContainer><Breadcrumbs items={[{label:"Home",href:"/"},{label:"Tools",href:"/tools"},{label:definition.name}]}/><div className="mt-8 max-w-4xl"><Eyebrow>Printable paper generator</Eyebrow><h1 className="mt-4 font-heading text-4xl font-extrabold tracking-tight text-platform-navy sm:text-5xl">{definition.name}</h1><p className="mt-5 text-lg leading-8 text-slate-600">{definition.intro}</p><div className="mt-5 flex flex-wrap gap-2 text-sm font-semibold text-slate-600"><span className="rounded-full bg-platform-ice px-3 py-1.5">No account</span><span className="rounded-full bg-platform-ice px-3 py-1.5">Exact physical units</span><span className="rounded-full bg-platform-ice px-3 py-1.5">PDF · PNG · SVG</span><span className="rounded-full bg-platform-ice px-3 py-1.5">Browser-local generation</span></div></div></PublicContainer></section>
    <PublicContainer className="py-8 sm:py-12"><PaperGeneratorStudio slug={definition.slug}/><div className="mt-12 grid gap-6 lg:grid-cols-2"><ContentPanel><h2 className="font-heading text-2xl font-bold text-platform-navy">How this pattern works</h2><p className="mt-4 leading-7 text-slate-600">{definition.explanation}</p><h3 className="mt-7 font-heading text-xl font-bold text-platform-navy">How to use the generator</h3><ol className="mt-4 list-decimal space-y-3 pl-5 leading-7 text-slate-600"><li>Choose a preset or adjust the pattern-specific measurements.</li><li>Select the paper size, orientation, units, margins, colors, and line weight.</li><li>Review the live preview and correct any validation warning.</li><li>Download vector PDF or SVG, create a 150/300 DPI PNG, or print from the browser.</li></ol></ContentPanel><ContentPanel><h2 className="font-heading text-2xl font-bold text-platform-navy">Practical uses</h2><ul className="mt-4 space-y-3">{definition.uses.map(item=><li key={item} className="flex gap-3 leading-7 text-slate-600"><span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-platform-teal"/>{item}</li>)}</ul><h3 className="mt-7 font-heading text-xl font-bold text-platform-navy">Accurate printing</h3><p className="mt-3 leading-7 text-slate-600">PDF and SVG retain vector geometry. For physical measurements, print at Actual size or 100% and turn off Fit, Shrink, or Scale to page. Use the first page as a measurement check when printer drivers add non-printable margins.</p></ContentPanel></div>
      <section className="mt-12" aria-labelledby="faq-heading"><Eyebrow>Questions</Eyebrow><h2 id="faq-heading" className="mt-3 font-heading text-3xl font-bold text-platform-navy">Frequently asked questions</h2><div className="mt-6 grid gap-4 lg:grid-cols-2">{definition.faqs.map(item=><details key={item.question} className="rounded-2xl border border-platform-border bg-white p-5"><summary className="cursor-pointer font-heading font-bold text-platform-navy">{item.question}</summary><p className="mt-3 leading-7 text-slate-600">{item.answer}</p></details>)}</div></section>
      <section className="mt-12 rounded-[28px] bg-platform-navy p-6 text-white sm:p-8"><h2 className="font-heading text-2xl font-bold">Related paper tools</h2><p className="mt-2 text-slate-200">Move between compatible patterns without losing sight of the print format you need.</p><div className="mt-5 grid gap-3 sm:grid-cols-3">{related.map(item=><Link key={item!.slug} href={`/tools/${item!.slug}`} className="rounded-2xl bg-white/10 p-4 font-bold transition hover:bg-white/20">{item!.shortName}<span aria-hidden="true" className="float-right">→</span></Link>)}</div><div className="mt-5 flex flex-wrap gap-4 text-sm font-bold"><Link href="/templates" className="text-platform-amber hover:underline">Browse ready-made templates</Link><Link href="/tools" className="text-white hover:underline">View all tools</Link></div></section>
    </PublicContainer>
  </main>;
}

