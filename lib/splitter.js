
const conceptsData = require('concepts-data');
const utils = require('./utils');
const isLower = utils.isLower;
const Concept = require('./concept');

/**
 * Determines if a splited concept is valid
 * @param  {Object}  concept Splited concept
 * @return {Boolean}         Is valid or not
 */
function isValid(concept) {
	let parts = concept.value.split(/ /g);
	if (isLower(parts[0]) || parts.length > 0 && isLower(parts[parts.length - 1])) {
		return false;
	}
	return concept.isValid();
}

/**
 * Creates a new concept
 * @param  {String} value    Concept value
 * @param  {Number} index    Concept index
 * @param  {Object} context  Concept context
 * @return {Object}          Created concept
 */
function createConcept(value, index, context) {
	return new Concept(value, index, context);
}

/**
 * Identify if a concept can be splited
 * @param  {Object} concept The concept
 * @return {Boolean} Can be splited or not
 */
function canSplit(concept) {
	// a connect has a known name
	if (concept.getAttr('isKnown')) {
		return false;
	}
	return concept.value.length > 4 && concept.value.indexOf(' ') > 2;
}

/**
 * Creates 2 concepts from a concept
 * @param  {Array}  list      Concepts container
 * @param  {Object} concept   Concept to be splited
 * @param  {String} separator Concepts separator
 * @param  {Number} index     Separator index
 * @return {Array}            Concepts container
 */
function createConcepts(concept, separator, index) {
	const list = [];
	let c = createConcept(concept.value.substr(0, index), concept.index, concept.context);
	if (isValid(c)) {
		list.push(c);
	}
	index += separator.length;
	c = createConcept(concept.value.substr(index), concept.index + index, concept.context);
	if (isValid(c)) {
		list.push(c);
	}
	return list;
}

/**
 * Splits a concept by words
 * @param  {Object} concept Concept to be splited
 * @param  {String} lang    2 letters language code
 * @param  {Array}  words   A list of words to split concept
 * @return {Array}          A splited array of concepts
 */
function splitByWords(concept, lang, words) {
	let index;
	let word;

	for (let i = 0; i < words.length; i++) {
		word = ' ' + words[i] + ' ';
		index = concept.value.indexOf(word);
		if (index > 0) {
			return createConcepts(concept, word, index);
		}
	}

	return [];
}

/**
 * Simple concept split
 * @param  {Object} concept Concept to split
 * @return {Array}         	A splited array of concepts
 */
function simpleSplit(concept) {
	let list = [];
	const space = ' ';
	let index = concept.value.indexOf(space);
	if (index > 0) {
		list = list.concat(createConcepts(concept, space, index));
		let i = concept.value.lastIndexOf(space);
		if (i > index) {
			list = list.concat(createConcepts(concept, space, i));
		}
	}

	return list;
}

/**
 * Split a concept
 * @param  {Object} concept Concept to be splited
 * @param  {String} lang    Language
 * @return {Array}          A splited array of concepts
 */
function split(concept, lang) {
	let list = [];
	if (!canSplit(concept)) {
		return list;
	}

	lang = lang || concept.context.lang;

	const splitWords = conceptsData.getSplitWords(lang);

	list = splitByWords(concept, lang, splitWords);

	if (list.length === 0) {
		list = list.concat(simpleSplit(concept));
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
