'use strict';
/**
 * Filter dublicate concepts
 * @author Dumitru Cantea
 * @param  {[type]} concepts [description]
 * @return {Concept[]} Filtered concepts
 */
module.exports = function duplicate(concepts) {
	let keys = {};
	return concepts.filter(function(concept) {
		let key = concept.atonic.toLowerCase();
		if (keys[key]) {
			return false;
		}
		keys[key] = true;
		return true;
	});
};
