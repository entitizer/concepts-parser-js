const debug = require("debug")("concepts-parser");
import { Parser } from "./parsers/words/parser";
import { Concept } from "./concept";
import { Context } from "./types";
import { FilterOptions } from "./filters";
import { getConnectWords } from "./data";

export function parse(context: Context, options?: FilterOptions): Concept[] {
  debug("start parsing");

  const parser = new Parser({
    acceptConceptWords: getConnectWords(context.lang)
  });

  let concepts = parser.parse(context);
  debug("end parsing");
  let conceptsList = concepts.filter(options);

  return conceptsList;
}
