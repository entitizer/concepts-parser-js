'use strict';

const debug = require('debug')('concepts:parser');
const utils = require('./utils');
const conceptsData = require('concepts-data');
const Extractor = require('./extractors/words/extractor');

const OPTIONS = {};

// parse ======================================
function parse(context, options) {
	debug('start parsing');
	options = options || OPTIONS;

	let extractor = new Extractor({
		acceptConceptWords: conceptsData.getConnectWords(context.lang)
	});

	let concepts = extractor.extract(context);
	debug('end parsing');
	concepts = concepts.filter(options);

	return concepts;
}

// exports ====================================

exports.parse = parse;
