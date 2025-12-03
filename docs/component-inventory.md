# PDFme Component Inventory

## Overview

This document catalogs all components in the PDFme library, organized by package and type.

## Schema Plugins (@pdfme/schemas)

Schema plugins are the core building blocks for PDF templates. Each plugin provides rendering for both PDF generation and browser display.

### Text and Content

| Plugin | Type ID | Description | Features |
|--------|---------|-------------|----------|
| **text** | `text` | Single/multi-line text | Font styling, alignment, line height |
| **multiVariableText** | `multiVariableText` | Template variable text | Variable substitution, dynamic content |

**Text Schema Properties:**
- `fontName` - Font family name
- `fontSize` - Font size in points
- `fontColor` - Text color (hex)
- `alignment` - left, center, right
- `lineHeight` - Line spacing multiplier
- `characterSpacing` - Letter spacing
- `dynamicFontSize` - Auto-fit text to bounds

### Graphics

| Plugin | Type ID | Description | Features |
|--------|---------|-------------|----------|
| **image** | `image` | Image embedding | Base64, URL, fit modes |
| **svg** | `svg` | SVG graphics | Vector graphics, styling |

### Barcodes

| Plugin | Type ID | Description | Features |
|--------|---------|-------------|----------|
| **barcodes** | Multiple | Barcode generation | QR, Code128, EAN, UPC, etc. |

**Supported Barcode Types:**
- QR Code
- Code 128
- Code 39
- EAN-13, EAN-8
- UPC-A, UPC-E
- ITF-14
- PDF417
- DataMatrix

### Tables

| Plugin | Type ID | Description | Features |
|--------|---------|-------------|----------|
| **table** | `table` | Dynamic tables | Auto-sizing, page breaks |

**Table Schema Properties:**
- `head` - Header row content
- `content` - Table body content (2D array)
- `headStyles` - Header styling
- `bodyStyles` - Body styling
- `columnStyles` - Per-column styling

### Date and Time

| Plugin | Type ID | Description | Features |
|--------|---------|-------------|----------|
| **date** | `date` | Date picker | Format customization |
| **time** | `time` | Time picker | 12/24 hour format |
| **dateTime** | `dateTime` | Combined picker | Date and time |

### Form Controls

| Plugin | Type ID | Description | Features |
|--------|---------|-------------|----------|
| **checkbox** | `checkbox` | Checkbox field | Checked/unchecked state |
| **radioGroup** | `radioGroup` | Radio buttons | Single selection |
| **select** | `select` | Dropdown | Option list |

### Shapes

| Plugin | Type ID | Description | Features |
|--------|---------|-------------|----------|
| **line** | `line` | Line drawing | Color, width |
| **rectangle** | `rectangle` | Rectangle shape | Fill, stroke |
| **ellipse** | `ellipse` | Ellipse/circle | Fill, stroke |

## UI Components (@pdfme/ui)

### Main Components

| Component | Export | Purpose |
|-----------|--------|---------|
| **Designer** | `Designer` | WYSIWYG template editor |
| **Form** | `Form` | Interactive form filling |
| **Viewer** | `Viewer` | Read-only PDF preview |

### Internal UI Components

| Component | Location | Purpose |
|-----------|----------|---------|
| **Root** | `components/Root.tsx` | Main container |
| **Paper** | `components/Paper.tsx` | Canvas wrapper |
| **Preview** | `components/Preview.tsx` | PDF preview layer |
| **CtlBar** | `components/CtlBar.tsx` | Control toolbar |
| **UnitPager** | `components/UnitPager.tsx` | Page navigation |
| **Spinner** | `components/Spinner.tsx` | Loading indicator |
| **ErrorScreen** | `components/ErrorScreen.tsx` | Error display |
| **Renderer** | `components/Renderer.tsx` | Schema renderer |

## Core Utilities (@pdfme/common)

### Validation Functions

| Function | Purpose |
|----------|---------|
| `checkTemplate` | Validate template structure |
| `checkGenerateProps` | Validate generation props |
| `checkUIProps` | Validate UI props |
| `checkFont` | Validate font configuration |

### Conversion Functions

| Function | Purpose |
|----------|---------|
| `mm2pt` | Millimeters to points |
| `pt2mm` | Points to millimeters |
| `pt2px` | Points to pixels |
| `px2mm` | Pixels to millimeters |

### Template Functions

| Function | Purpose |
|----------|---------|
| `getDynamicTemplate` | Calculate dynamic layouts |
| `replacePlaceholders` | Evaluate expressions |
| `getInputFromTemplate` | Extract input schema |

## Generator Functions (@pdfme/generator)

| Function | Export | Purpose |
|----------|--------|---------|
| `generate` | Default | Generate PDF from template |

## Manipulator Functions (@pdfme/manipulator)

| Function | Purpose |
|----------|---------|
| `merge` | Merge multiple PDFs |
| `split` | Split PDF into pages |
| `rotate` | Rotate PDF pages |

## Plugin Interface

All schema plugins implement this interface:

```typescript
interface Plugin<T extends Schema> {
  pdf: (props: PDFRenderProps<T>) => Promise<void> | void;
  ui: (props: UIRenderProps<T>) => Promise<void> | void;
  propPanel: PropPanel<T>;
  icon?: string;
  uninterruptedEditMode?: boolean;
}
```

## External Dependencies

### UI Package

| Dependency | Purpose |
|------------|---------|
| React 19 | UI framework |
| antd 6 | UI component library |
| form-render | Property panel forms |
| react-moveable | Drag/resize |
| @dnd-kit | Drag and drop |
| lucide-react | Icons |

### Schema Package

| Dependency | Purpose |
|------------|---------|
| bwip-js | Barcode generation |
| air-datepicker | Date picker UI |
| date-fns | Date formatting |
| fontkit | Font parsing |

### Common Package

| Dependency | Purpose |
|------------|---------|
| zod | Runtime validation |
| acorn | Expression parsing |

---

*Generated by BMM Document Project Workflow*
