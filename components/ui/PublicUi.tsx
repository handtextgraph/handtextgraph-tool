import type { ReactNode } from "react";
import Link from "next/link";

export function PublicContainer({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function Eyebrow({ children, tone = "teal" }: { children: ReactNode; tone?: "teal" | "amber" }) {
  return <p className={`text-sm font-bold uppercase tracking-[0.2em] ${tone === "amber" ? "text-amber-700" : "text-platform-teal"}`}>{children}</p>;
}

export function Breadcrumbs({ items }: { items: readonly { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-platform-slate">
      <ol className="flex flex-wrap items-center justify-center gap-2">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            {index > 0 ? <span aria-hidden="true">/</span> : null}
            {item.href ? <Link href={item.href} className="font-semibold transition hover:text-platform-teal">{item.label}</Link> : <span aria-current="page">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function ContentPanel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <article className={`rounded-[28px] border border-platform-border bg-white p-6 shadow-card sm:p-7 ${className}`}>{children}</article>;
}

export function ToolDirectoryLink({ href, name, description }: { href: string; name: string; description: string }) {
  return (
    <Link href={href} className="group grid gap-2 py-6 focus-visible:rounded-xl sm:grid-cols-[0.75fr_1.15fr_auto] sm:items-center sm:gap-6">
      <h3 className="font-heading text-lg font-bold text-platform-navy transition group-hover:text-platform-teal">{name}</h3>
      <p className="leading-7 text-slate-600">{description}</p>
      <span aria-hidden="true" className="text-xl text-platform-teal transition-transform group-hover:translate-x-1">&rarr;</span>
      <span className="sr-only">Open {name}</span>
    </Link>
  );
}
