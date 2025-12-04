import PDFDict from '../objects/PDFDict.js';
import PDFNumber from '../objects/PDFNumber.js';
declare class BorderStyle {
    readonly dict: PDFDict;
    static fromDict: (dict: PDFDict) => BorderStyle;
    protected constructor(dict: PDFDict);
    W(): PDFNumber | undefined;
    getWidth(): number | undefined;
    setWidth(width: number): void;
}
export default BorderStyle;
