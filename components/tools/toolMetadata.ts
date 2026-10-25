import type { Metadata } from "next";
import { editorSocialImage } from "@/lib/seo";
import { newTool, type NewToolSlug } from "@/lib/new-tools";
import { publicToolContent } from "@/lib/cms/public";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

export async function toolMetadata(slug: NewToolSlug): Promise<Metadata> {
  const tool = newTool(slug), cms=await publicToolContent(slug); const path = `/${slug}`; const title = cms?.seo_title||`${cms?.display_name||tool.name} Free Online | ${siteConfig.name}`;const description=cms?.meta_description||cms?.description||tool.description;
  return { title, description, robots:{index:!cms?.noindex,follow:true},alternates: { canonical: path }, openGraph: { title, description, url: path, type: "website", images: [editorSocialImage] }, twitter: { card: "summary_large_image", title, description, images: [editorSocialImage.url] } };
}

export function toolSchema(slug: NewToolSlug) { const tool=newTool(slug),url=absoluteUrl(`/${slug}`); return [{"@context":"https://schema.org","@type":"WebApplication",name:tool.name,url,description:tool.description,applicationCategory:"UtilitiesApplication",operatingSystem:"Web",isAccessibleForFree:true},{"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:absoluteUrl("/")},{"@type":"ListItem",position:2,name:"Tools",item:absoluteUrl("/tools")},{"@type":"ListItem",position:3,name:tool.name,item:url}]}] }
