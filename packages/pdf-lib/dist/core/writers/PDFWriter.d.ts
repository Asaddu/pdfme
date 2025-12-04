import PDFCrossRefSection from '../document/PDFCrossRefSection.js';
import PDFHeader from '../document/PDFHeader.js';
import PDFTrailer from '../document/PDFTrailer.js';
import PDFTrailerDict from '../document/PDFTrailerDict.js';
import PDFDict from '../objects/PDFDict.js';
import PDFObject from '../objects/PDFObject.js';
import PDFRef from '../objects/PDFRef.js';
import PDFContext from '../PDFContext.js';
export interface SerializationInfo {
    size: number;
    header: PDFHeader;
    indirectObjects: [PDFRef, PDFObject][];
    xref?: PDFCrossRefSection;
    trailerDict?: PDFTrailerDict;
    trailer: PDFTrailer;
}
declare class PDFWriter {
    static forContext: (context: PDFContext, objectsPerTick: number) => PDFWriter;
    protected readonly context: PDFContext;
    protected readonly objectsPerTick: number;
    private parsedObjects;
    protected constructor(context: PDFContext, objectsPerTick: number);
    serializeToBuffer(): Promise<Uint8Array<ArrayBuffer>>;
    protected computeIndirectObjectSize([ref, object]: [PDFRef, PDFObject]): number;
    protected createTrailerDict(): PDFDict;
    protected computeBufferSize(): Promise<SerializationInfo>;
    protected shouldWaitForTick: (n: number) => boolean;
}
export default PDFWriter;
