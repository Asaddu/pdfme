import DecodeStream from './DecodeStream.js';
import { StreamType } from './Stream.js';
declare class AsciiHexStream extends DecodeStream {
    private stream;
    private firstDigit;
    constructor(stream: StreamType, maybeLength?: number);
    protected readBlock(): void;
}
export default AsciiHexStream;
