# Bundler Evaluation: Webpack vs tsup

## Goal

Evaluate a modern npm-package bundling path while keeping browser UMD compatibility.

## Prototype Decision

- Keep Webpack for UMD bundles consumed directly by browsers.
- Add `tsup` for npm module distribution (ESM + CJS + types).

## How to Re-run

```sh
npm run compare:bundlers
```

This writes `dist/bundler-comparison.json` with artifact sizes for:

- `dist/kdbxweb.min.js` (Webpack UMD minified)
- `dist/kdbxweb.js` (Webpack UMD debug)
- `dist/pkg/index.mjs` (tsup ESM)
- `dist/pkg/index.cjs` (tsup CJS)

## Evaluation Criteria

- Build-time simplicity: `tsup` config is smaller and easier to maintain for npm outputs.
- Compatibility: dual-package export map serves both `import` and `require`.
- Risk: browser consumers keep existing UMD files and do not need migration.
