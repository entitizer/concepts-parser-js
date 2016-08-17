'use strict';

const BaseExtractor = require('./base_extractor');
const utils = require('../utils');
const Concepts = require('../concepts');

const POINT = '.';
const SPACE = ' ';

module.exports = class Extractor extends BaseExtractor {

	extract(context) {
		const input = context.text;
		let p = 0;
		let pp = 0;
		let pivot = 0;
		let self = this;
		let start = 0;
		const concepts = new Concepts(context);

		function addConcept() {
			let concept = self.formatConcept.apply(self, arguments);
			pp = p = 0;
			start = 0;
			concepts.add(concept);
		}

		for (let i = 0; i < input.length; i++) {
			let c = input[i];

			switch (p) {

				// initial position
				case 0:
					if (utils.isLetter(c)) {
						start = i;
						p = utils.isUpper(c) ? 1 : 11;
					}
					pivot = 0;
					break;

					// start with upper case
				case 1:
					if (c === POINT) {
						p = 21;
					} else if (utils.isLower(c)) {
						p = 2;
					} else if (utils.isUpper(c) || utils.isDigit(c) || self.isInConnectChars(c)) {
						p = 31;
					} else if (c === SPACE && self.isLowerStartUpperWord(input, i)) {
						p = 2;
					} else {
						if (i - start < 3) {
							p = 0;
						} else {
							addConcept(context, input, i + 1, start, p);
						}
					}
					break;
				case 2:
					if (i === input.length - 1) {
						addConcept(context, input, i + 2, start, p);
					} else if (utils.isLetterOrDigit(c)) {
						p = 2;
					} else if (self.isInConnectChars(c)) {
						p = -2;
					} else if (c === SPACE) {
						p = 3;
					} else {
						if (i - start < 3) {
							p = 0;
						} else {
							addConcept(context, input, i + 1, start, p);
						}
					}
					break;
				case -2:
					if (utils.isLetterOrDigit(c)) {
						p = 2;
					} else {
						let prefix = input.substr(start, i - start);
						//console.log('prefix', prefix);
						if (!self.isInPrefixes(prefix.toLowerCase())) {
							addConcept(context, input, i, start, p);
						}
					}
					break;
				case 3:
					if (utils.isDigit(c)) {
						p = 41;
					} else if (utils.isLower(c) || self.isInConceptWords(c)) {
						if (self.isLowerStartUpperWord(input, i)) {
							//p = 61;
							//pivot = i;
							p = 1;
						} else {
							p = 4;
							pivot = i;
						}
					} else if (utils.isUpper(c)) {
						p = 1;
					} else if (self.isInStartQuotes(c)) {
						p = 51;
						pivot = i;
					} else {
						addConcept(context, input, i, start, p);
					}
					break;
				case 4:
					let startInput = input.substr(pivot);
					let startConnectWord = self.getStartConceptWord(startInput);
					if (startConnectWord) {
						p = 5;
						i += startConnectWord.length - 1;
						continue;
					}

					if (p === 4) {
						addConcept(context, input, pivot, start, p);
						pivot = 0;
					}
					break;
				case 5:
					if (utils.isUpper(c)) {
						p = 1;
					} else {
						addConcept(context, input, pivot, start, p);
						pivot = 0;
					}
					//concept starts with lower
					break;
					// in lower case word
				case 11:
					if (utils.isLower(c) || self.isInConnectChars(c)) {
						p = 11;
					} else if (utils.isUpper(c)) {
						p = 31;
					} else {
						p = 0;
					}
					//concept contains point abbreviation
					break;
				case 21:
					if (utils.isUpper(c)) {
						p = 22;
					} else {
						p = 3;
					}
					break;
				case 22:
					if (c === POINT) {
						p = 21;
					} else if (utils.isLetter(c)) {
						p = 2;
					} else {
						p = 0;
					}
					//spacial names: abbreviations, etc.
					break;
					// in word upper case
				case 31:
					if (c === SPACE) {
						p = 32;
					} else if (utils.isLetterOrDigit(c)) {
						p = 31;
					} else if (self.isInConnectChars(c)) {
						p = -31;
					} else {
						addConcept(context, input, i + 1, start, p);
					}
					break;
				case -31:
					if (utils.isLetterOrDigit(c)) {
						p = 31;
					} else {
						//start = p = 0;
						addConcept(context, input, i, start, p);
					}
					break;
				case 32:
					if (utils.isUpper(c)) {
						p = 1;
					} else if (utils.isDigit(c)) {
						p = 41;
					} else if (self.isInStartQuotes(c) /* && !_inCharts*/ ) {
						p = 51;
						pivot = i;
					} else {
						addConcept(context, input, i, start, p);
					}
					//number
					break;
				case 41:
					if (!utils.isLetterOrDigit(c)) {
						if (['-', ':'].indexOf(c) >= 0) {
							let spacei = input.substr(start, i - start).lastIndexOf(' ');
							if (spacei > 1) {
								addConcept(context, input, spacei + start + 1, start, p);
							} else {
								start = p = 0;
							}
						} else {
							addConcept(context, input, i + 1, start, p);
						}
					}
					//quotes
					break;
				case 51:
					if (utils.isUpper(c)) {
						p = 52;
					} else {
						addConcept(context, input, pivot, start, p);
					}
					break;
				case 52:
					if (c === SPACE) {
						p = 53;
					} else if (utils.isLetterOrDigit(c) || self.isInConnectChars(c)) {
						p = 52;
					} else if (self.isInEndQuotes(c)) {
						addConcept(context, input, i + 2, start, p);
					} else {
						addConcept(context, input, pivot, start, p);
					}
					break;
				case 53:
					if (utils.isUpper(c)) {
						p = 52;
					} else {
						addConcept(context, input, pivot, start, p);
					}
					break;
			}
		}

		return concepts;
	}
};
