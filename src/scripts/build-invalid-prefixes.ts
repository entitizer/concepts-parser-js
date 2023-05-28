import { uniq, isUpper, atonic } from "../utils";
import {
  getDbTextFiles,
  getDataFileLines,
  saveDataFileLines,
  md5
} from "./common";
import { Dictionary } from "../types";
const FILE_NAME = "invalid_prefixes.txt";

if (process.argv.length < 3) {
  throw new Error(`argv LANGS is required!`);
}

const LANGS = process.argv[2]
  .split(/[,;\s]+/g)
  .filter((item) => item.length === 2);

async function start() {
  for (let lang of LANGS) {
    const texts = getDbTextFiles(lang, 100);
    let items = getDataFileLines(lang, FILE_NAME);
    const newItems = buildInvalidPrefixes(texts);
    console.log(newItems.length);
    // items = items.concat(newItems);
    items = normalizeitems(items);
    saveDataFileLines(lang, items.join("\n"), FILE_NAME);
  }
}

start()
  .then(() => console.log("DONE"))
  .catch((e) => console.error(e));

function normalizeitems(items: string[]) {
  items = items
    .filter((item) => item && item.trim())
    .map((item) => item.toLowerCase());
  // uniq
  items = uniq(items);
  items = items.sort();

  return items;
}

function buildInvalidPrefixes(texts: string[]) {
  const results: Dictionary<{
    popularity: number;
    texts: string[];
    value: string;
  }> = {};
  for (const text of texts) {
    const textHash = md5(text);
    const phrases = text
      .split(/\s*\n\s*/g)
      .filter((item) => item.length > 50)
      .slice(0, 5);

    for (const phrase of phrases) {
      const sentences = phrase
        .split(/[.!?]\s+/g)
        .filter((item) => item.length > 50);
      for (const sentence of sentences) {
        const words = sentence.split(/\s+/g);
        let i = 0;
        while (i < words.length && isUpper(words[i][0])) {
          i++;
          if (endsWithPunctuation(words[i])) {
            break;
          }
        }
        if (i > 1) {
          let concept = words.slice(0, i).join(" ");
          if (endsWithPunctuation(concept)) {
            concept = concept.substr(0, concept.length - 1);
          }
          const textValue = words[0];
          const value = atonic(textValue.toLowerCase());
          if (!results[value]) {
            console.log(`testing ${textValue} AND ${concept}`);
            if (existsWordInSentences(sentences, textValue, concept)) {
              results[value] = { value, popularity: 0, texts: [] };
            } else {
              continue;
            }
          }
          results[value].popularity++;
          if (results[value].texts.indexOf(textHash) < 0) {
            results[value].texts.push(textHash);
          }
        }
      }
    }
  }

  const list = Object.keys(results)
    .filter((key) => results[key].texts.length > 2)
    .map((key) => results[key]);

  return list.map((item) => item.value);
}

function endsWithPunctuation(text: string) {
  return [",", ".", ":", ";", "?", "/"].indexOf(text[text.length - 1]) > -1;
}

function existsWordInSentences(
  sentences: string[],
  concept: string,
  text: string
) {
  for (const sentence of sentences) {
    if (
      new RegExp(`(\s)${concept}([\s.!?]|$)`).test(sentence) &&
      !sentence.includes(text)
    ) {
      return true;
    }
  }

  return false;
}
