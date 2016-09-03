
const conceptsData = require('concepts-data');
const Concept = require('../concept');

/**
 * Find known concepts
 */
module.exports = function known(concepts, context) {
	let sources = conceptsData.getKnownConcepts(context.lang);

	let newconcepts = [];

	sources.forEach(function(source) {
		let result;

		while ((result = source.reg.exec(context.text)) !== null) {
			let match = result[0];
			let value = context.text.substr(result.index + 1, match.length - 1);

			let concept = new Concept(value, result.index + 1, context);

			if (concept.isValid()) {
				concept.setAttr('isKnown', true);
				newconcepts.push(concept);
			}
		}
	});

	if (newconcepts.length > 0) {
		concepts = concepts.filter(function(concept) {
			return !newconcepts.some(function(c) {
				return concept.index >= c.index && concept.index + concept.value.length <= c.index + c.value.length;
			});
		});

		concepts = concepts.concat(newconcepts)
			.sort((a, b) => {
				return a.index - b.index;
			});
	}

	return concepts;
};
