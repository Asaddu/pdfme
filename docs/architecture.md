# PDFme Architecture Documentation

## Overview

PDFme is designed as a modular monorepo with a plugin-based architecture. The library separates concerns into distinct packages that can be used independently or together, supporting both Node.js and browser environments.

## Architecture Pattern

**Pattern:** Modular Library with Plugin Architecture

The architecture follows these key principles:
1. **Separation of Concerns** - Each package handles a specific domain
2. **Plugin Extensibility** - Schema plugins allow custom field types
3. **Cross-Platform** - Unified API for Node.js and browser
4. **Template-Driven** - JSON templates define PDF structure

## Package Architecture

### Dependency Graph

```
                    ┌─────────────┐
                    │   pdf-lib   │ (forked, low-level PDF operations)
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │   common    │ (types, utilities, validation)
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
       ┌──────▼──────┐     │     ┌──────▼──────┐
       │  converter  │     │     │   schemas   │
       └──────┬──────┘     │     └──────┬──────┘
              │            │            │
              │     ┌──────▼──────┐     │
              └────►│  generator  │◄────┘
                    └─────────────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
       ┌──────▼──────┐     │     ┌──────▼──────┐
       │     ui      │     │     │ manipulator │
       └─────────────┘     │     └─────────────┘
                           │
                    ┌──────▼──────┐
                    │  playground │
                    └─────────────┘
```

### Package Descriptions

#### @pdfme/pdf-lib (Foundation)
**Location:** `packages/pdf-lib/`
**Purpose:** Forked version of pdf-lib with custom modifications

- Low-level PDF creation and manipulation
- CJK (Chinese, Japanese, Korean) font support
- Font subsetting and embedding
- PDF parsing and modification

#### @pdfme/common (Core)
**Location:** `packages/common/src/`
**Purpose:** Shared types, utilities, and validation

Key files:
- `types.ts` - Core type definitions (Plugin, Schema, Template, etc.)
- `schema.ts` - Zod schema definitions for runtime validation
- `helper.ts` - Utility functions (mm2pt, pt2mm, checkTemplate, etc.)
- `expression.ts` - Secure JavaScript expression evaluator
- `dynamicTemplate.ts` - Dynamic height calculation engine
- `constants.ts` - Shared constants (BLANK_PDF, ZOOM, etc.)
- `pluginRegistry.ts` - Plugin registration system

Core Types:
```typescript
// Template - The main data structure
interface Template {
  basePdf: BasePdf;
  schemas: Schema[][];  // 2D array: pages × fields
  staticSchemas?: Schema[];
}

// Schema - Individual field definition
interface Schema {
  type: string;
  name: string;
  position: { x: number; y: number };
  width: number;
  height: number;
  // ... type-specific properties
}

// Plugin - Field type implementation
interface Plugin<T extends Schema> {
  pdf: (props: PDFRenderProps<T>) => Promise<void>;
  ui: (props: UIRenderProps<T>) => Promise<void>;
  propPanel: PropPanel<T>;
  icon?: string;
}
```

#### @pdfme/schemas (Plugins)
**Location:** `packages/schemas/src/`
**Purpose:** Built-in field type plugins

Available Schema Types:
| Type | Description | Files |
|------|-------------|-------|
| text | Single/multi-line text | `text/` |
| multiVariableText | Template variables | `multiVariableText/` |
| image | Image embedding | `graphics/image.ts` |
| svg | SVG graphics | `graphics/svg.ts` |
| barcodes | QR, Code128, etc. | `barcodes/` |
| table | Dynamic tables | `tables/` |
| date/dateTime/time | Date pickers | `date/` |
| checkbox | Checkbox fields | `checkbox/` |
| radioGroup | Radio buttons | `radioGroup/` |
| select | Dropdown select | `select/` |
| line/rectangle/ellipse | Shapes | `shapes/` |

Plugin Structure:
```typescript
// Each plugin exports: { pdf, ui, propPanel, icon }
const textSchema: Plugin<TextSchema> = {
  pdf: pdfRender,      // Renders in PDF
  ui: uiRender,        // Renders in browser
  propPanel,           // Designer property panel
  icon: createSvgStr(TextCursorInput),
};
```

#### @pdfme/generator (PDF Engine)
**Location:** `packages/generator/src/`
**Purpose:** PDF generation from templates

Key file: `generate.ts`
```typescript
const generate = async (props: GenerateProps): Promise<Uint8Array> => {
  // 1. Validate props
  checkGenerateProps(props);

  // 2. Process dynamic templates
  const dynamicTemplate = await getDynamicTemplate({ template, input, ... });

  // 3. Render each schema to PDF
  for (const schema of schemas) {
    await render(renderProps);
  }

  // 4. Return PDF bytes
  return pdfDoc.save();
};
```

Features:
- Dynamic height calculation for expandable fields
- Automatic page breaking
- Expression evaluation for dynamic content
- Static schema support (headers/footers)
- Caching for performance optimization

#### @pdfme/ui (React Components)
**Location:** `packages/ui/src/`
**Purpose:** React-based UI components

Main Components:
| Component | File | Purpose |
|-----------|------|---------|
| Designer | `Designer.tsx` | WYSIWYG template editor |
| Form | `Form.tsx` | Interactive form filling |
| Viewer | `Viewer.tsx` | Read-only PDF preview |

Component Hierarchy:
```
Designer/Form/Viewer
├── Root.tsx
│   ├── AppContextProvider.tsx
│   ├── Paper.tsx
│   │   ├── Preview.tsx
│   │   ├── Renderer.tsx
│   │   └── StaticSchema.tsx
│   ├── CtlBar.tsx (controls)
│   └── UnitPager.tsx (pagination)
└── Designer/
    ├── Canvas.tsx
    ├── Sidebar/
    └── RightSidebar/
```

Base Class Pattern:
```typescript
// All UI components extend BaseUIClass
class BaseUIClass {
  protected domContainer: HTMLElement;
  protected template: Template;
  protected options: UIOptions;
  protected plugins: Plugins;
  // Common functionality
}
```

#### @pdfme/converter
**Location:** `packages/converter/src/`
**Purpose:** PDF format conversion utilities

- PDF to image conversion
- Browser and Node.js implementations
- Uses pdfjs-dist for parsing

#### @pdfme/manipulator
**Location:** `packages/manipulator/src/`
**Purpose:** PDF manipulation operations

Operations:
- Merge multiple PDFs
- Split PDF pages
- Rotate pages
- Extract pages

## Key Architectural Patterns

### 1. Plugin System

Each field type is a self-contained plugin with three components:
- **pdf**: Renders the field in the generated PDF
- **ui**: Renders the field in the browser for interactive use
- **propPanel**: Provides the configuration UI in the Designer

### 2. Template Structure

Templates use a 2D array structure for schemas:
```typescript
{
  basePdf: "base64..." | { width: 210, height: 297 },
  schemas: [
    // Page 1
    [{ type: "text", name: "field1", ... }, { type: "image", ... }],
    // Page 2
    [{ type: "table", ... }],
  ],
  staticSchemas: [{ ... }]  // Appears on every page
}
```

### 3. Dynamic Layout Engine

Located in `packages/common/src/dynamicTemplate.ts`:
- Calculates dynamic heights for expandable fields (tables, multiline text)
- Handles automatic page breaking
- Maintains layout tree for complex layouts

### 4. Expression System

Located in `packages/common/src/expression.ts`:
- Secure JavaScript expression evaluator using Acorn parser
- AST validation for security
- Cached compilation for performance
- Supports template variables like `{fieldName}`

### 5. Cross-Platform Support

The library provides different implementations for:
- **Browser**: Uses Canvas API, WebGL
- **Node.js**: Uses canvas package, native bindings

Export configuration handles this:
```json
{
  "exports": {
    ".": {
      "browser": "./dist/esm/src/index.browser.js",
      "node": "./dist/cjs/src/index.node.js"
    }
  }
}
```

## Build System

### Build Order (Critical)

Due to package dependencies, packages must be built in this order:
```bash
1. pdf-lib
2. common
3. converter
4. schemas
5. generator, ui, manipulator (parallel)
```

### Module Formats

Each package outputs multiple formats:
- **ESM** - ES Modules for modern bundlers
- **CJS** - CommonJS for Node.js
- **Node** - Node.js specific builds
- **Types** - TypeScript declarations

## Validation System

Uses Zod schemas for runtime validation:

```typescript
// Example from schema.ts
const Schema = z.object({
  type: z.string(),
  name: z.string().optional(),
  position: z.object({ x: z.number(), y: z.number() }),
  width: z.number(),
  height: z.number(),
  // ...
});
```

## Caching Strategy

Multiple caching layers for performance:
1. **Expression cache** - Compiled expressions
2. **Font cache** - Loaded and parsed fonts
3. **Image cache** - Embedded images during generation
4. **Render cache** - UI render optimization

## Testing Strategy

- **Unit tests**: Vitest for all packages
- **Snapshot tests**: PDF output validation
- **E2E tests**: Playwright for playground
- **CI/CD**: GitHub Actions

---

*Generated by BMM Document Project Workflow*
