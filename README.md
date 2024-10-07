# @cto.af/generate-rules-table

Generate a rules table in a eslint plugin's README.md.

If anyone else wants to use this, I'll write some more docs.

## Installation

```sh
npm install -D @cto.af/generate-rules-table
npx generate-rules-table
```

## README.md Comments

Ensure you have a README.md next to your package.json file.  It MUST include
the following comments:

```md
<!-- Rule Table Start -->
<!-- Rule Table End -->
```

The space between these comments will be filled in with a rules table.

---
[![Tests](https://github.com/cto-af/generate-rules-table/actions/workflows/node.js.yml/badge.svg)](https://github.com/cto-af/generate-rules-table/actions/workflows/node.js.yml)
[![codecov](https://codecov.io/gh/cto-af/generate-rules-table/graph/badge.svg?token=O0ZQ0hkP0V)](https://codecov.io/gh/cto-af/generate-rules-table)
