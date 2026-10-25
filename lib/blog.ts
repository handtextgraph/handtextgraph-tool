import fs from "fs";
import path from "path";
import matter from "gray-matter";

const blogsDirectory = path.join(process.cwd(), "content", "blogs");

export type BlogPost = {
  slug: string;
  title: string;
  seoTitle: string;
  date: string;
  updated: string;
  description: string;
  authorName?: string;
  authorBio?: string;
  authorUrl?: string;
  content: string;
  category: BlogCategory;
};

export type BlogCategory =
  | "Getting Started"
  | "Handwriting Generators"
  | "Paper & Layout"
  | "PDF & Export"
  | "Notes & Study"
  | "Guides"
  | "Research & Comparisons";

const categoryBySlug: Record<string, BlogCategory> = {
  "how-to-convert-text-to-handwriting": "Getting Started",
  "create-handwritten-pages-online-free": "Handwriting Generators",
  "graph-paper-handwriting-generator": "Paper & Layout",
  "text-to-handwriting-a4-size": "Paper & Layout",
  "text-to-handwriting-on-lined-paper": "Paper & Layout",
  "text-to-handwriting-pdf-generator": "PDF & Export",
  "handwritten-notes-generator": "Notes & Study",
  "word-to-handwriting-converter-online-free": "Guides",
  "best-handwriting-fonts-for-students": "Guides",
  "best-text-to-handwriting-tools-2026-comparison": "Research & Comparisons",
  "best-text-to-handwriting-settings-realistic-output": "Guides",
  "why-handwriting-still-matters-digital-age": "Research & Comparisons",
  "why-handwritten-retrieval-still-matters-digital-study-workflow": "Notes & Study",
  "how-to-make-handwriting-practice-sheets": "Guides",
  "left-handed-handwriting-tips": "Guides",
  "handwriting-practice-for-dysgraphia": "Guides",
  "how-to-write-fast-neat-in-exams": "Guides",
  "how-to-improve-handwriting-step-by-step": "Guides",
  "best-pens-and-paper-for-handwriting": "Guides",
  "daily-handwriting-drills-exercises": "Guides",
  "how-to-teach-cursive-writing-to-kids": "Guides",
  "kids-handwriting-practice-schedule": "Guides",
  "tracing-vs-freehand-handwriting-practice": "Guides",
};

type Frontmatter = {
  title?: string;
  seoTitle?: string;
  date?: string;
  updated?: string;
  description?: string;
  authorName?: string;
  authorBio?: string;
  authorUrl?: string;
};

function getPostSlugs() {
  if (!fs.existsSync(blogsDirectory)) {
    return [];
  }

  return fs.readdirSync(blogsDirectory).filter((file) => file.endsWith(".mdx"));
}

function normalizeFrontmatter(data: Frontmatter, slug: string) {
  return {
    title: data.title ?? slug,
    seoTitle: data.seoTitle ?? data.title ?? slug,
    date: data.date ?? "",
    updated: data.updated ?? data.date ?? "",
    description: data.description ?? "",
    authorName: data.authorName,
    authorBio: data.authorBio,
    authorUrl: data.authorUrl,
  };
}

export function getPostBySlug(slug: string): BlogPost | null {
  const realSlug = slug.replace(/\.mdx$/, "");
  const fullPath = path.join(blogsDirectory, `${realSlug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const frontmatter = normalizeFrontmatter(data as Frontmatter, realSlug);

  return {
    slug: realSlug,
    content,
    category: categoryBySlug[realSlug] ?? "Handwriting Generators",
    ...frontmatter,
  };
}

export function getAllPosts() {
  return getPostSlugs()
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is BlogPost => Boolean(post))
    .sort((first, second) => second.date.localeCompare(first.date));
}

export type BlogFaq = { question: string; answer: string };

function stripMarkdownInline(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extracts Q&A pairs from a post's `## Frequently Asked Questions` (or `## FAQs`)
 * section so FAQPage schema can be emitted for rich-result eligibility.
 * Questions are `### ` headings; answers are the paragraphs that follow.
 */
export function extractFaqs(content: string): BlogFaq[] {
  const lines = content.split("\n");
  const start = lines.findIndex((line) => /^##\s+(frequently asked questions|faqs?)\s*$/i.test(line.trim()));
  if (start === -1) return [];

  const faqs: BlogFaq[] = [];
  let question: string | null = null;
  let answerLines: string[] = [];

  const flush = () => {
    if (question) {
      const answer = stripMarkdownInline(answerLines.join(" "));
      if (answer.length > 0) faqs.push({ question: stripMarkdownInline(question), answer });
    }
    question = null;
    answerLines = [];
  };

  for (const line of lines.slice(start + 1)) {
    const trimmed = line.trim();
    if (/^##\s+/.test(trimmed)) break;
    const heading = trimmed.match(/^###\s+(.+)$/);
    if (heading) {
      flush();
      question = heading[1];
      continue;
    }
    if (question && trimmed.length > 0 && !trimmed.startsWith("<")) {
      answerLines.push(trimmed);
    }
  }
  flush();

  return faqs;
}
