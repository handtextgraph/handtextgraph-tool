import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  serverExternalPackages: ["pg"],
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
        { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
      ],
    }];
  },
  async redirects() {
    return [
      {
        source: "/blog/can-teachers-detect-handwriting-generator",
        destination: "/responsible-use",
        permanent: true,
      },
      {
        source: "/privacy",
        destination: "/privacy-policy",
        permanent: true,
      },
      {
        source: "/terms-and-conditions",
        destination: "/terms",
        permanent: true,
      },
      {
        source: "/blog/text-to-handwriting-converter-for-notes",
        destination: "/blog/how-to-convert-text-to-handwriting",
        permanent: true,
      },
      {
        source: "/blog/handwriting-generator-for-assignments",
        destination: "/blog/how-to-convert-text-to-handwriting",
        permanent: true,
      },
      {
        source: "/blog/handwriting-text",
        destination: "/blog/how-to-convert-text-to-handwriting",
        statusCode: 301,
      },
      {
        source: "/blog/handwritten-text-generator",
        destination: "/blog/how-to-convert-text-to-handwriting",
        statusCode: 301,
      },
      {
        source: "/blog/handwriting-tool-vs-handwriting-generator",
        destination: "/blog/how-to-convert-text-to-handwriting",
        statusCode: 301,
      },
      {
        source: "/blog/how-to-make-typed-notes-look-handwritten-online",
        destination: "/blog/how-to-convert-text-to-handwriting",
        statusCode: 301,
      },
      {
        source: "/blog/free-handwriting-generator-online-without-sign-up",
        destination: "/",
        statusCode: 301,
      },
      {
        source: "/blog/make-handwritten-assignment-online",
        destination: "/blog/handwritten-notes-generator",
        statusCode: 301,
      },
      {
        source: "/blog/best-handwriting-generator-for-students-2026",
        destination: "/blog/how-to-convert-text-to-handwriting",
        statusCode: 301,
      },
      {
        source: "/blog/how-to-make-handwritten-assignment-pdf-on-mobile",
        destination: "/blog/how-to-print-pdf-actual-size",
        statusCode: 301,
      },
      {
        source: "/blog/how-to-write-assignments-faster-without-handwriting",
        destination: "/",
        statusCode: 301,
      },
      {
        source: "/blog/best-handwriting-fonts-for-assignments",
        destination: "/blog/how-to-convert-text-to-handwriting",
        statusCode: 301,
      },
      {
        source: "/blog/how-to-make-handwriting-look-realistic-online",
        destination: "/blog/how-to-convert-text-to-handwriting",
        statusCode: 301,
      },
      {
        source: "/blog/pdf-to-handwriting-converter",
        destination: "/blog/how-to-print-pdf-actual-size",
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);
