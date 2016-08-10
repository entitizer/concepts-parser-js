'use strict';

const utils = require('./utils');
const conceptsData = require('concepts-data');
const Extractor = require('./extractors/default_extractor');
const filterer = require('./filterer');

const OPTIONS = {
	mode: utils.MODE_IDENTIFY,
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

	if (concepts && concepts.length > 0) {
		concepts = filterer.filter(concepts, context, options.mode);
	}

	// remove '..' from the end
	context.text = context.text.substr(0, context.text.length - 2);

	return concepts;
}

// exports ====================================

exports.parse = parse;
