# Tasks: PDF Catalog v1 Integration

## Phase 1: Foundation & Data
- [x] 1.1 Install `@react-pdf/renderer` and `dotenv`.
- [x] 1.2 Create `src/lib/woocommerce.ts` with `fetchProducts` and `Product` interface.
- [x] 1.3 Add `WC_CONSUMER_KEY` and `WC_CONSUMER_SECRET` to `.env.local`.

## Phase 2: PDF Core & Styles
- [x] 2.1 Create `src/components/CatalogDocument.tsx` with font registration (Bodoni Moda, Hanken Grotesk).
- [x] 2.2 Implement `StyleSheet` in `CatalogDocument.tsx` with editorial color tokens.

## Phase 3: Editorial Layouts
- [x] 3.1 Implement `Asymmetric.tsx` using Flexbox (60/40 split).
- [x] 3.2 Implement `Minimal.tsx` with centered layout and Serif variant.
- [x] 3.3 Implement `Technical.tsx` with colored details background and right-aligned image.

## Phase 4: Integration & UI
- [x] 4.1 Implement cyclical logic (`index % 3`) and category grouping in `CatalogDocument.tsx`.
- [x] 4.2 Create `src/components/PDFPreview.tsx` using `PDFDownloadLink`.
- [x] 4.3 Update `src/App.tsx` to handle loading/error states and show `PDFPreview`.

## Phase 5: Verification
- [x] 5.1 Verify that products are grouped correctly by category in the PDF.
- [x] 5.2 Validate that layouts 0, 1, and 2 repeat in the correct order.
- [x] 5.3 Confirm images load correctly and don't overflow page boundaries.
