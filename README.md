# concepts-parser

Nodejs module for extracting concepts from text.

A Concept is a part of a text that may be a [Named entity](https://en.wikipedia.org/wiki/Named_entity). We use Concepts for learning new named-entities, for searching known entities, for identifying entity names(synonyms, abbreviations), etc.

## Usage

JavaScript:

```js
const parser = require('concepts-parser');

const concepts = parser.parse({ text: 'Some text', lang: 'ru', country: 'ru' });
```

TypeScript:

```ts
import { parse } from 'concepts-parser';

const concepts = parse({ text: 'Some text', lang: 'ru', country: 'ru '});
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
7. `abbr` - finds concepts abbreviations;
8. `known` - finds known concepts;
9. `duplicate` - exclude duplicates;
10. `quote` - concats concepts in quotes: `Teatrul Național "Mihai Eminescu"`;
