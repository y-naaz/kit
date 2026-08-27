---
"@yasmee_ogo/kit": patch
---

Move `type-decoder` from devDependencies to dependencies. The generated decoder code imports it at runtime, so consumers installing the package never got it, causing a "Could not resolve 'type-decoder'" bundling error.
