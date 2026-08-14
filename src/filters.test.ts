import { parse } from "./parse";
import test from "node:test";
import assert from "node:assert/strict";

test("invalid prefixes: President Barak Obama->Barak Obama", () => {
  let concepts = parse({
    text: `Președintele Nicolae Timofti nu a comentat deocamdată situația.`,
    lang: "ro"
  });
  assert.equal("Nicolae Timofti", concepts[0].value);
});

test("valid prefixes: muntii Carpati", () => {
  let concepts = parse({
    text: `In muntii Carpati`,
    lang: "ro"
  });
  assert.equal(1, concepts.length);
  assert.equal("muntii Carpati", concepts[0].value);
});

test("valid suffixes: jr", () => {
  let concepts = parse({
    text: `Stefan Banica jr va canta astazi in Bucuresti`,
    lang: "ro"
  });
  assert.equal(2, concepts.length);
  assert.equal("Stefan Banica jr", concepts[0].value);
});

test("known concepts", () => {
  let concepts = parse({
    text: `De maine incepe un nou sezon Romanii au talent La Maruta`,
    lang: "ro"
  });
  // console.log(concepts);
  assert.equal(2, concepts.length);
  assert.equal("Romanii au talent", concepts[0].value);
});

test("duplicate", () => {
  let concepts = parse(
    {
      text: `New York city is New York`,
      lang: "en"
    },
    { mode: "collect" }
  );
  // console.log(concepts);
  assert.equal(1, concepts.length);
  assert.equal("New York", concepts[0].value);
  assert.equal(0, concepts[0].index);
});

test("invalid concepts", () => {
  let concepts = parse({
    text: `Azi este o zi calda de August. Mos Craciun doarme...`,
    lang: "ro"
  });
  // console.log(concepts);
  assert.equal(1, concepts.length);
  assert.equal("Mos Craciun", concepts[0].value);
});

test("partial concepts", () => {
  let concepts = parse(
    {
      text: `In fiecare zi Petru si fratete sau Dumitru merg la scoala din Batatura.`,
      lang: "ro"
    },
    { mode: "collect" }
  );
  // console.log(concepts);
  assert.equal(1, concepts.length);
  assert.equal("Batatura", concepts[0].value);
});

test("start word", () => {
  let concepts = parse(
    {
      text: `Every day is a Unique Day. That is true`,
      lang: "en"
    },
    { mode: "collect" }
  );
  // console.log(concepts);
  assert.equal(1, concepts.length);
  assert.equal("Unique Day", concepts[0].value);
});

test("abbr", () => {
  let concepts = parse({
    text: `...prezentat colectivului Agenției de Intervenție și Plăți pentru Agricultură (AIPA), noul director.`,
    lang: "ro"
  });
  // console.log(concepts);
  assert.equal(2, concepts.length);
  assert.equal("AIPA", concepts[0].abbr);
  assert.equal(
    "Agenției de Intervenție și Plăți pentru Agricultură",
    concepts[0].value
  );
  assert.equal("AIPA", concepts[1].value);
});

test("detect text by Abbr ru", () => {
  let concepts = parse({
    text: `Крымские татары, согласно опросу, не хотят переезжать на Украину, заявил глава Федерального агентства по делам национальностей (ФАДН) Игорь Баринов в интервью «Известиям».`,
    lang: "ru"
  });
  // console.log(concepts);
  assert.equal(6, concepts.length);
  assert.equal("ФАДН", concepts[2].abbr);
  assert.equal("Федерального агентства по делам национальностей", concepts[2].value);
});

test("quotes", () => {
  const concepts = parse({
    text: 'Azi mergem la Teatrul Național "Mihai Eminescu". Este alaturi de Teatrul Național de Operă și Balet „Maria Bieșu”',
    lang: "ro"
  });
  assert.equal(concepts[0].value, 'Teatrul Național "Mihai Eminescu"');
  assert.equal(concepts[1].value, "Teatrul Național de Operă și Balet „Maria Bieșu”");
});

test("conditional suffix & concat", () => {
  let concepts = parse({
    text: `Министерство внутренних дел Республики Молдова является одним из девяти министерств Правительства Республики Молдова`,
    lang: "ru"
  });
  // console.log(concepts);
  assert.equal(2, concepts.length);
  assert.equal("Министерство внутренних дел Республики Молдова", concepts[0].value);
  assert.equal("Правительства Республики Молдова", concepts[1].value);
});

test("conditional suffix: Министерство молодёжи и спорта", () => {
  let concepts = parse({
    text: `Министерство молодёжи и спорта является одним из девяти министерств Правительства Республики Молдова`,
    lang: "ru"
  });
  // console.log(concepts);
  assert.equal(2, concepts.length);
  assert.equal("Министерство молодёжи и спорта", concepts[0].value);
  assert.equal("Правительства Республики Молдова", concepts[1].value);
});

test("known concept at text start is not truncated", () => {
  const concepts = parse(
    { text: `Moldova are Talent e o emisiune populara`, lang: "ro" },
    { filters: ["known"] }
  );
  assert.equal(concepts.length, 1);
  assert.equal(concepts[0].value, "Moldova are Talent");
  assert.equal(concepts[0].index, 0);
});
