import { stream as chachaStream } from '@stablelib/chacha';

export class ChaCha20 {
    private readonly _key = new Uint8Array(32);
    private readonly _nonceState = new Uint8Array(16);
    private readonly _counterLength: number;
    private readonly _block = new Uint8Array(64);
    private _blockUsed = 64;

    constructor(key: Uint8Array, nonce: Uint8Array) {
        this._key.set(key.subarray(0, 32));
        if (nonce.length === 12) {
            this._counterLength = 4;
            this._nonceState.set(nonce.subarray(0, 12), 4);
        } else {
            this._counterLength = 8;
            this._nonceState.set(nonce.subarray(0, 8), 8);
        }
    }

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

    private generateBlock(): void {
        chachaStream(this._key, this._nonceState, this._block, this._counterLength);
    }

    public encrypt(data: Uint8Array): Uint8Array {
        const length = data.length;
        const res = new Uint8Array(length);
        let pos = 0;
        const block = this._block;
        while (pos < length) {
            this.generateBlock();
            const blockLength = Math.min(length - pos, 64);
            for (let i = 0; i < blockLength; i++) {
                res[pos] = data[pos] ^ block[i];
                pos++;
            }
        }
        return res;
    }
}
