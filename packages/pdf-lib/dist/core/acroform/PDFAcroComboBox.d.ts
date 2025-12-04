import PDFDict from '../objects/PDFDict.js';
import PDFAcroChoice from './PDFAcroChoice.js';
import PDFContext from '../PDFContext.js';
import PDFRef from '../objects/PDFRef.js';
declare class PDFAcroComboBox extends PDFAcroChoice {
    static fromDict: (dict: PDFDict, ref: PDFRef) => PDFAcroComboBox;
    static create: (context: PDFContext) => PDFAcroComboBox;
}
export default PDFAcroComboBox;
