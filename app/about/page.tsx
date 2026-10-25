import Image from "next/image";
import Link from "next/link";
import { siteAuthor } from "@/lib/author";
import { defaultSocialImage } from "@/lib/seo";

export const metadata = {
  title: "About HandTextGraph and Its Free Tools",
  description:
    "Learn who runs HandTextGraph, why it was built, what its tools do, and how they handle typed text in the browser.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About HandTextGraph and Its Free Tools",
    description:
      "Learn who runs HandTextGraph, why it was built, what its tools do, and how they handle typed text in the browser.",
    url: "/about",
    type: "website",
    images: [defaultSocialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "About HandTextGraph and Its Free Tools",
    description:
      "Learn who runs HandTextGraph, why it was built, what its tools do, and how they handle typed text in the browser.",
    images: [defaultSocialImage.url],
  },
};

const capabilities = [
  "Creates handwritten-style pages from pasted or typed text using 10 handwriting styles",
  "Lets you choose lined, blank, or graph paper before exporting",
  "Includes controls for spacing, margins, page layout, ink color, and preview quality",
  "Exports finished pages as PDF, PNG, or JPG",
  "Runs in your browser, so typed text is not uploaded or stored on a server",
];

const useCases = [
  "Notes and drafts",
  "Worksheet samples",
  "Journal pages",
  "Printable practice sheets",
  "Quote cards",
  "Creative and design mockups",
];

export default function AboutPage() {
  return (
    <main className="bg-brand-paper">
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-blue">About HandTextGraph</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            A small tool for making typed notes feel like real handwritten pages
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            HandTextGraph started from a small, specific frustration: typing notes is fast, but a lot of everyday
            situations still call for something that looks handwritten, such as a worksheet sample, journal page,
            printable practice sheet, or quote card.
          </p>
        </div>

        <div className="mt-12 space-y-12">
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-card sm:p-8">
            <h2 className="text-2xl font-semibold text-slate-950">Why This Site Exists</h2>
            <div className="mt-4 space-y-4 text-lg leading-8 text-slate-600">
              <p>
                Writing pages out by hand every time can be slow. Basic font-swap tools can also feel limited because
                they often ignore the parts that make a page readable: paper style, margins, spacing, line height, and
                ink.
              </p>
              <p>
                This site does one thing: it turns typed text into a full handwritten-style page. You can preview the
                page, adjust the layout, and download the result when it looks right.
              </p>
            </div>
          </section>


          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-card sm:p-8">
            <h2 className="text-2xl font-semibold text-slate-950">Who&apos;s Behind This</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-[140px,1fr] sm:items-center">
              <Image
                src={siteAuthor.imagePath}
                alt="Anwar Fakhri, founder and editor of HandTextGraph"
                width={640}
                height={960}
                sizes="140px"
                className="h-48 w-36 rounded-3xl object-cover object-top shadow-card"
              />
              <div className="space-y-4 text-lg leading-8 text-slate-600">
                <p>
                  HandTextGraph is built and maintained by <strong className="text-slate-950">Anwar Fakhri</strong> as a small,
                  independently run project. Anwar develops the converter and writes and edits its practical guides.
                </p>
                <p>
                  The product is shaped around practical improvements to the editor, export options, page controls,
                  and responsible-use guidance, while keeping the workflow simple enough to use without signing up.
                </p>
                <div className="flex flex-wrap gap-4 text-base font-semibold">
                  <Link href={siteAuthor.profilePath} rel="author" className="text-brand-blue hover:underline">Read Anwar&apos;s author profile</Link>
                  <a href={siteAuthor.pinterestUrl} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">Pinterest</a>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-card sm:p-8">
            <h2 className="text-2xl font-semibold text-slate-950">What the Tool Actually Does</h2>
            <div className="mt-6 grid gap-3">
              {capabilities.map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-card sm:p-8">
            <h2 className="text-2xl font-semibold text-slate-950">What It&apos;s For</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              This tool is built for notes, drafts, worksheets, journal pages, printable templates, and creative or
              design work where a handwritten look is genuinely useful and appropriate.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {useCases.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-brand-blue"
                >
                  {item}
                </span>
              ))}
            </div>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              For full guidance on appropriate use, see the{" "}
              <Link href="/responsible-use" className="font-semibold text-brand-blue">
                Responsible Use page
              </Link>
              .
            </p>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-card sm:p-8">
            <h2 className="text-2xl font-semibold text-slate-950">How the Site Is Run</h2>
            <div className="mt-4 space-y-4 text-lg leading-8 text-slate-600">
              <p>
                There is no account system, and the site does not track what you type. Text is processed locally in
                your browser for preview and export.
              </p>
              <p>
                The tool is currently free to use without an account, subscription, or paywall.
              </p>
              <p>
                If something is broken, unclear, or missing a feature you need, the fastest way to reach Anwar Fakhri is the{" "}
                <Link href="/contact" className="font-semibold text-brand-blue">
                  Contact page
                </Link>
                . Real feedback has shaped most of what is on the site so far, and that will continue.
              </p>
              <p>
                New here? Start with the free{" "}
                <Link href="/#tool" className="font-semibold text-brand-blue">
                  text-to-handwriting converter
                </Link>
                , browse the{" "}
                <Link href="/tools" className="font-semibold text-brand-blue">
                  full tool collection
                </Link>
                , or create a printable page from the{" "}
                <Link href="/templates" className="font-semibold text-brand-blue">template studio</Link>.
              </p>
            </div>
          </section>

        </div>
      </section>
    </main>
  );
}
