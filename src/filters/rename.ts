
const conceptsData = require('concepts-data');

import { Concept } from '../concept';
import { Context } from '../types';

/**
 * Rename a concept
 */
export function filter(concepts: Concept[], context: Context): Concept[] {
	const rules: any = conceptsData.getRenameConcepts(context.lang, context.country);

	return concepts.filter(function (concept) {
		for (var i = 0; i < rules.length; i++) {
			if (rules[i].reg.test(concept.atonicValue)) {
				concept.name = rules[i].name;
				return true;
			}
		}

		return true;
	});
};
