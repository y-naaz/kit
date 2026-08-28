---
"@yasmee_ogo/kit": minor
---

`Product.images` and `Product.price` are now optional (only `id` and `title` are required). `ProductCard` renders without a price line when `price` is absent instead of showing "undefined", and `createProductAdapter` no longer drops products that have no price.
