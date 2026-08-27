import type { Product } from '$generated/types';

export type ImageSize = 'sm' | 'md' | 'lg' | number;

export type ProductCardProps = {
  product: Product;
  imageSize?: ImageSize;
  showDescription?: boolean;
  titleClass?: string;
  priceClass?: string;
  descriptionClass?: string;
  onSelect?: (product: Product) => void;
};
