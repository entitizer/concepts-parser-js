
const conceptsData = require('concepts-data');
import { Concept } from '../concept';
import { Context } from '../types';

/**
 * Find concept prefix
 */
export function filter(concepts: Concept[], context: Context): Concept[] {
	const sources: any = conceptsData.getValidPrefixes(context.lang);

	return concepts.filter(function (concept) {
		let text = context.text.substr(0, concept.index);

		for (let i = sources.length - 1; i >= 0; i--) {
			let regex = sources[i];

			let result = regex.exec(text);

			if (result) {

				let value = text.substr(result.index + 1);

				concept.reset(value + concept.value, result.index + 1);

				return concept.isValid();
			}
		}

		return true;
	});
};
