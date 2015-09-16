'use strict';

var utils = require('./utils');
var conceptData = require('concept-data');

// utils ======================================
var correctText = utils.correctText;

function normalizeContext(context) {
	var text = correctText(context.text, context.lang) + '..';

	//text.normalize();

	text = text.replace(/\r/g, '');
	text = text.replace(/\t/g, ' ');
	text = text.replace(/\n{2,}/g, '\n');
	text = text.replace(/\s+\n/g, '\n');
	text = text.replace(/\n\s+/g, '\n');
	text = text.replace(/\n{2,}/g, '\n');
	text = text.replace(/ {2,}/g, ' ');

	context.text = text.trim();
}


function explore(context, mode) {

	var Extractor = require('./extractors/default_extractor');

	var extractor = new Extractor({
		acceptConceptWords: conceptData.getConnectWords(context.lang)
	});

	normalizeContext(context);

	var concepts = extractor.extract(context);

	if (concepts && concepts.length > 0) {
		var filterer = require('./filterer');
		concepts = filterer.filter(concepts, context, mode);
	}

	// remove '..' from the end
	context.text = context.text.substr(0, context.text.length - 2);

	return concepts;
}

// exports ====================================

exports.explore = explore;
