import { isLetter } from "./utils";
import test from "node:test";
import assert from "node:assert/strict";

test("#isLetter", () => {
  assert.equal(true, isLetter("a"));
  assert.equal(true, isLetter("abc"));
  assert.equal(true, isLetter("Șțtrtîăâ"));
  assert.equal(true, isLetter("длР"));
});
