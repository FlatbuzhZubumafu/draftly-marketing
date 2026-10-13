import { test } from "node:test";
import assert from "node:assert/strict";
import { checkUrl, isBlockedIp, safeLookup, ToolError } from "../ssrf.ts";
import { Scan } from "../fetcher.ts";

test("blocks private, loopback, link-local and metadata IPv4", () => {
  for (const ip of ["127.0.0.1", "127.1.2.3", "10.0.0.1", "172.16.0.1", "172.31.255.255", "192.168.1.1", "169.254.169.254", "0.0.0.0", "100.64.0.1", "224.0.0.1", "255.255.255.255", "198.18.0.1"]) {
    assert.equal(isBlockedIp(ip), true, ip);
  }
});

test("allows public IPv4", () => {
  for (const ip of ["8.8.8.8", "1.1.1.1", "172.32.0.1", "76.76.21.21", "151.101.1.1"]) assert.equal(isBlockedIp(ip), false, ip);
});

test("blocks loopback, unique-local, link-local, mapped and other special IPv6", () => {
  for (const ip of ["::1", "::", "fc00::1", "fd12:3456::1", "fe80::1", "febf::1", "ff02::1", "::ffff:127.0.0.1", "::ffff:7f00:1", "::ffff:169.254.169.254", "::ffff:a9fe:a9fe", "64:ff9b::a9fe:a9fe", "2001:db8::1", "2002:7f00:1::1", "[::1]", "fe80::1%lo0"]) {
    assert.equal(isBlockedIp(ip), true, ip);
  }
});

test("allows public IPv6", () => {
  for (const ip of ["2606:4700:4700::1111", "2001:4860:4860::8888", "2a00:1450:4001::1"]) assert.equal(isBlockedIp(ip), false, ip);
});

test("checkUrl rejects bad schemes, ports, credentials and private hosts", () => {
  const bad = [
    "ftp://example.com/",
    "file:///etc/passwd",
    "javascript:alert(1)",
    "gopher://example.com",
    "http://example.com:8080/",
    "https://example.com:22/",
    "http://user:pass@example.com/",
    "http://127.0.0.1/",
    "http://169.254.169.254/latest/meta-data/",
    "http://[::1]/",
    "http://[::ffff:127.0.0.1]/",
    "http://2130706433/", // 127.0.0.1 as an integer
    "http://0x7f.0.0.1/",
    "http://0177.0.0.1/",
    "http://localhost/",
    "http://foo.localhost/",
    "http://metadata.google.internal/",
    "http://printer.local/",
    "http://intranet/",
    "http://example.com/<script>",
    "",
    "x".repeat(3000),
  ];
  for (const u of bad) assert.throws(() => checkUrl(u, { allowBare: true }), ToolError, u.slice(0, 60));
});

test("checkUrl accepts public URLs and adds https to bare domains", () => {
  assert.equal(checkUrl("https://www.draftly.blog/blog").href, "https://www.draftly.blog/blog");
  assert.equal(checkUrl("draftly.blog", { allowBare: true }).href, "https://draftly.blog/");
  assert.equal(checkUrl("http://example.com:80/x").href, "http://example.com/x");
  assert.equal(checkUrl("https://example.com:443/").href, "https://example.com/");
  assert.throws(() => checkUrl("draftly.blog"), ToolError); // bare only when allowed
});

test("safeLookup refuses a hostname that resolves to loopback", async () => {
  const err = await new Promise<NodeJS.ErrnoException | null>((resolve) => safeLookup("localhost", {}, (e) => resolve(e)));
  assert.equal(err?.code, "EBLOCKED");
});

test("Scan.fetch refuses IP literals before connecting", async () => {
  const scan = new Scan({ budgetMs: 5000, maxFetches: 5 });
  await assert.rejects(scan.fetch("http://127.0.0.1/"), ToolError);
  await assert.rejects(scan.fetch("http://169.254.169.254/latest/meta-data/"), ToolError);
  assert.equal(scan.fetches, 0);
});

test("Scan enforces its fetch cap", async () => {
  const scan = new Scan({ budgetMs: 5000, maxFetches: 0 });
  const r = await scan.fetch("https://example.com/");
  assert.equal(r.ok, false);
  assert.equal(r.error, "Scan limit reached");
});

// Network tests: a public hostname that resolves to 127.0.0.1 must be refused at connect time.
test("Scan.fetch refuses a public hostname that resolves to a private IP (network)", async (t) => {
  const scan = new Scan({ budgetMs: 8000, maxFetches: 3 });
  const r = await scan.fetch("http://127.0.0.1.nip.io/");
  if (r.error === "Domain not found") return t.skip("no DNS in this environment");
  assert.equal(r.ok, false);
  assert.match(r.error ?? "", /private address/);
});
