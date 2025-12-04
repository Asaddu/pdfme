import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'common',
          root: './packages/common',
          include: ['**/__tests__/**/*.test.ts'],
          globals: true,
        },
      },
      {
        test: {
          name: 'converter',
          root: './packages/converter',
          include: ['**/__tests__/**/*.test.ts'],
          globals: true,
        },
      },
      {
        test: {
          name: 'generator',
          root: './packages/generator',
          include: ['**/__tests__/**/*.test.ts'],
          setupFiles: ['./vitest.setup.ts'],
          globals: true,
        },
      },
      {
        test: {
          name: 'manipulator',
          root: './packages/manipulator',
          include: ['**/__tests__/**/*.test.ts'],
          setupFiles: ['./vitest.setup.ts'],
          globals: true,
        },
      },
      {
        test: {
          name: 'pdf-lib',
          root: './packages/pdf-lib',
          include: ['**/__tests__/**/*.test.ts'],
          globals: true,
        },
      },
      {
        test: {
          name: 'schemas',
          root: './packages/schemas',
          include: ['**/__tests__/**/*.test.ts'],
          globals: true,
        },
      },
      {
        test: {
          name: 'ui',
          root: './packages/ui',
          include: ['**/__tests__/**/*.test.{ts,tsx}'],
          environment: 'jsdom',
          setupFiles: ['./vitest.setup.ts'],
          globals: true,
          alias: {
            '@asaddu/pdfme-converter': '../converter/src/index.node.ts',
            '@asaddu/pdfme-schemas/utils': '../schemas/src/utils.ts',
          },
          css: true,
        },
      },
    ],
  },
});
