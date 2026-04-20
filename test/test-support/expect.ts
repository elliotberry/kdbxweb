import assert from 'node:assert/strict';

type Constructor<T = unknown> = new (...args: any[]) => T;

class Expectation {
    public constructor(
        private readonly actual: unknown,
        private readonly negated = false
    ) {}

    public get to(): this {
        return this;
    }

    public get not(): Expectation {
        return new Expectation(this.actual, !this.negated);
    }

    public get be(): {
        (expected: unknown): void;
        a: (expectedType: Constructor | string) => void;
        an: (expectedType: Constructor | string) => void;
        eql: (expected: unknown) => void;
        ok: () => void;
        greaterThan: (expected: number) => void;
    } {
        const be = ((expected: unknown) => {
            this.assertStrictEqual(expected);
        }) as {
            (expected: unknown): void;
            a: (expectedType: Constructor | string) => void;
            an: (expectedType: Constructor | string) => void;
            eql: (expected: unknown) => void;
            ok: () => void;
            greaterThan: (expected: number) => void;
        };

        be.a = (expectedType: Constructor | string) => {
            this.assertType(expectedType);
        };
        be.an = be.a;
        be.eql = (expected: unknown) => {
            this.assertDeepEqual(expected);
        };
        be.ok = () => {
            this.assertTruthy();
        };
        be.greaterThan = (expected: number) => {
            this.assertGreaterThan(expected);
        };

        return be;
    }

    public eql(expected: unknown): void {
        this.assertDeepEqual(expected);
    }

    public contain(expectedPart: string): void {
        assert.equal(typeof this.actual, 'string', 'contain() expects a string actual value');
        const includes = this.actual.includes(expectedPart);
        if (this.negated) {
            assert.equal(includes, false, `Expected "${this.actual}" not to contain "${expectedPart}"`);
        } else {
            assert.equal(includes, true, `Expected "${this.actual}" to contain "${expectedPart}"`);
        }
    }

    public throwException(onThrown?: (error: unknown) => void): void {
        assert.equal(typeof this.actual, 'function', 'throwException() expects a function');
        let thrown = false;
        let thrownError: unknown;
        try {
            (this.actual as () => unknown)();
        } catch (error) {
            thrown = true;
            thrownError = error;
        }

        if (this.negated) {
            assert.equal(thrown, false, 'Expected function not to throw');
            return;
        }

        assert.equal(thrown, true, 'Expected function to throw');
        if (onThrown) {
            onThrown(thrownError);
        }
    }

    private assertStrictEqual(expected: unknown): void {
        if (this.negated) {
            assert.notStrictEqual(this.actual, expected);
        } else {
            assert.strictEqual(this.actual, expected);
        }
    }

    private assertDeepEqual(expected: unknown): void {
        const actualComparable = this.toComparable(this.actual);
        const expectedComparable = this.toComparable(expected);
        if (this.negated) {
            assert.notDeepStrictEqual(actualComparable, expectedComparable);
        } else {
            assert.deepStrictEqual(actualComparable, expectedComparable);
        }
    }

    private assertTruthy(): void {
        if (this.negated) {
            assert.ok(!this.actual);
        } else {
            assert.ok(this.actual);
        }
    }

    private assertGreaterThan(expected: number): void {
        assert.equal(typeof this.actual, 'number', 'greaterThan() expects a number actual value');
        if (this.negated) {
            assert.ok(this.actual <= expected, `Expected ${this.actual} to be <= ${expected}`);
        } else {
            assert.ok(this.actual > expected, `Expected ${this.actual} to be > ${expected}`);
        }
    }

    private assertType(expectedType: Constructor | string): void {
        let isMatch = false;
        if (typeof expectedType === 'string') {
            isMatch = typeof this.actual === expectedType;
        } else {
            isMatch = this.actual instanceof expectedType;
        }

        if (this.negated) {
            assert.equal(isMatch, false);
        } else {
            assert.equal(isMatch, true);
        }
    }

    private toComparable(value: unknown): unknown {
        if (value === null || value === undefined) {
            return value;
        }
        if (value instanceof Date) {
            return value.toISOString();
        }
        if (ArrayBuffer.isView(value)) {
            return Array.from(value as unknown as ArrayLike<number>);
        }
        if (value instanceof ArrayBuffer) {
            return Array.from(new Uint8Array(value));
        }
        if (Array.isArray(value)) {
            return value.map((item) => this.toComparable(item));
        }
        if (typeof value === 'object') {
            const output: Record<string, unknown> = {};
            for (const [key, item] of Object.entries(value)) {
                output[key] = this.toComparable(item);
            }
            return output;
        }
        return value;
    }
}

export default function expect(actual: unknown): Expectation {
    return new Expectation(actual);
}
