import fetch from "node-fetch";
import { Dictionary } from "../types";

export type WikidataQueryResultItem = Dictionary<{
  type: string;
  value: string;
}>;

export async function queryWikidata(
  query: string
): Promise<WikidataQueryResultItem[]> {
  const response = await fetch(
    "https://query.wikidata.org/sparql?format=json&query=" + query,
    { timeout: 1000 * 60 }
  );
  const json = await response.json();
  return (json.results && json.results.bindings) || [];
}

export type WikiEntityInfo = {
  id: string;
  label: string;
  title: string;
  aliases: string[];
};

export async function queryWikidataInfo(
  query: string
): Promise<Dictionary<WikiEntityInfo>> {
  const entries = await queryWikidata(query);

  const entities: Dictionary<WikiEntityInfo> = {};

  for (const entry of entries) {
    const id = entry["item"].value.substr(
      entry["item"].value.lastIndexOf("/") + 1
    );
    const label = entry["label"].value;
    const title = entry["title"].value;
    const alias = (entry["alias"] && entry["alias"].value) || "";

    if (!entities[id]) {
      entities[id] = { id, label, title, aliases: [] };
    }
    if (alias) {
      entities[id].aliases.push(alias);
    }
  }

  return entities;
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getWikiArticleText(lang: string, title: string) {
  const response = await fetch(
    `https://${lang}.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=true&titles=${encodeURIComponent(
      title
    )}&format=json`,
    { timeout: 1000 * 60 }
  );
  const json = await response.json();
  const id = Object.keys(json.query.pages)[0];
  const text = json.query.pages[id].extract as string;
  const parts = text
    .split(/\s*\n\s*/g)
    .filter((item) => item && item.length > 10 && !item.trim().startsWith("="));
  return parts.join("\n");
}

export async function getWikiEntitiesInfo(lang: string, limit: number) {
  const types = [
    "Q515", // city
    "Q5", // person
    "Q6138528", // political coalition
    "Q7278", // political party
    "Q8502", // mountain
    "Q23442", // island
    "Q165", // sea
    "Q215380", // band
    "Q4830453", // business
    "Q6881511", // enterprise
    "Q327333", // government agency
    "Q20901295", // foreign affairs ministry
    "Q1241288" // economic affairs ministry
  ];
  let entities: Dictionary<WikiEntityInfo> = {};
  for (const type of types) {
    let data = await queryWikidataInfo(
      formatEntitiesQuery(lang, type, limit, 10, false)
    );
    // console.log('got data', data)
    entities = { ...entities, ...data };
    await delay(1000 * 3);
    data = await queryWikidataInfo(
      formatEntitiesQuery(lang, type, limit, 5, true)
    );
    // console.log('got data', data)
    entities = { ...entities, ...data };
    await delay(1000 * 3);
    // break;
  }
  return entities;
}

function formatEntitiesQuery(
  lang: string,
  type: string,
  limit: number,
  minSitelinks: number,
  national: boolean
) {
  return `SELECT ?item ?sitelinks ?label ?title ?alias WHERE {
        ?item wdt:P31 wd:${type}.
        ?item wikibase:sitelinks ?sitelinks .
        ?item rdfs:label ?label.
        FILTER (?sitelinks > ${minSitelinks})
        FILTER(LANG(?label) = "${lang}")
        FILTER(REGEX(?label, " "))
        ?article schema:about ?item; schema:isPartOf <https://${lang}.wikipedia.org/>; schema:name ?title .
        ${
          national
            ? `?item wdt:P17 ?country.
        ?country wdt:P37 ?language.
        ?language wdt:P218 "${lang}".`
            : ""
        }
     }
     LIMIT ${limit}`;
}
//     #ORDER BY DESC(?sitelinks)