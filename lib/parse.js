
const debug = require('debug')('concepts:parser');
const conceptsData = require('concepts-data');
const Parser = require('./parsers/words/parser');

module.exports = function parse(context, options) {
	debug('start parsing');
	options = options || {};

	const parser = new Parser({
		acceptConceptWords: conceptsData.getConnectWords(context.lang)
	});

	let concepts = parser.parse(context);
	debug('end parsing');
	concepts = concepts.filter(options);

	return concepts;
};
