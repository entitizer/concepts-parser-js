
import { Concept, ConceptType } from '../concept';
import { splitByWords } from '../splitter';

/**
 * Split known type concepts
 */
export function filter(concepts: Concept[]): Concept[] {

    let newConcepts: { index: number, list: Concept[] }[] = []

    concepts = concepts.filter(function (concept, index) {
        if (concept.type !== ConceptType.PERSON || concept.countWords < 3) {
            return true;
        }

        const list = splitByWords(concept);

        if (list.length) {
            newConcepts.push({ index, list });
            return false;
        }

        return true;
    });

    let indexDiff = 0;
    for (let item of newConcepts) {
        const args = (<any[]>[item.index + indexDiff, 0]).concat(item.list);
        concepts.splice.apply(concepts, args);
        indexDiff += (item.list.length - 1);
    }

    return concepts;
};
