"use client";
import { FormEvent, useEffect, useRef, useState } from "react";

export function ContributionForm({ action, supportEmail }: { action: string; supportEmail: string }) {
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const mountedAt = useRef(0);
  useEffect(() => { mountedAt.current = Date.now(); }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (state === "submitting") return;
    const form = event.currentTarget; if (!form.reportValidity()) return;
    const data = new FormData(form);
    if (String(data.get("website_confirm") ?? "").trim()) { setState("success"); setMessage("Thank you. Your submission has been received."); form.reset(); return; }
    if (Date.now() - mountedAt.current < 2500) { setState("error"); setMessage("Please wait a moment, review your pitch, and try again."); return; }
    setState("submitting"); setMessage("Sending your idea…");
    try { const response = await fetch(action, { method: "POST", body: data, headers: { Accept: "application/json" } }); if (!response.ok) throw new Error(); form.reset(); setState("success"); setMessage("Your idea was sent successfully. We will review it as soon as possible."); }
    catch { setState("error"); setMessage(`We could not send your idea right now. Please try again or email ${supportEmail} directly.`); }
  }
  const fields = "input-field";
  return <form ref={formRef} action={action} method="POST" className="mt-8 grid gap-5" onSubmit={submit}>
    <input type="hidden" name="_subject" value="New Write for Us submission"/><input type="hidden" name="_template" value="table"/><input type="hidden" name="_captcha" value="true"/>
    <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true"><label htmlFor="website-confirm">Leave empty</label><input id="website-confirm" name="website_confirm" tabIndex={-1}/></div>
    <div className="grid gap-5 sm:grid-cols-2"><div><label className="input-label" htmlFor="contributor-name">Full Name</label><input className={fields} id="contributor-name" name="name" autoComplete="name" required/></div><div><label className="input-label" htmlFor="contributor-email">Email Address</label><input className={fields} id="contributor-email" name="email" type="email" autoComplete="email" required/></div></div>
    <div><label className="input-label" htmlFor="company">Company or Website</label><input className={fields} id="company" name="company_or_website" autoComplete="organization"/></div>
    <div><label className="input-label" htmlFor="contribution-type">Contribution Type</label><select className={fields} id="contribution-type" name="contribution_type" required><option>Editorial Contribution</option><option>Sponsored Content</option><option>Brand Partnership</option></select></div>
    <div><label className="input-label" htmlFor="article-title">Proposed Article Title</label><input className={fields} id="article-title" name="proposed_article_title" minLength={5} required/></div>
    <div><label className="input-label" htmlFor="pitch">Short Pitch or Outline</label><textarea className={`${fields} min-h-40`} id="pitch" name="pitch_or_outline" minLength={30} aria-describedby="pitch-help" required/><p id="pitch-help" className="mt-2 text-sm text-slate-500">Explain the article, its practical value and intended reader.</p></div>
    <div><label className="input-label" htmlFor="target-url">Target URL <span className="font-normal text-slate-500">(optional)</span></label><input className={fields} id="target-url" name="target_url" type="url" placeholder="https://example.com/relevant-page"/></div>
    <div><label className="input-label" htmlFor="requirements">Additional Requirements <span className="font-normal text-slate-500">(optional)</span></label><textarea className={`${fields} min-h-28`} id="requirements" name="additional_requirements"/></div>
    <p className="text-sm leading-6 text-slate-500">By submitting, you agree these details will be processed by our contact-form provider so we can review and respond. Do not include sensitive data.</p>
    {message && <div role={state === "error" ? "alert" : "status"} aria-live="polite" className={`rounded-2xl border px-4 py-3 text-sm ${state === "error" ? "border-rose-200 bg-rose-50 text-rose-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>{message}</div>}
    <div className="flex gap-3"><button type="submit" disabled={state === "submitting"} className="min-h-11 rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">{state === "submitting" ? "Sending…" : "Submit Your Idea"}</button>{(state === "error" || state === "success") && <button type="button" onClick={() => { formRef.current?.reset(); mountedAt.current=Date.now(); setState("idle"); setMessage(""); }} className="min-h-11 rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold">Reset Form</button>}</div>
  </form>;
}
