"use client";

import { useEffect, useMemo, useState } from "react";
import { PaperSvg } from "@/components/paper/PaperSvg";
import { buildGeneratorPageModel, type GeneratorDocumentSpec, type GeneratorOrientation, type GeneratorPaperSize } from "@/lib/paper-generator-engine";
import { MM_PER_INCH } from "@/lib/paper-engine";
import { getPaperGenerator, type GeneratorValues, type PaperGeneratorSlug } from "@/lib/paper-generators";
import { getLibraryTemplate } from "@/lib/template-library";

type Unit = "mm" | "in";
const sizes: Array<[GeneratorPaperSize, string]> = [["a4","A4 — 210 × 297 mm"],["letter","Letter — 8.5 × 11 in"],["a5","A5 — 148 × 210 mm"],["a3","A3 — 297 × 420 mm"],["legal","US Legal — 8.5 × 14 in"]];

export function PaperGeneratorStudio({ slug }: { slug: PaperGeneratorSlug }) {
  const definition = getPaperGenerator(slug)!;
  const [values,setValues]=useState<GeneratorValues>({...definition.defaults});
  const [size,setSize]=useState<GeneratorPaperSize>("a4"),[orientation,setOrientation]=useState<GeneratorOrientation>("portrait"),[unit,setUnit]=useState<Unit>("mm");
  const [margin,setMargin]=useState(12),[background,setBackground]=useState("#ffffff"),[dpi,setDpi]=useState(150),[pageCount,setPageCount]=useState(1);
  const [status,setStatus]=useState("Adjust the settings and review the live preview before downloading.");
  // Library query state is applied only after hydration so the server and first client render remain identical.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(()=>{const presetId=new URLSearchParams(window.location.search).get("preset");if(!presetId)return;const preset=getLibraryTemplate(presetId);if(!preset||preset.generator!==slug)return;setValues({...preset.values});setSize(preset.size);setOrientation(preset.orientation);setMargin(preset.marginMm);setBackground(preset.background);setStatus(`Loaded library preset: ${preset.name}.`);},[slug]);
  const spec = useMemo<GeneratorDocumentSpec>(()=>({size,orientation,marginsMm:{top:margin,right:margin,bottom:margin,left:margin},background,pattern:definition.build(values)}),[background,definition,margin,orientation,size,values]);
  const result=useMemo(()=>{try{return{model:buildGeneratorPageModel(spec),error:""}}catch(error){return{model:null,error:error instanceof Error?error.message:"Unable to create this pattern."}}},[spec]);
  const filename=`${definition.slug}-${size}${orientation==="landscape"?"-landscape":""}`;
  const setValue=<K extends keyof GeneratorValues>(key:K,value:GeneratorValues[K])=>setValues(current=>({...current,[key]:value}));
  const reset=()=>{setValues({...definition.defaults});setSize("a4");setOrientation("portrait");setUnit("mm");setMargin(12);setBackground("#ffffff");setDpi(150);setPageCount(1);setStatus("Defaults restored.")};
  const downloadPdf=async()=>{if(!result.model)return;setStatus("Preparing vector PDF…");try{const{downloadPaperGeneratorPdf}=await import("@/lib/paper-generator-pdf");downloadPaperGeneratorPdf(result.model,orientation,filename,pageCount);setStatus(`${pageCount}-page PDF downloaded.`)}catch{setStatus("PDF creation failed. Reduce detail or page count and try again.")}};
  const downloadPng=async()=>{if(!result.model)return;setStatus(`Preparing ${dpi} DPI PNG…`);try{const{downloadPaperGeneratorPng}=await import("@/lib/paper-generator-png");await downloadPaperGeneratorPng(result.model,dpi,filename);setStatus(`${dpi} DPI PNG downloaded.`)}catch(error){setStatus(error instanceof Error?error.message:"PNG creation failed.")}};
  const downloadSvg=async()=>{if(!result.model)return;setStatus("Preparing vector SVG…");try{const{downloadPaperGeneratorSvg}=await import("@/lib/paper-generator-svg");downloadPaperGeneratorSvg(result.model,filename);setStatus("SVG downloaded.")}catch{setStatus("SVG creation failed. Reduce pattern detail and try again.")}};
  const display=(mm:number)=>unit==="mm"?Number(mm.toFixed(2)):Number((mm/MM_PER_INCH).toFixed(3));
  const fromDisplay=(value:number)=>unit==="mm"?value:value*MM_PER_INCH;
  return <section aria-label={`${definition.name} workspace`} className="rounded-[32px] border border-platform-border bg-platform-ice p-4 shadow-card sm:p-6 lg:p-8">
    <div className="grid items-start gap-6 xl:grid-cols-[390px_minmax(0,1fr)]">
      <div className="rounded-[26px] border border-platform-border bg-white p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-platform-teal">Pattern settings</p><h2 className="mt-2 font-heading text-2xl font-bold text-platform-navy">Customize your paper</h2></div><button type="button" onClick={reset} className="min-h-11 rounded-full border border-slate-300 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50">Reset</button></div>
        <fieldset className="mt-6"><legend className="text-sm font-bold text-slate-800">Presets</legend><div className="mt-2 flex flex-wrap gap-2">{definition.presets.map(preset=><button type="button" key={preset.name} onClick={()=>setValues(current=>({...current,...preset.values}))} className="min-h-10 rounded-full border border-teal-200 bg-teal-50 px-3 text-sm font-semibold text-platform-teal hover:bg-teal-100">{preset.name}</button>)}</div></fieldset>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <Select label="Paper size" value={size} onChange={value=>setSize(value as GeneratorPaperSize)} options={sizes}/><Select label="Orientation" value={orientation} onChange={value=>setOrientation(value as GeneratorOrientation)} options={[["portrait","Portrait"],["landscape","Landscape"]]}/>
          <Select label="Measurement unit" value={unit} onChange={value=>setUnit(value as Unit)} options={[["mm","Millimetres"],["in","Inches"]]}/>
          <NumberInput label={`Margins (${unit})`} value={display(margin)} min={display(5)} max={display(40)} step={unit==="mm"?1:.05} onChange={value=>setMargin(fromDisplay(value))}/>
          {definition.controls.map(control=><NumberInput key={control.key} label={`${control.label}${control.unit==="length"?` (${unit})`:control.unit==="degrees"?" (degrees)":""}`} value={control.unit==="length"?display(values[control.key]):values[control.key]} min={control.unit==="length"?display(control.min):control.min} max={control.unit==="length"?display(control.max):control.max} step={control.unit==="length"?(unit==="mm"?control.step:Math.max(.001,Number((control.step/MM_PER_INCH).toFixed(3)))):control.step} onChange={value=>setValue(control.key,control.unit==="length"?fromDisplay(value):value)}/>) }
          {definition.option?<Select label={definition.option.label} value={values.option} onChange={value=>setValue("option",value)} options={definition.option.values}/>:null}
          {definition.toggle?<label className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-700"><input type="checkbox" checked={values.toggle} onChange={event=>setValue("toggle",event.target.checked)} className="h-4 w-4"/>{definition.toggle}</label>:null}
          <label className="text-sm font-bold text-slate-700">Pattern color<input aria-label="Pattern color" type="color" value={values.patternColor} onChange={event=>setValue("patternColor",event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white p-1"/></label>
          <label className="text-sm font-bold text-slate-700">Accent color<input aria-label="Accent color" type="color" value={values.accentColor} onChange={event=>setValue("accentColor",event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white p-1"/></label>
          <label className="text-sm font-bold text-slate-700">Background color<input aria-label="Background color" type="color" value={background} onChange={event=>setBackground(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white p-1"/></label>
          <Select label="PNG resolution" value={String(dpi)} onChange={value=>setDpi(Number(value))} options={[["150","150 DPI — draft"],["300","300 DPI — print"]]}/><NumberInput label="PDF page count" value={pageCount} min={1} max={20} step={1} onChange={value=>setPageCount(Math.round(value))}/>
        </div>
        {result.error?<p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{result.error}</p>:null}
        <div className="mt-6 grid grid-cols-2 gap-2"><button disabled={!result.model} onClick={()=>void downloadPdf()} className="min-h-11 rounded-full bg-platform-teal px-4 text-sm font-bold text-white disabled:opacity-50">Download PDF</button><button disabled={!result.model} onClick={()=>void downloadPng()} className="min-h-11 rounded-full bg-platform-navy px-4 text-sm font-bold text-white disabled:opacity-50">Download PNG</button><button disabled={!result.model} onClick={()=>void downloadSvg()} className="min-h-11 rounded-full border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 disabled:opacity-50">Download SVG</button><button disabled={!result.model} onClick={()=>window.print()} className="min-h-11 rounded-full border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 disabled:opacity-50">Print</button></div>
        <p role="status" aria-live="polite" className="mt-4 text-sm leading-6 text-slate-600">{status}</p>
      </div>
      <div className="xl:sticky xl:top-24"><div className="rounded-[26px] border border-platform-border bg-slate-200/70 p-3 sm:p-6"><div className="mb-4 flex flex-wrap items-center justify-between gap-2"><h2 className="font-heading text-xl font-bold text-platform-navy">Live preview</h2><span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600">{result.model?`${result.model.widthMm} × ${result.model.heightMm} mm`:"Invalid settings"}</span></div>{result.model?<PaperSvg model={result.model} className="mx-auto h-auto max-h-[78vh] w-full rounded bg-white shadow-paper" ariaLabel={`${definition.name} preview`}/>:<div className="grid min-h-96 place-items-center rounded bg-white p-8 text-center text-slate-500">Adjust the values to create a valid preview.</div>}</div><p className="mt-3 text-sm leading-6 text-slate-600">Measurements are stored in millimetres. Inch inputs are converted at 25.4 mm per inch. Print PDFs at Actual size or 100%.</p></div>
    </div>
    {result.model?<><div className="paper-generator-print" aria-hidden="true"><PaperSvg model={result.model} className="paper-generator-print-sheet"/></div><style>{`.paper-generator-print{display:none}@media print{@page{size:${result.model.widthMm}mm ${result.model.heightMm}mm;margin:0}body *{visibility:hidden!important}.paper-generator-print,.paper-generator-print *{visibility:visible!important}.paper-generator-print{display:block!important;position:absolute;inset:0}.paper-generator-print-sheet{display:block;width:${result.model.widthMm}mm;height:${result.model.heightMm}mm}}`}</style></>:null}
  </section>;
}

function Select({label,value,onChange,options}:{label:string;value:string;onChange:(value:string)=>void;options:readonly (readonly [string,string])[]}){return <label className="text-sm font-bold text-slate-700">{label}<select className="select-input mt-2" value={value} onChange={event=>onChange(event.target.value)}>{options.map(([key,text])=><option key={key} value={key}>{text}</option>)}</select></label>}
function NumberInput({label,value,min,max,step,onChange}:{label:string;value:number;min:number;max:number;step:number;onChange:(value:number)=>void}){return <label className="text-sm font-bold text-slate-700">{label}<input className="text-input mt-2" type="number" value={value} min={min} max={max} step={step} onChange={event=>onChange(Number(event.target.value))}/></label>}
