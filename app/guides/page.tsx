import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPublishedGuides } from "@/lib/guides";
import { absoluteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Guides — How to Convert Text to Handwriting and More | HandTextGraph",
  description:
    "Step-by-step guides for the HandTextGraph studio: convert text to handwriting, make signatures, word searches, invitations, and printable paper — free, in your browser.",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "Guides — How to Convert Text to Handwriting and More | HandTextGraph",
    description:
      "Step-by-step guides for the HandTextGraph studio: convert text to handwriting, make signatures, word searches, invitations, and printable paper — free, in your browser.",
    url: "/guides",
    type: "website",
    images: [{ url: absoluteUrl("/guides/text-to-handwriting.svg"), alt: "A lined paper page with handwritten-style lines and a coral pen" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Guides — How to Convert Text to Handwriting and More | HandTextGraph",
    description:
      "Step-by-step guides for the HandTextGraph studio: convert text to handwriting, make signatures, word searches, invitations, and printable paper — free, in your browser.",
    images: [absoluteUrl("/guides/text-to-handwriting.svg")],
  },
};

function formatDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function GuidesPage() {
  const guides = getPublishedGuides();
  return (
    <main className="bg-brand-paper text-brand-ink">
      <section className="border-b border-[#E8E3DA]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-extrabold uppercase tracking-[.24em] text-brand-teal">
            Guides
          </p>
          <h1 className="mt-4 max-w-3xl font-heading text-4xl font-extrabold leading-tight tracking-[-.04em] sm:text-5xl">
            Learn the studio, one guide at a time.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#455A6B]">
            Short, practical how-tos for the HandTextGraph tools — what each
            one really does, the steps to use it, and the tips that keep the
            result looking right. New guides arrive regularly.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        {guides.length === 0 ? (
          <p className="text-lg leading-8 text-[#455A6B]">
            The first guide is on its way — check back soon.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
              <article
                key={guide.slug}
                className="flex flex-col overflow-hidden rounded-3xl border border-[#BFDAD4] bg-white shadow-sm"
              >
                <Link
                  href={`/guides/${guide.slug}`}
                  aria-label={guide.title}
                  className="block"
                >
                  <Image
                    src={guide.image}
                    alt={guide.imageAlt}
                    width={800}
                    height={600}
                    className="h-auto w-full"
                  />
                </Link>
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <p className="text-xs font-extrabold uppercase tracking-[.18em] text-brand-coral">
                    {guide.targetKeyword}
                  </p>
                  <h2 className="mt-3 font-heading text-2xl font-extrabold leading-snug text-brand-ink">
                    <Link
                      href={`/guides/${guide.slug}`}
                      className="hover:text-brand-coral"
                    >
                      {guide.title}
                    </Link>
                  </h2>
                  <p className="mt-2 flex-1 leading-7 text-[#455A6B]">
                    {guide.description}
                  </p>
                  <p className="mt-4 text-sm font-semibold text-[#71808D]">
                    {guide.datePublished
                      ? formatDate(guide.datePublished)
                      : null}
                    {guide.datePublished ? " · " : ""}
                    {guide.readMinutes} min read
                  </p>
                  <Link
                    href={`/guides/${guide.slug}`}
                    className="mt-5 inline-flex items-center gap-2 font-extrabold text-brand-teal hover:underline"
                  >
                    Read more <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-14 rounded-3xl border border-[#D9D5CC] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-heading text-2xl font-extrabold text-brand-ink">
            Prefer to skip the reading?
          </h2>
          <p className="mt-2 max-w-2xl leading-7 text-[#455A6B]">
            Every guide is built around a free tool that runs in your
            browser. Open the studio and try it while you read.
          </p>
          <Link
            href="/#studio"
            className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-brand-coral px-5 py-3 font-extrabold text-white hover:bg-[#DC5145]"
          >
            Open the handwriting studio →
          </Link>
        </div>
      </section>
    </main>
  );
}
