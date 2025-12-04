import PDFDict from '../objects/PDFDict.js';
import PDFOperator from '../operators/PDFOperator.js';
import PDFContext from '../PDFContext.js';
import PDFFlateStream from './PDFFlateStream.js';
declare class PDFContentStream extends PDFFlateStream {
    static of: (dict: PDFDict, operators: PDFOperator[], encode?: boolean) => PDFContentStream;
    private readonly operators;
    private constructor();
    push(...operators: PDFOperator[]): void;
    clone(context?: PDFContext): PDFContentStream;
    getContentsString(): string;
    getUnencodedContents(): Uint8Array;
    getUnencodedContentsSize(): number;
}
export default PDFContentStream;
