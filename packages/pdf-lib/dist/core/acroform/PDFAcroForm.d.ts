import PDFContext from '../PDFContext.js';
import PDFDict from '../objects/PDFDict.js';
import PDFArray from '../objects/PDFArray.js';
import PDFRef from '../objects/PDFRef.js';
import PDFAcroField from './PDFAcroField.js';
declare class PDFAcroForm {
    readonly dict: PDFDict;
    static fromDict: (dict: PDFDict) => PDFAcroForm;
    static create: (context: PDFContext) => PDFAcroForm;
    private constructor();
    Fields(): PDFArray | undefined;
    getFields(): [PDFAcroField, PDFRef][];
    getAllFields(): [PDFAcroField, PDFRef][];
    addField(field: PDFRef): void;
    removeField(field: PDFAcroField): void;
    normalizedEntries(): {
        Fields: PDFArray;
    };
}
export default PDFAcroForm;
