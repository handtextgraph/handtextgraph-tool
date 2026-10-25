"use client";

import { useEffect, useRef, useState } from "react";
import type { RenderSettings } from "@/lib/handwriting";
import type { ToolProfile } from "@/lib/tool-profiles";

const schemaVersion = 1;
const storagePrefix = "handwritingtool:draft:v1";
const saveDelayMs = 600;

export type HandwritingDraft = {
  text: string;
  settings: RenderSettings;
  fileName: string;
  noteTitle: string;
  noteSubject: string;
  noteDate: string;
};

type StoredDraft = HandwritingDraft & { version: typeof schemaVersion };

function isRenderSettings(value: unknown): value is RenderSettings {
  if (!value || typeof value !== "object") return false;
  const settings = value as Partial<RenderSettings>;
  return (
    typeof settings.styleId === "string" &&
    ["lined", "blank", "graph", "custom"].includes(settings.pageType ?? "") &&
    typeof settings.fontSize === "number" &&
    typeof settings.lineSpacing === "number" &&
    typeof settings.wordSpacing === "number" &&
    ["blue", "black", "darkGray"].includes(settings.inkColor ?? "") &&
    typeof settings.randomness === "number" &&
    typeof settings.leftMargin === "number" &&
    typeof settings.rightMargin === "number" &&
    typeof settings.topMargin === "number" &&
    typeof settings.bottomMargin === "number" &&
    typeof settings.paragraphIndentMode === "boolean" &&
    ["a4", "letter"].includes(settings.pageSize ?? "") &&
    ["low", "medium", "high"].includes(settings.pdfQuality ?? "") &&
    typeof settings.paperBrightness === "number" &&
    typeof settings.showMarginLine === "boolean" &&
    typeof settings.pageTilt === "number"
  );
}

function isStoredDraft(value: unknown): value is StoredDraft {
  if (!value || typeof value !== "object") return false;
  const draft = value as Partial<StoredDraft>;
  return (
    draft.version === schemaVersion &&
    typeof draft.text === "string" &&
    typeof draft.fileName === "string" &&
    typeof draft.noteTitle === "string" &&
    typeof draft.noteSubject === "string" &&
    typeof draft.noteDate === "string" &&
    isRenderSettings(draft.settings)
  );
}

export function useHandwritingDraft(
  profile: ToolProfile,
  draft: HandwritingDraft,
  restoreDraft: (draft: HandwritingDraft) => void,
) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const restoreDraftRef = useRef(restoreDraft);
  const skipNextWriteRef = useRef(false);
  const storageKey = `${storagePrefix}:${profile}`;

  useEffect(() => {
    restoreDraftRef.current = restoreDraft;
  }, [restoreDraft]);

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(storageKey);
      if (storedValue) {
        const parsed: unknown = JSON.parse(storedValue);
        if (isStoredDraft(parsed)) restoreDraftRef.current(parsed);
      }
    } catch {
      // Storage can be unavailable or contain corrupt data. The converter should still work.
    } finally {
      setIsHydrated(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!isHydrated) return;
    if (skipNextWriteRef.current) {
      skipNextWriteRef.current = false;
      return;
    }

    setIsSaved(false);
    const timeoutId = window.setTimeout(() => {
      try {
        const storedDraft: StoredDraft = { version: schemaVersion, ...draft };
        window.localStorage.setItem(storageKey, JSON.stringify(storedDraft));
        setIsSaved(true);
      } catch {
        // Quota and security errors should not interrupt editing or rendering.
      }
    }, saveDelayMs);

    return () => window.clearTimeout(timeoutId);
  }, [draft, isHydrated, storageKey]);

  const clearDraft = () => {
    skipNextWriteRef.current = true;
    setIsSaved(false);
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // Ignore unavailable storage.
    }
  };

  return { clearDraft, isHydrated, isSaved, storageKey };
}
