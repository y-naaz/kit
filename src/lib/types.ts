import type { Product } from '$generated/types';

export type ImageSize = 'sm' | 'md' | 'lg' | number;

export type CardOrientation = 'vertical' | 'horizontal';

/**
 * The integration point for a data source.
 *
 * Kit renders products; it does not fetch or reshape them. Implement this to
 * teach it about your platform — by hand, or with `createProductAdapter`.
 *
 * `toProduct` returns `null` when a source object cannot be mapped, so callers
 * can drop it rather than render a broken card. `toProducts` drops them for you.
 */
export type ProductAdapter = {
  toProduct: (source: unknown) => Product | null;
  toProducts: (source: unknown) => Product[];
};

export type ProductCardProps = {
  product: Product;
  imageSize?: ImageSize;
  orientation?: CardOrientation;
  showDescription?: boolean;
  classes?: string;
  titleClass?: string;
  priceClass?: string;
  descriptionClass?: string;
  onSelect?: (product: Product) => void;
};
