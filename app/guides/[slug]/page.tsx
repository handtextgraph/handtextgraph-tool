import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, ContentPanel } from "@/components/ui/PublicUi";
import { getGuideContent } from "@/lib/guides/content";
import { getPublishedGuide, getPublishedGuides } from "@/lib/guides";
import { siteAuthor } from "@/lib/author";
import { absoluteUrl } from "@/lib/site-config";

export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPublishedGuides().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = getPublishedGuide((await params).slug);
  if (!guide) return {};
  return {
    title: `${guide.title} | HandTextGraph`,
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      title: `${guide.title} | HandTextGraph`,
      description: guide.description,
      url: `/guides/${guide.slug}`,
      type: "article",
      images: [{ url: absoluteUrl(guide.image), alt: guide.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${guide.title} | HandTextGraph`,
      description: guide.description,
      images: [absoluteUrl(guide.image)],
    },
  };
}

function formatDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getPublishedGuide(slug);
  if (!guide) notFound();
  const content = getGuideContent(slug);
  if (!content) notFound();
  const { Body, faqs } = content;
  const relatedGuides = getPublishedGuides().filter(
    (other) => other.slug !== slug,
  );
  const guideUrl = absoluteUrl(`/guides/${guide.slug}`);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    image: absoluteUrl(guide.image),
    author: {
      "@type": "Person",
      name: siteAuthor.name,
      url: absoluteUrl(siteAuthor.profilePath),
    },
    publisher: {
      "@type": "Organization",
      "@id": `${absoluteUrl()}/#organization`,
      name: "HandTextGraph",
      url: absoluteUrl(),
    },
    datePublished: guide.datePublished ?? undefined,
    dateModified: guide.datePublished ?? undefined,
    mainEntityOfPage: guideUrl,
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Guides", item: absoluteUrl("/guides") },
      { "@type": "ListItem", position: 3, name: guide.title, item: guideUrl },
    ],
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <main className="bg-brand-paper text-brand-ink">
      {[articleSchema, breadcrumbSchema, faqSchema].map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item).replace(/</g, "\\u003c"),
          }}
        />
      ))}

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Guides", href: "/guides" },
            { label: guide.title },
          ]}
        />

        <header className="mt-8 text-center">
          <p className="text-xs font-extrabold uppercase tracking-[.24em] text-brand-teal">
            Guide
          </p>
          <h1 className="mt-4 font-heading text-4xl font-extrabold leading-tight tracking-[-.04em] sm:text-5xl">
            {guide.title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#455A6B]">
            {guide.description}
          </p>
          <p className="mt-5 text-sm font-semibold text-[#71808D]">
            By {siteAuthor.name}
            {guide.datePublished
              ? ` · ${formatDate(guide.datePublished)}`
              : ""}{" "}
            · {guide.readMinutes} min read
          </p>
        </header>

        <div className="mt-10 overflow-hidden rounded-3xl border border-[#D9D5CC] bg-white shadow-sm">
          <Image
            src={guide.image}
            alt={guide.imageAlt}
            width={800}
            height={600}
            priority
            className="h-auto w-full"
          />
        </div>

        <ContentPanel className="mt-10">
          <div className="prose prose-slate max-w-none prose-headings:font-heading prose-headings:text-brand-ink prose-h2:mt-10 prose-h2:text-3xl prose-h2:font-extrabold prose-h3:mt-8 prose-h3:text-xl prose-h3:font-extrabold prose-p:leading-8 prose-p:text-[#455A6B] prose-li:leading-7 prose-li:text-[#455A6B] prose-strong:text-brand-ink">
            <Body />
          </div>
        </ContentPanel>

        {faqs.length > 0 ? (
          <section className="mt-10 rounded-3xl border border-[#D9D5CC] bg-white p-6 shadow-sm sm:p-8">
            <h2 className="font-heading text-3xl font-extrabold text-brand-ink">
              Frequently asked questions
            </h2>
            <div className="mt-3 divide-y divide-[#E8E3DA] border-b border-[#E8E3DA]">
              {faqs.map((item) => (
                <details key={item.question} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-heading text-lg font-extrabold text-brand-ink">
                    <span>{item.question}</span>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#FFF0ED] text-brand-coral group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="max-w-2xl pt-4 leading-7 text-[#455A6B]">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-10 rounded-3xl bg-platform-navy p-6 text-white sm:p-8">
          <h2 className="font-heading text-2xl font-extrabold">
            Related tools
          </h2>
          <p className="mt-2 leading-7 text-slate-300">
            Try the tool this guide is about, or the ones it pairs with.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Link
              href={guide.toolHref}
              className="rounded-2xl bg-white/10 p-4 font-bold hover:bg-white/20"
            >
              {guide.toolLabel}
              <span className="mt-1 block text-sm font-normal text-slate-200">
                Open the tool →
              </span>
            </Link>
            {guide.relatedTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="rounded-2xl bg-white/10 p-4 font-bold hover:bg-white/20"
              >
                {tool.label}
                <span className="mt-1 block text-sm font-normal text-slate-200">
                  Open the tool →
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-heading text-2xl font-extrabold text-brand-ink">
            {relatedGuides.length > 0
              ? "Related guides"
              : "More guides are on the way"}
          </h2>
          {relatedGuides.length > 0 ? (
            <div className="mt-5 grid gap-6 md:grid-cols-2">
              {relatedGuides.map((other) => (
                <article
                  key={other.slug}
                  className="rounded-3xl border border-[#BFDAD4] bg-white p-6 shadow-sm"
                >
                  <h3 className="font-heading text-xl font-extrabold text-brand-ink">
                    <Link
                      href={`/guides/${other.slug}`}
                      className="hover:text-brand-coral"
                    >
                      {other.title}
                    </Link>
                  </h3>
                  <p className="mt-2 leading-7 text-[#455A6B]">
                    {other.description}
                  </p>
                  <Link
                    href={`/guides/${other.slug}`}
                    className="mt-4 inline-flex items-center gap-2 font-extrabold text-brand-teal hover:underline"
                  >
                    Read more <span aria-hidden="true">→</span>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-3 max-w-2xl leading-7 text-[#455A6B]">
              This is the first guide in the series. More how-tos — for
              signatures, word searches, invitations, and printable paper —
              are being written one at a time.{" "}
              <Link
                href="/guides"
                className="font-bold text-brand-teal hover:underline"
              >
                Browse all guides
              </Link>{" "}
              to see what is live so far.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
