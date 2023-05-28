import { Concept } from "../concept";
import { Context } from "../types";
import { getInvalidPrefixes } from "../data";

/**
 * Find concept prefix
 */
export function filter(concepts: Concept[], context: Context): Concept[] {
  const sources = getInvalidPrefixes(context.lang);

  return concepts.filter(function (concept) {
    for (let i = sources.length - 1; i >= 0; i--) {
      let regex: RegExp = sources[i];

      let result = regex.exec(concept.atonicValue);

      if (result) {
        let match = result[0];
        let value = concept.value.substr(match.length);

        concept.reset(value, concept.index + match.length, context.lang);

        return concept.isValid();
      }
    }
    return true;
  });
}
