import type {
    after as nodeAfter,
    afterEach as nodeAfterEach,
    before as nodeBefore,
    beforeEach as nodeBeforeEach,
    describe as nodeDescribe,
    it as nodeIt,
    test as nodeTest
} from 'node:test';

declare global {
    const after: typeof nodeAfter;
    const afterEach: typeof nodeAfterEach;
    const before: typeof nodeBefore;
    const beforeEach: typeof nodeBeforeEach;
    const describe: typeof nodeDescribe;
    const it: typeof nodeIt;
    const test: typeof nodeTest;
}

export {};
