<script lang="ts">
  import { ProductCard } from '$lib';
  import type { Product } from '$generated/types';

  const products: Product[] = [
    {
      id: '1',
      title: 'Classic Tee',
      description: 'A comfortable, everyday cotton t-shirt.',
      images: [{ url: 'https://placehold.co/400x400', alt: 'Classic Tee' }],
      price: '24.99',
      currency: 'USD',
      availability: null,
      sku: null,
      vendor: null,
      variants: null
    },
    {
      id: '2',
      title: 'Canvas Tote Bag',
      description: 'Durable canvas tote, perfect for groceries or the beach.',
      images: [{ url: 'https://placehold.co/400x400', alt: 'Canvas Tote Bag' }],
      price: '18',
      currency: 'USD',
      availability: null,
      sku: null,
      vendor: null,
      variants: null
    }
  ];
</script>

<main style="display: flex; gap: 1rem; padding: 2rem;">
  {#each products as product (product.id)}
    <ProductCard {product} imageSize="lg" onSelect={(p) => console.log('selected', p)} />
  {/each}
</main>
