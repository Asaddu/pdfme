import { Plugin, Schema } from '@asaddu/pdfme-common';
interface Checkbox extends Schema {
    color: string;
}
declare const schema: Plugin<Checkbox>;
export default schema;
