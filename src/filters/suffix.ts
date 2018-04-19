
import * as conceptsData from 'concepts-data';

import { Concept } from '../concept';
import { Context } from '../types';

/**
 * Find concept suffix
 */
export function filter(concepts: Concept[], context: Context): Concept[] {
	const sources = conceptsData.getValidSuffixes(context.lang);

	return concepts.filter(function (concept) {
		let text = context.text.substr(concept.index + concept.value.length);

		for (let i = sources.length - 1; i >= 0; i--) {
			let regex = sources[i];

			let result = regex.exec(text);

			if (result) {

				let match = result[0];
				let value = text.substr(0, match.length);

				concept.reset(concept.value + value);

				return concept.isValid();
			}
		}
		return true;
	});
};
