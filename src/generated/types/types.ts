import { isJSON, decodeString, decodeArray, decodeBoolean } from 'type-decoder';

/**
 * @type { ProductImage }
 * @description A single product image
 */
export type ProductImage = {
  /**
   * @description Image URL
   * @type { string }
   * @memberof ProductImage
   */
  url: string;
  /**
   * @description Image alt text
   * @type { string }
   * @memberof ProductImage
   */
  alt: string | null;
};

export function decodeProductImage(rawInput: unknown): ProductImage | null {
  if (isJSON(rawInput)) {
    const decodedUrl = decodeString(rawInput['url']);
    const decodedAlt = decodeString(rawInput['alt']);

    if (decodedUrl === null) {
      return null;
    }

    return {
      url: decodedUrl,
      alt: decodedAlt
    };
  }
  return null;
}

/**
 * @type { ProductVariant }
 * @description A purchasable variant of a product
 */
export type ProductVariant = {
  /**
   * @description Variant identifier
   * @type { string }
   * @memberof ProductVariant
   */
  id: string;
  /**
   * @description Variant title, e.g. size or color
   * @type { string }
   * @memberof ProductVariant
   */
  title: string | null;
  /**
   * @description Variant price
   * @type { string }
   * @memberof ProductVariant
   */
  price: string;
  /**
   * @description Variant SKU
   * @type { string }
   * @memberof ProductVariant
   */
  sku: string | null;
};

export function decodeProductVariant(rawInput: unknown): ProductVariant | null {
  if (isJSON(rawInput)) {
    const decodedId = decodeString(rawInput['id']);
    const decodedTitle = decodeString(rawInput['title']);
    const decodedPrice = decodeString(rawInput['price']);
    const decodedSku = decodeString(rawInput['sku']);

    if (decodedId === null || decodedPrice === null) {
      return null;
    }

    return {
      id: decodedId,
      title: decodedTitle,
      price: decodedPrice,
      sku: decodedSku
    };
  }
  return null;
}

/**
 * @type { Product }
 * @description Generic, platform-agnostic product shape. Consumers map their own data (Shopify, WooCommerce, custom backend, etc.) into this shape before passing it to ProductCard.
 */
export type Product = {
  /**
   * @description Product identifier
   * @type { string }
   * @memberof Product
   */
  id: string;
  /**
   * @description Product title
   * @type { string }
   * @memberof Product
   */
  title: string;
  /**
   * @description Product description
   * @type { string }
   * @memberof Product
   */
  description: string | null;
  /**
   * @description Product images
   * @type { ProductImage[] }
   * @memberof Product
   */
  images: ProductImage[] | null;
  /**
   * @description Product price
   * @type { string }
   * @memberof Product
   */
  price: string | null;
  /**
   * @description ISO currency code, e.g. USD
   * @type { string }
   * @memberof Product
   */
  currency: string | null;
  /**
   * @description Whether the product is available for sale
   * @type { boolean }
   * @memberof Product
   */
  availability: boolean | null;
  /**
   * @description Product SKU
   * @type { string }
   * @memberof Product
   */
  sku: string | null;
  /**
   * @description Product vendor/brand
   * @type { string }
   * @memberof Product
   */
  vendor: string | null;
  /**
   * @description Purchasable variants of this product
   * @type { ProductVariant[] }
   * @memberof Product
   */
  variants: ProductVariant[] | null;
};

export function decodeProduct(rawInput: unknown): Product | null {
  if (isJSON(rawInput)) {
    const decodedId = decodeString(rawInput['id']);
    const decodedTitle = decodeString(rawInput['title']);
    const decodedDescription = decodeString(rawInput['description']);
    const decodedImages = decodeArray(rawInput['images'], decodeProductImage);
    const decodedPrice = decodeString(rawInput['price']);
    const decodedCurrency = decodeString(rawInput['currency']);
    const decodedAvailability = decodeBoolean(rawInput['availability']);
    const decodedSku = decodeString(rawInput['sku']);
    const decodedVendor = decodeString(rawInput['vendor']);
    const decodedVariants = decodeArray(rawInput['variants'], decodeProductVariant);

    if (decodedId === null || decodedTitle === null) {
      return null;
    }

    return {
      id: decodedId,
      title: decodedTitle,
      description: decodedDescription,
      images: decodedImages,
      price: decodedPrice,
      currency: decodedCurrency,
      availability: decodedAvailability,
      sku: decodedSku,
      vendor: decodedVendor,
      variants: decodedVariants
    };
  }
  return null;
}
