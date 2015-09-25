'use strict';

var atonic = require('atonic');

var OBJ_ROMANIAN_CORRECT = {
	'ș': /ş/g,
	'Ș': /Ş/g,
	'ț': /ţ/g,
	'Ț': /Ţ/g
};

function replaceAll(obj, text) {
	for (var prop in obj) {
		text = text.replace(obj[prop], prop);
	}
	return text;
}

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

function correctText(s, lang) {
	if (!s) {
		return s;
	}
	if (lang === 'ro') {
		return replaceAll(OBJ_ROMANIAN_CORRECT, s);
	}
	return s;
}

function isSentenceStartingWord(index, text) {
	text = text.substr(0, index);
	if (text.length === 0 || /\n[ \t]*$/.test(text) || text.trim().length === 0) {
		return true;
	}
	text = text.trim();
	var last = text[text.length - 1];
	return /^[!\.\?;-]$/.test(last);
}

// exports =================================================

exports.isLetter = isLetter;
exports.isDigit = isDigit;
exports.isLetterOrDigit = isLetterOrDigit;
exports.isLower = isLower;
exports.isUpper = isUpper;
exports.isPunctuation = isPunctuation;
exports.correctText = correctText;
exports.atonic = atonic;
exports.isSentenceStartingWord = isSentenceStartingWord;
