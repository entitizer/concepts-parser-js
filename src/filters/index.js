'use strict';

const debug = require('debug')('concepts:filter');

const MODE_COLLECT = 'collect';
const MODE_IDENTIFY = 'identify';

const FILTERS_BY_MODE = {
	collect: [
		'invalid_prefix',
		'abbr',
		'invalid',
		'partial',
		'prefix',
		'suffix',
		'start_word',
		'rename',
		'known',
		'duplicate'
	],
	identify: [
		'invalid_prefix',
		'abbr',
		'invalid',
		//'partial',
		'prefix',
		'suffix',
		//'start_word',
		'rename',
		'known'
		//'duplicate'
	]
};

function getFilter(name) {
	return require('./' + name);
}

exports.filter = function filter(concepts, context, options) {
	debug('start filter');

	options = options || {};
	const mode = [MODE_COLLECT, MODE_IDENTIFY].indexOf(options.mode) !== -1 ? options.mode : MODE_IDENTIFY;

	const filters = options.filters || FILTERS_BY_MODE[mode];

	for (let i = 0; i < filters.length; i++) {
		concepts = getFilter(filters[i])(concepts, context);
	}

	debug('end filter');
	return concepts;
};
