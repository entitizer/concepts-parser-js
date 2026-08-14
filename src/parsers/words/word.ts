import * as utils from "../../utils";

const ABBR_REG = /^([^\d_`&-]\.){1,2}$/;
const TRAILING_CONNECT_CHARS = ["-", "'", "’", "`", "&"];

export class Word {
  index = 0;
  value = "";
  isAbbr = false;
  isNumber = false;
  endsWithDot = false;
  rightText?: string;

  constructor(value: string, index: number) {
    this.reset(value, index);
  }

  reset(value: string, index: number) {
    if (typeof index === "number" && index > -1) {
      this.index = index;
    } else {
      this.index = this.index || 0;
    }

    const upperValue = value.toUpperCase();

    if (value.length > 1) {
      const last = value[value.length - 1];
      if (last === ".") {
        // keep the dot only for ALL-CAPS dotted abbreviations
        if (!(value === upperValue && ABBR_REG.test(value))) {
          value = value.slice(0, value.length - 1);
        }
      } else if (TRAILING_CONNECT_CHARS.indexOf(last) > -1) {
        value = value.slice(0, value.length - 1);
      }
    }

    this.isAbbr = upperValue === value;
    this.isNumber = utils.isDigit(value);
    this.endsWithDot = value[value.length - 1] === ".";

    this.value = value;
  }

  isValid(): boolean {
    if (!this.value) {
      return false;
    }

    const value = this.value;

    if (value.length !== value.trim().length) {
      //throw new Error('Trim value is not === with value: "'+ value+'"');
      return false;
    }

    // is not number AND contains letters
    if (!this.isNumber) {
      // contains letters
      return value.toLowerCase() !== value.toUpperCase();
    }

    return true;
  }
}
