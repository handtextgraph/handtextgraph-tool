"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { downloadCanvas, wrapCanvasText } from "@/lib/client-export";
import { FontUploadControl } from "@/components/FontUpload";
import type { HandwritingStyle } from "@/lib/handwriting";

const control = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-900 outline-none focus:border-brand-blue focus:ring-2 focus:ring-blue-100";
const button = "min-h-11 rounded-full bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50";
const secondary = "min-h-11 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-slate-300";
const panel = "rounded-[28px] border border-slate-200 bg-white p-5 shadow-card sm:p-6";

const previewFontsUrl = "https://fonts.googleapis.com/css2?family=Architects+Daughter&family=Caveat:wght@400;500;600;700&family=Indie+Flower&family=Patrick+Hand&family=Schoolbell&family=Shadows+Into+Light&display=swap";

type FontOption = { label: string; family: string; note: string };

const builtInFonts: FontOption[] = [
  { label: "Kalam", family: "var(--font-hand), cursive", note: "Bundled with this site · SIL Open Font License" },
  { label: "Caveat", family: "'Caveat', cursive", note: "Google Fonts" },
  { label: "Shadows Into Light", family: "'Shadows Into Light', cursive", note: "Google Fonts" },
  { label: "Patrick Hand", family: "'Patrick Hand', cursive", note: "Google Fonts" },
  { label: "Architects Daughter", family: "'Architects Daughter', cursive", note: "Google Fonts" },
  { label: "Indie Flower", family: "'Indie Flower', cursive", note: "Google Fonts" },
  { label: "Schoolbell", family: "'Schoolbell', cursive", note: "Google Fonts" },
  { label: "Segoe Script", family: "'Segoe Script', cursive", note: "Uses the font installed on your device" },
  { label: "Brush Script MT", family: "'Brush Script MT', cursive", note: "Uses the font installed on your device" },
];

function resolveCanvasFontFamily(font: string) {
  const variable = font.match(/^var\((--[^)]+)\)/);
  if (!variable) return font;
  const resolved = getComputedStyle(document.documentElement).getPropertyValue(variable[1]).trim();
  return resolved ? font.replace(variable[0], resolved) : "'Kalam', cursive";
}

export function HandwritingFontTool() {
  const [text, setText] = useState("Write something beautiful");
  const [font, setFont] = useState(builtInFonts[0].family);
  const [size, setSize] = useState(72);
  const [color, setColor] = useState("#173a78");
  const [customFonts, setCustomFonts] = useState<HandwritingStyle[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const options: FontOption[] = useMemo(
    () => [
      ...builtInFonts,
      ...customFonts.map((style) => ({ label: style.label, family: style.primary, note: "Your uploaded font · this session only" })),
    ],
    [customFonts],
  );
  const selected = options.find((option) => option.family === font) ?? options[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#fffdf7";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.font = `${size}px ${resolveCanvasFontFamily(font)}`;
    wrapCanvasText(ctx, text || " ", 60, 90, canvas.width - 120, Math.round(size * 1.35));
  }, [text, font, size, color]);

  return (
    <div>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href={previewFontsUrl} />
      <div className="grid gap-6 lg:grid-cols-[380px,1fr]">
        <div className={panel}>
          <label className="block text-[15px] font-semibold text-slate-700" htmlFor="font-preview-text">
            Text to preview
            <span className="mt-2 block">
              <textarea
                id="font-preview-text"
                rows={4}
                className={control}
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, 500))}
              />
            </span>
          </label>
          <div className="mt-4 space-y-4">
            <label className="block text-[15px] font-semibold text-slate-700">
              Handwriting font
              <span className="mt-2 block">
                <select className={control} value={font} onChange={(e) => setFont(e.target.value)}>
                  {options.map((option) => (
                    <option key={option.family} value={option.family}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </span>
            </label>
            <p className="text-sm leading-6 text-slate-500">{selected.note}</p>
            <label className="block text-[15px] font-semibold text-slate-700">
              Font size: {size}px
              <span className="mt-2 block">
                <input className={control} type="range" min="36" max="120" value={size} onChange={(e) => setSize(+e.target.value)} />
              </span>
            </label>
            <label className="block text-[15px] font-semibold text-slate-700">
              Ink color
              <span className="mt-2 block">
                <input className={`${control} h-11`} type="color" value={color} onChange={(e) => setColor(e.target.value)} />
              </span>
            </label>
          </div>
          <FontUploadControl
            onUploaded={(style) => {
              setCustomFonts((current) => (current.some((item) => item.id === style.id) ? current : [...current, style]));
              setFont(style.primary);
            }}
          />
          <p className="mt-4 text-sm leading-6 text-slate-500">
            An uploaded font is loaded in this browser only for the current session. It also becomes
            available in the <Link href="/#studio" className="font-semibold text-brand-blue hover:underline">main handwriting studio</Link> while
            this session lasts.
          </p>
        </div>
        <div className={panel}>
          <h2 className="text-xl font-semibold">Live font preview</h2>
          <p className="mt-1 text-sm text-slate-500">Rendered in {selected.label}. The download is an image of this preview, not a font file.</p>
          <div className="mt-4 min-h-[220px] rounded-2xl border bg-[#fffdf7] p-6">
            <p className="break-words leading-snug text-slate-900" style={{ fontFamily: font, fontSize: `${size}px`, color }}>
              {text || "—"}
            </p>
          </div>
          <canvas ref={canvasRef} width={1200} height={520} className="hidden" aria-hidden="true" />
          <div className="mt-5 flex flex-wrap gap-2">
            {(["png", "jpg", "pdf"] as const).map((kind) => (
              <button key={kind} className={kind === "png" ? button : secondary} onClick={() => void downloadCanvas(canvasRef.current!, "handwriting-font-preview", kind)}>
                Download {kind.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-950">Get the Kalam font file</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Kalam is published by Indian Type Foundry under the SIL Open Font License (OFL 1.1), which
              allows free use and redistribution. Download it from its official page — this site does not
              host font files.
            </p>
            <a className="mt-3 inline-flex min-h-11 items-center rounded-full bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700" href="https://fonts.google.com/specimen/Kalam" target="_blank" rel="noopener noreferrer">
              Kalam on Google Fonts
            </a>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              The other preview fonts are also published on Google Fonts — search the font name at{" "}
              <a className="font-semibold text-brand-blue hover:underline" href="https://fonts.google.com/" target="_blank" rel="noopener noreferrer">
                fonts.google.com
              </a>{" "}
              and check each font&apos;s licence there before downloading it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
