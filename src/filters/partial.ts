
import { Concept } from '../concept';
import { Context } from '../types';
import { getPartialConcepts } from '../data';

/**
 * Filter partial concepts
 */
export function filter(concepts: Concept[], context: Context): Concept[] {
	const sources = getPartialConcepts(context.lang);

	return concepts.filter(function (concept) {

		for (let i = sources.length - 1; i >= 0; i--) {
			if (sources[i].test(concept.atonicValue)) {
				concept.set('isPartial', true);
				return false;
			}
		}

		return true;
	});
};
