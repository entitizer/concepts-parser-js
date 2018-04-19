
const debug = require('debug')('concepts-parser:filters');
import { Concept } from '../concept';
import { Context } from '../types';

const QuotationMarks = [
	['"', '"'],
	['„”“', '”“'],
	['«', '»'],
	['‘', '’'],
];

const QuotationMarksReg = QuotationMarks.map(list => list.map(item => new RegExp(`[${item}]`)));

const StartQuotationMark = QuotationMarks.reduce<string>((str, item) => str += item[0], '');
const StartQuotationMarkReg = new RegExp(`[${StartQuotationMark}]`);

const EndQuotationMark = QuotationMarks.reduce<string>((str, item) => str += item[1], '');
const EndQuotationMarkReg = new RegExp(`[${EndQuotationMark}]`);

/**
 * Filter invalid concepts
 */
export function filter(concepts: Concept[], context: Context): Concept[] {
	const newConcepts: Concept[] = [];
	const text = context.text;
	const textLength = context.text.length;

	concepts.forEach((concept, index) => {
		if (index === 0) {
			newConcepts.push(concept);
			return;
		}
		// debug(`testing ${text[concept.index - 1]} for start with QM`);
		// starts with quotation mark
		if (StartQuotationMarkReg.test(text[concept.index - 1])) {
			debug(`starts with QM ${concept.value}`);
			const conceptEndIndex = concept.index + concept.value.length;
			debug(`testing ${text[conceptEndIndex]} for end with QM`);
			// ends with quotation mark
			if (EndQuotationMarkReg.test(text[conceptEndIndex])) {
				debug(`ends with QM ${concept.value}`);
				const prevConcept = concepts[index - 1];
				const prevConceptEndIndex = prevConcept.index + prevConcept.value.length;
				debug(`prevConceptEndIndex= ${prevConceptEndIndex} > ${concept.index - 2}`);
				if (concept.index - 2 === prevConceptEndIndex) {
					debug(`text beetwen= '${text[concept.index - 2]}'`);
					if (text[concept.index - 2] === ' ') {
						const newConcept = new Concept({
							value: text.substring(prevConcept.index, conceptEndIndex + 1),
							index: prevConcept.index
						});
						if (newConcept.isValid()) {
							newConcepts.splice(newConcepts.length - 1, 1);
							newConcepts.push(newConcept);
							return;
						}
					}
				}
			}
		}
		newConcepts.push(concept);
	});

	return newConcepts;

	// return concepts.filter(function (concept) {
	// 	// start with quote
	// 	if (quoteReg.test(concept.value[0])) {
	// 		// ends with quote
	// 		if (quoteReg.test(concept.value[concept.value.length - 1])) {
	// 			return true;
	// 		}
	// 		concept.reset(concept.value.substr(1));
	// 		return concept.isValid();
	// 	}
	// 	return !quoteReg.test(concept.value[concept.value.length - 1]);
	// });
};
