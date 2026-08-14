import { Concept } from "../concept";
import { Context } from "../types";
import { getValidPrefixes } from "../data";

/**
 * Find concept prefix
 */
export function filter(concepts: Concept[], context: Context): Concept[] {
  const regexes = getValidPrefixes(context.lang);

  return concepts.filter(function (concept) {
    const text = context.text.slice(0, concept.index);

    for (const regex of regexes) {
      const result = regex.exec(text);

      if (result) {
        let value = text.slice(result.index);
        let indexSpace = 0;
        if (/^\s/.test(value)) {
          indexSpace = 1;
          value = value.slice(1);
        }

        concept.reset(
          value + concept.value,
          result.index + indexSpace,
          context.lang,
        );

        return concept.isValid();
      }
    }

    return true;
  });
}
