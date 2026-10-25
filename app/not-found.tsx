import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-[68vh] max-w-5xl items-center px-4 py-16 sm:px-6 lg:px-8">
      <section className="w-full rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-card sm:p-10 lg:p-14">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-blue">404 · Page not found</p>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          This page is not on the notebook
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          The address may be outdated or typed incorrectly. You can return home, open the handwriting converter, or
          continue with our tools and printable templates.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Return Home
          </Link>
          <Link
            href="/#tool"
            className="inline-flex min-h-11 items-center rounded-full border border-blue-100 bg-blue-50 px-6 py-3 text-sm font-semibold text-brand-blue transition hover:bg-blue-100"
          >
            Open Converter
          </Link>
          <Link
            href="/templates"
            className="inline-flex min-h-11 items-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Browse Templates
          </Link>
        </div>
      </section>
    </main>
  );
}
