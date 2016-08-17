'use strict';

const MAX_LENGTH = 100;
const utils = require('./utils');

function Concept(value, index, context) {
	this.reset(value, index);
	if (context) {
		this.context = {
			country: context.country,
			lang: context.lang
		};
	}
}

Concept.prototype.split = function(lang) {
	let spliter = require('./spliter');
	return spliter.split(this, lang);
};

Concept.prototype.isAbbr = function() {
	return this.value.toUpperCase() === this.value;
};

Concept.prototype.reset = function(value, index) {
	this.value = value;
	if (typeof index === 'number' && index > -1) {
		this.index = index;
	} else {
		this.index = this.index || 0;
	}
	this.atonic = utils.atonic(value);
	let words = value.split(/[ ]+/g);
	this.countWords = words.length;
	if (words.length > 1) {
		if (utils.isDigit(words[words.length - 1])) {
			this.endsWithNumber = true;
		}
	}
	//this._atStart = this._isSpecial = this._isConceptPart = this._atonicName = null;
};

Concept.prototype.normalize = function() {
	let value = this.value.replace(/’/g, '\'').replace(/“/g, '"').replace(/”/g, '"').replace(/„/g, '"');
	if (value !== this.value) {
		this.reset(value);
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
