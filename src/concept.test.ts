
import { parse } from './parse';
import test from 'ava';
import { Concept } from './concept';

test('constructor', t => {
    const concept = new Concept({ value: 'Vlad Filat', index: 0, lang: 'ro' });
    t.is('Vlad Filat', concept.value);
    t.is('ro', concept.lang);
    t.is(0, concept.index);
});

test('PERSON Concept', t => {
    const concepts = parse({
        text: `Vlad Filat este presedintele parlamentului iar Iurie Rosca...`,
        lang: 'ro'
    });
    t.is(2, concepts.length);
    t.is('Vlad Filat', concepts[0].value);
    t.is('ro', concepts[0].lang);
    t.is('PERSON', concepts[0].type);
    t.is('Iurie Rosca', concepts[1].value);
    // t.is('PERSON', concepts[1].type);
});

test('PERSON split Concept', t => {
    let concepts = parse({
        text: `Vlad Filat și Iurie Rosca vor merge la răcoare`,
        lang: 'ro'
    });

    t.is(2, concepts.length);

    t.is('Vlad Filat', concepts[0].value);
    t.is('PERSON', concepts[0].type);
    t.is('Iurie Rosca', concepts[1].value);
    // t.is('PERSON', concepts[1].type);
});
