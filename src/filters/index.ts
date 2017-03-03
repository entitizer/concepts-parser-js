'use strict';

const debug = require('debug')('concepts:filter');

import { Concept } from '../concept';
import { Context } from '../context';

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

interface IFilter {
	filter(concepts: Concept[], context?: Context): Concept[];
}

function getFilter(name: string): IFilter {
	return require('./' + name);
}

export type FilterOptions = {
	mode: string
};

export function filter(concepts: Concept[], context: Context, options: FilterOptions = { mode: MODE_IDENTIFY }): Concept[] {
	debug('start filter');

	let filters: string[];

	switch (options.mode) {
		case MODE_COLLECT:
			filters = FILTERS_BY_MODE[MODE_COLLECT];
			break;
		case MODE_IDENTIFY:
			filters = FILTERS_BY_MODE[MODE_IDENTIFY];
			break;
		default: throw new Error('invalid filter mode ' + options.mode);
	}

	for (let i = 0; i < filters.length; i++) {
		concepts = getFilter(filters[i]).filter(concepts, context);
	}

	debug('end filter');
	return concepts;
};
