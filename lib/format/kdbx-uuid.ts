import { base64ToBytes, bytesToBase64 } from '../utils/byte-utils';
import { ErrorCodes } from '../defs/consts';
import { KdbxError } from '../errors/kdbx-error';
import * as CryptoEngine from '../crypto/crypto-engine';

const UuidLength = 16;
const EmptyUuidStr = 'AAAAAAAAAAAAAAAAAAAAAA==';

export class KdbxUuid {
    readonly id: string;
    readonly empty: boolean;

    constructor(ab?: ArrayBuffer | Uint8Array | string) {
        let bytes: ArrayBuffer | Uint8Array;
        if (ab === undefined) {
            bytes = new ArrayBuffer(UuidLength);
        } else if (typeof ab === 'string') {
            bytes = base64ToBytes(ab);
        } else {
            bytes = ab;
        }
        if (bytes.byteLength !== UuidLength) {
            throw new KdbxError(ErrorCodes.FileCorrupt, `bad UUID length: ${bytes.byteLength}`);
        }
        this.id = bytesToBase64(bytes);
        this.empty = this.id === EmptyUuidStr;
    }

    equals(other: KdbxUuid | string | null | undefined): boolean {
        return (other && other.toString() === this.toString()) || false;
    }

    get bytes(): Uint8Array {
        return this.toBytes();
    }

    static random(): KdbxUuid {
        return new KdbxUuid(CryptoEngine.random(UuidLength));
    }

    toString(): string {
        return this.id;
    }

    valueOf(): string {
        return this.id;
    }

    toBytes(): Uint8Array {
        return base64ToBytes(this.id);
    }
}
