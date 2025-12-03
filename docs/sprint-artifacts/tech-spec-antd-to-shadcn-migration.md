# Tech-Spec: Migrate @pdfme/ui from antd + form-render to shadcn + TanStack Form + Formedible

**Created:** 2025-12-03
**Status:** VALIDATED
**Author:** Barry (Quick Flow Solo Dev)
**Validated:** Context7 + Web Search (2025-12-03)

## Overview

### Problem Statement

The `@pdfme/ui` package is stuck on React 18 because `form-render` (used for the Designer's property panel) is semi-abandoned and doesn't support React 19 or antd 6. This blocks the entire monorepo from upgrading to React 19.

### Solution

Replace antd + form-render with shadcn/ui + TanStack Form + Formedible:
- **shadcn/ui** - Copy-paste component library with Tailwind CSS
- **TanStack Form** - Type-safe form state management
- **Formedible** - Schema-driven form generation for shadcn (Zod-based)

### Scope

**In Scope:**
- Remove all antd imports from `packages/ui` (24 files)
- Replace form-render with Formedible in `DetailView/index.tsx`
- Convert `theme.useToken()` calls (19 files) to Tailwind CSS variables
- Update plugin `propPanel.schema` format from JSON Schema to Zod
- Recreate custom widgets (AlignWidget, ButtonGroupWidget) with shadcn

**Out of Scope:**
- Changes to other packages (generator, schemas logic, common types)
- External plugin API documentation (internal fork)
- Performance optimization beyond parity

## Context for Development

### Codebase Patterns

**Current theming pattern:**
```typescript
// 19 files use this pattern
import { theme } from 'antd';
const { token } = theme.useToken();
// Then use token.colorPrimary, token.colorBorder, etc.
```

**Target theming pattern:**
```typescript
// Use Tailwind CSS variables via cn() utility
import { cn } from '@/lib/utils';
<div className={cn("bg-background text-foreground border-border")} />
```

**Current form-render pattern (DetailView/index.tsx):**
```typescript
import { useForm } from 'form-render';
import FormRenderComponent from 'form-render';

const form = useForm();
<FormRenderComponent
  form={form}
  schema={propPanelSchema}  // JSON Schema format
  widgets={widgets}
  watch={{ '#': handleWatch }}
/>
```

**Target Formedible pattern:**
```typescript
import { useForm } from '@tanstack/react-form';
import { AutoForm } from '@/components/ui/autoform';

<AutoForm
  schema={zodSchema}
  onSubmit={handleSubmit}
  fieldConfig={fieldConfig}
/>
```

### Files to Reference

**Primary migration target:**
- `packages/ui/src/components/Designer/RightSidebar/DetailView/index.tsx` - form-render usage

**antd theming files (19 files):**
- `packages/ui/src/components/*.tsx` - various components
- `packages/ui/src/components/Designer/**/*.tsx` - designer components

**Custom widgets to recreate:**
- `packages/ui/src/components/Designer/RightSidebar/DetailView/AlignWidget.tsx`
- `packages/ui/src/components/Designer/RightSidebar/DetailView/ButtonGroupWidget.tsx`

**Plugin propPanel definitions (16 files in schemas):**
- `packages/schemas/src/text/propPanel.ts`
- `packages/schemas/src/tables/propPanel.ts`
- `packages/schemas/src/multiVariableText/propPanel.ts`
- And 13 more schema files with propPanel definitions

### Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Component library | shadcn/ui | Copy-paste model, Tailwind-based, tree-shakeable |
| Form library | TanStack Form | Type-safe, framework agnostic, active maintenance |
| Schema forms | Formedible | Zod-native, shadcn-compatible, copy-paste |
| Styling | Tailwind CSS | Already used in playground, consistent with shadcn |
| Schema format | Zod | Already used in @pdfme/common for validation |

## Implementation Plan

### Phase 1: Setup and Infrastructure

#### Task 1.1: Install shadcn/ui and dependencies
```bash
cd packages/ui
pnpm add tailwindcss postcss autoprefixer class-variance-authority clsx tailwind-merge
pnpm add @tanstack/react-form zod @hookform/resolvers
pnpm dlx shadcn@latest init
```

#### Task 1.2: Configure Tailwind CSS
- Create `tailwind.config.ts` in packages/ui
- Add CSS variables for theming (map antd tokens to CSS vars)
- Create `cn()` utility function

#### Task 1.3: Add base shadcn components
```bash
pnpm dlx shadcn@latest add button input select dropdown-menu separator typography
```

#### Task 1.4: Install Formedible
- Copy Formedible components from formedible.dev
- Configure for Zod schema support
- Set up AutoForm component

### Phase 2: Component Migration (antd → shadcn)

#### Task 2.1: Create component mapping utilities
Create adapter file `packages/ui/src/lib/shadcn-adapters.ts`:

| antd Component | shadcn Equivalent |
|----------------|-------------------|
| Button | Button |
| Input | Input |
| Typography.Text | span with cn() |
| Divider | Separator |
| Dropdown | DropdownMenu |
| Space.Compact | div with flex |
| ConfigProvider | ThemeProvider (CSS vars) |
| Result | Custom ErrorCard |

#### Task 2.2: Migrate simple components (8 files)
Files using only Button/Typography:
- `Spinner.tsx`
- `ErrorScreen.tsx`
- `UnitPager.tsx`
- `CtlBar.tsx`
- `PluginIcon.tsx`
- `LeftSidebar.tsx`
- `RightSidebar/index.tsx`
- `RightSidebar/layout.tsx`

#### Task 2.3: Migrate canvas components (5 files)
- `Canvas/index.tsx`
- `Canvas/Mask.tsx`
- `Canvas/Moveable.tsx`
- `Canvas/Padding.tsx`
- `Canvas/Selecto.tsx`

#### Task 2.4: Migrate ListView components (4 files)
- `ListView/index.tsx`
- `ListView/Item.tsx`
- `ListView/SelectableSortableContainer.tsx`
- `ListView/SelectableSortableItem.tsx`

#### Task 2.5: Migrate remaining components (3 files)
- `Preview.tsx`
- `Renderer.tsx`
- `AppContextProvider.tsx`

### Phase 3: Form System Migration (form-render → Formedible)

#### Task 3.1: Create Zod schema builders
Create `packages/ui/src/lib/prop-panel-schema.ts`:
- Base schema fields (type, name, position, width, height, rotate, opacity)
- Schema composition utilities
- Validation rules mapping

#### Task 3.2: Recreate AlignWidget
- Convert to shadcn Button + ToggleGroup
- Preserve alignment/distribution logic
- Use Lucide icons (already in use)

#### Task 3.3: Recreate ButtonGroupWidget
- Convert to shadcn ToggleGroup
- Preserve toggle state logic
- Map button configs to Zod enum

#### Task 3.4: Create WidgetRenderer adapter
- Bridge between Formedible and plugin widgets
- Support plugin-defined custom widgets
- Pass theme/i18n context

#### Task 3.5: Migrate DetailView/index.tsx
- Replace form-render with Formedible AutoForm
- Convert propPanelSchema to Zod
- Wire up watch/onChange handlers
- Preserve validation logic

### Phase 4: Plugin propPanel Migration

#### Task 4.1: Update PropPanel types in @pdfme/common
```typescript
// Before (form-render JSON Schema)
interface PropPanel<T> {
  schema: Record<string, PropPanelSchema> | ((props) => Record<string, PropPanelSchema>);
  widgets?: Record<string, WidgetFn>;
  defaultSchema: T;
}

// After (Zod)
interface PropPanel<T> {
  schema: z.ZodObject<any> | ((props) => z.ZodObject<any>);
  fieldConfig?: FieldConfig;
  defaultSchema: T;
}
```

#### Task 4.2: Migrate built-in schema propPanels (16 files)
Convert each to Zod format:
- `text/propPanel.ts`
- `tables/propPanel.ts`
- `multiVariableText/propPanel.ts`
- `barcodes/index.ts`
- `checkbox/index.ts`
- `radioGroup/index.ts`
- `select/index.ts`
- `date/helper.ts`
- `shapes/line.ts`
- `shapes/rectAndEllipse.ts`
- `graphics/image.ts`
- `graphics/svg.ts`

### Phase 5: Cleanup and Testing

#### Task 5.1: Remove antd dependencies
```bash
cd packages/ui
pnpm remove antd @ant-design/icons form-render
```

#### Task 5.2: Update package.json peer dependencies
- Remove antd from peerDependencies
- Add tailwindcss to peerDependencies (or bundle)

#### Task 5.3: Update tests
- Fix broken imports in test files
- Update snapshot tests
- Add new tests for shadcn components

#### Task 5.4: Update playground
- Ensure playground builds with new UI package
- Manual testing of all Designer features
- Verify form filling works

#### Task 5.5: Run full test suite
```bash
pnpm run test
pnpm run build
cd playground && pnpm run test
```

## Acceptance Criteria

### Functional Requirements
- [ ] Designer renders and functions identically to current version
- [ ] All field types can be added, configured, and positioned
- [ ] Property panel shows correct fields for each schema type
- [ ] Alignment/distribution tools work correctly
- [ ] Form filling mode works correctly
- [ ] Viewer mode works correctly

### Technical Requirements
- [ ] No antd imports remain in packages/ui
- [ ] No form-render imports remain
- [ ] All 24 migrated files use shadcn components
- [ ] Tailwind CSS configured and working
- [ ] Bundle size reduced (antd removed)
- [ ] React 19 compatible

### Testing Requirements
- [ ] All existing tests pass
- [ ] E2E playground tests pass
- [ ] Manual testing of Designer complete
- [ ] No console errors or warnings

## Dependencies

### External Libraries to Add
- `tailwindcss` ^4.x
- `@tanstack/react-form` ^1.x
- `zod` (already in common)
- `class-variance-authority`
- `clsx`
- `tailwind-merge`
- shadcn/ui components (copied, not installed)
- Formedible (copied, not installed)

### External Libraries to Remove
- `antd`
- `@ant-design/icons`
- `form-render`

## Testing Strategy

### Unit Tests
- Component rendering tests for new shadcn components
- Form validation tests for Zod schemas
- Widget behavior tests

### Integration Tests
- Designer workflow tests
- Property panel interaction tests
- Form filling tests

### E2E Tests (Playwright)
- Existing playground tests should pass
- Add tests for new form behavior if needed

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Formedible doesn't support all form-render features | High | Evaluate during Task 3.1, fall back to custom implementation |
| Plugin widget compatibility | Medium | Create adapter layer in Task 3.4 |
| Styling parity with antd | Low | Use design tokens, iterate on visual QA |
| Bundle size increase | Low | shadcn is tree-shakeable, likely net decrease |

## Notes

### Why Formedible over alternatives?
- Native Zod support (already using Zod in common)
- Copy-paste model (no dependency to maintain)
- Built specifically for shadcn/ui
- Active development

### Plugin API Change
The `propPanel.schema` format change from JSON Schema to Zod is a **breaking change** for external plugins. Since this is an internal fork, this is acceptable. Document the new format for internal developers.

### Rollback Plan
If migration fails:
1. Keep a `pre-migration` branch
2. Migration is additive until final antd removal
3. Can revert by restoring antd imports

---

## Validation Results (2025-12-03)

### Library Compatibility Verified

| Library | Status | Source |
|---------|--------|--------|
| shadcn/ui + TanStack Form | **OFFICIAL SUPPORT** | [shadcn docs](https://ui.shadcn.com/docs/forms/tanstack-form) |
| TanStack Form + Zod | **Native Support** | [TanStack docs](https://tanstack.com/form) |
| Formedible | **Active (2025)** | [formedible.dev](https://formedible.dev) |
| shadcn-tanstack-form | **Alternative option** | [GitHub](https://github.com/felipestanzani/shadcn-tanstack-form) |

### Key Findings

1. **shadcn/ui has OFFICIAL TanStack Form integration** - This is now a first-class citizen in shadcn, not a third-party hack. Includes `<Field />`, `<FieldLabel />`, `<FieldError />`, `<FieldDescription />` components.

2. **TanStack Form v1 has native Zod support** - No adapter needed. Pass Zod schemas directly to `validators.onChange`:
   ```typescript
   const form = useForm({
     validators: { onChange: zodSchema }
   })
   ```

3. **Two valid approaches for schema-driven forms:**
   - **Option A: Formedible** - Full AutoForm generation from Zod schema (more magic, less control)
   - **Option B: shadcn Field components** - Manual field composition with Zod validation (more control, more code)

   **Recommendation:** Start with Formedible for property panel, fall back to manual Field components if customization needs exceed Formedible's capabilities.

4. **Installation simplified:**
   ```bash
   # Official shadcn TanStack Form support
   pnpm dlx shadcn@latest add https://ui.shadcn.com/r/tanstack-form.json

   # OR Formedible
   pnpm dlx shadcn@latest add formedible.dev/r/use-formedible.json
   ```

### Risk Assessment Update

| Original Risk | Updated Assessment |
|---------------|-------------------|
| Formedible doesn't support all features | **MITIGATED** - Can fall back to official shadcn Field components |
| Plugin widget compatibility | **MEDIUM** - Custom widgets still need adapter |
| Styling parity | **LOW** - shadcn theming is well-documented |

### Sources

- [TanStack Form - shadcn/ui](https://ui.shadcn.com/docs/forms/tanstack-form)
- [Formedible GitHub](https://github.com/DimitriGilbert/Formedible)
- [shadcn-tanstack-form](https://github.com/felipestanzani/shadcn-tanstack-form)
- [TanStack Form Zod Integration](https://tanstack.com/form/latest/docs/framework/react/guides/validation)

---

**Spec Status: APPROVED FOR IMPLEMENTATION**

Recommended execution: Fresh context with `*quick-dev` pointing to this spec file.
