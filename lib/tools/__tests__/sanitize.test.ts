import { test } from "node:test";
import assert from "node:assert/strict";
import { sanitizeHtml } from "../../sanitize.ts";

test("tables from WordPress survive sanitizing (legal pages, post comparison tables)", () => {
  const html =
    '<figure class="wp-block-table"><table class="has-fixed-layout"><thead><tr><th scope="col">Model</th><th>Score</th></tr></thead>' +
    '<tbody><tr><td colspan="2">Claude Haiku 5.5</td></tr></tbody></table></figure>';
  const out = sanitizeHtml(html);
  for (const tag of ["<table", "<thead>", "<tbody>", "<tr>", "<th scope=\"col\">", "<td colspan=\"2\">"]) {
    assert.ok(out.includes(tag), `${tag} missing from ${out}`);
  }
});

test("scripts and event handlers are still removed", () => {
  const out = sanitizeHtml('<table><tr><td onclick="alert(1)">x</td></tr></table><script>alert(1)</script>');
  assert.ok(!out.includes("onclick"));
  assert.ok(!out.includes("<script"));
});
