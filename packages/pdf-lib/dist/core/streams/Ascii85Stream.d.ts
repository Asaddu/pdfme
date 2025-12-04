import DecodeStream from './DecodeStream.js';
import { StreamType } from './Stream.js';
declare class Ascii85Stream extends DecodeStream {
    private stream;
    private input;
    constructor(stream: StreamType, maybeLength?: number);
    protected readBlock(): void;
}
export default Ascii85Stream;
