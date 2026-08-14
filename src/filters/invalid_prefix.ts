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
      const regex: RegExp = sources[i];

      const result = regex.exec(concept.atonicValue);

      if (result) {
        const match = result[0];
        const value = concept.value.slice(match.length);

        concept.reset(value, concept.index + match.length, context.lang);

        return concept.isValid();
      }
    }
    return true;
  });
}
