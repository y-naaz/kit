# @yasmee_ogo/kit

## 0.4.0

### Minor Changes

- Add a `ProductAdapter` integration point, following the adapter pattern used in the org's other Svelte packages: a plain object contract the consumer implements, exported from the package root rather than a subpath.
  
  `createProductAdapter` builds one from a declarative field mapping for the common field-for-field case, and `select` reads nested values by path (including `[]` to flatten a level, which unwraps GraphQL connections). Kit ships no platform-specific adapters, so its release cadence is not tied to APIs it does not control.
  
  Also replace the packaging step's `sed` chain with `scripts/fix-package-imports.mjs`, which resolves import specifiers per file instead of by pattern. The old approach could not express paths from nested directories and would have emitted a broken `../../generated/types` import.

### Patch Changes

- Declare `engines` (Node >= 18, pnpm >= 9) so the existing `engine-strict=true` in `.npmrc` has something to enforce. Export the `CardOrientation` type, which was added but never re-exported from the package entry point. Add a `commit-msg` hook so the existing commitlint config is actually enforced.

## 0.3.0

### Minor Changes

- Bring `ProductCard` in line with the shared code guidelines, and add a `classes` prop.
  
  - `classes` attaches custom classes to the card element itself, matching the convention used across the other Svelte packages. The existing `titleClass` / `priceClass` / `descriptionClass` props are unchanged.
  - Replace truthy coercion with explicit `typeof` narrowing for `currency`, `description`, and the primary image.
  - Use `Array.prototype.at()` for the primary-image lookup instead of bracket indexing.
  - Horizontal cards default `--card-width` to `fit-content` rather than `auto`.

## 0.2.0

### Minor Changes

- Add an `orientation` prop to `ProductCard`. `'vertical'` (the default) keeps the existing stacked layout unchanged; `'horizontal'` places the image beside the details. Horizontal cards read their width from a new `--card-width` custom property, defaulting to `auto`.

## 0.1.3

### Patch Changes

- Strip TypeScript from published Svelte components. `vitePreprocess()` was not transforming `<script>` blocks, so `product-card.svelte` shipped with `import type` and type annotations intact, breaking consumers without a TS-aware Svelte preprocessor. The packaging step now also rewrites relative import extensions in `.svelte` files and removes the leftover `lang="ts"` attribute.

## 0.1.2

### Patch Changes

- 9a89537: Move `type-decoder` from devDependencies to dependencies. The generated decoder code imports it at runtime, so consumers installing the package never got it, causing a "Could not resolve 'type-decoder'" bundling error.

## 0.1.1

### Patch Changes

- 51c671d: Fix broken relative import path for generated types in the published package. Consumers previously hit "Module not found: Can't resolve '../generated/types'" when bundling.
