'use strict';

var conceptData = require('concept-data');
var utils = require('./utils');
var isLower = utils.isLower;
var Concept = require('./concept');

function isValid(concept) {
	var parts = concept.value.split(/ /g);
	if (isLower(parts[0]) || parts.length > 0 && isLower(parts[parts.length - 1])) {
		return false;
	}
	return concept.isValid();
}

function createConcept(text, index, context) {
	return new Concept(text, index, context);
}

function canSplit(concept) {
	return concept.value.length > 4 && concept.value.indexOf(' ') > 2;
}

function createConcepts(list, concept, word, index) {
	var c = createConcept(concept.value.substr(0, index), concept.index, concept.context);
	if (isValid(c)) {
		list.push(c);
	}
	index += word.length;
	c = createConcept(concept.value.substr(index), concept.index + index, concept.context);
	if (isValid(c)) {
		list.push(c);
	}
}

function splitByWords(concept, lang, words) {
	var list = [],
		index, word;

	for (var i = 0; i < words.length; i++) {
		word = ' ' + words[i] + ' ';
		index = concept.value.indexOf(word);
		if (index > 0) {
			createConcepts(list, concept, word, index);
		}
	}

	return list;
}

function simpleSplit(concept, word) {
	var list = [];
	word = word || ' ';
	var index = concept.value.indexOf(word);
	if (index > 0) {
		createConcepts(list, concept, word, index);
		var i = concept.value.lastIndexOf(word);
		if (i > index) {
			createConcepts(list, concept, word, i);
		}
	}

	return list;
}

function split(concept, lang) {
	var list = [];
	if (!canSplit(concept)) {
		return list;
	}

	lang = lang || concept.context.lang;

	var splitWords = conceptData.getSplitWords(lang);

	list = splitByWords(concept, lang, splitWords);

	var slist = simpleSplit(concept, lang);

	list = list.concat(slist);

	var keys = {},
		key;

	list = list.filter(function(item) {
		key = item.index + item.value;
		if (!keys[key]) {
			keys[key] = true;
			return true;
		}
		return false;
	});

	return list;
}

// exports ===========================================

exports.split = split;
exports.splitByWords = splitByWords;
exports.simpleSplit = simpleSplit;
