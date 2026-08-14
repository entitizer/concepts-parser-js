import createDebug from "debug";
import { Parser } from "./parsers/words/parser";
import { Concept } from "./concept";
import { Context } from "./types";
import { FilterOptions } from "./filters";
import { getConnectWords } from "./data";

const debug = createDebug("concepts-parser");

export function parse(context: Context, options?: FilterOptions): Concept[] {
  debug("start parsing");

  const parser = new Parser({
    acceptConceptWords: getConnectWords(context.lang),
  });

  const concepts = parser.parse(context);
  debug("end parsing");
  const conceptsList = concepts.filter(options);

  return conceptsList;
}
