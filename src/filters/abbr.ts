
const debug = require('debug')('concepts:filter');
import { Context } from '../types';
import { Concept } from '../concept';

function isAbbrOf(text: string, abbr: string): boolean {
	const words: string[] = text.split(/[ ]+/g);
	let position: number = 0;

	for (let i = 0; i < abbr.length; i++ , position++) {
		if (position === words.length) {
			return false;
		}
		let word = words[position];
		if (word[0].toUpperCase() !== abbr[i]) {
			if (word.length > 6 || position === words.length - 1) {
				return false;
			}

			position++;
			word = words[position];
			if (word[0].toUpperCase() !== abbr[i]) {
				return false;
			}
		}
	}
	debug(abbr, 'is abbr for: `', text, '`');
	return true;
}

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
			if (isAbbrOf(text, concept.value)) {
				prev.abbr = concept.value;
				prev.reset(text, 0, context.lang);
				// return false;
			}
		}
		prev = concept;
		return true;
	});
};
