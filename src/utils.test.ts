import {
  isLetter,
  isUpper,
  isLower,
  isDigit,
  isSentenceStartingWord,
  uniq,
} from "./utils";
import test from "node:test";
import assert from "node:assert/strict";

test("#isLetter", () => {
  assert.equal(true, isLetter("a"));
  assert.equal(true, isLetter("abc"));
  assert.equal(true, isLetter("Șțtrtîăâ"));
  assert.equal(true, isLetter("длР"));
  assert.equal(false, isLetter("5"));
  assert.equal(false, isLetter("-"));
  assert.equal(false, isLetter("😀"));
  assert.equal(false, isLetter(" "));
});

test("#isUpper / #isLower", () => {
  assert.equal(true, isUpper("A"));
  assert.equal(true, isUpper("Д"));
  assert.equal(true, isUpper("Ș"));
  assert.equal(false, isUpper("a"));
  assert.equal(false, isUpper("5"), "digits are neither upper nor lower");
  assert.equal(false, isUpper("-"));
  assert.equal(true, isLower("a"));
  assert.equal(true, isLower("д"));
  assert.equal(false, isLower("A"));
  assert.equal(false, isLower("5"));
});

test("#isDigit", () => {
  assert.equal(true, isDigit("7"));
  assert.equal(true, isDigit("2016"));
  assert.equal(false, isDigit("10.2"), "a dot breaks a pure number");
  assert.equal(false, isDigit("12a"));
  assert.equal(false, isDigit(""));
  assert.equal(false, isDigit("-5"));
});

test("#isSentenceStartingWord", () => {
  const t = (text: string, index: number) =>
    isSentenceStartingWord(index, text);

  // text start / whitespace-only prefix
  assert.equal(t("Ana vine.", 0), true);
  assert.equal(t("  \n\t Ana vine.", 5), true);
  // after sentence enders
  assert.equal(t("El doarme. Ana vine.", 11), true);
  assert.equal(t("El doarme! Ana vine.", 11), true);
  assert.equal(t("El doarme? Ana vine.", 11), true);
  assert.equal(t("El doarme… Ana vine.", 11), true);
  assert.equal(t("El doarme; Ana vine.", 11), true);
  // after a newline
  assert.equal(t("El doarme\nAna vine.", 10), true);
  // a dialog dash opening a line starts a sentence
  assert.equal(t("– Ana vine.", 2), true);
  assert.equal(t("El a zis.\n– Ana vine.", 12), true);
  // ...but a mid-sentence dash does not
  assert.equal(t("a spus el – Moldova va decide", 12), false);
  // colon, comma, closing paren and quotes do not start a sentence
  assert.equal(t("El a zis: Ana vine.", 10), false);
  assert.equal(t("El a zis, Ana vine.", 10), false);
  assert.equal(t("El (chiar) Ana vine.", 11), false);
  assert.equal(t('El a zis. „Ana vine."', 11), false);
  // plain mid-sentence word
  assert.equal(t("El o vede pe Ana zilnic.", 13), false);
});

test("#uniq", () => {
  assert.deepEqual(uniq([1, 2, 2, 3, 1]), [1, 2, 3]);
  assert.deepEqual(uniq(["a", "a"]), ["a"]);
  assert.deepEqual(uniq([]), []);
});
