<script lang="ts">
  import type { ProductCardProps } from '../types';

  let {
    product,
    imageSize = 'md',
    orientation = 'vertical',
    showDescription = true,
    classes = '',
    titleClass = '',
    priceClass = '',
    descriptionClass = '',
    onSelect
  }: ProductCardProps = $props();

  const sizePresets: Record<'sm' | 'md' | 'lg', number> = {
    sm: 120,
    md: 200,
    lg: 320
  };

  const imageDimension = $derived(
    typeof imageSize === 'number' ? imageSize : sizePresets[imageSize]
  );

  const primaryImage = $derived(product.images?.at(0));

  const formattedPrice = $derived(
    typeof product.currency === 'string' && product.currency.length > 0
      ? `${product.currency} ${product.price}`
      : `${product.price}`
  );
</script>

<button
  class="product-card {classes}"
  class:product-card--horizontal={orientation === 'horizontal'}
  type="button"
  onclick={() => onSelect?.(product)}
>
  {#if typeof primaryImage === 'object'}
    <img
      class="product-card__image"
      src={primaryImage.url}
      alt={primaryImage.alt ?? product.title}
      style:width="{imageDimension}px"
      style:height="{imageDimension}px"
    />
  {/if}

  <div class="product-card__body">
    <p class="product-card__title {titleClass}">{product.title}</p>
    <p class="product-card__price {priceClass}">{formattedPrice}</p>
    {#if showDescription && typeof product.description === 'string' && product.description.length > 0}
      <p class="product-card__description {descriptionClass}">{product.description}</p>
    {/if}
  </div>
</button>

<style>
  .product-card {
    display: flex;
    flex-direction: column;
    gap: var(--card-gap, 0.5rem);
    padding: var(--card-padding, 1rem);
    border-radius: var(--card-radius, 0.5rem);
    border: 1px solid var(--card-border-color, #e2e2e2);
    background: var(--card-background, #fff);
    text-align: left;
    cursor: pointer;
    font: inherit;
    color: inherit;
  }

  .product-card--horizontal {
    flex-direction: row;
    align-items: flex-start;
    width: var(--card-width, fit-content);
  }

  .product-card--horizontal .product-card__image {
    flex-shrink: 0;
  }

  .product-card--horizontal .product-card__body {
    flex: 1;
    min-width: 0;
  }

  .product-card__image {
    object-fit: cover;
    border-radius: var(--card-image-radius, 0.375rem);
  }

  .product-card__title {
    margin: 0;
    font-weight: 600;
  }

  .product-card__price {
    margin: 0;
    color: var(--card-price-color, #111);
  }

  .product-card__description {
    margin: 0;
    color: var(--card-description-color, #666);
    font-size: 0.875rem;
  }
</style>
