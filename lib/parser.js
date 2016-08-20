'use strict';

const debug = require('debug')('concepts:parser');
const conceptsData = require('concepts-data');
const Parser = require('./parsers/words/parser');

const OPTIONS = {};

// parse ======================================
function parse(context, options) {
	debug('start parsing');
	options = options || OPTIONS;

	let parser = new Parser({
		acceptConceptWords: conceptsData.getConnectWords(context.lang)
	});

	let concepts = parser.parse(context);
	debug('end parsing');
	concepts = concepts.filter(options);

	return concepts;
}

// exports ====================================

exports.parse = parse;
