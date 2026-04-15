import { pathToFileURL } from 'node:url';

await import(pathToFileURL('dist/pkg/index.mjs').href);
await import(pathToFileURL('dist/pkg/index.cjs').href);

console.log('Node import checks passed for ESM and CJS outputs.');
