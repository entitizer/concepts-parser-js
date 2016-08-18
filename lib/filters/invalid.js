'use strict';

const conceptsData = require('concepts-data');

/**
 * Filter invalid concept
 * @author Dumitru Cantea
 * @param  {[type]} concept [description]
 * @param  {[type]} context [description]
 * @return {boolean}
 */
module.exports = function invalid(concept, context) {
	const sources = conceptsData.getInvalidConcepts(context.lang);

	for (var i = sources.length - 1; i >= 0; i--) {
		if (sources[i].test(concept.atonic)) {
			return false;
		}
	}
	return true;
};
