# Proposal: PDF Catalog v1 Integration

## Intent
Transform the existing web-based editorial prototype into a functional PDF generator that consumes live data from a WooCommerce store. This solves the need for high-quality, printable/distributable product catalogs without manual design effort.

## Scope

### In Scope
- Integration of `@react-pdf/renderer` for PDF generation.
- Connection to WooCommerce REST API using Fetch/SWR.
- Implementation of three cyclical layouts (Asymmetric, Minimal, Technical) as seen in the prototype.
- Automatic pagination with category-based grouping and colors.
- Basic "Download PDF" UI in the browser.

### Out of Scope
- Advanced filtering (for now, we fetch a fixed number of published products).
- Custom font uploading via UI (fonts will be hardcoded).
- User authentication/login (assumes internal use or public catalog).

## Capabilities

### New Capabilities
- `pdf-generator`: Handles the orchestration of `@react-pdf` Document, Page, and View components.
- `woocommerce-connector`: Logic to fetch products, handle pagination, and map WC fields to internal types.
- `editorial-layouts`: Three distinct UI components implementing the modulo-3 design strategy.

### Modified Capabilities
- None (First version).

## Approach
We will port the prototype's CSS Grid-based designs to `@react-pdf`'s Flexbox-only system using percentage widths for columns. We will implement a `useWooCommerce` hook for data fetching and a `CatalogDocument` component that maps the fetched product array into the cyclical layouts.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `package.json` | Modified | Add `@react-pdf/renderer` and related deps. |
| `src/App.tsx` | Modified | Replace prototype with Catalog UI. |
| `src/components/` | New | PDF and Layout components. |
| `src/lib/` | New | WooCommerce API client. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| PDF Image Overload | Medium | Use optimized thumbnails (medium_large) from WooCommerce. |
| Layout breakage on PDF | Low | Use fixed aspect ratio containers (`wrap={false}`). |
| Font registration fails | Low | Load fonts from local `assets/` folder. |

## Rollback Plan
Revert to the prototype version of `src/App.tsx` and uninstall new dependencies.

## Dependencies
- WooCommerce Store URL and API Keys.
- `@react-pdf/renderer`.

## Success Criteria
- [ ] User can click "Download" and receive a PDF.
- [ ] PDF contains at least 20 products grouped by category.
- [ ] PDF preserves the 3 cyclical layout patterns from the prototype.
- [ ] Images are rendered correctly with high quality.
