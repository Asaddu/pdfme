import React from 'react';
import { Template, DesignerProps, Size } from '@asaddu/pdfme-common';
declare const TemplateEditor: ({ template, size, onSaveTemplate, onChangeTemplate, onPageCursorChange, }: Omit<DesignerProps, "domContainer"> & {
    size: Size;
    onSaveTemplate: (t: Template) => void;
    onChangeTemplate: (t: Template) => void;
} & {
    onChangeTemplate: (t: Template) => void;
    onPageCursorChange: (newPageCursor: number) => void;
}) => React.JSX.Element;
export default TemplateEditor;
