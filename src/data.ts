
import * as fs from 'fs';
import * as path from 'path';

const LANGUAGES: string[] = ['ro', 'ru', 'bg', 'hu', 'cs', 'pl', 'it', 'en'];
const NAMES: string[] = [
	'connect_words',
	'split_words',
	'invalid_concepts',
	'invalid_prefixes',
	'known_concepts',
	'partial_concepts',
	'valid_prefixes',
	'valid_suffixes',
	'firstnames',
];

type DataType = RegExp[];

interface IBuilder {
	[index: string]: (items: string[]) => DataType
}
interface IData {
	[index: string]: DataType | string[]
}

const DATA: IData = {};

const builders: IBuilder = {
	invalid_concepts: function (items: string[]): RegExp[] {
		return items.length > 0 ? [new RegExp(`^(${items.join('|')})$`, 'i')] : [];
	},
	invalid_prefixes: function (items: string[]): RegExp[] {
		return items.length > 0 ? [new RegExp(`^(${items.join('|')}) `, 'i')] : [];
	},
	known_concepts: function (items: string[]): RegExp[] {
		return items.map((item) => {
			return new RegExp(`(\\b|\\s)${item}(\\b|\\s)`, 'ig');
		});
	},
	partial_concepts: function (items: string[]): RegExp[] {
		return items.length > 0 ? [new RegExp(`^(${items.join('|')})$`, 'i')] : [];
	},
	valid_prefixes: function (items: string[]): RegExp[] {
		return items.length > 0 ? [new RegExp(`(\\b|\\s)(${items.join('|')}) $`, 'i')] : [];
	},
	valid_suffixes: function (items: string[]): RegExp[] {
		return items.length > 0 ? [new RegExp(`^ (${items.join('|')})(\\b|\\s)`, 'i')] : [];
	},
	firstnames: function (items: string[]): RegExp[] {
		return items.length > 0 ? [new RegExp(`^(${items.join('|')})[ -]`)] : [];
	},
}

function getFileData(file: string): string[] {
	let content;
	try {
		content = fs.readFileSync(file, 'utf8');
	} catch (e) {
		return [];
	}
	content = content.trim();
	content = content.replace(/\s+\n/g, '\n').replace(/\n\s+/g, '\n');
	content = content.replace(/^##[^\n]*/g, '');
	content = content.replace(/\n##[^\n]*/g, '\n');
	content = content.trim();
	content = content.replace(/\s+\n/g, '\n').replace(/\n\s+/g, '\n');

	return content.trim().split(/\n+/g);
}

function load(name: string, lang: string, country?: string): string[] {
	if (LANGUAGES.indexOf(lang) < 0) {
		throw new Error('Invalid language: ' + lang);
	}
	if (NAMES.indexOf(name) < 0) {
		throw new Error('Invalid name: ' + name);
	}
	let file = path.join(__dirname, '../data', lang, name + '.txt');
	let data = getFileData(file);
	if (country) {
		file = path.join(__dirname, '../data', lang, country, name + '.txt');
		data = data.concat(getFileData(file));
	}
	return data;
}

function build(name: string, lang: string, country?: string): DataType | string[] {
	let data = load(name, lang, country);

	let builder = builders[name];
	if (builder) {
		return builder(data);
	}

	return data;
}

export function get<T extends string[] | RegExp[]>(name: string, lang: string): T {
	if (!name) {
		throw new Error('param `name` is required');
	}
	if (!lang) {
		throw new Error('param `lang` is required');
	}

	const key = lang + '_' + name;
	if (!DATA[key]) {
		DATA[key] = build(name, lang);
	}
	return DATA[key] as T;
}

export function getConnectWords(lang: string): string[] {
	return get<string[]>('connect_words', lang);
}

export function getSplitWords(lang: string): string[] {
	return get<string[]>('split_words', lang);
}

export function getInvalidConcepts(lang: string): RegExp[] {
	return get<RegExp[]>('invalid_concepts', lang);
}

export function getInvalidPrefixes(lang: string): RegExp[] {
	return get<RegExp[]>('invalid_prefixes', lang);
}

export function getKnownConcepts(lang: string): RegExp[] {
	return get<RegExp[]>('known_concepts', lang);
}

export function getPartialConcepts(lang: string): RegExp[] {
	return get<RegExp[]>('partial_concepts', lang);
}

export function getValidPrefixes(lang: string): RegExp[] {
	return get<RegExp[]>('valid_prefixes', lang);
}

export function getValidSuffixes(lang: string): RegExp[] {
	return get<RegExp[]>('valid_suffixes', lang);
}

export function getFirstnames(lang: string): RegExp[] {
	return get<RegExp[]>('firstnames', lang);
}

export function getLanguages(): string[] {
	return LANGUAGES;
}

export function getNames(): string[] {
	return NAMES;
}
