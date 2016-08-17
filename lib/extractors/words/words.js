'use strict';

const debug = require('debug')('concepts:words');

const MAX_LENGTH = 100;
const utils = require('../../utils');
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
		debug('adding new word', word.value);
		if (!word.isValid()) {
			debug('invalid word', word.value);
			return false;
		}

		let length = this.list.length;
		if (length > 0) {
			let prev = this.list[length - 1];
			prev.rightText = this.context.text.substring(prev.index + prev.value.length, word.index);
		}

		this.list.push(word);

		debug('added new word', word.value);

		return true;
	}

	concepts(options) {
		debug('generating concepts');
		const concepts = new Concepts(this.context);

		if (this.list.length === 0) {
			return concepts;
		}

		let index = 0;

		for (let i = 0; i < this.list.length; i++) {
			let word = this.list[i];
			index = index || word.index;
			// is NOT connect
			if (!word.rightText || !/^[ ]+$/.test(word.rightText) && !this.options.acceptConceptWordsRegex2.test(word.rightText)) {
				let text = this.context.text.substring(index, word.index + word.value.length);
				let concept = new Concept(text, index, this.context);
				concepts.add(concept);
				index = 0;
			}
		}

		debug('generated concepts');

		return concepts;
	}

	static create(text, index, context) {
		return new Word(text, index, context);
	}

};
