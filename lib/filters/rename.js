'use strict';

const conceptsData = require('concepts-data');

/**
 * Rename a concept
 * @author Dumitru Cantea
 * @param  {[type]} concept [description]
 * @param  {[type]} context [description]
 * @return {boolean} Renamed concept
 */
module.exports = function rename(concept, context) {
	const rules = conceptsData.getRenameConcepts(context.lang, context.country);

	for (var i = 0; i < rules.length; i++) {
		if (rules[i].reg.test(concept.atonic)) {
			concept.name = rules[i].name;
			return true;
		}
	}

	return true;
};
