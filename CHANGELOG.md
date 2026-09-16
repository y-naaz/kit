# @yasmee_ogo/kit

## 0.5.0

### Minor Changes

- Publish the data layer on its own entry points, so mapping and validation no longer require Svelte-aware tooling.
  
  `exports` previously declared only `"."`. Because the root entry re-exports `ProductCard`, importing anything from the package pulled in a `.svelte` file — so `import { createProductAdapter } from '@yasmee_ogo/kit'` failed in plain Node with `ERR_UNKNOWN_FILE_EXTENSION`, and there was no subpath to reach the adapter directly. The mapping helpers and the generated decoders were effectively unusable outside a Svelte app, including from a test runner.
  
  Two subpaths now expose them, both plain ESM with no `.svelte` in their import graph:
  
  - `@yasmee_ogo/kit/adapters` — `createProductAdapter`, `select`, and the mapping types
  - `@yasmee_ogo/kit/types` — `Product`, `ProductImage`, `ProductVariant`, and the `decodeProduct` family
  
  `./package.json` is exported as well, for tooling that reads it. The root entry is unchanged and still exports everything.
- c8ca16e: `Product.images` and `Product.price` are now optional (only `id` and `title` are required). `ProductCard` renders without a price line when `price` is absent instead of showing "undefined", and `createProductAdapter` no longer drops products that have no price.

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
