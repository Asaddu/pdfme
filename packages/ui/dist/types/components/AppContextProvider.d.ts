import React from 'react';
import type { Font, Lang, UIOptions, PluginRegistry } from '@asaddu/pdfme-common';
type Props = {
    children: React.ReactNode;
    lang: Lang;
    font: Font;
    plugins: PluginRegistry;
    options: UIOptions;
};
declare const AppContextProvider: ({ children, lang, font, plugins, options }: Props) => React.JSX.Element;
export default AppContextProvider;
