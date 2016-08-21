'use strict';

const debug = require('debug')('concepts:filter');

const FILTERS = [
	'quote',
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

const MODE_COLLECT = 'collect';
const MODE_IDENTIFY = 'identify';

const FILTERS_BY_MODE = {
	collect: {
		excluded: []
	},
	identify: {
		excluded: ['start_word', 'duplicate', 'partial']
	}
};


function getFilter(name) {
	return require('./' + name);
}

exports.filter = function filter(concepts, context, options) {
	debug('start filter');

	options = options || {};
	const mode = [MODE_COLLECT, MODE_IDENTIFY].indexOf(options.mode) !== -1 ? options.mode : MODE_IDENTIFY;

	const excludedFilters = options.excludedFilters || FILTERS_BY_MODE[mode].excluded;
	const filters = options.filters || FILTERS_BY_MODE[mode].filters || FILTERS;

	for (let i = 0; i < filters.length; i++) {
		// is not excluded
		if (excludedFilters.indexOf(filters[i]) === -1) {
			concepts = getFilter(filters[i])(concepts, context);
		}
	}

	debug('end filter');
	return concepts;
};
