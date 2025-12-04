import { Template, DesignerProps } from '@asaddu/pdfme-common';
import { BaseUIClass } from './class.js';
declare class Designer extends BaseUIClass {
    private onSaveTemplateCallback?;
    private onChangeTemplateCallback?;
    private pageCursor;
    constructor(props: DesignerProps);
    saveTemplate(): void;
    updateTemplate(template: Template): void;
    onSaveTemplate(cb: (template: Template) => void): void;
    onChangeTemplate(cb: (template: Template) => void): void;
    getPageCursor(): number;
    protected render(): void;
}
export default Designer;
