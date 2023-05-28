import { parse } from "./parse";
import test from "ava";

test("invalid prefixes: President Barak Obama->Barak Obama", (t) => {
  let concepts = parse({
    text: `Președintele Nicolae Timofti nu a comentat deocamdată situația.`,
    lang: "ro"
  });
  t.is("Nicolae Timofti", concepts[0].value);
});

test("valid prefixes: muntii Carpati", (t) => {
  let concepts = parse({
    text: `In muntii Carpati`,
    lang: "ro"
  });
  t.is(1, concepts.length);
  t.is("muntii Carpati", concepts[0].value);
});

test("valid suffixes: jr", (t) => {
  let concepts = parse({
    text: `Stefan Banica jr va canta astazi in Bucuresti`,
    lang: "ro"
  });
  t.is(2, concepts.length);
  t.is("Stefan Banica jr", concepts[0].value);
});

test("known concepts", (t) => {
  let concepts = parse({
    text: `De maine incepe un nou sezon Romanii au talent La Maruta`,
    lang: "ro"
  });
  // console.log(concepts);
  t.is(2, concepts.length);
  t.is("Romanii au talent", concepts[0].value);
});

test("duplicate", (t) => {
  let concepts = parse(
    {
      text: `New York city is New York`,
      lang: "en"
    },
    { mode: "collect" }
  );
  // console.log(concepts);
  t.is(1, concepts.length);
  t.is("New York", concepts[0].value);
  t.is(0, concepts[0].index);
});

test("invalid concepts", (t) => {
  let concepts = parse({
    text: `Azi este o zi calda de August. Mos Craciun doarme...`,
    lang: "ro"
  });
  // console.log(concepts);
  t.is(1, concepts.length);
  t.is("Mos Craciun", concepts[0].value);
});

test("partial concepts", (t) => {
  let concepts = parse(
    {
      text: `In fiecare zi Petru si fratete sau Dumitru merg la scoala din Batatura.`,
      lang: "ro"
    },
    { mode: "collect" }
  );
  // console.log(concepts);
  t.is(1, concepts.length);
  t.is("Batatura", concepts[0].value);
});

test("start word", (t) => {
  let concepts = parse(
    {
      text: `Every day is a Unique Day. That is true`,
      lang: "en"
    },
    { mode: "collect" }
  );
  // console.log(concepts);
  t.is(1, concepts.length);
  t.is("Unique Day", concepts[0].value);
});

test("abbr", (t) => {
  let concepts = parse({
    text: `...prezentat colectivului Agenției de Intervenție și Plăți pentru Agricultură (AIPA), noul director.`,
    lang: "ro"
  });
  // console.log(concepts);
  t.is(2, concepts.length);
  t.is("AIPA", concepts[0].abbr);
  t.is(
    "Agenției de Intervenție și Plăți pentru Agricultură",
    concepts[0].value
  );
  t.is("AIPA", concepts[1].value);
});

test("detect text by Abbr ru", (t) => {
  let concepts = parse({
    text: `Крымские татары, согласно опросу, не хотят переезжать на Украину, заявил глава Федерального агентства по делам национальностей (ФАДН) Игорь Баринов в интервью «Известиям».`,
    lang: "ru"
  });
  // console.log(concepts);
  t.is(6, concepts.length);
  t.is("ФАДН", concepts[2].abbr);
  t.is("Федерального агентства по делам национальностей", concepts[2].value);
});

test("quotes", (t) => {
  const concepts = parse({
    text: 'Azi mergem la Teatrul Național "Mihai Eminescu". Este alaturi de Teatrul Național de Operă și Balet „Maria Bieșu”',
    lang: "ro"
  });
  t.is(concepts[0].value, 'Teatrul Național "Mihai Eminescu"');
  t.is(concepts[1].value, "Teatrul Național de Operă și Balet „Maria Bieșu”");
});

test("conditional suffix & concat", (t) => {
  let concepts = parse({
    text: `Министерство внутренних дел Республики Молдова является одним из девяти министерств Правительства Республики Молдова`,
    lang: "ru"
  });
  // console.log(concepts);
  t.is(2, concepts.length);
  t.is("Министерство внутренних дел Республики Молдова", concepts[0].value);
  t.is("Правительства Республики Молдова", concepts[1].value);
});

test("conditional suffix: Министерство молодёжи и спорта", (t) => {
  let concepts = parse({
    text: `Министерство молодёжи и спорта является одним из девяти министерств Правительства Республики Молдова`,
    lang: "ru"
  });
  // console.log(concepts);
  t.is(2, concepts.length);
  t.is("Министерство молодёжи и спорта", concepts[0].value);
  t.is("Правительства Республики Молдова", concepts[1].value);
});
