import Link from "next/link";
import { siteAuthor } from "@/lib/author";
import { defaultSocialImage } from "@/lib/seo";

export const metadata = {
  title: "Terms and Conditions | HandTextGraph",
  description:
    "Read the terms for using HandTextGraph, including acceptable use, user responsibility, generated output, third-party services, and limitations.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms and Conditions | HandTextGraph",
    description:
      "Read the terms for using HandTextGraph, including acceptable use, user responsibility, generated output, third-party services, and limitations.",
    url: "/terms",
    type: "website",
    images: [defaultSocialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms and Conditions | HandTextGraph",
    description:
      "Read the terms for using HandTextGraph, including acceptable use, user responsibility, generated output, third-party services, and limitations.",
    images: [defaultSocialImage.url],
  },
};

const acceptableUses = [
  "Creating notes, drafts, worksheets, examples, journal pages, documents, and creative project previews",
  "Preparing printable pages, writing samples, teaching resources, and personal productivity material",
  "Testing handwriting styles, paper layouts, spacing, and export formats for your own work",
];

const prohibitedUses = [
  "Using the service for illegal, harmful, deceptive, abusive, or misleading activity",
  "Misrepresenting generated output, authorship, identity, credentials, or ownership",
  "Uploading, entering, or sharing content that violates another person's rights",
  "Attempting to disrupt, scrape, overload, reverse engineer, or abuse the website or its infrastructure",
  "Using the service in a way that violates school, workplace, platform, or legal policies that apply to you",
];

const sections = [
  {
    title: "Service Overview",
    text: "HandTextGraph provides online handwriting, worksheet, printable paper, puzzle, assignment, and creative page tools. The service supports general productivity, teaching, practice, design, journaling, and personal document workflows.",
  },
  {
    title: "Your Responsibility",
    text: "You are responsible for the text you enter, the files you create, and how you use or share generated output. Review your pages before printing, publishing, sending, or relying on them.",
  },
  {
    title: "Generated Output",
    text: "Generated handwritten-style pages are based on the text and settings you provide. HandTextGraph does not guarantee that output will be error-free, suitable for every purpose, or accepted by any third party. You should verify spelling, formatting, readability, and accuracy.",
  },
  {
    title: "Intellectual Property",
    text: "The HandTextGraph website, branding, design, software interface, templates, and visual elements are owned by HandTextGraph or its licensors unless stated otherwise. You may not copy, reproduce, sell, or redistribute the website or its content without permission.",
  },
  {
    title: "Your Content",
    text: "You keep responsibility for content you enter into the tool. You confirm that you have the necessary rights to use that content and that it does not violate laws, third-party rights, or applicable policies.",
  },
  {
    title: "Third-Party Services",
    text: "The website uses third-party services for hosting, analytics, contact-form delivery, security, and linked external resources. Those services operate under their own terms and privacy policies. The Privacy Policy explains the services that receive information through this website.",
  },
  {
    title: "Service Availability",
    text: "We aim to keep the website available and useful, but we do not guarantee uninterrupted access. Features may change, pause, or be removed as we improve the service, fix bugs, or perform maintenance.",
  },
  {
    title: "Disclaimers",
    text: "HandTextGraph is provided on an as-is and as-available basis. We do not promise that the service will meet every requirement, produce perfect results, remain error-free, or be compatible with every device, browser, printer, or file workflow.",
  },
  {
    title: "Limitation of Liability",
    text: "To the fullest extent permitted by law, HandTextGraph is not liable for indirect, incidental, special, consequential, or punitive damages, or for loss of data, revenue, reputation, business, or opportunity related to use of the website.",
  },
  {
    title: "Changes to These Terms",
    text: "We may update these Terms and Conditions from time to time. Continued use of the website after changes are posted means you accept the updated terms.",
  },
];

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <article className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-card lg:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-blue">Terms and Conditions</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Terms and Conditions</h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          Welcome to HandTextGraph. These Terms and Conditions explain the rules for using our website, converter,
          templates, generators, and related services.
        </p>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          HandTextGraph is independently operated by{" "}
          <Link href={siteAuthor.profilePath} rel="author" className="font-semibold text-brand-blue">Anwar Fakhri</Link>.
        </p>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Last updated: July 31, 2026.
        </p>

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-2xl font-semibold text-slate-950">{section.title}</h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">{section.text}</p>
            </section>
          ))}
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-slate-950">Acceptable Uses</h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            You may use HandTextGraph for legitimate personal, creative, professional, and educational workflows,
            including:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-lg leading-8 text-slate-600">
            {acceptableUses.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-slate-950">Prohibited Uses</h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            You agree not to use HandTextGraph for the following:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-lg leading-8 text-slate-600">
            {prohibitedUses.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mt-10 space-y-4 text-lg leading-8 text-slate-600">
          <h2 className="text-2xl font-semibold text-slate-950">Termination or Restriction</h2>
          <p>
            We may restrict, block, or discontinue access to the website or features if we believe the service is being
            abused, used unlawfully, or used in a way that harms the website, other users, or third-party rights.
          </p>
        </section>

        <section className="mt-10 space-y-4 text-lg leading-8 text-slate-600">
          <h2 className="text-2xl font-semibold text-slate-950">Governing Terms</h2>
          <p>
            These terms are intended to be interpreted reasonably and in line with applicable law. If any part of these
            terms is found invalid or unenforceable, the remaining sections will continue to apply.
          </p>
        </section>

        <section className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 text-base leading-7 text-slate-700">
          <h2 className="text-xl font-semibold text-slate-950">Contact</h2>
          <p className="mt-2">
            Questions about these terms can be sent through the <Link className="font-semibold text-brand-blue" href="/contact">Contact page</Link>.
          </p>
        </section>

        <p className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-base font-semibold text-slate-700">
          If you do not agree with these terms, please do not use the website.
        </p>
      </article>
    </main>
  );
}
