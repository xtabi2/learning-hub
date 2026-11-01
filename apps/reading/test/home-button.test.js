import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

test("the shared Home button shows a house icon in Reading and Math", () => {
  for (const app of ["reading", "math"]) {
    const html = readFileSync(new URL(`../../${app}/index.html`, import.meta.url), "utf8");
    assert.match(html, /<a class="hub-home"[^>]*>.*🏠.*Home<\/a>/, app);
  }
});
