import type { Product, ProductImage, ProductVariant } from '$generated/types';
import type { ProductAdapter } from '../types';

/**
 * A way of reading one field out of an arbitrary source object: either a path
 * string understood by `select`, or a function for anything a path cannot
 * express (concatenation, unit conversion, lookups).
 */
export type Selector<T> = string | ((source: unknown) => T | null | undefined);

export type ImageMapping = {
  /** Path to the list of images. Omit when the source has no images. */
  path?: string;
  url: Selector<string>;
  alt?: Selector<string>;
};

export type VariantMapping = {
  /** Path to the list of variants. Omit when the source has no variants. */
  path?: string;
  id: Selector<string>;
  price: Selector<string | number>;
  title?: Selector<string>;
  sku?: Selector<string>;
};

/** Describes how one platform's product shape maps onto Kit's `Product`. */
export type ProductMapping = {
  id: Selector<string | number>;
  title: Selector<string>;
  price?: Selector<string | number>;
  description?: Selector<string>;
  currency?: Selector<string>;
  availability?: Selector<boolean>;
  sku?: Selector<string>;
  vendor?: Selector<string>;
  images?: ImageMapping;
  variants?: VariantMapping;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Reads a value out of a nested structure by path.
 *
 * Segments are dot-separated. A numeric segment indexes into an array, and a
 * `[]` suffix flattens the array at that segment — which is what makes
 * connection shapes readable:
 *
 * ```ts
 * select(data, 'products.edges[].node');      // unwrap a GraphQL connection
 * select(product, 'variants.0.price');        // first variant's price
 * select(product, 'images[].src');            // every image's src
 * ```
 *
 * Returns `null` rather than throwing when any segment is missing.
 */
export function select(source: unknown, path: string): unknown {
  const segments = path.split('.').filter((segment) => segment.length > 0);

  let current: unknown = source;

  for (const segment of segments) {
    const flatten = segment.endsWith('[]');
    const key = flatten ? segment.slice(0, -2) : segment;

    if (key.length > 0) {
      if (Array.isArray(current)) {
        const index = Number.parseInt(key, 10);

        // A named key against an array reads that key from every entry.
        current = Number.isNaN(index)
          ? current.map((entry) => (isRecord(entry) ? entry[key] : null))
          : current.at(index);
      } else if (isRecord(current)) {
        current = current[key];
      } else {
        return null;
      }
    }

    if (flatten) {
      current = Array.isArray(current) ? current.flat() : [];
    }

    if (typeof current === 'undefined' || current === null) {
      return null;
    }
  }

  return current;
}

function read<T>(source: unknown, selector: Selector<T> | undefined): unknown {
  if (typeof selector === 'function') {
    return selector(source);
  }

  if (typeof selector === 'string') {
    return select(source, selector);
  }

  return null;
}

/** Coerces to a non-empty string. Numbers are stringified; everything else is `null`. */
function asText(value: unknown): string | null {
  if (typeof value === 'string') {
    return value.length > 0 ? value : null;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }

  return null;
}

function asList(value: unknown): unknown[] {
  if (Array.isArray(value)) {
    return value.filter((entry) => typeof entry !== 'undefined' && entry !== null);
  }

  return typeof value === 'undefined' || value === null ? [] : [value];
}

function mapImages(source: unknown, mapping: ImageMapping | undefined): ProductImage[] {
  if (typeof mapping !== 'object') {
    return [];
  }

  const entries =
    typeof mapping.path === 'string' ? asList(select(source, mapping.path)) : asList(source);

  const images: ProductImage[] = [];

  for (const entry of entries) {
    const url = asText(read(entry, mapping.url));

    if (url !== null && !images.some((image) => image.url === url)) {
      images.push({ url, alt: asText(read(entry, mapping.alt)) });
    }
  }

  return images;
}

function mapVariants(source: unknown, mapping: VariantMapping | undefined): ProductVariant[] {
  if (typeof mapping !== 'object') {
    return [];
  }

  const entries =
    typeof mapping.path === 'string' ? asList(select(source, mapping.path)) : asList(source);

  const variants: ProductVariant[] = [];

  for (const entry of entries) {
    const id = asText(read(entry, mapping.id));
    const price = asText(read(entry, mapping.price));

    if (id !== null && price !== null) {
      variants.push({
        id,
        title: asText(read(entry, mapping.title)),
        price,
        sku: asText(read(entry, mapping.sku))
      });
    }
  }

  return variants;
}

/**
 * Builds a `ProductAdapter` from a declarative field mapping.
 *
 * This is a convenience over implementing `ProductAdapter` by hand — use it
 * when a mapping is mostly field-for-field, and write the adapter yourself
 * when it is not. Kit ships no platform-specific adapters, so its release
 * cadence is never tied to an API it does not control.
 *
 * ```ts
 * const adapter = createProductAdapter({
 *   id: 'id',
 *   title: 'title',
 *   price: 'priceRange.minVariantPrice.amount',
 *   currency: 'priceRange.minVariantPrice.currencyCode',
 *   images: { path: 'images.edges[].node', url: 'url', alt: 'altText' }
 * });
 *
 * const products = adapter.toProducts(select(data, 'products.edges[].node'));
 * ```
 *
 * Prices are passed through as text and never reinterpreted — if your source
 * stores minor units, convert them in a selector function.
 */
export function createProductAdapter(mapping: ProductMapping): ProductAdapter {
  function toProduct(source: unknown): Product | null {
    if (typeof source === 'undefined' || source === null) {
      return null;
    }

    const id = asText(read(source, mapping.id));
    const title = asText(read(source, mapping.title));

    if (id === null || title === null) {
      return null;
    }

    const variants = mapVariants(source, mapping.variants);
    const price = asText(read(source, mapping.price)) ?? variants.at(0)?.price ?? null;
    const availability = read(source, mapping.availability);

    return {
      id,
      title,
      description: asText(read(source, mapping.description)),
      images: mapImages(source, mapping.images),
      price,
      currency: asText(read(source, mapping.currency)),
      availability: typeof availability === 'boolean' ? availability : null,
      sku: asText(read(source, mapping.sku)) ?? variants.at(0)?.sku ?? null,
      vendor: asText(read(source, mapping.vendor)),
      variants: variants.length > 0 ? variants : null
    };
  }

  return {
    toProduct,
    toProducts: (source: unknown): Product[] =>
      asList(source)
        .map(toProduct)
        .filter((product): product is Product => product !== null)
  };
}
