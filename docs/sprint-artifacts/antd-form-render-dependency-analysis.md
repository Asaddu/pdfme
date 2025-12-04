# antd + form-render Dependency Analysis

**Created:** 2025-12-03
**Purpose:** Document all antd and form-render dependencies before migration to shadcn + TanStack Form

---

## Executive Summary

- **24 files** in `packages/ui` import from antd
- **1 file** imports from form-render (but it's the critical property panel)
- **3 files** in `packages/common` have form-render type dependencies
- **16+ files** in `packages/schemas` define propPanel schemas using form-render JSON Schema format

---

## Part 1: antd Imports by File

### 1.1 Theme System (`theme.useToken()`)

**Files using `theme.useToken()`** (19 unique token usages):

| File | Token Properties Used |
|------|----------------------|
| `components/CtlBar.tsx:105` | `colorWhite`, `fontSize`, `marginXS`, `paddingSM`, `borderRadius`, `colorBgMask` |
| `components/Spinner.tsx:6` | `colorPrimary` |
| `components/UnitPager.tsx:42` | `paddingSM`, `borderRadius`, `colorBgMask`, `colorWhite`, `fontSize`, `marginXS` |
| `components/ErrorScreen.tsx:9` | `colorBgLayout` |
| `components/Preview.tsx:34` | `colorPrimary` |
| `components/Renderer.tsx:13` | (imported as `antdTheme`, usage unclear) |
| `components/Designer/PluginIcon.tsx:63` | `colorText` |
| `components/Designer/LeftSidebar.tsx:19,66` | `colorPrimary`, `colorBgLayout` |
| `components/Designer/Canvas/index.tsx:46,122` | `borderRadius`, `colorWhite`, `colorPrimary` |
| `components/Designer/Canvas/Mask.tsx:15` | `colorBgMask` |
| `components/Designer/Canvas/Padding.tsx:50` | `colorError` |
| `components/Designer/Canvas/Selecto.tsx:19` | `colorPrimary`, `colorPrimaryBorder` |
| `components/Designer/Canvas/Moveable.tsx:34` | `colorPrimary` |
| `components/Designer/RightSidebar/index.tsx:12` | `colorBgLayout`, `colorSplit` |
| `components/Designer/RightSidebar/DetailView/index.tsx:51` | `marginXS` |
| `components/Designer/RightSidebar/DetailView/ButtonGroupWidget.tsx:13` | `colorText` |
| `components/Designer/RightSidebar/ListView/SelectableSortableItem.tsx:30` | `colorPrimary` |
| `components/Designer/RightSidebar/ListView/SelectableSortableContainer.tsx:32` | `colorPrimary` |

**Token-to-CSS Variable Mapping Needed:**

```typescript
// antd token → Tailwind CSS variable
token.colorPrimary        → var(--primary) or 'bg-primary'
token.colorPrimaryBorder  → var(--primary-border) or 'border-primary'
token.colorText           → var(--foreground) or 'text-foreground'
token.colorWhite          → '#ffffff' or 'text-white'
token.colorBgLayout       → var(--background) or 'bg-background'
token.colorBgMask         → var(--muted) or 'bg-muted/50'
token.colorSplit          → var(--border) or 'border-border'
token.colorError          → var(--destructive) or 'text-destructive'
token.borderRadius        → var(--radius) or 'rounded-md'
token.fontSize            → 'text-sm' (14px default)
token.marginXS            → 'mx-1' (4px)
token.marginSM            → 'mx-2' (8px)
token.paddingXS           → 'px-1' (4px)
token.paddingSM           → 'px-2' (8px)
```

---

### 1.2 antd Components by File

| File | Components Imported | Usage Pattern |
|------|---------------------|---------------|
| **AppContextProvider.tsx** | `ConfigProvider` | Wraps entire app for theming |
| **CtlBar.tsx** | `theme`, `Typography`, `Button`, `Dropdown`, `MenuProps` | Control bar with dropdown menu |
| **ErrorScreen.tsx** | `theme`, `Result` | Error display card |
| **Spinner.tsx** | `theme` | Loading spinner (token only) |
| **UnitPager.tsx** | `theme`, `Typography`, `Button` | Page navigation UI |
| **Preview.tsx** | `theme` | Preview component (token only) |
| **Renderer.tsx** | `theme` (as antdTheme) | Renderer (token only) |
| **Designer/LeftSidebar.tsx** | `theme`, `Button` | Plugin toolbar |
| **Designer/PluginIcon.tsx** | `theme` | Plugin icon display (token only) |
| **Designer/Canvas/index.tsx** | `theme`, `Button` | Canvas with add button |
| **Designer/Canvas/Mask.tsx** | `theme` | Canvas mask (token only) |
| **Designer/Canvas/Padding.tsx** | `theme` | Padding overlay (token only) |
| **Designer/Canvas/Selecto.tsx** | `theme` | Selection box (token only) |
| **Designer/Canvas/Moveable.tsx** | `theme` | Moveable handles (token only) |
| **Designer/RightSidebar/index.tsx** | `theme`, `Button` | Sidebar with toggle button |
| **Designer/RightSidebar/layout.tsx** | `Divider` | Horizontal divider |
| **Designer/RightSidebar/ListView/index.tsx** | `Input`, `Typography`, `Button` | Schema list with search |
| **Designer/RightSidebar/ListView/Item.tsx** | `Button`, `Typography` | List item row |
| **Designer/RightSidebar/ListView/SelectableSortableItem.tsx** | `theme` | Draggable item (token only) |
| **Designer/RightSidebar/ListView/SelectableSortableContainer.tsx** | `theme` | Sortable container (token only) |
| **Designer/RightSidebar/DetailView/index.tsx** | `theme`, `Typography`, `Button`, `Divider` | Property panel header |
| **Designer/RightSidebar/DetailView/AlignWidget.tsx** | `Space`, `Button`, `Form` | Alignment buttons |
| **Designer/RightSidebar/DetailView/ButtonGroupWidget.tsx** | `Space`, `Button`, `Form`, `theme` | Toggle button group |

---

### 1.3 antd Component → shadcn Mapping

| antd Component | shadcn Equivalent | Notes |
|----------------|-------------------|-------|
| `ConfigProvider` | CSS Variables + ThemeProvider | Just set CSS vars at root |
| `Button` | `Button` | Direct replacement |
| `Typography.Text` | `<span>` with Tailwind | No component needed |
| `Divider` | `Separator` | Direct replacement |
| `Dropdown` | `DropdownMenu` | Different API |
| `Input` | `Input` | Direct replacement |
| `Space.Compact` | `<div className="flex">` | Flex container |
| `Form.Item` | Formedible field wrapper | Part of form system |
| `Result` | Custom component | Simple card with icon/text |

---

## Part 2: form-render Integration

### 2.1 Core Integration Point

**File:** `packages/ui/src/components/Designer/RightSidebar/DetailView/index.tsx`

```typescript
import { useForm } from 'form-render';           // Line 1
import FormRenderComponent from 'form-render';   // Line 32

// Usage:
const form = useForm();                           // Line 54

// Form lifecycle:
form.resetFields()                               // Line 99
form.setValues(values)                           // Line 107
form.getValues()                                 // Line 140
form.validateFields()                            // Line 200-201

// Render:
<FormRenderComponent
  form={form}
  schema={propPanelSchema}      // JSON Schema format
  widgets={widgets}             // Custom widget renderers
  watch={{ '#': handleWatch }}  // Field change handler
  locale="en-US"
/>
```

### 2.2 form-render Schema Structure

The property panel uses JSON Schema format with form-render extensions:

```typescript
const propPanelSchema: PropPanelSchema = {
  type: 'object',
  column: 2,                    // 2-column layout
  properties: {
    fieldName: {
      title: 'Label',
      type: 'string' | 'number' | 'boolean' | 'object',
      widget: 'input' | 'inputNumber' | 'select' | 'color' | 'card' | 'CustomWidget',
      span: 6 | 8 | 12 | 16,    // Column span out of 24
      required: true,
      disabled: boolean,
      hidden: boolean | '{{expression}}',  // Template expression
      default: any,
      props: { /* widget-specific props */ },
      rules: [{ validator: fn, message: string }],
      min: number,
      max: number,
    },
    nestedObject: {
      type: 'object',
      widget: 'card',
      properties: { /* nested fields */ }
    },
    divider: {
      type: 'void',
      widget: 'Divider'         // Custom widget for visual separator
    }
  }
};
```

### 2.3 Built-in Widgets Used

| Widget Name | Purpose | Source |
|-------------|---------|--------|
| `input` | Text input (default) | form-render built-in |
| `inputNumber` | Number input | form-render built-in |
| `select` | Dropdown select | form-render built-in |
| `color` | Color picker | form-render built-in |
| `card` | Nested object container | form-render built-in |
| `Divider` | Visual separator | **Custom** (DetailView) |
| `AlignWidget` | Alignment buttons | **Custom** (DetailView) |
| `ButtonGroup` | Toggle button group | **Custom** (DetailView) |
| `UseDynamicFontSize` | Checkbox widget | **Custom** (text propPanel) |
| `addOptions` | Options editor | **Custom** (select propPanel) |

### 2.4 Watch/onChange Pattern

```typescript
const handleWatch = debounce(function (...args: unknown[]) {
  const formSchema = args[0] as Record<string, unknown>;

  let changes: ChangeSchemaItem[] = [];
  for (const key in formSchema) {
    if (['id', 'content'].includes(key)) continue;

    let value = formSchema[key];
    if (formAndSchemaValuesDiffer(value, activeSchema[key])) {
      changes.push({ key, value, schemaId: activeSchema.id });
    }
  }

  if (changes.length) {
    form.validateFields()
      .then(() => changeSchemas(changes))
      .catch(/* filter out invalid changes */);
  }
}, 100);
```

---

## Part 3: Type Dependencies in @pdfme/common

### 3.1 form-render Type Imports

**File:** `packages/common/src/types.ts`

```typescript
// Line 4
import type { WidgetProps as _PropPanelWidgetProps, Schema as _PropPanelSchema } from 'form-render';

// Line 29 - Re-exported
export type PropPanelSchema = _PropPanelSchema;

// Line 121 - Extended with pdfme props
export type PropPanelWidgetProps = _PropPanelWidgetProps & PropPanelProps;
```

### 3.2 antd Type Imports

**File:** `packages/common/src/types.ts`

```typescript
// Line 3
import type { ThemeConfig, GlobalToken } from 'antd';

// Used in:
// - UIRenderProps<T>.theme: GlobalToken (Line 91)
// - PropPanelProps.theme: GlobalToken (Line 117)
```

### 3.3 PropPanel Interface (Breaking Change Zone)

```typescript
// packages/common/src/types.ts:130-137
export interface PropPanel<T extends Schema> {
  schema:
    | ((propPanelProps: Omit<PropPanelProps, 'rootElement'>) => Record<string, PropPanelSchema>)
    | Record<string, PropPanelSchema>;

  widgets?: Record<string, (props: PropPanelWidgetProps) => void>;
  defaultSchema: T;
}
```

**This interface must change to:**
```typescript
// New interface with Zod
export interface PropPanel<T extends Schema> {
  schema:
    | ((propPanelProps: Omit<PropPanelProps, 'rootElement'>) => z.ZodObject<any>)
    | z.ZodObject<any>;

  fieldConfig?: FieldConfig;  // Formedible field customization
  defaultSchema: T;
}
```

---

## Part 4: Schema Plugin propPanel Definitions

### 4.1 Files with propPanel Definitions

| File | Schema Type | Has Custom Widget |
|------|-------------|-------------------|
| `schemas/src/text/propPanel.ts` | TextSchema | Yes (`UseDynamicFontSize`) |
| `schemas/src/multiVariableText/propPanel.ts` | MultiVariableTextSchema | Inherits from text |
| `schemas/src/tables/cell.ts` | CellSchema | No |
| `schemas/src/tables/propPanel.ts` | TableSchema | Yes (`TableColumns`) |
| `schemas/src/barcodes/propPanel.ts` | BarcodeSchema | No |
| `schemas/src/checkbox/index.ts` | CheckboxSchema | No |
| `schemas/src/radioGroup/index.ts` | RadioGroupSchema | No |
| `schemas/src/select/index.ts` | SelectSchema | Yes (`addOptions`) |
| `schemas/src/date/helper.ts` | DateSchema | No |
| `schemas/src/graphics/image.ts` | ImageSchema | No |
| `schemas/src/graphics/svg.ts` | SVGSchema | No |
| `schemas/src/shapes/line.ts` | LineSchema | No |
| `schemas/src/shapes/rectAndEllipse.ts` | ShapeSchema | No |

### 4.2 Schema Definition Pattern (Current)

```typescript
// packages/schemas/src/text/propPanel.ts
export const propPanel: PropPanel<TextSchema> = {
  schema: ({ options, activeSchema, i18n }) => {
    // Dynamic schema based on context
    const enableDynamicFont = Boolean(activeSchema?.dynamicFontSize);

    return {
      fontName: {
        title: i18n('schemas.text.fontName'),
        type: 'string',
        widget: 'select',
        props: { options: fontNames.map(n => ({ label: n, value: n })) },
        span: 12,
      },
      fontSize: {
        title: i18n('schemas.text.size'),
        type: 'number',
        widget: 'inputNumber',
        disabled: enableDynamicFont,  // Conditional disable
        props: { min: 0 },
        span: 6,
      },
      // ... more fields
    };
  },
  widgets: { UseDynamicFontSize },  // Custom widget
  defaultSchema: {
    type: 'text',
    // ... default values
  },
};
```

### 4.3 Schema Definition Pattern (Target - Zod)

```typescript
// Target pattern with Zod + Formedible
import { z } from 'zod';

export const propPanel: PropPanel<TextSchema> = {
  schema: ({ options, activeSchema, i18n }) => {
    const enableDynamicFont = Boolean(activeSchema?.dynamicFontSize);

    return z.object({
      fontName: z.string().describe(i18n('schemas.text.fontName')),
      fontSize: z.number().min(0).describe(i18n('schemas.text.size')),
      // ...
    });
  },
  fieldConfig: {
    fontName: {
      fieldType: 'select',
      inputProps: { options: fontNames },
    },
    fontSize: {
      disabled: enableDynamicFont,
    },
  },
  defaultSchema: { /* same */ },
};
```

---

## Part 5: Custom Widget Analysis

### 5.1 AlignWidget

**Location:** `DetailView/AlignWidget.tsx`

**Purpose:** 8-button toolbar for aligning/distributing selected elements

**Dependencies:**
- antd: `Space`, `Button`, `Form`
- lucide-react: alignment icons

**Logic:**
- `align(type)` - Aligns elements left/center/right/top/middle/bottom
- `distribute(type)` - Distributes elements evenly (needs 3+ selected)
- Uses `changeSchemas()` to update positions

**shadcn Migration:**
- Replace `Space.Compact` with `<div className="flex">`
- Replace antd `Button` with shadcn `Button`
- Remove `Form.Item` wrapper (Formedible handles this)

### 5.2 ButtonGroupWidget

**Location:** `DetailView/ButtonGroupWidget.tsx`

**Purpose:** Generic toggle button group (used for text formatting: bold, italic, underline, strikethrough)

**Dependencies:**
- antd: `Space`, `Button`, `Form`, `theme`

**Logic:**
- Receives `schema.buttons` array with `{ key, icon, type, value }` configs
- `apply(btn)` - Toggles boolean or sets select value
- `isActive(btn)` - Checks current state
- Icons passed as SVG strings, colored with `token.colorText`

**shadcn Migration:**
- Replace with shadcn `ToggleGroup` or custom button group
- SVG icon coloring via CSS instead of string replacement

### 5.3 UseDynamicFontSize (Plugin Widget)

**Location:** `schemas/src/text/propPanel.ts`

**Purpose:** Checkbox to enable dynamic font sizing

**Pattern:**
```typescript
const UseDynamicFontSize = (props: PropPanelWidgetProps) => {
  const { rootElement, changeSchemas, activeSchema, i18n } = props;

  // Creates DOM elements directly (not React)
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = Boolean(activeSchema?.dynamicFontSize);
  checkbox.onchange = (e) => {
    const val = e.target.checked ? { min: 8, max: 48, fit: 'vertical' } : undefined;
    changeSchemas([{ key: 'dynamicFontSize', value: val, schemaId: activeSchema.id }]);
  };

  rootElement.appendChild(label);  // Direct DOM manipulation
};
```

**Note:** Plugin widgets use `rootElement` DOM manipulation, not React. The `WidgetRenderer` component handles mounting them.

---

## Part 6: Cross-Package Dependencies

### 6.1 Dependency Graph

```
@pdfme/common
├── types.ts imports from:
│   ├── form-render (WidgetProps, Schema)
│   └── antd (ThemeConfig, GlobalToken)
└── exports PropPanel, PropPanelSchema, PropPanelWidgetProps

@pdfme/schemas
├── imports PropPanel, PropPanelWidgetProps, PropPanelSchema from @pdfme/common
└── defines propPanel objects for each schema type

@pdfme/ui
├── imports types from @pdfme/common
├── imports antd components
├── imports form-render
└── uses plugin.propPanel from registry
```

### 6.2 Breaking Change Impact

**Changes Required:**

1. **@pdfme/common/types.ts**
   - Remove form-render imports
   - Remove antd type imports
   - Redefine PropPanelSchema as Zod type
   - Redefine PropPanelWidgetProps without form-render

2. **@pdfme/schemas (all propPanel files)**
   - Convert JSON Schema objects to Zod schemas
   - Update widget signature for React components

3. **@pdfme/ui**
   - Remove all antd imports
   - Remove form-render
   - Implement shadcn components
   - Implement Formedible/TanStack Form

---

## Part 7: Migration Checklist

### Phase 1: Infrastructure
- [ ] Add Tailwind CSS to packages/ui
- [ ] Create CSS variables for theme tokens
- [ ] Add shadcn/ui components
- [ ] Add TanStack Form + Formedible

### Phase 2: Simple Components (token-only files)
- [ ] Spinner.tsx
- [ ] Preview.tsx
- [ ] Renderer.tsx
- [ ] PluginIcon.tsx
- [ ] Canvas/Mask.tsx
- [ ] Canvas/Padding.tsx
- [ ] Canvas/Selecto.tsx
- [ ] Canvas/Moveable.tsx
- [ ] ListView/SelectableSortableItem.tsx
- [ ] ListView/SelectableSortableContainer.tsx

### Phase 3: Button/Typography Components
- [ ] CtlBar.tsx
- [ ] UnitPager.tsx
- [ ] ErrorScreen.tsx
- [ ] LeftSidebar.tsx
- [ ] Canvas/index.tsx
- [ ] RightSidebar/index.tsx
- [ ] RightSidebar/layout.tsx
- [ ] ListView/index.tsx
- [ ] ListView/Item.tsx

### Phase 4: Form System
- [ ] Create Zod schema builders
- [ ] Migrate AlignWidget to shadcn
- [ ] Migrate ButtonGroupWidget to shadcn
- [ ] Update WidgetRenderer for new widget API
- [ ] Migrate DetailView/index.tsx to Formedible

### Phase 5: Plugin Schemas
- [ ] Update PropPanel types in @pdfme/common
- [ ] Migrate text/propPanel.ts
- [ ] Migrate multiVariableText/propPanel.ts
- [ ] Migrate tables/propPanel.ts
- [ ] Migrate barcodes/propPanel.ts
- [ ] Migrate remaining schema propPanels

### Phase 6: Cleanup
- [ ] Remove antd from dependencies
- [ ] Remove form-render from dependencies
- [ ] Update AppContextProvider
- [ ] Update theme.ts
- [ ] Run tests
- [ ] Update snapshots

---

## Appendix: Token Value Reference

```typescript
// antd default token values for reference
const tokens = {
  colorPrimary: '#1677ff',      // We use '#38a0ff'
  colorPrimaryBorder: '#91caff',
  colorText: 'rgba(0, 0, 0, 0.88)',
  colorWhite: '#ffffff',
  colorBgLayout: '#f5f5f5',
  colorBgMask: 'rgba(0, 0, 0, 0.45)',
  colorSplit: 'rgba(5, 5, 5, 0.06)',
  colorError: '#ff4d4f',
  borderRadius: 6,
  fontSize: 14,
  marginXS: 8,
  marginSM: 12,
  paddingXS: 8,
  paddingSM: 12,
};
```
