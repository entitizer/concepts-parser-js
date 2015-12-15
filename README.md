# concepts-parser

A nodejs module for extracting concepts from text.

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
  + `country` (String) **required** - Context country: `ru`, `it`;
- `options` (Object) **optional**:
  + `mode` (String) - Can be: `identify` or `collect`. Default: `identify`;
  + `normalizeText` (Boolean) - Remove extra white spaces, etc. Default: `true`;

## Changelog

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
