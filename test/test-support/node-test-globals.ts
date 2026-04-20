import { after, afterEach, before, beforeEach, describe, it, test } from 'node:test';

Object.assign(globalThis, {
    after,
    afterEach,
    before,
    beforeEach,
    describe,
    it,
    test
});
