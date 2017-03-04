'use strict';

import { utils } from 'entitizer.core';

export const isDigit = utils.isDigit;
export const isLower = utils.isLower;
export const isUpper = utils.isUpper;
export const isLetter = utils.isLetter;
export const isLetterOrDigit = utils.isLetterOrDigit;

export function isPunctuation(s: string): boolean {
	return /[!"#%&'\(\)\*,\.\/:\?@\[\]\\_{}-]/.test(s);
}

export function isSentenceStartingWord(index: number, text: string) {
	text = text.substr(0, index);
	if (text.length === 0 || /\n[ \t]*$/.test(text) || text.trim().length === 0) {
		return true;
	}
	text = text.trim();
	let last = text[text.length - 1];
	return /^[!\.\?;-]$/.test(last);
}

export function defaults(target: any, source: any) {
	for (let prop in source) {
		if (typeof target[prop] === 'undefined') {
			target[prop] = source[prop];
		}
	}

	return target;
}

export function pick(obj: any, props: string[]): any {
	let o: any = {};
	for (let i = props.length - 1; i >= 0; i--) {
		if (typeof obj[props[i]] !== 'undefined') {
			o[props[i]] = obj[props[i]];
		}
	}
	return o;
}
