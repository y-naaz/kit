# Product Card Library — Plan

## Status: scaffolded

The repo is scaffolded and building/linting/type-checking cleanly. What's
below reflects what's actually implemented, not just proposed.

## Use case
A standalone, reusable **Product Card** component library built in **Svelte**.
Anyone who fetches product data from somewhere (Shopify, a custom backend, a
CMS, etc.) can import this package into their own Svelte app, pass in their
product data, and customize the presentation (image size, text, layout) via
props — without forking or editing the internal source.

## Scope boundaries
- **This repo owns:** rendering/presentation of a product (image, title,
  price, description) and the props/config surface for customizing it.
- **This repo does not own:** fetching data from Shopify or any other source,
  auth, caching, or state management. Consumers fetch their own data and pass
  it in as a normalized object.

## Tech decisions (confirmed)
- Framework: **Svelte 5** (runes mode), component library, not a full app.
- Customization model: **props/config driven** — import the component,
  pass props like `imageSize`, `product`, etc. Source is not meant to be
  copy-pasted/forked.
- Data fetching: **out of scope** — component expects a normalized product
  object as input.
- Type definitions: **YAML is the source of truth**. `schema/product.yaml`
  defines `Product`, `ProductImage`, `ProductVariant`; TypeScript types +
  runtime decoders are generated from it via **type-crafter**
  ([github.com/sinha-sahil/type-crafter](https://github.com/sinha-sahil/type-crafter)) —
  the tool referred to earlier as "SourceCrafter" — into
  `src/lib/generated/types/` (gitignored, regenerated via
  `pnpm run generate:types`).
- Coding style/tooling: matches the conventions used in this org's other
  Svelte packages (`BZ/forklift`, `BZ/kavach`, `BZ/nimble`) — pnpm, ESLint
  flat config + `typescript-eslint` + `eslint-plugin-svelte`, Prettier
  (single quotes, no trailing commas, printWidth 100), kebab-case component
  filenames under `src/lib/ui/`, `$lib`/`$generated` path aliases, a
  `type-crafter` codegen step, and a husky `pre-commit` hook that runs
  check → generate:types → format → lint → build.

## Repo structure (actual)
```
kit/
├── package.json
├── vite.config.ts
├── svelte.config.js
├── tsconfig.json
├── eslint.config.js
├── .prettierrc / .prettierignore
├── .editorconfig
├── .npmrc
├── commitlint.config.cjs
├── .husky/
│   └── pre-commit
├── schema/
│   └── product.yaml               # source-of-truth type spec (type-crafter format)
├── src/
│   ├── lib/
│   │   ├── ui/
│   │   │   └── product-card.svelte # main exported component
│   │   ├── generated/               # gitignored — output of `pnpm run generate:types`
│   │   │   └── types/
│   │   ├── types.ts                 # ProductCardProps (hand-written, wraps generated Product)
│   │   └── index.ts                 # public exports
│   └── demo/                        # local dev/demo app (not published)
│       ├── App.svelte
│       └── main.ts
├── index.html
└── docs/
    └── PLAN.md
```

## Component API (actual)

### `Product` type — defined in `schema/product.yaml`

Designed as a **generic, platform-agnostic** shape (not a 1:1 mirror of any
one platform), informed by comparing Shopify's Storefront API `Product`
object, schema.org's `Product`/`Offer` types, and WooCommerce's product REST
fields:

| Field         | Shopify           | schema.org           | WooCommerce         |
|---------------|--------------------|-----------------------|----------------------|
| id            | `id` / `handle`    | —                     | `id`                 |
| title         | `title`            | `name`                | `name`               |
| description   | `description`      | `description`         | `description`        |
| images        | `images`/`featuredImage` | `image`          | `images`             |
| price/currency| `priceRange`, variant `price` | `offers.price`/`priceCurrency` | `price` |
| availability  | `availableForSale` | `offers.availability` | `stock_status`       |
| sku / vendor  | variant `sku`, `vendor` | `sku`, `brand`   | `sku`                |
| variants      | `variants[]`        | —                     | `variations[]`       |

`schema/product.yaml` (type-crafter spec format — `info` + `types`, objects
use `properties`/`required`, nullability is controlled solely by omission
from `required`):

```yaml
info:
  version: '0.1.0'
  title: 'Kit Product Card Types Specification'

types:
  ProductImage:
    type: object
    required: [url]
    properties:
      url: { type: string }
      alt: { type: string }

  ProductVariant:
    type: object
    required: [id, price]
    properties:
      id: { type: string }
      title: { type: string }
      price: { type: string }
      sku: { type: string }

  Product:
    type: object
    required: [id, title, images, price]
    properties:
      id: { type: string }
      title: { type: string }
      description: { type: string }
      images: { type: array, items: { $ref: '#/types/ProductImage' } }
      price: { type: string }
      currency: { type: string }
      availability: { type: boolean }
      sku: { type: string }
      vendor: { type: string }
      variants: { type: array, items: { $ref: '#/types/ProductVariant' } }
```

Run `pnpm run generate:types` to (re)generate
`src/lib/generated/types/types.ts` (types + `decodeProduct`/etc. runtime
decoders), then lint/format it automatically.

Consumers fetching from Shopify, WooCommerce, or elsewhere are expected to
map their platform's response into this shape before passing it to
`ProductCard` — mapping is the consumer's responsibility, not this repo's.

### `ProductCard` props (`src/lib/types.ts`)
| Prop           | Type                        | Default   | Purpose                        |
|----------------|-----------------------------|-----------|---------------------------------|
| `product`      | `Product`                   | required  | The product data to render      |
| `imageSize`    | `'sm' \| 'md' \| 'lg' \| number` | `'md'` | Controls image dimensions       |
| `showDescription` | `boolean`                | `true`    | Toggle description text         |
| `titleClass` / `priceClass` / `descriptionClass` | `string` | — | Escape hatches for custom CSS classes |
| `onSelect`     | `(product: Product) => void` | —        | Click handler for the card      |

Styling approach: sensible defaults via scoped CSS + CSS custom properties
(e.g. `--card-radius`, `--card-gap`) so consumers can override via CSS
variables in addition to prop-level overrides.

## Build/publish (actual)
- `pnpm run dev` — run the demo app (`src/demo`) against the live component.
- `pnpm run build` — build the demo app (verification only).
- `pnpm run package` — `svelte-package` output into `package/` (this is what
  would actually get published, per the `files`/`exports` fields in
  `package.json`).
- `pnpm run check` / `pnpm run lint` / `pnpm run format` — verified clean.

## Open questions for later (not blocking)
- Publish target: private npm registry vs. public npm vs. just git-installable?
- Versioning/changelog process (e.g. changesets)?
- Do we need multiple card variants (grid card, list row, compact) from day one,
  or just one card to start?
- Component tests (e.g. `vitest` + `@testing-library/svelte`) — not yet added.
