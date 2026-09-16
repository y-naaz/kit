<script lang="ts">
  import { ProductCard, createProductAdapter, select } from '$lib';
  import type { Product } from '$generated/types';

  const swatch = (a: string, b: string, label: string) =>
    'data:image/svg+xml,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">` +
        `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
        `<stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/>` +
        `</linearGradient></defs><rect width="400" height="400" fill="url(#g)"/>` +
        `<text x="200" y="215" font-family="system-ui,sans-serif" font-size="34" font-weight="600" ` +
        `fill="rgba(255,255,255,.92)" text-anchor="middle">${label}</text></svg>`
    );

  const product = (
    id: string,
    title: string,
    price: string | null,
    description: string | null,
    image: string | null
  ): Product => ({
    id,
    title,
    description,
    images: image === null ? null : [{ url: image, alt: title }],
    price,
    currency: price === null ? null : 'USD',
    availability: null,
    sku: null,
    vendor: null,
    variants: null
  });

  const catalogue: Product[] = [
    product(
      '1',
      'Classic Tee',
      '24.99',
      'Soft combed cotton, cut for everyday wear.',
      swatch('#6366f1', '#8b5cf6', 'Tee')
    ),
    product(
      '2',
      'Canvas Tote',
      '18.00',
      'Heavyweight canvas with reinforced handles.',
      swatch('#0ea5e9', '#06b6d4', 'Tote')
    ),
    product(
      '3',
      'Enamel Mug',
      '12.50',
      'Speckled enamel, 350ml, dishwasher safe.',
      swatch('#f59e0b', '#ef4444', 'Mug')
    ),
    product(
      '4',
      'Wool Beanie',
      '22.00',
      'Merino ribbed knit in a relaxed fit.',
      swatch('#10b981', '#14b8a6', 'Beanie')
    )
  ];

  const edgeCases: { label: string; note: string; product: Product }[] = [
    {
      label: 'No price',
      note: 'Draft and unpriced items render without a price line — not the text "null".',
      product: product(
        'e1',
        'Unreleased Jacket',
        null,
        'Launching next season.',
        swatch('#64748b', '#334155', 'Soon')
      )
    },
    {
      label: 'No image',
      note: 'images is optional; the card collapses to text only.',
      product: product('e2', 'Gift Card', '50.00', 'Delivered by email.', null)
    },
    {
      label: 'No description',
      note: 'Absent fields are skipped rather than rendered empty.',
      product: product('e3', 'Sticker Pack', '6.00', null, swatch('#ec4899', '#f43f5e', 'Pack'))
    }
  ];

  // --- Live adapter demo -------------------------------------------------
  const shopifyResponse = {
    products: {
      edges: [
        {
          node: {
            id: 'gid://shopify/Product/1',
            title: 'Classic Tee',
            description: 'Soft combed cotton.',
            priceRange: { minVariantPrice: { amount: '24.99', currencyCode: 'USD' } },
            images: {
              edges: [{ node: { url: 'https://cdn.shop/tee.jpg', altText: 'Classic Tee' } }]
            }
          }
        },
        {
          node: {
            id: 'gid://shopify/Product/2',
            title: 'Canvas Tote',
            description: 'Heavyweight canvas.',
            priceRange: { minVariantPrice: { amount: '18.00', currencyCode: 'USD' } },
            images: {
              edges: [{ node: { url: 'https://cdn.shop/tote.jpg', altText: 'Canvas Tote' } }]
            }
          }
        },
        { node: { id: 'gid://shopify/Product/3' } }
      ]
    }
  };

  const adapter = createProductAdapter({
    id: 'id',
    title: 'title',
    description: 'description',
    price: 'priceRange.minVariantPrice.amount',
    currency: 'priceRange.minVariantPrice.currencyCode',
    images: { path: 'images.edges[].node', url: 'url', alt: 'altText' }
  });

  const mapped = adapter.toProducts(select(shopifyResponse, 'products.edges[].node'));

  const rawJson = JSON.stringify(shopifyResponse, null, 2);
  const mappedJson = JSON.stringify(mapped, null, 2);

  let selected = $state<string | null>(null);
</script>

<div class="page">
  <header class="hero">
    <p class="eyebrow">@yasmee_ogo/kit</p>
    <h1>Normalize any commerce API into one product shape, then render it.</h1>
    <p class="lede">
      You fetch from Shopify, WooCommerce, or your own backend. Kit handles the two parts you keep
      rewriting: mapping that response into a consistent <code>Product</code>, and validating it at
      runtime before it reaches your UI. The <code>ProductCard</code> renders it — or ignore the card
      and use just the data layer, which has no Svelte dependency.
    </p>
    <div class="install"><code>npm install @yasmee_ogo/kit</code></div>
    <nav class="links">
      <a href="https://www.npmjs.com/package/@yasmee_ogo/kit">npm</a>
      <a href="https://github.com/y-naaz/kit">GitHub</a>
    </nav>
  </header>

  <section>
    <h2>The card</h2>
    <p class="note">
      A product grid. Click any card — <code>onSelect</code> receives the full product.
    </p>
    <div class="grid">
      {#each catalogue as item (item.id)}
        <ProductCard product={item} imageSize="md" onSelect={(p) => (selected = p.title)} />
      {/each}
    </div>
    <p class="selected" aria-live="polite">
      {selected === null ? 'Nothing selected yet.' : `Selected: ${selected}`}
    </p>
  </section>

  <section>
    <h2>Horizontal orientation</h2>
    <p class="note">
      <code>orientation="horizontal"</code> puts the image beside the details. Width comes from
      <code>--card-width</code>.
    </p>
    <div class="stack">
      {#each catalogue.slice(0, 2) as item (item.id)}
        <ProductCard product={item} orientation="horizontal" imageSize="sm" />
      {/each}
    </div>
  </section>

  <section>
    <h2>Restyled with CSS custom properties</h2>
    <p class="note">
      Identical markup and props. Every visual change below comes from CSS variables — no forking,
      no overrides, no <code>!important</code>.
    </p>
    <div class="grid themed">
      {#each catalogue as item (item.id)}
        <ProductCard product={item} imageSize="md" />
      {/each}
    </div>
  </section>

  <section>
    <h2>Missing data degrades gracefully</h2>
    <p class="note">
      Only <code>id</code> and <code>title</code> are required. Everything else is optional and simply
      omitted when absent.
    </p>
    <div class="cases">
      {#each edgeCases as c (c.product.id)}
        <div class="case">
          <span class="tag">{c.label}</span>
          <ProductCard product={c.product} imageSize="sm" />
          <p class="note small">{c.note}</p>
        </div>
      {/each}
    </div>
  </section>

  <section>
    <h2>The adapter — what Kit is really for</h2>
    <p class="note">
      A raw Shopify Storefront response on the left, the mapped result on the right. This runs live
      on this page. Note that <code>edges[].node</code> unwrapping is a single path string, and the third
      product — which has no title — is dropped rather than rendered broken.
    </p>

    <div class="code-row">
      <div class="code-col">
        <p class="label">Raw API response</p>
        <pre>{rawJson}</pre>
      </div>
      <div class="code-col">
        <p class="label">adapter.toProducts(...) — {mapped.length} of 3 kept</p>
        <pre>{mappedJson}</pre>
      </div>
    </div>

    <p class="label">The mapping that did it</p>
    <pre class="wide">{`import { createProductAdapter, select } from '@yasmee_ogo/kit/adapters';

const adapter = createProductAdapter({
  id: 'id',
  title: 'title',
  price: 'priceRange.minVariantPrice.amount',
  currency: 'priceRange.minVariantPrice.currencyCode',
  images: { path: 'images.edges[].node', url: 'url', alt: 'altText' }
});

const products = adapter.toProducts(select(data, 'products.edges[].node'));`}</pre>
  </section>

  <footer>
    <p>
      MIT licensed · <a href="https://github.com/y-naaz/kit">github.com/y-naaz/kit</a> ·
      <a href="https://www.npmjs.com/package/@yasmee_ogo/kit">npmjs.com/package/@yasmee_ogo/kit</a>
    </p>
  </footer>
</div>

<style>
  :global(body) {
    margin: 0;
    background: #fbfbfd;
    color: #18181b;
    font-family:
      system-ui,
      -apple-system,
      'Segoe UI',
      sans-serif;
    line-height: 1.6;
  }

  .page {
    max-width: 1080px;
    margin: 0 auto;
    padding: 4rem 1.5rem 6rem;
  }

  .hero {
    padding-bottom: 3rem;
    border-bottom: 1px solid #e4e4e7;
  }

  .eyebrow {
    margin: 0 0 0.75rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.875rem;
    color: #6366f1;
  }

  h1 {
    margin: 0 0 1rem;
    font-size: clamp(1.75rem, 4vw, 2.75rem);
    line-height: 1.15;
    letter-spacing: -0.02em;
  }

  .lede {
    margin: 0 0 1.75rem;
    max-width: 68ch;
    font-size: 1.0625rem;
    color: #52525b;
  }

  .install {
    display: inline-block;
    padding: 0.625rem 1rem;
    border-radius: 0.5rem;
    background: #18181b;
    color: #fafafa;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.9375rem;
  }

  .links {
    margin-top: 1.25rem;
    display: flex;
    gap: 1.25rem;
  }

  a {
    color: #4f46e5;
  }

  section {
    padding: 3rem 0;
    border-bottom: 1px solid #e4e4e7;
  }

  h2 {
    margin: 0 0 0.5rem;
    font-size: 1.375rem;
    letter-spacing: -0.01em;
  }

  .note {
    margin: 0 0 1.75rem;
    max-width: 68ch;
    color: #52525b;
  }

  .note.small {
    margin: 0.75rem 0 0;
    font-size: 0.875rem;
  }

  code {
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    background: #f4f4f5;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.875em;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.25rem;
  }

  .stack {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 480px;
  }

  .selected {
    margin: 1.25rem 0 0;
    font-size: 0.9375rem;
    color: #6366f1;
  }

  /* Every change here is a CSS custom property the component reads. */
  .themed {
    --card-background: #18181b;
    --card-border-color: #3f3f46;
    --card-radius: 1rem;
    --card-padding: 0.75rem;
    --card-gap: 0.75rem;
    --card-image-radius: 0.75rem;
    --card-price-color: #a5b4fc;
    --card-description-color: #a1a1aa;
    color: #fafafa;
  }

  .cases {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    gap: 1.5rem;
  }

  .tag {
    display: inline-block;
    margin-bottom: 0.625rem;
    padding: 0.1875rem 0.5rem;
    border-radius: 0.25rem;
    background: #eef2ff;
    color: #4338ca;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .code-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 1.25rem;
  }

  .label {
    margin: 0 0 0.5rem;
    font-size: 0.8125rem;
    font-weight: 600;
    color: #52525b;
  }

  .code-col .label {
    margin-top: 0;
  }

  pre {
    margin: 0;
    padding: 1rem;
    max-height: 340px;
    overflow: auto;
    border-radius: 0.625rem;
    background: #18181b;
    color: #e4e4e7;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.8125rem;
    line-height: 1.55;
  }

  pre.wide {
    max-height: none;
  }

  .code-row + .label {
    margin-top: 1.75rem;
  }

  footer {
    padding-top: 2.5rem;
    font-size: 0.9375rem;
    color: #71717a;
  }
</style>
