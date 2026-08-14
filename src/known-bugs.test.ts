/**
 * Open bugs, found 2026-08-14 by probing with realistic news text.
 *
 * Each test PINS the current (buggy) output, so `npm test` stays quiet while
 * the bug is open. When someone fixes a bug its test FAILS — that failure is
 * the signal to move the case into the regular suite asserting the desired
 * behavior (stated in the DESIRED comment) and delete the entry here.
 *
 * Fixed so far and promoted to the regular suites: orphaned connect words
 * after invalid_prefix, invalid_prefixes ordering (filters/data tests),
 * Object.prototype key collisions, parse(ctx, {}), "S.U.A." final dot,
 * language-code normalization, NBSP joining, "…" sentence boundary
 * (parse/filters tests).
 */
import { parse } from "./parse";
import { Concept } from "./concept";
import test from "node:test";
import assert from "node:assert/strict";

const vals = (concepts: Concept[]) => concepts.map((c) => c.value);

// ---------------------------------------------------------------------------
// 3. invalid_prefix genitive remnant (ru). Stripping "Президент" leaves the
// genitive country glued to the person's name. Only per-language data can
// solve this: "России" is a capitalized ordinary word, not a connect word
// (the connect-word case was fixed — the filter now declines such strips).

test("KNOWN BUG: title + genitive country + name stays glued", () => {
  const concepts = parse({
    text: "Президент России Владимир Путин провёл переговоры в Кремле.",
    lang: "ru",
  });
  // DESIRED: includes "Владимир Путин"
  assert.deepEqual(vals(concepts), ["России Владимир Путин", "Кремле"]);
});

// ---------------------------------------------------------------------------
// 5. Italian elision: "L'", "dell'", "all'" glue the article to the word, so
// stopwords escape the invalid filter ("L'incontro" becomes a concept) and
// entities keep junk prefixes ("dell'Unione Europea").

test("KNOWN BUG: it elided articles leak into concepts", () => {
  const concepts = parse({
    text: "L'incontro ha riguardato il bilancio dell'Unione Europea e il sostegno all'Ucraina.",
    lang: "it",
  });
  // DESIRED: ["Unione Europea", "Ucraina"]
  assert.deepEqual(vals(concepts), [
    "L'incontro",
    "dell'Unione Europea",
    "all'Ucraina",
  ]);
});

// ---------------------------------------------------------------------------
// 6. start_word (collect mode) misses sentences opened by a dialog dash "–".
// Treating "–" as a sentence boundary is NOT obviously safe: a mid-sentence
// dash before a capitalized word ("a spus el – Moldova va decide") would
// wrongly drop a real entity. The "…" half of this bug was fixed in
// utils.isSentenceStartingWord.

test("KNOWN BUG: word after a dialog dash is kept in collect mode", () => {
  const concepts = parse(
    { text: "– Plecăm imediat la Bălți, a spus Ion.", lang: "ro" },
    { mode: "collect" },
  );
  // DESIRED: no "Plecăm" (sentence-starting word)
  assert.deepEqual(vals(concepts), ["Plecăm", "Bălți", "Ion"]);
});
