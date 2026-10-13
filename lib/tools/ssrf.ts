// Guards for fetching user-supplied URLs on the server. Every URL a free tool
// fetches, including each redirect hop, goes through checkUrl(), and every DNS
// answer goes through safeLookup() at connect time, so a hostname that resolves
// to a private address is refused even if its DNS changes between checks.
import { BlockList, isIP } from "node:net";
import { lookup as dnsLookup, type LookupAddress } from "node:dns";

export class ToolError extends Error {
  /** Safe to show the visitor. */
  readonly publicMessage: string;
  readonly status: number;
  constructor(publicMessage: string, status = 400) {
    super(publicMessage);
    this.publicMessage = publicMessage;
    this.status = status;
  }
}

const blocked = new BlockList();
for (const [net, prefix] of [
  ["0.0.0.0", 8], // "this" network
  ["10.0.0.0", 8], // private
  ["100.64.0.0", 10], // carrier-grade NAT
  ["127.0.0.0", 8], // loopback
  ["169.254.0.0", 16], // link-local, incl. cloud metadata 169.254.169.254
  ["172.16.0.0", 12], // private
  ["192.0.0.0", 24], // IETF protocol assignments
  ["192.0.2.0", 24], // documentation
  ["192.88.99.0", 24], // 6to4 relay
  ["192.168.0.0", 16], // private
  ["198.18.0.0", 15], // benchmarking
  ["198.51.100.0", 24], // documentation
  ["203.0.113.0", 24], // documentation
  ["224.0.0.0", 4], // multicast
  ["240.0.0.0", 4], // reserved + broadcast
] as const) {
  blocked.addSubnet(net, prefix, "ipv4");
}
for (const [net, prefix] of [
  ["::", 128], // unspecified
  ["::1", 128], // loopback
  ["64:ff9b::", 96], // NAT64
  ["64:ff9b:1::", 48], // local-use NAT64
  ["100::", 64], // discard
  ["2001::", 32], // Teredo
  ["2001:db8::", 32], // documentation
  ["2002::", 16], // 6to4
  ["fc00::", 7], // unique local
  ["fe80::", 10], // link-local
  ["fec0::", 10], // old site-local
  ["ff00::", 8], // multicast
] as const) {
  blocked.addSubnet(net, prefix, "ipv6");
}

/** IPv4 embedded in an IPv4-mapped or IPv4-compatible IPv6 address, e.g. ::ffff:127.0.0.1 or ::ffff:7f00:1. */
function embeddedIpv4(ip: string): string | null {
  const lower = ip.toLowerCase();
  const dotted = lower.match(/^(?:0{0,4}:){0,5}(?:ffff:)?(\d+\.\d+\.\d+\.\d+)$/) ?? lower.match(/^::(?:ffff:)?(\d+\.\d+\.\d+\.\d+)$/);
  if (dotted) return dotted[1];
  const hex = lower.match(/^::(?:ffff:)?([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);
  if (hex) {
    const hi = parseInt(hex[1], 16);
    const lo = parseInt(hex[2], 16);
    return [hi >> 8, hi & 255, lo >> 8, lo & 255].join(".");
  }
  return null;
}

/** True for any address a public website should never resolve to. */
export function isBlockedIp(ip: string): boolean {
  const bare = ip.replace(/^\[|\]$/g, "").split("%")[0];
  const family = isIP(bare);
  if (family === 4) return blocked.check(bare, "ipv4");
  if (family === 6) {
    const v4 = embeddedIpv4(bare);
    if (v4 && isIP(v4) === 4) return true; // mapped/compatible forms are never needed for a public site
    if (blocked.check(bare, "ipv6")) return true;
    // Only global unicast (2000::/3) is reachable on the public internet.
    const first = parseInt(expandFirstHextet(bare), 16);
    return !(first >= 0x2000 && first <= 0x3fff);
  }
  return true; // not an IP at all
}

function expandFirstHextet(ip: string): string {
  if (ip.startsWith("::")) return "0";
  return ip.split(":")[0] || "0";
}

const BAD_HOST_SUFFIXES = [".localhost", ".local", ".internal", ".intranet", ".lan", ".home", ".corp", ".private", ".test", ".invalid", ".example", ".onion", ".arpa"];

export const MAX_URL_LENGTH = 2048;

/**
 * Parses and checks a URL before any request. Throws ToolError with a message the
 * visitor can read. Adds https:// when the visitor typed a bare domain.
 */
export function checkUrl(input: string, { allowBare = false }: { allowBare?: boolean } = {}): URL {
  let raw = (input ?? "").trim();
  if (!raw) throw new ToolError("Enter a URL to check.");
  if (raw.length > MAX_URL_LENGTH) throw new ToolError("That URL is too long.");
  if (/[\s<>"`\\]/.test(raw) || /[\u0000-\u001f\u007f]/.test(raw)) throw new ToolError("That doesn't look like a valid URL.");
  if (allowBare && !/^[a-z][a-z0-9+.-]*:/i.test(raw)) raw = `https://${raw}`;

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new ToolError("That doesn't look like a valid URL.");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") throw new ToolError("Only http and https URLs can be checked.");
  if (url.username || url.password) throw new ToolError("URLs with a username or password can't be checked.");
  if (url.port && url.port !== "80" && url.port !== "443") throw new ToolError("Only standard web ports (80 and 443) can be checked.");

  const host = url.hostname.toLowerCase().replace(/\.$/, "");
  const bareHost = host.replace(/^\[|\]$/g, "");
  if (isIP(bareHost)) {
    if (isBlockedIp(bareHost)) throw new ToolError("That address is private or reserved, so it can't be checked.");
    return url;
  }
  if (host === "localhost" || BAD_HOST_SUFFIXES.some((s) => host.endsWith(s) || host === s.slice(1))) {
    throw new ToolError("That address is private or reserved, so it can't be checked.");
  }
  // A public hostname has at least one dot and a letter-based top-level domain.
  const labels = host.split(".");
  if (labels.length < 2 || !/^(?:[a-z]{2,63}|xn--[a-z0-9-]{1,59})$/.test(labels[labels.length - 1])) {
    throw new ToolError("Enter a public website address, like example.com.");
  }
  if (labels.some((l) => !l || l.length > 63 || !/^[a-z0-9_](?:[a-z0-9_-]*[a-z0-9_])?$/.test(l))) {
    throw new ToolError("That doesn't look like a valid domain name.");
  }
  return url;
}

type LookupCallback = (err: NodeJS.ErrnoException | null, address: string | LookupAddress[], family?: number) => void;

/**
 * Drop-in for dns.lookup on http(s).request: resolves, then refuses the connection if
 * any answer is private. Because it runs at connect time, the address we check is
 * the address we connect to (no DNS-rebinding gap).
 */
export function safeLookup(hostname: string, options: object | number | LookupCallback, maybeCallback?: LookupCallback): void {
  const callback = (typeof options === "function" ? options : maybeCallback) as LookupCallback;
  const opts = (typeof options === "object" && options ? options : {}) as { all?: boolean; family?: number };
  dnsLookup(hostname, { all: true, family: opts.family ?? 0 }, (err, addresses) => {
    if (err) return callback(err, opts.all ? [] : "", 0);
    const list = addresses as LookupAddress[];
    if (!list.length || list.some((a) => isBlockedIp(a.address))) {
      const e = new Error(`Blocked address for ${hostname}`) as NodeJS.ErrnoException;
      e.code = "EBLOCKED";
      return callback(e, opts.all ? [] : "", 0);
    }
    if (opts.all) return callback(null, list);
    callback(null, list[0].address, list[0].family);
  });
}
