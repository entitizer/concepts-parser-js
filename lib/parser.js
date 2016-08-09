'use strict';

var utils = require('./utils');
var conceptsData = require('./data');

var OPTIONS = {
	mode: utils.MODE_IDENTIFY,
	normalizeText: true
};

// utils ======================================
var correctText = utils.correctText;

function normalizeText(context) {
	var text = context.text;

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

	context.text = correctText(context.text, context.lang);
	// add `end`
	context.text += '..';


	var Extractor = require('./extractors/default_extractor');

	var extractor = new Extractor({
		acceptConceptWords: conceptsData.getConnectWords(context.lang)
	});

	if (options.normalizeText) {
		normalizeText(context);
	}

	var concepts = extractor.extract(context);

	if (concepts && concepts.length > 0) {
		var filterer = require('./filterer');
		concepts = filterer.filter(concepts, context, options.mode);
	}

	// remove '..' from the end
	context.text = context.text.substr(0, context.text.length - 2);

	return concepts;
}

// exports ====================================

exports.parse = parse;
