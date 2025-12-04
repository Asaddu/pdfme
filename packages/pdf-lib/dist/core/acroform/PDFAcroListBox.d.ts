import PDFDict from '../objects/PDFDict.js';
import PDFAcroChoice from './PDFAcroChoice.js';
import PDFContext from '../PDFContext.js';
import PDFRef from '../objects/PDFRef.js';
declare class PDFAcroListBox extends PDFAcroChoice {
    static fromDict: (dict: PDFDict, ref: PDFRef) => PDFAcroListBox;
    static create: (context: PDFContext) => PDFAcroListBox;
}
export default PDFAcroListBox;
