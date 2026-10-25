"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type ContactFormProps = {
  action: string;
  supportEmail: string;
  topics: string[];
};

type SubmissionState = "idle" | "submitting" | "success" | "error";

export function ContactForm({ action, supportEmail, topics }: ContactFormProps) {
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const mountedAt = useRef(0);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submissionState === "submitting") return;

    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    if (String(formData.get("website") ?? "").trim()) {
      setSubmissionState("success");
      setStatusMessage("Thanks. Your message has been received.");
      form.reset();
      return;
    }

    if (Date.now() - mountedAt.current < 2500) {
      setSubmissionState("error");
      setStatusMessage("Please wait a moment, review your message, and try again.");
      return;
    }

    setSubmissionState("submitting");
    setStatusMessage("Sending your message…");

    try {
      const response = await fetch(action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Contact service returned ${response.status}`);
      }

      form.reset();
      setSubmissionState("success");
      setStatusMessage("Your message was sent successfully. We will reply as soon as possible.");
    } catch {
      setSubmissionState("error");
      setStatusMessage(
        `We could not send your message right now. Please try again or email ${supportEmail} directly.`,
      );
    }
  };

  const resetForm = () => {
    formRef.current?.reset();
    mountedAt.current = Date.now();
    setSubmissionState("idle");
    setStatusMessage("");
    formRef.current?.querySelector<HTMLInputElement>("#name")?.focus();
  };

  return (
    <form ref={formRef} action={action} method="POST" className="mt-8 grid gap-4" onSubmit={submitForm}>
      <input type="hidden" name="_subject" value="New message from HandTextGraph contact page" />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_captcha" value="true" />

      <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className="input-label" htmlFor="name">Your Name</label>
        <input id="name" name="name" className="input-field" placeholder="Enter your name" autoComplete="name" required />
      </div>

      <div>
        <label className="input-label" htmlFor="email">Email Address</label>
        <input id="email" name="email" className="input-field" placeholder="Enter your email address" type="email" autoComplete="email" required />
      </div>

      <div>
        <label className="input-label" htmlFor="topic">Topic</label>
        <select id="topic" name="topic" className="input-field" defaultValue="General feedback">
          {topics.map((topic) => <option key={topic} value={topic}>{topic}</option>)}
        </select>
      </div>

      <div>
        <label className="input-label" htmlFor="message">Message</label>
        <textarea id="message" name="message" className="input-field min-h-44" placeholder="Write your message here" minLength={10} required />
      </div>

      <p className="text-sm leading-6 text-slate-500">
        By sending this form, you agree that your name, email address, topic, and message will be processed by our
        contact-form provider so we can respond. Do not include passwords, payment details, or other sensitive data.
      </p>

      {statusMessage && (
        <div
          role={submissionState === "error" ? "alert" : "status"}
          aria-live="polite"
          className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${
            submissionState === "error"
              ? "border-rose-200 bg-rose-50 text-rose-800"
              : "border-emerald-200 bg-emerald-50 text-emerald-800"
          }`}
        >
          {statusMessage}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={submissionState === "submitting"}
          className="inline-flex min-h-11 items-center rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
        >
          {submissionState === "submitting" ? "Sending…" : "Send Message"}
        </button>
        {(submissionState === "error" || submissionState === "success") && (
          <button type="button" onClick={resetForm} className="inline-flex min-h-11 items-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            {submissionState === "error" ? "Reset and Try Again" : "Send Another Message"}
          </button>
        )}
      </div>
    </form>
  );
}
