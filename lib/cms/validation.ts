import { z } from "zod";
const blankString=(max:number)=>z.preprocess(value=>value==null?"":value,z.string().max(max));
export const roleSchema = z.enum(["SUPER_ADMIN","EDITOR","AUTHOR"]);
export const loginSchema = z.object({ email: z.string().email().max(254).transform(v=>v.toLowerCase()), password: z.string().min(12).max(200) });
export const contentSchema = z.object({ id:z.string().uuid().optional(), kind:z.enum(["POST","PAGE"]), title:z.string().min(1).max(180), slug:z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(120), excerpt:blankString(500), contentHtml:blankString(500_000), status:z.enum(["DRAFT","SCHEDULED","PUBLISHED","TRASH"]), scheduledAt:z.string().optional(), publicationDate:z.string().optional(), category:z.string().max(80).optional(), featuredImageId:z.string().uuid().optional(), seoTitle:blankString(70), metaDescription:blankString(170), canonicalUrl:blankString(500), noindex:z.boolean().default(false), includeInSitemap:z.boolean().default(true) });
export const configSchema = z.object({ namespace:z.enum(["homepage","navigation","footer","seo","settings"]), key:z.string().regex(/^[a-z0-9._-]+$/).max(100), value:z.unknown() });
