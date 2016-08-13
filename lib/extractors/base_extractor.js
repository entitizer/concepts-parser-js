'use strict';

const Concept = require('../concept');
const utils = require('../utils');

module.exports = class Extractor {
	constructor(options) {
		options = options || {};
		if (options.acceptConceptWords) {
			options.acceptConceptWords.sort(function(a, b) {
				return b.length - a.length;
			});
		}
		options.acceptConceptWords = options.acceptConceptWords || [];
		options.acceptConnectChars = options.acceptConnectChars || ['&', '-', '\'', '.', '’', '`'];
		options.acceptStartBrackets = options.acceptStartBrackets || ['"', '“', '”', '„', '«'];
		options.acceptEndBrackets = options.acceptEndBrackets || ['"', '“', '”', '„', '»'];
		options.acceptPrefixes = options.acceptPrefixes || [];
		options.acceptConceptWordsRegex = options.acceptConceptWords.join('|');
		options.acceptConceptWordsRegex = new RegExp('^(' + options.acceptConceptWordsRegex + ') ');

		this.options = options;
	}

	isIn(name, value) {
		return this.options[name].indexOf(value) >= 0;
	}

	isInConnectChars(value) {
		return this.isIn('acceptConnectChars', value);
	}

	isInStartBrackets(value) {
		return this.isIn('acceptStartBrackets', value);
	}

	isInEndBrackets(value) {
		return this.isIn('acceptEndBrackets', value);
	}

	isInPrefixes(value) {
		return this.isIn('acceptPrefixes', value);
	}

	isInConceptWords(value) {
		return this.isIn('acceptConceptWords', value);
	}

	getStartConceptWord(value) {
		let result = this.options.acceptConceptWordsRegex.exec(value);
		if (result) {
			return result[1];
		}
		return null;
	}

	formatConcept(context, input, i, start) {
		let text = input.substr(start, i - start - 1);

		return new Concept(text, start, context);
	}

	isValidWordChar(c) {
		if (utils.isLetterOrDigit(c)) {
			return true;
		}
		let acc = this.options.acceptConnectChars;
		for (let i = 0; i < acc.length; i++) {
			if (c === acc[i]) {
				return true;
			}
		}
		return false;
	}

	isLowerStartUpperWord(text, index) {
		let t = text.substr(index).trim();
		for (let i = 0; i < t.length; i++) {
			let c = t[i];
			if (!this.isValidWordChar(c)) {
				return false;
			}
			if (utils.isUpper(c)) {
				return true;
			}
		}
		return false;
	}
};
