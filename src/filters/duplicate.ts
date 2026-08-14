import { Concept } from "../concept";

/**
 * Filter dublicate concepts
 */
export function filter(concepts: Concept[]): Concept[] {
  const keys = new Set<string>();
  return concepts.filter(function (concept) {
    const key = concept.atonicValue.toLowerCase();
    if (keys.has(key)) {
      return false;
    }
    keys.add(key);
    return true;
  });
}
