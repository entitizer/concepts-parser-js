/**
 * Article-scale tests: realistic multi-paragraph news texts for every supported
 * language, including typical human mistakes (double spaces, a missing space
 * after a sentence dot, CRLF line endings, mismatched quotation marks,
 * possessives, Latin abbreviations inside Cyrillic text).
 *
 * The expected lists snapshot CURRENT behavior, verified by hand. Entries
 * marked BUG or LIMITATION document imperfect output; each BUG is pinned with
 * its root cause and desired behavior in known-bugs.test.ts. When a bug is
 * fixed, update the snapshot here and promote the pinned test there.
 */
import { parse } from "./parse";
import { Concept } from "./concept";
import test from "node:test";
import assert from "node:assert/strict";

const CONNECT_CHARS = ["-", "'", "’", "`", "&", "."];

function assertInvariants(concepts: Concept[], text: string, lang: string) {
  for (const c of concepts) {
    assert.equal(
      text.slice(c.index, c.endIndex),
      c.value,
      `index mapping broken for "${c.value}" (${lang})`,
    );
    assert.equal(c.value, c.value.trim(), `untrimmed value "${c.value}"`);
    assert.ok(c.value.length >= 2 && c.value.length <= 100);
    const last = c.value[c.value.length - 1];
    if (CONNECT_CHARS.includes(last)) {
      // a trailing dot is legal only for dotted uppercase abbreviations
      assert.ok(
        last === "." && /[A-ZĂÂÎȘȚА-ЯЁ]\.$/.test(c.value),
        `stray trailing connect char in "${c.value}"`,
      );
    }
  }
}

const vals = (concepts: Concept[]) => concepts.map((c) => c.value);

// ---------------------------------------------------------------- Romanian

const RO_TEXT = `Chișinău. Președintele Maia Sandu s-a întâlnit ieri cu premierul României la Palatul Cotroceni din București.

Discuțiile au vizat aderarea la Uniunea Europeană (UE) și proiectele comune de infrastructură. „România rămâne cel mai apropiat partener al nostru”, a declarat Maia Sandu după întrevedere. Delegația moldoveană a vizitat și Teatrul Național „Ion Luca Caragiale”, unde a fost organizată o recepție.

Pe 9 mai, la summitul de la Sibiu, R. Moldova va semna un memorandum cu Banca Europeană de Investiții. Ministrul  Nicu Popescu a confirmat participarea.Traseul Chișinău – Sibiu va fi parcurs cu trenul.`;

test("ro article: identify", () => {
  const concepts = parse({ text: RO_TEXT, lang: "ro" });
  assert.deepEqual(vals(concepts), [
    "Chișinău",
    "Maia Sandu", // "Președintele" stripped by invalid_prefix
    "României",
    "Palatul Cotroceni din București",
    "Discuțiile", // LIMITATION: sentence-start word kept in identify mode
    "Uniunea Europeană",
    "UE",
    "România",
    "Maia Sandu",
    "Delegația", // LIMITATION: sentence-start word kept in identify mode
    "Teatrul Național „Ion Luca Caragiale”", // quote filter merged the name
    "Sibiu",
    "R. Moldova",
    "Banca Europeană de Investiții",
    "Nicu Popescu", // survives the double space after "Ministrul"
    // BUG(missing-space-after-dot): "participarea.Traseul" merges across the
    // sentence boundary and swallows the route
    "participarea.Traseul Chișinău – Sibiu",
  ]);
  assertInvariants(concepts, RO_TEXT, "ro");

  const ue = concepts.find((c) => c.value === "Uniunea Europeană");
  assert.equal(ue?.abbr, "UE");
  const rm = concepts.find((c) => c.value === "R. Moldova");
  assert.equal(rm?.countWords, 2);
});

test("ro article: collect drops sentence starters and duplicates", () => {
  const concepts = parse({ text: RO_TEXT, lang: "ro" }, { mode: "collect" });
  assert.deepEqual(vals(concepts), [
    "Maia Sandu",
    "României",
    "Palatul Cotroceni din București",
    "Uniunea Europeană",
    "UE",
    "România",
    "Teatrul Național „Ion Luca Caragiale”",
    "Sibiu",
    "R. Moldova",
    "Banca Europeană de Investiții",
    "Nicu Popescu",
    "participarea.Traseul Chișinău – Sibiu",
  ]);
  assertInvariants(concepts, RO_TEXT, "ro");
});

// ---------------------------------------------------------------- English

const EN_TEXT =
  'London. The Prime Minister met Volodymyr Zelensky at Downing Street on Tuesday, alongside the Foreign Secretary.\r\n\r\nThe leaders discussed further support for Ukraine and the North Atlantic Treaty Organization (NATO) summit in Washington. "The United Kingdom stands with Ukraine," the Prime Minister said. Later, the delegation visited the British Museum and met executives from Johnson & Johnson.\r\n\r\nA new agreement with the European Union will be signed on 12 May 2026 in Brussels. Ludwig van der Rohe\'s archive will be displayed in Camden district next month.';

test("en article: identify", () => {
  const concepts = parse({ text: EN_TEXT, lang: "en" });
  assert.deepEqual(vals(concepts), [
    "London",
    "Volodymyr Zelensky", // "The Prime Minister" fully removed by filters
    "Downing Street",
    "Foreign Secretary",
    "Ukraine",
    "North Atlantic Treaty Organization",
    "NATO",
    "Washington",
    "United Kingdom", // leading "The" stripped inside the quotation
    "Ukraine",
    "British Museum",
    "Johnson & Johnson",
    "European Union",
    "12 May 2026", // LIMITATION: dates join like "Euro 2016" does
    "Brussels",
    "Ludwig van der Rohe's", // LIMITATION: possessive "'s" is kept
    "Camden district", // suffix filter extended "Camden"
  ]);
  assertInvariants(concepts, EN_TEXT, "en");

  assert.equal(concepts[0].index, 0);
  const nato = concepts.find((c) => c.value === "NATO");
  assert.equal(nato?.isAbbr, true);
  const org = concepts.find(
    (c) => c.value === "North Atlantic Treaty Organization",
  );
  assert.equal(org?.abbr, "NATO");
});

test("en article: collect deduplicates repeated entities", () => {
  const concepts = parse({ text: EN_TEXT, lang: "en" }, { mode: "collect" });
  assert.equal(vals(concepts).filter((v) => v === "Ukraine").length, 1);
  assert.deepEqual(vals(concepts), [
    "Volodymyr Zelensky",
    "Downing Street",
    "Foreign Secretary",
    "Ukraine",
    "North Atlantic Treaty Organization",
    "NATO",
    "Washington",
    "United Kingdom",
    "British Museum",
    "Johnson & Johnson",
    "European Union",
    "12 May 2026",
    "Brussels",
    "Ludwig van der Rohe's",
    "Camden district",
  ]);
  assertInvariants(concepts, EN_TEXT, "en");
});

// ---------------------------------------------------------------- Russian

const RU_TEXT = `Москва. Президент России Владимир Путин провёл переговоры с Си Цзиньпином в Кремле.

Стороны обсудили поставки газа и проект «Сила Сибири». «Газпром» подпишет контракт с Китайской национальной нефтегазовой корпорацией (CNPC) до конца года. В. В. Путин отметил, что Россия готова расширить сотрудничество с Пекином.

После встречи делегация посетила Большой театр и МГУ имени Ломоносова. Переговоры продолжатся 15 мая в Пекине.`;

test("ru article: identify", () => {
  const concepts = parse({ text: RU_TEXT, lang: "ru" });
  assert.deepEqual(vals(concepts), [
    "Москва",
    // BUG(invalid-prefix-remnant): stripping "Президент" leaves the genitive
    // "России" glued to the person's name
    "России Владимир Путин",
    "Си Цзиньпином",
    "Кремле",
    "Стороны", // LIMITATION: sentence-start word kept in identify mode
    "Сила Сибири",
    "Газпром",
    "Китайской", // LIMITATION: lowercase continuation words are not joined
    "CNPC", // Latin abbreviation inside Cyrillic text
    "В. В. Путин",
    "Россия",
    "Пекином",
    "Большой театр", // suffix filter completes the stopword-headed name
    "МГУ имени Ломоносова",
    "Переговоры",
    "Пекине",
  ]);
  assertInvariants(concepts, RU_TEXT, "ru");

  const putin = concepts.find((c) => c.value === "В. В. Путин");
  assert.equal(putin?.countWords, 3);
});

test("ru article: collect", () => {
  const concepts = parse({ text: RU_TEXT, lang: "ru" }, { mode: "collect" });
  assert.deepEqual(vals(concepts), [
    "России Владимир Путин",
    "Си Цзиньпином",
    "Кремле",
    "Сила Сибири",
    "Газпром",
    "Китайской",
    "CNPC",
    "В. В. Путин",
    "Россия",
    "Пекином",
    "Большой театр",
    "МГУ имени Ломоносова",
    "Пекине",
  ]);
  assertInvariants(concepts, RU_TEXT, "ru");
});

// ---------------------------------------------------------------- Bulgarian

// Note the human mistake: the quotation opens with „ but closes with a straight ".
const BG_TEXT = `София. Премиерът се срещна с Урсула фон дер Лайен в Народното събрание.

България ще получи средства от Европейския съюз (ЕС) по плана за възстановяване. „Няма да има забавяне", каза той пред Българската национална телевизия. Срещата завърши на площад Александър Невски в центъра на София.`;

test("bg article: identify", () => {
  const concepts = parse({ text: BG_TEXT, lang: "bg" });
  assert.deepEqual(vals(concepts), [
    "София",
    "Премиерът", // LIMITATION: sentence-start word kept in identify mode
    "Урсула фон дер Лайен", // "фон дер" joined via connect words
    "Народното", // LIMITATION: lowercase "събрание" is not joined
    "България",
    "Европейския съюз",
    "ЕС",
    "Българската", // LIMITATION: lowercase continuation not joined
    "Срещата", // LIMITATION: sentence-start word kept in identify mode
    "площад Александър Невски", // lowercase prefix "площад" added by prefix filter
    "София",
  ]);
  assertInvariants(concepts, BG_TEXT, "bg");
});

test("bg article: collect loses sentence-initial entities", () => {
  const concepts = parse({ text: BG_TEXT, lang: "bg" }, { mode: "collect" });
  // LIMITATION: "България" only ever appears sentence-initially here, so
  // start_word removes every occurrence of the article's main subject.
  assert.deepEqual(vals(concepts), [
    "Урсула фон дер Лайен",
    "Народното",
    "Европейския съюз",
    "ЕС",
    "Българската",
    "площад Александър Невски",
    "София",
  ]);
  assertInvariants(concepts, BG_TEXT, "bg");
});

// ---------------------------------------------------------------- Czech

const CS_TEXT = `Praha. Prezident Petr Pavel přijal na Pražském hradě předsedkyni Evropské komise.

Jednání se týkala rozšíření Evropské unie (EU) a další podpory Ukrajiny. Poté delegace navštívila Univerzitu Karlovu a Národní divadlo. Občanská demokratická strana podpořila dohodu v Poslanecké sněmovně.

Podle České národní banky dosáhne inflace dvou procent již letos.`;

test("cs article: identify", () => {
  const concepts = parse({ text: CS_TEXT, lang: "cs" });
  assert.deepEqual(vals(concepts), [
    "Praha",
    "Petr Pavel", // "Prezident" stripped by invalid_prefix
    "Pražském", // LIMITATION: lowercase "hradě" is not joined
    "Evropské", // LIMITATION: lowercase "komise" is not joined
    "Jednání", // LIMITATION: sentence-start word kept in identify mode
    "Evropské unie",
    "EU",
    "Ukrajiny",
    "Poté", // LIMITATION: sentence-start word kept in identify mode
    // LIMITATION: connect word "a" merges two distinct institutions
    "Univerzitu Karlovu a Národní divadlo",
    "Občanská demokratická strana", // found by the known filter
    "Poslanecké", // LIMITATION: lowercase "sněmovně" is not joined
    "České národní banky", // suffix filter works for Latin-script Czech
  ]);
  assertInvariants(concepts, CS_TEXT, "cs");

  const known = concepts.find(
    (c) => c.value === "Občanská demokratická strana",
  );
  assert.equal(known?.get("isKnown"), true);
});

test("cs article: collect", () => {
  const concepts = parse({ text: CS_TEXT, lang: "cs" }, { mode: "collect" });
  assert.deepEqual(vals(concepts), [
    "Petr Pavel",
    "Pražském",
    "Evropské",
    "Evropské unie",
    "EU",
    "Ukrajiny",
    "Univerzitu Karlovu a Národní divadlo",
    "Občanská demokratická strana",
    "Poslanecké",
    "České národní banky",
  ]);
  assertInvariants(concepts, CS_TEXT, "cs");
});

// ---------------------------------------------------------------- Polish

const PL_TEXT = `Warszawa. Prezydent Andrzej Duda spotkał się z Donaldem Tuskiem w Pałacu Prezydenckim.

Rozmowy dotyczyły budżetu Unii Europejskiej (UE) oraz wsparcia dla Ukrainy. Później delegacja odwiedziła Uniwersytet Warszawski i Muzeum Powstania Warszawskiego. Lech Wałęsa również zabrał głos w debacie publicznej.

Szczyt Grupy Wyszehradzkiej odbędzie się 20 maja w Krakowie.`;

test("pl article: identify", () => {
  const concepts = parse({ text: PL_TEXT, lang: "pl" });
  assert.deepEqual(vals(concepts), [
    "Warszawa",
    "Andrzej Duda", // "Prezydent" stripped by invalid_prefix
    // LIMITATION: connect word "w" merges the person with the palace
    "Donaldem Tuskiem w Pałacu Prezydenckim",
    "Rozmowy", // LIMITATION: sentence-start word kept in identify mode
    "Unii Europejskiej",
    "UE",
    "Ukrainy",
    "Później", // LIMITATION: sentence-start word kept in identify mode
    // LIMITATION: connect word "i" merges two distinct institutions
    "Uniwersytet Warszawski i Muzeum Powstania Warszawskiego",
    "Lech Wałęsa",
    "Szczyt Grupy Wyszehradzkiej",
    "Krakowie",
  ]);
  assertInvariants(concepts, PL_TEXT, "pl");
});

test("pl article: collect", () => {
  const concepts = parse({ text: PL_TEXT, lang: "pl" }, { mode: "collect" });
  assert.deepEqual(vals(concepts), [
    "Andrzej Duda",
    "Donaldem Tuskiem w Pałacu Prezydenckim",
    "Unii Europejskiej",
    "UE",
    "Ukrainy",
    "Uniwersytet Warszawski i Muzeum Powstania Warszawskiego",
    "Lech Wałęsa",
    "Szczyt Grupy Wyszehradzkiej",
    "Krakowie",
  ]);
  assertInvariants(concepts, PL_TEXT, "pl");
});

// ---------------------------------------------------------------- Hungarian

const HU_TEXT = `Budapest. Orbán Viktor miniszterelnök fogadta az Európai Bizottság elnökét a Karmelita kolostorban.

A tárgyalások az Európai Unió (EU) költségvetéséről szóltak. A küldöttség ellátogatott a Budapesti Műszaki Egyetemre és a Magyar Tudományos Akadémiára is. Novák Katalin és Orbán Viktor közösen nyilatkozott a sajtónak.

A csúcstalálkozót májusban rendezik Debrecenben.`;

test("hu article: identify", () => {
  const concepts = parse({ text: HU_TEXT, lang: "hu" });
  assert.deepEqual(vals(concepts), [
    "Budapest",
    "Orbán Viktor",
    "Európai Bizottság",
    "Karmelita", // LIMITATION: lowercase "kolostorban" is not joined
    "Európai Unió",
    "EU",
    // LIMITATION: connect phrase "és a" merges two institutions
    "Budapesti Műszaki Egyetemre és a Magyar Tudományos Akadémiára",
    // LIMITATION: connect word "és" merges two people
    "Novák Katalin és Orbán Viktor",
    "Debrecenben",
  ]);
  assertInvariants(concepts, HU_TEXT, "hu");

  // splitter recovers the two people from the merged concept
  const pair = concepts.find(
    (c) => c.value === "Novák Katalin és Orbán Viktor",
  );
  assert.deepEqual(
    pair?.split().map((c) => c.value),
    ["Novák Katalin", "Orbán Viktor"],
  );
});

test("hu article: collect", () => {
  const concepts = parse({ text: HU_TEXT, lang: "hu" }, { mode: "collect" });
  assert.deepEqual(vals(concepts), [
    "Orbán Viktor",
    "Európai Bizottság",
    "Karmelita",
    "Európai Unió",
    "EU",
    "Budapesti Műszaki Egyetemre és a Magyar Tudományos Akadémiára",
    "Novák Katalin és Orbán Viktor",
    "Debrecenben",
  ]);
  assertInvariants(concepts, HU_TEXT, "hu");
});

// ---------------------------------------------------------------- Italian

const IT_TEXT = `Roma. Il presidente del Consiglio ha incontrato Sergio Mattarella al Quirinale.

L'incontro ha riguardato il bilancio dell'Unione Europea (UE) e il sostegno all'Ucraina. La delegazione ha poi visitato la Banca d'Italia e il Museo di Villa Borghese. Giorgia Meloni e Sergio Mattarella hanno rilasciato dichiarazioni congiunte.

Il vertice del G7 si terrà il 13 giugno a Napoli.`;

test("it article: identify", () => {
  const concepts = parse({ text: IT_TEXT, lang: "it" });
  assert.deepEqual(vals(concepts), [
    "Roma",
    "Sergio Mattarella",
    "Quirinale",
    "L'incontro", // BUG(elision): article "L'" hides a stopword from filters
    "dell'Unione Europea", // BUG(elision): junk "dell'" prefix on the entity
    "UE",
    "all'Ucraina", // BUG(elision): junk "all'" prefix on the entity
    "Banca d'Italia", // apostrophe inside a real name works
    "Museo di Villa Borghese",
    // LIMITATION: connect word "e" merges two people
    "Giorgia Meloni e Sergio Mattarella",
    "G7",
    "Napoli",
  ]);
  assertInvariants(concepts, IT_TEXT, "it");
});

test("it article: collect", () => {
  const concepts = parse({ text: IT_TEXT, lang: "it" }, { mode: "collect" });
  assert.deepEqual(vals(concepts), [
    "Sergio Mattarella",
    "Quirinale",
    "dell'Unione Europea",
    "UE",
    "all'Ucraina",
    "Banca d'Italia",
    "Museo di Villa Borghese",
    "Giorgia Meloni e Sergio Mattarella",
    "G7",
    "Napoli",
  ]);
  assertInvariants(concepts, IT_TEXT, "it");
});

// ---------------------------------------------------------------- Spanish

const ES_TEXT = `Madrid. El presidente del Gobierno recibió a Ursula von der Leyen en el Palacio de la Moncloa.

Las conversaciones trataron sobre el presupuesto de la Unión Europea (UE) y el apoyo a Ucrania. La delegación visitó después el Museo del Prado y la Real Academia Española. Pedro Sánchez y Felipe González intervinieron en el debate.

La cumbre del G20 se celebrará el 11 de junio en Sevilla.`;

test("es article: identify", () => {
  const concepts = parse({ text: ES_TEXT, lang: "es" });
  assert.deepEqual(vals(concepts), [
    "Madrid",
    "Gobierno",
    "Ursula von der Leyen", // "von der" joined via connect words
    "Palacio de la Moncloa", // "de la" joined via connect words
    "Unión Europea",
    "UE",
    "Ucrania",
    "Museo del Prado",
    "Real Academia Española",
    "Pedro Sánchez", // "y" is not a connect word, so the two people stay separate
    "Felipe González",
    "G20",
    "Sevilla",
  ]);
  assertInvariants(concepts, ES_TEXT, "es");
});

test("es article: collect", () => {
  const concepts = parse({ text: ES_TEXT, lang: "es" }, { mode: "collect" });
  assert.deepEqual(vals(concepts), [
    "Gobierno",
    "Ursula von der Leyen",
    "Palacio de la Moncloa",
    "Unión Europea",
    "UE",
    "Ucrania",
    "Museo del Prado",
    "Real Academia Española",
    "Pedro Sánchez",
    "Felipe González",
    "G20",
    "Sevilla",
  ]);
  assertInvariants(concepts, ES_TEXT, "es");
});

// ---------------------------------------------------------------- Scale

test("large text: results scale linearly and invariants hold", () => {
  const N = 25;
  const single = parse({ text: RO_TEXT, lang: "ro" });
  const bigText = new Array(N).fill(RO_TEXT).join("\n\n");
  const big = parse({ text: bigText, lang: "ro" });

  assert.equal(big.length, N * single.length);
  assertInvariants(big, bigText, "ro");
});

test("large mixed text parses without errors in every language", () => {
  const texts: { [lang: string]: string } = {
    ro: RO_TEXT,
    en: EN_TEXT,
    ru: RU_TEXT,
    bg: BG_TEXT,
    cs: CS_TEXT,
    pl: PL_TEXT,
    hu: HU_TEXT,
    it: IT_TEXT,
    es: ES_TEXT,
  };
  for (const [lang, text] of Object.entries(texts)) {
    const bigText = new Array(10).fill(text).join("\n\n");
    for (const mode of ["identify", "collect"]) {
      const concepts = parse({ text: bigText, lang }, { mode });
      assert.ok(concepts.length > 0, `${lang}/${mode} found no concepts`);
      assertInvariants(concepts, bigText, lang);
    }
  }
});
