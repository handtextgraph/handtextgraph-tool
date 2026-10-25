"use client";

import { useMemo, useState } from "react";
import { PaperSvg } from "@/components/paper/PaperSvg";
import { getPageCountBand, trackEvent } from "@/lib/analytics";
import {
  buildPrintablePageModel,
  createPrintableConfig,
  getPrintablePageDimensions,
  getPrintablePreset,
  normalizePrintableConfig,
  printableTemplatePresets,
  type PrintableTemplateConfig,
  type PrintablePageSize,
  type PracticeMode,
} from "@/lib/printable-templates";

const categories = ["Printable Paper", "Graph & Dot Grid", "Handwriting Practice"] as const;

export function PrintableTemplateStudio() {
  const [config, setConfig] = useState(() => createPrintableConfig());
  const [pngDpi, setPngDpi] = useState(150);
  const [status, setStatus] = useState("Choose a preset and adjust it. Preview shows one representative page.");
  const normalized = useMemo(() => normalizePrintableConfig(config), [config]);
  const preset = getPrintablePreset(normalized.presetId);
  const model = useMemo(() => buildPrintablePageModel(normalized), [normalized]);
  const dimensions = getPrintablePageDimensions(normalized.pageSize, normalized.orientation);

  const update = <Key extends keyof PrintableTemplateConfig>(key: Key, value: PrintableTemplateConfig[Key]) => {
    setConfig((current) => ({ ...current, [key]: value }));
  };
  const updateMargin = (key: keyof PrintableTemplateConfig["margins"], value: number) => {
    setConfig((current) => ({ ...current, margins: { ...current.margins, [key]: value } }));
  };
  const selectPreset = (presetId: string) => {
    const nextPreset = getPrintablePreset(presetId);
    setConfig((current) => createPrintableConfig(presetId, {
      pageSize: current.pageSize,
      orientation: current.orientation,
      pageCount: current.pageCount,
      headerEnabled: current.headerEnabled,
      header: current.header,
    }));
    trackEvent("template_preset_selected", { preset_id: nextPreset.id });
    if (nextPreset.practice) trackEvent("practice_sheet_generated", { practice_mode: "blank" });
  };
  const setPracticeMode = (practiceMode: PracticeMode) => {
    update("practiceMode", practiceMode);
    trackEvent("practice_sheet_generated", { practice_mode: practiceMode });
  };
  const downloadPdf = async () => {
    setStatus("Preparing vector PDF…");
    try {
      const { downloadPrintablePdf } = await import("@/lib/printable-template-pdf");
      downloadPrintablePdf(normalized);
      trackEvent("template_pdf_download", { preset_id: preset.id, page_size: normalized.pageSize, orientation: normalized.orientation, page_count_band: getPageCountBand(normalized.pageCount) });
      setStatus(`${normalized.pageCount}-page PDF downloaded.`);
    } catch {
      setStatus("PDF creation failed. Try one page or reload the studio.");
    }
  };
  const downloadPng = async () => {
    setStatus(`Preparing ${pngDpi} DPI PNG…`);
    try {
      const { downloadPrintablePng } = await import("@/lib/printable-template-png");
      await downloadPrintablePng(normalized, pngDpi);
      trackEvent("template_png_download", { preset_id: preset.id, page_size: normalized.pageSize, orientation: normalized.orientation });
      setStatus("Representative page PNG downloaded.");
    } catch {
      setStatus("PNG creation failed. Try a smaller page or reload the studio.");
    }
  };
  const downloadSvg = async () => {
    setStatus("Preparing vector SVG…");
    try {
      const { downloadPrintableSvg } = await import("@/lib/printable-template-svg");
      downloadPrintableSvg(normalized);
      setStatus("Representative page SVG downloaded.");
    } catch {
      setStatus("SVG creation failed. Reload the studio and try again.");
    }
  };

  return (
    <section id="template-studio" className="scroll-mt-28 border-b border-slate-200 bg-slate-50 py-14" aria-labelledby="template-studio-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-blue">Templates Studio</p>
          <h2 id="template-studio-heading" className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Customize printable paper and practice sheets</h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">Choose a real preset, adjust only the settings you need, preview one lightweight page, then download exact-size PDF, PNG, or SVG output. Everything stays in this browser.</p>
        </div>

        <div className="mt-9 space-y-8">
          {categories.map((category) => (
            <fieldset key={category}>
              <legend className="text-lg font-semibold text-slate-950">{category}</legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {printableTemplatePresets.filter((item) => item.category === category).map((item) => {
                  const selected = item.id === normalized.presetId;
                  return (
                    <button key={item.id} type="button" aria-pressed={selected} onClick={() => selectPreset(item.id)} className={`min-h-28 rounded-2xl border p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue ${selected ? "border-brand-blue bg-blue-50 shadow-sm" : "border-slate-200 bg-white hover:border-blue-200"}`}>
                      <span className="block font-semibold text-slate-950">{item.name}</span>
                      <span className="mt-2 block text-sm leading-6 text-slate-600">{item.description}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>

        <div className="mt-10 grid items-start gap-7 lg:grid-cols-[minmax(0,0.9fr)_minmax(380px,1.1fr)]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card sm:p-7">
            <h3 className="text-2xl font-semibold text-slate-950">Customize {preset.name}</h3>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <SelectField id="templatePageSize" label="Page size" value={normalized.pageSize} onChange={(value) => update("pageSize", value as PrintablePageSize)} options={[["a4", "A4 — 210 × 297 mm"], ["letter", "Letter — 8.5 × 11 in"], ["a5", "A5 — 148 × 210 mm"], ["a3", "A3 — 297 × 420 mm"], ["legal", "US Legal — 8.5 × 14 in"]]} />
              <SelectField id="templateOrientation" label="Orientation" value={normalized.orientation} onChange={(value) => update("orientation", value as "portrait" | "landscape")} options={[["portrait", "Portrait"], ["landscape", "Landscape"]]} />
              <NumberField id="templateSpacing" label="Line / grid spacing (mm)" value={normalized.spacingMm} minimum={3} maximum={30} step={0.5} onChange={(value) => update("spacingMm", value)} />
              <NumberField id="templatePageCount" label="PDF page count" value={normalized.pageCount} minimum={1} maximum={20} step={1} onChange={(value) => update("pageCount", value)} />
              <SelectField id="templatePngDpi" label="PNG resolution" value={String(pngDpi)} onChange={(value) => setPngDpi(Number(value))} options={[["150", "150 DPI — screen / draft"], ["300", "300 DPI — print quality"]]} />
            </div>

            {preset.practice ? (
              <fieldset className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <legend className="px-1 font-semibold text-slate-950">Practice sheet</legend>
                <label className="input-label mt-2" htmlFor="practiceText">Short practice text</label>
                <input id="practiceText" className="text-input" maxLength={120} value={normalized.practiceText} onChange={(event) => update("practiceText", event.target.value)} placeholder="Letters, a name, words, or a short sentence" />
                <p className="mt-2 text-xs text-slate-600">{normalized.practiceText.length}/120 characters. Text stays in this browser.</p>
                <div className="mt-4 grid grid-cols-3 gap-2" role="group" aria-label="Practice mode">
                  {(["blank", "trace", "copy"] as PracticeMode[]).map((mode) => (
                    <button key={mode} type="button" aria-pressed={normalized.practiceMode === mode} onClick={() => setPracticeMode(mode)} className={`min-h-11 rounded-xl border px-3 py-2 text-sm font-semibold capitalize ${normalized.practiceMode === mode ? "border-brand-green bg-white text-slate-950" : "border-emerald-200 text-slate-600"}`}>{mode}</button>
                  ))}
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">Blank prints guided rows. Trace repeats a light model with blank rows following. Copy shows the model once with practice rows below.</p>
              </fieldset>
            ) : null}

            <fieldset className="mt-6 rounded-2xl border border-slate-200 p-4">
              <legend className="px-1 font-semibold text-slate-950">Optional page details</legend>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                <CheckField id="templateLeftGuide" checked={normalized.leftGuide} onChange={(value) => update("leftGuide", value)} label="Left margin guide" />
                <CheckField id="templateHeader" checked={normalized.headerEnabled} onChange={(value) => update("headerEnabled", value)} label="Name / subject / date header" />
              </div>
              {normalized.headerEnabled ? (
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {(["name", "subject", "date"] as const).map((field) => (
                    <label key={field} className="text-sm font-semibold capitalize text-slate-700">{field}<input className="text-input mt-2" maxLength={field === "subject" ? 80 : 60} value={normalized.header[field]} onChange={(event) => setConfig((current) => ({ ...current, header: { ...current.header, [field]: event.target.value } }))} /></label>
                  ))}
                </div>
              ) : null}
            </fieldset>

            <details className="mt-6 rounded-2xl border border-slate-200 p-4">
              <summary className="cursor-pointer font-semibold text-slate-950">Advanced margins and line weight</summary>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                {(["top", "right", "bottom", "left"] as const).map((margin) => <NumberField key={margin} id={`templateMargin${margin}`} label={`${margin} margin (mm)`} value={normalized.margins[margin]} minimum={5} maximum={50} step={1} onChange={(value) => updateMargin(margin, value)} />)}
                <NumberField id="templateThickness" label="Line / dot thickness (mm)" value={normalized.lineThicknessMm} minimum={0.1} maximum={1} step={0.05} onChange={(value) => update("lineThicknessMm", value)} />
              </div>
            </details>

            <div className="mt-7 flex flex-wrap gap-3">
              <button type="button" onClick={() => void downloadPdf()} className="min-h-11 rounded-full bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Download PDF</button>
              <button type="button" onClick={() => void downloadPng()} className="min-h-11 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">Download PNG</button>
              <button type="button" onClick={() => void downloadSvg()} className="min-h-11 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Download SVG</button>
              <button type="button" onClick={() => window.print()} className="min-h-11 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Print preview page</button>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600" role="status" aria-live="polite">{status} PDF is recommended when exact print sizing matters.</p>
          </div>

          <div className="lg:sticky lg:top-24">
            <div className="rounded-3xl border border-slate-200 bg-slate-200/60 p-4 shadow-card sm:p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xl font-semibold text-slate-950">Live preview</h3>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">{dimensions.width} × {dimensions.height} mm · {normalized.pageCount} page{normalized.pageCount === 1 ? "" : "s"}</span>
              </div>
              <PaperSvg model={model} className="mx-auto h-auto max-h-[720px] w-full rounded-md bg-white shadow-paper" ariaLabel={`${preset.name} preview`} />
              <p className="mt-4 text-sm leading-6 text-slate-600">Preview renders one representative page even when the PDF contains multiple pages.</p>
            </div>
          </div>
        </div>

        <div className="printable-print-pages" aria-hidden="true">
          <PaperSvg model={model} className="template-print-sheet" />
        </div>
        <style>{`.printable-print-pages { display: none; } @media print { @page { size: ${model.widthMm}mm ${model.heightMm}mm; margin: 0; } body * { visibility: hidden !important; } .printable-print-pages, .printable-print-pages * { visibility: visible !important; } .printable-print-pages { display: block !important; position: absolute; inset: 0; } .template-print-sheet { display: block; width: ${model.widthMm}mm; height: ${model.heightMm}mm; break-after: page; } }`}</style>
      </div>
    </section>
  );
}

function SelectField({ id, label, value, options, onChange }: { id: string; label: string; value: string; options: string[][]; onChange: (value: string) => void }) {
  return <label className="text-sm font-semibold text-slate-700" htmlFor={id}>{label}<select id={id} className="select-input mt-2" value={value} onChange={(event) => onChange(event.target.value)}>{options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}</select></label>;
}

function NumberField({ id, label, value, minimum, maximum, step, onChange }: { id: string; label: string; value: number; minimum: number; maximum: number; step: number; onChange: (value: number) => void }) {
  return <label className="text-sm font-semibold text-slate-700" htmlFor={id}>{label}<input id={id} className="text-input mt-2" type="number" value={value} min={minimum} max={maximum} step={step} onChange={(event) => onChange(Number(event.target.value))} /></label>;
}

function CheckField({ id, checked, onChange, label }: { id: string; checked: boolean; onChange: (value: boolean) => void; label: string }) {
  return <label htmlFor={id} className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700"><input id={id} type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue" />{label}</label>;
}
