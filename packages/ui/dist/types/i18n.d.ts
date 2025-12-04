import type { Lang, Dict } from '@asaddu/pdfme-common';
export declare const getDict: (lang: Lang) => Dict;
export declare const i18n: (key: keyof Dict, dict?: Dict) => string;
