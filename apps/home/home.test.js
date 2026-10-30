import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const html = readFileSync(new URL("./dist/index.html", import.meta.url), "utf8");

test("home menu links to the three games", () => {
  assert.match(html, /href="\/math\/"/);
  assert.match(html, /href="\/reading\/"/);
  assert.match(html, /href="\/adventure\/"/);
  assert.match(html, />Math</);
  assert.match(html, />Reading</);
  assert.match(html, />Adventure</);
});

test("home menu asks who is playing", () => {
  assert.match(html, /Who's playing/);
  assert.match(html, /id="kids"/);
});
