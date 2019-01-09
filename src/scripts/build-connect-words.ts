
import { uniq, isLower } from '../utils';
import { WikiEntityInfo, getWikiEntitiesInfo } from './wikidata';
import { Dictionary } from '../types';
import { saveDataFileLines, getDataFileLines } from './common';
const FILE_NAME = 'connect_words.txt';

if (process.argv.length < 3) {
    throw new Error(`argv LANGS is required!`);
}

const LANGS = process.argv[2].split(/[,;\s]+/g).filter(item => item.length === 2);

async function start() {
    for (let lang of LANGS) {
        let items = getDataFileLines(lang, FILE_NAME);
        const newItems = await buildConnectWords(lang);
        console.log(newItems.length);
        // items = items.concat(newItems);
        items = normalizeitems(items);
        saveDataFileLines(lang, items.join('\n'), FILE_NAME);
    }
}

start()
    .then(() => console.log('DONE'))
    .catch(e => console.error(e));

function normalizeitems(items: string[]) {
    items = items.filter(item => item && item.trim());
    // uniq
    items = uniq(items);
    items = items.sort();

    return items;
}

async function buildConnectWords(lang: string) {
    const entities = await getWikiEntitiesInfo(lang, 100);
    const words: Dictionary<number> = {};
    const keys = Object.keys(entities);

    for (const id of keys) {
        const items = getConnectWordsFromWikiEntity(entities[id]);
        for (const item of items) {
            if (!words[item]) {
                words[item] = 0;
            }
            words[item]++;
        }
    }

    // console.log('all connect cords', words);
    const minPopularity = 2;

    return Object.keys(words).filter(word => words[word] >= minPopularity);
}

function getConnectWordsFromWikiEntity(entity: WikiEntityInfo) {
    const words: string[] = []
    const titles = [entity.title, entity.label].concat(entity.aliases).filter(item => !!item);

    for (const title of titles) {
        if (title) {
            const word = getConnectWordTitle(title);
            if (word) {
                words.push(word);
            }
        }
    }

    return uniq(words);
}

function getConnectWordTitle(title: string) {
    const words = title.split(/\s+/g);
    if (words.length < 3) {
        return
    }
    const connectWords: string[] = [];
    for (const word of words.slice(1, words.length - 1)) {
        if (isLower(word) && !/[\(\)\[\]]/.test(word)) {
            connectWords.push(word);
        } else if (connectWords.length) {
            break;
        }
    }
    if (connectWords.length) {
        return connectWords.join(' ');
    }
}
