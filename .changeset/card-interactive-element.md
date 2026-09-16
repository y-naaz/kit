---
'@yasmee_ogo/kit': minor
---

`ProductCard` only renders a `<button>` when `onSelect` is supplied.

Previously every card rendered as `<button type="button">` with `cursor: pointer`, whether or not it did anything when activated. A presentational card was therefore keyboard-focusable and announced to screen readers as a button, then did nothing on activation — misleading for exactly the users who rely on that signal.

Cards without `onSelect` now render as a `<div>`, with no tab stop, no button role, and no pointer cursor. Cards with `onSelect` are unchanged. Both keep the `product-card` class and every existing modifier, so class-based styling and all CSS custom properties are unaffected; only styling that targets the `button` element directly needs updating to `.product-card`.

Also point the README's preview image at an absolute URL. The relative `docs/` path did not resolve on npmjs.com, because `files` publishes only the built package — so the listing page rendered a broken image. Adds a link to the new demo site at https://y-naaz.github.io/kit/.
