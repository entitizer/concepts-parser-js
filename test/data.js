'use strict';

const data = require('../lib/data');
const assert = require('assert');

const LANGUAGES = data.getLanguages();
const NAMES = data.getNames();

function getData(name, lang, country) {
	try {
		return data.get(name, lang, country);
	} catch (e) {
		console.log('error on: ', lang, name, e.message);
		throw e;
	}
}

describe('data', function() {
	it('validation', function() {
		LANGUAGES.forEach(function(lang) {
			NAMES.forEach(function(name) {
				let result = getData(name, lang);
				assert.ok(result);
				if (result.length === 0) {
					console.log('No items for', name, lang);
				}
				const countries = data.getCountries(lang);
				countries.forEach(function(country) {
					result = getData(name, lang, country);
					assert.ok(result);
					if (result.length === 0) {
						console.log('No items for', name, lang, country);
					}
				});
			});
		});
	});
});
