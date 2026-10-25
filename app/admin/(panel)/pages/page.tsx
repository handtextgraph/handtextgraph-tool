import Link from "next/link";
import { ContentList } from "@/components/admin/ContentList";
import { csrfToken, listContent } from "@/lib/cms/admin-data";

const protectedPages = [
  ["Homepage", "/", "Main handwriting converter and homepage"],
  ["About", "/about", "Website information"],
  ["Contact", "/contact", "Contact page"],
  ["Tools", "/tools", "Tools directory"],
  ["Templates", "/templates", "Printable templates"],
  ["Privacy Policy", "/privacy-policy", "Legal page"],
  ["Terms", "/terms", "Legal page"],
  ["Responsible Use", "/responsible-use", "Policy page"],
] as const;

const toolPages = [
  ["Main Text to Handwriting Converter", "", "/"],
  ["Worksheet Generator", "tools/handwriting-worksheet-generator", "/tools/handwriting-worksheet-generator"],
  ["Cursive Text Generator", "cursive-text-generator", "/cursive-text-generator"],
  ["Sentence Scramble Generator", "sentence-scramble-generator", "/sentence-scramble-generator"],
  ["Word Search Maker", "word-search-maker", "/word-search-maker"],
  ["Signature Generator", "signature-generator", "/signature-generator"],
  ["Word Scramble Generator", "word-scramble-generator", "/word-scramble-generator"],
  ["Assignment Maker", "assignment-maker", "/assignment-maker"],
  ["Invitation Maker", "invitation-maker", "/invitation-maker"],
] as const;

export default async function Pages({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const params = await searchParams;
  const [rows, csrf] = await Promise.all([
    listContent("PAGE", params.q, params.status),
    csrfToken(),
  ]);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Pages</h1>
          <p className="mt-2 text-slate-600">
            Create and manage CMS pages, or open an existing protected website page.
          </p>
        </div>
        <Link href="/admin/pages/new" className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white">
          Add new page
        </Link>
      </div>

      <section className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <h2 className="text-lg font-bold">Existing website pages</h2>
          <p className="mt-1 text-sm text-slate-600">
            These routes are protected because they contain application, navigation, or legal functionality. They remain live but cannot be replaced by a CMS page.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr><th className="p-4">Title</th><th className="p-4">URL</th><th className="p-4">Type</th><th className="p-4">Action</th></tr>
            </thead>
            <tbody className="divide-y">
              {protectedPages.map(([title, href, description]) => (
                <tr key={href}>
                  <td className="p-4 font-semibold">{title}</td>
                  <td className="p-4 text-slate-600">{href}</td>
                  <td className="p-4">
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-900">Protected</span>
                    <span className="ml-2 text-xs text-slate-500">{description}</span>
                  </td>
                  <td className="p-4"><Link href={href} target="_blank" className="font-semibold text-blue-600">View live</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <h2 className="text-lg font-bold">Tool pages</h2>
          <p className="mt-1 text-sm text-slate-600">Edit safe titles, descriptions, instructions, features, FAQs, and search metadata without changing the tool controls or export logic.</p>
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
          {toolPages.map(([title, slug, href]) => (
            <article key={title} className="min-w-0 rounded-xl border p-4">
              <h3 className="truncate font-semibold">{title}</h3>
              <p className="mt-1 truncate text-xs text-slate-500">{href}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
                {slug ? <Link href={`/admin/tools?slug=${encodeURIComponent(slug)}`} className="text-blue-600">Edit content & SEO</Link> : <span className="text-slate-400" title="The homepage editor is code-protected">Protected homepage</span>}
                <Link href={href} target="_blank" className="text-slate-600">View live</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">CMS-editable pages</h2>
            <p className="mt-1 text-sm text-slate-600">Pages created here can be drafted, previewed, published, edited, and deleted without deployment.</p>
          </div>
          <form className="flex flex-wrap gap-3">
            <input className="rounded-xl border px-4 py-2" name="q" defaultValue={params.q} placeholder="Search title or slug" />
            <select className="rounded-xl border px-4 py-2" name="status" defaultValue={params.status}>
              <option value="">Active pages</option><option>DRAFT</option><option>PUBLISHED</option><option>TRASH</option>
            </select>
            <button className="rounded-xl border bg-white px-4 py-2 font-semibold">Search</button>
          </form>
        </div>
        <div className="mt-4"><ContentList kind="pages" rows={rows} csrf={csrf} /></div>
      </section>
    </div>
  );
}
