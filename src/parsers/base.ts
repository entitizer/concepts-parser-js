'use strict';

import * as utils from '../utils';
import { Concept } from '../concept';
import { Context } from '../context';
import { Concepts } from '../concepts';

export type ParserOptions = {
	acceptConceptWords?: string[];
	acceptConnectChars?: string[];
	acceptStartQuotes?: string[];
	acceptEndQuotes?: string[];
	acceptPrefixes?: string[];
	acceptConceptWordsRegex?: RegExp;
	acceptConceptWordsRegex2?: RegExp;
};

export abstract class BaseParser {
	options: ParserOptions;
	constructor(options?: ParserOptions) {
		options = options || {};
		options = {
			acceptConceptWords: [],
			acceptConnectChars: ['&', '-', '\'', '.', '’', '`'],
			acceptStartQuotes: ['"', '“', '”', '„', '«'],
			acceptEndQuotes: ['"', '“', '”', '„', '»'],
			acceptPrefixes: [],
			...options
		};

		if (options.acceptConceptWords) {
			options.acceptConceptWords.sort(function (a, b) {
				return b.length - a.length;
			});
		}

		options.acceptConceptWordsRegex = new RegExp('^(' + options.acceptConceptWords.join('|') + ') ');
		options.acceptConceptWordsRegex2 = new RegExp('^[ ](' + options.acceptConceptWords.join('|') + ')[ ]$');

		this.options = options;
	}

	abstract parse(context: Context): Concepts;

	isIn(name: string, value: string): boolean {
		var options: any = this.options;
		return options[name].indexOf(value) >= 0;
	}

	isInConnectChars(value: string): boolean {
		return this.isIn('acceptConnectChars', value);
	}

	isInStartQuotes(value: string): boolean {
		return this.isIn('acceptStartQuotes', value);
	}

	isInEndQuotes(value: string): boolean {
		return this.isIn('acceptEndQuotes', value);
	}

	isInPrefixes(value: string): boolean {
		return this.isIn('acceptPrefixes', value);
	}

	isInConceptWords(value: string): boolean {
		return this.isIn('acceptConceptWords', value);
	}

	getStartConceptWord(value: string): string {
		let result = this.options.acceptConceptWordsRegex.exec(value);
		if (result) {
			return result[1];
		}
		return null;
	}

	formatConcept(context: Context, input: String, i: number, start: number): Concept {
		let text: string = input.substr(start, i - start - 1);

		return new Concept({ value: text, index: start, context });
	}

	isValidWordChar(c: string): boolean {
		if (utils.isLetterOrDigit(c)) {
			return true;
		}
		return this.options.acceptConnectChars.indexOf(c) > -1;
	}

	isValidStartWordChar(c: string): boolean {
		return utils.isLetterOrDigit(c);
	}

	isWordsSeparatorChar(c: string): boolean {
		return /[\s]/.test(c);
	}

	isLowerStartUpperWord(text: string, index: number): boolean {
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
