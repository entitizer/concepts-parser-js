'use strict';

const conceptsData = require('concepts-data');

/**
 * Filter partial concepts
 */
module.exports = function partial(concepts, context) {
	const sources = conceptsData.getPartialConcepts(context.lang);

	return concepts.filter(function(concept) {

		for (let i = sources.length - 1; i >= 0; i--) {
			if (sources[i].test(concept.atonic)) {
				concept.isPartial = true;
				return false;
			}
		}

		return true;
	});
};
