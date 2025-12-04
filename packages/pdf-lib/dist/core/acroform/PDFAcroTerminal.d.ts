import PDFDict from '../objects/PDFDict.js';
import PDFName from '../objects/PDFName.js';
import PDFRef from '../objects/PDFRef.js';
import PDFAcroField from './PDFAcroField.js';
import PDFWidgetAnnotation from '../annotation/PDFWidgetAnnotation.js';
declare class PDFAcroTerminal extends PDFAcroField {
    static fromDict: (dict: PDFDict, ref: PDFRef) => PDFAcroTerminal;
    FT(): PDFName;
    getWidgets(): PDFWidgetAnnotation[];
    addWidget(ref: PDFRef): void;
    removeWidget(idx: number): void;
    normalizedEntries(): {
        Kids: import("../index.js").PDFArray;
    };
}
export default PDFAcroTerminal;
