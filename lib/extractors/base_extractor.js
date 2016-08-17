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
		options.acceptStartQuotes = options.acceptStartQuotes || ['"', '“', '”', '„', '«'];
		options.acceptEndQuotes = options.acceptEndQuotes || ['"', '“', '”', '„', '»'];
		options.acceptPrefixes = options.acceptPrefixes || [];
		options.acceptConceptWordsRegex = options.acceptConceptWords.join('|');
		options.acceptConceptWordsRegex = new RegExp('^(' + options.acceptConceptWordsRegex + ') ');
		options.acceptConceptWordsRegex2 = new RegExp('^[ ]+(' + options.acceptConceptWords.join('|') + ')[ ]+$');

		this.options = options;
	}

	isIn(name, value) {
		return this.options[name].indexOf(value) >= 0;
	}

	isInConnectChars(value) {
		return this.isIn('acceptConnectChars', value);
	}

	isInStartQuotes(value) {
		return this.isIn('acceptStartQuotes', value);
	}

	isInEndQuotes(value) {
		return this.isIn('acceptEndQuotes', value);
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
		return ~this.options.acceptConnectChars.indexOf(c);
	}

	isValidStartWordChar(c) {
		return utils.isLetterOrDigit(c);
	}

	isWordsSeparatorChar(c) {
		return /[\s]/.test(c);
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
