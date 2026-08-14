import { Concept } from "../concept";

/**
 * Filter dublicate concepts
 */
export function filter(concepts: Concept[]): Concept[] {
  const keys: any = {};
  return concepts.filter(function (concept) {
    const key = concept.atonicValue.toLowerCase();
    if (keys[key]) {
      return false;
    }
    keys[key] = true;
    return true;
  });
}
