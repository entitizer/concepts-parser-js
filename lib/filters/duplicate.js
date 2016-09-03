
/**
 * Filter dublicate concepts
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
