import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  return {
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      global: 'globalThis',
    },
    plugins: [react(), tsconfigPaths({ root: '.' }), cssInjectedByJsPlugin()],
    resolve: {
      alias: {
        buffer: path.resolve(__dirname, 'node_modules/buffer/index.js'),
      },
    },
    build: {
      lib: {
        entry: 'src/index.ts',
        name: '@pdfme/ui',
        fileName: (format) => `index.${format}.js`,
      },
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'pdfjs-dist', 'antd', 'buffer'],
      exclude: ['@pdfme/common', '@pdfme/schemas', '@pdfme/converter'],
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
      },
    },
  };
});
