"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { downloadDataUrl } from "@/lib/client-export";

type QuestionType = "qa" | "fill" | "matching" | "sentence";
type Question = { id: string; type: QuestionType; prompt: string; answer: string; pairs: string };
type Template = "classic" | "primary" | "minimal";

const field = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-blue-100";
const secondary = "rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300 disabled:opacity-40";
const templates: Record<Template, { accent: string; title: string }> = {
  classic: { accent: "#2563eb", title: "Classic classroom" },
  primary: { accent: "#16a06b", title: "Primary practice" },
  minimal: { accent: "#334155", title: "Minimal ink" },
};
const initialQuestions: Question[] = [
  { id: "q1", type: "qa", prompt: "What is the main idea of today's lesson?", answer: "Students' answers will vary.", pairs: "" },
  { id: "q2", type: "fill", prompt: "Water changes into vapor through __________.", answer: "evaporation", pairs: "" },
  { id: "q3", type: "matching", prompt: "Match each term to its meaning.", answer: "1-B, 2-C, 3-A", pairs: "1. Evaporation | A. Water falling from clouds\n2. Condensation | B. Liquid becoming vapor\n3. Precipitation | C. Vapor forming droplets" },
];

function wrap(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, width: number, line: number) {
  let cursor = y;
  for (const paragraph of text.split("\n")) {
    let current = "";
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const next = current ? `${current} ${word}` : word;
      if (ctx.measureText(next).width > width && current) { ctx.fillText(current, x, cursor); cursor += line; current = word; } else current = next;
    }
    if (current) { ctx.fillText(current, x, cursor); cursor += line; } else cursor += line;
  }
  return cursor;
}

function questionHeight(question: Question) {
  if (question.type === "matching") return 245 + question.pairs.split("\n").length * 30;
  if (question.type === "sentence") return 250;
  return 210;
}

function renderPages(settings: { title: string; description: string; subject: string; grade: string; instructions: string; margin: number; orientation: "portrait" | "landscape"; border: boolean; answerKey: boolean; template: Template }, questions: Question[]) {
  const portrait = settings.orientation === "portrait";
  const width = portrait ? 1240 : 1754, height = portrait ? 1754 : 1240;
  const pages: HTMLCanvasElement[] = [];
  const makePage = (answer = false) => {
    const canvas = document.createElement("canvas"); canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext("2d")!; ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, width, height);
    if (settings.border) { ctx.strokeStyle = templates[settings.template].accent; ctx.lineWidth = settings.template === "primary" ? 8 : 3; ctx.strokeRect(settings.margin / 2, settings.margin / 2, width - settings.margin, height - settings.margin); }
    pages.push(canvas); return { canvas, ctx, y: settings.margin + 10, answer };
  };
  const drawHeader = (page: ReturnType<typeof makePage>) => {
    const { ctx } = page, left = settings.margin, right = width - settings.margin, accent = templates[settings.template].accent;
    ctx.fillStyle = accent; ctx.font = `700 ${settings.template === "primary" ? 52 : 46}px Arial`; ctx.textAlign = "left"; page.y = wrap(ctx, page.answer ? `${settings.title} — Answer Key` : settings.title || "Custom Worksheet", left, page.y + 35, right - left, 58);
    ctx.fillStyle = "#475569"; ctx.font = "24px Arial"; page.y = wrap(ctx, settings.description, left, page.y + 4, right - left, 32);
    ctx.fillStyle = "#0f172a"; ctx.font = "600 22px Arial"; ctx.fillText(`Subject: ${settings.subject || "__________"}    Grade: ${settings.grade || "__________"}`, left, page.y + 15); page.y += 55;
    if (!page.answer) { ctx.font = "22px Arial"; ctx.fillText("Name: ______________________________    Date: ______________", left, page.y); page.y += 48; }
    ctx.fillStyle = "#334155"; ctx.font = "21px Arial"; page.y = wrap(ctx, settings.instructions, left, page.y, right - left, 29) + 18;
    ctx.strokeStyle = accent; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(left, page.y); ctx.lineTo(right, page.y); ctx.stroke(); page.y += 38;
  };
  let page = makePage(); drawHeader(page);
  questions.forEach((question, index) => {
    const needed = questionHeight(question);
    if (page.y + needed > height - settings.margin) { page = makePage(); drawHeader(page); }
    const { ctx } = page, left = settings.margin, right = width - settings.margin;
    ctx.fillStyle = "#0f172a"; ctx.font = "700 24px Arial"; page.y = wrap(ctx, `${index + 1}. ${question.prompt}`, left, page.y, right - left, 33) + 10;
    ctx.font = "21px Arial";
    if (question.type === "matching") {
      ctx.fillStyle = "#334155"; page.y = wrap(ctx, question.pairs || "Add matching pairs in the editor.", left + 28, page.y, right - left - 28, 30) + 12;
    } else if (question.type === "sentence") {
      for (let row = 0; row < 4; row++) { ctx.strokeStyle = "#94a3b8"; ctx.beginPath(); ctx.moveTo(left, page.y + 34); ctx.lineTo(right, page.y + 34); ctx.stroke(); page.y += 42; }
    } else {
      for (let row = 0; row < 3; row++) { ctx.strokeStyle = "#94a3b8"; ctx.beginPath(); ctx.moveTo(left, page.y + 32); ctx.lineTo(right, page.y + 32); ctx.stroke(); page.y += 40; }
    }
    page.y += 18;
  });
  if (settings.answerKey) {
    page = makePage(true); drawHeader(page);
    questions.forEach((question, index) => {
      if (page.y + 120 > height - settings.margin) { page = makePage(true); drawHeader(page); }
      page.ctx.fillStyle = "#0f172a"; page.ctx.font = "700 23px Arial"; page.y = wrap(page.ctx, `${index + 1}. ${question.prompt}`, settings.margin, page.y, width - settings.margin * 2, 31);
      page.ctx.fillStyle = "#334155"; page.ctx.font = "21px Arial"; page.y = wrap(page.ctx, question.answer || "No answer supplied.", settings.margin + 28, page.y + 4, width - settings.margin * 2 - 28, 29) + 20;
    });
  }
  pages.forEach((canvas, index) => { const ctx = canvas.getContext("2d")!; ctx.fillStyle = "#64748b"; ctx.font = "18px Arial"; ctx.textAlign = "center"; ctx.fillText(`Page ${index + 1} of ${pages.length}`, width / 2, height - settings.margin / 2); });
  return pages;
}

export function CustomWorksheetBuilder() {
  const [settings, setSettings] = useState({ title: "Science Review Worksheet", description: "Review the key ideas and explain each answer clearly.", subject: "Science", grade: "Grade 6", instructions: "Read each question carefully. Show your work where needed.", margin: 90, orientation: "portrait" as "portrait" | "landscape", border: true, answerKey: true, template: "classic" as Template });
  const [questions, setQuestions] = useState<Question[]>(initialQuestions); const [pages, setPages] = useState<HTMLCanvasElement[]>([]); const [pageIndex, setPageIndex] = useState(0); const [status, setStatus] = useState(""); const preview = useRef<HTMLCanvasElement>(null);
  const signature = useMemo(() => JSON.stringify({ settings, questions }), [settings, questions]);
  useEffect(() => { const timer = window.setTimeout(() => { const rendered = renderPages(settings, questions); setPages(rendered); setPageIndex(i => Math.min(i, rendered.length - 1)); }, 180); return () => window.clearTimeout(timer); }, [signature, settings, questions]);
  useEffect(() => { const source = pages[pageIndex], target = preview.current; if (!source || !target) return; target.width = source.width; target.height = source.height; target.getContext("2d")!.drawImage(source, 0, 0); }, [pages, pageIndex]);
  const patch = <K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) => setSettings(current => ({ ...current, [key]: value }));
  const updateQuestion = (id: string, change: Partial<Question>) => setQuestions(current => current.map(q => q.id === id ? { ...q, ...change } : q));
  const move = (index: number, offset: number) => setQuestions(current => { const next = [...current], target = index + offset; if (target < 0 || target >= next.length) return current; [next[index], next[target]] = [next[target], next[index]]; return next; });
  const add = (type: QuestionType = "qa") => setQuestions(current => [...current, { id: crypto.randomUUID(), type, prompt: type === "fill" ? "Complete the sentence: __________" : type === "matching" ? "Match each item." : type === "sentence" ? "Write three sentences about the topic." : "Enter your question.", answer: "", pairs: "" }]);
  const reset = () => { setQuestions(initialQuestions); setSettings({ title: "Science Review Worksheet", description: "Review the key ideas and explain each answer clearly.", subject: "Science", grade: "Grade 6", instructions: "Read each question carefully. Show your work where needed.", margin: 90, orientation: "portrait", border: true, answerKey: true, template: "classic" }); setStatus("Custom worksheet reset."); };
  const exportPdf = async () => { const { jsPDF } = await import("jspdf"); const landscape = settings.orientation === "landscape"; const pdf = new jsPDF({ orientation: landscape ? "landscape" : "portrait", unit: "mm", format: "a4", compress: true }); const w = landscape ? 297 : 210, h = landscape ? 210 : 297; pages.forEach((canvas, i) => { if (i) pdf.addPage("a4", landscape ? "landscape" : "portrait"); pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, w, h, undefined, "FAST"); }); pdf.save("custom-worksheet.pdf"); setStatus("PDF downloaded."); };
  const print = () => { const popup = window.open("", "_blank", "noopener,noreferrer"); if (!popup) return setStatus("Allow pop-ups to print."); popup.document.write(`<style>@page{margin:0}body{margin:0}img{display:block;width:100%;page-break-after:always}</style>${pages.map(page => `<img src="${page.toDataURL("image/png")}">`).join("")}`); popup.document.close(); window.setTimeout(() => popup.print(), 250); };
  return <section className="mt-10" aria-labelledby="custom-builder-heading"><div className="mb-6"><p className="text-sm font-semibold uppercase tracking-[.2em] text-brand-blue">Advanced builder</p><h2 id="custom-builder-heading" className="mt-2 text-3xl font-semibold text-slate-950">Custom academic worksheet builder</h2><p className="mt-2 text-slate-600">Build question-and-answer, fill-in-the-blank, matching, and sentence-writing worksheets while keeping the tracing builder above.</p></div><div className="grid gap-6 lg:grid-cols-[430px,1fr]"><div className="space-y-5"><div className="rounded-[28px] border bg-white p-5 shadow-card"><div className="grid gap-3 sm:grid-cols-2">{(["title","description","subject","grade","instructions"] as const).map(key => <label key={key} className={key === "description" || key === "instructions" ? "sm:col-span-2 text-sm font-semibold" : "text-sm font-semibold"}>{key[0].toUpperCase()+key.slice(1)}{key === "description" || key === "instructions" ? <textarea className={`${field} mt-2`} rows={2} value={settings[key]} onChange={e=>patch(key,e.target.value)}/>:<input className={`${field} mt-2`} value={settings[key]} onChange={e=>patch(key,e.target.value)}/>}</label>)}</div><div className="mt-4 grid grid-cols-2 gap-3"><label className="text-sm font-semibold">Template<select className={`${field} mt-2`} value={settings.template} onChange={e=>patch("template",e.target.value as Template)}>{Object.entries(templates).map(([id,t])=><option key={id} value={id}>{t.title}</option>)}</select></label><label className="text-sm font-semibold">Orientation<select className={`${field} mt-2`} value={settings.orientation} onChange={e=>patch("orientation",e.target.value as "portrait"|"landscape")}><option value="portrait">Portrait</option><option value="landscape">Landscape</option></select></label><label className="text-sm font-semibold">Margins ({settings.margin}px)<input className="mt-4 w-full accent-blue-600" type="range" min="55" max="150" value={settings.margin} onChange={e=>patch("margin",+e.target.value)}/></label><div className="space-y-2 text-sm font-semibold"><label className="flex gap-2"><input type="checkbox" checked={settings.border} onChange={e=>patch("border",e.target.checked)}/> Printable border</label><label className="flex gap-2"><input type="checkbox" checked={settings.answerKey} onChange={e=>patch("answerKey",e.target.checked)}/> Answer key</label></div></div></div><div className="rounded-[28px] border bg-white p-5 shadow-card"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-lg font-semibold">Questions</h3><select aria-label="Question type to add" className={field} onChange={e=>{add(e.target.value as QuestionType);e.target.value=""}} defaultValue=""><option value="" disabled>Add question…</option><option value="qa">Question & answer</option><option value="fill">Fill in the blank</option><option value="matching">Matching</option><option value="sentence">Sentence writing</option></select></div><div className="mt-4 space-y-4">{questions.map((q,index)=><article key={q.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-center justify-between gap-2"><select aria-label={`Question ${index+1} type`} className={field} value={q.type} onChange={e=>updateQuestion(q.id,{type:e.target.value as QuestionType})}><option value="qa">Q & A</option><option value="fill">Fill blank</option><option value="matching">Matching</option><option value="sentence">Sentence writing</option></select><div className="flex"><button className={secondary} aria-label="Move question up" disabled={!index} onClick={()=>move(index,-1)}>↑</button><button className={secondary} aria-label="Move question down" disabled={index===questions.length-1} onClick={()=>move(index,1)}>↓</button></div></div><textarea aria-label={`Question ${index+1}`} className={`${field} mt-3`} rows={2} value={q.prompt} onChange={e=>updateQuestion(q.id,{prompt:e.target.value})}/>{q.type === "matching" && <textarea aria-label="Matching pairs" className={`${field} mt-3`} rows={4} value={q.pairs} onChange={e=>updateQuestion(q.id,{pairs:e.target.value})} placeholder="1. Item | A. Match"/>}<input aria-label={`Answer ${index+1}`} className={`${field} mt-3`} value={q.answer} onChange={e=>updateQuestion(q.id,{answer:e.target.value})} placeholder="Answer key response"/><div className="mt-3 flex gap-2"><button className={secondary} onClick={()=>setQuestions(current=>{const copy={...q,id:crypto.randomUUID()};return [...current.slice(0,index+1),copy,...current.slice(index+1)]})}>Duplicate</button><button className={secondary} onClick={()=>setQuestions(current=>current.filter(item=>item.id!==q.id))}>Delete</button></div></article>)}</div></div></div><div className="lg:sticky lg:top-24 lg:self-start"><div className="rounded-[28px] border bg-white p-5 shadow-card"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-lg font-semibold">Live printable preview</h3><p className="text-sm text-slate-500">{pages.length} page{pages.length===1?"":"s"}, including answer key</p></div><div className="flex items-center gap-2"><button className={secondary} disabled={!pageIndex} onClick={()=>setPageIndex(i=>i-1)}>←</button><span className="text-sm font-semibold">{pageIndex+1}/{pages.length}</span><button className={secondary} disabled={pageIndex>=pages.length-1} onClick={()=>setPageIndex(i=>i+1)}>→</button></div></div><canvas ref={preview} className="mt-4 h-auto w-full rounded-xl border bg-white"/><div className="mt-4 flex flex-wrap gap-2"><button className="rounded-full bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white" onClick={exportPdf}>Download PDF</button><button className={secondary} onClick={print}>Print</button><button className={secondary} onClick={()=>{const page=pages[pageIndex];if(page)downloadDataUrl(page.toDataURL("image/png"),`worksheet-page-${pageIndex+1}.png`)}}>Download PNG</button><button className={secondary} onClick={reset}>Reset</button></div>{status&&<p role="status" className="mt-3 text-sm text-slate-600">{status}</p>}</div></div></div></section>;
}
