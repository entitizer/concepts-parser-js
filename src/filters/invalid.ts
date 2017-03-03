'use strict';

const conceptsData = require('concepts-data');

import { Concept } from '../concept';
import { Context } from '../context';

/**
 * Filter invalid concepts
 */
export function filter(concepts: Concept[], context: Context): Concept[] {
	const sources: any = conceptsData.getInvalidConcepts(context.lang);
	return concepts.filter(function (concept) {
		for (var i = sources.length - 1; i >= 0; i--) {
			if (sources[i].test(concept.atonicValue)) {
				return false;
			}
		}
		return true;
	});
};
