import Atonic from "atonic";

export function atonic(s: string): string {
  return Atonic(s);
}

// export function sha1(value: string): string {
// 	return crypto.createHash('sha1').update(value, 'utf8').digest('hex').toLowerCase();
// }

// export function md5(value: string): string {
// 	return crypto.createHash('md5').update(value, 'utf8').digest('hex').toLowerCase();
// }

export function isLetter(s: string): boolean {
  return s.toUpperCase() !== s.toLowerCase();
}

export function isUpper(s: string): boolean {
  return isLetter(s) && s.toUpperCase() === s;
}

export function isLower(s: string): boolean {
  return isLetter(s) && s === s.toLowerCase();
}

export function isDigit(s: string): boolean {
  return /^\d+$/.test(s);
}

export function isLetterOrDigit(s: string): boolean {
  return isDigit(s) || isLetter(s);
}

export function isPunctuation(s: string): boolean {
  return /[!"#%&'()*,./:?@[\]\\_{}-]/.test(s);
}

export function isSentenceStartingWord(index: number, text: string) {
  text = text.slice(0, index);
  if (text.length === 0 || /\n[ \t]*$/.test(text) || text.trim().length === 0) {
    return true;
  }
  // a dialog dash opening a line starts a sentence; a mid-sentence dash
  // ("a spus el – Moldova") is never the first non-space char on its line
  if (/(^|\n)[ \t]*[–—][ \t]*$/.test(text)) {
    return true;
  }
  text = text.trim();
  const last = text[text.length - 1];
  return /^[!.?;…-]$/.test(last);
}

export function defaults(target: any, source: any) {
  for (const prop in source) {
    if (typeof target[prop] === "undefined") {
      target[prop] = source[prop];
    }
  }

  return target;
}

export function pick(obj: any, props: string[]): any {
  const o: any = {};
  for (let i = props.length - 1; i >= 0; i--) {
    if (typeof obj[props[i]] !== "undefined") {
      o[props[i]] = obj[props[i]];
    }
  }
  return o;
}

export function uniq<T>(items: T[]) {
  return [...new Set(items)];
}
