import assert from "node:assert/strict";
import { runTrackedActivation } from "../lib/tracked-interaction.ts";

let tracked = 0;
const prevented = { defaultPrevented: false, ctrlKey: false };
runTrackedActivation(prevented, (event) => { event.defaultPrevented = true; }, () => { tracked += 1; });
assert.equal(tracked, 0, "A consumer-prevented activation must not be tracked");

const modified = { defaultPrevented: false, ctrlKey: true, metaKey: false, button: 0 };
runTrackedActivation(modified, undefined, () => { tracked += 1; });
assert.equal(tracked, 1);
assert.equal(modified.defaultPrevented, false, "Tracking must not interfere with modifier-key navigation");
assert.equal(modified.ctrlKey, true);

console.log("Tracked interaction behavior checks passed.");
