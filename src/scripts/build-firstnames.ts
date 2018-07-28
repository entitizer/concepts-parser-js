
const atonic = require('atonic');
import { getLanguages } from '../data';
const fs = require('fs');
const join = require('path').join;
import fetch from 'node-fetch';
import { uniq } from '../utils';

buildFirstnames()
    .then(() => console.log('DONE!'))
    .catch(e => console.error(e));

async function buildFirstnames() {
    for (const lang of getLanguages()) {
        const file = join(__dirname, '..', '..', 'data', lang, 'firstnames.txt');
        let firstNames: string[] = []
        try {
            firstNames = fs.readFileSync(file, 'utf8').split(/\n+/g);
        } catch (e) {
            console.log(e.message);
        }

        const wikiNames = await getWikipediaPopularFirstnames(lang);

        firstNames = uniq(firstNames.concat(wikiNames).map(item => atonic(item) as string));

        firstNames = firstNames.filter(name => isValidName(name));

        firstNames = firstNames.sort();

        fs.writeFileSync(file, firstNames.join('\n'), 'utf8');
    }
}

async function getWikipediaPopularFirstnames(lang: string): Promise<string[]> {
    let list = await getWikipediaPopularFirstnamesByLang(lang);
    for (const country of LANG_COUNTRIES[lang]) {
        await getWikipediaPopularFirstnamesByLangAndCountry(lang, country).then(r => list = list.concat(r))
    }

    return list;
}

function getWikipediaPopularFirstnamesByLang(lang: string): Promise<string[]> {
    const query = `SELECT ?firstname ?firstnameLabel ?count WHERE {
        {
          SELECT ?firstname (COUNT(?human) AS ?count) WHERE {
            ?human wdt:P31 wd:Q5.
            ?sitelink schema:isPartOf <https://${lang}.wikipedia.org/>;schema:about ?human.
            ?human wdt:P735 ?firstname.
          }
          GROUP BY ?firstname
        }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "${lang}" } .
      }
      ORDER BY DESC(?count)
      LIMIT 200`;

    return fetchWikipediaPopularFirstnames(query);
}
function getWikipediaPopularFirstnamesByLangAndCountry(lang: string, country: string): Promise<string[]> {
    const query = `SELECT ?firstname ?firstnameLabel ?count WHERE {
        {
          SELECT ?firstname (COUNT(?human) AS ?count) WHERE {
            ?human wdt:P31 wd:Q5.
            ?human wdt:P27 wd:${country}.
            ?sitelink schema:isPartOf <https://${lang}.wikipedia.org/>;schema:about ?human.
            ?human wdt:P735 ?firstname.
          }
          GROUP BY ?firstname
        }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "${lang}" } .
      }
      ORDER BY DESC(?count)
      LIMIT 200`;

    return fetchWikipediaPopularFirstnames(query);
}

function fetchWikipediaPopularFirstnames(query: string): Promise<string[]> {

    return fetch('https://query.wikidata.org/sparql?format=json&query=' + query)
        .then(response => response.json())
        .then<any[]>(json => json.results && json.results.bindings || [])
        .then(items => items.map(item => item.firstnameLabel.value as string))
        .then(items => {
            let names: string[] = [];
            items.forEach(item => names = names.concat(getNames(item)));
            return names;
        })
        .then(names => names.filter(name => isValidName(name)));
}

function getNames(name: string): string[] {
    if (!isValidName(name)) {
        return [];
    }
    const names = name.split(/[\/]/g)
        .map(item => item.trim())
        .map(item => {
            if (item.indexOf('(') > 1) {
                return item.substr(0, item.indexOf('(')).trim();
            }
            return item;
        });

    return names;
}

function isValidName(name: string) {
    return name && name.trim().length > 2 && name !== name.toLowerCase() && !/^Q\d+$/.test(name);
}

const LANG_COUNTRIES: { [lang: string]: string[] } = {
    ro: ['Q217', 'Q218'],
    bg: ['Q219'],
    cs: ['Q213'],
    en: ['Q30', 'Q145'],
    hu: ['Q28'],
    it: ['Q38'],
    pl: ['Q36'],
    ru: ['Q159'],
}
