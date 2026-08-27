# @yasmee_ogo/kit

## 0.1.2

### Patch Changes

- 9a89537: Move `type-decoder` from devDependencies to dependencies. The generated decoder code imports it at runtime, so consumers installing the package never got it, causing a "Could not resolve 'type-decoder'" bundling error.

## 0.1.1

### Patch Changes

- 51c671d: Fix broken relative import path for generated types in the published package. Consumers previously hit "Module not found: Can't resolve '../generated/types'" when bundling.
