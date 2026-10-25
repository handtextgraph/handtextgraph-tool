import type { Metadata } from "next";
import Link from "next/link";
import { BlogIndex } from "@/components/blog/BlogIndex";
import { editorialArticles } from "@/lib/editorial-content";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Handwriting, Printable Paper & Classroom Guides",
  description: "Practical, original guides to handwriting pages, graph paper, printable worksheets, number charts, creative tools, PDF exports, and accurate printing.",
  alternates: { canonical: "/blog" },
  openGraph: { title: "Practical Guides | HandTextGraph", description: "Clear guidance for better handwritten pages, printables, worksheets, diagrams, and exports.", url: "/blog", type: "website" },
};

export default function BlogPage() {
  const schema = { "@context":"https://schema.org", "@type":"CollectionPage", name:"Handwriting and printable guides", url:absoluteUrl("/blog"), isPartOf:{"@type":"WebSite",name:siteConfig.name,url:siteConfig.origin}, mainEntity:{"@type":"ItemList",numberOfItems:editorialArticles.length,itemListElement:editorialArticles.map((a,index)=>({"@type":"ListItem",position:index+1,url:absoluteUrl(`/blog/${a.slug}`),name:a.title}))} };
  return <main className="min-h-screen bg-platform-ice">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}} />
    <section className="border-b border-slate-200 bg-white"><div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <nav aria-label="Breadcrumb" className="text-sm font-semibold text-slate-500"><Link href="/" className="hover:text-platform-teal">Home</Link><span className="mx-2">/</span><span aria-current="page">Guides</span></nav>
      <p className="mt-8 text-xs font-extrabold uppercase tracking-[.24em] text-platform-teal">Learn, make, print</p>
      <h1 className="mt-4 max-w-4xl font-heading text-4xl font-extrabold tracking-[-.04em] text-platform-navy sm:text-6xl">Practical guides for better pages and printables</h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">Clear, tested guidance for choosing paper geometry, building classroom resources, using creative tools, and getting accurate output from your printer.</p>
    </div></section>
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><BlogIndex articles={editorialArticles.map(({slug,title,description,category,readMinutes})=>({slug,title,description,category,readMinutes}))} /></section>
  </main>;
}
