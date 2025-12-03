# PDFme Source Tree Analysis

## Repository Root Structure

```
pdfme/
├── .github/                    # GitHub configuration
│   └── workflows/              # CI/CD pipelines
│       ├── test.yml            # PR testing workflow
│       ├── publish-release.yml # NPM release publishing
│       ├── publish-commit.yml  # Dev tag publishing
│       ├── claude.yml          # Claude Code integration
│       └── close-answered-issues.yml
│
├── packages/                   # Core library packages
│   ├── common/                 # @pdfme/common
│   ├── pdf-lib/                # @pdfme/pdf-lib (forked)
│   ├── converter/              # @pdfme/converter
│   ├── schemas/                # @pdfme/schemas
│   ├── generator/              # @pdfme/generator
│   ├── manipulator/            # @pdfme/manipulator
│   └── ui/                     # @pdfme/ui
│
├── playground/                 # Interactive demo application
├── website/                    # Documentation site
├── scripts/                    # Build utilities
│
├── package.json                # Root workspace config
├── pnpm-workspace.yaml         # pnpm workspace definition
├── tsconfig.base.json          # Shared TypeScript config
├── vitest.config.ts            # Test configuration
│
├── README.md                   # Project overview
├── DEVELOPMENT.md              # Contribution guide
├── RELEASE.md                  # Release process
├── LICENSE.md                  # MIT license
└── CLAUDE.md                   # Claude Code instructions
```

## Package: @pdfme/common

**Purpose:** Core types, utilities, and shared logic

```
packages/common/
├── src/
│   ├── index.ts              # Public API exports
│   ├── types.ts              # Core type definitions
│   │   └── Plugin, Schema, Template, PDFRenderProps, UIRenderProps
│   ├── schema.ts             # Zod validation schemas
│   │   └── Lang, Mode, Size, Schema, Font, BasePdf, Template, etc.
│   ├── helper.ts             # Utility functions
│   │   └── mm2pt, pt2mm, checkTemplate, getDefaultFont, etc.
│   ├── expression.ts         # Expression evaluator (Acorn-based)
│   │   └── replacePlaceholders, evaluateExpression
│   ├── dynamicTemplate.ts    # Dynamic layout engine
│   │   └── getDynamicTemplate, calculateDynamicHeights
│   ├── constants.ts          # Shared constants (~175KB default fonts)
│   │   └── BLANK_PDF, BLANK_A4_PDF, DEFAULT_FONT_NAME, ZOOM
│   ├── pluginRegistry.ts     # Plugin registration
│   └── version.ts            # Package version
│
├── tsconfig.cjs.json          # CommonJS build config
├── tsconfig.esm.json          # ES Module build config
├── tsconfig.node.json         # Node.js build config
├── set-version.js             # Version injection script
└── package.json
```

## Package: @pdfme/schemas

**Purpose:** Built-in field type plugins

```
packages/schemas/
├── src/
│   ├── index.ts              # Plugin exports
│   ├── utils.ts              # Shared utilities
│   ├── constants.ts          # Schema constants
│   │
│   ├── text/                 # Text field plugin
│   │   ├── index.ts          # Plugin export { pdf, ui, propPanel }
│   │   ├── types.ts          # TextSchema type definition
│   │   ├── pdfRender.ts      # PDF rendering logic
│   │   ├── uiRender.ts       # Browser rendering logic
│   │   ├── propPanel.ts      # Designer property panel
│   │   └── helper.ts         # Text-specific helpers
│   │
│   ├── multiVariableText/    # Template variable text
│   │   └── (same structure as text/)
│   │
│   ├── graphics/             # Image and SVG
│   │   ├── image.ts          # Image plugin
│   │   └── svg.ts            # SVG plugin
│   │
│   ├── barcodes/             # Barcode generation
│   │   ├── index.ts          # Barcode plugin exports
│   │   ├── types.ts          # Barcode types
│   │   ├── pdfRender.ts      # PDF barcode rendering
│   │   ├── uiRender.ts       # Browser barcode rendering
│   │   └── propPanel.ts      # Barcode properties
│   │
│   ├── tables/               # Dynamic table support
│   │   ├── index.ts          # Table plugin
│   │   ├── types.ts          # TableSchema definition
│   │   ├── pdfRender.ts      # PDF table rendering
│   │   ├── uiRender.ts       # Browser table rendering
│   │   ├── propPanel.ts      # Table properties
│   │   └── dynamicTemplate.ts # Table height calculation
│   │
│   ├── date/                 # Date/time fields
│   │   ├── date.ts           # Date picker
│   │   ├── time.ts           # Time picker
│   │   └── dateTime.ts       # Combined picker
│   │
│   ├── shapes/               # Shape drawing
│   │   ├── line.ts           # Line shape
│   │   └── rectAndEllipse.ts # Rectangle and ellipse
│   │
│   ├── checkbox/             # Checkbox field
│   ├── radioGroup/           # Radio button group
│   └── select/               # Dropdown select
│
└── package.json
```

## Package: @pdfme/generator

**Purpose:** PDF generation from templates

```
packages/generator/
├── src/
│   ├── index.ts              # Export: generate function
│   ├── generate.ts           # Main generation logic
│   │   └── generate(props: GenerateProps): Promise<Uint8Array>
│   ├── helper.ts             # Generation helpers
│   │   └── insertPage, preprocessing, postProcessing, getEmbedPdfPages
│   ├── types.ts              # Generator-specific types
│   └── constants.ts          # Generator constants
│
├── __tests__/                # Test files
│   └── *.test.ts
│
├── tsconfig.cjs.json
├── tsconfig.esm.json
├── tsconfig.node.json
└── package.json
```

## Package: @pdfme/ui

**Purpose:** React-based UI components (Designer, Form, Viewer)

```
packages/ui/
├── src/
│   ├── index.ts              # Export: Designer, Form, Viewer
│   ├── Designer.tsx          # Template design component
│   ├── Form.tsx              # Form filling component
│   ├── Viewer.tsx            # Read-only viewer component
│   ├── class.ts              # BaseUIClass base class
│   ├── hooks.ts              # React hooks
│   ├── helper.ts             # UI utilities
│   ├── contexts.ts           # React contexts
│   ├── constants.ts          # UI constants
│   ├── theme.ts              # Theming configuration
│   ├── types.ts              # UI-specific types
│   ├── i18n.ts               # Internationalization (~39KB)
│   │
│   └── components/
│       ├── AppContextProvider.tsx  # Context provider
│       ├── Root.tsx                # Root component
│       ├── Paper.tsx               # Canvas wrapper
│       ├── Preview.tsx             # PDF preview
│       ├── Renderer.tsx            # Schema renderer
│       ├── StaticSchema.tsx        # Static field renderer
│       ├── CtlBar.tsx              # Control bar
│       ├── UnitPager.tsx           # Page navigation
│       ├── Spinner.tsx             # Loading indicator
│       ├── ErrorScreen.tsx         # Error display
│       │
│       └── Designer/               # Designer-specific components
│           ├── index.tsx           # Designer main
│           ├── Canvas.tsx          # Design canvas
│           ├── Sidebar/            # Left sidebar (schema list)
│           └── RightSidebar/       # Property panel
│
├── __tests__/
│   └── *.test.tsx
│
├── vite.config.ts            # Vite build config
├── tsconfig.json
└── package.json
```

## Package: @pdfme/converter

**Purpose:** PDF format conversion

```
packages/converter/
├── src/
│   ├── index.browser.ts      # Browser entry point
│   ├── index.node.ts         # Node.js entry point
│   └── (conversion logic)
│
└── package.json
```

## Package: @pdfme/manipulator

**Purpose:** PDF manipulation (merge, split, rotate)

```
packages/manipulator/
├── src/
│   ├── index.ts              # Public API
│   └── (manipulation functions)
│
└── package.json
```

## Playground

**Purpose:** Interactive development and testing

```
playground/
├── public/
│   └── template-assets/      # Template examples
│
├── src/
│   ├── main.tsx              # Application entry
│   ├── App.tsx               # Main app component
│   └── (pages and components)
│
├── scripts/
│   ├── generate-templates-list-json.mjs
│   └── generate-templates-thumbnail.mjs
│
├── tests/                    # Playwright E2E tests
├── vite.config.ts
├── tailwind.config.ts
└── package.json
```

## Website

**Purpose:** Documentation site (Docusaurus)

```
website/
├── docs/                     # Documentation pages
├── src/                      # Custom components
├── static/                   # Static assets
├── docusaurus.config.js
└── package.json
```

## Critical Files Reference

### Entry Points

| Package | Entry Point |
|---------|-------------|
| common | `packages/common/src/index.ts` |
| schemas | `packages/schemas/src/index.ts` |
| generator | `packages/generator/src/index.ts` |
| ui | `packages/ui/src/index.ts` |
| converter | `packages/converter/src/index.*.ts` |
| manipulator | `packages/manipulator/src/index.ts` |

### Key Type Definitions

| Type | Location |
|------|----------|
| Plugin | `packages/common/src/types.ts:150` |
| Schema | `packages/common/src/schema.ts` |
| Template | `packages/common/src/schema.ts` |
| GenerateProps | `packages/common/src/schema.ts` |
| UIRenderProps | `packages/common/src/types.ts:80` |
| PDFRenderProps | `packages/common/src/types.ts:49` |

### Configuration Files

| File | Purpose |
|------|---------|
| `pnpm-workspace.yaml` | Workspace package list |
| `tsconfig.base.json` | Shared TypeScript settings |
| `vitest.config.ts` | Test configuration |
| `package.json` | Root scripts and devDependencies |

---

*Generated by BMM Document Project Workflow*
