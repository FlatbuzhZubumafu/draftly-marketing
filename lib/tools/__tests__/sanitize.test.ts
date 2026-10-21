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

test("the Salient theme's Love/Share/Pin row is removed, the post around it is kept", () => {
  const html =
    '<p>Full results: <a href="https://www.draftly.blog/best-ai-for-writing">Best AI for writing</a>.</p>' +
    '<div class="sharing-default-minimal post-bottom"><div class="nectar-social default"><div class="nectar-social-inner">' +
    '<a href="#" class="nectar-love" title="Love this"><span class="love-text">Love</span><span class="nectar-love-count">0</span></a>' +
    '<a class="facebook-share nectar-sharing" href="#"><span class="social-text">Share</span></a>' +
    '<a class="pinterest-share nectar-sharing" href="#"><span class="social-text">Pin</span></a></div></div></div>';
  const out = sanitizeHtml(html);
  assert.ok(out.includes("Best AI for writing"));
  for (const gone of ["nectar", "Love", "Share", "Pin"]) assert.ok(!out.includes(gone), `${gone} still in ${out}`);
});

test("scripts and event handlers are still removed", () => {
  const out = sanitizeHtml('<table><tr><td onclick="alert(1)">x</td></tr></table><script>alert(1)</script>');
  assert.ok(!out.includes("onclick"));
  assert.ok(!out.includes("<script"));
});
