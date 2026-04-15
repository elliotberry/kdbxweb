import { mkdir, stat, writeFile } from 'node:fs/promises';

const files = {
    webpackUmdMin: 'dist/kdbxweb.min.js',
    webpackUmdDebug: 'dist/kdbxweb.js',
    tsupEsm: 'dist/pkg/index.mjs',
    tsupCjs: 'dist/pkg/index.cjs'
};

const sizes = {};
for (const [name, file] of Object.entries(files)) {
    const fileStat = await stat(file);
    sizes[name] = fileStat.size;
}

const report = {
    generatedAt: new Date().toISOString(),
    files,
    sizes,
    notes: [
        'Webpack UMD remains as browser script compatibility output.',
        'tsup outputs modern package entry points (ESM + CJS) for npm consumers.'
    ]
};

await mkdir('dist', { recursive: true });
await writeFile('dist/bundler-comparison.json', `${JSON.stringify(report, null, 2)}\n`);

console.log(JSON.stringify(report, null, 2));
