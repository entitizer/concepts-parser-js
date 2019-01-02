
import { uniq, isUpper, atonic } from '../utils';
import { getDbTextFiles, getDataFileLines, saveDataFileLines, md5 } from './common';
import { Dictionary } from '../types';
const FILE_NAME = 'invalid_prefixes.txt';

if (process.argv.length < 3) {
    throw new Error(`argv LANGS is required!`);
}

const LANGS = process.argv[2].split(/[,;\s]+/g).filter(item => item.length === 2);

async function start() {
    for (let lang of LANGS) {
        const texts = getDbTextFiles(lang, 100);
        let items = getDataFileLines(lang, FILE_NAME);
        const newItems = buildInvalidPrefixes(texts);
        console.log(newItems.length)
        // items = items.concat(newItems);
        items = normalizeitems(items);
        saveDataFileLines(lang, items.join('\n'), FILE_NAME);
    }
}

start()
    .then(() => console.log('DONE'))
    .catch(e => console.error(e));

function normalizeitems(items: string[]) {
    items = items.filter(item => item && item.trim()).map(item => item.toLowerCase());
    // uniq
    items = uniq(items);
    items = items.sort();

    return items;
}

function buildInvalidPrefixes(texts: string[]) {
    const results: Dictionary<{ popularity: number, texts: string[], value: string }> = {};
    for (const text of texts) {
        const textHash = md5(text);
        const phrases = text.split(/\s*\n\s*/g)
            .filter(item => item.length > 50)
            .slice(0, 5);

        for (const phrase of phrases) {
            const sentences = phrase.split(/[.!?]\s+/g).filter(item => item.length > 50);
            for (const sentence of sentences) {
                const words = sentence.split(/\s+/g);
                let i = 0;
                while (i < words.length && isUpper(words[i][0])) {
                    i++;
                }
                if (i > 0) {
                    const result = atonic(words.slice(0, i).join(' ').toLowerCase());
                    if (!results[result]) {
                        results[result] = { value: result, popularity: 0, texts: [] };
                    }
                    results[result].popularity++;
                    if (results[result].texts.indexOf(textHash) < 0) {
                        results[result].texts.push(textHash);
                    }
                }
            }
        }
    }

    const list = Object.keys(results)
        .filter(key => results[key].texts.length > 2)
        .map(key => results[key]);

    return list.map(item => item.value);
}
