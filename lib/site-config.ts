const rawOrigin = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");

function resolveOrigin() {
  if (!rawOrigin) return process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://handtextgraph.com";
  const url = new URL(rawOrigin);
  if (!/^https?:$/.test(url.protocol)) throw new Error("NEXT_PUBLIC_SITE_URL must use http or https.");
  if (url.hostname === "handwritingtool.com" || url.hostname.endsWith(".handwritingtool.com")) {
    throw new Error("NEXT_PUBLIC_SITE_URL must not use the former handwritingtool.com domain.");
  }
  return url.origin;
}

export const siteConfig = {
  name: "HandTextGraph",
  shortName: "HandTextGraph",
  origin: resolveOrigin(),
  hasConfiguredOrigin: Boolean(rawOrigin),
  description: "Free browser-based handwriting, printable paper, worksheet, puzzle, drawing, and poster tools.",
  email: "handwritingmaker@gmail.com",
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, `${siteConfig.origin}/`).toString();
}
