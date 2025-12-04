import PDFDict from '../objects/PDFDict.js';
import PDFRef from '../objects/PDFRef.js';
import PDFContext from '../PDFContext.js';
import PDFAcroField from './PDFAcroField.js';
declare class PDFAcroNonTerminal extends PDFAcroField {
    static fromDict: (dict: PDFDict, ref: PDFRef) => PDFAcroNonTerminal;
    static create: (context: PDFContext) => PDFAcroNonTerminal;
    addField(field: PDFRef): void;
    normalizedEntries(): {
        Kids: import("../index.js").PDFArray;
    };
}
export default PDFAcroNonTerminal;
