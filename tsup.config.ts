import { defineConfig } from 'tsup';

export default defineConfig({
    entry: {
        index: 'lib/index.ts'
    },
    format: ['esm', 'cjs'],
    dts: false,
    sourcemap: true,
    clean: true,
    target: 'es2020',
    outDir: 'dist/pkg',
    splitting: false,
    treeshake: true,
    external: ['@xmldom/xmldom', 'crypto', 'zlib', 'fs', 'path'],
    outExtension({ format }) {
        return {
            js: format === 'esm' ? '.mjs' : '.cjs'
        };
    }
});
