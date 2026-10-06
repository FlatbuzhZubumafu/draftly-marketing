/**
 * Turns whatever a visitor typed into the hero box into a full website URL.
 *
 * Most people type a bare domain ("acmeroofing.com" or "www.acmeroofing.com"),
 * so a missing scheme gets https:// added. Returns null for input that cannot
 * be a public website, so the form can show an inline error.
 */
const HOSTNAME =
  /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:[a-z]{2,63}|xn--[a-z0-9-]{1,59})$/i;

export function normalizeSiteUrl(input: string): string | null {
  let value = input.trim();
  if (!value || /\s/.test(value)) return null;

  if (!/^https?:\/\//i.test(value)) {
    // "mailto:", "ftp:" and friends are not websites. "host:8080" is fine.
    if (/^[a-z][a-z0-9+.-]*:(?!\d)/i.test(value)) return null;
    value = `https://${value.replace(/^\/+/, "")}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return null;
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
  if (!HOSTNAME.test(parsed.hostname)) return null;

  const path = parsed.pathname === "/" ? "" : parsed.pathname;
  return `${parsed.origin}${path}${parsed.search}`;
}
