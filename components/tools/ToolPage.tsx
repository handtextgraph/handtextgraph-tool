import type { ReactNode } from "react";
import Link from "next/link";
import { newTools, type NewToolSlug } from "@/lib/new-tools";
import { toolSchema } from "./toolMetadata";
import { publicToolContent } from "@/lib/cms/public";
import { Breadcrumbs, ContentPanel, PublicContainer } from "@/components/ui/PublicUi";
import { stage5Content } from "@/lib/stage5-content";

export async function ToolPage({ slug, children }: { slug: NewToolSlug; children: ReactNode }) {
  const tool = newTools.find((item) => item.slug === slug)!;
  const cms = await publicToolContent(slug);
  const name = cms?.display_name || tool.name;
  const description = cms?.description || cms?.intro || tool.description;
  const related = newTools.filter((item) => item.slug !== slug && item.category === tool.category).slice(0, 3);
  const supporting = stage5Content[slug];
  return <main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(toolSchema(slug))}} />
    <section className="pb-8 pt-12 text-center">
      <PublicContainer className="max-w-5xl">
      <div className="mb-5"><Breadcrumbs items={[{label:"Home",href:"/"},{label:"Tools",href:"/tools"},{label:name}]} /></div>
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-blue">{tool.category}</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{name}</h1>
      <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">{description} Everything stays editable until you choose to download or print.</p>
      </PublicContainer>
    </section>
    <section className="mx-auto max-w-7xl px-3 pb-14 sm:px-6 lg:px-8">{children}</section>
    {cms?.hero_image_url&&<figure className="mx-auto max-w-6xl px-4 pb-10 sm:px-6 lg:px-8"><img src={cms.hero_image_url} alt={cms.hero_image_alt||name} className="mx-auto max-h-[520px] w-auto rounded-3xl border bg-white object-contain shadow-sm"/></figure>}
    {cms?.content_html&&<section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
      <article className="prose prose-slate max-w-none rounded-[32px] border border-slate-200 bg-white p-6 shadow-card sm:p-8" dangerouslySetInnerHTML={{__html:cms.content_html}} />
    </section>}
    {!cms?.content_html&&<section className="mx-auto grid max-w-6xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-2 lg:px-8">
      <ContentPanel><h2 className="text-2xl font-semibold text-slate-950">How to use this tool</h2><ol className="mt-4 list-decimal space-y-3 pl-5 leading-7 text-slate-600">{(cms?.instructions?.length?cms.instructions:supporting?.instructions||["Enter or upload your source content in the settings panel.","Adjust the available options and review the live output.","Regenerate when needed, then download, copy, or print the verified result."]).map(step=><li key={step}>{step}</li>)}</ol></ContentPanel>
      <ContentPanel><h2 className="text-2xl font-semibold text-slate-950">Practical uses</h2>{cms?.features?.length||supporting?.uses?<ul className="mt-4 list-disc space-y-2 pl-5 leading-7 text-slate-600">{(cms?.features?.length?cms.features:supporting!.uses).map(feature=><li key={feature}>{feature}</li>)}</ul>:<p className="mt-4 leading-7 text-slate-600">Use it for classroom activities, home learning, printable projects, and quick drafts.</p>}<h3 className="mt-5 text-lg font-semibold text-slate-950">Limitations and privacy</h3><p className="mt-2 leading-7 text-slate-600">{supporting?.limitations||"Preview every result before sharing. Processing happens in this browser and the tool does not require a paid API."}</p></ContentPanel>
      <article className="rounded-[32px] border border-blue-100 bg-blue-50 p-7 lg:col-span-2"><h2 className="text-2xl font-semibold text-slate-950">Related tools</h2><div className="mt-4 flex flex-wrap gap-3">{related.map((item) => <Link key={item.slug} href={`/${item.slug}`} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-blue shadow-sm hover:bg-blue-100">{item.name}</Link>)}<Link href="/tools" className="rounded-full bg-brand-blue px-4 py-2 text-sm font-semibold text-white">View all tools</Link></div></article>
      <article className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-card lg:col-span-2"><h2 className="text-2xl font-semibold text-slate-950">Frequently asked questions</h2><div className="mt-5 grid gap-5 md:grid-cols-3">{(cms?.faqs?.length?cms.faqs.map(entry=>{const[q,...a]=entry.split("|");return [q.trim(),a.join("|").trim()] as [string,string]}):supporting?.faqs||[["Is it free?","The browser-based features are free and require no account."],["Does it work on phones?","Yes. Controls and previews adapt to small touch screens."],["Can I print the result?","Yes. Use the print control or download a PDF for predictable printing."]]).map(([question,answer])=><div key={question}><h3 className="font-semibold">{question}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{answer}</p></div>)}</div></article>
    </section>}
  </main>;
}
