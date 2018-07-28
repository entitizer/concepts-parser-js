
import { parse } from './parse';
import { simpleSplit } from './splitter';
import test from 'ava';

test('no split 1 word concept', t => {
	const concept = parse({
		text: 'USA is a country',
		lang: 'en'
	})[0];
	let concepts = simpleSplit(concept);
	t.is(0, concepts.length);
	concepts = concept.split();
	t.is(0, concepts.length);
});

test('split: 2 words', t => {
	const concept = parse({
		text: 'Nicolae Timofti nu a comentat deocamdată situația.',
		lang: 'ro'
	})[0];
	let concepts = simpleSplit(concept);
	t.is(2, concepts.length);
	concepts = concept.split();
	t.is(2, concepts.length);
	t.is('Nicolae', concepts[0].value);
	t.is('Timofti', concepts[1].value);
});

test('split: 3 words', t => {
	const concept = parse({
		text: 'Doar Nicolae Timofti nu a comentat deocamdată situația.',
		lang: 'ro'
	})[0];
	let concepts = simpleSplit(concept);
	t.is(4, concepts.length);
});

test('split: 4 words', t => {
	const concept = parse({
		text: 'Y’all Need to Chill About Proxima Centauri b',
		lang: 'en'
	})[1];
	let concepts = simpleSplit(concept);
	// console.log(concepts);
	t.is(4, concepts.length);
	concepts = concept.split();
	t.is(4, concepts.length);
	t.is('Chill', concepts[0].value);
	t.is('About Proxima Centauri', concepts[1].value);
});

test('split by connect words', t => {
	const concept = parse({
		text: 'Facebook and Microsoft are friends',
		lang: 'en'
	})[0];
	let concepts = simpleSplit(concept);
	t.is(concepts.length, 2);
	concepts = concept.split();
	t.is(concepts.length, 2);
	t.is('Facebook', concepts[0].value);
	t.is('Microsoft', concepts[1].value);
});

test('remove lowercase words', t => {
	let concepts = parse({
		text: 'liceul Ion Creanga',
		lang: 'ro'
	});
	t.is(concepts.length, 1);
	t.is(concepts[0].value, 'liceul Ion Creanga');

	concepts = concepts[0].split();
	// t.is(concepts.length, 1);
	t.is(concepts[0].value, 'Ion Creanga');

	concepts = parse({
		text: 'Colegiul Ion Creanga din Iasi',
		lang: 'ro'
	});

	t.is(concepts.length, 1);
	t.is(concepts[0].value, 'Colegiul Ion Creanga din Iasi');

	concepts = concepts[0].split();
	t.is(concepts.length, 2);
	t.is(concepts[0].value, 'Colegiul Ion Creanga');
	t.is(concepts[1].value, 'Iasi');
});
