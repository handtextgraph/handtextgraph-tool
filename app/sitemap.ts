import type { MetadataRoute } from "next";
import { publicContentList } from "@/lib/cms/public";
import { paperGeneratorSlugs } from "@/lib/paper-generators";
import { curatedTemplatePages } from "@/lib/template-library";
import { editorialArticles } from "@/lib/editorial-content";
import { siteConfig } from "@/lib/site-config";

const siteUrl = siteConfig.origin;

const staticRoutes = [
  { path: "", changeFrequency: "weekly", priority: 1, lastModified: "2026-08-01" },
  { path: "/tools", changeFrequency: "weekly", priority: 0.9, lastModified: "2026-07-18" },
  { path: "/tools/lined-paper-handwriting", changeFrequency: "monthly", priority: 0.9, lastModified: "2026-08-01" },
  { path: "/tools/graph-paper-handwriting", changeFrequency: "monthly", priority: 0.9, lastModified: "2026-08-01" },
  { path: "/tools/handwritten-notes", changeFrequency: "monthly", priority: 0.9, lastModified: "2026-08-01" },
  { path: "/tools/text-to-handwriting-pdf", changeFrequency: "monthly", priority: 0.9, lastModified: "2026-08-01" },
  { path: "/tools/word-to-handwriting", changeFrequency: "monthly", priority: 0.9, lastModified: "2026-10-25" },
  { path: "/tools/handwriting-worksheet-generator", changeFrequency: "monthly", priority: 0.9, lastModified: "2026-09-28" },
  { path: "/cursive-text-generator", changeFrequency: "monthly", priority: 0.9, lastModified: "2026-10-17" },
  { path: "/sentence-scramble-generator", changeFrequency: "monthly", priority: 0.9, lastModified: "2026-10-17" },
  { path: "/word-search-maker", changeFrequency: "monthly", priority: 0.9, lastModified: "2026-10-17" },
  { path: "/signature-generator", changeFrequency: "monthly", priority: 0.9, lastModified: "2026-10-17" },
  { path: "/word-scramble-generator", changeFrequency: "monthly", priority: 0.9, lastModified: "2026-10-17" },
  { path: "/assignment-maker", changeFrequency: "monthly", priority: 0.9, lastModified: "2026-10-17" },
  { path: "/invitation-maker", changeFrequency: "monthly", priority: 0.9, lastModified: "2026-10-17" },
  { path: "/number-grid-generator", changeFrequency: "monthly", priority: 0.9, lastModified: "2026-10-25" },
  { path: "/printable-number-charts", changeFrequency: "monthly", priority: 0.9, lastModified: "2026-10-25" },
  { path: "/sudoku-generator", changeFrequency: "monthly", priority: 0.9, lastModified: "2026-10-25" },
  { path: "/blank-table-generator", changeFrequency: "monthly", priority: 0.9, lastModified: "2026-10-25" },
  { path: "/virtual-graph-paper", changeFrequency: "monthly", priority: 0.9, lastModified: "2026-10-25" },
  { path: "/pixel-art-generator", changeFrequency: "monthly", priority: 0.9, lastModified: "2026-10-25" },
  { path: "/block-poster-maker", changeFrequency: "monthly", priority: 0.9, lastModified: "2026-10-25" },
  { path: "/multi-page-image-poster-generator", changeFrequency: "monthly", priority: 0.9, lastModified: "2026-10-25" },
  { path: "/about", changeFrequency: "monthly", priority: 0.6, lastModified: "2026-07-31" },
  { path: "/author/anwar-fakhri", changeFrequency: "monthly", priority: 0.7, lastModified: "2026-07-31" },
  { path: "/templates", changeFrequency: "monthly", priority: 0.8, lastModified: "2026-05-27" },
  { path: "/blog", changeFrequency: "weekly", priority: 0.8, lastModified: "2026-10-25" },
  { path: "/contact", changeFrequency: "monthly", priority: 0.6, lastModified: "2026-07-31" },
  { path: "/responsible-use", changeFrequency: "yearly", priority: 0.5, lastModified: "2026-07-31" },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.4, lastModified: "2026-07-31" },
  { path: "/terms", changeFrequency: "yearly", priority: 0.4, lastModified: "2026-07-31" },
] satisfies Array<{
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
  lastModified: string;
}>;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = staticRoutes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: new Date(route.lastModified),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
  const paperGenerators = paperGeneratorSlugs.map((slug) => ({ url: `${siteUrl}/tools/${slug}`, lastModified: new Date("2026-10-25"), changeFrequency: "monthly" as const, priority: 0.85 }));
  const templateDetails = curatedTemplatePages.map((page) => ({ url: `${siteUrl}/templates/${page.family}/${page.slug}`, lastModified: new Date("2026-10-25"), changeFrequency: "monthly" as const, priority: 0.8 }));
  const articles = editorialArticles.map((article) => ({ url: `${siteUrl}/blog/${article.slug}`, lastModified: new Date(article.updated), changeFrequency: "monthly" as const, priority: 0.72 }));

  const cmsContent = [...await publicContentList("PAGE")]
    .filter((entry) => entry.include_in_sitemap && !entry.robots_noindex)
    .map((entry) => ({
      url: `${siteUrl}/${entry.slug}`,
      lastModified: entry.updated_at,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  const seen = new Set(cmsContent.map((entry) => entry.url));
  return [...staticPages.filter((entry) => !seen.has(entry.url)), ...paperGenerators.filter((entry) => !seen.has(entry.url)), ...templateDetails.filter((entry) => !seen.has(entry.url)), ...articles.filter((entry) => !seen.has(entry.url)), ...cmsContent];
}
