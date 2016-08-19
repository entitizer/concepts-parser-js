'use strict';

const debug = require('debug')('concepts:filter');

const FILTERS = [
	'invalid_prefix',
	'invalid',
	'partial',
	'prefix',
	'suffix',
	'start_word',
	'rename',
	'known',
	'duplicate'
];

function getFilter(name) {
	return require('./' + name);
}

exports.names = function names() {
	return NAMES;
};

exports.filter = function filter(concepts, context, options) {
	debug('start filter');

	options = options || {};

	const excludedFilters = options.excludedFilters || ['start_word', 'duplicate'];
	const filters = options.filters || FILTERS;

	for (let i = 0; i < filters.length; i++) {
		// is not excluded
		if (excludedFilters.indexOf(filters[i]) === -1) {
			concepts = getFilter(filters[i])(concepts, context);
		}
	}

	debug('end filter');
	return concepts;
};
