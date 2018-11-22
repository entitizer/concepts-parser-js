
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

type DataType = RegExp[] | SuffixDataItem[];

interface IBuilder {
	[index: string]: (items: string[]) => DataType
}
interface IData {
	[index: string]: DataType | string[]
}
type SuffixDataItem = {
	reg: RegExp
	prefix?: RegExp
	concat?: boolean
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
		return items.length > 0 ? [new RegExp(`(^|\\b|\\s)(${items.join('|')}) $`, 'i')] : [];
	},
	valid_suffixes: function (items: string[]): SuffixDataItem[] {
		if (items.length === 0) {
			return [];
		}
		const simpleList: string[] = []
		const complexList: SuffixDataItem[] = []
		items.forEach(item => {
			item = item.trim();
			const parts = item.split(/\s*\t\s*/g);
			if (parts.length === 0) {
				throw new Error(`Invalid suffix line`);
			}
			if (parts.length === 1) {
				simpleList.push(item);
			} else {
				const concat = parts[1] === '1' || parts.length > 2 && parts[2] === '1' || undefined;
				const prefix = parts[1].length > 1 ? new RegExp(`(^|\\b|\\s)(${parts[1]})$`, 'i') : undefined;
				complexList.push({
					reg: new RegExp(`^ (${parts[0]})`, 'i'),
					concat,
					prefix,
				})
			}
		});

		if (simpleList.length) {
			complexList.push({
				reg: new RegExp(`^ (${simpleList.join('|')})(\\b|\\s)`, 'i')
			})
		}

		return complexList;
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
	content = content.replace(/\r+/g, '').trim();


	return content.split(/\n/g).filter(item => {
		item = item.trim();
		if (item.length < 1 || item[0] === '#') {
			return false;
		}
		return true;
	})
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

export function get<T extends string[] | RegExp[] | SuffixDataItem[]>(name: string, lang: string): T {
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

export function getValidSuffixes(lang: string) {
	return get<SuffixDataItem[]>('valid_suffixes', lang);
}

// export function getFirstnames(lang: string): RegExp[] {
// 	return get<RegExp[]>('firstnames', lang);
// }

export function getLanguages(): string[] {
	return LANGUAGES;
}

export function getNames(): string[] {
	return NAMES;
}
