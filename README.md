# concepts-parser

A nodejs module for extracting concepts from text.

## Usage
```
var parser = require('concepts-parser');
var concepts = parser.parse({text: 'Some text', lang: 'ru', country: 'ru'});
```

## Changelog

#### v0.0.4 - October 26, 2015

- renamed project from `concept-extractor` to `concepts-parser`;

#### v0.0.3 - October 4, 2015

- upgrade concept-data to v0.0.3;
- filter rename concepts.
