# concepts-parser

Nodejs module for extracting concepts from text.

A Concept is a part of a text that may be a [Named entity](https://en.wikipedia.org/wiki/Named_entity). We use Concepts for learning new named-entities, for searching known entities, for identifying entity names(synonyms, abbreviations), etc.

## Usage
```
var parser = require('concepts-parser');
var concepts = parser.parse({text: 'Some text', lang: 'ru', country: 'ru'});
```

## API

### parse(context, options)

Finds concepts in a context.

- `context` (Object) **required** - Context
  + `text` (String) **required** - Text to find concepts;
  + `lang` (String) **required** - Text language, 2 chars code: `en`, `ru`;
  + `country` (String) **optional** - Context country: `ru`, `it`;
- `options` (Object) **optional**:
  + `mode` (String) **optional** - Can be **identity** or **collect**. Default: **identity**. **identity** mode excludes filters: `start_word`, `duplicate` and `partial`;
  + `filters` (String[]) **optional** - Ordered list of filters;

#### Valid filters
1. `invalid_prefix` - deletes invalid prefixes;
2. `invalid` - exclude invalid concepts;
3. `partial` - exclude partial concepts;
4. `prefix` - add prefixes to concepts;
5. `suffix` - add suffixes to concepts;
6. `start_word` - exclude sentence start words;
7. `rename` - set concept's valid name;
8. `known` - finds known concepts;
9. `duplicate` - exclude duplicates;

## Changelog

#### v0.3.0 - August 20, 2016

- new concepts exrtactor: word;
- new filters structure;
- updated api options:
  - removed `normalizeText`;
  - added `filters`;
- new tests ~ 20;

#### v0.2.0 - August 11, 2016

- engine >= node4
- es6 syntax

#### v0.1.3 - December 15, 2015

- upgraded `concepts-data`;
- added tests;

#### v0.1.2 - December 13, 2015

- added param `options`;
- moved to `entitizer` org;

#### v0.1.1 - November 28, 2015

- fix: concat words;
- smarter split concept;
- upgrade `concepts-data` to 0.1.0;

#### v0.0.4 - October 26, 2015

- renamed project from `concept-extractor` to `concepts-parser`;

#### v0.0.3 - October 4, 2015

- upgrade concept-data to v0.0.3;
- filter rename concepts.
