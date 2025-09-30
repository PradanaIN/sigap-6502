import test from "node:test";
import assert from "node:assert/strict";

import { classifyLog } from "../classifyLog.js";

test("recognises [System] entries", () => {
  assert.equal(classifyLog("[System] Server started"), "system");
});

test("recognises [Sistem] entries", () => {
  assert.equal(classifyLog("[Sistem] Pemrosesan selesai"), "system");
});
