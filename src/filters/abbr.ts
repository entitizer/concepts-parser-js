import createDebug from "debug";
import { Context } from "../types";
import { Concept } from "../concept";
import isAbbrOf from "is-abbr-of";

const debug = createDebug("concepts:filter");

function isInParentheses(concept: Concept, context: Context): boolean {
  const i = concept.index;
  const j = concept.endIndex;
  const sp = context.text[i - 1];
  const ep = context.text[j];
  // debug(concept.value, i, j, sp, ep);
  return i > 0 && j < context.text.length && sp === "(" && ep === ")";
}

/**
 * Filter abbreviations
 */
export function filter(concepts: Concept[], context: Context): Concept[] {
  let prev: Concept;
  return concepts.filter(function (concept) {
    if (
      prev &&
      concept.isAbbr &&
      prev.endIndex < concept.index &&
      isInParentheses(concept, context)
    ) {
      // slice up to the "(" and trim: more than one space before the
      // parenthesis must not leak into the expanded value
      const text = context.text
        .substring(prev.index, concept.index - 1)
        .trimEnd();
      if (isAbbrOf(concept.value, text)) {
        debug(`${concept.value} is abbr of ${text}`);
        prev.abbr = concept.value;
        prev.reset(text, prev.index, context.lang);
        // return false;
      }
    }
    prev = concept;
    return true;
  });
}
