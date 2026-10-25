"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "hw-cookie-consent";

function pushConsent(granted: boolean) {
  const win = window as unknown as {
    dataLayer?: unknown[];
  };
  win.dataLayer = win.dataLayer || [];
  const state = granted ? "granted" : "denied";
  (win.dataLayer as unknown[]).push([
    "consent",
    "update",
    {
      ad_storage: state,
      analytics_storage: state,
      ad_user_data: state,
      ad_personalization: state,
    },
  ]);
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      stored = null;
    }
    const revealTimer = !stored ? window.setTimeout(() => setVisible(true), 0) : null;
    const show = () => setVisible(true);
    window.addEventListener("hw:show-cookie-banner", show);
    return () => { if (revealTimer !== null) window.clearTimeout(revealTimer); window.removeEventListener("hw:show-cookie-banner", show); };
  }, []);

  const choose = useCallback((granted: boolean) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, granted ? "accepted" : "declined");
    } catch {
      // storage unavailable; still apply for this session
    }
    pushConsent(granted);
    setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
        <p className="text-sm font-semibold text-slate-900">We value your privacy</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          We use cookies to measure site usage with Google Analytics. The handwriting converter works
          exactly the same whether you accept or decline. You can change your choice anytime from
          &ldquo;Cookie Settings&rdquo; in the footer. Read our{" "}
          <Link href="/privacy-policy" className="font-medium text-brand-blue underline">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => choose(true)}
            className="rounded-full bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={() => choose(false)}
            className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
