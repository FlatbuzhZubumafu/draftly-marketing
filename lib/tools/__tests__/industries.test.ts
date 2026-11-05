import { test } from "node:test";
import assert from "node:assert/strict";
import { INDUSTRIES, topicCount } from "../../industries.ts";

// Titles and descriptions that state a topic count ("41 Topics") must match the list.
test("industry titles and descriptions state the real topic count", () => {
  for (const industry of INDUSTRIES) {
    const count = topicCount(industry);
    for (const text of [industry.title, industry.description]) {
      const stated = text.match(/\b(\d+) (?:topics|plumbing blog ideas|blog ideas)\b/i);
      if (stated) assert.equal(Number(stated[1]), count, `${industry.slug}: "${text}" says ${stated[1]}, list has ${count}`);
    }
  }
});
