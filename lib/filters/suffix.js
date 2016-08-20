'use strict';

const conceptsData = require('concepts-data');

/**
 * Find concept suffix
 * @author Dumitru Cantea
 * @param  {[type]} concept [description]
 * @param  {[type]} context [description]
 * @return {boolean}
 */
module.exports = function suffix(concepts, context) {
	const sources = conceptsData.getValidSuffixes(context.lang);

	return concepts.filter(function(concept) {
		let text = context.text.substr(concept.index + concept.value.length);

		for (let i = sources.length - 1; i >= 0; i--) {
			let regex = sources[i];

			let result = regex.exec(text);

			if (result) {

				let match = result[0];
				let value = text.substr(0, match.length);

				concept.reset(concept.value + value);

				return concept.isValid();
			}
		}
		return true;
	});
};
