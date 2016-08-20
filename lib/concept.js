'use strict';

const MAX_LENGTH = 100;
const utils = require('./utils');

function Concept(value, index, context) {
	this.reset(value, index);
	if (context) {
		this.context = utils.pick(context, ['lang', 'country']);
	}
}

Concept.prototype.split = function(lang) {
	let spliter = require('./spliter');
	return spliter.split(this, lang);
};

Concept.prototype.reset = function(value, index) {
	this.attr = {};
	this.value = value;
	if (typeof index === 'number' && index > -1) {
		this.index = index;
	} else {
		this.index = this.index || 0;
	}
	this.atonic = utils.atonic(value);
	this.attr.isAbbr = value === value.toUpperCase();
	let words = value.split(/[ ]+/g);
	this.attr.countWords = words.length;
	if (words.length > 1) {
		if (utils.isDigit(words[words.length - 1])) {
			this.attr.endsWithNumber = true;
		}
	}
};

Concept.prototype.normalize = function() {
	let value = this.value.replace(/’/g, '\'').replace(/“/g, '"').replace(/”/g, '"').replace(/„/g, '"');
	if (value !== this.value) {
		this.name = value;
	}
};

Concept.prototype.isValid = function() {
	let value = this.value;
	if (!value || value.length < 2 || value.length > MAX_LENGTH || utils.isDigit(value)) {
		return false;
	}

	// if (utils.isLower(value)) {
	// 	return false;
	// }

	if (value.length !== value.trim().length) {
		//throw new Error('Trim value is not === with value: "'+ value+'"');
		return false;
	}

	if (value.length === 2 && utils.isPunctuation(value[1])) {
		return false;
	}

	return true;
};


// exports: ================================

module.exports = Concept;
