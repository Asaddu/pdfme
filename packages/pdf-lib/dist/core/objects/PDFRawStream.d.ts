import PDFDict from './PDFDict.js';
import PDFStream from './PDFStream.js';
import PDFContext from '../PDFContext.js';
import { CipherTransform } from '../crypto.js';
declare class PDFRawStream extends PDFStream {
    static of: (dict: PDFDict, contents: Uint8Array, transform?: CipherTransform) => PDFRawStream;
    readonly contents: Uint8Array;
    readonly transform?: CipherTransform;
    private constructor();
    asUint8Array(): Uint8Array;
    clone(context?: PDFContext): PDFRawStream;
    getContentsString(): string;
    getContents(): Uint8Array;
    getContentsSize(): number;
}
export default PDFRawStream;
