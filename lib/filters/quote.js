
const quoteReg = /["“”„«»]/;

/**
 * Filter invalid concepts
 */
module.exports = function quote(concepts) {
	return concepts.filter(function(concept) {
		// start with quote
		if (quoteReg.test(concept.value[0])) {
			// ends with quote
			if (quoteReg.test(concept.value[concept.value.length - 1])) {
				return true;
			}
			concept.reset(concept.value.substr(1));
			return concept.isValid();
		}
		return !quoteReg.test(concept.value[concept.value.length - 1]);
	});
};
