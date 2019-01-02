
const debug = require('debug')('concepts:filter');
import { Context } from '../types';
import { Concept } from '../concept';
import isAbbrOf = require('is-abbr-of');

function isInParentheses(concept: Concept, context: Context): boolean {
	var i = concept.index;
	var j = concept.endIndex;
	var sp = context.text[i - 1];
	var ep = context.text[j];
	// debug(concept.value, i, j, sp, ep);
	return i > 0 && j < context.text.length && sp === '(' && ep === ')';
}

/**
 * Filter abbreviations
 */
export function filter(concepts: Concept[], context: Context): Concept[] {
	let prev: Concept;
	return concepts.filter(function (concept) {
		if (prev && concept.isAbbr && prev.endIndex < concept.index && isInParentheses(concept, context)) {
			const text = context.text.substring(prev.index, concept.index - 2);
			if (isAbbrOf(concept.value, text)) {
				debug(`${concept.value} is abbr of ${text}`);
				prev.abbr = concept.value;
				prev.reset(text, 0, context.lang);
				// return false;
			}
		}
		prev = concept;
		return true;
	});
};
