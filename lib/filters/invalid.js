
const conceptsData = require('concepts-data');

/**
 * Filter invalid concepts
 */
module.exports = function invalid(concepts, context) {
	const sources = conceptsData.getInvalidConcepts(context.lang);
	return concepts.filter(function(concept) {
		for (var i = sources.length - 1; i >= 0; i--) {
			if (sources[i].test(concept.atonic)) {
				return false;
			}
		}
		return true;
	});
};
