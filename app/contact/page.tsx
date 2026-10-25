import { defaultSocialImage } from "@/lib/seo";
import { ContactForm } from "@/components/ContactForm";
import { siteAuthor } from "@/lib/author";

export const metadata = {
  title: "Contact Us | HandTextGraph",
  description:
    "Contact HandTextGraph for technical issues, feature suggestions, business inquiries, collaboration requests, and general feedback.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us | HandTextGraph",
    description:
      "Contact HandTextGraph for technical issues, feature suggestions, business inquiries, collaboration requests, and general feedback.",
    url: "/contact",
    type: "website",
    images: [defaultSocialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | HandTextGraph",
    description:
      "Contact HandTextGraph for technical issues, feature suggestions, business inquiries, collaboration requests, and general feedback.",
    images: [defaultSocialImage.url],
  },
};

const contactTopics = [
  "Technical issues or bugs",
  "Questions about how the tool works",
  "Suggestions for new features",
  "Business or collaboration inquiries",
  "General feedback",
];

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? siteAuthor.email;
const formAction = `https://formsubmit.co/ajax/${contactEmail}`;

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.9fr,1.1fr]">
        <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-card lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-blue">Contact Us</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">We are here to help</h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Contact Anwar Fakhri, founder and editor of HandTextGraph, with questions, suggestions, or technical
            issues. Your feedback helps improve the converter and its guides.
          </p>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-slate-950">What You Can Contact Us About</h2>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-lg leading-8 text-slate-600">
              {contactTopics.map((topic) => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>
          </section>

          <section className="mt-10 space-y-4 text-lg leading-8 text-slate-600">
            <h2 className="text-2xl font-semibold text-slate-950">Response Time</h2>
            <p>
              We aim to respond within 24–48 hours, although replies can take longer depending on message volume.
            </p>
          </section>

          <section className="mt-10 space-y-4 text-lg leading-8 text-slate-600">
            <h2 className="text-2xl font-semibold text-slate-950">Our Approach</h2>
            <p>
              We take every message seriously and try to improve our platform based on user feedback. Your input helps us
              make HandTextGraph better for everyone.
            </p>
            <p>Thank you for reaching out to us.</p>
          </section>
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-card lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-green">How to Contact Us</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Send us a message</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Use the form below and your message will be sent to the HandTextGraph support inbox.
          </p>
          <p className="mt-3 text-base leading-7 text-slate-600">
            You can also email us directly at{" "}
            <a className="font-semibold text-brand-blue" href={`mailto:${contactEmail}`}>
              {contactEmail}
            </a>
            .
          </p>

          <ContactForm action={formAction} supportEmail={contactEmail} topics={contactTopics} />
        </section>
      </div>
    </main>
  );
}
