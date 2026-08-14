import { parse } from "./parse";
import test from "node:test";
import assert from "node:assert/strict";

test("invalid prefixes: President Barak Obama->Barak Obama", () => {
  const concepts = parse({
    text: `Președintele Nicolae Timofti nu a comentat deocamdată situația.`,
    lang: "ro",
  });
  assert.equal("Nicolae Timofti", concepts[0].value);
});

test("valid prefixes: muntii Carpati", () => {
  const concepts = parse({
    text: `In muntii Carpati`,
    lang: "ro",
  });
  assert.equal(1, concepts.length);
  assert.equal("muntii Carpati", concepts[0].value);
});

test("valid suffixes: jr", () => {
  const concepts = parse({
    text: `Stefan Banica jr va canta astazi in Bucuresti`,
    lang: "ro",
  });
  assert.equal(2, concepts.length);
  assert.equal("Stefan Banica jr", concepts[0].value);
});

test("known concepts", () => {
  const concepts = parse({
    text: `De maine incepe un nou sezon Romanii au talent La Maruta`,
    lang: "ro",
  });
  // console.log(concepts);
  assert.equal(2, concepts.length);
  assert.equal("Romanii au talent", concepts[0].value);
});

test("duplicate", () => {
  const concepts = parse(
    {
      text: `New York city is New York`,
      lang: "en",
    },
    { mode: "collect" },
  );
  // console.log(concepts);
  assert.equal(1, concepts.length);
  assert.equal("New York", concepts[0].value);
  assert.equal(0, concepts[0].index);
});

test("invalid concepts", () => {
  const concepts = parse({
    text: `Azi este o zi calda de August. Mos Craciun doarme...`,
    lang: "ro",
  });
  // console.log(concepts);
  assert.equal(1, concepts.length);
  assert.equal("Mos Craciun", concepts[0].value);
});

test("partial concepts", () => {
  const concepts = parse(
    {
      text: `In fiecare zi Petru si fratete sau Dumitru merg la scoala din Batatura.`,
      lang: "ro",
    },
    { mode: "collect" },
  );
  // console.log(concepts);
  assert.equal(1, concepts.length);
  assert.equal("Batatura", concepts[0].value);
});

test("start word", () => {
  const concepts = parse(
    {
      text: `Every day is a Unique Day. That is true`,
      lang: "en",
    },
    { mode: "collect" },
  );
  // console.log(concepts);
  assert.equal(1, concepts.length);
  assert.equal("Unique Day", concepts[0].value);
});

test("abbr", () => {
  const concepts = parse({
    text: `...prezentat colectivului Agenției de Intervenție și Plăți pentru Agricultură (AIPA), noul director.`,
    lang: "ro",
  });
  // console.log(concepts);
  assert.equal(2, concepts.length);
  assert.equal("AIPA", concepts[0].abbr);
  assert.equal(
    "Agenției de Intervenție și Plăți pentru Agricultură",
    concepts[0].value,
  );
  assert.equal("AIPA", concepts[1].value);
});

test("detect text by Abbr ru", () => {
  const concepts = parse({
    text: `Крымские татары, согласно опросу, не хотят переезжать на Украину, заявил глава Федерального агентства по делам национальностей (ФАДН) Игорь Баринов в интервью «Известиям».`,
    lang: "ru",
  });
  // console.log(concepts);
  assert.equal(6, concepts.length);
  assert.equal("ФАДН", concepts[2].abbr);
  assert.equal(
    "Федерального агентства по делам национальностей",
    concepts[2].value,
  );
});

test("quotes", () => {
  const concepts = parse({
    text: 'Azi mergem la Teatrul Național "Mihai Eminescu". Este alaturi de Teatrul Național de Operă și Balet „Maria Bieșu”',
    lang: "ro",
  });
  assert.equal(concepts[0].value, 'Teatrul Național "Mihai Eminescu"');
  assert.equal(
    concepts[1].value,
    "Teatrul Național de Operă și Balet „Maria Bieșu”",
  );
});

test("conditional suffix & concat", () => {
  const concepts = parse({
    text: `Министерство внутренних дел Республики Молдова является одним из девяти министерств Правительства Республики Молдова`,
    lang: "ru",
  });
  // console.log(concepts);
  assert.equal(2, concepts.length);
  assert.equal(
    "Министерство внутренних дел Республики Молдова",
    concepts[0].value,
  );
  assert.equal("Правительства Республики Молдова", concepts[1].value);
});

test("conditional suffix: Министерство молодёжи и спорта", () => {
  const concepts = parse({
    text: `Министерство молодёжи и спорта является одним из девяти министерств Правительства Республики Молдова`,
    lang: "ru",
  });
  // console.log(concepts);
  assert.equal(2, concepts.length);
  assert.equal("Министерство молодёжи и спорта", concepts[0].value);
  assert.equal("Правительства Республики Молдова", concepts[1].value);
});

test("known concept at text start is not truncated", () => {
  const concepts = parse(
    { text: `Moldova are Talent e o emisiune populara`, lang: "ro" },
    { filters: ["known"] },
  );
  assert.equal(concepts.length, 1);
  assert.equal(concepts[0].value, "Moldova are Talent");
  assert.equal(concepts[0].index, 0);
});

test("unknown filter name throws", () => {
  assert.throws(() =>
    parse({ text: `Some Text`, lang: "ro" }, { filters: ["no_such_filter"] }),
  );
});

test("abbr: expanded concept keeps its index (ro)", () => {
  const text = `Ieri Organizația Națiunilor Unite (ONU) a publicat un raport nou.`;
  const concepts = parse({ text, lang: "ro" });
  const expanded = concepts.find((c) => c.abbr === "ONU");
  assert.ok(expanded, "expected a concept with abbr ONU");
  assert.equal(expanded.value, "Organizația Națiunilor Unite");
  assert.equal(expanded.index, 5);
  assert.equal(
    text.slice(expanded.index, expanded.index + expanded.value.length),
    expanded.value,
  );
});

test("abbr: expanded concept keeps its index (en)", () => {
  const text = `The North Atlantic Treaty Organization (NATO) held a summit.`;
  const concepts = parse({ text, lang: "en" });
  const expanded = concepts.find((c) => c.abbr === "NATO");
  assert.ok(expanded, "expected a concept with abbr NATO");
  assert.equal(expanded.value, "North Atlantic Treaty Organization");
  assert.equal(expanded.index, 4);
});

test("abbr: all concepts map back to the text (ru)", () => {
  const text = `Крымские татары, согласно опросу, не хотят переезжать на Украину, заявил глава Федерального агентства по делам национальностей (ФАДН) Игорь Баринов в интервью «Известиям».`;
  const concepts = parse({ text, lang: "ru" });
  const expanded = concepts.find((c) => c.abbr === "ФАДН");
  assert.ok(expanded, "expected a concept with abbr ФАДН");
  for (const c of concepts) {
    assert.equal(text.slice(c.index, c.index + c.value.length), c.value);
  }
});

test("invalid prefixes: keep concept whole instead of leaving an orphaned connect word (en)", () => {
  const concepts = parse({
    text: "He met the President of Russia yesterday in Sochi.",
    lang: "en",
  });
  assert.deepEqual(
    concepts.map((c) => c.value),
    ["President of Russia", "Sochi"],
  );
});

test("invalid prefixes: keep concept whole instead of leaving an orphaned connect word (ro)", () => {
  const concepts = parse({
    text: "Ministrul de Externe a plecat aseară la Berlin.",
    lang: "ro",
  });
  assert.deepEqual(
    concepts.map((c) => c.value),
    ["Ministrul de Externe", "Berlin"],
  );
});

test("invalid prefixes: no mangling when a person follows the title phrase", () => {
  const concepts = parse({
    text: "Ministrul de Externe Nicu Popescu a confirmat vizita la Berlin.",
    lang: "ro",
  });
  assert.deepEqual(
    concepts.map((c) => c.value),
    ["Ministrul de Externe Nicu Popescu", "Berlin"],
  );
});

test("duplicate filter: names colliding with Object.prototype keys survive", () => {
  const concepts = parse(
    {
      text: "The company Constructor raised new funds. Investors praised Constructor for its growth in Norway.",
      lang: "en",
    },
    { mode: "collect" },
  );
  assert.deepEqual(
    concepts.map((c) => c.value),
    ["Constructor", "Norway"],
  );
});

test("unknown filter names always raise the intended error", () => {
  assert.throws(
    () =>
      parse(
        { text: "Moldova este stat.", lang: "ro" },
        { filters: ["constructor"] },
      ),
    /invalid filter name/,
  );
});

test("start_word: sentence after … is treated like after a dot", () => {
  const after_dot = parse(
    { text: "Era târziu. Popescu dormea adânc.", lang: "ro" },
    { mode: "collect" },
  );
  const after_ellipsis = parse(
    { text: "Era târziu… Popescu dormea adânc.", lang: "ro" },
    { mode: "collect" },
  );
  assert.deepEqual(
    after_ellipsis.map((c) => c.value),
    after_dot.map((c) => c.value),
  );
});

test("suffix: Cyrillic concepts are extended, not deleted (ru)", () => {
  const mid = parse({
    text: "Магнитная гора видна издалека даже ночью.",
    lang: "ru",
  });
  assert.deepEqual(
    mid.map((c) => c.value),
    ["Магнитная гора"],
  );
  const end = parse({ text: "Мы посетили Магнитная гора", lang: "ru" });
  assert.deepEqual(
    end.map((c) => c.value),
    ["Магнитная гора"],
  );
});

test("suffix: Cyrillic concepts are extended, not deleted (bg)", () => {
  const concepts = parse({
    text: "Гостите разгледаха Народния дворец в центъра на София.",
    lang: "bg",
  });
  assert.deepEqual(
    concepts.map((c) => c.value),
    ["Гостите", "Народния дворец", "София"],
  );
});

test("filter order: suffix completes a stopword-headed name before invalid drops it", () => {
  const concepts = parse({
    text: "Делегация посетила Большой театр и вернулась в отель.",
    lang: "ru",
  });
  assert.deepEqual(
    concepts.map((c) => c.value),
    ["Делегация", "Большой театр"],
  );
});

test("invalid prefixes: ru title + genitive country is stripped from the name", () => {
  const president = parse({
    text: "Президент России Владимир Путин провёл переговоры в Кремле.",
    lang: "ru",
  });
  assert.deepEqual(
    president.map((c) => c.value),
    ["Владимир Путин", "Кремле"],
  );
  const premier = parse({
    text: "Премьер-министр Молдовы Дорин Речан посетил Киев на прошлой неделе.",
    lang: "ru",
  });
  assert.deepEqual(
    premier.map((c) => c.value),
    ["Дорин Речан", "Киев"],
  );
});

// A dialog dash opening a line ("– Plecăm...") starts a sentence, so the
// word after it is a sentence starter. Position makes this safe: a
// mid-sentence dash ("a spus el – Moldova va decide") is never the first
// non-space character on its line, and stays untouched.
test("start_word: word after a line-opening dialog dash is a sentence starter", () => {
  const dialog = parse(
    { text: "– Plecăm imediat la Bălți, a spus Ion.", lang: "ro" },
    { mode: "collect" },
  );
  assert.deepEqual(
    dialog.map((c) => c.value),
    ["Bălți", "Ion"],
  );

  const multiline = parse(
    { text: "Ion a întrebat ceva.\n– Plecăm mâine la Cluj?", lang: "ro" },
    { mode: "collect" },
  );
  // "Ion" is a text-start word, dropped by start_word like any other
  assert.deepEqual(
    multiline.map((c) => c.value),
    ["Cluj"],
  );
});

test("start_word: a mid-sentence dash does not drop the entity after it", () => {
  const concepts = parse(
    { text: "El a spus clar – Moldova va decide singură.", lang: "ro" },
    { mode: "collect" },
  );
  assert.deepEqual(
    concepts.map((c) => c.value),
    ["Moldova"],
  );
});
