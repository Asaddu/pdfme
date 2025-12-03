# PDFme Development Guide

## Prerequisites

### Required Software

| Software | Version | Notes |
|----------|---------|-------|
| Node.js | 16+ (recommended: 20+) | LTS version preferred |
| pnpm | 8+ | Package manager |
| Git | Latest | Version control |

### System Requirements

- **Memory:** Minimum 4GB RAM, 8GB+ recommended
- **OS:** Windows, macOS, or Linux
- **IDE:** VS Code recommended (with TypeScript support)

## Initial Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone git@github.com:pdfme/pdfme.git
cd pdfme

# Install dependencies
pnpm install

# Build all packages (required first time)
pnpm run build
```

### 2. Verify Installation

```bash
# Run all tests to verify build
pnpm run test
```

## Development Workflow

### Hot Reload Development

For active development with live reloading, run `dev` mode in the packages you're working on:

**Terminal 1 - Common package:**
```bash
cd packages/common && pnpm run dev
```

**Terminal 2 - Schemas package:**
```bash
cd packages/schemas && pnpm run dev
```

**Terminal 3 - Generator package:**
```bash
cd packages/generator && pnpm run dev
```

**Terminal 4 - UI package:**
```bash
cd packages/ui && pnpm run dev
```

**Terminal 5 - Playground:**
```bash
cd playground && pnpm run dev
# Opens at http://localhost:5173
```

### Build Commands

```bash
# Build all packages (in correct order)
pnpm run build

# Build individual packages
pnpm run build:common      # @pdfme/common
pnpm run build:pdf-lib     # @pdfme/pdf-lib
pnpm run build:converter   # @pdfme/converter
pnpm run build:schemas     # @pdfme/schemas
pnpm run build:generator   # @pdfme/generator
pnpm run build:ui          # @pdfme/ui
pnpm run build:manipulator # @pdfme/manipulator

# Clean all build artifacts
pnpm run clean
```

### Build Order (Important!)

Due to package dependencies, follow this build order:
```
1. pdf-lib
2. common
3. converter
4. schemas
5. generator, ui, manipulator (can run in parallel)
```

## Testing

### Run Tests

```bash
# Run all tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Update UI snapshots (after intentional UI changes)
pnpm run test:ui:update-snapshots

# Run tests for specific package
cd packages/generator && pnpm run test
cd packages/ui && pnpm run test
```

### Playground E2E Tests

```bash
cd playground

# Run E2E tests
pnpm run test

# Update E2E snapshots
pnpm run test:update-snapshots

# Run tests with browser visible
pnpm run test:local
```

## Code Quality

### Linting

```bash
# Run oxlint on entire codebase
pnpm run lint

# Lint specific package
cd packages/common && pnpm run lint
```

### Formatting

```bash
# Format all code with Prettier
pnpm run prettier
```

## Creating a New Schema Plugin

Schema plugins follow a standard pattern. Here's how to create one:

### 1. Create Plugin Directory

```
packages/schemas/src/myPlugin/
├── index.ts        # Plugin export
├── types.ts        # Type definitions
├── pdfRender.ts    # PDF rendering
├── uiRender.ts     # Browser rendering
├── propPanel.ts    # Designer properties
└── helper.ts       # Utilities (optional)
```

### 2. Define Types

```typescript
// types.ts
import type { Schema } from '@pdfme/common';

export interface MyPluginSchema extends Schema {
  type: 'myPlugin';
  myProperty: string;
  // ... additional properties
}
```

### 3. Implement PDF Render

```typescript
// pdfRender.ts
import type { PDFRenderProps } from '@pdfme/common';
import type { MyPluginSchema } from './types';

export const pdfRender = async (props: PDFRenderProps<MyPluginSchema>) => {
  const { value, schema, page, pdfLib, options } = props;
  // Render to PDF page using pdfLib
};
```

### 4. Implement UI Render

```typescript
// uiRender.ts
import type { UIRenderProps } from '@pdfme/common';
import type { MyPluginSchema } from './types';

export const uiRender = async (props: UIRenderProps<MyPluginSchema>) => {
  const { value, schema, rootElement, mode, onChange } = props;
  // Render to DOM element
};
```

### 5. Define Property Panel

```typescript
// propPanel.ts
import type { PropPanel } from '@pdfme/common';
import type { MyPluginSchema } from './types';

export const propPanel: PropPanel<MyPluginSchema> = {
  schema: {
    myProperty: {
      type: 'string',
      title: 'My Property',
    },
  },
  defaultSchema: {
    type: 'myPlugin',
    myProperty: 'default value',
    // ... required Schema fields
  },
};
```

### 6. Export Plugin

```typescript
// index.ts
import type { Plugin } from '@pdfme/common';
import { pdfRender } from './pdfRender';
import { uiRender } from './uiRender';
import { propPanel } from './propPanel';
import type { MyPluginSchema } from './types';

const myPlugin: Plugin<MyPluginSchema> = {
  pdf: pdfRender,
  ui: uiRender,
  propPanel,
  icon: '<svg>...</svg>',  // Optional icon
};

export default myPlugin;
```

### 7. Add to Package Exports

```typescript
// packages/schemas/src/index.ts
import myPlugin from './myPlugin/index.js';

export { myPlugin };
```

## Debugging Tips

### VS Code Debug Configuration

Add to `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Tests",
      "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
      "args": ["run", "--reporter=verbose"],
      "cwd": "${workspaceFolder}"
    }
  ]
}
```

### Console Logging

In development mode, add logs to trace execution:
```typescript
console.log('[pdfme:generator]', 'Processing schema:', schema.name);
```

### Browser DevTools

When running playground:
1. Open http://localhost:5173
2. Open DevTools (F12)
3. Check Console for errors
4. Use React DevTools for component inspection

## Common Issues

### Build Errors

**TypeScript compilation issues:**
```bash
# Clear build artifacts and rebuild
pnpm run clean
pnpm run build
```

**Dependency issues:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules packages/*/node_modules
pnpm install
```

### Test Failures

**Snapshot mismatches:**
```bash
# Review changes and update if intentional
pnpm run test:ui:update-snapshots
```

### Memory Issues

For large PDF operations:
```bash
# Increase Node.js heap size
export NODE_OPTIONS="--max-old-space-size=8192"
pnpm run dev
```

## Release Process

See [RELEASE.md](../RELEASE.md) for release procedures.

### Version Tagging

```bash
# Stable release
git tag 5.0.0
git push origin 5.0.0

# Pre-release
git tag 5.0.0-beta.1
git push origin 5.0.0-beta.1
```

### CI/CD Automation

- **Pull Requests:** Triggers `test.yml` workflow
- **Main Branch:** Publishes to `dev` tag on npm
- **Tags:** Publishes release to npm

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run `pnpm run test` and `pnpm run lint`
6. Submit a Pull Request

### Commit Convention

Use conventional commits:
```
feat(generator): add support for dynamic page breaks
fix(ui): resolve Designer canvas rendering issue
docs(readme): update installation instructions
```

---

*Generated by BMM Document Project Workflow*
