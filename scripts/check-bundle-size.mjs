import { stat } from 'node:fs/promises';

const maxBytesByFile = new Map([
    ['dist/kdbxweb.min.js', 175 * 1024],
    ['dist/pkg/index.mjs', 300 * 1024],
    ['dist/pkg/index.cjs', 300 * 1024]
]);

for (const [file, maxBytes] of maxBytesByFile.entries()) {
    const { size } = await stat(file);
    if (size > maxBytes) {
        throw new Error(`${file} exceeds budget: ${size} bytes > ${maxBytes} bytes`);
    }
    console.log(`${file}: ${size} bytes (budget ${maxBytes})`);
}
