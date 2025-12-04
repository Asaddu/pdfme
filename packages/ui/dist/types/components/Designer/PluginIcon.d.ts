import React from 'react';
import { Plugin, Schema } from '@asaddu/pdfme-common';
interface PluginIconProps {
    plugin: Plugin<Schema>;
    label: string;
    size?: number;
    styles?: React.CSSProperties;
}
declare const PluginIcon: (props: PluginIconProps) => React.JSX.Element;
export default PluginIcon;
