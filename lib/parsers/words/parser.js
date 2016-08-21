'use strict';

const BaseParser = require('../base');
const utils = require('../../utils');
const Words = require('./words');

const P_START = 0;
const P_WORD = 1;
const P_PUNCT = 2;

module.exports = class Parser extends BaseParser {

	parse(context) {
		const input = context.text;
		let start = 0;
		let p = P_START;
		let isConcept = false;
		const words = new Words(this.options, context);

		function addWord(i) {
			if (isConcept) {
				let text = input.substr(start, i - start);
				// console.log('text `' + text + '`');
				words.add(Words.create(text, start, context));
			}
			p = P_START;
			isConcept = false;
		}

		for (let i = 0; i < input.length; i++) {
			const c = input[i];
			if (p === P_START) {
				if (this.isValidStartWordChar(c) || utils.isDigit(c)) {
					start = i;
					p = P_WORD;
					isConcept = utils.isUpper(c) || utils.isDigit(c);
					if (i === input.length - 1) {
						addWord(i + 1);
					}
				}
			} else if (p === P_WORD) {
				if (this.isValidWordChar(c)) {
					isConcept = isConcept || utils.isUpper(c);
					if (i === input.length - 1) {
						addWord(i + 1);
					} else if (this.isInConnectChars(c)) {
						p = P_PUNCT;
					}
				} else if (this.isInEndQuotes(c)) {
					addWord(i + 1);
				} else {
					addWord(i);
				}
			} else if (p === P_PUNCT) {
				if (this.isInConnectChars(c) || utils.isPunctuation(c)) {
					addWord(i - 1);
				} else if (utils.isLetterOrDigit(c)) {
					p = P_WORD;
				} else {
					addWord(i);
				}
			}
		}

		return words.concepts();
	}
};
