"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
type ArticleSummary = { slug: string; title: string; description: string; category: string; readMinutes: number };

export function BlogIndex({ articles }: { articles: readonly ArticleSummary[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = useMemo(() => ["All", ...Array.from(new Set(articles.map((a) => a.category)))], [articles]);
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return articles.filter((a) => (category === "All" || a.category === category) && (!needle || `${a.title} ${a.description} ${a.category}`.toLowerCase().includes(needle)));
  }, [articles, category, query]);

  return <>
    <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <label className="block text-sm font-bold text-slate-800" htmlFor="article-search">Search practical guides</label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input id="article-search" type="search" value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Try graph paper, worksheets, printing…" className="min-h-12 flex-1 rounded-xl border border-slate-300 px-4 text-base outline-none focus:border-platform-teal focus:ring-2 focus:ring-platform-teal/20" />
        {(query || category !== "All") && <button type="button" onClick={()=>{setQuery("");setCategory("All")}} className="min-h-12 rounded-xl border border-slate-300 px-5 font-bold text-slate-700 hover:bg-slate-50">Reset</button>}
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="Article categories">
        {categories.map((item)=><button key={item} type="button" onClick={()=>setCategory(item)} aria-pressed={category===item} className={`min-h-10 shrink-0 rounded-full px-4 text-sm font-bold ${category===item?"bg-platform-navy text-white":"bg-platform-ice text-slate-700 hover:bg-slate-200"}`}>{item}</button>)}
      </div>
    </div>
    <p className="mt-7 text-sm font-semibold text-slate-500" aria-live="polite">{visible.length} {visible.length === 1 ? "guide" : "guides"}</p>
    {visible.length ? <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {visible.map((article)=><article key={article.slug} className="group flex min-h-[290px] flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
        <div className="flex items-center justify-between gap-3 text-xs font-extrabold uppercase tracking-wider text-platform-teal"><span>{article.category}</span><span className="text-slate-400">{article.readMinutes} min</span></div>
        <h2 className="mt-4 font-heading text-2xl font-extrabold tracking-tight text-platform-navy"><Link href={`/blog/${article.slug}`} className="outline-none after:absolute focus-visible:underline">{article.title}</Link></h2>
        <p className="mt-3 flex-1 leading-7 text-slate-600">{article.description}</p>
        <Link href={`/blog/${article.slug}`} className="mt-5 inline-flex items-center gap-2 font-extrabold text-platform-teal">Read the guide <span aria-hidden>→</span></Link>
      </article>)}
    </div>:<div className="mt-4 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center"><h2 className="font-heading text-2xl font-bold text-platform-navy">No matching guides</h2><p className="mt-2 text-slate-600">Try a broader term or reset the category filter.</p></div>}
  </>;
}
