import type { Metadata } from "next";
import { Eyebrow, PublicContainer, ToolDirectoryLink } from "@/components/ui/PublicUi";
import { toolCategories, toolCategoryIntros, toolsInCategory } from "@/lib/tool-catalog";

export const metadata: Metadata = {
  title: "Free Handwriting, Printable Paper & Classroom Tools",
  description: "Choose a free browser-based tool for handwriting, graph and technical paper, practice sheets, classroom activities, signatures, and creative printables.",
  alternates: { canonical: "/tools" },
};

export default function ToolsPage() {
  return (
    <main>
      <section className="border-b border-platform-border bg-platform-ice">
        <PublicContainer className="py-16 lg:py-20">
          <Eyebrow>Every workspace</Eyebrow>
          <h1 className="mt-4 max-w-4xl font-heading text-4xl font-extrabold tracking-tight text-platform-navy sm:text-5xl">
            Choose the tool that matches the page you need to make.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            There is no dashboard to learn and no account to set up. Open a focused workspace, add your content,
            check the preview, and download the result.
          </p>
        </PublicContainer>
      </section>
      <PublicContainer className="py-16 lg:py-20">
        {toolCategories.map((category, index) => (
          <section id={category.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")} key={category} className={`${index ? "mt-20 " : ""}scroll-mt-28`} aria-labelledby={`tool-category-${index}`}>
            <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
              <div>
                <Eyebrow tone="amber">{category}</Eyebrow>
                <h2 id={`tool-category-${index}`} className="mt-3 font-heading text-3xl font-bold text-platform-navy">
                  {toolCategoryIntros[category]}
                </h2>
              </div>
              <div className="divide-y divide-platform-border border-y border-platform-border">
                {toolsInCategory(category).map((tool) => <ToolDirectoryLink key={tool.href} {...tool} />)}
              </div>
            </div>
          </section>
        ))}
      </PublicContainer>
    </main>
  );
}
