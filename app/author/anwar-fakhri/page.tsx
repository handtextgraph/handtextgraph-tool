import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteAuthor } from "@/lib/author";
import { siteConfig } from "@/lib/site-config";
import { defaultSocialImage } from "@/lib/seo";

const siteUrl = siteConfig.origin;

export const metadata: Metadata = {
  title: "Anwar Fakhri | Founder and Editor of HandTextGraph",
  description:
    "Meet Anwar Fakhri, the independent maker behind HandTextGraph and its browser-based writing and classroom tools.",
  alternates: { canonical: siteAuthor.profilePath },
  openGraph: {
    title: "Anwar Fakhri | HandTextGraph",
    description: siteAuthor.shortBio,
    url: siteAuthor.profilePath,
    type: "profile",
    images: [defaultSocialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anwar Fakhri | HandTextGraph",
    description: siteAuthor.shortBio,
    images: [defaultSocialImage.url],
  },
};

export default function AnwarFakhriProfilePage() {
  const profileSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      "@id": `${siteUrl}${siteAuthor.profilePath}#person`,
      name: siteAuthor.name,
      url: `${siteUrl}${siteAuthor.profilePath}`,
      image: `${siteUrl}${siteAuthor.imagePath}`,
      jobTitle: siteAuthor.role,
      sameAs: [siteAuthor.pinterestUrl],
      worksFor: { "@type": "Organization", name: "HandTextGraph", url: siteUrl },
    },
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }} />
      <article className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-card sm:p-8 lg:p-12">
        <div className="grid gap-8 md:grid-cols-[220px,1fr] md:items-center">
          <Image
            src={siteAuthor.imagePath}
            alt="Anwar Fakhri, founder and editor of HandTextGraph"
            width={640}
            height={960}
            priority
            sizes="(max-width: 768px) 176px, 220px"
            className="h-60 w-44 rounded-3xl object-cover object-top shadow-card md:h-[330px] md:w-[220px]"
          />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-blue">Author profile</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{siteAuthor.name}</h1>
            <p className="mt-3 text-base font-semibold text-brand-green">{siteAuthor.role}</p>
            <p className="mt-6 text-lg leading-8 text-slate-600">{siteAuthor.shortBio}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={siteAuthor.pinterestUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">Pinterest profile</a>
              <a href={`mailto:${siteAuthor.email}`} className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Email Anwar</a>
            </div>
          </div>
        </div>


        <section className="mt-12 border-t border-slate-200 pt-10">
          <h2 className="text-2xl font-semibold text-slate-950">Work at HandTextGraph</h2>
          <div className="mt-4 space-y-4 text-lg leading-8 text-slate-600">
            <p>Anwar designs and maintains the browser-based handwriting converter, printable page systems, and classroom activity tools that make up HandTextGraph.</p>
            <p>His focus is straightforward: keep the tools useful, explain their limits clearly, and make every page easier to understand on both a phone and a desktop.</p>
          </div>
        </section>

        <section className="mt-12 border-t border-slate-200 pt-10"><h2 className="text-2xl font-semibold text-slate-950">Start creating</h2><p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">Open the main converter for handwritten pages, or browse the full collection when you need a worksheet, puzzle, assignment, or printable template.</p><div className="mt-6 flex flex-wrap gap-3"><Link href="/#tool" className="rounded-xl bg-brand-coral px-5 py-3 font-bold text-white">Open converter</Link><Link href="/tools" className="rounded-xl border border-brand-teal px-5 py-3 font-bold text-brand-teal">Browse tools</Link></div></section>

      </article>
    </main>
  );
}
