import assert from "node:assert/strict";
import { trackEvent, trackPreviewError, trackPreviewRendered, trackToolView } from "../lib/analytics.ts";

const dataLayer = [];
globalThis.window = { dataLayer };

assert.equal(trackToolView("default"), true);
assert.equal(trackToolView("default"), false, "Strict Mode-style remount should not duplicate tool_view");
assert.equal(trackPreviewRendered("default", "1"), true);
assert.equal(trackPreviewRendered("default", "1"), false);
assert.equal(trackPreviewRendered("default", "2-5"), true);
assert.equal(trackPreviewRendered("default", "1"), false, "Returning to a recorded band must not emit again");
assert.equal(trackPreviewError("default", "render_failed", 1_000), true);
assert.equal(trackPreviewError("default", "render_failed", 2_000), false);
assert.equal(trackPreviewError("default", "render_failed", 31_000), true);

assert.equal(dataLayer.filter((entry) => entry[1] === "tool_view").length, 1);
assert.equal(dataLayer.filter((entry) => entry[1] === "preview_rendered").length, 2);
assert.equal(dataLayer.filter((entry) => entry[1] === "preview_error").length, 2);

globalThis.window = { dataLayer: { push() { throw new Error("blocked"); } } };
assert.doesNotThrow(() => trackEvent("editor_focus", { tool_profile: "default" }));
globalThis.window = { gtag() { throw new Error("blocked"); } };
assert.doesNotThrow(() => trackEvent("editor_focus", { tool_profile: "default" }));

console.log("Analytics behavior checks passed.");
