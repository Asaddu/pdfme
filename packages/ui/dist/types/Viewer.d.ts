import { PreviewProps } from '@asaddu/pdfme-common';
import { PreviewUI } from './class.js';
declare class Viewer extends PreviewUI {
    constructor(props: PreviewProps);
    protected render(): void;
}
export default Viewer;
