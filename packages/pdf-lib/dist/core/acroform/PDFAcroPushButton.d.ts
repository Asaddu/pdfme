import PDFDict from '../objects/PDFDict.js';
import PDFAcroButton from './PDFAcroButton.js';
import PDFContext from '../PDFContext.js';
import PDFRef from '../objects/PDFRef.js';
declare class PDFAcroPushButton extends PDFAcroButton {
    static fromDict: (dict: PDFDict, ref: PDFRef) => PDFAcroPushButton;
    static create: (context: PDFContext) => PDFAcroPushButton;
}
export default PDFAcroPushButton;
