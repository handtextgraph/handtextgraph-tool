import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { DM_Sans, Kalam, Manrope } from "next/font/google";
import { defaultSocialImage } from "@/lib/seo";
import { siteAuthor } from "@/lib/author";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import { BrandMark, SiteHeader } from "@/components/SiteHeader";
import { CookieConsent } from "@/components/CookieConsent";
import { CookieSettingsButton } from "@/components/CookieSettingsButton";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const kalam = Kalam({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-hand",
});

const manrope = Manrope({ subsets: ["latin"], variable: "--font-heading" });

const googleAnalyticsId = "G-NN2L1WT718";

export const metadata: Metadata = {
  title: "Text to Handwriting Converter Free Online | HandTextGraph",
  description:
    "Turn text into handwriting online free — realistic handwriting styles, A4 or Letter pages, live preview, and multi-page PDF, PNG, or JPG export.",
  metadataBase: new URL(siteConfig.origin),
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
  },
  verification: {
    google: "kKF2k0VCOdi-GqF8y9dNJDpUQUu2cRGheSfiqG4rH1g",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Text to Handwriting Converter Free Online | HandTextGraph",
    description:
      "Turn text into handwriting online free — realistic handwriting styles, A4 or Letter pages, live preview, and multi-page PDF, PNG, or JPG export.",
    url: "/",
    siteName: siteConfig.name,
    type: "website",
    images: [defaultSocialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Text to Handwriting Converter Free Online | HandTextGraph",
    description:
      "Turn text into handwriting online free — realistic handwriting styles, A4 or Letter pages, live preview, and multi-page PDF, PNG, or JPG export.",
    images: [defaultSocialImage.url],
  },
};

const siteSchema = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.origin}/#organization`,
    name: siteConfig.name,
    url: siteConfig.origin,
    logo: absoluteUrl("/handwriting-tool-logo.png"),
    founder: {
      "@type": "Person",
      "@id": `${absoluteUrl(siteAuthor.profilePath)}#person`,
      name: siteAuthor.name,
      url: absoluteUrl(siteAuthor.profilePath),
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.origin}/#website`,
    name: siteConfig.name,
    url: siteConfig.origin,
    publisher: {
      "@id": `${siteConfig.origin}/#organization`,
    },
  },
];

const footerGroups = [
 { heading: "Handwriting Tools", links: [{href:"/#tool",label:"Text to Handwriting"},{href:"/cursive-text-generator",label:"Cursive Text Generator"},{href:"/signature-generator",label:"Signature Generator"}]},
 { heading: "Educational Tools", links: [{href:"/tools/handwriting-worksheet-generator",label:"Worksheet Generator"},{href:"/sentence-scramble-generator",label:"Sentence Scramble"},{href:"/word-search-maker",label:"Word Search Maker"},{href:"/word-scramble-generator",label:"Word Scramble"},{href:"/assignment-maker",label:"Assignment Maker"}]},
 { heading: "Creative Tools", links: [{href:"/virtual-graph-paper",label:"Virtual Graph Paper"},{href:"/pixel-art-generator",label:"Pixel Art Generator"},{href:"/invitation-maker",label:"Invitation Maker"},{href:"/block-poster-maker",label:"Block Poster Maker"}]},
];
const footerLinks = [
  { href: "/tools", label: "All Tools" },
  { href: "/templates", label: "Templates" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/responsible-use", label: "Responsible Use" },
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="netpub_00ab8011455464d0aebec3a2e31e9dbe"
          content="00ab8011455464d0aebec3a2e31e9dbe_126bfd536078816a8856ef3f9cd1563c"
        />
        <Script id="consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'analytics_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied'
            });
            try {
              if (window.localStorage.getItem('hw-cookie-consent') === 'accepted') {
                gtag('consent', 'update', {
                  'ad_storage': 'granted',
                  'analytics_storage': 'granted',
                  'ad_user_data': 'granted',
                  'ad_personalization': 'granted'
                });
              }
            } catch (e) {}
          `}
        </Script>
        
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5045380130139381" crossOrigin="anonymous" strategy="afterInteractive" />
        
      </head>
      <body className={`${dmSans.variable} ${kalam.variable} ${manrope.variable} overflow-x-hidden bg-brand-paper text-brand-ink antialiased`}>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${googleAnalyticsId}');
          `}
        </Script>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }} />
        <div className="min-h-screen">
          <div className="public-site-header"><SiteHeader /></div>
          {children}
          <footer className="public-site-footer border-t border-platform-border bg-platform-navy text-white">
            <div className="mx-auto max-w-7xl px-4 py-14 text-sm text-slate-300 sm:px-6 lg:px-8">
              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4"><div><div className="inline-block rounded-2xl bg-white p-3"><BrandMark/></div><p className="mt-5 max-w-xs leading-7">A focused browser studio for handwriting, printable paper, classroom resources, drawings, and poster-sized ideas.</p></div>{footerGroups.map(group=><div key={group.heading}><h2 className="font-heading font-bold text-white">{group.heading}</h2><ul className="mt-4 space-y-2.5">{group.links.map(link=><li key={link.href}><Link href={link.href} className="transition hover:text-platform-amber focus:text-platform-amber">{link.label}</Link></li>)}</ul></div>)}</div>
              <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-white/15 pt-6">
                {footerLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="transition hover:text-brand-blue">
                    {link.label}
                  </Link>
                ))}
                <CookieSettingsButton />
              </div>
            </div>
          </footer>
          <div className="public-site-consent"><CookieConsent /></div>
        </div>
      </body>
    </html>
  );
}
