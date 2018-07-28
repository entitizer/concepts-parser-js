
import { parse } from './parse';
import test from 'ava';
import { Concept } from './concept';


test('invalid prefixes: President Barak Obama->Barak Obama', t => {
	let concepts = parse({
		text: `Președintele Nicolae Timofti nu a comentat deocamdată situația.`,
		lang: 'ro'
	});
	t.is('Nicolae Timofti', concepts[0].value);
});

test('valid prefixes: muntii Carpati', t => {
	let concepts = parse({
		text: `In muntii Carpati`,
		lang: 'ro'
	});
	t.is(1, concepts.length);
	t.is('muntii Carpati', concepts[0].value);
});

test('valid suffixes: jr', t => {
	let concepts = parse({
		text: `Stefan Banica jr va canta astazi in Bucuresti`,
		lang: 'ro'
	});
	t.is(2, concepts.length);
	t.is('Stefan Banica jr', concepts[0].value);
});

test('known concepts', t => {
	let concepts = parse({
		text: `De maine incepe un nou sezon Romanii au talent La Maruta`,
		lang: 'ro'
	});
	// console.log(concepts);
	t.is(2, concepts.length);
	t.is('Romanii au talent', concepts[0].value);
});

test('duplicate', t => {
	let concepts = parse({
		text: `New York city is New York`,
		lang: 'en'
	}, { mode: 'collect' });
	// console.log(concepts);
	t.is(1, concepts.length);
	t.is('New York', concepts[0].value);
	t.is(0, concepts[0].index);
});

test('invalid concepts', t => {
	let concepts = parse({
		text: `Azi este o zi calda de August. Mos Craciun doarme...`,
		lang: 'ro'
	});
	// console.log(concepts);
	t.is(1, concepts.length);
	t.is('Mos Craciun', concepts[0].value);
});

test('partial concepts', t => {
	let concepts = parse({
		text: `In fiecare zi Petru si fratete sau Dumitru merg la scoala din Batatura.`,
		lang: 'ro'
	}, { mode: 'collect' });
	// console.log(concepts);
	t.is(1, concepts.length);
	t.is('Batatura', concepts[0].value);
});

test('start word', t => {
	let concepts = parse({
		text: `Every day is a Unique Day. That is true`,
		lang: 'en'
	}, { mode: 'collect' });
	// console.log(concepts);
	t.is(1, concepts.length);
	t.is('Unique Day', concepts[0].value);
});

test('abbr', t => {
	let concepts = parse({
		text: `...prezentat colectivului Agenției de Intervenție și Plăți pentru Agricultură (AIPA), noul director.`,
		lang: 'ro'
	});
	// console.log(concepts);
	t.is(2, concepts.length);
	t.is('AIPA', concepts[0].abbr);
	t.is('Agenției de Intervenție și Plăți pentru Agricultură', concepts[0].value);
	t.is('AIPA', concepts[1].value);
});

test('detect text by Abbr ru', t => {
	let concepts = parse({
		text: `Крымские татары, согласно опросу, не хотят переезжать на Украину, заявил глава Федерального агентства по делам национальностей (ФАДН) Игорь Баринов в интервью «Известиям».`,
		lang: 'ru'
	});
	// console.log(concepts);
	t.is(6, concepts.length);
	t.is('ФАДН', concepts[2].abbr);
	t.is('Федерального агентства по делам национальностей', concepts[2].value);
});

test('quotes', t => {
	const concepts = parse({
		text: 'Azi mergem la Teatrul Național "Mihai Eminescu". Este alaturi de Teatrul Național de Operă și Balet „Maria Bieșu”',
		lang: 'ro'
	})
	t.is(concepts[0].value, 'Teatrul Național "Mihai Eminescu"');
	t.is(concepts[1].value, 'Teatrul Național de Operă și Balet „Maria Bieșu”');
});

test('split_type', t => {
	const filter = require('../lib/filters/split_type').filter;
	const concepts = [
		new Concept({ value: 'Chisinau', index: 0, lang: 'ro' }),
		new Concept({ value: 'Mihai Eminescu și Ion Creangă', index: 50, lang: 'ro' }),
		new Concept({ value: 'Ipotesti', index: 100, lang: 'ro' }),
		new Concept({ value: 'Adrian Ursu', index: 150, lang: 'ro' }),
		new Concept({ value: 'Mihai Eminescu și Ion Creangă', index: 50, lang: 'ro' }),
		new Concept({ value: 'Adrian Ursu', index: 150, lang: 'ro' }),
	];

	const filteredConcepts = filter(concepts);

	t.is(filteredConcepts[0].value, 'Chisinau');
	t.is(filteredConcepts[1].value, 'Mihai Eminescu');
	t.is(filteredConcepts[2].value, 'Ion Creangă');
	t.is(filteredConcepts[3].value, 'Ipotesti');
	t.is(filteredConcepts[4].value, 'Adrian Ursu');
	t.is(filteredConcepts[5].value, 'Mihai Eminescu');
	t.is(filteredConcepts[6].value, 'Ion Creangă');
	t.is(filteredConcepts[7].value, 'Adrian Ursu');
});
