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
		this.atonic = utils.atonic(value);
		this.setAttr('isAbbr', value === value.toUpperCase());
		let words = value.split(/[ ]+/g);
		this.setAttr('countWords', words.length);
		if (words.length > 1) {
			if (utils.isDigit(words[words.length - 1])) {
				this.setAttr('endsWithNumber', true);
			}
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
		let spliter = require('./spliter');
		return spliter.split(this, lang);
	}

};
