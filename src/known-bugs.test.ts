/**
 * Confirmed bugs, found 2026-08-14 by probing with realistic news text.
 *
 * Every test here asserts the DESIRED behavior and is marked `todo`, so the
 * suite stays green while the bugs are open. When a bug is fixed its test
 * starts passing: remove the `todo` flag and update any snapshot in
 * news-articles.test.ts that documents the buggy output.
 */
import { parse } from "./parse";
import { Concept } from "./concept";
import test from "node:test";
import assert from "node:assert/strict";

const vals = (concepts: Concept[]) => concepts.map((c) => c.value);

// ---------------------------------------------------------------------------
// 1. Cyrillic suffix deletion (HIGH, ru + bg).
// Root cause: the valid_suffixes builder in src/data.ts compiles simple
// entries to /^ (item)(\b|\s)/ — JS \b is ASCII-only, so after a Cyrillic
// word only \s can match, the matched value keeps a trailing space, and
// suffix.ts's concept.reset(...) + isValid() then DROPS the whole concept.
// Mid-text (the normal case in news) the entity disappears from the output.

test(
  "ru: suffix extends a concept mid-text instead of deleting it",
  { todo: true },
  () => {
    const concepts = parse({
      text: "Магнитная гора видна издалека даже ночью.",
      lang: "ru",
    });
    assert.deepEqual(vals(concepts), ["Магнитная гора"]);
  },
);

test(
  "ru: suffix extends a concept at the end of the text",
  { todo: true },
  () => {
    const concepts = parse({ text: "Мы посетили Магнитная гора", lang: "ru" });
    assert.deepEqual(vals(concepts), ["Магнитная гора"]);
  },
);

test(
  "bg: suffix extends a concept mid-text instead of deleting it",
  { todo: true },
  () => {
    const concepts = parse({
      text: "Гостите разгледаха Народния дворец в центъра на София.",
      lang: "bg",
    });
    assert.ok(
      vals(concepts).includes("Народния дворец"),
      `got: ${vals(concepts).join(", ")}`,
    );
  },
);

// ---------------------------------------------------------------------------
// 2. Filter order: `invalid` runs before `suffix` (src/filters/index.ts), so a
// name whose head word is a stopword ("Большой") is dropped before the suffix
// filter could complete it to a real entity ("Большой театр").

test(
  "ru: stopword-headed name survives when a suffix completes it",
  { todo: true },
  () => {
    const concepts = parse({
      text: "Делегация посетила Большой театр и вернулась в отель.",
      lang: "ru",
    });
    assert.ok(
      vals(concepts).includes("Большой театр"),
      `got: ${vals(concepts).join(", ")}`,
    );
  },
);

// ---------------------------------------------------------------------------
// 3. invalid_prefix orphaned connect words: FIXED — the filter now keeps the
// concept whole when stripping would leave a leading connect word ("of
// Russia", "de Externe"); regression tests live in filters.test.ts. Still
// open: the genitive remnant below, which only data can solve (the country
// word is a capitalized regular word, not a connect word).

test(
  "ru: title + genitive country + name yields the person's name",
  { todo: true },
  () => {
    const concepts = parse({
      text: "Президент России Владимир Путин провёл переговоры в Кремле.",
      lang: "ru",
    });
    assert.ok(
      vals(concepts).includes("Владимир Путин"),
      `got: ${vals(concepts).join(", ")}`,
    );
  },
);

// ---------------------------------------------------------------------------
// 6. Dotted abbreviations with 3+ letters lose the final dot.
// ABBR_REG in src/parsers/words/word.ts allows only {1,2} letter-dot groups,
// so "R." keeps its dot but "S.U.A." is truncated to "S.U.A".

test("ro: S.U.A. keeps its final dot", { todo: true }, () => {
  const concepts = parse({
    text: "Delegația a zburat în S.U.A. săptămâna trecută.",
    lang: "ro",
  });
  assert.deepEqual(vals(concepts), ["Delegația", "S.U.A."]);
});

// ---------------------------------------------------------------------------
// 7. Language code is not normalized (src/data.ts). Concept lowercases lang,
// but data loading uses it verbatim, so an uppercase code from a CMS or HTTP
// header crashes instead of parsing.

test('lang "RO" behaves like "ro"', { todo: true }, () => {
  const concepts = parse({ text: "Moldova este stat în Europa.", lang: "RO" });
  assert.deepEqual(vals(concepts), ["Moldova", "Europa"]);
});

// ---------------------------------------------------------------------------
// 8. Spanish connect words are missing bare "de" (data/es/connect_words.txt
// has "de la" and "del" but not "de"), so the most common Spanish name
// pattern fragments.

test("es: names joined with bare 'de' stay whole", { todo: true }, () => {
  const concepts = parse({
    text: "El escritor Miguel de Cervantes nació en Alcalá de Henares.",
    lang: "es",
  });
  assert.deepEqual(vals(concepts), [
    "Miguel de Cervantes",
    "Alcalá de Henares",
  ]);
});

// ---------------------------------------------------------------------------
// 9. Italian elision: "L'", "dell'", "all'" glue the article to the word, so
// stopwords escape the invalid filter ("L'incontro" becomes a concept) and
// entities keep junk prefixes ("dell'Unione Europea").

test("it: elided articles do not leak into concepts", { todo: true }, () => {
  const concepts = parse({
    text: "L'incontro ha riguardato il bilancio dell'Unione Europea e il sostegno all'Ucraina.",
    lang: "it",
  });
  assert.deepEqual(vals(concepts), ["Unione Europea", "Ucraina"]);
});

// ---------------------------------------------------------------------------
// 10. Non-breaking space (U+00A0, common in text pasted from Word or CMS
// output) is not treated as a joining space between words.

test("en: NBSP joins words like a regular space", { todo: true }, () => {
  const text = "He visited the Republic of\u00A0Moldova in June.";
  const concepts = parse({ text, lang: "en" });
  const normalized = vals(concepts).map((v) => v.replace(/\u00A0/g, " "));
  assert.deepEqual(normalized, ["Republic of Moldova"]);
});

// ---------------------------------------------------------------------------
// 11. start_word (collect mode) misses sentence boundaries that end with a
// single-character ellipsis "…" or start with a dialog dash "–", because
// utils.isSentenceStartingWord only checks /^[!.?;-]$/.

test(
  "collect: sentence after … is treated like after a dot",
  { todo: true },
  () => {
    const after_dot = parse(
      { text: "Era târziu. Popescu dormea adânc.", lang: "ro" },
      { mode: "collect" },
    );
    const after_ellipsis = parse(
      { text: "Era târziu… Popescu dormea adânc.", lang: "ro" },
      { mode: "collect" },
    );
    assert.deepEqual(vals(after_ellipsis), vals(after_dot));
  },
);

test(
  "collect: word after a dialog dash is a sentence starter",
  { todo: true },
  () => {
    const concepts = parse(
      { text: "– Plecăm imediat la Bălți, a spus Ion.", lang: "ro" },
      { mode: "collect" },
    );
    assert.ok(
      !vals(concepts).includes("Plecăm"),
      `got: ${vals(concepts).join(", ")}`,
    );
  },
);

// ---------------------------------------------------------------------------
// 12. "имени X" (named after X) is the standard Russian institution pattern,
// but "имени" is missing from data/ru/connect_words.txt.

test("ru: 'имени' joins institution names", { todo: true }, () => {
  const concepts = parse({
    text: "Он окончил МГУ имени Ломоносова в прошлом году.",
    lang: "ru",
  });
  assert.deepEqual(vals(concepts), ["МГУ имени Ломоносова"]);
});
