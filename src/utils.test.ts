import { isLetter } from "./utils";
import test from "ava";

test("#isLetter", (t) => {
  t.is(true, isLetter("a"));
  t.is(true, isLetter("abc"));
  t.is(true, isLetter("Șțtrtîăâ"));
  t.is(true, isLetter("длР"));
});
