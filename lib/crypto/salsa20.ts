import { stream as salsaStream } from '@stablelib/salsa20';

export class Salsa20 {
    private readonly _key = new Uint8Array(32);
    private readonly _nonce = new Uint8Array(8);
    private readonly _nonceState = new Uint8Array(16);

    // Output buffer
    private readonly _block = new Uint8Array(64); // output block of 64 bytes
    private _blockUsed = 64; // number of block bytes used

    constructor(key: Uint8Array, nonce: Uint8Array) {
        this.setKey(key);
        this.setNonce(nonce);
    }

    // setKey sets the key to the given 32-byte array.
    private setKey(key: Uint8Array): void {
        this._key.fill(0);
        this._key.set(key.subarray(0, 32));
        this.reset();
    }

    // setNonce sets the nonce to the given 8-byte array.
    private setNonce(nonce: Uint8Array): void {
        this._nonce.fill(0);
        this._nonce.set(nonce.subarray(0, 8));
        this.reset();
    }

    // getBytes returns the next numberOfBytes bytes of stream.
    getBytes(numberOfBytes: number): Uint8Array {
        const out = new Uint8Array(numberOfBytes);
        for (let i = 0; i < numberOfBytes; i++) {
            if (this._blockUsed === 64) {
                this.generateBlock();
                this._blockUsed = 0;
            }
            out[i] = this._block[this._blockUsed];
            this._blockUsed++;
        }
        return out;
    }

    getHexString(numberOfBytes: number): string {
        const hex = [
            '0',
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            'a',
            'b',
            'c',
            'd',
            'e',
            'f'
        ];
        const out = [];
        const bytes = this.getBytes(numberOfBytes);
        for (let i = 0; i < bytes.length; i++) {
            out.push(hex[(bytes[i] >> 4) & 15]);
            out.push(hex[bytes[i] & 15]);
        }
        return out.join('');
    }

    private reset() {
        this._nonceState.fill(0);
        this._nonceState.set(this._nonce, 8);
        this._blockUsed = 64;
    }

    // _generateBlock generates 64 bytes from key, nonce, and counter,
    // and puts the result into this.block.
    private generateBlock() {
        salsaStream(this._key, this._nonceState, this._block, 8);
    }
}
