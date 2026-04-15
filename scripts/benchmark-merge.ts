import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { performance } from 'node:perf_hooks';

import { ByteUtils, Credentials, Kdbx, ProtectedValue } from '../lib';

async function run(): Promise<void> {
    const xml = readFileSync(join(__dirname, '../resources/demo.xml'), 'utf8');
    const credentials = new Credentials(ProtectedValue.fromString('demo'));

    const loadStart = performance.now();
    const db = await Kdbx.loadXml(xml, credentials);
    const db2 = await Kdbx.loadXml(xml, credentials);
    const loadMs = performance.now() - loadStart;

    const mergeStart = performance.now();
    db.merge(db2);
    const mergeMs = performance.now() - mergeStart;

    const saveStart = performance.now();
    const out = await db.saveXml();
    const saveMs = performance.now() - saveStart;

    const byteSize = ByteUtils.stringToBytes(out).byteLength;

    console.log(
        JSON.stringify(
            {
                loadMs: Number(loadMs.toFixed(2)),
                mergeMs: Number(mergeMs.toFixed(2)),
                saveMs: Number(saveMs.toFixed(2)),
                outputBytes: byteSize
            },
            null,
            2
        )
    );
}

run().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
