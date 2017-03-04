'use strict';

import { Concept } from '../concept';
import { Context } from '../context';

const quoteReg = /["“”„«»]/;

/**
 * Filter invalid concepts
 */
export function filter(concepts: Concept[]): Concept[] {
	return concepts.filter(function (concept) {
		// start with quote
		if (quoteReg.test(concept.value[0])) {
			// ends with quote
			if (quoteReg.test(concept.value[concept.value.length - 1])) {
				return true;
			}
			concept.reset(concept.value.substr(1));
			return concept.isValid();
		}
		return !quoteReg.test(concept.value[concept.value.length - 1]);
	});
};
