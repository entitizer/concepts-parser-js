import test from "node:test";
import assert from "node:assert/strict";
import { Concept } from "./concept";

test("constructor", () => {
  const concept = new Concept({ value: "Vlad Filat", index: 0, lang: "ro" });
  assert.equal("Vlad Filat", concept.value);
  assert.equal("ro", concept.lang);
  assert.equal(0, concept.index);
});

test("reset recomputes isAbbr", () => {
  const concept = new Concept({ value: "ONU", index: 0, lang: "ro" });
  assert.equal(concept.isAbbr, true);
  concept.reset("Organizația Națiunilor Unite", 0, "ro");
  assert.equal(concept.isAbbr, false);
});

test("reset recomputes endsWithNumber", () => {
  const concept = new Concept({ value: "Formula 1", index: 0, lang: "ro" });
  assert.equal(concept.endsWithNumber, true);
  concept.reset("Formula Unu", 0, "ro");
  assert.equal(concept.endsWithNumber, false);
});

test("reset recomputes endsWithDot", () => {
  const concept = new Concept({ value: "Firma S.R.L.", index: 0, lang: "ro" });
  assert.equal(concept.endsWithDot, true);
  concept.reset("Firma Noastra", 0, "ro");
  assert.equal(concept.endsWithDot, false);
});

test("reset sets isAbbr when the new value is an abbreviation", () => {
  const concept = new Concept({ value: "Statele Unite", index: 0, lang: "ro" });
  assert.equal(!!concept.isAbbr, false);
  concept.reset("SUA", 0, "ro");
  assert.equal(concept.isAbbr, true);
});

test("reset recomputes countWords and atonicValue", () => {
  const concept = new Concept({
    value: "Chișinău Centru",
    index: 0,
    lang: "ro",
  });
  assert.equal(concept.countWords, 2);
  concept.reset("Chișinău", 0, "ro");
  assert.equal(concept.countWords, 1);
  assert.equal(concept.atonicValue, "Chisinau");
});
