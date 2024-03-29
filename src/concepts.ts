import { filter, FilterOptions } from "./filters";
import { Context } from "./types";
import { Concept } from "./concept";

export class Concepts {
  private context: Context;
  private list: Concept[] = [];
  constructor(context: Context) {
    this.context = context;
  }

  add(concept: Concept) {
    if (concept.isValid()) {
      this.list.push(concept);
    }
  }

  all() {
    return this.list;
  }

  filter(options?: FilterOptions): Concept[] {
    return filter(this.all(), this.context, options);
  }
}
