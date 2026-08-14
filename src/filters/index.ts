import { Concept } from "../concept";
import { Context } from "../types";
import * as invalid_prefix from "./invalid_prefix";
import * as abbr from "./abbr";
import * as invalid from "./invalid";
import * as partial from "./partial";
import * as prefix from "./prefix";
import * as suffix from "./suffix";
import * as start_word from "./start_word";
import * as known from "./known";
import * as quote from "./quote";
import * as duplicate from "./duplicate";

const MODE_COLLECT = "collect";
const MODE_IDENTIFY = "identify";

const FILTERS_BY_MODE = {
  collect: [
    "invalid_prefix",
    "abbr",
    "invalid",
    "partial",
    "prefix",
    "suffix",
    "start_word",
    "known",
    "quote",
    "duplicate",
  ],
  identify: [
    "invalid_prefix",
    "abbr",
    "invalid",
    //'partial',
    "prefix",
    "suffix",
    //'start_word',
    "known",
    "quote",
    //'duplicate'
  ],
};

interface IFilter {
  filter(concepts: Concept[], context: Context): Concept[];
}

const FILTERS: { [name: string]: IFilter } = {
  invalid_prefix,
  abbr,
  invalid,
  partial,
  prefix,
  suffix,
  start_word,
  known,
  quote,
  duplicate,
};

function getFilter(name: string): IFilter {
  const found = Object.prototype.hasOwnProperty.call(FILTERS, name)
    ? FILTERS[name]
    : undefined;
  if (!found) {
    throw new Error("invalid filter name: " + name);
  }
  return found;
}

export type FilterOptions = {
  mode?: string;
  filters?: string[];
};

export function filter(
  concepts: Concept[],
  context: Context,
  options: FilterOptions = {},
): Concept[] {
  // debug('start filter');

  let filters: string[];

  if (options.mode) {
    switch (options.mode) {
      case MODE_COLLECT:
        filters = FILTERS_BY_MODE[MODE_COLLECT];
        break;
      case MODE_IDENTIFY:
        filters = FILTERS_BY_MODE[MODE_IDENTIFY];
        break;
      default:
        throw new Error("invalid filter mode " + options.mode);
    }
  } else if (options.filters !== undefined) {
    if (!Array.isArray(options.filters)) {
      throw new Error("`filters` fields is invalid!");
    }
    filters = options.filters;
  } else {
    filters = FILTERS_BY_MODE[MODE_IDENTIFY];
  }

  for (const name of filters) {
    // console.log('filter ' + name + ', ' + filters.length);
    concepts = getFilter(name).filter(concepts, context);
  }

  // debug('end filter');
  return concepts;
}
