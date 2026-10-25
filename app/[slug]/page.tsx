import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { publicContent } from "@/lib/cms/public";

type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{const page=await publicContent("PAGE",(await params).slug);if(!page)return{};return{title:page.seo_title||page.title,description:page.meta_description||page.excerpt,alternates:{canonical:page.canonical_url||`/${page.slug}`},robots:page.robots_noindex?{index:false,follow:false}:undefined,openGraph:{title:page.seo_title||page.title,description:page.meta_description||page.excerpt,url:`/${page.slug}`,type:"website"}}}
export default async function CmsPage({params}:Props){const page=await publicContent("PAGE",(await params).slug);if(!page)notFound();return <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20"><article className="rounded-3xl border bg-white p-6 shadow-sm sm:p-10"><h1 className="text-4xl font-bold tracking-tight text-slate-950">{page.title}</h1>{page.excerpt&&<p className="mt-4 text-lg leading-8 text-slate-600">{page.excerpt}</p>}<div className="prose prose-slate mt-8 max-w-none" dangerouslySetInnerHTML={{__html:page.content_html}}/></article></main>}
