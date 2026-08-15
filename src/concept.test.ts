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

test("isValid: length and character boundaries", () => {
  const valid = (value: string) =>
    new Concept({ value, index: 0, lang: "ro" }).isValid();

  assert.equal(valid("Ab"), true);
  assert.equal(valid("1a"), true, "digit+letter is a valid 2-char value");
  // 2-char values ending in punctuation are noise ("A.", "A-", "B)")
  assert.equal(valid("A."), false);
  assert.equal(valid("A-"), false);
  assert.equal(valid("A)"), false);
  // digits alone are never a concept
  assert.equal(valid("12"), false);
  assert.equal(valid("2016"), false);
  // single char / empty / untrimmed
  assert.equal(valid("A"), false);
  assert.equal(valid(""), false);
  assert.equal(valid(" Ana"), false);
  assert.equal(valid("Ana "), false);
  // MAX_LENGTH is 100, inclusive
  assert.equal(valid("A" + "b".repeat(99)), true);
  assert.equal(valid("A" + "b".repeat(100)), false);
});

test("reset validates lang and value", () => {
  assert.throws(
    () => new Concept({ value: "Test", index: 0, lang: "romanian" }),
    /Invalid field `lang`/,
  );
  assert.throws(
    () => new Concept({ value: "Test", index: 0, lang: "" }),
    /Invalid field `lang`/,
  );
  assert.throws(
    () => new Concept({ value: 42 as unknown as string, index: 0, lang: "ro" }),
    /Invalid field `value`/,
  );
  const concept = new Concept({ value: "Test", index: 0, lang: " RO " });
  assert.equal(concept.lang, "ro", "lang is trimmed and lowercased");
});

test("endIndex is index + value length", () => {
  const concept = new Concept({ value: "Ana Blandiana", index: 7, lang: "ro" });
  assert.equal(concept.endIndex, 20);
  concept.reset("Ana", 7, "ro");
  assert.equal(concept.endIndex, 10);
});

test("isAbbr covers dotted, hyphen-digit and plain caps forms", () => {
  const abbr = (value: string) =>
    new Concept({ value, index: 0, lang: "en" }).isAbbr;

  assert.equal(abbr("UE"), true);
  assert.equal(abbr("S.U.A."), true);
  assert.equal(abbr("COVID-19"), true, "digits do not break the ALL-CAPS test");
  assert.equal(abbr("Ab"), false);
  // multi-word values are never abbreviations, even in ALL CAPS
  assert.equal(abbr("TWO WORDS"), false);
});

test("a negative index falls back to 0, not the poisoned value", () => {
  const concept = new Concept({ value: "Test", index: -5, lang: "ro" });
  assert.equal(concept.index, 0);
});

test("reset with an invalid index keeps the previous valid index", () => {
  const concept = new Concept({ value: "Test", index: 7, lang: "ro" });
  concept.reset("Testat", -1, "ro");
  assert.equal(concept.index, 7);
});
