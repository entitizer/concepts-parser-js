import { parse } from "./parse";
import { simpleSplit, createConceptsFromConcept } from "./splitter";
import test from "node:test";
import assert from "node:assert/strict";

test("createConceptsFromConcept", () => {
  let concept = parse({
    text: "Presedintele Republicii Moldova Igor Dodon este un...",
    lang: "ro"
  })[0];

  let value = "Republicii Moldova Igor Dodon";

  assert.equal(concept.value, value);

  let concepts = createConceptsFromConcept(concept, value.lastIndexOf(" "));

  assert.equal(concepts[0].value, "Republicii Moldova Igor");
  assert.equal(concepts[1].value, "Dodon");
});

test("no split 1 word concept", () => {
  const concept = parse({
    text: "USA is a country",
    lang: "en"
  })[0];
  let concepts = simpleSplit(concept);
  assert.equal(0, concepts.length);
  concepts = concept.split();
  assert.equal(0, concepts.length);
});

test("split: 2 words", () => {
  const concept = parse({
    text: "Nicolae Timofti nu a comentat deocamdată situația.",
    lang: "ro"
  })[0];
  let concepts = simpleSplit(concept);
  assert.equal(2, concepts.length);
  concepts = concept.split();
  assert.equal(2, concepts.length);
  assert.equal("Nicolae", concepts[0].value);
  assert.equal("Timofti", concepts[1].value);
});

test("split: 3 words", () => {
  const concept = parse({
    text: "Doar Nicolae Timofti nu a comentat deocamdată situația.",
    lang: "ro"
  })[0];
  let concepts = simpleSplit(concept);
  assert.equal(4, concepts.length);
});

test("split: 4 words", () => {
  const concept = parse({
    text: "Y’all Need to Chill About Proxima Centauri b",
    lang: "en"
  })[1];
  const value = "Chill About Proxima Centauri";
  assert.equal(concept.value, value);
  let concepts = simpleSplit(concept);
  assert.equal(6, concepts.length);
  assert.equal("Chill About Proxima", concepts[0].value);
  assert.equal("Centauri", concepts[1].value);
  assert.equal("Chill About", concepts[2].value);
  assert.equal("Proxima Centauri", concepts[3].value);
  assert.equal("Chill", concepts[4].value);
  assert.equal("About Proxima Centauri", concepts[5].value);
});

test("split by connect words", () => {
  const concept = parse({
    text: "Facebook and Microsoft are friends",
    lang: "en"
  })[0];
  assert.equal(concept.value, "Facebook and Microsoft");
  let concepts = simpleSplit(concept);

  assert.equal(concepts.length, 2);
  assert.equal(concepts[0].value, "Facebook");
  assert.equal(concepts[1].value, "Microsoft");
  concepts = concept.split();

  assert.equal(concepts.length, 2);
  assert.equal("Facebook", concepts[0].value);
  assert.equal("Microsoft", concepts[1].value);
});

test("remove lowercase words", () => {
  let concepts = parse({
    text: "liceul Ion Creanga",
    lang: "ro"
  });
  assert.equal(concepts.length, 1);
  assert.equal(concepts[0].value, "liceul Ion Creanga");

  concepts = concepts[0].split();
  assert.equal(concepts.length, 3);
  assert.equal(concepts[0].value, "Ion");
  assert.equal(concepts[1].value, "Creanga");
  assert.equal(concepts[2].value, "Ion Creanga");

  concepts = parse({
    text: "Colegiul Ion Creanga din Iasi",
    lang: "ro"
  });

  assert.equal(concepts.length, 1);
  assert.equal(concepts[0].value, "Colegiul Ion Creanga din Iasi");

  concepts = concepts[0].split();
  assert.equal(concepts.length, 2);
  assert.equal(concepts[0].value, "Colegiul Ion Creanga");
  assert.equal(concepts[1].value, "Iasi");
});
