import test from "ava";
import { Concept } from "./concept";

test("constructor", (t) => {
  const concept = new Concept({ value: "Vlad Filat", index: 0, lang: "ro" });
  t.is("Vlad Filat", concept.value);
  t.is("ro", concept.lang);
  t.is(0, concept.index);
});
