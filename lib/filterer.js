'use strict';

const conceptsData = require('concepts-data');
const Concept = require('./concept');
const utils = require('./utils');
const MODE_IDENTIFY = utils.MODE_IDENTIFY;
const MODE_COLLECT = utils.MODE_COLLECT;

function testRegex(value, regexp) {
	return regexp.test(value);
}

function filterRenames(concepts, context) {
	let rules = conceptsData.getRenameConcepts(context.lang, context.country);
	if (concepts.length > 0 && rules.length > 0) {
		concepts.forEach(function(concept) {
			rules.forEach(function(rule) {
				if (rule.reg.test(concept.atonic)) {
					concept.name = rule.name;
				}
			});
		});
	}
	return concepts;
}

function filterDublicats(concepts) {
	let keys = {};
	return concepts.filter(function(concept) {
		let key = concept.atonic.toLowerCase();
		if (keys[key]) {
			return false;
		}
		keys[key] = true;
		return true;
	});
}

function filterValidSuffixes(concepts, context) {
	let sources = conceptsData.getValidSuffixes(context.lang);

	concepts.forEach(function(concept) {
		let text = context.text.substr(concept.index + concept.value.length);

		for (let i = sources.length - 1; i >= 0; i--) {
			let regex = sources[i];

			let result = regex.exec(text);

			if (!result) {
				continue;
			}

			let match = result[0];

			let value = text.substr(0, match.length - 1);

			concept.reset(concept.value + value);
		}
	});

	return concepts;
}

function filterValidPrefixes(concepts, context) {
	let sources = conceptsData.getValidPrefixes(context.lang);

	concepts.forEach(function(concept) {
		let text = context.text.substr(0, concept.index);

		for (let i = sources.length - 1; i >= 0; i--) {
			let regex = sources[i];

			let result = regex.exec(text);

			if (!result) {
				continue;
			}

			let value = text.substr(result.index + 1);

			concept.reset(value + concept.value, result.index + 1);
		}
	});

	return concepts;
}

function filterPartialConcepts(concepts, context, mode) {
	let sources = conceptsData.getPartialConcepts(context.lang);

	return concepts.filter(function(concept) {
		if (sources.some(testRegex.bind(null, concept.atonic))) {
			if (mode === MODE_COLLECT) {
				return false;
			}

			concept.isPartial = true;
		}
		return true;
	});
}

function filterKnownConcepts(concepts, context) {
	let sources = conceptsData.getKnownConcepts(context.lang);

	let newconcepts = [];

	sources.forEach(function(source) {
		let result;

		while ((result = source.reg.exec(context.text)) !== null) {
			let match = result[0];
			let value = context.text.substr(result.index + 1, match.length - 2);

			let concept = new Concept(value, result.index + 1, context);

			if (concept.isValid()) {
				newconcepts.push(concept);
			}
		}
	});

	if (newconcepts.length > 0) {
		concepts = concepts.filter(function(concept) {
			return !newconcepts.some(function(c) {
				return concept.index >= c.index && concept.index + concept.value.length <= c.index + c.value.length;
			});
		});

		concepts = concepts.concat(newconcepts);
	}

	return concepts;
}

function filterInvalidPrefixs(concepts, context) {
	let sources = conceptsData.getInvalidPrefixes(context.lang);

	return concepts.filter(function(concept) {
		for (let i = sources.length - 1; i >= 0; i--) {
			let regex = sources[i];

			let result = regex.exec(concept.atonic);

			if (!result) {
				continue;
			}

			let match = result[0];
			let value = concept.value.substr(match.length);

			concept.reset(value, concept.index + match.length);
		}
		return true;
	});
}

function filterInvalidConcepts(concepts, context) {
	let sources = conceptsData.getInvalidConcepts(context.lang);

	return concepts.filter(function(concept) {
		return !sources.some(testRegex.bind(null, concept.atonic));
	});
}

function filterStartWords(concepts, context) {
	return concepts.filter(function(concept) {
		let words = concept.value.split(/\s+/g);
		return words.length > 1 || words[0].toLowerCase() === words[0] || !utils.isSentenceStartingWord(concept.index, context.text);
	});
}

/**
 * Filters a list of concepts. Executes in max 50 ms.
 * @param {Array} concepts Concepts to filter
 * @param {Context} context The context: lang, country
 * @param {String} mode Filter mode: collect, identify
 * @returns {Array} Processed list of concepts
 */
function filter(concepts, context, mode) {
	mode = mode || MODE_IDENTIFY;
	// let date = Date.now();
	concepts = filterInvalidPrefixs(concepts, context);
	if (mode === MODE_COLLECT) {
		concepts = filterDublicats(concepts);
	}
	concepts = filterInvalidConcepts(concepts, context);
	concepts = filterKnownConcepts(concepts, context);
	concepts = filterPartialConcepts(concepts, context, mode);
	concepts = filterValidPrefixes(concepts, context);
	concepts = filterValidSuffixes(concepts, context);
	if (mode === MODE_COLLECT) {
		concepts = filterStartWords(concepts, context);
	}
	concepts = filterRenames(concepts, context);

	concepts = concepts.filter(function(concept) {
		return concept.isValid();
	});
	// console.log(Date.now() - date);
	return concepts;
}

// exports -------------------------------------------------

exports.filter = filter;
