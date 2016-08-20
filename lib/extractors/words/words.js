'use strict';

// const debug = require('debug')('concepts:words');

const Word = require('./word');
const Concepts = require('../../concepts');
const Concept = require('../../concept');

module.exports = class Words {
	constructor(options, context) {
		this.options = options;
		this.context = context;
		this.list = [];
	}

	all() {
		return this.list;
	}

	add(word) {
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

	concepts() {
		// debug('generating concepts');
		const concepts = new Concepts(this.context);

		if (this.list.length === 0) {
			return concepts;
		}

		let index = 0;
		let firstWord = true;
		let prev;

		for (let i = 0; i < this.list.length; i++) {
			let word = this.list[i];
			if (firstWord) {
				index = word.index;
			}
			// is NOT connect
			if (!word.rightText || !/^[ ]+$/.test(word.rightText) && !this.options.acceptConceptWordsRegex2.test(word.rightText)) {
				let text = this.context.text.substring(index, word.index + word.value.length);
				// debug('added concept', text, word.rightText, index);
				let concept = new Concept(text, index, this.context);
				concepts.add(concept);
				firstWord = true;
			} else {
				firstWord = false;
			}
			prev = word;
		}

		// debug('generated concepts');

		return concepts;
	}

	static create(text, index, context) {
		return new Word(text, index, context);
	}

};
