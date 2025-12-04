# Dependency Audit Report

**Commit:** e2eab922 - fix: downgrade to React 18 + antd 5.x for form-render compatibility
**Date:** 2025-12-03
**Auditor:** Claude Code
**Purpose:** Document every change from previous commit, compare to upstream/main, and get approval/rejection/modification for each decision.

---

## Table of Contents

1. [package.json (root)](#1-packagejson-root)
2. [packages/common/package.json](#2-packagescommonpackagejson)
3. [packages/common/set-version.js](#3-packagescommonset-versionjs)
4. [packages/schemas/package.json](#4-packagesschemaspackagejson)
5. [packages/ui/package.json](#5-packagesuipackagejson)
6. [packages/ui/vite.config.mts](#6-packagesuiviteconfigmts)
7. [playground/package.json](#7-playgroundpackagejson)
8. [website/package.json](#8-websitepackagejson)
9. [Summary Table](#summary-table)
10. [Open Questions](#open-questions)

---

## 1. `package.json` (root)

### Our Change
```diff
   "scripts": {
     "lint": "oxlint --type-aware",
     "prettier": "pnpm -r run prettier"
   },
+  "pnpm": {
+    "overrides": {
+      "react": "^18.3.1",
+      "react-dom": "^18.3.1",
+      "@types/react": "^18.3.18",
+      "@types/react-dom": "^18.3.5"
+    }
+  },
   "devDependencies": {
```

### Upstream/main
```json
// No pnpm section - uses npm workspaces
"workspaces": [
  "packages/common",
  "packages/pdf-lib",
  ...
]
```

### Reason (Original Claim - INCORRECT)
~~Force all packages and transitive dependencies to use React 18 types. Without this, `zustand` (used by `form-render`) pulls in `@types/react@19.x` which conflicts with our React 18 components.~~

### Actual Finding
The original error was caused by React 19 being declared in package.json files while antd 5.x is typed for React 18. Once we fixed the package.json versions to React 18, the overrides became unnecessary.

### Validation Test (2025-12-03)
```bash
# Removed pnpm overrides from package.json
# Clean install + full build
rm -rf node_modules packages/*/node_modules pnpm-lock.yaml
pnpm install
pnpm run build
# Result: SUCCESS - build passes without overrides
```

### Why This Differs From Upstream
- **It doesn't need to** - overrides are unnecessary
- The real fix was consistent React 18 versions in all package.json files

### Risk Assessment
- **No risk**: Removing the overrides simplifies our config

### Decision
- [x] ~~Approve~~
- [x] Reject - **REMOVE THIS WORKAROUND**
- [ ] Modify

### Feedback
Tested and confirmed unnecessary. The overrides were added based on incorrect assumption about zustand pulling React 19 types. The actual issue was React 19 declared in our own package.json files.

---

## 2. `packages/common/package.json`

### Our Change
```diff
   "peerDependencies": {
-    "antd": "^6.0.1",
+    "antd": "^5.29.1",
     "form-render": "^2.5.6"
   },
```

### Upstream/main
```json
"peerDependencies": {
  "antd": "^5.11.2",
  "form-render": "^2.2.20"
}
```

### Reason
form-render's package.json explicitly declares:
```json
"peerDependencies": {
  "antd": "4.x || 5.x"
}
```
It does NOT support antd 6.x. The esm3 branch we merged had upgraded to antd 6.0.1, which is incompatible.

### Why This Differs From Upstream
- **It doesn't** - upstream uses antd 5.x
- The esm3 branch we merged from had experimental antd 6.x
- Our change brings us back in line with upstream/main

### Risk Assessment
- **No risk**: We're aligning with upstream
- antd 5.29.1 is the latest 5.x version

### Decision
- [ ] Approve
- [ ] Reject
- [ ] Modify

### Feedback
_Space for notes/walkback_

---

## 3. `packages/common/set-version.js`

### Our Change
```diff
 try {
-  const gitTag = execSync('git describe --tags $(git rev-list --tags --max-count=1)', { encoding: 'utf8' }).trim();
+  // Get the latest tag in a cross-platform way (Windows doesn't support $())
+  const latestTagCommit = execSync('git rev-list --tags --max-count=1', { encoding: 'utf8' }).trim();
+  const gitTag = latestTagCommit
+    ? execSync(`git describe --tags ${latestTagCommit}`, { encoding: 'utf8' }).trim()
+    : 'x.x.x';
   updateVersion(gitTag);
```

### Upstream/main
```js
const gitTag = execSync('git describe --tags $(git rev-list --tags --max-count=1)', { encoding: 'utf8' }).trim();
```

### Reason
`$(...)` is bash subshell syntax. Windows cmd.exe and PowerShell do not support it. The script fails on Windows with:
```
'$' is not recognized as an internal or external command
```
Our change splits into two separate execSync calls that work on all platforms.

### Why This Differs From Upstream
- Upstream developers use Linux/Mac
- Upstream CI runs on Linux
- We develop on Windows

### Risk Assessment
- **Low risk**: Functionally identical on Linux/Mac
- **Additive change**: Works on more platforms, doesn't break existing
- **Could contribute upstream**: This would be a welcome PR to pdfme

### Decision
- [ ] Approve
- [ ] Reject
- [ ] Modify

### Feedback
_Space for notes/walkback_

---

## 4. `packages/schemas/package.json`

### Our Change
```diff
   "devDependencies": {
-    "@types/react": "^19.2.7",
-    "antd": "^6.0.1",
+    "@types/react": "^18.3.18",
+    "antd": "^5.29.1",
     ...
-    "react": "^19.2.0"
+    "react": "^18.3.1"
   },
```

### Upstream/main
```json
"devDependencies": {
  "@types/react": "^18.2.0",  // React 18 types
  "antd": "^5.27.4",          // antd 5.x
  "react": "^16.14.0"         // React 16 (!)
}
```

### Reason
Match React 18 / antd 5.x across all packages for consistency with form-render requirements.

### Why This Differs From Upstream
- Upstream uses even older React (16.14.0) in schemas
- Our React 18.3.1 is more modern than upstream
- antd 5.29.1 vs upstream 5.27.4 - minor version difference

### Risk Assessment
- **Low risk**: React 18 is stable
- **Slightly newer than upstream**: But within same major versions

### Decision
- [ ] Approve
- [ ] Reject
- [ ] Modify

### Feedback
_Space for notes/walkback_

---

## 5. `packages/ui/package.json`

### Our Change
```diff
   "dependencies": {
-    "antd": "^6.0.1",
+    "antd": "^5.29.1",
+    "buffer": "^6.0.3",
     ...
-    "react": "^19.2.0",
-    "react-dom": "^19.2.0",
+    "react": "^18.3.1",
+    "react-dom": "^18.3.1",
   },
   "devDependencies": {
-    "@types/react": "^19.2.7",
-    "@types/react-dom": "^19.2.3",
+    "@types/react": "^18.3.18",
+    "@types/react-dom": "^18.3.5",
   },
```

### Upstream/main
```json
"dependencies": {
  "antd": "^5.27.4",
  "react": "^16.14.0",
  "react-dom": "^16.14.0"
  // NO buffer dependency
}
```

### Reason
1. **React 18 / antd 5.x**: For form-render compatibility
2. **Added `buffer` dependency**: pnpm strict resolution cannot find buffer package otherwise. Without it, vite build fails with:
   ```
   "Buffer" is not exported by "__vite-browser-external"
   ```

### Why This Differs From Upstream
- **React/antd versions**: Close to upstream (upstream is even older)
- **`buffer` dependency is NEW**: Not in upstream. This is pnpm-specific.
  - npm resolves buffer from transitive dependencies automatically
  - pnpm requires explicit declaration

### Risk Assessment
- **Medium risk for buffer**: This is a pnpm-specific workaround
- If we switch to npm, this becomes unnecessary (but harmless)

### Decision
- [ ] Approve
- [ ] Reject
- [ ] Modify

### Feedback
_Space for notes/walkback_

---

## 6. `packages/ui/vite.config.mts`

### Our Change
```diff
 import { defineConfig } from 'vite';
 import react from '@vitejs/plugin-react';
 import tsconfigPaths from 'vite-tsconfig-paths';
 import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
+import path from 'path';
+import { fileURLToPath } from 'url';
+
+const __dirname = path.dirname(fileURLToPath(import.meta.url));

 export default defineConfig(({ mode }) => {
   return {
-    define: { 'process.env.NODE_ENV': JSON.stringify(mode) },
+    define: {
+      'process.env.NODE_ENV': JSON.stringify(mode),
+      global: 'globalThis',
+    },
     plugins: [react(), tsconfigPaths({ root: '.' }), cssInjectedByJsPlugin()],
+    resolve: {
+      alias: {
+        buffer: path.resolve(__dirname, 'node_modules/buffer/index.js'),
+      },
+    },
     build: {
       lib: {
         entry: 'src/index.ts',
-        formats: ['es'],
-        fileName: () => 'index.js',
+        name: '@pdfme/ui',
+        fileName: (format) => `index.${format}.js`,
       },
+      commonjsOptions: {
+        transformMixedEsModules: true,
+      },
     },
     optimizeDeps: {
-      include: ['react', 'react-dom', 'pdfjs-dist', 'antd'],
+      include: ['react', 'react-dom', 'pdfjs-dist', 'antd', 'buffer'],
       exclude: ['@pdfme/common', '@pdfme/schemas', '@pdfme/converter'],
+      esbuildOptions: {
+        define: {
+          global: 'globalThis',
+        },
+      },
     },
   };
 });
```

### Upstream/main
```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig(({ mode }) => {
  return {
    define: { 'process.env.NODE_ENV': JSON.stringify(mode) },
    plugins: [react(), tsconfigPaths({ root: '.' }), cssInjectedByJsPlugin()],
    build: {
      lib: {
        entry: 'src/index.ts',
        name: '@pdfme/ui',
        fileName: (format) => `index.${format}.js`,
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'pdfjs-dist', 'antd'],
      exclude: ['@pdfme/common', '@pdfme/schemas', '@pdfme/converter'],
    },
  };
});
```

### Reason for Each Change

| Change | Reason |
|--------|--------|
| `import path, fileURLToPath` | Needed to resolve buffer path |
| `__dirname` definition | ESM doesn't have `__dirname`, must derive it |
| `global: 'globalThis'` | Buffer package requires `global` object |
| `resolve.alias.buffer` | pnpm can't find buffer without explicit path |
| `name: '@pdfme/ui'` | **Matches upstream** - esm3 branch had removed this |
| `fileName: (format) =>` | **Matches upstream** - esm3 had simplified this |
| `commonjsOptions` | Handle mixed ES/CJS modules from dependencies |
| `optimizeDeps.include: buffer` | Pre-bundle buffer for vite |
| `esbuildOptions.global` | Buffer needs global in esbuild too |

### Why This Differs From Upstream
- **buffer alias, global defines, commonjsOptions**: All pnpm-specific workarounds
- **name and fileName**: Actually brought BACK to match upstream (esm3 had diverged)

### Risk Assessment
- **Medium risk**: Most changes are pnpm workarounds
- **If we switch to npm**: Can remove buffer-related changes
- **lib.name and fileName**: Low risk - matches upstream exactly

### Decision
- [ ] Approve
- [ ] Reject
- [ ] Modify

### Feedback
_Space for notes/walkback_

---

## 7. `playground/package.json`

### Our Change
```diff
   "dependencies": {
-    "react": "^19.2.0",
-    "react-dom": "^19.2.0",
+    "react": "^18.3.1",
+    "react-dom": "^18.3.1",
   },
   "devDependencies": {
-    "@types/react": "^19.2.7",
-    "@types/react-dom": "^19.2.3",
+    "@types/react": "^18.3.18",
+    "@types/react-dom": "^18.3.5",
   },
```

### Upstream/main
Playground is not in upstream workspaces - it's our local development tool.

### Reason
Consistent React 18 across all packages. Playground must match the library versions to avoid type conflicts during development.

### Why This Differs From Upstream
- Playground doesn't exist in same form in upstream
- Our change ensures development consistency

### Risk Assessment
- **No risk**: Local development tool only
- **Not published**: Won't affect end users

### Decision
- [ ] Approve
- [ ] Reject
- [ ] Modify

### Feedback
_Space for notes/walkback_

---

## 8. `website/package.json`

### Our Change
```diff
   "dependencies": {
-    "react": "^19.1.1",
-    "react-dom": "^19.1.1",
+    "react": "^18.3.1",
+    "react-dom": "^18.3.1",
   },
```

### Upstream/main
Website is not in upstream workspaces - it's for pdfme.com documentation.

### Reason
Consistent React 18 across all packages. Website uses Docusaurus which works with React 18.

### Why This Differs From Upstream
- Website doesn't exist in upstream workspaces
- Docusaurus 3.x supports both React 18 and 19

### Risk Assessment
- **No risk**: Documentation site only
- **Docusaurus compatible**: 3.x works with React 18

### Decision
- [ ] Approve
- [ ] Reject
- [ ] Modify

### Feedback
_Space for notes/walkback_

---

## Summary Table

| File | Change Type | Matches Upstream | pnpm-specific | Risk |
|------|-------------|------------------|---------------|------|
| package.json (root) | pnpm overrides | No (npm doesn't need) | **Yes** | Low |
| common/package.json | antd 6→5 | **Yes** | No | None |
| common/set-version.js | Windows fix | No (additive) | No | Low |
| schemas/package.json | React 19→18, antd 6→5 | **Yes** | No | None |
| ui/package.json | React/antd + buffer | Partial | **Yes** (buffer) | Medium |
| ui/vite.config.mts | buffer alias + globals | No | **Yes** | Medium |
| playground/package.json | React 19→18 | N/A (local) | No | None |
| website/package.json | React 19→18 | N/A (local) | No | None |

---

## Open Questions

### 1. Should we keep pnpm or switch to npm to match upstream?

**If we switch to npm:**
- Remove pnpm overrides from root package.json
- Remove buffer dependency from ui/package.json
- Simplify ui/vite.config.mts (remove buffer alias, global defines)
- Match upstream exactly

**If we keep pnpm:**
- Keep all pnpm-specific workarounds
- Document them for future maintainers
- Accept divergence from upstream

**Decision:**
- [ ] Switch to npm
- [ ] Keep pnpm
- [ ] Defer decision

**Feedback:**
_Space for notes_

---

### 2. Should we contribute the Windows fix (set-version.js) back to upstream?

The cross-platform fix is additive and doesn't break Linux/Mac. It would be a welcome contribution.

**Decision:**
- [ ] Yes, open PR to upstream
- [ ] No, keep local only
- [ ] Defer decision

**Feedback:**
_Space for notes_

---

### 3. Are the vite.config.mts buffer workarounds acceptable long-term?

These workarounds are fragile and may break with vite updates.

**Options:**
- Accept them as cost of using pnpm
- Switch to npm to eliminate them
- Find a better solution

**Decision:**
- [ ] Accept workarounds
- [ ] Find better solution
- [ ] Switch to npm

**Feedback:**
_Space for notes_

---

## Sign-off

| Role | Name | Date | Approved |
|------|------|------|----------|
| Developer | | | [ ] |
| Reviewer | | | [ ] |

---

*Report generated by Claude Code*
