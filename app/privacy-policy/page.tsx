import Link from "next/link";
import { siteAuthor } from "@/lib/author";
import { defaultSocialImage } from "@/lib/seo";

export const metadata = {
  title: "Privacy Policy | HandTextGraph",
  description:
    "Read how HandTextGraph handles browser-based text processing, analytics, contact messages, data retention, and privacy choices.",
  alternates: {
    canonical: "/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | HandTextGraph",
    description:
      "Read how HandTextGraph handles browser-based text processing, analytics, contact messages, data retention, and privacy choices.",
    url: "/privacy-policy",
    type: "website",
    images: [defaultSocialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | HandTextGraph",
    description:
      "Read how HandTextGraph handles browser-based text processing, analytics, contact messages, data retention, and privacy choices.",
    images: [defaultSocialImage.url],
  },
};

const collectedInfo = [
  "Browser type, device type, operating system, and approximate technical environment",
  "Pages visited, referring pages, time on page, and general usage behavior",
  "Basic interaction data that helps us understand which features are useful",
  "Messages, names, and email addresses only when you voluntarily contact us",
];

const uses = [
  "Operate, maintain, and improve the website and handwriting converter",
  "Understand aggregate traffic, performance, and user experience patterns",
  "Respond to contact form submissions, support requests, and feedback",
  "Prevent abuse, troubleshoot errors, and protect the reliability of the service",
  "Measure aggregate website usage through Google Analytics",
];

const userChoices = [
  "Disable or delete cookies through your browser settings",
  "Avoid entering sensitive personal information into the converter",
  "Contact us to request access, correction, or deletion of information you voluntarily provided",
  "Use browser privacy settings or consent tools where available to limit third-party tracking",
  "Contact us with a privacy question or a request concerning information you submitted",
];

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <article className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-card lg:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-blue">Privacy Policy</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Privacy Policy</h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          This Privacy Policy explains how HandTextGraph handles information when you use our tools, contact us,
          or create handwritten-style pages and printable activities in your browser.
        </p>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          HandTextGraph is an independently operated website maintained by{" "}
          <Link href={siteAuthor.profilePath} rel="author" className="font-semibold text-brand-blue">
            {siteAuthor.name}
          </Link>
          .
        </p>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Last updated: July 31, 2026.
        </p>

        <section className="mt-10 space-y-4 text-lg leading-8 text-slate-600">
          <h2 className="text-2xl font-semibold text-slate-950">Browser-Based Text Processing</h2>
          <p>
            HandTextGraph is designed so the text you enter into the converter is processed in your browser for the
            purpose of generating handwritten-style output. The application code does not send that handwriting text
            to a HandTextGraph application server or save it to a HandTextGraph account. This statement applies to
            the converter text itself; analytics, hosting, contact-form, and security providers may still
            receive technical or usage data when the website loads or is used. We do not ask you to enter sensitive
            personal information into the converter, and you should avoid pasting private, confidential, financial,
            medical, or highly sensitive text into any online tool.
          </p>
          <p>
            We may receive normal technical request information from your browser when pages load, such as IP-related
            network data, browser type, device information, and timestamps. This is common for websites and hosting
            services and is used for security, reliability, analytics, and troubleshooting.
          </p>
        </section>

        <section className="mt-10 space-y-4 text-lg leading-8 text-slate-600">
          <h2 className="text-2xl font-semibold text-slate-950">Information the Converter Does Not Ask For</h2>
          <p>
            HandTextGraph has no user account or payment system. The converter does not ask for your name, email
            address, payment details, or an uploaded identity document. Text entered in the converter is used in your
            browser to create the preview and export.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-slate-950">Information We May Collect</h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            We may collect limited information directly or through trusted service providers, including:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-lg leading-8 text-slate-600">
            {collectedInfo.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-slate-950">How We Use Information</h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">We use information for the following purposes:</p>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-lg leading-8 text-slate-600">
            {uses.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mt-10 space-y-4 text-lg leading-8 text-slate-600">
          <h2 className="text-2xl font-semibold text-slate-950">Cookies and Similar Technologies</h2>
          <p>
            HandTextGraph and third-party services may use cookies, local storage, pixels, tags, or similar
            technologies. These technologies can help remember basic preferences, measure traffic, improve performance,
            understand feature usage, or support analytics.
          </p>
          <p>
            You can control cookies through your browser settings. Disabling cookies may affect some website features or
            third-party services, but the core page content should remain accessible.
          </p>
        </section>

        <section className="mt-10 space-y-4 text-lg leading-8 text-slate-600">
          <h2 className="text-2xl font-semibold text-slate-950">Analytics</h2>
          <p>
            HandTextGraph uses Google Analytics to understand aggregate website traffic and usage patterns, such as
            pages visited, approximate location, device and browser information, and interaction events. Google may
            process identifiers and technical information according to its own policies.
          </p>
          <p>
            Analytics information is separate from the text entered into the handwriting converter. HandTextGraph
            does not intentionally send converter text to Google Analytics.
          </p>
          <p>
            You can read how Google handles information from sites that use its services in{" "}
            <a
              className="font-semibold text-brand-blue"
              href="https://policies.google.com/privacy/partners"
              rel="noopener noreferrer"
              target="_blank"
            >
              Google&apos;s privacy information
            </a>
            .
          </p>
        </section>

        <section className="mt-10 space-y-4 text-lg leading-8 text-slate-600">
          <h2 className="text-2xl font-semibold text-slate-950">Contact Forms and Voluntary Messages</h2>
          <p>
            If you contact us through the contact form or by email, we may receive your name, email address, selected
            topic, message content, and any other information you choose to send. We use this information to respond to
            your message, investigate issues, and improve the service.
          </p>
          <p>
            The contact form is delivered through FormSubmit. The information you submit is sent to that provider and
            the HandTextGraph support inbox; it is not processed by the browser-only handwriting renderer.
          </p>
          <p>
            Please do not send passwords, payment information, private documents, or other sensitive data through the
            contact form.
          </p>
        </section>

        <section className="mt-10 space-y-4 text-lg leading-8 text-slate-600">
          <h2 className="text-2xl font-semibold text-slate-950">Data Retention</h2>
          <p>
            We keep voluntarily submitted messages only as long as reasonably needed to respond, provide support,
            maintain records, or protect the site from abuse. Analytics data may be retained by Google according to
            the analytics settings and Google&apos;s policies.
          </p>
          <p>
            If you want us to delete a message or support request you sent, contact us and we will review the request
            unless retention is needed for security, legal, or operational reasons.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-slate-950">Your Choices and Rights</h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Depending on your location, you may have rights to access, correct, delete, restrict, or object to certain
            processing of personal information. Practical privacy choices include:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-lg leading-8 text-slate-600">
            {userChoices.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mt-10 space-y-4 text-lg leading-8 text-slate-600">
          <h2 className="text-2xl font-semibold text-slate-950">Data Security</h2>
          <p>
            We use reasonable technical and organizational measures to protect the website and information we handle.
            However, no website, hosting provider, analytics service, or internet transmission can be guaranteed to be
            completely secure.
          </p>
        </section>

        <section className="mt-10 space-y-4 text-lg leading-8 text-slate-600">
          <h2 className="text-2xl font-semibold text-slate-950">Children&apos;s Privacy</h2>
          <p>
            HandTextGraph is intended for general audiences. We do not knowingly collect personal information from
            children under 13 (or under 16 in applicable regions). If you believe a child has provided personal
            information to us, contact us so we can review and remove it where appropriate.
          </p>
        </section>

        <section className="mt-10 space-y-4 text-lg leading-8 text-slate-600">
          <h2 className="text-2xl font-semibold text-slate-950">Third-Party Links</h2>
          <p>
            Our website may link to third-party websites, tools, research pages, or resources. We are not responsible
            for the privacy practices, content, or security of external websites. Review their policies before sharing
            information with them.
          </p>
        </section>

        <section className="mt-10 space-y-4 text-lg leading-8 text-slate-600">
          <h2 className="text-2xl font-semibold text-slate-950">Updates to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in the website, legal requirements,
            analytics, or business practices. The updated date on this page shows when the policy was last
            revised.
          </p>
        </section>

        <section className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 text-base leading-7 text-slate-700">
          <h2 className="text-xl font-semibold text-slate-950">Contact</h2>
          <p className="mt-2">
            For privacy questions or requests, email{" "}
            <a className="font-semibold text-brand-blue" href={`mailto:${siteAuthor.email}`}>{siteAuthor.email}</a>{" "}
            or use the <Link className="font-semibold text-brand-blue" href="/contact">Contact page</Link>.
          </p>
        </section>
      </article>
    </main>
  );
}
