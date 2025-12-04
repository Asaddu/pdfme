import type { GenerateProps } from '@asaddu/pdfme-common';
declare const generate: (props: GenerateProps) => Promise<Uint8Array<ArrayBuffer>>;
export default generate;
