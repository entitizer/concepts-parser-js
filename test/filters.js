'use strict';

let parser = require('../lib/parser');
let assert = require('assert');

describe('filters', function() {

	it('remove prefixes: President Barak Obama->Barak Obama', function() {
		let concepts = parser.parse({
			text: `Președintele Nicolae Timofti nu a comentat deocamdată situația.`,
			lang: 'ro',
			country: 'md'
		});
		assert.equal('Nicolae Timofti', concepts[0].value);
	});

});
