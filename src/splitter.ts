
import * as conceptsData from 'concepts-data';
import { isLower } from './utils';
import { Concept } from './concept';

/**
 * Determines if a splited concept is valid
 * @param  {Object}  concept Splited concept
 * @return {Boolean}         Is valid or not
 */
function isValid(concept: Concept): boolean {
	// let parts = concept.value.split(/ /g);
	if (isLower(concept.value)) {
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
function createConcept(value: string, index: number, lang: string): Concept {
	return new Concept({ value, index, lang });
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
	let list: Concept[] = [];

	let c = createConcept(concept.value.substr(0, index), concept.index, concept.lang);
	if (isValid(c)) {
		if (c.countWords > 1 && endsWithLowercaseWord(c.value)) {
			list = list.concat(createConcepts(c, ' ', c.value.lastIndexOf(' ')));
		} else {
			list.push(c);
		}
	}
	index += separator.length;
	c = createConcept(concept.value.substr(index), concept.index + index, concept.lang);
	if (isValid(c)) {
		if (c.countWords > 1 && startsWithLowercaseWord(c.value)) {
			list = list.concat(createConcepts(c, ' ', c.value.indexOf(' ')));
		} else {
			list.push(c);
		}
	}
	return list;
}

function endsWithLowercaseWord(text: string) {
	const words = text.split(/\s+/g);
	return words[words.length - 1].toLowerCase() === words[words.length - 1];
}
function startsWithLowercaseWord(text: string) {
	const words = text.split(/\s+/g);
	return words[0].toLowerCase() === words[0];
}

/**
 * Splits a concept by words
 * @param  {Object} concept Concept to be splited
 * @param  {Array}  words   A list of words to split concept
 * @return {Array}          A splited array of concepts
 */
export function splitByWords(concept: Concept, words?: string[]): Concept[] {
	let index: number;
	let word: string;

	if (!words) {
		words = conceptsData.getSplitWords(concept.lang);
	}

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

	list = uniqConcepts(list);

	return list;
}

/**
 * Split a concept
 * @param  {Object} concept Concept to be splited
 * @param  {String} lang    Language
 * @return {Array}          A splited array of concepts
 */
export function split(concept: Concept): Concept[] {
	let list: Concept[] = [];
	if (!canSplit(concept)) {
		return list;
	}

	list = splitByWords(concept);

	if (list.length === 0) {
		list = list.concat(simpleSplit(concept));
	}

	return list;
}

function uniqConcepts(list: Concept[]) {
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
