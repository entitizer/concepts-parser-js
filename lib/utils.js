'use strict';

const atonic = require('atonic');

function isLetter(s) {
	return s.toUpperCase() !== s.toLowerCase();
}

function isUpper(s) {
	return isLetter(s) && s.toUpperCase() === s;
}

function isLower(s) {
	return isLetter(s) && s === s.toLowerCase();
}

function isDigit(s) {
	return /^\d+$/.test(s);
}

function isLetterOrDigit(s) {
	return isDigit(s) || isLetter(s);
}

function isPunctuation(s) {
	return /[!"#%&'\(\)\*,\.\/:\?@\[\]\\_{}-]/.test(s);
}

// function isStopPunctuation(s) {
// 	return /[!\.\/:\?]/.test(s);
// }

function isSentenceStartingWord(index, text) {
	text = text.substr(0, index);
	if (text.length === 0 || /\n[ \t]*$/.test(text) || text.trim().length === 0) {
		return true;
	}
	text = text.trim();
	let last = text[text.length - 1];
	return /^[!\.\?;-]$/.test(last);
}

function defaults(target, source) {
	for (let prop in source) {
		if (typeof target[prop] === 'undefined') {
			target[prop] = source[prop];
		}
	}

	return target;
}

// exports =================================================

exports.isLetter = isLetter;
exports.isDigit = isDigit;
exports.isLetterOrDigit = isLetterOrDigit;
exports.isLower = isLower;
exports.isUpper = isUpper;
exports.isPunctuation = isPunctuation;
exports.atonic = atonic;
exports.isSentenceStartingWord = isSentenceStartingWord;
exports.defaults = defaults;
