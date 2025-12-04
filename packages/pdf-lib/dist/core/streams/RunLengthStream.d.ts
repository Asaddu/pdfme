import DecodeStream from './DecodeStream.js';
import { StreamType } from './Stream.js';
declare class RunLengthStream extends DecodeStream {
    private stream;
    constructor(stream: StreamType, maybeLength?: number);
    protected readBlock(): void;
}
export default RunLengthStream;
