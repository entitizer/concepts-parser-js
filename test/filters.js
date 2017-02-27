'use strict';

const parser = require('../lib/index');
// const filters = require('../lib/filters');
const assert = require('assert');

describe('filters', function() {

	it('invalid prefixes: President Barak Obama->Barak Obama', function() {
		let concepts = parser.parse({
			text: `Președintele Nicolae Timofti nu a comentat deocamdată situația.`,
			lang: 'ro'
		});
		assert.equal('Nicolae Timofti', concepts[0].value);
	});

	it('valid prefixes: muntii Carpati', function() {
		let concepts = parser.parse({
			text: `In muntii Carpati`,
			lang: 'ro'
		});
		assert.equal(1, concepts.length);
		assert.equal('muntii Carpati', concepts[0].value);
	});

	it('valid suffixes: jr', function() {
		let concepts = parser.parse({
			text: `Stefan Banica jr va canta astazi in Bucuresti`,
			lang: 'ro'
		});
		assert.equal(2, concepts.length);
		assert.equal('Stefan Banica jr', concepts[0].value);
	});

	it('known concepts', function() {
		let concepts = parser.parse({
			text: `De maine incepe un nou sezon Romanii au talent La Maruta`,
			lang: 'ro'
		});
		// console.log(concepts);
		assert.equal(2, concepts.length);
		assert.equal('Romanii au talent', concepts[0].value);
	});

	it('duplicate', function() {
		let concepts = parser.parse({
			text: `New York city is New York`,
			lang: 'en'
		}, { mode: 'collect' });
		// console.log(concepts);
		assert.equal(1, concepts.length);
		assert.equal('New York', concepts[0].value);
		assert.equal(0, concepts[0].index);
	});

	it('invalid concepts', function() {
		let concepts = parser.parse({
			text: `Azi este o zi calda de August. Mos Craciun doarme...`,
			lang: 'ro'
		});
		// console.log(concepts);
		assert.equal(1, concepts.length);
		assert.equal('Mos Craciun', concepts[0].value);
	});

	it('partial concepts', function() {
		let concepts = parser.parse({
			text: `In fiecare zi Petru si fratete sau Dumitru merg la scoala din Batatura.`,
			lang: 'ro'
		}, { mode: 'collect' });
		// console.log(concepts);
		assert.equal(1, concepts.length);
		assert.equal('Batatura', concepts[0].value);
	});

	it('start word', function() {
		let concepts = parser.parse({
			text: `Every day is a Unique Day. That is true`,
			lang: 'en'
		}, { mode: 'collect' });
		// console.log(concepts);
		assert.equal(1, concepts.length);
		assert.equal('Unique Day', concepts[0].value);
	});

	it('abbr', function() {
		let concepts = parser.parse({
			text: `...prezentat colectivului Agenției de Intervenție și Plăți pentru Agricultură (AIPA), noul director.`,
			lang: 'ro'
		});
		// console.log(concepts);
		assert.equal(1, concepts.length);
		assert.equal('AIPA', concepts[0].abbr);
		assert.equal('Agenției de Intervenție și Plăți pentru Agricultură', concepts[0].value);
	});

	it('detect text by Abbr ru', function() {
		let concepts = parser.parse({
			text: `Крымские татары, согласно опросу, не хотят переезжать на Украину, заявил глава Федерального агентства по делам национальностей (ФАДН) Игорь Баринов в интервью «Известиям».`,
			lang: 'ru'
		});
		// console.log(concepts);
		assert.equal(5, concepts.length);
		assert.equal('ФАДН', concepts[2].abbr);
		assert.equal('Федерального агентства по делам национальностей', concepts[2].value);
	});

});
