import { ActionForm } from "@/components/admin/ActionForm";
import { saveToolAction } from "@/app/admin/actions";
import { csrfToken } from "@/lib/cms/admin-data";
import { query } from "@/lib/cms/db";
import { requireUser } from "@/lib/cms/auth";
import { RichEditor } from "@/components/admin/RichEditor";
import { toolCmsDefaults } from "@/lib/tool-cms-defaults";

const builtIn = [
  ["tools/handwriting-worksheet-generator", "Worksheet Generator"],
  ["cursive-text-generator", "Cursive Text Generator"],
  ["sentence-scramble-generator", "Sentence Scramble Generator"],
  ["word-search-maker", "Word Search Maker"],
  ["signature-generator", "Signature Generator"],
  ["word-scramble-generator", "Word Scramble Generator"],
  ["assignment-maker", "Assignment Maker"],
  ["invitation-maker", "Invitation Maker"],
] as const;

type Tool = { slug:string; display_name:string; intro:string; description:string; content_html:string; instructions:string[]; features:string[]; faqs:string[]; related_tools:string[]; card_description:string; seo_title:string; meta_description:string; featured:boolean; published:boolean; noindex:boolean;hero_image_id?:string;hero_image_url?:string;hero_image_alt:string };

export default async function ToolsAdminPage({searchParams}:{searchParams:Promise<{slug?:string}>}) {
  await requireUser("EDITOR");
  const chosen=(await searchParams).slug||builtIn[0][0];
  const existing=(await query<Tool>(`SELECT t.*,m.public_url hero_image_url FROM cms_tools t LEFT JOIN cms_media m ON m.id=t.hero_image_id WHERE t.slug=$1`,[chosen]))[0];
  const fallbackName=builtIn.find(([slug])=>slug===chosen)?.[1]||chosen;
  const defaults=toolCmsDefaults[chosen];
  const tool=existing||{slug:chosen,display_name:defaults?.name||fallbackName,intro:defaults?.description||"",description:defaults?.description||"",content_html:defaults?.contentHtml||"",instructions:[],features:[],faqs:[],related_tools:[],card_description:defaults?.description||"",seo_title:defaults?.seoTitle||"",meta_description:defaults?.metaDescription||"",featured:false,published:true,noindex:false,hero_image_alt:""};
  const csrf=await csrfToken();
  return <div className="min-w-0 space-y-6"><header><h1 className="text-2xl font-bold sm:text-3xl">Edit {tool.display_name}</h1><p className="mt-2 text-slate-600">The current public content is prefilled below. Blank optional fields are not displayed.</p></header><div className="grid min-w-0 gap-6 xl:grid-cols-[250px,minmax(0,1fr)]"><nav className="flex gap-2 overflow-x-auto rounded-2xl border bg-white p-3 xl:block">{builtIn.map(([slug,name])=><a key={slug} href={`/admin/tools?slug=${encodeURIComponent(slug)}`} className={`shrink-0 rounded-lg px-3 py-2 text-sm font-semibold xl:block ${slug===chosen?"bg-blue-50 text-blue-700":"hover:bg-slate-50"}`}>{name}</a>)}</nav><ActionForm action={saveToolAction} className="grid min-w-0 gap-5 rounded-2xl border bg-white p-4 sm:p-6"><input type="hidden" name="csrf" value={csrf}/><input type="hidden" name="slug" value={tool.slug}/><input type="hidden" name="heroImageId" value={tool.hero_image_id||""}/><label className="grid gap-2 text-sm font-semibold">Protected URL slug<input readOnly value={tool.slug} className="min-w-0 rounded-xl border bg-slate-100 px-3 py-2.5 font-normal text-slate-600"/></label><Field label="Title / Page H1" name="displayName" value={tool.display_name}/><Area label="Description below title" name="intro" value={tool.intro}/><div className="grid gap-5 md:grid-cols-2"><Field label="Meta title" name="seoTitle" value={tool.seo_title}/><Area label="Meta description" name="metaDescription" value={tool.meta_description}/></div><div className="min-w-0"><p className="mb-2 text-sm font-semibold">Page content below the working tool</p><RichEditor initial={tool.content_html}/></div><fieldset className="rounded-xl border p-4"><legend className="px-2 font-semibold">Content image</legend>{tool.hero_image_url&&<img src={tool.hero_image_url} alt={tool.hero_image_alt||"Current tool content image"} className="mb-4 max-h-48 rounded-lg border object-contain"/>}<label className="block text-sm font-semibold">Upload JPG, PNG, or WEBP<input className="mt-2 block w-full min-w-0 rounded-xl border px-3 py-2.5 font-normal" type="file" name="toolImage" accept="image/jpeg,image/png,image/webp"/></label><Field label="Image alt text" name="imageAlt" value={tool.hero_image_alt||""}/></fieldset><details className="rounded-xl border p-4"><summary className="cursor-pointer font-semibold">Additional card and visibility settings</summary><div className="mt-4 grid gap-5"><Field label="Tool card description" name="cardDescription" value={tool.card_description}/><div className="flex flex-wrap gap-5"><Check name="featured" label="Featured" checked={tool.featured}/><Check name="published" label="Published" checked={tool.published}/><Check name="noindex" label="Noindex" checked={tool.noindex}/></div></div></details><button className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white sm:w-fit">Save and update page</button></ActionForm></div></div>;
}
function Field({label,name,value}:{label:string;name:string;value:string}){return <label className="grid min-w-0 gap-2 text-sm font-semibold">{label}<input name={name} defaultValue={value} className="min-w-0 rounded-xl border px-3 py-2.5 font-normal"/></label>}
function Area({label,name,value}:{label:string;name:string;value:string}){return <label className="grid min-w-0 gap-2 text-sm font-semibold">{label}<textarea name={name} defaultValue={value} rows={4} className="min-w-0 rounded-xl border px-3 py-2.5 font-normal"/></label>}
function Check({name,label,checked}:{name:string;label:string;checked:boolean}){return <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name={name} defaultChecked={checked}/>{label}</label>}
