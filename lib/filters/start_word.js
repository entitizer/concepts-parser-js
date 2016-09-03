
const utils = require('../utils');

/**
 * Filter concept by start word
 */
module.exports = function startWord(concepts, context) {
	return concepts.filter(function(concept) {
		const words = concept.value.split(/\s+/g);
		return words.length > 1 || words[0].toLowerCase() === words[0] || !utils.isSentenceStartingWord(concept.index, context.text);
	});
};
