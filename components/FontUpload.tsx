"use client";

import { useRef, useState } from "react";
import { uploadCustomFont, CUSTOM_FONT_MAX_LABEL, type CustomFontUploadResult } from "@/lib/custom-fonts";
import type { HandwritingStyle } from "@/lib/handwriting";

export function FontUploadControl({ onUploaded }: { onUploaded: (style: HandwritingStyle) => void }) {
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [lastUploadName, setLastUploadName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File | undefined) => {
    setError("");
    if (!file || uploading) return;
    setUploading(true);
    try {
      const result: CustomFontUploadResult = await uploadCustomFont(file);
      if (result.error || !result.style) {
        setError(result.error ?? "This font could not be uploaded. Try another .ttf or .otf file.");
        return;
      }
      setLastUploadName(file.name);
      onUploaded(result.style);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3">
      <label className="block cursor-pointer text-sm font-semibold text-slate-700" htmlFor="customFont">
        Upload your font
      </label>
      <input
        id="customFont"
        ref={inputRef}
        type="file"
        accept=".ttf,.otf"
        disabled={uploading}
        className="mt-2 block w-full text-xs text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:font-semibold file:text-brand-blue disabled:opacity-50"
        onChange={(event) => {
          void handleFile(event.target.files?.[0]);
        }}
      />
      <p className="mt-2 text-xs leading-5 text-slate-500">
        TTF or OTF up to {CUSTOM_FONT_MAX_LABEL}. Your font is loaded in this browser only and stays
        available for this session. Uploaded fonts are used for the preview and are included in PNG,
        JPG, and PDF exports.
      </p>
      {uploading && (
        <p className="mt-2 text-xs font-semibold text-brand-blue" role="status">
          Loading font…
        </p>
      )}
      {lastUploadName && !error && !uploading && (
        <p className="mt-2 text-xs font-semibold text-emerald-700">
          {lastUploadName} is ready and selected.
        </p>
      )}
      {error && (
        <p className="mt-2 text-xs font-semibold text-rose-700" role="alert">
          {error}
        </p>
      )}

      <details className="mt-3 rounded-lg bg-white px-3 py-2 ring-1 ring-slate-200">
        <summary className="cursor-pointer text-xs font-semibold text-slate-800">
          How to use custom fonts
        </summary>
        <div className="mt-2 space-y-2 text-xs leading-5 text-slate-600">
          <p>
            Pick a .ttf or .otf file from your device and it appears above as a new style card marked
            “Custom”, already selected. Type as normal — the preview, PNG, JPG, and PDF exports all use
            your font exactly like the built-in styles.
          </p>
          <p>
            Uploaded fonts live in this browser tab only: refresh the page and you will need to upload
            again. Remove a font any time with the × on its card. Only upload fonts you have the right
            to use — many free fonts allow personal use but restrict sharing, so check the license if
            you plan to distribute your exports.
          </p>
          <p>
            If an upload fails, check the file really is a .ttf or .otf (not a renamed document) and is
            under {CUSTOM_FONT_MAX_LABEL}. On phones, use the system file picker rather than a cloud
            drive preview if the first attempt fails.
          </p>
        </div>
      </details>
    </div>
  );
}
