# PDFme Integration Architecture

## Overview

This document describes how the 7 core packages in the PDFme monorepo integrate and communicate with each other.

## Package Dependency Graph

```
                         ┌─────────────────┐
                         │    pdf-lib      │
                         │  (Foundation)   │
                         └────────┬────────┘
                                  │
                         ┌────────▼────────┐
                         │     common      │
                         │ (Core Types)    │
                         └────────┬────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
     ┌────────▼────────┐ ┌───────▼────────┐ ┌───────▼────────┐
     │   converter     │ │    schemas     │ │  manipulator   │
     │ (PDF Convert)   │ │  (Plugins)     │ │ (PDF Ops)      │
     └────────┬────────┘ └───────┬────────┘ └────────────────┘
              │                   │
              │          ┌───────▼────────┐
              └─────────►│   generator    │
                         │ (PDF Engine)   │
                         └───────┬────────┘
                                 │
                         ┌───────▼────────┐
                         │      ui        │
                         │ (React UI)     │
                         └────────────────┘
```

## Integration Points

### 1. pdf-lib → common

**Type:** Direct dependency
**Purpose:** Low-level PDF operations

```typescript
// common imports pdf-lib types
import type { PDFPage, PDFDocument } from '@pdfme/pdf-lib';
```

**Data Flow:**
- common re-exports pdf-lib types for use by other packages
- PDFDocument and PDFPage types used in render props

### 2. common → schemas

**Type:** Peer dependency
**Purpose:** Type definitions and utilities

```typescript
// schemas imports from common
import type { Plugin, Schema, PDFRenderProps, UIRenderProps } from '@pdfme/common';
```

**Data Flow:**
- Schema plugins implement the `Plugin` interface from common
- Render functions receive props defined in common

### 3. common → generator

**Type:** Peer dependency
**Purpose:** Template processing and validation

```typescript
// generator imports from common
import {
  checkGenerateProps,
  getDynamicTemplate,
  replacePlaceholders,
} from '@pdfme/common';
```

**Data Flow:**
- Templates validated using common's check functions
- Dynamic layout calculated using common's getDynamicTemplate
- Expressions evaluated using common's replacePlaceholders

### 4. schemas → generator

**Type:** Peer dependency
**Purpose:** Schema rendering

```typescript
// generator imports from schemas
import { getDynamicHeightsForTable } from '@pdfme/schemas';
```

**Data Flow:**
- Generator calls schema plugins to render each field
- Dynamic height functions called for expandable fields (tables)

### 5. common + schemas → ui

**Type:** Peer dependencies
**Purpose:** UI rendering and template editing

```typescript
// ui imports from common and schemas
import type { Template, UIOptions, Plugin } from '@pdfme/common';
import { text, image, barcodes } from '@pdfme/schemas';
```

**Data Flow:**
- UI components receive templates defined by common types
- Schema plugins provide UI rendering functions
- Property panels defined by schema plugins

### 6. converter → generator (dev)

**Type:** Dev dependency
**Purpose:** Testing PDF conversion

```typescript
// converter uses generator for tests
import generate from '@pdfme/generator';
```

### 7. pdf-lib → manipulator

**Type:** Direct dependency
**Purpose:** PDF manipulation operations

```typescript
// manipulator uses pdf-lib directly
import { PDFDocument } from '@pdfme/pdf-lib';
```

## Data Flow Patterns

### PDF Generation Flow

```
User Input (JSON)
       │
       ▼
┌──────────────┐
│   Template   │ (from common types)
│   + Inputs   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  generator   │ → getDynamicTemplate (common)
│              │ → replacePlaceholders (common)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   schemas    │ → pdf render functions
│   plugins    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   pdf-lib    │ → PDFDocument operations
└──────┬───────┘
       │
       ▼
   Uint8Array (PDF bytes)
```

### UI Rendering Flow

```
Template + Inputs
       │
       ▼
┌──────────────┐
│     ui       │ → Designer/Form/Viewer
│  component   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   schemas    │ → ui render functions
│   plugins    │
└──────┬───────┘
       │
       ▼
   DOM Elements (rendered in browser)
```

## Shared Interfaces

### Plugin Interface

All schema types implement this interface defined in common:

```typescript
interface Plugin<T extends Schema> {
  pdf: (props: PDFRenderProps<T>) => Promise<void> | void;
  ui: (props: UIRenderProps<T>) => Promise<void> | void;
  propPanel: PropPanel<T>;
  icon?: string;
}
```

### Template Interface

Shared across all packages:

```typescript
interface Template {
  basePdf: BasePdf;
  schemas: Schema[][];
  staticSchemas?: Schema[];
}
```

## Build Integration

### Build Order (Critical)

Due to these dependencies, packages must be built in order:

```bash
1. pdf-lib      # No dependencies
2. common       # Depends on pdf-lib
3. converter    # Depends on common, pdf-lib
4. schemas      # Depends on common, pdf-lib
5. generator    # Depends on common, schemas (parallel OK)
6. ui           # Depends on common, schemas (parallel OK)
7. manipulator  # Depends on pdf-lib (parallel OK)
```

### Workspace Configuration

```yaml
# pnpm-workspace.yaml
packages:
  - packages/common
  - packages/pdf-lib
  - packages/converter
  - packages/schemas
  - packages/generator
  - packages/manipulator
  - packages/ui
  - playground
  - website
```

## Cross-Package Type Safety

TypeScript ensures type safety across packages:

1. **Shared Types:** Defined in common, used everywhere
2. **Plugin Types:** Generic `Plugin<T>` ensures schema-specific type safety
3. **Render Props:** Strongly typed for both PDF and UI rendering
4. **Validation:** Zod schemas in common validate runtime data

## Testing Integration

- Each package has its own test suite
- Integration tested via playground E2E tests
- Snapshot tests verify PDF output consistency

---

*Generated by BMM Document Project Workflow*
