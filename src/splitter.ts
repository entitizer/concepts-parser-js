'use strict';

const conceptsData = require('concepts-data');
import { isLower } from './utils';
import { Concept } from './concept';
import { Context } from './context';

/**
 * Determines if a splited concept is valid
 * @param  {Object}  concept Splited concept
 * @return {Boolean}         Is valid or not
 */
function isValid(concept: Concept): boolean {
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
function createConcept(value: string, index: number, context: Context): Concept {
	return new Concept({ value: value, index: index, context: { lang: context.lang, country: context.country } });
}

/**
 * Identify if a concept can be splited
 * @param  {Object} concept The concept
 * @return {Boolean} Can be splited or not
 */
function canSplit(concept: Concept): boolean {
	// a connect has a known name
	if (concept.get('isKnown')) {
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
function createConcepts(concept: Concept, separator: string, index: number): Concept[] {
	const list: Concept[] = [];
	const context: any = { lang: concept.context.lang, text: concept.context.text, country: concept.context.country };
	let c = createConcept(concept.value.substr(0, index), concept.index, context);
	if (isValid(c)) {
		list.push(c);
	}
	index += separator.length;
	c = createConcept(concept.value.substr(index), concept.index + index, context);
	if (isValid(c)) {
		list.push(c);
	}
	return list;
}

/**
 * Splits a concept by words
 * @param  {Object} concept Concept to be splited
 * @param  {Array}  words   A list of words to split concept
 * @return {Array}          A splited array of concepts
 */
export function splitByWords(concept: Concept, words: string[]): Concept[] {
	let index: number;
	let word: string;

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
export function simpleSplit(concept: Concept): Concept[] {
	let list: Concept[] = [];
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
export function split(concept: Concept, lang?: string): Concept[] {
	let list: Concept[] = [];
	if (!canSplit(concept)) {
		return list;
	}

	lang = lang || concept.context.lang;

	const splitWords = conceptsData.getSplitWords(lang);

	list = splitByWords(concept, splitWords);

	if (list.length === 0) {
		list = list.concat(simpleSplit(concept));
	}

	let keys: any = {};
	let key: string;

	list = list.filter(function (item) {
		key = item.index + item.value;
		if (!keys[key]) {
			keys[key] = true;
			return true;
		}
		return false;
	});

	return list;
}
