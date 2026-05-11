# Design: PDF Catalog v1 Integration

## Technical Approach
We will implement a React-based PDF generation pipeline that transforms WooCommerce product data into an editorial-style catalog. The system will use a `CatalogDocument` component as the root of the PDF, which will iterate through categorized products and apply one of three layout components (`Asymmetric`, `Minimal`, `Technical`) based on a cyclical index.

## Architecture Decisions

### Decision: Flexbox for Editorial Layouts
**Choice**: Use nested Flexbox `View` components with percentage-based widths.
**Alternatives considered**: Absolute positioning.
**Rationale**: Flexbox is more maintainable and handles content overflow better than absolute positioning, especially for text items that might wrap.

### Decision: Server-side vs. Client-side Fetching
**Choice**: Client-side fetching with WooCommerce REST API for the MVP.
**Alternatives considered**: Next.js Server Components.
**Rationale**: Since the prototype is a Vite app (pure client-side), we'll stick to client-side fetching for now to maintain speed, but we'll isolate the fetching logic in a way that can be moved to the server later.

### Decision: Font Strategy
**Choice**: Register fonts from stable URLs (Google Fonts raw files).
**Alternatives considered**: Bundling fonts in the `public/` folder.
**Rationale**: Easier for a prototype to use remote URLs, but we'll include the configuration to switch to local files easily.

## Data Flow

    WC API ──→ fetchProducts() ──→ Product Normalizer ──→ PDF Renderer
                                          │                   │
                                          └─→ Category Grouping ┘

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/lib/woocommerce.ts` | Create | WC API client and product normalization. |
| `src/components/CatalogDocument.tsx` | Create | Main Document component for @react-pdf. |
| `src/components/layouts/Asymmetric.tsx` | Create | Layout Type 0 implementation. |
| `src/components/layouts/Minimal.tsx` | Create | Layout Type 1 implementation. |
| `src/components/layouts/Technical.tsx` | Create | Layout Type 2 implementation. |
| `src/components/PDFPreview.tsx` | Create | Browser component to trigger download and show status. |
| `src/App.tsx` | Modify | Entry point to trigger the flow. |

## Interfaces / Contracts

```typescript
interface Product {
  id: number;
  name: string;
  price: string;
  sku: string;
  imageUrl: string;
  category: string;
}

interface CategoryGroup {
  name: string;
  products: Product[];
  color: string;
}
```

## Testing Strategy
| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Product Normalizer | Test mapping from WC JSON to Product interface. |
| Integration | WC Connector | Mock fetch and verify published product filter. |
| Visual | Layouts | Manual review of generated PDF against prototype screenshot. |

## Migration / Rollout
No migration required. This is a new feature replacing hardcoded data.

## Open Questions
- [ ] Do we need a custom "Intro/Cover" page? (Deferred for v1.1).
- [ ] How to handle more than 100 products (API pagination)? (Current plan: fetch one page of 100).
