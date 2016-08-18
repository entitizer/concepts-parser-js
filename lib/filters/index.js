'use strict';

const debug = require('debug')('concepts:filter');

const FILTERS = {
	rename: {
		type: 'filter'
	},
	suffix: {
		type: 'filter'
	},
	prefix: {
		type: 'filter'
	},
	partial: {
		type: 'filter'
	},
	invalid_prefix: {
		type: 'filter'
	},
	invalid: {
		type: 'filter'
	},
	start_word: {
		type: 'filter'
	},
	known: {
		type: 'process'
	},
	duplicate: {
		type: 'process'
	}
};

const ORDERED_FILTERS = [
	'invalid_prefix',
	'invalid',
	'partial',
	'prefix',
	'suffix',
	'start_word',
	'rename'
];

function getFilter(name) {
	return require('./' + name);
}

exports.names = function names() {
	return NAMES;
};

exports.filter = function filter(concepts, context, noFilters) {
	debug('start filter');
	noFilters = noFilters || ['start_word', 'duplicate'];

	let filter;

	concepts = concepts.filter(function(concept) {
		for (let i = 0; i < ORDERED_FILTERS.length; i++) {
			const filterName = ORDERED_FILTERS[i];
			// is not excluded
			if (noFilters.indexOf(filterName) === -1) {
				filter = getFilter(filterName);
				if (!filter(concept, context)) {
					debug('expluded concept', concept.value, 'by filter', filterName);
					return false;
				}
			}
		}
		return true;
	});
	debug('pre processes');
	// known concepts
	if (noFilters.indexOf('known') === -1) {
		filter = getFilter('known');
		concepts = filter(concepts, context);
	}

	// duplicates
	if (noFilters.indexOf('duplicate') === -1) {
		filter = getFilter('duplicate');
		concepts = filter(concepts);
	}

	// concepts = filterInvalidPrefixs(concepts, context);
	// if (mode === MODE_COLLECT) {
	// 	concepts = filterDublicats(concepts);
	// }
	// concepts = filterInvalidConcepts(concepts, context);
	// concepts = filterKnownConcepts(concepts, context);
	// concepts = filterPartialConcepts(concepts, context, mode);
	// concepts = filterValidPrefixes(concepts, context);
	// concepts = filterValidSuffixes(concepts, context);
	// if (mode === MODE_COLLECT) {
	// 	concepts = filterStartWords(concepts, context);
	// }
	// concepts = filterRenames(concepts, context);

	// concepts = concepts.filter(function(concept) {
	// 	return concept.isValid();
	// });
	debug('end filter');
	return concepts;
};
