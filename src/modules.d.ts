declare module "atonic" {
  function atonic(value: string): string;
  export = atonic;
}

declare module "stopwords-json" {
  const stopwords: { [lang: string]: string[] };
  export = stopwords;
}
