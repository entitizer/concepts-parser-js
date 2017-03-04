'use strict';

const debug = require('debug')('concepts:parser');
const conceptsData = require('concepts-data');
import { Parser } from './parsers/words/parser';
import { Concept } from './concept';
import { Context } from './context';
import { FilterOptions } from './filters';

export function parse(context: Context, options?: FilterOptions): Concept[] {
	debug('start parsing');

	const parser = new Parser({
		acceptConceptWords: conceptsData.getConnectWords(context.lang)
	});

	let concepts = parser.parse(context);
	debug('end parsing');
	let conceptsList = concepts.filter(options);

	return conceptsList;
};
