
const stopwords = require('stopwords-json');
const atonic = require('atonic');
import { getLanguages } from '../data';
import { uniq } from '../utils';
const fs = require('fs');
const join = require('path').join;

for (let lang of getLanguages()) {
    let invalidConcepts = getFileInvalidConcepts(lang);
    invalidConcepts = invalidConcepts.concat(stopwords[lang]);
    invalidConcepts = normalizeConcepts(invalidConcepts);
    const validConcepts = normalizeConcepts(getFileValidConcepts(lang));
    invalidConcepts = invalidConcepts.filter(item => validConcepts.indexOf(item) < 0);
    saveFileInvalidConcepts(lang, invalidConcepts.join('\n'));
}

function normalizeConcepts(concepts: string[]) {
    concepts = concepts.filter(item => !!item && item.trim().length);
    concepts = concepts.map(item => atonic.lowerCase(item.toLowerCase().trim()).replace(/\[\\s\]/, '[\\S]'));
    // uniq
    concepts = uniq(concepts);
    concepts = concepts.sort();

    return concepts;
}

function saveFileInvalidConcepts(lang: string, data: string) {
    const file = join(__dirname, '..', '..', 'data', lang, 'invalid_concepts.txt');
    fs.writeFileSync(file, data, 'utf8');
}

function getFileInvalidConcepts(lang: string) {
    const file = join(__dirname, '..', '..', 'data', lang, 'invalid_concepts.txt');
    let invalidConcepts: string[] = fs.readFileSync(file, 'utf8').split(/\n+/g);
    return invalidConcepts;
}

function getFileValidConcepts(lang: string) {
    const file = join(__dirname, '..', '..', 'data', lang, 'valid_concepts.txt');
    try {
        return fs.readFileSync(file, 'utf8').split(/\n+/g) as string[];
    } catch (e) {
        return [];
    }
}
