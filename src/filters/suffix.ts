import { Concept } from "../concept";
import { Context } from "../types";
import { getValidSuffixes } from "../data";

/**
 * Find concept suffix
 */
export function filter(concepts: Concept[], context: Context): Concept[] {
  const sources = getValidSuffixes(context.lang);

  let nextIsInvalid = false;

  return concepts.filter(function (concept, index) {
    if (nextIsInvalid) {
      nextIsInvalid = false;
      return false;
    }
    const text = context.text.slice(concept.index + concept.value.length);

    for (const source of sources) {
      const result = source.reg.exec(text);

      if (result) {
        const match = result[0];
        const value = text.slice(0, match.length);

        if (source.prefix) {
          // is not required prefix
          if (!source.prefix.test(concept.value)) {
            return true;
          }
        }
        concept.reset(concept.value + value, concept.index, concept.lang);

        if (source.concat === true) {
          if (index + 1 < concepts.length) {
            const nextConcept = concepts[index + 1];
            if (nextConcept.index === concept.endIndex + 1) {
              concept.reset(
                concept.value + " " + nextConcept.value,
                concept.index,
                concept.lang,
              );
              nextIsInvalid = true;
            }
          }
        }

        return concept.isValid();
      }
    }
    return true;
  });
}
