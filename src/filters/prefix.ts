
import * as conceptsData from 'concepts-data';
import { Concept } from '../concept';
import { Context } from '../types';

/**
 * Find concept prefix
 */
export function filter(concepts: Concept[], context: Context): Concept[] {
	const regexes = conceptsData.getValidPrefixes(context.lang);

	return concepts.filter(function (concept) {
		let text = context.text.substr(0, concept.index);

		for (let regex of regexes) {
			let result = regex.exec(text);

			if (result) {
				let value = text.substr(result.index);
				let indexSpace = 0;
				if (/^\s/.test(value)) {
					indexSpace = 1;
					value = value.substr(1);
				}

				concept.reset(value + concept.value, result.index + indexSpace, context.lang);

				return concept.isValid();
			}
		}

		return true;
	});
};
