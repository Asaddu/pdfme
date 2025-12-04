import { Schema, Template, BasePdf, CommonOptions } from './types.js';
interface ModifyTemplateForDynamicTableArg {
    template: Template;
    input: Record<string, string>;
    _cache: Map<string | number, unknown>;
    options: CommonOptions;
    getDynamicHeights: (value: string, args: {
        schema: Schema;
        basePdf: BasePdf;
        options: CommonOptions;
        _cache: Map<string | number, unknown>;
    }) => Promise<number[]>;
}
export declare const getDynamicTemplate: (arg: ModifyTemplateForDynamicTableArg) => Promise<Template>;
export {};
