# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this package is

`concepts-parser` (v2.0.0, unpublished) extracts **concepts** — candidate named entities — from text in 9 languages (`ro ru bg hu cs pl it en es`). It is a CommonJS Node library (Node >= 22), TypeScript strict, no ESM. Public API: `parse(context, options)`, plus `Concept`, `Parser`, `splitter` re-exported from `src/index.ts`.

```ts
parse({ text, lang /* 2-char code */, country? /* reserved, unused */ },
      { mode: "identify" | "collect" } /* or { filters: [...] } */): Concept[]
```

## Commands

- `npm test` — all tests. **`pretest` runs `normalize-data`, which rewrites `data/**/*.txt` in place (sort + uniq)** — expect possible data diffs after running tests.
- `node --import tsx --test src/concept.test.ts` — single test file (add `--test-name-pattern="..."` for one test). Does not trigger `pretest`.
- `npm run typecheck` / `npm run lint` / `npm run format` — tsc noEmit, ESLint 10 flat config, Prettier 3.
- `npm run build` — cleans and compiles `src/` → `lib/` + `types/` via `tsconfig.build.json` (excludes tests and `src/scripts/`).
- `npm run build-invalid-concepts` / `build-firstnames` / `build-connect-words` — regenerate `data/` files (the last two query Wikidata via `src/scripts/wikidata.ts`; sample corpus lives in `db/texts/`).

Tests are colocated (`src/*.test.ts`), use `node:test` + `node:assert/strict`, and run through tsx without a compile step. `src/invariants.test.ts` runs cross-language invariants (index mapping `value === text.slice(index, endIndex)`, trimmed values, no stray connect chars) — new parser behavior must keep it green.

## Architecture: the extraction pipeline

`parse()` (src/parse.ts) wires three stages; understanding a bug usually means finding which stage owns it:

1. **Char-level state machine** — `src/parsers/words/parser.ts` (`Parser.parse`, states P_START/P_WORD/P_PUNCT) scans the raw text and emits candidate `Word`s: tokens that start with, or contain, an uppercase letter or digit. `BaseParser` (src/parsers/base.ts) holds the options: connect chars (`& - ' . ’ ` `), quote chars, and the language's connect words (loaded from `data/<lang>/connect_words.txt` and compiled to regexes in the constructor).
2. **Word → Concept assembly** — `src/parsers/words/words.ts`. Each `Word` (src/parsers/words/word.ts) strips a trailing dot (kept only for ALL-CAPS dotted abbreviations like `S.U.A.`) and trailing connect chars; numbers are valid only immediately after a non-number word (`Euro 2016`). `Words.concepts()` joins consecutive words into one multi-word concept when the text between them (`word.rightText`) is a single space or a connect word (`of`, `de la`, `von`…) — this is how `Republic of Moldova` becomes one concept. Output is a `Concepts` collection; `Concepts.add` drops concepts failing `Concept.isValid()` (length 2–100, contains letters, trimmed, not all digits).
3. **Filter pipeline** — `src/filters/index.ts` runs an ordered list of filter modules, each exporting `filter(concepts, context): Concept[]`. Mode `identify` (default) runs: `invalid_prefix, abbr, invalid, prefix, suffix, known, quote`; mode `collect` adds `partial`, `start_word`, `duplicate`. Filters both drop concepts and mutate them via `concept.reset(value, index, lang)` (e.g. `prefix`/`suffix` extend the value, `invalid_prefix` cuts the front, `abbr` expands `(EU)`-style abbreviations onto the preceding concept using `is-abbr-of`, `known` re-scans the text for `known_concepts` and replaces overlapped concepts, `quote` merges `Name "Quoted Part"` patterns).

Supporting pieces:

- **`Concept`** (src/concept.ts) extends the `Model` field-bag base class (src/types.ts, get/set on `_fields`). `reset()` recomputes all derived flags (`isAbbr`, `countWords`, `endsWithNumber`, `endsWithDot`, `atonicValue` — the diacritics-stripped value via `atonic`). Any new derived field must be recomputed in `reset()`, not just the constructor — stale-flag bugs here were fixed in v2.0.0.
- **`splitter`** (src/splitter.ts) — exported namespace, also `concept.split()`. Splits a multi-word concept into sub-concepts: first at `split_words.txt` entries, otherwise at every space (`simpleSplit`), validating and trimming lowercase edge words. Skips concepts marked `isKnown`.
- **Language data** (`src/data.ts`) — lazy-loads `data/<lang>/<name>.txt` relative to `__dirname` (`lib/../data` after build, so `data/` must stay in the npm `files` whitelist), caches per `lang_name`, and compiles most lists into regexes via per-name builders. Data files: one entry per line, `#` comments. `valid_suffixes.txt` has a tab-separated extended syntax (suffix `\t` required-prefix-regex or `1` for concat-next-concept — see the `valid_suffixes` builder). Adding a language = new `data/<lang>/` dir + adding the code to `LANGUAGES` in src/data.ts.

## Conventions and constraints

- Do not bump `version`: v2.0.0 is intentionally held until the user publishes (see docs/superpowers/plans/). `preversion`/`prepublishOnly` run typecheck + tests.
- Keep the package CommonJS; no ESM migration. TypeScript stays ^6 (typescript@7 ships no JS compiler API, which typescript-eslint needs).
- No CI by user decision — verification is local (`npm run typecheck && npm test`).
- Fixes follow TDD (failing test first); implementation plans live in `docs/superpowers/plans/`.
- `NOTES.md` lists the canonical extraction situations the parser must handle (capital words, adjacent words, word+number, connect words, `V. V. Putin`-style abbreviations).
