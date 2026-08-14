import * as data from "./data";
import test from "node:test";
import assert from "node:assert/strict";

test("suffix complex items", () => {
  const items = data.getValidSuffixes("ru");

  assert.ok(items.length > 0);

  assert.ok(items[0].prefix instanceof RegExp);
});

test("prefixes", () => {
  const items = data.getValidPrefixes("ru");

  assert.ok(items.length > 0);
});

const LANGUAGES = data.getLanguages();
const NAMES = data.getNames();

const TEST_DATA: { [lang: string]: { [name: string]: string[] } } = {
  ro: {
    invalid_concepts: [
      "20 ani",
      "22g",
      "admitere liceu 2018",
      "aeroportul",
      "arhiepiscop",
    ],
  },
};

LANGUAGES.forEach(function (lang) {
  NAMES.forEach(function (name) {
    test(`validate ${lang}: ${name}`, () => {
      const result = getData(name, lang);
      assert.equal(true, !!result);
      if (result.length === 0) {
        console.log("No items for", name, lang);
        return;
      }
      if (TEST_DATA[lang] && TEST_DATA[lang][name]) {
        const testData = TEST_DATA[lang][name];
        for (const testWord of testData) {
          let foundWord = false;
          for (const dataWord of result) {
            if (typeof dataWord === "string") {
              if (dataWord === testWord) {
                assert.equal(dataWord, testWord);
                foundWord = true;
              }
            } else {
              if (dataWord instanceof RegExp && dataWord.test(testWord)) {
                foundWord = true;
              }
            }
          }
          assert.equal(foundWord, true, `NOT found word: ${testWord}`);
        }
      }
    });
  });
});

function getData(name: string, lang: string) {
  try {
    return data.get(name, lang);
  } catch (e) {
    console.log("error on: ", lang, name, (e as Error).message);
    throw e;
  }
}

test("invalid prefixes regex tries multi-word entries before their one-word prefixes", () => {
  const [regex] = data.getInvalidPrefixes("en");
  const multi = regex.source.indexOf("prime minister");
  const single = regex.source.indexOf("president");
  assert.ok(multi >= 0 && single >= 0, "expected entries missing from data");
  assert.ok(
    multi < single,
    "multi-word invalid prefixes must come first, or they can never match",
  );
});
