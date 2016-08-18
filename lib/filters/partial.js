'use strict';

const conceptsData = require('concepts-data');

/**
 * Filter partial concept
 * @author Dumitru Cantea
 * @param  {[type]} concept [description]
 * @param  {[type]} context [description]
 * @return {boolean}
 */
module.exports = function partial(concept, context) {
	const sources = conceptsData.getPartialConcepts(context.lang);

	for (let i = sources.length - 1; i >= 0; i--) {
		if (sources[i].test(concept.atonic)) {
			concept.isPartial = true;
			return false;
		}
	}

	return true;
};
