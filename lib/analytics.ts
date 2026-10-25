import type { ToolProfile } from "@/lib/tool-profiles";

export const analyticsEventNames = [
  "tool_view", "editor_focus", "preview_rendered", "preview_error",
  "pdf_import_started", "pdf_import_completed", "pdf_import_error",
  "docx_upload_started", "docx_extraction_success", "docx_extraction_failed",
  "export_started", "export_completed", "export_error",
  "related_tool_clicked", "guide_clicked", "template_downloaded",
  "template_preset_selected", "template_pdf_download", "template_png_download",
  "practice_sheet_generated",
] as const;

export type AnalyticsEventName = (typeof analyticsEventNames)[number];
export type PageCountBand = "1" | "2-5" | "6-10" | "11+";
export type ExportFormat = "pdf" | "png" | "jpg";
export type ErrorCategory =
  | "render_failed" | "password_protected" | "no_selectable_text" | "read_failed"
  | "image_download_failed" | "pdf_creation_failed" | "legacy_doc" | "invalid_type"
  | "too_large" | "too_complex" | "empty" | "text_limit" | "corrupt" | "cancelled"
  | "invalid_range" | "page_limit";
export type LinkTarget =
  | "gallery-lined" | "gallery-blank" | "gallery-graph" | "gallery-notes"
  | "gallery-worksheet" | "gallery-pdf" | "beginner-guide" | "lined-guide"
  | "graph-guide" | "notes-guide" | "pdf-guide" | "tools-hub" | "pdf-export-guide";
export type TemplateType = "lined-paper-pdf" | "pdf" | "svg";

type EventParameters = {
  tool_view: { tool_profile: ToolProfile };
  editor_focus: { tool_profile: ToolProfile };
  preview_rendered: { tool_profile: ToolProfile; page_count_band: PageCountBand };
  preview_error: { tool_profile: ToolProfile; error_category: ErrorCategory };
  pdf_import_started: { tool_profile: "pdf" };
  pdf_import_completed: { tool_profile: "pdf" };
  pdf_import_error: { tool_profile: "pdf"; error_category: ErrorCategory };
  docx_upload_started: { tool_profile: "word" };
  docx_extraction_success: { tool_profile: "word" };
  docx_extraction_failed: { tool_profile: "word"; error_category: ErrorCategory };
  export_started: { tool_profile: ToolProfile; export_format: ExportFormat; page_count_band: PageCountBand };
  export_completed: { tool_profile: ToolProfile; export_format: ExportFormat; page_count_band: PageCountBand };
  export_error: { tool_profile: ToolProfile; export_format: ExportFormat; error_category: ErrorCategory };
  related_tool_clicked: { link_target: LinkTarget };
  guide_clicked: { link_target: LinkTarget };
  template_downloaded: { template_type: TemplateType };
  template_preset_selected: { preset_id: string };
  template_pdf_download: { preset_id: string; page_size: string; orientation: string; page_count_band: PageCountBand };
  template_png_download: { preset_id: string; page_size: string; orientation: string };
  practice_sheet_generated: { practice_mode: string };
};

const allowedParameters = new Set([
  "tool_profile", "export_format", "page_count_band", "error_category", "link_target", "template_type",
  "preset_id", "page_size", "orientation", "practice_mode",
]);
const sessionEvents = new Set<string>();
const previewErrorTimes = new Map<string, number>();
const previewErrorCooldownMs = 30_000;

export function trackEvent<Name extends AnalyticsEventName>(name: Name, parameters: EventParameters[Name]) {
  if (typeof window === "undefined") return;
  try {
    const safeParameters = Object.fromEntries(
      Object.entries(parameters).filter(
        ([key, value]) => allowedParameters.has(key) && typeof value === "string" && value.length <= 80,
      ),
    );
    if (typeof window.gtag === "function") {
      window.gtag("event", name, safeParameters);
      return;
    }
    window.dataLayer ??= [];
    window.dataLayer.push(["event", name, safeParameters]);
  } catch {
    // Analytics must never interrupt a user action.
  }
}

export function trackToolView(profile: ToolProfile) {
  const key = `tool_view:${profile}`;
  if (sessionEvents.has(key)) return false;
  sessionEvents.add(key);
  trackEvent("tool_view", { tool_profile: profile });
  return true;
}

export function trackPreviewRendered(profile: ToolProfile, pageCountBand: PageCountBand) {
  const key = `preview_rendered:${profile}:${pageCountBand}`;
  if (sessionEvents.has(key)) return false;
  sessionEvents.add(key);
  trackEvent("preview_rendered", { tool_profile: profile, page_count_band: pageCountBand });
  return true;
}

export function trackPreviewError(profile: ToolProfile, category: ErrorCategory, now = Date.now()) {
  const key = `${profile}:${category}`;
  const previous = previewErrorTimes.get(key);
  if (previous !== undefined && now - previous < previewErrorCooldownMs) return false;
  previewErrorTimes.set(key, now);
  trackEvent("preview_error", { tool_profile: profile, error_category: category });
  return true;
}

export function getPageCountBand(pageCount: number): PageCountBand {
  if (pageCount <= 1) return "1";
  if (pageCount <= 5) return "2-5";
  if (pageCount <= 10) return "6-10";
  return "11+";
}

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: (command: "event", name: string, parameters?: Record<string, string>) => void;
  }
}
