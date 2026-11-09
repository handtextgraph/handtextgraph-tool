"use client";

import { useMemo, useState } from "react";

const control = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-900 outline-none focus:border-brand-blue focus:ring-2 focus:ring-blue-100";
const button = "min-h-11 rounded-full bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50";
const secondary = "min-h-11 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-slate-300";
const panel = "rounded-[28px] border border-slate-200 bg-white p-5 shadow-card sm:p-6";

type StyleDef = {
  id: string;
  name: string;
  note: string;
  convert: (text: string) => string;
};

function mapByOffsets(
  text: string,
  upperBase: number | null,
  lowerBase: number | null,
  digitBase: number | null,
  upperExceptions: Record<string, string> = {},
  lowerExceptions: Record<string, string> = {},
): string {
  return Array.from(text)
    .map((ch) => {
      if (ch >= "A" && ch <= "Z") {
        if (upperExceptions[ch]) return upperExceptions[ch];
        if (upperBase === null) return ch;
        return String.fromCodePoint(upperBase + (ch.charCodeAt(0) - 65));
      }
      if (ch >= "a" && ch <= "z") {
        if (lowerExceptions[ch]) return lowerExceptions[ch];
        if (lowerBase === null) return ch;
        return String.fromCodePoint(lowerBase + (ch.charCodeAt(0) - 97));
      }
      if (ch >= "0" && ch <= "9") {
        if (digitBase === null) return ch;
        return String.fromCodePoint(digitBase + (ch.charCodeAt(0) - 48));
      }
      return ch;
    })
    .join("");
}

const smallCaps: Record<string, string> = {
  a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", g: "ɢ", h: "ʜ", i: "ɪ", j: "ᴊ",
  k: "ᴋ", l: "ʟ", m: "ᴍ", n: "ɴ", o: "ᴏ", p: "ᴘ", r: "ʀ", t: "ᴛ", u: "ᴜ",
  v: "ᴠ", y: "ʏ",
};

const scriptUpperExceptions: Record<string, string> = {
  B: "ℬ", E: "ℰ", F: "ℱ", H: "ℋ", I: "ℐ", L: "ℒ", M: "ℳ", R: "ℛ",
};
const scriptLowerExceptions: Record<string, string> = { e: "ℯ", g: "ℊ", o: "ℴ" };
const frakturUpperExceptions: Record<string, string> = {
  C: "ℭ", H: "ℌ", I: "ℑ", R: "ℜ", Z: "ℨ",
};
const doubleStruckUpperExceptions: Record<string, string> = {
  C: "ℂ", H: "ℍ", N: "ℕ", P: "ℙ", Q: "ℚ", R: "ℝ", Z: "ℤ",
};

const styles: StyleDef[] = [
  { id: "bold", name: "Bold", note: "Mathematical bold", convert: (t) => mapByOffsets(t, 0x1d400, 0x1d41a, 0x1d7ce) },
  { id: "italic", name: "Italic", note: "Mathematical italic", convert: (t) => mapByOffsets(t, 0x1d434, 0x1d44e, null) },
  { id: "bold-italic", name: "Bold italic", note: "Mathematical bold italic", convert: (t) => mapByOffsets(t, 0x1d468, 0x1d482, null) },
  { id: "script", name: "Script", note: "Mathematical script", convert: (t) => mapByOffsets(t, 0x1d49c, 0x1d4b6, null, scriptUpperExceptions, scriptLowerExceptions) },
  { id: "fraktur", name: "Fraktur", note: "Mathematical fraktur", convert: (t) => mapByOffsets(t, 0x1d504, 0x1d51e, null, frakturUpperExceptions) },
  { id: "double-struck", name: "Double-struck", note: "Mathematical double-struck", convert: (t) => mapByOffsets(t, 0x1d538, 0x1d552, 0x1d7d8, doubleStruckUpperExceptions) },
  { id: "monospace", name: "Monospace", note: "Mathematical monospace", convert: (t) => mapByOffsets(t, 0x1d670, 0x1d68a, 0x1d7f6) },
  { id: "sans-bold", name: "Sans bold", note: "Mathematical sans-serif bold", convert: (t) => mapByOffsets(t, 0x1d5d4, 0x1d5ee, 0x1d7ec) },
  { id: "circled", name: "Circled", note: "Enclosed alphanumerics", convert: (t) => Array.from(t).map((ch) => {
    if (ch >= "A" && ch <= "Z") return String.fromCodePoint(0x24b6 + (ch.charCodeAt(0) - 65));
    if (ch >= "a" && ch <= "z") return String.fromCodePoint(0x24d0 + (ch.charCodeAt(0) - 97));
    if (ch === "0") return "⓪";
    if (ch >= "1" && ch <= "9") return String.fromCodePoint(0x2460 + (ch.charCodeAt(0) - 49));
    return ch;
  }).join("") },
  { id: "fullwidth", name: "Fullwidth", note: "Fullwidth forms", convert: (t) => Array.from(t).map((ch) => {
    if (ch === " ") return "　";
    const code = ch.charCodeAt(0);
    if (code >= 0x21 && code <= 0x7e) return String.fromCodePoint(code + 0xfee0);
    return ch;
  }).join("") },
  { id: "small-caps", name: "Small caps", note: "Small capital letters", convert: (t) => Array.from(t).map((ch) => {
    if (ch >= "A" && ch <= "Z") return smallCaps[ch.toLowerCase()] ?? ch;
    if (ch >= "a" && ch <= "z") return smallCaps[ch] ?? ch;
    return ch;
  }).join("") },
];

export function FancyTextTool() {
  const [text, setText] = useState("Write something fancy");
  const [copied, setCopied] = useState("");
  const outputs = useMemo(() => styles.map((style) => ({ ...style, output: style.convert(text) })), [text]);

  const copy = async (id: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(id);
      window.setTimeout(() => setCopied((current) => (current === id ? "" : current)), 2000);
    } catch {
      setCopied("");
    }
  };

  return (
    <div>
      <div className={panel}>
        <label className="block text-[15px] font-semibold text-slate-700" htmlFor="fancy-text-input">
          Your text
          <span className="mt-2 block">
            <textarea
              id="fancy-text-input"
              rows={3}
              className={control}
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 500))}
              placeholder="Type text to style it"
            />
          </span>
        </label>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          These styles are built from Unicode characters, not from a font — copying copies the styled
          characters themselves. Some apps or older devices may display a few characters differently.
        </p>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {outputs.map((style) => (
          <div key={style.id} className={panel}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">{style.name}</h2>
                <p className="text-sm text-slate-500">{style.note}</p>
              </div>
              <button className={copied === style.id ? button : secondary} onClick={() => void copy(style.id, style.output)} disabled={!style.output.trim()}>
                {copied === style.id ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="mt-4 break-words text-xl leading-9 text-slate-900">{style.output || "—"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
