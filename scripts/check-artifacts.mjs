import { access, stat } from 'node:fs/promises';

const requiredArtifacts = [
    'dist/pkg/index.cjs',
    'dist/pkg/index.cjs.map',
    'dist/pkg/index.mjs',
    'dist/pkg/index.mjs.map',
    'dist/pkg/index.d.ts',
    'dist/kdbxweb.js',
    'dist/kdbxweb.min.js'
];

async function assertExists(file) {
    await access(file);
    const fileStat = await stat(file);
    if (!fileStat.isFile() || fileStat.size === 0) {
        throw new Error(`Artifact is empty or invalid: ${file}`);
    }
}

await Promise.all(requiredArtifacts.map((file) => assertExists(file)));

console.log(`Artifacts verified (${requiredArtifacts.length} files).`);
