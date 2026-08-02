import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const bridge = readFileSync(new URL("components/2026-08-03-activity-language-bridge.tsx", root), "utf8");
const layout = readFileSync(new URL("app/layout.tsx", root), "utf8");

test("every Activity route mounts the shared four-language compatibility layer", () => {
  assert.match(layout, /<ActivityLanguageBridge\s*\/>/);
  assert.match(bridge, /pathname\.startsWith\("\/activities"\)/);
  for (const language of ["en", "ko", "ja", "zh"]) {
    assert.match(bridge, new RegExp(`\\b${language}:`));
  }
});

test("Activity controls, states, filters and feedback have four-language labels", () => {
  const required = [
    "Start Practice", "Game Settings", "All Levels", "Previous Question",
    "Next Question", "Random Question", "Follow-up Questions", "Save to My Study",
    "No questions match these filters.", "TIME OUT", "WINNER",
  ];
  for (const phrase of required) assert.ok(bridge.includes(phrase), `missing Activity phrase: ${phrase}`);
  assert.match(bridge, /aria-label.*placeholder.*title/);
  assert.match(bridge, /MutationObserver/);
});

test("Activity translation does not change persistence keys or user-entered content", () => {
  assert.match(bridge, /data-no-activity-translate/);
  assert.doesNotMatch(bridge, /localStorage\.(?:setItem|removeItem|clear)/);
});
