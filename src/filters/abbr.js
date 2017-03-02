'use strict';

const debug = require('debug')('concepts:filter');

function isAbbrOf(text, abbr) {
	const words = text.split(/[ ]+/g);
	let position = 0;

	for (let i = 0; i < abbr.length; i++, position++) {
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

function isInParentheses(concept, context) {
	var i = concept.index;
	var j = concept.endIndex;
	var sp = context.text[i - 1];
	var ep = context.text[j];
	// console.log(concept.value, i, j, sp, ep);
	return i > 0 && j < context.text.length && sp === '(' && ep === ')';
}

/**
 * Filter abbreviations
 */
module.exports = function find(concepts, context) {
	let prev;
	return concepts.filter(function(concept) {
		if (prev && concept.getAttr('isAbbr') && prev.endIndex < concept.index && isInParentheses(concept, context)) {
			const text = context.text.substring(prev.index, concept.index - 2);
			if (isAbbrOf(text, concept.value)) {
				prev.setAbbr(concept.value);
				prev.reset(text);
				return false;
			}
		}
		prev = concept;
		return true;
	});
};
