'use strict';

const assert = require('assert');
const parser = require('../lib/index');
const splitter = parser.splitter;

describe('splitter', function() {

	it('no split 1 word concept', function() {
		const concept = parser.parse({
			text: 'USA is a country',
			lang: 'en'
		})[0];
		let concepts = splitter.simpleSplit(concept);
		assert.equal(0, concepts.length);
		concepts = concept.split();
		assert.equal(0, concepts.length);
	});

	it('split: 2 words', function() {
		const concept = parser.parse({
			text: 'Nicolae Timofti nu a comentat deocamdată situația.',
			lang: 'ro'
		})[0];
		let concepts = splitter.simpleSplit(concept);
		assert.equal(2, concepts.length);
		concepts = concept.split('ro');
		assert.equal(2, concepts.length);
		assert.equal('Nicolae', concepts[0].value);
		assert.equal('Timofti', concepts[1].value);
	});

	it('split: 3 words', function() {
		const concept = parser.parse({
			text: 'Doar Nicolae Timofti nu a comentat deocamdată situația.',
			lang: 'ro'
		})[0];
		let concepts = splitter.simpleSplit(concept);
		assert.equal(4, concepts.length);
	});

	it('split: 4 words', function() {
		const concept = parser.parse({
			text: 'Y’all Need to Chill About Proxima Centauri b',
			lang: 'en'
		})[1];
		let concepts = splitter.simpleSplit(concept);
		// console.log(concepts);
		assert.equal(4, concepts.length);
		concepts = concept.split('en');
		assert.equal(4, concepts.length);
		assert.equal('Chill', concepts[0].value);
		assert.equal('About Proxima Centauri', concepts[1].value);
	});

	it('split by connect words', function() {
		const concept = parser.parse({
			text: 'Facebook and Microsoft are friends',
			lang: 'en'
		})[0];
		let concepts = splitter.simpleSplit(concept);
		assert.equal(2, concepts.length);
		concepts = concept.split('en');
		assert.equal(2, concepts.length);
		assert.equal('Facebook', concepts[0].value);
		assert.equal('Microsoft', concepts[1].value);
	});
});
