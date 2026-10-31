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

test("home menu offers Pre-K and an age field", () => {
  assert.match(html, /<option value="PreK">Pre-K<\/option>/);
  assert.match(html, /id="age"/);
});

test("add child lives in a hamburger menu dialog with an avatar picker", () => {
  assert.match(html, /id="menu-button"[^>]*aria-label="Menu"/);
  assert.match(html, />Add child</);
  assert.match(html, /<dialog[^>]*id="add-dialog"/);
  const dialog = html.slice(html.indexOf("<dialog"), html.indexOf("</dialog>"));
  for (const id of ["name", "age", "grade", "avatar-grid"]) assert.match(dialog, new RegExp(`id="${id}"`));
});

test("bundles cartoon animal avatars as inline SVG", async () => {
  const { avatarSvg, avatarLabel } = await import("./dist/avatars.js");
  const { AVATARS } = await import("./dist/profile.js");
  for (const id of AVATARS) {
    assert.match(avatarSvg(id), /^<svg[^>]*viewBox/);
    assert.notEqual(avatarLabel(id), "Animal");
  }
  assert.equal(avatarLabel("cat"), "Cat");
  assert.equal(avatarLabel("bunny"), "Bunny");
  assert.equal(avatarLabel("monkey"), "Monkey");
});
