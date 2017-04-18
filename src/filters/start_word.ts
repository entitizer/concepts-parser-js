
import * as utils from '../utils';
import { Concept } from '../concept';
import { Context } from '../types';

/**
 * Filter concept by start word
 */
export function filter(concepts: Concept[], context: Context): Concept[] {
	return concepts.filter(function (concept) {
		const words = concept.value.split(/\s+/g);
		return words.length > 1 || words[0].toLowerCase() === words[0] || !utils.isSentenceStartingWord(concept.index, context.text);
	});
};
