import { Concept } from "../concept";
import { Context } from "../types";
import { getKnownConcepts } from "../data";

/**
 * Find known concepts
 */
export function filter(concepts: Concept[], context: Context): Concept[] {
  const sources = getKnownConcepts(context.lang);

  const newconcepts: Concept[] = [];

  sources.forEach((source) => {
    let result: RegExpExecArray | null;

    while ((result = source.exec(context.text)) !== null) {
      const match = result[0];
      const value = match.trim();
      const index = result.index + (match.length - match.trimStart().length);

      const concept = new Concept({
        value,
        index,
        lang: context.lang,
      });

      if (concept.isValid()) {
        concept.set("isKnown", true);
        newconcepts.push(concept);
      }
    }
  });

  if (newconcepts.length > 0) {
    concepts = concepts.filter(function (concept) {
      return !newconcepts.some(function (c) {
        return (
          concept.index >= c.index &&
          concept.index + concept.value.length <= c.index + c.value.length
        );
      });
    });

    concepts = concepts.concat(newconcepts).sort((a, b) => {
      return a.index - b.index;
    });
  }

  return concepts;
}
