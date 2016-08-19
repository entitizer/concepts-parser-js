'use strict';

const debug = require('debug')('concepts:parser');
const utils = require('./utils');
const conceptsData = require('concepts-data');
const Extractor = require('./extractors/words/extractor');

const OPTIONS = {
	normalizeText: true
};

// utils ======================================
const correctText = utils.correctText;

function normalizeText(context) {
	let text = context.text;
	text = correctText(text, context.lang);

	text = text.replace(/\r/g, '');
	text = text.replace(/\t/g, ' ');
	text = text.replace(/\n{2,}/g, '\n');
	text = text.replace(/\s+\n/g, '\n');
	text = text.replace(/\n\s+/g, '\n');
	text = text.replace(/\n{2,}/g, '\n');
	text = text.replace(/ {2,}/g, ' ');

	context.text = text.trim();
}

// parse ======================================
function parse(context, options) {
	debug('start parsing');
	options = utils.defaults(options || {}, OPTIONS);

	let extractor = new Extractor({
		acceptConceptWords: conceptsData.getConnectWords(context.lang)
	});

	if (options.normalizeText) {
		normalizeText(context);
	}

	// add `end`
	context.text += '..';

	let concepts = extractor.extract(context);
	debug('end parsing');
	concepts = concepts.filter(options);

	// remove '..' from the end
	context.text = context.text.substr(0, context.text.length - 2);

	return concepts;
}

// exports ====================================

exports.parse = parse;
