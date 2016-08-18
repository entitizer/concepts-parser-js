'use strict';

const conceptsData = require('concepts-data');

/**
 * Find concept prefix
 * @author Dumitru Cantea
 * @param  {[type]} concept [description]
 * @param  {[type]} context [description]
 * @return {boolean}
 */
module.exports = function invalidPrefix(concept, context) {
	const sources = conceptsData.getInvalidPrefixes(context.lang);

	for (let i = sources.length - 1; i >= 0; i--) {
		let regex = sources[i];

		let result = regex.exec(concept.atonic);

		if (result) {
			let match = result[0];
			let value = concept.value.substr(match.length);

			concept.reset(value, concept.index + match.length);

			return concept.isValid();
		}
	}
	return true;
};
