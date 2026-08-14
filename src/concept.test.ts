import test from "node:test";
import assert from "node:assert/strict";
import { Concept } from "./concept";

test("constructor", () => {
  const concept = new Concept({ value: "Vlad Filat", index: 0, lang: "ro" });
  assert.equal("Vlad Filat", concept.value);
  assert.equal("ro", concept.lang);
  assert.equal(0, concept.index);
});
