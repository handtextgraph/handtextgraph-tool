# Privacy-safe GA4 events

HandwritingTool sends only controlled product-interaction categories. It never sends editor text, document contents, filenames, uploaded paper names, PDF contents, contact details, or raw error messages.

| Event | When it fires | Allowed parameters |
| --- | --- | --- |
| `tool_view` | Once when a converter profile mounts | `tool_profile` |
| `editor_focus` | First editor focus per mounted tool | `tool_profile` |
| `preview_rendered` | First successful preview in each page-count band, once per browser session and tool profile | `tool_profile`, `page_count_band` |
| `preview_error` | Preview rendering fails; the same controlled category is limited to once per 30 seconds per tool profile | `tool_profile`, `error_category` |
| `pdf_import_started` | A valid PDF begins extraction | `tool_profile` |
| `pdf_import_completed` | Selectable text extraction succeeds | `tool_profile` |
| `pdf_import_error` | PDF extraction fails | `tool_profile`, `error_category` |
| `export_started` | A PDF, PNG, or JPG export begins | `tool_profile`, `export_format`, `page_count_band` |
| `export_completed` | File generation succeeds and the browser download trigger runs | `tool_profile`, `export_format`, `page_count_band` |
| `export_error` | Export fails | `tool_profile`, `export_format`, `error_category` |
| `related_tool_clicked` | A tracked related-tool link is selected | `link_target` |
| `guide_clicked` | A tracked guide link is selected | `link_target` |
| `template_downloaded` | A template download link is activated | `template_type` |

Allowed values are deliberately categorical. Page counts use `1`, `2-5`, `6-10`, or `11+`. Error categories are implementation-controlled labels such as `render_failed`, `no_selectable_text`, and `pdf_creation_failed`.

`export_completed` does not confirm that a file was written to disk. Browsers do not expose that confirmation. For multi-image exports, the event is sent only after the application generates every requested image and triggers every download without a detectable error; a browser may still block a download without exposing that decision to the page.

GA4 is currently loaded with the existing `afterInteractive` implementation. This repository does not contain a consent manager or a consent state that prohibits analytics before consent. If a consent platform is added, it must gate both the GA4 configuration and these events.
