import { BaseParser } from "../base";
import * as utils from "../../utils";
import { Words } from "./words";
import { Context } from "../../types";
import { Concepts } from "../../concepts";

const P_START = 0;
const P_WORD = 1;
const P_PUNCT = 2;

export class Parser extends BaseParser {
  parse(context: Context): Concepts {
    const input = context.text;
    let start = 0;
    let p = P_START;
    let isConcept = false;
    const words = new Words(this.options, context);

    function addWord(i: number) {
      if (isConcept) {
        const text = input.slice(start, i);
        // console.log('text `' + text + '`');
        words.add(Words.create(text, start));
      }
      p = P_START;
      isConcept = false;
    }

    for (let i = 0; i < input.length; i++) {
      const c = input[i];
      if (p === P_START) {
        if (this.isValidStartWordChar(c) || utils.isDigit(c)) {
          start = i;
          p = P_WORD;
          isConcept = utils.isUpper(c) || utils.isDigit(c);
        }
      } else if (p === P_WORD) {
        if (this.isValidWordChar(c)) {
          isConcept = isConcept || utils.isUpper(c);
          if (this.isInConnectChars(c)) {
            p = P_PUNCT;
          }
        } else {
          addWord(i);
        }
      } else if (p === P_PUNCT) {
        if (this.isInConnectChars(c) || utils.isPunctuation(c)) {
          addWord(i - 1);
        } else if (utils.isLetterOrDigit(c)) {
          isConcept = isConcept || utils.isUpper(c);
          p = P_WORD;
        } else {
          addWord(i);
        }
      }
    }

    if (p === P_WORD || p === P_PUNCT) {
      addWord(input.length);
    }

    return words.concepts();
  }
}
