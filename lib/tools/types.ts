// Shapes shared by the free tools' checks, API route and result UI.

export type Status = "pass" | "warn" | "fail" | "info";

export type CheckItem = {
  id: string;
  /** Short name of the check, e.g. "Meta description". */
  label: string;
  status: Status;
  /** What we found, in one or two plain sentences. */
  detail: string;
  /** Why it matters. */
  why: string;
  /** How to fix it. Empty on a pass. */
  fix?: string;
  /** Optional rows to show under the item (e.g. broken links, old posts). */
  list?: { text: string; href?: string; note?: string }[];
};

export type ToolReport = {
  tool: string;
  /** The URL we ended up checking, after redirects. */
  checked: string;
  items: CheckItem[];
  summary: { pass: number; warn: number; fail: number };
  /** Honest notes about what the scan couldn't do this time. */
  notes: string[];
};

export function summarize(items: CheckItem[]): ToolReport["summary"] {
  return {
    pass: items.filter((i) => i.status === "pass").length,
    warn: items.filter((i) => i.status === "warn").length,
    fail: items.filter((i) => i.status === "fail").length,
  };
}
