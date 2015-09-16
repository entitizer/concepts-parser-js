'use strict';

var Concept = require('../concept');
var utils = require('../utils');

var Extractor = module.exports = function Extractor(options) {
	this.options = options || {};

	if (options && options.acceptConceptWords) {
		options.acceptConceptWords.sort(function(a, b) {
			return a.length - b.length;
		});
	}
	this.options.acceptConceptWords = this.options.acceptConceptWords || [];
	this.options.acceptConnectChars = this.options.acceptConnectChars || ['&', '-', '\'', '.', '’', '`'];
	this.options.acceptStartBrackets = this.options.acceptStartBrackets || ['"', '“', '”', '„', '«'];
	this.options.acceptEndBrackets = this.options.acceptEndBrackets || ['"', '“', '”', '„', '»'];
	this.options.acceptPrefixes = this.options.acceptPrefixes || [];
};

Extractor.prototype.isIn = function(name, value) {
	return this.options[name].indexOf(value) >= 0;
};

Extractor.prototype.isInConnectChars = function(value) {
	return this.isIn('acceptConnectChars', value);
};

Extractor.prototype.isInStartBrackets = function(value) {
	return this.isIn('acceptStartBrackets', value);
};

Extractor.prototype.isInEndBrackets = function(value) {
	return this.isIn('acceptEndBrackets', value);
};

Extractor.prototype.isInPrefixes = function(value) {
	return this.isIn('acceptPrefixes', value);
};

Extractor.prototype.isInConceptWords = function(value) {
	return this.isIn('acceptConceptWords', value);
};

// Extractor.prototype.extract = function(context) {
// 	throw new Error('Not implimented');
// };

Extractor.prototype.formatConcept = function(context, input, i, start) {
	var text = input.substr(start, i - start - 1);

	return new Concept(text, start, context);
};

Extractor.prototype.isValidWordChar = function(c) {
	if (utils.isLetterOrDigit(c)) {
		return true;
	}
	var acc = this.options.acceptConnectChars;
	for (var i = 0; i < acc.length; i++) {
		if (c === acc[i]) {
			return true;
		}
	}
	return false;
};

Extractor.prototype.isLowerStartUpperWord = function(text, index) {
	var t = text.substr(index).trim();
	for (var i = 0; i < t.length; i++) {
		var c = t[i];
		if (!this.isValidWordChar(c)) {
			return false;
		}
		if (utils.isUpper(c)) {
			return true;
		}
	}
	return false;
};
