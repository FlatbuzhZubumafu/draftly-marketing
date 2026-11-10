import { test } from "node:test";
import assert from "node:assert/strict";
import { INDUSTRIES, topicCount } from "../../industries.ts";

// Titles and descriptions that state a topic count ("41 Topics", "30 roofing blog topics") must match the list.
test("industry titles and descriptions state the real topic count", () => {
  for (const industry of INDUSTRIES) {
    const count = topicCount(industry);
    for (const text of [industry.title, industry.description]) {
      for (const stated of text.matchAll(/\b(\d+)(?: [a-z]+){0,3}? (?:topics|ideas)\b/gi)) {
        assert.equal(Number(stated[1]), count, `${industry.slug}: "${text}" says ${stated[1]}, list has ${count}`);
      }
    }
  }
});
