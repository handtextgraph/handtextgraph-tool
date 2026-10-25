import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { editorialArticles, getEditorialArticle } from "@/lib/editorial-content";
import { siteAuthor } from "@/lib/author";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return editorialArticles.map(({slug})=>({slug})); }
export async function generateMetadata({params}:Props):Promise<Metadata>{
  const article=getEditorialArticle((await params).slug); if(!article)return{};
  return {title:article.seoTitle,description:article.description,alternates:{canonical:`/blog/${article.slug}`},openGraph:{title:article.seoTitle,description:article.description,url:`/blog/${article.slug}`,type:"article",publishedTime:article.published,modifiedTime:article.updated,authors:[siteAuthor.name]}};
}

function slugify(value:string){return value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}

export default async function ArticlePage({params}:Props){
  const article=getEditorialArticle((await params).slug); if(!article)notFound();
  const related=editorialArticles.filter((item)=>item.category===article.category&&item.slug!==article.slug).slice(0,3);
  const schema=[{"@context":"https://schema.org","@type":"Article",headline:article.title,description:article.description,datePublished:article.published,dateModified:article.updated,mainEntityOfPage:absoluteUrl(`/blog/${article.slug}`),author:{"@type":"Person",name:siteAuthor.name,url:absoluteUrl(siteAuthor.profilePath)},publisher:{"@type":"Organization",name:siteConfig.name,url:siteConfig.origin}}, {"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:absoluteUrl("/")},{"@type":"ListItem",position:2,name:"Guides",item:absoluteUrl("/blog")},{"@type":"ListItem",position:3,name:article.title,item:absoluteUrl(`/blog/${article.slug}`)}]}, {"@context":"https://schema.org","@type":"FAQPage",mainEntity:article.faqs.map((faq)=>({"@type":"Question",name:faq.question,acceptedAnswer:{"@type":"Answer",text:faq.answer}}))}];
  return <main className="bg-platform-ice pb-20">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}} />
    <header className="border-b border-slate-200 bg-white"><div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:py-20">
      <nav aria-label="Breadcrumb" className="text-sm font-semibold text-slate-500"><Link href="/">Home</Link><span className="mx-2">/</span><Link href="/blog">Guides</Link><span className="mx-2">/</span><span aria-current="page">{article.category}</span></nav>
      <p className="mt-8 text-xs font-extrabold uppercase tracking-[.22em] text-platform-teal">{article.category} · {article.readMinutes} minute read</p>
      <h1 className="mt-4 max-w-4xl font-heading text-4xl font-extrabold leading-tight tracking-[-.04em] text-platform-navy sm:text-6xl">{article.title}</h1>
      <p className="mt-6 max-w-3xl text-xl leading-9 text-slate-600">{article.intro}</p>
      <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500"><span>By <Link href={siteAuthor.profilePath} className="font-bold text-platform-navy">{siteAuthor.name}</Link></span><span>Updated <time dateTime={article.updated}>{new Date(`${article.updated}T00:00:00Z`).toLocaleDateString("en",{dateStyle:"long",timeZone:"UTC"})}</time></span></div>
    </div></header>
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-28 lg:self-start"><div className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="font-heading font-extrabold text-platform-navy">On this page</h2><ol className="mt-3 space-y-2 text-sm leading-6 text-slate-600">{article.sections.map((section)=><li key={section.heading}><a href={`#${slugify(section.heading)}`} className="hover:text-platform-teal">{section.heading}</a></li>)}<li><a href="#frequently-asked-questions" className="hover:text-platform-teal">Frequently asked questions</a></li></ol></div></aside>
      <article className="min-w-0 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <div className="space-y-12">{article.sections.map((section)=><section key={section.heading} id={slugify(section.heading)} className="scroll-mt-28"><h2 className="font-heading text-3xl font-extrabold tracking-tight text-platform-navy">{section.heading}</h2><div className="mt-5 space-y-5 text-[1.05rem] leading-8 text-slate-700">{section.paragraphs.map((paragraph)=><p key={paragraph}>{paragraph}</p>)}</div>{section.bullets&&<ul className="mt-5 list-disc space-y-2 pl-6 leading-7 text-slate-700">{section.bullets.map((bullet)=><li key={bullet}>{bullet}</li>)}</ul>}</section>)}</div>
        <section id="frequently-asked-questions" className="mt-14 scroll-mt-28 border-t border-slate-200 pt-10"><h2 className="font-heading text-3xl font-extrabold text-platform-navy">Frequently asked questions</h2><div className="mt-5 divide-y divide-slate-200">{article.faqs.map((faq)=><details key={faq.question} className="py-5"><summary className="cursor-pointer font-bold text-slate-900">{faq.question}</summary><p className="mt-3 leading-7 text-slate-600">{faq.answer}</p></details>)}</div></section>
        <section className="mt-10 rounded-2xl bg-platform-navy p-6 text-white"><h2 className="font-heading text-xl font-extrabold">Try the related tools</h2><div className="mt-4 flex flex-wrap gap-3">{article.relatedTools.map((tool)=><Link key={tool.href} href={tool.href} className="rounded-xl bg-white px-4 py-2.5 text-sm font-extrabold text-platform-navy hover:bg-platform-ice">{tool.label}</Link>)}</div></section>
      </article>
    </div>
    {related.length>0&&<section className="mx-auto max-w-6xl px-4 sm:px-6"><h2 className="font-heading text-3xl font-extrabold text-platform-navy">Related guides</h2><div className="mt-5 grid gap-4 md:grid-cols-3">{related.map((item)=><Link key={item.slug} href={`/blog/${item.slug}`} className="rounded-2xl border border-slate-200 bg-white p-5 font-heading text-lg font-extrabold text-platform-navy shadow-sm hover:border-platform-teal">{item.title}<span className="mt-3 block text-sm font-bold text-platform-teal">Read guide →</span></Link>)}</div></section>}
  </main>;
}
