import React from 'react';
import { PreviewProps, Size } from '@asaddu/pdfme-common';
declare const Preview: ({ template, inputs, size, onChangeInput, }: Omit<PreviewProps, "domContainer"> & {
    onChangeInput?: (args: {
        index: number;
        value: string;
        name: string;
    }) => void;
    size: Size;
}) => React.JSX.Element;
export default Preview;
