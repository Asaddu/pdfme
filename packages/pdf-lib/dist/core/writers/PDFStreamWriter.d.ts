import PDFHeader from '../document/PDFHeader.js';
import PDFTrailer from '../document/PDFTrailer.js';
import PDFObject from '../objects/PDFObject.js';
import PDFRef from '../objects/PDFRef.js';
import PDFContext from '../PDFContext.js';
import PDFWriter from './PDFWriter.js';
declare class PDFStreamWriter extends PDFWriter {
    static forContext: (context: PDFContext, objectsPerTick: number, encodeStreams?: boolean, objectsPerStream?: number) => PDFStreamWriter;
    private readonly encodeStreams;
    private readonly objectsPerStream;
    private constructor();
    protected computeBufferSize(): Promise<{
        size: number;
        header: PDFHeader;
        indirectObjects: [PDFRef, PDFObject][];
        trailer: PDFTrailer;
    }>;
}
export default PDFStreamWriter;
