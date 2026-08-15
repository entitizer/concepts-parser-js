# Changelog

### v2.0.0 - August 14, 2026

- BREAKING: requires Node.js >= 22 (engines was >= 8)
- fix: `invalid_prefix` filter left an orphaned connect word (`"President of Russia"` → `"of Russia"`, `"Ministrul de Externe"` → `"de Externe"`); the concept is now kept whole when stripping would leave a leading connect word
- fix: multi-word `invalid_prefixes` entries could never match — the alternation is first-match-wins and entries were sorted alphabetically, so a one-word prefix always won; entries are now tried longest-first
- fix: `duplicate` filter and the filter registry mishandled names colliding with `Object.prototype` keys — a company called "Constructor" disappeared entirely in collect mode
- fix: `parse(context, {})` threw instead of defaulting to identify mode
- fix: dotted abbreviations with 3+ letters lost the final dot (`"S.U.A."` → `"S.U.A"`)
- fix: the language code is normalized — `parse({ lang: "RO" })` crashed with "Invalid language"
- fix: NBSP (U+00A0) joins words like a regular space (text pasted from Word fragmented concepts)
- fix: a single-character ellipsis `…` ends a sentence for the `start_word` filter
- fix: Cyrillic suffixes deleted concepts instead of extending them — JS `\b` is ASCII-only, so ru/bg news lost entities like `"Магнитная гора"` mid-text
- fix: the `invalid` filter now runs after `prefix`/`suffix`, so a stopword-headed name can be completed first (`"Большой"` → `"Большой театр"`)
- fix: ru title+country genitive combos are stripped as invalid prefixes (`"Президент России Владимир Путин"` → `"Владимир Путин"` instead of the mangled `"России Владимир Путин"`)
- fix: lowercase Italian elided articles are stripped from concepts (`"dell'Unione Europea"` → `"Unione Europea"`, `"l'Italia"` → `"Italia"`); case-sensitive on purpose, so names like `"L'Aquila"`, `"Dell'Utri"` and the `d'` particle (`"d'Artagnan"`) are untouched
- fix: a dialog dash opening a line (`"– Plecăm..."`) counts as a sentence start for the `start_word` filter; mid-sentence dashes are unaffected
- fix: the `abbr` filter assumed exactly one space before `(ABBR)` — a double space leaked a trailing space into the expanded value, the only known break of the trimmed-value invariant
- fix: the `quote` filter merges `Name "Quoted Part"` across an NBSP, which counts as a word separator everywhere else
- fix: `Concept` no longer keeps a negative `index` passed to the constructor (it fell through `reset()`'s guard because the field was already stored); it falls back to 0
- data: Spanish connect words gained bare `de` (`"Miguel de Cervantes"` no longer fragments)
- data: Russian connect words gained `имени` (`"МГУ имени Ломоносова"` stays whole; also mirrored in split_words for clean `concept.split()`)
- fix: `debug` was a devDependency but required at runtime — fresh installs of 1.5.6 crash with `Cannot find module 'debug'`
- fix: `known` filter truncated concepts matched at the start of the text (e.g. `"oldova are Talent"`)
- fix: tests run on Node >= 23 (removed `util.isRegExp`)
- fix: README documented mode `identity`; the accepted value is `identify`
- fix: `abbr` filter reset the expanded concept's `index` to 0, so `text.slice(index)` pointed at the wrong place
- fix: `Concept.reset` kept stale `isAbbr`/`endsWithDot`/`endsWithNumber` flags from the previous value
- fix: parser dropped a word ending in connect char + letter at the end of text (`"I love McDonald's"` returned no concepts)
- fix: parser missed concepts whose first uppercase letter follows a connect char (`d'Artagnan`)
- fix: concepts no longer keep a stray trailing connect char (`"John- Smith"` is now `John` + `Smith`, `"Ana-"` is `Ana`)
- TypeScript 6 (strict mode); code verified to also compile under the native TypeScript 7
- native `node:test` runner via tsx (ava removed)
- static filter registry (bundler-friendly, no dynamic `require`)
- replaced node-fetch/fs-extra with Node built-ins; rimraf 6; npm lockfile
- ESLint 10 + Prettier 3; added LICENSE; dead Travis config removed (no CI)
- removed dead `default_parser`; `substr` → `slice`
- packaging: `files` whitelist + `exports` map (`.npmignore` removed)

### v1.5.5 - May 28, 2023

- Spanish support (`es`)

### v1.5.4 - January 9, 2019

- normalize-data script;
- split concept to one word;
- using `is-abbr-of` (fix);

### v1.5.2 - November 22, 2018

- complex valid suffixes

### v1.5.1 - November 22, 2018

- validate concepts alter splitting
- added valid_concepts for fixing stopwords module

### v1.5.0 - November 13, 2018

- removed filter: `split_type`
- A concept has no `type` property

### v1.4.0 - July 28, 2018

- removed `concepts-data` deppendency;
- `ava` tests;

### v1.3.1 - May 3, 2018

- fix `prefix` filter
- fix Concept reset `type`
- added tests
- upgraded `concepts-data`@v0.4.2

### v1.3.0 - May 2, 2018

- added concept.lang
- identify concepts's type(PERSON) by popular first names
- new filter: `split_type`
- upgraded `concepts-data`

### v1.2.0 - April 19, 2018

- removed concept.name
- deleted `rename` filter
- upgraded `concepts-data`
- new filter: `quote`

### v1.1.1 - April 19, 2017

- removed entity.context
- removed entitizer.core dependency
- some code sanitize

### v1.1.0 - March 4, 2017

- TypeScript code
- using [entitizer.core](https://github.com/entitizer/core-js)
- some fixes

### v1.0.0 - September 3, 2016

- new concepts exrtactor: word;
- new filters structure;
- new `abbr` filter;
- updated api options:
  - removed `normalizeText`;
  - added `filters`;
- new tests ~ 20;

### v0.2.0 - August 11, 2016

- engine >= node4
- es6 syntax

### v0.1.3 - December 15, 2015

- upgraded `concepts-data`;
- added tests;

### v0.1.2 - December 13, 2015

- added param `options`;
- moved to `entitizer` org;

### v0.1.1 - November 28, 2015

- fix: concat words;
- smarter split concept;
- upgrade `concepts-data` to 0.1.0;

### v0.0.4 - October 26, 2015

- renamed project from `concept-extractor` to `concepts-parser`;

### v0.0.3 - October 4, 2015

- upgrade concept-data to v0.0.3;
- filter rename concepts.
