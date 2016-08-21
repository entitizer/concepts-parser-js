'use strict';

const conceptsData = require('concepts-data');
const utils = require('./utils');
const isLower = utils.isLower;
const Concept = require('./concept');

function isValid(concept) {
	let parts = concept.value.split(/ /g);
	if (isLower(parts[0]) || parts.length > 0 && isLower(parts[parts.length - 1])) {
		return false;
	}
	return concept.isValid();
}

function createConcept(text, index, context) {
	return new Concept(text, index, context);
}

function canSplit(concept) {
	// a connect has a known name
	if (concept.getAttr('isKnown')) {
		return false;
	}
	return concept.value.length > 4 && concept.value.indexOf(' ') > 2;
}

function createConcepts(list, concept, word, index) {
	let c = createConcept(concept.value.substr(0, index), concept.index, concept.context);
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
	let list = [],
		index, word;

	for (let i = 0; i < words.length; i++) {
		word = ' ' + words[i] + ' ';
		index = concept.value.indexOf(word);
		if (index > 0) {
			createConcepts(list, concept, word, index);
		}
	}

	return list;
}

function simpleSplit(concept, word) {
	let list = [];
	word = word || ' ';
	let index = concept.value.indexOf(word);
	if (index > 0) {
		createConcepts(list, concept, word, index);
		let i = concept.value.lastIndexOf(word);
		if (i > index) {
			createConcepts(list, concept, word, i);
		}
	}

	return list;
}

function split(concept, lang) {
	let list = [];
	if (!canSplit(concept)) {
		return list;
	}

	lang = lang || concept.context.lang;

	let splitWords = conceptsData.getSplitWords(lang);

	list = splitByWords(concept, lang, splitWords);

	if (list.length === 0) {
		let slist = simpleSplit(concept);
		list = list.concat(slist);
	}

	let keys = {},
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
