import { parse } from "./parse";
import * as api from "./index";
import test from "node:test";
import assert from "node:assert/strict";

test("simple concepts", () => {
  const concepts = parse({
    text: `Europa este un continent. R. Moldova este parte din Europa.`,
    lang: "ro",
  });
  // console.log(concepts);
  assert.equal(3, concepts.length);
  assert.equal("Europa", concepts[0].value);
  assert.equal("R. Moldova", concepts[1].value);
  assert.equal("Europa", concepts[2].value);
});

test("text end concept", () => {
  const concepts = parse({
    text: `R. Moldova este parte din UE`,
    lang: "ro",
  });
  // console.log(concepts);
  assert.equal(2, concepts.length);
  assert.equal("R. Moldova", concepts[0].value);
  assert.equal("UE", concepts[1].value);
});

test("word spaces", () => {
  const concepts = parse({
    text: `sometimes called Bosnia  Herzegovina or Bosnia & Herzegovina`,
    lang: "en",
  });
  // console.log(concepts);
  assert.equal(3, concepts.length);
  assert.equal("Bosnia", concepts[0].value);
  assert.equal("Herzegovina", concepts[1].value);
  assert.equal("Bosnia & Herzegovina", concepts[2].value);
});

test("connect words: Bosnia and Herzegovina", () => {
  const concepts = parse({
    text: "sometimes called Bosnia-Herzegovina or Bosnia & Herzegovina, abbreviated BiH or B&H, and, in short, often known informally as Bosnia, is a country in Southeastern Europe located on the Balkan Peninsula",
    lang: "en",
  });
  // console.log(concepts);
  assert.equal(7, concepts.length);
  assert.equal("Bosnia-Herzegovina", concepts[0].value);
});

test("connect with number: Eurovision 2016", () => {
  const concepts = parse({
    text: "La Eurovision 2016 vor concura 10 participanti.",
    lang: "ro",
  });
  // console.log(concepts);
  assert.equal(1, concepts.length);
  assert.equal("Eurovision 2016", concepts[0].value);
});

test("invalid connect with 2 numbers: Eurovision 2016 18", () => {
  const concepts = parse({
    text: "La Eurovision 2016 18 vor concura 10 participanti.",
    lang: "ro",
  });
  // console.log(concepts);
  assert.equal(1, concepts.length);
  assert.equal("Eurovision 2016", concepts[0].value);
});

test("invalid connect with numbers: 2016 Eurovision", () => {
  const concepts = parse({
    text: "2016 Eurovision 2016 18 vor concura 10 participanti. 200 Eurovision",
    lang: "ro",
  });
  // console.log(concepts);
  assert.equal(2, concepts.length);
  assert.equal("Eurovision 2016", concepts[0].value);
  assert.equal("Eurovision", concepts[1].value);
});

test("invalid concepts without letters", () => {
  const concepts = parse({
    text: "2016. Eurovision 2016 18 vor concura 10.2 participanti Eu 200. Eurovision",
    lang: "ro",
  });
  // console.log(concepts);
  assert.equal(3, concepts.length);
  assert.equal("Eurovision 2016", concepts[0].value);
  assert.equal("Eu 200", concepts[1].value);
  assert.equal("Eurovision", concepts[2].value);
});

test("name abbr: B. Obama", () => {
  const concepts = parse({
    text: "V. Filat a fost retinut.",
    lang: "ro",
  });
  assert.equal(1, concepts.length);
  assert.equal("V. Filat", concepts[0].value);
});

test("name abbr: V. V. Putin", () => {
  const concepts = parse({
    text: "V. V. Putin este presedintele Rusiei.",
    lang: "ro",
  });
  assert.equal(2, concepts.length);
  assert.equal("V. V. Putin", concepts[0].value);
  assert.equal("Rusiei", concepts[1].value);
});

test("name abbr: VV Putin", () => {
  const concepts = parse({
    text: "VV Putin este presedintele Rusiei.",
    lang: "ro",
  });
  assert.equal(2, concepts.length);
  assert.equal("VV Putin", concepts[0].value);
});

test("name abbr: Putin V.", () => {
  const concepts = parse({
    text: "Putin V. este presedintele Rusiei.",
    lang: "ro",
  });
  assert.equal(2, concepts.length);
  assert.equal("Putin V.", concepts[0].value);
});

test("name abbr: World War II", () => {
  const concepts = parse({
    text: "World War II mistakes and Atom War I",
    lang: "en",
  });
  assert.equal(2, concepts.length);
  assert.equal("World War II", concepts[0].value);
  assert.equal("Atom War I", concepts[1].value);
});

test("quotes on word", () => {
  const concepts = parse({
    text: 'I know "SomeoneNew"',
    lang: "en",
  });
  assert.equal(1, concepts.length);
  assert.equal("SomeoneNew", concepts[0].value);
});

test("quotes some words", () => {
  const concepts = parse({
    text: 'I know "Someone Big"',
    lang: "en",
  });
  assert.equal(1, concepts.length);
  assert.equal("Someone Big", concepts[0].value);
});

test("first quotes some words", () => {
  const concepts = parse({
    text: 'I know "SomeoneNew big"',
    lang: "en",
  });
  assert.equal(1, concepts.length);
  assert.equal("SomeoneNew", concepts[0].value);
});

test("Russian quotes", () => {
  const concepts = parse({
    text: `«Сегодня в пункте пропуска «Новые Яриловичи» во время прохождения пограничного контроля попросил политического убежища гражданин России. Он обратился к пограничникам Черниговского отряда с заявлением о получении статуса беженца на территории Украины в связи с политическим преследованием в России», — сообщила Погранслужба Украины.`,
    lang: "ru",
  });
  // console.log(concepts);
  assert.equal(6, concepts.length);
  assert.equal("Новые Яриловичи", concepts[0].value);
});

test("parse 100 times", () => {
  const startTime = Date.now();
  for (let i = 0; i < 100; i++) {
    parse({
      text: "Președintele Partidului Democrat, Marian Lupu dă de înțeles într-un interviu acordat Infotag că urmează să vadă în ce măsură președintele Nicolae Timofti s-ar afla în capitivitate.\nDe asemenea, Marian Lupu susține că acesta ar face un joc murdar și vrea să ducă țara în haos.\n„Problema nu este însa Sturza, nu el este subiectul, ci PLDM şi preşedintele Timofti, care dacă vor face un astfel de joc murdar, practic aruncă ţara într-un haos total. Când noi ne-am dus la preşedinte şi i-am spus clar că avem voturile să desemnăm premierul şi să facem guvern pro european, el nesocoteşte această propunere şi vine cu o candidatură care nu adună mai mult de 10 voturi, înseamnă că în mod premeditat, conştient, el aruncă ţara într-o criză totală, o pune în pericol. Şi atunci urmează să vedem în ce măsură preşedintele Timofti este captiv, cum cei care îl presează au luat în captivitate instituţia prezidenţială, pentru că deja discutăm inclusiv de o problemă de securitate naţională. Iar răspunderea o vor purta şi regizorii, dar şi executanţii”, afirmă Lupu.\nTotodată, liderul PD este convins că președintele va aduce țara la alegeri anticipate.\n„După ce preşedintele va face o nominalizare împotriva întregului Parlament aproape, după ce va bloca definitiv negocierile dintre partidele pro europene, după ce va arunca ţara în anticipate, vom avea un preşedinte responsabil direct de declanşarea anticipatelor şi criza pe care o provoacă. Iar un preşedinte care face asta fiind conştient de situaţia dezastruoasă pe care o creează, nu mai reprezintă ţara, ci un partid sau un grup de interese‎. Vom avea un preşedinte aflat în captivitate şi va trebuie să găsim în primul rând soluţii să scoatem instutuţia prezidenţială din captivitatea în care este. Soluţii sunt sigur că sunt, dar să nu anticipăm acum care vor fi acestea”, mai adaugă liderul PD.\nUNIMEDIA amintește că PLDM respinge acuzațiile că liberal-democrații ar avea înțelegeri cu șeful statului, Nicolae Timofti, cu privire la candidatul la funcția de prim-ministru.\nPreședintele Nicolae Timofti nu a comentat deocamdată situația. ",
      lang: "ro",
      country: "md",
    });
  }
  const endTime = Date.now();
  const time = endTime - startTime;
  console.log(`Parsed 100 texts in ${time}ms`);
  assert.ok(time < 500);
});

test('Place "Person Name"', () => {
  const concepts = parse({
    text: "Azi la liceul Ion Creanga va...",
    lang: "ro",
    country: "md",
  });
  assert.equal(concepts.length, 1);
  assert.equal(concepts[0].value, "liceul Ion Creanga");
});

test("москва", () => {
  const concepts = parse({
    text: "Москва согласовали три митинга против пенсионной реформы",
    lang: "ru",
    country: "ru",
  });
  assert.equal(concepts.length, 1);
  assert.equal(concepts[0].value, "Москва");
});

test("word ending in connect char + letter at end of text is kept", () => {
  const concepts = parse({ text: `I love McDonald's`, lang: "en" });
  assert.equal(concepts.length, 1);
  assert.equal(concepts[0].value, "McDonald's");
  assert.equal(concepts[0].index, 7);
});

test("uppercase right after a connect char makes a concept", () => {
  const concepts = parse({
    text: `He met d'Artagnan yesterday.`,
    lang: "en",
  });
  assert.equal(concepts.length, 1);
  assert.equal(concepts[0].value, "d'Artagnan");
  assert.equal(concepts[0].index, 7);
});

test("uppercase right after a connect char makes a concept (ro)", () => {
  const concepts = parse({ text: `A vizitat l'Aquila ieri.`, lang: "ro" });
  assert.equal(concepts.length, 1);
  assert.equal(concepts[0].value, "l'Aquila");
  assert.equal(concepts[0].index, 10);
});

test("dotted abbreviation at end of text keeps its dot", () => {
  const concepts = parse({ text: `He works at U.S.`, lang: "en" });
  assert.equal(concepts.length, 1);
  assert.equal(concepts[0].value, "U.S.");
});

test("connect char word mid-text is unaffected", () => {
  const concepts = parse({ text: `I love McDonald's food`, lang: "en" });
  assert.equal(concepts.length, 1);
  assert.equal(concepts[0].value, "McDonald's");
  assert.equal(concepts[0].index, 7);
});

test("hyphenated name at end of text is unaffected", () => {
  const concepts = parse({ text: `A venit Ana-Maria`, lang: "ro" });
  assert.equal(concepts.length, 1);
  assert.equal(concepts[0].value, "Ana-Maria");
  assert.equal(concepts[0].index, 8);
});

test("stray dash after a word is not part of the concept", () => {
  const text = `Ieri John- Smith a ajuns la Chișinău.`;
  const concepts = parse({ text, lang: "ro" });
  assert.deepEqual(
    concepts.map((c) => c.value),
    ["John", "Smith", "Chișinău"],
  );
  assert.equal(concepts[0].index, 5);
  assert.equal(concepts[1].index, 11);
});

test("trailing connect char at end of text is stripped", () => {
  const concepts = parse({ text: `A venit apoi Ana-`, lang: "ro" });
  assert.equal(concepts.length, 1);
  assert.equal(concepts[0].value, "Ana");
  assert.equal(concepts[0].index, 13);
});

test("plural possessive apostrophe is not kept", () => {
  const concepts = parse({ text: `The Smiths' cat is grey`, lang: "en" });
  assert.equal(concepts.length, 1);
  assert.equal(concepts[0].value, "Smiths");
  assert.equal(concepts[0].index, 4);
});

test("trailing curly apostrophe at end of text is stripped", () => {
  const concepts = parse({ text: `A venit apoi Ana’`, lang: "ro" });
  assert.equal(concepts.length, 1);
  assert.equal(concepts[0].value, "Ana");
  assert.equal(concepts[0].index, 13);
});

test("empty options object defaults to identify mode", () => {
  const concepts = parse(
    { text: "Moldova este stat în Europa.", lang: "ro" },
    {},
  );
  assert.deepEqual(
    concepts.map((c) => c.value),
    ["Moldova", "Europa"],
  );
});

test("explicitly invalid `filters` value still throws", () => {
  assert.throws(
    () =>
      parse(
        { text: "Moldova este stat.", lang: "ro" },
        { filters: "duplicate" as unknown as string[] },
      ),
    /`filters` fields is invalid/,
  );
});

test("dotted abbreviations with 3+ letters keep the final dot", () => {
  const concepts = parse({
    text: "Delegația a zburat în S.U.A. săptămâna trecută.",
    lang: "ro",
  });
  assert.deepEqual(
    concepts.map((c) => c.value),
    ["Delegația", "S.U.A."],
  );
});

test("language code is normalized (uppercase, padding)", () => {
  const concepts = parse({ text: "Moldova este stat în Europa.", lang: "RO" });
  assert.deepEqual(
    concepts.map((c) => c.value),
    ["Moldova", "Europa"],
  );
  const padded = parse({ text: "Moldova este stat în Europa.", lang: " ro " });
  assert.deepEqual(
    padded.map((c) => c.value),
    ["Moldova", "Europa"],
  );
});

test("NBSP joins words like a regular space", () => {
  const text = "He visited the Republic of\u00A0Moldova in June.";
  const concepts = parse({ text, lang: "en" });
  const normalized = concepts.map((c) => c.value.replace(/\u00A0/g, " "));
  assert.deepEqual(normalized, ["Republic of Moldova"]);

  const direct = parse({ text: "Ieri Ana\u00A0Popescu a venit.", lang: "ro" });
  assert.deepEqual(
    direct.map((c) => c.value.replace(/\u00A0/g, " ")),
    ["Ana Popescu"],
  );
});

test("es: names joined with bare 'de' stay whole", () => {
  const concepts = parse({
    text: "El escritor Miguel de Cervantes nació en Alcalá de Henares.",
    lang: "es",
  });
  assert.deepEqual(
    concepts.map((c) => c.value),
    ["Miguel de Cervantes", "Alcalá de Henares"],
  );
});

test("ru: 'имени' joins institution names", () => {
  const mgu = parse({
    text: "Он окончил МГУ имени Ломоносова в прошлом году.",
    lang: "ru",
  });
  assert.deepEqual(
    mgu.map((c) => c.value),
    ["МГУ имени Ломоносова"],
  );
  const univ = parse({
    text: "Конференция прошла в Университете имени Баумана вчера вечером.",
    lang: "ru",
  });
  assert.deepEqual(
    univ.map((c) => c.value),
    // "Конференция" is a sentence-start word, kept by identify mode
    ["Конференция", "Университете имени Баумана"],
  );
});

// Italian elision: lowercase elided articles (l', dell', all', nell', ...)
// are stripped from the front of a concept. The rule is case-sensitive on
// purpose: capitalized forms are indistinguishable from real names
// ("L'Aquila", "Dell'Utri"), and "d'" is excluded entirely ("d'Artagnan").
// A capitalized sentence-start elision like "L'incontro" therefore stays.
test("it: lowercase elided articles are stripped from concepts", () => {
  const concepts = parse({
    text: "L'incontro ha riguardato il bilancio dell'Unione Europea e il sostegno all'Ucraina.",
    lang: "it",
  });
  assert.deepEqual(
    concepts.map((c) => c.value),
    ["L'incontro", "Unione Europea", "Ucraina"],
  );

  const italia = parse({
    text: "Il premier ha visitato l'Italia del nord.",
    lang: "it",
  });
  assert.deepEqual(
    italia.map((c) => c.value),
    ["Italia"],
  );
});

test("empty and letterless texts produce no concepts", () => {
  assert.deepEqual(parse({ text: "", lang: "ro" }), []);
  assert.deepEqual(parse({ text: "   \n\t  ", lang: "ro" }), []);
  assert.deepEqual(parse({ text: "A", lang: "ro" }), []);
  assert.deepEqual(parse({ text: "12 34 !?", lang: "ro" }), []);
  assert.deepEqual(parse({ text: "It happened in 1999.", lang: "en" }), []);
});

test("unsupported language throws", () => {
  assert.throws(
    () => parse({ text: "Moldova", lang: "xx" }),
    /Invalid language: xx/,
  );
});

test("emoji separate words like punctuation", () => {
  const concepts = parse({ text: "Ana😀Maria came to 😀 Paris", lang: "en" });
  assert.deepEqual(
    concepts.map((c) => [c.value, c.index]),
    [
      ["Ana", 0],
      ["Maria", 5],
      // each emoji is a surrogate pair: two code units
      ["Paris", 22],
    ],
  );
});

test("inner uppercase makes a lowercase-led word a concept: iPhone", () => {
  const concepts = parse({
    text: "The new iPhone 15 was presented by Apple.",
    lang: "en",
  });
  assert.deepEqual(
    concepts.map((c) => c.value),
    ["iPhone 15", "Apple"],
  );
});

test("hyphen + digits inside an abbreviation: COVID-19", () => {
  const concepts = parse({
    text: "The COVID-19 pandemic hit Europe.",
    lang: "en",
  });
  assert.deepEqual(
    concepts.map((c) => c.value),
    ["COVID-19", "Europe"],
  );
  assert.equal(concepts[0].isAbbr, true);

  const ru = parse({ text: "Договор СНВ-3 подписан в Праге.", lang: "ru" });
  assert.deepEqual(
    ru.map((c) => c.value),
    ["Договор СНВ-3", "Праге"],
  );
});

// By design (recall-first): a number word needs only SOME earlier candidate
// word, then joins the following capitalized word across a single space.
// There is no syntactic line between "12 May" and "2016 Bob" — restricting
// numbers here would lose year-qualified entities (see the next test), so
// concepts stay generous and precision belongs to the data lists downstream.
// Decision record: docs/superpowers/plans/2026-08-15-number-glue-fix.md
test("recall-first: a year may glue onto the following name", () => {
  const en = parse({ text: "In 2016 Obama announced his plan.", lang: "en" });
  assert.deepEqual(
    en.map((c) => c.value),
    ["2016 Obama"],
  );

  const far = parse({ text: "Anna met 2016 Bob.", lang: "en" });
  assert.deepEqual(
    far.map((c) => c.value),
    ["Anna", "2016 Bob"],
  );

  const ro = parse({
    text: "Concertul din 2019 Amsterdam a fost anulat.",
    lang: "ro",
  });
  assert.deepEqual(
    ro.map((c) => c.value),
    ["Concertul din 2019 Amsterdam"],
  );
});

// The recall the previous test's noise pays for: year-qualified events and
// day-led dates are real entities and must keep being extracted whole.
test("recall-first: year-qualified events and dates stay whole", () => {
  const olympics = parse({
    text: "She competed at the 2016 Summer Olympics in Rio.",
    lang: "en",
  });
  assert.deepEqual(
    olympics.map((c) => c.value),
    ["2016 Summer Olympics", "Rio"],
  );

  const date = parse({
    text: "The contract was signed on 12 May 2026 in Brussels.",
    lang: "en",
  });
  assert.deepEqual(
    date.map((c) => c.value),
    ["12 May 2026", "Brussels"],
  );

  const tour = parse({
    text: "Turul Frantei din 2019 a fost spectaculos.",
    lang: "ro",
  });
  assert.deepEqual(
    tour.map((c) => c.value),
    ["Turul Frantei din 2019"],
  );
});

// LIMITATION: "U.S." keeps its dot, and the capitalized sentence starter
// after it is one space away — indistinguishable from "V. Putin"-style
// abbreviated names, so the two merge across the sentence boundary.
test("dotted abbreviation before a sentence start merges across it", () => {
  const concepts = parse({
    text: "He moved to the U.S. Yesterday he came back.",
    lang: "en",
  });
  assert.deepEqual(
    concepts.map((c) => c.value),
    ["U.S. Yesterday"],
  );
});

test("doubled dot after a dotted abbreviation drops the final dot", () => {
  const concepts = parse({
    text: "A plecat in S.U.A.. Apoi a revenit.",
    lang: "ro",
  });
  assert.deepEqual(
    concepts.map((c) => c.value),
    // "S.U.A.." parses as word "S.U.A" — the abbreviation survives minus its
    // last dot, and still maps back into the text
    ["S.U.A", "Apoi"],
  );
  assert.equal(concepts[0].index, 12);
});

test("'St.' is not ALL-CAPS dotted, so it loses its dot", () => {
  const concepts = parse({
    text: "O'Brien met McDonald's owner at St. Mary's Church.",
    lang: "en",
  });
  assert.deepEqual(
    concepts.map((c) => c.value),
    ["O'Brien", "McDonald's", "St", "Mary's Church"],
  );
});

test("connect word 'and' can chain two product names into one concept", () => {
  const concepts = parse({
    text: "Windows 11 and Office 365 were updated.",
    lang: "en",
  });
  assert.deepEqual(
    concepts.map((c) => c.value),
    ["Windows 11 and Office 365"],
  );
});

test("ampersand joins names directly and across spaces", () => {
  const concepts = parse({ text: "Ana & Bob run A&B Company.", lang: "en" });
  assert.deepEqual(
    concepts.map((c) => c.value),
    ["Ana & Bob", "A&B Company"],
  );
});

test("a word may mix several connect chars", () => {
  const concepts = parse({ text: "The name X&Y-Z'W is odd.", lang: "en" });
  assert.deepEqual(
    concepts.map((c) => c.value),
    ["X&Y-Z'W"],
  );
});

test("doubled connect chars split the word", () => {
  const concepts = parse({ text: "A venit Ana--Maria ieri.", lang: "ro" });
  assert.deepEqual(
    concepts.map((c) => [c.value, c.index]),
    [
      ["Ana", 8],
      ["Maria", 13],
    ],
  );
});

test("concepts longer than 100 chars are dropped, 100 exactly is kept", () => {
  const kept = "A" + "b".repeat(99);
  assert.deepEqual(
    parse({ text: `${kept} arrived.`, lang: "en" }).map((c) => c.value),
    [kept],
  );

  const chain =
    "The Very Extremely Unbelievably Long Institution Name Of Continuous " +
    "Capital Words That Keeps Going And Going And Going Forever announced something.";
  assert.deepEqual(parse({ text: chain, lang: "en" }), []);
});

test("en-dash connect word joins route endpoints", () => {
  const concepts = parse({
    text: "The Moscow – Berlin route is closed.",
    lang: "en",
  });
  assert.deepEqual(
    concepts.map((c) => c.value),
    ["Moscow – Berlin"],
  );
});

test("tab and CRLF are word separators, never joiners", () => {
  const tab = parse({ text: "Barack\tObama spoke.", lang: "en" });
  assert.deepEqual(
    tab.map((c) => c.value),
    ["Barack", "Obama"],
  );
  const crlf = parse({ text: "Barack\r\nObama spoke.", lang: "en" });
  assert.deepEqual(
    crlf.map((c) => [c.value, c.index]),
    [
      ["Barack", 0],
      ["Obama", 8],
    ],
  );
});

test("a leading apostrophe stays outside the concept", () => {
  const concepts = parse({ text: "'Twas Ana who came.", lang: "en" });
  assert.deepEqual(
    concepts.map((c) => [c.value, c.index]),
    [["Twas Ana", 1]],
  );
});

test("public API surface re-exports work", () => {
  const concepts = api.parse({ text: "Moldova este stat.", lang: "ro" });
  assert.equal(concepts[0].value, "Moldova");
  assert.ok(concepts[0] instanceof api.Concept);
  assert.equal(typeof api.Parser, "function");
  assert.equal(typeof api.splitter.split, "function");
});

test("bg: Cyrillic names and places", () => {
  const concepts = parse({
    text: "Президентът Румен Радев посети София и се срещна с Бойко Борисов.",
    lang: "bg",
  });
  assert.deepEqual(
    concepts.map((c) => c.value),
    ["Румен Радев", "София", "Бойко Борисов"],
  );
});

test("hu: names with diacritics", () => {
  const concepts = parse({
    text: "Orbán Viktor találkozott Emmanuel Macron elnökkel Budapesten.",
    lang: "hu",
  });
  assert.deepEqual(
    concepts.map((c) => c.value),
    ["Orbán Viktor", "Emmanuel Macron", "Budapesten"],
  );
});

test("cs: title prefix is stripped", () => {
  const concepts = parse({
    text: "Prezident Petr Pavel navštívil Prahu a setkal se s Karlem.",
    lang: "cs",
  });
  assert.deepEqual(
    concepts.map((c) => c.value),
    ["Petr Pavel", "Prahu", "Karlem"],
  );
});

test("pl: connect word 'w' joins a place phrase", () => {
  const concepts = parse({
    text: "Prezydent Andrzej Duda spotkał się z Donaldem Tuskiem w Warszawie.",
    lang: "pl",
  });
  assert.deepEqual(
    concepts.map((c) => c.value),
    ["Andrzej Duda", "Donaldem Tuskiem w Warszawie"],
  );
});

test("it: connect word 'e' joins coordinated places", () => {
  const concepts = parse({
    text: "Il presidente Sergio Mattarella ha visitato Roma e Milano.",
    lang: "it",
  });
  assert.deepEqual(
    concepts.map((c) => c.value),
    ["Sergio Mattarella", "Roma e Milano"],
  );
});

test("es: 'y' is not a connect word, places stay separate", () => {
  const concepts = parse({
    text: "El presidente Pedro Sánchez visitó Madrid y Barcelona.",
    lang: "es",
  });
  assert.deepEqual(
    concepts.map((c) => c.value),
    ["Pedro Sánchez", "Madrid", "Barcelona"],
  );
});

test("it: capitalized elisions and the d' particle are preserved", () => {
  const expected: [string, string[]][] = [
    ["Il terremoto ha colpito L'Aquila nel 2009.", ["L'Aquila"]],
    ["Marcello Dell'Utri è stato condannato ieri.", ["Marcello Dell'Utri"]],
    [
      "Le avventure di d'Artagnan sono famose in Francia.",
      ["d'Artagnan", "Francia"],
    ],
    ["La Banca d'Italia ha alzato i tassi ieri.", ["La Banca d'Italia"]],
  ];
  for (const [text, values] of expected) {
    assert.deepEqual(
      parse({ text, lang: "it" }).map((c) => c.value),
      values,
      text,
    );
  }
});
