import "server-only";
import { cmsConfigured, query } from "./db";

export type PublicContent={id:string;kind:"POST"|"PAGE";title:string;slug:string;excerpt:string;content_html:string;published_at:Date|null;updated_at:Date;seo_title:string;meta_description:string;canonical_url:string;robots_noindex:boolean;include_in_sitemap:boolean;show_breadcrumbs:boolean;author_name:string;featured_image_url:string|null;featured_image_alt:string|null;category_name:string|null};
const visible=`(c.status='PUBLISHED' OR (c.status='SCHEDULED' AND c.scheduled_at<=now())) AND c.trashed_at IS NULL`;
const joins=`JOIN cms_users u ON u.id=c.author_id LEFT JOIN cms_media m ON m.id=c.featured_image_id LEFT JOIN cms_content_categories cc ON cc.content_id=c.id LEFT JOIN cms_categories cat ON cat.id=cc.category_id`;
export async function publicContent(kind:"POST"|"PAGE",slug:string){if(!cmsConfigured())return null;return(await query<PublicContent>(`SELECT c.*,u.name author_name,m.public_url featured_image_url,m.alt_text featured_image_alt,cat.name category_name FROM cms_content c ${joins} WHERE c.kind=$1 AND c.slug=$2 AND ${visible} LIMIT 1`,[kind,slug]))[0]??null}
export async function publicContentList(kind:"POST"|"PAGE"){if(!cmsConfigured())return[];return query<PublicContent>(`SELECT c.*,u.name author_name,m.public_url featured_image_url,m.alt_text featured_image_alt,cat.name category_name FROM cms_content c ${joins} WHERE c.kind=$1 AND ${visible} ORDER BY COALESCE(c.published_at,c.scheduled_at,c.created_at) DESC`,[kind])}

export type PublicToolContent={slug:string;display_name:string;intro:string;description:string;content_html:string;instructions:string[];features:string[];faqs:string[];related_tools:string[];card_description:string;seo_title:string;meta_description:string;featured:boolean;published:boolean;noindex:boolean;hero_image_url:string|null;hero_image_alt:string};
export async function publicToolContent(slug:string){if(!cmsConfigured())return null;return(await query<PublicToolContent>(`SELECT t.*,m.public_url hero_image_url FROM cms_tools t LEFT JOIN cms_media m ON m.id=t.hero_image_id WHERE t.slug=$1 AND t.published=true LIMIT 1`,[slug]))[0]??null}
