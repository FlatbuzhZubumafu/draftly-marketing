import { test } from "node:test";
import assert from "node:assert/strict";
import { splitAtMiddleH2 } from "../../sanitize.ts";

const p = (n: number) => `<p>${"word ".repeat(n)}</p>`;

test("splits before the top-level H2 nearest the middle", () => {
  const html = `${p(50)}<h2>One</h2>${p(50)}<h2>Two</h2>${p(50)}<h2>Three</h2>${p(50)}`;
  const halves = splitAtMiddleH2(html);
  assert.ok(halves);
  assert.equal(halves[0] + halves[1], html);
  assert.ok(halves[1].startsWith("<h2>Two</h2>"));
});

test("no split for short posts with fewer than three H2s", () => {
  assert.equal(splitAtMiddleH2(`${p(10)}<h2>A</h2>${p(10)}<h2>B</h2>${p(10)}`), null);
});

test("never splits inside a wrapper element", () => {
  const html = `<div>${p(50)}<h2>One</h2>${p(50)}<h2>Two</h2>${p(50)}<h2>Three</h2>${p(50)}</div>`;
  assert.equal(splitAtMiddleH2(html), null);
});
