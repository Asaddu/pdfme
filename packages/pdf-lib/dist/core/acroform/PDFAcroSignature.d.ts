import PDFDict from '../objects/PDFDict.js';
import PDFRef from '../objects/PDFRef.js';
import PDFAcroTerminal from './PDFAcroTerminal.js';
declare class PDFAcroSignature extends PDFAcroTerminal {
    static fromDict: (dict: PDFDict, ref: PDFRef) => PDFAcroSignature;
}
export default PDFAcroSignature;
