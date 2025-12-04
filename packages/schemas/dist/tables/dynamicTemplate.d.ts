import { Schema, BasePdf, CommonOptions } from '@asaddu/pdfme-common';
export declare const getDynamicHeightsForTable: (value: string, args: {
    schema: Schema;
    basePdf: BasePdf;
    options: CommonOptions;
    _cache: Map<string | number, unknown>;
}) => Promise<number[]>;
