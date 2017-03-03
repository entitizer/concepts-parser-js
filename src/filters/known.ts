'use strict';

const conceptsData = require('concepts-data');
import { Concept } from '../concept';
import { Context } from '../context';

/**
 * Find known concepts
 */
export function filter(concepts: Concept[], context: Context): Concept[] {
	let sources: any = conceptsData.getKnownConcepts(context.lang);

	let newconcepts: any[] = [];

	sources.forEach(function (source: any) {
		let result:RegExpExecArray;

		while ((result = source.reg.exec(context.text)) !== null) {
			let match = result[0];
			let value = context.text.substr(result.index + 1, match.length - 1);

			let concept = new Concept({ value: value, index: result.index + 1, context: context });

			if (concept.isValid()) {
				concept.set('isKnown', true);
				newconcepts.push(concept);
			}
		}
	});

	if (newconcepts.length > 0) {
		concepts = concepts.filter(function (concept) {
			return !newconcepts.some(function (c) {
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
