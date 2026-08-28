export { default as ProductCard } from './ui/product-card.svelte';

export { createProductAdapter, select } from './adapters';

export type { ProductCardProps, ImageSize, CardOrientation, ProductAdapter } from './types';

export type { ProductMapping, ImageMapping, VariantMapping, Selector } from './adapters';
export * from '$generated/types';
