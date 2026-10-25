"use client";

import type { MouseEvent } from "react";

function isUnmodifiedPrimaryClick(event: MouseEvent<HTMLAnchorElement>) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

export function StartConvertingButton() {
  const startConverting = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isUnmodifiedPrimaryClick(event)) return;
    const tool = document.getElementById("tool");
    const editor = document.getElementById("handwriting-text");
    if (!tool) return;
    event.preventDefault();

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let hasFocused = false;
    let fallbackId: number | undefined;
    const focusEditor = () => {
      if (hasFocused) return;
      hasFocused = true;
      if (fallbackId !== undefined) window.clearTimeout(fallbackId);
      window.removeEventListener("scrollend", focusEditor);
      editor?.focus({ preventScroll: true });
    };

    if (!reduceMotion && "onscrollend" in window) {
      window.addEventListener("scrollend", focusEditor, { once: true });
    }
    tool.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    if (reduceMotion) {
      window.requestAnimationFrame(focusEditor);
    } else {
      fallbackId = window.setTimeout(focusEditor, 1_200);
    }
  };

  return (
    <a href="#tool" onClick={startConverting} className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white shadow-paper transition hover:bg-blue-700">
      Start Converting
    </a>
  );
}
