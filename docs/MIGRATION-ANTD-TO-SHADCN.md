# Migration: antd + form-render → shadcn + TanStack Form

## Background

### Current State

The `@pdfme/ui` package uses:
- **antd** (v6) - UI component library (Button, Input, Typography, Dropdown, etc.)
- **form-render** (v2.5.6) - Schema-driven form generation from alibaba/x-render

### The Problem

`form-render` does not support React 19 or antd 6:
- Open issues: [#1710](https://github.com/alibaba/x-render/issues/1710), [#1649](https://github.com/alibaba/x-render/issues/1649)
- Dependencies stuck on old versions:
  - `rc-color-picker` requires React 16.x only
  - `virtualizedtableforantd4` requires React 16/17/18 and antd 4/5
- 11 PRs sitting without merge - project is semi-maintained
- No React 19 or antd 6 support on roadmap

### What form-render Does

Used in **one place**: `packages/ui/src/components/Designer/RightSidebar/DetailView/index.tsx`

It renders the property panel in the Designer when you select a schema element. The key abstraction:

```tsx
// Plugin authors return a JSON schema object
propPanel: {
  schema: {
    fieldName: {
      title: 'Field Name',
      type: 'string',
      required: true,
    },
    // ... more fields
  }
}

// form-render auto-generates the form UI from this schema
<FormRenderComponent
  form={form}
  schema={propPanelSchema}
  widgets={widgets}
  watch={{ '#': handleWatch }}
/>
```

This allows plugin authors to define property panels declaratively via JSON schema rather than writing React components.

### What antd Provides

Used across 25 files in `packages/ui`:

| Component | Usage |
|-----------|-------|
| `theme` / `theme.useToken()` | Design tokens (colors, spacing) - 15+ files |
| `Button` | Buttons everywhere |
| `Typography` | Text styling |
| `Input` | Text inputs |
| `Divider` | Visual separators |
| `Dropdown` | Menus |
| `Space` | Layout spacing |
| `Form` | Form in AlignWidget/ButtonGroupWidget |
| `Result` | Error screen |
| `ConfigProvider` | Theme provider |

---

## Proposed Solution

### Replace with:
- **shadcn/ui** - Copy-paste component library (Tailwind + Radix UI)
- **TanStack Form** - Headless form state management
- **Zod** - Schema validation (already in use)
- **Formedible** - Schema-driven form generation for shadcn + TanStack Form

### Why This Stack

| Aspect | Old (antd + form-render) | New (shadcn + TanStack Form) |
|--------|--------------------------|------------------------------|
| React 19 | ❌ form-render broken | ✅ Native support |
| Bundle size | Large (antd is heavy) | Smaller (tree-shakeable) |
| Customization | Theme tokens | Full control (copy-paste) |
| Schema format | Custom JSON schema | Zod (type-safe, standard) |
| Maintenance | Semi-abandoned | Actively maintained |

---

## Research: Alternatives Evaluated

### Schema-Driven Form Libraries

| Library | React 19 | Auto-generate | Notes |
|---------|----------|---------------|-------|
| **@autoform/react** | ✅ | ✅ | Uses react-hook-form |
| **@autoform/shadcn** | ❌ (React 18 max) | ✅ | Needs update |
| **@tanstack/react-form** | ✅ | ❌ (headless) | Manual field definitions |
| **Formedible** | ✅ | ✅ | TanStack + shadcn, via CLI |
| **ProComponents SchemaForm** | Waiting for v3 | ✅ | antd ecosystem |

### Formedible (Chosen)

- **Install**: `npx shadcn@latest add formedible.dev/r/use-formedible.json`
- **Copy-paste model** - you own the code
- **24 field types** built-in
- **Custom widgets** - override any field
- **TanStack Form** under the hood
- **Zod validation**

Key features:
- Multi-page forms with pagination
- Conditional field rendering
- Cross-field validation
- Form persistence (localStorage/sessionStorage)
- Real-time validation

---

## Component Mapping: antd → shadcn

| antd | shadcn/ui | Notes |
|------|-----------|-------|
| `Button` | `Button` | Direct equivalent |
| `Input` | `Input` | Direct equivalent |
| `Dropdown` | `DropdownMenu` | Direct equivalent |
| `Divider` | `Separator` | Direct equivalent |
| `Typography` | — | Use Tailwind classes |
| `Space` | — | Use Tailwind flex/gap |
| `Result` | — | Compose with Card/Alert |
| `Form` | `Form` | Uses react-hook-form |
| `ConfigProvider` + `theme` | CSS variables | Different approach |
| `theme.useToken()` | Tailwind/CSS vars | Access via `cn()` utility |

---

## Migration Plan

### Phase 1: Setup
1. Add Tailwind CSS to `packages/ui`
2. Initialize shadcn/ui (`npx shadcn@latest init`)
3. Install Formedible (`npx shadcn@latest add formedible.dev/r/use-formedible.json`)
4. Install TanStack Form and Zod dependencies

### Phase 2: Component Migration
1. Replace antd components with shadcn equivalents file by file
2. Convert `theme.useToken()` calls to Tailwind/CSS variables
3. Update styling approach

### Phase 3: Form System Migration
1. Convert plugin propPanel schema format from form-render JSON → Zod schemas
2. Update DetailView to use Formedible instead of FormRenderComponent
3. Update built-in plugins to use new schema format
4. Document new plugin API

### Phase 4: Cleanup
1. Remove antd dependency
2. Remove form-render dependency
3. Update peer dependencies in package.json
4. Test all functionality

---

## Breaking Changes

### Plugin API Change

**Before (form-render JSON schema):**
```typescript
propPanel: {
  schema: {
    fontSize: {
      title: 'Font Size',
      type: 'number',
      widget: 'inputNumber',
      props: { min: 1, max: 100 },
    }
  }
}
```

**After (Zod schema):**
```typescript
import { z } from 'zod';

propPanel: {
  schema: z.object({
    fontSize: z.number().min(1).max(100).describe('Font Size'),
  }),
  // Optional: custom field config
  fieldConfig: {
    fontSize: { fieldType: 'number' }
  }
}
```

This is a breaking change to the plugin interface. Existing custom plugins will need to be updated.

---

## References

- [shadcn/ui](https://ui.shadcn.com/)
- [TanStack Form](https://tanstack.com/form)
- [Formedible](https://formedible.dev)
- [form-render issues](https://github.com/alibaba/x-render/issues)
- [antd 6 release](https://github.com/ant-design/ant-design/issues/55804)
