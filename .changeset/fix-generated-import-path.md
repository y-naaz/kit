---
"@yasmee_ogo/kit": patch
---

Fix broken relative import path for generated types in the published package. Consumers previously hit "Module not found: Can't resolve '../generated/types'" when bundling.
