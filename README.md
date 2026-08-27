# Kit

A framework-neutral-data, Svelte-rendered `ProductCard` component.

## What?

Kit provides:

- **`ProductCard`**: a Svelte 5 component that renders a product (image,
  title, price, description) from a plain, normalized `Product` object.
- **Generic `Product` type**: platform-agnostic — not shaped after any one
  backend. Generated from a YAML spec, with runtime decoders included.
- **Prop/CSS-variable driven customization**: consumers configure the card
  via props (`imageSize`, `showDescription`, etc.) and CSS custom properties
  (`--card-radius`, `--card-gap`, etc.) without forking the source.

## Why?

Anyone fetching product data (Shopify, WooCommerce, a custom backend, etc.)
needs a way to display it without hand-rolling a card component per project.
Kit owns the presentation layer only — you own fetching and mapping your
platform's data into the `Product` shape.

## Architecture

### Core Components

- **`ProductCard`** (`src/lib/ui/product-card.svelte`): the exported card
  component.
- **`Product` / `ProductImage` / `ProductVariant`**: generated from
  `schema/product.yaml` via [type-crafter](https://github.com/sinha-sahil/type-crafter)
  into `src/generated/types/`, including runtime decoders
  (`decodeProduct`, etc.) for validating untrusted input.

### Tech Stack

- **Frontend**: Svelte 5 (runes) with TypeScript
- **Build Tool**: Vite / `@sveltejs/package`
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
git clone <repository-url>
cd kit
pnpm install
```

### Development

```bash
pnpm dev      # start the demo app (src/App.svelte) against the live component
```

### Building

```bash
pnpm build    # build the demo app (verification only)
pnpm package  # build the publishable package into ./package
```

## Usage

```bash
npm install @yasmee_ogo/kit
```

```svelte
<script lang="ts">
  import { ProductCard } from '@yasmee_ogo/kit';
  import type { Product } from '@yasmee_ogo/kit';

  const product: Product = {
    id: '1',
    title: 'Classic Tee',
    description: 'A comfortable, everyday cotton t-shirt.',
    images: [{ url: 'https://cdn.example.com/tee.jpg', alt: 'Classic Tee' }],
    price: '24.99',
    currency: 'USD',
    availability: true,
    sku: null,
    vendor: null,
    variants: null
  };
</script>

<ProductCard {product} imageSize="lg" onSelect={(p) => console.log('selected', p)} />
```

### Mapping platform data

`Product` is intentionally generic — it isn't a 1:1 mirror of Shopify,
WooCommerce, or any single platform. Map your platform's response into this
shape before passing it to `ProductCard`. See `docs/PLAN.md` for a
field-by-field comparison against Shopify's Storefront API, schema.org, and
WooCommerce.

### Styling

Override via CSS custom properties on `ProductCard`, e.g.:

```css
:global(.product-card) {
  --card-radius: 12px;
  --card-gap: 0.75rem;
  --card-price-color: #0a7d34;
}
```

## Types

Regenerate types after editing `schema/product.yaml`:

```bash
pnpm run generate:types
```

This runs `type-crafter generate typescript-with-decoders`, then lints and
formats the output in `src/generated/types/`. The generated `.ts` files are
committed; only `.d.ts` build output is gitignored.

## Development Scripts

| Script                  | Description                              |
| ------------------------ | ----------------------------------------- |
| `pnpm dev`               | Start Vite dev server with the demo app   |
| `pnpm build`             | Build the demo app                        |
| `pnpm package`           | Build the publishable package             |
| `pnpm check`             | Run TypeScript and Svelte checks          |
| `pnpm lint`              | Run ESLint                                |
| `pnpm format`            | Run Prettier                              |
| `pnpm run generate:types`| Regenerate types from `schema/product.yaml` |

## Releasing

Versioning and publishing to npm are handled by [Changesets](https://github.com/changesets/changesets),
run manually (there's no CI/automated release workflow currently):

1. Run `pnpm changeset` and describe your change — this writes a markdown file under
   `.changeset/`. Commit it alongside your code changes.
2. Run `pnpm version` (= `changeset version`) to bump `package.json` and update `CHANGELOG.md`
   based on pending changesets. Commit the result.
3. Run `pnpm release` (= `pnpm package && changeset publish`) to build the package and publish
   the new version to npm as `@yasmee_ogo/kit`.

Publishing requires you to be logged in locally via `npm login` under an account with publish
access to the `@yasmee_ogo` scope.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `pnpm check` and `pnpm lint` to validate
5. Submit a pull request

## License

MIT
