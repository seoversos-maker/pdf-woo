## Exploration: PDF Catalog v1 Integration

### Current State
We have a beautiful React + Tailwind v4 prototype in `src/App.tsx` that uses a rigid 12x10 CSS Grid layout. The data is hardcoded. The project is a Vite-based React app.

### Affected Areas
- `package.json` — Add `@react-pdf/renderer` and WooCommerce API client.
- `src/App.tsx` — Transform from a web view to a PDF generator entry point.
- `src/components/CatalogDocument.tsx` (new) — Main PDF document structure.
- `src/components/layouts/` (new) — Individual PDF layout components (Asymmetric, Minimal, Technical).
- `src/lib/woocommerce.ts` (new) — Data fetching logic.

### Approaches
1. **Direct Translation (Flexbox emulating Grid)** — Map the 12x10 grid areas to nested Flexbox views with fixed percentage widths and heights.
   - Pros: Preserves the "editorial" look exactly as in the prototype.
   - Cons: Slightly higher complexity in `@react-pdf` styling (no native grid).
   - Effort: Medium

2. **Simplified Block Layout** — Use standard top-down/left-right layouts that are easier for PDFs.
   - Pros: Fast implementation, less prone to pagination glitches.
   - Cons: Loses the "Rich Aesthetics" of the prototype.
   - Effort: Low

### Recommendation
**Approach 1** is the only way to go. The user was very clear about the "Visual Excellence" and the specific layout types. We should use `@react-pdf/renderer`'s `StyleSheet` to create a robust set of percentage-based utility "cells".

### Risks
- **Image Loading**: `@react-pdf` can be slow or fail if image URLs are unstable or too large.
- **Pagination**: If a product's details are too long, they might bleed across pages if not handled with `wrap={false}`.
- **Font Availability**: We must ensure the Bodoni and Hanken fonts are registered from local files or stable URLs.

### Ready for Proposal
Yes. The path is clear: setup the PDF infrastructure, create the fetching layer, and port the prototype layouts.
