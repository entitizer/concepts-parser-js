import { parse } from "./parse";
import { simpleSplit, createConceptsFromConcept } from "./splitter";
import test from "node:test";
import assert from "node:assert/strict";

test("createConceptsFromConcept", () => {
  const concept = parse({
    text: "Presedintele Republicii Moldova Igor Dodon este un...",
    lang: "ro",
  })[0];

  const value = "Republicii Moldova Igor Dodon";

  assert.equal(concept.value, value);

  const concepts = createConceptsFromConcept(concept, value.lastIndexOf(" "));

  assert.equal(concepts[0].value, "Republicii Moldova Igor");
  assert.equal(concepts[1].value, "Dodon");
});

test("no split 1 word concept", () => {
  const concept = parse({
    text: "USA is a country",
    lang: "en",
  })[0];
  let concepts = simpleSplit(concept);
  assert.equal(0, concepts.length);
  concepts = concept.split();
  assert.equal(0, concepts.length);
});

test("split: 2 words", () => {
  const concept = parse({
    text: "Nicolae Timofti nu a comentat deocamdată situația.",
    lang: "ro",
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
    lang: "ro",
  })[0];
  const concepts = simpleSplit(concept);
  assert.equal(4, concepts.length);
});

test("split: 4 words", () => {
  const concept = parse({
    text: "Y’all Need to Chill About Proxima Centauri b",
    lang: "en",
  })[1];
  const value = "Chill About Proxima Centauri";
  assert.equal(concept.value, value);
  const concepts = simpleSplit(concept);
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
    lang: "en",
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
    lang: "ro",
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
    lang: "ro",
  });

  assert.equal(concepts.length, 1);
  assert.equal(concepts[0].value, "Colegiul Ion Creanga din Iasi");

  concepts = concepts[0].split();
  assert.equal(concepts.length, 2);
  assert.equal(concepts[0].value, "Colegiul Ion Creanga");
  assert.equal(concepts[1].value, "Iasi");
});

test("split concepts map back into the original text", () => {
  const text = "Doar Nicolae Petru Timofti a comentat situația.";
  const concept = parse({ text, lang: "ro" })[0];
  assert.equal(concept.value, "Doar Nicolae Petru Timofti");

  const parts = concept.split();
  assert.ok(parts.length > 0);
  for (const part of parts) {
    assert.equal(
      text.slice(part.index, part.index + part.value.length),
      part.value,
      `"${part.value}"@${part.index} does not map back to the text`,
    );
  }
});

test("known concepts are never split", () => {
  const concept = parse({ text: "Moldova are Talent revine.", lang: "ro" })[0];
  assert.equal(concept.value, "Moldova are Talent");
  assert.equal(concept.get("isKnown"), true);
  assert.deepEqual(concept.split(), []);
});

test("a concept with an early space cannot split: R. Moldova", () => {
  // canSplit requires the first space after index 2 — "R. Moldova" has it at 2
  const concept = parse({ text: "R. Moldova este stat.", lang: "ro" })[0];
  assert.equal(concept.value, "R. Moldova");
  assert.deepEqual(concept.split(), []);
});

test("en-dash split word cuts a route concept cleanly (en)", () => {
  const text = "The Moscow – Berlin route is closed.";
  const concept = parse({ text, lang: "en" })[0];
  assert.equal(concept.value, "Moscow – Berlin");

  const parts = concept.split();
  assert.deepEqual(
    parts.map((c) => c.value),
    ["Moscow", "Berlin"],
  );
  assert.equal(parts[0].index, 4);
  assert.equal(parts[1].index, 13);
  for (const part of parts) {
    assert.equal(
      text.slice(part.index, part.index + part.value.length),
      part.value,
    );
  }
});

// LIMITATION: a quote-merged concept splits like any other text, so
// simpleSplit produces parts with quotation marks glued to the words
// ('Eminescu"', '"Mihai Eminescu"'). The parts still map back to the text.
test("splitting a quote-merged concept keeps quote chars in the parts", () => {
  const text = 'Azi mergem la Teatrul Național "Mihai Eminescu" din centru.';
  const concept = parse({ text, lang: "ro" })[0];
  assert.equal(concept.value, 'Teatrul Național "Mihai Eminescu"');

  const parts = concept.split();
  assert.ok(parts.some((c) => /["„”«»]/.test(c.value)));
  for (const part of parts) {
    assert.equal(
      text.slice(part.index, part.index + part.value.length),
      part.value,
    );
  }
});

test("split by 'имени' gives one clean cut, not simpleSplit noise", () => {
  const concepts = parse({
    text: "Спектакль идёт в Театре имени Михаила Чехова с осени.",
    lang: "ru",
  });
  const theater = concepts.find(
    (c) => c.value === "Театре имени Михаила Чехова",
  );
  assert.deepEqual(
    theater?.split().map((c) => c.value),
    ["Театре", "Михаила Чехова"],
  );
});
