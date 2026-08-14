import { parse } from "./parse";
import test from "node:test";
import assert from "node:assert/strict";

const CASES: Array<{ lang: string; text: string }> = [
  {
    lang: "ro",
    text: `Ieri la Teatrul Național "Mihai Eminescu" a fost premiera.`,
  },
  {
    lang: "ro",
    text: `Vizită la Universitatea de Stat din Moldova și la Academia de Științe.`,
  },
  { lang: "ro", text: `Moldova are Talent va reveni în toamnă.` },
  { lang: "ro", text: `A vorbit despre Ștefan cel Mare și Sfânt.` },
  { lang: "ro", text: `Statele Unite ale Americii (SUA) au reacționat.` },
  {
    lang: "ro",
    text: `Ieri Organizația Națiunilor Unite (ONU) a publicat un raport nou.`,
  },
  { lang: "ro", text: `Punctul de lucru A.B.C. Service SRL din Bălți.` },
  { lang: "ro", text: `Râul Nistru desparte Moldova de Transnistria.` },
  { lang: "ro", text: `Trec pe lângă mănăstirea Curchi în fiecare zi.` },
  {
    lang: "en",
    text: `The North Atlantic Treaty Organization (NATO) held a summit.`,
  },
  { lang: "en", text: `He mentioned the Johnson murder case in court.` },
  { lang: "en", text: `McDonald's and O'Brien met at St. Mary's Church.` },
  { lang: "en", text: `U.S.A. and U.K. signed the deal.` },
  { lang: "ru", text: `Президент России Владимир Путин выступил в Москве.` },
  {
    lang: "ru",
    text: `Россия и Соединённые Штаты Америки (США) провели переговоры.`,
  },
  {
    lang: "ru",
    text: `Министерство внутренних дел Республики Молдова является одним из девяти министерств Правительства Республики Молдова.`,
  },
  { lang: "bg", text: `България и Европейският съюз подписаха споразумение.` },
];

for (const { lang, text } of CASES) {
  for (const mode of ["identify", "collect"]) {
    test(`invariants ${lang}/${mode}: ${text.slice(0, 40)}`, () => {
      const concepts = parse({ text, lang }, { mode });
      for (const c of concepts) {
        assert.equal(
          text.slice(c.index, c.index + c.value.length),
          c.value,
          `"${c.value}"@${c.index} does not map back to the text`,
        );
        assert.equal(c.value, c.value.trim());
        assert.equal(
          /[-'’`&]$/.test(c.value),
          false,
          `"${c.value}" ends with a connect char`,
        );
      }
    });
  }
}
