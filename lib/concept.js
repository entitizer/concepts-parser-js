'use strict';

const MAX_LENGTH = 100;
const utils = require('./utils');

module.exports = class Concept {
	constructor(value, index, context) {
		this.reset(value, index);
		if (context) {
			this.context = utils.pick(context, ['lang', 'country']);
		}
	}

	setAbbr(abbr) {
		this.abbr = abbr;
	}

	setAttr(name, value) {
		this.attr[name] = value;
	}

	getAttr(name) {
		return this.attr[name];
	}

	reset(value, index) {
		this.attr = {};
		this.value = value;
		if (typeof index === 'number' && index > -1) {
			this.index = index;
		} else {
			this.index = this.index || 0;
		}
		this.endIndex = this.index + this.value.length;

		const words = value.split(/[ ]+/g);
		this.atonic = utils.atonic(value);
		if (words.length === 1 && value === value.toUpperCase()) {
			this.setAttr('isAbbr', true);
		}
		this.setAttr('words', words.length);
		if (words.length > 1) {
			if (utils.isDigit(words[words.length - 1])) {
				this.setAttr('endsWithNumber', true);
			}
		}
		if (value[value.length - 1] === '.') {
			this.setAttr('endsWithDot', true);
		}
	}

	normalize() {
		let value = this.value.replace(/’/g, '\'').replace(/“/g, '"').replace(/”/g, '"').replace(/„/g, '"');
		if (value !== this.value) {
			this.name = value;
		}
	}

	isValid() {
		let value = this.value;
		if (!value || value.length < 2 || value.length > MAX_LENGTH || utils.isDigit(value)) {
			return false;
		}

		if (value.length !== value.trim().length) {
			//throw new Error('Trim value is not === with value: "'+ value+'"');
			return false;
		}

		if (value.length === 2 && utils.isPunctuation(value[1])) {
			return false;
		}

		return true;
	}

	split(lang) {
		let splitter = require('./splitter');
		return splitter.split(this, lang);
	}

};
