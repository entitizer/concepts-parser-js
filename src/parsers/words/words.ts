'use strict';

const debug = require('debug')('concepts:words');

import { Word } from './word';
import { Context } from '../../context';
import { Concept } from '../../concept';
import { Concepts } from '../../concepts';
import { ParserOptions } from '../base';

export class Words {
	private options: ParserOptions;
	private context: Context;
	private list: Word[];

	constructor(options: ParserOptions, context: Context) {
		this.options = options;
		this.context = context;
		this.list = [];
	}

	all(): Word[] {
		return this.list;
	}

	add(word: Word) {
		// debug('adding new word', word.value);
		if (!word.isValid()) {
			// debug('invalid word', word.value);
			return false;
		}

		if (word.isNumber) {
			const prev = this.list.length && this.list[this.list.length - 1] || null;
			if (!prev || prev.isNumber) {
				return false;
			}
		}

		let length = this.list.length;
		if (length > 0) {
			let prev = this.list[length - 1];
			prev.rightText = this.context.text.substring(prev.index + prev.value.length, word.index);
		}

		this.list.push(word);

		// debug('added new word', word.value);

		return true;
	}

	concepts(): Concepts {
		debug('generating concepts');
		const concepts = new Concepts(this.context);

		if (this.list.length === 0) {
			return concepts;
		}

		let index = 0;
		let firstWord = true;
		// let prev;

		for (let i = 0; i < this.list.length; i++) {
			const word = this.list[i];
			if (firstWord) {
				index = word.index;
			}
			const connectingWords = word.rightText && (/^[ ]$/.test(word.rightText) || this.options.acceptConceptWordsRegex2.test(word.rightText));

			if (connectingWords) {
				firstWord = false;
			} else {
				const text = this.context.text.substring(index, word.index + word.value.length);
				// debug('added concept', text, word.rightText, index, word.value);
				const concept = new Concept({ value: text, index, context: this.context });
				concepts.add(concept);
				firstWord = true;
			}
			// prev = word;
		}

		debug('generated concepts');

		return concepts;
	}

	static create(text: string, index: number, context: Context): Word {
		return new Word(text, index, context);
	}

};
