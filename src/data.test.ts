import * as data from "./data";
import test from "ava";
import { isRegExp } from "util";

test("suffix complex items", (t) => {
  const items = data.getValidSuffixes("ru");

  t.true(items.length > 0);

  t.true(isRegExp(items[0].prefix));
});

test("prefixes", (t) => {
  const items = data.getValidPrefixes("ru");

  t.true(items.length > 0);
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
      "arhiepiscop"
    ]
  }
};

LANGUAGES.forEach(function (lang) {
  NAMES.forEach(function (name) {
    test(`validate ${lang}: ${name}`, (t) => {
      let result = getData(name, lang);
      t.is(true, !!result);
      if (result.length === 0) {
        console.log("No items for", name, lang);
        return;
      }
      if (TEST_DATA[lang] && TEST_DATA[lang][name]) {
        const testData = TEST_DATA[lang][name];
        for (let testWord of testData) {
          let foundWord = false;
          for (let dataWord of result) {
            if (typeof dataWord === "string") {
              if (dataWord === testWord) {
                t.is(dataWord, testWord);
                foundWord = true;
              }
            } else {
              if (isRegExp(dataWord) && dataWord.test(testWord)) {
                foundWord = true;
              }
            }
          }
          t.is(foundWord, true, `NOT found word: ${testWord}`);
        }
      }
    });
  });
});

function getData(name: string, lang: string) {
  try {
    return data.get(name, lang);
  } catch (e) {
    console.log("error on: ", lang, name, e.message);
    throw e;
  }
}
