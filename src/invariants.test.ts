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
  // number-glue output must still satisfy the invariants
  { lang: "en", text: `In 2016 Obama announced his plan.` },
  { lang: "en", text: `He moved to the U.S. Yesterday he came back.` },
  { lang: "en", text: `The new iPhone 15 was presented by Apple.` },
  { lang: "en", text: `Windows 11 and Office 365 were updated.` },
  { lang: "en", text: `Rock 'n' Roll is dead, said Elvis.` },
  { lang: "en", text: "Barack\r\nObama spoke.\r\nSo did Michelle." },
  { lang: "ru", text: `Изучение COVID-19 продолжается в Москве.` },
  { lang: "ru", text: `Он посетил «Лужники» и стадион «Динамо» в Москве.` },
  { lang: "ro", text: `A plecat in S.U.A.. Apoi a revenit.` },
  // double space before (ABBR) once produced an untrimmed expanded value
  { lang: "ro", text: `Uniunea Europeană  (UE) a decis.` },
  { lang: "ro", text: 'Teatrul Național\u00A0"Mihai Eminescu" e mare.' },
  { lang: "ro", text: `Traseul Chișinău – Sibiu trece prin Cluj-Napoca.` },
  {
    lang: "hu",
    text: `Orbán Viktor találkozott Emmanuel Macron elnökkel Budapesten.`,
  },
  {
    lang: "cs",
    text: `Prezident Petr Pavel navštívil Prahu a setkal se s Karlem.`,
  },
  {
    lang: "pl",
    text: `Prezydent Andrzej Duda spotkał się z Donaldem Tuskiem w Warszawie.`,
  },
  {
    lang: "it",
    text: `Il presidente Sergio Mattarella ha visitato Roma e Milano.`,
  },
  {
    lang: "es",
    text: `El escritor Miguel de Cervantes nació en Alcalá de Henares.`,
  },
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
