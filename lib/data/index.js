'use strict';

const fs = require('fs');
const path = require('path');

const LANGUAGES = ['ro', 'ru', 'bg', 'hu', 'cs', 'pl', 'it', 'en'];
const NAMES = [
	'connect_words',
	'split_words',
	'invalid_concepts',
	'invalid_prefixes',
	'known_concepts',
	'partial_concepts',
	'valid_prefixes',
	'valid_suffixes',
	'rename_concepts'
];

const REGIONAL_NAMES = ['rename_concepts'];

const LANGUAGE_COUNTRIES = {
	ro: ['ro', 'md'],
	ru: ['ru', 'md']
};

const DATA = {};

const builders = {
	invalid_concepts: function(items) {
		return [new RegExp(`^(${items.join('|')})$`, 'i')];
	},
	invalid_prefixes: function(items) {
		return [new RegExp(`^(${items.join('|')}) `, 'i')];
	},
	known_concepts: function(items) {
		return items.map((item) => {
			return {
				reg: new RegExp(`(\\b|\\s)${item}(\\b|\\s)`, 'ig'),
				name: item
			};
		});
	},
	partial_concepts: function(items) {
		return [new RegExp(`^(${items.join('|')})$`, 'i')];
	},
	valid_prefixes: function(items) {
		return [new RegExp(`(\\b|\\s)(${items.join('|')}) $`, 'i')];
	},
	valid_suffixes: function(items) {
		return [new RegExp(`^ (${items.join('|')})(\\b|\\s)`, 'i')];
	},
	rename_concepts: function(items) {
		return items.map((item) => {
			item = item.replace(/( {2,}|\t | \t)/g, '\t').split(/\t+/g);
			if (item.length !== 2) {
				throw new Error(`rename_concepts: Line ${item[0]}... is invalid`);
			}
			return {
				reg: new RegExp(`^${item[0].trim()}$`, 'i'),
				name: item[1].trim()
			};
		});
	}
};

function getFileData(file) {
	let content;
	try {
		content = fs.readFileSync(file, 'utf8');
	} catch (e) {
		return [];
	}
	content = content.trim();
	content = content.replace(/\s+\n/g, '\n').replace(/\n\s+/g, '\n');
	content = content.replace(/^##[^\n]*/g, '');
	content = content.replace(/\n##[^\n]*/g, '\n');
	content = content.trim();
	content = content.replace(/\s+\n/g, '\n').replace(/\n\s+/g, '\n');

	return content.trim().split(/\n+/g);
}

function load(name, lang, country) {
	if (LANGUAGES.indexOf(lang) < 0) {
		throw new Error('Invalid language: ' + lang);
	}
	if (NAMES.indexOf(name) < 0) {
		throw new Error('Invalid name: ' + name);
	}
	let file = path.join(__dirname, lang, name + '.txt');
	let data = getFileData(file);
	if (country) {
		file = path.join(__dirname, lang, country, name + '.txt');
		data = data.concat(getFileData(file));
	}
	return data;
}

function build(name, lang, country) {
	let data = load(name, lang, country);

	let builder = builders[name];
	if (builder) {
		data = builder(data);
	}

	return data;
}

const get = exports.get = function(name, lang, country) {
	if (!name) {
		throw new Error('param `name` is required');
	}
	if (!lang) {
		throw new Error('param `lang` is required');
	}

	let key = lang + '_' + name;
	if (country) {
		if (~REGIONAL_NAMES.indexOf(name)) {
			key = country + '_' + key;
		} else {
			country = undefined;
		}
	}
	if (!DATA[key]) {
		DATA[key] = build(name, lang, country);
	}
	return DATA[key];
};

exports.getConnectWords = function(lang) {
	return get('connect_words', lang);
};

exports.getSplitWords = function(lang) {
	return get('split_words', lang);
};

exports.getInvalidConcepts = function(lang) {
	return get('invalid_concepts', lang);
};

exports.getInvalidPrefixes = function(lang) {
	return get('invalid_prefixes', lang);
};

exports.getKnownConcepts = function(lang) {
	return get('known_concepts', lang);
};

exports.getPartialConcepts = function(lang) {
	return get('partial_concepts', lang);
};

exports.getValidPrefixes = function(lang) {
	return get('valid_prefixes', lang);
};

exports.getValidSuffixes = function(lang) {
	return get('valid_suffixes', lang);
};

exports.getRenameConcepts = function(lang, country) {
	return get('rename_concepts', lang, country);
};

exports.getLanguages = function() {
	return LANGUAGES;
};

exports.getNames = function() {
	return NAMES;
};

exports.getCountries = function(lang) {
	return LANGUAGE_COUNTRIES[lang] || [];
};
